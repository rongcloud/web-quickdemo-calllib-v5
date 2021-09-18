/**
 * call 主要相关逻辑
*/
const { ConversationType } = RongIMLib;
const { RCCallMediaType, RCCallErrorCode } = RCCall;
// CallSession 实例
let callSession;
// Call 呼叫类型
let callType = ConversationType.PRIVATE;
// Call 媒体类型
let mediaType = RCCallMediaType.AUDIO;

// RTC 实例
let rtcClient;
// CallLib 实例
let callClient;

/**
 * RTC 初始化
 * 在 IM 初始化后进行初始化 （具体位置：im.js）
 */
const initRTC = () => {
  const mediaServer = RCDom.get('mediaServer').value;
  rtcClient = imClient.install(window.RCRTC.installer, {
    mediaServer: mediaServer || undefined,
    timeout: 30 * 1000,
    logLevel: window.RCEngine.LogLevel.DEBUG
  });
}

/**
 * CallLib 初始化
 * 在 IM 初始化后进行初始化 （具体位置：im.js）
 */ 
const initCall = () => {
  callClient = imClient.install(window.RCCall.installer, {
    rtcClient: rtcClient,
    onSession: (session) => {
      callSession = session;
      mediaType = session.getMediaType();
      registerCallSessionEvent(callSession);
      RCToast(`收到 ${session.getCallerId()} 的通话邀请`);
      RCCallView.incomming();
    },
    onSessionClose: (session, summary) => {
      RCToast('通话已结束');
      RCCallView.end();
      removeVideoEl();
    }
  });
}

/**
 * 通话类型监听
 */
const callTypeChange = () => {
  const callTypeDom = RCDom.get('callType');
  callType = Number(callTypeDom.value);
  if (callType === ConversationType.GROUP) {
    RCDom.showBlock('paramGroupId');
    RCDom.showBlock('paramInvitedIds');
    RCDom.hide('paramPrivate');
  } else {
    RCDom.hide('paramGroupId');
    RCDom.hide('paramInvitedIds');
    RCDom.showBlock('paramPrivate');
  }
}

/**
 * 媒体类型监听
 */
const callMediaTypeChange = () => {
  const mediaTypeDom = RCDom.get('callMediaType');
  mediaType = Number(mediaTypeDom.value);
}

/**
 * CallSession 事件 
 */
const getCallSessionEvent = () => {
  return {
    onRinging: (sender) => {
      RCToast(`收到 ${sender.userId} 振铃`);
    },
    onAccept: (sender) => {
      RCToast(`${sender.userId} 已接听`);
    },
    onHungup: (sender) => {
      RCToast(`${sender.userId} 已挂断`);
      // 群组中移除相应节点
      const videoViewDom = RCDom.get('videoView');
      const videoDom = RCDom.get(`video-${sender.userId}`);
      videoDom && videoViewDom.removeChild(videoDom);
    },
    onTrackReady: (track) => {
      appendVideoEl(track)
      if (!track.isLocalTrack()) {
        RCToast('通话已建立')
        RCCallView.inTheCall()
      }
    },
    onMemberModify: (sender) => {},
    onMediaModify: (sender) => {},
    onAudioMuteChange: (muteUser) => {},
    onVideoMuteChange: (muteUser) => {}
  }
}

/**
 * callSession 事件注册
 */
const registerCallSessionEvent = (session) => {
  const events = getCallSessionEvent()
  session.registerSessionListener(events)
}

/**
 * callSession 呼叫
 */
const call = () => {
  const events = getCallSessionEvent()
  const isPrivateCall = callType === ConversationType.PRIVATE
  const params = {
    targetId: RCDom.get(`${isPrivateCall ? 'targetId' : 'groupId'}`).value,
    mediaType: mediaType,
    listener: events
  }
  if (isPrivateCall) {
    if (!RCDom.get('targetId').value) {
      RCToast('请输入对方 ID');
      return;
    }
    privateCall(params)
  } else {
    if (!RCDom.get('groupId').value) {
      RCToast('请输入群组 ID');
      return;
    }
    if (!RCDom.get('userIds').value) {
      RCToast('请输入被邀请者 ID');
      return;
    }
    groupCall(params)
  }
}

/**
 * 单呼
*/
const privateCall = (params) => {
  callClient.call(params).then(({ code, session }) => {
    if (code === RCCallErrorCode.SUCCESS) {
      registerCallSessionEvent(session)
      callSession = session
      RCCallView.outgoing()
    } else {
      RCToast(`呼叫失败，错误原因：${code}`)
    }
  })
}

/**
 * 群呼
 */
const groupCall = (params) => {
  params.userIds = (RCDom.get('userIds').value || []).split(',')
  callClient.callInGroup(params).then(({ code, session }) => {
    if (code === RCCallErrorCode.SUCCESS) {
      registerCallSessionEvent(session)
      callSession = session
      RCCallView.outgoing()
    } else {
      const reason = code === RCCallErrorCode.NOT_IN_GROUP ? '当前用户未加入群组' : code;
      RCToast(`呼叫失败，错误原因：${reason}`);
      removeVideoEl();
    }
  })
}

/**
 * 接听当前 callSession
 */
const accept = () => {
  callSession.accept().then(({ code }) => {
    if (code === RCCallErrorCode.SUCCESS) {
      RCToast('接听成功')
    } else {
      RCToast(`接听失败，错误原因：${code}`)
    }
  })
}

/**
 * 挂断当前 callSession
 */
const hungup = () => {
  callSession.hungup().then(({ code }) => {
    if (code === RCCallErrorCode.SUCCESS) {
      RCToast('挂断成功')
    } else {
      RCToast(`挂断失败，错误原因：${code}`)
    }
  })
}

/**
 * video 视图渲染
 */
const appendVideoEl = (track) => {
  const container = RCDom.get('videoView');
  if (track.isAudioTrack()) {
    const uid = track.getUserId();
    const node = document.createElement('div');
    node.setAttribute('id', `video-${uid}`);
    const videoTpl = `<span class="video-user-id">ID: ${uid}</span>
      <span class="video-media-type">${mediaType === 1 ? '音频' : ''}</span>
      <video id="${uid}"></video>`;
    node.innerHTML = videoTpl;
    node.classList = 'video-item';
    container.appendChild(node);
    track.play();
  } else {
    const videoEl = RCDom.get(track.getUserId());
    track.play(videoEl)
  }
}

/**
 * 通话结束后，清除所有 video 标签
 */
const removeVideoEl = () => {
  RCDom.get('videoView').innerHTML = '';
};