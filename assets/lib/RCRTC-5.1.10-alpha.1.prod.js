/*
 * RCRTC - v5.1.10-alpha.1
 * CommitId - a8f885ac00138264c5e7c9fbaebd718ff24f885c
 * Thu Sep 16 2021 11:19:13 GMT+0800 (China Standard Time)
 * ©2020 RongCloud, Inc. All rights reserved.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@rongcloud/engine')) :
    typeof define === 'function' && define.amd ? define(['exports', '@rongcloud/engine'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.RCRTC = {}, global.RCEngine));
}(this, (function (exports, engine) { 'use strict';

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

    const logger = new engine.Logger('RCRTC');

    /**
     * 错误码，与移动端对齐
     * @description
     * 1. `51000 - 51999` 为 Android 专用段
     * 2. `52000 - 52999` 为 iOS 专用段
     * 3. `53000 - 53199` 为 Web RTC 专用段
     * 4. `53200 - 53499` 为 Web Call 专用段
     * 5. `53500 - 53999` 为 Web 保留段
     */
    exports.RCRTCCode = void 0;
    (function (RCRTCCode) {
        /** 成功 */
        RCRTCCode[RCRTCCode["SUCCESS"] = 10000] = "SUCCESS";
        /** IM 服务未连接 */
        RCRTCCode[RCRTCCode["SIGNAL_DISCONNECTED"] = 50000] = "SIGNAL_DISCONNECTED";
        /** 参数错误 */
        RCRTCCode[RCRTCCode["PARAMS_ERROR"] = 50001] = "PARAMS_ERROR";
        /** 加入房间错误，重复加入 RTC 房间内 */
        RCRTCCode[RCRTCCode["REPERT_JOIN_ROOM"] = 50002] = "REPERT_JOIN_ROOM";
        /** 当前不在房间内 */
        RCRTCCode[RCRTCCode["NOT_IN_ROOM"] = 50003] = "NOT_IN_ROOM";
        /** MediaServer 未开启 */
        RCRTCCode[RCRTCCode["SERVICE_INVALID"] = 50004] = "SERVICE_INVALID";
        /** RTC Token 无效 */
        RCRTCCode[RCRTCCode["RTC_TOKEN_INVALID"] = 50006] = "RTC_TOKEN_INVALID";
        /** 底层信令调用错误 */
        RCRTCCode[RCRTCCode["SIGNAL_ERROR"] = 53001] = "SIGNAL_ERROR";
        /** 创建 Offer 失败 */
        RCRTCCode[RCRTCCode["CREATE_OFFER_FAILED"] = 53003] = "CREATE_OFFER_FAILED";
        /** 网络请求失败 */
        RCRTCCode[RCRTCCode["REQUEST_FAILED"] = 53004] = "REQUEST_FAILED";
        /** MCU 地址不可为空 */
        RCRTCCode[RCRTCCode["MCU_SERVER_NOT_FOUND"] = 53005] = "MCU_SERVER_NOT_FOUND";
        /** 直播订阅失败，当前存在已订阅资源 */
        RCRTCCode[RCRTCCode["BROADCAST_SUB_LIST_NOT_EMPTY"] = 53007] = "BROADCAST_SUB_LIST_NOT_EMPTY";
        /** 房间已被销毁，需重新加入房间获取 Room 实例 */
        RCRTCCode[RCRTCCode["ROOM_HAS_BEEN_DESTROYED"] = 53008] = "ROOM_HAS_BEEN_DESTROYED";
        /** 没有可用的音视频服务器地址 */
        RCRTCCode[RCRTCCode["NOT_OPEN_VIDEO_AUDIO_SERVER"] = 53009] = "NOT_OPEN_VIDEO_AUDIO_SERVER";
        /** 获取用户媒体资源流失败 */
        RCRTCCode[RCRTCCode["GET_USER_MEDIA_FAILED"] = 53010] = "GET_USER_MEDIA_FAILED";
        /** 获取屏幕共享流失败 */
        RCRTCCode[RCRTCCode["GET_DISPLAY_MEDIA_FAILED"] = 53011] = "GET_DISPLAY_MEDIA_FAILED";
        /** 权限问题导致获取媒体流被拒绝 */
        RCRTCCode[RCRTCCode["PERMISSION_DENIED"] = 53012] = "PERMISSION_DENIED";
        /** 创建自定义流失败 */
        RCRTCCode[RCRTCCode["CREATE_CUSTOM_TRACK_FAILED"] = 53013] = "CREATE_CUSTOM_TRACK_FAILED";
        /** 无效的 TAG 定义 */
        RCRTCCode[RCRTCCode["INVALID_TAGS"] = 53014] = "INVALID_TAGS";
        /** IM 连接无效，无法识别当前登录的用户身份 */
        RCRTCCode[RCRTCCode["INVALID_USER_ID"] = 53015] = "INVALID_USER_ID";
        /** 创建文件流失败 */
        RCRTCCode[RCRTCCode["CREATE_FILE_TRACK_FAILED"] = 53016] = "CREATE_FILE_TRACK_FAILED";
        /** 无效的 File 实例 */
        RCRTCCode[RCRTCCode["INVALID_FILE_INSTANCE"] = 53017] = "INVALID_FILE_INSTANCE";
        /** setRemoteDescription failed */
        RCRTCCode[RCRTCCode["SET_REMOTE_DESCRIPTION_FAILED"] = 53018] = "SET_REMOTE_DESCRIPTION_FAILED";
        /** 浏览器不支持此方法 */
        RCRTCCode[RCRTCCode["BROWSER_NOT_SUPPORT"] = 53019] = "BROWSER_NOT_SUPPORT";
        /** 媒体流无法播放，可能是远端流未订阅或本地流已销毁 */
        RCRTCCode[RCRTCCode["TRACK_NOT_READY"] = 53020] = "TRACK_NOT_READY";
        /** 视频流播放需时需传参 HTMLVideoElement 作为显示组件 */
        RCRTCCode[RCRTCCode["VIDEO_TRACK_MISS_MEDIA_ELEMENT"] = 53021] = "VIDEO_TRACK_MISS_MEDIA_ELEMENT";
        /** 媒体流播放失败 */
        RCRTCCode[RCRTCCode["TRACK_PLAY_ERROR"] = 53022] = "TRACK_PLAY_ERROR";
        /** 观众加入直播房间信令错误 */
        RCRTCCode[RCRTCCode["SIGNAL_AUDIENCE_JOIN_ROOM_FAILED"] = 53023] = "SIGNAL_AUDIENCE_JOIN_ROOM_FAILED";
        /** 直播房间切换身份错误 */
        RCRTCCode[RCRTCCode["SIGNAL_ROOM_CHANGE_IDENTITY_FAILED"] = 53024] = "SIGNAL_ROOM_CHANGE_IDENTITY_FAILED";
        /** 公有云 SDK 包不允许使用私有云环境 */
        RCRTCCode[RCRTCCode["PACKAGE_ENVIRONMENT_ERROR"] = 53025] = "PACKAGE_ENVIRONMENT_ERROR";
        /** 单个用户发布资源超过限制 （ MediaServer 限制最多 10 个 track ） */
        RCRTCCode[RCRTCCode["PUBLISH_TRACK_LIMIT_EXCEEDED"] = 53026] = "PUBLISH_TRACK_LIMIT_EXCEEDED";
        /** 加入 RTC 房间 joinTYype 为 1 时，当前有其他端在房间时的应答码 */
        RCRTCCode[RCRTCCode["SIGNAL_JOIN_RTC_ROOM_REFUSED"] = 53207] = "SIGNAL_JOIN_RTC_ROOM_REFUSED";
    })(exports.RCRTCCode || (exports.RCRTCCode = {}));
    /**
     * RTC 信令 Server 返回需处理的错误 Code
     */
    var RTCSignalCode;
    (function (RTCSignalCode) {
        /**
         * 加入 RTC 房间 joinTYype 为 1 时，当前有其他端在房间时的应答码
         */
        RTCSignalCode[RTCSignalCode["JOIN_REFUSED"] = 40032] = "JOIN_REFUSED";
    })(RTCSignalCode || (RTCSignalCode = {}));

    class AsyncTaskQueue {
        constructor() {
            this.queue = [];
            this.locked = false;
        }
        checkToStart() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.queue.length === 0 || this.locked) {
                    return;
                }
                this.locked = true;
                const { resolve, task, reject } = this.queue.shift();
                let result;
                try {
                    result = yield task();
                    resolve(result);
                }
                catch (error) {
                    reject(error);
                }
                this.locked = false;
                // 递归执行
                this.checkToStart();
            });
        }
        push(task) {
            const promise = new Promise((resolve, reject) => {
                this.queue.push({ resolve, task, reject });
            });
            this.checkToStart();
            return promise;
        }
    }
    const defQueeu = new AsyncTaskQueue();
    /**
     * 将异步任务推送到异步队列，队列内任务先进先出，依次执行，执行完成后通过
     * Promise.resolve 返回执行结果
     * @param task 传参不能是 `async () => {}` 所定义的异步函数，
     * 只能使用明确的 `() => Promise<T> | T` 形式，避免转义时微任务被提前执行
     */
    const push = (task) => {
        return defQueeu.push(task);
    };

    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    let logDisabled_ = true;
    let deprecationWarnings_ = true;

    /**
     * Extract browser version out of the provided user agent string.
     *
     * @param {!string} uastring userAgent string.
     * @param {!string} expr Regular expression used as match criteria.
     * @param {!number} pos position in the version string to be returned.
     * @return {!number} browser version.
     */
    function extractVersion(uastring, expr, pos) {
      const match = uastring.match(expr);
      return match && match.length >= pos && parseInt(match[pos], 10);
    }

    // Wraps the peerconnection event eventNameToWrap in a function
    // which returns the modified event object (or false to prevent
    // the event).
    function wrapPeerConnectionEvent(window, eventNameToWrap, wrapper) {
      if (!window.RTCPeerConnection) {
        return;
      }
      const proto = window.RTCPeerConnection.prototype;
      const nativeAddEventListener = proto.addEventListener;
      proto.addEventListener = function(nativeEventName, cb) {
        if (nativeEventName !== eventNameToWrap) {
          return nativeAddEventListener.apply(this, arguments);
        }
        const wrappedCallback = (e) => {
          const modifiedEvent = wrapper(e);
          if (modifiedEvent) {
            if (cb.handleEvent) {
              cb.handleEvent(modifiedEvent);
            } else {
              cb(modifiedEvent);
            }
          }
        };
        this._eventMap = this._eventMap || {};
        if (!this._eventMap[eventNameToWrap]) {
          this._eventMap[eventNameToWrap] = new Map();
        }
        this._eventMap[eventNameToWrap].set(cb, wrappedCallback);
        return nativeAddEventListener.apply(this, [nativeEventName,
          wrappedCallback]);
      };

      const nativeRemoveEventListener = proto.removeEventListener;
      proto.removeEventListener = function(nativeEventName, cb) {
        if (nativeEventName !== eventNameToWrap || !this._eventMap
            || !this._eventMap[eventNameToWrap]) {
          return nativeRemoveEventListener.apply(this, arguments);
        }
        if (!this._eventMap[eventNameToWrap].has(cb)) {
          return nativeRemoveEventListener.apply(this, arguments);
        }
        const unwrappedCb = this._eventMap[eventNameToWrap].get(cb);
        this._eventMap[eventNameToWrap].delete(cb);
        if (this._eventMap[eventNameToWrap].size === 0) {
          delete this._eventMap[eventNameToWrap];
        }
        if (Object.keys(this._eventMap).length === 0) {
          delete this._eventMap;
        }
        return nativeRemoveEventListener.apply(this, [nativeEventName,
          unwrappedCb]);
      };

      Object.defineProperty(proto, 'on' + eventNameToWrap, {
        get() {
          return this['_on' + eventNameToWrap];
        },
        set(cb) {
          if (this['_on' + eventNameToWrap]) {
            this.removeEventListener(eventNameToWrap,
                this['_on' + eventNameToWrap]);
            delete this['_on' + eventNameToWrap];
          }
          if (cb) {
            this.addEventListener(eventNameToWrap,
                this['_on' + eventNameToWrap] = cb);
          }
        },
        enumerable: true,
        configurable: true
      });
    }

    function disableLog(bool) {
      if (typeof bool !== 'boolean') {
        return new Error('Argument type: ' + typeof bool +
            '. Please use a boolean.');
      }
      logDisabled_ = bool;
      return (bool) ? 'adapter.js logging disabled' :
          'adapter.js logging enabled';
    }

    /**
     * Disable or enable deprecation warnings
     * @param {!boolean} bool set to true to disable warnings.
     */
    function disableWarnings(bool) {
      if (typeof bool !== 'boolean') {
        return new Error('Argument type: ' + typeof bool +
            '. Please use a boolean.');
      }
      deprecationWarnings_ = !bool;
      return 'adapter.js deprecation warnings ' + (bool ? 'disabled' : 'enabled');
    }

    function log() {
      if (typeof window === 'object') {
        if (logDisabled_) {
          return;
        }
        if (typeof console !== 'undefined' && typeof console.log === 'function') {
          console.log.apply(console, arguments);
        }
      }
    }

    /**
     * Shows a deprecation warning suggesting the modern and spec-compatible API.
     */
    function deprecated(oldMethod, newMethod) {
      if (!deprecationWarnings_) {
        return;
      }
      console.warn(oldMethod + ' is deprecated, please use ' + newMethod +
          ' instead.');
    }

    /**
     * Browser detector.
     *
     * @return {object} result containing browser and version
     *     properties.
     */
    function detectBrowser(window) {
      // Returned result object.
      const result = {browser: null, version: null};

      // Fail early if it's not a browser
      if (typeof window === 'undefined' || !window.navigator) {
        result.browser = 'Not a browser.';
        return result;
      }

      const {navigator} = window;

      if (navigator.mozGetUserMedia) { // Firefox.
        result.browser = 'firefox';
        result.version = extractVersion(navigator.userAgent,
            /Firefox\/(\d+)\./, 1);
      } else if (navigator.webkitGetUserMedia ||
          (window.isSecureContext === false && window.webkitRTCPeerConnection &&
           !window.RTCIceGatherer)) {
        // Chrome, Chromium, Webview, Opera.
        // Version matches Chrome/WebRTC version.
        // Chrome 74 removed webkitGetUserMedia on http as well so we need the
        // more complicated fallback to webkitRTCPeerConnection.
        result.browser = 'chrome';
        result.version = extractVersion(navigator.userAgent,
            /Chrom(e|ium)\/(\d+)\./, 2);
      } else if (navigator.mediaDevices &&
          navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) { // Edge.
        result.browser = 'edge';
        result.version = extractVersion(navigator.userAgent,
            /Edge\/(\d+).(\d+)$/, 2);
      } else if (window.RTCPeerConnection &&
          navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) { // Safari.
        result.browser = 'safari';
        result.version = extractVersion(navigator.userAgent,
            /AppleWebKit\/(\d+)\./, 1);
        result.supportsUnifiedPlan = window.RTCRtpTransceiver &&
            'currentDirection' in window.RTCRtpTransceiver.prototype;
      } else { // Default fallthrough: not supported.
        result.browser = 'Not a supported browser.';
        return result;
      }

      return result;
    }

    /**
     * Checks if something is an object.
     *
     * @param {*} val The something you want to check.
     * @return true if val is an object, false otherwise.
     */
    function isObject(val) {
      return Object.prototype.toString.call(val) === '[object Object]';
    }

    /**
     * Remove all empty objects and undefined values
     * from a nested object -- an enhanced and vanilla version
     * of Lodash's `compact`.
     */
    function compactObject(data) {
      if (!isObject(data)) {
        return data;
      }

      return Object.keys(data).reduce(function(accumulator, key) {
        const isObj = isObject(data[key]);
        const value = isObj ? compactObject(data[key]) : data[key];
        const isEmptyObject = isObj && !Object.keys(value).length;
        if (value === undefined || isEmptyObject) {
          return accumulator;
        }
        return Object.assign(accumulator, {[key]: value});
      }, {});
    }

    /* iterates the stats graph recursively. */
    function walkStats(stats, base, resultSet) {
      if (!base || resultSet.has(base.id)) {
        return;
      }
      resultSet.set(base.id, base);
      Object.keys(base).forEach(name => {
        if (name.endsWith('Id')) {
          walkStats(stats, stats.get(base[name]), resultSet);
        } else if (name.endsWith('Ids')) {
          base[name].forEach(id => {
            walkStats(stats, stats.get(id), resultSet);
          });
        }
      });
    }

    /* filter getStats for a sender/receiver track. */
    function filterStats(result, track, outbound) {
      const streamStatsType = outbound ? 'outbound-rtp' : 'inbound-rtp';
      const filteredResult = new Map();
      if (track === null) {
        return filteredResult;
      }
      const trackStats = [];
      result.forEach(value => {
        if (value.type === 'track' &&
            value.trackIdentifier === track.id) {
          trackStats.push(value);
        }
      });
      trackStats.forEach(trackStat => {
        result.forEach(stats => {
          if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
            walkStats(result, stats, filteredResult);
          }
        });
      });
      return filteredResult;
    }

    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    const logging = log;

    function shimGetUserMedia$3(window, browserDetails) {
      const navigator = window && window.navigator;

      if (!navigator.mediaDevices) {
        return;
      }

      const constraintsToChrome_ = function(c) {
        if (typeof c !== 'object' || c.mandatory || c.optional) {
          return c;
        }
        const cc = {};
        Object.keys(c).forEach(key => {
          if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
            return;
          }
          const r = (typeof c[key] === 'object') ? c[key] : {ideal: c[key]};
          if (r.exact !== undefined && typeof r.exact === 'number') {
            r.min = r.max = r.exact;
          }
          const oldname_ = function(prefix, name) {
            if (prefix) {
              return prefix + name.charAt(0).toUpperCase() + name.slice(1);
            }
            return (name === 'deviceId') ? 'sourceId' : name;
          };
          if (r.ideal !== undefined) {
            cc.optional = cc.optional || [];
            let oc = {};
            if (typeof r.ideal === 'number') {
              oc[oldname_('min', key)] = r.ideal;
              cc.optional.push(oc);
              oc = {};
              oc[oldname_('max', key)] = r.ideal;
              cc.optional.push(oc);
            } else {
              oc[oldname_('', key)] = r.ideal;
              cc.optional.push(oc);
            }
          }
          if (r.exact !== undefined && typeof r.exact !== 'number') {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname_('', key)] = r.exact;
          } else {
            ['min', 'max'].forEach(mix => {
              if (r[mix] !== undefined) {
                cc.mandatory = cc.mandatory || {};
                cc.mandatory[oldname_(mix, key)] = r[mix];
              }
            });
          }
        });
        if (c.advanced) {
          cc.optional = (cc.optional || []).concat(c.advanced);
        }
        return cc;
      };

      const shimConstraints_ = function(constraints, func) {
        if (browserDetails.version >= 61) {
          return func(constraints);
        }
        constraints = JSON.parse(JSON.stringify(constraints));
        if (constraints && typeof constraints.audio === 'object') {
          const remap = function(obj, a, b) {
            if (a in obj && !(b in obj)) {
              obj[b] = obj[a];
              delete obj[a];
            }
          };
          constraints = JSON.parse(JSON.stringify(constraints));
          remap(constraints.audio, 'autoGainControl', 'googAutoGainControl');
          remap(constraints.audio, 'noiseSuppression', 'googNoiseSuppression');
          constraints.audio = constraintsToChrome_(constraints.audio);
        }
        if (constraints && typeof constraints.video === 'object') {
          // Shim facingMode for mobile & surface pro.
          let face = constraints.video.facingMode;
          face = face && ((typeof face === 'object') ? face : {ideal: face});
          const getSupportedFacingModeLies = browserDetails.version < 66;

          if ((face && (face.exact === 'user' || face.exact === 'environment' ||
                        face.ideal === 'user' || face.ideal === 'environment')) &&
              !(navigator.mediaDevices.getSupportedConstraints &&
                navigator.mediaDevices.getSupportedConstraints().facingMode &&
                !getSupportedFacingModeLies)) {
            delete constraints.video.facingMode;
            let matches;
            if (face.exact === 'environment' || face.ideal === 'environment') {
              matches = ['back', 'rear'];
            } else if (face.exact === 'user' || face.ideal === 'user') {
              matches = ['front'];
            }
            if (matches) {
              // Look for matches in label, or use last cam for back (typical).
              return navigator.mediaDevices.enumerateDevices()
              .then(devices => {
                devices = devices.filter(d => d.kind === 'videoinput');
                let dev = devices.find(d => matches.some(match =>
                  d.label.toLowerCase().includes(match)));
                if (!dev && devices.length && matches.includes('back')) {
                  dev = devices[devices.length - 1]; // more likely the back cam
                }
                if (dev) {
                  constraints.video.deviceId = face.exact ? {exact: dev.deviceId} :
                                                            {ideal: dev.deviceId};
                }
                constraints.video = constraintsToChrome_(constraints.video);
                logging('chrome: ' + JSON.stringify(constraints));
                return func(constraints);
              });
            }
          }
          constraints.video = constraintsToChrome_(constraints.video);
        }
        logging('chrome: ' + JSON.stringify(constraints));
        return func(constraints);
      };

      const shimError_ = function(e) {
        if (browserDetails.version >= 64) {
          return e;
        }
        return {
          name: {
            PermissionDeniedError: 'NotAllowedError',
            PermissionDismissedError: 'NotAllowedError',
            InvalidStateError: 'NotAllowedError',
            DevicesNotFoundError: 'NotFoundError',
            ConstraintNotSatisfiedError: 'OverconstrainedError',
            TrackStartError: 'NotReadableError',
            MediaDeviceFailedDueToShutdown: 'NotAllowedError',
            MediaDeviceKillSwitchOn: 'NotAllowedError',
            TabCaptureError: 'AbortError',
            ScreenCaptureError: 'AbortError',
            DeviceCaptureError: 'AbortError'
          }[e.name] || e.name,
          message: e.message,
          constraint: e.constraint || e.constraintName,
          toString() {
            return this.name + (this.message && ': ') + this.message;
          }
        };
      };

      const getUserMedia_ = function(constraints, onSuccess, onError) {
        shimConstraints_(constraints, c => {
          navigator.webkitGetUserMedia(c, onSuccess, e => {
            if (onError) {
              onError(shimError_(e));
            }
          });
        });
      };
      navigator.getUserMedia = getUserMedia_.bind(navigator);

      // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
      // function which returns a Promise, it does not accept spec-style
      // constraints.
      if (navigator.mediaDevices.getUserMedia) {
        const origGetUserMedia = navigator.mediaDevices.getUserMedia.
            bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = function(cs) {
          return shimConstraints_(cs, c => origGetUserMedia(c).then(stream => {
            if (c.audio && !stream.getAudioTracks().length ||
                c.video && !stream.getVideoTracks().length) {
              stream.getTracks().forEach(track => {
                track.stop();
              });
              throw new DOMException('', 'NotFoundError');
            }
            return stream;
          }, e => Promise.reject(shimError_(e))));
        };
      }
    }

    /*
     *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    function shimGetDisplayMedia$2(window, getSourceId) {
      if (window.navigator.mediaDevices &&
        'getDisplayMedia' in window.navigator.mediaDevices) {
        return;
      }
      if (!(window.navigator.mediaDevices)) {
        return;
      }
      // getSourceId is a function that returns a promise resolving with
      // the sourceId of the screen/window/tab to be shared.
      if (typeof getSourceId !== 'function') {
        console.error('shimGetDisplayMedia: getSourceId argument is not ' +
            'a function');
        return;
      }
      window.navigator.mediaDevices.getDisplayMedia =
        function getDisplayMedia(constraints) {
          return getSourceId(constraints)
            .then(sourceId => {
              const widthSpecified = constraints.video && constraints.video.width;
              const heightSpecified = constraints.video &&
                constraints.video.height;
              const frameRateSpecified = constraints.video &&
                constraints.video.frameRate;
              constraints.video = {
                mandatory: {
                  chromeMediaSource: 'desktop',
                  chromeMediaSourceId: sourceId,
                  maxFrameRate: frameRateSpecified || 3
                }
              };
              if (widthSpecified) {
                constraints.video.mandatory.maxWidth = widthSpecified;
              }
              if (heightSpecified) {
                constraints.video.mandatory.maxHeight = heightSpecified;
              }
              return window.navigator.mediaDevices.getUserMedia(constraints);
            });
        };
    }

    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    function shimMediaStream(window) {
      window.MediaStream = window.MediaStream || window.webkitMediaStream;
    }

    function shimOnTrack$1(window) {
      if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
          window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
          get() {
            return this._ontrack;
          },
          set(f) {
            if (this._ontrack) {
              this.removeEventListener('track', this._ontrack);
            }
            this.addEventListener('track', this._ontrack = f);
          },
          enumerable: true,
          configurable: true
        });
        const origSetRemoteDescription =
            window.RTCPeerConnection.prototype.setRemoteDescription;
        window.RTCPeerConnection.prototype.setRemoteDescription =
          function setRemoteDescription() {
            if (!this._ontrackpoly) {
              this._ontrackpoly = (e) => {
                // onaddstream does not fire when a track is added to an existing
                // stream. But stream.onaddtrack is implemented so we use that.
                e.stream.addEventListener('addtrack', te => {
                  let receiver;
                  if (window.RTCPeerConnection.prototype.getReceivers) {
                    receiver = this.getReceivers()
                      .find(r => r.track && r.track.id === te.track.id);
                  } else {
                    receiver = {track: te.track};
                  }

                  const event = new Event('track');
                  event.track = te.track;
                  event.receiver = receiver;
                  event.transceiver = {receiver};
                  event.streams = [e.stream];
                  this.dispatchEvent(event);
                });
                e.stream.getTracks().forEach(track => {
                  let receiver;
                  if (window.RTCPeerConnection.prototype.getReceivers) {
                    receiver = this.getReceivers()
                      .find(r => r.track && r.track.id === track.id);
                  } else {
                    receiver = {track};
                  }
                  const event = new Event('track');
                  event.track = track;
                  event.receiver = receiver;
                  event.transceiver = {receiver};
                  event.streams = [e.stream];
                  this.dispatchEvent(event);
                });
              };
              this.addEventListener('addstream', this._ontrackpoly);
            }
            return origSetRemoteDescription.apply(this, arguments);
          };
      } else {
        // even if RTCRtpTransceiver is in window, it is only used and
        // emitted in unified-plan. Unfortunately this means we need
        // to unconditionally wrap the event.
        wrapPeerConnectionEvent(window, 'track', e => {
          if (!e.transceiver) {
            Object.defineProperty(e, 'transceiver',
              {value: {receiver: e.receiver}});
          }
          return e;
        });
      }
    }

    function shimGetSendersWithDtmf(window) {
      // Overrides addTrack/removeTrack, depends on shimAddTrackRemoveTrack.
      if (typeof window === 'object' && window.RTCPeerConnection &&
          !('getSenders' in window.RTCPeerConnection.prototype) &&
          'createDTMFSender' in window.RTCPeerConnection.prototype) {
        const shimSenderWithDtmf = function(pc, track) {
          return {
            track,
            get dtmf() {
              if (this._dtmf === undefined) {
                if (track.kind === 'audio') {
                  this._dtmf = pc.createDTMFSender(track);
                } else {
                  this._dtmf = null;
                }
              }
              return this._dtmf;
            },
            _pc: pc
          };
        };

        // augment addTrack when getSenders is not available.
        if (!window.RTCPeerConnection.prototype.getSenders) {
          window.RTCPeerConnection.prototype.getSenders = function getSenders() {
            this._senders = this._senders || [];
            return this._senders.slice(); // return a copy of the internal state.
          };
          const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
          window.RTCPeerConnection.prototype.addTrack =
            function addTrack(track, stream) {
              let sender = origAddTrack.apply(this, arguments);
              if (!sender) {
                sender = shimSenderWithDtmf(this, track);
                this._senders.push(sender);
              }
              return sender;
            };

          const origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
          window.RTCPeerConnection.prototype.removeTrack =
            function removeTrack(sender) {
              origRemoveTrack.apply(this, arguments);
              const idx = this._senders.indexOf(sender);
              if (idx !== -1) {
                this._senders.splice(idx, 1);
              }
            };
        }
        const origAddStream = window.RTCPeerConnection.prototype.addStream;
        window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
          this._senders = this._senders || [];
          origAddStream.apply(this, [stream]);
          stream.getTracks().forEach(track => {
            this._senders.push(shimSenderWithDtmf(this, track));
          });
        };

        const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
        window.RTCPeerConnection.prototype.removeStream =
          function removeStream(stream) {
            this._senders = this._senders || [];
            origRemoveStream.apply(this, [stream]);

            stream.getTracks().forEach(track => {
              const sender = this._senders.find(s => s.track === track);
              if (sender) { // remove sender
                this._senders.splice(this._senders.indexOf(sender), 1);
              }
            });
          };
      } else if (typeof window === 'object' && window.RTCPeerConnection &&
                 'getSenders' in window.RTCPeerConnection.prototype &&
                 'createDTMFSender' in window.RTCPeerConnection.prototype &&
                 window.RTCRtpSender &&
                 !('dtmf' in window.RTCRtpSender.prototype)) {
        const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
        window.RTCPeerConnection.prototype.getSenders = function getSenders() {
          const senders = origGetSenders.apply(this, []);
          senders.forEach(sender => sender._pc = this);
          return senders;
        };

        Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
          get() {
            if (this._dtmf === undefined) {
              if (this.track.kind === 'audio') {
                this._dtmf = this._pc.createDTMFSender(this.track);
              } else {
                this._dtmf = null;
              }
            }
            return this._dtmf;
          }
        });
      }
    }

    function shimGetStats(window) {
      if (!window.RTCPeerConnection) {
        return;
      }

      const origGetStats = window.RTCPeerConnection.prototype.getStats;
      window.RTCPeerConnection.prototype.getStats = function getStats() {
        const [selector, onSucc, onErr] = arguments;

        // If selector is a function then we are in the old style stats so just
        // pass back the original getStats format to avoid breaking old users.
        if (arguments.length > 0 && typeof selector === 'function') {
          return origGetStats.apply(this, arguments);
        }

        // When spec-style getStats is supported, return those when called with
        // either no arguments or the selector argument is null.
        if (origGetStats.length === 0 && (arguments.length === 0 ||
            typeof selector !== 'function')) {
          return origGetStats.apply(this, []);
        }

        const fixChromeStats_ = function(response) {
          const standardReport = {};
          const reports = response.result();
          reports.forEach(report => {
            const standardStats = {
              id: report.id,
              timestamp: report.timestamp,
              type: {
                localcandidate: 'local-candidate',
                remotecandidate: 'remote-candidate'
              }[report.type] || report.type
            };
            report.names().forEach(name => {
              standardStats[name] = report.stat(name);
            });
            standardReport[standardStats.id] = standardStats;
          });

          return standardReport;
        };

        // shim getStats with maplike support
        const makeMapStats = function(stats) {
          return new Map(Object.keys(stats).map(key => [key, stats[key]]));
        };

        if (arguments.length >= 2) {
          const successCallbackWrapper_ = function(response) {
            onSucc(makeMapStats(fixChromeStats_(response)));
          };

          return origGetStats.apply(this, [successCallbackWrapper_,
            selector]);
        }

        // promise-support
        return new Promise((resolve, reject) => {
          origGetStats.apply(this, [
            function(response) {
              resolve(makeMapStats(fixChromeStats_(response)));
            }, reject]);
        }).then(onSucc, onErr);
      };
    }

    function shimSenderReceiverGetStats(window) {
      if (!(typeof window === 'object' && window.RTCPeerConnection &&
          window.RTCRtpSender && window.RTCRtpReceiver)) {
        return;
      }

      // shim sender stats.
      if (!('getStats' in window.RTCRtpSender.prototype)) {
        const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
        if (origGetSenders) {
          window.RTCPeerConnection.prototype.getSenders = function getSenders() {
            const senders = origGetSenders.apply(this, []);
            senders.forEach(sender => sender._pc = this);
            return senders;
          };
        }

        const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
        if (origAddTrack) {
          window.RTCPeerConnection.prototype.addTrack = function addTrack() {
            const sender = origAddTrack.apply(this, arguments);
            sender._pc = this;
            return sender;
          };
        }
        window.RTCRtpSender.prototype.getStats = function getStats() {
          const sender = this;
          return this._pc.getStats().then(result =>
            /* Note: this will include stats of all senders that
             *   send a track with the same id as sender.track as
             *   it is not possible to identify the RTCRtpSender.
             */
            filterStats(result, sender.track, true));
        };
      }

      // shim receiver stats.
      if (!('getStats' in window.RTCRtpReceiver.prototype)) {
        const origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
        if (origGetReceivers) {
          window.RTCPeerConnection.prototype.getReceivers =
            function getReceivers() {
              const receivers = origGetReceivers.apply(this, []);
              receivers.forEach(receiver => receiver._pc = this);
              return receivers;
            };
        }
        wrapPeerConnectionEvent(window, 'track', e => {
          e.receiver._pc = e.srcElement;
          return e;
        });
        window.RTCRtpReceiver.prototype.getStats = function getStats() {
          const receiver = this;
          return this._pc.getStats().then(result =>
            filterStats(result, receiver.track, false));
        };
      }

      if (!('getStats' in window.RTCRtpSender.prototype &&
          'getStats' in window.RTCRtpReceiver.prototype)) {
        return;
      }

      // shim RTCPeerConnection.getStats(track).
      const origGetStats = window.RTCPeerConnection.prototype.getStats;
      window.RTCPeerConnection.prototype.getStats = function getStats() {
        if (arguments.length > 0 &&
            arguments[0] instanceof window.MediaStreamTrack) {
          const track = arguments[0];
          let sender;
          let receiver;
          let err;
          this.getSenders().forEach(s => {
            if (s.track === track) {
              if (sender) {
                err = true;
              } else {
                sender = s;
              }
            }
          });
          this.getReceivers().forEach(r => {
            if (r.track === track) {
              if (receiver) {
                err = true;
              } else {
                receiver = r;
              }
            }
            return r.track === track;
          });
          if (err || (sender && receiver)) {
            return Promise.reject(new DOMException(
              'There are more than one sender or receiver for the track.',
              'InvalidAccessError'));
          } else if (sender) {
            return sender.getStats();
          } else if (receiver) {
            return receiver.getStats();
          }
          return Promise.reject(new DOMException(
            'There is no sender or receiver for the track.',
            'InvalidAccessError'));
        }
        return origGetStats.apply(this, arguments);
      };
    }

    function shimAddTrackRemoveTrackWithNative(window) {
      // shim addTrack/removeTrack with native variants in order to make
      // the interactions with legacy getLocalStreams behave as in other browsers.
      // Keeps a mapping stream.id => [stream, rtpsenders...]
      window.RTCPeerConnection.prototype.getLocalStreams =
        function getLocalStreams() {
          this._shimmedLocalStreams = this._shimmedLocalStreams || {};
          return Object.keys(this._shimmedLocalStreams)
            .map(streamId => this._shimmedLocalStreams[streamId][0]);
        };

      const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
      window.RTCPeerConnection.prototype.addTrack =
        function addTrack(track, stream) {
          if (!stream) {
            return origAddTrack.apply(this, arguments);
          }
          this._shimmedLocalStreams = this._shimmedLocalStreams || {};

          const sender = origAddTrack.apply(this, arguments);
          if (!this._shimmedLocalStreams[stream.id]) {
            this._shimmedLocalStreams[stream.id] = [stream, sender];
          } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
            this._shimmedLocalStreams[stream.id].push(sender);
          }
          return sender;
        };

      const origAddStream = window.RTCPeerConnection.prototype.addStream;
      window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};

        stream.getTracks().forEach(track => {
          const alreadyExists = this.getSenders().find(s => s.track === track);
          if (alreadyExists) {
            throw new DOMException('Track already exists.',
                'InvalidAccessError');
          }
        });
        const existingSenders = this.getSenders();
        origAddStream.apply(this, arguments);
        const newSenders = this.getSenders()
          .filter(newSender => existingSenders.indexOf(newSender) === -1);
        this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
      };

      const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
      window.RTCPeerConnection.prototype.removeStream =
        function removeStream(stream) {
          this._shimmedLocalStreams = this._shimmedLocalStreams || {};
          delete this._shimmedLocalStreams[stream.id];
          return origRemoveStream.apply(this, arguments);
        };

      const origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
      window.RTCPeerConnection.prototype.removeTrack =
        function removeTrack(sender) {
          this._shimmedLocalStreams = this._shimmedLocalStreams || {};
          if (sender) {
            Object.keys(this._shimmedLocalStreams).forEach(streamId => {
              const idx = this._shimmedLocalStreams[streamId].indexOf(sender);
              if (idx !== -1) {
                this._shimmedLocalStreams[streamId].splice(idx, 1);
              }
              if (this._shimmedLocalStreams[streamId].length === 1) {
                delete this._shimmedLocalStreams[streamId];
              }
            });
          }
          return origRemoveTrack.apply(this, arguments);
        };
    }

    function shimAddTrackRemoveTrack(window, browserDetails) {
      if (!window.RTCPeerConnection) {
        return;
      }
      // shim addTrack and removeTrack.
      if (window.RTCPeerConnection.prototype.addTrack &&
          browserDetails.version >= 65) {
        return shimAddTrackRemoveTrackWithNative(window);
      }

      // also shim pc.getLocalStreams when addTrack is shimmed
      // to return the original streams.
      const origGetLocalStreams = window.RTCPeerConnection.prototype
          .getLocalStreams;
      window.RTCPeerConnection.prototype.getLocalStreams =
        function getLocalStreams() {
          const nativeStreams = origGetLocalStreams.apply(this);
          this._reverseStreams = this._reverseStreams || {};
          return nativeStreams.map(stream => this._reverseStreams[stream.id]);
        };

      const origAddStream = window.RTCPeerConnection.prototype.addStream;
      window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};

        stream.getTracks().forEach(track => {
          const alreadyExists = this.getSenders().find(s => s.track === track);
          if (alreadyExists) {
            throw new DOMException('Track already exists.',
                'InvalidAccessError');
          }
        });
        // Add identity mapping for consistency with addTrack.
        // Unless this is being used with a stream from addTrack.
        if (!this._reverseStreams[stream.id]) {
          const newStream = new window.MediaStream(stream.getTracks());
          this._streams[stream.id] = newStream;
          this._reverseStreams[newStream.id] = stream;
          stream = newStream;
        }
        origAddStream.apply(this, [stream]);
      };

      const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
      window.RTCPeerConnection.prototype.removeStream =
        function removeStream(stream) {
          this._streams = this._streams || {};
          this._reverseStreams = this._reverseStreams || {};

          origRemoveStream.apply(this, [(this._streams[stream.id] || stream)]);
          delete this._reverseStreams[(this._streams[stream.id] ?
              this._streams[stream.id].id : stream.id)];
          delete this._streams[stream.id];
        };

      window.RTCPeerConnection.prototype.addTrack =
        function addTrack(track, stream) {
          if (this.signalingState === 'closed') {
            throw new DOMException(
              'The RTCPeerConnection\'s signalingState is \'closed\'.',
              'InvalidStateError');
          }
          const streams = [].slice.call(arguments, 1);
          if (streams.length !== 1 ||
              !streams[0].getTracks().find(t => t === track)) {
            // this is not fully correct but all we can manage without
            // [[associated MediaStreams]] internal slot.
            throw new DOMException(
              'The adapter.js addTrack polyfill only supports a single ' +
              ' stream which is associated with the specified track.',
              'NotSupportedError');
          }

          const alreadyExists = this.getSenders().find(s => s.track === track);
          if (alreadyExists) {
            throw new DOMException('Track already exists.',
                'InvalidAccessError');
          }

          this._streams = this._streams || {};
          this._reverseStreams = this._reverseStreams || {};
          const oldStream = this._streams[stream.id];
          if (oldStream) {
            // this is using odd Chrome behaviour, use with caution:
            // https://bugs.chromium.org/p/webrtc/issues/detail?id=7815
            // Note: we rely on the high-level addTrack/dtmf shim to
            // create the sender with a dtmf sender.
            oldStream.addTrack(track);

            // Trigger ONN async.
            Promise.resolve().then(() => {
              this.dispatchEvent(new Event('negotiationneeded'));
            });
          } else {
            const newStream = new window.MediaStream([track]);
            this._streams[stream.id] = newStream;
            this._reverseStreams[newStream.id] = stream;
            this.addStream(newStream);
          }
          return this.getSenders().find(s => s.track === track);
        };

      // replace the internal stream id with the external one and
      // vice versa.
      function replaceInternalStreamId(pc, description) {
        let sdp = description.sdp;
        Object.keys(pc._reverseStreams || []).forEach(internalId => {
          const externalStream = pc._reverseStreams[internalId];
          const internalStream = pc._streams[externalStream.id];
          sdp = sdp.replace(new RegExp(internalStream.id, 'g'),
              externalStream.id);
        });
        return new RTCSessionDescription({
          type: description.type,
          sdp
        });
      }
      function replaceExternalStreamId(pc, description) {
        let sdp = description.sdp;
        Object.keys(pc._reverseStreams || []).forEach(internalId => {
          const externalStream = pc._reverseStreams[internalId];
          const internalStream = pc._streams[externalStream.id];
          sdp = sdp.replace(new RegExp(externalStream.id, 'g'),
              internalStream.id);
        });
        return new RTCSessionDescription({
          type: description.type,
          sdp
        });
      }
      ['createOffer', 'createAnswer'].forEach(function(method) {
        const nativeMethod = window.RTCPeerConnection.prototype[method];
        const methodObj = {[method]() {
          const args = arguments;
          const isLegacyCall = arguments.length &&
              typeof arguments[0] === 'function';
          if (isLegacyCall) {
            return nativeMethod.apply(this, [
              (description) => {
                const desc = replaceInternalStreamId(this, description);
                args[0].apply(null, [desc]);
              },
              (err) => {
                if (args[1]) {
                  args[1].apply(null, err);
                }
              }, arguments[2]
            ]);
          }
          return nativeMethod.apply(this, arguments)
          .then(description => replaceInternalStreamId(this, description));
        }};
        window.RTCPeerConnection.prototype[method] = methodObj[method];
      });

      const origSetLocalDescription =
          window.RTCPeerConnection.prototype.setLocalDescription;
      window.RTCPeerConnection.prototype.setLocalDescription =
        function setLocalDescription() {
          if (!arguments.length || !arguments[0].type) {
            return origSetLocalDescription.apply(this, arguments);
          }
          arguments[0] = replaceExternalStreamId(this, arguments[0]);
          return origSetLocalDescription.apply(this, arguments);
        };

      // TODO: mangle getStats: https://w3c.github.io/webrtc-stats/#dom-rtcmediastreamstats-streamidentifier

      const origLocalDescription = Object.getOwnPropertyDescriptor(
          window.RTCPeerConnection.prototype, 'localDescription');
      Object.defineProperty(window.RTCPeerConnection.prototype,
          'localDescription', {
            get() {
              const description = origLocalDescription.get.apply(this);
              if (description.type === '') {
                return description;
              }
              return replaceInternalStreamId(this, description);
            }
          });

      window.RTCPeerConnection.prototype.removeTrack =
        function removeTrack(sender) {
          if (this.signalingState === 'closed') {
            throw new DOMException(
              'The RTCPeerConnection\'s signalingState is \'closed\'.',
              'InvalidStateError');
          }
          // We can not yet check for sender instanceof RTCRtpSender
          // since we shim RTPSender. So we check if sender._pc is set.
          if (!sender._pc) {
            throw new DOMException('Argument 1 of RTCPeerConnection.removeTrack ' +
                'does not implement interface RTCRtpSender.', 'TypeError');
          }
          const isLocal = sender._pc === this;
          if (!isLocal) {
            throw new DOMException('Sender was not created by this connection.',
                'InvalidAccessError');
          }

          // Search for the native stream the senders track belongs to.
          this._streams = this._streams || {};
          let stream;
          Object.keys(this._streams).forEach(streamid => {
            const hasTrack = this._streams[streamid].getTracks()
              .find(track => sender.track === track);
            if (hasTrack) {
              stream = this._streams[streamid];
            }
          });

          if (stream) {
            if (stream.getTracks().length === 1) {
              // if this is the last track of the stream, remove the stream. This
              // takes care of any shimmed _senders.
              this.removeStream(this._reverseStreams[stream.id]);
            } else {
              // relying on the same odd chrome behaviour as above.
              stream.removeTrack(sender.track);
            }
            this.dispatchEvent(new Event('negotiationneeded'));
          }
        };
    }

    function shimPeerConnection$2(window, browserDetails) {
      if (!window.RTCPeerConnection && window.webkitRTCPeerConnection) {
        // very basic support for old versions.
        window.RTCPeerConnection = window.webkitRTCPeerConnection;
      }
      if (!window.RTCPeerConnection) {
        return;
      }

      // shim implicit creation of RTCSessionDescription/RTCIceCandidate
      if (browserDetails.version < 53) {
        ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
            .forEach(function(method) {
              const nativeMethod = window.RTCPeerConnection.prototype[method];
              const methodObj = {[method]() {
                arguments[0] = new ((method === 'addIceCandidate') ?
                    window.RTCIceCandidate :
                    window.RTCSessionDescription)(arguments[0]);
                return nativeMethod.apply(this, arguments);
              }};
              window.RTCPeerConnection.prototype[method] = methodObj[method];
            });
      }
    }

    // Attempt to fix ONN in plan-b mode.
    function fixNegotiationNeeded(window, browserDetails) {
      wrapPeerConnectionEvent(window, 'negotiationneeded', e => {
        const pc = e.target;
        if (browserDetails.version < 72 || (pc.getConfiguration &&
            pc.getConfiguration().sdpSemantics === 'plan-b')) {
          if (pc.signalingState !== 'stable') {
            return;
          }
        }
        return e;
      });
    }

    var chromeShim = /*#__PURE__*/Object.freeze({
        __proto__: null,
        shimMediaStream: shimMediaStream,
        shimOnTrack: shimOnTrack$1,
        shimGetSendersWithDtmf: shimGetSendersWithDtmf,
        shimGetStats: shimGetStats,
        shimSenderReceiverGetStats: shimSenderReceiverGetStats,
        shimAddTrackRemoveTrackWithNative: shimAddTrackRemoveTrackWithNative,
        shimAddTrackRemoveTrack: shimAddTrackRemoveTrack,
        shimPeerConnection: shimPeerConnection$2,
        fixNegotiationNeeded: fixNegotiationNeeded,
        shimGetUserMedia: shimGetUserMedia$3,
        shimGetDisplayMedia: shimGetDisplayMedia$2
    });

    /*
     *  Copyright (c) 2018 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    // Edge does not like
    // 1) stun: filtered after 14393 unless ?transport=udp is present
    // 2) turn: that does not have all of turn:host:port?transport=udp
    // 3) turn: with ipv6 addresses
    // 4) turn: occurring muliple times
    function filterIceServers$1(iceServers, edgeVersion) {
      let hasTurn = false;
      iceServers = JSON.parse(JSON.stringify(iceServers));
      return iceServers.filter(server => {
        if (server && (server.urls || server.url)) {
          let urls = server.urls || server.url;
          if (server.url && !server.urls) {
            deprecated('RTCIceServer.url', 'RTCIceServer.urls');
          }
          const isString = typeof urls === 'string';
          if (isString) {
            urls = [urls];
          }
          urls = urls.filter(url => {
            // filter STUN unconditionally.
            if (url.indexOf('stun:') === 0) {
              return false;
            }

            const validTurn = url.startsWith('turn') &&
                !url.startsWith('turn:[') &&
                url.includes('transport=udp');
            if (validTurn && !hasTurn) {
              hasTurn = true;
              return true;
            }
            return validTurn && !hasTurn;
          });

          delete server.url;
          server.urls = isString ? urls[0] : urls;
          return !!urls.length;
        }
      });
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /* eslint-env node */

    var sdp = createCommonjsModule(function (module) {

    // SDP helpers.
    var SDPUtils = {};

    // Generate an alphanumeric identifier for cname or mids.
    // TODO: use UUIDs instead? https://gist.github.com/jed/982883
    SDPUtils.generateIdentifier = function() {
      return Math.random().toString(36).substr(2, 10);
    };

    // The RTCP CNAME used by all peerconnections from the same JS.
    SDPUtils.localCName = SDPUtils.generateIdentifier();

    // Splits SDP into lines, dealing with both CRLF and LF.
    SDPUtils.splitLines = function(blob) {
      return blob.trim().split('\n').map(function(line) {
        return line.trim();
      });
    };
    // Splits SDP into sessionpart and mediasections. Ensures CRLF.
    SDPUtils.splitSections = function(blob) {
      var parts = blob.split('\nm=');
      return parts.map(function(part, index) {
        return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
      });
    };

    // returns the session description.
    SDPUtils.getDescription = function(blob) {
      var sections = SDPUtils.splitSections(blob);
      return sections && sections[0];
    };

    // returns the individual media sections.
    SDPUtils.getMediaSections = function(blob) {
      var sections = SDPUtils.splitSections(blob);
      sections.shift();
      return sections;
    };

    // Returns lines that start with a certain prefix.
    SDPUtils.matchPrefix = function(blob, prefix) {
      return SDPUtils.splitLines(blob).filter(function(line) {
        return line.indexOf(prefix) === 0;
      });
    };

    // Parses an ICE candidate line. Sample input:
    // candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
    // rport 55996"
    SDPUtils.parseCandidate = function(line) {
      var parts;
      // Parse both variants.
      if (line.indexOf('a=candidate:') === 0) {
        parts = line.substring(12).split(' ');
      } else {
        parts = line.substring(10).split(' ');
      }

      var candidate = {
        foundation: parts[0],
        component: parseInt(parts[1], 10),
        protocol: parts[2].toLowerCase(),
        priority: parseInt(parts[3], 10),
        ip: parts[4],
        address: parts[4], // address is an alias for ip.
        port: parseInt(parts[5], 10),
        // skip parts[6] == 'typ'
        type: parts[7]
      };

      for (var i = 8; i < parts.length; i += 2) {
        switch (parts[i]) {
          case 'raddr':
            candidate.relatedAddress = parts[i + 1];
            break;
          case 'rport':
            candidate.relatedPort = parseInt(parts[i + 1], 10);
            break;
          case 'tcptype':
            candidate.tcpType = parts[i + 1];
            break;
          case 'ufrag':
            candidate.ufrag = parts[i + 1]; // for backward compability.
            candidate.usernameFragment = parts[i + 1];
            break;
          default: // extension handling, in particular ufrag
            candidate[parts[i]] = parts[i + 1];
            break;
        }
      }
      return candidate;
    };

    // Translates a candidate object into SDP candidate attribute.
    SDPUtils.writeCandidate = function(candidate) {
      var sdp = [];
      sdp.push(candidate.foundation);
      sdp.push(candidate.component);
      sdp.push(candidate.protocol.toUpperCase());
      sdp.push(candidate.priority);
      sdp.push(candidate.address || candidate.ip);
      sdp.push(candidate.port);

      var type = candidate.type;
      sdp.push('typ');
      sdp.push(type);
      if (type !== 'host' && candidate.relatedAddress &&
          candidate.relatedPort) {
        sdp.push('raddr');
        sdp.push(candidate.relatedAddress);
        sdp.push('rport');
        sdp.push(candidate.relatedPort);
      }
      if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
        sdp.push('tcptype');
        sdp.push(candidate.tcpType);
      }
      if (candidate.usernameFragment || candidate.ufrag) {
        sdp.push('ufrag');
        sdp.push(candidate.usernameFragment || candidate.ufrag);
      }
      return 'candidate:' + sdp.join(' ');
    };

    // Parses an ice-options line, returns an array of option tags.
    // a=ice-options:foo bar
    SDPUtils.parseIceOptions = function(line) {
      return line.substr(14).split(' ');
    };

    // Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
    // a=rtpmap:111 opus/48000/2
    SDPUtils.parseRtpMap = function(line) {
      var parts = line.substr(9).split(' ');
      var parsed = {
        payloadType: parseInt(parts.shift(), 10) // was: id
      };

      parts = parts[0].split('/');

      parsed.name = parts[0];
      parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
      parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
      // legacy alias, got renamed back to channels in ORTC.
      parsed.numChannels = parsed.channels;
      return parsed;
    };

    // Generate an a=rtpmap line from RTCRtpCodecCapability or
    // RTCRtpCodecParameters.
    SDPUtils.writeRtpMap = function(codec) {
      var pt = codec.payloadType;
      if (codec.preferredPayloadType !== undefined) {
        pt = codec.preferredPayloadType;
      }
      var channels = codec.channels || codec.numChannels || 1;
      return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate +
          (channels !== 1 ? '/' + channels : '') + '\r\n';
    };

    // Parses an a=extmap line (headerextension from RFC 5285). Sample input:
    // a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
    // a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset
    SDPUtils.parseExtmap = function(line) {
      var parts = line.substr(9).split(' ');
      return {
        id: parseInt(parts[0], 10),
        direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
        uri: parts[1]
      };
    };

    // Generates a=extmap line from RTCRtpHeaderExtensionParameters or
    // RTCRtpHeaderExtension.
    SDPUtils.writeExtmap = function(headerExtension) {
      return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) +
          (headerExtension.direction && headerExtension.direction !== 'sendrecv'
            ? '/' + headerExtension.direction
            : '') +
          ' ' + headerExtension.uri + '\r\n';
    };

    // Parses an ftmp line, returns dictionary. Sample input:
    // a=fmtp:96 vbr=on;cng=on
    // Also deals with vbr=on; cng=on
    SDPUtils.parseFmtp = function(line) {
      var parsed = {};
      var kv;
      var parts = line.substr(line.indexOf(' ') + 1).split(';');
      for (var j = 0; j < parts.length; j++) {
        kv = parts[j].trim().split('=');
        parsed[kv[0].trim()] = kv[1];
      }
      return parsed;
    };

    // Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
    SDPUtils.writeFmtp = function(codec) {
      var line = '';
      var pt = codec.payloadType;
      if (codec.preferredPayloadType !== undefined) {
        pt = codec.preferredPayloadType;
      }
      if (codec.parameters && Object.keys(codec.parameters).length) {
        var params = [];
        Object.keys(codec.parameters).forEach(function(param) {
          if (codec.parameters[param]) {
            params.push(param + '=' + codec.parameters[param]);
          } else {
            params.push(param);
          }
        });
        line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
      }
      return line;
    };

    // Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
    // a=rtcp-fb:98 nack rpsi
    SDPUtils.parseRtcpFb = function(line) {
      var parts = line.substr(line.indexOf(' ') + 1).split(' ');
      return {
        type: parts.shift(),
        parameter: parts.join(' ')
      };
    };
    // Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
    SDPUtils.writeRtcpFb = function(codec) {
      var lines = '';
      var pt = codec.payloadType;
      if (codec.preferredPayloadType !== undefined) {
        pt = codec.preferredPayloadType;
      }
      if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
        // FIXME: special handling for trr-int?
        codec.rtcpFeedback.forEach(function(fb) {
          lines += 'a=rtcp-fb:' + pt + ' ' + fb.type +
          (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') +
              '\r\n';
        });
      }
      return lines;
    };

    // Parses an RFC 5576 ssrc media attribute. Sample input:
    // a=ssrc:3735928559 cname:something
    SDPUtils.parseSsrcMedia = function(line) {
      var sp = line.indexOf(' ');
      var parts = {
        ssrc: parseInt(line.substr(7, sp - 7), 10)
      };
      var colon = line.indexOf(':', sp);
      if (colon > -1) {
        parts.attribute = line.substr(sp + 1, colon - sp - 1);
        parts.value = line.substr(colon + 1);
      } else {
        parts.attribute = line.substr(sp + 1);
      }
      return parts;
    };

    SDPUtils.parseSsrcGroup = function(line) {
      var parts = line.substr(13).split(' ');
      return {
        semantics: parts.shift(),
        ssrcs: parts.map(function(ssrc) {
          return parseInt(ssrc, 10);
        })
      };
    };

    // Extracts the MID (RFC 5888) from a media section.
    // returns the MID or undefined if no mid line was found.
    SDPUtils.getMid = function(mediaSection) {
      var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
      if (mid) {
        return mid.substr(6);
      }
    };

    SDPUtils.parseFingerprint = function(line) {
      var parts = line.substr(14).split(' ');
      return {
        algorithm: parts[0].toLowerCase(), // algorithm is case-sensitive in Edge.
        value: parts[1]
      };
    };

    // Extracts DTLS parameters from SDP media section or sessionpart.
    // FIXME: for consistency with other functions this should only
    //   get the fingerprint line as input. See also getIceParameters.
    SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
      var lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
        'a=fingerprint:');
      // Note: a=setup line is ignored since we use the 'auto' role.
      // Note2: 'algorithm' is not case sensitive except in Edge.
      return {
        role: 'auto',
        fingerprints: lines.map(SDPUtils.parseFingerprint)
      };
    };

    // Serializes DTLS parameters to SDP.
    SDPUtils.writeDtlsParameters = function(params, setupType) {
      var sdp = 'a=setup:' + setupType + '\r\n';
      params.fingerprints.forEach(function(fp) {
        sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
      });
      return sdp;
    };

    // Parses a=crypto lines into
    //   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#dictionary-rtcsrtpsdesparameters-members
    SDPUtils.parseCryptoLine = function(line) {
      var parts = line.substr(9).split(' ');
      return {
        tag: parseInt(parts[0], 10),
        cryptoSuite: parts[1],
        keyParams: parts[2],
        sessionParams: parts.slice(3),
      };
    };

    SDPUtils.writeCryptoLine = function(parameters) {
      return 'a=crypto:' + parameters.tag + ' ' +
        parameters.cryptoSuite + ' ' +
        (typeof parameters.keyParams === 'object'
          ? SDPUtils.writeCryptoKeyParams(parameters.keyParams)
          : parameters.keyParams) +
        (parameters.sessionParams ? ' ' + parameters.sessionParams.join(' ') : '') +
        '\r\n';
    };

    // Parses the crypto key parameters into
    //   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#rtcsrtpkeyparam*
    SDPUtils.parseCryptoKeyParams = function(keyParams) {
      if (keyParams.indexOf('inline:') !== 0) {
        return null;
      }
      var parts = keyParams.substr(7).split('|');
      return {
        keyMethod: 'inline',
        keySalt: parts[0],
        lifeTime: parts[1],
        mkiValue: parts[2] ? parts[2].split(':')[0] : undefined,
        mkiLength: parts[2] ? parts[2].split(':')[1] : undefined,
      };
    };

    SDPUtils.writeCryptoKeyParams = function(keyParams) {
      return keyParams.keyMethod + ':'
        + keyParams.keySalt +
        (keyParams.lifeTime ? '|' + keyParams.lifeTime : '') +
        (keyParams.mkiValue && keyParams.mkiLength
          ? '|' + keyParams.mkiValue + ':' + keyParams.mkiLength
          : '');
    };

    // Extracts all SDES paramters.
    SDPUtils.getCryptoParameters = function(mediaSection, sessionpart) {
      var lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
        'a=crypto:');
      return lines.map(SDPUtils.parseCryptoLine);
    };

    // Parses ICE information from SDP media section or sessionpart.
    // FIXME: for consistency with other functions this should only
    //   get the ice-ufrag and ice-pwd lines as input.
    SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
      var ufrag = SDPUtils.matchPrefix(mediaSection + sessionpart,
        'a=ice-ufrag:')[0];
      var pwd = SDPUtils.matchPrefix(mediaSection + sessionpart,
        'a=ice-pwd:')[0];
      if (!(ufrag && pwd)) {
        return null;
      }
      return {
        usernameFragment: ufrag.substr(12),
        password: pwd.substr(10),
      };
    };

    // Serializes ICE parameters to SDP.
    SDPUtils.writeIceParameters = function(params) {
      return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' +
          'a=ice-pwd:' + params.password + '\r\n';
    };

    // Parses the SDP media section and returns RTCRtpParameters.
    SDPUtils.parseRtpParameters = function(mediaSection) {
      var description = {
        codecs: [],
        headerExtensions: [],
        fecMechanisms: [],
        rtcp: []
      };
      var lines = SDPUtils.splitLines(mediaSection);
      var mline = lines[0].split(' ');
      for (var i = 3; i < mline.length; i++) { // find all codecs from mline[3..]
        var pt = mline[i];
        var rtpmapline = SDPUtils.matchPrefix(
          mediaSection, 'a=rtpmap:' + pt + ' ')[0];
        if (rtpmapline) {
          var codec = SDPUtils.parseRtpMap(rtpmapline);
          var fmtps = SDPUtils.matchPrefix(
            mediaSection, 'a=fmtp:' + pt + ' ');
          // Only the first a=fmtp:<pt> is considered.
          codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
          codec.rtcpFeedback = SDPUtils.matchPrefix(
            mediaSection, 'a=rtcp-fb:' + pt + ' ')
            .map(SDPUtils.parseRtcpFb);
          description.codecs.push(codec);
          // parse FEC mechanisms from rtpmap lines.
          switch (codec.name.toUpperCase()) {
            case 'RED':
            case 'ULPFEC':
              description.fecMechanisms.push(codec.name.toUpperCase());
              break;
          }
        }
      }
      SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function(line) {
        description.headerExtensions.push(SDPUtils.parseExtmap(line));
      });
      // FIXME: parse rtcp.
      return description;
    };

    // Generates parts of the SDP media section describing the capabilities /
    // parameters.
    SDPUtils.writeRtpDescription = function(kind, caps) {
      var sdp = '';

      // Build the mline.
      sdp += 'm=' + kind + ' ';
      sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
      sdp += ' UDP/TLS/RTP/SAVPF ';
      sdp += caps.codecs.map(function(codec) {
        if (codec.preferredPayloadType !== undefined) {
          return codec.preferredPayloadType;
        }
        return codec.payloadType;
      }).join(' ') + '\r\n';

      sdp += 'c=IN IP4 0.0.0.0\r\n';
      sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

      // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
      caps.codecs.forEach(function(codec) {
        sdp += SDPUtils.writeRtpMap(codec);
        sdp += SDPUtils.writeFmtp(codec);
        sdp += SDPUtils.writeRtcpFb(codec);
      });
      var maxptime = 0;
      caps.codecs.forEach(function(codec) {
        if (codec.maxptime > maxptime) {
          maxptime = codec.maxptime;
        }
      });
      if (maxptime > 0) {
        sdp += 'a=maxptime:' + maxptime + '\r\n';
      }
      sdp += 'a=rtcp-mux\r\n';

      if (caps.headerExtensions) {
        caps.headerExtensions.forEach(function(extension) {
          sdp += SDPUtils.writeExtmap(extension);
        });
      }
      // FIXME: write fecMechanisms.
      return sdp;
    };

    // Parses the SDP media section and returns an array of
    // RTCRtpEncodingParameters.
    SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
      var encodingParameters = [];
      var description = SDPUtils.parseRtpParameters(mediaSection);
      var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
      var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;

      // filter a=ssrc:... cname:, ignore PlanB-msid
      var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
        .map(function(line) {
          return SDPUtils.parseSsrcMedia(line);
        })
        .filter(function(parts) {
          return parts.attribute === 'cname';
        });
      var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
      var secondarySsrc;

      var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID')
        .map(function(line) {
          var parts = line.substr(17).split(' ');
          return parts.map(function(part) {
            return parseInt(part, 10);
          });
        });
      if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
        secondarySsrc = flows[0][1];
      }

      description.codecs.forEach(function(codec) {
        if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
          var encParam = {
            ssrc: primarySsrc,
            codecPayloadType: parseInt(codec.parameters.apt, 10)
          };
          if (primarySsrc && secondarySsrc) {
            encParam.rtx = {ssrc: secondarySsrc};
          }
          encodingParameters.push(encParam);
          if (hasRed) {
            encParam = JSON.parse(JSON.stringify(encParam));
            encParam.fec = {
              ssrc: primarySsrc,
              mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
            };
            encodingParameters.push(encParam);
          }
        }
      });
      if (encodingParameters.length === 0 && primarySsrc) {
        encodingParameters.push({
          ssrc: primarySsrc
        });
      }

      // we support both b=AS and b=TIAS but interpret AS as TIAS.
      var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
      if (bandwidth.length) {
        if (bandwidth[0].indexOf('b=TIAS:') === 0) {
          bandwidth = parseInt(bandwidth[0].substr(7), 10);
        } else if (bandwidth[0].indexOf('b=AS:') === 0) {
          // use formula from JSEP to convert b=AS to TIAS value.
          bandwidth = parseInt(bandwidth[0].substr(5), 10) * 1000 * 0.95
              - (50 * 40 * 8);
        } else {
          bandwidth = undefined;
        }
        encodingParameters.forEach(function(params) {
          params.maxBitrate = bandwidth;
        });
      }
      return encodingParameters;
    };

    // parses http://draft.ortc.org/#rtcrtcpparameters*
    SDPUtils.parseRtcpParameters = function(mediaSection) {
      var rtcpParameters = {};

      // Gets the first SSRC. Note tha with RTX there might be multiple
      // SSRCs.
      var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
        .map(function(line) {
          return SDPUtils.parseSsrcMedia(line);
        })
        .filter(function(obj) {
          return obj.attribute === 'cname';
        })[0];
      if (remoteSsrc) {
        rtcpParameters.cname = remoteSsrc.value;
        rtcpParameters.ssrc = remoteSsrc.ssrc;
      }

      // Edge uses the compound attribute instead of reducedSize
      // compound is !reducedSize
      var rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
      rtcpParameters.reducedSize = rsize.length > 0;
      rtcpParameters.compound = rsize.length === 0;

      // parses the rtcp-mux attrіbute.
      // Note that Edge does not support unmuxed RTCP.
      var mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
      rtcpParameters.mux = mux.length > 0;

      return rtcpParameters;
    };

    // parses either a=msid: or a=ssrc:... msid lines and returns
    // the id of the MediaStream and MediaStreamTrack.
    SDPUtils.parseMsid = function(mediaSection) {
      var parts;
      var spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
      if (spec.length === 1) {
        parts = spec[0].substr(7).split(' ');
        return {stream: parts[0], track: parts[1]};
      }
      var planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
        .map(function(line) {
          return SDPUtils.parseSsrcMedia(line);
        })
        .filter(function(msidParts) {
          return msidParts.attribute === 'msid';
        });
      if (planB.length > 0) {
        parts = planB[0].value.split(' ');
        return {stream: parts[0], track: parts[1]};
      }
    };

    // SCTP
    // parses draft-ietf-mmusic-sctp-sdp-26 first and falls back
    // to draft-ietf-mmusic-sctp-sdp-05
    SDPUtils.parseSctpDescription = function(mediaSection) {
      var mline = SDPUtils.parseMLine(mediaSection);
      var maxSizeLine = SDPUtils.matchPrefix(mediaSection, 'a=max-message-size:');
      var maxMessageSize;
      if (maxSizeLine.length > 0) {
        maxMessageSize = parseInt(maxSizeLine[0].substr(19), 10);
      }
      if (isNaN(maxMessageSize)) {
        maxMessageSize = 65536;
      }
      var sctpPort = SDPUtils.matchPrefix(mediaSection, 'a=sctp-port:');
      if (sctpPort.length > 0) {
        return {
          port: parseInt(sctpPort[0].substr(12), 10),
          protocol: mline.fmt,
          maxMessageSize: maxMessageSize
        };
      }
      var sctpMapLines = SDPUtils.matchPrefix(mediaSection, 'a=sctpmap:');
      if (sctpMapLines.length > 0) {
        var parts = SDPUtils.matchPrefix(mediaSection, 'a=sctpmap:')[0]
          .substr(10)
          .split(' ');
        return {
          port: parseInt(parts[0], 10),
          protocol: parts[1],
          maxMessageSize: maxMessageSize
        };
      }
    };

    // SCTP
    // outputs the draft-ietf-mmusic-sctp-sdp-26 version that all browsers
    // support by now receiving in this format, unless we originally parsed
    // as the draft-ietf-mmusic-sctp-sdp-05 format (indicated by the m-line
    // protocol of DTLS/SCTP -- without UDP/ or TCP/)
    SDPUtils.writeSctpDescription = function(media, sctp) {
      var output = [];
      if (media.protocol !== 'DTLS/SCTP') {
        output = [
          'm=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.protocol + '\r\n',
          'c=IN IP4 0.0.0.0\r\n',
          'a=sctp-port:' + sctp.port + '\r\n'
        ];
      } else {
        output = [
          'm=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.port + '\r\n',
          'c=IN IP4 0.0.0.0\r\n',
          'a=sctpmap:' + sctp.port + ' ' + sctp.protocol + ' 65535\r\n'
        ];
      }
      if (sctp.maxMessageSize !== undefined) {
        output.push('a=max-message-size:' + sctp.maxMessageSize + '\r\n');
      }
      return output.join('');
    };

    // Generate a session ID for SDP.
    // https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-5.2.1
    // recommends using a cryptographically random +ve 64-bit value
    // but right now this should be acceptable and within the right range
    SDPUtils.generateSessionId = function() {
      return Math.random().toString().substr(2, 21);
    };

    // Write boilder plate for start of SDP
    // sessId argument is optional - if not supplied it will
    // be generated randomly
    // sessVersion is optional and defaults to 2
    // sessUser is optional and defaults to 'thisisadapterortc'
    SDPUtils.writeSessionBoilerplate = function(sessId, sessVer, sessUser) {
      var sessionId;
      var version = sessVer !== undefined ? sessVer : 2;
      if (sessId) {
        sessionId = sessId;
      } else {
        sessionId = SDPUtils.generateSessionId();
      }
      var user = sessUser || 'thisisadapterortc';
      // FIXME: sess-id should be an NTP timestamp.
      return 'v=0\r\n' +
          'o=' + user + ' ' + sessionId + ' ' + version +
            ' IN IP4 127.0.0.1\r\n' +
          's=-\r\n' +
          't=0 0\r\n';
    };

    SDPUtils.writeMediaSection = function(transceiver, caps, type, stream) {
      var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

      // Map ICE parameters (ufrag, pwd) to SDP.
      sdp += SDPUtils.writeIceParameters(
        transceiver.iceGatherer.getLocalParameters());

      // Map DTLS parameters to SDP.
      sdp += SDPUtils.writeDtlsParameters(
        transceiver.dtlsTransport.getLocalParameters(),
        type === 'offer' ? 'actpass' : 'active');

      sdp += 'a=mid:' + transceiver.mid + '\r\n';

      if (transceiver.direction) {
        sdp += 'a=' + transceiver.direction + '\r\n';
      } else if (transceiver.rtpSender && transceiver.rtpReceiver) {
        sdp += 'a=sendrecv\r\n';
      } else if (transceiver.rtpSender) {
        sdp += 'a=sendonly\r\n';
      } else if (transceiver.rtpReceiver) {
        sdp += 'a=recvonly\r\n';
      } else {
        sdp += 'a=inactive\r\n';
      }

      if (transceiver.rtpSender) {
        // spec.
        var msid = 'msid:' + stream.id + ' ' +
            transceiver.rtpSender.track.id + '\r\n';
        sdp += 'a=' + msid;

        // for Chrome.
        sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
            ' ' + msid;
        if (transceiver.sendEncodingParameters[0].rtx) {
          sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
              ' ' + msid;
          sdp += 'a=ssrc-group:FID ' +
              transceiver.sendEncodingParameters[0].ssrc + ' ' +
              transceiver.sendEncodingParameters[0].rtx.ssrc +
              '\r\n';
        }
      }
      // FIXME: this should be written by writeRtpDescription.
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
          ' cname:' + SDPUtils.localCName + '\r\n';
      if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
        sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
            ' cname:' + SDPUtils.localCName + '\r\n';
      }
      return sdp;
    };

    // Gets the direction from the mediaSection or the sessionpart.
    SDPUtils.getDirection = function(mediaSection, sessionpart) {
      // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
      var lines = SDPUtils.splitLines(mediaSection);
      for (var i = 0; i < lines.length; i++) {
        switch (lines[i]) {
          case 'a=sendrecv':
          case 'a=sendonly':
          case 'a=recvonly':
          case 'a=inactive':
            return lines[i].substr(2);
            // FIXME: What should happen here?
        }
      }
      if (sessionpart) {
        return SDPUtils.getDirection(sessionpart);
      }
      return 'sendrecv';
    };

    SDPUtils.getKind = function(mediaSection) {
      var lines = SDPUtils.splitLines(mediaSection);
      var mline = lines[0].split(' ');
      return mline[0].substr(2);
    };

    SDPUtils.isRejected = function(mediaSection) {
      return mediaSection.split(' ', 2)[1] === '0';
    };

    SDPUtils.parseMLine = function(mediaSection) {
      var lines = SDPUtils.splitLines(mediaSection);
      var parts = lines[0].substr(2).split(' ');
      return {
        kind: parts[0],
        port: parseInt(parts[1], 10),
        protocol: parts[2],
        fmt: parts.slice(3).join(' ')
      };
    };

    SDPUtils.parseOLine = function(mediaSection) {
      var line = SDPUtils.matchPrefix(mediaSection, 'o=')[0];
      var parts = line.substr(2).split(' ');
      return {
        username: parts[0],
        sessionId: parts[1],
        sessionVersion: parseInt(parts[2], 10),
        netType: parts[3],
        addressType: parts[4],
        address: parts[5]
      };
    };

    // a very naive interpretation of a valid SDP.
    SDPUtils.isValidSDP = function(blob) {
      if (typeof blob !== 'string' || blob.length === 0) {
        return false;
      }
      var lines = SDPUtils.splitLines(blob);
      for (var i = 0; i < lines.length; i++) {
        if (lines[i].length < 2 || lines[i].charAt(1) !== '=') {
          return false;
        }
        // TODO: check the modifier a bit more.
      }
      return true;
    };

    // Expose public methods.
    {
      module.exports = SDPUtils;
    }
    });

    /*
     *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */



    function fixStatsType(stat) {
      return {
        inboundrtp: 'inbound-rtp',
        outboundrtp: 'outbound-rtp',
        candidatepair: 'candidate-pair',
        localcandidate: 'local-candidate',
        remotecandidate: 'remote-candidate'
      }[stat.type] || stat.type;
    }

    function writeMediaSection(transceiver, caps, type, stream, dtlsRole) {
      var sdp$1 = sdp.writeRtpDescription(transceiver.kind, caps);

      // Map ICE parameters (ufrag, pwd) to SDP.
      sdp$1 += sdp.writeIceParameters(
          transceiver.iceGatherer.getLocalParameters());

      // Map DTLS parameters to SDP.
      sdp$1 += sdp.writeDtlsParameters(
          transceiver.dtlsTransport.getLocalParameters(),
          type === 'offer' ? 'actpass' : dtlsRole || 'active');

      sdp$1 += 'a=mid:' + transceiver.mid + '\r\n';

      if (transceiver.rtpSender && transceiver.rtpReceiver) {
        sdp$1 += 'a=sendrecv\r\n';
      } else if (transceiver.rtpSender) {
        sdp$1 += 'a=sendonly\r\n';
      } else if (transceiver.rtpReceiver) {
        sdp$1 += 'a=recvonly\r\n';
      } else {
        sdp$1 += 'a=inactive\r\n';
      }

      if (transceiver.rtpSender) {
        var trackId = transceiver.rtpSender._initialTrackId ||
            transceiver.rtpSender.track.id;
        transceiver.rtpSender._initialTrackId = trackId;
        // spec.
        var msid = 'msid:' + (stream ? stream.id : '-') + ' ' +
            trackId + '\r\n';
        sdp$1 += 'a=' + msid;
        // for Chrome. Legacy should no longer be required.
        sdp$1 += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
            ' ' + msid;

        // RTX
        if (transceiver.sendEncodingParameters[0].rtx) {
          sdp$1 += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
              ' ' + msid;
          sdp$1 += 'a=ssrc-group:FID ' +
              transceiver.sendEncodingParameters[0].ssrc + ' ' +
              transceiver.sendEncodingParameters[0].rtx.ssrc +
              '\r\n';
        }
      }
      // FIXME: this should be written by writeRtpDescription.
      sdp$1 += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
          ' cname:' + sdp.localCName + '\r\n';
      if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
        sdp$1 += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
            ' cname:' + sdp.localCName + '\r\n';
      }
      return sdp$1;
    }

    // Edge does not like
    // 1) stun: filtered after 14393 unless ?transport=udp is present
    // 2) turn: that does not have all of turn:host:port?transport=udp
    // 3) turn: with ipv6 addresses
    // 4) turn: occurring muliple times
    function filterIceServers(iceServers, edgeVersion) {
      var hasTurn = false;
      iceServers = JSON.parse(JSON.stringify(iceServers));
      return iceServers.filter(function(server) {
        if (server && (server.urls || server.url)) {
          var urls = server.urls || server.url;
          if (server.url && !server.urls) {
            console.warn('RTCIceServer.url is deprecated! Use urls instead.');
          }
          var isString = typeof urls === 'string';
          if (isString) {
            urls = [urls];
          }
          urls = urls.filter(function(url) {
            var validTurn = url.indexOf('turn:') === 0 &&
                url.indexOf('transport=udp') !== -1 &&
                url.indexOf('turn:[') === -1 &&
                !hasTurn;

            if (validTurn) {
              hasTurn = true;
              return true;
            }
            return url.indexOf('stun:') === 0 && edgeVersion >= 14393 &&
                url.indexOf('?transport=udp') === -1;
          });

          delete server.url;
          server.urls = isString ? urls[0] : urls;
          return !!urls.length;
        }
      });
    }

    // Determines the intersection of local and remote capabilities.
    function getCommonCapabilities(localCapabilities, remoteCapabilities) {
      var commonCapabilities = {
        codecs: [],
        headerExtensions: [],
        fecMechanisms: []
      };

      var findCodecByPayloadType = function(pt, codecs) {
        pt = parseInt(pt, 10);
        for (var i = 0; i < codecs.length; i++) {
          if (codecs[i].payloadType === pt ||
              codecs[i].preferredPayloadType === pt) {
            return codecs[i];
          }
        }
      };

      var rtxCapabilityMatches = function(lRtx, rRtx, lCodecs, rCodecs) {
        var lCodec = findCodecByPayloadType(lRtx.parameters.apt, lCodecs);
        var rCodec = findCodecByPayloadType(rRtx.parameters.apt, rCodecs);
        return lCodec && rCodec &&
            lCodec.name.toLowerCase() === rCodec.name.toLowerCase();
      };

      localCapabilities.codecs.forEach(function(lCodec) {
        for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
          var rCodec = remoteCapabilities.codecs[i];
          if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() &&
              lCodec.clockRate === rCodec.clockRate) {
            if (lCodec.name.toLowerCase() === 'rtx' &&
                lCodec.parameters && rCodec.parameters.apt) {
              // for RTX we need to find the local rtx that has a apt
              // which points to the same local codec as the remote one.
              if (!rtxCapabilityMatches(lCodec, rCodec,
                  localCapabilities.codecs, remoteCapabilities.codecs)) {
                continue;
              }
            }
            rCodec = JSON.parse(JSON.stringify(rCodec)); // deepcopy
            // number of channels is the highest common number of channels
            rCodec.numChannels = Math.min(lCodec.numChannels,
                rCodec.numChannels);
            // push rCodec so we reply with offerer payload type
            commonCapabilities.codecs.push(rCodec);

            // determine common feedback mechanisms
            rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function(fb) {
              for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
                if (lCodec.rtcpFeedback[j].type === fb.type &&
                    lCodec.rtcpFeedback[j].parameter === fb.parameter) {
                  return true;
                }
              }
              return false;
            });
            // FIXME: also need to determine .parameters
            //  see https://github.com/openpeer/ortc/issues/569
            break;
          }
        }
      });

      localCapabilities.headerExtensions.forEach(function(lHeaderExtension) {
        for (var i = 0; i < remoteCapabilities.headerExtensions.length;
             i++) {
          var rHeaderExtension = remoteCapabilities.headerExtensions[i];
          if (lHeaderExtension.uri === rHeaderExtension.uri) {
            commonCapabilities.headerExtensions.push(rHeaderExtension);
            break;
          }
        }
      });

      // FIXME: fecMechanisms
      return commonCapabilities;
    }

    // is action=setLocalDescription with type allowed in signalingState
    function isActionAllowedInSignalingState(action, type, signalingState) {
      return {
        offer: {
          setLocalDescription: ['stable', 'have-local-offer'],
          setRemoteDescription: ['stable', 'have-remote-offer']
        },
        answer: {
          setLocalDescription: ['have-remote-offer', 'have-local-pranswer'],
          setRemoteDescription: ['have-local-offer', 'have-remote-pranswer']
        }
      }[type][action].indexOf(signalingState) !== -1;
    }

    function maybeAddCandidate(iceTransport, candidate) {
      // Edge's internal representation adds some fields therefore
      // not all fieldѕ are taken into account.
      var alreadyAdded = iceTransport.getRemoteCandidates()
          .find(function(remoteCandidate) {
            return candidate.foundation === remoteCandidate.foundation &&
                candidate.ip === remoteCandidate.ip &&
                candidate.port === remoteCandidate.port &&
                candidate.priority === remoteCandidate.priority &&
                candidate.protocol === remoteCandidate.protocol &&
                candidate.type === remoteCandidate.type;
          });
      if (!alreadyAdded) {
        iceTransport.addRemoteCandidate(candidate);
      }
      return !alreadyAdded;
    }


    function makeError(name, description) {
      var e = new Error(description);
      e.name = name;
      // legacy error codes from https://heycam.github.io/webidl/#idl-DOMException-error-names
      e.code = {
        NotSupportedError: 9,
        InvalidStateError: 11,
        InvalidAccessError: 15,
        TypeError: undefined,
        OperationError: undefined
      }[name];
      return e;
    }

    var rtcpeerconnection = function(window, edgeVersion) {
      // https://w3c.github.io/mediacapture-main/#mediastream
      // Helper function to add the track to the stream and
      // dispatch the event ourselves.
      function addTrackToStreamAndFireEvent(track, stream) {
        stream.addTrack(track);
        stream.dispatchEvent(new window.MediaStreamTrackEvent('addtrack',
            {track: track}));
      }

      function removeTrackFromStreamAndFireEvent(track, stream) {
        stream.removeTrack(track);
        stream.dispatchEvent(new window.MediaStreamTrackEvent('removetrack',
            {track: track}));
      }

      function fireAddTrack(pc, track, receiver, streams) {
        var trackEvent = new Event('track');
        trackEvent.track = track;
        trackEvent.receiver = receiver;
        trackEvent.transceiver = {receiver: receiver};
        trackEvent.streams = streams;
        window.setTimeout(function() {
          pc._dispatchEvent('track', trackEvent);
        });
      }

      var RTCPeerConnection = function(config) {
        var pc = this;

        var _eventTarget = document.createDocumentFragment();
        ['addEventListener', 'removeEventListener', 'dispatchEvent']
            .forEach(function(method) {
              pc[method] = _eventTarget[method].bind(_eventTarget);
            });

        this.canTrickleIceCandidates = null;

        this.needNegotiation = false;

        this.localStreams = [];
        this.remoteStreams = [];

        this._localDescription = null;
        this._remoteDescription = null;

        this.signalingState = 'stable';
        this.iceConnectionState = 'new';
        this.connectionState = 'new';
        this.iceGatheringState = 'new';

        config = JSON.parse(JSON.stringify(config || {}));

        this.usingBundle = config.bundlePolicy === 'max-bundle';
        if (config.rtcpMuxPolicy === 'negotiate') {
          throw(makeError('NotSupportedError',
              'rtcpMuxPolicy \'negotiate\' is not supported'));
        } else if (!config.rtcpMuxPolicy) {
          config.rtcpMuxPolicy = 'require';
        }

        switch (config.iceTransportPolicy) {
          case 'all':
          case 'relay':
            break;
          default:
            config.iceTransportPolicy = 'all';
            break;
        }

        switch (config.bundlePolicy) {
          case 'balanced':
          case 'max-compat':
          case 'max-bundle':
            break;
          default:
            config.bundlePolicy = 'balanced';
            break;
        }

        config.iceServers = filterIceServers(config.iceServers || [], edgeVersion);

        this._iceGatherers = [];
        if (config.iceCandidatePoolSize) {
          for (var i = config.iceCandidatePoolSize; i > 0; i--) {
            this._iceGatherers.push(new window.RTCIceGatherer({
              iceServers: config.iceServers,
              gatherPolicy: config.iceTransportPolicy
            }));
          }
        } else {
          config.iceCandidatePoolSize = 0;
        }

        this._config = config;

        // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
        // everything that is needed to describe a SDP m-line.
        this.transceivers = [];

        this._sdpSessionId = sdp.generateSessionId();
        this._sdpSessionVersion = 0;

        this._dtlsRole = undefined; // role for a=setup to use in answers.

        this._isClosed = false;
      };

      Object.defineProperty(RTCPeerConnection.prototype, 'localDescription', {
        configurable: true,
        get: function() {
          return this._localDescription;
        }
      });
      Object.defineProperty(RTCPeerConnection.prototype, 'remoteDescription', {
        configurable: true,
        get: function() {
          return this._remoteDescription;
        }
      });

      // set up event handlers on prototype
      RTCPeerConnection.prototype.onicecandidate = null;
      RTCPeerConnection.prototype.onaddstream = null;
      RTCPeerConnection.prototype.ontrack = null;
      RTCPeerConnection.prototype.onremovestream = null;
      RTCPeerConnection.prototype.onsignalingstatechange = null;
      RTCPeerConnection.prototype.oniceconnectionstatechange = null;
      RTCPeerConnection.prototype.onconnectionstatechange = null;
      RTCPeerConnection.prototype.onicegatheringstatechange = null;
      RTCPeerConnection.prototype.onnegotiationneeded = null;
      RTCPeerConnection.prototype.ondatachannel = null;

      RTCPeerConnection.prototype._dispatchEvent = function(name, event) {
        if (this._isClosed) {
          return;
        }
        this.dispatchEvent(event);
        if (typeof this['on' + name] === 'function') {
          this['on' + name](event);
        }
      };

      RTCPeerConnection.prototype._emitGatheringStateChange = function() {
        var event = new Event('icegatheringstatechange');
        this._dispatchEvent('icegatheringstatechange', event);
      };

      RTCPeerConnection.prototype.getConfiguration = function() {
        return this._config;
      };

      RTCPeerConnection.prototype.getLocalStreams = function() {
        return this.localStreams;
      };

      RTCPeerConnection.prototype.getRemoteStreams = function() {
        return this.remoteStreams;
      };

      // internal helper to create a transceiver object.
      // (which is not yet the same as the WebRTC 1.0 transceiver)
      RTCPeerConnection.prototype._createTransceiver = function(kind, doNotAdd) {
        var hasBundleTransport = this.transceivers.length > 0;
        var transceiver = {
          track: null,
          iceGatherer: null,
          iceTransport: null,
          dtlsTransport: null,
          localCapabilities: null,
          remoteCapabilities: null,
          rtpSender: null,
          rtpReceiver: null,
          kind: kind,
          mid: null,
          sendEncodingParameters: null,
          recvEncodingParameters: null,
          stream: null,
          associatedRemoteMediaStreams: [],
          wantReceive: true
        };
        if (this.usingBundle && hasBundleTransport) {
          transceiver.iceTransport = this.transceivers[0].iceTransport;
          transceiver.dtlsTransport = this.transceivers[0].dtlsTransport;
        } else {
          var transports = this._createIceAndDtlsTransports();
          transceiver.iceTransport = transports.iceTransport;
          transceiver.dtlsTransport = transports.dtlsTransport;
        }
        if (!doNotAdd) {
          this.transceivers.push(transceiver);
        }
        return transceiver;
      };

      RTCPeerConnection.prototype.addTrack = function(track, stream) {
        if (this._isClosed) {
          throw makeError('InvalidStateError',
              'Attempted to call addTrack on a closed peerconnection.');
        }

        var alreadyExists = this.transceivers.find(function(s) {
          return s.track === track;
        });

        if (alreadyExists) {
          throw makeError('InvalidAccessError', 'Track already exists.');
        }

        var transceiver;
        for (var i = 0; i < this.transceivers.length; i++) {
          if (!this.transceivers[i].track &&
              this.transceivers[i].kind === track.kind) {
            transceiver = this.transceivers[i];
          }
        }
        if (!transceiver) {
          transceiver = this._createTransceiver(track.kind);
        }

        this._maybeFireNegotiationNeeded();

        if (this.localStreams.indexOf(stream) === -1) {
          this.localStreams.push(stream);
        }

        transceiver.track = track;
        transceiver.stream = stream;
        transceiver.rtpSender = new window.RTCRtpSender(track,
            transceiver.dtlsTransport);
        return transceiver.rtpSender;
      };

      RTCPeerConnection.prototype.addStream = function(stream) {
        var pc = this;
        if (edgeVersion >= 15025) {
          stream.getTracks().forEach(function(track) {
            pc.addTrack(track, stream);
          });
        } else {
          // Clone is necessary for local demos mostly, attaching directly
          // to two different senders does not work (build 10547).
          // Fixed in 15025 (or earlier)
          var clonedStream = stream.clone();
          stream.getTracks().forEach(function(track, idx) {
            var clonedTrack = clonedStream.getTracks()[idx];
            track.addEventListener('enabled', function(event) {
              clonedTrack.enabled = event.enabled;
            });
          });
          clonedStream.getTracks().forEach(function(track) {
            pc.addTrack(track, clonedStream);
          });
        }
      };

      RTCPeerConnection.prototype.removeTrack = function(sender) {
        if (this._isClosed) {
          throw makeError('InvalidStateError',
              'Attempted to call removeTrack on a closed peerconnection.');
        }

        if (!(sender instanceof window.RTCRtpSender)) {
          throw new TypeError('Argument 1 of RTCPeerConnection.removeTrack ' +
              'does not implement interface RTCRtpSender.');
        }

        var transceiver = this.transceivers.find(function(t) {
          return t.rtpSender === sender;
        });

        if (!transceiver) {
          throw makeError('InvalidAccessError',
              'Sender was not created by this connection.');
        }
        var stream = transceiver.stream;

        transceiver.rtpSender.stop();
        transceiver.rtpSender = null;
        transceiver.track = null;
        transceiver.stream = null;

        // remove the stream from the set of local streams
        var localStreams = this.transceivers.map(function(t) {
          return t.stream;
        });
        if (localStreams.indexOf(stream) === -1 &&
            this.localStreams.indexOf(stream) > -1) {
          this.localStreams.splice(this.localStreams.indexOf(stream), 1);
        }

        this._maybeFireNegotiationNeeded();
      };

      RTCPeerConnection.prototype.removeStream = function(stream) {
        var pc = this;
        stream.getTracks().forEach(function(track) {
          var sender = pc.getSenders().find(function(s) {
            return s.track === track;
          });
          if (sender) {
            pc.removeTrack(sender);
          }
        });
      };

      RTCPeerConnection.prototype.getSenders = function() {
        return this.transceivers.filter(function(transceiver) {
          return !!transceiver.rtpSender;
        })
        .map(function(transceiver) {
          return transceiver.rtpSender;
        });
      };

      RTCPeerConnection.prototype.getReceivers = function() {
        return this.transceivers.filter(function(transceiver) {
          return !!transceiver.rtpReceiver;
        })
        .map(function(transceiver) {
          return transceiver.rtpReceiver;
        });
      };


      RTCPeerConnection.prototype._createIceGatherer = function(sdpMLineIndex,
          usingBundle) {
        var pc = this;
        if (usingBundle && sdpMLineIndex > 0) {
          return this.transceivers[0].iceGatherer;
        } else if (this._iceGatherers.length) {
          return this._iceGatherers.shift();
        }
        var iceGatherer = new window.RTCIceGatherer({
          iceServers: this._config.iceServers,
          gatherPolicy: this._config.iceTransportPolicy
        });
        Object.defineProperty(iceGatherer, 'state',
            {value: 'new', writable: true}
        );

        this.transceivers[sdpMLineIndex].bufferedCandidateEvents = [];
        this.transceivers[sdpMLineIndex].bufferCandidates = function(event) {
          var end = !event.candidate || Object.keys(event.candidate).length === 0;
          // polyfill since RTCIceGatherer.state is not implemented in
          // Edge 10547 yet.
          iceGatherer.state = end ? 'completed' : 'gathering';
          if (pc.transceivers[sdpMLineIndex].bufferedCandidateEvents !== null) {
            pc.transceivers[sdpMLineIndex].bufferedCandidateEvents.push(event);
          }
        };
        iceGatherer.addEventListener('localcandidate',
          this.transceivers[sdpMLineIndex].bufferCandidates);
        return iceGatherer;
      };

      // start gathering from an RTCIceGatherer.
      RTCPeerConnection.prototype._gather = function(mid, sdpMLineIndex) {
        var pc = this;
        var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
        if (iceGatherer.onlocalcandidate) {
          return;
        }
        var bufferedCandidateEvents =
          this.transceivers[sdpMLineIndex].bufferedCandidateEvents;
        this.transceivers[sdpMLineIndex].bufferedCandidateEvents = null;
        iceGatherer.removeEventListener('localcandidate',
          this.transceivers[sdpMLineIndex].bufferCandidates);
        iceGatherer.onlocalcandidate = function(evt) {
          if (pc.usingBundle && sdpMLineIndex > 0) {
            // if we know that we use bundle we can drop candidates with
            // ѕdpMLineIndex > 0. If we don't do this then our state gets
            // confused since we dispose the extra ice gatherer.
            return;
          }
          var event = new Event('icecandidate');
          event.candidate = {sdpMid: mid, sdpMLineIndex: sdpMLineIndex};

          var cand = evt.candidate;
          // Edge emits an empty object for RTCIceCandidateComplete‥
          var end = !cand || Object.keys(cand).length === 0;
          if (end) {
            // polyfill since RTCIceGatherer.state is not implemented in
            // Edge 10547 yet.
            if (iceGatherer.state === 'new' || iceGatherer.state === 'gathering') {
              iceGatherer.state = 'completed';
            }
          } else {
            if (iceGatherer.state === 'new') {
              iceGatherer.state = 'gathering';
            }
            // RTCIceCandidate doesn't have a component, needs to be added
            cand.component = 1;
            // also the usernameFragment. TODO: update SDP to take both variants.
            cand.ufrag = iceGatherer.getLocalParameters().usernameFragment;

            var serializedCandidate = sdp.writeCandidate(cand);
            event.candidate = Object.assign(event.candidate,
                sdp.parseCandidate(serializedCandidate));

            event.candidate.candidate = serializedCandidate;
            event.candidate.toJSON = function() {
              return {
                candidate: event.candidate.candidate,
                sdpMid: event.candidate.sdpMid,
                sdpMLineIndex: event.candidate.sdpMLineIndex,
                usernameFragment: event.candidate.usernameFragment
              };
            };
          }

          // update local description.
          var sections = sdp.getMediaSections(pc._localDescription.sdp);
          if (!end) {
            sections[event.candidate.sdpMLineIndex] +=
                'a=' + event.candidate.candidate + '\r\n';
          } else {
            sections[event.candidate.sdpMLineIndex] +=
                'a=end-of-candidates\r\n';
          }
          pc._localDescription.sdp =
              sdp.getDescription(pc._localDescription.sdp) +
              sections.join('');
          var complete = pc.transceivers.every(function(transceiver) {
            return transceiver.iceGatherer &&
                transceiver.iceGatherer.state === 'completed';
          });

          if (pc.iceGatheringState !== 'gathering') {
            pc.iceGatheringState = 'gathering';
            pc._emitGatheringStateChange();
          }

          // Emit candidate. Also emit null candidate when all gatherers are
          // complete.
          if (!end) {
            pc._dispatchEvent('icecandidate', event);
          }
          if (complete) {
            pc._dispatchEvent('icecandidate', new Event('icecandidate'));
            pc.iceGatheringState = 'complete';
            pc._emitGatheringStateChange();
          }
        };

        // emit already gathered candidates.
        window.setTimeout(function() {
          bufferedCandidateEvents.forEach(function(e) {
            iceGatherer.onlocalcandidate(e);
          });
        }, 0);
      };

      // Create ICE transport and DTLS transport.
      RTCPeerConnection.prototype._createIceAndDtlsTransports = function() {
        var pc = this;
        var iceTransport = new window.RTCIceTransport(null);
        iceTransport.onicestatechange = function() {
          pc._updateIceConnectionState();
          pc._updateConnectionState();
        };

        var dtlsTransport = new window.RTCDtlsTransport(iceTransport);
        dtlsTransport.ondtlsstatechange = function() {
          pc._updateConnectionState();
        };
        dtlsTransport.onerror = function() {
          // onerror does not set state to failed by itself.
          Object.defineProperty(dtlsTransport, 'state',
              {value: 'failed', writable: true});
          pc._updateConnectionState();
        };

        return {
          iceTransport: iceTransport,
          dtlsTransport: dtlsTransport
        };
      };

      // Destroy ICE gatherer, ICE transport and DTLS transport.
      // Without triggering the callbacks.
      RTCPeerConnection.prototype._disposeIceAndDtlsTransports = function(
          sdpMLineIndex) {
        var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
        if (iceGatherer) {
          delete iceGatherer.onlocalcandidate;
          delete this.transceivers[sdpMLineIndex].iceGatherer;
        }
        var iceTransport = this.transceivers[sdpMLineIndex].iceTransport;
        if (iceTransport) {
          delete iceTransport.onicestatechange;
          delete this.transceivers[sdpMLineIndex].iceTransport;
        }
        var dtlsTransport = this.transceivers[sdpMLineIndex].dtlsTransport;
        if (dtlsTransport) {
          delete dtlsTransport.ondtlsstatechange;
          delete dtlsTransport.onerror;
          delete this.transceivers[sdpMLineIndex].dtlsTransport;
        }
      };

      // Start the RTP Sender and Receiver for a transceiver.
      RTCPeerConnection.prototype._transceive = function(transceiver,
          send, recv) {
        var params = getCommonCapabilities(transceiver.localCapabilities,
            transceiver.remoteCapabilities);
        if (send && transceiver.rtpSender) {
          params.encodings = transceiver.sendEncodingParameters;
          params.rtcp = {
            cname: sdp.localCName,
            compound: transceiver.rtcpParameters.compound
          };
          if (transceiver.recvEncodingParameters.length) {
            params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
          }
          transceiver.rtpSender.send(params);
        }
        if (recv && transceiver.rtpReceiver && params.codecs.length > 0) {
          // remove RTX field in Edge 14942
          if (transceiver.kind === 'video'
              && transceiver.recvEncodingParameters
              && edgeVersion < 15019) {
            transceiver.recvEncodingParameters.forEach(function(p) {
              delete p.rtx;
            });
          }
          if (transceiver.recvEncodingParameters.length) {
            params.encodings = transceiver.recvEncodingParameters;
          } else {
            params.encodings = [{}];
          }
          params.rtcp = {
            compound: transceiver.rtcpParameters.compound
          };
          if (transceiver.rtcpParameters.cname) {
            params.rtcp.cname = transceiver.rtcpParameters.cname;
          }
          if (transceiver.sendEncodingParameters.length) {
            params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
          }
          transceiver.rtpReceiver.receive(params);
        }
      };

      RTCPeerConnection.prototype.setLocalDescription = function(description) {
        var pc = this;

        // Note: pranswer is not supported.
        if (['offer', 'answer'].indexOf(description.type) === -1) {
          return Promise.reject(makeError('TypeError',
              'Unsupported type "' + description.type + '"'));
        }

        if (!isActionAllowedInSignalingState('setLocalDescription',
            description.type, pc.signalingState) || pc._isClosed) {
          return Promise.reject(makeError('InvalidStateError',
              'Can not set local ' + description.type +
              ' in state ' + pc.signalingState));
        }

        var sections;
        var sessionpart;
        if (description.type === 'offer') {
          // VERY limited support for SDP munging. Limited to:
          // * changing the order of codecs
          sections = sdp.splitSections(description.sdp);
          sessionpart = sections.shift();
          sections.forEach(function(mediaSection, sdpMLineIndex) {
            var caps = sdp.parseRtpParameters(mediaSection);
            pc.transceivers[sdpMLineIndex].localCapabilities = caps;
          });

          pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
            pc._gather(transceiver.mid, sdpMLineIndex);
          });
        } else if (description.type === 'answer') {
          sections = sdp.splitSections(pc._remoteDescription.sdp);
          sessionpart = sections.shift();
          var isIceLite = sdp.matchPrefix(sessionpart,
              'a=ice-lite').length > 0;
          sections.forEach(function(mediaSection, sdpMLineIndex) {
            var transceiver = pc.transceivers[sdpMLineIndex];
            var iceGatherer = transceiver.iceGatherer;
            var iceTransport = transceiver.iceTransport;
            var dtlsTransport = transceiver.dtlsTransport;
            var localCapabilities = transceiver.localCapabilities;
            var remoteCapabilities = transceiver.remoteCapabilities;

            // treat bundle-only as not-rejected.
            var rejected = sdp.isRejected(mediaSection) &&
                sdp.matchPrefix(mediaSection, 'a=bundle-only').length === 0;

            if (!rejected && !transceiver.rejected) {
              var remoteIceParameters = sdp.getIceParameters(
                  mediaSection, sessionpart);
              var remoteDtlsParameters = sdp.getDtlsParameters(
                  mediaSection, sessionpart);
              if (isIceLite) {
                remoteDtlsParameters.role = 'server';
              }

              if (!pc.usingBundle || sdpMLineIndex === 0) {
                pc._gather(transceiver.mid, sdpMLineIndex);
                if (iceTransport.state === 'new') {
                  iceTransport.start(iceGatherer, remoteIceParameters,
                      isIceLite ? 'controlling' : 'controlled');
                }
                if (dtlsTransport.state === 'new') {
                  dtlsTransport.start(remoteDtlsParameters);
                }
              }

              // Calculate intersection of capabilities.
              var params = getCommonCapabilities(localCapabilities,
                  remoteCapabilities);

              // Start the RTCRtpSender. The RTCRtpReceiver for this
              // transceiver has already been started in setRemoteDescription.
              pc._transceive(transceiver,
                  params.codecs.length > 0,
                  false);
            }
          });
        }

        pc._localDescription = {
          type: description.type,
          sdp: description.sdp
        };
        if (description.type === 'offer') {
          pc._updateSignalingState('have-local-offer');
        } else {
          pc._updateSignalingState('stable');
        }

        return Promise.resolve();
      };

      RTCPeerConnection.prototype.setRemoteDescription = function(description) {
        var pc = this;

        // Note: pranswer is not supported.
        if (['offer', 'answer'].indexOf(description.type) === -1) {
          return Promise.reject(makeError('TypeError',
              'Unsupported type "' + description.type + '"'));
        }

        if (!isActionAllowedInSignalingState('setRemoteDescription',
            description.type, pc.signalingState) || pc._isClosed) {
          return Promise.reject(makeError('InvalidStateError',
              'Can not set remote ' + description.type +
              ' in state ' + pc.signalingState));
        }

        var streams = {};
        pc.remoteStreams.forEach(function(stream) {
          streams[stream.id] = stream;
        });
        var receiverList = [];
        var sections = sdp.splitSections(description.sdp);
        var sessionpart = sections.shift();
        var isIceLite = sdp.matchPrefix(sessionpart,
            'a=ice-lite').length > 0;
        var usingBundle = sdp.matchPrefix(sessionpart,
            'a=group:BUNDLE ').length > 0;
        pc.usingBundle = usingBundle;
        var iceOptions = sdp.matchPrefix(sessionpart,
            'a=ice-options:')[0];
        if (iceOptions) {
          pc.canTrickleIceCandidates = iceOptions.substr(14).split(' ')
              .indexOf('trickle') >= 0;
        } else {
          pc.canTrickleIceCandidates = false;
        }

        sections.forEach(function(mediaSection, sdpMLineIndex) {
          var lines = sdp.splitLines(mediaSection);
          var kind = sdp.getKind(mediaSection);
          // treat bundle-only as not-rejected.
          var rejected = sdp.isRejected(mediaSection) &&
              sdp.matchPrefix(mediaSection, 'a=bundle-only').length === 0;
          var protocol = lines[0].substr(2).split(' ')[2];

          var direction = sdp.getDirection(mediaSection, sessionpart);
          var remoteMsid = sdp.parseMsid(mediaSection);

          var mid = sdp.getMid(mediaSection) || sdp.generateIdentifier();

          // Reject datachannels which are not implemented yet.
          if (rejected || (kind === 'application' && (protocol === 'DTLS/SCTP' ||
              protocol === 'UDP/DTLS/SCTP'))) {
            // TODO: this is dangerous in the case where a non-rejected m-line
            //     becomes rejected.
            pc.transceivers[sdpMLineIndex] = {
              mid: mid,
              kind: kind,
              protocol: protocol,
              rejected: true
            };
            return;
          }

          if (!rejected && pc.transceivers[sdpMLineIndex] &&
              pc.transceivers[sdpMLineIndex].rejected) {
            // recycle a rejected transceiver.
            pc.transceivers[sdpMLineIndex] = pc._createTransceiver(kind, true);
          }

          var transceiver;
          var iceGatherer;
          var iceTransport;
          var dtlsTransport;
          var rtpReceiver;
          var sendEncodingParameters;
          var recvEncodingParameters;
          var localCapabilities;

          var track;
          // FIXME: ensure the mediaSection has rtcp-mux set.
          var remoteCapabilities = sdp.parseRtpParameters(mediaSection);
          var remoteIceParameters;
          var remoteDtlsParameters;
          if (!rejected) {
            remoteIceParameters = sdp.getIceParameters(mediaSection,
                sessionpart);
            remoteDtlsParameters = sdp.getDtlsParameters(mediaSection,
                sessionpart);
            remoteDtlsParameters.role = 'client';
          }
          recvEncodingParameters =
              sdp.parseRtpEncodingParameters(mediaSection);

          var rtcpParameters = sdp.parseRtcpParameters(mediaSection);

          var isComplete = sdp.matchPrefix(mediaSection,
              'a=end-of-candidates', sessionpart).length > 0;
          var cands = sdp.matchPrefix(mediaSection, 'a=candidate:')
              .map(function(cand) {
                return sdp.parseCandidate(cand);
              })
              .filter(function(cand) {
                return cand.component === 1;
              });

          // Check if we can use BUNDLE and dispose transports.
          if ((description.type === 'offer' || description.type === 'answer') &&
              !rejected && usingBundle && sdpMLineIndex > 0 &&
              pc.transceivers[sdpMLineIndex]) {
            pc._disposeIceAndDtlsTransports(sdpMLineIndex);
            pc.transceivers[sdpMLineIndex].iceGatherer =
                pc.transceivers[0].iceGatherer;
            pc.transceivers[sdpMLineIndex].iceTransport =
                pc.transceivers[0].iceTransport;
            pc.transceivers[sdpMLineIndex].dtlsTransport =
                pc.transceivers[0].dtlsTransport;
            if (pc.transceivers[sdpMLineIndex].rtpSender) {
              pc.transceivers[sdpMLineIndex].rtpSender.setTransport(
                  pc.transceivers[0].dtlsTransport);
            }
            if (pc.transceivers[sdpMLineIndex].rtpReceiver) {
              pc.transceivers[sdpMLineIndex].rtpReceiver.setTransport(
                  pc.transceivers[0].dtlsTransport);
            }
          }
          if (description.type === 'offer' && !rejected) {
            transceiver = pc.transceivers[sdpMLineIndex] ||
                pc._createTransceiver(kind);
            transceiver.mid = mid;

            if (!transceiver.iceGatherer) {
              transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex,
                  usingBundle);
            }

            if (cands.length && transceiver.iceTransport.state === 'new') {
              if (isComplete && (!usingBundle || sdpMLineIndex === 0)) {
                transceiver.iceTransport.setRemoteCandidates(cands);
              } else {
                cands.forEach(function(candidate) {
                  maybeAddCandidate(transceiver.iceTransport, candidate);
                });
              }
            }

            localCapabilities = window.RTCRtpReceiver.getCapabilities(kind);

            // filter RTX until additional stuff needed for RTX is implemented
            // in adapter.js
            if (edgeVersion < 15019) {
              localCapabilities.codecs = localCapabilities.codecs.filter(
                  function(codec) {
                    return codec.name !== 'rtx';
                  });
            }

            sendEncodingParameters = transceiver.sendEncodingParameters || [{
              ssrc: (2 * sdpMLineIndex + 2) * 1001
            }];

            // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams
            var isNewTrack = false;
            if (direction === 'sendrecv' || direction === 'sendonly') {
              isNewTrack = !transceiver.rtpReceiver;
              rtpReceiver = transceiver.rtpReceiver ||
                  new window.RTCRtpReceiver(transceiver.dtlsTransport, kind);

              if (isNewTrack) {
                var stream;
                track = rtpReceiver.track;
                // FIXME: does not work with Plan B.
                if (remoteMsid && remoteMsid.stream === '-') ; else if (remoteMsid) {
                  if (!streams[remoteMsid.stream]) {
                    streams[remoteMsid.stream] = new window.MediaStream();
                    Object.defineProperty(streams[remoteMsid.stream], 'id', {
                      get: function() {
                        return remoteMsid.stream;
                      }
                    });
                  }
                  Object.defineProperty(track, 'id', {
                    get: function() {
                      return remoteMsid.track;
                    }
                  });
                  stream = streams[remoteMsid.stream];
                } else {
                  if (!streams.default) {
                    streams.default = new window.MediaStream();
                  }
                  stream = streams.default;
                }
                if (stream) {
                  addTrackToStreamAndFireEvent(track, stream);
                  transceiver.associatedRemoteMediaStreams.push(stream);
                }
                receiverList.push([track, rtpReceiver, stream]);
              }
            } else if (transceiver.rtpReceiver && transceiver.rtpReceiver.track) {
              transceiver.associatedRemoteMediaStreams.forEach(function(s) {
                var nativeTrack = s.getTracks().find(function(t) {
                  return t.id === transceiver.rtpReceiver.track.id;
                });
                if (nativeTrack) {
                  removeTrackFromStreamAndFireEvent(nativeTrack, s);
                }
              });
              transceiver.associatedRemoteMediaStreams = [];
            }

            transceiver.localCapabilities = localCapabilities;
            transceiver.remoteCapabilities = remoteCapabilities;
            transceiver.rtpReceiver = rtpReceiver;
            transceiver.rtcpParameters = rtcpParameters;
            transceiver.sendEncodingParameters = sendEncodingParameters;
            transceiver.recvEncodingParameters = recvEncodingParameters;

            // Start the RTCRtpReceiver now. The RTPSender is started in
            // setLocalDescription.
            pc._transceive(pc.transceivers[sdpMLineIndex],
                false,
                isNewTrack);
          } else if (description.type === 'answer' && !rejected) {
            transceiver = pc.transceivers[sdpMLineIndex];
            iceGatherer = transceiver.iceGatherer;
            iceTransport = transceiver.iceTransport;
            dtlsTransport = transceiver.dtlsTransport;
            rtpReceiver = transceiver.rtpReceiver;
            sendEncodingParameters = transceiver.sendEncodingParameters;
            localCapabilities = transceiver.localCapabilities;

            pc.transceivers[sdpMLineIndex].recvEncodingParameters =
                recvEncodingParameters;
            pc.transceivers[sdpMLineIndex].remoteCapabilities =
                remoteCapabilities;
            pc.transceivers[sdpMLineIndex].rtcpParameters = rtcpParameters;

            if (cands.length && iceTransport.state === 'new') {
              if ((isIceLite || isComplete) &&
                  (!usingBundle || sdpMLineIndex === 0)) {
                iceTransport.setRemoteCandidates(cands);
              } else {
                cands.forEach(function(candidate) {
                  maybeAddCandidate(transceiver.iceTransport, candidate);
                });
              }
            }

            if (!usingBundle || sdpMLineIndex === 0) {
              if (iceTransport.state === 'new') {
                iceTransport.start(iceGatherer, remoteIceParameters,
                    'controlling');
              }
              if (dtlsTransport.state === 'new') {
                dtlsTransport.start(remoteDtlsParameters);
              }
            }

            // If the offer contained RTX but the answer did not,
            // remove RTX from sendEncodingParameters.
            var commonCapabilities = getCommonCapabilities(
              transceiver.localCapabilities,
              transceiver.remoteCapabilities);

            var hasRtx = commonCapabilities.codecs.filter(function(c) {
              return c.name.toLowerCase() === 'rtx';
            }).length;
            if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
              delete transceiver.sendEncodingParameters[0].rtx;
            }

            pc._transceive(transceiver,
                direction === 'sendrecv' || direction === 'recvonly',
                direction === 'sendrecv' || direction === 'sendonly');

            // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams
            if (rtpReceiver &&
                (direction === 'sendrecv' || direction === 'sendonly')) {
              track = rtpReceiver.track;
              if (remoteMsid) {
                if (!streams[remoteMsid.stream]) {
                  streams[remoteMsid.stream] = new window.MediaStream();
                }
                addTrackToStreamAndFireEvent(track, streams[remoteMsid.stream]);
                receiverList.push([track, rtpReceiver, streams[remoteMsid.stream]]);
              } else {
                if (!streams.default) {
                  streams.default = new window.MediaStream();
                }
                addTrackToStreamAndFireEvent(track, streams.default);
                receiverList.push([track, rtpReceiver, streams.default]);
              }
            } else {
              // FIXME: actually the receiver should be created later.
              delete transceiver.rtpReceiver;
            }
          }
        });

        if (pc._dtlsRole === undefined) {
          pc._dtlsRole = description.type === 'offer' ? 'active' : 'passive';
        }

        pc._remoteDescription = {
          type: description.type,
          sdp: description.sdp
        };
        if (description.type === 'offer') {
          pc._updateSignalingState('have-remote-offer');
        } else {
          pc._updateSignalingState('stable');
        }
        Object.keys(streams).forEach(function(sid) {
          var stream = streams[sid];
          if (stream.getTracks().length) {
            if (pc.remoteStreams.indexOf(stream) === -1) {
              pc.remoteStreams.push(stream);
              var event = new Event('addstream');
              event.stream = stream;
              window.setTimeout(function() {
                pc._dispatchEvent('addstream', event);
              });
            }

            receiverList.forEach(function(item) {
              var track = item[0];
              var receiver = item[1];
              if (stream.id !== item[2].id) {
                return;
              }
              fireAddTrack(pc, track, receiver, [stream]);
            });
          }
        });
        receiverList.forEach(function(item) {
          if (item[2]) {
            return;
          }
          fireAddTrack(pc, item[0], item[1], []);
        });

        // check whether addIceCandidate({}) was called within four seconds after
        // setRemoteDescription.
        window.setTimeout(function() {
          if (!(pc && pc.transceivers)) {
            return;
          }
          pc.transceivers.forEach(function(transceiver) {
            if (transceiver.iceTransport &&
                transceiver.iceTransport.state === 'new' &&
                transceiver.iceTransport.getRemoteCandidates().length > 0) {
              console.warn('Timeout for addRemoteCandidate. Consider sending ' +
                  'an end-of-candidates notification');
              transceiver.iceTransport.addRemoteCandidate({});
            }
          });
        }, 4000);

        return Promise.resolve();
      };

      RTCPeerConnection.prototype.close = function() {
        this.transceivers.forEach(function(transceiver) {
          /* not yet
          if (transceiver.iceGatherer) {
            transceiver.iceGatherer.close();
          }
          */
          if (transceiver.iceTransport) {
            transceiver.iceTransport.stop();
          }
          if (transceiver.dtlsTransport) {
            transceiver.dtlsTransport.stop();
          }
          if (transceiver.rtpSender) {
            transceiver.rtpSender.stop();
          }
          if (transceiver.rtpReceiver) {
            transceiver.rtpReceiver.stop();
          }
        });
        // FIXME: clean up tracks, local streams, remote streams, etc
        this._isClosed = true;
        this._updateSignalingState('closed');
      };

      // Update the signaling state.
      RTCPeerConnection.prototype._updateSignalingState = function(newState) {
        this.signalingState = newState;
        var event = new Event('signalingstatechange');
        this._dispatchEvent('signalingstatechange', event);
      };

      // Determine whether to fire the negotiationneeded event.
      RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function() {
        var pc = this;
        if (this.signalingState !== 'stable' || this.needNegotiation === true) {
          return;
        }
        this.needNegotiation = true;
        window.setTimeout(function() {
          if (pc.needNegotiation) {
            pc.needNegotiation = false;
            var event = new Event('negotiationneeded');
            pc._dispatchEvent('negotiationneeded', event);
          }
        }, 0);
      };

      // Update the ice connection state.
      RTCPeerConnection.prototype._updateIceConnectionState = function() {
        var newState;
        var states = {
          'new': 0,
          closed: 0,
          checking: 0,
          connected: 0,
          completed: 0,
          disconnected: 0,
          failed: 0
        };
        this.transceivers.forEach(function(transceiver) {
          if (transceiver.iceTransport && !transceiver.rejected) {
            states[transceiver.iceTransport.state]++;
          }
        });

        newState = 'new';
        if (states.failed > 0) {
          newState = 'failed';
        } else if (states.checking > 0) {
          newState = 'checking';
        } else if (states.disconnected > 0) {
          newState = 'disconnected';
        } else if (states.new > 0) {
          newState = 'new';
        } else if (states.connected > 0) {
          newState = 'connected';
        } else if (states.completed > 0) {
          newState = 'completed';
        }

        if (newState !== this.iceConnectionState) {
          this.iceConnectionState = newState;
          var event = new Event('iceconnectionstatechange');
          this._dispatchEvent('iceconnectionstatechange', event);
        }
      };

      // Update the connection state.
      RTCPeerConnection.prototype._updateConnectionState = function() {
        var newState;
        var states = {
          'new': 0,
          closed: 0,
          connecting: 0,
          connected: 0,
          completed: 0,
          disconnected: 0,
          failed: 0
        };
        this.transceivers.forEach(function(transceiver) {
          if (transceiver.iceTransport && transceiver.dtlsTransport &&
              !transceiver.rejected) {
            states[transceiver.iceTransport.state]++;
            states[transceiver.dtlsTransport.state]++;
          }
        });
        // ICETransport.completed and connected are the same for this purpose.
        states.connected += states.completed;

        newState = 'new';
        if (states.failed > 0) {
          newState = 'failed';
        } else if (states.connecting > 0) {
          newState = 'connecting';
        } else if (states.disconnected > 0) {
          newState = 'disconnected';
        } else if (states.new > 0) {
          newState = 'new';
        } else if (states.connected > 0) {
          newState = 'connected';
        }

        if (newState !== this.connectionState) {
          this.connectionState = newState;
          var event = new Event('connectionstatechange');
          this._dispatchEvent('connectionstatechange', event);
        }
      };

      RTCPeerConnection.prototype.createOffer = function() {
        var pc = this;

        if (pc._isClosed) {
          return Promise.reject(makeError('InvalidStateError',
              'Can not call createOffer after close'));
        }

        var numAudioTracks = pc.transceivers.filter(function(t) {
          return t.kind === 'audio';
        }).length;
        var numVideoTracks = pc.transceivers.filter(function(t) {
          return t.kind === 'video';
        }).length;

        // Determine number of audio and video tracks we need to send/recv.
        var offerOptions = arguments[0];
        if (offerOptions) {
          // Reject Chrome legacy constraints.
          if (offerOptions.mandatory || offerOptions.optional) {
            throw new TypeError(
                'Legacy mandatory/optional constraints not supported.');
          }
          if (offerOptions.offerToReceiveAudio !== undefined) {
            if (offerOptions.offerToReceiveAudio === true) {
              numAudioTracks = 1;
            } else if (offerOptions.offerToReceiveAudio === false) {
              numAudioTracks = 0;
            } else {
              numAudioTracks = offerOptions.offerToReceiveAudio;
            }
          }
          if (offerOptions.offerToReceiveVideo !== undefined) {
            if (offerOptions.offerToReceiveVideo === true) {
              numVideoTracks = 1;
            } else if (offerOptions.offerToReceiveVideo === false) {
              numVideoTracks = 0;
            } else {
              numVideoTracks = offerOptions.offerToReceiveVideo;
            }
          }
        }

        pc.transceivers.forEach(function(transceiver) {
          if (transceiver.kind === 'audio') {
            numAudioTracks--;
            if (numAudioTracks < 0) {
              transceiver.wantReceive = false;
            }
          } else if (transceiver.kind === 'video') {
            numVideoTracks--;
            if (numVideoTracks < 0) {
              transceiver.wantReceive = false;
            }
          }
        });

        // Create M-lines for recvonly streams.
        while (numAudioTracks > 0 || numVideoTracks > 0) {
          if (numAudioTracks > 0) {
            pc._createTransceiver('audio');
            numAudioTracks--;
          }
          if (numVideoTracks > 0) {
            pc._createTransceiver('video');
            numVideoTracks--;
          }
        }

        var sdp$1 = sdp.writeSessionBoilerplate(pc._sdpSessionId,
            pc._sdpSessionVersion++);
        pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
          // For each track, create an ice gatherer, ice transport,
          // dtls transport, potentially rtpsender and rtpreceiver.
          var track = transceiver.track;
          var kind = transceiver.kind;
          var mid = transceiver.mid || sdp.generateIdentifier();
          transceiver.mid = mid;

          if (!transceiver.iceGatherer) {
            transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex,
                pc.usingBundle);
          }

          var localCapabilities = window.RTCRtpSender.getCapabilities(kind);
          // filter RTX until additional stuff needed for RTX is implemented
          // in adapter.js
          if (edgeVersion < 15019) {
            localCapabilities.codecs = localCapabilities.codecs.filter(
                function(codec) {
                  return codec.name !== 'rtx';
                });
          }
          localCapabilities.codecs.forEach(function(codec) {
            // work around https://bugs.chromium.org/p/webrtc/issues/detail?id=6552
            // by adding level-asymmetry-allowed=1
            if (codec.name === 'H264' &&
                codec.parameters['level-asymmetry-allowed'] === undefined) {
              codec.parameters['level-asymmetry-allowed'] = '1';
            }

            // for subsequent offers, we might have to re-use the payload
            // type of the last offer.
            if (transceiver.remoteCapabilities &&
                transceiver.remoteCapabilities.codecs) {
              transceiver.remoteCapabilities.codecs.forEach(function(remoteCodec) {
                if (codec.name.toLowerCase() === remoteCodec.name.toLowerCase() &&
                    codec.clockRate === remoteCodec.clockRate) {
                  codec.preferredPayloadType = remoteCodec.payloadType;
                }
              });
            }
          });
          localCapabilities.headerExtensions.forEach(function(hdrExt) {
            var remoteExtensions = transceiver.remoteCapabilities &&
                transceiver.remoteCapabilities.headerExtensions || [];
            remoteExtensions.forEach(function(rHdrExt) {
              if (hdrExt.uri === rHdrExt.uri) {
                hdrExt.id = rHdrExt.id;
              }
            });
          });

          // generate an ssrc now, to be used later in rtpSender.send
          var sendEncodingParameters = transceiver.sendEncodingParameters || [{
            ssrc: (2 * sdpMLineIndex + 1) * 1001
          }];
          if (track) {
            // add RTX
            if (edgeVersion >= 15019 && kind === 'video' &&
                !sendEncodingParameters[0].rtx) {
              sendEncodingParameters[0].rtx = {
                ssrc: sendEncodingParameters[0].ssrc + 1
              };
            }
          }

          if (transceiver.wantReceive) {
            transceiver.rtpReceiver = new window.RTCRtpReceiver(
                transceiver.dtlsTransport, kind);
          }

          transceiver.localCapabilities = localCapabilities;
          transceiver.sendEncodingParameters = sendEncodingParameters;
        });

        // always offer BUNDLE and dispose on return if not supported.
        if (pc._config.bundlePolicy !== 'max-compat') {
          sdp$1 += 'a=group:BUNDLE ' + pc.transceivers.map(function(t) {
            return t.mid;
          }).join(' ') + '\r\n';
        }
        sdp$1 += 'a=ice-options:trickle\r\n';

        pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
          sdp$1 += writeMediaSection(transceiver, transceiver.localCapabilities,
              'offer', transceiver.stream, pc._dtlsRole);
          sdp$1 += 'a=rtcp-rsize\r\n';

          if (transceiver.iceGatherer && pc.iceGatheringState !== 'new' &&
              (sdpMLineIndex === 0 || !pc.usingBundle)) {
            transceiver.iceGatherer.getLocalCandidates().forEach(function(cand) {
              cand.component = 1;
              sdp$1 += 'a=' + sdp.writeCandidate(cand) + '\r\n';
            });

            if (transceiver.iceGatherer.state === 'completed') {
              sdp$1 += 'a=end-of-candidates\r\n';
            }
          }
        });

        var desc = new window.RTCSessionDescription({
          type: 'offer',
          sdp: sdp$1
        });
        return Promise.resolve(desc);
      };

      RTCPeerConnection.prototype.createAnswer = function() {
        var pc = this;

        if (pc._isClosed) {
          return Promise.reject(makeError('InvalidStateError',
              'Can not call createAnswer after close'));
        }

        if (!(pc.signalingState === 'have-remote-offer' ||
            pc.signalingState === 'have-local-pranswer')) {
          return Promise.reject(makeError('InvalidStateError',
              'Can not call createAnswer in signalingState ' + pc.signalingState));
        }

        var sdp$1 = sdp.writeSessionBoilerplate(pc._sdpSessionId,
            pc._sdpSessionVersion++);
        if (pc.usingBundle) {
          sdp$1 += 'a=group:BUNDLE ' + pc.transceivers.map(function(t) {
            return t.mid;
          }).join(' ') + '\r\n';
        }
        sdp$1 += 'a=ice-options:trickle\r\n';

        var mediaSectionsInOffer = sdp.getMediaSections(
            pc._remoteDescription.sdp).length;
        pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
          if (sdpMLineIndex + 1 > mediaSectionsInOffer) {
            return;
          }
          if (transceiver.rejected) {
            if (transceiver.kind === 'application') {
              if (transceiver.protocol === 'DTLS/SCTP') { // legacy fmt
                sdp$1 += 'm=application 0 DTLS/SCTP 5000\r\n';
              } else {
                sdp$1 += 'm=application 0 ' + transceiver.protocol +
                    ' webrtc-datachannel\r\n';
              }
            } else if (transceiver.kind === 'audio') {
              sdp$1 += 'm=audio 0 UDP/TLS/RTP/SAVPF 0\r\n' +
                  'a=rtpmap:0 PCMU/8000\r\n';
            } else if (transceiver.kind === 'video') {
              sdp$1 += 'm=video 0 UDP/TLS/RTP/SAVPF 120\r\n' +
                  'a=rtpmap:120 VP8/90000\r\n';
            }
            sdp$1 += 'c=IN IP4 0.0.0.0\r\n' +
                'a=inactive\r\n' +
                'a=mid:' + transceiver.mid + '\r\n';
            return;
          }

          // FIXME: look at direction.
          if (transceiver.stream) {
            var localTrack;
            if (transceiver.kind === 'audio') {
              localTrack = transceiver.stream.getAudioTracks()[0];
            } else if (transceiver.kind === 'video') {
              localTrack = transceiver.stream.getVideoTracks()[0];
            }
            if (localTrack) {
              // add RTX
              if (edgeVersion >= 15019 && transceiver.kind === 'video' &&
                  !transceiver.sendEncodingParameters[0].rtx) {
                transceiver.sendEncodingParameters[0].rtx = {
                  ssrc: transceiver.sendEncodingParameters[0].ssrc + 1
                };
              }
            }
          }

          // Calculate intersection of capabilities.
          var commonCapabilities = getCommonCapabilities(
              transceiver.localCapabilities,
              transceiver.remoteCapabilities);

          var hasRtx = commonCapabilities.codecs.filter(function(c) {
            return c.name.toLowerCase() === 'rtx';
          }).length;
          if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
            delete transceiver.sendEncodingParameters[0].rtx;
          }

          sdp$1 += writeMediaSection(transceiver, commonCapabilities,
              'answer', transceiver.stream, pc._dtlsRole);
          if (transceiver.rtcpParameters &&
              transceiver.rtcpParameters.reducedSize) {
            sdp$1 += 'a=rtcp-rsize\r\n';
          }
        });

        var desc = new window.RTCSessionDescription({
          type: 'answer',
          sdp: sdp$1
        });
        return Promise.resolve(desc);
      };

      RTCPeerConnection.prototype.addIceCandidate = function(candidate) {
        var pc = this;
        var sections;
        if (candidate && !(candidate.sdpMLineIndex !== undefined ||
            candidate.sdpMid)) {
          return Promise.reject(new TypeError('sdpMLineIndex or sdpMid required'));
        }

        // TODO: needs to go into ops queue.
        return new Promise(function(resolve, reject) {
          if (!pc._remoteDescription) {
            return reject(makeError('InvalidStateError',
                'Can not add ICE candidate without a remote description'));
          } else if (!candidate || candidate.candidate === '') {
            for (var j = 0; j < pc.transceivers.length; j++) {
              if (pc.transceivers[j].rejected) {
                continue;
              }
              pc.transceivers[j].iceTransport.addRemoteCandidate({});
              sections = sdp.getMediaSections(pc._remoteDescription.sdp);
              sections[j] += 'a=end-of-candidates\r\n';
              pc._remoteDescription.sdp =
                  sdp.getDescription(pc._remoteDescription.sdp) +
                  sections.join('');
              if (pc.usingBundle) {
                break;
              }
            }
          } else {
            var sdpMLineIndex = candidate.sdpMLineIndex;
            if (candidate.sdpMid) {
              for (var i = 0; i < pc.transceivers.length; i++) {
                if (pc.transceivers[i].mid === candidate.sdpMid) {
                  sdpMLineIndex = i;
                  break;
                }
              }
            }
            var transceiver = pc.transceivers[sdpMLineIndex];
            if (transceiver) {
              if (transceiver.rejected) {
                return resolve();
              }
              var cand = Object.keys(candidate.candidate).length > 0 ?
                  sdp.parseCandidate(candidate.candidate) : {};
              // Ignore Chrome's invalid candidates since Edge does not like them.
              if (cand.protocol === 'tcp' && (cand.port === 0 || cand.port === 9)) {
                return resolve();
              }
              // Ignore RTCP candidates, we assume RTCP-MUX.
              if (cand.component && cand.component !== 1) {
                return resolve();
              }
              // when using bundle, avoid adding candidates to the wrong
              // ice transport. And avoid adding candidates added in the SDP.
              if (sdpMLineIndex === 0 || (sdpMLineIndex > 0 &&
                  transceiver.iceTransport !== pc.transceivers[0].iceTransport)) {
                if (!maybeAddCandidate(transceiver.iceTransport, cand)) {
                  return reject(makeError('OperationError',
                      'Can not add ICE candidate'));
                }
              }

              // update the remoteDescription.
              var candidateString = candidate.candidate.trim();
              if (candidateString.indexOf('a=') === 0) {
                candidateString = candidateString.substr(2);
              }
              sections = sdp.getMediaSections(pc._remoteDescription.sdp);
              sections[sdpMLineIndex] += 'a=' +
                  (cand.type ? candidateString : 'end-of-candidates')
                  + '\r\n';
              pc._remoteDescription.sdp =
                  sdp.getDescription(pc._remoteDescription.sdp) +
                  sections.join('');
            } else {
              return reject(makeError('OperationError',
                  'Can not add ICE candidate'));
            }
          }
          resolve();
        });
      };

      RTCPeerConnection.prototype.getStats = function(selector) {
        if (selector && selector instanceof window.MediaStreamTrack) {
          var senderOrReceiver = null;
          this.transceivers.forEach(function(transceiver) {
            if (transceiver.rtpSender &&
                transceiver.rtpSender.track === selector) {
              senderOrReceiver = transceiver.rtpSender;
            } else if (transceiver.rtpReceiver &&
                transceiver.rtpReceiver.track === selector) {
              senderOrReceiver = transceiver.rtpReceiver;
            }
          });
          if (!senderOrReceiver) {
            throw makeError('InvalidAccessError', 'Invalid selector.');
          }
          return senderOrReceiver.getStats();
        }

        var promises = [];
        this.transceivers.forEach(function(transceiver) {
          ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport',
              'dtlsTransport'].forEach(function(method) {
                if (transceiver[method]) {
                  promises.push(transceiver[method].getStats());
                }
              });
        });
        return Promise.all(promises).then(function(allStats) {
          var results = new Map();
          allStats.forEach(function(stats) {
            stats.forEach(function(stat) {
              results.set(stat.id, stat);
            });
          });
          return results;
        });
      };

      // fix low-level stat names and return Map instead of object.
      var ortcObjects = ['RTCRtpSender', 'RTCRtpReceiver', 'RTCIceGatherer',
        'RTCIceTransport', 'RTCDtlsTransport'];
      ortcObjects.forEach(function(ortcObjectName) {
        var obj = window[ortcObjectName];
        if (obj && obj.prototype && obj.prototype.getStats) {
          var nativeGetstats = obj.prototype.getStats;
          obj.prototype.getStats = function() {
            return nativeGetstats.apply(this)
            .then(function(nativeStats) {
              var mapStats = new Map();
              Object.keys(nativeStats).forEach(function(id) {
                nativeStats[id].type = fixStatsType(nativeStats[id]);
                mapStats.set(id, nativeStats[id]);
              });
              return mapStats;
            });
          };
        }
      });

      // legacy callback shims. Should be moved to adapter.js some days.
      var methods = ['createOffer', 'createAnswer'];
      methods.forEach(function(method) {
        var nativeMethod = RTCPeerConnection.prototype[method];
        RTCPeerConnection.prototype[method] = function() {
          var args = arguments;
          if (typeof args[0] === 'function' ||
              typeof args[1] === 'function') { // legacy
            return nativeMethod.apply(this, [arguments[2]])
            .then(function(description) {
              if (typeof args[0] === 'function') {
                args[0].apply(null, [description]);
              }
            }, function(error) {
              if (typeof args[1] === 'function') {
                args[1].apply(null, [error]);
              }
            });
          }
          return nativeMethod.apply(this, arguments);
        };
      });

      methods = ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'];
      methods.forEach(function(method) {
        var nativeMethod = RTCPeerConnection.prototype[method];
        RTCPeerConnection.prototype[method] = function() {
          var args = arguments;
          if (typeof args[1] === 'function' ||
              typeof args[2] === 'function') { // legacy
            return nativeMethod.apply(this, arguments)
            .then(function() {
              if (typeof args[1] === 'function') {
                args[1].apply(null);
              }
            }, function(error) {
              if (typeof args[2] === 'function') {
                args[2].apply(null, [error]);
              }
            });
          }
          return nativeMethod.apply(this, arguments);
        };
      });

      // getStats is special. It doesn't have a spec legacy method yet we support
      // getStats(something, cb) without error callbacks.
      ['getStats'].forEach(function(method) {
        var nativeMethod = RTCPeerConnection.prototype[method];
        RTCPeerConnection.prototype[method] = function() {
          var args = arguments;
          if (typeof args[1] === 'function') {
            return nativeMethod.apply(this, arguments)
            .then(function() {
              if (typeof args[1] === 'function') {
                args[1].apply(null);
              }
            });
          }
          return nativeMethod.apply(this, arguments);
        };
      });

      return RTCPeerConnection;
    };

    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    function shimGetUserMedia$2(window) {
      const navigator = window && window.navigator;

      const shimError_ = function(e) {
        return {
          name: {PermissionDeniedError: 'NotAllowedError'}[e.name] || e.name,
          message: e.message,
          constraint: e.constraint,
          toString() {
            return this.name;
          }
        };
      };

      // getUserMedia error shim.
      const origGetUserMedia = navigator.mediaDevices.getUserMedia.
          bind(navigator.mediaDevices);
      navigator.mediaDevices.getUserMedia = function(c) {
        return origGetUserMedia(c).catch(e => Promise.reject(shimError_(e)));
      };
    }

    /*
     *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    function shimGetDisplayMedia$1(window) {
      if (!('getDisplayMedia' in window.navigator)) {
        return;
      }
      if (!(window.navigator.mediaDevices)) {
        return;
      }
      if (window.navigator.mediaDevices &&
        'getDisplayMedia' in window.navigator.mediaDevices) {
        return;
      }
      window.navigator.mediaDevices.getDisplayMedia =
        window.navigator.getDisplayMedia.bind(window.navigator);
    }

    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    function shimPeerConnection$1(window, browserDetails) {
      if (window.RTCIceGatherer) {
        if (!window.RTCIceCandidate) {
          window.RTCIceCandidate = function RTCIceCandidate(args) {
            return args;
          };
        }
        if (!window.RTCSessionDescription) {
          window.RTCSessionDescription = function RTCSessionDescription(args) {
            return args;
          };
        }
        // this adds an additional event listener to MediaStrackTrack that signals
        // when a tracks enabled property was changed. Workaround for a bug in
        // addStream, see below. No longer required in 15025+
        if (browserDetails.version < 15025) {
          const origMSTEnabled = Object.getOwnPropertyDescriptor(
              window.MediaStreamTrack.prototype, 'enabled');
          Object.defineProperty(window.MediaStreamTrack.prototype, 'enabled', {
            set(value) {
              origMSTEnabled.set.call(this, value);
              const ev = new Event('enabled');
              ev.enabled = value;
              this.dispatchEvent(ev);
            }
          });
        }
      }

      // ORTC defines the DTMF sender a bit different.
      // https://github.com/w3c/ortc/issues/714
      if (window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
        Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
          get() {
            if (this._dtmf === undefined) {
              if (this.track.kind === 'audio') {
                this._dtmf = new window.RTCDtmfSender(this);
              } else if (this.track.kind === 'video') {
                this._dtmf = null;
              }
            }
            return this._dtmf;
          }
        });
      }
      // Edge currently only implements the RTCDtmfSender, not the
      // RTCDTMFSender alias. See http://draft.ortc.org/#rtcdtmfsender2*
      if (window.RTCDtmfSender && !window.RTCDTMFSender) {
        window.RTCDTMFSender = window.RTCDtmfSender;
      }

      const RTCPeerConnectionShim = rtcpeerconnection(window,
          browserDetails.version);
      window.RTCPeerConnection = function RTCPeerConnection(config) {
        if (config && config.iceServers) {
          config.iceServers = filterIceServers$1(config.iceServers,
            browserDetails.version);
          log('ICE servers after filtering:', config.iceServers);
        }
        return new RTCPeerConnectionShim(config);
      };
      window.RTCPeerConnection.prototype = RTCPeerConnectionShim.prototype;
    }

    function shimReplaceTrack(window) {
      // ORTC has replaceTrack -- https://github.com/w3c/ortc/issues/614
      if (window.RTCRtpSender &&
          !('replaceTrack' in window.RTCRtpSender.prototype)) {
        window.RTCRtpSender.prototype.replaceTrack =
            window.RTCRtpSender.prototype.setTrack;
      }
    }

    var edgeShim = /*#__PURE__*/Object.freeze({
        __proto__: null,
        shimPeerConnection: shimPeerConnection$1,
        shimReplaceTrack: shimReplaceTrack,
        shimGetUserMedia: shimGetUserMedia$2,
        shimGetDisplayMedia: shimGetDisplayMedia$1
    });

    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    function shimGetUserMedia$1(window, browserDetails) {
      const navigator = window && window.navigator;
      const MediaStreamTrack = window && window.MediaStreamTrack;

      navigator.getUserMedia = function(constraints, onSuccess, onError) {
        // Replace Firefox 44+'s deprecation warning with unprefixed version.
        deprecated('navigator.getUserMedia',
            'navigator.mediaDevices.getUserMedia');
        navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
      };

      if (!(browserDetails.version > 55 &&
          'autoGainControl' in navigator.mediaDevices.getSupportedConstraints())) {
        const remap = function(obj, a, b) {
          if (a in obj && !(b in obj)) {
            obj[b] = obj[a];
            delete obj[a];
          }
        };

        const nativeGetUserMedia = navigator.mediaDevices.getUserMedia.
            bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = function(c) {
          if (typeof c === 'object' && typeof c.audio === 'object') {
            c = JSON.parse(JSON.stringify(c));
            remap(c.audio, 'autoGainControl', 'mozAutoGainControl');
            remap(c.audio, 'noiseSuppression', 'mozNoiseSuppression');
          }
          return nativeGetUserMedia(c);
        };

        if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
          const nativeGetSettings = MediaStreamTrack.prototype.getSettings;
          MediaStreamTrack.prototype.getSettings = function() {
            const obj = nativeGetSettings.apply(this, arguments);
            remap(obj, 'mozAutoGainControl', 'autoGainControl');
            remap(obj, 'mozNoiseSuppression', 'noiseSuppression');
            return obj;
          };
        }

        if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
          const nativeApplyConstraints =
            MediaStreamTrack.prototype.applyConstraints;
          MediaStreamTrack.prototype.applyConstraints = function(c) {
            if (this.kind === 'audio' && typeof c === 'object') {
              c = JSON.parse(JSON.stringify(c));
              remap(c, 'autoGainControl', 'mozAutoGainControl');
              remap(c, 'noiseSuppression', 'mozNoiseSuppression');
            }
            return nativeApplyConstraints.apply(this, [c]);
          };
        }
      }
    }

    /*
     *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    function shimGetDisplayMedia(window, preferredMediaSource) {
      if (window.navigator.mediaDevices &&
        'getDisplayMedia' in window.navigator.mediaDevices) {
        return;
      }
      if (!(window.navigator.mediaDevices)) {
        return;
      }
      window.navigator.mediaDevices.getDisplayMedia =
        function getDisplayMedia(constraints) {
          if (!(constraints && constraints.video)) {
            const err = new DOMException('getDisplayMedia without video ' +
                'constraints is undefined');
            err.name = 'NotFoundError';
            // from https://heycam.github.io/webidl/#idl-DOMException-error-names
            err.code = 8;
            return Promise.reject(err);
          }
          if (constraints.video === true) {
            constraints.video = {mediaSource: preferredMediaSource};
          } else {
            constraints.video.mediaSource = preferredMediaSource;
          }
          return window.navigator.mediaDevices.getUserMedia(constraints);
        };
    }

    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    function shimOnTrack(window) {
      if (typeof window === 'object' && window.RTCTrackEvent &&
          ('receiver' in window.RTCTrackEvent.prototype) &&
          !('transceiver' in window.RTCTrackEvent.prototype)) {
        Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
          get() {
            return {receiver: this.receiver};
          }
        });
      }
    }

    function shimPeerConnection(window, browserDetails) {
      if (typeof window !== 'object' ||
          !(window.RTCPeerConnection || window.mozRTCPeerConnection)) {
        return; // probably media.peerconnection.enabled=false in about:config
      }
      if (!window.RTCPeerConnection && window.mozRTCPeerConnection) {
        // very basic support for old versions.
        window.RTCPeerConnection = window.mozRTCPeerConnection;
      }

      if (browserDetails.version < 53) {
        // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
        ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
            .forEach(function(method) {
              const nativeMethod = window.RTCPeerConnection.prototype[method];
              const methodObj = {[method]() {
                arguments[0] = new ((method === 'addIceCandidate') ?
                    window.RTCIceCandidate :
                    window.RTCSessionDescription)(arguments[0]);
                return nativeMethod.apply(this, arguments);
              }};
              window.RTCPeerConnection.prototype[method] = methodObj[method];
            });
      }

      const modernStatsTypes = {
        inboundrtp: 'inbound-rtp',
        outboundrtp: 'outbound-rtp',
        candidatepair: 'candidate-pair',
        localcandidate: 'local-candidate',
        remotecandidate: 'remote-candidate'
      };

      const nativeGetStats = window.RTCPeerConnection.prototype.getStats;
      window.RTCPeerConnection.prototype.getStats = function getStats() {
        const [selector, onSucc, onErr] = arguments;
        return nativeGetStats.apply(this, [selector || null])
          .then(stats => {
            if (browserDetails.version < 53 && !onSucc) {
              // Shim only promise getStats with spec-hyphens in type names
              // Leave callback version alone; misc old uses of forEach before Map
              try {
                stats.forEach(stat => {
                  stat.type = modernStatsTypes[stat.type] || stat.type;
                });
              } catch (e) {
                if (e.name !== 'TypeError') {
                  throw e;
                }
                // Avoid TypeError: "type" is read-only, in old versions. 34-43ish
                stats.forEach((stat, i) => {
                  stats.set(i, Object.assign({}, stat, {
                    type: modernStatsTypes[stat.type] || stat.type
                  }));
                });
              }
            }
            return stats;
          })
          .then(onSucc, onErr);
      };
    }

    function shimSenderGetStats(window) {
      if (!(typeof window === 'object' && window.RTCPeerConnection &&
          window.RTCRtpSender)) {
        return;
      }
      if (window.RTCRtpSender && 'getStats' in window.RTCRtpSender.prototype) {
        return;
      }
      const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
      if (origGetSenders) {
        window.RTCPeerConnection.prototype.getSenders = function getSenders() {
          const senders = origGetSenders.apply(this, []);
          senders.forEach(sender => sender._pc = this);
          return senders;
        };
      }

      const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
      if (origAddTrack) {
        window.RTCPeerConnection.prototype.addTrack = function addTrack() {
          const sender = origAddTrack.apply(this, arguments);
          sender._pc = this;
          return sender;
        };
      }
      window.RTCRtpSender.prototype.getStats = function getStats() {
        return this.track ? this._pc.getStats(this.track) :
            Promise.resolve(new Map());
      };
    }

    function shimReceiverGetStats(window) {
      if (!(typeof window === 'object' && window.RTCPeerConnection &&
          window.RTCRtpSender)) {
        return;
      }
      if (window.RTCRtpSender && 'getStats' in window.RTCRtpReceiver.prototype) {
        return;
      }
      const origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
      if (origGetReceivers) {
        window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
          const receivers = origGetReceivers.apply(this, []);
          receivers.forEach(receiver => receiver._pc = this);
          return receivers;
        };
      }
      wrapPeerConnectionEvent(window, 'track', e => {
        e.receiver._pc = e.srcElement;
        return e;
      });
      window.RTCRtpReceiver.prototype.getStats = function getStats() {
        return this._pc.getStats(this.track);
      };
    }

    function shimRemoveStream(window) {
      if (!window.RTCPeerConnection ||
          'removeStream' in window.RTCPeerConnection.prototype) {
        return;
      }
      window.RTCPeerConnection.prototype.removeStream =
        function removeStream(stream) {
          deprecated('removeStream', 'removeTrack');
          this.getSenders().forEach(sender => {
            if (sender.track && stream.getTracks().includes(sender.track)) {
              this.removeTrack(sender);
            }
          });
        };
    }

    function shimRTCDataChannel(window) {
      // rename DataChannel to RTCDataChannel (native fix in FF60):
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1173851
      if (window.DataChannel && !window.RTCDataChannel) {
        window.RTCDataChannel = window.DataChannel;
      }
    }

    function shimAddTransceiver(window) {
      // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
      // Firefox ignores the init sendEncodings options passed to addTransceiver
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
      if (!(typeof window === 'object' && window.RTCPeerConnection)) {
        return;
      }
      const origAddTransceiver = window.RTCPeerConnection.prototype.addTransceiver;
      if (origAddTransceiver) {
        window.RTCPeerConnection.prototype.addTransceiver =
          function addTransceiver() {
            this.setParametersPromises = [];
            const initParameters = arguments[1];
            const shouldPerformCheck = initParameters &&
                                      'sendEncodings' in initParameters;
            if (shouldPerformCheck) {
              // If sendEncodings params are provided, validate grammar
              initParameters.sendEncodings.forEach((encodingParam) => {
                if ('rid' in encodingParam) {
                  const ridRegex = /^[a-z0-9]{0,16}$/i;
                  if (!ridRegex.test(encodingParam.rid)) {
                    throw new TypeError('Invalid RID value provided.');
                  }
                }
                if ('scaleResolutionDownBy' in encodingParam) {
                  if (!(parseFloat(encodingParam.scaleResolutionDownBy) >= 1.0)) {
                    throw new RangeError('scale_resolution_down_by must be >= 1.0');
                  }
                }
                if ('maxFramerate' in encodingParam) {
                  if (!(parseFloat(encodingParam.maxFramerate) >= 0)) {
                    throw new RangeError('max_framerate must be >= 0.0');
                  }
                }
              });
            }
            const transceiver = origAddTransceiver.apply(this, arguments);
            if (shouldPerformCheck) {
              // Check if the init options were applied. If not we do this in an
              // asynchronous way and save the promise reference in a global object.
              // This is an ugly hack, but at the same time is way more robust than
              // checking the sender parameters before and after the createOffer
              // Also note that after the createoffer we are not 100% sure that
              // the params were asynchronously applied so we might miss the
              // opportunity to recreate offer.
              const {sender} = transceiver;
              const params = sender.getParameters();
              if (!('encodings' in params) ||
                  // Avoid being fooled by patched getParameters() below.
                  (params.encodings.length === 1 &&
                   Object.keys(params.encodings[0]).length === 0)) {
                params.encodings = initParameters.sendEncodings;
                sender.sendEncodings = initParameters.sendEncodings;
                this.setParametersPromises.push(sender.setParameters(params)
                  .then(() => {
                    delete sender.sendEncodings;
                  }).catch(() => {
                    delete sender.sendEncodings;
                  })
                );
              }
            }
            return transceiver;
          };
      }
    }

    function shimGetParameters(window) {
      if (!(typeof window === 'object' && window.RTCRtpSender)) {
        return;
      }
      const origGetParameters = window.RTCRtpSender.prototype.getParameters;
      if (origGetParameters) {
        window.RTCRtpSender.prototype.getParameters =
          function getParameters() {
            const params = origGetParameters.apply(this, arguments);
            if (!('encodings' in params)) {
              params.encodings = [].concat(this.sendEncodings || [{}]);
            }
            return params;
          };
      }
    }

    function shimCreateOffer(window) {
      // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
      // Firefox ignores the init sendEncodings options passed to addTransceiver
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
      if (!(typeof window === 'object' && window.RTCPeerConnection)) {
        return;
      }
      const origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
      window.RTCPeerConnection.prototype.createOffer = function createOffer() {
        if (this.setParametersPromises && this.setParametersPromises.length) {
          return Promise.all(this.setParametersPromises)
          .then(() => {
            return origCreateOffer.apply(this, arguments);
          })
          .finally(() => {
            this.setParametersPromises = [];
          });
        }
        return origCreateOffer.apply(this, arguments);
      };
    }

    function shimCreateAnswer(window) {
      // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
      // Firefox ignores the init sendEncodings options passed to addTransceiver
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
      if (!(typeof window === 'object' && window.RTCPeerConnection)) {
        return;
      }
      const origCreateAnswer = window.RTCPeerConnection.prototype.createAnswer;
      window.RTCPeerConnection.prototype.createAnswer = function createAnswer() {
        if (this.setParametersPromises && this.setParametersPromises.length) {
          return Promise.all(this.setParametersPromises)
          .then(() => {
            return origCreateAnswer.apply(this, arguments);
          })
          .finally(() => {
            this.setParametersPromises = [];
          });
        }
        return origCreateAnswer.apply(this, arguments);
      };
    }

    var firefoxShim = /*#__PURE__*/Object.freeze({
        __proto__: null,
        shimOnTrack: shimOnTrack,
        shimPeerConnection: shimPeerConnection,
        shimSenderGetStats: shimSenderGetStats,
        shimReceiverGetStats: shimReceiverGetStats,
        shimRemoveStream: shimRemoveStream,
        shimRTCDataChannel: shimRTCDataChannel,
        shimAddTransceiver: shimAddTransceiver,
        shimGetParameters: shimGetParameters,
        shimCreateOffer: shimCreateOffer,
        shimCreateAnswer: shimCreateAnswer,
        shimGetUserMedia: shimGetUserMedia$1,
        shimGetDisplayMedia: shimGetDisplayMedia
    });

    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    function shimLocalStreamsAPI(window) {
      if (typeof window !== 'object' || !window.RTCPeerConnection) {
        return;
      }
      if (!('getLocalStreams' in window.RTCPeerConnection.prototype)) {
        window.RTCPeerConnection.prototype.getLocalStreams =
          function getLocalStreams() {
            if (!this._localStreams) {
              this._localStreams = [];
            }
            return this._localStreams;
          };
      }
      if (!('addStream' in window.RTCPeerConnection.prototype)) {
        const _addTrack = window.RTCPeerConnection.prototype.addTrack;
        window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
          if (!this._localStreams) {
            this._localStreams = [];
          }
          if (!this._localStreams.includes(stream)) {
            this._localStreams.push(stream);
          }
          // Try to emulate Chrome's behaviour of adding in audio-video order.
          // Safari orders by track id.
          stream.getAudioTracks().forEach(track => _addTrack.call(this, track,
            stream));
          stream.getVideoTracks().forEach(track => _addTrack.call(this, track,
            stream));
        };

        window.RTCPeerConnection.prototype.addTrack =
          function addTrack(track, ...streams) {
            if (streams) {
              streams.forEach((stream) => {
                if (!this._localStreams) {
                  this._localStreams = [stream];
                } else if (!this._localStreams.includes(stream)) {
                  this._localStreams.push(stream);
                }
              });
            }
            return _addTrack.apply(this, arguments);
          };
      }
      if (!('removeStream' in window.RTCPeerConnection.prototype)) {
        window.RTCPeerConnection.prototype.removeStream =
          function removeStream(stream) {
            if (!this._localStreams) {
              this._localStreams = [];
            }
            const index = this._localStreams.indexOf(stream);
            if (index === -1) {
              return;
            }
            this._localStreams.splice(index, 1);
            const tracks = stream.getTracks();
            this.getSenders().forEach(sender => {
              if (tracks.includes(sender.track)) {
                this.removeTrack(sender);
              }
            });
          };
      }
    }

    function shimRemoteStreamsAPI(window) {
      if (typeof window !== 'object' || !window.RTCPeerConnection) {
        return;
      }
      if (!('getRemoteStreams' in window.RTCPeerConnection.prototype)) {
        window.RTCPeerConnection.prototype.getRemoteStreams =
          function getRemoteStreams() {
            return this._remoteStreams ? this._remoteStreams : [];
          };
      }
      if (!('onaddstream' in window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, 'onaddstream', {
          get() {
            return this._onaddstream;
          },
          set(f) {
            if (this._onaddstream) {
              this.removeEventListener('addstream', this._onaddstream);
              this.removeEventListener('track', this._onaddstreampoly);
            }
            this.addEventListener('addstream', this._onaddstream = f);
            this.addEventListener('track', this._onaddstreampoly = (e) => {
              e.streams.forEach(stream => {
                if (!this._remoteStreams) {
                  this._remoteStreams = [];
                }
                if (this._remoteStreams.includes(stream)) {
                  return;
                }
                this._remoteStreams.push(stream);
                const event = new Event('addstream');
                event.stream = stream;
                this.dispatchEvent(event);
              });
            });
          }
        });
        const origSetRemoteDescription =
          window.RTCPeerConnection.prototype.setRemoteDescription;
        window.RTCPeerConnection.prototype.setRemoteDescription =
          function setRemoteDescription() {
            const pc = this;
            if (!this._onaddstreampoly) {
              this.addEventListener('track', this._onaddstreampoly = function(e) {
                e.streams.forEach(stream => {
                  if (!pc._remoteStreams) {
                    pc._remoteStreams = [];
                  }
                  if (pc._remoteStreams.indexOf(stream) >= 0) {
                    return;
                  }
                  pc._remoteStreams.push(stream);
                  const event = new Event('addstream');
                  event.stream = stream;
                  pc.dispatchEvent(event);
                });
              });
            }
            return origSetRemoteDescription.apply(pc, arguments);
          };
      }
    }

    function shimCallbacksAPI(window) {
      if (typeof window !== 'object' || !window.RTCPeerConnection) {
        return;
      }
      const prototype = window.RTCPeerConnection.prototype;
      const origCreateOffer = prototype.createOffer;
      const origCreateAnswer = prototype.createAnswer;
      const setLocalDescription = prototype.setLocalDescription;
      const setRemoteDescription = prototype.setRemoteDescription;
      const addIceCandidate = prototype.addIceCandidate;

      prototype.createOffer =
        function createOffer(successCallback, failureCallback) {
          const options = (arguments.length >= 2) ? arguments[2] : arguments[0];
          const promise = origCreateOffer.apply(this, [options]);
          if (!failureCallback) {
            return promise;
          }
          promise.then(successCallback, failureCallback);
          return Promise.resolve();
        };

      prototype.createAnswer =
        function createAnswer(successCallback, failureCallback) {
          const options = (arguments.length >= 2) ? arguments[2] : arguments[0];
          const promise = origCreateAnswer.apply(this, [options]);
          if (!failureCallback) {
            return promise;
          }
          promise.then(successCallback, failureCallback);
          return Promise.resolve();
        };

      let withCallback = function(description, successCallback, failureCallback) {
        const promise = setLocalDescription.apply(this, [description]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      prototype.setLocalDescription = withCallback;

      withCallback = function(description, successCallback, failureCallback) {
        const promise = setRemoteDescription.apply(this, [description]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      prototype.setRemoteDescription = withCallback;

      withCallback = function(candidate, successCallback, failureCallback) {
        const promise = addIceCandidate.apply(this, [candidate]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      prototype.addIceCandidate = withCallback;
    }

    function shimGetUserMedia(window) {
      const navigator = window && window.navigator;

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // shim not needed in Safari 12.1
        const mediaDevices = navigator.mediaDevices;
        const _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
        navigator.mediaDevices.getUserMedia = (constraints) => {
          return _getUserMedia(shimConstraints(constraints));
        };
      }

      if (!navigator.getUserMedia && navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia) {
        navigator.getUserMedia = function getUserMedia(constraints, cb, errcb) {
          navigator.mediaDevices.getUserMedia(constraints)
          .then(cb, errcb);
        }.bind(navigator);
      }
    }

    function shimConstraints(constraints) {
      if (constraints && constraints.video !== undefined) {
        return Object.assign({},
          constraints,
          {video: compactObject(constraints.video)}
        );
      }

      return constraints;
    }

    function shimRTCIceServerUrls(window) {
      if (!window.RTCPeerConnection) {
        return;
      }
      // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
      const OrigPeerConnection = window.RTCPeerConnection;
      window.RTCPeerConnection =
        function RTCPeerConnection(pcConfig, pcConstraints) {
          if (pcConfig && pcConfig.iceServers) {
            const newIceServers = [];
            for (let i = 0; i < pcConfig.iceServers.length; i++) {
              let server = pcConfig.iceServers[i];
              if (!server.hasOwnProperty('urls') &&
                  server.hasOwnProperty('url')) {
                deprecated('RTCIceServer.url', 'RTCIceServer.urls');
                server = JSON.parse(JSON.stringify(server));
                server.urls = server.url;
                delete server.url;
                newIceServers.push(server);
              } else {
                newIceServers.push(pcConfig.iceServers[i]);
              }
            }
            pcConfig.iceServers = newIceServers;
          }
          return new OrigPeerConnection(pcConfig, pcConstraints);
        };
      window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
      // wrap static methods. Currently just generateCertificate.
      if ('generateCertificate' in OrigPeerConnection) {
        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
          get() {
            return OrigPeerConnection.generateCertificate;
          }
        });
      }
    }

    function shimTrackEventTransceiver(window) {
      // Add event.transceiver member over deprecated event.receiver
      if (typeof window === 'object' && window.RTCTrackEvent &&
          'receiver' in window.RTCTrackEvent.prototype &&
          !('transceiver' in window.RTCTrackEvent.prototype)) {
        Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
          get() {
            return {receiver: this.receiver};
          }
        });
      }
    }

    function shimCreateOfferLegacy(window) {
      const origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
      window.RTCPeerConnection.prototype.createOffer =
        function createOffer(offerOptions) {
          if (offerOptions) {
            if (typeof offerOptions.offerToReceiveAudio !== 'undefined') {
              // support bit values
              offerOptions.offerToReceiveAudio =
                !!offerOptions.offerToReceiveAudio;
            }
            const audioTransceiver = this.getTransceivers().find(transceiver =>
              transceiver.receiver.track.kind === 'audio');
            if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
              if (audioTransceiver.direction === 'sendrecv') {
                if (audioTransceiver.setDirection) {
                  audioTransceiver.setDirection('sendonly');
                } else {
                  audioTransceiver.direction = 'sendonly';
                }
              } else if (audioTransceiver.direction === 'recvonly') {
                if (audioTransceiver.setDirection) {
                  audioTransceiver.setDirection('inactive');
                } else {
                  audioTransceiver.direction = 'inactive';
                }
              }
            } else if (offerOptions.offerToReceiveAudio === true &&
                !audioTransceiver) {
              this.addTransceiver('audio');
            }

            if (typeof offerOptions.offerToReceiveVideo !== 'undefined') {
              // support bit values
              offerOptions.offerToReceiveVideo =
                !!offerOptions.offerToReceiveVideo;
            }
            const videoTransceiver = this.getTransceivers().find(transceiver =>
              transceiver.receiver.track.kind === 'video');
            if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
              if (videoTransceiver.direction === 'sendrecv') {
                if (videoTransceiver.setDirection) {
                  videoTransceiver.setDirection('sendonly');
                } else {
                  videoTransceiver.direction = 'sendonly';
                }
              } else if (videoTransceiver.direction === 'recvonly') {
                if (videoTransceiver.setDirection) {
                  videoTransceiver.setDirection('inactive');
                } else {
                  videoTransceiver.direction = 'inactive';
                }
              }
            } else if (offerOptions.offerToReceiveVideo === true &&
                !videoTransceiver) {
              this.addTransceiver('video');
            }
          }
          return origCreateOffer.apply(this, arguments);
        };
    }

    function shimAudioContext(window) {
      if (typeof window !== 'object' || window.AudioContext) {
        return;
      }
      window.AudioContext = window.webkitAudioContext;
    }

    var safariShim = /*#__PURE__*/Object.freeze({
        __proto__: null,
        shimLocalStreamsAPI: shimLocalStreamsAPI,
        shimRemoteStreamsAPI: shimRemoteStreamsAPI,
        shimCallbacksAPI: shimCallbacksAPI,
        shimGetUserMedia: shimGetUserMedia,
        shimConstraints: shimConstraints,
        shimRTCIceServerUrls: shimRTCIceServerUrls,
        shimTrackEventTransceiver: shimTrackEventTransceiver,
        shimCreateOfferLegacy: shimCreateOfferLegacy,
        shimAudioContext: shimAudioContext
    });

    /*
     *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    function shimRTCIceCandidate(window) {
      // foundation is arbitrarily chosen as an indicator for full support for
      // https://w3c.github.io/webrtc-pc/#rtcicecandidate-interface
      if (!window.RTCIceCandidate || (window.RTCIceCandidate && 'foundation' in
          window.RTCIceCandidate.prototype)) {
        return;
      }

      const NativeRTCIceCandidate = window.RTCIceCandidate;
      window.RTCIceCandidate = function RTCIceCandidate(args) {
        // Remove the a= which shouldn't be part of the candidate string.
        if (typeof args === 'object' && args.candidate &&
            args.candidate.indexOf('a=') === 0) {
          args = JSON.parse(JSON.stringify(args));
          args.candidate = args.candidate.substr(2);
        }

        if (args.candidate && args.candidate.length) {
          // Augment the native candidate with the parsed fields.
          const nativeCandidate = new NativeRTCIceCandidate(args);
          const parsedCandidate = sdp.parseCandidate(args.candidate);
          const augmentedCandidate = Object.assign(nativeCandidate,
              parsedCandidate);

          // Add a serializer that does not serialize the extra attributes.
          augmentedCandidate.toJSON = function toJSON() {
            return {
              candidate: augmentedCandidate.candidate,
              sdpMid: augmentedCandidate.sdpMid,
              sdpMLineIndex: augmentedCandidate.sdpMLineIndex,
              usernameFragment: augmentedCandidate.usernameFragment,
            };
          };
          return augmentedCandidate;
        }
        return new NativeRTCIceCandidate(args);
      };
      window.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;

      // Hook up the augmented candidate in onicecandidate and
      // addEventListener('icecandidate', ...)
      wrapPeerConnectionEvent(window, 'icecandidate', e => {
        if (e.candidate) {
          Object.defineProperty(e, 'candidate', {
            value: new window.RTCIceCandidate(e.candidate),
            writable: 'false'
          });
        }
        return e;
      });
    }

    function shimMaxMessageSize(window, browserDetails) {
      if (!window.RTCPeerConnection) {
        return;
      }

      if (!('sctp' in window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, 'sctp', {
          get() {
            return typeof this._sctp === 'undefined' ? null : this._sctp;
          }
        });
      }

      const sctpInDescription = function(description) {
        if (!description || !description.sdp) {
          return false;
        }
        const sections = sdp.splitSections(description.sdp);
        sections.shift();
        return sections.some(mediaSection => {
          const mLine = sdp.parseMLine(mediaSection);
          return mLine && mLine.kind === 'application'
              && mLine.protocol.indexOf('SCTP') !== -1;
        });
      };

      const getRemoteFirefoxVersion = function(description) {
        // TODO: Is there a better solution for detecting Firefox?
        const match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
        if (match === null || match.length < 2) {
          return -1;
        }
        const version = parseInt(match[1], 10);
        // Test for NaN (yes, this is ugly)
        return version !== version ? -1 : version;
      };

      const getCanSendMaxMessageSize = function(remoteIsFirefox) {
        // Every implementation we know can send at least 64 KiB.
        // Note: Although Chrome is technically able to send up to 256 KiB, the
        //       data does not reach the other peer reliably.
        //       See: https://bugs.chromium.org/p/webrtc/issues/detail?id=8419
        let canSendMaxMessageSize = 65536;
        if (browserDetails.browser === 'firefox') {
          if (browserDetails.version < 57) {
            if (remoteIsFirefox === -1) {
              // FF < 57 will send in 16 KiB chunks using the deprecated PPID
              // fragmentation.
              canSendMaxMessageSize = 16384;
            } else {
              // However, other FF (and RAWRTC) can reassemble PPID-fragmented
              // messages. Thus, supporting ~2 GiB when sending.
              canSendMaxMessageSize = 2147483637;
            }
          } else if (browserDetails.version < 60) {
            // Currently, all FF >= 57 will reset the remote maximum message size
            // to the default value when a data channel is created at a later
            // stage. :(
            // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
            canSendMaxMessageSize =
              browserDetails.version === 57 ? 65535 : 65536;
          } else {
            // FF >= 60 supports sending ~2 GiB
            canSendMaxMessageSize = 2147483637;
          }
        }
        return canSendMaxMessageSize;
      };

      const getMaxMessageSize = function(description, remoteIsFirefox) {
        // Note: 65536 bytes is the default value from the SDP spec. Also,
        //       every implementation we know supports receiving 65536 bytes.
        let maxMessageSize = 65536;

        // FF 57 has a slightly incorrect default remote max message size, so
        // we need to adjust it here to avoid a failure when sending.
        // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1425697
        if (browserDetails.browser === 'firefox'
             && browserDetails.version === 57) {
          maxMessageSize = 65535;
        }

        const match = sdp.matchPrefix(description.sdp,
          'a=max-message-size:');
        if (match.length > 0) {
          maxMessageSize = parseInt(match[0].substr(19), 10);
        } else if (browserDetails.browser === 'firefox' &&
                    remoteIsFirefox !== -1) {
          // If the maximum message size is not present in the remote SDP and
          // both local and remote are Firefox, the remote peer can receive
          // ~2 GiB.
          maxMessageSize = 2147483637;
        }
        return maxMessageSize;
      };

      const origSetRemoteDescription =
          window.RTCPeerConnection.prototype.setRemoteDescription;
      window.RTCPeerConnection.prototype.setRemoteDescription =
        function setRemoteDescription() {
          this._sctp = null;
          // Chrome decided to not expose .sctp in plan-b mode.
          // As usual, adapter.js has to do an 'ugly worakaround'
          // to cover up the mess.
          if (browserDetails.browser === 'chrome' && browserDetails.version >= 76) {
            const {sdpSemantics} = this.getConfiguration();
            if (sdpSemantics === 'plan-b') {
              Object.defineProperty(this, 'sctp', {
                get() {
                  return typeof this._sctp === 'undefined' ? null : this._sctp;
                },
                enumerable: true,
                configurable: true,
              });
            }
          }

          if (sctpInDescription(arguments[0])) {
            // Check if the remote is FF.
            const isFirefox = getRemoteFirefoxVersion(arguments[0]);

            // Get the maximum message size the local peer is capable of sending
            const canSendMMS = getCanSendMaxMessageSize(isFirefox);

            // Get the maximum message size of the remote peer.
            const remoteMMS = getMaxMessageSize(arguments[0], isFirefox);

            // Determine final maximum message size
            let maxMessageSize;
            if (canSendMMS === 0 && remoteMMS === 0) {
              maxMessageSize = Number.POSITIVE_INFINITY;
            } else if (canSendMMS === 0 || remoteMMS === 0) {
              maxMessageSize = Math.max(canSendMMS, remoteMMS);
            } else {
              maxMessageSize = Math.min(canSendMMS, remoteMMS);
            }

            // Create a dummy RTCSctpTransport object and the 'maxMessageSize'
            // attribute.
            const sctp = {};
            Object.defineProperty(sctp, 'maxMessageSize', {
              get() {
                return maxMessageSize;
              }
            });
            this._sctp = sctp;
          }

          return origSetRemoteDescription.apply(this, arguments);
        };
    }

    function shimSendThrowTypeError(window) {
      if (!(window.RTCPeerConnection &&
          'createDataChannel' in window.RTCPeerConnection.prototype)) {
        return;
      }

      // Note: Although Firefox >= 57 has a native implementation, the maximum
      //       message size can be reset for all data channels at a later stage.
      //       See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831

      function wrapDcSend(dc, pc) {
        const origDataChannelSend = dc.send;
        dc.send = function send() {
          const data = arguments[0];
          const length = data.length || data.size || data.byteLength;
          if (dc.readyState === 'open' &&
              pc.sctp && length > pc.sctp.maxMessageSize) {
            throw new TypeError('Message too large (can send a maximum of ' +
              pc.sctp.maxMessageSize + ' bytes)');
          }
          return origDataChannelSend.apply(dc, arguments);
        };
      }
      const origCreateDataChannel =
        window.RTCPeerConnection.prototype.createDataChannel;
      window.RTCPeerConnection.prototype.createDataChannel =
        function createDataChannel() {
          const dataChannel = origCreateDataChannel.apply(this, arguments);
          wrapDcSend(dataChannel, this);
          return dataChannel;
        };
      wrapPeerConnectionEvent(window, 'datachannel', e => {
        wrapDcSend(e.channel, e.target);
        return e;
      });
    }


    /* shims RTCConnectionState by pretending it is the same as iceConnectionState.
     * See https://bugs.chromium.org/p/webrtc/issues/detail?id=6145#c12
     * for why this is a valid hack in Chrome. In Firefox it is slightly incorrect
     * since DTLS failures would be hidden. See
     * https://bugzilla.mozilla.org/show_bug.cgi?id=1265827
     * for the Firefox tracking bug.
     */
    function shimConnectionState(window) {
      if (!window.RTCPeerConnection ||
          'connectionState' in window.RTCPeerConnection.prototype) {
        return;
      }
      const proto = window.RTCPeerConnection.prototype;
      Object.defineProperty(proto, 'connectionState', {
        get() {
          return {
            completed: 'connected',
            checking: 'connecting'
          }[this.iceConnectionState] || this.iceConnectionState;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(proto, 'onconnectionstatechange', {
        get() {
          return this._onconnectionstatechange || null;
        },
        set(cb) {
          if (this._onconnectionstatechange) {
            this.removeEventListener('connectionstatechange',
                this._onconnectionstatechange);
            delete this._onconnectionstatechange;
          }
          if (cb) {
            this.addEventListener('connectionstatechange',
                this._onconnectionstatechange = cb);
          }
        },
        enumerable: true,
        configurable: true
      });

      ['setLocalDescription', 'setRemoteDescription'].forEach((method) => {
        const origMethod = proto[method];
        proto[method] = function() {
          if (!this._connectionstatechangepoly) {
            this._connectionstatechangepoly = e => {
              const pc = e.target;
              if (pc._lastConnectionState !== pc.connectionState) {
                pc._lastConnectionState = pc.connectionState;
                const newEvent = new Event('connectionstatechange', e);
                pc.dispatchEvent(newEvent);
              }
              return e;
            };
            this.addEventListener('iceconnectionstatechange',
              this._connectionstatechangepoly);
          }
          return origMethod.apply(this, arguments);
        };
      });
    }

    function removeExtmapAllowMixed(window, browserDetails) {
      /* remove a=extmap-allow-mixed for webrtc.org < M71 */
      if (!window.RTCPeerConnection) {
        return;
      }
      if (browserDetails.browser === 'chrome' && browserDetails.version >= 71) {
        return;
      }
      if (browserDetails.browser === 'safari' && browserDetails.version >= 605) {
        return;
      }
      const nativeSRD = window.RTCPeerConnection.prototype.setRemoteDescription;
      window.RTCPeerConnection.prototype.setRemoteDescription =
      function setRemoteDescription(desc) {
        if (desc && desc.sdp && desc.sdp.indexOf('\na=extmap-allow-mixed') !== -1) {
          const sdp = desc.sdp.split('\n').filter((line) => {
            return line.trim() !== 'a=extmap-allow-mixed';
          }).join('\n');
          // Safari enforces read-only-ness of RTCSessionDescription fields.
          if (window.RTCSessionDescription &&
              desc instanceof window.RTCSessionDescription) {
            arguments[0] = new window.RTCSessionDescription({
              type: desc.type,
              sdp,
            });
          } else {
            desc.sdp = sdp;
          }
        }
        return nativeSRD.apply(this, arguments);
      };
    }

    function shimAddIceCandidateNullOrEmpty(window, browserDetails) {
      // Support for addIceCandidate(null or undefined)
      // as well as addIceCandidate({candidate: "", ...})
      // https://bugs.chromium.org/p/chromium/issues/detail?id=978582
      // Note: must be called before other polyfills which change the signature.
      if (!(window.RTCPeerConnection && window.RTCPeerConnection.prototype)) {
        return;
      }
      const nativeAddIceCandidate =
          window.RTCPeerConnection.prototype.addIceCandidate;
      if (!nativeAddIceCandidate || nativeAddIceCandidate.length === 0) {
        return;
      }
      window.RTCPeerConnection.prototype.addIceCandidate =
        function addIceCandidate() {
          if (!arguments[0]) {
            if (arguments[1]) {
              arguments[1].apply(null);
            }
            return Promise.resolve();
          }
          // Firefox 68+ emits and processes {candidate: "", ...}, ignore
          // in older versions.
          // Native support for ignoring exists for Chrome M77+.
          // Safari ignores as well, exact version unknown but works in the same
          // version that also ignores addIceCandidate(null).
          if (((browserDetails.browser === 'chrome' && browserDetails.version < 78)
               || (browserDetails.browser === 'firefox'
                   && browserDetails.version < 68)
               || (browserDetails.browser === 'safari'))
              && arguments[0] && arguments[0].candidate === '') {
            return Promise.resolve();
          }
          return nativeAddIceCandidate.apply(this, arguments);
        };
    }

    var commonShim = /*#__PURE__*/Object.freeze({
        __proto__: null,
        shimRTCIceCandidate: shimRTCIceCandidate,
        shimMaxMessageSize: shimMaxMessageSize,
        shimSendThrowTypeError: shimSendThrowTypeError,
        shimConnectionState: shimConnectionState,
        removeExtmapAllowMixed: removeExtmapAllowMixed,
        shimAddIceCandidateNullOrEmpty: shimAddIceCandidateNullOrEmpty
    });

    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    // Shimming starts here.
    function adapterFactory({window} = {}, options = {
      shimChrome: true,
      shimFirefox: true,
      shimEdge: true,
      shimSafari: true,
    }) {
      // Utils.
      const logging = log;
      const browserDetails = detectBrowser(window);

      const adapter = {
        browserDetails,
        commonShim,
        extractVersion: extractVersion,
        disableLog: disableLog,
        disableWarnings: disableWarnings
      };

      // Shim browser if found.
      switch (browserDetails.browser) {
        case 'chrome':
          if (!chromeShim || !shimPeerConnection$2 ||
              !options.shimChrome) {
            logging('Chrome shim is not included in this adapter release.');
            return adapter;
          }
          if (browserDetails.version === null) {
            logging('Chrome shim can not determine version, not shimming.');
            return adapter;
          }
          logging('adapter.js shimming chrome.');
          // Export to the adapter global object visible in the browser.
          adapter.browserShim = chromeShim;

          // Must be called before shimPeerConnection.
          shimAddIceCandidateNullOrEmpty(window, browserDetails);

          shimGetUserMedia$3(window, browserDetails);
          shimMediaStream(window);
          shimPeerConnection$2(window, browserDetails);
          shimOnTrack$1(window);
          shimAddTrackRemoveTrack(window, browserDetails);
          shimGetSendersWithDtmf(window);
          shimGetStats(window);
          shimSenderReceiverGetStats(window);
          fixNegotiationNeeded(window, browserDetails);

          shimRTCIceCandidate(window);
          shimConnectionState(window);
          shimMaxMessageSize(window, browserDetails);
          shimSendThrowTypeError(window);
          removeExtmapAllowMixed(window, browserDetails);
          break;
        case 'firefox':
          if (!firefoxShim || !shimPeerConnection ||
              !options.shimFirefox) {
            logging('Firefox shim is not included in this adapter release.');
            return adapter;
          }
          logging('adapter.js shimming firefox.');
          // Export to the adapter global object visible in the browser.
          adapter.browserShim = firefoxShim;

          // Must be called before shimPeerConnection.
          shimAddIceCandidateNullOrEmpty(window, browserDetails);

          shimGetUserMedia$1(window, browserDetails);
          shimPeerConnection(window, browserDetails);
          shimOnTrack(window);
          shimRemoveStream(window);
          shimSenderGetStats(window);
          shimReceiverGetStats(window);
          shimRTCDataChannel(window);
          shimAddTransceiver(window);
          shimGetParameters(window);
          shimCreateOffer(window);
          shimCreateAnswer(window);

          shimRTCIceCandidate(window);
          shimConnectionState(window);
          shimMaxMessageSize(window, browserDetails);
          shimSendThrowTypeError(window);
          break;
        case 'edge':
          if (!edgeShim || !shimPeerConnection$1 || !options.shimEdge) {
            logging('MS edge shim is not included in this adapter release.');
            return adapter;
          }
          logging('adapter.js shimming edge.');
          // Export to the adapter global object visible in the browser.
          adapter.browserShim = edgeShim;

          shimGetUserMedia$2(window);
          shimGetDisplayMedia$1(window);
          shimPeerConnection$1(window, browserDetails);
          shimReplaceTrack(window);

          // the edge shim implements the full RTCIceCandidate object.

          shimMaxMessageSize(window, browserDetails);
          shimSendThrowTypeError(window);
          break;
        case 'safari':
          if (!safariShim || !options.shimSafari) {
            logging('Safari shim is not included in this adapter release.');
            return adapter;
          }
          logging('adapter.js shimming safari.');
          // Export to the adapter global object visible in the browser.
          adapter.browserShim = safariShim;

          // Must be called before shimCallbackAPI.
          shimAddIceCandidateNullOrEmpty(window, browserDetails);

          shimRTCIceServerUrls(window);
          shimCreateOfferLegacy(window);
          shimCallbacksAPI(window);
          shimLocalStreamsAPI(window);
          shimRemoteStreamsAPI(window);
          shimTrackEventTransceiver(window);
          shimGetUserMedia(window);
          shimAudioContext(window);

          shimRTCIceCandidate(window);
          shimMaxMessageSize(window, browserDetails);
          shimSendThrowTypeError(window);
          removeExtmapAllowMixed(window, browserDetails);
          break;
        default:
          logging('Unsupported browser!');
          break;
      }

      return adapter;
    }

    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    const adapter =
      adapterFactory({window: typeof window === 'undefined' ? undefined : window});

    exports.RCFrameRate = void 0;
    (function (RCFrameRate) {
        RCFrameRate["FPS_10"] = "FPS_10";
        RCFrameRate["FPS_15"] = "FPS_15";
        RCFrameRate["FPS_24"] = "FPS_24";
        RCFrameRate["FPS_30"] = "FPS_30";
    })(exports.RCFrameRate || (exports.RCFrameRate = {}));

    exports.RCResolution = void 0;
    (function (RCResolution) {
        RCResolution["W176_H132"] = "W176_H132";
        RCResolution["W176_H144"] = "W176_H144";
        RCResolution["W256_H144"] = "W256_H144";
        RCResolution["W320_H180"] = "W320_H180";
        RCResolution["W240_H240"] = "W240_H240";
        RCResolution["W320_H240"] = "W320_H240";
        RCResolution["W480_H360"] = "W480_H360";
        RCResolution["W640_H360"] = "W640_H360";
        RCResolution["W480_H480"] = "W480_H480";
        RCResolution["W640_H480"] = "W640_H480";
        RCResolution["W720_H480"] = "W720_H480";
        RCResolution["W1280_H720"] = "W1280_H720";
        RCResolution["W1920_H1080"] = "W1920_H1080";
    })(exports.RCResolution || (exports.RCResolution = {}));

    const RongRTCVideoBitrate = {
        [exports.RCResolution.W176_H132]: { width: 176, height: 132, maxBitrate: 150, minBitrate: 80 },
        [exports.RCResolution.W176_H144]: { width: 176, height: 144, maxBitrate: 160, minBitrate: 80 },
        [exports.RCResolution.W256_H144]: { width: 256, height: 144, maxBitrate: 240, minBitrate: 120 },
        [exports.RCResolution.W320_H180]: { width: 320, height: 180, maxBitrate: 280, minBitrate: 120 },
        [exports.RCResolution.W240_H240]: { width: 240, height: 240, maxBitrate: 280, minBitrate: 120 },
        [exports.RCResolution.W320_H240]: { width: 320, height: 240, maxBitrate: 400, minBitrate: 120 },
        [exports.RCResolution.W480_H360]: { width: 480, height: 360, maxBitrate: 650, minBitrate: 150 },
        [exports.RCResolution.W640_H360]: { width: 640, height: 360, maxBitrate: 800, minBitrate: 180 },
        [exports.RCResolution.W480_H480]: { width: 480, height: 480, maxBitrate: 800, minBitrate: 180 },
        [exports.RCResolution.W640_H480]: { width: 640, height: 480, maxBitrate: 900, minBitrate: 200 },
        [exports.RCResolution.W720_H480]: { width: 720, height: 480, maxBitrate: 1000, minBitrate: 200 },
        [exports.RCResolution.W1280_H720]: { width: 1280, height: 720, maxBitrate: 2200, minBitrate: 250 },
        [exports.RCResolution.W1920_H1080]: { width: 1920, height: 1080, maxBitrate: 4000, minBitrate: 400 }
    };
    /**
    * 取最接近的视频分辨率配置
    * @param {number} width
    * @param {number} height
    */
    const getNearestResolution = (width, height) => {
        const area = width * height;
        let d = Number.MAX_VALUE;
        let conf = null;
        for (const key in RongRTCVideoBitrate) {
            const item = RongRTCVideoBitrate[key];
            const d2 = Math.abs(item.width * item.height - area);
            if (d2 < d) {
                conf = item;
                d = d2;
            }
        }
        return conf;
    };
    const Multiplier = {
        10: 1,
        15: 1,
        24: 1.5,
        30: 1.5
    };
    /**
     * 根据帧率获取码率倍数
     * @param frameRate
     */
    const getBitrateMultiple = (frameRate) => {
        let d = Number.MAX_VALUE;
        let rate = 1;
        for (const key in Multiplier) {
            const d2 = Math.abs(frameRate - parseInt(key));
            if (d2 < d) {
                d = d2;
                rate = Multiplier[key];
            }
        }
        return rate;
    };

    class RCTrack extends engine.EventEmitter {
        constructor(_tag, _userId, _kind, _isLocalTrack, _roomId) {
            super();
            this._tag = _tag;
            this._userId = _userId;
            this._kind = _kind;
            this._isLocalTrack = _isLocalTrack;
            this._roomId = _roomId;
            this._localMuted = false;
            this._remoteMuted = false;
            this._streamId = [this._userId || this._roomId, this._tag].join('_');
            this._id = [this._streamId, this.isAudioTrack() ? 0 : 1].join('_');
        }
        /**
         * 获取音视轨所属的 streamId，streamId 相同的音轨和视轨可认为属于统一道流
         * @returns
         */
        getStreamId() {
            return this._streamId;
        }
        getTrackId() {
            return this._id;
        }
        /**
         * 当 isMCUTrack 为 true 时，返回空字符串
         */
        getUserId() {
            return this._userId;
        }
        __innerGetMediaStreamTrack() {
            return this._msTrack;
        }
        /**
         * 获取数据标识
         * @returns
         */
        getTag() {
            return this._tag;
        }
        isLocalTrack() {
            return this._isLocalTrack;
        }
        isVideoTrack() {
            return this._kind === 'video';
        }
        isAudioTrack() {
            return this._kind === 'audio';
        }
        /**
         * 查询流数据是否已可进行播放
         * @returns
         */
        isReady() {
            var _a;
            return ((_a = this._msTrack) === null || _a === void 0 ? void 0 : _a.readyState) === 'live';
        }
        __innerSetMediaStreamTrack(track) {
            this._msTrack = track;
            this._setLocalMuted(this._localMuted);
            const stream = this._msStream = this._msStream || new MediaStream();
            const preTrack = stream.getTracks()[0];
            preTrack && stream.removeTrack(preTrack);
            if (track) {
                stream.addTrack(track);
            }
            else if (this._element) {
                this._element.pause();
                this._element.srcObject = null;
            }
        }
        _setLocalMuted(bool) {
            if (this._msTrack) {
                this._msTrack.enabled = !bool;
            }
            this._localMuted = bool;
        }
        /**
         * 禁用
         */
        mute() {
            logger.info(`set ${this._id} enabled: false`);
            this._setLocalMuted(true);
        }
        /**
         * 启用
         */
        unmute() {
            logger.info(`set ${this._id} enabled: true`);
            this._setLocalMuted(false);
        }
        /**
         * 本端是否已禁用该轨道数据
         */
        isLocalMuted() {
            return this._localMuted;
        }
        /**
         * 是否为 MCU track
         */
        isMCUTrack() {
            // 普通 track roomId 为空串，mcu track roomId 为直播房间 Id
            return Boolean(this._roomId);
        }
        /**
         * 发布者是否已禁用该轨道数据，在 RCLocalTrack 实例中，则其值始终等于 `isLocalMuted()`
         */
        isOwnerMuted() {
            return this._remoteMuted;
        }
        /**
         * 播放
         * @param element 用于承载媒体流的元素标签，音频流可传空
         * @param volume 有效值为 0-100
         */
        play(element, options) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._msTrack) {
                    logger.warn(`the track is not ready to play -> id: ${this._id}`);
                    return { code: exports.RCRTCCode.TRACK_NOT_READY };
                }
                if (this._msTrack.readyState === 'ended') {
                    logger.warn(`the track's readyState is 'ended' -> id: ${this._id}`);
                }
                if (options === null || options === void 0 ? void 0 : options.volume) {
                    if (!engine.isNumber(options === null || options === void 0 ? void 0 : options.volume)) {
                        logger.error(`${options === null || options === void 0 ? void 0 : options.volume} is not a number, the valid range of options.volume is 0-100`);
                        return { code: exports.RCRTCCode.PARAMS_ERROR };
                    }
                    if ((options === null || options === void 0 ? void 0 : options.volume) < 0) {
                        options.volume = 0;
                        logger.warn('the valid range of options.volume is 0-100, the value of volume has been set 0');
                    }
                    if ((options === null || options === void 0 ? void 0 : options.volume) > 100) {
                        options.volume = 100;
                        logger.warn('the valid range of options.volume is 0-100, the value of volume has been set 100');
                    }
                }
                const isVideoTrack = this.isVideoTrack();
                // video 播放必须传递一个 HTMLVideoElement 实例作为 video track 的播放组件
                if (isVideoTrack && (!element || !(element instanceof HTMLVideoElement))) {
                    logger.error(`the video track need an <video> to play -> id: ${this._id}`);
                    return { code: exports.RCRTCCode.VIDEO_TRACK_MISS_MEDIA_ELEMENT };
                }
                this._element = isVideoTrack ? element : (this._element || new Audio());
                // 若本地静音，则恢复本地播放
                if (this._localMuted) {
                    this._setLocalMuted(false);
                }
                if (!this._element.srcObject || this._element.srcObject !== this._msStream) {
                    this._element.pause();
                }
                this._element.onloadstart = evt => {
                    var _a;
                    // 开始寻找资源
                    logger.debug(`HTMLMediaElement onloadstart -> id: ${(_a = evt.target) === null || _a === void 0 ? void 0 : _a.id}, trackId: ${this._id}`);
                };
                this._element.ondurationchange = evt => {
                    var _a;
                    // 时长变更
                    logger.debug(`HTMLMediaElement ondurationchange -> id: ${(_a = evt.target) === null || _a === void 0 ? void 0 : _a.id}, trackId: ${this._id}`);
                };
                this._element.onloadedmetadata = evt => {
                    var _a;
                    // 元数据加载完成
                    logger.debug(`HTMLMediaElement onloadedmetadata -> id: ${(_a = evt.target) === null || _a === void 0 ? void 0 : _a.id}, trackId: ${this._id}`);
                };
                this._element.onloadeddata = evt => {
                    var _a;
                    // 首帧加载完成
                    logger.debug(`HTMLMediaElement onloadeddata -> id: ${(_a = evt.target) === null || _a === void 0 ? void 0 : _a.id}, trackId: ${this._id}`);
                };
                this._element.onabort = (evt) => {
                    var _a;
                    // 中止
                    logger.info(`HTMLMediaElement onabort -> id: ${(_a = evt.target) === null || _a === void 0 ? void 0 : _a.id}, trackId: ${this._id}`);
                };
                this._element.oncanplay = evt => {
                    var _a;
                    // 可以播放
                    logger.info(`HTMLMediaElement oncanplay -> id: ${(_a = evt.target) === null || _a === void 0 ? void 0 : _a.id}, trackId: ${this._id}`);
                };
                this._element.onvolumechange = evt => {
                    var _a;
                    // 音量变化
                    const volume = Math.floor(((_a = evt.target) === null || _a === void 0 ? void 0 : _a.volume) * 100);
                    logger.info(`HTMLMediaElement onvolumechange -> volume: ${volume}, trackId: ${this._id}`);
                };
                this._element.srcObject = this._msStream;
                this._element.autoplay = true;
                // video 标签页面内播放
                if (isVideoTrack) {
                    this._element.playsInline = true;
                    this._element.x5PlaysInline = true;
                    this._element.webkitPlaysInline = true;
                }
                // audio 标签设置音量
                if (!isVideoTrack && ((options === null || options === void 0 ? void 0 : options.volume) || (options === null || options === void 0 ? void 0 : options.volume) === 0)) {
                    this._element.volume = (options === null || options === void 0 ? void 0 : options.volume) / 100;
                }
                try {
                    this._element.play();
                }
                catch (error) {
                    logger.error(error);
                    return { code: exports.RCRTCCode.TRACK_PLAY_ERROR };
                }
                return { code: exports.RCRTCCode.SUCCESS };
            });
        }
        __innerDestroy() {
            this.__innerSetMediaStreamTrack(undefined);
        }
        /**
         * 释放内存中的 video、audio 标签
         */
        __releaseMediaElement() {
            if (this._element) {
                this._element.remove();
                this._element.srcObject = null;
            }
        }
    }

    class RCLocalTrack extends RCTrack {
        constructor(tag, userId, kind, track) {
            super(tag, userId, kind, true);
            this._isPublished = false;
            this.__innerSetMediaStreamTrack(track);
            // 监听流结束事件
            track.onended = () => {
                track.onended = null;
                this.emit(RCLocalTrack.EVENT_LOCAL_TRACK_END, this);
                this.removeAll(RCLocalTrack.EVENT_LOCAL_TRACK_END);
            };
        }
        /**
         * @override 重写 RCTrack 父类方法
         * @param bool
         */
        _setLocalMuted(bool) {
            const changed = this._localMuted !== bool;
            super._setLocalMuted(bool);
            // 本端流，remoteMuted 与 localMuted 始终保持一致
            this._remoteMuted = this._localMuted;
            // 派发事件以通知房间内其他成员
            changed && this.emit(RCLocalTrack.__INNER_EVENT_MUTED_CHANGE__, this);
        }
        __innerSetPublished(bool) {
            this._isPublished = bool;
        }
        /**
         * 检测本地资源是否已发布
         */
        isPublished() {
            return this._isPublished;
        }
        /**
         * 销毁本地流
         */
        destroy() {
            var _a;
            logger.info(`track is destroyed -> trackId: ${this.getTrackId()}`);
            (_a = this._msTrack) === null || _a === void 0 ? void 0 : _a.stop();
            super.__innerDestroy();
            this.isAudioTrack() && super.__releaseMediaElement();
            // 需要通知房间流已销毁，取消发布流
            this.emit(RCLocalTrack.__INNER_EVENT_DESTROY__, this);
        }
        /**
         * 为本地流设定上行码率，仅视频流有效，音频默认 15 kbps，不支持修改
         * @description 当 `max` 或 `min` 值为 `0` 时，取动态码率计算结果
         * @param max 最大码率
         * @param min 最小码率
         * @param start 起始码率
         */
        setBitrate(max = 0, min = 0, start = 0) {
            if (!engine.isNumber(max) || !engine.isNumber(min) || !engine.isNumber(start) || max <= 0 || min <= 0 || max < min) {
                logger.error('setBitrate params error ->');
                return;
            }
            this._bitrateInfo = { max, min, start };
        }
        /**
         * 获取码率配置，当未指定码率时，将取得动态码率计算值
         * @returns
         */
        getBitrate() {
            var _a, _b;
            const { min, max } = this._msTrack ? getDynamicBitrate(this._msTrack) : { min: 0, max: 0 };
            return { min: ((_a = this._bitrateInfo) === null || _a === void 0 ? void 0 : _a.min) || min, max: ((_b = this._bitrateInfo) === null || _b === void 0 ? void 0 : _b.max) || max };
        }
    }
    /**
     * 本地流结束事件通知
     * @description
     * 该事件为 MediaStreamTrack 实例的 'ended' 事件触发
     */
    RCLocalTrack.EVENT_LOCAL_TRACK_END = 'local-track-end';
    /**
     * muted 状态变更通知常量定义
     */
    RCLocalTrack.__INNER_EVENT_MUTED_CHANGE__ = 'inner-muted-change';
    /**
     * 本地流已销毁
     */
    RCLocalTrack.__INNER_EVENT_DESTROY__ = 'inner-destroy';
    class RCLocalAudioTrack extends RCLocalTrack {
        constructor(tag, userId, track) {
            super(tag, userId, 'audio', track);
        }
        /**
         * 为本地流设定上行码率，仅视频流有效，音频默认 32 kbps，不支持修改
         * @param max 最大码率，`0` 表示不限制
         * @param min 最小码率，`0` 表示不限制
         * @param start 起始码率
         */
        setBitrate(max, min, start) {
            logger.warn('`setBitrate` invalid for audio track');
        }
        /**
         * 获取码率配置，当未指定码率时，将取得动态码率计算值
         * @returns
         */
        getBitrate() {
            return { start: 32, max: 32, min: 32 };
        }
    }
    class RCLocalVideoTrack extends RCLocalTrack {
        constructor(tag, userId, track, _isTiny = false) {
            super(tag, userId, 'video', track);
            this._isTiny = _isTiny;
        }
        __isTiny() {
            return this._isTiny;
        }
        getStreamId() {
            const msid = super.getStreamId();
            return this._isTiny ? `${msid}_tiny` : msid;
        }
        getTrackId() {
            const trackId = super.getTrackId();
            return this._isTiny ? `${trackId}_tiny` : trackId;
        }
    }
    class RCLocalFileTrack extends RCLocalTrack {
        constructor(tag, userId, kind, track, 
        /**
         * 自定义文件流的播放宿主原生，该类型流所持有的 MediaStreamTrack 实例是由该宿主元素 `captureStream` 获取
         */
        _resource) {
            super(tag, userId, kind, track);
            this._resource = _resource;
            RCLocalFileTrack.__innerSetMapping(this.getTrackId(), _resource);
        }
        /**
         * 建立 trackId 与宿主播放元素的映射关系
         * @param trackId
         * @param video
         */
        static __innerSetMapping(trackId, video) {
            const ids = this._mapping.get(video) || [];
            ids.push(trackId);
            this._mapping.set(video, ids);
        }
        static __innerRemoveMapping(trackId, video) {
            var _a, _b;
            const ids = (_a = this._mapping.get(video)) === null || _a === void 0 ? void 0 : _a.filter(id => id !== trackId);
            if (ids && ids.length > 0) {
                this._mapping.set(video, ids);
                return;
            }
            this._mapping.delete(video);
            video.pause();
            video.src = '';
            (_b = video.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(video);
        }
        destroy() {
            this.isAudioTrack() && this.mute();
            RCLocalFileTrack.__innerRemoveMapping(this.getTrackId(), this._resource);
            super.destroy();
        }
    }
    RCLocalFileTrack._mapping = new Map();
    class RCLocalFileVideoTrack extends RCLocalFileTrack {
        constructor(tag, userId, track, element) {
            super(tag, userId, 'video', track, element);
        }
    }
    class RCLocalFileAudioTrack extends RCLocalFileTrack {
        constructor(tag, userId, track, element) {
            super(tag, userId, 'audio', track, element);
        }
        _setLocalMuted(bool) {
            if (this._resource) {
                this._resource.muted = bool;
            }
            super._setLocalMuted(bool);
        }
        play() {
            // 自定义文件中的声音播放只需要修改 video 标签的 muted 属性
            this._setLocalMuted(false);
            return Promise.resolve({ code: exports.RCRTCCode.SUCCESS });
        }
    }
    class RCMicphoneAudioTrack extends RCLocalAudioTrack {
    }
    class RCCameraVideoTrack extends RCLocalVideoTrack {
    }
    class RCScreenVideoTrack extends RCLocalVideoTrack {
    }

    /**
     * 构建增量消息内容
     * @param objectname 消息名
     * @param uris 增量变更资源
     */
    const buildPlusMessage = (messageName, uris) => {
        return {
            name: messageName,
            // ignore 用于通知已实现全量 URI 的 RTCLib 忽略此消息
            content: JSON.stringify({ uris, ignore: true })
        };
    };
    /**
     * 构建预发布的全量资源变更消息
     * @param uris 全量资源数据
     */
    const buildTotalURIMessageContent = (uris) => {
        return JSON.stringify(uris);
    };
    /**
     * 验证 tag 是否有效
     * @param tag
     * @returns
     */
    const isValidTag = (tag) => {
        return /^[a-zA-Z\d-=]+$/g.test(tag);
    };
    /**
     * 页面地址有效性检测
     */
    const isValidLocation = location.protocol !== 'http:' || ['localhost', '127.0.0.1'].includes(location.hostname);
    const getValue = (value) => {
        if (value === undefined) {
            return 0;
        }
        if (engine.isNumber(value)) {
            return value;
        }
        const tmp = value;
        return tmp.exact || tmp.ideal || tmp.max || 0;
    };
    /**
     * 获取视频流的分辨率及帧率数据，若无法获取真实值，则返回 0
     * @param track
     */
    const getVideoTrackInfo = (track) => {
        const constraints = track.getConstraints();
        // firefox 平台不存在 getCapabilities 方法
        // const capabilities = track.getCapabilities()
        // const width = getValue(constraints.width) || getValue(capabilities.width)
        // const height = getValue(constraints.height) || getValue(capabilities.height)
        // const frameRate = getValue(constraints.frameRate) || getValue(capabilities.frameRate)
        return { width: getValue(constraints.width), height: getValue(constraints.height), frameRate: getValue(constraints.frameRate) };
    };
    /**
     * 取视频流动态码率
     * @param track
     * @returns
     */
    const getDynamicBitrate = (track) => {
        const { width, height, frameRate } = getVideoTrackInfo(track);
        // 计算动态码率以备给 answer 使用
        const config = getNearestResolution(width, height);
        const multiple = getBitrateMultiple(frameRate);
        return { min: config.minBitrate * multiple, max: config.maxBitrate * multiple };
    };
    /**
     * 获取资源唯一性标识
     * @param item
     */
    const getTrackId = (item) => {
        return [item.msid, item.mediaType].join('_');
    };
    /**
     * 解析 trackId 以获取资源信息
     * @param trackId
     */
    const parseTrackId = (trackId) => {
        const arr = trackId.split('_');
        const mediaType = parseInt(arr.pop());
        const tag = arr.pop();
        const userId = arr.join('_');
        return { mediaType, tag, userId };
    };
    const formatStreamId = (userId, tag) => [userId, tag].join('_');
    const deepCopyResources = (resources) => {
        return resources.map(item => Object.assign({}, item));
    };
    /**
     * 比对资源找出新增、状态变更及取消发布的资源
     * @param prevResources 原资源数据
     * @param resources 变更的全量资源
     */
    const diffPublishResources = (prevResources, resources) => {
        prevResources = prevResources.slice();
        const publishedList = [];
        const unpublishedList = [];
        const modifiedList = [];
        // 遍历新全量资源
        resources.forEach(item => {
            const resId = getTrackId(item);
            // 从当前房间数据中查找相同资源索引
            const index = prevResources.findIndex(value => getTrackId(value) === resId);
            if (index === -1) {
                // 新增资源
                publishedList.push(item);
                return;
            }
            // 资源变更
            const preItem = prevResources[index];
            if (preItem.uri !== item.uri) {
                // 资源已重新发布
                publishedList.push(item);
            }
            else if (preItem.state !== item.state) {
                // 资源状态变更
                modifiedList.push(item);
            }
            // 从原资源列表中移除已变更资源，剩余为取消发布资源
            prevResources.splice(index, 1);
        });
        unpublishedList.push(...prevResources);
        return { publishedList, unpublishedList, modifiedList };
    };
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
    const getUUID$1 = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    /* 获取 22 位的 UUID */
    const getUUID22 = () => {
        let uuid = getUUID$1();
        uuid = uuid.replace(/-/g, '') + '0';
        uuid = parseInt(uuid, 16);
        uuid = string10to64(uuid);
        if (uuid.length > 22) {
            uuid = uuid.slice(0, 22);
        }
        return uuid;
    };
    /**
     * 转化 RCResolution 枚举值为分辨率宽高
     * @param resolution
     * @returns
     */
    const transResolution = (resolution) => {
        const [width, height] = resolution.split('_').map(item => {
            return parseInt(item.replace(/[^\d]/g, ''));
        });
        return { width, height };
    };
    /**
     * 判断枚举值有效性
     * @param resolution
     * @returns
     */
    const isValidResolution = (resolution) => {
        return !!exports.RCResolution[resolution];
    };
    /**
     * 判断帧率枚举值有效性
     * @param fps
     * @returns
     */
    const isValidFPS = (fps) => {
        return !!exports.RCFrameRate[fps];
    };
    /**
     * 获取枚举值对应的帧率
     * @param fps
     * @returns
     */
    const transFrameRate = (fps) => {
        return parseInt(fps.replace('FPS_', ''));
    };
    const browserInfo = (() => {
        const { browser, version, supportsUnifiedPlan } = adapter.browserDetails;
        return {
            browser,
            version: version,
            // 非明确显示不支持 unified-plan 的浏览器，默认为支持 unified-plan
            supportsUnifiedPlan: supportsUnifiedPlan !== false
        };
    })();
    /**
     * 验证浏览器是否支持创建自定义文件流
     * @returns
     */
    function ifSupportLocalFileTrack() {
        return 'captureStream' in HTMLMediaElement.prototype || 'mozCaptureStream' in HTMLMediaElement.prototype;
    }
    /**
     * 验证浏览器是否支持屏幕共享
     * @returns
     */
    function ifSupportScreenShare() {
        return 'mediaDevices' in navigator && 'getDisplayMedia' in navigator.mediaDevices;
    }
    /**
     * 检查参数是否为 null
    */
    const isNull = (val) => {
        return Object.prototype.toString.call(val) === '[object Null]';
    };
    /**
     * 公有云连接私有云 SDK 为非法连接
     */
    const isIllegalConnection = (navi) => {
        return navi.type === 1;
    };
    /**
     * 获取将要发布的 track 数量
     * 需要发布小流的算两个 track
     */
    const calcTracksNum = (tracks) => {
        let length = 0;
        tracks.forEach(item => {
            if (item instanceof RCLocalTrack) {
                length++;
            }
            else {
                if (item.pubTiny && item.track.isVideoTrack()) {
                    length += 2;
                }
                else {
                    length++;
                }
            }
        });
        return length;
    };

    /**
     * RTC 消息类型常量
     * @private
     */
    var RCRTCMessageType;
    (function (RCRTCMessageType) {
        /**
         * 增量资源发布消息
         * @deprecated
         */
        RCRTCMessageType["PUBLISH"] = "RCRTC:PublishResource";
        /**
         * 增量资源取消发布消息
         * @deprecated
         */
        RCRTCMessageType["UNPUBLISH"] = "RCRTC:UnpublishResource";
        /**
         * 增量资源状态变更消息
         * @deprecated
         */
        RCRTCMessageType["MODIFY"] = "RCRTC:ModifyResource";
        /**
         * 全量资源变更消息
         */
        RCRTCMessageType["TOTAL_CONTENT_RESOURCE"] = "RCRTC:TotalContentResources";
        /**
         * 房间人员变更
         */
        RCRTCMessageType["STATE"] = "RCRTC:state";
        /**
         * 房间属性变更
         */
        RCRTCMessageType["ROOM_NOTIFY"] = "RCRTC:RoomNtf";
        /**
         * 房间用户属性变更
         */
        RCRTCMessageType["USER_NOTIFY"] = "RCRTC:UserNtf";
        /**
         * 被服务踢出房间
         */
        RCRTCMessageType["KICK"] = "RCRTC:kick";
    })(RCRTCMessageType || (RCRTCMessageType = {}));

    exports.RCRTCPingResult = void 0;
    (function (RCRTCPingResult) {
        RCRTCPingResult["SUCCESS"] = "Success";
        RCRTCPingResult["FAIL"] = "Fail";
    })(exports.RCRTCPingResult || (exports.RCRTCPingResult = {}));

    /**
     * rtcping 间隔
     */
    const PING_GAP = 10 * 1000;
    /**
     * rtcping 超时时间
     */
    const PING_TIMEOUT = 10 * 1000;
    /**
     * RTCPing 类，累计 1 分钟未能正确收到 Ping 值则认为 ping 失败
     */
    class Pinger {
        constructor(_roomId, _roomMode, _context, _gap = PING_GAP) {
            this._roomId = _roomId;
            this._roomMode = _roomMode;
            this._context = _context;
            this._gap = _gap;
            /**
             * 记录最近一次成功的 Ping 时间戳
             */
            this._latestTimestamp = Date.now();
            this._timer = null;
        }
        /**
         * 启动 Ping
         */
        start() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this._timer) {
                    return;
                }
                // logger.debug('rtcping timer start ->')
                this._timer = setInterval(this._loop.bind(this), this._gap);
            });
        }
        _loop() {
            var _a, _b, _c;
            return __awaiter(this, void 0, void 0, function* () {
                // logger.debug('rtcping send ->')
                const code = yield new Promise(resolve => {
                    this._context.rtcPing(this._roomId, this._roomMode)
                        .then(resolve)
                        .catch(error => {
                        logger.error(`rtcping receive unknown error -> ${error}`);
                        resolve(engine.ErrorCode.UNKNOWN);
                    });
                    setTimeout(resolve, PING_TIMEOUT, engine.ErrorCode.TIMEOUT);
                });
                const now = Date.now();
                // ping 成功，记录时间戳，延时递归
                if (code === engine.ErrorCode.SUCCESS) {
                    // logger.debug('rtcping success <-')
                    this._latestTimestamp = now;
                    (_a = this.onPingResult) === null || _a === void 0 ? void 0 : _a.call(this, exports.RCRTCPingResult.SUCCESS);
                    return;
                }
                (_b = this.onPingResult) === null || _b === void 0 ? void 0 : _b.call(this, exports.RCRTCPingResult.FAIL);
                logger.warn(`rtcping failed -> code: ${code}`);
                // 超出 1 分钟未成功进行 rtcping 操作，或用户已不存在于房间内时，通知客户离线
                if (code === 40003 || now - this._latestTimestamp > 60 * 1000) {
                    this.stop();
                    (_c = this.onFailed) === null || _c === void 0 ? void 0 : _c.call(this, code === 40003);
                }
            });
        }
        stop() {
            if (this._timer) {
                // logger.warn('rtcping timer stop <-')
                clearInterval(this._timer);
                this._timer = null;
            }
        }
    }

    /**
     * 资源大小流标识枚举
     */
    var RCStreamType;
    (function (RCStreamType) {
        /**
         * 普通流（大流）
         */
        RCStreamType[RCStreamType["NORMAL"] = 1] = "NORMAL";
        /**
         * 小流
         */
        RCStreamType[RCStreamType["TINY"] = 2] = "TINY";
    })(RCStreamType || (RCStreamType = {}));

    const STAT_NONE = -1;

    const getBitrate = (dTime, dBytes) => {
        // 码率计算：字节数差比时间差，单位 kbps
        // const bitrate = Math.round(dBytes * 8 / 1000 / (dTime / 1000))
        const bitrate = Math.round(dBytes * 8 / dTime);
        return bitrate;
    };
    /**
     * 限制浮点数小数位的有效位数
     * @param value
     * @param fractionDigits 小数点后保留的有效数字位数
     */
    const fixed = (value, fractionDigits = 2) => {
        // return parseFloat(value.toFixed(fractionDigits))
        const rate = 10 ** fractionDigits;
        return Math.round(value * rate) / rate;
    };
    /**
     * 处理音量 * 100，并向下取整
     */
    const handleAudioLevel = (audioLevel, factor = 2) => {
        if (audioLevel > 1) {
            audioLevel = audioLevel / 32767;
        }
        const rate = 10 ** factor;
        return Math.floor(audioLevel * rate);
    };
    /**
     * 计算丢包率
     * @param packetsLost 当前统计丢包总数
     * @param packets 当前统计总包数
     * @param prePacketsLost 前次统计丢包总数
     * @param prePackets 前次统计总包数
     */
    const getPacketsLostRate = (packetsLost, packets, prePacketsLost, prePackets) => {
        // 总包数为 0 时，无丢包率
        if (packets === 0) {
            return 0;
        }
        // 没有前次统计记录，当次的丢包可直接计算丢包率
        if (!prePacketsLost || !prePackets) {
            return fixed(packetsLost / packets, 3);
        }
        const dPackets = packets - prePackets;
        if (dPackets === 0) {
            // 总包数无变更，不存在丢包概念
            return 0;
        }
        const dPacketsLost = packetsLost - prePacketsLost;
        /**
         * 每秒发送总码率(bitrateSend)、每秒接收总码率(bitrateRecv)、丢包率(packetsLostRate)计算依赖本地存储的前一次数据
         * 但订阅关系发生变化时，存在 bytesSent 从 0 开始算的情况，会导致计算出的 bitrateSend 为负数（此时丢包数没有从 0 开始算）
         * 鉴于存在一系列超出预期范围的情况，bitrateSend、bitrateRecv、packetsLostRate 为负数时，给业务层抛 0
         */
        if (dPacketsLost < 0 || dPackets < 0) {
            return 0;
        }
        return fixed(dPacketsLost / dPackets, 3);
    };
    const senderHasRemoteData = (sender) => {
        const { jitter, rtt, packetsLostRate } = sender;
        if (isNull(jitter) && isNull(rtt) && packetsLostRate === 0) {
            return false;
        }
        return true;
    };

    /**
     * 媒体资源类型
     */
    exports.RCMediaType = void 0;
    (function (RCMediaType) {
        /**
         * 音频流
         */
        RCMediaType[RCMediaType["AUDIO_ONLY"] = 0] = "AUDIO_ONLY";
        /**
         * 视频流
         */
        RCMediaType[RCMediaType["VIDEO_ONLY"] = 1] = "VIDEO_ONLY";
        /**
         * 音视频混合流，只在 web 端存在混合流的情况
         */
        RCMediaType[RCMediaType["AUDIO_VIDEO"] = 2] = "AUDIO_VIDEO";
    })(exports.RCMediaType || (exports.RCMediaType = {}));

    class AbstractStatParser {
        constructor(_rtcPeerConn, _sdpSemantics) {
            this._rtcPeerConn = _rtcPeerConn;
            this._sdpSemantics = _sdpSemantics;
            /**
             * 最近的上行发送包数据统计
             */
            this._latestPacketsSent = {};
            /**
             * 最近的上行发送字节数统计
             */
            this._latestBytesSent = {};
            /**
             * 最近的下行接收字节数统计
             */
            this._latestBytesRecv = {};
            /**
             * 最近的下行接收包数据统计
             */
            this._latestPacketsRecv = {};
        }
        /**
         * 更新上行码率存储，返回计算出的码率
         * @param resourceId
         * @param bytesSent 本次发送的字节数
         * @param timestamp
         * @returns bitrate
         */
        updateBytesSent(resourceId, bytesSent, timestamp) {
            if (this._latestBytesSent[resourceId] && bytesSent < this._latestBytesSent[resourceId].bytesSent) {
                this.clearLatestpacketsSent([resourceId]);
            }
            let dBytes;
            let dTime;
            if (!this._latestBytesSent[resourceId]) {
                dBytes = bytesSent;
                dTime = 1000;
                // 更新记录
                this._latestBytesSent[resourceId] = { bytesSent, timestamp };
            }
            else {
                const { bytesSent: preBytesSent, timestamp: preTimestamp } = this._latestBytesSent[resourceId];
                dBytes = bytesSent - preBytesSent;
                dTime = timestamp - preTimestamp;
                // 更新记录
                this._latestBytesSent[resourceId] = {
                    bytesSent,
                    timestamp
                };
            }
            return getBitrate(dTime, dBytes);
        }
        /**
         * 更新下行码率存储，返回计算出的码率
         * @param resourceId
         * @param bytesRecv
         * @param timestamp
         * @returns bitrate
         */
        updateBytesRecv(resourceId, bytesRecv, timestamp) {
            if (this._latestBytesRecv[resourceId] && bytesRecv < this._latestBytesRecv[resourceId].bytesRecv) {
                this.clearLatestPacketsRecv([resourceId]);
            }
            let dBytes;
            let dTime;
            if (!this._latestBytesRecv[resourceId]) {
                dBytes = bytesRecv;
                dTime = 1000;
                // 更新记录
                this._latestBytesRecv[resourceId] = { bytesRecv, timestamp };
            }
            else {
                const { bytesRecv: preBytesRecv, timestamp: preTimestamp } = this._latestBytesRecv[resourceId];
                dBytes = bytesRecv - preBytesRecv;
                dTime = timestamp - preTimestamp;
                // 更新记录
                this._latestBytesRecv[resourceId] = {
                    bytesRecv,
                    timestamp
                };
            }
            return getBitrate(dTime, dBytes);
        }
        /**
         * 更新上行丢包总数，返回计算出的丢包率
         * 计算丢包率
         * 上行数据统计中，packageLost 的统计具有延时性
         * 会导致瞬时的 packetsLost - prePacketsLost 值大于 packetsSent - prePacketsSent，从而丢包率可能大于 1
         * 因此此处计算只在 packetsLost - prePacketsLost !== 0 时计算丢包率，其他时间丢包为 0
         * packetsSent 只在 packetsLost 有变化时更新
         */
        updateSenderPacketsLost(resourceId, packetsLost, packetsSent) {
            let packetsLostRate;
            // 存在 this._latestPacketsSent[resourceId] 中只包含 crtPacketsSent 的情况
            if (!Object.prototype.hasOwnProperty.call(this._latestPacketsSent[resourceId], 'packetsSent')) {
                packetsLostRate = getPacketsLostRate(packetsLost, packetsSent);
                // 更新记录
                this._latestPacketsSent[resourceId].packetsLost = packetsLost;
                this._latestPacketsSent[resourceId].packetsSent = packetsSent;
            }
            else {
                const { packetsLost: prePacketsLost, packetsSent: prePacketsSent } = this._latestPacketsSent[resourceId];
                packetsLostRate = getPacketsLostRate(packetsLost, packetsSent, prePacketsLost, prePacketsSent);
                // 更新记录
                this._latestPacketsSent[resourceId].packetsLost = packetsLost;
                this._latestPacketsSent[resourceId].packetsSent = prePacketsLost === packetsLost ? prePacketsSent : packetsSent;
            }
            return packetsLostRate;
        }
        /**
         * 更新下行丢包总数，返回计算出的丢包率
         */
        updateReceiverPacketsLost(resourceId, packetsLost, packetsReceived) {
            let packetsLostRate;
            if (!this._latestPacketsRecv[resourceId]) {
                packetsLostRate = getPacketsLostRate(packetsLost, packetsReceived);
            }
            else {
                const { packetsLost: prePacketsLost, packetsRecv: prePacketsRecv } = this._latestPacketsRecv[resourceId];
                packetsLostRate = getPacketsLostRate(packetsLost, packetsReceived + packetsLost, prePacketsLost, prePacketsRecv + prePacketsLost);
            }
            this._latestPacketsRecv[resourceId] = {
                packetsLost,
                packetsRecv: packetsReceived
            };
            return packetsLostRate;
        }
        /**
         * 取消发布后，需把 _latestPacketsSent 中 key 为 resourceId 存储的数据清除掉
         */
        clearLatestpacketsSent(resourceIds) {
            resourceIds.forEach((resourceId) => {
                const mediaType = parseInt(resourceId.split('_').pop());
                if (mediaType === exports.RCMediaType.VIDEO_ONLY) {
                    const tinyResourceId = `${resourceId}_tiny`;
                    delete this._latestPacketsSent[tinyResourceId];
                    delete this._latestBytesSent[tinyResourceId];
                }
                delete this._latestPacketsSent[resourceId];
                delete this._latestBytesSent[resourceId];
            });
        }
        /**
         * 取消订阅后，需把 _latestPacketsRecv 中 key 为 resourceId 存储的数据清除掉
         */
        clearLatestPacketsRecv(resourceIds) {
            resourceIds.forEach((resourceId) => {
                delete this._latestPacketsRecv[resourceId];
                delete this._latestBytesRecv[resourceId];
            });
        }
        parseRTCStatsReport(reports) {
            const keys = reports.keys();
            const stats = {};
            let temp = keys.next();
            while (!temp.done) {
                const key = temp.value;
                const value = reports.get(key);
                if (!/^RTCCodec_/.test(key)) {
                    stats[key] = value;
                }
                temp = keys.next();
            }
            return stats;
        }
        formatRCRTCStateReport(stats) {
            const reports = {
                senders: [],
                receivers: []
            };
            return reports;
        }
        getAudioLevelList(stats) {
            const audioLevelList = [];
            return audioLevelList;
        }
        /**
         * 从 offer 和 answer 的 sdp 中获取 ssrc 对应的 msid
         * @param statInfo outbound 和 inbound 对应值
         * @returns resourceId
         */
        getResourceIdByParseSdp(statInfo) {
            var _a, _b;
            const ssrc = statInfo.ssrc;
            const kind = statInfo.kind || statInfo.mediaType;
            const offer = (_a = this._rtcPeerConn.currentLocalDescription) === null || _a === void 0 ? void 0 : _a.sdp;
            const answer = (_b = this._rtcPeerConn.currentRemoteDescription) === null || _b === void 0 ? void 0 : _b.sdp;
            let rule;
            if (this._sdpSemantics === 'unified-plan') {
                rule = new RegExp('a=msid:(.*?) ');
            }
            else {
                rule = new RegExp(`a=ssrc:${ssrc} msid:(.*?) `);
            }
            const offerMArr = offer === null || offer === void 0 ? void 0 : offer.split('\r\nm=');
            const selectOfferM = offerMArr === null || offerMArr === void 0 ? void 0 : offerMArr.filter(item => { return item.includes(`a=ssrc:${ssrc}`); })[0];
            const matchOffer = selectOfferM === null || selectOfferM === void 0 ? void 0 : selectOfferM.match(rule);
            let msid = matchOffer ? matchOffer[1] : '';
            if (msid) {
                return `${msid}_${kind === 'video' ? 1 : 0}`;
            }
            const answerMArr = answer === null || answer === void 0 ? void 0 : answer.split('\r\nm=');
            const selectAnswerM = answerMArr === null || answerMArr === void 0 ? void 0 : answerMArr.filter(item => { return item.includes(`a=ssrc:${ssrc}`); })[0];
            const matchAnswer = selectAnswerM === null || selectAnswerM === void 0 ? void 0 : selectAnswerM.match(rule);
            msid = matchAnswer ? matchAnswer[1] : '';
            return `${msid}_${kind === 'video' ? 1 : 0}`;
        }
        /**
         * 从 offer sdp 中查找 ssrc 对应的通道是否可用
         * @param outboundInfo
         */
        isValidSender(outboundInfo) {
            var _a;
            const offer = (_a = this._rtcPeerConn.currentLocalDescription) === null || _a === void 0 ? void 0 : _a.sdp;
            const { ssrc } = outboundInfo;
            const valid = offer === null || offer === void 0 ? void 0 : offer.split('\r\nm=').some(item => (item.includes(ssrc) && item.includes('a=inactive')));
            return !valid;
        }
        /**
         * 从 answer sdp 中查找 ssrc 对应的通道是否可用
         * @param inboundInfo
         */
        isValidReceiver(inboundInfo) {
            var _a;
            const answer = (_a = this._rtcPeerConn.currentRemoteDescription) === null || _a === void 0 ? void 0 : _a.sdp;
            const { ssrc } = inboundInfo;
            const valid = answer === null || answer === void 0 ? void 0 : answer.split('\r\nm=').some(item => (item.includes(ssrc) && item.includes('a=inactive')));
            return !valid;
        }
    }

    /**
     * chrome 73 无 type 为 remote-inbound-rtp 的数据，上行拿不到 jetter、rtt、packetsLost 数据
     */
    class RTCReportParser$2 extends AbstractStatParser {
        formatRCRTCStateReport(stats) {
            const reports = {
                senders: [],
                receivers: []
            };
            // 当次报告创建时的时间戳
            const timestamp = Math.floor(stats.RTCPeerConnection.timestamp);
            reports.timestamp = timestamp;
            const keys = Object.keys(stats);
            // 总丢包数
            let totalPacketsLost = 0;
            // 上行码率总和
            let bitrateSend = 0;
            // 解析上行媒体流数据: RTCOutboundRTPVideoStream | RTCOutboundRTPAudioStream
            const outboundKeys = keys.filter(key => /^RTCOutboundRTP(Video|Audio)Stream_/.test(key));
            outboundKeys.forEach(key => {
                // 本端输出数据
                const outboundInfo = stats[key];
                if (this._sdpSemantics === 'unified-plan' && !this.isValidSender(outboundInfo)) {
                    return;
                }
                const { id, kind, transportId, mediaSourceId, remoteId, packetsSent, bytesSent, trackId, encoderImplementation, pliCount, nackCount, firCount } = outboundInfo;
                if (!trackId) {
                    return;
                }
                // outboundInfo 中取不到 frameWidth, frameHeight, frameRate 时，
                // chrome 73、80 可从 type 为 media-source 中取 frameWidth, frameHeight
                // chrome 80 从 type 为 media-source 中取 frameRate(chrome 73 无 mediaSourceId)
                let { framesPerSecond: frameRate, frameWidth, frameHeight } = outboundInfo;
                if (kind === 'video' && !frameWidth && !frameHeight && !frameRate) {
                    frameWidth = stats[trackId].frameWidth;
                    frameHeight = stats[trackId].frameHeight;
                    frameRate = mediaSourceId ? stats[mediaSourceId].framesPerSecond : null;
                }
                // 远端接收数据
                const remoteStreamInfo = stats[remoteId];
                let jitter = null;
                let rtt = null;
                let packetsLost = 0;
                // 远端流有可能尚未建立
                if (remoteStreamInfo) {
                    jitter = remoteStreamInfo.jitter;
                    rtt = remoteStreamInfo.roundTripTime;
                    packetsLost = remoteStreamInfo.packetsLost;
                }
                totalPacketsLost += packetsLost;
                const resourceId = this.getResourceIdByParseSdp(outboundInfo);
                const audioLevel = mediaSourceId ? stats[mediaSourceId].audioLevel : stats[trackId].audioLevel;
                let packetsLostRate = null;
                !this._latestPacketsSent[resourceId] && (this._latestPacketsSent[resourceId] = {});
                if (remoteStreamInfo) {
                    packetsLostRate = this.updateSenderPacketsLost(resourceId, packetsLost, packetsSent);
                }
                else {
                    // 无 remoteId 时，需记录 packetsSent
                    this._latestPacketsSent[resourceId].crtPacketsSent = packetsSent;
                }
                // 计算码率
                let bitrate = this.updateBytesSent(resourceId, bytesSent, timestamp);
                if (bitrate < 0) {
                    bitrate = 0;
                }
                // 总和累加
                bitrateSend += bitrate;
                reports.senders.push({
                    id,
                    trackId: resourceId,
                    kind,
                    packetsLostRate,
                    remoteResource: false,
                    audioLevel: (audioLevel || audioLevel === 0) ? handleAudioLevel(audioLevel) : null,
                    frameWidth,
                    frameHeight,
                    frameRate,
                    bitrate,
                    jitter: jitter ? Math.round(jitter * 1000) : jitter,
                    rtt,
                    encoderImplementation,
                    pliCount,
                    nackCount,
                    googFirsSent: STAT_NONE,
                    samplingRate: STAT_NONE,
                    googRenderDelayMs: STAT_NONE,
                    trackState: STAT_NONE
                });
            });
            /**
             * outbound-rtp 存在无 remoteId 的情况，导致取不到有效的 jitter、rtt、packetsLost，
             * 可拿到 remote-inbound-rtp 的 localId，补充 senders 中的 jitter、rtt、packetsLost 数据，重新计算丢包率
            */
            const remoteInboundKeys = keys.filter(key => /RTCRemoteInboundRtp(Video|Audio)Stream_/.test(key));
            remoteInboundKeys.forEach(key => {
                const { localId, jitter, roundTripTime: rtt, packetsLost } = stats[key];
                const sender = reports.senders.filter((item) => {
                    return item.id === localId;
                })[0];
                if (sender && !senderHasRemoteData(sender)) {
                    const resourceId = this.getResourceIdByParseSdp(stats[sender.id]);
                    sender.jitter = Math.round(jitter * 1000);
                    sender.rtt = rtt;
                    const packetsSent = this._latestPacketsSent[resourceId].crtPacketsSent;
                    sender.packetsLostRate = this.updateSenderPacketsLost(resourceId, packetsLost, packetsSent);
                }
            });
            // 下行码率总和
            let bitrateRecv = 0;
            // 下行流数据解析
            const inboundKeys = keys.filter(key => /^RTCInboundRTP(Video|Audio)Stream_/.test(key));
            inboundKeys.forEach(key => {
                const inboundInfo = stats[key];
                if (this._sdpSemantics === 'unified-plan' && !this.isValidReceiver(inboundInfo)) {
                    return;
                }
                const { trackId, packetsLost, packetsReceived, jitter, bytesReceived, framesPerSecond: frameRate, kind, codecImplementationName, nackCount, pliCount } = inboundInfo;
                if (!trackId) {
                    return;
                }
                // inboundInfo 中取不到 frameWidth, frameHeight, audioLevel 时，需从 type 为 track 中取
                let { frameWidth, frameHeight, audioLevel } = inboundInfo;
                if (kind === 'video') {
                    if (!frameWidth && !frameHeight) {
                        frameWidth = stats[trackId].frameWidth;
                        frameHeight = stats[trackId].frameHeight;
                    }
                }
                else if (!audioLevel) {
                    audioLevel = stats[trackId].audioLevel;
                }
                totalPacketsLost += packetsLost;
                const resourceId = this.getResourceIdByParseSdp(inboundInfo);
                const packetsLostRate = this.updateReceiverPacketsLost(resourceId, packetsLost, packetsReceived);
                let bitrate = this.updateBytesRecv(resourceId, bytesReceived, timestamp);
                if (bitrate < 0) {
                    bitrate = 0;
                }
                bitrateRecv += bitrate;
                reports.receivers.push({
                    trackId: resourceId,
                    kind,
                    packetsLostRate,
                    remoteResource: true,
                    audioLevel: (audioLevel || audioLevel === 0) ? handleAudioLevel(audioLevel) : null,
                    frameWidth,
                    frameHeight,
                    frameRate,
                    bitrate,
                    jitter: jitter ? Math.round(jitter * 1000) : 0,
                    codecImplementationName,
                    nackCount,
                    pliCount,
                    rtt: null,
                    samplingRate: STAT_NONE,
                    googFirsReceived: STAT_NONE,
                    googRenderDelayMs: STAT_NONE,
                    trackState: STAT_NONE
                });
            });
            // 解析本端/远端 IP、Port 数据
            const transportKey = keys.filter(key => /^RTCTransport_/.test(key))[0];
            if (transportKey) {
                const rtcTransport = stats[transportKey];
                const { selectedCandidatePairId } = rtcTransport;
                if (selectedCandidatePairId) {
                    const iceCandidatePair = stats[selectedCandidatePairId];
                    const { availableOutgoingBitrate, 
                    // 下行带宽只在有下行资源时有值
                    availableIncomingBitrate, currentRoundTripTime: rtt, localCandidateId, remoteCandidateId } = iceCandidatePair;
                    const localCandidate = stats[localCandidateId];
                    const { ip: IP, port, networkType } = localCandidate;
                    const remoteCandidate = stats[remoteCandidateId];
                    const { ip: remoteIP, port: remotePort, protocol } = remoteCandidate;
                    reports.iceCandidatePair = {
                        IP,
                        port,
                        networkType,
                        remoteIP,
                        remotePort,
                        protocol,
                        bitrateRecv,
                        bitrateSend,
                        rtt: rtt * 1000,
                        availableOutgoingBitrate,
                        availableIncomingBitrate,
                        totalPacketsLost
                    };
                    // 给下行 rtt 赋值
                    reports.receivers.forEach(item => {
                        item.rtt = rtt;
                    });
                }
            }
            return reports;
        }
        getAudioLevelList(stats) {
            const audioLevelList = [];
            const keys = Object.keys(stats);
            // 解析上行媒体流数据: RTCOutboundRTPVideoStream | RTCOutboundRTPAudioStream
            const outboundKeys = keys.filter(key => /^RTCOutboundRTPAudioStream_/.test(key));
            outboundKeys.forEach(key => {
                var _a;
                // 本端输出数据
                const outboundInfo = stats[key];
                if (this._sdpSemantics === 'unified-plan' && !this.isValidSender(outboundInfo)) {
                    return;
                }
                const { mediaSourceId, trackId } = outboundInfo;
                const resourceId = this.getResourceIdByParseSdp(outboundInfo);
                const audioLevel = mediaSourceId && stats[mediaSourceId] ? stats[mediaSourceId].audioLevel : (((_a = stats[trackId]) === null || _a === void 0 ? void 0 : _a.audioLevel) || null);
                audioLevelList.push({
                    trackId: resourceId,
                    audioLevel: (audioLevel || audioLevel === 0) ? handleAudioLevel(audioLevel) : null
                });
            });
            // 下行流数据解析
            const inboundKeys = keys.filter(key => /^RTCInboundRTPAudioStream_/.test(key));
            inboundKeys.forEach(key => {
                const inboundInfo = stats[key];
                if (this._sdpSemantics === 'unified-plan' && !this.isValidReceiver(inboundInfo)) {
                    return;
                }
                const { trackId } = inboundInfo;
                // inboundInfo 中取不到 audioLevel 时，需从 type 为 track 中取
                const { audioLevel } = inboundInfo || stats[trackId];
                const resourceId = this.getResourceIdByParseSdp(inboundInfo);
                audioLevelList.push({
                    trackId: resourceId,
                    audioLevel: (audioLevel || audioLevel === 0) ? handleAudioLevel(audioLevel) : null
                });
            });
            return audioLevelList;
        }
    }

    /**
     * Firefox stats
     * 取不到分辨率、音量
     * candidate 无本地网络类型、往返时延、可用上行带宽、可用下行带宽
     */
    class RTCReportParser$1 extends AbstractStatParser {
        formatRCRTCStateReport(stats) {
            const timestamp = +new Date();
            const reports = {
                senders: [],
                receivers: [],
                timestamp
            };
            // 总丢包数
            let totalPacketsLost = 0;
            // 上行码率总和
            let bitrateSend = 0;
            // 下行码率总和
            let bitrateRecv = 0;
            for (const key in stats) {
                const value = stats[key];
                const type = value.type;
                /**
                 * 上行资源解析
                 */
                if (type === 'outbound-rtp') {
                    if (this._sdpSemantics === 'unified-plan' && !this.isValidSender(value)) {
                        continue;
                    }
                    const { id, kind, bytesSent, packetsSent, bitrateMean: bitrate, framerateMean: frameRate, nackCount, pliCount, remoteId } = value;
                    const { jitter, roundTripTime, packetsLost } = remoteId ? stats[remoteId] : {
                        jitter: null,
                        roundTripTime: null,
                        packetsLost: 0
                    };
                    const resourceId = this.getResourceIdByParseSdp(value);
                    totalPacketsLost += packetsLost;
                    let packetsLostRate = null;
                    !this._latestPacketsSent[resourceId] && (this._latestPacketsSent[resourceId] = {});
                    if (remoteId) {
                        packetsLostRate = this.updateSenderPacketsLost(resourceId, packetsLost, packetsSent);
                    }
                    else {
                        // 无 remoteId 时，需记录 packetsSent
                        this._latestPacketsSent[resourceId].crtPacketsSent = packetsSent;
                    }
                    let calcBitrate = 0;
                    if (kind === 'video') {
                        bitrate && (calcBitrate = Math.floor(bitrate / 1000));
                    }
                    else {
                        // 音频无码率值，需客户端计算
                        calcBitrate = this.updateBytesSent(resourceId, bytesSent, timestamp);
                    }
                    calcBitrate < 0 && (calcBitrate = 0);
                    // 总和累加
                    bitrateSend += calcBitrate;
                    reports.senders.push({
                        trackId: resourceId,
                        kind,
                        packetsLostRate,
                        remoteResource: false,
                        audioLevel: null,
                        frameWidth: null,
                        frameHeight: null,
                        frameRate: Math.floor(frameRate),
                        bitrate: calcBitrate,
                        jitter: jitter ? Math.round(jitter * 1000) : null,
                        rtt: roundTripTime,
                        encoderImplementation: null,
                        pliCount: pliCount,
                        nackCount: nackCount,
                        googFirsSent: STAT_NONE,
                        samplingRate: STAT_NONE,
                        googRenderDelayMs: STAT_NONE,
                        trackState: STAT_NONE
                    });
                }
                /**
                 * outbound-rtp 存在无 remoteId 的情况，导致取不到有效的 jitter、rtt、packetsLost，
                 * 可拿到 remote-inbound-rtp 的 localId，补充 senders 中的 jitter、rtt、packetsLost 数据，重新计算丢包率
                 */
                if (type === 'remote-inbound-rtp') {
                    const { localId } = value;
                    const resourceId = this.getResourceIdByParseSdp(stats[localId]);
                    const sender = reports.senders.filter((item) => {
                        return item.trackId === resourceId;
                    })[0];
                    if (sender && senderHasRemoteData(sender)) {
                        sender.jitter = Math.round(value.jitter * 1000);
                        sender.rtt = value.rtt;
                        sender.packetsLostRate = this.updateSenderPacketsLost(resourceId, value.packetsLost, this._latestPacketsSent[resourceId].crtPacketsSent);
                    }
                }
                /**
                 * 下行流数据解析
                 */
                if (type === 'inbound-rtp') {
                    if (this._sdpSemantics === 'unified-plan' && !this.isValidReceiver(value)) {
                        continue;
                    }
                    const { id, packetsLost, bytesReceived, packetsReceived, jitter, framerateMean: frameRate, kind, bitrateMean: bitrate, nackCount, pliCount } = value;
                    const resourceId = this.getResourceIdByParseSdp(value);
                    totalPacketsLost += packetsLost;
                    const packetsLostRate = this.updateReceiverPacketsLost(resourceId, packetsLost, packetsReceived);
                    let calcBitrate = 0;
                    if (kind === 'video') {
                        bitrate && (calcBitrate = Math.floor(bitrate / 1000));
                    }
                    else {
                        calcBitrate = this.updateBytesRecv(resourceId, bytesReceived, timestamp);
                    }
                    calcBitrate < 0 && (calcBitrate = 0);
                    bitrateRecv += calcBitrate;
                    reports.receivers.push({
                        trackId: resourceId,
                        kind,
                        packetsLostRate,
                        remoteResource: true,
                        audioLevel: null,
                        frameWidth: null,
                        frameHeight: null,
                        frameRate: Math.floor(frameRate),
                        bitrate: calcBitrate,
                        jitter: jitter ? Math.round(jitter * 1000) : null,
                        codecImplementationName: null,
                        nackCount,
                        pliCount,
                        rtt: null,
                        samplingRate: STAT_NONE,
                        googFirsReceived: STAT_NONE,
                        googRenderDelayMs: STAT_NONE,
                        trackState: STAT_NONE
                    });
                }
                /**
                 * 解析本端/远端 IP、Port 数据
                 */
                if (type === 'candidate-pair' && value.state === 'succeeded') {
                    const localCandidate = stats[value.localCandidateId];
                    const { address: IP, port } = localCandidate;
                    const remoteCandidate = stats[value.remoteCandidateId];
                    const { address: remoteIP, port: remotePort, protocol } = remoteCandidate;
                    reports.iceCandidatePair = {
                        IP,
                        port,
                        networkType: null,
                        remoteIP,
                        remotePort,
                        protocol,
                        bitrateRecv,
                        bitrateSend,
                        rtt: null,
                        availableOutgoingBitrate: null,
                        availableIncomingBitrate: null,
                        totalPacketsLost
                    };
                }
            }
            reports.iceCandidatePair && (reports.iceCandidatePair.bitrateSend = bitrateSend);
            reports.iceCandidatePair && (reports.iceCandidatePair.bitrateRecv = bitrateRecv);
            return reports;
        }
        getAudioLevelList(stats) {
            const audioLevelList = [];
            for (const key in stats) {
                const value = stats[key];
                const type = value.type;
                /**
                 * 上行资源解析
                 */
                if (type === 'outbound-rtp') {
                    if (this._sdpSemantics === 'unified-plan' && !this.isValidSender(value)) {
                        continue;
                    }
                    const { kind } = value;
                    if (kind === 'video') {
                        continue;
                    }
                    const resourceId = this.getResourceIdByParseSdp(value);
                    audioLevelList.push({
                        trackId: resourceId,
                        audioLevel: null
                    });
                }
                /**
                 * 下行流数据解析
                 */
                if (type === 'inbound-rtp') {
                    if (this._sdpSemantics === 'unified-plan' && !this.isValidReceiver(value)) {
                        continue;
                    }
                    const { kind } = value;
                    if (kind === 'video') {
                        continue;
                    }
                    const resourceId = this.getResourceIdByParseSdp(value);
                    audioLevelList.push({
                        trackId: resourceId,
                        audioLevel: null
                    });
                }
            }
            return audioLevelList;
        }
    }

    /**
     * Safari stats
     * 取不到上行丢包数，无法计算上行丢包率，无上行网络抖动
     * 无帧率
     * candidate 无本地网络类型、本端地址
     */
    class RTCReportParser extends AbstractStatParser {
        formatRCRTCStateReport(stats) {
            const reports = {
                senders: [],
                receivers: []
            };
            // 当次报告创建时的时间戳
            const timestamp = Math.floor(stats.RTCPeerConnection.timestamp);
            reports.timestamp = timestamp;
            const keys = Object.keys(stats);
            // 总丢包数
            let totalPacketsLost = 0;
            // 上行码率总和
            let bitrateSend = 0;
            // 解析上行媒体流数据: RTCOutboundRTPVideoStream | RTCOutboundRTPAudioStream
            const outboundKeys = keys.filter(key => /^RTCOutboundRTP(Video|Audio)Stream_/.test(key));
            outboundKeys.forEach(key => {
                // 本端输出数据
                const outboundInfo = stats[key];
                if (this._sdpSemantics === 'unified-plan' && !this.isValidSender(outboundInfo)) {
                    return;
                }
                const resourceId = this.getResourceIdByParseSdp(outboundInfo);
                const { mediaType: kind, transportId, remoteId, packetsSent, bytesSent, trackId, encoderImplementation, pliCount, nackCount, firCount } = outboundInfo;
                if (!trackId) {
                    return;
                }
                const { audioLevel, frameHeight, frameWidth } = stats[trackId];
                let bitrate = this.updateBytesSent(resourceId, bytesSent, timestamp);
                if (bitrate < 0) {
                    bitrate = 0;
                }
                // 总和累加
                bitrateSend += bitrate;
                reports.senders.push({
                    trackId: resourceId,
                    kind,
                    packetsLostRate: null,
                    remoteResource: false,
                    audioLevel: (audioLevel || audioLevel === 0) ? handleAudioLevel(audioLevel) : null,
                    frameWidth,
                    frameHeight,
                    frameRate: null,
                    bitrate,
                    jitter: null,
                    rtt: null,
                    encoderImplementation,
                    pliCount: pliCount,
                    nackCount: nackCount,
                    googFirsSent: STAT_NONE,
                    samplingRate: STAT_NONE,
                    googRenderDelayMs: STAT_NONE,
                    trackState: STAT_NONE
                });
            });
            // 下行码率总和
            let bitrateRecv = 0;
            // 下行流数据解析
            const inboundKeys = keys.filter(key => /^RTCInboundRTP(Video|Audio)Stream_/.test(key));
            inboundKeys.forEach(key => {
                const inboundInfo = stats[key];
                if (this._sdpSemantics === 'unified-plan' && !this.isValidReceiver(inboundInfo)) {
                    return;
                }
                const { trackId, packetsLost, packetsReceived, jitter, bytesReceived, mediaType: kind, nackCount, pliCount } = inboundInfo;
                const resourceId = this.getResourceIdByParseSdp(inboundInfo);
                if (!trackId) {
                    return;
                }
                const { frameHeight, frameWidth, audioLevel } = stats[trackId];
                totalPacketsLost += packetsLost;
                const packetsLostRate = this.updateReceiverPacketsLost(resourceId, packetsLost, packetsReceived);
                let bitrate = this.updateBytesRecv(resourceId, bytesReceived, timestamp);
                if (bitrate < 0) {
                    bitrate = 0;
                }
                bitrateRecv += bitrate;
                reports.receivers.push({
                    trackId: resourceId,
                    kind,
                    packetsLostRate,
                    remoteResource: true,
                    audioLevel: (audioLevel || audioLevel === 0) ? handleAudioLevel(audioLevel) : null,
                    frameWidth,
                    frameHeight,
                    frameRate: null,
                    bitrate,
                    jitter: jitter,
                    codecImplementationName: null,
                    nackCount,
                    pliCount,
                    rtt: null,
                    samplingRate: STAT_NONE,
                    googFirsReceived: STAT_NONE,
                    googRenderDelayMs: STAT_NONE,
                    trackState: STAT_NONE
                });
            });
            // 解析本端/远端 IP、Port 数据
            const transportKey = keys.filter(key => /^RTCTransport_/.test(key))[0];
            if (transportKey) {
                const rtcTransport = stats[transportKey];
                const { selectedCandidatePairId } = rtcTransport;
                if (selectedCandidatePairId) {
                    const iceCandidatePair = stats[selectedCandidatePairId];
                    const { availableOutgoingBitrate, 
                    // 下行带宽只在有下行资源时有值
                    availableIncomingBitrate, currentRoundTripTime: rtt, localCandidateId, remoteCandidateId } = iceCandidatePair;
                    const localCandidate = stats[localCandidateId];
                    const { address: IP, port } = localCandidate;
                    const remoteCandidate = stats[remoteCandidateId];
                    const { address: remoteIP, port: remotePort, protocol } = remoteCandidate;
                    reports.iceCandidatePair = {
                        IP: IP || null,
                        port,
                        networkType: null,
                        remoteIP,
                        remotePort,
                        protocol,
                        bitrateRecv,
                        bitrateSend,
                        rtt: rtt * 1000,
                        availableOutgoingBitrate,
                        availableIncomingBitrate,
                        totalPacketsLost
                    };
                    // 给下行 rtt 赋值
                    reports.receivers.forEach(item => {
                        item.rtt = rtt;
                    });
                }
            }
            return reports;
        }
        getAudioLevelList(stats) {
            const audioLevelList = [];
            const keys = Object.keys(stats);
            // 解析上行媒体流数据: RTCOutboundRTPVideoStream | RTCOutboundRTPAudioStream
            const outboundKeys = keys.filter(key => /^RTCOutboundRTP(Video|Audio)Stream_/.test(key));
            outboundKeys.forEach(key => {
                // 本端输出数据
                const outboundInfo = stats[key];
                if (this._sdpSemantics === 'unified-plan' && !this.isValidSender(outboundInfo)) {
                    return;
                }
                const { trackId, mediaType: kind } = outboundInfo;
                if (kind === 'video') {
                    return;
                }
                const resourceId = this.getResourceIdByParseSdp(outboundInfo);
                const audioLevel = stats[trackId];
                audioLevelList.push({
                    trackId: resourceId,
                    audioLevel: (audioLevel || audioLevel === 0) ? handleAudioLevel(audioLevel) : null
                });
            });
            // 下行流数据解析
            const inboundKeys = keys.filter(key => /^RTCInboundRTP(Video|Audio)Stream_/.test(key));
            inboundKeys.forEach(key => {
                const inboundInfo = stats[key];
                if (this._sdpSemantics === 'unified-plan' && !this.isValidReceiver(inboundInfo)) {
                    return;
                }
                const { trackId, mediaType: kind } = inboundInfo;
                if (!trackId || kind === 'video') {
                    return;
                }
                const { audioLevel } = stats[trackId];
                const resourceId = this.getResourceIdByParseSdp(inboundInfo);
                audioLevelList.push({
                    trackId: resourceId,
                    audioLevel: (audioLevel || audioLevel === 0) ? handleAudioLevel(audioLevel) : null
                });
            });
            return audioLevelList;
        }
    }

    class ASdpStrategy {
        constructor(_peer) {
            this._peer = _peer;
            this._outboundStreams = {};
        }
        /**
         * 设置指定的 SDP 协议版本
         * @param sdpSemantics 优先版本
         */
        static setSdpSemantics(sdpSemantics) {
            const { browser, version, supportsUnifiedPlan } = browserInfo;
            // 在明确不支持 unified-plan 的版本中使用 plan-b
            if (!supportsUnifiedPlan) {
                this._sdpSemantics = 'plan-b';
                return;
            }
            if (/chrome/i.test(browser)) {
                // chrome 72 - 92 之间的版本可以通过传参的方式定义使用的 SDP 协议版本以便于测试
                this._sdpSemantics = version > 92 ? 'unified-plan' : (version < 72 ? 'plan-b' : sdpSemantics);
                return;
            }
            if (/firefox/i.test(browser)) {
                this._sdpSemantics = 'unified-plan';
                return;
            }
            if (/safari/i.test(browser)) {
                this._sdpSemantics = version < 12 ? 'plan-b' : 'unified-plan';
                return;
            }
            this._sdpSemantics = 'unified-plan';
        }
        /**
         * 获取使用的 SDP 协议版本
         */
        static getSdpSemantics() {
            return ASdpStrategy._sdpSemantics;
        }
        getOutboundVideoInfo() {
            const result = [];
            for (const msid in this._outboundStreams) {
                const stream = this._outboundStreams[msid];
                const videoTrack = stream.getVideoTracks()[0];
                if (!videoTrack) {
                    continue;
                }
                const isTiny = /_tiny$/.test(msid);
                const { width, height } = getVideoTrackInfo(videoTrack);
                result.push({
                    trackId: videoTrack.id,
                    simulcast: isTiny ? RCStreamType.TINY : RCStreamType.NORMAL,
                    resolution: `${width}x${height}`
                });
            }
            return result;
        }
        setRemoteAnswer(sdp) {
            return __awaiter(this, void 0, void 0, function* () {
                // 过滤行末的空格，服务可能产生空格数据
                sdp = sdp.replace(/\s+\r\n/g, '\r\n');
                try {
                    yield this._peer.setRemoteDescription({ type: 'answer', sdp });
                }
                catch (error) {
                    logger.error(error);
                    return exports.RCRTCCode.SET_REMOTE_DESCRIPTION_FAILED;
                }
                return exports.RCRTCCode.SUCCESS;
            });
        }
        getStatParsr(rtcPeerConn, sdpSemantics) {
            if (/chrome/i.test(browserInfo.browser)) {
                return new RTCReportParser$2(rtcPeerConn, sdpSemantics);
            }
            if (/Firefox/i.test(browserInfo.browser)) {
                return new RTCReportParser$1(rtcPeerConn, sdpSemantics);
            }
            if (/Safari/i.test(browserInfo.browser)) {
                return new RTCReportParser(rtcPeerConn, sdpSemantics);
            }
            return null;
        }
    }

    class PlanBStrategy extends ASdpStrategy {
        constructor() {
            super(...arguments);
            this.senders = {};
            this._localTracks = [];
        }
        addLocalTrack(track) {
            this._localTracks.includes(track) || this._localTracks.push(track);
            const msid = track.getStreamId();
            const msTrack = track.__innerGetMediaStreamTrack();
            // 复用 stream 避免多次重复初始化
            const stream = this._outboundStreams[msid] || (this._outboundStreams[msid] = new MediaStream());
            // 清理同类型轨道数据
            stream.getTracks().forEach(track => {
                track.kind === msTrack.kind && stream.removeTrack(track);
            });
            stream.addTrack(msTrack);
            // addTrack
            const trackId = track.getTrackId();
            const sender = this.senders[trackId];
            if (sender) {
                sender.replaceTrack(msTrack);
            }
            else {
                this.senders[trackId] = this._peer.addTrack(msTrack, stream);
            }
        }
        removeLocalTrack(track) {
            const index = this._localTracks.findIndex(item => item === track);
            index >= 0 && this._localTracks.splice(index, 1);
            const trackId = track.getTrackId();
            const sender = this.senders[trackId];
            if (!sender) {
                return;
            }
            sender.replaceTrack(null);
            this._peer.removeTrack(sender);
            delete this.senders[trackId];
        }
        updateSubRemoteTracks(remoteTracks) {
            // plan-b 中订阅与取消订阅不体现在 SDP 数据中，不需要对 peerConnection 做操作
        }
        updateRecvTransceiverMap(trackId, transceiver) {
            // plan-b 无需维护 offer 中的订阅关系，offer 只描述上行数据
        }
        /**
         * 指定上行码率范围
         * @param maxBitrate
         * @param minBitrate
         * @param startBitrate
         */
        setBitrate(maxBitrate, minBitrate, startBitrate) {
            this._maxBitrate = maxBitrate;
            this._minBitrate = minBitrate;
            this._startBitrate = startBitrate || maxBitrate * 0.7;
        }
        createOffer(iceRestart) {
            return __awaiter(this, void 0, void 0, function* () {
                const offer = yield this._peer.createOffer({ iceRestart, offerToReceiveAudio: true, offerToReceiveVideo: true });
                for (const msid in this._outboundStreams) {
                    const streamId = this._outboundStreams[msid].id;
                    offer.sdp = offer.sdp.replace(new RegExp(streamId, 'g'), msid);
                }
                yield this._peer.setLocalDescription(offer);
                return { type: 'offer', semantics: 'plan-b', sdp: offer.sdp };
            });
        }
        setRemoteAnswer(sdp) {
            // 计算动态码率
            let maxBitrate = 0;
            let minBitrate = 0;
            this._localTracks.forEach(item => {
                const { min, max } = item.getBitrate();
                minBitrate += min;
                maxBitrate += max;
            });
            maxBitrate = this._maxBitrate && this._maxBitrate > 0 ? Math.min(maxBitrate, this._maxBitrate) : maxBitrate;
            minBitrate = this._minBitrate && this._minBitrate > 0 ? Math.max(minBitrate, this._minBitrate) : minBitrate;
            const startBitrate = this._startBitrate || Math.round(maxBitrate * 0.7);
            // 通用码率上限描述
            const maxBitrateLine = `b=AS:${maxBitrate}`;
            sdp = sdp.replace(/[\r\n]+m=video[^\r\n]+/, (matched) => {
                return `${matched}\r\n${maxBitrateLine}`;
            });
            // 针对各编码独立设置初始码率、最小码率、最大码率
            const bitrateEndfix = [
                `;x-google-min-bitrate=${minBitrate}`,
                `;x-google-max-bitrate=${maxBitrate}`,
                `;x-google-start-bitrate=${startBitrate}`
            ].join('');
            // 在视频编码描述行后单独增加码率配置
            sdp = sdp.replace(/[\r\n]+[^\r\n]+profile-level-id[^\r\n]+/g, (matched) => {
                return matched + bitrateEndfix;
            });
            return super.setRemoteAnswer(sdp);
        }
    }

    const clearSSRC = (mLine) => {
        const bool = /a=(recvonly|inactive)/.test(mLine);
        if (!bool) {
            return mLine;
        }
        const str = mLine.replace(/\r\na=(ssrc|msid)[^\r\n]+/g, '');
        return str;
    };
    const clearInactiveOrRecvonly = (sdp) => {
        // 清除 inactive 或 recvonly 状态下 mid 中包含的 a=ssrc 行以及 a=msid 行
        return sdp.split(/\r\n(?=m=)/).map(mLine => clearSSRC(mLine)).join('\r\n');
    };
    class UnifiedPlanStrategy extends ASdpStrategy {
        constructor() {
            super(...arguments);
            this._sendTransceiver = {};
            this._localTracks = {};
            this._recvAudio = [];
            this._recvVideo = [];
            // 当前的 mid 与 trackId 的匹配关系
            this._recvTransceiver = {};
            this._subedTracks = [];
        }
        setBitrate(max, min, start) {
            logger.warn('the interface named `setBitrate` is invalid while sdpSemantics value is `unified-plan`');
        }
        addLocalTrack(track) {
            const trackId = track.getTrackId();
            const msid = track.getStreamId();
            const msTrack = track.__innerGetMediaStreamTrack();
            this._localTracks[trackId] = track;
            // 复用 stream 避免多次重复初始化
            const stream = this._outboundStreams[msid] || (this._outboundStreams[msid] = new MediaStream());
            // 清理同类型轨道数据
            stream.getTracks().forEach(track => {
                track.kind === msTrack.kind && stream.removeTrack(track);
            });
            stream.addTrack(msTrack);
            const transceiver = this._sendTransceiver[trackId];
            if (transceiver) {
                transceiver.sender.replaceTrack(msTrack);
                transceiver.direction = 'sendonly';
            }
            else {
                this._sendTransceiver[trackId] = this._peer.addTransceiver(msTrack, { direction: 'sendonly', streams: [stream] });
            }
        }
        removeLocalTrack(track) {
            const trackId = track.getTrackId();
            const msid = track.getStreamId();
            track.__innerGetMediaStreamTrack();
            delete this._localTracks[trackId];
            const transceiver = this._sendTransceiver[trackId];
            if (!transceiver) {
                return;
            }
            transceiver.direction = 'inactive';
            this._peer.removeTrack(transceiver.sender);
            transceiver.sender.replaceTrack(null);
            const stream = this._outboundStreams[msid];
            const msTracks = track.isAudioTrack() ? stream.getAudioTracks() : stream.getVideoTracks();
            msTracks.forEach(item => stream.removeTrack(item));
            // 尝试移除小流并销毁
            const tinyTransceiver = this._sendTransceiver[`${trackId}_tiny`];
            if (!tinyTransceiver || (tinyTransceiver.direction === 'inactive')) {
                return;
            }
            tinyTransceiver.direction = 'inactive';
            const sender = tinyTransceiver.sender;
            const tinyTrack = sender.track;
            this._peer.removeTrack(sender);
            sender.replaceTrack(null);
            const tinyStream = this._outboundStreams[`${msid}_tiny`];
            tinyStream.removeTrack(tinyTrack);
            tinyTrack.stop();
        }
        updateRecvTransceiverMap(trackId, transceiver) {
            const { mediaType } = parseTrackId(trackId);
            // 更新映射关系
            this._recvTransceiver[trackId] = transceiver;
            // 从备选列表中删除 transceiver
            const arrTransceiver = mediaType === exports.RCMediaType.AUDIO_ONLY ? this._recvAudio : this._recvVideo;
            const index = arrTransceiver.findIndex(item => item === transceiver);
            index >= 0 && arrTransceiver.splice(index, 1);
        }
        updateSubRemoteTracks(tracks) {
            // 减法记录新增订阅
            const addTracks = tracks.slice();
            // 备份旧订阅列表，以便于减法记录被移除订阅
            const removeTracks = this._subedTracks.slice();
            // 记录新订阅关系
            this._subedTracks = tracks.slice();
            for (let i = addTracks.length - 1; i >= 0; i -= 1) {
                const track = addTracks[i];
                const index = removeTracks.findIndex(item => item === track);
                if (index >= 0) {
                    // 当前已存在，不属于新增
                    addTracks.splice(i, 1);
                    // 新列表中仍存在，说明未被删除
                    removeTracks.splice(index, 1);
                }
            }
            // 遍历 removeTracks，将对应的 transceiver.direction = 'inactive'
            removeTracks.length && removeTracks.forEach(item => {
                const trackId = item.getTrackId();
                item.__innerSetMediaStreamTrack(undefined);
                const transceiver = this._recvTransceiver[trackId];
                transceiver.direction = 'inactive';
            });
            const addCount = { audio: 0, video: 0 };
            addTracks.length && addTracks.forEach(item => {
                const kind = item.isAudioTrack() ? 'audio' : 'video';
                // 查找是否有与该 trackId 绑定的 transceiver
                const transceiver = this._recvTransceiver[item.getTrackId()];
                if (transceiver) {
                    transceiver.direction = 'recvonly';
                    return;
                }
                // 不存在绑定关系的情况下，记录需要新增多少个 transceiver
                addCount[kind] += 1;
            });
            // 新增 transceiver
            for (let i = this._recvAudio.length; i < addCount.audio; i += 1) {
                this._recvAudio.push(this._peer.addTransceiver('audio', { direction: 'recvonly' }));
            }
            for (let i = this._recvVideo.length; i < addCount.video; i += 1) {
                this._recvVideo.push(this._peer.addTransceiver('video', { direction: 'recvonly' }));
            }
        }
        createOffer(iceRestart) {
            return __awaiter(this, void 0, void 0, function* () {
                const offer = yield this._peer.createOffer({ iceRestart });
                let sdp = offer.sdp;
                for (const msid in this._outboundStreams) {
                    const streamId = this._outboundStreams[msid].id;
                    sdp = sdp.replace(new RegExp(streamId, 'g'), msid);
                }
                // 发给服务前将 ssrc 数据清理
                sdp = clearInactiveOrRecvonly(sdp);
                // 增加 a=ice-options:renomination 行
                sdp = sdp.replace(/a=ice-options:trickle/g, 'a=ice-options:trickle\r\na=ice-options:renomination');
                offer.sdp = sdp;
                yield this._peer.setLocalDescription(offer);
                return { type: 'offer', semantics: 'unified-plan', sdp };
            });
        }
        setRemoteAnswer(sdp) {
            sdp = sdp.split(/\r\n(?=m=)/).map(mLine => {
                // firefox 浏览器中祛除 inactive 的 ssrc 数据
                // if (browserInfo.name === 'FireFox') {
                //   mLine = clearSSRC(mLine)
                // }
                var _a;
                // 给上行 mid 增加码率配置
                const midLine = mLine.match(/a=mid:[^\s]+/);
                if (!midLine) {
                    return mLine;
                }
                const mid = midLine[0].replace('a=mid:', '');
                let trackId = '';
                for (const key in this._sendTransceiver) {
                    const transceiver = this._sendTransceiver[key];
                    if (transceiver.mid === mid) {
                        trackId = key;
                        break;
                    }
                }
                if (!trackId) {
                    return mLine;
                }
                const bitrate = (_a = this._localTracks[trackId]) === null || _a === void 0 ? void 0 : _a.getBitrate();
                if (!bitrate) {
                    // 未设置码率
                    return mLine;
                }
                const { max, min } = bitrate;
                const start = max && max > 0 ? bitrate.start || max * 0.7 : 0;
                const tmpArr = [];
                max && max > 0 && tmpArr.push(`;x-google-max-bitrate=${max}`);
                min && min > 0 && tmpArr.push(`;x-google-min-bitrate=${min}`);
                start > 0 && tmpArr.push(`;x-google-start-bitrate=${start}`);
                if (tmpArr.length === 0) {
                    return mLine;
                }
                const bitrateEndfix = tmpArr.join('');
                return mLine.replace(/[\r\n]+[^\r\n]+profile-level-id[^\r\n]+/g, (matched) => {
                    return matched + bitrateEndfix;
                });
            }).join('\r\n');
            const reg = /[\r\n]+\r\n[\r\n]+/g;
            if (reg.test(sdp)) {
                // 服务给回的数据可能包含多余的 \r\n，故过滤一下
                logger.warn(`answer sdp invalid -> ${JSON.stringify(sdp)}`);
                sdp = sdp.replace(reg, '\r\n');
            }
            return super.setRemoteAnswer(sdp);
        }
    }

    /**
     * PC 实例管理类
     */
    class RCRTCPeerConnection extends engine.EventEmitter {
        constructor(
        /**
         * _reTryExchange 方法
         */
        _reTryExchange, 
        /**
         * 北极星上传实例
         */
        _polarisReport) {
            super();
            this._reTryExchange = _reTryExchange;
            this._polarisReport = _polarisReport;
            this.pubLocalTracks = {};
            this._reTryExchangeTimer = null;
            // peerConnection stats 计时器
            this._reportStatsTimer = null;
            this._reportListener = null;
            const sdpSemantics = ASdpStrategy.getSdpSemantics();
            const peer = this._rtcPeerConn = new RTCPeerConnection({ sdpSemantics });
            this._sdpStrategy = sdpSemantics === 'plan-b' ? new PlanBStrategy(peer) : new UnifiedPlanStrategy(peer);
            this._rtcPeerConn.oniceconnectionstatechange = this._onICEConnectionStateChange.bind(this);
            this._rtcPeerConn.onconnectionstatechange = this._onConnectionStateChange.bind(this);
            this._rtcPeerConn.ontrack = this._onTrackReady.bind(this);
            this.reportParser = this._sdpStrategy.getStatParsr(this._rtcPeerConn, sdpSemantics);
        }
        getLocalTracks() {
            return Object.values(this.pubLocalTracks);
        }
        _onConnectionStateChange() {
            logger.info(`onconnectionstatechange -> ${this._rtcPeerConn.connectionState}`);
        }
        _onICEConnectionStateChange() {
            var _a, _b;
            logger.info(`oniceconnectionstatechange -> ${this._rtcPeerConn.iceConnectionState}`);
            if (this._rtcPeerConn.iceConnectionState === 'connected') {
                // 开启 peerConnection stats 统计定时器
                if (this._reportStatsTimer) {
                    clearInterval(this._reportStatsTimer);
                }
                this._reportStatsTimer = setInterval(this._reportHandle.bind(this), 1000);
            }
            // ICE 连接中断后，需要尝试重新走 exchange 流程以恢复
            if (this._rtcPeerConn.iceConnectionState === 'failed') {
                logger.warn('iceconenction state is `failed`, exchange SDP to try again.');
                this._reTryExchange();
                this._reTryExchangeTimer = setInterval(this._reTryExchange, 15 * 1000);
            }
            // ICE 变更通知
            try {
                (_b = (_a = this._reportListener) === null || _a === void 0 ? void 0 : _a.onICEConnectionStateChange) === null || _b === void 0 ? void 0 : _b.call(_a, this._rtcPeerConn.iceConnectionState);
            }
            catch (error) {
                logger.error('onICEConnectionStateChange error', error);
            }
        }
        _onTrackReady(evt) {
            // 更新 transceiver 与 trackId 的订阅关系
            const msid = evt.streams[0].id;
            const track = evt.receiver.track;
            const trackId = [msid, track.kind === 'audio' ? exports.RCMediaType.AUDIO_ONLY : exports.RCMediaType.VIDEO_ONLY].join('_');
            this._updateRecvTransceiverMap(trackId, evt.transceiver);
            this.emit(RCRTCPeerConnection.__INNER_EVENT_TRACK_READY__, evt);
        }
        setBitrate(max, min, start) {
            return __awaiter(this, void 0, void 0, function* () {
                this._sdpStrategy.setBitrate(max, min, start);
            });
        }
        createOffer(iceRestart) {
            return __awaiter(this, void 0, void 0, function* () {
                const offer = yield this._sdpStrategy.createOffer(iceRestart);
                // logger.debug(`sdpDemantics -> ${offer.semantics}`)
                // logger.debug(`offer -> ${JSON.stringify(offer.sdp)}`)
                return offer;
            });
        }
        setRemoteAnswer(answer) {
            return __awaiter(this, void 0, void 0, function* () {
                // logger.debug(`answer -> ${JSON.stringify(answer)}`)
                return this._sdpStrategy.setRemoteAnswer(answer);
            });
        }
        getLocalTrack(trackId) {
            return this.pubLocalTracks[trackId] || null;
        }
        addLocalTrack(track) {
            this.pubLocalTracks[track.getTrackId()] = track;
            this._sdpStrategy.addLocalTrack(track);
            // 避免重复添加事件监听
            track.off(RCLocalTrack.__INNER_EVENT_MUTED_CHANGE__, this._onLocalTrackMuted, this);
            track.off(RCLocalTrack.__INNER_EVENT_DESTROY__, this._onLocalTrackDestroied, this);
            track.on(RCLocalTrack.__INNER_EVENT_MUTED_CHANGE__, this._onLocalTrackMuted, this);
            track.on(RCLocalTrack.__INNER_EVENT_DESTROY__, this._onLocalTrackDestroied, this);
        }
        removeLocalTrackById(trackId) {
            const track = this.getLocalTrack(trackId);
            if (!track) {
                return;
            }
            this.removeLocalTrack(track);
        }
        removeAllLocalTrack() {
            Object.keys(this.pubLocalTracks).forEach(id => {
                // 小流不可先于大流执行 removeLocalTrackById，否则可能存在小流被当做大流进而不可被销毁
                /_tiny$/.test(id) || this.removeLocalTrackById(id);
            });
        }
        removeLocalTrack(track) {
            const trackId = track.getTrackId();
            delete this.pubLocalTracks[trackId];
            this._sdpStrategy.removeLocalTrack(track);
            track.__innerSetPublished(false);
            track.off(RCLocalTrack.__INNER_EVENT_MUTED_CHANGE__, this._onLocalTrackMuted, this);
            track.off(RCLocalTrack.__INNER_EVENT_DESTROY__, this._onLocalTrackDestroied, this);
            // 尝试移除并销毁 tinyTrack
            const tinyId = `${trackId}_tiny`;
            const tinyTrack = this.getLocalTrack(tinyId);
            if (tinyTrack) {
                this._sdpStrategy.removeLocalTrack(tinyTrack);
                delete this.pubLocalTracks[tinyId];
                tinyTrack.destroy();
            }
        }
        _updateRecvTransceiverMap(trackId, transceiver) {
            this._sdpStrategy.updateRecvTransceiverMap(trackId, transceiver);
        }
        updateSubRemoteTracks(remoteTracks) {
            this._sdpStrategy.updateSubRemoteTracks(remoteTracks);
        }
        /**
         * 获取当前已发布视频流信息
         */
        getOutboundVideoInfo() {
            return this._sdpStrategy.getOutboundVideoInfo();
        }
        _onLocalTrackMuted(track) {
            // 修改已发布的小流状态
            const tinyTrack = this.getLocalTrack(`${track.getTrackId()}_tiny`);
            if (tinyTrack) {
                tinyTrack.__innerGetMediaStreamTrack().enabled = !track.isLocalMuted();
            }
            this.emit(RCLocalTrack.__INNER_EVENT_MUTED_CHANGE__, track);
        }
        _onLocalTrackDestroied(track) {
            this.emit(RCLocalTrack.__INNER_EVENT_DESTROY__, track);
        }
        /**
         * 注册连接数据监控，开启质量数据上报定时器
         * @param listener
         */
        registerReportListener(listener) {
            this._reportListener = listener;
        }
        _createRCRTCStateReport(data) {
            const { timestamp, iceCandidatePair, senders, receivers } = JSON.parse(JSON.stringify(data));
            iceCandidatePair === null || iceCandidatePair === void 0 ? true : delete iceCandidatePair.totalPacketsLost;
            for (const key in iceCandidatePair) {
                isNull(iceCandidatePair[key]) && delete iceCandidatePair[key];
            }
            const newSenders = senders.map((item) => {
                const sender = {};
                item.trackId && (sender.trackId = item.trackId);
                item.kind && (sender.kind = item.kind);
                (item.packetsLostRate || item.packetsLostRate === 0) && (sender.packetsLostRate = item.packetsLostRate);
                sender.remoteResource = item.remoteResource;
                (item.audioLevel || item.audioLevel === 0) && (sender.audioLevel = item.audioLevel);
                item.frameWidth && (sender.frameWidth = item.frameWidth);
                item.frameHeight && (sender.frameHeight = item.frameHeight);
                item.frameRate && (sender.frameRate = item.frameRate);
                (item.bitrate || item.bitrate === 0) && (sender.bitrate = item.bitrate);
                item.jitter && (sender.jitter = item.jitter);
                return sender;
            });
            const newReceivers = receivers.map((item) => {
                const receiver = {};
                item.trackId && (receiver.trackId = item.trackId);
                item.kind && (receiver.kind = item.kind);
                (item.packetsLostRate || item.packetsLostRate === 0) && (receiver.packetsLostRate = item.packetsLostRate);
                receiver.remoteResource = item.remoteResource;
                (item.audioLevel || item.audioLevel === 0) && (receiver.audioLevel = item.audioLevel);
                item.frameWidth && (receiver.frameWidth = item.frameWidth);
                item.frameHeight && (receiver.frameHeight = item.frameHeight);
                item.frameRate && (receiver.frameRate = item.frameRate);
                (item.bitrate || item.bitrate === 0) && (receiver.bitrate = item.bitrate);
                item.jitter && (receiver.jitter = item.jitter);
                return receiver;
            });
            return {
                timestamp,
                iceCandidatePair,
                senders: newSenders,
                receivers: newReceivers
            };
        }
        /**
         * 获取 peerConnection stats 数据并格式化
         * @returns 返回格式化后的数据
         */
        _getStatsData() {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                const reports = yield this._rtcPeerConn.getStats();
                /**
                 * 解析 stats 数据
                 */
                const data = (_a = this.reportParser) === null || _a === void 0 ? void 0 : _a.parseRTCStatsReport(reports);
                /**
                 * 获取 report 中的 iceCandidatePair、senders、receivers 中的所有字段
                 */
                const formatData = (_b = this.reportParser) === null || _b === void 0 ? void 0 : _b.formatRCRTCStateReport(data);
                return formatData;
            });
        }
        getAudioLevelReportData() {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                const reports = yield this._rtcPeerConn.getStats();
                /**
                 * 解析 stats 数据
                 */
                const data = (_a = this.reportParser) === null || _a === void 0 ? void 0 : _a.parseRTCStatsReport(reports);
                if (!data) {
                    return [];
                }
                const audioLevelData = (_b = this.reportParser) === null || _b === void 0 ? void 0 : _b.getAudioLevelList(data);
                return audioLevelData;
            });
        }
        /**
         * 通知用户质量数据、peerConnection 北极星数据上报
         * @todo
         */
        _reportHandle() {
            var _a, _b, _c;
            return __awaiter(this, void 0, void 0, function* () {
                const formatData = yield this._getStatsData();
                if (!formatData) {
                    return;
                }
                if (formatData.senders.length || formatData.receivers.length) {
                    /**
                     * 组装北极星上报 R3、R4 数据并发送
                     */
                    (_a = this._polarisReport) === null || _a === void 0 ? void 0 : _a.sendR3R4Data(formatData);
                }
                /**
                 * 组装用户层抛出数据
                 */
                const reportData = this._createRCRTCStateReport(formatData);
                (_c = (_b = this._reportListener) === null || _b === void 0 ? void 0 : _b.onStateReport) === null || _c === void 0 ? void 0 : _c.call(_b, reportData);
            });
        }
        getRTCPeerConn() {
            return this._rtcPeerConn;
        }
        destroy() {
            this.clear();
            this.clearReTryExchangeTimer();
            // 停止计时
            if (this._reportStatsTimer) {
                clearInterval(this._reportStatsTimer);
                this._reportStatsTimer = null;
            }
            this.registerReportListener(null);
            // 关闭 pc 连接
            this._rtcPeerConn.close();
            // 销毁解析 stats 实例
            this.reportParser = null;
        }
        clearReTryExchangeTimer() {
            clearInterval(this._reTryExchangeTimer);
            this._reTryExchangeTimer = null;
        }
    }
    RCRTCPeerConnection.__INNER_EVENT_TRACK_READY__ = 'inner-track-ready';

    /**
     * 流状态
     */
    var TrackState;
    (function (TrackState) {
        /**
         * 不可用
         */
        TrackState[TrackState["DISABLE"] = 0] = "DISABLE";
        /**
         * 可用
         */
        TrackState[TrackState["ENABLE"] = 1] = "ENABLE";
    })(TrackState || (TrackState = {}));

    /**
     * 北极星上报角色
     */
    var PolarisRole;
    (function (PolarisRole) {
        /**
         * 会议参会者、主播
         */
        PolarisRole[PolarisRole["MeetingOrAnchor"] = 1] = "MeetingOrAnchor";
        /**
         * 观众
         */
        PolarisRole[PolarisRole["Audience"] = 2] = "Audience";
    })(PolarisRole || (PolarisRole = {}));

    class PolarisReporter {
        constructor(_context, _runtime, _roomId, _crtRTCRoom, _userRole = PolarisRole.MeetingOrAnchor // 会议模式下为 1 | 直播模式下 主播为 1 观众为 2
        ) {
            this._context = _context;
            this._runtime = _runtime;
            this._roomId = _roomId;
            this._crtRTCRoom = _crtRTCRoom;
            this._userRole = _userRole;
        }
        _send(report) {
            this._context.getConnectionStatus() === engine.ConnectionStatus.CONNECTED && this._context.setRTCState(this._roomId, report);
        }
        _getClientID() {
            const key = 'uuid';
            let uuid = this._runtime.localStorage.getItem(key);
            if (!uuid) {
                uuid = getUUID22();
                this._runtime.localStorage.setItem(key, uuid);
            }
            return uuid;
        }
        /**
         * 小流需去掉 _tiny，小流 resourceId 为 userId_tag_mediaType_tiny
         */
        _getRealResourceId(resourceId) {
            let realResourceId = resourceId;
            const tinyIndex = resourceId.indexOf('_tiny');
            tinyIndex > -1 && (realResourceId = resourceId.slice(0, tinyIndex));
            return realResourceId;
        }
        /**
         * 生成北极星上报的 trackId
         * @param resourceId userId_11_1_tiny 改为 userId_11_tiny_video
         */
        _getPolarisTrackId(resourceId) {
            let polarisTrackId = '';
            const arr = resourceId.split('_');
            if (resourceId.includes('_tiny')) {
                const mediaSize = arr.pop();
                const mediaType = (parseInt(arr.pop()) === exports.RCMediaType.AUDIO_ONLY) ? 'audio' : 'video';
                const tag = arr.pop();
                const userId = arr.join('_');
                polarisTrackId = [userId, tag, mediaSize, mediaType].join('_');
            }
            else {
                const mediaType = (parseInt(arr.pop()) === exports.RCMediaType.AUDIO_ONLY) ? 'audio' : 'video';
                const tag = arr.pop();
                const userId = arr.join('_');
                polarisTrackId = [userId, tag, mediaType].join('_');
            }
            return polarisTrackId;
        }
        sendR3R4Data(data) {
            const { iceCandidatePair, senders, receivers } = data;
            /**
             * 上下行 track 包含的公共字段
             */
            const baseData = {
                bitrateSend: (iceCandidatePair === null || iceCandidatePair === void 0 ? void 0 : iceCandidatePair.bitrateSend) || STAT_NONE,
                bitrateRecv: (iceCandidatePair === null || iceCandidatePair === void 0 ? void 0 : iceCandidatePair.bitrateRecv) || STAT_NONE,
                networkType: (iceCandidatePair === null || iceCandidatePair === void 0 ? void 0 : iceCandidatePair.networkType) || 'unknown',
                rtt: (iceCandidatePair === null || iceCandidatePair === void 0 ? void 0 : iceCandidatePair.rtt) || STAT_NONE,
                localAddress: `${(iceCandidatePair === null || iceCandidatePair === void 0 ? void 0 : iceCandidatePair.IP) || STAT_NONE}:${iceCandidatePair === null || iceCandidatePair === void 0 ? void 0 : iceCandidatePair.port}`,
                remoteAddress: `${iceCandidatePair === null || iceCandidatePair === void 0 ? void 0 : iceCandidatePair.remoteIP}:${iceCandidatePair === null || iceCandidatePair === void 0 ? void 0 : iceCandidatePair.remotePort}`,
                receiveBand: (iceCandidatePair === null || iceCandidatePair === void 0 ? void 0 : iceCandidatePair.availableIncomingBitrate) || STAT_NONE,
                sendBand: (iceCandidatePair === null || iceCandidatePair === void 0 ? void 0 : iceCandidatePair.availableOutgoingBitrate) || STAT_NONE,
                packetsLost: (iceCandidatePair === null || iceCandidatePair === void 0 ? void 0 : iceCandidatePair.totalPacketsLost) || STAT_NONE,
                deviceId: this._context.getCurrentId()
            };
            let r3 = `R3\t${baseData.bitrateSend}\t-1\t-1\t-1\t${baseData.networkType}\t${baseData.rtt}\t${baseData.localAddress}\t${baseData.receiveBand}\t${baseData.sendBand}\t${baseData.packetsLost}\t${baseData.deviceId}\r`;
            let r4 = `R4\t${baseData.bitrateRecv}\t-1\t-1\t-1\t${baseData.networkType}\t${baseData.rtt}\t${baseData.localAddress}\t${baseData.receiveBand}\t${baseData.sendBand}\t${baseData.packetsLost}\t${baseData.deviceId}\r`;
            /**
             * 北极星上报 sender tracks 中的字段
             */
            const R3TrackData = senders.map((item) => {
                var _a;
                const { trackId: resourceId, audioLevel, samplingRate, bitrate, packetsLostRate, frameRate, frameWidth, frameHeight, googRenderDelayMs, jitter, nackCount, pliCount, rtt, googFirsSent, encoderImplementation } = item;
                const trackId = this._getPolarisTrackId(resourceId);
                /**
                 * 小流需去掉 _tiny
                 */
                const realResourceId = this._getRealResourceId(resourceId);
                return {
                    trackId,
                    googCodecName: encoderImplementation || String(STAT_NONE),
                    audioLevel: (audioLevel || audioLevel === 0) ? audioLevel : STAT_NONE,
                    bitrate: (bitrate || bitrate === 0) ? bitrate : STAT_NONE,
                    packetsLostRate: (packetsLostRate || packetsLostRate === 0) ? packetsLostRate : STAT_NONE,
                    frameRate: frameRate || STAT_NONE,
                    resolution: (frameWidth && frameHeight) ? `${frameWidth} * ${frameHeight}` : '' + STAT_NONE,
                    jitter: jitter || STAT_NONE,
                    nackCount: (nackCount || nackCount === 0) ? nackCount : STAT_NONE,
                    pliCount: (pliCount || pliCount === 0) ? pliCount : STAT_NONE,
                    rtt: rtt || STAT_NONE,
                    googFirsSent,
                    samplingRate,
                    googRenderDelayMs,
                    encoderImplementation: encoderImplementation || String(STAT_NONE),
                    trackState: ((_a = this._crtRTCRoom.getLocalTrack(realResourceId)) === null || _a === void 0 ? void 0 : _a.isLocalMuted()) ? TrackState.DISABLE : TrackState.ENABLE
                };
            });
            /**
             * 北极星上报 received tracks 中的字段
             */
            const R4TrackData = receivers.filter(item => {
                // unified-plan 下 inactive 的数据会继续携带 ssrc，导致无 trackId
                return !!item.trackId;
            }).map((item) => {
                var _a;
                const { trackId: resourceId, audioLevel, samplingRate, bitrate, packetsLostRate, frameRate, frameWidth, frameHeight, googRenderDelayMs, jitter, nackCount, pliCount, rtt, googFirsReceived, codecImplementationName } = item;
                const trackId = this._getPolarisTrackId(resourceId);
                /**
                 * 小流需去掉 _tiny
                 */
                const realResourceId = this._getRealResourceId(resourceId);
                return {
                    trackId,
                    googCodecName: codecImplementationName || String(STAT_NONE),
                    audioLevel: (audioLevel || audioLevel === 0) ? audioLevel : STAT_NONE,
                    bitrate: (bitrate || bitrate === 0) ? bitrate : STAT_NONE,
                    packetsLostRate: (packetsLostRate || packetsLostRate === 0) ? packetsLostRate : STAT_NONE,
                    frameRate: frameRate || STAT_NONE,
                    resolution: (frameWidth && frameHeight) ? `${frameWidth} * ${frameHeight}` : '' + STAT_NONE,
                    jitter: jitter || STAT_NONE,
                    nackCount: (nackCount || nackCount === 0) ? nackCount : STAT_NONE,
                    pliCount: (pliCount || pliCount === 0) ? pliCount : STAT_NONE,
                    rtt: rtt || STAT_NONE,
                    googFirsReceived,
                    samplingRate,
                    googRenderDelayMs,
                    codecImplementationName: codecImplementationName || String(STAT_NONE),
                    trackState: ((_a = this._crtRTCRoom.getRemoteTrack(realResourceId)) === null || _a === void 0 ? void 0 : _a.isLocalMuted()) ? TrackState.DISABLE : TrackState.ENABLE
                };
            });
            r3 += R3TrackData.map((item) => {
                return `${item.trackId}\t${item.googCodecName}\t${item.audioLevel}\t${item.samplingRate}\t${item.bitrate}\t${item.packetsLostRate}\t${item.frameRate}\t${item.resolution}\t${item.googRenderDelayMs}\t${item.jitter}\t${item.nackCount}\t${item.pliCount}\t${item.rtt}\t${item.googFirsSent}\t${item.encoderImplementation}\t${item.trackState}`;
            }).join('\n');
            data.senders.length && this._send(r3 + `\r${this._userRole}`);
            r4 += R4TrackData.map((item) => {
                return `${item.trackId}\t${item.googCodecName}\t${item.audioLevel}\t${item.samplingRate}\t${item.bitrate}\t${item.packetsLostRate}\t${item.frameRate}\t${item.resolution}\t${item.googRenderDelayMs}\t${item.jitter}\t${item.nackCount}\t${item.pliCount}\t${item.rtt}\t${item.googFirsReceived}\t${item.codecImplementationName}\t${item.trackState}`;
            }).join('\n');
            data.receivers.length && this._send(r4 + `\r${this._userRole}`);
        }
        /**
         * 加入房间
         */
        sendR1() {
            const rtcVersion = "5.1.10-alpha.1";
            const imVersion = this._context.getCoreVersion();
            const platform = 'web';
            const pcName = navigator.platform;
            const pcVersion = STAT_NONE;
            const browserName = browserInfo.browser;
            const browserVersion = browserInfo.version;
            const deviceId = this._getClientID();
            const r1 = `R1\t${rtcVersion}\t${imVersion}\t${platform}\t${pcName}\t${pcVersion}\t${browserName}\t${browserVersion}\t${deviceId}\t${this._userRole}`;
            this._send(r1);
        }
        /**
         * RTC 和 LIVE 发布、取消发布
         * RTC 订阅、取消订阅
         */
        sendR2(action, status, trackIds) {
            const deviceId = this._getClientID();
            const r2 = `R2\t${action}\t${status}\t${deviceId}\r${trackIds.join('\t')}\r${this._userRole}`;
            this._send(r2);
        }
    }

    class RCRemoteTrack extends RCTrack {
        constructor(tag, userId, kind, roomId) {
            super(tag, userId, kind, false, roomId);
            this._isSubscribed = false;
        }
        /**
         * 根据房间数据更新状态
         * @param value
         */
        __innerSetRemoteMuted(bool) {
            this._remoteMuted = bool;
        }
        __innerSetSubscribed(bool) {
            this._isSubscribed = bool;
        }
        /**
         * 查看是否已订阅了该远端资源
         * @returns
         */
        isSubscribed() {
            return this._isSubscribed;
        }
    }
    class RCRemoteAudioTrack extends RCRemoteTrack {
        constructor(tag, userId, roomId) {
            super(tag, userId, 'audio', roomId);
        }
    }
    class RCRemoteVideoTrack extends RCRemoteTrack {
        constructor(tag, userId, roomId) {
            super(tag, userId, 'video', roomId);
        }
    }

    /**
     * 北极星上报 R2 参数
     */
    var R2Action;
    (function (R2Action) {
        /**
         * 发布
         */
        R2Action["PUBLISH"] = "publish";
        /**
         * 订阅
         */
        R2Action["SUBSCRIBE"] = "subscribe";
    })(R2Action || (R2Action = {}));

    var R2Status;
    (function (R2Status) {
        /**
         * 开始
         */
        R2Status["BEGIN"] = "begin";
        /**
         * 结束
         */
        R2Status["END"] = "end";
    })(R2Status || (R2Status = {}));

    class RCAudioLevelReport {
        constructor(_room) {
            this._room = _room;
            // 音量上报事件
            this._audioLevelChangeHandler = null;
            // 音量上报定时器
            this._timer = null;
            this._pc = this._room.__getPC();
        }
        /**
         * 通知业务端音量 > 0 的数据，数组每一项包含 track、audioLevel
         */
        _audioLevelReport() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this._pc.getRTCPeerConn().iceConnectionState === 'new' || !this._audioLevelChangeHandler) {
                    return;
                }
                const audioLevelData = yield this._pc.getAudioLevelReportData();
                const list = audioLevelData.map((item) => {
                    const { userId } = helper.parseTrackId(item.trackId);
                    const isLocal = this._room.getCrtUserId() === userId;
                    const track = isLocal ? this._room.getLocalTrack(item.trackId) : this._room.getRemoteTrack(item.trackId);
                    return {
                        track,
                        audioLevel: item.audioLevel || 0
                    };
                }).filter((item) => {
                    return item.track;
                });
                this._audioLevelChangeHandler(list);
            });
        }
        onAudioLevelChange(handler, gap) {
            if (gap < 300 || gap > 1000) {
                logger.error('the valid range of onAudioLevelChange params "gap" is: > 300 && < 1000');
                return;
            }
            if (!handler) {
                this._audioLevelChangeHandler = null;
            }
            else {
                this._audioLevelChangeHandler = handler;
                this._timer = setInterval(this._audioLevelReport.bind(this), gap);
            }
        }
        clearAudioLevelReportTimer() {
            if (this._timer) {
                clearInterval(this._timer);
                this._timer = null;
            }
        }
    }

    const parseRoomData = (data) => {
        const result = {};
        const userIds = Object.keys(data.users);
        userIds.length && userIds.forEach(userId => {
            const tmp = [];
            const userData = data.users[userId];
            if (userData.uris) {
                try {
                    tmp.push(...JSON.parse(userData.uris));
                }
                catch (error) {
                    logger.warn(`invalid user data -> userId: ${userId}, userData: ${userData}`);
                }
            }
            result[userId] = tmp;
        });
        return result;
    };
    const getTrackIdFromAttr = (track) => {
        if (track instanceof RCTrack) {
            return track.getTrackId();
        }
        return track.track.getTrackId();
    };
    /**
     * 房间抽象基类
     */
    class RCAbstractRoom {
        constructor(_context, _runtime, _roomId, data, _roomMode, _service, _initOptions, _ntfClearRoomItem, isUpgrade) {
            this._context = _context;
            this._runtime = _runtime;
            this._roomId = _roomId;
            this._roomMode = _roomMode;
            this._service = _service;
            this._initOptions = _initOptions;
            this._ntfClearRoomItem = _ntfClearRoomItem;
            /**
             * 远端 track
             */
            this._remoteTracks = {};
            /**
             * 已订阅参数
             */
            this._subscribedList = [];
            this._destroyed = false;
            // 资源、人员变更消息需按队列逐个处理，确保内存状态不乱
            this.msgTaskQueue = new AsyncTaskQueue();
            this._appListener = null;
            this._token = data.token;
            this._sessionId = data.sessionId;
            /**
             * 解析房间数据
             * 1、正常加入房间解析房间数据
             * 2、升级房间后，不解析房间数据
             */
            if (isUpgrade) {
                this._roomResources = {};
            }
            else {
                this._roomResources = parseRoomData(data);
            }
            // 根据解析出来的数据构建远端流
            this._initRemoteTracks();
            const crtUserId = this._context.getCurrentId();
            const selfRes = this._roomResources[crtUserId] = this._roomResources[crtUserId] || [];
            logger.debug(`room data -> ${JSON.stringify(this._roomResources)}`);
            /*
             * 加入房间后，若房间中已存在己方发布的资源，表示之前未能完成正常退出流程
             * 需先清除房间内的己方资源，通知房间内其他人己方已取消当前资源的发布
             * 该步骤没有必要与 MediaServer 的交互，因后续资源变更交互为全量交互
             */
            selfRes.length > 0 && push(() => this._unpublishPrev(selfRes));
            /**
             * 观众升级为主播后不会收到全量 uri 消息，需直接触发人员、资源变更
             */
            isUpgrade && this._afterChangedRole(parseRoomData(data));
            // 开始心跳，心跳失败时主动退出房间
            this._pinger = new Pinger(_roomId, this._roomMode, _context, this._initOptions.pingGap);
            this._pinger.onFailed = this._kickoff.bind(this);
            this._pinger.onPingResult = this._handlePingResult.bind(this);
            this._pinger.start();
            this._polarisReport = new PolarisReporter(this._context, this._runtime, this._roomId, this);
            this._polarisReport.sendR1();
            this._pc = new RCRTCPeerConnection(this._reTryExchange.bind(this), this._polarisReport);
            this._pc.on(RCRTCPeerConnection.__INNER_EVENT_TRACK_READY__, this._onTrackReady, this);
            this._pc.on(RCLocalTrack.__INNER_EVENT_MUTED_CHANGE__, this._onLocalTrackMuted, this);
            this._pc.on(RCLocalTrack.__INNER_EVENT_DESTROY__, this._onLocalTrackDestroied, this);
        }
        _initRemoteTracks() {
            const crtUserId = this._context.getCurrentId();
            for (const userId in this._roomResources) {
                const resArr = this._roomResources[userId];
                if (userId === crtUserId || resArr.length === 0) {
                    continue;
                }
                resArr.forEach(item => {
                    const resourceId = getTrackId(item);
                    const { tag, userId, mediaType } = parseTrackId(resourceId);
                    const remoteTrack = mediaType === exports.RCMediaType.AUDIO_ONLY ? new RCRemoteAudioTrack(tag, userId) : new RCRemoteVideoTrack(tag, userId);
                    remoteTrack.__innerSetRemoteMuted(item.state === 0);
                    this._remoteTracks[resourceId] = remoteTrack;
                });
            }
        }
        _handlePingResult(result) {
            this._callAppListener('onPing', result);
        }
        /**
         * 设置房间上行资源的总码率配置
         * @description
         * * 自 v5.1.0 版本开始，推荐使用 `RCLocalTrack.setBitrate` 对不同流分别指定码率。
         * * 该方法仅在 SDP `plan-b` 协议下（Chrome 92 与 Safari 11 之前的版本）有效。
         * @param max 音视频发送码率上限，不可小于 200 且不可小于 `min`
         * @param min 音视频发送码率下限，默认值为 1，且不可小于 1，不可大于 `max`
         * @param start 起始码率，默认为码率上限的 70%
         */
        setBitrate(max, min, start) {
            logger.warn('`RCAbstractRoom.setBitrate` will be deprecated, use `RCLocalTrack.setBitrate` instead.');
            engine.assert('max', max, (value) => {
                return engine.isNumber(value) && value > Math.max(min || 1, 200);
            }, true);
            engine.assert('min', min, (value) => {
                return engine.isNumber(value) && value >= 1 && (engine.isNumber(max) ? value < max : true);
            }, true);
            engine.assert('start', start, (value) => {
                return engine.isNumber(value) && value > min && value <= max;
            });
            this._pc.setBitrate(max, min, start);
        }
        _onTrackReady(evt) {
            const msid = evt.streams[0].id;
            const track = evt.receiver.track;
            const trackId = [msid, track.kind === 'audio' ? exports.RCMediaType.AUDIO_ONLY : exports.RCMediaType.VIDEO_ONLY].join('_');
            const rTrack = this._remoteTracks[trackId];
            if (!rTrack) {
                logger.warn(`cannot found remote track ${track.id}`);
                return;
            }
            rTrack.__innerSetMediaStreamTrack(track);
            this._callAppListener('onTrackReady', rTrack);
        }
        _callAppListener(eventType, ...attrs) {
            var _a;
            const handle = (_a = this._appListener) === null || _a === void 0 ? void 0 : _a[eventType];
            if (!handle) {
                return;
            }
            try {
                handle(...attrs);
            }
            catch (error) {
                logger.error(error);
            }
        }
        _onUserUnpublish(tracks) {
            return __awaiter(this, void 0, void 0, function* () {
                // 需要替业务层取消订阅，业务层只需关注 UI 变化
                yield this.unsubscribe(tracks);
                tracks.forEach(item => {
                    item.__innerDestroy();
                    delete this._remoteTracks[item.getTrackId()];
                });
                this._onTrackUnpublish(tracks);
            });
        }
        _onTrackUnpublish(tracks) {
            this._callAppListener('onTrackUnpublish', tracks);
        }
        _unpublishPrev(selfRes) {
            return __awaiter(this, void 0, void 0, function* () {
                const tmpRes = selfRes.slice();
                // 清空已发布资源
                selfRes.length = 0;
                logger.info(`unpublish uris prev login: ${JSON.stringify(tmpRes)}`);
                // 添加请求队列并等待结果
                const code = yield this._context.setRTCTotalRes(this._roomId, buildPlusMessage(RCRTCMessageType.UNPUBLISH, tmpRes), buildTotalURIMessageContent([]), RCRTCMessageType.TOTAL_CONTENT_RESOURCE, buildTotalURIMessageContent([]));
                if (code !== engine.ErrorCode.SUCCESS) {
                    logger.error(`unpublish prev uris failed -> code: ${code}`);
                }
                else {
                    logger.debug('unpublish uris prev login succeed');
                }
            });
        }
        __parseInnerMessage(message) {
            const { targetId: roomId, conversationType } = message;
            // 过滤非 RTC 消息
            if (conversationType !== engine.ConversationType.RTC_ROOM) {
                return false;
            }
            // 为 RTC 消息，但不属于当前房间，不处理
            if (roomId !== this._roomId) {
                return true;
            }
            logger.info(`recv inner msg -> message: ${JSON.stringify(message)} | roomid: ${this._roomId}`);
            const content = message.content;
            switch (message.messageType) {
                case RCRTCMessageType.KICK:
                    this._kickoff(true, content);
                    break;
                case RCRTCMessageType.STATE:
                    this.msgTaskQueue.push(() => this._stateHandle(content));
                    break;
                case RCRTCMessageType.MODIFY:
                case RCRTCMessageType.PUBLISH:
                case RCRTCMessageType.UNPUBLISH:
                case RCRTCMessageType.TOTAL_CONTENT_RESOURCE:
                    this.msgTaskQueue.push(() => this._resourceHandle(content, message.messageType, message.senderUserId));
                    break;
                case RCRTCMessageType.ROOM_NOTIFY:
                    this._callAppListener('onRoomAttributeChange', message.messageType, message.content);
                    break;
                case RCRTCMessageType.USER_NOTIFY:
                    logger.warn(`TODO: ${RCRTCMessageType.USER_NOTIFY}`);
                    break;
                default:
                    this._callAppListener('onMessageReceive', message.messageType, message.content, message.senderUserId, message.messageUId);
                    break;
            }
            return true;
        }
        /**
         * 被踢出房间通知
         * @param byServer
         * * 当值为 false 时，说明本端 rtcPing 超时
         * * 当值为 true 时，说明本端收到被踢出房间通知
         */
        _kickoff(byServer, content) {
            logger.warn(`onKickOff -> byServer: ${byServer}`);
            this._ntfClearRoomItem();
            this._leaveHandle(!byServer);
            let kickType;
            if (byServer) {
                ((content === null || content === void 0 ? void 0 : content.users) || []).forEach(item => {
                    if (item.userId === this._context.getCurrentId()) {
                        kickType = item.type;
                    }
                });
            }
            this._callAppListener('onKickOff', byServer, kickType);
        }
        _rtcpeerClosed() {
            this._ntfClearRoomItem();
            this._leaveHandle(true);
            this._callAppListener('onRTCPeerConnectionCloseByException');
        }
        /**
         * 处理资源变更事件
         * @param content
         * @param messageType 消息类型
         * @param userId 消息发送者
         */
        _resourceHandle(content, messageType, userId) {
            return __awaiter(this, void 0, void 0, function* () {
                const roomStatusCode = this._assertRoomDestroyed();
                if (roomStatusCode) {
                    logger.warn(`room has been destroyed. -> roomId: ${this._roomId}`);
                    return;
                }
                const { uris, ignore } = content;
                if (ignore) {
                    return;
                }
                const publishedList = [];
                const unpublishedList = [];
                const modifiedList = [];
                let parseData;
                // 当前资源清单
                const nowResources = this._roomResources[userId] || (this._roomResources[userId] = []);
                switch (messageType) {
                    case RCRTCMessageType.MODIFY:
                        modifiedList.push(...uris);
                        break;
                    case RCRTCMessageType.PUBLISH:
                        publishedList.push(...uris);
                        break;
                    case RCRTCMessageType.UNPUBLISH:
                        unpublishedList.push(...uris);
                        break;
                    case RCRTCMessageType.TOTAL_CONTENT_RESOURCE:
                        // 比对本地资源，找出被移除资源、新增资源、被修改资源
                        parseData = diffPublishResources(nowResources, uris);
                        publishedList.push(...parseData.publishedList);
                        unpublishedList.push(...parseData.unpublishedList);
                        modifiedList.push(...parseData.modifiedList);
                        break;
                }
                if (publishedList.length > 0) {
                    // published 资源包含当前房间已存在资源二次发布，uri 有变更
                    const ids = nowResources.map(getTrackId);
                    // 对方重新发布且己方已订阅的资源
                    const subedTracks = [];
                    const newTracks = [];
                    publishedList.forEach(item => {
                        const resourceId = getTrackId(item);
                        const index = ids.indexOf(resourceId);
                        const { userId, tag, mediaType } = parseTrackId(resourceId);
                        if (index > -1) {
                            nowResources[index] = item;
                        }
                        else {
                            nowResources.push(item);
                        }
                        let rTrack = this._remoteTracks[resourceId];
                        // 二次发布的资源，直接更新
                        if (rTrack) {
                            if (rTrack.isSubscribed()) {
                                subedTracks.push(rTrack);
                            }
                        }
                        else {
                            rTrack = mediaType === exports.RCMediaType.AUDIO_ONLY ? new RCRemoteAudioTrack(tag, userId) : new RCRemoteVideoTrack(tag, userId);
                            this._remoteTracks[resourceId] = rTrack;
                            newTracks.push(rTrack);
                        }
                        rTrack.__innerSetRemoteMuted(item.state === 0);
                    });
                    // 重新订阅二次发布资源
                    if (subedTracks.length) {
                        const trackIds = subedTracks.map(item => item.getTrackId());
                        logger.debug(`resub tracks -> ${JSON.stringify(trackIds)}`);
                        const { code } = yield push(() => this.__subscribe(subedTracks, true));
                        if (code !== exports.RCRTCCode.SUCCESS) {
                            logger.error(`resub tracks failed -> code: ${code}, ids: ${JSON.stringify(trackIds)}`);
                        }
                    }
                    this._onTrackPublish(newTracks);
                }
                if (unpublishedList.length > 0) {
                    const resIds = unpublishedList.map(getTrackId);
                    for (let i = nowResources.length - 1; i >= 0; i -= 1) {
                        const item = nowResources[i];
                        if (resIds.includes(getTrackId(item))) {
                            nowResources.splice(i, 1);
                        }
                    }
                    const tracks = unpublishedList.map(item => {
                        const trackId = getTrackId(item);
                        return this._remoteTracks[trackId];
                    });
                    yield this._onUserUnpublish(tracks);
                }
                if (modifiedList.length > 0) {
                    const resIds = nowResources.map(getTrackId);
                    for (let i = 0; i < modifiedList.length; i += 1) {
                        const item = modifiedList[i];
                        const id = getTrackId(item);
                        // 更新资源 state
                        const index = resIds.indexOf(id);
                        nowResources[index].state = item.state;
                        const rTrack = this._remoteTracks[id];
                        rTrack.__innerSetRemoteMuted(item.state === 0);
                        rTrack.isAudioTrack() ? this._onAudioMuteChange(rTrack) : this._onVideoMuteChange(rTrack);
                    }
                }
            });
        }
        _onTrackPublish(tracks) {
            this._callAppListener('onTrackPublish', tracks);
        }
        /**
         * 处理 `RCRTCMessageType.STATE` 消息
         * @param content
         */
        _stateHandle(content) {
            return __awaiter(this, void 0, void 0, function* () {
                const { users } = content;
                if (users.length === 0) {
                    return;
                }
                const joined = [];
                const left = [];
                users.forEach(item => {
                    if (+item.state === 0) {
                        logger.debug(`user joined -> ${item.userId}`);
                        // 对端 im 重连之后调加入房间信令获取最新数据，服务会给本端下发“对端加入房间”的消息，本端内存已包含对端人员，所以需过滤掉
                        !this._roomResources[item.userId] && joined.push(item.userId);
                        this._roomResources[item.userId] = this._roomResources[item.userId] || [];
                    }
                    else {
                        logger.debug(`user left -> ${item.userId}`);
                        left.push(item.userId);
                    }
                });
                // 用户离开房间时，自动退订对方资源
                if (left.length > 0) {
                    const tracks = [];
                    const userIds = [];
                    left.forEach(userId => {
                        tracks.push(...this.getRemoteTracksByUserId(userId));
                        // 先暂存待删用户，因当前异步队列中可能存在等待中的待处理任务，需要当前房间数据状态
                        // delete this._roomResources[userId]
                        userIds.push(userId);
                    });
                    if (tracks.length) {
                        yield this.unsubscribe(tracks);
                        tracks.forEach((item) => delete this._remoteTracks[item.getTrackId()]);
                    }
                    // 等待队列执行完成后清除内存数据
                    if (userIds.length) {
                        userIds.forEach(userId => delete this._roomResources[userId]);
                    }
                }
                // 通知业务层
                joined.length > 0 && this._callAppListener('onUserJoin', joined);
                left.length > 0 && this._callAppListener('onUserLeave', left);
            });
        }
        /**
         * 获取房间 Id
         */
        getRoomId() {
            return this._roomId;
        }
        /**
         * 获取当前 userId
         */
        getCrtUserId() {
            return this._context.getCurrentId();
        }
        /**
         * 获取 _pc 实例
         */
        __getPC() {
            return this._pc;
        }
        /**
         * 获取远程用户列表，不包含当前用户
         */
        getRemoteUserIds() {
            const crtUserId = this._context.getCurrentId();
            return Object.keys(this._roomResources).filter(userId => userId !== crtUserId);
        }
        /**
         * 获取所有房间已发布的远端资源列表
         * @returns
         */
        getRemoteTracks() {
            const tracks = [];
            this.getRemoteUserIds().forEach(id => {
                tracks.push(...this.getRemoteTracksByUserId(id));
            });
            return tracks;
        }
        /**
         * 获取远端用户的资源列表
         * @param userId
         * @returns
         */
        getRemoteTracksByUserId(userId) {
            const tracks = [];
            for (const trackId in this._remoteTracks) {
                const track = this._remoteTracks[trackId];
                if (track.getUserId() === userId) {
                    tracks.push(track);
                }
            }
            return tracks;
        }
        /**
         * 获取房间当前会话 Id，当房间内已无成员时房间会回收，重新加入时 sessionId 将更新
         */
        getSessionId() {
            return this._sessionId;
        }
        /**
         * 向房间内发消息
         * @param name 消息名称
         * @param content 消息内容
         */
        sendMessage(name, content) {
            return __awaiter(this, void 0, void 0, function* () {
                // 该接口只能用于发状态消息
                const { code } = yield this._context.sendMessage(engine.ConversationType.RTC_ROOM, this._roomId, {
                    messageType: name,
                    content,
                    isStatusMessage: true
                });
                if (code !== engine.ErrorCode.SUCCESS) {
                    logger.error(`send message failed -> code: ${code}`);
                    return { code: exports.RCRTCCode.SIGNAL_ERROR };
                }
                return { code: exports.RCRTCCode.SUCCESS };
            });
        }
        /**
         * 设置房间属性
         * @param key 属性名
         * @param value 属性值
         * @param message 是否在设置属性的时候携带消息内容，传空则不往房间中发送消息
         * @param isInner RTC 业务内部使用参数，用户忽略
         */
        setRoomAttribute(key, value, message, isInner = false) {
            return __awaiter(this, void 0, void 0, function* () {
                const code = yield this._context.setRTCData(this._roomId, key, value, isInner, engine.RTCApiType.ROOM, message);
                if (code !== engine.ErrorCode.SUCCESS) {
                    logger.error(`SetRoomAttributeValue Failed: ${code}`);
                    return { code: exports.RCRTCCode.SIGNAL_ERROR };
                }
                return { code: exports.RCRTCCode.SUCCESS };
            });
        }
        /**
         * 删除房间属性
         * @param keys 待删除的属性名数组
         * @param message 是否在删除属性的时候携带消息内容，传空则不往房间中发送消息
         * @param isInner RTC 业务内部使用参数，用户忽略
         */
        deleteRoomAttributes(keys, message, isInner = false) {
            return __awaiter(this, void 0, void 0, function* () {
                const code = yield this._context.removeRTCData(this._roomId, keys, isInner, engine.RTCApiType.ROOM, message);
                if (code !== engine.ErrorCode.SUCCESS) {
                    logger.error(`DeleteRoomAttribute Failed: ${code}`);
                    return { code: exports.RCRTCCode.SIGNAL_ERROR };
                }
                return { code: exports.RCRTCCode.SUCCESS };
            });
        }
        /**
         * 获取房间属性
         * @param keys 要查询的属性名数组，当数组长度为空时，取所有已设置的 kv 值
         * @param isInner RTC 业务内部使用参数，用户忽略
         */
        getRoomAttributes(keys = [], isInner = false) {
            return __awaiter(this, void 0, void 0, function* () {
                const { code, data } = yield this._context.getRTCData(this._roomId, keys, isInner, engine.RTCApiType.ROOM);
                if (code !== engine.ErrorCode.SUCCESS) {
                    logger.error(`GetRoomAttributes Failed: ${code}`);
                    return { code: exports.RCRTCCode.SIGNAL_ERROR };
                }
                return { code: exports.RCRTCCode.SUCCESS, data };
            });
        }
        /**
         * 设置当前用户属性（暂不开放）
         * @param key 属性名
         * @param value 属性值
         * @param message 是否在设置属性的时候携带消息内容，传空则不往房间中发送消息
         */
        _setUserAttributeValue(key, value, message) {
            return this._context.setRTCData(this._roomId, key, value, false, engine.RTCApiType.PERSON, message);
        }
        /**
         * 删除当前用户属性（暂不开放）
         * @param keys 待删除的属性名数组
         * @param message 是否在删除属性的时候携带消息内容，传空则不往房间中发送消息
         */
        _deleteUserAttributes(keys, message) {
            return this._context.removeRTCData(this._roomId, keys, false, engine.RTCApiType.PERSON, message);
        }
        /**
         * 获取当前用户属性（暂不开放）
         * @param keys 要查询的属性名数组
         */
        _getUserAttributes(keys) {
            return this._context.getRTCData(this._roomId, keys, false, engine.RTCApiType.PERSON);
        }
        /**
         * 查询房间是否已销毁
         */
        isDestroyed() {
            return this._destroyed;
        }
        /**
         * 退出并销毁当前房间实例，退出后该房间的所有方法将不可用
         */
        __destroy(quitRoom) {
            return this._leaveHandle(quitRoom);
        }
        _leaveHandle(quitRoom) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                if (this._destroyed) {
                    return;
                }
                this._destroyed = true;
                // 清除音量上报定时器
                (_a = this._audioLevelReport) === null || _a === void 0 ? void 0 : _a.clearAudioLevelReportTimer();
                if (quitRoom) {
                    // 退出 signal 房间
                    yield this._context.quitRTCRoom(this._roomId);
                }
                this._pc.removeAllLocalTrack();
                // 停止 rtcPing 计时
                this._pinger.stop();
                // 中断与 MediaServer 的 UDP 连接
                yield this._service.exit(this._getRTCReqestHeaders());
                // 销毁 pc 连接
                this._pc.destroy();
                // 销毁 polarisReport 实例
                this._polarisReport = null;
                // 销毁远端资源
                this._removeRemoteTracks();
            });
        }
        _onLocalTrackDestroied(localTrack) {
            // 本地流已销毁，需取消发布此流(排除小流)
            const isTinyVideoTrack = (localTrack instanceof RCLocalVideoTrack) && localTrack.__isTiny();
            if (!isTinyVideoTrack) {
                this.unpublish([localTrack]);
            }
        }
        /**
         * 本端流状态修改，需通知房间内其他成员
         * @param localTrack
         */
        _onLocalTrackMuted(localTrack) {
            return __awaiter(this, void 0, void 0, function* () {
                const trackId = localTrack.getTrackId();
                const crtUserId = this._context.getCurrentId();
                const enabled = !localTrack.isLocalMuted();
                // 本地资源，需同步房间状态
                const localResource = [{ resourceId: trackId, enabled }];
                // 计算更新后的全量资源数据
                const publishedList = this._roomResources[crtUserId] || [];
                // 增量数据
                const plusList = [];
                for (let i = 0; i < publishedList.length; i += 1) {
                    const item = publishedList[i];
                    const id = getTrackId(item);
                    const index = localResource.findIndex(item => item.resourceId === id);
                    if (index >= 0) {
                        const { enabled } = localResource[index];
                        item.state = enabled ? 1 : 0;
                        plusList.push(item);
                        break;
                    }
                }
                const code = yield push(() => this._context.setRTCTotalRes(this._roomId, buildPlusMessage(RCRTCMessageType.MODIFY, plusList), buildTotalURIMessageContent(publishedList), RCRTCMessageType.TOTAL_CONTENT_RESOURCE));
                if (code !== engine.ErrorCode.SUCCESS) {
                    logger.error('notice `track.enabled` change failed -> code: ' + code);
                }
            });
        }
        /**
         * 发布默认流，默认流的 TAG 为 `RongCloudRTC`，分辨率 640*480，帧率 15 帧
         * @param pubTiny 是否同步发小流
         */
        // async publishDefault (pubTiny: boolean = false): Promise<{ code: RCRTCCode, tracks: RCLocalTrack[] }> {
        //   throw new Error('TODO')
        // }
        /**
         * 从 pc 移除当次发布失败的资源
         */
        _removePubFailedTracks(tracks) {
            tracks.forEach(item => {
                const track = item instanceof RCLocalTrack ? item : item.track;
                logger.debug(`remove pub failed track from peerconnection -> trackId: ${track.getTrackId()}`);
                this._pc.removeLocalTrackById(track.getTrackId());
            });
        }
        /**
         * 增量发布资源，若发布的资源 tag 及媒体类型重复，后者将覆盖前者进行发布。
         * @param tracks 待发布的 RCLocalTrack 实例
         * @returns
         */
        publish(tracks) {
            return __awaiter(this, void 0, void 0, function* () {
                return push(() => this.__publish(tracks));
            });
        }
        __publish(tracks) {
            return __awaiter(this, void 0, void 0, function* () {
                const roomStatusCode = this._assertRoomDestroyed();
                if (roomStatusCode) {
                    logger.error(`publish failed, room has been destroyed. -> roomId: ${this._roomId}`);
                    return { code: exports.RCRTCCode.ROOM_HAS_BEEN_DESTROYED };
                }
                if (!engine.validate('tracks', tracks, () => {
                    return engine.isArray(tracks) && tracks.length > 0 && tracks.every(item => item instanceof RCLocalTrack || item.track instanceof RCLocalTrack);
                }, true)) {
                    logger.error(`publish failed, tracks is invalid -> roomId: ${this._roomId}`);
                    return { code: exports.RCRTCCode.PARAMS_ERROR };
                }
                const userId = this._context.getCurrentId();
                const pubedTrackNum = this._pc.getLocalTracks().length;
                if (pubedTrackNum + calcTracksNum(tracks) > 10) {
                    logger.error(`publish failed, tracks limit exceeded -> roomId: ${this._roomId}`);
                    return { code: exports.RCRTCCode.PUBLISH_TRACK_LIMIT_EXCEEDED };
                }
                logger.debug(`publish tracks -> roomId: ${this._roomId}, tracks: ${tracks.map(getTrackIdFromAttr)}`);
                /*
                 * 资源发布应先与 mediaserver 交换资源，建 PeerConnection 通道，后通知房间
                 * 资源取消发布则应先通知取消发布，后与 mediaServer 协商取消资源发布
                 */
                tracks.forEach(track => {
                    // 向 RTCPeerConnection 添加轨道数据
                    const { track: localTrack, pubTiny } = track instanceof RCLocalTrack ? { pubTiny: false, track } : track;
                    this._pc.addLocalTrack(localTrack);
                    // 拷贝生成小流并添加至 RTCPeerConnection
                    if (localTrack.isVideoTrack()) {
                        if (pubTiny) {
                            let cloneTrack;
                            try {
                                cloneTrack = localTrack.__innerGetMediaStreamTrack().clone();
                                const rcFrameRate = pubTiny.frameRate || exports.RCFrameRate.FPS_15;
                                const resolution = pubTiny.resolution || exports.RCResolution.W176_H144;
                                const { width, height } = transResolution(resolution);
                                const frameRate = transFrameRate(rcFrameRate);
                                cloneTrack.applyConstraints({ width, height, frameRate });
                            }
                            catch (error) {
                                cloneTrack === null || cloneTrack === void 0 ? void 0 : cloneTrack.stop();
                                logger.warn(`pubTiny failed -> id: ${localTrack.getTrackId()}, msg: ${error.message}`);
                                return;
                            }
                            this._pc.addLocalTrack(new RCLocalVideoTrack(localTrack.getTag(), localTrack.getUserId(), cloneTrack, true));
                        }
                    }
                });
                // 客户端主动调用 api 发请求时，清除 ice 断线重连的定时器
                this._pc.clearReTryExchangeTimer();
                // 发送 /exchange 请求
                const reqBody = yield this._createExchangeParams(this._subscribedList, false);
                const resp = yield this._exchangeHandle(reqBody);
                if (resp.code !== exports.RCRTCCode.SUCCESS) {
                    // TODO: 资源发送失败，需要移除已添加至 RTCPeerConnection 中的资源信息
                    logger.error(`publish failed -> roomId: ${this._roomId}, code: ${resp.code}`);
                    this._removePubFailedTracks(tracks);
                    return { code: resp.code };
                }
                const { publishList, sdp: answer, resultCode: code, message, urls, mcuPublishList } = resp.data;
                if (code !== exports.RCRTCCode.SUCCESS) {
                    // TODO: 资源发送失败，需要移除已添加至 RTCPeerConnection 中的资源信息
                    logger.error(`publish failed -> roomId: ${this._roomId}, code: ${code}, msg: ${message}`);
                    this._removePubFailedTracks(tracks);
                    return { code };
                }
                const resCode = yield this._pc.setRemoteAnswer(answer.sdp);
                if (resCode !== exports.RCRTCCode.SUCCESS) {
                    return { code: resCode };
                }
                // 计算资源发布后相比于当前内存态数据的增量数据，发布的全量数据，计算完成后通知房间成员
                const oldPublisheList = this._roomResources[userId];
                // 当前已发布的全量资源数据
                const newPublishList = publishList.map(item => (Object.assign({ tag: item.msid.split('_').pop(), state: this._getResourceState(getTrackId(item)) }, item)));
                // 计算此次发布的增量资源数据
                const { publishedList: plus } = diffPublishResources(oldPublisheList, newPublishList);
                // 当前直播间 mcuPublist
                const newMcuPublishList = (mcuPublishList === null || mcuPublishList === void 0 ? void 0 : mcuPublishList.map(item => (Object.assign({ tag: item.msid.split('_').pop(), state: 1 }, item)))) || [];
                // 通知房间成员
                const errorCode = yield this._context.setRTCTotalRes(this._roomId, buildPlusMessage(RCRTCMessageType.PUBLISH, plus), buildTotalURIMessageContent(newPublishList), RCRTCMessageType.TOTAL_CONTENT_RESOURCE, buildTotalURIMessageContent(newMcuPublishList));
                if (errorCode !== engine.ErrorCode.SUCCESS) {
                    // TODO: 确认移动端在发布资源后通知失败的处理逻辑，尽量三端统一
                    logger.error(`send publish streams notification failed: ${errorCode}`);
                    return { code: exports.RCRTCCode.SIGNAL_ERROR };
                }
                // 更新已发布资源列表
                this._roomResources[userId] = newPublishList;
                const publishTrackIds = plus.map(item => { return getTrackId(item); });
                // 北极星数据上报
                if (this._polarisReport) {
                    this._polarisReport.sendR2(R2Action.PUBLISH, R2Status.BEGIN, publishTrackIds);
                }
                /**
                 * 修改 localTrack 发布状态
                 */
                tracks.forEach((item) => {
                    const { track: localTrack } = item instanceof RCLocalTrack ? { track: item } : item;
                    localTrack.__innerSetPublished(true);
                });
                logger.debug(`publish success: ${publishTrackIds.join(',')}`);
                if (this._roomMode === engine.RTCMode.LIVE) {
                    return { code: exports.RCRTCCode.SUCCESS, liveUrl: urls === null || urls === void 0 ? void 0 : urls.liveUrl };
                }
                return { code: exports.RCRTCCode.SUCCESS };
            });
        }
        /**
         * ice 断线后，尝试重新走 exchange
         */
        _reTryExchange() {
            return __awaiter(this, void 0, void 0, function* () {
                push(() => __awaiter(this, void 0, void 0, function* () {
                    const reqBody = yield this._createExchangeParams(this._subscribedList, true);
                    // 发送 /exchange 请求
                    const resp = yield this._exchangeHandle(reqBody);
                    if (resp.code !== exports.RCRTCCode.SUCCESS) {
                        logger.error(`reTryExchange failed: ${resp.code}`);
                        return { code: resp.code };
                    }
                    const { sdp: answer, resultCode } = resp.data;
                    if (resultCode !== exports.RCRTCCode.SUCCESS) {
                        logger.error(`reTryExchange failed: ${resultCode}`);
                        return { code: resultCode };
                    }
                    // 请求成功，清除 ice 断线重连的定时器
                    this._pc.clearReTryExchangeTimer();
                    const resCode = yield this._pc.setRemoteAnswer(answer.sdp);
                    if (resCode !== exports.RCRTCCode.SUCCESS) {
                        return { code: resCode };
                    }
                }));
            });
        }
        _exchangeHandle(body) {
            return this._service.exchange(this._getRTCReqestHeaders(), body);
        }
        _getRTCReqestHeaders() {
            return {
                'App-Key': this._context.getAppkey(),
                RoomId: this._roomId,
                Token: this._token,
                RoomType: this._roomMode,
                UserId: this._context.getCurrentId()
            };
        }
        /**
         * 获取 exchange 接口的请求体数据
         * @param subscribeList 订阅清单
         * @param iceRestart
         */
        _createExchangeParams(subscribeList, iceRestart) {
            return __awaiter(this, void 0, void 0, function* () {
                const offer = yield this._pc.createOffer(iceRestart);
                const reqBody = {
                    sdp: offer,
                    extend: JSON.stringify({
                        resolutionInfo: this._pc.getOutboundVideoInfo()
                    }),
                    /**
                     * 需过滤房间内不存在的资源
                     */
                    subscribeList: subscribeList.filter((item) => {
                        const trackId = item.track.getTrackId();
                        const { userId } = helper.parseTrackId(trackId);
                        const isInclude = this._roomResources[userId].filter(item => trackId === `${item.msid}_${item.mediaType}`).length;
                        return isInclude;
                    }).map(item => ({
                        simulcast: item.subTiny ? RCStreamType.TINY : RCStreamType.NORMAL,
                        resolution: '',
                        uri: this._getResourceById(item.track.getTrackId()).uri
                    })),
                    switchstream: false
                    // switchstream: !!this._initOptions.autoSwitchStream
                };
                return reqBody;
            });
        }
        /**
         * 获取已发布资源的 state 数据
         * @param trackId
         */
        _getResourceState(trackId) {
            var _a;
            return ((_a = this.getLocalTrack(trackId)) === null || _a === void 0 ? void 0 : _a.isLocalMuted()) ? 0 : 1;
        }
        /**
         * 增量取消资源发布，若相应资源中存在小流资源，则同时取消发布
         * @param resourceIds 取消发布的资源 Id 列表
         */
        unpublish(tracks) {
            return __awaiter(this, void 0, void 0, function* () {
                return push(() => this.__unpublish(tracks));
            });
        }
        __unpublish(tracks) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                const roomStatusCode = this._assertRoomDestroyed();
                if (roomStatusCode) {
                    logger.warn(`room has been destroyed, no need to unpublish tracks -> roomId: ${this._roomId}`);
                    return { code: exports.RCRTCCode.SUCCESS };
                }
                const crtUserId = this._context.getCurrentId();
                // 参数有效性验证
                const valid = engine.validate('tracks', tracks, () => {
                    return tracks.every(track => track.getUserId() === crtUserId && track instanceof RCLocalTrack);
                }, true);
                if (!valid) {
                    logger.warn(`unpublish failed, tracks is invalid -> roomId: ${this._roomId}, tracks: ${tracks.map(getTrackIdFromAttr)}`);
                    return { code: exports.RCRTCCode.PARAMS_ERROR };
                }
                const resourceIds = tracks.map(item => item.getTrackId());
                // 过滤无效参数，避免重复有异常数据导致其他端解析失败
                const unpublishList = resourceIds.map(this._getResourceById.bind(this)).filter(item => !!item);
                if (unpublishList.length === 0) {
                    return { code: exports.RCRTCCode.SUCCESS };
                }
                const publishedList = this._roomResources[crtUserId];
                // 取消发布后的差集
                const dList = publishedList.filter(item => !unpublishList.includes(item));
                // 移除 RTCPeerConnection 中添加的轨道数据
                resourceIds.forEach(id => this._pc.removeLocalTrackById(id));
                // 北极星上报
                (_a = this._polarisReport) === null || _a === void 0 ? void 0 : _a.sendR2(R2Action.PUBLISH, R2Status.END, resourceIds);
                // 客户端主动调用 api 发请求时，清除 ice 断线重连的定时器
                this._pc.clearReTryExchangeTimer();
                const reqBody = yield this._createExchangeParams(this._subscribedList, false);
                const result = yield this._exchangeHandle(reqBody);
                if (result.code !== exports.RCRTCCode.SUCCESS) {
                    logger.error(`exchange failed -> code: ${result.code}`);
                    return { code: result.code };
                }
                const { publishList, sdp: answer, resultCode, message, mcuPublishList } = result.data;
                if (resultCode !== exports.RCRTCCode.SUCCESS) {
                    logger.error(`unpublish streams failed -> code: ${resultCode}, msg: ${message}`);
                    // return { code: resultCode }
                }
                // 通知房间内成员
                // 当前直播间 mcuPublist
                const newMcuPublishList = mcuPublishList ? mcuPublishList.map(item => (Object.assign({ tag: item.msid.split('_').pop(), state: 1 }, item))) : [];
                const singalCode = yield this._context.setRTCTotalRes(this._roomId, buildPlusMessage(RCRTCMessageType.UNPUBLISH, unpublishList), buildTotalURIMessageContent(dList), RCRTCMessageType.TOTAL_CONTENT_RESOURCE, buildTotalURIMessageContent(newMcuPublishList));
                if (singalCode !== engine.ErrorCode.SUCCESS) {
                    logger.error('send unpublish notification failed:', singalCode);
                    return { code: exports.RCRTCCode.SIGNAL_ERROR };
                }
                logger.debug(`unpublish success -> tracks: ${resourceIds.join(',')}`);
                const resCode = yield this._pc.setRemoteAnswer(answer.sdp);
                if (resCode !== exports.RCRTCCode.SUCCESS) {
                    return { code: resCode };
                }
                const newPublishList = publishList.map(item => (Object.assign({ tag: item.msid.split('_').pop(), state: this._getResourceState(getTrackId(item)) }, item)));
                this._roomResources[crtUserId] = newPublishList;
                return { code: exports.RCRTCCode.SUCCESS };
            });
        }
        /**
         * 根据资源 Id 获取资源数据
         * @param resourceId
         */
        _getResourceById(resourceId) {
            const { userId } = parseTrackId(resourceId);
            return this._roomResources[userId].find(item => getTrackId(item) === resourceId);
        }
        /**
         * resourceId 有效性验证
         * @param resourceId
         */
        _isValidResourceId(resourceId) {
            var _a;
            const { userId } = parseTrackId(resourceId);
            return !!((_a = this._roomResources[userId]) === null || _a === void 0 ? void 0 : _a.find(item => getTrackId(item) === resourceId));
        }
        /**
         * 订阅资源
         * @param tracks
         */
        subscribe(tracks) {
            return __awaiter(this, void 0, void 0, function* () {
                return push(() => this.__subscribe(tracks, false));
            });
        }
        __subscribe(tracks, forceReq = false) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                const roomStatusCode = this._assertRoomDestroyed();
                if (roomStatusCode) {
                    logger.error(`subscribe failed, room has been destroyed -> roomId: ${this._roomId}`);
                    return { code: exports.RCRTCCode.ROOM_HAS_BEEN_DESTROYED };
                }
                if (!engine.validate('tracks', tracks, () => {
                    return engine.isArray(tracks) && tracks.length > 0 && tracks.every(item => {
                        return item instanceof RCRemoteTrack || item.track instanceof RCRemoteTrack;
                    });
                }, true)) {
                    logger.error(`subscribe failed, tracks is invalid -> roomId: ${this._roomId}`);
                    return { code: exports.RCRTCCode.PARAMS_ERROR };
                }
                logger.info(`subscribe -> roomId: ${this._roomId}, tracks: ${tracks.map(getTrackIdFromAttr)}`);
                const crtSubList = this._subscribedList.map(item => (Object.assign({}, item)));
                const attrs = tracks.map(item => {
                    return item instanceof RCRemoteTrack ? { track: item } : item;
                });
                let changed = false;
                const R2TrackIds = [];
                attrs.forEach(item => {
                    const trackId = item.track.getTrackId();
                    R2TrackIds.push(trackId);
                    const crt = crtSubList.find(tmp => tmp.track.getTrackId() === trackId);
                    if (crt && crt.subTiny === item.subTiny) {
                        return;
                    }
                    if (crt) {
                        crt.subTiny = item.subTiny;
                    }
                    else {
                        crtSubList.push(item);
                    }
                    changed = true;
                });
                if (!changed && !forceReq) {
                    return { code: exports.RCRTCCode.SUCCESS };
                }
                // 北极星上报
                (_a = this._polarisReport) === null || _a === void 0 ? void 0 : _a.sendR2(R2Action.SUBSCRIBE, R2Status.BEGIN, R2TrackIds);
                return this._updateSubListHandle(crtSubList, true);
            });
        }
        /**
         * 取消订阅资源
         * @param tracks 预取消远端资源
         */
        unsubscribe(tracks) {
            return __awaiter(this, void 0, void 0, function* () {
                return push(() => this.__unsubscribe(tracks));
            });
        }
        __unsubscribe(tracks) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                const roomStatusCode = this._assertRoomDestroyed();
                if (roomStatusCode) {
                    logger.warn(`room has beed destroyed, no need to unsubscribe tracks -> roomId: ${this._roomId}`);
                    return { code: exports.RCRTCCode.SUCCESS };
                }
                if (!engine.validate('tracks', tracks, () => {
                    return engine.isArray(tracks) && tracks.length > 0 && tracks.every(item => item instanceof RCRemoteTrack);
                }, true)) {
                    logger.error(`unsubscribe failed, tracks is invalid -> roomId: ${this._roomId}`);
                    return { code: exports.RCRTCCode.PARAMS_ERROR };
                }
                logger.info(`unsubscribe -> roomId: ${this._roomId}, tracks: ${tracks.map(getTrackIdFromAttr)}`);
                // 计算剩余订阅列表
                const crtSubList = this._subscribedList.map(item => (Object.assign({}, item))).filter(item => !tracks.includes(item.track));
                // 北极星上报
                (_a = this._polarisReport) === null || _a === void 0 ? void 0 : _a.sendR2(R2Action.SUBSCRIBE, R2Status.END, tracks.map(item => item.getTrackId()));
                return this._updateSubListHandle(crtSubList, false);
            });
        }
        _assertRoomDestroyed() {
            if (this._destroyed) {
                const msg = 'This room has been destroyed. Please use `RCRTCClient.joinRTCRoom` or `RCRTCClient.joinLivingRoom` to catch another instance.';
                logger.warn(msg);
                return exports.RCRTCCode.ROOM_HAS_BEEN_DESTROYED;
            }
        }
        /**
         * 获取已发布的本地资源
         * @param trackId
         * @returns
         */
        getLocalTrack(trackId) {
            return this._pc.getLocalTrack(trackId);
        }
        /**
         * 获取所有已发布的资源
         */
        getLocalTracks() {
            return this._pc.getLocalTracks();
        }
        /**
         * 根据 trackId 获取房间内的远端资源
         * @param trackId
         * @returns
         */
        getRemoteTrack(trackId) {
            return this._remoteTracks[trackId] || null;
        }
        /**
         * 强制修改订阅列表，仅订阅数组中的资源，取消订阅其他已订阅资源。
         * 当参数为 `[]` 时，意味着不再订阅任何资源
         * @param tracks 变更的资源列表
         */
        updateSubList(tracks) {
            return __awaiter(this, void 0, void 0, function* () {
                return push(() => this._updateSubListHandle(tracks, false));
            });
        }
        _updateSubListHandle(tracks, forceReq = false) {
            return __awaiter(this, void 0, void 0, function* () {
                const roomStatusCode = this._assertRoomDestroyed();
                if (roomStatusCode) {
                    return { code: exports.RCRTCCode.ROOM_HAS_BEEN_DESTROYED };
                }
                if (!engine.validate('resources', tracks, () => {
                    return engine.isArray(tracks) && tracks.every(res => {
                        return res instanceof RCRemoteTrack || res.track instanceof RCRemoteTrack;
                    });
                }, true)) {
                    logger.error(`update sublist failed, tracks is invalid -> roomId: ${this._roomId}`);
                    return { code: exports.RCRTCCode.PARAMS_ERROR };
                }
                logger.info(`update subscribe list -> roomId: ${this._roomId}, forceReq: ${forceReq}, tracks: ${tracks.map(getTrackIdFromAttr)}`);
                let attrs = tracks.map(item => {
                    return item instanceof RCRemoteTrack ? { track: item } : Object.assign({}, item);
                });
                // resourceId 去重，并做数据深拷贝
                const map = {};
                attrs = attrs.filter(res => {
                    const trackId = res.track.getTrackId();
                    // 已不在远端资源列表中，无需订阅/取消订阅
                    if (!this._remoteTracks[trackId]) {
                        logger.warn(`track cannot found in room -> trackId: ${trackId}`);
                        return false;
                    }
                    if (map[trackId]) {
                        return false;
                    }
                    return (map[trackId] = true);
                }).map(item => (Object.assign({}, item)));
                const crtSubList = this._subscribedList.map(item => (Object.assign({}, item)));
                if (!forceReq) {
                    let changed = false;
                    // 检查与现有订阅列表是否有差别
                    attrs.forEach(item => {
                        const index = crtSubList.findIndex(tmp => tmp.track === item.track);
                        // 新增订阅
                        if (index === -1) {
                            changed = true;
                            return;
                        }
                        // 已存在的订阅内容，检测 tiny 是否有变更，同时从 crtSubList 中移除
                        // 剩余未移除内容为已取消订阅内容
                        const crt = crtSubList.splice(index, 1)[0];
                        if (crt.subTiny !== item.subTiny) {
                            changed = true;
                        }
                    });
                    // crtSubList 中剩余内容为取消订阅资源
                    if (crtSubList.length) {
                        changed = true;
                    }
                    if (!changed) {
                        // logger.warn('subscribe list unchanged')
                        return { code: exports.RCRTCCode.SUCCESS };
                    }
                }
                // 客户端主动调用 api 发请求时，清除 ice 断线重连的定时器
                this._pc.clearReTryExchangeTimer();
                this._pc.updateSubRemoteTracks(attrs.map(item => item.track));
                const reqBody = yield this._createExchangeParams(attrs, false);
                const result = yield this._exchangeHandle(reqBody);
                const subTrackIds = attrs.map((item) => { return item.track.getTrackId(); });
                if (result.code !== exports.RCRTCCode.SUCCESS) {
                    return { code: result.code };
                }
                const { sdp: answer, resultCode, message } = result.data;
                if (resultCode !== exports.RCRTCCode.SUCCESS) {
                    logger.error(`change subscribe list failed: ${resultCode}`);
                    return { code: resultCode };
                }
                logger.debug(`subscribe success: ${subTrackIds.join(',')}`);
                const resCode = yield this._pc.setRemoteAnswer(answer.sdp);
                if (resCode !== exports.RCRTCCode.SUCCESS) {
                    return { code: resCode };
                }
                // 更新 remoteTrack.isSubscribed
                for (const trackId in this._remoteTracks) {
                    const subed = attrs.some(item => item.track.getTrackId() === trackId);
                    this._remoteTracks[trackId].__innerSetSubscribed(subed);
                }
                // 更新本地订阅关系
                this._subscribedList.splice(0, this._subscribedList.length, ...attrs);
                return { code: exports.RCRTCCode.SUCCESS };
            });
        }
        /**
         * 注册事件监听器，多次注册会导致后者覆盖前者，可以通过使用 `registerRoomEventListener(null)` 取消注册
         * @param listener
         */
        registerRoomEventListener(listener) {
            this._appListener = listener;
        }
        /**
         * 注册房间数据监控
         * @param listener
         * @description 该方法暂仅支持 Chrome 浏览器
         */
        registerReportListener(listener) {
            this._pc.registerReportListener(listener);
        }
        /**
         * 音量上报
         * @param handler 业务端传入的音量上报事件
         * @param gap 上报时间间隔
         */
        onAudioLevelChange(handler, gap) {
            var _a;
            (_a = this._audioLevelReport) === null || _a === void 0 ? void 0 : _a.clearAudioLevelReportTimer();
            this._audioLevelReport = new RCAudioLevelReport(this);
            this._audioLevelReport.onAudioLevelChange(handler, gap || 1000);
        }
        /**
         * 断线重连后尝试补发断线过程中的通知信息
         */
        __onReconnected(livingType) {
            return __awaiter(this, void 0, void 0, function* () {
                /**
                 * 检测 rtcpeerconnection 连接状态是否已变更
                 * 电脑息屏后，rtcpeerconnection 状态会被直接修改为 closed 而不触发任何通知，需要主动检测并通知业务层进行业务恢复
                 * SDK 无法自行恢复业务，因所需流可能无法自行重新捕获，如屏幕共享流、自定义文件流
                 */
                if (this._pc.getRTCPeerConn().connectionState === 'closed') {
                    logger.warn('RTCPeerConnection closed. Please rejoin room to restore services.');
                    this._rtcpeerClosed();
                    return;
                }
                const { code, data } = yield this._context.joinRTCRoom(this._roomId, this._roomMode, livingType);
                if (code !== engine.ErrorCode.SUCCESS) {
                    logger.error(`RTC __onReconnected getRTCRoomInfo failed: ${code}`);
                    return;
                }
                logger.debug(`RTC __onReconnected getRTCRoomInfo success: ${JSON.stringify(data)}`);
                // 查找新加入人员
                const joinedUserIds = [];
                // 新发布资源
                const published = {};
                // 取消发布的资源
                const unpublished = {};
                // 状态变更的资源
                const modified = {};
                // 当前最新的房间资源数据
                const roomData = parseRoomData(data);
                const nowUserIds = Object.keys(roomData);
                const prevUserIds = Object.keys(this._roomResources);
                for (let i = nowUserIds.length - 1; i >= 0; i -= 1) {
                    const userId = nowUserIds[i];
                    const index = prevUserIds.indexOf(userId);
                    if (index === -1) {
                        // 新增人员
                        joinedUserIds.push(userId);
                        // 新增人员发布的资源
                        published[userId] = deepCopyResources(roomData[userId]);
                        return;
                    }
                    // 房间缓存中的已发布资源
                    const prevResources = this._roomResources[userId];
                    // 当前资源
                    const nowResources = roomData[userId];
                    // 资源比对
                    const { publishedList, modifiedList, unpublishedList } = diffPublishResources(prevResources, nowResources);
                    published[userId] = deepCopyResources(publishedList);
                    unpublished[userId] = deepCopyResources(unpublishedList);
                    modified[userId] = deepCopyResources(modifiedList);
                    // 从之前的人员列表中删除已存在人员，剩余人员为已退出人员
                    prevUserIds.splice(index, 1);
                }
                // 更新缓存资源
                prevUserIds.length && prevUserIds.forEach(userId => {
                    delete this._roomResources[userId];
                });
                Object.assign(this._roomResources, roomData);
                // 通知人员退出
                prevUserIds.length && this._callAppListener('onUserLeave', prevUserIds);
                // 通知人员加入
                joinedUserIds.length && this._callAppListener('onUserJoin', joinedUserIds);
                // 资源取消发布
                for (const userId in unpublished) {
                    const resources = unpublished[userId];
                    if (resources.length) {
                        const tracks = resources.map(item => {
                            return this._remoteTracks[getTrackId(item)];
                        });
                        yield this._onUserUnpublish(tracks);
                    }
                }
                // 新发布资源
                Object.keys(published).forEach(userId => {
                    const resources = published[userId];
                    if (resources.length === 0) {
                        return;
                    }
                    const tracks = resources.map(item => {
                        const trackId = getTrackId(item);
                        const { userId, tag, mediaType } = parseTrackId(trackId);
                        const track = this._remoteTracks[trackId] = mediaType === exports.RCMediaType.AUDIO_ONLY ? new RCRemoteAudioTrack(tag, userId) : new RCRemoteVideoTrack(tag, userId);
                        track.__innerSetRemoteMuted(item.state === 0);
                        return track;
                    });
                    this._onTrackPublish(tracks);
                });
                // 资源状态变更
                Object.keys(modified).forEach(userId => {
                    const resources = modified[userId];
                    // 音频与视频区分
                    resources.forEach(item => {
                        const trackId = getTrackId(item);
                        const rTrack = this._remoteTracks[trackId];
                        rTrack.__innerSetRemoteMuted(item.state === 0);
                        rTrack.isAudioTrack() ? this._onAudioMuteChange(rTrack) : this._onVideoMuteChange(rTrack);
                    });
                });
            });
        }
        _onAudioMuteChange(audioTrack) {
            this._callAppListener('onAudioMuteChange', audioTrack);
        }
        _onVideoMuteChange(videoTrack) {
            this._callAppListener('onVideoMuteChange', videoTrack);
        }
        /**
         * 观众切换为主播后直接处理人员变更及资源变更
         */
        _afterChangedRole(data) {
            const currentUserId = this._context.getCurrentId();
            const joinedAnchorList = Object.keys(data);
            // 观众升级主播成功后返回房间实例，才可注册房间事件，需异步抛出
            setTimeout(() => {
                // 通知业务层人员变更
                const needNoticeUserIds = joinedAnchorList.filter(id => {
                    return id !== currentUserId;
                });
                needNoticeUserIds.length > 0 && this._callAppListener('onUserJoin', needNoticeUserIds);
                // 通知业务层资源变更
                for (const userId in data) {
                    if (userId === currentUserId) {
                        continue;
                    }
                    this.msgTaskQueue.push(() => this._resourceHandle({
                        uris: data[userId]
                    }, RCRTCMessageType.TOTAL_CONTENT_RESOURCE, userId));
                }
            });
        }
        /**
         * 主播身份降级，取消己端已发布的所有资源
         */
        __unpublishToSingal() {
            const crtUserId = this._context.getCurrentId();
            const unpublishList = this._roomResources[crtUserId];
            return this._context.setRTCTotalRes(this._roomId, buildPlusMessage(RCRTCMessageType.UNPUBLISH, unpublishList), buildTotalURIMessageContent([]), RCRTCMessageType.TOTAL_CONTENT_RESOURCE);
        }
        /**
         * 销毁远端资源
         */
        _removeRemoteTracks() {
            const remoteTracks = Object.values(this._remoteTracks);
            if (!remoteTracks.length) {
                return;
            }
            remoteTracks.forEach((track) => {
                track.isAudioTrack() && track.__releaseMediaElement();
            });
            this._remoteTracks = {};
        }
    }

    /**
     * 自定义合流布局时，背景图片填充方式
     */
    exports.BackgroundPictureFillMode = void 0;
    (function (BackgroundPictureFillMode) {
        /**
         * 裁剪（默认）
         */
        BackgroundPictureFillMode[BackgroundPictureFillMode["CROP"] = 1] = "CROP";
        /**
         * 不裁剪
         */
        BackgroundPictureFillMode[BackgroundPictureFillMode["WHOLE"] = 2] = "WHOLE";
    })(exports.BackgroundPictureFillMode || (exports.BackgroundPictureFillMode = {}));

    /**
     * 直播布局模式定义
     */
    exports.MixLayoutMode = void 0;
    (function (MixLayoutMode) {
        /**
         * 自定义布局
         */
        MixLayoutMode[MixLayoutMode["CUSTOMIZE"] = 1] = "CUSTOMIZE";
        /**
         * 悬浮布局（默认）
         */
        MixLayoutMode[MixLayoutMode["SUSPENSION"] = 2] = "SUSPENSION";
        /**
         * 自适应布局
         */
        MixLayoutMode[MixLayoutMode["ADAPTATION"] = 3] = "ADAPTATION";
    })(exports.MixLayoutMode || (exports.MixLayoutMode = {}));

    /**
     * 合流布局对视频的填充模式
     */
    exports.MixVideoRenderMode = void 0;
    (function (MixVideoRenderMode) {
        /**
         * 裁剪（默认）
         */
        MixVideoRenderMode[MixVideoRenderMode["CROP"] = 1] = "CROP";
        /**
         * 不裁剪
         */
        MixVideoRenderMode[MixVideoRenderMode["WHOLE"] = 2] = "WHOLE";
    })(exports.MixVideoRenderMode || (exports.MixVideoRenderMode = {}));

    const createMCUConfig = () => ({
        version: 1,
        mode: exports.MixLayoutMode.SUSPENSION
    });
    class RCMCUConfigBuilder {
        constructor(
        /**
         * flush 提交回调
         */
        _onFlush, 
        /**
         * trackId 有效性验证方法
         */
        _isValidTrackId) {
            this._onFlush = _onFlush;
            this._isValidTrackId = _isValidTrackId;
            /**
             * mcu 配置数据，每次向服务器提交全量数据
             */
            this._values = createMCUConfig();
        }
        /**
         * 设置合流后的主位置显示的视频流
         * @param videoTrackId 视频流资源 Id
         */
        setHostVideoTrack(videoTrackId) {
            if (!this._isValidTrackId(videoTrackId)) {
                logger.error(`setHostVideoTrack failed: videoTrackId is invalid -> ${videoTrackId}`);
                return this;
            }
            const { mediaType, tag, userId } = parseTrackId(videoTrackId);
            if (mediaType !== exports.RCMediaType.VIDEO_ONLY) {
                logger.error(`setHostVideoTrack failed: kind of resource is not 'video' -> ${videoTrackId}`);
                return this;
            }
            this._values.host_stream_id = formatStreamId(userId, tag);
            return this;
        }
        /**
         * 设置合流布局模式，当使用 `MixLayoutMode.CUSTOMIZE` 模式时，需自定义合流结构
         * @param mode
         * * `MixLayoutMode.CUSTOMIZE`: 自定义布局，需用户设置布局结构
         * * `MixLayoutMode.SUSPENSION`: 悬浮布局（默认）
         * * `MixLayoutMode.ADAPTATION`: 自适应布局
         */
        setMixLayoutMode(mode) {
            const valid = [
                exports.MixLayoutMode.CUSTOMIZE, exports.MixLayoutMode.SUSPENSION, exports.MixLayoutMode.ADAPTATION
            ].includes(mode);
            if (!valid) {
                logger.error(`layout mode is invalid: ${mode}`);
                return this;
            }
            this._values.mode = mode;
            return this;
        }
        _addOutputValue(key, value, subkey = 'normal') {
            const output = this._values.output || (this._values.output = { video: { normal: { width: 640, height: 480 } } });
            if (key === 'cdn') {
                output.cdn = value;
                return;
            }
            if (key === 'audio') {
                output.audio = { bitrate: value };
                return;
            }
            // video 修改
            const video = output.video;
            // 修改 video 编码配置
            if (subkey === 'normal' || subkey === 'tiny') {
                const videoConfig = video[subkey] || (video[subkey] = {});
                Object.assign(videoConfig, value);
                return;
            }
            // 修改背景色
            if (subkey === 'backgroundColor') {
                video.backgroundColor = value;
                return;
            }
            // 修改 renderMode
            if (subkey === 'exparams') {
                video.exparams = { renderMode: value };
                return;
            }
            // 增加/删除背景图，修改填充方式
            if (subkey === 'backgroundPicture') {
                const config = video.backgroundPicture || (video.backgroundPicture = {
                    fillMode: exports.BackgroundPictureFillMode.CROP,
                    picture: []
                });
                Object.assign(config, value);
            }
        }
        /**
         * 设置合流输出视频流的分辨率
         * @param resulution 有效值为 `RCResolution` 定义的枚举值
         */
        setOutputVideoResolution(resolution) {
            if (!isValidResolution(resolution)) {
                logger.warn('setOutputVideoResolution failed: `resolution` is invalid');
                return this;
            }
            const { width, height } = transResolution(resolution);
            this._addOutputValue('video', { width, height }, 'normal');
            return this;
        }
        /**
         * 设置合流输出视频流的帧率
         * @param fps 其有效值为 `RCFrameRate` 中定义的枚举值
         */
        setOutputVideoFPS(fps) {
            if (!isValidFPS(fps)) {
                logger.warn('setOutputVideoFPS failed: `fps` is invalid');
                return this;
            }
            const fpsNum = transFrameRate(fps);
            this._addOutputValue('video', { fps: fpsNum }, 'normal');
            return this;
        }
        /**
         * 设置合流输出视频流的码率（不推荐主动修改）
         * @param bitrate
         */
        setOutputVideoBitrate(bitrate) {
            if (!engine.isNumber(bitrate) || bitrate <= 0) {
                logger.error(`bitrate is invalid: ${bitrate}`);
            }
            else {
                this._addOutputValue('video', { bitrate }, 'normal');
            }
            return this;
        }
        /**
         * 设置合流后输出视频流小流的分辨率
         * @param resulution 有效值为 `RCResolution` 定义的枚举值
         */
        setOutputTinyVideoResolution(resolution) {
            if (!isValidResolution(resolution)) {
                logger.warn('setOutputTinyVideoResolution failed: `resolution` is invalid');
                return this;
            }
            const { width, height } = transResolution(resolution);
            this._addOutputValue('video', { width, height }, 'tiny');
            return this;
        }
        /**
         * 设置合流输出视频流小流的帧率
         * @param fps 其有效值为 `RCFrameRate` 中定义的枚举值
         */
        setOutputTinyVideoFPS(fps) {
            if (!isValidFPS(fps)) {
                logger.warn('setOutputTinyVideoFPS failed: `fps` is invalid');
                return this;
            }
            const fpsNum = transFrameRate(fps);
            this._addOutputValue('video', { fps: fpsNum }, 'tiny');
            return this;
        }
        /**
         * 设置合流输出视频流小流的码率（不推荐主动修改）
         * @param bitrate
         */
        setOutputTinyVideoBitrate(bitrate) {
            if (!engine.isNumber(bitrate) || bitrate <= 0) {
                logger.error(`bitrate is invalid: ${bitrate}`);
            }
            else {
                this._addOutputValue('video', { bitrate }, 'tiny');
            }
            return this;
        }
        /**
         * 设置合流后的视频流渲染方式
         * @param renderMode
         */
        setOutputVideoRenderMode(renderMode) {
            if (![exports.MixVideoRenderMode.CROP, exports.MixVideoRenderMode.WHOLE].includes(renderMode)) {
                logger.error(`renderMode is invalid: ${renderMode}`);
            }
            else {
                this._addOutputValue('video', renderMode, 'exparams');
            }
            return this;
        }
        /**
         * 设置合流后音频流的编码参数（不推荐主动修改）
         * @param bitrate 音频码率
         */
        setOutputAudioBitrate(bitrate) {
            if (engine.isNumber(bitrate) && bitrate > 0) {
                this._addOutputValue('audio', bitrate);
            }
            else {
                logger.error(`bitrate is invalid: ${bitrate}`);
            }
            return this;
        }
        /**
         * 设置合流后的视频流的背景色，默认为 `0x000000`
         * @param color 颜色参数，为 16 进制标识法，如 '0x000000'
         */
        setOutputBackgroundColor(color) {
            if (!/^0x[a-fA-F0-9]{6}$/.test(color)) {
                logger.error(`color is invalid: ${color}`);
            }
            else {
                this._addOutputValue('video', color, 'backgroundColor');
            }
            return this;
        }
        /**
         * 向合流后的视频流中增加背景图片
         * @param uri 图片资源的完整下载地址
         * @param x 相对于整体画布的起始位置 x 坐标（百分比），有效值 `0.0` - `1.0`
         * @param y 相对于整体画布的起始位置 y 坐标（百分比），有效值 `0.0` - `1.0`
         * @param w 相对于整体画布的宽（百分比），有效值 `0.0` - `1.0`
         * @param h 相对于整体画布的高（百分比），有效值 `0.0` - `1.0`
         */
        addOutputBackgroundPicture(uri, x, y, w, h) {
            var _a, _b, _c;
            if (!engine.isHttpUrl(uri)) {
                logger.error(`uri is invalid: ${uri}`);
                return this;
            }
            if ([x, y, w, h].some(item => !engine.isNumber(item) || item < 0 || item > 1)) {
                logger.error(`some attrs of (x, y, w, h) is invalid: ${x}, ${y}, ${w}, ${h}`);
                return this;
            }
            const pictures = ((_c = (_b = (_a = this._values.output) === null || _a === void 0 ? void 0 : _a.video) === null || _b === void 0 ? void 0 : _b.backgroundPicture) === null || _c === void 0 ? void 0 : _c.picture) || [];
            pictures.push({ uri, w, h, x, y });
            this._addOutputValue('video', { picture: pictures }, 'backgroundPicture');
            return this;
        }
        /**
         * 移除对合流后的视频流中添加的指定背景图片
         * @param uri
         */
        removeOutputBackgroundPicture(uri) {
            var _a, _b, _c;
            if (!engine.isHttpUrl(uri)) {
                logger.error(`uri is invalid: ${uri}`);
                return this;
            }
            let pictures = (_c = (_b = (_a = this._values.output) === null || _a === void 0 ? void 0 : _a.video) === null || _b === void 0 ? void 0 : _b.backgroundPicture) === null || _c === void 0 ? void 0 : _c.picture;
            if (pictures) {
                pictures = pictures.filter(item => item.uri !== uri);
                this._addOutputValue('video', { pictures }, 'backgroundPicture');
            }
            return this;
        }
        /**
         * 清理对合流后的视频流中添加的所有背景图片
         */
        clearOutputBackgroundPicture() {
            this._addOutputValue('video', { pictures: [] }, 'backgroundPicture');
            return this;
        }
        /**
         * 设置合流后的视频流中添加的背景图片的填充方式：
         * 1. 按比例裁剪
         * 2. 不裁剪，按比例压缩
         * @param fillMode
         */
        setOutputBackgroundPictureFillMode(fillMode) {
            if (![exports.BackgroundPictureFillMode.CROP, exports.BackgroundPictureFillMode.WHOLE].includes(fillMode)) {
                logger.error(`fillMode is invalid: ${fillMode}`);
            }
            else {
                this._addOutputValue('video', { fillMode }, 'backgroundPicture');
            }
            return this;
        }
        /**
         * 设置直播 CDN 旁路推流地址，最多支持 5 个推流地址
         * @param urls 地址列表
         */
        addPublishStreamUrls(urls) {
            var _a, _b;
            const regexp = /^rtmp:\/\/.+/;
            const invalid = !engine.isArray(urls) || urls.length === 0 || urls.some(url => !regexp.test(url));
            if (invalid) {
                logger.error(`urls is invalid: ${urls}`);
                return this;
            }
            const cdns = ((_b = (_a = this._values.output) === null || _a === void 0 ? void 0 : _a.cdn) === null || _b === void 0 ? void 0 : _b.concat()) || [];
            let changed = false;
            urls.forEach(url => {
                if (cdns.some(item => item.pushurl === url)) {
                    return;
                }
                changed = true;
                cdns.push({ pushurl: url });
            });
            if (cdns.length > 5) {
                logger.error('publish stream url no more than 5');
                return this;
            }
            if (changed) {
                this._addOutputValue('cdn', cdns);
            }
            return this;
        }
        /**
         * 移除直播 CDN 旁路推流地址
         * @param urls
         */
        removePublishStreamUrls(urls) {
            var _a, _b;
            const regexp = /^rtmp:\/\/.+/;
            const invalid = !engine.isArray(urls) || urls.length === 0 || urls.some(url => !regexp.test(url));
            if (invalid) {
                logger.error(`urls is invalid: ${urls}`);
                return this;
            }
            const cdns = ((_b = (_a = this._values.output) === null || _a === void 0 ? void 0 : _a.cdn) === null || _b === void 0 ? void 0 : _b.concat()) || [];
            for (let i = cdns.length - 1; i >= 0; i -= 1) {
                const { pushurl } = cdns[i];
                const index = urls.indexOf(pushurl);
                if (index >= 0) {
                    urls.splice(index, 1);
                    cdns.splice(i, 1);
                }
            }
            this._addOutputValue('cdn', cdns);
            return this;
        }
        /**
         * 清理已添加的 CDN 旁路推流地址
         */
        clearPublishStreamUrls() {
            this._addOutputValue('cdn', []);
            return this;
        }
        /**
         * 在自定义布局中增加视频流配置
         * @param trackId 资源 Id
         * @param x 在画布中的坐标 x
         * @param y 在画布中的坐标 y
         * @param width 分辨率宽度
         * @param height 分辨率高度
         */
        addCustomizeLayoutVideo(trackId, x, y, width, height) {
            if (!this._isValidTrackId(trackId)) {
                logger.error(`trackId is invalid: ${trackId}`);
                return this;
            }
            if (!engine.isNumber(x) || !engine.isNumber(y)) {
                logger.error(`some attrs of (x, y) is invalid: ${x}, ${y}`);
                return this;
            }
            if ([width, height].some(value => !engine.isNumber(value) || value < 0)) {
                logger.error(`some attrs of (width, height) is invalid: ${width}, ${height}`);
                return this;
            }
            const { userId, tag, mediaType } = parseTrackId(trackId);
            if (mediaType !== exports.RCMediaType.VIDEO_ONLY) {
                logger.error(`kind of resource is not 'video': ${trackId}`);
                return this;
            }
            const streamId = formatStreamId(userId, tag);
            const input = this._values.input || (this._values.input = { video: [] });
            input.video.push({
                user_id: userId,
                stream_id: streamId,
                x,
                y,
                width,
                height
            });
            return this;
        }
        /**
         * 移除自定义布局中的视频流配置
         * @param trackId
         */
        removeCustomizeLayoutVideo(trackId) {
            if (!this._isValidTrackId(trackId)) {
                logger.error(`trackId is invalid: ${trackId}`);
                return this;
            }
            const { userId, tag, mediaType } = parseTrackId(trackId);
            if (mediaType !== exports.RCMediaType.VIDEO_ONLY) {
                logger.error(`kind of resource is not 'video': ${trackId}`);
                return this;
            }
            const streamId = formatStreamId(userId, tag);
            const input = this._values.input || (this._values.input = { video: [] });
            input.video = input.video.filter(item => item.stream_id === streamId);
            return this;
        }
        /**
         * 清除已添加的自定义布局中的视频流配置
         */
        clearCustomizeLayoutVideo() {
            const input = this._values.input || (this._values.input = { video: [] });
            input.video = [];
            return this;
        }
        /**
         * 使已修改的配置生效，在调用该方法前，所有数据只会对本地配置进行修改，不会产生实际效果
         */
        flush() {
            return __awaiter(this, void 0, void 0, function* () {
                const config = JSON.parse(JSON.stringify(this._values));
                const { code } = yield this._onFlush(config);
                this._values = createMCUConfig();
                return { code };
            });
        }
    }

    /**
     * 直播房间
     */
    class RCLivingRoom extends RCAbstractRoom {
        constructor(context, runtime, roomId, data, service, initOptions, clientEvent, _livingType, isUpgrage = false) {
            super(context, runtime, roomId, data, engine.RTCMode.LIVE, service, initOptions, clientEvent, isUpgrage);
            this._livingType = _livingType;
            // 初始化 MCUBuilder
            this._mcuConfigBuilder = new RCMCUConfigBuilder(this._onMCUConfigFlush.bind(this), this._isValidResourceId.bind(this));
        }
        getLivingType() {
            return this._livingType;
        }
        /**
         * 获取 MCU 配置构建对象
         */
        getMCUConfigBuilder() {
            return this._mcuConfigBuilder;
        }
        /**
         * 接收 MCU 配置并向 MediaServer 提交
         * @param data
         */
        _onMCUConfigFlush(data) {
            return __awaiter(this, void 0, void 0, function* () {
                const headers = {
                    'App-Key': this._context.getAppkey(),
                    Token: this._token,
                    RoomId: this.getRoomId(),
                    UserId: this._context.getCurrentId(),
                    SessionId: this.getSessionId()
                };
                const { code } = yield this._service.setMcuConfig(headers, data);
                if (code !== exports.RCRTCCode.SUCCESS) {
                    logger.error(`set MCU config failed: ${code}`);
                }
                logger.debug('set MCU config success');
                return { code };
            });
        }
        __onReconnected() {
            return super.__onReconnected(this._livingType);
        }
    }

    /**
     * 普通音视频房间
     */
    class RCRTCRoom extends RCAbstractRoom {
        constructor(context, runtime, roomId, data, service, initOptions, clientEvent) {
            super(context, runtime, roomId, data, engine.RTCMode.RTC, service, initOptions, clientEvent, false);
        }
    }

    const getUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    /**
     * 解析导航数据获取 RTC Server 地址
     * @param info
     */
    const parseNaviInfo = (info) => {
        var _a;
        if (!info) {
            return [];
        }
        let voipInfo;
        try {
            voipInfo = JSON.parse(info.voipCallInfo || '{ "strategy": 0 }');
        }
        catch (error) {
            logger.warn('parse `voipCallInfo` of navi failed: ' + info.voipCallInfo);
            return [];
        }
        if (voipInfo.strategy === 0) {
            return [];
        }
        const engines = (_a = voipInfo.callEngine) === null || _a === void 0 ? void 0 : _a.filter(item => item.engineType === 4);
        if (!engines || engines.length === 0) {
            return [];
        }
        const engine = engines[0];
        const result = [];
        engine.mediaServer && result.push(engine.mediaServer.replace(/^(https?:\/\/)?/, 'https://'));
        if (engine.backupMediaServer) {
            engine.backupMediaServer.forEach(item => {
                result.push(item.replace(/^(https?:\/\/)?/, 'https://'));
            });
        }
        return result;
    };

    const getCommonHeader = () => ({
        'Content-Type': 'application/json;charset=UTF-8',
        'Cache-Control': 'no-cache',
        ClientType: `web|${browserInfo.browser}|${browserInfo.version}`,
        ClientVersion: "5.1.10-alpha.1",
        'Client-Session-Id': getUUID(),
        'Request-Id': Date.now().toString()
    });
    class RCMediaService {
        constructor(_runtime, _context, 
        /**
         * 自定义 MediaServer 地址，当有值时，不再使用导航内的地址
         */
        _msUrl, 
        /**
         * 请求超时时长
         */
        _timeout = 5000) {
            this._runtime = _runtime;
            this._context = _context;
            this._msUrl = _msUrl;
            this._timeout = _timeout;
            /**
             * navi 中获取的媒体服务地址
             */
            this._msInNavi = [];
            /**
             * 已失败的请求地址
             */
            this._failedMs = [];
            /**
             * 服务器指纹数据，客户端不得修改，直接透传
             */
            this._rtcFinger = undefined;
            /**
             * 服务器接口返回的 clusterId 数据，当此数据有值时，后续所有请求向此服务发送
             */
            this._clusterId = '';
            /**
             * MCU 服务地址
             */
            this._configUrl = '';
        }
        getNaviMS() {
            if (this._msUrl) {
                return [this._msUrl];
            }
            if (this._clusterId) {
                return [`https://${this._clusterId}`];
            }
            if (this._msInNavi.length === 0) {
                if (this._failedMs.length === 0) {
                    this._msInNavi.push(...parseNaviInfo(this._context.getNaviInfo()));
                }
                else {
                    this._msInNavi.push(...this._failedMs);
                    this._failedMs.length = 0;
                }
            }
            return this._msInNavi.map(item => item.trim());
        }
        /**
         * 发送请求，请求发送若失败，会继续尝试使用后续可用地址直到无地址可用，此时认为请求失败
         * @param path
         * @param header
         * @param body
         */
        _request(path, headers, body) {
            return __awaiter(this, void 0, void 0, function* () {
                const urls = this.getNaviMS();
                if (urls.length === 0) {
                    return { code: exports.RCRTCCode.NOT_OPEN_VIDEO_AUDIO_SERVER };
                }
                if (this._rtcFinger) {
                    body.rtcFinger = this._rtcFinger;
                }
                for (let i = 0; i < urls.length; i += 1) {
                    const url = `${urls[i]}${path}`;
                    const commonHeader = getCommonHeader();
                    logger.debug(`request -> Request-Id: ${commonHeader['Request-Id']}, url: ${url}`);
                    const { status, data } = yield this._runtime.httpReq({
                        url,
                        body: JSON.stringify(body),
                        headers: Object.assign(Object.assign({}, commonHeader), headers),
                        method: engine.HttpMethod.POST,
                        timeout: this._timeout
                    });
                    if (status === 200) {
                        const resp = JSON.parse(data);
                        if (resp.rtcFinger) {
                            this._rtcFinger = resp.rtcFinger;
                        }
                        if (resp.clusterId) {
                            this._clusterId = resp.clusterId;
                        }
                        logger.debug(`request success -> Request-Id: ${commonHeader['Request-Id']}`);
                        return { code: exports.RCRTCCode.SUCCESS, data: resp };
                    }
                    else {
                        logger.warn(`request failed -> Request-Id: ${commonHeader['Request-Id']}, status: ${status}, url: ${url}`);
                        // 失败的请求需记录，避免多配置时总是请求无效的地址
                        this._failedMs.push(...this._msInNavi.splice(i, 1));
                    }
                }
                return { code: exports.RCRTCCode.REQUEST_FAILED };
            });
        }
        /**
         * 资源协商接口，订阅、发布、变更资源均可以使用此接口。该接口通过 sdp 字段交换 SDP 信息，
         * 并通过 subscribeList 和 publishList 表明最终发布和订阅的资源。本端产出 offer，服务器产出 answer
         * 每次接口调用，都会全量覆盖发布和订阅的资源。
         * @param header
         * @param body
         */
        exchange(headers, body) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                const data = yield this._request('/exchange', headers, body);
                if (data.code === exports.RCRTCCode.SUCCESS && ((_a = data.data) === null || _a === void 0 ? void 0 : _a.resultCode) === exports.RCRTCCode.SUCCESS) {
                    const urls = data.data.urls;
                    if (urls) {
                        this._configUrl = urls.configUrl;
                    }
                }
                return data;
            });
        }
        /**
         * 退出房间
         */
        exit(headers) {
            return __awaiter(this, void 0, void 0, function* () {
                const { code } = yield this._request('/exit', headers, {});
                return code;
            });
        }
        /**
         * 观众端订阅主播资源
         */
        broadcastSubscribe(headers, body) {
            return this._request('/broadcast/subscribe', headers, body);
        }
        /**
         * 观众端退出订阅
         */
        broadcastExit(headers) {
            return __awaiter(this, void 0, void 0, function* () {
                const { code } = yield this._request('/broadcast/exit', headers, {});
                return { code };
            });
        }
        /**
         * 直播推流、自定义布局配置
         */
        setMcuConfig(headers, body) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._configUrl) {
                    return { code: exports.RCRTCCode.MCU_SERVER_NOT_FOUND };
                }
                // mcu 地址默认使用 https 协议
                const url = `${this._configUrl.replace(/^(https?:\/\/)?/, 'https://')}/server/mcu/config`;
                const commonHeader = getCommonHeader();
                logger.debug(`request -> Request-Id: ${commonHeader['Request-Id']}, url: ${url}`);
                const { status, data: jsonStr } = yield this._runtime.httpReq({
                    url,
                    headers: Object.assign(Object.assign({}, commonHeader), headers),
                    body: JSON.stringify(body),
                    method: engine.HttpMethod.POST
                });
                if (status === 200) {
                    logger.debug(`request success -> Request-Id: ${commonHeader['Request-Id']}`);
                    const data = JSON.parse(jsonStr);
                    return { code: data.resultCode };
                }
                logger.warn(`request failed -> Request-Id: ${commonHeader['Request-Id']}, status: ${status}, url: ${url}`);
                return { code: exports.RCRTCCode.REQUEST_FAILED };
            });
        }
    }

    /**
     * 直播间类型
     */
    exports.RCLivingType = void 0;
    (function (RCLivingType) {
        /**
         * 音视频直播
         */
        RCLivingType[RCLivingType["VIDEO"] = 0] = "VIDEO";
        /**
         * 音频直播
         */
        RCLivingType[RCLivingType["AUDIO"] = 1] = "AUDIO";
    })(exports.RCLivingType || (exports.RCLivingType = {}));

    /**
     * 直播观众客户端
     */
    class RCAudienceClient {
        constructor(_context, runtime, _initOption) {
            this._context = _context;
            /**
             * RTCToken
             */
            this._rtcToken = '';
            /**
             * 已订阅的资源信息
             */
            this._liveUrl = '';
            /**
             * 已订阅的远端流
             */
            this._subTracks = [];
            this._livingType = null;
            this._mediaType = null;
            this._subTiny = false;
            // `subscribe` 方法调用是否来源于 ice 断线重连
            this._fromRetry = false;
            this._appListener = null;
            this._service = new RCMediaService(runtime, _context, _initOption.mediaServer);
        }
        _getReqHeaders(livingType) {
            return __awaiter(this, void 0, void 0, function* () {
                const userId = this._context.getCurrentId();
                // 直播观众端 RoomId 与 UserId 保持一致
                const roomId = userId;
                // 取 rtcToken
                if (!this._rtcToken) {
                    const { code, data } = yield this._context.getRTCToken(roomId, engine.RTCMode.LIVE, livingType);
                    if (code !== engine.ErrorCode.SUCCESS) {
                        logger.error(`getRTCToken failed: ${code}`);
                        return { code: exports.RCRTCCode.SIGNAL_ERROR };
                    }
                    this._rtcToken = data.rtcToken;
                }
                return {
                    code: exports.RCRTCCode.SUCCESS,
                    headers: {
                        'App-Key': this._context.getAppkey(),
                        UserId: userId,
                        RoomId: roomId,
                        RoomType: engine.RTCMode.LIVE,
                        Token: this._rtcToken
                    }
                };
            });
        }
        _clearSubscribeInfo() {
            var _a;
            this._liveUrl = '';
            this._livingType = null;
            this._mediaType = null;
            this._subTiny = false;
            this._subTracks.length = 0;
            (_a = this._pc) === null || _a === void 0 ? void 0 : _a.destroy();
            this._pc = null;
        }
        _reTryExchange() {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                this._fromRetry = true;
                const { code } = yield this.subscribe(this._liveUrl, this._livingType, this._mediaType, this._subTiny);
                if (code === exports.RCRTCCode.SUCCESS) {
                    (_a = this._pc) === null || _a === void 0 ? void 0 : _a.clearReTryExchangeTimer();
                }
            });
        }
        /**
         * 直播观众订阅主播资源，直播观众端无需加入房间
         * @param liveUrl 直播资源地址
         * @param livingType 直播类型，有效值为音频、音视频
         * @param mediaType 订阅资源类型，其有效值为 `RCMediaType` 的枚举值
         * @param subTiny 当值为 `true` 时将订阅小流，否则订阅大流。默认值为 `false`
         */
        subscribe(liveUrl, livingType, mediaType, subTiny = false) {
            return __awaiter(this, void 0, void 0, function* () {
                return push(() => this.__subscribe(liveUrl, livingType, mediaType, subTiny));
            });
        }
        __subscribe(liveUrl, livingType, mediaType, subTiny = false) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                const tracks = [];
                if (isIllegalConnection(this._context.getNaviInfo())) {
                    return { code: exports.RCRTCCode.PACKAGE_ENVIRONMENT_ERROR, tracks };
                }
                // 客户端主动调用 api 发请求时，清除 ice 断线重连的定时器
                !this._fromRetry && ((_a = this._pc) === null || _a === void 0 ? void 0 : _a.clearReTryExchangeTimer());
                this._fromRetry = false;
                if (!engine.isString(liveUrl)) {
                    logger.error(`liveUrl is invalid: ${liveUrl}`);
                    return { code: exports.RCRTCCode.PARAMS_ERROR, tracks };
                }
                if (![exports.RCLivingType.AUDIO, exports.RCLivingType.VIDEO].includes(livingType)) {
                    logger.error(`livingType is invalid: ${livingType}`);
                    return { code: exports.RCRTCCode.PARAMS_ERROR, tracks };
                }
                if (![exports.RCMediaType.AUDIO_ONLY, exports.RCMediaType.VIDEO_ONLY, exports.RCMediaType.AUDIO_VIDEO].includes(mediaType)) {
                    logger.error(`mediaType is invalid: ${mediaType}`);
                    return { code: exports.RCRTCCode.PARAMS_ERROR, tracks };
                }
                // 允许观众动态切换大小流订阅，或重复订阅同一资源
                if (this._liveUrl && this._liveUrl !== liveUrl) {
                    return { code: exports.RCRTCCode.BROADCAST_SUB_LIST_NOT_EMPTY, tracks };
                }
                if (!this._pc) {
                    this._pc = new RCRTCPeerConnection(this._reTryExchange.bind(this));
                    this._pc.on(RCRTCPeerConnection.__INNER_EVENT_TRACK_READY__, this._onTrackReady, this);
                    this.registerReportListener(this._reportListener);
                }
                // 暂存，避免同步栈内并发调用，若订阅失败需清理
                this._liveUrl = liveUrl;
                // 构建 http req headers
                const { code, headers } = yield this._getReqHeaders(livingType);
                if (code !== exports.RCRTCCode.SUCCESS) {
                    return { code, tracks };
                }
                // 直观观众订阅的是合流后的数据，并不存在流的归属问题，此处直接以虚拟生成的合流 id 替代 userId
                const mcuId = `rc_mcu_${Date.now()}`;
                const tag = 'RongCloudRTC';
                this._subTracks.length = 0;
                this._subTracks.push(new RCRemoteAudioTrack(tag, mcuId), new RCRemoteVideoTrack(tag, mcuId));
                this._pc.updateSubRemoteTracks(this._subTracks.slice());
                const offer = yield this._pc.createOffer(true);
                const body = {
                    sdp: offer,
                    liveUrl,
                    mediaType,
                    simulcast: subTiny ? RCStreamType.TINY : RCStreamType.NORMAL,
                    switchstream: false
                    // switchstream: !!this._initOption.autoSwitchStream
                };
                const resp = yield this._service.broadcastSubscribe(headers, body);
                if (resp.code !== exports.RCRTCCode.SUCCESS) {
                    logger.error(`andience subscribe failed: ${resp.code}`);
                    return { code: resp.code, tracks };
                }
                const data = resp.data;
                if (data.resultCode !== exports.RCRTCCode.SUCCESS) {
                    logger.error(`andience subscribe failed! code: ${data.resultCode}; message: ${data.message}`);
                    return { code: data.resultCode, tracks };
                }
                logger.debug(`andience subscribe success: ${liveUrl}`);
                this._livingType = livingType;
                this._mediaType = mediaType;
                this._subTiny = subTiny;
                const { sdp: answer, subscribedList } = data;
                const readyTracks = [];
                subscribedList.forEach(item => {
                    const { mediaType } = item;
                    const rTrack = this._subTracks[mediaType];
                    readyTracks.push(rTrack);
                    // 直播观众订阅的流为合流数据，不存在单独禁用的问题
                    rTrack.__innerSetRemoteMuted(true);
                });
                // 无需等待 setRemoteAnswer 完成，直接返回，避免业务层拿到 tracks 之前先获取了 onTrackReady 通知
                this._pc.setRemoteAnswer(answer.sdp);
                return { code: exports.RCRTCCode.SUCCESS, tracks: readyTracks };
            });
        }
        /**
         * 取消订阅主播资源
         * @param liveUrl
         */
        unsubscribe() {
            return __awaiter(this, void 0, void 0, function* () {
                return push(() => this.__unsubscribe());
            });
        }
        __unsubscribe() {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                // 客户端主动调用 api 发请求时，清除 ice 断线重连的定时器
                (_a = this._pc) === null || _a === void 0 ? void 0 : _a.clearReTryExchangeTimer();
                if (!this._rtcToken || !this._liveUrl) {
                    return { code: exports.RCRTCCode.SUCCESS };
                }
                // 无需验 code，rtcToken 无值的情况已提前校验，不存在重新拿 token 的可能性
                const { headers } = yield this._getReqHeaders();
                const { code } = yield this._service.broadcastExit(headers);
                if (code !== exports.RCRTCCode.SUCCESS) {
                    logger.error(`broadcast unsubscribe failed: ${code}`);
                }
                else {
                    logger.debug('broadcast unsubscribe success');
                }
                this._clearSubscribeInfo();
                return { code };
            });
        }
        /**
         * 注册房间数据监控
         * @param listener
         * @description 该方法暂仅支持 Chrome 浏览器
         */
        registerReportListener(listener) {
            var _a;
            this._reportListener = listener;
            (_a = this._pc) === null || _a === void 0 ? void 0 : _a.registerReportListener(listener);
        }
        /**
         * 注册流事件监听，多次注册会导致后者覆盖前者，可以通过使用 `registerTrackEventListener(null)` 取消注册
         * @param listener
         */
        registerTrackEventListener(listener) {
            this._appListener = listener;
        }
        _onTrackReady(evt) {
            var _a, _b;
            const track = evt.receiver.track;
            const mediaType = track.kind === 'audio' ? exports.RCMediaType.AUDIO_ONLY : exports.RCMediaType.VIDEO_ONLY;
            const rTrack = this._subTracks[mediaType];
            rTrack.__innerSetMediaStreamTrack(track);
            try {
                (_b = (_a = this._appListener) === null || _a === void 0 ? void 0 : _a.onTrackReady) === null || _b === void 0 ? void 0 : _b.call(_a, rTrack);
            }
            catch (error) {
                logger.error(error);
            }
        }
    }

    const tinyConf = Object.assign(Object.assign({}, transResolution(exports.RCResolution.W176_H144)), { frameRate: transFrameRate(exports.RCFrameRate.FPS_15) });
    /**
     * 观众直播房间类
     * 处理：
     * 1、通知观众房间内 人员变更、资源变更
     * 2、观众订阅、取消订阅资源
     */
    class RCAudienceLivingRoom {
        constructor(_context, _runtime, _initOptions, _roomId, _token, _livingType) {
            this._context = _context;
            this._runtime = _runtime;
            this._initOptions = _initOptions;
            this._roomId = _roomId;
            this._token = _token;
            this._livingType = _livingType;
            this._roomAnchorList = [];
            this._roomRes = {};
            this._roomAnchorRes = {};
            this._remoteTracks = {};
            this._appListener = null;
            this._subscribedList = [];
            this._sessionId = '';
            this._destroyed = false;
            this._service = new RCMediaService(this._runtime, this._context, this._initOptions.mediaServer, this._initOptions.timeout);
            // 北极星数据
            this._polarisReport = new PolarisReporter(this._context, this._runtime, this._roomId, this, PolarisRole.Audience);
            this._polarisReport.sendR1();
            this._pc = new RCRTCPeerConnection(this._reTryExchange.bind(this), // TODO ice 重连逻辑
            this._polarisReport);
            this._pc.on(RCRTCPeerConnection.__INNER_EVENT_TRACK_READY__, (evt) => {
                const msid = evt.streams[0].id;
                const track = evt.receiver.track;
                const trackId = [msid, track.kind === 'audio' ? exports.RCMediaType.AUDIO_ONLY : exports.RCMediaType.VIDEO_ONLY].join('_');
                const rTrack = this._remoteTracks[trackId];
                if (!rTrack) {
                    logger.warn('cannot found RCRemoteTrack:', track.id);
                    return;
                }
                rTrack.__innerSetMediaStreamTrack(track);
                this._callAppListener('onTrackReady', rTrack);
            });
            // 房间主播加入|离开房间、发布|取消发布资源变更监听
            this._context.onrtcdatachange = this.singalDataChange.bind(this);
        }
        _assertRoomDestroyed() {
            if (this._destroyed) {
                const msg = 'This room has been destroyed. Please use `RCRTCClient.joinLivingRoomAsAudience` to catch another instance.';
                logger.warn(msg);
                return exports.RCRTCCode.ROOM_HAS_BEEN_DESTROYED;
            }
        }
        /**
         * @description 信令数据处理
         * @param roomId 数据对应的房间 Id
         * @param singalData 拉取到的数据
         * * key RC_ANCHOR_LIST value: 为主播 ID 集合
         * * key RC_RES_`userId` value: 为主播发布的资源
         * * key RC_RTC_SESSIONID value: sessionId
         */
        singalDataChange(singalData, roomId) {
            if (roomId !== this._roomId) {
                logger.warn(`singalDataChange -> not the current room data: data roomId: ${roomId}, current roomId: ${this._roomId}`);
                return;
            }
            logger.debug('singalDataChange -> singalData:', JSON.stringify(singalData || {}));
            const allMcuUris = [];
            singalData.forEach(data => {
                const { key, value, timestamp, uid } = data;
                const isResKey = key.indexOf('RC_RES_') !== -1;
                if (isResKey) {
                    const serverUris = JSON.parse(value || '{}');
                    const mcuUris = JSON.parse(serverUris.mcu_uris || '[]');
                    const anchorUris = JSON.parse(serverUris.uris || '[]');
                    allMcuUris.push(...mcuUris);
                    // 处理主播发布的分流资源
                    this._diffAnchorResource(anchorUris, uid);
                    return;
                }
                // 处理主播列表
                if (key === 'RC_ANCHOR_LIST') {
                    const anchorUserIds = JSON.parse(value || '[]');
                    const { joinUserIds, leftUserIds } = this._diffAnchorList(anchorUserIds);
                    if (joinUserIds.length > 0) {
                        this._handleNewJoinedAnchor(joinUserIds);
                    }
                    if (leftUserIds.length > 0) {
                        this._handleLeftedAnchor(leftUserIds);
                    }
                }
                if (key === 'RC_RTC_SESSIONID') {
                    this._sessionId = value;
                }
            });
            // 处理直播间 MCU 合流资源资源
            this._diffRoomResource(allMcuUris);
        }
        /**
         * 计算加入离开的主播 ID 列表
         */
        _diffAnchorList(serverRoomAllAnchor) {
            const joinUserIds = serverRoomAllAnchor.filter(userId => this._roomAnchorList.indexOf(userId) < 0);
            const leftUserIds = this._roomAnchorList.filter(userId => serverRoomAllAnchor.indexOf(userId) < 0);
            return {
                leftUserIds,
                joinUserIds
            };
        }
        _handleNewJoinedAnchor(list) {
            // 更新 _roomAnchorList
            this._roomAnchorList.push(...list);
            // 触发 app 主播加入监听
            this._callAppListener('onAnchorJoin', list);
        }
        _handleLeftedAnchor(list) {
            return __awaiter(this, void 0, void 0, function* () {
                // 更新 _roomAnchorList
                this._roomAnchorList = this._roomAnchorList.filter(item => {
                    return !(list.indexOf(item) > -1);
                });
                // 主播离开房间时，自动退订对方资源
                const tracks = [];
                list.forEach(userId => {
                    tracks.push(...this.getRemoteTracksByUserId(userId));
                    delete this._roomAnchorRes[userId];
                });
                if (tracks.length) {
                    yield this.unsubscribe(tracks);
                    tracks.forEach(item => delete this._remoteTracks[item.getTrackId()]);
                }
                // 触发 app 主播离开监听
                this._callAppListener('onAnchorLeave', list);
            });
        }
        /**
         * 计算新发布和取消发布的合流资源
         */
        _diffRoomResource(uris) {
            return __awaiter(this, void 0, void 0, function* () {
                const newPubTracks = [];
                const unpubTracks = [];
                // 若 uris 中有， this._remoteTracks 中没有，为新发布
                const remoteUriTrackIds = [];
                uris.forEach(uri => {
                    const serverResId = getTrackId(uri);
                    const { userId, tag, mediaType } = parseTrackId(serverResId);
                    const localTrackId = [this._roomId, tag, mediaType].join('_');
                    // 查看资源 ID 是否存在于当前房间的 remoteTracks
                    if (!this._remoteTracks[localTrackId]) {
                        // 置为新发布的 track
                        const rTrack = mediaType === exports.RCMediaType.AUDIO_ONLY ? new RCRemoteAudioTrack(tag, '', this._roomId) : new RCRemoteVideoTrack(tag, '', this._roomId);
                        newPubTracks.push(rTrack);
                        this._remoteTracks[localTrackId] = rTrack;
                        this._roomRes[rTrack.getTrackId()] = uri;
                    }
                    remoteUriTrackIds.push(localTrackId);
                });
                // 若 this._remoteTracks 有，uris 中没有为取消发布
                Object.keys(this._remoteTracks).forEach(trackId => {
                    const isUnpubTrackId = remoteUriTrackIds.indexOf(trackId) < 0 && this._remoteTracks[trackId].isMCUTrack();
                    if (isUnpubTrackId) {
                        // 置为取消发布的 track
                        unpubTracks.push(this._remoteTracks[trackId]);
                    }
                });
                // 通知 APP 新发布的 tracks
                newPubTracks.length > 0 && this._callAppListener('onTrackPublish', newPubTracks);
                unpubTracks.length > 0 && this._onUserUnpublish(unpubTracks, 'onTrackUnpublish');
            });
        }
        /**
         * 计算主播发布和取消发布的资源，以及资源的状态变更
        */
        _diffAnchorResource(uris, userId) {
            return __awaiter(this, void 0, void 0, function* () {
                // 当前资源清单
                const nowRes = this._roomAnchorRes[userId] || (this._roomAnchorRes[userId] = []);
                const { publishedList, unpublishedList, modifiedList } = diffPublishResources(nowRes, uris);
                // publishedList 包含当前房间未发布的资源，以及房间已存在资源的二次发布，uri 有变更
                if (publishedList.length) {
                    const ids = nowRes.map(getTrackId);
                    // 对方重新发布且己方已订阅的资源
                    const subedTracks = [];
                    const newTracks = [];
                    publishedList.forEach(item => {
                        const resId = getTrackId(item);
                        const index = ids.indexOf(resId);
                        const { userId, tag, mediaType } = parseTrackId(resId);
                        if (index > -1) {
                            nowRes[index] = item;
                        }
                        else {
                            nowRes.push(item);
                        }
                        let rTrack = this._remoteTracks[resId];
                        this._roomRes[resId] = item;
                        // 二次发布资源，直接更新
                        if (rTrack) {
                            if (rTrack.isSubscribed()) {
                                subedTracks.push(rTrack);
                            }
                        }
                        else {
                            rTrack = mediaType === exports.RCMediaType.AUDIO_ONLY ? new RCRemoteAudioTrack(tag, userId) : new RCRemoteVideoTrack(tag, userId);
                            this._remoteTracks[resId] = rTrack;
                            newTracks.push(rTrack);
                        }
                        rTrack.__innerSetRemoteMuted(item.state === 0);
                    });
                    // 重新订阅二次发布资源
                    if (subedTracks.length) {
                        const trackIds = subedTracks.map(item => item.getTrackId());
                        logger.debug(`resub tracks -> ${JSON.stringify(trackIds)}`);
                        const { code } = yield push(() => this._subscribeHandle(subedTracks, true));
                        if (code !== exports.RCRTCCode.SUCCESS) {
                            logger.error(`resub tracks failed -> code: ${code}, ids: ${JSON.stringify(trackIds)}`);
                        }
                    }
                    this._callAppListener('onAnchorTrackPublish', newTracks);
                }
                if (unpublishedList.length) {
                    const resIds = unpublishedList.map(getTrackId);
                    for (let i = nowRes.length - 1; i >= 0; i -= 1) {
                        const item = nowRes[i];
                        if (resIds.includes(getTrackId(item))) {
                            nowRes.splice(i, 1);
                        }
                    }
                    const tracks = unpublishedList.map(item => {
                        const trackId = getTrackId(item);
                        return this._remoteTracks[trackId];
                    });
                    yield this._onUserUnpublish(tracks, 'onAnchorTrackUnpublish');
                }
                if (modifiedList.length) {
                    const resIds = nowRes.map(getTrackId);
                    for (let i = 0; i < modifiedList.length; i++) {
                        const item = modifiedList[i];
                        const id = getTrackId(item);
                        // 更新资源 state
                        const index = resIds.indexOf(id);
                        nowRes[index].state = item.state;
                        const rTrack = this._remoteTracks[id];
                        rTrack.__innerSetRemoteMuted(item.state === 0);
                        if (rTrack.isAudioTrack()) {
                            this._callAppListener('onAudioMuteChange', rTrack);
                        }
                        else {
                            this._callAppListener('onVideoMuteChange', rTrack);
                        }
                    }
                }
            });
        }
        _onUserUnpublish(tracks, eventName) {
            return __awaiter(this, void 0, void 0, function* () {
                // 需要替业务层取消订阅，业务层只需关注 UI 变化
                yield this.unsubscribe(tracks);
                tracks.forEach(item => {
                    this._subscribedList = this._subscribedList.filter(sub => sub.track.getTrackId() !== item.getTrackId());
                    delete this._roomRes[item.getTrackId()];
                    item.__innerDestroy();
                    delete this._remoteTracks[item.getTrackId()];
                });
                // 通知 APP 取消发布的 tracks
                this._callAppListener(eventName, tracks);
            });
        }
        _callAppListener(eventType, ...attrs) {
            var _a;
            const handle = (_a = this._appListener) === null || _a === void 0 ? void 0 : _a[eventType];
            if (!handle) {
                return;
            }
            try {
                handle(...attrs);
            }
            catch (error) {
                logger.error(error);
            }
        }
        /**
         * ice 断线后，尝试重新走 exchange
        */
        _reTryExchange() {
            return __awaiter(this, void 0, void 0, function* () {
                push(() => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const { reqBody } = yield this._createSubscribeParams(this._subscribedList, {}, true);
                    // 发送 /exchange 请求
                    const resp = yield this._exchangeHandle(reqBody);
                    if (resp.code !== exports.RCRTCCode.SUCCESS) {
                        logger.error(`reTryExchange failed: ${resp.code}`);
                        return { code: resp.code };
                    }
                    const { sdp: answer, resultCode } = resp.data;
                    if (resultCode !== exports.RCRTCCode.SUCCESS) {
                        logger.error(`reTryExchange failed: ${resultCode}`);
                        return { code: resultCode };
                    }
                    // 请求成功，清除 ice 断线重连的定时器
                    this._pc.clearReTryExchangeTimer();
                    const mcuSubList = this._subscribedList.filter(item => item.track.isMCUTrack());
                    if (mcuSubList.length > 0) {
                        const mcuTrackId = mcuSubList[0].track.getTrackId();
                        const sdpMsid = (_a = this._roomRes[mcuTrackId]) === null || _a === void 0 ? void 0 : _a.msid;
                        const currentMsid = [this._roomId, 'RongCloudRTC'].join('_');
                        answer.sdp = answer.sdp.replace(new RegExp(sdpMsid, 'g'), currentMsid);
                    }
                    const resCode = yield this._pc.setRemoteAnswer(answer.sdp);
                    if (resCode !== exports.RCRTCCode.SUCCESS) {
                        return { code: resCode };
                    }
                }));
            });
        }
        /**
         * 获取 subscribe 接口的请求体数据
         * @param subscribeList 订阅清单
         * @param publishedStreams 已发布流
         * @param iceRestart
         */
        _createSubscribeParams(subscribeList, publishedStreams, iceRestart) {
            return __awaiter(this, void 0, void 0, function* () {
                // createOffer
                const offer = yield this._pc.createOffer(iceRestart);
                // 提供给录像、MCU 的分辨率数据
                const extend = {
                    resolutionInfo: []
                };
                // 动态码率
                const dynamicBitrate = { min: 0, max: 0 };
                Object.keys(publishedStreams).forEach(msid => {
                    const { mediaStream, tinyStream } = publishedStreams[msid];
                    [mediaStream, tinyStream].forEach((stream, index) => {
                        var _a;
                        // 修改 SDP 内的 streamId
                        const tempMsid = index === 1 ? [msid, 'tiny'].join('_') : msid;
                        offer.sdp = (_a = offer.sdp) === null || _a === void 0 ? void 0 : _a.replace(new RegExp(stream.id, 'g'), tempMsid);
                        const videoTrack = stream.getVideoTracks()[0];
                        if (!videoTrack) {
                            return;
                        }
                        const isNormal = index === 0;
                        const { width, height, frameRate } = isNormal ? getVideoTrackInfo(videoTrack) : tinyConf;
                        // 统计分辨率数据
                        extend.resolutionInfo.push({
                            trackId: videoTrack.id,
                            simulcast: isNormal ? RCStreamType.NORMAL : RCStreamType.TINY,
                            resolution: `${width}x${height}`
                        });
                        // 计算动态码率以备给 answer 使用
                        const config = getNearestResolution(width, height);
                        const multiple = getBitrateMultiple(frameRate);
                        dynamicBitrate.min += (config.minBitrate * multiple);
                        dynamicBitrate.max += (config.maxBitrate * multiple);
                    });
                });
                const reqBody = {
                    sdp: offer,
                    switchstream: false,
                    newVersionFlag: true,
                    subscribeList: subscribeList.map(item => ({
                        simulcast: item.subTiny ? RCStreamType.TINY : RCStreamType.NORMAL,
                        resolution: '',
                        uri: this._roomRes[item.track.getTrackId()].uri
                    }))
                };
                return { reqBody, dynamicBitrate, offer };
            });
        }
        _subscribeHandle(tracks, forceReq = false) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                const roomStatusCode = this._assertRoomDestroyed();
                if (roomStatusCode) {
                    return { code: exports.RCRTCCode.ROOM_HAS_BEEN_DESTROYED };
                }
                if (!engine.validate('tracks', tracks, () => {
                    return engine.isArray(tracks) && tracks.length > 0 && tracks.every(item => {
                        return item instanceof RCRemoteTrack || item.track instanceof RCRemoteTrack;
                    });
                }, true)) {
                    return { code: exports.RCRTCCode.PARAMS_ERROR };
                }
                const crtSubList = this._subscribedList.map(item => (Object.assign({}, item)));
                const attrs = tracks.map(item => {
                    return item instanceof RCRemoteTrack ? { track: item } : item;
                });
                let trackChanged = false;
                const R2TrackIds = [];
                attrs.forEach(item => {
                    const trackId = item.track.getTrackId();
                    R2TrackIds.push(trackId);
                    const crt = crtSubList.find(tmp => tmp.track.getTrackId() === trackId);
                    if (crt && crt.subTiny === item.subTiny) {
                        return;
                    }
                    if (crt) {
                        crt.subTiny = item.subTiny;
                    }
                    else {
                        crtSubList.push(item);
                    }
                    trackChanged = true;
                });
                if (!trackChanged && !forceReq) {
                    return { code: exports.RCRTCCode.SUCCESS };
                }
                // 北极星上报
                (_a = this._polarisReport) === null || _a === void 0 ? void 0 : _a.sendR2(R2Action.SUBSCRIBE, R2Status.BEGIN, R2TrackIds);
                return this._updateSubListHandle(crtSubList, true);
            });
        }
        _getReqHeaders() {
            const userId = this._context.getCurrentId();
            // 直播观众端 RoomId 与 UserId 保持一致
            return {
                'App-Key': this._context.getAppkey(),
                RoomId: userId,
                Token: this._token,
                RoomType: engine.RTCMode.LIVE,
                UserId: userId,
                'Session-Id': this._sessionId
            };
        }
        _exchangeHandle(body) {
            return this._service.broadcastSubscribe(this._getReqHeaders(), body);
        }
        _updateSubListHandle(tracks, forceReq = false) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                const roomStatusCode = this._assertRoomDestroyed();
                if (roomStatusCode) {
                    return { code: exports.RCRTCCode.ROOM_HAS_BEEN_DESTROYED };
                }
                if (!engine.validate('resources', tracks, () => {
                    return engine.isArray(tracks) && tracks.every(res => {
                        return res instanceof RCRemoteTrack || res.track instanceof RCRemoteTrack;
                    });
                }, true)) {
                    return { code: exports.RCRTCCode.PARAMS_ERROR };
                }
                let attrs = tracks.map(item => {
                    return item instanceof RCRemoteTrack ? { track: item } : Object.assign({}, item);
                });
                // resourceId 去重，并做数据深拷贝
                const map = {};
                attrs = attrs.filter(res => {
                    const trackId = res.track.getTrackId();
                    if (map[trackId]) {
                        return false;
                    }
                    return (map[trackId] = true);
                }).map(item => (Object.assign({}, item)));
                const crtSubList = this._subscribedList.map(item => (Object.assign({}, item)));
                if (!forceReq) {
                    let changed = false;
                    // 检查与现有订阅列表是否有差别
                    attrs.forEach(item => {
                        const index = crtSubList.findIndex(tmp => tmp.track === item.track);
                        // 新增订阅
                        if (index === -1) {
                            changed = true;
                            return;
                        }
                        // 已存在的订阅内容，检测 tiny 是否有变更，同时从 crtSubList 中移除
                        // 剩余未移除的内容为已取消订阅内容
                        const crt = crtSubList.splice(index, 1)[0];
                        if (crt.subTiny !== item.subTiny) {
                            changed = true;
                        }
                    });
                    // crtSubList 中剩余内容为取消订阅资源
                    if (crtSubList.length) {
                        changed = true;
                    }
                    if (!changed) {
                        return { code: exports.RCRTCCode.SUCCESS };
                    }
                }
                // 客户端主动调用 api 发请求时，清除 ice 断线重连的定时器
                this._pc.clearReTryExchangeTimer();
                this._pc.updateSubRemoteTracks(attrs.map(item => item.track));
                // MediaServer 交互
                const { reqBody } = yield this._createSubscribeParams(attrs, {}, false);
                const result = yield this._exchangeHandle(reqBody);
                if (crtSubList.length) {
                    // 取消订阅时，清除 parseRTCReport 模块中存储的数据
                    const resourceIds = [];
                    crtSubList.forEach(item => {
                        resourceIds.push(item.track.getTrackId());
                    });
                    (_a = this._pc.reportParser) === null || _a === void 0 ? void 0 : _a.clearLatestPacketsRecv(resourceIds);
                }
                if (result.code !== exports.RCRTCCode.SUCCESS) {
                    return { code: result.code };
                }
                const { sdp: answer, resultCode, message } = result.data;
                if (resultCode !== exports.RCRTCCode.SUCCESS) {
                    logger.error('change subscribe list failed:', message, resultCode);
                    return { code: resultCode };
                }
                // 修改 answer.sdp 中 msid
                attrs.forEach(item => {
                    const { track } = item;
                    if (track.isMCUTrack()) {
                        const sdpMsid = this._roomRes[track.getTrackId()].msid;
                        const { tag, userId: roomId } = parseTrackId(track.getTrackId());
                        const currentMsid = [roomId, tag].join('_');
                        answer.sdp = answer.sdp.replace(new RegExp(sdpMsid, 'g'), currentMsid);
                    }
                });
                const resCode = yield this._pc.setRemoteAnswer(answer.sdp);
                if (resCode !== exports.RCRTCCode.SUCCESS) {
                    return { code: resCode };
                }
                // 更新 remoteTrack.isSubscribed
                for (const trackId in this._remoteTracks) {
                    const subed = attrs.some(item => {
                        return item.track.getTrackId() === trackId;
                    });
                    this._remoteTracks[trackId].__innerSetSubscribed(subed);
                }
                // 更新本地订阅关系
                this._subscribedList.splice(0, this._subscribedList.length, ...attrs);
                return { code: exports.RCRTCCode.SUCCESS };
            });
        }
        /**
         * 订阅资源
         * @param tracks
         */
        subscribe(tracks) {
            return __awaiter(this, void 0, void 0, function* () {
                return push(() => this._subscribeHandle(tracks, false));
            });
        }
        __unsubscribe(tracks) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                if (!engine.validate('tracks', tracks, () => {
                    return engine.isArray(tracks) && tracks.length > 0 && tracks.every(item => item instanceof RCRemoteTrack);
                }, true)) {
                    logger.error(`unsubscribe failed, tracks is invalid -> roomId: ${this._roomId}`);
                    return { code: exports.RCRTCCode.PARAMS_ERROR };
                }
                // 计算剩余订阅列表
                const crtSubList = this._subscribedList.map(item => (Object.assign({}, item)))
                    .filter(item => !tracks.includes(item.track));
                // 北极星上报
                (_a = this._polarisReport) === null || _a === void 0 ? void 0 : _a.sendR2(R2Action.SUBSCRIBE, R2Status.END, tracks.map(item => item.getTrackId()));
                return this._updateSubListHandle(crtSubList, false);
            });
        }
        /**
         * 取消订阅资源
         * @param tracks
         */
        unsubscribe(tracks) {
            return __awaiter(this, void 0, void 0, function* () {
                return push(() => this.__unsubscribe(tracks));
            });
        }
        /**
         * 退出房间并销毁当前房间实例，退出后该房间的所有方法将不可用
         */
        __destroy(quitRoom) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                if (this._destroyed) {
                    return;
                }
                this._destroyed = true;
                // 清除音量上报定时器
                (_a = this._audioLevelReport) === null || _a === void 0 ? void 0 : _a.clearAudioLevelReportTimer();
                // 退出 signal 房间
                if (quitRoom) {
                    yield this._context.quitLivingRoomAsAudience(this._roomId);
                }
                // 中断与 MediaServer 的连接
                yield this._service.broadcastExit(this._getReqHeaders());
                // 销毁 pc 连接
                this._pc.destroy();
                // 销毁 polarisReport 实例
                this._polarisReport = null;
            });
        }
        /**
         * 根据 trackId 获取房间内的远端资源
         * @param trackId
         */
        getRemoteTrack(trackId) {
            return this._remoteTracks[trackId];
        }
        /**
         * 获取 _pc 实例
         */
        __getPC() {
            return this._pc;
        }
        /**
         * TODO 待优化
         * @param trackId
         */
        getLocalTrack(trackId) {
            return {};
        }
        /**
         * 断线重连后处理逻辑, SDK 内部处理调用
         */
        __onReconnected() {
            return __awaiter(this, void 0, void 0, function* () {
                /**
                 * 重新加入房间后，从头拉取全量资源
                 */
                const { code } = yield this._context.joinLivingRoomAsAudience(this._roomId, engine.RTCMode.LIVE);
                if (code !== engine.ErrorCode.SUCCESS) {
                    logger.error('join living room error when on reconnected');
                }
            });
        }
        /**
         * 观众房间事件注册
         * @param tag 参数描述
         */
        registerRoomEventListener(listener) {
            this._appListener = listener;
        }
        /**
         * 音量上报
         * @param handler 业务端传入的音量上报事件
         * @param gap 上报时间间隔
         */
        onAudioLevelChange(handler, gap) {
            var _a;
            (_a = this._audioLevelReport) === null || _a === void 0 ? void 0 : _a.clearAudioLevelReportTimer();
            this._audioLevelReport = new RCAudioLevelReport(this);
            this._audioLevelReport.onAudioLevelChange(handler, gap || 1000);
        }
        /**
         * 注册房间数据监控
         * @param listener
         */
        registerReportListener(listener) {
            var _a;
            (_a = this._pc) === null || _a === void 0 ? void 0 : _a.registerReportListener(listener);
        }
        /**
         * 获取房间 Id
         */
        getRoomId() {
            return this._roomId;
        }
        /**
         * 获取当前 userId
         */
        getCrtUserId() {
            return this._context.getCurrentId();
        }
        /**
         * 获取房间当前会话 Id，当房间内已无成员时房间会回收，重新加入时 sessionId 将更新
         */
        getSessionId() {
            return this._sessionId;
        }
        /**
         * 获取远程主播用户列表
         */
        getRemoteUserIds() {
            return this._roomAnchorList;
        }
        /**
         * 获取远端用户的资源列表
         * @param userId
         * @returns
         */
        getRemoteTracksByUserId(userId) {
            const tracks = [];
            for (const trackId in this._remoteTracks) {
                const track = this._remoteTracks[trackId];
                if (track.getUserId() === userId) {
                    tracks.push(track);
                }
            }
            return tracks;
        }
        /**
         * 获取房间内所有已发布的远端资源列表, 包含合流资源
         * @returns
         */
        getRemoteTracks() {
            const tracks = [];
            const mcuTracks = [];
            for (const id in this._remoteTracks) {
                // 合流资源最多两道
                if (mcuTracks.length === 2)
                    break;
                const track = this._remoteTracks[id];
                if (track.isMCUTrack()) {
                    mcuTracks.push(track);
                }
            }
            this._roomAnchorList.forEach(id => {
                tracks.push(...this.getRemoteTracksByUserId(id));
            });
            return [...mcuTracks, ...tracks];
        }
    }

    const getTracksWithOptions = (stream, options) => {
        const tracks = [];
        tracks[0] = (options === null || options === void 0 ? void 0 : options.withoutAudio) ? undefined : stream.getAudioTracks()[0];
        tracks[1] = (options === null || options === void 0 ? void 0 : options.withoutVideo) ? undefined : stream.getVideoTracks()[0];
        return tracks;
    };
    /**
     * RTC 业务客户端
     * @public
     */
    class RCRTCClient {
        constructor(_context, _runtime, _options) {
            this._context = _context;
            this._runtime = _runtime;
            this._options = _options;
            this._crtRoom = null;
            this._audience = null;
            this._crtAudienceLivingRoom = null;
            // 用户不指定时，默认以 plan-b 优先选项
            ASdpStrategy.setSdpSemantics(_options.sdpSemantics || 'plan-b');
            this._service = new RCMediaService(this._runtime, this._context, this._options.mediaServer, this._options.timeout);
            // 监听 IM 连接状态变更
            this._context.onconnectionstatechange = this._onIMStatusChange.bind(this);
            // 监听业务层主动断开连接
            this._context.ondisconnect = this._onIMDisconnect.bind(this);
            // 监听业务层 IM 连接销毁
            this._context.ondestroy = this._onIMUninit.bind(this);
            // 监听房间内的消息
            this._context.onmessage = this._handleMessage.bind(this);
        }
        _handleMessage(message) {
            var _a;
            // 过滤非 RTC 消息
            if (message.conversationType !== engine.ConversationType.RTC_ROOM) {
                return false;
            }
            (_a = this._crtRoom) === null || _a === void 0 ? void 0 : _a.__parseInnerMessage(message);
            return true;
        }
        /**
         * 获取当前用户 Id，若 IM 未连接，这返回 `''`
         * @returns
         */
        getCurrentId() {
            return this._context.getCurrentId();
        }
        /**
         * 加入普通音视频房间
         * @param roomId
         */
        joinRTCRoom(roomId, joinType) {
            return push(() => this._joinRTCRoom(roomId, joinType));
        }
        _joinRTCRoom(roomId, joinType) {
            return __awaiter(this, void 0, void 0, function* () {
                if (isIllegalConnection(this._context.getNaviInfo())) {
                    return { code: exports.RCRTCCode.PACKAGE_ENVIRONMENT_ERROR };
                }
                if (!engine.validate('roomId', roomId, engine.notEmptyString, true)) {
                    return { code: exports.RCRTCCode.PARAMS_ERROR };
                }
                if (this._crtRoom) {
                    return { code: exports.RCRTCCode.REPERT_JOIN_ROOM };
                }
                if (this._context.getConnectionStatus() !== engine.ConnectionStatus.CONNECTED) {
                    return { code: exports.RCRTCCode.SIGNAL_DISCONNECTED };
                }
                const urls = this._service.getNaviMS();
                if (!urls.length) {
                    return { code: exports.RCRTCCode.NOT_OPEN_VIDEO_AUDIO_SERVER };
                }
                logger.debug(`joinRoom -> roomId: ${roomId}; joinType: ${joinType || engine.RTCJoinType.KICK}`);
                const { code, data } = yield this._context.joinRTCRoom(roomId, engine.RTCMode.RTC, joinType);
                if (code !== engine.ErrorCode.SUCCESS) {
                    logger.error(`joinRoom failed -> code: ${code}`);
                    const errorCode = code === RTCSignalCode.JOIN_REFUSED ? exports.RCRTCCode.SIGNAL_JOIN_RTC_ROOM_REFUSED : code;
                    return { code: errorCode };
                }
                logger.debug(`joinRoom success -> userId: ${this._context.getCurrentId()}, roomId: ${roomId}, data: ${JSON.stringify(data)}`);
                const room = new RCRTCRoom(this._context, this._runtime, roomId, data, this._service, this._options, this._releaseCrtRoomObj.bind(this));
                this._crtRoom = room;
                return { room, code: exports.RCRTCCode.SUCCESS, userIds: room.getRemoteUserIds(), tracks: room.getRemoteTracks() };
            });
        }
        /**
         * 主播加入直播房间或观众上麦场景调用，观众上麦之前需先取消已订阅的直播间资源
         * @param roomId 房间 Id
         * @param livingType 直播间类型，`RCLivingType.AUDIO` 为音频直播，`RCLivingType.VIDEO` 为音视频直播
         */
        joinLivingRoom(roomId, livingType) {
            return push(() => this._joinLivingRoom(roomId, livingType));
        }
        _joinLivingRoom(roomId, livingType) {
            return __awaiter(this, void 0, void 0, function* () {
                if (isIllegalConnection(this._context.getNaviInfo())) {
                    return { code: exports.RCRTCCode.PACKAGE_ENVIRONMENT_ERROR };
                }
                if (!(engine.validate('roomId', roomId, engine.notEmptyString, true) &&
                    engine.validate('livingType', livingType, (value) => value === exports.RCLivingType.AUDIO || value === exports.RCLivingType.VIDEO))) {
                    return { code: exports.RCRTCCode.PARAMS_ERROR };
                }
                // 已存在直播房间
                if (this._crtRoom) {
                    return { code: exports.RCRTCCode.REPERT_JOIN_ROOM };
                }
                if (this._context.getConnectionStatus() !== engine.ConnectionStatus.CONNECTED) {
                    return { code: exports.RCRTCCode.SIGNAL_DISCONNECTED };
                }
                const urls = this._service.getNaviMS();
                if (!urls.length) {
                    return { code: exports.RCRTCCode.NOT_OPEN_VIDEO_AUDIO_SERVER };
                }
                logger.debug(`joinRoom, roomId: ${roomId}`);
                const { code, data } = yield this._context.joinRTCRoom(roomId, engine.RTCMode.LIVE, livingType);
                // IM 信令错误
                if (code !== engine.ErrorCode.SUCCESS) {
                    logger.error(`joinRoom failed -> code: ${code}`);
                    return { code: code };
                }
                logger.debug(`JoinRoom success -> userId: ${this._context.getCurrentId()}, roomId: ${roomId}, data: ${JSON.stringify(data)}`);
                const room = new RCLivingRoom(this._context, this._runtime, roomId, data, this._service, this._options, this._releaseCrtRoomObj.bind(this), livingType, false);
                this._crtRoom = room;
                return { room, code: exports.RCRTCCode.SUCCESS, userIds: room.getRemoteUserIds(), tracks: room.getRemoteTracks() };
            });
        }
        /**
         * 获取直播观众客户端
         */
        getAudienceClient() {
            if (!this._audience) {
                this._audience = new RCAudienceClient(this._context, this._runtime, this._options);
            }
            return this._audience;
        }
        _onIMStatusChange(status) {
            logger.debug(`signal server connection state change: ${status}`);
            if (status !== engine.ConnectionStatus.CONNECTED) {
                return;
            }
            this._crtRoom && this._crtRoom.__onReconnected();
        }
        _onIMDisconnect() {
            // 用户主动断开 IM 连接
            logger.debug('TODO -> on IM disconnect');
        }
        _onIMUninit() {
            // 用户销毁 IM 客户端，IM 客户端需重新初始化
            logger.debug('TODO -> on IM client ondestroy');
        }
        /**
         * 退出并销毁当前房间实例，退出后该房间的所有方法将不可用
         */
        leaveRoom(room) {
            return push(() => this._leaveRoom(room));
        }
        _leaveRoom(room) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._crtRoom) {
                    return { code: exports.RCRTCCode.SUCCESS };
                }
                yield this._crtRoom.__destroy(true);
                logger.debug(`quitRTCRoom -> userId: ${this._context.getCurrentId()} , roomId: ${this._crtRoom.getRoomId()}`);
                this._crtRoom = null;
                return { code: exports.RCRTCCode.SUCCESS };
            });
        }
        /**
         * 清除 _crtRoom 的引用
         */
        _releaseCrtRoomObj() {
            this._crtRoom = null;
        }
        _getMediaStream(constraints, method = 'getUserMedia') {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const stream = yield navigator.mediaDevices[method](constraints);
                    return { code: exports.RCRTCCode.SUCCESS, stream };
                }
                catch (error) {
                    if (error.message === 'Permission denied') {
                        return { code: exports.RCRTCCode.PERMISSION_DENIED };
                    }
                    logger.error(`get user media failed -> ${error.message}`);
                }
                return { code: method === 'getUserMedia' ? exports.RCRTCCode.GET_USER_MEDIA_FAILED : exports.RCRTCCode.GET_DISPLAY_MEDIA_FAILED };
            });
        }
        /**
         * 从麦克风中捕获音轨数据
         * @param tag
         * @param options
         * @returns
         */
        createMicrophoneAudioTrack(tag = 'RongCloudRTC', options) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!isValidTag(tag)) {
                    return { code: exports.RCRTCCode.INVALID_TAGS };
                }
                const userId = this._context.getCurrentId();
                if (!userId) {
                    return { code: exports.RCRTCCode.INVALID_USER_ID };
                }
                const { stream, code } = yield this._getMediaStream({ audio: { deviceId: options === null || options === void 0 ? void 0 : options.micphoneId, sampleRate: options === null || options === void 0 ? void 0 : options.sampleRate } });
                if (code !== exports.RCRTCCode.SUCCESS) {
                    return { code };
                }
                const audioTrack = stream.getAudioTracks()[0];
                const localAudioTrack = new RCMicphoneAudioTrack(tag, userId, audioTrack);
                return { code, track: localAudioTrack };
            });
        }
        /**
         * 由摄像头捕获视轨数据
         * @param tag
         * @param options
         * @returns
         */
        createCameraVideoTrack(tag = 'RongCloudRTC', options) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!isValidTag(tag)) {
                    return { code: exports.RCRTCCode.INVALID_TAGS };
                }
                const userId = this._context.getCurrentId();
                if (!userId) {
                    return { code: exports.RCRTCCode.INVALID_USER_ID };
                }
                const resolution = isValidResolution(options === null || options === void 0 ? void 0 : options.resolution) ? options.resolution : exports.RCResolution.W640_H480;
                const { width, height } = transResolution(resolution);
                const { stream, code } = yield this._getMediaStream({
                    video: {
                        deviceId: options === null || options === void 0 ? void 0 : options.cameraId,
                        frameRate: transFrameRate((options === null || options === void 0 ? void 0 : options.frameRate) || exports.RCFrameRate.FPS_15),
                        width,
                        height
                    }
                });
                if (code !== exports.RCRTCCode.SUCCESS) {
                    return { code };
                }
                const videoTrack = stream.getVideoTracks()[0];
                const cameraTrack = new RCCameraVideoTrack(tag, userId, videoTrack);
                return { code, track: cameraTrack };
            });
        }
        /**
         * 通过摄像头与麦克风采集音视频轨道数据
         * @param tag
         * @param options
         * @returns
         */
        createMicrophoneAndCameraTracks(tag = 'RongCloudRTC', options) {
            var _a, _b, _c, _d, _e;
            return __awaiter(this, void 0, void 0, function* () {
                const tracks = [];
                if (!isValidTag(tag)) {
                    return { code: exports.RCRTCCode.INVALID_TAGS, tracks };
                }
                const userId = this._context.getCurrentId();
                if (!userId) {
                    return { code: exports.RCRTCCode.INVALID_USER_ID, tracks };
                }
                const resolution = isValidResolution((_a = options === null || options === void 0 ? void 0 : options.video) === null || _a === void 0 ? void 0 : _a.resolution) ? options.video.resolution : exports.RCResolution.W640_H480;
                const { width, height } = transResolution(resolution);
                const { stream, code } = yield this._getMediaStream({
                    video: {
                        deviceId: (_b = options === null || options === void 0 ? void 0 : options.video) === null || _b === void 0 ? void 0 : _b.cameraId,
                        frameRate: transFrameRate(((_c = options === null || options === void 0 ? void 0 : options.video) === null || _c === void 0 ? void 0 : _c.frameRate) || exports.RCFrameRate.FPS_15),
                        width,
                        height
                    },
                    audio: { deviceId: (_d = options === null || options === void 0 ? void 0 : options.audio) === null || _d === void 0 ? void 0 : _d.micphoneId, sampleRate: (_e = options === null || options === void 0 ? void 0 : options.audio) === null || _e === void 0 ? void 0 : _e.sampleRate }
                });
                if (code !== exports.RCRTCCode.SUCCESS) {
                    return { code, tracks };
                }
                stream.getTracks().forEach(track => {
                    if (track.kind === 'video') {
                        tracks.push(new RCCameraVideoTrack(tag, userId, track));
                    }
                    else {
                        tracks.unshift(new RCMicphoneAudioTrack(tag, userId, track));
                    }
                });
                return { code, tracks };
            });
        }
        /**
         * 创建屏幕共享视频流，默认分辨率 `1280 * 720`，帧率 `15`
         * @param tag 屏幕共享视轨数据标识
         * @param options
         * @description
         * 支持 Electron 平台下通过制定 `chromeMediaSrouceId` 的方式获取屏幕共享视频。
         * 参考：https://www.electronjs.org/docs/api/desktop-capturer
         */
        createScreenVideoTrack(tag = 'screenshare', options) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!isValidTag(tag)) {
                    return { code: exports.RCRTCCode.INVALID_TAGS };
                }
                const userId = this._context.getCurrentId();
                if (!userId) {
                    return { code: exports.RCRTCCode.INVALID_USER_ID };
                }
                if (!ifSupportScreenShare()) {
                    return { code: exports.RCRTCCode.BROWSER_NOT_SUPPORT };
                }
                const isElectron = /Electron/.test(navigator.userAgent);
                if (isElectron && !(options === null || options === void 0 ? void 0 : options.chromeMediaSourceId)) {
                    return { code: exports.RCRTCCode.PARAMS_ERROR };
                }
                const resolution = isValidResolution(options === null || options === void 0 ? void 0 : options.resolution) ? options.resolution : exports.RCResolution.W1280_H720;
                const { width, height } = transResolution(resolution);
                const video = isElectron ? {
                    mandatory: {
                        chromeMediaSourceId: options.chromeMediaSourceId,
                        chromeMediaSource: 'desktop',
                        minWidth: width,
                        maxWidth: width,
                        minHeight: height,
                        maxHeight: height
                    }
                    // electron 环境下不可指定 frameRate
                    // frameRate: transFrameRate(options?.frameRate || RCFrameRate.FPS_15),
                } : {
                    frameRate: transFrameRate((options === null || options === void 0 ? void 0 : options.frameRate) || exports.RCFrameRate.FPS_15),
                    width,
                    height
                };
                const { stream, code } = yield this._getMediaStream({ video, audio: false }, isElectron ? 'getUserMedia' : 'getDisplayMedia');
                if (code !== exports.RCRTCCode.SUCCESS) {
                    return { code };
                }
                const videoTrack = stream.getVideoTracks()[0];
                const screenTrack = new RCScreenVideoTrack(tag, userId, videoTrack);
                return { code, track: screenTrack };
            });
        }
        /**
         * 创建 RCLocalAudioTrack 实例
         * @param tag
         * @param track
         * @returns
         */
        createLocalAudioTrack(tag, track) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!isValidTag(tag)) {
                    return { code: exports.RCRTCCode.INVALID_TAGS };
                }
                if (!track || track.toString() !== '[object MediaStreamTrack]' || track.kind !== 'audio') {
                    return { code: exports.RCRTCCode.CREATE_CUSTOM_TRACK_FAILED };
                }
                const userId = this._context.getCurrentId();
                if (!userId) {
                    return { code: exports.RCRTCCode.INVALID_USER_ID };
                }
                return { code: exports.RCRTCCode.SUCCESS, track: new RCLocalAudioTrack(tag, userId, track) };
            });
        }
        /**
         * 创建 RCLocalVideoTrack 实例
         * @param tag 视轨数据标识
         * @param track MediaStreamTrack 实例
         * @returns
         */
        createLocalVideoTrack(tag, track) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!isValidTag(tag)) {
                    return { code: exports.RCRTCCode.INVALID_TAGS };
                }
                if (!track || track.toString() !== '[object MediaStreamTrack]' || track.kind !== 'video') {
                    return { code: exports.RCRTCCode.CREATE_CUSTOM_TRACK_FAILED };
                }
                const userId = this._context.getCurrentId();
                if (!userId) {
                    return { code: exports.RCRTCCode.INVALID_USER_ID };
                }
                return { code: exports.RCRTCCode.SUCCESS, track: new RCLocalVideoTrack(tag, userId, track) };
            });
        }
        /**
         * 根据本地或网络媒体文件资源创建 `RCLocalFileTrack` 实例
         * @param tag 资源标识
         * @param file 网络文件地址，或通过 <input type='file'> 获取到的 File 实例
         * @param options 可用于指定 `withoutVideo` 与 `withoutAudio` 以剔除视轨与音轨
         */
        createLocalFileTracks(tag, file, options) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!isValidTag(tag)) {
                    return { code: exports.RCRTCCode.INVALID_TAGS, tracks: [] };
                }
                // captureStream 检测
                if (!ifSupportLocalFileTrack()) {
                    return { code: exports.RCRTCCode.BROWSER_NOT_SUPPORT, tracks: [] };
                }
                const url = file instanceof File ? URL.createObjectURL(file) : file;
                if (!engine.isHttpUrl(url) && !/^blob:/.test(url)) {
                    logger.warn(`createLocalFileTracks failed: params error -> url: ${url}`);
                    return { code: exports.RCRTCCode.PARAMS_ERROR, tracks: [] };
                }
                const userId = this._context.getCurrentId();
                if (!userId) {
                    return { code: exports.RCRTCCode.INVALID_USER_ID, tracks: [] };
                }
                return new Promise(resolve => {
                    const video = document.createElement('video');
                    if (options === null || options === void 0 ? void 0 : options.withoutAudio) {
                        video.muted = true;
                    }
                    video.onloadedmetadata = () => {
                        const tracks = [];
                        let mediaStream;
                        try {
                            const captureStream = video.mozCaptureStream ? 'mozCaptureStream' : 'captureStream';
                            mediaStream = video[captureStream]();
                        }
                        catch (error) {
                            logger.error(`create RCLocalFileTrack failed, captureSteam error. -> url: ${url}`);
                            logger.error(error);
                            resolve({ code: exports.RCRTCCode.CREATE_FILE_TRACK_FAILED, tracks });
                        }
                        const [audioTrack, videoTrack] = getTracksWithOptions(mediaStream, options);
                        audioTrack && tracks.push(new RCLocalFileAudioTrack(tag, userId, audioTrack, video));
                        videoTrack && tracks.push(new RCLocalFileVideoTrack(tag, userId, videoTrack, video));
                        if (tracks.length === 0) {
                            video.pause();
                            video.src = '';
                        }
                        video.onerror = null;
                        resolve({ code: exports.RCRTCCode.SUCCESS, tracks });
                    };
                    video.onerror = () => {
                        logger.error(`create RCLocalFileTrack failed -> url: ${url}`);
                        resolve({ code: exports.RCRTCCode.CREATE_FILE_TRACK_FAILED, tracks: [] });
                    };
                    video.src = url;
                    video.loop = true;
                    video.play();
                });
            });
        }
        /**
         * 根据 MediaStream 实例对象创建 RCLocalTrack 实例
         * @param tag 轨道标识
         * @param stream MediaStream 实例
         * @param options 可用于指定 `withoutVideo` 与 `withoutAudio` 以剔除视轨与音轨
         * @returns
         */
        createLocalTracks(tag, stream, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const tracks = [];
                if (!isValidTag(tag)) {
                    return { code: exports.RCRTCCode.INVALID_TAGS, tracks };
                }
                if (!(stream instanceof MediaStream)) {
                    return { code: exports.RCRTCCode.PARAMS_ERROR, tracks };
                }
                const userId = this._context.getCurrentId();
                if (!userId) {
                    return { code: exports.RCRTCCode.INVALID_USER_ID, tracks };
                }
                const [audioTrack, videoTrack] = getTracksWithOptions(stream, options);
                audioTrack && tracks.push(new RCLocalAudioTrack(tag, userId, audioTrack));
                videoTrack && tracks.push(new RCLocalVideoTrack(tag, userId, videoTrack));
                return { code: exports.RCRTCCode.SUCCESS, tracks };
            });
        }
        /**
         * 观众加入直播房间
         * @param roomId 房间 ID
         * @param livingType 直播类型（音频直播 or 音视频直播）
         */
        joinLivingRoomAsAudience(roomId, livingType) {
            return __awaiter(this, void 0, void 0, function* () {
                if (isIllegalConnection(this._context.getNaviInfo())) {
                    return { code: exports.RCRTCCode.PACKAGE_ENVIRONMENT_ERROR };
                }
                if (!(engine.validate('roomId', roomId, engine.notEmptyString, true) &&
                    engine.validate('livingType', livingType, (value) => value === exports.RCLivingType.AUDIO || value === exports.RCLivingType.VIDEO))) {
                    return { code: exports.RCRTCCode.PARAMS_ERROR };
                }
                // 已存在直播房间
                if (this._crtAudienceLivingRoom) {
                    return { code: exports.RCRTCCode.REPERT_JOIN_ROOM };
                }
                const urls = this._service.getNaviMS();
                if (!urls.length) {
                    return { code: exports.RCRTCCode.NOT_OPEN_VIDEO_AUDIO_SERVER };
                }
                const { code, data } = yield this._context.joinLivingRoomAsAudience(roomId, engine.RTCMode.LIVE, livingType);
                if (code !== engine.ErrorCode.SUCCESS) {
                    logger.error('audienceJoinLivingRoomError:', code);
                    return { code: exports.RCRTCCode.SIGNAL_AUDIENCE_JOIN_ROOM_FAILED };
                }
                const room = new RCAudienceLivingRoom(this._context, this._runtime, this._options, roomId, data.token, livingType);
                this._crtAudienceLivingRoom = room;
                return { room, code: exports.RCRTCCode.SUCCESS };
            });
        }
        /**
         * 观众退出并销毁当前房间实例，退出后该房间的所有方法将不可用
         */
        leaveLivingRoomAsAudience(room) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._crtAudienceLivingRoom) {
                    return { code: exports.RCRTCCode.SUCCESS };
                }
                if (this._crtAudienceLivingRoom !== room) {
                    return { code: exports.RCRTCCode.PARAMS_ERROR };
                }
                yield this._crtAudienceLivingRoom.__destroy(true);
                this._crtAudienceLivingRoom = null;
                return { code: exports.RCRTCCode.SUCCESS };
            });
        }
        /**
         * 升级为主播房间
         * @param room 观众房间实例
         */
        upgradeToAnchorRoom(room) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!engine.validate('room._roomId', room._roomId, engine.notEmptyString, true)) {
                    return { code: exports.RCRTCCode.PARAMS_ERROR };
                }
                // 已存在主播房间
                if (this._crtRoom) {
                    return { code: exports.RCRTCCode.REPERT_JOIN_ROOM };
                }
                const { code, data } = yield this._context.rtcIdentityChange(room._roomId, engine.RTCIdentityChangeType.ViewerToAnchor, room._livingType);
                if (code !== engine.ErrorCode.SUCCESS) {
                    logger.error('change room identity error', code);
                    return { code: exports.RCRTCCode.SIGNAL_ROOM_CHANGE_IDENTITY_FAILED };
                }
                // 观众房间内存数据清除
                yield this._crtAudienceLivingRoom.__destroy(false);
                const crtRoom = new RCLivingRoom(this._context, this._runtime, room._roomId, data, this._service, this._options, this._releaseCrtRoomObj.bind(this), room._livingType, true);
                this._crtRoom = crtRoom;
                // 重置观众房间
                this._crtAudienceLivingRoom = null;
                return { room: crtRoom, code: exports.RCRTCCode.SUCCESS };
            });
        }
        /**
         * 降级为观众房间
         * @param room 主播房间实例
         */
        downgradeToAudienceRoom(room) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!engine.validate('room._roomId', room._roomId, engine.notEmptyString, true)) {
                    return { code: exports.RCRTCCode.PARAMS_ERROR };
                }
                // 已存在观众房间
                if (this._crtAudienceLivingRoom) {
                    return { code: exports.RCRTCCode.REPERT_JOIN_ROOM };
                }
                const singalCode = yield room.__unpublishToSingal();
                if (singalCode !== engine.ErrorCode.SUCCESS) {
                    logger.error('change room identity setAllUris error', singalCode);
                    return { code: exports.RCRTCCode.SIGNAL_ERROR };
                }
                const { code, data } = yield this._context.rtcIdentityChange(room._roomId, engine.RTCIdentityChangeType.AnchorToViewer, room.getLivingType());
                if (code !== engine.ErrorCode.SUCCESS) {
                    logger.error('change room identity error', code);
                    return { code: exports.RCRTCCode.SIGNAL_ROOM_CHANGE_IDENTITY_FAILED };
                }
                const { token } = data;
                const crtRoom = new RCAudienceLivingRoom(this._context, this._runtime, this._options, room._roomId, token, room.getLivingType());
                this._crtAudienceLivingRoom = crtRoom;
                // 主播房间内存数据清除及停止 Signal 房间心跳
                this._crtRoom.__destroy(false);
                // 重置主播房间
                this._crtRoom = null;
                return { room: crtRoom, code: exports.RCRTCCode.SUCCESS };
            });
        }
        /**
         * 获取在房间内用户信息
         * 当前仅能查自己
         * @since version 5.1.5
         */
        getJoinedUserInfo(userId) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!engine.validate('userId', userId, engine.notEmptyString, true)) {
                    return { code: exports.RCRTCCode.PARAMS_ERROR };
                }
                const { code, data } = yield this._context.getRTCJoinedUserInfo(userId);
                if (code !== engine.ErrorCode.SUCCESS) {
                    logger.error('getJoinedUserInfo error', code);
                    return { code: exports.RCRTCCode.SIGNAL_ROOM_CHANGE_IDENTITY_FAILED };
                }
                return { code: exports.RCRTCCode.SUCCESS, data };
            });
        }
    }

    exports.RCKickReason = void 0;
    (function (RCKickReason) {
        /**
         * Server 主动踢（掉 Server API 踢出）
         */
        RCKickReason[RCKickReason["SERVER_KICK"] = 1] = "SERVER_KICK";
        /**
         * 其他设备登陆后，本端被踢
         */
        RCKickReason[RCKickReason["OTHER_KICK"] = 2] = "OTHER_KICK";
    })(exports.RCKickReason || (exports.RCKickReason = {}));

    /**
     * 获取 Microphone 列表
     */
    const getMicrophones = () => __awaiter(void 0, void 0, void 0, function* () {
        const mediaDivices = yield navigator.mediaDevices.enumerateDevices();
        return mediaDivices.filter(item => item.kind === 'audioinput');
    });
    /**
     * 获取摄像头设备列表
     */
    const getCameras = () => __awaiter(void 0, void 0, void 0, function* () {
        const mediaDevices = yield navigator.mediaDevices.enumerateDevices();
        return mediaDevices.filter(item => item.kind === 'videoinput');
    });
    /**
     * 获取扬声器设备列表
     */
    const getSpeakers = () => __awaiter(void 0, void 0, void 0, function* () {
        const mediaDevices = yield navigator.mediaDevices.enumerateDevices();
        return mediaDevices.filter(item => item.kind === 'audiooutput');
    });
    const device = {
        getCameras,
        getMicrophones,
        getSpeakers
    };

    /**
     * RTC 插件生成器
     * @public
     */
    const installer = {
        tag: 'RCRTC',
        verify(runtime) {
            if (runtime.tag !== "browser") {
                logger.error(`RCRTC Plugin is not support the runtime '${runtime.tag}'`);
                return false;
            }
            if (!isValidLocation) {
                logger.error('Please use the https protocol or use `http://localhost` to open the page!');
                return false;
            }
            return true;
        },
        setup(context, runtime, options = {}) {
            logger.setLogLevel(options.logLevel);
            logger.setLogStdout(options.logStdout);
            logger.warn(`RCRTC Version: ${"5.1.10-alpha.1"}, Commit: ${"a8f885ac00138264c5e7c9fbaebd718ff24f885c"}`);
            logger.warn(`browserInfo.browser -> ${browserInfo.browser}`);
            logger.warn(`browserInfo.supportsUnifiedPlan -> ${browserInfo.supportsUnifiedPlan}`);
            logger.warn(`browserInfo.version -> ${browserInfo.version}`);
            // mediaServer 地址为空时，使用导航下发地址
            engine.assert('options.mediaServer', options.mediaServer, (value) => {
                // 非有效 http URL 地址或页面为 https 协议而 value 为 http 协议时无效
                // 其他情况均不检测，以便于 Electron 下自定义协议能够通过检测
                return !(!engine.isHttpUrl(value) || (location.protocol === 'https:' && !/^https/.test(value)));
            });
            engine.assert('options.timeout', options.timeout, (value) => {
                return engine.isNumber(value) && value >= 5000 && value <= 30000;
            });
            engine.assert('options.pingGap', options.pingGap, (value) => {
                return engine.isNumber(value) && value >= 3000 && value <= 10000;
            });
            return new RCRTCClient(context, runtime, options);
        }
    };
    /**
     * 预定义的资源 tag
     */
    const RCTag = {
        /**
         * 默认流 Tag 定义
         */
        DEFAULT: 'RongCloudRTC'
    };
    const helper = {
        transResolution,
        transFrameRate,
        parseTrackId,
        ifSupportLocalFileTrack,
        ifSupportScreenShare
    };

    Object.defineProperty(exports, 'RTCJoinType', {
        enumerable: true,
        get: function () {
            return engine.RTCJoinType;
        }
    });
    exports.RCAbstractRoom = RCAbstractRoom;
    exports.RCAudienceClient = RCAudienceClient;
    exports.RCAudienceLivingRoom = RCAudienceLivingRoom;
    exports.RCCameraVideoTrack = RCCameraVideoTrack;
    exports.RCLivingRoom = RCLivingRoom;
    exports.RCLocalAudioTrack = RCLocalAudioTrack;
    exports.RCLocalFileAudioTrack = RCLocalFileAudioTrack;
    exports.RCLocalFileTrack = RCLocalFileTrack;
    exports.RCLocalFileVideoTrack = RCLocalFileVideoTrack;
    exports.RCLocalTrack = RCLocalTrack;
    exports.RCLocalVideoTrack = RCLocalVideoTrack;
    exports.RCMCUConfigBuilder = RCMCUConfigBuilder;
    exports.RCMicphoneAudioTrack = RCMicphoneAudioTrack;
    exports.RCRTCClient = RCRTCClient;
    exports.RCRTCRoom = RCRTCRoom;
    exports.RCRemoteAudioTrack = RCRemoteAudioTrack;
    exports.RCRemoteTrack = RCRemoteTrack;
    exports.RCRemoteVideoTrack = RCRemoteVideoTrack;
    exports.RCScreenVideoTrack = RCScreenVideoTrack;
    exports.RCTag = RCTag;
    exports.RCTrack = RCTrack;
    exports.device = device;
    exports.helper = helper;
    exports.installer = installer;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
