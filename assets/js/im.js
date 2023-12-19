/**
 * 初始化、链接 IM 相关逻辑
*/

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
  RongIMLib.init({
    appkey,
    navi: navi || null,
    logLevel: 1
  });

  // 初始化 RTC CallLib
  initRTC();
  initCall();

  RCToast('正在链接 IM ... ☕️');
  RongIMLib.connect(token).then(res => {
    if (res.code !== RongIMLib.ErrorCode.SUCCESS) {
      RCToast(`IM 链接失败，错误码：${res.code}`);
      return;
    }

    RCCallView.connectedIM();
    RCCallView.readyToCall();
    RCDom.get('rongUserId').innerText = res.data.userId;
    RCToast(`用户 ${res.data.userId} IM 链接成功 ✌🏻`);
  });
}