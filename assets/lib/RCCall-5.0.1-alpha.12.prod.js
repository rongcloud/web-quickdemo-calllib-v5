/*
 * RCCallEngine - v5.0.1-alpha.12
 * CommitId - f5e5a46fcef855cbe9b4d8ac76c43210ed92866f
 * Sat Sep 18 2021 10:40:29 GMT+0800 (China Standard Time)
 * ©2020 RongCloud, Inc. All rights reserved.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@rongcloud/engine')) :
    typeof define === 'function' && define.amd ? define(['exports', '@rongcloud/engine'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.RCCallEngine = {}, global.RCEngine));
}(this, (function (exports, engine) { 'use strict';

    const string10to64 = (number) => {
        const chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ+/'.split('');
        const radix = chars.length + 1;
        let qutient = +number;
        const arr = [];
        do {
            const mod = qutient % radix;
            qutient = (qutient - mod) / radix;
            arr.unshift(chars[mod]);
        } while (qutient);
        return arr.join('');
    };
    const getUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    /* 获取 22 位的 UUID */
    const getUUID22 = () => {
        let uuid = getUUID();
        uuid = uuid.replace(/-/g, '') + '0';
        uuid = parseInt(uuid, 16);
        uuid = string10to64(uuid);
        if (uuid.length > 22) {
            uuid = uuid.slice(0, 22);
        }
        return uuid;
    };
    /**
     * 生成随机 id 字符串
     */
    const generateRandomId = () => {
        const random = Math.floor(Math.random() * 1000);
        let uuid = getUUID22();
        uuid = uuid.replace(/\//g, '0');
        const info = [uuid, Date.now(), random];
        return info.join('_');
    };
    const timerSetTimeout = (func, timeout) => {
        return setTimeout(func, timeout);
    };
    const eventEmitter = new engine.EventEmitter();
    const quickSort = (array, ev) => {
        const sort = (arr, left, right, ev) => {
            ev = ev || ((a, b) => {
                return a <= b;
            });
            if (left < right) {
                const x = arr[right];
                let i = left - 1;
                let temp;
                for (let j = left; j <= right; j++) {
                    if (ev(arr[j], x)) {
                        i++;
                        temp = arr[i];
                        arr[i] = arr[j];
                        arr[j] = temp;
                    }
                }
                sort(arr, left, i - 1, ev);
                sort(arr, i + 1, right, ev);
            }
            return arr;
        };
        return sort(array, 0, array.length - 1, ev);
    };

    /**
     * 注释
     * TODO
     */
    var MsgCallStatus;
    (function (MsgCallStatus) {
        MsgCallStatus[MsgCallStatus["OUTGOING"] = 1] = "OUTGOING";
        MsgCallStatus[MsgCallStatus["INCOMING"] = 2] = "INCOMING";
        MsgCallStatus[MsgCallStatus["RINGING"] = 3] = "RINGING";
        MsgCallStatus[MsgCallStatus["CONNECTED"] = 4] = "CONNECTED";
        MsgCallStatus[MsgCallStatus["IDLE"] = 5] = "IDLE";
        MsgCallStatus[MsgCallStatus["ACCEPTED"] = 6] = "ACCEPTED"; // waiting
    })(MsgCallStatus || (MsgCallStatus = {}));

    /**
     * 错误码，与移动端对齐
     * @description
     * 1. `51000 - 51999` 为 Android 专用段
     * 2. `52000 - 52999` 为 iOS 专用段
     * 3. `53000 - 53199` 为 Web RTC 专用段
     * 4. `53200 - 53499` 为 Web CallLib 专用段
     * *  `53200 - 53299` 为 Web CallEngine 专用端
     * *  `53300 - 53499` 为 Web Call 专用端
     * 5. `53500 - 53999` 为 Web 保留段
     */
    exports.RCCallErrorCode = void 0;
    (function (RCCallErrorCode) {
        /**
         * 成功
         */
        RCCallErrorCode[RCCallErrorCode["SUCCESS"] = 10000] = "SUCCESS";
        /**
         * 存在未结束的状态机
         */
        RCCallErrorCode[RCCallErrorCode["STATE_MACHINE_EXIT"] = 53200] = "STATE_MACHINE_EXIT";
        /**
         * 发送 IM 消息失败
         */
        RCCallErrorCode[RCCallErrorCode["SEND_MSG_ERROR"] = 53201] = "SEND_MSG_ERROR";
        /**
         * 被对方加入黑名单
         */
        RCCallErrorCode[RCCallErrorCode["REJECTED_BY_BLACKLIST"] = 53202] = "REJECTED_BY_BLACKLIST";
        /**
         * 当前用户不再群组中
         */
        RCCallErrorCode[RCCallErrorCode["NOT_IN_GROUP"] = 53203] = "NOT_IN_GROUP";
        /**
         * Call 相关
         */
        /**
         * 获得本地音频流失败
         */
        RCCallErrorCode[RCCallErrorCode["GET_LOCAL_AUDIO_TRACK_ERROR"] = 53301] = "GET_LOCAL_AUDIO_TRACK_ERROR";
        /**
         * 获得本地视频流失败
         */
        RCCallErrorCode[RCCallErrorCode["GET_LOCAL_VIDEO_TRACK_ERROR"] = 53302] = "GET_LOCAL_VIDEO_TRACK_ERROR";
        /**
         * 获得本地音视频流失败
         */
        RCCallErrorCode[RCCallErrorCode["GET_LOCAL_AUDIO_AND_VIDEO_TRACK_ERROR"] = 53303] = "GET_LOCAL_AUDIO_AND_VIDEO_TRACK_ERROR";
        /**
         * 加入房间失败
         */
        RCCallErrorCode[RCCallErrorCode["JOIN_ROOM_ERROR"] = 53304] = "JOIN_ROOM_ERROR";
        /**
         * 发布音频失败
         */
        RCCallErrorCode[RCCallErrorCode["AUDIO_PUBLISH_ERROR"] = 53305] = "AUDIO_PUBLISH_ERROR";
        /**
         * 发布视频失败
         */
        RCCallErrorCode[RCCallErrorCode["VIDEO_PUBLISH_ERROR"] = 53306] = "VIDEO_PUBLISH_ERROR";
        /**
         * 发布音视频失败
         */
        RCCallErrorCode[RCCallErrorCode["AUDIO_AND_VIDEO_PUBLISH_ERROR"] = 53307] = "AUDIO_AND_VIDEO_PUBLISH_ERROR";
        /**
         * 查询房间用户信息失败
         */
        RCCallErrorCode[RCCallErrorCode["QUERY_JOINED_USER_INFO_ERROR"] = 53308] = "QUERY_JOINED_USER_INFO_ERROR";
        /**
         * 禁用启用视频时，房间内缺少视频流
         */
        RCCallErrorCode[RCCallErrorCode["MISSING_VIDEO_TRACK_ERROR"] = 53309] = "MISSING_VIDEO_TRACK_ERROR";
        /**
         * 取消发布视频失败
         */
        RCCallErrorCode[RCCallErrorCode["UNPUBLISH_VIDEO_ERROR"] = 53310] = "UNPUBLISH_VIDEO_ERROR";
        /**
         * 会话不是群组
         */
        RCCallErrorCode[RCCallErrorCode["CONVERSATION_NOT_GROUP_ERROR"] = 53311] = "CONVERSATION_NOT_GROUP_ERROR";
    })(exports.RCCallErrorCode || (exports.RCCallErrorCode = {}));

    /**
     * 挂断原因
     * @description
     * 根据原有 HangupReason 设计，己方原因与对方原因有相差 10 的差距.
     * 现有本地原因取值范围: 1 ~ 10, 远端原因取值范围: 11 ~ 20.
     * 为便于 HangupReason 扩展，保留 100 以内的取值.
     * 需要再次扩展时，己方原因使用: 21 ~ 30, 对应对方原因使用: 31 ~ 40,
     * 以此类推，
     * 己方原因使用: 41 ~ 50, 对方原因使用: 51 ~ 60,
     * 己方原因使用: 61 ~ 70, 对方原因使用: 71 ~ 80,
     * 己方原因使用: 71 ~ 90, 对方原因使用: 91 ~ 100.
     *
     * 各平台独有字段范围
     * Android 201 ~ 299
     * iOS     301 ~ 399
     * Web     401 ~ 499
     * 详细文档：https://gitbook.rongcloud.net/rtc-docs/#/rtc-client/ios/analysis/calllib/HangupReason
     */
    exports.RCCallEndReason = void 0;
    (function (RCCallEndReason) {
        /**
         * 己方取消已发出的通话请求
         */
        RCCallEndReason[RCCallEndReason["CANCEL"] = 1] = "CANCEL";
        /**
         * 己方拒绝收到的通话请求
         */
        RCCallEndReason[RCCallEndReason["REJECT"] = 2] = "REJECT";
        /**
         * 己方挂断
         */
        RCCallEndReason[RCCallEndReason["HANGUP"] = 3] = "HANGUP";
        /**
         * 己方忙碌
         */
        RCCallEndReason[RCCallEndReason["BUSY_LINE"] = 4] = "BUSY_LINE";
        /**
         * 己方未接听
         */
        RCCallEndReason[RCCallEndReason["NO_RESPONSE"] = 5] = "NO_RESPONSE";
        /**
         * 己方不支持当前音视频引擎
         */
        RCCallEndReason[RCCallEndReason["ENGINE_UNSUPPORTED"] = 6] = "ENGINE_UNSUPPORTED";
        /**
         * 己方网络错误
         */
        RCCallEndReason[RCCallEndReason["NETWORK_ERROR"] = 7] = "NETWORK_ERROR";
        /**
         * 己方摄像头资源获取失败，可能是权限原因
         */
        RCCallEndReason[RCCallEndReason["GET_MEDIA_RESOURCES_ERROR"] = 8] = "GET_MEDIA_RESOURCES_ERROR";
        /**
         * 己方资源发布失败
         */
        RCCallEndReason[RCCallEndReason["PUBLISH_ERROR"] = 9] = "PUBLISH_ERROR";
        /**
         * 己方订阅资源失败
         */
        RCCallEndReason[RCCallEndReason["SUBSCRIBE_ERROR"] = 10] = "SUBSCRIBE_ERROR";
        /**
         * 对方取消发出的通话请求
         */
        RCCallEndReason[RCCallEndReason["REMOTE_CANCEL"] = 11] = "REMOTE_CANCEL";
        /**
         * 对方拒绝收到的通话请求
         */
        RCCallEndReason[RCCallEndReason["REMOTE_REJECT"] = 12] = "REMOTE_REJECT";
        /**
         * 通话过程中对方挂断
         */
        RCCallEndReason[RCCallEndReason["REMOTE_HANGUP"] = 13] = "REMOTE_HANGUP";
        /**
         * 对方忙碌
         */
        RCCallEndReason[RCCallEndReason["REMOTE_BUSY_LINE"] = 14] = "REMOTE_BUSY_LINE";
        /**
         * 对方未接听
         */
        RCCallEndReason[RCCallEndReason["REMOTE_NO_RESPONSE"] = 15] = "REMOTE_NO_RESPONSE";
        /**
         * 对方引擎不支持
         */
        RCCallEndReason[RCCallEndReason["REMOTE_ENGINE_UNSUPPORTED"] = 16] = "REMOTE_ENGINE_UNSUPPORTED";
        /**
         * 对方网络错误
         */
        RCCallEndReason[RCCallEndReason["REMOTE_NETWORK_ERROR"] = 17] = "REMOTE_NETWORK_ERROR";
        /**
         * 对方摄像头资源获取失败，可能是权限原因
         */
        RCCallEndReason[RCCallEndReason["REMOTE_GET_MEDIA_RESOURCE_ERROR"] = 18] = "REMOTE_GET_MEDIA_RESOURCE_ERROR";
        /**
         * 远端资源发布失败
         */
        RCCallEndReason[RCCallEndReason["REMOTE_PUBLISH_ERROR"] = 19] = "REMOTE_PUBLISH_ERROR";
        /**
         * 远端订阅资源失败
         */
        RCCallEndReason[RCCallEndReason["REMOTE_SUBSCRIBE_ERROR"] = 20] = "REMOTE_SUBSCRIBE_ERROR";
        /**
         * 己方其他端已加入新通话
         */
        RCCallEndReason[RCCallEndReason["OTHER_CLIENT_JOINED_CALL"] = 21] = "OTHER_CLIENT_JOINED_CALL";
        /**
         * 己方其他端已在通话中
         */
        RCCallEndReason[RCCallEndReason["OTHER_CLIENT_IN_CALL"] = 22] = "OTHER_CLIENT_IN_CALL";
        /**
         * 己方被禁止通话
         */
        RCCallEndReason[RCCallEndReason["KICKED_BY_SERVER"] = 23] = "KICKED_BY_SERVER";
        /**
         * 己方接听系统通话（移动端特有）
        */
        RCCallEndReason[RCCallEndReason["ACCEPT_SYSTEM_CALL"] = 24] = "ACCEPT_SYSTEM_CALL";
        /**
         * 远端其他端已加入新通话
         */
        RCCallEndReason[RCCallEndReason["REMOTE_OTHER_CLIENT_JOINED_CALL"] = 31] = "REMOTE_OTHER_CLIENT_JOINED_CALL";
        /**
         * 远端其他端已在通话中
         */
        RCCallEndReason[RCCallEndReason["REMOTE_OTHER_CLIENT_IN_CALL"] = 32] = "REMOTE_OTHER_CLIENT_IN_CALL";
        /**
         * 远端被禁止通话
         */
        RCCallEndReason[RCCallEndReason["REMOTE_KICKED_BY_SERVER"] = 33] = "REMOTE_KICKED_BY_SERVER";
        /**
         * 远端接听系统通话（移动端特有）
        */
        RCCallEndReason[RCCallEndReason["REMOTE_ACCEPT_SYSTEM_CALL"] = 24] = "REMOTE_ACCEPT_SYSTEM_CALL";
        /**
         * 其他端接听
         */
        RCCallEndReason[RCCallEndReason["ACCEPT_BY_OTHER_CLIENT"] = 101] = "ACCEPT_BY_OTHER_CLIENT";
        /**
         * 其他端挂断
         */
        RCCallEndReason[RCCallEndReason["HANGUP_BY_OTHER_CLIENT"] = 102] = "HANGUP_BY_OTHER_CLIENT";
        /**
         * 己方被对方加入黑名单
         */
        RCCallEndReason[RCCallEndReason["ADDED_TO_BLACKLIST"] = 103] = "ADDED_TO_BLACKLIST";
        /**
         * 音视频服务未开通
         */
        RCCallEndReason[RCCallEndReason["SERVICE_NOT_OPENED"] = 104] = "SERVICE_NOT_OPENED";
    })(exports.RCCallEndReason || (exports.RCCallEndReason = {}));
    /**
     * 己方原因转为对方原因
     */
    const CallRemoteEndReason = {
        [exports.RCCallEndReason.CANCEL]: exports.RCCallEndReason.REMOTE_CANCEL,
        [exports.RCCallEndReason.REJECT]: exports.RCCallEndReason.REMOTE_REJECT,
        [exports.RCCallEndReason.HANGUP]: exports.RCCallEndReason.REMOTE_HANGUP,
        [exports.RCCallEndReason.BUSY_LINE]: exports.RCCallEndReason.REMOTE_BUSY_LINE,
        [exports.RCCallEndReason.NO_RESPONSE]: exports.RCCallEndReason.REMOTE_NO_RESPONSE,
        [exports.RCCallEndReason.ENGINE_UNSUPPORTED]: exports.RCCallEndReason.REMOTE_ENGINE_UNSUPPORTED,
        [exports.RCCallEndReason.NETWORK_ERROR]: exports.RCCallEndReason.REMOTE_NETWORK_ERROR,
        [exports.RCCallEndReason.GET_MEDIA_RESOURCES_ERROR]: exports.RCCallEndReason.REMOTE_GET_MEDIA_RESOURCE_ERROR,
        [exports.RCCallEndReason.PUBLISH_ERROR]: exports.RCCallEndReason.REMOTE_PUBLISH_ERROR,
        [exports.RCCallEndReason.SUBSCRIBE_ERROR]: exports.RCCallEndReason.REMOTE_SUBSCRIBE_ERROR,
        [exports.RCCallEndReason.OTHER_CLIENT_JOINED_CALL]: exports.RCCallEndReason.REMOTE_OTHER_CLIENT_JOINED_CALL,
        [exports.RCCallEndReason.OTHER_CLIENT_IN_CALL]: exports.RCCallEndReason.REMOTE_OTHER_CLIENT_IN_CALL,
        [exports.RCCallEndReason.KICKED_BY_SERVER]: exports.RCCallEndReason.REMOTE_KICKED_BY_SERVER,
        [exports.RCCallEndReason.REMOTE_NO_RESPONSE]: exports.RCCallEndReason.NO_RESPONSE,
        [exports.RCCallEndReason.ACCEPT_SYSTEM_CALL]: exports.RCCallEndReason.REMOTE_ACCEPT_SYSTEM_CALL
    };

    var RCCallMessageType;
    (function (RCCallMessageType) {
        /**
         * 邀请消息
         */
        RCCallMessageType["VCInvite"] = "RC:VCInvite";
        /**
         * 响铃消息
         */
        RCCallMessageType["VCRinging"] = "RC:VCRinging";
        /**
         * 接听消息
         */
        RCCallMessageType["VCAccept"] = "RC:VCAccept";
        /**
         * 挂断消息
         */
        RCCallMessageType["VCHangup"] = "RC:VCHangup";
        /**
         * 群呼中 人员变更消息
         */
        RCCallMessageType["VCModifyMem"] = "RC:VCModifyMem";
        /**
         * 媒体类型修改消息
         */
        RCCallMessageType["VCModifyMedia"] = "RC:VCModifyMedia";
    })(RCCallMessageType || (RCCallMessageType = {}));

    exports.RCCallSessionState = void 0;
    (function (RCCallSessionState) {
        /**
         * 等待建立连接
         */
        RCCallSessionState[RCCallSessionState["WAITING"] = 0] = "WAITING";
        /**
         * 会话维持中
         */
        RCCallSessionState[RCCallSessionState["KEEPING"] = 1] = "KEEPING";
        /**
         * 会话已结束
         */
        RCCallSessionState[RCCallSessionState["END"] = 2] = "END";
    })(exports.RCCallSessionState || (exports.RCCallSessionState = {}));

    exports.RCCallUserState = void 0;
    (function (RCCallUserState) {
        /**
         * 用户不存在于通话中
         */
        RCCallUserState[RCCallUserState["NONE"] = 0] = "NONE";
        /**
         * 等待接听
         */
        RCCallUserState[RCCallUserState["WAITING"] = 1] = "WAITING";
        /**
         * 通话中
         */
        RCCallUserState[RCCallUserState["KEEPING"] = 2] = "KEEPING";
    })(exports.RCCallUserState || (exports.RCCallUserState = {}));

    class Timer {
        constructor(callback, timeout) {
            this._timerId = 0;
            this._startTime = 0;
            if (callback) {
                this._timerId = timerSetTimeout(() => {
                    callback();
                }, timeout);
            }
            this._startTime = Date.now();
        }
        stop() {
            clearTimeout(this._timerId);
            const endTime = Date.now();
            let duration = endTime - this._startTime;
            if (this._startTime === 0) {
                duration = 0;
            }
            return {
                startTime: this._startTime,
                endTime: endTime,
                duration
            };
        }
        reset() {
            this._startTime = 0;
        }
    }

    class RCCallStateMachine {
        constructor(_context, _logger, _callMsgHandler, _channelId, _conversationType, _targetId, _mediaType, _callId) {
            this._context = _context;
            this._logger = _logger;
            this._callMsgHandler = _callMsgHandler;
            this._channelId = _channelId;
            this._conversationType = _conversationType;
            this._targetId = _targetId;
            this._mediaType = _mediaType;
            this._callId = _callId;
            /**
             * 房间状态
             */
            this._sessionState = null;
            /**
             * 用户状态及信息
             */
            this._userInfo = {};
            /**
             * 用户计时器映射
             */
            this._userTimers = {};
            /**
             * 呼叫超时时间 (单位：毫秒)
             */
            this._callTimeout = 60 * 1000;
            /**
             * 通话建立开始时间
             */
            this._beginTimestamp = 0;
            /**
             * 通话结束时间
             */
            this._endTimestamp = 0;
            /**
             * 通话结束原因
             */
            this._endReason = null;
            /**
             * 主叫 ID
             * 发起邀请为当前用户 ID
             * 收到邀请为 senderUserId
             * 收到人员变更邀请为消息体中 callerId
             */
            this._callerId = null;
            /**
             * 当次通话邀请者 ID
             * 发起邀请为当前用户 ID、收到邀请为 senderUserId、收到人员变更邀请为消息体中 senderUserId
             */
            this._inviterId = null;
            this._callMsgHandler.registerStateMachineEvent(this._callId, 'onRinging', this._onRinging.bind(this));
            this._callMsgHandler.registerStateMachineEvent(this._callId, 'onAccept', this._onAccept.bind(this));
            this._callMsgHandler.registerStateMachineEvent(this._callId, 'onMediaModify', this._onMediaModify.bind(this));
            this._callMsgHandler.registerStateMachineEvent(this._callId, 'onHungup', this._onHungup.bind(this));
        }
        /**
         * 获取校正后超时时间
         */
        _getTimeout(sentTime) {
            let delayTime = this._context.getServerTime() - sentTime;
            if (delayTime < 0) {
                delayTime = 500; // 假设延迟时间为 500 ms
            }
            const timeout = this._callTimeout - delayTime;
            this._logger.warn(`_getTimeout -> timeout: ${timeout}`);
            return timeout;
        }
        _clearTimerById(userId) {
            this._logger.debug(`[RCCallStateMachine] before _clearTimerById  -> userId: ${userId} userTimers: ${JSON.stringify(this._userTimers)}`);
            if (this._userTimers[userId]) {
                this._userTimers[userId].stop();
                delete this._userTimers[userId];
            }
            this._logger.debug(`[RCCallStateMachine] before _clearTimerById -> userTimers: ${JSON.stringify(this._userTimers)}`);
        }
        _otherClientHandle(message) {
            const { senderUserId, content: { user: userProfile }, messageType } = message;
            this._userInfo[senderUserId] = {
                userId: senderUserId,
                state: exports.RCCallUserState.NONE,
                isCaller: false,
                isRemote: false
            };
            // 多端接听、多端拒绝，清除收到邀请后起的计时器
            for (const userId in this._userTimers) {
                this._clearTimerById(userId);
            }
            const resaon = messageType === RCCallMessageType.VCAccept ? exports.RCCallEndReason.ACCEPT_BY_OTHER_CLIENT : exports.RCCallEndReason.HANGUP_BY_OTHER_CLIENT;
            // 添加用户简要信息
            Object.assign(this._userInfo[senderUserId], userProfile);
            this._notifyUserStateChange(this._userInfo[senderUserId], resaon);
            this._notifyStateChange(exports.RCCallSessionState.END, resaon);
        }
        _onRinging(message) {
            const { senderUserId, content: { user: userProfile, callId } } = message;
            if (this._callId !== callId) {
                // 非当前状态机的消息不处理
                return;
            }
            if (this._context.getCurrentId() === senderUserId) {
                // 多端处理
                return;
            }
            this._watchers.onRinging(Object.assign({ userId: senderUserId }, userProfile));
        }
        _onAccept(message) {
            const { senderUserId, content: { user: userProfile, callId }, sentTime } = message;
            const currentUserId = this._context.getCurrentId();
            if (currentUserId === senderUserId) {
                // 多端处理
                this._otherClientHandle(message);
                return;
            }
            // 群组通话时： A、B 通话 A邀请C, C同意接听，这时B没有C的userId对应的计时器，所以这里判断一下
            if (this._userTimers[senderUserId]) {
                // 清除呼叫超时计时器
                this._clearTimerById(senderUserId);
            }
            // 修改并通知房间人员状态
            const ids = [currentUserId, senderUserId];
            ids.forEach(userId => {
                const isCurrentUserId = userId === currentUserId;
                this._userInfo[userId] = {
                    userId,
                    state: exports.RCCallUserState.KEEPING,
                    isCaller: isCurrentUserId,
                    isRemote: isCurrentUserId
                };
                if (!isCurrentUserId) {
                    this._beginTimestamp = Date.now();
                    // 添加用户简要信息
                    Object.assign(this._userInfo[senderUserId], userProfile);
                }
                this._notifyUserStateChange(this._userInfo[userId]);
            });
            if (this.getCallerId() === currentUserId) {
                this._notifyStateChange(exports.RCCallSessionState.KEEPING);
            }
            // 抛出onAccept时状态已经就绪
            this._watchers.onAccept({ userId: senderUserId });
        }
        _onMediaModify(message) {
            const { senderUserId, content: { mediaType, user: userProfile, callId } } = message;
            if (this._callId !== callId) { // 非当前状态机的消息不处理
                return;
            }
            if (this._context.getCurrentId() === senderUserId) { // 多端处理
                return;
            }
            // 更新 mediaType
            this._mediaType = mediaType;
            this._watchers.onMediaModify({
                sender: Object.assign({ userId: senderUserId }, userProfile),
                mediaType
            });
        }
        _onHungup(message) {
            const { senderUserId, content, sentTime } = message;
            const { reason, user: userProfile, callId } = content;
            const currentUserId = this._context.getCurrentId();
            if (currentUserId === senderUserId) { // 多端处理 抛出多端已处理 reason
                this._otherClientHandle(message);
                return;
            }
            if (this._sessionState === exports.RCCallSessionState.END) {
                // 如果己方房间状态已结束，再收到 hungup 消息不再处理
                this._logger.info(`[RCCallStateMachine] Invalid hang up message, current room status has ended -> sessionState: ${this._sessionState}`);
                return;
            }
            if (this._userInfo[senderUserId]) {
                // 修改内存态数据并通知
                this._userInfo[senderUserId].state = exports.RCCallUserState.NONE;
                this._endTimestamp = Date.now();
                // 添加用户简要信息
                Object.assign(this._userInfo[senderUserId], userProfile);
                this._notifyUserStateChange(this._userInfo[senderUserId], CallRemoteEndReason[reason]);
                delete this._userInfo[senderUserId];
            }
            // timer 清除
            if (CallRemoteEndReason[reason] === exports.RCCallEndReason.REMOTE_CANCEL) {
                // 远端取消通话，没有远端用户，清除己端的接听超时计时器
                this.getRemoteUserIds().length < 1 && this._clearTimerById(currentUserId);
            }
            else {
                // 远端拒绝、忙碌、未接听等，通过自己是否是主叫来判断要清除呼叫超时计时器 或 接听超时计时器
                if (this.getInviterId() === currentUserId) {
                    this._clearTimerById(senderUserId);
                }
                else {
                    this.getRemoteUserIds().length < 1 && this._clearTimerById(currentUserId);
                }
            }
            // 房间人员信息少于两个，通知房间状态结束
            const isLessThanTwo = Object.keys(this._userInfo).length < 2;
            // 群呼中邀请者挂断（非呼叫发起者）且房间中被邀请者都未接听，通知房间状态结束
            const isInviteUser = this._inviterId === senderUserId;
            const isNoOneAnswered = Object.values(this._userInfo).every(user => user.state !== exports.RCCallUserState.KEEPING);
            if (isLessThanTwo || (isInviteUser && isNoOneAnswered)) {
                this._notifyStateChange(exports.RCCallSessionState.END, CallRemoteEndReason[reason]);
            }
            // 抛出 onHungup 时状态已经就绪
            this._watchers.onHungup(Object.assign({ userId: senderUserId }, userProfile), CallRemoteEndReason[reason]);
        }
        /**
         * 通知 call 层房间状态变更及原因
         */
        _notifyStateChange(state, reason) {
            var _a;
            this._logger.warn(`[RCCallStateMachine] notifyStateChange -> info: ${JSON.stringify({
            state, reason
        })}`);
            this._endReason = reason || null;
            if (this._sessionState !== state) {
                this._sessionState = state;
                (_a = this._watchers) === null || _a === void 0 ? void 0 : _a.onStateChange({ state, reason });
            }
            if (state === exports.RCCallSessionState.END) {
                // 当状态机结束时，需在 CallEngine 清除
                eventEmitter.emit('onStateMachineClose', this._callId);
                this._callMsgHandler.unregisterStateMachineEvent(this._callId);
            }
        }
        /**
         * 通知 call 层人员状态变更及原因
         */
        _notifyUserStateChange(user, reason) {
            var _a;
            this._logger.warn(`[RCCallStateMachine] notifyUserStateChange -> info: ${JSON.stringify({
            user, reason
        })}`);
            (_a = this._watchers) === null || _a === void 0 ? void 0 : _a.onUserStateChange({ user, reason });
        }
        /**
         * 注册事件监听
         * @params watchers
         */
        registerEventListener(watchers) {
            this._watchers = watchers;
        }
        /**
         * 收到 invite 消息时状态机更新（CallEngine 内部调用）
         * @param message 接收消息
         */
        __onInvite(message) {
            const { senderUserId, content, sentTime } = message;
            const { inviteUserIds, user: userProfile } = content;
            const currentUserId = this._context.getCurrentId();
            if (currentUserId === senderUserId) {
                // 多端处理
                return;
            }
            this._callerId = this._inviterId = senderUserId;
            const allUserIds = [senderUserId, ...inviteUserIds];
            // 收到邀请后，内部回应响铃消息, userIds 传除自己的所有人
            this._callMsgHandler.sendRinging({
                conversationType: this._conversationType,
                targetId: this._targetId,
                channelId: this._channelId,
                callId: this._callId,
                userIds: allUserIds.filter(id => id !== currentUserId)
            });
            // 修改并通知房间人员状态
            allUserIds.forEach(userId => {
                this._userInfo[userId] = {
                    userId,
                    state: exports.RCCallUserState.WAITING,
                    isCaller: userId === senderUserId,
                    isRemote: userId !== currentUserId
                };
                if (userId === senderUserId) {
                    // 给 senderUser 添加用户简要信息
                    Object.assign(this._userInfo[userId], userProfile);
                }
                this._notifyUserStateChange(this._userInfo[userId]);
                // 给所有被邀请人启动接听计时器
                if (userId !== senderUserId) {
                    this._userTimers[userId] = new Timer(() => {
                        const reason = userId === currentUserId ? exports.RCCallEndReason.NO_RESPONSE : exports.RCCallEndReason.REMOTE_NO_RESPONSE;
                        if (userId === currentUserId) { // 群聊中己方超时需发送挂断
                            this._hungupHandle(reason);
                        }
                        else { // 其他人员超时只通知人员状态变更
                            this._userInfo[userId] && (this._userInfo[userId].state = exports.RCCallUserState.NONE);
                            this._notifyUserStateChange(this._userInfo[userId]);
                            delete this._userInfo[userId];
                        }
                    }, this._getTimeout(sentTime));
                }
            });
            // 房间状态通知
            this._notifyStateChange(exports.RCCallSessionState.WAITING);
        }
        /**
         * 收到 memberModify 消息时状态机更新（CallEngine 内部调用）
         * @param message 接收消息
         */
        __onMemberModify(message) {
            const { senderUserId, content, sentTime } = message;
            const { inviteUserIds, user: userProfile, existedUserPofiles, caller } = content;
            const currentUserId = this._context.getCurrentId();
            if (currentUserId === senderUserId) {
                // 多端处理
                return;
            }
            this._callerId = caller;
            this._inviterId = senderUserId;
            // 己方状态为 NONE (未存在己方用户信息) 说明自己为被邀请者, 需发送 ringing
            const isNewInvitedUser = !this._userInfo[currentUserId];
            if (isNewInvitedUser) {
                const needRingingUserIds = [];
                existedUserPofiles.forEach(userInfo => {
                    if (userInfo.userId !== currentUserId) {
                        needRingingUserIds.push(userInfo.userId);
                    }
                });
                this._callMsgHandler.sendRinging({
                    conversationType: this._conversationType,
                    targetId: this._targetId,
                    channelId: this._channelId,
                    callId: this._callId,
                    userIds: needRingingUserIds
                });
            }
            const invitedUsers = [];
            // 更新全量用户状态
            existedUserPofiles.forEach(userInfo => {
                const { userId, callStatus } = userInfo;
                // 人员为结束状态时，不再更新
                if (callStatus === MsgCallStatus.IDLE)
                    return;
                this._userInfo[userId] = {
                    userId,
                    state: callStatus !== MsgCallStatus.CONNECTED ? exports.RCCallUserState.WAITING : exports.RCCallUserState.KEEPING,
                    isCaller: senderUserId === userId,
                    isRemote: currentUserId === userId
                };
                if (callStatus === MsgCallStatus.RINGING) {
                    invitedUsers.push({ userId });
                }
                // 给 senderUser 添加用户简要信息
                if (userId === senderUserId) {
                    Object.assign(this._userInfo[userId], userProfile);
                }
                // 通知人员变更
                this._notifyUserStateChange(this._userInfo[userId]);
                // 除了 callMsgStatus.connected ,其他人都起计时器
                if (callStatus !== MsgCallStatus.CONNECTED) {
                    // 启动计时器
                    this._userTimers[userId] = new Timer(() => {
                        // 呼叫超时处理状态、并通知 call 层
                        this._userInfo[userId] && (this._userInfo[userId].state = exports.RCCallUserState.NONE);
                        const reason = userId === currentUserId ? exports.RCCallEndReason.NO_RESPONSE : exports.RCCallEndReason.REMOTE_NO_RESPONSE;
                        // 通知 call 层人员状态变更
                        this._notifyUserStateChange(this._userInfo[userId], reason);
                        delete this._userInfo[userId];
                        // 房间人员信息少于两个，通知房间状态
                        if (Object.keys(this._userInfo).length < 2) {
                            this._notifyStateChange(exports.RCCallSessionState.END, reason);
                        }
                    }, this._getTimeout(sentTime));
                }
            });
            if (isNewInvitedUser) {
                // 被邀请者通知 call 层房间状态变更
                this._notifyStateChange(exports.RCCallSessionState.WAITING);
            }
            else {
                // 已在通话流程中用户，抛出人员变更监听
                this._watchers.onMemberModify({
                    sender: Object.assign({ userId: senderUserId }, userProfile),
                    invitedUsers
                });
            }
        }
        /**
         * 处理已有 session ，不允许再接听新会话情况
         */
        __handleInviteInSession() {
            this._logger.info('StateMachine -> __handleInviteInSession');
            // 修改所有用户状态并抛出，清空计时器
            for (const userId in this._userInfo) {
                this._userInfo[userId].state && (this._userInfo[userId].state = exports.RCCallUserState.NONE);
                this._notifyUserStateChange(this._userInfo[userId]);
                // 将已存在的计时器都清掉
                this._clearTimerById(userId);
            }
            // 直接终止当前 session 状态
            this._notifyStateChange(exports.RCCallSessionState.END, exports.RCCallEndReason.BUSY_LINE);
            // 发送挂断消息，并携带 己方忙碌 原因
            this._callMsgHandler.sendHungup({
                channelId: this._channelId,
                conversationType: this._conversationType,
                targetId: this._targetId,
                callId: this._callId,
                reason: exports.RCCallEndReason.BUSY_LINE,
                userIds: this.getRemoteUserIds()
            });
        }
        /**
         * 主动呼叫 (CallEngine 内部调用)
         * @param userIds 被邀请用户 ID 列表
         */
        async __call(userIds) {
            this._logger.debug(`[RCCallStateMachine] invite -> userIds: ${JSON.stringify(userIds)}`);
            // 发送邀请消息
            const currentUserId = this._callerId = this._inviterId = this._context.getCurrentId();
            const { code, message } = await this._callMsgHandler.sendInvite({
                channelId: this._channelId,
                conversationType: this._conversationType,
                targetId: this._targetId,
                callId: this._callId,
                mediaType: this._mediaType,
                inviteUserIds: userIds.filter(id => id !== currentUserId)
            });
            if (code === exports.RCCallErrorCode.SUCCESS) {
                const { sentTime } = message;
                const ids = [currentUserId, ...userIds];
                // 遍历更新房间所有人员状态、并给被叫启动计时器
                ids.forEach(userId => {
                    const isCaller = userId === currentUserId;
                    this._userInfo[userId] = {
                        userId,
                        state: exports.RCCallUserState.WAITING,
                        isCaller,
                        isRemote: !isCaller
                    };
                    // 通知 call 层人员状态变更
                    this._notifyUserStateChange(this._userInfo[userId]);
                    // 启动呼叫超时计时器
                    if (!isCaller) {
                        this._userTimers[userId] = new Timer(() => {
                            // 呼叫超时处理状态、并通知 call 层
                            this._userInfo[userId] && (this._userInfo[userId].state = exports.RCCallUserState.NONE);
                            // 通知 call 层人员状态变更
                            this._notifyUserStateChange(this._userInfo[userId], exports.RCCallEndReason.REMOTE_NO_RESPONSE);
                            delete this._userInfo[userId];
                            // 房间人员信息少于两个，通知房间状态
                            if (Object.keys(this._userInfo).length < 2) {
                                this._notifyStateChange(exports.RCCallSessionState.END, exports.RCCallEndReason.REMOTE_NO_RESPONSE);
                            }
                            // 远端人员大于 1 且己方不为正在通话时，发送 hungup, 告诉远端自己退出通话
                            const isNeedSendHungup = this.getRemoteUserIds().length > 1 && (this._userInfo[currentUserId].state !== exports.RCCallUserState.KEEPING);
                            if (isNeedSendHungup) {
                                this._hungupHandle(exports.RCCallEndReason.REMOTE_NO_RESPONSE);
                            }
                        }, this._getTimeout(sentTime));
                    }
                });
                // 通知 call 层房间状态变更
                this._notifyStateChange(exports.RCCallSessionState.WAITING);
            }
            else {
                const endCode = code === exports.RCCallErrorCode.REJECTED_BY_BLACKLIST ? exports.RCCallEndReason.ADDED_TO_BLACKLIST : exports.RCCallEndReason.NETWORK_ERROR;
                this._notifyStateChange(exports.RCCallSessionState.END, endCode);
            }
            return { code };
        }
        /**
         * 接听
         */
        async accept() {
            this._logger.debug('[RCCallStateMachine] accept');
            // 发送接听消息
            const currentUserId = this._context.getCurrentId();
            const { code, message } = await this._callMsgHandler.sendAccept({
                channelId: this._channelId,
                conversationType: this._conversationType,
                targetId: this._targetId,
                callId: this._callId,
                mediaType: this._mediaType,
                userIds: this.getRemoteUserIds()
            });
            // 清除接听超时计时器
            this._clearTimerById(currentUserId);
            if (code === exports.RCCallErrorCode.SUCCESS) {
                this._userInfo[currentUserId] && (this._userInfo[currentUserId].state = exports.RCCallUserState.KEEPING);
                this._beginTimestamp = Date.now();
                // 通知 call 层人员状态变更
                this._notifyUserStateChange(this._userInfo[currentUserId]);
                // 修改并通知 call 层房间状态变更
                this._notifyStateChange(exports.RCCallSessionState.KEEPING);
            }
            else {
                this._userInfo[currentUserId] && (this._userInfo[currentUserId].state = exports.RCCallUserState.NONE);
                // 通知 call 层人员状态变更
                this._notifyUserStateChange(this._userInfo[currentUserId]);
                // 修改并通知 call 层房间状态变更
                const endReason = code === exports.RCCallErrorCode.REJECTED_BY_BLACKLIST ? exports.RCCallEndReason.ADDED_TO_BLACKLIST : exports.RCCallEndReason.NETWORK_ERROR;
                this._notifyStateChange(exports.RCCallSessionState.END, endReason);
            }
            return { code };
        }
        /**
         * 群呼叫中继续邀请
         * @param userIds 被邀请用户 ID 列表
         */
        async invite(userIds) {
            this._logger.debug(`[RCCallStateMachine] invite -> userIds: ${JSON.stringify(userIds)}`);
            const currentUserId = this._context.getCurrentId();
            const existedUserIds = Object.keys(this._userInfo);
            const inviteUserIds = existedUserIds.concat(userIds);
            const existedUserPofiles = inviteUserIds.map(userId => {
                let callStatus = MsgCallStatus.CONNECTED;
                // 包含被邀请者，或者用户状态为 wating 时，状态为 响铃
                if (userIds.includes(userId) || this._userInfo[userId].state === exports.RCCallUserState.WAITING) {
                    callStatus = MsgCallStatus.RINGING;
                }
                return {
                    userId,
                    mediaType: this._mediaType,
                    callStatus
                };
            });
            // 发送人员变更消息
            const { code, message } = await this._callMsgHandler.sendMemeberModify({
                channelId: this._channelId,
                conversationType: this._conversationType,
                targetId: this._targetId,
                callId: this._callId,
                mediaType: this._mediaType,
                // 除自己，其他所有人均需收到 modify 消息，以此更新状态
                inviteUserIds: inviteUserIds.filter(id => id !== currentUserId),
                callerId: this.getCallerId(),
                existedUserPofiles
            });
            if (code === exports.RCCallErrorCode.SUCCESS) {
                const { sentTime } = message;
                // 修改被邀请人状态，并通知
                userIds.forEach(userId => {
                    this._userInfo[userId] = {
                        userId,
                        state: exports.RCCallUserState.WAITING,
                        isCaller: false,
                        isRemote: true
                    };
                    // 通知 call 层人员状态变更
                    this._notifyUserStateChange(this._userInfo[userId]);
                    // 启动呼叫计时器
                    this._userTimers[userId] = new Timer(() => {
                        // 呼叫超时处理状态、并通知 call 层
                        this._userInfo[userId] && (this._userInfo[userId].state = exports.RCCallUserState.NONE);
                        // 通知 call 层人员状态变更
                        this._notifyUserStateChange(this._userInfo[userId], exports.RCCallEndReason.REMOTE_NO_RESPONSE);
                        delete this._userInfo[userId];
                        // 房间人员信息少于两个，通知房间状态
                        if (Object.keys(this._userInfo).length < 2) {
                            this._notifyStateChange(exports.RCCallSessionState.END, exports.RCCallEndReason.REMOTE_NO_RESPONSE);
                        }
                    }, this._getTimeout(sentTime));
                });
            }
            else {
                // 清除给被邀请人 userIds 起的呼叫超时计时器
                userIds.forEach(userId => {
                    this._userInfo[userId] = {
                        userId,
                        state: exports.RCCallUserState.NONE,
                        isCaller: false,
                        isRemote: true
                    };
                    // 通知 call 层人员状态变更
                    this._notifyUserStateChange(this._userInfo[userId]);
                });
            }
            return { code };
        }
        async _hungupHandle(reason) {
            const currentUserId = this._context.getCurrentId();
            // 发送挂断类型消息
            const { code, message } = await this._callMsgHandler.sendHungup({
                channelId: this._channelId,
                conversationType: this._conversationType,
                targetId: this._targetId,
                callId: this._callId,
                reason,
                userIds: this.getRemoteUserIds()
            });
            this._endTimestamp = Date.now();
            // 更新通话人员状态、通话结束时间 并通知
            for (const userId in this._userInfo) {
                this._userInfo[userId].state = exports.RCCallUserState.NONE;
                if (userId === currentUserId) {
                    this._notifyUserStateChange(this._userInfo[userId], reason);
                }
                else {
                    this._notifyUserStateChange(this._userInfo[userId]);
                }
                delete this._userInfo[userId];
            }
            if (Object.keys(this._userInfo).length < 2) {
                // 清空内存态数据，并通知
                this._notifyStateChange(exports.RCCallSessionState.END, reason);
            }
            return { code };
        }
        /**
         * 挂断
         */
        async hungup() {
            this._logger.debug('[RCCallStateMachine] hungup');
            const currentUserId = this._context.getCurrentId();
            // 默认挂断 reason 为通话过程中，己方正常取消通话
            let reason = exports.RCCallEndReason.HANGUP;
            // 若超时计时器存在, 己方为 caller 原因为己方取消通话, 己方为 callee 原因为己方拒绝通话
            if (Object.keys(this._userTimers).length > 0) {
                this._userInfo[currentUserId].isCaller ? reason = exports.RCCallEndReason.CANCEL : reason = exports.RCCallEndReason.REJECT;
            }
            // 清除所有超时计时器
            for (const userId in this._userTimers) {
                this._clearTimerById(userId);
            }
            return this._hungupHandle(reason);
        }
        /**
         * 修改通话媒体类型
         * @param mediaType RCCallMediaType.AUDIO 改为音频通话 | RCCallMediaType.AUDIO_VIDEO 改为音视频通话
         */
        async changeMediaType(mediaType) {
            this._logger.debug(`[RCCallStateMachine] changeMediaType -> mediaType: ${mediaType}`);
            const { code } = await this._callMsgHandler.sendMediaModify({
                channelId: this._channelId,
                conversationType: this._conversationType,
                targetId: this._targetId,
                callId: this._callId,
                mediaType,
                userIds: this.getRemoteUserIds()
            });
            if (code === exports.RCCallErrorCode.SUCCESS) {
                this._mediaType = mediaType;
            }
            return { code };
        }
        /**
         * 用户加入通话补偿机制（rtc userJoin 事件触发）
         * 主叫呼叫后，未收到被叫 accept 消息，但收到了 userJoin 同样补偿更新用户、房间状态、呼叫计时器
         */
        userJoin(userIds) {
            this._logger.debug(`[RCCallStateMachine] userJoin -> userIds: ${JSON.stringify(userIds)}`);
            // 延迟 300ms 防止 userJion 和 accept 消息都有的情况下， userJoin 比 accept 先到
            setTimeout(() => {
                userIds.forEach(userId => {
                    const userInfo = this._userInfo[userId];
                    // 更新人员状态 (// 群组通话时： A向B、C发起通话 B先接听，C后接听，这时B没有C的userId对应的_userInfo，所以这里判断一下)
                    if (userInfo && userInfo.state !== exports.RCCallUserState.KEEPING) {
                        userInfo.state = exports.RCCallUserState.KEEPING;
                        this._notifyUserStateChange(userInfo);
                    }
                    // 更新房间状态
                    if (this._sessionState !== exports.RCCallSessionState.KEEPING) {
                        this._notifyStateChange(exports.RCCallSessionState.KEEPING);
                    }
                    // 停止并清除呼叫计时器
                    this._clearTimerById(userId);
                });
            }, 300);
        }
        /**
         * 用户离开通话补偿机制（rtc userLeave、kickOff 事件触发）
         * 通话中远端用户挂断，挂断消息未到，但是监听到 rtc userLeave 同样补偿更新用户、房间状态
         */
        userLeave(userIds) {
            this._logger.debug(`[RCCallStateMachine] userLeave -> userIds: ${JSON.stringify(userIds)}`);
            // 延迟 300ms 防止 userLeave 和 hungup 消息都有的情况下，userLeave 比 hungup 先到
            setTimeout(() => {
                userIds.forEach(userId => {
                    const userInfo = this._userInfo[userId];
                    // 更新人员状态
                    if (userInfo && userInfo.state !== exports.RCCallUserState.NONE) {
                        userInfo.state = exports.RCCallUserState.NONE;
                        this._notifyUserStateChange(userInfo, exports.RCCallEndReason.REMOTE_HANGUP);
                        this._watchers.onHungup(userInfo, exports.RCCallEndReason.REMOTE_HANGUP);
                        delete this._userInfo[userId];
                    }
                    // 更新房间状态
                    if (Object.keys(this._userInfo).length < 2 && this._sessionState !== exports.RCCallSessionState.END) {
                        this._endTimestamp = Date.now();
                        this._notifyStateChange(exports.RCCallSessionState.END, exports.RCCallEndReason.REMOTE_HANGUP);
                    }
                });
            }, 300);
        }
        /**
         * Call 层己方异常失败后调用的方法
         * 触发时机：音视频服务异常、获取资源失败、加入 RTC 房间失败、发布|订阅失败
         */
        close(reason) {
            this._hungupHandle(reason);
        }
        /**
         * 通话唯一标识
         */
        getCallId() {
            return this._callId;
        }
        /**
         * 多组织 ID
         */
        getChannelId() {
            return this._channelId;
        }
        /**
         * 目标 ID，单呼对方人员 Id, 群呼群组 Id
         */
        getTargetId() {
            return this._targetId;
        }
        /**
         * 获取会话类型
         */
        getConversationType() {
            return this._conversationType;
        }
        /**
         * 获取远端成员 ID 列表
         */
        getRemoteUserIds() {
            const allUserIds = Object.keys(this._userInfo);
            const remoteUserIds = allUserIds.filter(id => this._context.getCurrentId() !== id);
            return remoteUserIds;
        }
        /**
         * 获取远端成员信息列表
         */
        getRemoteUsers() {
            const remoteUser = [];
            const currentUserId = this._context.getCurrentId();
            for (const uid in this._userInfo) {
                const { userId } = this._userInfo[uid];
                if (userId !== currentUserId) {
                    remoteUser.push(this._userInfo[uid]);
                }
            }
            return remoteUser;
        }
        /**
         * 获取房间状态
         */
        getState() {
            return this._sessionState === null ? exports.RCCallSessionState.END : this._sessionState;
        }
        /**
         * 获取人员状态
         */
        getUserState(userId) {
            var _a;
            return (_a = this._userInfo[userId]) === null || _a === void 0 ? void 0 : _a.state;
        }
        /**
         * 获取会话发起者 Id
         */
        getCallerId() {
            return this._callerId;
        }
        /**
         * 获取当次会话邀请者 Id
         */
        getInviterId() {
            return this._inviterId;
        }
        /**
         * 获取当前通话媒体类型
         */
        getMediaType() {
            return this._mediaType;
        }
        /**
         * 通话挂断后可调用
         */
        getSummary() {
            // 通话时间计算
            const beginTimestamp = this._beginTimestamp;
            const endTimestamp = this._endTimestamp;
            let duration = 0;
            if (endTimestamp > beginTimestamp && beginTimestamp !== 0) {
                duration = endTimestamp - beginTimestamp;
            }
            const summary = {
                conversationType: this._conversationType,
                channelId: this._channelId,
                targetId: this._targetId,
                mediaType: this._mediaType,
                beginTimestamp,
                endTimestamp,
                duration,
                endReason: this._endReason
            };
            this._logger.debug(`[RCCallStateMachine] getSummary -> summary: ${JSON.stringify(summary)}`);
            return summary;
        }
    }

    /**
     * 通话媒体类型
     */
    exports.RCCallMediaType = void 0;
    (function (RCCallMediaType) {
        /**
         * 音频通话
         */
        RCCallMediaType[RCCallMediaType["AUDIO"] = 1] = "AUDIO";
        /**
         * 视频通话
         */
        RCCallMediaType[RCCallMediaType["AUDIO_VIDEO"] = 2] = "AUDIO_VIDEO";
    })(exports.RCCallMediaType || (exports.RCCallMediaType = {}));

    var MemberModifyType;
    (function (MemberModifyType) {
        MemberModifyType[MemberModifyType["ADD"] = 1] = "ADD";
        MemberModifyType[MemberModifyType["REMOVE"] = 2] = "REMOVE";
    })(MemberModifyType || (MemberModifyType = {}));

    exports.RCCallLanguage = void 0;
    (function (RCCallLanguage) {
        RCCallLanguage["ZH"] = "zh";
        RCCallLanguage["EN"] = "en";
    })(exports.RCCallLanguage || (exports.RCCallLanguage = {}));

    const EN = {
        PushTitle: {
            AUDIO: 'You have a voice call',
            VIDEO: 'You have a video call'
        }
    };

    const ZH = {
        PushTitle: {
            AUDIO: '您有一条音频通话',
            VIDEO: '您有一条视频通话'
        }
    };

    /**
     * CallEngine 全局语言设置，当前仅支持中、英文
     */
    class Local {
        static set(lang) {
            this._lang = lang;
        }
        static get() {
            if (this._lang === exports.RCCallLanguage.EN) {
                return EN;
            }
            else {
                return ZH;
            }
        }
    }
    Local._lang = exports.RCCallLanguage.ZH;

    /**
     * 平台
     */
    var Platform;
    (function (Platform) {
        Platform["WEB"] = "Web";
        Platform["IOS"] = "iOS";
        Platform["ANDROID"] = "Android";
    })(Platform || (Platform = {}));

    /**
     * 离线通话记录器
     */
    class OfflineRecorder {
        constructor(_context, _logger, _onRecord) {
            this._context = _context;
            this._logger = _logger;
            this._onRecord = _onRecord;
            this._messages = [];
            this._beginTimestamp = 0;
            this._endTimestamp = 0;
        }
        /**
         * 到 invite | memberModify 结束
         * 原因根据己方是否为主叫，主叫为远端未接听 被叫被己端未接听
         */
        _doInvite(message) {
            const currentUserId = this._context.getCurrentId();
            const { channelId, conversationType, targetId, senderUserId, content } = message;
            const { callId, mediaType } = content;
            this._channelId = channelId;
            this._conversationType = conversationType;
            this._targetId = targetId;
            this._callId = callId;
            this._mediaType = mediaType;
            const isCaller = senderUserId === currentUserId;
            this._inviterId = senderUserId;
            this._endReason = isCaller ? exports.RCCallEndReason.REMOTE_NO_RESPONSE : exports.RCCallEndReason.REMOTE_NO_RESPONSE;
            this._canGenRecord();
        }
        /**
         * 到 invite | memberModify 结束
         * 原因根据己方是否为主叫，主叫为远端未接听 被叫被己端未接听
         */
        _doMemberModify(message) {
            this._doInvite(message);
        }
        /**
         * 用 invite | memberModify 计算的离线记录
         */
        _doRinging(message) {
            this._canGenRecord();
        }
        /**
         * 到 accept 说明通话已建立
         * 原因默认己方正常挂断
         */
        _doAccept(message) {
            this._endReason = exports.RCCallEndReason.HANGUP;
            this._beginTimestamp = message.sentTime;
            this._canGenRecord();
        }
        /**
         * 到 hungup 说明为正常挂断
         * 原因取消息体里挂断原因
         */
        _doHungup(message) {
            const { content, sentTime, senderUserId } = message;
            const { reason } = content;
            const currentUserId = this._context.getCurrentId();
            const isSelfSend = senderUserId === currentUserId;
            this._endReason = isSelfSend ? reason : CallRemoteEndReason[reason];
            this._endTimestamp = sentTime;
            this._canGenRecord();
        }
        /**
         * 只修改通话类型
         */
        _doMediaModify(message) {
            const { content } = message;
            const { mediaType } = content;
            this._mediaType = mediaType;
            this._canGenRecord();
        }
        _canGenRecord() {
            if (this._messages.length === 0) {
                let duration = 0;
                const isNeedDurationReason = [
                    exports.RCCallEndReason.HANGUP,
                    exports.RCCallEndReason.REMOTE_HANGUP,
                    exports.RCCallEndReason.OTHER_CLIENT_JOINED_CALL,
                    exports.RCCallEndReason.REMOTE_OTHER_CLIENT_JOINED_CALL,
                    exports.RCCallEndReason.KICKED_BY_SERVER,
                    exports.RCCallEndReason.REMOTE_KICKED_BY_SERVER,
                    exports.RCCallEndReason.ACCEPT_SYSTEM_CALL,
                    exports.RCCallEndReason.REMOTE_ACCEPT_SYSTEM_CALL
                ].includes(this._endReason);
                if (isNeedDurationReason) {
                    duration = this._endTimestamp - this._beginTimestamp;
                }
                this._onRecord({
                    channelId: this._channelId,
                    conversationType: this._conversationType,
                    targetId: this._targetId,
                    callId: this._callId,
                    inviterId: this._inviterId,
                    mediaType: this._mediaType,
                    endReason: this._endReason,
                    beginTimestamp: this._beginTimestamp,
                    endTimestamp: this._endTimestamp,
                    duration
                });
            }
        }
        onRecvOfflineMsgs(messages) {
            this._messages = messages;
            do {
                const msg = this._messages.shift();
                const { messageType, content: { callId } } = msg;
                switch (messageType) {
                    case RCCallMessageType.VCInvite:
                        this._doInvite(msg);
                        break;
                    case RCCallMessageType.VCRinging:
                        this._doRinging(msg);
                        break;
                    case RCCallMessageType.VCAccept:
                        this._doAccept(msg);
                        break;
                    case RCCallMessageType.VCModifyMem:
                        this._doMemberModify(msg);
                        break;
                    case RCCallMessageType.VCModifyMedia:
                        this._doMediaModify(msg);
                        break;
                    case RCCallMessageType.VCHangup:
                        this._doHungup(msg);
                        break;
                    default:
                        this._logger.debug(`[OfflineRecorder] onRecvOfflineMsgs -> unexpected message: ${JSON.stringify(msg)}`);
                        break;
                }
            } while (this._messages.length > 0);
        }
    }

    const callMsgTypes = ['RC:VCAccept', 'RC:VCRinging', 'RC:VCSummary', 'RC:VCHangup', 'RC:VCInvite', 'RC:VCModifyMedia', 'RC:VCModifyMem'];
    /**
     * 先 mock deviceId ,后续使用 engine 暴露的 getDeviceId 方法
     */
    const getDeviceId = () => {
        const key = 'RCCallDeviceId';
        let deviceId = localStorage.getItem(key);
        if (!deviceId) {
            deviceId = `${Math.floor(Math.random() * 10000)}${Date.now()}`;
            localStorage.setItem(key, deviceId);
        }
        return deviceId;
    };
    const EngineErrorCodeToCallErrorCode = {
        [engine.ErrorCode.REJECTED_BY_BLACKLIST]: exports.RCCallErrorCode.REJECTED_BY_BLACKLIST,
        [engine.ErrorCode.NOT_IN_GROUP]: exports.RCCallErrorCode.NOT_IN_GROUP
    };
    /**
     * 消息接收处理: 在线消息、离线消息
     * 发送消息处理: 发送不同类型消息封装
     */
    class CallMessageHandler extends engine.EventEmitter {
        constructor(_context, _logger, 
        /**
         * 离线消息处理时间间隔
         */
        _offlineMsgItv = 60 * 1000) {
            super();
            this._context = _context;
            this._logger = _logger;
            this._offlineMsgItv = _offlineMsgItv;
            this._watchers = {};
            this._userInfo = {};
            this._msgBufferList = [];
            this._itvTimer = null;
            // 处理消息收发
            this._context.onmessage = this._onMessage.bind(this);
            // 处理离线消息记录
            this._offlineRecorder = new OfflineRecorder(this._context, this._logger, (record) => {
                this._logger.info(`[CallMessageHandler] offlineRecorder -> ${JSON.stringify(record)}`);
                this._watchers.onOfflineRecord && this._watchers.onOfflineRecord(record);
            });
        }
        _onMessage(message) {
            const isCallMsg = callMsgTypes.includes(message.messageType);
            if (isCallMsg) {
                this._logger.debug(`[CallMessageHandler] _onMessage -> call message: ${JSON.stringify(message)}`);
                this._msgBufferList.push({
                    markTime: Date.now(),
                    msg: message
                });
                // 消息数量大于 2 再进行排序
                if (this._msgBufferList.length > 2) {
                    // 按时间戳升序排序
                    try {
                        this._msgBufferList = quickSort(this._msgBufferList, (before, after) => {
                            const { sentTime: beforeSentTime } = before.msg;
                            const { sentTime: afterSentTime } = after.msg;
                            return beforeSentTime < afterSentTime;
                        });
                    }
                    catch (error) {
                        this._logger.error(`[CallMessageHandler] sort msg error -> ${error.message}`);
                    }
                }
                // 启动消息处理
                this._handleBufferMsgs();
                return true;
            }
            return false;
        }
        /**
         * 在线消息抛给状态机处理
         */
        _onRecvOnlineCallMsg(message) {
            const { content: { callId } } = message;
            // 在线消息直接抛出
            switch (message.messageType) {
                case RCCallMessageType.VCInvite:
                    this._watchers.onInvite && this._watchers.onInvite(message);
                    break;
                case RCCallMessageType.VCRinging:
                    super.emit(callId + 'onRinging', message);
                    break;
                case RCCallMessageType.VCAccept:
                    super.emit(callId + 'onAccept', message);
                    break;
                case RCCallMessageType.VCModifyMem:
                    // 收到人员变更抛出 onInvite 生成状态机实例
                    this._watchers.onInvite && this._watchers.onInvite(message);
                    break;
                case RCCallMessageType.VCModifyMedia:
                    super.emit(callId + 'onMediaModify', message);
                    break;
                case RCCallMessageType.VCHangup:
                    super.emit(callId + 'onHungup', message);
                    break;
                default:
                    this._logger.warn(`[CallMessageHandler] onRecvOnlineCallMsg -> unexpected message: ${JSON.stringify(message)}`);
                    break;
            }
        }
        /**
         * 消息 buffer 列表处理逻辑
         * 1、每 20ms 检查一次 buffer list
         * 2、取出已经延迟 200 的消息列表进行消费 | 无延迟 200ms 内消息直接递归
         * 3、消费分为 离线消息消费逻辑、在线消息消费逻辑，消费后递归
        */
        _handleBufferMsgs() {
            // 消息 buffer 列表长度为 0 时加锁
            if (this._msgBufferList.length === 0)
                return;
            timerSetTimeout(() => {
                // 取出大于 200 ms 消息列表
                const currentTime = Date.now();
                const buffers = this._msgBufferList.filter(item => currentTime - item.markTime >= 200);
                const list = buffers.map(item => item.msg);
                this._logger.debug(`[CallMessageHandler] handleBufferMsgs -> lists over 200ms : ${JSON.stringify(list.map((messageUid, isOffLineMessage) => {
                return { messageUid, isOffLineMessage };
            }))}`);
                if (list.length === 0) {
                    // 没有延迟 200ms 的消息，递归执行
                    this._handleBufferMsgs();
                    return;
                }
                if (list[0].isOffLineMessage) {
                    // 当第一条消息为离线消息时，直接从 buffer 中取出所有离线消息，进行消息
                    const offlineBuffers = this._msgBufferList.filter(item => item.msg.isOffLineMessage);
                    let offlineMsgs = offlineBuffers.map(item => item.msg);
                    // 离线消息处理逻辑
                    do {
                        const { conversationType, messageType, sentTime, senderUserId, content: { callId: inviteCallId, inviteUserIds } } = offlineMsgs[0];
                        const isInviteMsgType = [RCCallMessageType.VCInvite, RCCallMessageType.VCModifyMem].includes(messageType);
                        if (isInviteMsgType) {
                            // 取出相同 CallId 消息列表
                            const taskMsgList = [];
                            for (let i = 0; i < this._msgBufferList.length; i++) {
                                const item = this._msgBufferList[i].msg;
                                const { content: { callId: otherCallId } } = item;
                                if (inviteCallId === otherCallId) {
                                    taskMsgList.push(item);
                                }
                                else {
                                    break;
                                }
                            }
                            // 找出 msgBufferList 中已消费的消息最大 index
                            const delIndex = this._msgBufferList.findIndex(item => item.msg.messageUId === taskMsgList[taskMsgList.length - 1].messageUId);
                            // 删除消费过 msgBufferList 的消息
                            this._msgBufferList = this._msgBufferList.slice(delIndex + 1, this._msgBufferList.length + 1);
                            // 找出 offlineMsgs 中已消费的消息最大 index
                            const delOfflineIndex = offlineMsgs.indexOf(taskMsgList[taskMsgList.length - 1]);
                            // 删除消费过 offlineMsgs 的消息
                            offlineMsgs = offlineMsgs.slice(delOfflineIndex + 1, offlineMsgs.length + 1);
                            /**
                             * 单聊离线处理逻辑
                             * 如果消息在 60s 内，判断是否未成对（只有 invite 或只有 invite 或 ringing 成对抛给 离线记录器，未成对抛给状态机
                             */
                            const isOnlyInvite = taskMsgList.length === 1;
                            const hasInviteAndRinging = taskMsgList.every(item => {
                                return [RCCallMessageType.VCInvite, RCCallMessageType.VCModifyMedia, RCCallMessageType.VCRinging].includes(item.messageType);
                            });
                            const isLessThanOfflineMsgItv = Date.now() - sentTime < this._offlineMsgItv;
                            const isPrivate = conversationType === engine.ConversationType.PRIVATE;
                            if (isPrivate && isLessThanOfflineMsgItv && (isOnlyInvite || hasInviteAndRinging)) {
                                taskMsgList.forEach(message => {
                                    this._onRecvOnlineCallMsg(message);
                                });
                            }
                            /**
                             * 群成对判断逻辑
                             * 通过 list 中 invite 和 memberModify 消息中取出所有参与通话的 userId
                             * 遍历 list 找出所有 hangup 的 sendUserId
                             *     总人数 - 挂断人数 > 1  且剩余人数包含自己，认为通话未挂断进状态机
                             *     总人数 - 挂断人数 <= 1 通话挂断，进离线消息处理器
                             *     主叫直接挂断且其他人未接听直接进离线处理器
                             */
                            if (conversationType === engine.ConversationType.GROUP) {
                                let allUserIds = [senderUserId, ...inviteUserIds];
                                let noOneAccept = true;
                                let isCallerHungup = false;
                                for (let i = 0; i < taskMsgList.length; i++) {
                                    const { senderUserId: taskMsgSenderUserId, messageType } = taskMsgList[i];
                                    if (messageType === RCCallMessageType.VCHangup) {
                                        // 过滤出挂断的用户
                                        allUserIds = allUserIds.filter(userId => userId !== taskMsgSenderUserId);
                                        isCallerHungup = senderUserId === taskMsgSenderUserId;
                                    }
                                    if (messageType === RCCallMessageType.VCAccept) {
                                        noOneAccept = false;
                                    }
                                }
                                const isIncludeCurrentUser = allUserIds.includes(this._context.getCurrentId());
                                if (isLessThanOfflineMsgItv) {
                                    if ((isIncludeCurrentUser && allUserIds.length > 1) && !(noOneAccept && isCallerHungup)) {
                                        taskMsgList.forEach(message => {
                                            this._onRecvOnlineCallMsg(message);
                                        });
                                    }
                                }
                            }
                            this._offlineRecorder.onRecvOfflineMsgs(taskMsgList);
                        }
                        else {
                            offlineBuffers.shift();
                            this._msgBufferList.shift();
                            this._logger.debug(`[CallMessageHandler] unexcepted offline msg -> ${JSON.stringify(offlineMsgs[0])}`);
                        }
                    } while (offlineMsgs.length > 0);
                }
                else {
                    // 在线消息处理逻辑
                    list.forEach(item => {
                        this._onRecvOnlineCallMsg(item);
                    });
                    // 找出 msgBufferList 中已消费的消息最大 index
                    const delIndex = this._msgBufferList.findIndex(item => item.msg.messageUId === list[list.length - 1].messageUId);
                    // 删除消费过的消息
                    this._msgBufferList = this._msgBufferList.slice(delIndex + 1, this._msgBufferList.length + 1);
                }
                this._handleBufferMsgs();
            }, 20);
        }
        registerEventListener(listener) {
            Object.assign(this._watchers, listener);
        }
        registerStateMachineEvent(callId, funcName, event) {
            const eventType = callId + funcName;
            super.on(eventType, event);
        }
        unregisterStateMachineEvent(callId) {
            ['onRinging', 'onAccept', 'onHungup', 'onMediaModify'].forEach(funcName => {
                const eventType = callId + funcName;
                super.removeAll(eventType);
            });
        }
        registerUserInfo(userInfo) {
            this._userInfo = userInfo;
        }
        /**
         * 发送 IM 消息
         */
        async _sendCallMessage(options) {
            this._logger.debug(`CallMessageHandler] sendCallMesage -> message: ${JSON.stringify(options)}`);
            const { channelId, conversationType, targetId, content, messageType, directionalUserIdList, pushTitle, pushData } = options;
            const sendOpts = {
                channelId,
                messageType,
                content,
                directionalUserIdList
            };
            let pushConfig = {};
            if ([RCCallMessageType.VCInvite, RCCallMessageType.VCModifyMem].includes(messageType)) {
                pushConfig = {
                    pushTitle: pushTitle,
                    pushContent: pushData,
                    pushData
                };
                Object.assign(sendOpts, { pushConfig });
            }
            const { code, data: message } = await this._context.sendMessage(conversationType, targetId, sendOpts);
            if (code !== engine.ErrorCode.SUCCESS) {
                this._logger.error(`CallMessageHandler] sendCallMesage error -> code: ${code}`);
                return {
                    code: EngineErrorCodeToCallErrorCode[code] || exports.RCCallErrorCode.SEND_MSG_ERROR
                };
            }
            return { code: exports.RCCallErrorCode.SUCCESS, message };
        }
        /**
         * 发送邀请消息
         */
        async sendInvite(options) {
            const { channelId, conversationType, targetId, callId, mediaType, inviteUserIds } = options;
            this._watchers.sendAccept && this._watchers.sendAccept({ callId });
            const content = {
                platform: Platform.WEB,
                deviceId: getDeviceId(),
                callId,
                engineType: 4,
                channelInfo: { Id: callId, Key: '' },
                mediaType,
                inviteUserIds,
                observerUserIds: [],
                user: this._userInfo
            };
            return this._sendCallMessage({
                channelId,
                conversationType,
                targetId,
                content,
                messageType: RCCallMessageType.VCInvite,
                directionalUserIdList: conversationType === engine.ConversationType.GROUP ? inviteUserIds : [targetId],
                pushTitle: mediaType === exports.RCCallMediaType.AUDIO_VIDEO ? Local.get().PushTitle.VIDEO : Local.get().PushTitle.AUDIO,
                pushData: JSON.stringify({
                    mediaType,
                    userIdList: inviteUserIds,
                    callId
                })
            });
        }
        /**
         * 发送人员变更消息
         */
        async sendMemeberModify(options) {
            const { channelId, conversationType, targetId, callId, mediaType, inviteUserIds, callerId, existedUserPofiles } = options;
            const content = {
                platform: Platform.WEB,
                deviceId: getDeviceId(),
                callId,
                engineType: 4,
                channelInfo: { Id: callId, Key: '' },
                mediaType,
                inviteUserIds,
                observerUserIds: [],
                user: this._userInfo,
                caller: callerId,
                modifyMemType: MemberModifyType.ADD,
                existedUserPofiles
            };
            return this._sendCallMessage({
                channelId,
                conversationType,
                targetId,
                content,
                messageType: RCCallMessageType.VCModifyMem,
                directionalUserIdList: inviteUserIds,
                pushTitle: mediaType === exports.RCCallMediaType.AUDIO_VIDEO ? Local.get().PushTitle.VIDEO : Local.get().PushTitle.AUDIO,
                pushData: JSON.stringify({
                    mediaType,
                    userIdList: inviteUserIds,
                    callId
                })
            });
        }
        /**
         * 发送响铃消息
         */
        sendRinging(options) {
            const { channelId, conversationType, targetId, callId, userIds } = options;
            const content = {
                platform: Platform.WEB,
                deviceId: getDeviceId(),
                callId,
                user: this._userInfo
            };
            return this._sendCallMessage({
                channelId,
                conversationType,
                targetId,
                content,
                messageType: RCCallMessageType.VCRinging,
                directionalUserIdList: userIds
            });
        }
        /**
         * 发送同意接听消息
         */
        sendAccept(options) {
            const { channelId, conversationType, targetId, callId, mediaType, userIds } = options;
            const content = {
                platform: Platform.WEB,
                deviceId: getDeviceId(),
                callId,
                mediaType,
                user: this._userInfo
            };
            return this._sendCallMessage({
                channelId,
                conversationType,
                targetId,
                content,
                messageType: RCCallMessageType.VCAccept,
                directionalUserIdList: userIds
            });
        }
        /**
         * 发送挂断消息
         */
        sendHungup(options) {
            const { channelId, conversationType, targetId, callId, reason, userIds } = options;
            const content = {
                platform: Platform.WEB,
                deviceId: getDeviceId(),
                callId,
                reason,
                user: this._userInfo
            };
            return this._sendCallMessage({
                channelId,
                conversationType,
                targetId,
                content,
                messageType: RCCallMessageType.VCHangup,
                pushData: JSON.stringify({
                    callId, reason
                }),
                directionalUserIdList: userIds
            });
        }
        /**
         * 发送媒体变更消息
         */
        sendMediaModify(options) {
            const { channelId, conversationType, targetId, callId, mediaType, userIds } = options;
            const content = {
                platform: Platform.WEB,
                deviceId: getDeviceId(),
                callId,
                mediaType,
                user: this._userInfo
            };
            return this._sendCallMessage({
                channelId,
                conversationType,
                targetId,
                content,
                messageType: RCCallMessageType.VCModifyMedia,
                directionalUserIdList: userIds
            });
        }
    }

    class RCCallEngine {
        /**
         * 初始化
         */
        constructor(
        /**
         * engine PlguinContext 实例
         */
        _context, 
        /**
         * engine 日志模块实例，由 CallLib 层初始化
         */
        _logger, 
        /**
         * 监听方法
         */
        _watchers, 
        /**
         * 其他配置项
         */
        _options) {
            this._context = _context;
            this._logger = _logger;
            this._watchers = _watchers;
            this._options = _options;
            this._stateMachine = {};
            this._logger.warn(`RCCallEngine Version: ${"5.0.1-alpha.12"} CommitId: ${"f5e5a46fcef855cbe9b4d8ac76c43210ed92866f"}`);
            // 监听 IM 消息
            this._callMsgHandler = new CallMessageHandler(this._context, this._logger, this._options.offlineMsgItv);
            // 注册消息模块监听
            this._callMsgHandler.registerEventListener({
                onInvite: this._onInvite.bind(this),
                sendAccept: this._handleSendAccept.bind(this),
                onOfflineRecord: this._watchers.onOfflineRecord
            });
            // 监听状态机关闭
            eventEmitter.on('onStateMachineClose', (callId) => {
                delete this._stateMachine[callId];
            });
            // 设置语言
            Local.set(_options.lang);
        }
        _onInvite(msg) {
            const { channelId, conversationType, targetId, content, messageType, senderUserId } = msg;
            const { mediaType, callId } = content;
            if (this._context.getCurrentId() === senderUserId) { // 多端处理
                return;
            }
            const stateMachine = this._stateMachine[callId];
            if (!stateMachine) {
                this._stateMachine[callId] = new RCCallStateMachine(this._context, this._logger, this._callMsgHandler, channelId, conversationType, targetId, mediaType, callId);
                this._logger.info(`[RCCallEngine] RCCallStateMachine successfully created -> callId: ${callId}`);
                if (messageType === RCCallMessageType.VCInvite) {
                    // 状态机内部处理 invite 消息
                    this._stateMachine[callId].__onInvite(msg);
                }
                else if (messageType === RCCallMessageType.VCModifyMem) {
                    this._stateMachine[callId].__onMemberModify(msg);
                }
                this._watchers.onInvite(this._stateMachine[callId]);
                const hasOtherStateMachine = Object.keys(this._stateMachine).filter(otherCallId => callId !== otherCallId).length > 0;
                if (hasOtherStateMachine && !(this._options.isAllowAcceptNewCall || false)) {
                    this._stateMachine[callId].__handleInviteInSession();
                }
            }
        }
        /**
         * 允许接听新的通话时，接听完新的通话后，挂断其他通话
         */
        _handleSendAccept(info) {
            if (this._options.isAllowAcceptNewCall) {
                const { callId } = info;
                for (const id in this._stateMachine) {
                    if (callId !== id) {
                        this._stateMachine[id].hungup();
                        delete this._stateMachine[id];
                    }
                }
            }
        }
        /**
         * 注册用户信息, 发送 call 消息时用户信息携带
         */
        registerUserInfo(userInfo) {
            this._logger.debug(`[RCCallEngine] registerUserInfo -> userInfo: ${JSON.stringify(userInfo)}`);
            this._callMsgHandler.registerUserInfo(userInfo);
        }
        /**
         * 单呼
         * @param channelId 组织 ID
         * @param targetId  对方 ID
         * @param mediaType 媒体类型
         */
        async call(channelId, targetId, mediaType) {
            this._logger.debug(`[RCCallEngine] call -> args: ${JSON.stringify({ channelId, targetId, mediaType })}`);
            const callId = generateRandomId();
            const hasStateMachine = Object.keys(this._stateMachine).length > 0;
            if (hasStateMachine) {
                return { code: exports.RCCallErrorCode.STATE_MACHINE_EXIT };
            }
            this._stateMachine[callId] = new RCCallStateMachine(this._context, this._logger, this._callMsgHandler, channelId, engine.ConversationType.PRIVATE, targetId, mediaType, callId);
            const { code } = await this._stateMachine[callId].__call([targetId]);
            if (code === exports.RCCallErrorCode.SUCCESS) {
                return {
                    code: exports.RCCallErrorCode.SUCCESS,
                    stateMachine: this._stateMachine[callId]
                };
            }
            return { code };
        }
        /**
         * 群呼
         * @param channelId 组织 ID
         * @param targetId  群组 ID
         * @param mediaType 媒体类型
         * @param userIds 被邀请人员列表
         */
        async callInGroup(channelId, targetId, mediaType, userIds) {
            this._logger.debug(`[RCCallEngine] callInGroup -> args: ${JSON.stringify({ channelId, targetId, mediaType })}`);
            const callId = generateRandomId();
            const hasStateMachine = Object.keys(this._stateMachine).length > 0;
            if (hasStateMachine) {
                return { code: exports.RCCallErrorCode.STATE_MACHINE_EXIT };
            }
            this._stateMachine[callId] = new RCCallStateMachine(this._context, this._logger, this._callMsgHandler, channelId, engine.ConversationType.GROUP, targetId, mediaType, callId);
            const { code } = await this._stateMachine[callId].__call(userIds);
            if (code === exports.RCCallErrorCode.SUCCESS) {
                return {
                    code: exports.RCCallErrorCode.SUCCESS,
                    stateMachine: this._stateMachine[callId]
                };
            }
            return { code };
        }
        /**
         * 销毁当前的状态机
         */
        destroy() {
            this._logger.debug('[RCCallEngine] destroy');
            this._stateMachine = {};
        }
    }

    exports.RCCallEngine = RCCallEngine;
    exports.RCCallStateMachine = RCCallStateMachine;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
/*
 * RCCall - v5.0.1-alpha.12
 * CommitId - f73e4dbc4d46ce2169bcfc754906fbc5eccb96f9
 * Sat Sep 18 2021 10:41:31 GMT+0800 (China Standard Time)
 * ©2020 RongCloud, Inc. All rights reserved.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@rongcloud/plugin-call-engine'), require('@rongcloud/engine'), require('@rongcloud/plugin-rtc')) :
    typeof define === 'function' && define.amd ? define(['exports', '@rongcloud/plugin-call-engine', '@rongcloud/engine', '@rongcloud/plugin-rtc'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.RCCall = {}, global.RCCallEngine, global.RCEngine, global.RCRTC));
}(this, (function (exports, pluginCallEngine, engine, pluginRtc) { 'use strict';

    const logger = new engine.Logger('RCCall');

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    /**
     * 产生session的场景
     */
    var ProduceTypes;
    (function (ProduceTypes) {
        /**
         * 主叫
         */
        ProduceTypes[ProduceTypes["CALLER"] = 1] = "CALLER";
        /**
         * 被叫
         */
        ProduceTypes[ProduceTypes["CALLEE"] = 2] = "CALLEE";
    })(ProduceTypes || (ProduceTypes = {}));

    class EventEmitter {
        constructor() {
            this.list = {};
        }
        on(event, fun) {
            (this.list[event] || (this.list[event] = [])).push(fun);
            return this;
        }
        once(event, fun) {
            const on = (data) => {
                this.off(event, on);
                fun.call(this, data);
            };
            on.fun = fun;
            this.on(event, on);
        }
        off(event, fun) {
            const funs = this.list[event];
            if (!funs) {
                return false;
            }
            if (!fun) {
                // 如果没有传 fn 的话，就会将 event 值对应缓存列表中的 fun 都清空
                funs && (funs.length = 0);
            }
            else {
                // 若有 fun，遍历缓存列表，看看传入的 fn 与哪个函数相同，如果相同就直接从缓存列表中删掉即可
                let cb;
                for (let i = 0, length = funs.length; i < length; i++) {
                    cb = funs[i];
                    if (cb === fun || cb.fun === fun) {
                        funs.splice(i, 1);
                        break;
                    }
                }
            }
        }
        emit(event, data) {
            // 第一个参数是对应的 event 值，直接用数组的 shift 方法取出
            const funs = [...this.list[event]];
            // 如果缓存列表里没有 fun 就返回 false
            if (!funs || funs.length === 0) {
                return false;
            }
            // 遍历 event 值对应的缓存列表，依次执行 fn
            funs.forEach(fun => {
                fun.call(this, data);
            });
        }
    }

    var eventEmitter = new EventEmitter();

    function isLanguage(val) {
        const values = Object.values(pluginCallEngine.RCCallLanguage);
        return values.includes(val);
    }
    function isJoinType(val) {
        const values = Object.values(engine.RTCJoinType);
        return values.includes(val);
    }
    function isLogLevel(val) {
        const values = Object.values(engine.LogLevel);
        return values.includes(val);
    }
    const validateCallInitOptions = (options) => {
        if (!options) {
            return { result: false, msg: 'Initialization missing parameter -> options' };
        }
        if (typeof options !== 'object') {
            return { result: false, msg: 'Initialization options must be an object' };
        }
        const keyNames = ['rtcClient', 'onSession', 'onSessionClose'];
        const keys = Object.keys(options);
        const missingKeys = [];
        // 校验填项是否都包含，如果哪个不包含就收集起来
        keyNames.forEach((key) => {
            if (!keys.includes(key)) {
                missingKeys.push(key);
            }
        });
        // 如果缺少必填的监听函数或对象
        if (missingKeys.length) {
            return { result: false, msg: `Initialization missing parameter -> "${missingKeys.join(',')}"` };
        }
        if (typeof options.rtcClient !== 'object') {
            return { result: false, msg: 'Initialization \'rtcClient\' parameter must be of type \'object\'' };
        }
        if (typeof options.onSession !== 'function') {
            return { result: false, msg: 'Initialization \'onSession\' parameter must be of type \'function\'' };
        }
        if (typeof options.onSessionClose !== 'function') {
            return { result: false, msg: 'Initialization \'onSessionClose\' parameter must be of type \'function\'' };
        }
        // 如果传了isAllowSubscribeRetry 但不是boolean类型
        if (typeof options.isAllowSubscribeRetry !== 'undefined' && typeof options.isAllowSubscribeRetry !== 'boolean') {
            return { result: false, msg: 'Initialization \'isAllowSubscribeRetry\' parameter must be of type \'boolean\'' };
        }
        // 如果传了，但不是boolean类型
        if (typeof options.isAllowPublishRetry !== 'undefined' && typeof options.isAllowPublishRetry !== 'boolean') {
            return { result: false, msg: 'Initialization \'isAllowPublishRetry\' parameter must be of type \'boolean\'' };
        }
        // 如果传了，但不是boolean类型
        if (typeof options.isOffCameraWhenVideoDisable !== 'undefined' && typeof options.isOffCameraWhenVideoDisable !== 'boolean') {
            return { result: false, msg: 'Initialization \'isOffCameraWhenVideoDisable\' parameter must be of type \'boolean\'' };
        }
        // 如果传了，但不是RTCJoinType的枚举
        if (typeof options.joinType !== 'undefined' && !isJoinType(options.joinType)) {
            return { result: false, msg: 'Initialization \'joinType\' parameter must be of type correct type' };
        }
        // 如果传了，但不是boolean类型
        if (typeof options.isAllowDemotionGetStream !== 'undefined' && typeof options.isAllowDemotionGetStream !== 'boolean') {
            return { result: false, msg: 'Initialization \'isAllowDemotionGetStream\' parameter must be of type \'boolean\'' };
        }
        // 如果传了，但不是RCCallLanguage的枚举
        if (typeof options.lang !== 'undefined' && !isLanguage(options.lang)) {
            return { result: false, msg: 'Initialization \'lang\' parameter must be of type correct type' };
        }
        // 如果传了，但不是LogLevel的枚举
        if (typeof options.logLevel !== 'undefined' && !isLogLevel(options.logLevel)) {
            return { result: false, msg: 'Initialization \'logLevel\' parameter must be of type correct type' };
        }
        // 如果传了，但不是function类型
        if (typeof options.logStdout !== 'undefined' && typeof options.logStdout !== 'function') {
            return { result: false, msg: 'Initialization \'logStdout\' parameter must be of type \'function\'' };
        }
        return { result: true };
    };
    /**
     * 校验registerSessionListener参数
     */
    const validateListener = (listener) => {
        if (!listener) {
            return { result: false, msg: 'missing parameter -> listener' };
        }
        if (typeof listener !== 'object') {
            return { result: false, msg: 'listener must be an object' };
        }
        const keyNames = ['onRinging', 'onAccept', 'onHungup', 'onMemberModify', 'onMediaModify', 'onTrackReady'];
        const keys = Object.keys(listener);
        const missingKeys = [];
        keyNames.forEach((key) => {
            if (!keys.includes(key)) {
                missingKeys.push(key);
            }
        });
        if (missingKeys.length) {
            return { result: false, msg: `missing parameter -> "${missingKeys.join(',')}"` };
        }
        if (typeof listener.onRinging !== 'function') {
            return { result: false, msg: '\'onRinging\' parameter must be of type \'function\'' };
        }
        if (typeof listener.onAccept !== 'function') {
            return { result: false, msg: '\'onAccept\' parameter must be of type \'function\'' };
        }
        if (typeof listener.onHungup !== 'function') {
            return { result: false, msg: '\'onHungup\' parameter must be of type \'function\'' };
        }
        if (typeof listener.onMemberModify !== 'function') {
            return { result: false, msg: '\'onMemberModify\' parameter must be of type \'function\'' };
        }
        if (typeof listener.onMediaModify !== 'function') {
            return { result: false, msg: '\'onMediaModify\' parameter must be of type \'function\'' };
        }
        if (typeof listener.onTrackReady !== 'function') {
            return { result: false, msg: '\'onTrackReady\' parameter must be of type \'function\'' };
        }
        return { result: true };
    };
    const validateTargetId = (targetId) => {
        if (targetId && typeof targetId === 'string') {
            return { result: true };
        }
        else {
            return { result: false, msg: '\'targetId\' parameter is required, must be of type \'string\'' };
        }
    };
    const validateMediaType = (mediaType) => {
        if (mediaType === pluginCallEngine.RCCallMediaType.AUDIO || mediaType === pluginCallEngine.RCCallMediaType.AUDIO_VIDEO) {
            return { result: true };
        }
        else {
            return { result: false, msg: '\'mediaType\' parameter is required, must be of type \'RCCallMediaType\'' };
        }
    };
    const validateUserIds = (userIds) => {
        if (!Array.isArray(userIds)) {
            return { result: false, msg: '\'userIds\' parameter is required, must be of type \'string[]\'' };
        }
        if (!userIds.length) {
            return { result: false, msg: '\'userIds\' parameter is required, must be of type \'string[]\'' };
        }
        if (!userIds.every(str => typeof str === 'string' && str.length > 0)) {
            return { result: false, msg: '\'userIds\' parameter is required' };
        }
        return { result: true };
    };
    function isRCFrameRate(val) {
        const arrs = ['FPS_10', 'FPS_15', 'FPS_24', 'FPS_30'];
        return arrs.includes(val);
    }
    function isRCResolution(val) {
        const arrs = ['W176_H132', 'W176_H144', 'W256_H144', 'W320_H180', 'W240_H240', 'W320_H240', 'W480_H360', 'W640_H360', 'W480_H480', 'W640_H480', 'W720_H480', 'W1280_H720', 'W1920_H1080'];
        return arrs.includes(val);
    }
    const validateMediaStreamConstraints = (constraints) => {
        if (constraints && constraints.audio && typeof constraints.audio.micphoneId !== 'undefined' && typeof constraints.audio.micphoneId !== 'string') {
            return { result: false, msg: '\'constraints.audio.micphoneId\' must be of type \'string\'' };
        }
        if (constraints && constraints.audio && typeof constraints.audio.sampleRate !== 'undefined' && typeof constraints.audio.sampleRate !== 'number') {
            return { result: false, msg: '\'constraints.audio.sampleRate\' must be of type \'number\'' };
        }
        if (constraints && constraints.video && typeof constraints.video.cameraId !== 'undefined' && typeof constraints.video.cameraId !== 'string') {
            return { result: false, msg: '\'constraints.video.cameraId\' must be of type \'string\'' };
        }
        // if (constraints && constraints.video && typeof constraints.video.faceMode !== 'undefined' && constraints.video.cameraId !== 'user' && constraints.video.faceMode !== 'environment') {
        //   return { result: false, msg: '\'constraints.video.cameraId\' must be  \'user\' or \'environment\'' }
        // }
        if (constraints && constraints.video && typeof constraints.video.frameRate !== 'undefined' && typeof constraints.video.frameRate !== 'string') {
            return { result: false, msg: '\'constraints.video.frameRate\' must be of type \'string\'' };
        }
        if (constraints && constraints.video && typeof constraints.video.frameRate !== 'undefined' && !isRCFrameRate(constraints.video.frameRate)) {
            return { result: false, msg: '\'frameRate\' value is out of range' };
        }
        if (constraints && constraints.video && typeof constraints.video.resolution !== 'undefined' && typeof constraints.video.resolution !== 'string') {
            return { result: false, msg: '\'constraints.video.frameRate\' must be of type \'string\'' };
        }
        if (constraints && constraints.video && typeof constraints.video.resolution !== 'undefined' && !isRCResolution(constraints.video.resolution)) {
            return { result: false, msg: '\'resolution\' value is out of range' };
        }
        if (constraints && constraints.video && (!constraints.video.frameRate || !constraints.video.resolution)) {
            return { result: false, msg: '\'resolution\' and \'resolution\' is required' };
        }
        return { result: true };
    };

    class RCCallSession {
        constructor(
        /**
         * 状态机实例
         */
        _stateMachine, 
        /**
         * rtc实例
         */
        _rtcClient, 
        /**
         * session的其它选项
         */
        _options = {}) {
            this._stateMachine = _stateMachine;
            this._rtcClient = _rtcClient;
            this._options = _options;
            /**
             * 用户传进来的 对session的监听 (要在RCCallClient的_onInvite里判断，要求执行完onSession必须注册session的监听，所以这里是public)
             */
            this._listener = null;
            /**
             * RTC订阅、发布重试的次数
             */
            this._RETRYCOUNT = 2;
            // 监听状态机
            this._stateMachine.registerEventListener({
                /**
                 * 用户状态变更
                 * @param info
                 */
                onUserStateChange: ({ user, reason }) => {
                    logger.info(`[RCCallSession onUserStateChange] userId->${user === null || user === void 0 ? void 0 : user.userId} state->${user === null || user === void 0 ? void 0 : user.state} reason->${reason}`);
                },
                /**
                 * 房间状态变更
                 * @param
                 */
                onStateChange: (info) => __awaiter(this, void 0, void 0, function* () {
                    const { state, reason } = info;
                    logger.info(`[RCCallSession onStateChange] : state->${state} reason->${reason}`);
                    // 如果在通话中，就加房间
                    if (state === pluginCallEngine.RCCallSessionState.KEEPING) {
                        const roomId = this._stateMachine.getCallId();
                        logger.info(`[RCCallSession onStateChange] roomId: ${roomId}`);
                        try {
                            // 加房间
                            yield this._joinRoom(roomId);
                        }
                        catch (error) {
                            this._exceptionClose(pluginCallEngine.RCCallEndReason.NETWORK_ERROR);
                            logger.error(`[RCCallSession onStateChange] joinRoom throw exception roomId -> ${roomId}`);
                            console.error(error);
                        }
                        /**
                         *  以下三条只要满足一条，状态会变成RCCallSessionState.END
                         *  1、本端用户自己主动挂断
                         *  2、服务端把本端用户踢出RTC房间
                         *  3、房间里小于2个人
                         */
                    }
                    else if (state === pluginCallEngine.RCCallSessionState.END) {
                        // 还未加入房间就挂断
                        if (!this._room) {
                            // 销毁本地流，关闭摄像头
                            this._options.localTracks && this._destroyTracks(this._options.localTracks);
                            const summaryInfo = this._stateMachine.getSummary();
                            eventEmitter.emit('sessionClose', { session: this, summaryInfo });
                            return;
                        }
                        this._options.localTracks && this._destroyTracks(this._options.localTracks);
                        logger.info('[RCCallSession onStateChange] localTracks destroyed');
                        this._leaveRoom();
                        this._room = null;
                    }
                }),
                /**
                 * 收到响铃
                 * @param sender 发起用户信息
                 */
                onRinging: (sender) => {
                    logger.info(`[RCCallSession onRinging]sender: sender.userId -> ${sender.userId}`);
                    try {
                        // 通知用户响铃
                        this._listener.onRinging(sender, this);
                    }
                    catch (error) {
                        logger.error('[RCCallSession onRinging] method exception -> onRinging');
                        console.error(error);
                    }
                },
                /**
                   * 当远端用户同意接听
                   */
                onAccept: (sender) => {
                    logger.info(`[RCCallSession onAccept]sender: sender.userId -> ${sender.userId}`);
                    try {
                        // 通知本端，远端用户已接听
                        this._listener.onAccept(sender, this);
                    }
                    catch (error) {
                        logger.error('[RCCallSession onAccept] method exception -> onAccept');
                        console.error(error);
                    }
                },
                /**
                   * 当有远端用户挂断
                   */
                onHungup: (sender, reason) => {
                    logger.info(`[RCCallSession onHungup]sender: sender.userId -> ${sender.userId} reason->${reason}`);
                    try {
                        // 通知本端，远端用户已挂断
                        this._listener.onHungup(sender, reason, this);
                    }
                    catch (error) {
                        logger.error('[RCCallSession onHungup] method exception -> onHungup');
                        console.error(error);
                    }
                },
                /**
                 * 收到人员变更
                 * @param sender 发起用户信息
                 */
                onMemberModify: ({ sender, invitedUsers }) => {
                    logger.info(`[RCCallSession onMemberModify] sender.userId -> ${sender.userId}`);
                    try {
                        // 通知用户人员变更
                        this._listener.onMemberModify(sender, invitedUsers, this);
                    }
                    catch (error) {
                        logger.error('[RCCallSession onMemberModify] method exception -> onMemberModify');
                        console.error(error);
                    }
                },
                /**
                 * 收到通话类型变更 (通话降级)
                 * @param sender 发起用户信息
                 */
                onMediaModify: ({ sender, mediaType }) => {
                    logger.info(`[RCCallSession onMediaModify]sender: sender.userId -> ${sender.userId} mediaType: ${mediaType}`);
                    if (mediaType === pluginCallEngine.RCCallMediaType.AUDIO) {
                        // 远端收到通话降级通知后，远端执行降级通话(不发消息)
                        this._setMediaTypeToAudio();
                    }
                    try {
                        this._listener.onMediaModify(sender, mediaType, this);
                    }
                    catch (error) {
                        logger.error('[RCCallSession onMediaModify] method exception -> onMediaModify');
                        console.error(error);
                    }
                }
            });
        }
        /**
         *  加入房间
         */
        _joinRoom(roomId) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // 加房间
                    const { code, room } = yield this._rtcClient.joinRTCRoom(roomId, this._options.joinType);
                    if (code !== pluginRtc.RCRTCCode.SUCCESS) {
                        // 如果音视频服务未开通
                        if (code === pluginRtc.RCRTCCode.NOT_OPEN_VIDEO_AUDIO_SERVER) {
                            this._exceptionClose(pluginCallEngine.RCCallEndReason.SERVICE_NOT_OPENED);
                            // 己方其他端已在通话中
                        }
                        if (code === pluginRtc.RCRTCCode.SIGNAL_JOIN_RTC_ROOM_REFUSED) {
                            this._exceptionClose(pluginCallEngine.RCCallEndReason.OTHER_CLIENT_IN_CALL);
                        }
                        else {
                            this._exceptionClose(pluginCallEngine.RCCallEndReason.NETWORK_ERROR);
                        }
                        logger.info(`[RCCallClient _joinRoom] join room failed: roomId -> ${roomId} RCRTCCode -> ${code}`);
                        return { code: pluginCallEngine.RCCallErrorCode.JOIN_ROOM_ERROR };
                    }
                    this._room = room;
                }
                catch (error) {
                    this._exceptionClose(pluginCallEngine.RCCallEndReason.NETWORK_ERROR);
                    logger.error(`[RCCallSession _joinRoom] _rtcClient.joinRTCRoom throw exception roomId -> ${roomId}`);
                    console.error(error);
                    return { code: pluginCallEngine.RCCallErrorCode.JOIN_ROOM_ERROR };
                }
                // 房间上注册监听事件
                this._registerRoomEventListener();
                // 注册房间质量数据监听器
                this._registerReportListener();
                try {
                    // 订阅远程的流，把远程的流抛给用户
                    yield this._subscribeInRoomRemoteTrack();
                }
                catch (error) {
                    // 结束通话session
                    this._exceptionClose(pluginCallEngine.RCCallEndReason.SUBSCRIBE_ERROR);
                    logger.error(`[RCCallSession _joinRoom] _subscribeInRoomRemoteTrack Exception roomId -> ${roomId}`);
                    console.error(error);
                    return { code: pluginCallEngine.RCCallErrorCode.JOIN_ROOM_ERROR };
                }
                try {
                    // 往房间里发布本地资源
                    yield this._publish();
                }
                catch (error) {
                    // 结束通话session
                    this._exceptionClose(pluginCallEngine.RCCallEndReason.PUBLISH_ERROR);
                    logger.error(`[RCCallSession _joinRoom] _publish Exception roomId -> ${roomId}`);
                    console.error(error);
                    return { code: pluginCallEngine.RCCallErrorCode.JOIN_ROOM_ERROR };
                }
                return { code: pluginCallEngine.RCCallErrorCode.SUCCESS };
            });
        }
        /**
         * (初始化房间的时候) 订阅远程的流，把远程的流抛给用户
         */
        _subscribeInRoomRemoteTrack() {
            return __awaiter(this, void 0, void 0, function* () {
                // 获取所有远程已发布的音视频资源列表
                const tracks = this._room.getRemoteTracks();
                if (tracks.length) {
                    const { code } = yield this._subscribeRetry(tracks, this._options.isAllowSubscribeRetry, this._RETRYCOUNT);
                    if (code !== pluginRtc.RCRTCCode.SUCCESS) {
                        this._exceptionClose(pluginCallEngine.RCCallEndReason.SUBSCRIBE_ERROR);
                        logger.error(`[RCCallSession _subscribeInRoomRemoteTrack] Resource subscription failed roomId -> ${this._stateMachine.getCallId()} RTC code -> ${code}`);
                    }
                }
            });
        }
        /**
         * 可以重试的订阅
         * @param params.tracks tracks
         * @param params.isAllowSubscribeRetry 是否允许重试
         * @param params.count 允许重试的次数
         */
        _subscribeRetry(tracks, isAllowSubscribeRetry = false, count = 0) {
            return __awaiter(this, void 0, void 0, function* () {
                const { code } = yield this._room.subscribe(tracks);
                if (code !== pluginRtc.RCRTCCode.SUCCESS) {
                    try {
                        this._listener.onTrackSubscribeFail && this._listener.onTrackSubscribeFail(code, this);
                    }
                    catch (error) {
                        logger.error('[RCCallSession] _listener.onTrackSubscribeFail exception');
                        console.error(error);
                    }
                    // 如果不允许重试，直接返回
                    if (!isAllowSubscribeRetry) {
                        return { code };
                    }
                    if (count > 0) {
                        count--;
                        return this._subscribeRetry(tracks, isAllowSubscribeRetry, count);
                    }
                }
                return { code };
            });
        }
        /**
         * 发布本地资源的逻辑
         *
         */
        _publish() {
            return __awaiter(this, void 0, void 0, function* () {
                const tracks = this._options.localTracks;
                const { code } = yield this._publishRetry(tracks, this._options.isAllowPublishRetry, this._RETRYCOUNT);
                // 若资源发布失败
                if (code !== pluginRtc.RCRTCCode.SUCCESS) {
                    this._exceptionClose(pluginCallEngine.RCCallEndReason.PUBLISH_ERROR);
                    logger.info(`[RCCallSession _publist] Resource publishing failed: roomId -> ${this._stateMachine.getCallId()} RCRTCCode -> ${code}`);
                    return;
                }
                // 如果是主动发起的呼叫，已提前抛出了资源, 被动呼叫，这里才需要抛出
                if (this._options.produceType === ProduceTypes.CALLEE) {
                    // 向外抛出本地流, 通知业务层trackReady
                    this._notifyTrackReady(tracks);
                }
            });
        }
        /**
         * 可以重试的发布
         * @param params.tracks tracks
         * @param params.isAllowPublishRetry 是否允许重试
         * @param params.count 允许重试的次数
         */
        _publishRetry(tracks, isAllowPublishRetry = false, count = 0) {
            return __awaiter(this, void 0, void 0, function* () {
                const { code } = yield this._room.publish(tracks);
                if (code !== pluginRtc.RCRTCCode.SUCCESS) {
                    try {
                        this._listener.onTrackPublishFail && this._listener.onTrackPublishFail(code, this);
                    }
                    catch (error) {
                        logger.error('[RCCallSession] _listener.onTrackPublishFail exception');
                        console.error(error);
                    }
                    // 如果不允许重试，直接返回
                    if (!isAllowPublishRetry) {
                        return { code };
                    }
                    if (count > 0) {
                        count--;
                        return this._publishRetry(tracks, isAllowPublishRetry, count);
                    }
                }
                return { code };
            });
        }
        /**
         * 退出房间
         */
        _leaveRoom() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // 退出房间
                    const { code } = yield this._rtcClient.leaveRoom(this._room);
                    // 成功退出房间，触发RCCallClient实例上的onSessionClose监听，抛给用户信息
                    logger.info('[RCCallSession _leaveRoom] Successfully exited the room');
                }
                catch (error) {
                    logger.error('[RCCallSession _leaveRoom] leaveRoom throw exception');
                    console.error(error);
                }
                finally {
                    const summaryInfo = this._stateMachine.getSummary();
                    eventEmitter.emit('sessionClose', { session: this, summaryInfo });
                }
            });
        }
        /**
         * 出现异常后要处理的逻辑,
         * @param endReason 原因
         */
        _exceptionClose(endReason) {
            // 销毁本地流
            this._options.localTracks && this._destroyTracks(this._options.localTracks);
            // 结束状态机
            this._stateMachine.close(endReason);
        }
        /**
         * 用户调用的，注册session上的监听
         */
        registerSessionListener(listener) {
            // 先校验listener, 如果不通过，会trow error
            const conclusion = validateListener(listener);
            if (!conclusion.result) {
                throw new Error(`[RCCallSession registerSessionListener] ${conclusion.msg}`);
            }
            this._listener = Object.assign({}, listener);
        }
        /**
         * 调RTC API 获得本地流
         */
        _getLocalTrackCore(mediaType, constraints) {
            return __awaiter(this, void 0, void 0, function* () {
                // 检测是否能够获得本地流
                if (mediaType === pluginCallEngine.RCCallMediaType.AUDIO) {
                    const { code, track } = yield this._rtcClient.createMicrophoneAudioTrack('RongCloudRTC', constraints && constraints.audio && Object.assign({}, constraints.audio));
                    if (code !== pluginRtc.RCRTCCode.SUCCESS) {
                        logger.error(`[RCCallSession _getLocalTrackCore] get Audio local tracks failed RCT code -> ${code}`);
                        return { code: pluginCallEngine.RCCallErrorCode.GET_LOCAL_AUDIO_TRACK_ERROR };
                    }
                    logger.info('[RCCallSession _getLocalTrackCore] successfully get Audio local tracks');
                    return { code: pluginCallEngine.RCCallErrorCode.SUCCESS, tracks: [track] };
                }
                else {
                    const { code, tracks } = yield this._rtcClient.createMicrophoneAndCameraTracks('RongCloudRTC', constraints && Object.assign({}, constraints));
                    if (code !== pluginRtc.RCRTCCode.SUCCESS) {
                        logger.error(`[RCCallSession _getLocalTrackCore] get Audio and Video local tracks failed RCT code -> ${code}`);
                        return { code: pluginCallEngine.RCCallErrorCode.GET_LOCAL_AUDIO_AND_VIDEO_TRACK_ERROR };
                    }
                    logger.info('[RCCallSession _getLocalTrackCore] successfully get audio and video local tracks');
                    return { code: pluginCallEngine.RCCallErrorCode.SUCCESS, tracks };
                }
            });
        }
        _getLocalTrack(mediaType, constraints) {
            return __awaiter(this, void 0, void 0, function* () {
                // 并且是获得音视频, 并且 （如果获得音视频不成功，允许降级获得音频）
                if (this._options.isAllowDemotionGetStream && mediaType === pluginCallEngine.RCCallMediaType.AUDIO_VIDEO) {
                    const { code, tracks } = yield this._getLocalTrackCore(pluginCallEngine.RCCallMediaType.AUDIO_VIDEO, constraints);
                    // 如果音视频不能获得，就降级获得音频
                    if (code !== pluginCallEngine.RCCallErrorCode.SUCCESS) {
                        const { code, tracks } = yield this._getLocalTrackCore(pluginCallEngine.RCCallMediaType.AUDIO, constraints);
                        if (code !== pluginCallEngine.RCCallErrorCode.SUCCESS) {
                            // 获取资源失败，需要调状态机state 为 end
                            this._exceptionClose(pluginCallEngine.RCCallEndReason.GET_MEDIA_RESOURCES_ERROR);
                            return { code };
                        }
                        return { code, tracks: tracks };
                    }
                    return { code, tracks: tracks };
                }
                else {
                    const { code: _code, tracks } = yield this._getLocalTrackCore(mediaType, constraints);
                    if (_code !== pluginCallEngine.RCCallErrorCode.SUCCESS) {
                        // 获取资源失败，需要调状态机state 为 end
                        this._exceptionClose(pluginCallEngine.RCCallEndReason.GET_MEDIA_RESOURCES_ERROR);
                        return { code: _code };
                    }
                    return { code: _code, tracks: tracks };
                }
            });
        }
        /**
         * 通话中更换音频设备
         */
        changeAudioDevice(audioConstraints) {
            return __awaiter(this, void 0, void 0, function* () {
                // 新设备的track
                const recentTracks = [];
                // 整理后的本地track
                const localTracks = [];
                const { code, track } = yield this._rtcClient.createMicrophoneAudioTrack('RongCloudRTC', audioConstraints);
                if (code !== pluginRtc.RCRTCCode.SUCCESS) {
                    logger.error(`[RCCallSession changeDevice] get local Audio tracks failed RCTLib code -> ${code}`);
                    return { code: pluginCallEngine.RCCallErrorCode.GET_LOCAL_AUDIO_TRACK_ERROR };
                }
                this._options.localTracks && this._options.localTracks.forEach((track) => {
                    if (track.isAudioTrack()) {
                        // 之前的音频都销毁
                        track.destroy();
                    }
                    else {
                        // 只把之前的视频留下
                        localTracks.push(track);
                    }
                });
                recentTracks.push(track);
                // 加上本地新产生的音频
                localTracks.push(track);
                this._options.localTracks = localTracks;
                // 通知业务层trackReady
                this._notifyTrackReady(recentTracks);
                // 如果当前已加入房间，发布新流
                if (this._room) {
                    // 发布新流
                    const { code } = yield this._room.publish(recentTracks);
                    if (code !== pluginRtc.RCRTCCode.SUCCESS) {
                        return { code: pluginCallEngine.RCCallErrorCode.AUDIO_PUBLISH_ERROR };
                    }
                }
                return { code: pluginCallEngine.RCCallErrorCode.SUCCESS };
            });
        }
        /**
         * 群呼叫中继续邀请
         * @param userIds 被邀请用户 ID 列表
         */
        invite(userIds) {
            return __awaiter(this, void 0, void 0, function* () {
                const conversationType = this._stateMachine.getConversationType();
                // 如果当前不是群组通话，直接返回错误码
                if (conversationType !== engine.ConversationType.GROUP) {
                    return { code: pluginCallEngine.RCCallErrorCode.CONVERSATION_NOT_GROUP_ERROR };
                }
                const conclusion = validateUserIds(userIds);
                if (!conclusion.result) {
                    throw new Error(`[RCCallSession invite] ${conclusion.msg}`);
                }
                const { code } = yield this._stateMachine.invite(userIds);
                return { code };
            });
        }
        /**
         * 同意接听
         */
        accept(constraints) {
            return __awaiter(this, void 0, void 0, function* () {
                const conclusion = validateMediaStreamConstraints(constraints);
                if (!conclusion.result) {
                    throw new Error(`[RCCallSession accept] ${conclusion.msg}`);
                }
                // 接听之前，先挂断当前之外的session，现阶段不允许用户先择接听session，事先会在状态机内部挂断，这里抛出去，会清理其它的seesion
                eventEmitter.emit('hungupOtherSession', { session: this });
                const mediaType = this._stateMachine.getMediaType();
                const { code: _code, tracks } = yield this._getLocalTrack(mediaType, constraints);
                if (_code !== pluginCallEngine.RCCallErrorCode.SUCCESS) {
                    return { code: _code };
                }
                this._options.localTracks = tracks;
                // 发送接听的消息
                const { code } = yield this._stateMachine.accept();
                if (code !== pluginCallEngine.RCCallErrorCode.SUCCESS) {
                    logger.error(`[RCCallSession accept]Send accept message failed -> code: ${code}`);
                    return { code };
                }
                return { code };
            });
        }
        /**
         * 挂断
         */
        hungup() {
            return __awaiter(this, void 0, void 0, function* () {
                return this._stateMachine.hungup();
            });
        }
        /**
         * 通话媒体变更
         *  @param mediaType RCCallMediaType.AUDIO 改为音频通话 | RCCallMediaType.AUDIO_VIDEO 改为音视频通话
         */
        _changeMediaType(mediaType) {
            return __awaiter(this, void 0, void 0, function* () {
                const { code } = yield this._stateMachine.changeMediaType(mediaType);
                if (code !== pluginCallEngine.RCCallErrorCode.SUCCESS) {
                    logger.error(`[RCCallSession _changeMediaType] change media type fail code-> ${code}`);
                }
                return { code };
            });
        }
        /**
         * 获得本地视频
         */
        _getLocalVideoTracks() {
            let localVideoTracks = [];
            if (!this._room) {
                return localVideoTracks;
            }
            if (this._options.localTracks) {
                localVideoTracks = this._options.localTracks.filter((track) => {
                    return track.isVideoTrack();
                });
            }
            return localVideoTracks;
        }
        /**
         * 获得本地音频
         */
        _getLocalAudioTracks() {
            let localAudiotracks = [];
            if (!this._room) {
                return localAudiotracks;
            }
            if (this._options.localTracks) {
                localAudiotracks = this._options.localTracks.filter((track) => {
                    return track.isAudioTrack();
                });
            }
            return localAudiotracks;
        }
        /**
         * 把通话的MediaType升级到音视频
         */
        _setMediaTypeToAudioAndVideo() {
            return __awaiter(this, void 0, void 0, function* () {
                // 获得本端视频资源
                const { code, track } = yield this._rtcClient.createCameraVideoTrack();
                if (code !== pluginRtc.RCRTCCode.SUCCESS) {
                    return { code: pluginCallEngine.RCCallErrorCode.GET_LOCAL_AUDIO_AND_VIDEO_TRACK_ERROR };
                }
                // 发布本端视频资源
                const { code: _code } = yield this._room.publish([track]);
                // 若资源发布失败
                if (_code !== pluginRtc.RCRTCCode.SUCCESS) {
                    logger.error(`[RCCallSession _enableVideo] Resource publishing failed: RCRTCCode -> ${code}`);
                    return;
                }
                // 通知业务层trackReady
                this._notifyTrackReady([track]);
                // 发消息
                this._changeMediaType(pluginCallEngine.RCCallMediaType.AUDIO_VIDEO);
            });
        }
        /**
         * 把通话的MediaType降级到音频
         * @param isSendMesssage 是否需要发消息, 默认发消息
         */
        _setMediaTypeToAudio() {
            return __awaiter(this, void 0, void 0, function* () {
                const tracks = this._getLocalVideoTracks();
                if (tracks.length) {
                    // 禁用视频
                    tracks.forEach((track) => {
                        track.mute();
                    });
                    // 取消发布视频
                    const { code } = yield this._room.unpublish(tracks);
                    if (code !== pluginRtc.RCRTCCode.SUCCESS) {
                        logger.error(`[RCCallSession disableVideo] unpublish failed -> ${code}`);
                    }
                    // 关闭摄像头
                    this._destroyTracks(tracks);
                }
            });
        }
        /**
         * 通话降级，目前需求只做通话降级，音视频可以降级为音频，音频不能升到音视频, 发消息成功才算降级成功
         *
         */
        descendAbility() {
            return __awaiter(this, void 0, void 0, function* () {
                const { code } = yield this._changeMediaType(pluginCallEngine.RCCallMediaType.AUDIO);
                if (code === pluginCallEngine.RCCallErrorCode.SUCCESS) {
                    this._setMediaTypeToAudio();
                }
                return { code };
            });
        }
        /**
         * 禁用视频track
         */
        disableVideoTrack() {
            return __awaiter(this, void 0, void 0, function* () {
                const tracks = this._getLocalVideoTracks();
                if (!tracks.length) {
                    logger.error(`[RCCallSession disableVideoTrack] Room missing video track -> ${pluginCallEngine.RCCallErrorCode.MISSING_VIDEO_TRACK_ERROR}`);
                    return { code: pluginCallEngine.RCCallErrorCode.MISSING_VIDEO_TRACK_ERROR };
                }
                // 禁用视频
                tracks.forEach((track) => {
                    track.mute();
                });
                // 如果不需关闭摄像头
                if (!this._options.isOffCameraWhenVideoDisable) {
                    return { code: pluginCallEngine.RCCallErrorCode.SUCCESS };
                }
                // 取消发布视频
                const { code } = yield this._room.unpublish(tracks);
                if (code !== pluginRtc.RCRTCCode.SUCCESS) {
                    logger.error(`[RCCallSession disableVideo] unpublish failed -> ${code}`);
                    return { code: pluginCallEngine.RCCallErrorCode.UNPUBLISH_VIDEO_ERROR };
                }
                tracks.forEach((track) => {
                    // 关闭摄像头
                    track.destroy();
                });
                return { code: pluginCallEngine.RCCallErrorCode.SUCCESS };
            });
        }
        /**
         * 启用视频track
         */
        enableVideoTrack() {
            return __awaiter(this, void 0, void 0, function* () {
                // 如果不需关闭摄像头
                if (!this._options.isOffCameraWhenVideoDisable) {
                    const tracks = this._getLocalVideoTracks();
                    if (!tracks.length) {
                        logger.error(`[RCCallSession EnableVideoTrack] Room missing video track -> ${pluginCallEngine.RCCallErrorCode.MISSING_VIDEO_TRACK_ERROR}`);
                        return { code: pluginCallEngine.RCCallErrorCode.MISSING_VIDEO_TRACK_ERROR };
                    }
                    // 启用视频
                    tracks.forEach((track) => {
                        track.unmute();
                    });
                    return { code: pluginCallEngine.RCCallErrorCode.SUCCESS };
                }
                // 获得本端视频资源
                const { code, track } = yield this._rtcClient.createCameraVideoTrack();
                if (code !== pluginRtc.RCRTCCode.SUCCESS) {
                    logger.error(`[RCCallSession EnableVideoTrack] Get Resource failed: RCRTCCode -> ${code}`);
                    return { code: pluginCallEngine.RCCallErrorCode.GET_LOCAL_VIDEO_TRACK_ERROR };
                }
                const localTracks = [];
                this._options.localTracks && this._options.localTracks.forEach((track) => {
                    if (track.isVideoTrack()) {
                        // 之前的视频都销毁
                        track.destroy();
                    }
                    else {
                        // 只留下之前的音频
                        localTracks.push(track);
                    }
                });
                // 加上本地新产生的视频
                localTracks.push(track);
                this._options.localTracks = localTracks;
                // 为了触发对方的onVideoMuteChange 先禁用
                track.mute();
                // 发布本端视频资源
                const { code: _code } = yield this._room.publish([track]);
                // 若资源发布失败
                if (_code !== pluginRtc.RCRTCCode.SUCCESS) {
                    logger.error(`[RCCallSession EnableVideoTrack] Resource publishing failed: RCRTCCode -> ${code}`);
                    return { code: pluginCallEngine.RCCallErrorCode.VIDEO_PUBLISH_ERROR };
                }
                // 启用
                track.unmute();
                // 通知业务层trackReady
                this._notifyTrackReady([track]);
                return { code: pluginCallEngine.RCCallErrorCode.SUCCESS };
            });
        }
        /**
         * 禁用音频track
         */
        disableAudioTrack() {
            return __awaiter(this, void 0, void 0, function* () {
                const tracks = this._getLocalAudioTracks();
                // 禁用音频
                tracks.forEach((track) => {
                    track.mute();
                });
            });
        }
        /**
         * 启用音频track
         */
        enableAudioTrack() {
            return __awaiter(this, void 0, void 0, function* () {
                const tracks = this._getLocalAudioTracks();
                // 启用音频
                tracks.forEach((track) => {
                    track.unmute();
                });
            });
        }
        /**
         * 销毁本地流
         */
        _destroyTracks(tracks) {
            tracks.forEach((track) => {
                track.destroy();
            });
        }
        /**
         * 向外抛出本地流
         */
        _notifyTrackReady(tracks) {
            tracks.forEach((track) => {
                try {
                    this._listener.onTrackReady(track, this);
                }
                catch (error) {
                    logger.error('[RCCallSession _notifyTrackReady] _listener onTrackReady exception');
                    console.error(error);
                }
            });
        }
        /**
         * 房间上注册事件
         */
        _registerRoomEventListener() {
            this._room.registerRoomEventListener({
                /**
                 * 本端被踢出房间时触发
                 * @description 被踢出房间可能是由于服务端超出一定时间未能收到 rtcPing 消息，所以认为己方离线。
                 * 另一种可能是己方 rtcPing 失败次数超出上限，故而主动断线
                 * @param byServer
                 * 当值为 false 时，说明本端 rtcPing 超时
                 * 当值为 true 时，说明本端收到被踢出房间通知
                 */
                onKickOff: (byServer, state) => {
                    const currentUserId = this._rtcClient.getCurrentId();
                    this._stateMachine.userLeave([currentUserId]);
                    if (!byServer) {
                        this._exceptionClose(pluginCallEngine.RCCallEndReason.NETWORK_ERROR);
                    }
                    else {
                        if (state === pluginRtc.RCKickReason.SERVER_KICK) {
                            this._exceptionClose(pluginCallEngine.RCCallEndReason.KICKED_BY_SERVER);
                        }
                        if (state === pluginRtc.RCKickReason.OTHER_KICK) {
                            this._exceptionClose(pluginCallEngine.RCCallEndReason.OTHER_CLIENT_JOINED_CALL);
                        }
                    }
                },
                /**
                 * 接收到房间信令时回调，用户可通过房间实例的 `sendMessage(name, content)` 接口发送信令
                 * @param name 信令名
                 * @param content 信令内容
                 * @param senderUserId 发送者 Id
                 * @param messageUId 消息唯一标识
                 */
                onMessageReceive(name, content, senderUserId, messageUId) {
                },
                /**
                 * 监听房间属性变更通知
                 * @param name
                 * @param content
                 */
                onRoomAttributeChange(name, content) {
                },
                /**
                 * 发布者禁用/启用音频
                 * @param audioTrack RCRemoteAudioTrack 类实例
                 */
                onAudioMuteChange: (audioTrack) => {
                    logger.info(`[RCCallSession onAudioMuteChange] userId->${audioTrack.getUserId()} muted -> ${audioTrack.isOwnerMuted()}`);
                    const muteUser = {
                        userId: audioTrack.getUserId(),
                        muted: audioTrack.isOwnerMuted(),
                        kind: 'audio',
                        trackId: audioTrack.getTrackId()
                    };
                    try {
                        // 通知给业务
                        this._listener.onAudioMuteChange(muteUser, this);
                    }
                    catch (error) {
                        logger.error('[RCCallSession onAudioMuteChange] Missing listening method -> onTrackMuteChange');
                        console.error(error);
                    }
                },
                /**
                 * 发布者禁用/启用视频
                 * @param videoTrack RCRemoteVideoTrack 类实例对象
                 */
                onVideoMuteChange: (videoTrack) => {
                    logger.info(`[RCCallSession onVideoMuteChange]userId->${videoTrack.getUserId()} muted -> ${videoTrack.isOwnerMuted()}`);
                    const muteUser = {
                        userId: videoTrack.getUserId(),
                        muted: videoTrack.isOwnerMuted(),
                        kind: 'video',
                        trackId: videoTrack.getTrackId()
                    };
                    try {
                        // 通知给业务
                        this._listener.onVideoMuteChange(muteUser, this);
                    }
                    catch (error) {
                        logger.error('[RCCallSession onVideoMuteChange] Missing listening method -> onVideoMuteChange');
                        console.error(error);
                    }
                },
                /**
                 * 房间内其他用户新发布资源时触发
                 * 如需获取加入房间之前房间内某个用户发布的资源列表，可使用 room.getRemoteTracksByUserId('userId') 获取
                 * @param tracks 新发布的音轨与视轨数据列表，包含新发布的 RCRemoteAudioTrack 与 RCRemoteVideoTrack 实例
                 */
                onTrackPublish: (tracks) => __awaiter(this, void 0, void 0, function* () {
                    // 退出房间后，还会走到这？？，所以判断一下，没有room不执行订阅
                    if (this._room) {
                        // 按业务需求选择需要订阅资源，通过 room.subscribe 接口进行订阅
                        const { code } = yield this._room.subscribe(tracks);
                        if (code !== pluginRtc.RCRTCCode.SUCCESS) {
                            logger.error(`[RCCallSession onTrackPublish] subscribe failed RTCCode ->${code}`);
                        }
                    }
                }),
                /**
                 * 房间用户取消发布资源
                 * @param tracks 被取消发布的音轨与视轨数据列表
                 * @description 当资源被取消发布时，SDK 内部会取消对相关资源的订阅，业务层仅需处理 UI 业务
                 */
                onTrackUnpublish: (tracks) => {
                },
                /**
                 * 订阅的音视频流通道已建立, track 已可以进行播放
                 * @param track RCRemoteTrack 类实例
                 */
                onTrackReady: (track) => {
                    const mediaType = this._stateMachine.getMediaType();
                    // 有时对方没有降级成功，扔抛过来视频，这时的视频不对外抛出
                    if (mediaType === pluginCallEngine.RCCallMediaType.AUDIO && track.isVideoTrack()) {
                        return;
                    }
                    // 执行用户的onTrackReady监听
                    this._notifyTrackReady([track]);
                },
                /**
                 * 人员加入
                 * @param userIds 加入的人员 id 列表
                 */
                onUserJoin: (userIds) => {
                    this._stateMachine.userJoin(userIds);
                },
                /**
                 * 人员退出
                 * @param userIds
                 */
                onUserLeave: (userIds) => {
                    logger.info(`[RCCallSession onUserLeave] listening onUserLeave userIds -> ${userIds === null || userIds === void 0 ? void 0 : userIds.join(',')}`);
                    this._stateMachine.userLeave(userIds);
                },
                /**
                 * RTC 每次 Ping 结果
                 */
                onPing: (result) => {
                    logger.info(`[RCCallSession onPing]${result}`);
                    try {
                        // 通知给业务
                        this._listener.onPing && this._listener.onPing(result, this);
                    }
                    catch (error) {
                        logger.error('[RCCallSession onPing] listening onPing exception');
                        console.error(error);
                    }
                }
            });
        }
        /**
         * 注册房间质量数据监听器
         */
        _registerReportListener() {
            // 注册房间质量数据监听器
            this._room.registerReportListener({
                /**
                 * 用于接收状态数据报告
                 * @param report
                 */
                onStateReport: (report) => {
                    try {
                        this._listener.onRTCStateReport && this._listener.onRTCStateReport(report, this);
                    }
                    catch (error) {
                        logger.error('[RCCallSession onStateReport] listener onStateReport exception');
                        console.error(error);
                    }
                },
                /**
                 * ~ICE 连接状态变更通知~
                 * @since version 5.1.5
                 */
                onICEConnectionStateChange: (state) => {
                    try {
                        this._listener.onICEConnectionStateChange && this._listener.onICEConnectionStateChange(state, this);
                    }
                    catch (error) {
                        logger.error('[RCCallSession onICEConnectionStateChange] onICEConnectionStateChange exception');
                        console.error(error);
                    }
                }
            });
        }
        /**
         *  通话唯一标识
         */
        getSessionId() {
            return this._stateMachine.getCallId();
        }
        /**
         *  获取房间当前会话 Id，当房间内已无成员时房间会回收，重新加入时 sessionId 将更新，(用户录制资源用的)
         */
        getRTCSessionId() {
            return this._room.getSessionId();
        }
        /**
         *  目标 ID，单呼对方人员 Id, 群呼群组 Id
         */
        getTargetId() {
            return this._stateMachine.getTargetId();
        }
        /**
         *  获取会话类型
         */
        getConversationType() {
            return this._stateMachine.getConversationType();
        }
        /**
         *  组织 ID
         */
        getChannelId() {
            return this._stateMachine.getChannelId();
        }
        /**
         * 房间人员列表，不包含本端信息
         */
        getRemoteUsers() {
            return this._stateMachine.getRemoteUsers();
        }
        /**
         * 获取人员状态
         */
        getUserState(userId) {
            if (!userId || typeof userId !== 'string') {
                throw new Error('userId is required, must be of type \'string\'');
            }
            return this._stateMachine.getUserState(userId);
        }
        /**
         * 获取session状态
         */
        getState() {
            return this._stateMachine.getState();
        }
        /**
         * 获得会话发起者id
         */
        getCallerId() {
            return this._stateMachine.getCallerId();
        }
        /**
         * 获得mediaType
         */
        getMediaType() {
            return this._stateMachine.getMediaType();
        }
    }

    class RCCallClient {
        constructor(_context, _runtime, _options) {
            this._context = _context;
            this._runtime = _runtime;
            /**
             * session列表
             */
            this._sessionList = [];
            this._rtcClient = _options.rtcClient;
            this._options = Object.assign({
                /**
                 * 是否允许发布重试， 默认不允许
                 */
                isAllowPublishRetry: false,
                /**
                 * 是否允许订阅重试，默认不允许
                 */
                isAllowSubscribeRetry: false,
                /**
                 * 禁用视频时关摄像头, 默认关闭
                 */
                isOffCameraWhenVideoDisable: true,
                /**
                 * RTC 房间加入类型，默认   RTCJoinType.COEXIST = 2 两个设备共存
                 *     RTCJoinType.KICK = 0,踢前一个设备
                 *     RTCJoinType.REFUSE = 1,当前加入拒绝
                 *     RTCJoinType.COEXIST = 2 两个设备共存
                 */
                joinType: engine.RTCJoinType.COEXIST,
                /**
                 * 允许降级获得流，获得音视频不成功 ，降级获得音频, 默认不允许
                 */
                isAllowDemotionGetStream: false,
                /**
                 * 语言设置 (推送), 不传默认为中文
                 */
                lang: pluginCallEngine.RCCallLanguage.ZH
            }, _options);
            // 初始化callEngine, 并监听onInvite
            this._callEngine = new pluginCallEngine.RCCallEngine(this._context, logger, {
                /**
                 * 监听收到invite
                 */
                onInvite: this._onInvite.bind(this),
                /**
                 * 监听离线消息报告
                 */
                onOfflineRecord: this._onOfflineRecord.bind(this)
            }, {
                /**
                 * 语言设置 (推送), 不传默认为中文
                 */
                lang: this._options.lang || pluginCallEngine.RCCallLanguage.ZH
            });
            eventEmitter.on('sessionClose', ({ session, summaryInfo }) => {
                // 从sessionList去掉这个关闭的session
                this._removeSession(session);
                try {
                    this._options.onSessionClose(session, summaryInfo);
                }
                catch (error) {
                    logger.error('[RCCCallClient] options.onSessionClose exception');
                    console.log(error);
                }
            });
            // 接听之前挂断其它的session
            eventEmitter.on('hungupOtherSession', ({ session }) => {
                const id = session.getSessionId();
                logger.info(`[RCCallClient hungupOtherSession] sessionId ready to accept -> ${id}`);
                logger.info(`[RCCallClient hungupOtherSession] sessionList ->${this._sessionList.map(ses => ses.getSessionId()).join(',')}`);
                let i = 0;
                while (this._sessionList.length > 1) {
                    // 如果与要接听的session不一致
                    if (this._sessionList[i].getSessionId() !== id) {
                        // 挂断
                        this._sessionList[i].hungup();
                        // 挂断后删除
                        this._sessionList.splice(i, 1);
                    }
                    else {
                        // 如果是要接听的session，跳过这个索引，所以加1
                        i++;
                    }
                }
                logger.info(`[RCCallClient hungupOtherSession] current sessionList length ->${this._sessionList.length}`);
            });
        }
        /**
         * 监听onInvite
         */
        _onInvite(stateMachine) {
            logger.info('[RCCallClient _onInvite] Received invite message');
            const session = new RCCallSession(stateMachine, this._rtcClient, {
                // 是否允许订阅重试
                isAllowSubscribeRetry: this._options.isAllowSubscribeRetry,
                // 是否允许发布重试
                isAllowPublishRetry: this._options.isAllowPublishRetry,
                /**
                 * 禁用视频时关摄像头
                 */
                isOffCameraWhenVideoDisable: this._options.isOffCameraWhenVideoDisable,
                /**
                 * RTC 房间加入类型
                 */
                joinType: this._options.joinType,
                // 允许降级获得流，获得音视频不成功 ，降级获得音频, 默认不允许
                isAllowDemotionGetStream: this._options.isAllowDemotionGetStream,
                // 标明是被叫产生的session
                produceType: ProduceTypes.CALLEE
            });
            logger.info('[RCCallClient _onInvite] Received invite message, successfully created session');
            /**
             * 如果通话的时候不允许接听新的通话，直接挂断， 这些工作在callEngine里完成
             */
            this._sessionList.push(session);
            try {
                // 执行用户API的监听
                this._options.onSession(session);
            }
            catch (error) {
                logger.error('[RCCallClient _options.onSession] onSession exception');
                console.log(error);
            }
            // 必须在onSession里注册session监听事件，这里检测一下有没有注册
            if (session._listener) {
                const conclusion = validateListener(session._listener);
                if (!conclusion.result) {
                    throw new Error(conclusion.msg);
                }
            }
            else {
                logger.error('[RCCallClient _options.onSession] session Must Have Listener');
                throw new Error('[RCCallSession  _options.onSession] session Must Have Listener');
            }
        }
        /**
         * 监听离线消息报告
         * @param record
         */
        _onOfflineRecord(record) {
            try {
                // 执行用户API的监听
                this._options.onOfflineRecord && this._options.onOfflineRecord(record);
            }
            catch (error) {
                logger.error('[RCCallClient _options.onOfflineRecord] onOfflineRecord exception');
                console.log(error);
            }
        }
        /**
         * 注册用户信息。注册后，在发起邀请或挂断等操作时，会将该信息一并发送给对端
         * @param info.name        用户名称
         * @param info.portraitUri 用户头像信息
         * @param info.extra       预留拓展字段
         */
        registerUserInfo(info = {}) {
            this._callEngine.registerUserInfo(info);
            logger.info('[RCCallClient registerUserInfo] successfully register user info data');
        }
        /**
         * 单呼，发送invite消息，回调回来接收stateMachine, 建session
         * @param params.targetId 被呼叫一方的用户 id 必填
         * @param params.mediaType 音频呼叫 or 音视频呼叫  必填
         * @param params.listener (session上的监听) 必填
         * @param params.constraints 获取音频或音视频资源时的参数 可选
         * @param params.channelId 组织 Id 可选
         */
        call({ targetId, mediaType = pluginCallEngine.RCCallMediaType.AUDIO, listener, constraints, channelId = '' }) {
            return __awaiter(this, void 0, void 0, function* () {
                const conclusion = [validateTargetId(targetId), validateMediaType(mediaType), validateListener(listener)];
                const messages = [];
                const result = conclusion.every((obj) => {
                    !obj.result && messages.push(obj.msg);
                    return obj.result;
                });
                if (!result) {
                    throw new Error(`[RCCallClient call] ${messages.join('\n')}`);
                }
                let localTracks = [];
                const { code: _code, tracks } = yield this._getLocalTrack(mediaType, constraints);
                if (_code !== pluginCallEngine.RCCallErrorCode.SUCCESS) {
                    return { code: _code };
                }
                localTracks = tracks;
                localTracks.forEach(track => {
                    // 向外抛出本地流
                    listener.onTrackReady(track);
                });
                // 调用callEngine的call返回一个状态机的实例
                const { code, stateMachine } = yield this._callEngine.call(channelId, targetId, mediaType);
                if (code === pluginCallEngine.RCCallErrorCode.SUCCESS && stateMachine) {
                    logger.info('[RCCallClient call] successfully created state machine');
                    const session = new RCCallSession(stateMachine, this._rtcClient, {
                        localTracks,
                        // 是否允许订阅重试
                        isAllowSubscribeRetry: this._options.isAllowSubscribeRetry,
                        // 是否允许订阅重试
                        isAllowPublishRetry: this._options.isAllowPublishRetry,
                        /**
                         * 禁用视频时关摄像头
                         */
                        isOffCameraWhenVideoDisable: this._options.isOffCameraWhenVideoDisable,
                        /**
                         * RTC 房间加入类型
                         */
                        joinType: this._options.joinType,
                        // 允许降级获得流，获得音视频不成功 ，降级获得音频, 默认不允许
                        isAllowDemotionGetStream: this._options.isAllowDemotionGetStream,
                        // 标明是主叫产生的session
                        produceType: ProduceTypes.CALLER
                    });
                    // session上注册监听事件
                    session.registerSessionListener(listener);
                    this._sessionList.push(session);
                    logger.info(`[RCCallClient call] successfully created session object, sessionId: ${session.getSessionId()}`);
                    return { code, session };
                }
                else {
                    logger.error(`[RCCallClient call] call failed code ->: ${code}`);
                    localTracks.forEach(track => {
                        // 禁用视频
                        track.mute();
                        // 关闭摄像头
                        track.destroy();
                    });
                    return { code };
                }
            });
        }
        /**
         * 发起群组呼叫
         * @param params.targetId 群组 Id 必填
         * @param params.userIds 被呼叫的群内成员 Id 必填
         * @param params.mediaType 音频呼叫 or 音视频呼叫 必填
         * @param params.listener (session上的监听) 必填
         * @param params.channelId 组织 Id 可选
         * @param params.constraints 获取音频或音视频资源时的参数 可选
         */
        callInGroup({ targetId, userIds, mediaType = pluginCallEngine.RCCallMediaType.AUDIO, listener, constraints, channelId = '' }) {
            return __awaiter(this, void 0, void 0, function* () {
                const conclusion = [validateTargetId(targetId), validateUserIds(userIds), validateMediaType(mediaType), validateListener(listener)];
                const messages = [];
                const result = conclusion.every((obj) => {
                    !obj.result && messages.push(obj.msg);
                    return obj.result;
                });
                if (!result) {
                    throw new Error(`[RCCallClient callInGroup] ${messages.join('\n')}`);
                }
                let localTracks = [];
                const { code: _code, tracks } = yield this._getLocalTrack(mediaType, constraints);
                if (_code !== pluginCallEngine.RCCallErrorCode.SUCCESS) {
                    return { code: _code };
                }
                localTracks = tracks;
                localTracks.forEach(track => {
                    // 向外抛出本地流
                    listener.onTrackReady(track);
                });
                // 往组里发消息
                const { code, stateMachine } = yield this._callEngine.callInGroup(channelId, targetId, mediaType, userIds);
                if (code === pluginCallEngine.RCCallErrorCode.SUCCESS && stateMachine) {
                    logger.info('[RCCallClient callInGroup] successfully created state machine');
                    const session = new RCCallSession(stateMachine, this._rtcClient, {
                        localTracks,
                        // 是否允许订阅重试
                        isAllowSubscribeRetry: this._options.isAllowSubscribeRetry,
                        // 是否允许发布重试
                        isAllowPublishRetry: this._options.isAllowPublishRetry,
                        /**
                         * 禁用视频时关摄像头
                         */
                        isOffCameraWhenVideoDisable: this._options.isOffCameraWhenVideoDisable,
                        /**
                         * RTC 房间加入类型
                         */
                        joinType: this._options.joinType,
                        // 允许降级获得流，获得音视频不成功 ，降级获得音频, 默认不允许
                        isAllowDemotionGetStream: this._options.isAllowDemotionGetStream,
                        // 标明是主叫产生的session
                        produceType: ProduceTypes.CALLER
                    });
                    // session上注册监听事件
                    session.registerSessionListener(listener);
                    this._sessionList.push(session);
                    logger.info(`[RCCallClient callInGroup] successfully created session object, sessionId: ${session.getSessionId()}`);
                    return { code, session };
                }
                else {
                    logger.info(`[RCCallClient callInGroup] callInGroup failed code -> ${code}`);
                    localTracks.forEach(track => {
                        // 禁用视频
                        track.mute();
                        // 关闭摄像头
                        track.destroy();
                    });
                    return { code };
                }
            });
        }
        /**
         * 调RTC API 获得本地流
         */
        _getLocalTrackCore(mediaType, constraints) {
            return __awaiter(this, void 0, void 0, function* () {
                // 检测是否能够获得本地流
                if (mediaType === pluginCallEngine.RCCallMediaType.AUDIO) {
                    const { code, track } = yield this._rtcClient.createMicrophoneAudioTrack('RongCloudRTC', constraints && constraints.audio && Object.assign({}, constraints.audio));
                    if (code !== pluginRtc.RCRTCCode.SUCCESS) {
                        logger.error(`[RCCallClient _getTrack] get Audio local tracks failed RCT code -> ${code}`);
                        return { code: pluginCallEngine.RCCallErrorCode.GET_LOCAL_AUDIO_TRACK_ERROR };
                    }
                    logger.info('[RCCallClient _getTrack] successfully get Audio local tracks');
                    return { code: pluginCallEngine.RCCallErrorCode.SUCCESS, tracks: [track] };
                }
                else {
                    const { code, tracks } = yield this._rtcClient.createMicrophoneAndCameraTracks('RongCloudRTC', constraints && Object.assign({}, constraints));
                    if (code !== pluginRtc.RCRTCCode.SUCCESS) {
                        logger.error(`[RCCallClient _getTrack] get Audio and Video local tracks failed RCT code -> ${code}`);
                        return { code: pluginCallEngine.RCCallErrorCode.GET_LOCAL_AUDIO_AND_VIDEO_TRACK_ERROR };
                    }
                    logger.info('[RCCallClient _getTrack] successfully get audio and video local tracks');
                    return { code: pluginCallEngine.RCCallErrorCode.SUCCESS, tracks };
                }
            });
        }
        _getLocalTrack(mediaType, constraints) {
            return __awaiter(this, void 0, void 0, function* () {
                // 如果是允许降级获得流，并且是获得音视频
                if (this._options.isAllowDemotionGetStream && mediaType === pluginCallEngine.RCCallMediaType.AUDIO_VIDEO) {
                    const { code, tracks } = yield this._getLocalTrackCore(pluginCallEngine.RCCallMediaType.AUDIO_VIDEO, constraints);
                    // 如果音视频不能获得，就降组获得音频
                    if (code !== pluginCallEngine.RCCallErrorCode.SUCCESS) {
                        const { code, tracks } = yield this._getLocalTrackCore(pluginCallEngine.RCCallMediaType.AUDIO, constraints);
                        if (code !== pluginCallEngine.RCCallErrorCode.SUCCESS) {
                            return { code };
                        }
                        return { code, tracks: tracks };
                    }
                    return { code, tracks: tracks };
                }
                else {
                    const { code: _code, tracks } = yield this._getLocalTrackCore(mediaType, constraints);
                    if (_code !== pluginCallEngine.RCCallErrorCode.SUCCESS) {
                        return { code: _code };
                    }
                    return { code: _code, tracks: tracks };
                }
            });
        }
        /**
         * 从sessionList删除某个session
         */
        _removeSession(session) {
            const id = session.getSessionId();
            this._sessionList = this._sessionList.filter(session => session.getSessionId() !== id);
        }
        /**
         * 获取加入通话（已加入 RTC 房间）的用户信息
         * @param userId 用户 ID
         */
        getJoinedUserInfo(userId) {
            return __awaiter(this, void 0, void 0, function* () {
                if (typeof userId !== 'string') {
                    throw new Error('[RCCallClient getJoinedUserInfo] parameter error');
                }
                const { code, data } = yield this._context.getRTCJoinedUserInfo(userId);
                if (code !== engine.ErrorCode.SUCCESS) {
                    logger.error('getJoinedUserInfo error', code);
                    return { code: pluginCallEngine.RCCallErrorCode.QUERY_JOINED_USER_INFO_ERROR };
                }
                return { code: pluginCallEngine.RCCallErrorCode.SUCCESS, data };
            });
        }
    }

    const installer = {
        tag: 'RCCall',
        verify(runtime) {
            return runtime.tag === 'browser';
        },
        setup(context, runtime, options) {
            // 先校验参数
            const conclusion = validateCallInitOptions(options);
            if (!conclusion.result) {
                throw new Error(`[RCCallLib installer steup]${conclusion.msg}`);
            }
            logger.setLogLevel(options.logLevel);
            logger.setLogStdout(options.logStdout);
            logger.warn(`RCCall Version: ${"5.0.1-alpha.12"}, Commit: ${"f73e4dbc4d46ce2169bcfc754906fbc5eccb96f9"}`);
            return new RCCallClient(context, runtime, options);
        }
    };

    Object.defineProperty(exports, 'RCCallEndReason', {
        enumerable: true,
        get: function () {
            return pluginCallEngine.RCCallEndReason;
        }
    });
    Object.defineProperty(exports, 'RCCallErrorCode', {
        enumerable: true,
        get: function () {
            return pluginCallEngine.RCCallErrorCode;
        }
    });
    Object.defineProperty(exports, 'RCCallLanguage', {
        enumerable: true,
        get: function () {
            return pluginCallEngine.RCCallLanguage;
        }
    });
    Object.defineProperty(exports, 'RCCallMediaType', {
        enumerable: true,
        get: function () {
            return pluginCallEngine.RCCallMediaType;
        }
    });
    Object.defineProperty(exports, 'RCCallSessionState', {
        enumerable: true,
        get: function () {
            return pluginCallEngine.RCCallSessionState;
        }
    });
    Object.defineProperty(exports, 'RCCallUserState', {
        enumerable: true,
        get: function () {
            return pluginCallEngine.RCCallUserState;
        }
    });
    exports.RCCallClient = RCCallClient;
    exports.RCCallSession = RCCallSession;
    exports.installer = installer;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
