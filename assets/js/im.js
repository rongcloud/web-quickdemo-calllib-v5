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
  imClient = RongIMLib.init({
    appkey,
    navigators: navi ? [navi] : undefined,
    logLevel: 1
  });

  // 初始化 RTC CallLib
  initRTC();
  initCall();

  imClient.watch({
    // 监听 IM 连接状态变化
		status(evt) {
			console.log('connection status change:', evt.status);
		}
  });

  RCToast('正在链接 IM ... ☕️');
  imClient.connect({ token }).then((user) => {
    RCCallView.connectedIM();
    RCCallView.readyToCall();
    RCDom.get('rongUserId').innerText = user.id;
    RCToast(`用户 ${user.id} IM 链接成功 ✌🏻`);
  }).catch((error) => {
    console.log(`连接失败：${error.code}, ${error.msg}`)
    RCToast(`连接失败：${error.code}, ${error.msg}`)
  });
}