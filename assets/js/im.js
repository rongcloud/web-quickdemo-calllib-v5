/**
 * 初始化、链接 IM 相关逻辑
*/

// IM 实例
let imClient 

const connectIM = () => {
  const appkey = RCDom.get('appkey').value;
  const token = RCDom.get('token').value;
  const navi = RCDom.get('navi').value;

  if (!appkey) {
    RCToast('请输入 App Key');
    return;
  }
  if (!token) {
    RCToast('请输入 Token');
    return;
  }

  // IM 客户端初始化
  RongIMLib.RongIMClient.init(appkey, null, {
    navi: navi || null,
    logLevel: 1
  });
  imClient = RongIMLib.RongIMClient.getInstance();

  // 初始化 RTC CallLib
  initRTC();
  initCall();

  // 设置连接状态监听
  RongIMClient.onConnectionStatusChange({
    onChanged: function (status, code) {
      // status 标识当前连接状态， code 表示连接断开原因
      switch (status) {
        case RongIMLib.RCConnectionStatus.CONNECTED:
          console.log('连接成功');
          break;
        case RongIMLib.RCConnectionStatus.CONNECTING:
          console.log('正在连接');
          break;
        case RongIMLib.RCConnectionStatus.DISCONNECTED:
          console.log('断开连接, 错误码：' + code);
          break;
        case RongIMLib.RCConnectionStatus.SUSPENDED:
          // SDK 内部会重连
          console.log('连接断开，内部重连中，错误码：' + code);
          break;
      }
    }
  });
  
  // 设置消息监听
  RongIMClient.setOnReceiveMessageListener({
    // 接收到的消息
    onReceived: function (message) {
      console.info(message);
    }
  });

  RCToast('正在链接 IM ... ☕️');
  RongIMClient.connect(token, {
    onSuccess: function(userId) {
      RCCallView.connectedIM();
      RCCallView.readyToCall();
      RCDom.get('rongUserId').innerText = userId;
      RCToast(`用户 ${userId} IM 链接成功 ✌🏻`);
    },
    onTokenIncorrect: function() {
      RCToast('连接失败, 失败原因: token 无效');
    },
    onError: function(errorCode) {
      RCToast(`连接失败, 失败原因: ${errorCode}`);
    }
  });
}