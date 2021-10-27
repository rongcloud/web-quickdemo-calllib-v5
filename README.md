## 快速集成 Demo - Call 场景

## SDK 依赖 
```html
<!-- RongIMLib -->
<script src="https://cdn.ronghub.com/RongIMLib-4.5.latest.js"></script>
<!-- RTCLib v5 -->
<script src="https://cdn.ronghub.com/RCRTC-5.2.latest.js"></script>
<!-- RongCallLib -->
<script src="https://cdn.ronghub.com/RCCall-5.0.latest.js"></script>
```

## 使用说明

### 单呼

1. 开启两个 Tab 页面 A、B，分别登录 IM 
2. A 输入 B 页面用户 userId 点击呼叫
3. B 页面收到邀请后，可点击 接听或挂断
4. B 接听后通话建立，B 挂断 后通话结束

### 群呼

**群呼 邀请者与被邀请者均需要加入到 IM 的群组中，[可在融云开发者后台 - 服务管理 - API 调用 - 群组服务中](https://developer.rongcloud.cn/apitool/bj4hYt7YBcwvXteZeVi7aQ) 中，加入群组**

1. 开启三个 Tab 页面 A、B、C，分别登录 IM 
2. A 输入 群组 ID 及 被邀请者 ID
3. B、C 页面收到邀请后点击接听，通话建立

## 参数说明

### AppKey 获取

[可在融云开发者后台 - 服务管理](https://developer.rongcloud.cn/app/appService/8zkf1JD8NLF0gxOV3S0NuA)中创建一个应用，填入应用对应的 `appkey`

### Token 获取

[可在融云开发者后台 - 服务管理 - API 调用 - 获取 Token](https://developer.rongcloud.cn/apitool/bj4hYt7YBcwvXteZeVi7aQ) 中，输入 `userId`，从提交后返回的数据中取 `token` 字段值

## 私有云用户特殊配置

私有云用户需要单独配置 `navi` 地址以连接到私有云的 IM 服务

> 私有云用户需联系商务获取私有云 sdk 的 cdn 文件