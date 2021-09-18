/*
 * RCEngine - v4.5.0-alpha.1
 * CommitId - 9eb2824ec0bc60d60044918540ba9b5987b6f1d7
 * Thu Sep 16 2021 11:17:48 GMT+0800 (China Standard Time)
 * ©2020 RongCloud, Inc. All rights reserved.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.RCEngine = {}));
}(this, (function (exports) { 'use strict';

    var ReceivedStatus;
    (function (ReceivedStatus) {
        /**
         * 已读
        */
        ReceivedStatus[ReceivedStatus["READ"] = 1] = "READ";
        /**
         * 已听
        */
        ReceivedStatus[ReceivedStatus["LISTENED"] = 2] = "LISTENED";
        /**
         * 已下载
        */
        ReceivedStatus[ReceivedStatus["DOWNLOADED"] = 4] = "DOWNLOADED";
        /**
         * 该消息已经被其他登录的多端收取过。( 即该消息已经被其他端收取过后。当前端才登录，并重新拉取了这条消息。客户可以通过这个状态更新 UI，比如不再提示 )
        */
        ReceivedStatus[ReceivedStatus["RETRIEVED"] = 8] = "RETRIEVED";
        /**
         * 未读
        */
        ReceivedStatus[ReceivedStatus["UNREAD"] = 0] = "UNREAD";
    })(ReceivedStatus || (ReceivedStatus = {}));
    var ReceivedStatus$1 = ReceivedStatus;

    /**
     * Navi 缓存数据有效时长，单位毫秒
     */
    const NAVI_CACHE_DURATION = 2 * 60 * 60 * 1000;
    /**
     * 单个 Navi 请求的超时时间，单位毫秒
     */
    const NAVI_REQ_TIMEOUT = 10 * 1000;
    /**
     * /ping?r= 请求的超时时间，单位毫秒
     */
    const PING_REQ_TIMEOUT = 5 * 1000;
    /**
     * WebSocket 建立连接超时时间，单位毫秒
     */
    const WEB_SOCKET_TIMEOUT = 5 * 1000;
    /**
     * 公有云 Navi 请求地址
     */
    const PUBLIC_CLOUD_NAVI_URIS = ['https://nav.cn.ronghub.com', 'https://nav2-cn.ronghub.com'];
    /**
     * 小程序 websocket 连接地址
     */
    const MINI_SOCKET_CONNECT_URIS = ['wsproxy.cn.ronghub.com', 'wsap-cn.ronghub.com'];
    /**
     * 小程序 长轮询 连接地址
     */
    const MINI_COMET_CONNECT_URIS = ['cometproxy-cn.ronghub.com', 'mini-cn.ronghub.com'];
    /**
     * IM 接口超时时间，单位毫秒
     */
    const IM_SIGNAL_TIMEOUT = 30 * 1000;
    /**
     * IM Ping 间隔时间，单位毫秒
     */
    const IM_PING_INTERVAL_TIME = 15 * 1000;
    /**
     * IM Ping 超时时间，单位毫秒
     */
    const IM_PING_TIMEOUT = 15 * 1000;
    /**
     * IM Ping 最小超时时间，单位毫秒
     */
    const IM_PING_MIN_TIMEOUT = 2 * 1000;
    /**
     * 消息 content 内容尺寸限制：128 KB
     */
    const MAX_MESSAGE_CONTENT_BYTES = 128 * 1024;
    /**
     * IM Comet 发送 pullmsg(嗅探 + 等待信令) 超时时间 45s
     */
    const IM_COMET_PULLMSG_TIMEOUT = 45000;
    /**
     * storage key 使用的前缀
    */
    const STORAGE_ROOT_KEY = 'RCV4-';
    /*
     * 内置消息的配置项. 发消息时, objectName 匹配到以下项时, 将覆盖用户传入值
     * 内置消息文档: https://docs.rongcloud.cn/im/introduction/message_structure/#inherent
     * 'RC:DizNtf' 为讨论组消息通知类型，讨论组已废弃
    */
    const SEND_MESSAGE_TYPE_OPTION = {
        // 存储且计数
        'RC:TxtMsg': { isCounted: true, isPersited: true },
        'RC:ImgMsg': { isCounted: true, isPersited: true },
        'RC:VcMsg': { isCounted: true, isPersited: true },
        'RC:ImgTextMsg': { isCounted: true, isPersited: true },
        'RC:FileMsg': { isCounted: true, isPersited: true },
        'RC:HQVCMsg': { isCounted: true, isPersited: true },
        'RC:LBSMsg': { isCounted: true, isPersited: true },
        'RC:PSImgTxtMsg': { isCounted: true, isPersited: true },
        'RC:PSMultiImgTxtMsg': { isCounted: true, isPersited: true },
        'RCJrmf:RpMsg': { isCounted: true, isPersited: true },
        'RCJrmf:RpOpendMsg': { isCounted: true, isPersited: true },
        'RC:CombineMsg': { isCounted: true, isPersited: true },
        'RC:ReferenceMsg': { isCounted: true, isPersited: true },
        'RC:SightMsg': { isCounted: true, isPersited: true },
        'RC:GIFMsg': { isCounted: true, isPersited: true },
        // 只存储 不计数
        'RC:InfoNtf': { isCounted: false, isPersited: true },
        'RC:ContactNtf': { isCounted: false, isPersited: true },
        'RC:ProfileNtf': { isCounted: false, isPersited: true },
        'RC:CmdNtf': { isCounted: false, isPersited: true },
        'RC:GrpNtf': { isCounted: false, isPersited: true },
        'RC:RcCmd': { isCounted: false, isPersited: true },
        // 不存储 只计数 - 目前无
        // 不存储 不计数
        'RC:CmdMsg': { isCounted: false, isPersited: false },
        'RC:TypSts': { isCounted: false, isPersited: false },
        'RC:PSCmd': { isCounted: false, isPersited: false },
        'RC:SRSMsg': { isCounted: false, isPersited: false },
        'RC:RRReqMsg': { isCounted: false, isPersited: false },
        'RC:RRRspMsg': { isCounted: false, isPersited: false },
        'RC:CsChaR': { isCounted: false, isPersited: false },
        'RC:CSCha': { isCounted: false, isPersited: false },
        'RC:CsEva': { isCounted: false, isPersited: false },
        'RC:CsContact': { isCounted: false, isPersited: false },
        'RC:CsHs': { isCounted: false, isPersited: false },
        'RC:CsHsR': { isCounted: false, isPersited: false },
        'RC:CsSp': { isCounted: false, isPersited: false },
        'RC:CsEnd': { isCounted: false, isPersited: false },
        'RC:CsUpdate': { isCounted: false, isPersited: false },
        'RC:ReadNtf': { isCounted: false, isPersited: false },
        'RC:chrmKVNotiMsg': { isCounted: false, isPersited: false },
        'RC:VCAccept': { isCounted: false, isPersited: false },
        'RC:VCRinging': { isCounted: false, isPersited: false },
        'RC:VCSummary': { isCounted: false, isPersited: false },
        'RC:VCHangup': { isCounted: false, isPersited: false },
        'RC:VCInvite': { isCounted: false, isPersited: false },
        'RC:VCModifyMedia': { isCounted: false, isPersited: false },
        'RC:VCModifyMem': { isCounted: false, isPersited: false },
        'RC:MsgExMsg': { isCounted: false, isPersited: false },
        'RC:RRMsg': { isCounted: false, isPersited: false },
        'RC:LogCmdMsg': { isCounted: false, isPersited: false }
    };
    /**
     * 协议栈内置消息类型
     * TODO: 需确认是否添加到 Web 中
    */
    const CPP_PROTOCAL_MSGTYPE_OPTION = {
        // 讨论组通知
        'RC:DizNtf': { isCounted: false, isPersited: false }
    };
    /**
     * 状态消息(不存储，不计数，并且上线后不会拉取离线的状态消息)
     */
    const STATUS_MESSAGE = [
        'RC:TypSts'
    ];
    /**
     * 连接类型
     */
    exports.CONNECTION_TYPE = void 0;
    (function (CONNECTION_TYPE) {
        CONNECTION_TYPE["WEBSOCKET"] = "websocket";
        CONNECTION_TYPE["COMET"] = "comet";
    })(exports.CONNECTION_TYPE || (exports.CONNECTION_TYPE = {}));

    let rootStorage;
    const createRootStorage = (runtime) => {
        if (!rootStorage) {
            rootStorage = {
                set: (key, val) => {
                    runtime.localStorage.setItem(key, JSON.stringify(val));
                },
                get: (key) => {
                    let val;
                    try {
                        val = JSON.parse(runtime.localStorage.getItem(key));
                    }
                    catch (e) {
                        val = null;
                    }
                    return val;
                },
                remove: (key) => {
                    return runtime.localStorage.removeItem(key);
                },
                getKeys: () => {
                    const keys = [];
                    for (const key in runtime.localStorage) {
                        keys.push(key);
                    }
                    return keys;
                }
            };
        }
        return rootStorage;
    };
    class AppCache {
        constructor(value) {
            this._caches = {};
            if (value) {
                this._caches = value;
            }
        }
        set(key, value) {
            this._caches[key] = value;
        }
        remove(key) {
            const val = this.get(key);
            delete this._caches[key];
            return val;
        }
        get(key) {
            return this._caches[key];
        }
        getKeys() {
            const keys = [];
            for (const key in this._caches) {
                keys.push(key);
            }
            return keys;
        }
    }
    class AppStorage {
        constructor(runtime, suffix) {
            const key = suffix ? `${STORAGE_ROOT_KEY}${suffix}` : STORAGE_ROOT_KEY;
            this._rootStorage = createRootStorage(runtime);
            const localCache = this._rootStorage.get(key) || {};
            this._cache = new AppCache({
                [key]: localCache
            });
            this._storageKey = key;
        }
        _get() {
            const key = this._storageKey;
            return this._cache.get(key) || {};
        }
        _set(cache) {
            const key = this._storageKey;
            cache = cache || {};
            this._cache.set(key, cache);
            this._rootStorage.set(key, cache);
        }
        set(key, value) {
            const localValue = this._get();
            localValue[key] = value;
            this._set(localValue);
        }
        remove(key) {
            const localValue = this._get();
            delete localValue[key];
            this._set(localValue);
        }
        clear() {
            const key = this._storageKey;
            this._rootStorage.remove(key);
            this._cache.remove(key);
        }
        get(key) {
            const localValue = this._get();
            return localValue[key];
        }
        getKeys() {
            const localValue = this._get();
            const keyList = [];
            for (const key in localValue) {
                keyList.push(key);
            }
            return keyList;
        }
        getValues() {
            return this._get() || {};
        }
    }

    class Todo extends Error {
        constructor(message) {
            super(`TODO => ${message}`);
        }
    }
    const todo = (message) => new Todo(message);

    /**
     * 字符串转为大写形式并返回
     * @todo 违反单一性原则，后续需分拆，以及需要评估是否过渡封装
     * @param str
     * @param startIndex 开始位置
     * @param endIndex 结束位置
    */
    const toUpperCase = (str, startIndex, endIndex) => {
        if (startIndex === undefined || endIndex === undefined) {
            return str.toUpperCase();
        }
        const sliceStr = str.slice(startIndex, endIndex);
        str = str.replace(sliceStr, (text) => {
            return text.toUpperCase();
        });
        return str;
    };
    const getByteLength = (str, charset = 'utf-8') => {
        let total = 0;
        let chatCode;
        if (charset === 'utf-16') {
            for (let i = 0, max = str.length; i < max; i++) {
                chatCode = str.charCodeAt(i);
                if (chatCode <= 0xffff) {
                    total += 2;
                }
                else {
                    total += 4;
                }
            }
        }
        else {
            for (let i = 0, max = str.length; i < max; i++) {
                chatCode = str.charCodeAt(i);
                if (chatCode < 0x007f) {
                    total += 1;
                }
                else if (chatCode <= 0x07ff) {
                    total += 2;
                }
                else if (chatCode <= 0xffff) {
                    total += 3;
                }
                else {
                    total += 4;
                }
            }
        }
        return total;
    };
    const appendUrl = (url, query) => {
        url = url.replace(/\?$/, '');
        if (!query) {
            return url;
        }
        const searchArr = Object.keys(query).map(key => `${key}=${query[key]}`).filter(item => !!item);
        if (searchArr.length) {
            return [url, searchArr.join('&')].join('?');
        }
        return url;
    };
    /**
     * 建立连接时，apiVersion 需符合 `/\d+(\.\d+){2}/` 规则，对于预发布版本号如 `3.1.0-alpha.1`，需解析定为 `3.1.0`
     * @param apiVersion
     */
    const matchVersion = (apiVersion) => {
        const matches = apiVersion.match(/\d+(\.\d+){2}/);
        return matches[0];
    };
    /**
     * 按照字节截取字符串
     * @param str
     * @param len
     * @returns
     */
    const subStrByByte = (str, len, charset = 'utf-8') => {
        if (!str || !len) {
            return '';
        }
        const size = charset === 'utf-8' ? 3 : 2;
        let a = 0;
        let i = 0;
        var temp = '';
        for (i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 255) {
                a += size;
            }
            else {
                a++;
            }
            if (a > len) {
                return temp;
            }
            temp += str.charAt(i);
        }
        return str;
    };

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

    exports.LogLevel = void 0;
    (function (LogLevel) {
        /**
         * 等同于 `LogLevel.DEBUG`
         */
        LogLevel[LogLevel["LOG"] = 0] = "LOG";
        /**
         * 0
         */
        LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
        /**
         * 1
         */
        LogLevel[LogLevel["INFO"] = 1] = "INFO";
        /**
         * 2
         */
        LogLevel[LogLevel["WARN"] = 2] = "WARN";
        /**
         * 3
         */
        LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
        /**
         * 4
         */
        LogLevel[LogLevel["FATAL"] = 4] = "FATAL";
        /**
         * 不展示任何日志
         */
        LogLevel[LogLevel["NONE"] = 1000] = "NONE";
    })(exports.LogLevel || (exports.LogLevel = {}));

    exports.LogType = void 0;
    (function (LogType) {
        LogType["IM"] = "IM";
        LogType["RTC"] = "RTC";
    })(exports.LogType || (exports.LogType = {}));

    const DB_NAME = 'RC_ENGINE_DB';
    const DB_VERSION = 2;
    const RCObjectStoreNames = {
        RC_LOGS: 'RC_Logs'
    };
    function createObjectStore(db, name, opts) {
        let objectStore;
        if (!db.objectStoreNames.contains(name)) {
            const createOptions = Object.assign({}, opts.objectStoreParams);
            objectStore = db.createObjectStore(name, createOptions);
            if (opts.indexs && opts.indexs.length > 0) {
                opts.indexs.forEach((item) => {
                    objectStore.createIndex(item.indexName, item.key, { unique: item.unique });
                });
            }
            return objectStore;
        }
    }
    function updateHandle(event) {
        const db = event.target.result;
        if (event.oldVersion === 1) {
            // 在 1 -> 2 的版本中去掉了自定义主键
            db.deleteObjectStore(RCObjectStoreNames.RC_LOGS);
        }
        createObjectStore(db, RCObjectStoreNames.RC_LOGS, {
            indexs: [{
                    indexName: 'time',
                    key: 'time',
                    unique: false
                }],
            objectStoreParams: {
                autoIncrement: true
            }
        });
    }
    /**
     * indexDB 数据库存储类
     */
    class RCIndexDB {
        constructor() { }
        static init() {
            if (typeof window === 'undefined' || !window || !window.indexedDB) {
                console.debug('IndexDB is not currently supported in the environment!');
                return;
            }
            /**
             * NOTE:
             * 1. 第一次打开可能会提示用户获取 indexedDB 的权限
             * 2. 浏览器隐身模式不会存在本地，只会存储在内存中
             */
            const request = window.indexedDB.open(DB_NAME, DB_VERSION);
            request.onerror = function (event) {
                console.warn('open indexDB request failed ' + event.target.error);
            };
            request.onsuccess = function (event) {
                RCIndexDB._db = event.target.result;
                RCIndexDB._instance = new RCIndexDB();
            };
            request.onupgradeneeded = function (event) {
                RCIndexDB._db = event.target.result;
                updateHandle(event);
            };
        }
        static getInstance() {
            return RCIndexDB._instance;
        }
        /**
         * 批量添加数据
         * @param objectStoreName 表名
         * @param list 列表
         * @returns
         */
        addList(objectStoreName, list) {
            return new Promise((resolve) => {
                if (!RCIndexDB._db) {
                    resolve(false);
                    return;
                }
                const transaction = RCIndexDB._db.transaction([objectStoreName], 'readwrite');
                const store = transaction.objectStore(objectStoreName);
                list.forEach((item) => {
                    store === null || store === void 0 ? void 0 : store.add(item);
                });
                transaction.oncomplete = (event) => {
                    resolve(true);
                };
                transaction.onerror = function (event) {
                    resolve(false);
                };
            });
        }
        /**
         * 获取一个范围的数据
         * @param objectStoreName 存储对象名称
         * @param key index索引名称
         * @param start 开始
         * @param end 结束
         * @returns
         */
        getRangeData(objectStoreName, indexName, start, end) {
            return new Promise((resolve) => {
                if (!RCIndexDB._db) {
                    resolve([]);
                    return;
                }
                const transaction = RCIndexDB._db.transaction([objectStoreName], 'readwrite');
                const store = transaction.objectStore(objectStoreName);
                // 读取数据库数据
                const range = IDBKeyRange.bound(start, end);
                const index = store.index(indexName);
                const list = [];
                const cursorResult = index.openCursor(range);
                cursorResult.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        list.push(cursor.value);
                        cursor.continue();
                    }
                    else {
                        resolve(list);
                    }
                };
                cursorResult.onerror = (event) => {
                    console.error(event);
                    resolve([]);
                };
            });
        }
        /**
         * 获取存储对象中的数量
         * @param objectStoreName 存储对象名称
         * @param indexName 索引名称
         * @returns
         */
        getCount(objectStoreName, indexName) {
            return new Promise((resolve) => {
                if (!RCIndexDB._db) {
                    resolve(0);
                    return;
                }
                const transaction = RCIndexDB._db.transaction([objectStoreName], 'readonly');
                const store = transaction.objectStore(objectStoreName);
                const countRequest = store.count();
                countRequest.onsuccess = () => {
                    resolve(countRequest.result);
                };
                countRequest.onerror = (event) => {
                    console.error(event);
                    resolve(0);
                };
            });
        }
        /**
         * 删除前 n 条数据
         * @param objectStoreName 存储对象名称
         * @param indexName 索引名
         * @param count 要删除的数量
         * @returns
         */
        removeFirstData(objectStoreName, indexName, count) {
            return new Promise((resolve) => {
                if (!RCIndexDB._db) {
                    resolve(false);
                    return;
                }
                const transaction = RCIndexDB._db.transaction([objectStoreName], 'readwrite');
                const store = transaction.objectStore(objectStoreName);
                const getAllKeysRequest = store.getAllKeys(IDBKeyRange.lowerBound(0), count);
                getAllKeysRequest.onsuccess = () => {
                    const keyList = getAllKeysRequest.result;
                    if (keyList.length > 0) {
                        const request = store.delete(IDBKeyRange.bound(keyList[0], keyList[keyList.length - 1]));
                        request.onsuccess = () => {
                            resolve(true);
                        };
                    }
                };
            });
        }
    }
    RCIndexDB._db = null;

    const string10to64 = (number) => {
        var chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZa0'.split('');
        var radix = chars.length + 1;
        var qutient = +number;
        var arr = [];
        do {
            var mod = qutient % radix;
            qutient = (qutient - mod) / radix;
            arr.unshift(chars[mod]);
        } while (qutient);
        return arr.join('');
    };
    const randomNum = (min, max) => {
        return min + Math.floor(Math.random() * (max - min));
    };
    const getUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    const getUUID22 = () => {
        var uuid = getUUID();
        uuid = uuid.replace(/-/g, '') + 'a';
        uuid = parseInt(uuid, 16);
        uuid = string10to64(uuid);
        if (uuid.length > 22) {
            uuid = uuid.slice(0, 22);
        }
        if (uuid.length < 22) {
            var len = 22 - uuid.length;
            for (var i = 0; i < len; i++) {
                uuid = uuid + '0';
            }
        }
        return uuid;
    };

    /**
     * 会话类型
     */
    var ConversationType;
    (function (ConversationType) {
        /**
         * 无类型
         */
        ConversationType[ConversationType["NONE"] = 0] = "NONE";
        /**
         * 单聊
         */
        ConversationType[ConversationType["PRIVATE"] = 1] = "PRIVATE";
        /**
         * 讨论组
         */
        ConversationType[ConversationType["DISCUSSION"] = 2] = "DISCUSSION";
        /**
         * 群组聊天
         */
        ConversationType[ConversationType["GROUP"] = 3] = "GROUP";
        /**
         * 聊天室会话
         */
        ConversationType[ConversationType["CHATROOM"] = 4] = "CHATROOM";
        /**
         * 客服会话
         */
        ConversationType[ConversationType["CUSTOMER_SERVICE"] = 5] = "CUSTOMER_SERVICE";
        /**
         * 系统消息
         */
        ConversationType[ConversationType["SYSTEM"] = 6] = "SYSTEM";
        /**
         * 默认关注的公众号会话类型（MC)
         */
        ConversationType[ConversationType["APP_PUBLIC_SERVICE"] = 7] = "APP_PUBLIC_SERVICE";
        /**
         * 需手动关注的公众号会话类型（MP)
         */
        ConversationType[ConversationType["PUBLIC_SERVICE"] = 8] = "PUBLIC_SERVICE";
        /**
         * RTCLib 特有的会话类型
         */
        ConversationType[ConversationType["RTC_ROOM"] = 12] = "RTC_ROOM";
    })(ConversationType || (ConversationType = {}));
    var ConversationType$1 = ConversationType;

    /**
     * 文件类型
     */
    var FileType;
    (function (FileType) {
        /**
         * 图片文件
         */
        FileType[FileType["IMAGE"] = 1] = "IMAGE";
        /**
         * 声音文件
         */
        FileType[FileType["AUDIO"] = 2] = "AUDIO";
        /**
         * 视频文件
         */
        FileType[FileType["VIDEO"] = 3] = "VIDEO";
        /**
         * 非媒体文件
         */
        FileType[FileType["FILE"] = 4] = "FILE";
        /**
         * 小视频类型
        */
        FileType[FileType["SIGHT"] = 5] = "SIGHT";
        /**
         * 合并转发
        */
        FileType[FileType["COMBINE_HTML"] = 6] = "COMBINE_HTML";
    })(FileType || (FileType = {}));
    var FileType$1 = FileType;

    /**
     * 检查参数是否为字符串
     * 只做类型检查，不做长度检查，故当字符串长度为 0，结果依然为 true
     * @param value
     */
    const isString = (value) => typeof value === 'string';
    /**
     * 检测参数是否为布尔值
     * @param value
     */
    const isBoolean = (value) => typeof value === 'boolean';
    /**
     * 检查参数是否为 number 数据
     * @param value
     */
    const isNumber = (value) => typeof value === 'number' && !isNaN(value);
    /**
     * 检查参数是否为数组
     * 只做类型检查，不做长度检查
     * 如 UnitArray、BufferArray 等也属于数组
     * @param arr
     */
    const isArray = (arr) => Object.prototype.toString.call(arr).indexOf('Array') !== -1;
    /**
     * 检查参数是否为 ArrayBuffer
     * @param arr
     */
    const isArrayBuffer = (arr) => Object.prototype.toString.call(arr) === '[object ArrayBuffer]';
    /**
     * 检查参数是否为长度非 0 的字符串
     * @param str
     */
    const notEmptyString = (str) => isString(str) && str.length > 0;
    /**
     * 检查参数是否为长度非 0 的数组
     * @param str
     */
    const notEmptyArray = (arr) => isArray(arr) && arr.length > 0;
    /**
     * 检查参数是否为对象
     * @param val
     */
    const isObject = (val) => {
        return Object.prototype.toString.call(val) === '[object Object]';
    };
    /**
     * 检查参数是否为函数
     * @param val
     */
    const isFunction = (val) => {
        return Object.prototype.toString.call(val) === '[object Function]';
    };
    /**
     * 检查参数是否为undefined
     * @param val
     */
    const isUndefined = (val) => {
        // IE 下 undefined 为 Object
        return val === undefined || Object.prototype.toString.call(val) === '[object Undefined]';
    };
    /**
     * 检查参数是否为 null
    */
    const isNull = (val) => {
        return Object.prototype.toString.call(val) === '[object Null]';
    };
    /**
     * 检查参数是否为有效 http(s) 协议 url
     * @param value
     */
    const isHttpUrl = (value) => isString(value) && /https?:\/\//.test(value);
    /**
     * 检查对象不为空
     * @param val
    */
    const notEmptyObject = (val) => {
        // eslint-disable-next-line no-unreachable-loop
        for (const key in val) {
            return true;
        }
        return false;
    };
    const isValidConversationType = (conversation) => {
        return isNumber(conversation) && Object.prototype.hasOwnProperty.call(ConversationType$1, conversation);
    };
    /**
     * 判断是否是一个有效的文件类型
     */
    const isValidFileType = (fileType) => {
        return isNumber(fileType) && Object.prototype.hasOwnProperty.call(FileType$1, fileType);
    };

    const methods = {
        [exports.LogLevel.DEBUG]: console.debug.bind(console),
        [exports.LogLevel.INFO]: console.info.bind(console),
        [exports.LogLevel.WARN]: console.warn.bind(console),
        [exports.LogLevel.ERROR]: console.error.bind(console),
        [exports.LogLevel.FATAL]: console.log.bind(console)
    };
    /**
     * 序列化引用型数据为字符串
     * @value value
     */
    const transQuoteValue = (value) => {
        if (isString(value) || isNumber(value) || isUndefined(value) || isBoolean(value)) {
            return value;
        }
        if (value instanceof Error) {
            return JSON.stringify({ name: value.name, message: value.message, stack: value.stack });
        }
        // 出于对于 logger 内容输出简洁易读的考虑，禁止在 logger 中输出复杂数据结构，推荐仅输出关键数据信息
        // 如果序列化报错，不要修改此序列化方法，直接修改输出内容
        return JSON.stringify(value);
    };
    // 实时日志上传大小
    const REAT_TIME_LOG_SIZE = 500;
    // 数据库中存储日志上限
    const DB_LOG_MAX_SIZE = 100000;
    class Logger {
        /**
         *
         * @param tag 标签
         * @param type 类型
         * @param initiator 发起方(A: APP 层，L: Lib 层)
         */
        constructor(tag, type, initiator) {
            this.tag = tag;
            this.type = type;
            this.initiator = initiator;
            /**
             * 输出等级
             */
            this._outLevel = exports.LogLevel.WARN;
            this.debug = this.log.bind(this, exports.LogLevel.DEBUG);
            this.info = this.log.bind(this, exports.LogLevel.INFO);
            this.warn = this.log.bind(this, exports.LogLevel.WARN);
            this.error = this.log.bind(this, exports.LogLevel.ERROR);
            this.fatal = this.log.bind(this, exports.LogLevel.FATAL);
        }
        static init(userId) {
            Logger.userId = userId;
        }
        static reset() {
            Logger.userId = '';
        }
        /**
         * 默认输出函数
         * @param level
         * @param args
         */
        _defaultStdout(level, msgTag, ...args) {
            methods[level](`${msgTag}:`, ...args);
        }
        /**
         * 向 databaseLogList 中 push 日志
         * @param level 打印等级
         * @param content 日志内容
         * @param tag 日志tag
         */
        __pushLocalLog(level, content, tag) {
            let type;
            if (this.type) {
                type = this.type;
            }
            else {
                type = ['RCRTCLog', 'RCCall', 'RCRTC', 'RTC-A'].includes(this.tag) ? exports.LogType.RTC : exports.LogType.IM;
            }
            const time = Date.now();
            // 内容最长为 1K
            if (getByteLength(content) >= 1000) {
                content = subStrByByte(content, 1000);
            }
            const _content = JSON.stringify({
                message: content,
                userId: Logger.userId
            }).replace(/"/g, '""');
            const logTag = /^[\w]+-[\w]+-[\w]+?/.test(tag) ? tag : `${this.initiator || 'L'}-${tag}-O`;
            const log = {
                sessionId: Logger.sessionId,
                time,
                level: 4 - level,
                content: `${Logger.sessionId},${Date.now()},${type},${4 - level},${logTag},"${_content}"\n`,
                userId: Logger.userId
            };
            Logger.databaseLogList.push(log);
            // 每 100 条存储一次
            if (Logger.databaseLogList.length >= 100) {
                this.__insertLogIntoDatabase();
            }
        }
        /**
         * 向数据库中插入 log 数据
         */
        __insertLogIntoDatabase() {
            return __awaiter(this, void 0, void 0, function* () {
                const _list = [...Logger.databaseLogList];
                Logger.databaseLogList = [];
                const db = RCIndexDB.getInstance();
                if (db) {
                    const result = yield db.addList(RCObjectStoreNames.RC_LOGS, _list);
                    const count = yield db.getCount(RCObjectStoreNames.RC_LOGS, 'time');
                    if (count > DB_LOG_MAX_SIZE) {
                        db.removeFirstData(RCObjectStoreNames.RC_LOGS, 'time', 2000);
                    }
                    return result;
                }
                else {
                    return false;
                }
            });
        }
        /**
         * 修改 log 输出等级
         * @param logLevel
         */
        setLogLevel(logLevel) {
            this._outLevel = typeof logLevel !== 'number' ? exports.LogLevel.WARN : logLevel;
        }
        setLogStdout(stdout) {
            this._logStdout = stdout;
        }
        log(level, ...args) {
            this.__pushLocalLog(level, args.map(transQuoteValue).join(' '), this.tag);
            if (level < this._outLevel) {
                return;
            }
            const msgTag = `${new Date().toISOString()}[${this.tag}][${exports.LogLevel[level]}]`;
            const content = `${msgTag} - ${args.map(transQuoteValue).join(' ')}`;
            if (this._logStdout) {
                this._logStdout(level, content);
                return;
            }
            if (this._stdout) {
                this._stdout(level, content);
                return;
            }
            // 为方便调试，故直接输出
            this._defaultStdout(level, msgTag, ...args);
        }
        /**
         * 日志实时上报
         * @param level 日志等级
         * @param tag 日志标签
         * @param content 日志内容
         */
        reportLog(level, tag, content) {
            this.__pushLocalLog(4 - level, content, tag);
            let _content = JSON.stringify({
                message: content
            }).replace(/"/g, '""');
            _content = `"${_content}"`;
            const log = {
                level: level,
                content: [Logger.sessionId, Date.now(), this.type, level, tag, _content].join() + '\n'
            };
            Logger.realTimeLogList.push(log);
            if (Logger.realTimeLogList.length >= REAT_TIME_LOG_SIZE + 100) {
                Logger.realTimeLogList = Logger.realTimeLogList.slice(-REAT_TIME_LOG_SIZE);
            }
        }
        /**
         * @deprecated
         * 函数已废弃，使用 `setLogLevel` 与 `setStdout` 方法替代
         */
        set(outLevel, stdout) {
            this.warn('logger.set has being deprecated!');
        }
        /**
         * 接口已废弃，改用 `setLogStdout`
         * @param stdout
         * @deprecated
         */
        setStdout(stdout) {
            this._stdout = stdout;
        }
        __clearRealTimeLog() {
            Logger.realTimeLogList = [];
        }
    }
    /**
     * 本地存储日志列表
     */
    Logger.databaseLogList = [];
    /**
     * 定时上传日志列表
     */
    Logger.realTimeLogList = [];
    Logger.sessionId = getUUID22();
    Logger.userId = '';
    const logger = new Logger('RCLog');

    class EventEmitter {
        constructor() {
            this._map = {};
        }
        /**
         * 添加事件监听器
         * @param eventType
         * @param listener
         */
        on(eventType, listener, target) {
            const arr = this._map[eventType] || (this._map[eventType] = []);
            if (arr.some(item => item.listener === listener && item.target === target)) {
                return;
            }
            arr.push({ listener, target });
        }
        once(eventType, listener, target) {
            const arr = this._map[eventType] || (this._map[eventType] = []);
            if (arr.some(item => item.listener === listener && item.target === target)) {
                return;
            }
            arr.push({ listener, target, once: true });
        }
        /**
         * 移除事件监听器
         * @param eventType
         * @param listener
         */
        off(eventType, listener, target) {
            let arr = this._map[eventType];
            if (!arr) {
                return;
            }
            arr = arr.filter(item => {
                return item.listener !== listener || item.target !== target;
            });
            if (arr.length) {
                this._map[eventType] = arr;
            }
            else {
                delete this._map[eventType];
            }
        }
        /**
         * 事件派发
         * @param eventType
         * @param attrs
         */
        emit(eventType, ...attrs) {
            const arr = this._map[eventType];
            if (!arr) {
                return;
            }
            for (let i = arr.length - 1; i >= 0; i -= 1) {
                const { target, once, listener } = arr[i];
                once && arr.splice(i, 1);
                try {
                    listener.call(target, ...attrs);
                }
                catch (error) {
                    logger.error(error);
                }
            }
        }
        /**
         * 清空所有指定类型的事件监听器
         * @param eventType
         */
        removeAll(eventType) {
            delete this._map[eventType];
        }
        /**
         * 无差别清空所有事件监听器
         */
        clear() {
            Object.keys(this._map).forEach(this.removeAll, this);
        }
    }

    var MessageDirection;
    (function (MessageDirection) {
        /**
         * 己方发送消息
         */
        MessageDirection[MessageDirection["SEND"] = 1] = "SEND";
        /**
         * 己方接收消息
         */
        MessageDirection[MessageDirection["RECEIVE"] = 2] = "RECEIVE";
    })(MessageDirection || (MessageDirection = {}));
    var MessageDirection$1 = MessageDirection;

    /**
     * IM  错误码范围段
     * 2 开头为 IM Server 返回错误码
     * 3 开头： 30000 到 33xxx 为协议栈错误码，34001 ~ 34999 为移动端自定错误码
     *   备注：iOS 与 Android 错误码一致。Web 与移动端一致的错误码，也用此片段，比如 34008 （消息不支持扩展）
     * 35001 ~ 39999 为 Web 端错误码 备注：由于 Web IM 历史版本 35xxx 36xxx 37xxx 38xxx 39xxxx 都占用过，所以错误码段范围较大
     */
    var ErrorCode;
    (function (ErrorCode) {
        /** 超时 */
        ErrorCode[ErrorCode["TIMEOUT"] = -1] = "TIMEOUT";
        /**
         * 未知原因失败。
         */
        ErrorCode[ErrorCode["UNKNOWN"] = -2] = "UNKNOWN";
        /** 参数错误 */
        ErrorCode[ErrorCode["PARAMETER_ERROR"] = -3] = "PARAMETER_ERROR";
        /** 未实现的方法定义，在应用层调用 callExtra 传入无法识别的方法名时抛出 */
        ErrorCode[ErrorCode["EXTRA_METHOD_UNDEFINED"] = -4] = "EXTRA_METHOD_UNDEFINED";
        /** 主进程内方法错误 */
        ErrorCode[ErrorCode["MAIN_PROCESS_ERROR"] = -5] = "MAIN_PROCESS_ERROR";
        /**
         * 成功
         */
        ErrorCode[ErrorCode["SUCCESS"] = 0] = "SUCCESS";
        ErrorCode[ErrorCode["RC_MSG_UNAUTHORIZED"] = 20406] = "RC_MSG_UNAUTHORIZED";
        /**
         * 群组 Id 无效
         */
        ErrorCode[ErrorCode["RC_DISCUSSION_GROUP_ID_INVALID"] = 20407] = "RC_DISCUSSION_GROUP_ID_INVALID";
        /**
         * 发送频率过快
         */
        ErrorCode[ErrorCode["SEND_FREQUENCY_TOO_FAST"] = 20604] = "SEND_FREQUENCY_TOO_FAST";
        /**
         * 不在讨论组。
         */
        ErrorCode[ErrorCode["NOT_IN_DISCUSSION"] = 21406] = "NOT_IN_DISCUSSION";
        /**
         * 群组被禁言
         */
        ErrorCode[ErrorCode["FORBIDDEN_IN_GROUP"] = 22408] = "FORBIDDEN_IN_GROUP";
        ErrorCode[ErrorCode["RECALL_MESSAGE"] = 25101] = "RECALL_MESSAGE";
        /**
         * 不在群组。
         */
        ErrorCode[ErrorCode["NOT_IN_GROUP"] = 22406] = "NOT_IN_GROUP";
        /**
         * 不在聊天室。
         */
        ErrorCode[ErrorCode["NOT_IN_CHATROOM"] = 23406] = "NOT_IN_CHATROOM";
        /**
         *聊天室被禁言
         */
        ErrorCode[ErrorCode["FORBIDDEN_IN_CHATROOM"] = 23408] = "FORBIDDEN_IN_CHATROOM";
        /**
         * 聊天室中成员被踢出
         */
        ErrorCode[ErrorCode["RC_CHATROOM_USER_KICKED"] = 23409] = "RC_CHATROOM_USER_KICKED";
        /**
         * 聊天室不存在
         */
        ErrorCode[ErrorCode["RC_CHATROOM_NOT_EXIST"] = 23410] = "RC_CHATROOM_NOT_EXIST";
        /**
         * 聊天室成员已满
         */
        ErrorCode[ErrorCode["RC_CHATROOM_IS_FULL"] = 23411] = "RC_CHATROOM_IS_FULL";
        /**
         * 获取聊天室信息参数无效
         */
        ErrorCode[ErrorCode["RC_CHATROOM_PATAMETER_INVALID"] = 23412] = "RC_CHATROOM_PATAMETER_INVALID";
        /**
         * 聊天室异常
         */
        ErrorCode[ErrorCode["CHATROOM_GET_HISTORYMSG_ERROR"] = 23413] = "CHATROOM_GET_HISTORYMSG_ERROR";
        /**
         * 没有打开聊天室消息存储
         */
        ErrorCode[ErrorCode["CHATROOM_NOT_OPEN_HISTORYMSG_STORE"] = 23414] = "CHATROOM_NOT_OPEN_HISTORYMSG_STORE";
        /**
         * 聊天室 KV 设置超出最大值(已满, 默认最多设置 100 个)
         */
        ErrorCode[ErrorCode["CHATROOM_KV_EXCEED"] = 23423] = "CHATROOM_KV_EXCEED";
        /**
         * 聊天室 KV 设置失败(kv 已存在, 需覆盖设置)
         */
        ErrorCode[ErrorCode["CHATROOM_KV_OVERWRITE_INVALID"] = 23424] = "CHATROOM_KV_OVERWRITE_INVALID";
        /**
         * 聊天室 KV 存储功能没有开通
         */
        ErrorCode[ErrorCode["CHATROOM_KV_STORE_NOT_OPEN"] = 23426] = "CHATROOM_KV_STORE_NOT_OPEN";
        /**
         * 聊天室Key不存在
         */
        ErrorCode[ErrorCode["CHATROOM_KEY_NOT_EXIST"] = 23427] = "CHATROOM_KEY_NOT_EXIST";
        /**
         * 敏感词屏蔽
         */
        ErrorCode[ErrorCode["SENSITIVE_SHIELD"] = 21501] = "SENSITIVE_SHIELD";
        ErrorCode[ErrorCode["SENSITIVE_REPLACE"] = 21502] = "SENSITIVE_REPLACE";
        /**
         * 加入讨论失败
         */
        ErrorCode[ErrorCode["JOIN_IN_DISCUSSION"] = 21407] = "JOIN_IN_DISCUSSION";
        /**
         * 创建讨论组失败
         */
        ErrorCode[ErrorCode["CREATE_DISCUSSION"] = 21408] = "CREATE_DISCUSSION";
        /**
         * 设置讨论组邀请状态失败
         */
        ErrorCode[ErrorCode["INVITE_DICUSSION"] = 21409] = "INVITE_DICUSSION";
        /**
         *获取用户失败
         */
        ErrorCode[ErrorCode["GET_USERINFO_ERROR"] = 23407] = "GET_USERINFO_ERROR";
        /**
         * 在黑名单中。
         */
        ErrorCode[ErrorCode["REJECTED_BY_BLACKLIST"] = 405] = "REJECTED_BY_BLACKLIST";
        /**
         * 通信过程中，当前 Socket 不存在。
         */
        ErrorCode[ErrorCode["RC_NET_CHANNEL_INVALID"] = 30001] = "RC_NET_CHANNEL_INVALID";
        /**
         * Socket 连接不可用。
         */
        ErrorCode[ErrorCode["RC_NET_UNAVAILABLE"] = 30002] = "RC_NET_UNAVAILABLE";
        /**
         * 通信超时。
         */
        ErrorCode[ErrorCode["RC_MSG_RESP_TIMEOUT"] = 30003] = "RC_MSG_RESP_TIMEOUT";
        /**
         * 导航操作时，Http 请求失败。
         */
        ErrorCode[ErrorCode["RC_HTTP_SEND_FAIL"] = 30004] = "RC_HTTP_SEND_FAIL";
        /**
         * HTTP 请求失败。
         */
        ErrorCode[ErrorCode["RC_HTTP_REQ_TIMEOUT"] = 30005] = "RC_HTTP_REQ_TIMEOUT";
        /**
         * HTTP 接收失败。
         */
        ErrorCode[ErrorCode["RC_HTTP_RECV_FAIL"] = 30006] = "RC_HTTP_RECV_FAIL";
        /**
         * 导航操作的 HTTP 请求，返回不是200。
         */
        ErrorCode[ErrorCode["RC_NAVI_RESOURCE_ERROR"] = 30007] = "RC_NAVI_RESOURCE_ERROR";
        /**
         * 导航数据解析后，其中不存在有效数据。
         */
        ErrorCode[ErrorCode["RC_NODE_NOT_FOUND"] = 30008] = "RC_NODE_NOT_FOUND";
        /**
         * 导航数据解析后，其中不存在有效 IP 地址。
         */
        ErrorCode[ErrorCode["RC_DOMAIN_NOT_RESOLVE"] = 30009] = "RC_DOMAIN_NOT_RESOLVE";
        /**
         * 创建 Socket 失败。
         */
        ErrorCode[ErrorCode["RC_SOCKET_NOT_CREATED"] = 30010] = "RC_SOCKET_NOT_CREATED";
        /**
         * Socket 被断开。
         */
        ErrorCode[ErrorCode["RC_SOCKET_DISCONNECTED"] = 30011] = "RC_SOCKET_DISCONNECTED";
        /**
         * PING 操作失败。
         */
        ErrorCode[ErrorCode["RC_PING_SEND_FAIL"] = 30012] = "RC_PING_SEND_FAIL";
        /**
         * PING 超时。
         */
        ErrorCode[ErrorCode["RC_PONG_RECV_FAIL"] = 30013] = "RC_PONG_RECV_FAIL";
        /**
         * 消息发送失败。
         */
        ErrorCode[ErrorCode["RC_MSG_SEND_FAIL"] = 30014] = "RC_MSG_SEND_FAIL";
        /**
         * JSON 后的消息体超限, 目前最大 128kb
         */
        ErrorCode[ErrorCode["RC_MSG_CONTENT_EXCEED_LIMIT"] = 30016] = "RC_MSG_CONTENT_EXCEED_LIMIT";
        /**
         * 做 connect 连接时，收到的 ACK 超时。
         */
        ErrorCode[ErrorCode["RC_CONN_ACK_TIMEOUT"] = 31000] = "RC_CONN_ACK_TIMEOUT";
        /**
         * 参数错误。
         */
        ErrorCode[ErrorCode["RC_CONN_PROTO_VERSION_ERROR"] = 31001] = "RC_CONN_PROTO_VERSION_ERROR";
        /**
         * 参数错误，App Id 错误。
         */
        ErrorCode[ErrorCode["RC_CONN_ID_REJECT"] = 31002] = "RC_CONN_ID_REJECT";
        /**
         * 服务器不可用。
         */
        ErrorCode[ErrorCode["RC_CONN_SERVER_UNAVAILABLE"] = 31003] = "RC_CONN_SERVER_UNAVAILABLE";
        /**
         * Token 错误。
         */
        ErrorCode[ErrorCode["RC_CONN_USER_OR_PASSWD_ERROR"] = 31004] = "RC_CONN_USER_OR_PASSWD_ERROR";
        /**
         * websocket 鉴权失败，通常为连接后未及时发送 Ping 或接收到 Pong
         */
        ErrorCode[ErrorCode["RC_CONN_NOT_AUTHRORIZED"] = 31005] = "RC_CONN_NOT_AUTHRORIZED";
        /**
         * 重定向，地址错误。
         */
        ErrorCode[ErrorCode["RC_CONN_REDIRECTED"] = 31006] = "RC_CONN_REDIRECTED";
        /**
         * NAME 与后台注册信息不一致。
         */
        ErrorCode[ErrorCode["RC_CONN_PACKAGE_NAME_INVALID"] = 31007] = "RC_CONN_PACKAGE_NAME_INVALID";
        /**
         * APP 被屏蔽、删除或不存在。
         */
        ErrorCode[ErrorCode["RC_CONN_APP_BLOCKED_OR_DELETED"] = 31008] = "RC_CONN_APP_BLOCKED_OR_DELETED";
        /**
         * 用户被屏蔽。
         */
        ErrorCode[ErrorCode["RC_CONN_USER_BLOCKED"] = 31009] = "RC_CONN_USER_BLOCKED";
        /**
         * Disconnect，由服务器返回，比如用户互踢。
         */
        ErrorCode[ErrorCode["RC_DISCONN_KICK"] = 31010] = "RC_DISCONN_KICK";
        /**
         * Disconnect，由服务器返回，比如用户互踢。
         */
        ErrorCode[ErrorCode["RC_DISCONN_EXCEPTION"] = 31011] = "RC_DISCONN_EXCEPTION";
        /**
         * 协议层内部错误。query，上传下载过程中数据错误。
         */
        ErrorCode[ErrorCode["RC_QUERY_ACK_NO_DATA"] = 32001] = "RC_QUERY_ACK_NO_DATA";
        /**
         * 协议层内部错误。
         */
        ErrorCode[ErrorCode["RC_MSG_DATA_INCOMPLETE"] = 32002] = "RC_MSG_DATA_INCOMPLETE";
        /**
         * 未调用 init 初始化函数。
         */
        ErrorCode[ErrorCode["BIZ_ERROR_CLIENT_NOT_INIT"] = 33001] = "BIZ_ERROR_CLIENT_NOT_INIT";
        /**
         * 数据库初始化失败。
         */
        ErrorCode[ErrorCode["BIZ_ERROR_DATABASE_ERROR"] = 33002] = "BIZ_ERROR_DATABASE_ERROR";
        /**
         * 传入参数无效。
         */
        ErrorCode[ErrorCode["BIZ_ERROR_INVALID_PARAMETER"] = 33003] = "BIZ_ERROR_INVALID_PARAMETER";
        /**
         * 通道无效。
         */
        ErrorCode[ErrorCode["BIZ_ERROR_NO_CHANNEL"] = 33004] = "BIZ_ERROR_NO_CHANNEL";
        /**
         * 重新连接成功。
         */
        ErrorCode[ErrorCode["BIZ_ERROR_RECONNECT_SUCCESS"] = 33005] = "BIZ_ERROR_RECONNECT_SUCCESS";
        /**
         * 连接中，再调用 connect 被拒绝。
         */
        ErrorCode[ErrorCode["BIZ_ERROR_CONNECTING"] = 33006] = "BIZ_ERROR_CONNECTING";
        /**
         * 消息漫游服务未开通
         */
        ErrorCode[ErrorCode["MSG_ROAMING_SERVICE_UNAVAILABLE"] = 33007] = "MSG_ROAMING_SERVICE_UNAVAILABLE";
        ErrorCode[ErrorCode["MSG_INSERT_ERROR"] = 33008] = "MSG_INSERT_ERROR";
        ErrorCode[ErrorCode["MSG_DEL_ERROR"] = 33009] = "MSG_DEL_ERROR";
        /**
         * 标签不存在
         */
        ErrorCode[ErrorCode["TAG_NOT_EXIST"] = 33101] = "TAG_NOT_EXIST";
        /**
         * 会话中不存在此标签
         */
        ErrorCode[ErrorCode["NO_TAG_IN_CONVER"] = 33102] = "NO_TAG_IN_CONVER";
        /**
         * 删除会话失败
         */
        ErrorCode[ErrorCode["CONVER_REMOVE_ERROR"] = 34001] = "CONVER_REMOVE_ERROR";
        /**
         *拉取历史消息
         */
        ErrorCode[ErrorCode["CONVER_GETLIST_ERROR"] = 34002] = "CONVER_GETLIST_ERROR";
        /**
         * 会话指定异常
         */
        ErrorCode[ErrorCode["CONVER_SETOP_ERROR"] = 34003] = "CONVER_SETOP_ERROR";
        /**
         * 获取会话未读消息总数失败
         */
        ErrorCode[ErrorCode["CONVER_TOTAL_UNREAD_ERROR"] = 34004] = "CONVER_TOTAL_UNREAD_ERROR";
        /**
         * 获取指定会话类型未读消息数异常
         */
        ErrorCode[ErrorCode["CONVER_TYPE_UNREAD_ERROR"] = 34005] = "CONVER_TYPE_UNREAD_ERROR";
        /**
         * 获取指定用户ID&会话类型未读消息数异常
         */
        ErrorCode[ErrorCode["CONVER_ID_TYPE_UNREAD_ERROR"] = 34006] = "CONVER_ID_TYPE_UNREAD_ERROR";
        ErrorCode[ErrorCode["CONVER_CLEAR_ERROR"] = 34007] = "CONVER_CLEAR_ERROR";
        /**
         * 扩展存储 key value 超出限制 (错误码与移动端对齐)
        */
        ErrorCode[ErrorCode["EXPANSION_LIMIT_EXCEET"] = 34010] = "EXPANSION_LIMIT_EXCEET";
        /**
         * 消息不支持扩展 (错误码与移动端对齐)
        */
        ErrorCode[ErrorCode["MESSAGE_KV_NOT_SUPPORT"] = 34008] = "MESSAGE_KV_NOT_SUPPORT";
        ErrorCode[ErrorCode["CLEAR_HIS_TIME_ERROR"] = 34011] = "CLEAR_HIS_TIME_ERROR";
        /**
         * 会话数量超出上限
         */
        ErrorCode[ErrorCode["CONVER_OUT_LIMIT_ERROR"] = 34013] = "CONVER_OUT_LIMIT_ERROR";
        ErrorCode[ErrorCode["CONVER_GET_ERROR"] = 34009] = "CONVER_GET_ERROR";
        /**
         * 群组信息异常
         */
        ErrorCode[ErrorCode["GROUP_SYNC_ERROR"] = 35001] = "GROUP_SYNC_ERROR";
        /**
         * 匹配群信息异常
         */
        ErrorCode[ErrorCode["GROUP_MATCH_ERROR"] = 35002] = "GROUP_MATCH_ERROR";
        /**
         * 已读回执方法调用错误（导航开关为1时调用新接口，否则调用sendMessage）
         */
        ErrorCode[ErrorCode["READ_RECEIPT_ERROR"] = 35003] = "READ_RECEIPT_ERROR";
        /**
         * 公有云包不允许连接私有云环境
         */
        ErrorCode[ErrorCode["PACKAGE_ENVIRONMENT_ERROR"] = 35006] = "PACKAGE_ENVIRONMENT_ERROR";
        /**
         * 已连接或者内部重连中，不允许调用重连，需先调用 disconnect 方法
         */
        ErrorCode[ErrorCode["CAN_NOT_RECONNECT"] = 35007] = "CAN_NOT_RECONNECT";
        /**
         * 不支持的平台类型，一般小程序或 PC 未开通
         */
        ErrorCode[ErrorCode["SERVER_UNAVAILABLE"] = 35008] = "SERVER_UNAVAILABLE";
        /**
         * Web 端设置安全域名后，连接端域名不在安全域名范围内
         */
        ErrorCode[ErrorCode["HOSTNAME_ERROR"] = 35009] = "HOSTNAME_ERROR";
        /**
         * 开启`禁止把已在线客户端踢下线`开关后，该错误码标识已有同类型端在线，禁止链接
         */
        ErrorCode[ErrorCode["HAS_OHTER_SAME_CLIENT_ON_LINE"] = 35010] = "HAS_OHTER_SAME_CLIENT_ON_LINE";
        // 聊天室异常
        /**
         * 加入聊天室Id为空
         */
        ErrorCode[ErrorCode["CHATROOM_ID_ISNULL"] = 36001] = "CHATROOM_ID_ISNULL";
        /**
         * 加入聊天室失败
         */
        ErrorCode[ErrorCode["CHARTOOM_JOIN_ERROR"] = 36002] = "CHARTOOM_JOIN_ERROR";
        /**
         * 拉取聊天室历史消息失败
         */
        ErrorCode[ErrorCode["CHATROOM_HISMESSAGE_ERROR"] = 36003] = "CHATROOM_HISMESSAGE_ERROR";
        /**
         * 聊天室 kv 未找到
         */
        ErrorCode[ErrorCode["CHATROOM_KV_NOT_FOUND"] = 36004] = "CHATROOM_KV_NOT_FOUND";
        // 黑名单异常
        /**
         * 加入黑名单异常
         */
        ErrorCode[ErrorCode["BLACK_ADD_ERROR"] = 37001] = "BLACK_ADD_ERROR";
        /**
         * 获得指定人员再黑名单中的状态异常
         */
        ErrorCode[ErrorCode["BLACK_GETSTATUS_ERROR"] = 37002] = "BLACK_GETSTATUS_ERROR";
        /**
         * 移除黑名单异常
         */
        ErrorCode[ErrorCode["BLACK_REMOVE_ERROR"] = 37003] = "BLACK_REMOVE_ERROR";
        /**
         * 获取草稿失败
         */
        ErrorCode[ErrorCode["DRAF_GET_ERROR"] = 38001] = "DRAF_GET_ERROR";
        /**
         * 保存草稿失败
         */
        ErrorCode[ErrorCode["DRAF_SAVE_ERROR"] = 38002] = "DRAF_SAVE_ERROR";
        /**
         * 删除草稿失败
         */
        ErrorCode[ErrorCode["DRAF_REMOVE_ERROR"] = 38003] = "DRAF_REMOVE_ERROR";
        /**
         * 关注公众号失败
         */
        ErrorCode[ErrorCode["SUBSCRIBE_ERROR"] = 39001] = "SUBSCRIBE_ERROR";
        /**
         * 方法未支持
         */
        ErrorCode[ErrorCode["NOT_SUPPORT"] = 39002] = "NOT_SUPPORT";
        /**
         * 关注公众号失败
         */
        ErrorCode[ErrorCode["QNTKN_FILETYPE_ERROR"] = 41001] = "QNTKN_FILETYPE_ERROR";
        /**
         * 获取七牛token失败
         */
        ErrorCode[ErrorCode["QNTKN_GET_ERROR"] = 41002] = "QNTKN_GET_ERROR";
        /**
         * cookie被禁用
         */
        ErrorCode[ErrorCode["COOKIE_ENABLE"] = 51001] = "COOKIE_ENABLE";
        ErrorCode[ErrorCode["GET_MESSAGE_BY_ID_ERROR"] = 61001] = "GET_MESSAGE_BY_ID_ERROR";
        // 没有注册DeviveId 也就是用户没有登陆
        ErrorCode[ErrorCode["HAVNODEVICEID"] = 24001] = "HAVNODEVICEID";
        // 已经存在
        ErrorCode[ErrorCode["DEVICEIDISHAVE"] = 24002] = "DEVICEIDISHAVE";
        // 没有对应的用户或token
        ErrorCode[ErrorCode["FEILD"] = 24009] = "FEILD";
        // voip为空
        ErrorCode[ErrorCode["VOIPISNULL"] = 24013] = "VOIPISNULL";
        // 不支持的Voip引擎
        ErrorCode[ErrorCode["NOENGINETYPE"] = 24010] = "NOENGINETYPE";
        // channleName 是空
        ErrorCode[ErrorCode["NULLCHANNELNAME"] = 24011] = "NULLCHANNELNAME";
        // 生成Voipkey失败
        ErrorCode[ErrorCode["VOIPDYANMICERROR"] = 24012] = "VOIPDYANMICERROR";
        // 没有配置voip
        ErrorCode[ErrorCode["NOVOIP"] = 24014] = "NOVOIP";
        // 服务器内部错误
        ErrorCode[ErrorCode["INTERNALERRROR"] = 24015] = "INTERNALERRROR";
        // VOIP close
        ErrorCode[ErrorCode["VOIPCLOSE"] = 24016] = "VOIPCLOSE";
        ErrorCode[ErrorCode["CLOSE_BEFORE_OPEN"] = 51001] = "CLOSE_BEFORE_OPEN";
        ErrorCode[ErrorCode["ALREADY_IN_USE"] = 51002] = "ALREADY_IN_USE";
        ErrorCode[ErrorCode["INVALID_CHANNEL_NAME"] = 51003] = "INVALID_CHANNEL_NAME";
        ErrorCode[ErrorCode["VIDEO_CONTAINER_IS_NULL"] = 51004] = "VIDEO_CONTAINER_IS_NULL";
        /**
         * 删除消息数组长度为 0 .
         */
        ErrorCode[ErrorCode["DELETE_MESSAGE_ID_IS_NULL"] = 61001] = "DELETE_MESSAGE_ID_IS_NULL";
        /**
         * 己方取消已发出的通话请求
         */
        ErrorCode[ErrorCode["CANCEL"] = 1] = "CANCEL";
        /**
         * 己方拒绝收到的通话请求
         */
        ErrorCode[ErrorCode["REJECT"] = 2] = "REJECT";
        /**
         * 己方挂断
         */
        ErrorCode[ErrorCode["HANGUP"] = 3] = "HANGUP";
        /**
         * 己方忙碌
         */
        ErrorCode[ErrorCode["BUSYLINE"] = 4] = "BUSYLINE";
        /**
         * 己方未接听
         */
        ErrorCode[ErrorCode["NO_RESPONSE"] = 5] = "NO_RESPONSE";
        /**
         * 己方不支持当前引擎
         */
        ErrorCode[ErrorCode["ENGINE_UN_SUPPORTED"] = 6] = "ENGINE_UN_SUPPORTED";
        /**
         * 己方网络出错
         */
        ErrorCode[ErrorCode["NETWORK_ERROR"] = 7] = "NETWORK_ERROR";
        /**
         * 对方取消已发出的通话请求
         */
        ErrorCode[ErrorCode["REMOTE_CANCEL"] = 11] = "REMOTE_CANCEL";
        /**
         * 对方拒绝收到的通话请求
         */
        ErrorCode[ErrorCode["REMOTE_REJECT"] = 12] = "REMOTE_REJECT";
        /**
         * 通话过程对方挂断
         */
        ErrorCode[ErrorCode["REMOTE_HANGUP"] = 13] = "REMOTE_HANGUP";
        /**
         * 对方忙碌
         */
        ErrorCode[ErrorCode["REMOTE_BUSYLINE"] = 14] = "REMOTE_BUSYLINE";
        /**
         * 对方未接听
         */
        ErrorCode[ErrorCode["REMOTE_NO_RESPONSE"] = 15] = "REMOTE_NO_RESPONSE";
        /**
         * 对方网络错误
         */
        ErrorCode[ErrorCode["REMOTE_ENGINE_UN_SUPPORTED"] = 16] = "REMOTE_ENGINE_UN_SUPPORTED";
        /**
         * 对方网络错误
         */
        ErrorCode[ErrorCode["REMOTE_NETWORK_ERROR"] = 17] = "REMOTE_NETWORK_ERROR";
        /**
         * VoIP 不可用
         */
        ErrorCode[ErrorCode["VOIP_NOT_AVALIABLE"] = 18] = "VOIP_NOT_AVALIABLE";
    })(ErrorCode || (ErrorCode = {}));
    var ErrorCode$1 = ErrorCode;

    /**
     * 连接状态
     */
    var ConnectionStatus;
    (function (ConnectionStatus) {
        /**
         * 连接成功。
         */
        ConnectionStatus[ConnectionStatus["CONNECTED"] = 0] = "CONNECTED";
        /**
         * 连接中。
         */
        ConnectionStatus[ConnectionStatus["CONNECTING"] = 1] = "CONNECTING";
        /**
         * 正常断开连接。
         */
        ConnectionStatus[ConnectionStatus["DISCONNECTED"] = 2] = "DISCONNECTED";
        /**
         * 网络不可用。
         */
        ConnectionStatus[ConnectionStatus["NETWORK_UNAVAILABLE"] = 3] = "NETWORK_UNAVAILABLE";
        /**
         * 连接关闭。
         */
        ConnectionStatus[ConnectionStatus["CONNECTION_CLOSED"] = 4] = "CONNECTION_CLOSED";
        /**
         * 用户账户在其他设备登录，本机会被踢掉线。
         */
        ConnectionStatus[ConnectionStatus["KICKED_OFFLINE_BY_OTHER_CLIENT"] = 6] = "KICKED_OFFLINE_BY_OTHER_CLIENT";
        /**
         * websocket 连接失败
         */
        ConnectionStatus[ConnectionStatus["WEBSOCKET_UNAVAILABLE"] = 7] = "WEBSOCKET_UNAVAILABLE";
        /**
         * websocket 报错
         */
        ConnectionStatus[ConnectionStatus["WEBSOCKET_ERROR"] = 8] = "WEBSOCKET_ERROR";
        /**
         * 用户被封禁
         */
        ConnectionStatus[ConnectionStatus["BLOCKED"] = 9] = "BLOCKED";
        /**
         * 域名错误
         */
        ConnectionStatus[ConnectionStatus["DOMAIN_INCORRECT"] = 12] = "DOMAIN_INCORRECT";
        /**
         * 服务器主动断开
         */
        ConnectionStatus[ConnectionStatus["DISCONNECT_BY_SERVER"] = 13] = "DISCONNECT_BY_SERVER";
        /**
         * 重定向
         */
        ConnectionStatus[ConnectionStatus["REDIRECT"] = 14] = "REDIRECT";
        /**
         * appkey 不正确
         */
        ConnectionStatus[ConnectionStatus["APPKEY_IS_FAKE"] = 20] = "APPKEY_IS_FAKE";
        /**
         * 互踢次数过多（`count > 5`），此时可能出现：在其它他设备登陆有 reconnect 逻辑
         */
        ConnectionStatus[ConnectionStatus["ULTRALIMIT"] = 1101] = "ULTRALIMIT";
        /**
         * 开始请求导航
         */
        ConnectionStatus[ConnectionStatus["REQUEST_NAVI"] = 201] = "REQUEST_NAVI";
        /**
         * 请求导航结束
         */
        ConnectionStatus[ConnectionStatus["RESPONSE_NAVI"] = 202] = "RESPONSE_NAVI";
        /**
         *  请求导航失败
         */
        ConnectionStatus[ConnectionStatus["RESPONSE_NAVI_ERROR"] = 203] = "RESPONSE_NAVI_ERROR";
        /**
         *  请求导航超时
         */
        ConnectionStatus[ConnectionStatus["RESPONSE_NAVI_TIMEOUT"] = 204] = "RESPONSE_NAVI_TIMEOUT";
    })(ConnectionStatus || (ConnectionStatus = {}));
    var ConnectionStatus$1 = ConnectionStatus;

    /**
     * CMP/Comet 服务连接应答码
     */
    const ConnectResultCode = {
        /**
         * 连接成功
         */
        ACCEPTED: 0,
        /**
         * 协议版本不匹配
         * @description 暂未使用
         */
        UNACCEPTABLE_PROTOCOL_VERSION: 1,
        /**
         * 客户端（移动端 TCP 连接建立时）`info` 字段格式错误
         * @description 格式：`{平台类型}-{设备信息}-{sdk版本}`。
         * 其中设备信息为：{手机类型}{手机型号}{网络类型，4G/WIFI}{运营商标识, 移动/电信/联通}
         */
        IDENTIFIER_REJECTED: 2,
        /**
         * 不支持的平台类型，一般小程序或 PC 未开通
         */
        SERVER_UNAVAILABLE: 3,
        /**
         * Token无法解析，或Token已过期
         */
        TOKEN_INCORRECT: 4,
        /**
         * 防黑产规则相关应答
         */
        NOT_AUTHORIZED: 5,
        /**
         * 服务重定向，一般服务扩缩容时，落点已经改变，此时 userId 链接到旧的节点时，会触发该错误。
         * 客户端收到该应答后须重新访问导航，重新获取 CMP 地址
         */
        REDIRECT: 6,
        /**
         * 暂未使用
         */
        PACKAGE_ERROR: 7,
        /**
         * 该 AppKey 已经封禁或删除
         */
        APP_BLOCK_OR_DELETE: 8,
        /**
         * 该用户 ID 已经被封禁
         */
        BLOCK: 9,
        /**
         * Token 已过期，暂未使用
         */
        TOKEN_EXPIRE: 10,
        /**
         * Token 中携带 deviceId 时，检测 Token 中 deviceId 与链接设备 deviceId 不一致
         */
        DEVICE_ERROR: 11,
        /**
         * Web 端设置安全域名后，连接端域名不在安全域名范围内
         */
        HOSTNAME_ERROR: 12,
        /**
         * 开启`禁止把已在线客户端踢下线`开关后，该错误码标识已有同类型端在线，禁止链接
         */
        HASOHTERSAMECLIENTONLINE: 13
    };

    /**
     * 内置消息类型
     */
    var MessageType;
    (function (MessageType) {
        /**
         * 文字消息
        */
        MessageType["TextMessage"] = "RC:TxtMsg";
        /**
         * 语音消息
        */
        MessageType["VOICE"] = "RC:VcMsg";
        /**
         * 高质量消息
        */
        MessageType["HQ_VOICE"] = "RC:HQVCMsg";
        /**
         * 图片消息
        */
        MessageType["IMAGE"] = "RC:ImgMsg";
        /**
         * GIF 消息
        */
        MessageType["GIF"] = "RC:GIFMsg";
        /**
         * 图文消息
        */
        MessageType["RICH_CONTENT"] = "RC:ImgTextMsg";
        /**
         * 位置消息
        */
        MessageType["LOCATION"] = "RC:LBSMsg";
        /**
         * 文件消息
        */
        MessageType["FILE"] = "RC:FileMsg";
        /**
         * 小视频消息
        */
        MessageType["SIGHT"] = "RC:SightMsg";
        /**
         * 合并转发消息
        */
        MessageType["COMBINE"] = "RC:CombineMsg";
        /**
         * 聊天室 KV 通知消息
        */
        MessageType["CHRM_KV_NOTIFY"] = "RC:chrmKVNotiMsg";
        /**
         * 日志通知消息
        */
        MessageType["LOG_COMMAND"] = "RC:LogCmdMsg";
        /**
         * 消息扩展
        */
        MessageType["EXPANSION_NOTIFY"] = "RC:MsgExMsg";
        /**
         * 引用消息
        */
        MessageType["REFERENCE"] = "RC:ReferenceMsg";
        /**
         * 撤回消息
        */
        MessageType["RECALL"] = "RC:RcCmd";
        /**
         * 已读同步状态消息
        */
        MessageType["READ_RECEIPT"] = "RC:ReadNtf";
        /**
         * 群已读请求回执消息
        */
        MessageType["READ_RECEIPT_REQUEST"] = "RC:RRReqMsg";
        /**
         * 群已读响应回执消息
        */
        MessageType["READ_RECEIPT_RESPONSE"] = "RC:RRRspMsg";
        /**
         * 多端同步已读状态
        */
        MessageType["SYNC_READ_STATUS"] = "RC:SRSMsg";
        /**
         * 接受群已读回执更新消息(导航开关grpRRVer为1时使用)
         */
        MessageType["GROUP_READ_RECEIPT_REQUEST"] = "RC:RRMsg";
    })(MessageType || (MessageType = {}));
    var MessageType$1 = MessageType;

    var NotificationStatus;
    (function (NotificationStatus) {
        /**
         * 免打扰已开启
        */
        NotificationStatus[NotificationStatus["OPEN"] = 1] = "OPEN";
        /**
         * 免打扰已关闭
        */
        NotificationStatus[NotificationStatus["CLOSE"] = 2] = "CLOSE";
    })(NotificationStatus || (NotificationStatus = {}));
    var NotificationStatus$1 = NotificationStatus;

    /**
     * 群组 @ 类型
    */
    var MentionedType;
    (function (MentionedType) {
        /**
         * 所有人
        */
        MentionedType[MentionedType["ALL"] = 1] = "ALL";
        /**
         * 部分人
        */
        MentionedType[MentionedType["SINGAL"] = 2] = "SINGAL";
    })(MentionedType || (MentionedType = {}));
    var MentionedType$1 = MentionedType;

    var UploadMethod;
    (function (UploadMethod) {
        /**
         * 七牛上传
         */
        UploadMethod[UploadMethod["QINIU"] = 1] = "QINIU";
        /**
         * 阿里云上传
         */
        UploadMethod[UploadMethod["ALI"] = 2] = "ALI";
        /**
         * 亚马逊上传
         */
        UploadMethod[UploadMethod["AWS"] = 3] = "AWS";
        /**
         * stc上传
         */
        UploadMethod[UploadMethod["STC"] = 4] = "STC";
    })(UploadMethod || (UploadMethod = {}));
    var UploadMethod$1 = UploadMethod;

    /**
     *  聊天室 kv 存储操作类型. 对方操作, 己方收到消息(RC:chrmKVNotiMsg)中会带入此值. 根据此值判断是删除还是更新
    */
    var ChatroomEntryType;
    (function (ChatroomEntryType) {
        ChatroomEntryType[ChatroomEntryType["UPDATE"] = 1] = "UPDATE";
        ChatroomEntryType[ChatroomEntryType["DELETE"] = 2] = "DELETE";
    })(ChatroomEntryType || (ChatroomEntryType = {}));
    var ChatroomEntryType$1 = ChatroomEntryType;

    /**
     * 音视频模式
     */
    exports.RTCMode = void 0;
    (function (RTCMode) {
        /**
         * 普通音视频模式
         */
        RTCMode[RTCMode["RTC"] = 0] = "RTC";
        /**
         * 直播模式
         */
        RTCMode[RTCMode["LIVE"] = 2] = "LIVE";
    })(exports.RTCMode || (exports.RTCMode = {}));
    /**
     * 直播类型
     */
    exports.LiveType = void 0;
    (function (LiveType) {
        /**
         * 音视频直播
         */
        LiveType[LiveType["AUDIO_AND_VIDEO"] = 0] = "AUDIO_AND_VIDEO";
        /**
         * 音频直播
         */
        LiveType[LiveType["AUDIO"] = 1] = "AUDIO";
    })(exports.LiveType || (exports.LiveType = {}));
    exports.LiveRole = void 0;
    (function (LiveRole) {
        /**
         * 主播身份
         */
        LiveRole[LiveRole["ANCHOR"] = 1] = "ANCHOR";
        /**
         * 观众身份
         */
        LiveRole[LiveRole["AUDIENCE"] = 2] = "AUDIENCE";
    })(exports.LiveRole || (exports.LiveRole = {}));
    /**
     * CallLib 流程消息
     */
    const CallLibMsgType = {
        'RC:VCAccept': 'RC:VCAccept',
        'RC:VCRinging': 'RC:VCRinging',
        'RC:VCSummary': 'RC:VCSummary',
        'RC:VCHangup': 'RC:VCHangup',
        'RC:VCInvite': 'RC:VCInvite',
        'RC:VCModifyMedia': 'RC:VCModifyMedia',
        'RC:VCModifyMem': 'RC:VCModifyMem'
    };
    exports.RTCApiType = void 0;
    (function (RTCApiType) {
        RTCApiType[RTCApiType["ROOM"] = 1] = "ROOM";
        RTCApiType[RTCApiType["PERSON"] = 2] = "PERSON";
    })(exports.RTCApiType || (exports.RTCApiType = {}));
    exports.RTCIdentityChangeType = void 0;
    (function (RTCIdentityChangeType) {
        RTCIdentityChangeType[RTCIdentityChangeType["AnchorToViewer"] = 1] = "AnchorToViewer";
        RTCIdentityChangeType[RTCIdentityChangeType["ViewerToAnchor"] = 2] = "ViewerToAnchor"; // 观众变主播
    })(exports.RTCIdentityChangeType || (exports.RTCIdentityChangeType = {}));
    /**
     * RTC 房间加入类型
     */
    exports.RTCJoinType = void 0;
    (function (RTCJoinType) {
        /**
         * 踢前一个设备
         */
        RTCJoinType[RTCJoinType["KICK"] = 0] = "KICK";
        /**
         * 当前加入拒绝
         */
        RTCJoinType[RTCJoinType["REFUSE"] = 1] = "REFUSE";
        /**
         * 两个设备共存
         */
        RTCJoinType[RTCJoinType["COEXIST"] = 2] = "COEXIST";
    })(exports.RTCJoinType || (exports.RTCJoinType = {}));

    /**
     * 预定义的验证规则，只包含`值类型`数据验证
     * 引用类型数据需使用自定义 validator 校验函数进行校验
     */
    exports.AssertRules = void 0;
    (function (AssertRules) {
        /**
         * 类型为字符串，且长度大于 0
         */
        AssertRules[AssertRules["STRING"] = 0] = "STRING";
        /**
         * 类型仅为 String
        */
        AssertRules[AssertRules["ONLY_STRING"] = 1] = "ONLY_STRING";
        /**
         * 类型为数字
         */
        AssertRules[AssertRules["NUMBER"] = 2] = "NUMBER";
        /**
         * 类型为布尔值
         */
        AssertRules[AssertRules["BOOLEAN"] = 3] = "BOOLEAN";
        /**
         * 类型为对象
        */
        AssertRules[AssertRules["OBJECT"] = 4] = "OBJECT";
        /**
         * 类型为数组
        */
        AssertRules[AssertRules["ARRAY"] = 5] = "ARRAY";
        /**
         * 类型为 callback 回调对象，包含 callback.onSuccess、callback.onError
        */
        AssertRules[AssertRules["CALLBACK"] = 6] = "CALLBACK";
    })(exports.AssertRules || (exports.AssertRules = {}));
    const validators = {
        [exports.AssertRules.STRING]: notEmptyString,
        [exports.AssertRules.ONLY_STRING]: isString,
        [exports.AssertRules.NUMBER]: isNumber,
        [exports.AssertRules.BOOLEAN]: (value) => typeof value === 'boolean',
        [exports.AssertRules.OBJECT]: isObject,
        [exports.AssertRules.ARRAY]: isArray,
        [exports.AssertRules.CALLBACK]: (callback) => {
            let flag = true;
            if (!isObject(callback)) {
                flag = false;
            }
            callback = callback || {};
            if (callback.onSuccess && !isFunction(callback.onSuccess)) {
                flag = false;
            }
            if (callback.onError && !isFunction(callback.onError)) {
                flag = false;
            }
            return flag;
        }
    };
    class RCAssertError extends Error {
        constructor(message) {
            super(message);
            this.name = 'RCAssertError';
        }
    }
    /**
     * 参数校验，该方法用于对业务层入参数据检查，及时抛出异常通知业务层进行修改
     * @description
     * 1. 必填参数，value 需符合 validator 验证规，否则抛出异常
     * 2. 非必填参数，value 可为 undefined | null 或符合 validator 规则
     * @param key 字段名，仅用于验证失败时给出提示信息
     * @param value 待验证的值
     * @param validator 期望类型或校验规则函数，若使用规则函数
     * @param required 是否为必填参数，默认为 `false`
     */
    const assert = (key, value, validator, required = false) => {
        if (!validate(key, value, validator, required)) {
            throw new RCAssertError(`'${key}' is invalid: ${JSON.stringify(value)}`);
        }
    };
    /**
     * 参数校验，该方法用于对业务层入参数据检查，与 `assert` 函数不同的是其返回 boolean 值而非直接抛出异常
     * @description
     * 1. 必填参数，value 需符合 validator 验证规，否则抛出异常
     * 2. 非必填参数，value 可为 undefined | null 或符合 validator 规则
     * @param key 字段名，仅用于验证失败时给出提示信息
     * @param value 待验证的值
     * @param validator 期望类型或校验规则函数，若使用规则函数
     * @param required 是否为必填参数，默认为 `false`
     */
    const validate = (key, value, validator, required = false) => {
        validator = validators[validator] || validator;
        const invalid = 
        // 必填参数校验
        (required && !validator(value)) ||
            // 非必填参数校验
            (!required && !(isUndefined(value) || value === null || validator(value)));
        if (invalid) {
            // 打印无效参数到控制台便于定位问题
            logger.error(`'${key}' is invalid: ${JSON.stringify(value)}`);
        }
        return !invalid;
    };

    const timerSetTimeout = (fun, itv) => {
        return setTimeout(fun, itv);
    };
    const int64ToTimestamp = (obj) => {
        if (!isObject(obj) || obj.low === undefined || obj.high === undefined) {
            return obj;
        }
        let low = obj.low;
        if (low < 0) {
            low += 0xffffffff + 1;
        }
        low = low.toString(16);
        const timestamp = parseInt(obj.high.toString(16) + '00000000'.replace(new RegExp('0{' + low.length + '}$'), low), 16);
        return timestamp;
    };
    const batchInt64ToTimestamp = (data) => {
        for (const key in data) {
            if (isObject(data[key])) {
                data[key] = int64ToTimestamp(data[key]);
            }
        }
        return data;
    };
    const formatDate = (seperator) => {
        seperator = seperator || '-';
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}${seperator}${month}${seperator}${day}`;
    };

    /**
     * engine 层业务相关工具方法
    */
    /**
     * 通过文件类型生成上传唯一文件名
    */
    const getUploadFileName = (type, fileName) => {
        const random = Math.floor((Math.random() * 1000) % 10000);
        const uuid = getUUID();
        const date = formatDate();
        const timestamp = new Date().getTime();
        let extension = '';
        if (fileName) {
            const fileNameArr = fileName.split('.');
            extension = '.' + fileNameArr[fileNameArr.length - 1];
        }
        return `${type}__RC-${date}_${random}_${timestamp}${uuid}${extension}`;
    };
    /**
     * 通过 fileType 获取 MIME
    */
    const getMimeKey = (fileType) => {
        let mimeKey = 'application/octet-stream';
        switch (fileType) {
            case FileType$1.IMAGE:
                mimeKey = 'image/jpeg';
                break;
            case FileType$1.AUDIO:
                mimeKey = 'audio/amr';
                break;
            case FileType$1.VIDEO:
                mimeKey = 'video/3gpp';
                break;
            case FileType$1.SIGHT:
                mimeKey = 'video/mpeg4';
                break;
            case FileType$1.COMBINE_HTML:
                mimeKey = 'text/html';
                break;
        }
        return mimeKey;
    };
    /**
     * 生成 pushConfigs JSON
     * @description
     * 与 Server 约定一致， threadId、apnsCollapseId、channelIdMi、channelIdHW、channelIdOPPO、typeVivo 无值时可传空字符串
    */
    const pushConfigsToJSON = (iOSConfig = {}, androidConfig = {}) => {
        const { threadId, apnsCollapseId, category, richMediaUri } = iOSConfig;
        const { channelIdMi, channelIdHW, channelIdOPPO, typeVivo, googleConfig } = androidConfig;
        const APNS = {};
        APNS['thread-id'] = threadId || '';
        APNS['apns-collapse-id'] = apnsCollapseId || '';
        APNS.category = category || '';
        APNS.richMediaUri = richMediaUri || '';
        const FCM = {};
        FCM.collapse_key = googleConfig === null || googleConfig === void 0 ? void 0 : googleConfig.collapseKey;
        FCM.imageUrl = googleConfig === null || googleConfig === void 0 ? void 0 : googleConfig.imageUrl;
        let priority = googleConfig === null || googleConfig === void 0 ? void 0 : googleConfig.priority;
        if (priority && !['high', 'normal'].includes(priority))
            priority = 'normal';
        FCM.priority = priority;
        const pushCongfigs = [
            {
                HW: {
                    channelId: channelIdHW || ''
                }
            }, {
                MI: {
                    channelId: channelIdMi || ''
                }
            }, {
                OPPO: {
                    channelId: channelIdOPPO || ''
                }
            }, {
                VIVO: {
                    classification: typeVivo || ''
                }
            }, {
                APNS: APNS
            }, {
                FCM
            }
        ];
        return JSON.stringify(pushCongfigs);
    };
    /**
     * 将服务端返回的 push 信息格式化
     * @param pushStr
     */
    const pushJSONToConfigs = (pushStr, pushId) => {
        const iOSConfig = {};
        const androidConfig = {
            notificationId: pushId || ''
        };
        if (!pushStr) {
            return {
                iOSConfig,
                androidConfig
            };
        }
        try {
            const config = JSON.parse(pushStr);
            config === null || config === void 0 ? void 0 : config.forEach((item) => {
                var _a, _b, _c, _d;
                const keys = Object.keys(item);
                if (keys.length === 0)
                    return;
                const key = keys[0];
                switch (key) {
                    case 'HW':
                        androidConfig.channelIdHW = (_a = item[key]) === null || _a === void 0 ? void 0 : _a.channelId;
                        return;
                    case 'MI':
                        androidConfig.channelIdMi = (_b = item[key]) === null || _b === void 0 ? void 0 : _b.channelId;
                        return;
                    case 'OPPO':
                        androidConfig.channelIdOPPO = (_c = item[key]) === null || _c === void 0 ? void 0 : _c.channelId;
                        return;
                    case 'VIVO':
                        androidConfig.typeVivo = (_d = item[key]) === null || _d === void 0 ? void 0 : _d.classification;
                        return;
                    case 'APNS':
                        iOSConfig.threadId = item[key]['thread-id'];
                        iOSConfig.apnsCollapseId = item[key]['apns-collapse-id'];
                        iOSConfig.category = item[key].category;
                        iOSConfig.richMediaUri = item[key].richMediaUri;
                        return;
                    case 'FCM':
                        androidConfig.googleConfig = {
                            collapseKey: item[key].collapse_key || '',
                            imageUrl: item[key].imageUrl || '',
                            priority: item[key].priority || ''
                        };
                }
            });
        }
        catch (error) {
            logger.error('Wrong format for pushConfigs field! content: ' + pushStr);
        }
        return {
            iOSConfig,
            androidConfig
        };
    };
    const isValidChrmEntryKey = (key) => {
        const isValid = /^[A-Za-z0-9_=+-]+$/.test(key); // 大小写英文字母、数字、+、=、-、_
        const keyLen = key.length;
        const isLimit = keyLen <= 128 && keyLen >= 1;
        return isValid && isLimit;
    };
    const isValidChrmEntryValue = (value) => {
        const length = value.length;
        return length <= 4096 && length >= 1;
    };

    /**
     * @todo 后期禁用此方法，容易滥用，且会丢失上下文的数据类型跟踪
     * @deprecated
     * @param source
     * @param event
     * @param options
     */
    const forEach = (source, event, options) => {
        options = options || {};
        event = event || function () { };
        const { isReverse } = options;
        const loopObj = () => {
            for (const key in source) {
                event(source[key], key, source);
            }
        };
        const loopArr = () => {
            if (isReverse) {
                for (let i = source.length - 1; i >= 0; i--) {
                    event(source[i], i);
                }
            }
            else {
                for (let j = 0, len = source.length; j < len; j++) {
                    event(source[j], j);
                }
            }
        };
        if (isObject(source)) {
            loopObj();
        }
        if (isArray(source) || isString(source)) {
            loopArr();
        }
    };
    /**
     * @deprecated
     * @param source
     * @param event
     */
    const map = (source, event) => {
        forEach(source, (item, index) => {
            source[index] = event(item, index);
        });
        return source;
    };
    const indexOf = (source, searchVal) => {
        // 注: 字符串的 indexof 兼容至 IE3
        if (source.indexOf) {
            return source.indexOf(searchVal);
        }
        let index = -1;
        forEach(source, (sub, i) => {
            if (searchVal === sub) {
                index = i;
            }
        });
        return index;
    };
    const isInclude = (source, searchVal) => {
        const index = indexOf(source, searchVal);
        return index !== -1;
    };
    /**
     * 判断对象里是否有某个值
    */
    const isInObject = (source, searchVal) => {
        const arr = [];
        forEach(source, (val) => {
            arr.push(val);
        });
        const index = indexOf(arr, searchVal);
        return index !== -1;
    };
    /**
     * 通过 JSON 拷贝
    */
    const cloneByJSON = (sourceObj) => {
        return JSON.parse(JSON.stringify(sourceObj));
    };
    /**
     * 判断当前是否运行在 electron 环境且搭配 c++ 协议栈使用
     */
    const usingCppEngine = () => {
        return typeof RCCppEngine !== 'undefined';
    };
    const getBrowser = (runtime) => {
        if (runtime.tag !== 'browser') {
            return {
                type: runtime.tag,
                version: 'UnKonw'
            };
        }
        const userAgent = navigator.userAgent;
        let version;
        let type;
        /* 记录各浏览器名字和匹配条件 */
        const condition = {
            IE: /rv:([\d.]+)\) like Gecko|MSIE ([\d.]+)/,
            Edge: /Edge\/([\d.]+)/,
            Firefox: /Firefox\/([\d.]+)/,
            Opera: /(?:OPERA|OPR).([\d.]+)/,
            WeChat: /MicroMessenger\/([\d.]+)/,
            QQBrowser: /QQBrowser\/([\d.]+)/,
            Chrome: /Chrome\/([\d.]+)/,
            Safari: /Version\/([\d.]+).*Safari/,
            iOSChrome: /Mobile\/([\d.]+).*Safari/
        };
        for (const key in condition) {
            /* eslint-disable */
            if (!condition.hasOwnProperty(key))
                continue;
            let browserContent = userAgent.match(condition[key]);
            if (browserContent) {
                type = key;
                version = browserContent[1] || browserContent[2];
                break;
            }
        }
        return {
            type: type || 'UnKonw',
            version: version || 'UnKonw'
        };
    };
    /**
     * 将连接时服务端返回码转换成业务响应码
     * @param code 连接响应码
     */
    const formatConnectResponseCode = (code) => {
        switch (code) {
            case ConnectResultCode.SERVER_UNAVAILABLE:
                return ErrorCode$1.SERVER_UNAVAILABLE;
            case ConnectResultCode.TOKEN_INCORRECT:
                return ErrorCode$1.RC_CONN_USER_OR_PASSWD_ERROR;
            case ConnectResultCode.REDIRECT:
                return ErrorCode$1.RC_CONN_REDIRECTED;
            case ConnectResultCode.APP_BLOCK_OR_DELETE:
                return ErrorCode$1.RC_CONN_APP_BLOCKED_OR_DELETED;
            case ConnectResultCode.BLOCK:
                return ErrorCode$1.RC_CONN_USER_BLOCKED;
            case ConnectResultCode.TOKEN_EXPIRE:
                return ErrorCode$1.RC_CONN_USER_OR_PASSWD_ERROR;
            case ConnectResultCode.HOSTNAME_ERROR:
                return ErrorCode$1.HOSTNAME_ERROR;
            case ConnectResultCode.HASOHTERSAMECLIENTONLINE:
                return ErrorCode$1.HAS_OHTER_SAME_CLIENT_ON_LINE;
            default:
                return ErrorCode$1.RC_NET_UNAVAILABLE;
        }
    };

    /**
     * 通过 status 计算接收到的消息的部分属性值
     * @description
     * status 转为二进制, 二进制的比特位存储消息的部分属性值
     * 属性所占比特位:
     * 0000-0010 该消息是否曾被该用户拉取过(其他端)
     * 0001-0000 isPersited
     * 0010-0000 isCounted
     * 0100-0000 isMentioned
     * 0010-0000-0000 disableNotification
     * 0100-0000-0000 canIncludeExpansion
    */
    const getMessageOptionByStatus = (status) => {
        let isPersited = true;
        let isCounted = true;
        let isMentioned = false;
        let disableNotification = false;
        let receivedStatus = ReceivedStatus$1.READ;
        let isReceivedByOtherClient = false;
        let canIncludeExpansion = false;
        isPersited = !!(status & 0x10);
        isCounted = !!(status & 0x20);
        isMentioned = !!(status & 0x40);
        disableNotification = !!(status & 0x200);
        isReceivedByOtherClient = !!(status & 0x02);
        receivedStatus = isReceivedByOtherClient ? ReceivedStatus$1.RETRIEVED : receivedStatus;
        canIncludeExpansion = !!(status & 0x400);
        return {
            isPersited,
            isCounted,
            isMentioned,
            disableNotification,
            receivedStatus,
            canIncludeExpansion
        };
    };
    /**
     * 通过 sessionId 计算发送消息成功后，发送消息的部分属性
     * @description
     * sessionId 转为二进制, 二进制的比特位存储消息的部分属性值
     * 属性所占比特位:
     * 0000-0001 isPersited
     * 0000-0010 isCounted
     * 0000-0100 isMentioned
     * 0010-0000 disableNotification
     * 0100-0000 canIncludeExpansion
    */
    const getUpMessageOptionBySessionId = (sessionId) => {
        let isPersited = false;
        let isCounted = false;
        let disableNotification = false;
        let canIncludeExpansion = false;
        isPersited = !!(sessionId & 0x01);
        isCounted = !!(sessionId & 0x02);
        disableNotification = !!(sessionId & 0x20);
        canIncludeExpansion = !!(sessionId & 0x40);
        return {
            isPersited,
            isCounted,
            disableNotification,
            canIncludeExpansion
        };
    };
    const formatExtraContent = (extraContent) => {
        const expansion = {}; // 扩展为用户任意设置的键值对
        const parseExtraContent = JSON.parse(extraContent);
        forEach(parseExtraContent, (value, key) => {
            expansion[key] = value.v;
        });
        return expansion;
    };
    /**
     * TODO: 确定对外暴露的必要性
     * @deprecated
     */
    const DelayTimer = {
        _delayTime: 0,
        /**
         * 方法并未引用，getTimer 实际返回值始终为 Date.now()
         * @deprecated
         */
        setTime: (time) => {
            const currentTime = new Date().getTime();
            DelayTimer._delayTime = currentTime - time;
        },
        getTime: () => {
            const delayTime = DelayTimer._delayTime;
            const currentTime = new Date().getTime();
            return currentTime - delayTime;
        }
    };
    const getChatRoomKVByStatus = (status) => {
        const isDeleteOpt = !!(status & 0x0004);
        return {
            isAutoDelete: !!(status & 0x0001),
            isOverwrite: !!(status & 0x0002),
            type: isDeleteOpt ? ChatroomEntryType$1.DELETE : ChatroomEntryType$1.UPDATE
        };
    };
    const getChatRoomKVOptStatus = (entity, action) => {
        let status = 0;
        // 是否自动清理
        if (entity.isAutoDelete) {
            status = status | 0x0001;
        }
        // 是否覆盖
        if (entity.isOverwrite) {
            status = status | 0x0002;
        }
        // 操作类型
        if (action === 2) {
            status = status | 0x0004;
        }
        return status;
    };
    const getSessionId = (option) => {
        const { isStatusMessage } = option;
        let { isPersited, isCounted, isMentioned, disableNotification, canIncludeExpansion } = option;
        if (isStatusMessage) {
            isPersited = isCounted = false;
        }
        let sessionId = 0;
        if (isPersited) {
            sessionId = sessionId | 0x01;
        }
        if (isCounted) {
            sessionId = sessionId | 0x02;
        }
        if (isMentioned) {
            sessionId = sessionId | 0x04;
        }
        if (disableNotification) {
            sessionId = sessionId | 0x20;
        }
        if (canIncludeExpansion) {
            sessionId = sessionId | 0x40;
        }
        return sessionId;
    };

    /**
     * 通信协议中 fixHeader 第一个字节中的 Qos 数据标识
     * ```
     * fixHeader：command(4 bit) | dup(1 bit) | Qos(2 bit) | retain(1 bit)
     * ```
     */
    var QOS;
    (function (QOS) {
        QOS[QOS["AT_MOST_ONCE"] = 0] = "AT_MOST_ONCE";
        QOS[QOS["AT_LEAST_ONCE"] = 1] = "AT_LEAST_ONCE";
        QOS[QOS["EXACTLY_ONCE"] = 2] = "EXACTLY_ONCE";
        QOS[QOS["DEFAULT"] = 3] = "DEFAULT";
    })(QOS || (QOS = {}));
    /**
     * 通信协议中 fixHeader 第一个字节中的 command 数据标识，用于判断操作类型
     * ```
     * fixHeader：command(4 bit) | dup(1 bit) | Qos(2 bit) | retain(1 bit)
     * ```
     */
    var OperationType;
    (function (OperationType) {
        /** 私有云专用，解密协商指令 */
        OperationType[OperationType["SYMMETRIC"] = 0] = "SYMMETRIC";
        /** 连接请求 */
        OperationType[OperationType["CONNECT"] = 1] = "CONNECT";
        /** 连接应答 */
        OperationType[OperationType["CONN_ACK"] = 2] = "CONN_ACK";
        /** 上行发送消息 */
        OperationType[OperationType["PUBLISH"] = 3] = "PUBLISH";
        /** 上行发送消息的应答 */
        OperationType[OperationType["PUB_ACK"] = 4] = "PUB_ACK";
        /** 上行拉消息 */
        OperationType[OperationType["QUERY"] = 5] = "QUERY";
        /** 上行拉消息的应答 */
        OperationType[OperationType["QUERY_ACK"] = 6] = "QUERY_ACK";
        /** QueryConfirm */
        OperationType[OperationType["QUERY_CONFIRM"] = 7] = "QUERY_CONFIRM";
        OperationType[OperationType["SUBSCRIBE"] = 8] = "SUBSCRIBE";
        OperationType[OperationType["SUB_ACK"] = 9] = "SUB_ACK";
        OperationType[OperationType["UNSUBSCRIBE"] = 10] = "UNSUBSCRIBE";
        OperationType[OperationType["UNSUB_ACK"] = 11] = "UNSUB_ACK";
        OperationType[OperationType["PING_REQ"] = 12] = "PING_REQ";
        OperationType[OperationType["PING_RESP"] = 13] = "PING_RESP";
        /** 连接挂断 */
        OperationType[OperationType["DISCONNECT"] = 14] = "DISCONNECT";
        OperationType[OperationType["RESERVER2"] = 15] = "RESERVER2";
    })(OperationType || (OperationType = {}));
    var MessageName;
    (function (MessageName) {
        MessageName["CONN_ACK"] = "ConnAckMessage";
        MessageName["DISCONNECT"] = "DisconnectMessage";
        MessageName["PING_REQ"] = "PingReqMessage";
        MessageName["PING_RESP"] = "PingRespMessage";
        MessageName["PUBLISH"] = "PublishMessage";
        MessageName["PUB_ACK"] = "PubAckMessage";
        MessageName["QUERY"] = "QueryMessage";
        MessageName["QUERY_CON"] = "QueryConMessage";
        MessageName["QUERY_ACK"] = "QueryAckMessage";
    })(MessageName || (MessageName = {}));
    var IDENTIFIER;
    (function (IDENTIFIER) {
        IDENTIFIER["PUB"] = "pub";
        IDENTIFIER["QUERY"] = "qry";
    })(IDENTIFIER || (IDENTIFIER = {}));

    /**
     * @todo 注释补全
     * @description
     * Header 处理
    */
    class Header {
        constructor(type, retain = false, qos = QOS.AT_LEAST_ONCE, dup = false) {
            this._retain = false;
            this.qos = QOS.AT_LEAST_ONCE;
            this._dup = false;
            this.syncMsg = false;
            const isPlusType = type > 0; // 是否为正数
            if (type && isPlusType && arguments.length === 1) {
                this._retain = (type & 1) > 0;
                this.qos = (type & 6) >> 1; // (_type & 0b110) >> 1
                this._dup = (type & 8) > 0; // (_type & 0b1000) > 0
                this.type = (type >> 4) & 15; // (_type >> 0b100) & 0b1111
                this.syncMsg = (type & 8) === 8; // (_type & 0b1000) === 0b1000;
            }
            else {
                this.type = type;
                this._retain = retain;
                this.qos = qos;
                this._dup = dup;
            }
        }
        encode() {
            // const validQosList = [QOS.AT_MOST_ONCE, QOS.AT_LEAST_ONCE, QOS.EXACTLY_ONCE, QOS.DEFAULT]
            // // 如果 qos 为字符串, 此处转为数字
            // for (let i = 0; i < validQosList.length; i++) {
            //   if (this.qos === validQosList[i]) {
            //     this.qos = validQosList[i]
            //   }
            // }
            let byte = (this.type << 4); // 4 -> 100
            byte |= this._retain ? 1 : 0;
            byte |= this.qos << 1;
            byte |= this._dup ? 8 : 0; // 8 -> 1000
            return byte;
        }
    }
    /**
     * @description
     * 二进制处理
    */
    class BinaryHelper {
        /**
         * @description
         * 将字符串转化为 utf8 编码组成的数组
         * @param {string} str 待转化的字符串
         * @param {boolean} isGetBytes 是否向前插入字符长度
         */
        static writeUTF(str, isGetBytes) {
            const back = [];
            let byteSize = 0;
            if (isString(str)) {
                for (let i = 0, len = str.length; i < len; i++) {
                    const code = str.charCodeAt(i);
                    if (code >= 0 && code <= 127) {
                        byteSize += 1;
                        back.push(code);
                    }
                    else if (code >= 128 && code <= 2047) {
                        byteSize += 2;
                        back.push((192 | (31 & (code >> 6))));
                        back.push((128 | (63 & code)));
                    }
                    else if (code >= 2048 && code <= 65535) {
                        byteSize += 3;
                        back.push((224 | (15 & (code >> 12))));
                        back.push((128 | (63 & (code >> 6))));
                        back.push((128 | (63 & code)));
                    }
                }
            }
            for (let i = 0, len = back.length; i < len; i++) {
                if (back[i] > 255) {
                    back[i] &= 255;
                }
            }
            if (isGetBytes) {
                return back;
            }
            if (byteSize <= 255) {
                return [0, byteSize].concat(back);
            }
            else {
                return [byteSize >> 8, byteSize & 255].concat(back);
            }
        }
        /**
         * @description
         * 获取二进制字节流的 utf8 编码结果
         * @param {Array<number>} arr 二进制数据
         */
        static readUTF(arr) {
            const MAX_SIZE = 0x4000;
            const codeUnits = [];
            let highSurrogate;
            let lowSurrogate;
            let index = -1;
            const strBytes = arr;
            let result = '';
            while (++index < strBytes.length) {
                let codePoint = Number(strBytes[index]);
                if (codePoint === (codePoint & 0x7F)) ;
                else if ((codePoint & 0xF0) === 0xF0) {
                    codePoint ^= 0xF0;
                    codePoint = (codePoint << 6) | (strBytes[++index] ^ 0x80);
                    codePoint = (codePoint << 6) | (strBytes[++index] ^ 0x80);
                    codePoint = (codePoint << 6) | (strBytes[++index] ^ 0x80);
                }
                else if ((codePoint & 0xE0) === 0xE0) {
                    codePoint ^= 0xE0;
                    codePoint = (codePoint << 6) | (strBytes[++index] ^ 0x80);
                    codePoint = (codePoint << 6) | (strBytes[++index] ^ 0x80);
                }
                else if ((codePoint & 0xC0) === 0xC0) {
                    codePoint ^= 0xC0;
                    codePoint = (codePoint << 6) | (strBytes[++index] ^ 0x80);
                }
                if (!isFinite(codePoint) || codePoint < 0 || codePoint > 0x10FFFF || Math.floor(codePoint) !== codePoint) {
                    throw RangeError('Invalid code point: ' + codePoint);
                }
                if (codePoint <= 0xFFFF) {
                    codeUnits.push(codePoint);
                }
                else {
                    codePoint -= 0x10000;
                    highSurrogate = (codePoint >> 10) | 0xD800;
                    lowSurrogate = (codePoint % 0x400) | 0xDC00;
                    codeUnits.push(highSurrogate, lowSurrogate);
                }
                if (index + 1 === strBytes.length || codeUnits.length > MAX_SIZE) {
                    result += String.fromCharCode.apply(null, codeUnits);
                    codeUnits.length = 0;
                }
            }
            return result;
        }
    }
    /**
     * @description
     * 融云读取二进制数据
    */
    class RongStreamReader {
        constructor(arr) {
            // 当前流已截取到的位置
            this._position = 0;
            // 待处理数据的总长度
            this._poolLen = 0;
            this._pool = arr;
            this._poolLen = arr.length;
        }
        check() {
            return this._position >= this._pool.length;
        }
        /**
         * 读 4 位
         */
        readInt() {
            const self = this;
            if (self.check()) {
                return -1;
            }
            let end = '';
            for (let i = 0; i < 4; i++) {
                let t = self._pool[self._position++].toString(16);
                if (t.length === 1) {
                    t = '0' + t;
                }
                end += t.toString();
            }
            return parseInt(end, 16);
        }
        /**
         * 读 8 位
         */
        readLong() {
            const self = this;
            if (self.check()) {
                return -1;
            }
            let end = '';
            for (let i = 0; i < 8; i++) {
                let t = self._pool[self._position++].toString(16);
                if (t.length === 1) {
                    t = '0' + t;
                }
                end += t;
            }
            return parseInt(end, 16);
        }
        /**
         * 读 1 位
         */
        readByte() {
            if (this.check()) {
                return -1;
            }
            let val = this._pool[this._position++];
            if (val > 255) {
                val &= 255;
            }
            return val;
        }
        /**
         * 获取数据
         */
        readUTF() {
            if (this.check()) {
                return '';
            }
            const big = (this.readByte() << 8) | this.readByte();
            const pool = this._pool.subarray(this._position, this._position += big);
            return BinaryHelper.readUTF(pool);
        }
        /**
         * 读剩余的所有值
         */
        readAll() {
            return this._pool.subarray(this._position, this._poolLen);
        }
    }
    /**
     * @description
     * 融云写入二进制数据
    */
    class RongStreamWriter {
        constructor() {
            // 待处理的数据, 由 server 直接抛出的数据
            this._pool = [];
            // 当前流已截取到的位置
            this._position = 0;
            // 当前流写入的多少字节
            this._writen = 0;
        }
        /**
         * 写入缓存区, writen 值往后移
         */
        write(byte) {
            // todo
            if (Object.prototype.toString.call(byte).indexOf('Array') !== -1) {
                this._pool = this._pool.concat(byte);
            }
            else if (byte >= 0) {
                if (byte > 255) {
                    byte &= 255;
                }
                this._pool.push(byte);
                this._writen++;
            }
            return byte;
        }
        writeArr(byte) {
            this._pool = this._pool.concat(byte);
            return byte;
        }
        // PENDING. 用于 ConnectMessage, 暂未知此消息用途
        // writeChat(v: number) {
        //   if (+v != v) {
        //     throw new Error("writeChar:arguments type is error");
        //   }
        //   this.write(v >> 8 & 255);
        //   this.write(v & 255);
        //   this.writen += 2;
        // }
        writeUTF(str) {
            const val = BinaryHelper.writeUTF(str);
            this._pool = this._pool.concat(val);
            this._writen += val.length;
        }
        // PENDING. 暂仅知道 write 时使用, 此时 this.poolLen 为 0, 调用无意义
        // toComplements(): any {
        //   var _tPool = this.pool;
        //   for (var i = 0; i < this.poolLen; i++) {
        //     if (_tPool[i] > 128) {
        //       _tPool[i] -= 256;
        //     }
        //   }
        //   return _tPool;
        // }
        getBytesArray() {
            return this._pool;
        }
    }

    var PBName = {
        UpStreamMessage: 'UpStreamMessage',
        PushExtra: 'PushExtra',
        DownStreamMessage: 'DownStreamMessage',
        DownStreamMessages: 'DownStreamMessages',
        SessionsAttQryInput: 'SessionsAttQryInput',
        SessionsAttOutput: 'SessionsAttOutput',
        SyncRequestMsg: 'SyncRequestMsg',
        ChrmPullMsg: 'ChrmPullMsg',
        NotifyMsg: 'NotifyMsg',
        HistoryMsgInput: 'HistoryMsgInput',
        HistoryMsgOuput: 'HistoryMsgOuput',
        RelationQryInput: 'RelationQryInput',
        RelationsOutput: 'RelationsOutput',
        DeleteSessionsInput: 'DeleteSessionsInput',
        SessionInfo: 'SessionInfo',
        DeleteSessionsOutput: 'DeleteSessionsOutput',
        RelationsInput: 'RelationsInput',
        DeleteMsgInput: 'DeleteMsgInput',
        CleanHisMsgInput: 'CleanHisMsgInput',
        SessionMsgReadInput: 'SessionMsgReadInput',
        ChrmInput: 'ChrmInput',
        ChrmOutput: 'ChrmOutput',
        QueryChatRoomInfoInput: 'QueryChatRoomInfoInput',
        QueryChatRoomInfoOutput: 'QueryChatRoomInfoOutput',
        RtcInput: 'RtcInput',
        RtcUserListOutput: 'RtcUserListOutput',
        SetUserStatusInput: 'SetUserStatusInput',
        RtcSetDataInput: 'RtcSetDataInput',
        RtcUserSetDataInput: 'RtcUserSetDataInput',
        RtcDataInput: 'RtcDataInput',
        RtcSetOutDataInput: 'RtcSetOutDataInput',
        MCFollowInput: 'MCFollowInput',
        RtcTokenOutput: 'RtcTokenOutput',
        RtcQryOutput: 'RtcQryOutput',
        RtcQryUserOutDataInput: 'RtcQryUserOutDataInput',
        RtcUserOutDataOutput: 'RtcUserOutDataOutput',
        RtcQueryListInput: 'RtcQueryListInput',
        RtcRoomInfoOutput: 'RtcRoomInfoOutput',
        RtcValueInfo: 'RtcValueInfo',
        RtcKeyDeleteInput: 'RtcKeyDeleteInput',
        GetQNupTokenInput: 'GetQNupTokenInput',
        GetQNupTokenOutput: 'GetQNupTokenOutput',
        GetQNdownloadUrlInput: 'GetQNdownloadUrlInput',
        GetDownloadUrlInput: 'GetDownloadUrlInput',
        GetQNdownloadUrlOutput: 'GetQNdownloadUrlOutput',
        GetDownloadUrlOutput: 'GetDownloadUrlOutput',
        SetChrmKV: 'SetChrmKV',
        ChrmKVOutput: 'ChrmKVOutput',
        QueryChrmKV: 'QueryChrmKV',
        SetUserSettingInput: 'SetUserSettingInput',
        SetUserSettingOutput: 'SetUserSettingOutput',
        PullUserSettingInput: 'PullUserSettingInput',
        PullUserSettingOutput: 'PullUserSettingOutput',
        UserSettingNotification: 'UserSettingNotification',
        SessionReq: 'SessionReq',
        SessionStates: 'SessionStates',
        SessionState: 'SessionState',
        SessionStateItem: 'SessionStateItem',
        SessionStateModifyReq: 'SessionStateModifyReq',
        SessionStateModifyResp: 'SessionStateModifyResp',
        GrpReadReceiptMsg: 'GrpReadReceiptMsg',
        GrpReadReceiptQryReq: 'GrpReadReceiptQryReq',
        GrpReadReceiptQryResp: 'GrpReadReceiptQryResp',
        GrpMsgReadUser: 'GrpMsgReadUser',
        SessionTagAddInput: 'SessionTagAddInput',
        SessionTagItem: 'SessionTagItem',
        SessionTagDelInput: 'SessionTagDelInput',
        SessionDisTagReq: 'SessionDisTagReq',
        ReportSDKInput: 'ReportSDKInput',
        ReportSDKOutput: 'ReportSDKOutput',
        RtcNotifyMsg: 'RtcNotifyMsg',
        RtcPullKV: 'RtcPullKV',
        RtcKVOutput: 'RtcKVOutput',
        RtcQueryUserJoinedInput: 'RtcQueryUserJoinedInput',
        RtcQueryUserJoinedOutput: 'RtcQueryUserJoinedOutput' // rtc 已加入房间用户信息
    };

    const SSMsg$1 = {
        [PBName.UpStreamMessage]: ['sessionId', 'classname', 'content', 'pushText', 'userId', 'configFlag', 'appData', 'extraContent', 'pushExt'],
        [PBName.DownStreamMessages]: ['list', 'syncTime', 'finished'],
        [PBName.DownStreamMessage]: ['fromUserId', 'type', 'groupId', 'classname', 'content', 'dataTime', 'status', 'msgId', 'extraContent', 'pushContent', 'configFlag', 'pushExt'],
        [PBName.PushExtra]: ['title', 'templateIdNoUse', 'pushId', 'pushConfigs', 'templateId'],
        [PBName.SessionsAttQryInput]: ['nothing'],
        [PBName.SessionsAttOutput]: ['inboxTime', 'sendboxTime', 'totalUnreadCount'],
        [PBName.SyncRequestMsg]: ['syncTime', 'ispolling', 'isweb', 'isPullSend', 'isKeeping', 'sendBoxSyncTime'],
        [PBName.ChrmPullMsg]: ['syncTime', 'count'],
        [PBName.NotifyMsg]: ['type', 'time', 'chrmId'],
        [PBName.HistoryMsgInput]: ['targetId', 'time', 'count', 'order'],
        [PBName.HistoryMsgOuput]: ['list', 'syncTime', 'hasMsg'],
        [PBName.RelationQryInput]: ['type', 'count', 'startTime', 'order'],
        [PBName.RelationsOutput]: ['info'],
        [PBName.DeleteSessionsInput]: ['sessions'],
        [PBName.SessionInfo]: ['type', 'channelId'],
        [PBName.DeleteSessionsOutput]: ['nothing'],
        [PBName.RelationsInput]: ['type', 'msg', 'count', 'offset', 'startTime', 'endTime'],
        [PBName.DeleteMsgInput]: ['type', 'conversationId', 'msgs'],
        [PBName.CleanHisMsgInput]: ['targetId', 'dataTime', 'conversationType'],
        [PBName.SessionMsgReadInput]: ['type', 'msgTime', 'channelId'],
        [PBName.ChrmInput]: ['nothing'],
        [PBName.ChrmOutput]: ['nothing', 'sessionId', 'joinTime'],
        [PBName.QueryChatRoomInfoInput]: ['count', 'order'],
        [PBName.QueryChatRoomInfoOutput]: ['userTotalNums', 'userInfos'],
        [PBName.GetQNupTokenInput]: ['type', 'key', 'httpMethod', 'queryString'],
        [PBName.GetQNdownloadUrlInput]: ['type', 'key', 'fileName'],
        [PBName.GetDownloadUrlInput]: ['type', 'key', 'fileName'],
        [PBName.GetQNupTokenOutput]: ['deadline', 'token', 'bosToken', 'bosDate', 'path', 'osskeyId', 'ossPolicy', 'ossSign', 'ossBucketName'],
        [PBName.GetQNdownloadUrlOutput]: ['downloadUrl'],
        [PBName.GetDownloadUrlOutput]: ['downloadUrl'],
        [PBName.SetChrmKV]: ['entry', 'bNotify', 'notification', 'type'],
        [PBName.ChrmKVOutput]: ['entries', 'bFullUpdate', 'syncTime'],
        [PBName.QueryChrmKV]: ['timestamp'],
        [PBName.SetUserSettingInput]: ['version', 'value'],
        [PBName.SetUserSettingOutput]: ['version', 'reserve'],
        [PBName.PullUserSettingInput]: ['version', 'reserve'],
        [PBName.PullUserSettingOutput]: ['items', 'version'],
        UserSettingItem: ['targetId', 'type', 'key', 'value', 'version', 'status', 'tags'],
        [PBName.SessionReq]: ['time'],
        [PBName.SessionStates]: ['version', 'state'],
        [PBName.SessionState]: ['type', 'channelId', 'time', 'stateItem'],
        [PBName.SessionStateItem]: ['sessionStateType', 'value', 'tags'],
        [PBName.SessionStateModifyReq]: ['version', 'state'],
        [PBName.SessionStateModifyResp]: ['version'],
        [PBName.GrpReadReceiptMsg]: ['msgId', 'busChannel'],
        [PBName.GrpReadReceiptQryReq]: ['msgId', 'busChannel'],
        [PBName.GrpReadReceiptQryResp]: ['totalMemberNum', 'list'],
        [PBName.GrpMsgReadUser]: ['readTime', 'userId'],
        [PBName.SessionTagAddInput]: ['version', 'tags'],
        [PBName.SessionTagItem]: ['tagId', 'name', 'createdTime', 'isTop'],
        [PBName.SessionTagDelInput]: ['version', 'tags'],
        [PBName.SessionDisTagReq]: ['tagId'],
        [PBName.UserSettingNotification]: ['version', 'reserve'],
        [PBName.ReportSDKInput]: ['sdkInfo'],
        [PBName.ReportSDKOutput]: ['nothing'],
        // 以下为 RTC 相关配置
        [PBName.RtcInput]: ['roomType', 'broadcastType', 'extraInnerData', 'needSysChatroom', 'identityChangeType'],
        [PBName.RtcUserListOutput]: ['users', 'token', 'sessionId', 'roomInfo'],
        [PBName.SetUserStatusInput]: ['status'],
        [PBName.RtcSetDataInput]: ['interior', 'target', 'key', 'value', 'objectName', 'content'],
        [PBName.RtcUserSetDataInput]: ['valueInfo', 'objectName', 'content'],
        [PBName.RtcDataInput]: ['interior', 'target', 'key', 'objectName', 'content'],
        [PBName.RtcSetOutDataInput]: ['target', 'valueInfo', 'objectName', 'content'],
        [PBName.MCFollowInput]: ['state'],
        [PBName.RtcTokenOutput]: ['rtcToken'],
        [PBName.RtcQryOutput]: ['outInfo'],
        [PBName.RtcQryUserOutDataInput]: ['userId'],
        [PBName.RtcUserOutDataOutput]: ['user'],
        [PBName.RtcQueryListInput]: ['order'],
        [PBName.RtcRoomInfoOutput]: ['roomId', 'roomData', 'userCount', 'list'],
        [PBName.RtcValueInfo]: ['key', 'value'],
        [PBName.RtcKeyDeleteInput]: ['key'],
        [PBName.RtcNotifyMsg]: ['type', 'time', 'roomId'],
        [PBName.RtcPullKV]: ['timestamp', 'roomId'],
        [PBName.RtcKVOutput]: ['entries', 'bFullUpdate', 'syncTime'],
        [PBName.RtcQueryUserJoinedInput]: ['userId'],
        [PBName.RtcQueryUserJoinedOutput]: ['info']
    };

    const Codec$1 = {};
    for (const key in SSMsg$1) {
        const paramsList = SSMsg$1[key];
        Codec$1[key] = () => {
            const data = {};
            const ins = {
                getArrayData() {
                    return data;
                }
            };
            for (let i = 0; i < paramsList.length; i++) {
                const param = paramsList[i];
                const setEventName = `set${toUpperCase(param, 0, 1)}`;
                ins[setEventName] = (item) => {
                    data[param] = item;
                };
            }
            return ins;
        };
        Codec$1[key].decode = function (data) {
            const decodeResult = {};
            if (isString(data)) {
                data = JSON.parse(data);
            }
            for (const key in data) {
                const getEventName = `get${toUpperCase(key, 0, 1)}`;
                decodeResult[key] = data[key];
                decodeResult[getEventName] = () => {
                    return data[key];
                };
            }
            return decodeResult;
        };
    }
    Codec$1.getModule = (pbName) => {
        return Codec$1[pbName]();
    };

    const SSMsg = `
package Modules;
message probuf {
  message ${PBName.SetUserStatusInput}
  {
    optional int32 status=1;
  }

  message SetUserStatusOutput
  {
    optional int32 nothing=1;
  }

  message GetUserStatusInput
  {
    optional int32 nothing=1;
  }

  message GetUserStatusOutput
  {
    optional string status=1;
    optional string subUserId=2;
  }

  message SubUserStatusInput
  {
    repeated string userid =1;
  }

  message SubUserStatusOutput
  {
    optional int32 nothing=1;
  }
  message VoipDynamicInput
  {
    required int32  engineType = 1;
    required string channelName = 2;
    optional string channelExtra = 3;
  }

  message VoipDynamicOutput
  {
      required string dynamicKey=1;
  }
  message ${PBName.NotifyMsg} {
    required int32 type = 1;
    optional int64 time = 2;
    optional string chrmId=3;
  }
  message ${PBName.SyncRequestMsg} {
    required int64 syncTime = 1;
    required bool ispolling = 2;
    optional bool isweb=3;
    optional bool isPullSend=4;
    optional bool isKeeping=5;
    optional int64 sendBoxSyncTime=6;
  }
  message ${PBName.UpStreamMessage} {
    required int32 sessionId = 1;
    required string classname = 2;
    required bytes content = 3;
    optional string pushText = 4;
    optional string appData = 5;
    repeated string userId = 6;
    optional int64 delMsgTime = 7;
    optional string delMsgId = 8;
    optional int32 configFlag = 9;
    optional int64 clientUniqueId = 10;
    optional string extraContent = 11;
    optional PushExtra pushExt = 12;
  }
  message ${PBName.PushExtra} {
    optional string title = 1;
    optional int32  templateIdNoUse= 2;
    optional string pushId = 3;
    optional string pushConfigs = 4;
    optional string templateId = 5;
  }
  message ${PBName.DownStreamMessages} {
    repeated DownStreamMessage list = 1;
    required int64 syncTime = 2;
    optional bool finished = 3;
  }
  message ${PBName.DownStreamMessage} {
    required string fromUserId = 1;
    required ChannelType type = 2;
    optional string groupId = 3;
    required string classname = 4;
    required bytes content = 5;
    required int64 dataTime = 6;
    required int64 status = 7;
    optional int64 extra = 8;
    optional string msgId = 9;
    optional int32 direction = 10;
    optional int32 plantform =11;
    optional int32 isRemoved = 12;
    optional string source = 13;
    optional int64 clientUniqueId = 14;
    optional string extraContent = 15;
    optional string pushContent = 16;
    optional int32 configFlag = 17;
    optional PushExtra pushExt = 18;
  }
  enum ChannelType {
    PERSON = 1;
    PERSONS = 2;
    GROUP = 3;
    TEMPGROUP = 4;
    CUSTOMERSERVICE = 5;
    NOTIFY = 6;
    MC=7;
    MP=8;
  }
  message CreateDiscussionInput {
    optional string name = 1;
  }
  message CreateDiscussionOutput {
    required string id = 1;
  }
  message ChannelInvitationInput {
    repeated string users = 1;
  }
  message LeaveChannelInput {
    required int32 nothing = 1;
  }
  message ChannelEvictionInput {
    required string user = 1;
  }
  message RenameChannelInput {
    required string name = 1;
  }
  message ChannelInfoInput {
    required int32 nothing = 1;
  }
  message ChannelInfoOutput {
    required ChannelType type = 1;
    required string channelId = 2;
    required string channelName = 3;
    required string adminUserId = 4;
    repeated string firstTenUserIds = 5;
    required int32 openStatus = 6;
  }
  message ChannelInfosInput {
    required int32 page = 1;
    optional int32 number = 2;
  }
  message ChannelInfosOutput {
    repeated ChannelInfoOutput channels = 1;
    required int32 total = 2;
  }
  message MemberInfo {
    required string userId = 1;
    required string userName = 2;
    required string userPortrait = 3;
    required string extension = 4;
  }
  message GroupMembersInput {
    required int32 page = 1;
    optional int32 number = 2;
  }
  message GroupMembersOutput {
    repeated MemberInfo members = 1;
    required int32 total = 2;
  }
  message GetUserInfoInput {
    required int32 nothing = 1;
  }
  message GetUserInfoOutput {
    required string userId = 1;
    required string userName = 2;
    required string userPortrait = 3;
  }
  message GetSessionIdInput {
    required int32 nothing = 1;
  }
  message GetSessionIdOutput {
    required int32 sessionId = 1;
  }
  enum FileType {
    image = ${FileType$1.IMAGE};
    audio = ${FileType$1.AUDIO};
    video = ${FileType$1.VIDEO};
    file = ${FileType$1.FILE};
  }
  message ${PBName.GetQNupTokenInput} {
    required FileType type = 1;
    optional string key = 2;
    optional string httpMethod = 3;
    optional string queryString = 4;
  }
  message ${PBName.GetQNdownloadUrlInput} {
    required FileType type = 1;
    required string key = 2;
    optional string  fileName = 3;
  }
  message ${PBName.GetDownloadUrlInput} {
    required FileType type = 1;
    required string key = 2;
    optional string fileName = 3;
   }
  message ${PBName.GetQNupTokenOutput} {
    required int64 deadline = 1;
    required string token = 2;
    optional string bosToken = 3;
    optional string bosDate = 4;
    optional string path = 5;
    optional string osskeyId = 6;
    optional string ossPolicy = 7;
    optional string ossSign = 8;
    optional string ossBucketName = 9;
    optional string s3Credential = 10;
    optional string s3Algorithm = 11;
    optional string s3Date = 12;
    optional string s3Policy = 13;
    optional string s3Signature = 14;
    optional string s3BucketName = 15;
    optional string stcAuthorization = 16;
    optional string stcContentSha256 = 17;
    optional string stcDate = 18;
    optional string stcBucketName = 19;
  }
  message ${PBName.GetQNdownloadUrlOutput} {
    required string downloadUrl = 1;
  }
  message ${PBName.GetDownloadUrlOutput} {
    required string downloadUrl = 1;
  }
  message Add2BlackListInput {
    required string userId = 1;
  }
  message RemoveFromBlackListInput {
    required string userId = 1;
  }
  message QueryBlackListInput {
    required int32 nothing = 1;
  }
  message QueryBlackListOutput {
    repeated string userIds = 1;
  }
  message BlackListStatusInput {
    required string userId = 1;
  }
  message BlockPushInput {
    required string blockeeId = 1;
  }
  message ModifyPermissionInput {
    required int32 openStatus = 1;
  }
  message GroupInput {
    repeated GroupInfo groupInfo = 1;
  }
  message GroupOutput {
    required int32 nothing = 1;
  }
  message GroupInfo {
    required string id = 1;
    required string name = 2;
  }
  message GroupHashInput {
    required string userId = 1;
    required string groupHashCode = 2;
  }
  message GroupHashOutput {
    required GroupHashType result = 1;
  }
  enum GroupHashType {
    group_success = 0x00;
    group_failure = 0x01;
  }
  message ${PBName.ChrmInput} {
    required int32 nothing = 1;
  }
  message ${PBName.ChrmOutput} {
    required int32 nothing = 1;
    optional string sessionId = 2;
    optional int64 joinTime = 3;
  }
  message ${PBName.ChrmPullMsg} {
    required int64 syncTime = 1;
    required int32 count = 2;
  }

  message ChrmPullMsgNew
  {
    required int32 count = 1;
    required int64 syncTime = 2;
    optional string chrmId=3;
  }
  message ${PBName.RelationQryInput}
  {
    optional ChannelType type = 1;
    optional int32 count = 2;
    optional int64 startTime = 3;
    optional int32 order = 4;
  }
  message ${PBName.RelationsInput}
  {
    required ChannelType type = 1;
    optional DownStreamMessage msg =2;
    optional int32 count = 3;
    optional int32 offset = 4;
    optional int64 startTime = 5;
    optional int64 endTime = 6;
  }
  message ${PBName.RelationsOutput}
  {
    repeated RelationInfo info = 1;
  }
  message RelationInfo
  {
    required ChannelType type = 1;
    required string userId = 2;
    optional DownStreamMessage msg =3;
    optional int64 readMsgTime= 4;
    optional int64 unreadCount= 5;
    optional string channelId = 6;
  }
  message RelationInfoReadTime
  {
    required ChannelType type = 1;
    required int64 readMsgTime= 2;
    required string targetId = 3;
  }
  message ${PBName.CleanHisMsgInput}
  {
      required string targetId = 1;
      required int64 dataTime = 2;
      optional int32 conversationType= 3;
  }
  message HistoryMessageInput
  {
    required string targetId = 1;
    required int64 dataTime =2;
    required int32 size  = 3;
  }

  message HistoryMessagesOuput
  {
    repeated DownStreamMessage list = 1;
    required int64 syncTime = 2;
    required int32 hasMsg = 3;
  }
  message ${PBName.QueryChatRoomInfoInput}
  {
    required int32 count= 1;
    optional int32 order= 2;
  }

  message ${PBName.QueryChatRoomInfoOutput}
  {
    optional int32 userTotalNums = 1;
    repeated ChrmMember userInfos = 2;
  }
  message ChrmMember
  {
    required int64 time = 1;
    required string id = 2;
  }
  message MPFollowInput
  {
    required string id = 1;
  }

  message MPFollowOutput
  {
    required int32 nothing = 1;
    optional MpInfo info =2;
  }

  message ${PBName.MCFollowInput}
  {
    required string state = 1;
  }

  message MCFollowOutput
  {
    required int32 nothing = 1;
    optional MpInfo info =2;
  }

  message MpInfo
  {
    required string mpid=1;
    required string name = 2;
    required string type = 3;
    required int64 time=4;
    optional string portraitUrl=5;
    optional string extra =6;
  }

  message SearchMpInput
  {
    required int32 type=1;
    required string id=2;
  }

  message SearchMpOutput
  {
    required int32 nothing=1;
    repeated MpInfo info = 2;
  }

  message PullMpInput
  {
    required int64 time=1;
    required string mpid=2;
  }

  message PullMpOutput
  {
    required int32 status=1;
    repeated MpInfo info = 2;
  }
  message ${PBName.HistoryMsgInput}
  {
    optional string targetId = 1;
    optional int64 time = 2;
    optional int32 count  = 3;
    optional int32 order = 4;
  }

  message ${PBName.HistoryMsgOuput}
  {
    repeated DownStreamMessage list=1;
    required int64 syncTime=2;
    required int32 hasMsg=3;
  }
  message ${PBName.RtcQueryListInput}{
    optional int32 order=1;
  }

  message ${PBName.RtcKeyDeleteInput}{
    repeated string key=1;
  }

  message ${PBName.RtcValueInfo}{
    required string key=1;
    required string value=2;
  }

  message RtcUserInfo{
    required string userId=1;
    repeated ${PBName.RtcValueInfo} userData=2; //用户资源信息
  }

  message ${PBName.RtcUserListOutput}{
    repeated RtcUserInfo users=1;
    optional string token=2;
    optional string sessionId=3;
    repeated RtcValueInfo roomInfo = 4; //房间key value
  }
  message RtcRoomInfoOutput{
    optional string roomId = 1;
    repeated ${PBName.RtcValueInfo} roomData = 2;
    optional int32 userCount = 3;
    repeated RtcUserInfo list=4;
  }
  message ${PBName.RtcInput}{
    required int32 roomType=1;
    optional int32 broadcastType=2;
    optional RtcValueInfo extraInnerData = 3;
    optional bool needSysChatroom = 4; //是否需要同步聊天室
    optional IdentityChangeType identityChangeType = 5; //身份变更类型
    optional JoinType joinType = 6; // 加入房间类型
  }
  enum JoinType {
    KICK = 0; //踢前一个设备
    REFUSE = 1; //当前加入拒绝
    COEXIST = 2; //两个设备共存
  }
  message RtcQryInput{
    required bool isInterior=1;
    required targetType target=2;
    repeated string key=3;
  }
  message ${PBName.RtcQryOutput}{
    repeated ${PBName.RtcValueInfo} outInfo=1;
  }
  message RtcDelDataInput{
    repeated string key=1;
    required bool isInterior=2;
    required targetType target=3;
  }
  message ${PBName.RtcDataInput}{
    required bool interior=1;
    required targetType target=2;
    repeated string key=3;
    optional string objectName=4;
    optional string content=5;
  }
  message ${PBName.RtcSetDataInput}{
    required bool interior=1;
    required targetType target=2;
    required string key=3;
    required string value=4;
    optional string objectName=5;
    optional string content=6;
  }
  message ${PBName.RtcUserSetDataInput} {
    repeated ${PBName.RtcValueInfo} valueInfo = 1;
    required string objectName = 2;
    repeated ${PBName.RtcValueInfo} content = 3;
  }
  message RtcOutput
  {
    optional int32 nothing=1;
  }
  message ${PBName.RtcTokenOutput}{
    required string rtcToken=1;
  }
  enum targetType {
    ROOM =1 ;
    PERSON = 2;
  }
  message ${PBName.RtcSetOutDataInput}{
    required targetType target=1;
    repeated ${PBName.RtcValueInfo} valueInfo=2;
    optional string objectName=3;
    optional string content=4;
  }
  message ${PBName.RtcQryUserOutDataInput}{
    repeated string userId = 1;
  }
  message ${PBName.RtcUserOutDataOutput}{
    repeated RtcUserInfo user = 1;
  }
  message ${PBName.SessionsAttQryInput}{
    required int32 nothing = 1;
  }
  message ${PBName.SessionsAttOutput}{
    required int64 inboxTime = 1;
    required int64 sendboxTime = 2;
    required int64 totalUnreadCount = 3;
  }
  message ${PBName.SessionMsgReadInput}
  {
    required ChannelType type = 1;
    required int64 msgTime = 2;
    required string channelId = 3;
  }
  message SessionMsgReadOutput
  {
    optional int32 nothing=1;
  }
  message ${PBName.DeleteSessionsInput}
  {
    repeated SessionInfo sessions = 1;
  }
  message ${PBName.SessionInfo}
  {
    required ChannelType type = 1;
    required string channelId = 2;
  }
  message ${PBName.DeleteSessionsOutput}
  {
    optional int32 nothing=1;
  }
  message ${PBName.DeleteMsgInput}
  {
    optional ChannelType type = 1;
    optional string conversationId = 2;
    repeated DeleteMsg msgs = 3;
  }
  message DeleteMsg
  {
    optional string msgId = 1;
    optional int64 msgDataTime = 2;
    optional int32 direct = 3;
  }
  message ChrmKVEntity {
    required string key = 1;
    required string value = 2;
    optional int32 status = 3;
    optional int64 timestamp = 4;
    optional string uid = 5;
  }
  message ${PBName.SetChrmKV} {
    required ChrmKVEntity entry = 1;
    optional bool bNotify = 2;
    optional UpStreamMessage notification = 3;
    optional ChannelType type = 4;
  }
  message ${PBName.ChrmKVOutput} {
    repeated ChrmKVEntity entries = 1;
    optional bool bFullUpdate = 2;
    optional int64 syncTime = 3;
  }
  message ${PBName.QueryChrmKV} {
    required int64 timestamp = 1;
  }
  message ${PBName.SetUserSettingInput} {
    required int64 version=1;
    required string value=2;
  }
  message ${PBName.SetUserSettingOutput} {
    required int64 version=1;
    required bool reserve=2;
  }
  message ${PBName.PullUserSettingInput} {
    required int64 version=1;
    optional bool reserve=2;
  }
  message ${PBName.PullUserSettingOutput} {
    repeated UserSettingItem items = 1;
    required int64 version=2;
  }
  message UserSettingItem {
    required string targetId= 1;
    required ChannelType type = 2;
    required string key = 4;
    required bytes value = 5;
    required int64 version=6;
    required int32 status=7;
    repeated SessionTagItem tags= 8;
  }
  message ${PBName.SessionReq} {
    required int64 time = 1;
  }
  message ${PBName.SessionStates} {
    required int64 version=1;
    repeated SessionState state= 2;
  }
  message ${PBName.SessionState} {
    required ChannelType type = 1;
    required string channelId = 2;
    optional int64 time = 3;
    repeated SessionStateItem stateItem = 4;
  }
  message ${PBName.SessionStateItem} {
    required SessionStateType sessionStateType = 1;
    required string value = 2;
    repeated SessionTagItem tags = 3;
  }
  enum SessionStateType {
    IsSilent = 1;
    IsTop = 2;
    Tags = 3;
  }
  message ${PBName.SessionStateModifyReq} {
    required int64 version=1;
    repeated SessionState state= 2;
  }
  message ${PBName.SessionStateModifyResp} {
    required int64 version=1;
  }
  message ${PBName.GrpReadReceiptMsg} {
    repeated string msgId=1; //已读消息ID
    optional string busChannel = 2; // 该消息所属会话的业务标识
  }
  message ${PBName.GrpReadReceiptQryReq} {
    repeated string msgId=1; //已读消息ID
    optional string busChannel = 2; // 该消息所属会话的业务标识
  }
  message ${PBName.GrpReadReceiptQryResp} {
    required int32 totalMemberNum = 1;//群内总人数
    repeated GrpMsgReadUser list = 2;//已读用户列表（list复类型）
  }
  message ${PBName.GrpMsgReadUser} {
    required int64 readTime = 1;//已读时间
    required string userId = 2;//已读用户id
  }
  message ${PBName.SessionTagAddInput} {
    required int64 version=1;
    repeated SessionTagItem tags=2;
  }
  message ${PBName.SessionTagItem} {
    required string tagId=1;
    optional string name=2;
    optional int64 createdTime=3;
    optional bool isTop=4;
  }
  message ${PBName.SessionTagDelInput} {
    required int64 version=1;
    repeated SessionTagItem tags=2;
  }
  message ${PBName.SessionDisTagReq} {
    repeated string tagId=1;
  }
  message ${PBName.UserSettingNotification} {
    required int64 version=1;
    required bool reserve=2;
  }
  message ${PBName.ReportSDKInput} {
    required string sdkInfo=1; // 用户集成的 sdk 信息,json 格式 {"web-rtc": "4.0.3.7"}
  }
  message ${PBName.ReportSDKOutput}
  {
    optional int32 nothing=1; //占位
  }
  message ${PBName.RtcNotifyMsg} 
  {
    required int32 type= 1;   //(通知类型 1:rtc房间状态KV变更通知)
    optional int64 time= 2;   //消息产生时间
    optional string roomId=3; //主播房间id
  }
  message ${PBName.RtcPullKV}
  {
    required int64 timestamp = 1;
    required string roomId = 2;
  }
  message ${PBName.RtcKVOutput}
  {
    repeated RtcKVEntity entries = 1;
    optional bool bFullUpdate = 2;
    optional int64 syncTime = 3; 
  }
  message RtcKVEntity 
  {
    required string key = 1;
    required string value = 2;
    optional int32 status = 3;
    optional int64 timestamp = 4;
    optional string uid = 5;
  }
  enum IdentityChangeType 
  {
    AnchorToViewer = 1; //1为主播变观众
    ViewerToAnchor = 2; //2为观众变主播
  }
  message ${PBName.RtcQueryUserJoinedInput}
  {
    required string userId = 1;
  }
  message ${PBName.RtcQueryUserJoinedOutput}
  {
    repeated RtcJoinedInfo info = 1;
  }
  message RtcJoinedInfo
  {
    required string deviceId = 1; //设备ID
    required string roomId = 2;   //加入的房间ID
    optional int64 joinTime = 3;  //加入的时间
  }
}
`;

    function protobuf (a) {
     var c = (function () { function a (a, b, c) { this.low = 0 | a, this.high = 0 | b, this.unsigned = !!c; } function b (a) { return (a && a.__isLong__) === !0 } function e (a, b) { var e, f, h; return b ? (a >>>= 0, (h = a >= 0 && a < 256) && (f = d[a]) ? f : (e = g(a, (0 | a) < 0 ? -1 : 0, !0), h && (d[a] = e), e)) : (a |= 0, (h = a >= -128 && a < 128) && (f = c[a]) ? f : (e = g(a, a < 0 ? -1 : 0, !1), h && (c[a] = e), e)) } function f (a, b) { if (isNaN(a) || !isFinite(a)) return b ? r : q; if (b) { if (a < 0) return r; if (a >= n) return w } else { if (-o >= a) return x; if (a + 1 >= o) return v } return a < 0 ? f(-a, b).neg() : g(0 | a % m, 0 | a / m, b) } function g (b, c, d) { return new a(b, c, d) } function i (a, b, c) { var d, e, g, j, k, l, m; if (a.length === 0) throw Error('empty string'); if (a === 'NaN' || a === 'Infinity' || a === '+Infinity' || a === '-Infinity') return q; if (typeof b === 'number' ? (c = b, b = !1) : b = !!b, c = c || 10, c < 2 || c > 36) throw RangeError('radix'); if ((d = a.indexOf('-')) > 0) throw Error('interior hyphen'); if (d === 0) return i(a.substring(1), b, c).neg(); for (e = f(h(c, 8)), g = q, j = 0; j < a.length; j += 8)k = Math.min(8, a.length - j), l = parseInt(a.substring(j, j + k), c), k < 8 ? (m = f(h(c, k)), g = g.mul(m).add(f(l))) : (g = g.mul(e), g = g.add(f(l))); return g.unsigned = b, g } function j (b) { return b instanceof a ? b : typeof b === 'number' ? f(b) : typeof b === 'string' ? i(b) : g(b.low, b.high, b.unsigned) } var c, d, h, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y; return a.prototype.__isLong__, Object.defineProperty(a.prototype, '__isLong__', { value: !0, enumerable: !1, configurable: !1 }), a.isLong = b, c = {}, d = {}, a.fromInt = e, a.fromNumber = f, a.fromBits = g, h = Math.pow, a.fromString = i, a.fromValue = j, k = 65536, l = 1 << 24, m = k * k, n = m * m, o = n / 2, p = e(l), q = e(0), a.ZERO = q, r = e(0, !0), a.UZERO = r, s = e(1), a.ONE = s, t = e(1, !0), a.UONE = t, u = e(-1), a.NEG_ONE = u, v = g(-1, 2147483647, !1), a.MAX_VALUE = v, w = g(-1, -1, !0), a.MAX_UNSIGNED_VALUE = w, x = g(0, -2147483648, !1), a.MIN_VALUE = x, y = a.prototype, y.toInt = function () { return this.unsigned ? this.low >>> 0 : this.low }, y.toNumber = function () { return this.unsigned ? (this.high >>> 0) * m + (this.low >>> 0) : this.high * m + (this.low >>> 0) }, y.toString = function (a) { var b, c, d, e, g, i, j, k, l; if (a = a || 10, a < 2 || a > 36) throw RangeError('radix'); if (this.isZero()) return '0'; if (this.isNegative()) return this.eq(x) ? (b = f(a), c = this.div(b), d = c.mul(b).sub(this), c.toString(a) + d.toInt().toString(a)) : '-' + this.neg().toString(a); for (e = f(h(a, 6), this.unsigned), g = this, i = ''; ;) { if (j = g.div(e), k = g.sub(j.mul(e)).toInt() >>> 0, l = k.toString(a), g = j, g.isZero()) return l + i; for (;l.length < 6;)l = '0' + l; i = '' + l + i; } }, y.getHighBits = function () { return this.high }, y.getHighBitsUnsigned = function () { return this.high >>> 0 }, y.getLowBits = function () { return this.low }, y.getLowBitsUnsigned = function () { return this.low >>> 0 }, y.getNumBitsAbs = function () { var a, b; if (this.isNegative()) return this.eq(x) ? 64 : this.neg().getNumBitsAbs(); for (a = this.high != 0 ? this.high : this.low, b = 31; b > 0 && (a & 1 << b) == 0; b--);return this.high != 0 ? b + 33 : b + 1 }, y.isZero = function () { return this.high === 0 && this.low === 0 }, y.isNegative = function () { return !this.unsigned && this.high < 0 }, y.isPositive = function () { return this.unsigned || this.high >= 0 }, y.isOdd = function () { return (1 & this.low) === 1 }, y.isEven = function () { return (1 & this.low) === 0 }, y.equals = function (a) { return b(a) || (a = j(a)), this.unsigned !== a.unsigned && this.high >>> 31 === 1 && a.high >>> 31 === 1 ? !1 : this.high === a.high && this.low === a.low }, y.eq = y.equals, y.notEquals = function (a) { return !this.eq(a) }, y.neq = y.notEquals, y.lessThan = function (a) { return this.comp(a) < 0 }, y.lt = y.lessThan, y.lessThanOrEqual = function (a) { return this.comp(a) <= 0 }, y.lte = y.lessThanOrEqual, y.greaterThan = function (a) { return this.comp(a) > 0 }, y.gt = y.greaterThan, y.greaterThanOrEqual = function (a) { return this.comp(a) >= 0 }, y.gte = y.greaterThanOrEqual, y.compare = function (a) { if (b(a) || (a = j(a)), this.eq(a)) return 0; var c = this.isNegative(); var d = a.isNegative(); return c && !d ? -1 : !c && d ? 1 : this.unsigned ? a.high >>> 0 > this.high >>> 0 || a.high === this.high && a.low >>> 0 > this.low >>> 0 ? -1 : 1 : this.sub(a).isNegative() ? -1 : 1 }, y.comp = y.compare, y.negate = function () { return !this.unsigned && this.eq(x) ? x : this.not().add(s) }, y.neg = y.negate, y.add = function (a) { var c, d, e, f, h, i, k, l, m, n, o, p; return b(a) || (a = j(a)), c = this.high >>> 16, d = 65535 & this.high, e = this.low >>> 16, f = 65535 & this.low, h = a.high >>> 16, i = 65535 & a.high, k = a.low >>> 16, l = 65535 & a.low, m = 0, n = 0, o = 0, p = 0, p += f + l, o += p >>> 16, p &= 65535, o += e + k, n += o >>> 16, o &= 65535, n += d + i, m += n >>> 16, n &= 65535, m += c + h, m &= 65535, g(o << 16 | p, m << 16 | n, this.unsigned) }, y.subtract = function (a) { return b(a) || (a = j(a)), this.add(a.neg()) }, y.sub = y.subtract, y.multiply = function (a) { var c, d, e, h, i, k, l, m, n, o, r, s; return this.isZero() ? q : (b(a) || (a = j(a)), a.isZero() ? q : this.eq(x) ? a.isOdd() ? x : q : a.eq(x) ? this.isOdd() ? x : q : this.isNegative() ? a.isNegative() ? this.neg().mul(a.neg()) : this.neg().mul(a).neg() : a.isNegative() ? this.mul(a.neg()).neg() : this.lt(p) && a.lt(p) ? f(this.toNumber() * a.toNumber(), this.unsigned) : (c = this.high >>> 16, d = 65535 & this.high, e = this.low >>> 16, h = 65535 & this.low, i = a.high >>> 16, k = 65535 & a.high, l = a.low >>> 16, m = 65535 & a.low, n = 0, o = 0, r = 0, s = 0, s += h * m, r += s >>> 16, s &= 65535, r += e * m, o += r >>> 16, r &= 65535, r += h * l, o += r >>> 16, r &= 65535, o += d * m, n += o >>> 16, o &= 65535, o += e * l, n += o >>> 16, o &= 65535, o += h * k, n += o >>> 16, o &= 65535, n += c * m + d * l + e * k + h * i, n &= 65535, g(r << 16 | s, n << 16 | o, this.unsigned))) }, y.mul = y.multiply, y.divide = function (a) { var c, d, e, g, i, k, l, m; if (b(a) || (a = j(a)), a.isZero()) throw Error('division by zero'); if (this.isZero()) return this.unsigned ? r : q; if (this.unsigned) { if (a.unsigned || (a = a.toUnsigned()), a.gt(this)) return r; if (a.gt(this.shru(1))) return t; e = r; } else { if (this.eq(x)) return a.eq(s) || a.eq(u) ? x : a.eq(x) ? s : (g = this.shr(1), c = g.div(a).shl(1), c.eq(q) ? a.isNegative() ? s : u : (d = this.sub(a.mul(c)), e = c.add(d.div(a)))); if (a.eq(x)) return this.unsigned ? r : q; if (this.isNegative()) return a.isNegative() ? this.neg().div(a.neg()) : this.neg().div(a).neg(); if (a.isNegative()) return this.div(a.neg()).neg(); e = q; } for (d = this; d.gte(a);) { for (c = Math.max(1, Math.floor(d.toNumber() / a.toNumber())), i = Math.ceil(Math.log(c) / Math.LN2), k = i <= 48 ? 1 : h(2, i - 48), l = f(c), m = l.mul(a); m.isNegative() || m.gt(d);)c -= k, l = f(c, this.unsigned), m = l.mul(a); l.isZero() && (l = s), e = e.add(l), d = d.sub(m); } return e }, y.div = y.divide, y.modulo = function (a) { return b(a) || (a = j(a)), this.sub(this.div(a).mul(a)) }, y.mod = y.modulo, y.not = function () { return g(~this.low, ~this.high, this.unsigned) }, y.and = function (a) { return b(a) || (a = j(a)), g(this.low & a.low, this.high & a.high, this.unsigned) }, y.or = function (a) { return b(a) || (a = j(a)), g(this.low | a.low, this.high | a.high, this.unsigned) }, y.xor = function (a) { return b(a) || (a = j(a)), g(this.low ^ a.low, this.high ^ a.high, this.unsigned) }, y.shiftLeft = function (a) { return b(a) && (a = a.toInt()), (a &= 63) === 0 ? this : a < 32 ? g(this.low << a, this.high << a | this.low >>> 32 - a, this.unsigned) : g(0, this.low << a - 32, this.unsigned) }, y.shl = y.shiftLeft, y.shiftRight = function (a) { return b(a) && (a = a.toInt()), (a &= 63) === 0 ? this : a < 32 ? g(this.low >>> a | this.high << 32 - a, this.high >> a, this.unsigned) : g(this.high >> a - 32, this.high >= 0 ? 0 : -1, this.unsigned) }, y.shr = y.shiftRight, y.shiftRightUnsigned = function (a) { var c, d; return b(a) && (a = a.toInt()), a &= 63, a === 0 ? this : (c = this.high, a < 32 ? (d = this.low, g(d >>> a | c << 32 - a, c >>> a, this.unsigned)) : a === 32 ? g(c, 0, this.unsigned) : g(c >>> a - 32, 0, this.unsigned)) }, y.shru = y.shiftRightUnsigned, y.toSigned = function () { return this.unsigned ? g(this.low, this.high, !1) : this }, y.toUnsigned = function () { return this.unsigned ? this : g(this.low, this.high, !0) }, y.toBytes = function (a) { return a ? this.toBytesLE() : this.toBytesBE() }, y.toBytesLE = function () { var a = this.high; var b = this.low; return [255 & b, 255 & b >>> 8, 255 & b >>> 16, 255 & b >>> 24, 255 & a, 255 & a >>> 8, 255 & a >>> 16, 255 & a >>> 24] }, y.toBytesBE = function () { var a = this.high; var b = this.low; return [255 & a >>> 24, 255 & a >>> 16, 255 & a >>> 8, 255 & a, 255 & b >>> 24, 255 & b >>> 16, 255 & b >>> 8, 255 & b] }, a }()); var d = (function (a) {
        function f (a) { var b = 0; return function () { return b < a.length ? a.charCodeAt(b++) : null } } function g () { var a = []; var b = []; return function () { return arguments.length === 0 ? b.join('') + e.apply(String, a) : (a.length + arguments.length > 1024 && (b.push(e.apply(String, a)), a.length = 0), Array.prototype.push.apply(a, arguments), void 0) } } function h (a, b, c, d, e) { var f; var g; var h = 8 * e - d - 1; var i = (1 << h) - 1; var j = i >> 1; var k = -7; var l = c ? e - 1 : 0; var m = c ? -1 : 1; var n = a[b + l]; for (l += m, f = n & (1 << -k) - 1, n >>= -k, k += h; k > 0; f = 256 * f + a[b + l], l += m, k -= 8);for (g = f & (1 << -k) - 1, f >>= -k, k += d; k > 0; g = 256 * g + a[b + l], l += m, k -= 8);if (f === 0)f = 1 - j; else { if (f === i) return g ? 0 / 0 : 1 / 0 * (n ? -1 : 1); g += Math.pow(2, d), f -= j; } return (n ? -1 : 1) * g * Math.pow(2, f - d) } function i (a, b, c, d, e, f) { var g; var h; var i; var j = 8 * f - e - 1; var k = (1 << j) - 1; var l = k >> 1; var m = e === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0; var n = d ? 0 : f - 1; var o = d ? 1 : -1; var p = b < 0 || b === 0 && 1 / b < 0 ? 1 : 0; for (b = Math.abs(b), isNaN(b) || 1 / 0 === b ? (h = isNaN(b) ? 1 : 0, g = k) : (g = Math.floor(Math.log(b) / Math.LN2), b * (i = Math.pow(2, -g)) < 1 && (g--, i *= 2), b += g + l >= 1 ? m / i : m * Math.pow(2, 1 - l), b * i >= 2 && (g++, i /= 2), g + l >= k ? (h = 0, g = k) : g + l >= 1 ? (h = (b * i - 1) * Math.pow(2, e), g += l) : (h = b * Math.pow(2, l - 1) * Math.pow(2, e), g = 0)); e >= 8; a[c + n] = 255 & h, n += o, h /= 256, e -= 8);for (g = g << e | h, j += e; j > 0; a[c + n] = 255 & g, n += o, g /= 256, j -= 8);a[c + n - o] |= 128 * p; } var c; var d; var e; var j; var k; var b = function (a, c, e) { if (typeof a === 'undefined' && (a = b.DEFAULT_CAPACITY), typeof c === 'undefined' && (c = b.DEFAULT_ENDIAN), typeof e === 'undefined' && (e = b.DEFAULT_NOASSERT), !e) { if (a = 0 | a, a < 0) throw RangeError('Illegal capacity'); c = !!c, e = !!e; } this.buffer = a === 0 ? d : new ArrayBuffer(a), this.view = a === 0 ? null : new Uint8Array(this.buffer), this.offset = 0, this.markedOffset = -1, this.limit = a, this.littleEndian = c, this.noAssert = e; }; return b.VERSION = '5.0.1', b.LITTLE_ENDIAN = !0, b.BIG_ENDIAN = !1, b.DEFAULT_CAPACITY = 16, b.DEFAULT_ENDIAN = b.BIG_ENDIAN, b.DEFAULT_NOASSERT = !1, b.Long = a || null, c = b.prototype, c.__isByteBuffer__, Object.defineProperty(c, '__isByteBuffer__', { value: !0, enumerable: !1, configurable: !1 }), d = new ArrayBuffer(0), e = String.fromCharCode, b.accessor = function () { return Uint8Array }, b.allocate = function (a, c, d) { return new b(a, c, d) }, b.concat = function (a, c, d, e) { var f, i, g, h, k, j; for ((typeof c === 'boolean' || typeof c !== 'string') && (e = d, d = c, c = void 0), f = 0, g = 0, h = a.length; h > g; ++g)b.isByteBuffer(a[g]) || (a[g] = b.wrap(a[g], c)), i = a[g].limit - a[g].offset, i > 0 && (f += i); if (f === 0) return new b(0, d, e); for (j = new b(f, d, e), g = 0; h > g;)k = a[g++], i = k.limit - k.offset, i <= 0 || (j.view.set(k.view.subarray(k.offset, k.limit), j.offset), j.offset += i); return j.limit = j.offset, j.offset = 0, j }, b.isByteBuffer = function (a) { return (a && a.__isByteBuffer__) === !0 }, b.type = function () { return ArrayBuffer }, b.wrap = function (a, d, e, f) { var g, h; if (typeof d !== 'string' && (f = e, e = d, d = void 0), typeof a === 'string') switch (typeof d === 'undefined' && (d = 'utf8'), d) { case 'base64':return b.fromBase64(a, e); case 'hex':return b.fromHex(a, e); case 'binary':return b.fromBinary(a, e); case 'utf8':return b.fromUTF8(a, e); case 'debug':return b.fromDebug(a, e); default:throw Error('Unsupported encoding: ' + d) } if (a === null || typeof a !== 'object') throw TypeError('Illegal buffer'); if (b.isByteBuffer(a)) return g = c.clone.call(a), g.markedOffset = -1, g; if (a instanceof Uint8Array)g = new b(0, e, f), a.length > 0 && (g.buffer = a.buffer, g.offset = a.byteOffset, g.limit = a.byteOffset + a.byteLength, g.view = new Uint8Array(a.buffer)); else if (a instanceof ArrayBuffer)g = new b(0, e, f), a.byteLength > 0 && (g.buffer = a, g.offset = 0, g.limit = a.byteLength, g.view = a.byteLength > 0 ? new Uint8Array(a) : null); else { if (Object.prototype.toString.call(a) !== '[object Array]') throw TypeError('Illegal buffer'); for (g = new b(a.length, e, f), g.limit = a.length, h = 0; h < a.length; ++h)g.view[h] = a[h]; } return g }, c.writeBitSet = function (a, b) { var h; var d; var e; var f; var g; var i; var c = typeof b === 'undefined'; if (c && (b = this.offset), !this.noAssert) { if (!(a instanceof Array)) throw TypeError('Illegal BitSet: Not an array'); if (typeof b !== 'number' || b % 1 !== 0) throw TypeError('Illegal offset: ' + b + ' (not an integer)'); if (b >>>= 0, b < 0 || b + 0 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + b + ' (+' + 0 + ') <= ' + this.buffer.byteLength) } for (d = b, e = a.length, f = e >> 3, g = 0, b += this.writeVarint32(e, b); f--;)h = 1 & !!a[g++] | (1 & !!a[g++]) << 1 | (1 & !!a[g++]) << 2 | (1 & !!a[g++]) << 3 | (1 & !!a[g++]) << 4 | (1 & !!a[g++]) << 5 | (1 & !!a[g++]) << 6 | (1 & !!a[g++]) << 7, this.writeByte(h, b++); if (e > g) { for (i = 0, h = 0; e > g;)h |= (1 & !!a[g++]) << i++; this.writeByte(h, b++); } return c ? (this.offset = b, this) : b - d }, c.readBitSet = function (a) { var h; var c; var d; var e; var f; var g; var i; var b = typeof a === 'undefined'; for (b && (a = this.offset), c = this.readVarint32(a), d = c.value, e = d >> 3, f = 0, g = [], a += c.length; e--;)h = this.readByte(a++), g[f++] = !!(1 & h), g[f++] = !!(2 & h), g[f++] = !!(4 & h), g[f++] = !!(8 & h), g[f++] = !!(16 & h), g[f++] = !!(32 & h), g[f++] = !!(64 & h), g[f++] = !!(128 & h); if (d > f) for (i = 0, h = this.readByte(a++); d > f;)g[f++] = !!(1 & h >> i++); return b && (this.offset = a), g }, c.readBytes = function (a, b) { var d; var c = typeof b === 'undefined'; if (c && (b = this.offset), !this.noAssert) { if (typeof b !== 'number' || b % 1 !== 0) throw TypeError('Illegal offset: ' + b + ' (not an integer)'); if (b >>>= 0, b < 0 || b + a > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + b + ' (+' + a + ') <= ' + this.buffer.byteLength) } return d = this.slice(b, b + a), c && (this.offset += a), d }, c.writeBytes = c.append, c.writeInt8 = function (a, b) { var d; var c = typeof b === 'undefined'; if (c && (b = this.offset), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal value: ' + a + ' (not an integer)'); if (a |= 0, typeof b !== 'number' || b % 1 !== 0) throw TypeError('Illegal offset: ' + b + ' (not an integer)'); if (b >>>= 0, b < 0 || b + 0 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + b + ' (+' + 0 + ') <= ' + this.buffer.byteLength) } return b += 1, d = this.buffer.byteLength, b > d && this.resize((d *= 2) > b ? d : b), b -= 1, this.view[b] = a, c && (this.offset += 1), this }, c.writeByte = c.writeInt8, c.readInt8 = function (a) { var c; var b = typeof a === 'undefined'; if (b && (a = this.offset), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal offset: ' + a + ' (not an integer)'); if (a >>>= 0, a < 0 || a + 1 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + a + ' (+' + 1 + ') <= ' + this.buffer.byteLength) } return c = this.view[a], (128 & c) === 128 && (c = -(255 - c + 1)), b && (this.offset += 1), c }, c.readByte = c.readInt8, c.writeUint8 = function (a, b) { var d; var c = typeof b === 'undefined'; if (c && (b = this.offset), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal value: ' + a + ' (not an integer)'); if (a >>>= 0, typeof b !== 'number' || b % 1 !== 0) throw TypeError('Illegal offset: ' + b + ' (not an integer)'); if (b >>>= 0, b < 0 || b + 0 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + b + ' (+' + 0 + ') <= ' + this.buffer.byteLength) } return b += 1, d = this.buffer.byteLength, b > d && this.resize((d *= 2) > b ? d : b), b -= 1, this.view[b] = a, c && (this.offset += 1), this }, c.writeUInt8 = c.writeUint8, c.readUint8 = function (a) { var c; var b = typeof a === 'undefined'; if (b && (a = this.offset), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal offset: ' + a + ' (not an integer)'); if (a >>>= 0, a < 0 || a + 1 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + a + ' (+' + 1 + ') <= ' + this.buffer.byteLength) } return c = this.view[a], b && (this.offset += 1), c }, c.readUInt8 = c.readUint8, c.writeInt16 = function (a, b) { var d; var c = typeof b === 'undefined'; if (c && (b = this.offset), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal value: ' + a + ' (not an integer)'); if (a |= 0, typeof b !== 'number' || b % 1 !== 0) throw TypeError('Illegal offset: ' + b + ' (not an integer)'); if (b >>>= 0, b < 0 || b + 0 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + b + ' (+' + 0 + ') <= ' + this.buffer.byteLength) } return b += 2, d = this.buffer.byteLength, b > d && this.resize((d *= 2) > b ? d : b), b -= 2, this.littleEndian ? (this.view[b + 1] = (65280 & a) >>> 8, this.view[b] = 255 & a) : (this.view[b] = (65280 & a) >>> 8, this.view[b + 1] = 255 & a), c && (this.offset += 2), this }, c.writeShort = c.writeInt16, c.readInt16 = function (a) { var c; var b = typeof a === 'undefined'; if (b && (a = this.offset), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal offset: ' + a + ' (not an integer)'); if (a >>>= 0, a < 0 || a + 2 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + a + ' (+' + 2 + ') <= ' + this.buffer.byteLength) } return c = 0, this.littleEndian ? (c = this.view[a], c |= this.view[a + 1] << 8) : (c = this.view[a] << 8, c |= this.view[a + 1]), (32768 & c) === 32768 && (c = -(65535 - c + 1)), b && (this.offset += 2), c }, c.readShort = c.readInt16, c.writeUint16 = function (a, b) { var d; var c = typeof b === 'undefined'; if (c && (b = this.offset), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal value: ' + a + ' (not an integer)'); if (a >>>= 0, typeof b !== 'number' || b % 1 !== 0) throw TypeError('Illegal offset: ' + b + ' (not an integer)'); if (b >>>= 0, b < 0 || b + 0 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + b + ' (+' + 0 + ') <= ' + this.buffer.byteLength) } return b += 2, d = this.buffer.byteLength, b > d && this.resize((d *= 2) > b ? d : b), b -= 2, this.littleEndian ? (this.view[b + 1] = (65280 & a) >>> 8, this.view[b] = 255 & a) : (this.view[b] = (65280 & a) >>> 8, this.view[b + 1] = 255 & a), c && (this.offset += 2), this }, c.writeUInt16 = c.writeUint16, c.readUint16 = function (a) { var c; var b = typeof a === 'undefined'; if (b && (a = this.offset), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal offset: ' + a + ' (not an integer)'); if (a >>>= 0, a < 0 || a + 2 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + a + ' (+' + 2 + ') <= ' + this.buffer.byteLength) } return c = 0, this.littleEndian ? (c = this.view[a], c |= this.view[a + 1] << 8) : (c = this.view[a] << 8, c |= this.view[a + 1]), b && (this.offset += 2), c }, c.readUInt16 = c.readUint16, c.writeInt32 = function (a, b) { var d; var c = typeof b === 'undefined'; if (c && (b = this.offset), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal value: ' + a + ' (not an integer)'); if (a |= 0, typeof b !== 'number' || b % 1 !== 0) throw TypeError('Illegal offset: ' + b + ' (not an integer)'); if (b >>>= 0, b < 0 || b + 0 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + b + ' (+' + 0 + ') <= ' + this.buffer.byteLength) } return b += 4, d = this.buffer.byteLength, b > d && this.resize((d *= 2) > b ? d : b), b -= 4, this.littleEndian ? (this.view[b + 3] = 255 & a >>> 24, this.view[b + 2] = 255 & a >>> 16, this.view[b + 1] = 255 & a >>> 8, this.view[b] = 255 & a) : (this.view[b] = 255 & a >>> 24, this.view[b + 1] = 255 & a >>> 16, this.view[b + 2] = 255 & a >>> 8, this.view[b + 3] = 255 & a), c && (this.offset += 4), this }, c.writeInt = c.writeInt32, c.readInt32 = function (a) { var c; var b = typeof a === 'undefined'; if (b && (a = this.offset), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal offset: ' + a + ' (not an integer)'); if (a >>>= 0, a < 0 || a + 4 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + a + ' (+' + 4 + ') <= ' + this.buffer.byteLength) } return c = 0, this.littleEndian ? (c = this.view[a + 2] << 16, c |= this.view[a + 1] << 8, c |= this.view[a], c += this.view[a + 3] << 24 >>> 0) : (c = this.view[a + 1] << 16, c |= this.view[a + 2] << 8, c |= this.view[a + 3], c += this.view[a] << 24 >>> 0), c |= 0, b && (this.offset += 4), c }, c.readInt = c.readInt32, c.writeUint32 = function (a, b) { var d; var c = typeof b === 'undefined'; if (c && (b = this.offset), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal value: ' + a + ' (not an integer)'); if (a >>>= 0, typeof b !== 'number' || b % 1 !== 0) throw TypeError('Illegal offset: ' + b + ' (not an integer)'); if (b >>>= 0, b < 0 || b + 0 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + b + ' (+' + 0 + ') <= ' + this.buffer.byteLength) } return b += 4, d = this.buffer.byteLength, b > d && this.resize((d *= 2) > b ? d : b), b -= 4, this.littleEndian ? (this.view[b + 3] = 255 & a >>> 24, this.view[b + 2] = 255 & a >>> 16, this.view[b + 1] = 255 & a >>> 8, this.view[b] = 255 & a) : (this.view[b] = 255 & a >>> 24, this.view[b + 1] = 255 & a >>> 16, this.view[b + 2] = 255 & a >>> 8, this.view[b + 3] = 255 & a), c && (this.offset += 4), this }, c.writeUInt32 = c.writeUint32, c.readUint32 = function (a) { var c; var b = typeof a === 'undefined'; if (b && (a = this.offset), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal offset: ' + a + ' (not an integer)'); if (a >>>= 0, a < 0 || a + 4 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + a + ' (+' + 4 + ') <= ' + this.buffer.byteLength) } return c = 0, this.littleEndian ? (c = this.view[a + 2] << 16, c |= this.view[a + 1] << 8, c |= this.view[a], c += this.view[a + 3] << 24 >>> 0) : (c = this.view[a + 1] << 16, c |= this.view[a + 2] << 8, c |= this.view[a + 3], c += this.view[a] << 24 >>> 0), b && (this.offset += 4), c }, c.readUInt32 = c.readUint32, a && (c.writeInt64 = function (b, c) { var e; var f; var g; var d = typeof c === 'undefined'; if (d && (c = this.offset), !this.noAssert) { if (typeof b === 'number')b = a.fromNumber(b); else if (typeof b === 'string')b = a.fromString(b); else if (!(b && b instanceof a)) throw TypeError('Illegal value: ' + b + ' (not an integer or Long)'); if (typeof c !== 'number' || c % 1 !== 0) throw TypeError('Illegal offset: ' + c + ' (not an integer)'); if (c >>>= 0, c < 0 || c + 0 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + c + ' (+' + 0 + ') <= ' + this.buffer.byteLength) } return typeof b === 'number' ? b = a.fromNumber(b) : typeof b === 'string' && (b = a.fromString(b)), c += 8, e = this.buffer.byteLength, c > e && this.resize((e *= 2) > c ? e : c), c -= 8, f = b.low, g = b.high, this.littleEndian ? (this.view[c + 3] = 255 & f >>> 24, this.view[c + 2] = 255 & f >>> 16, this.view[c + 1] = 255 & f >>> 8, this.view[c] = 255 & f, c += 4, this.view[c + 3] = 255 & g >>> 24, this.view[c + 2] = 255 & g >>> 16, this.view[c + 1] = 255 & g >>> 8, this.view[c] = 255 & g) : (this.view[c] = 255 & g >>> 24, this.view[c + 1] = 255 & g >>> 16, this.view[c + 2] = 255 & g >>> 8, this.view[c + 3] = 255 & g, c += 4, this.view[c] = 255 & f >>> 24, this.view[c + 1] = 255 & f >>> 16, this.view[c + 2] = 255 & f >>> 8, this.view[c + 3] = 255 & f), d && (this.offset += 8), this }, c.writeLong = c.writeInt64, c.readInt64 = function (b) { var d; var e; var f; var c = typeof b === 'undefined'; if (c && (b = this.offset), !this.noAssert) { if (typeof b !== 'number' || b % 1 !== 0) throw TypeError('Illegal offset: ' + b + ' (not an integer)'); if (b >>>= 0, b < 0 || b + 8 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + b + ' (+' + 8 + ') <= ' + this.buffer.byteLength) } return d = 0, e = 0, this.littleEndian ? (d = this.view[b + 2] << 16, d |= this.view[b + 1] << 8, d |= this.view[b], d += this.view[b + 3] << 24 >>> 0, b += 4, e = this.view[b + 2] << 16, e |= this.view[b + 1] << 8, e |= this.view[b], e += this.view[b + 3] << 24 >>> 0) : (e = this.view[b + 1] << 16, e |= this.view[b + 2] << 8, e |= this.view[b + 3], e += this.view[b] << 24 >>> 0, b += 4, d = this.view[b + 1] << 16, d |= this.view[b + 2] << 8, d |= this.view[b + 3], d += this.view[b] << 24 >>> 0), f = new a(d, e, !1), c && (this.offset += 8), f }, c.readLong = c.readInt64, c.writeUint64 = function (b, c) { var e; var f; var g; var d = typeof c === 'undefined'; if (d && (c = this.offset), !this.noAssert) { if (typeof b === 'number')b = a.fromNumber(b); else if (typeof b === 'string')b = a.fromString(b); else if (!(b && b instanceof a)) throw TypeError('Illegal value: ' + b + ' (not an integer or Long)'); if (typeof c !== 'number' || c % 1 !== 0) throw TypeError('Illegal offset: ' + c + ' (not an integer)'); if (c >>>= 0, c < 0 || c + 0 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + c + ' (+' + 0 + ') <= ' + this.buffer.byteLength) } return typeof b === 'number' ? b = a.fromNumber(b) : typeof b === 'string' && (b = a.fromString(b)), c += 8, e = this.buffer.byteLength, c > e && this.resize((e *= 2) > c ? e : c), c -= 8, f = b.low, g = b.high, this.littleEndian ? (this.view[c + 3] = 255 & f >>> 24, this.view[c + 2] = 255 & f >>> 16, this.view[c + 1] = 255 & f >>> 8, this.view[c] = 255 & f, c += 4, this.view[c + 3] = 255 & g >>> 24, this.view[c + 2] = 255 & g >>> 16, this.view[c + 1] = 255 & g >>> 8, this.view[c] = 255 & g) : (this.view[c] = 255 & g >>> 24, this.view[c + 1] = 255 & g >>> 16, this.view[c + 2] = 255 & g >>> 8, this.view[c + 3] = 255 & g, c += 4, this.view[c] = 255 & f >>> 24, this.view[c + 1] = 255 & f >>> 16, this.view[c + 2] = 255 & f >>> 8, this.view[c + 3] = 255 & f), d && (this.offset += 8), this }, c.writeUInt64 = c.writeUint64, c.readUint64 = function (b) { var d; var e; var f; var c = typeof b === 'undefined'; if (c && (b = this.offset), !this.noAssert) { if (typeof b !== 'number' || b % 1 !== 0) throw TypeError('Illegal offset: ' + b + ' (not an integer)'); if (b >>>= 0, b < 0 || b + 8 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + b + ' (+' + 8 + ') <= ' + this.buffer.byteLength) } return d = 0, e = 0, this.littleEndian ? (d = this.view[b + 2] << 16, d |= this.view[b + 1] << 8, d |= this.view[b], d += this.view[b + 3] << 24 >>> 0, b += 4, e = this.view[b + 2] << 16, e |= this.view[b + 1] << 8, e |= this.view[b], e += this.view[b + 3] << 24 >>> 0) : (e = this.view[b + 1] << 16, e |= this.view[b + 2] << 8, e |= this.view[b + 3], e += this.view[b] << 24 >>> 0, b += 4, d = this.view[b + 1] << 16, d |= this.view[b + 2] << 8, d |= this.view[b + 3], d += this.view[b] << 24 >>> 0), f = new a(d, e, !0), c && (this.offset += 8), f }, c.readUInt64 = c.readUint64), c.writeFloat32 = function (a, b) { var d; var c = typeof b === 'undefined'; if (c && (b = this.offset), !this.noAssert) { if (typeof a !== 'number') throw TypeError('Illegal value: ' + a + ' (not a number)'); if (typeof b !== 'number' || b % 1 !== 0) throw TypeError('Illegal offset: ' + b + ' (not an integer)'); if (b >>>= 0, b < 0 || b + 0 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + b + ' (+' + 0 + ') <= ' + this.buffer.byteLength) } return b += 4, d = this.buffer.byteLength, b > d && this.resize((d *= 2) > b ? d : b), b -= 4, i(this.view, a, b, this.littleEndian, 23, 4), c && (this.offset += 4), this }, c.writeFloat = c.writeFloat32, c.readFloat32 = function (a) { var c; var b = typeof a === 'undefined'; if (b && (a = this.offset), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal offset: ' + a + ' (not an integer)'); if (a >>>= 0, a < 0 || a + 4 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + a + ' (+' + 4 + ') <= ' + this.buffer.byteLength) } return c = h(this.view, a, this.littleEndian, 23, 4), b && (this.offset += 4), c }, c.readFloat = c.readFloat32, c.writeFloat64 = function (a, b) { var d; var c = typeof b === 'undefined'; if (c && (b = this.offset), !this.noAssert) { if (typeof a !== 'number') throw TypeError('Illegal value: ' + a + ' (not a number)'); if (typeof b !== 'number' || b % 1 !== 0) throw TypeError('Illegal offset: ' + b + ' (not an integer)'); if (b >>>= 0, b < 0 || b + 0 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + b + ' (+' + 0 + ') <= ' + this.buffer.byteLength) } return b += 8, d = this.buffer.byteLength, b > d && this.resize((d *= 2) > b ? d : b), b -= 8, i(this.view, a, b, this.littleEndian, 52, 8), c && (this.offset += 8), this }, c.writeDouble = c.writeFloat64, c.readFloat64 = function (a) { var c; var b = typeof a === 'undefined'; if (b && (a = this.offset), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal offset: ' + a + ' (not an integer)'); if (a >>>= 0, a < 0 || a + 8 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + a + ' (+' + 8 + ') <= ' + this.buffer.byteLength) } return c = h(this.view, a, this.littleEndian, 52, 8), b && (this.offset += 8), c }, c.readDouble = c.readFloat64, b.MAX_VARINT32_BYTES = 5, b.calculateVarint32 = function (a) { return a >>>= 0, a < 128 ? 1 : a < 16384 ? 2 : 1 << 21 > a ? 3 : 1 << 28 > a ? 4 : 5 }, b.zigZagEncode32 = function (a) { return ((a |= 0) << 1 ^ a >> 31) >>> 0 }, b.zigZagDecode32 = function (a) { return 0 | a >>> 1 ^ -(1 & a) }, c.writeVarint32 = function (a, c) { var f; var e; var g; var d = typeof c === 'undefined'; if (d && (c = this.offset), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal value: ' + a + ' (not an integer)'); if (a |= 0, typeof c !== 'number' || c % 1 !== 0) throw TypeError('Illegal offset: ' + c + ' (not an integer)'); if (c >>>= 0, c < 0 || c + 0 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + c + ' (+' + 0 + ') <= ' + this.buffer.byteLength) } for (e = b.calculateVarint32(a), c += e, g = this.buffer.byteLength, c > g && this.resize((g *= 2) > c ? g : c), c -= e, a >>>= 0; a >= 128;)f = 128 | 127 & a, this.view[c++] = f, a >>>= 7; return this.view[c++] = a, d ? (this.offset = c, this) : e }, c.writeVarint32ZigZag = function (a, c) { return this.writeVarint32(b.zigZagEncode32(a), c) }, c.readVarint32 = function (a) { var e; var c; var d; var f; var b = typeof a === 'undefined'; if (b && (a = this.offset), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal offset: ' + a + ' (not an integer)'); if (a >>>= 0, a < 0 || a + 1 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + a + ' (+' + 1 + ') <= ' + this.buffer.byteLength) }c = 0, d = 0; do { if (!this.noAssert && a > this.limit) throw f = Error('Truncated'), f.truncated = !0, f; e = this.view[a++], c < 5 && (d |= (127 & e) << 7 * c), ++c; } while ((128 & e) !== 0); return d |= 0, b ? (this.offset = a, d) : { value: d, length: c } }, c.readVarint32ZigZag = function (a) { var c = this.readVarint32(a); return typeof c === 'object' ? c.value = b.zigZagDecode32(c.value) : c = b.zigZagDecode32(c), c }, a && (b.MAX_VARINT64_BYTES = 10, b.calculateVarint64 = function (b) { typeof b === 'number' ? b = a.fromNumber(b) : typeof b === 'string' && (b = a.fromString(b)); var c = b.toInt() >>> 0; var d = b.shiftRightUnsigned(28).toInt() >>> 0; var e = b.shiftRightUnsigned(56).toInt() >>> 0; return e == 0 ? d == 0 ? c < 16384 ? c < 128 ? 1 : 2 : 1 << 21 > c ? 3 : 4 : d < 16384 ? d < 128 ? 5 : 6 : 1 << 21 > d ? 7 : 8 : e < 128 ? 9 : 10 }, b.zigZagEncode64 = function (b) { return typeof b === 'number' ? b = a.fromNumber(b, !1) : typeof b === 'string' ? b = a.fromString(b, !1) : b.unsigned !== !1 && (b = b.toSigned()), b.shiftLeft(1).xor(b.shiftRight(63)).toUnsigned() }, b.zigZagDecode64 = function (b) { return typeof b === 'number' ? b = a.fromNumber(b, !1) : typeof b === 'string' ? b = a.fromString(b, !1) : b.unsigned !== !1 && (b = b.toSigned()), b.shiftRightUnsigned(1).xor(b.and(a.ONE).toSigned().negate()).toSigned() }, c.writeVarint64 = function (c, d) { var f; var g; var h; var i; var j; var e = typeof d === 'undefined'; if (e && (d = this.offset), !this.noAssert) { if (typeof c === 'number')c = a.fromNumber(c); else if (typeof c === 'string')c = a.fromString(c); else if (!(c && c instanceof a)) throw TypeError('Illegal value: ' + c + ' (not an integer or Long)'); if (typeof d !== 'number' || d % 1 !== 0) throw TypeError('Illegal offset: ' + d + ' (not an integer)'); if (d >>>= 0, d < 0 || d + 0 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + d + ' (+' + 0 + ') <= ' + this.buffer.byteLength) } switch (typeof c === 'number' ? c = a.fromNumber(c, !1) : typeof c === 'string' ? c = a.fromString(c, !1) : c.unsigned !== !1 && (c = c.toSigned()), f = b.calculateVarint64(c), g = c.toInt() >>> 0, h = c.shiftRightUnsigned(28).toInt() >>> 0, i = c.shiftRightUnsigned(56).toInt() >>> 0, d += f, j = this.buffer.byteLength, d > j && this.resize((j *= 2) > d ? j : d), d -= f, f) { case 10:this.view[d + 9] = 1 & i >>> 7; case 9:this.view[d + 8] = f !== 9 ? 128 | i : 127 & i; case 8:this.view[d + 7] = f !== 8 ? 128 | h >>> 21 : 127 & h >>> 21; case 7:this.view[d + 6] = f !== 7 ? 128 | h >>> 14 : 127 & h >>> 14; case 6:this.view[d + 5] = f !== 6 ? 128 | h >>> 7 : 127 & h >>> 7; case 5:this.view[d + 4] = f !== 5 ? 128 | h : 127 & h; case 4:this.view[d + 3] = f !== 4 ? 128 | g >>> 21 : 127 & g >>> 21; case 3:this.view[d + 2] = f !== 3 ? 128 | g >>> 14 : 127 & g >>> 14; case 2:this.view[d + 1] = f !== 2 ? 128 | g >>> 7 : 127 & g >>> 7; case 1:this.view[d] = f !== 1 ? 128 | g : 127 & g; } return e ? (this.offset += f, this) : f }, c.writeVarint64ZigZag = function (a, c) { return this.writeVarint64(b.zigZagEncode64(a), c) }, c.readVarint64 = function (b) { var d; var e; var f; var g; var h; var i; var c = typeof b === 'undefined'; if (c && (b = this.offset), !this.noAssert) { if (typeof b !== 'number' || b % 1 !== 0) throw TypeError('Illegal offset: ' + b + ' (not an integer)'); if (b >>>= 0, b < 0 || b + 1 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + b + ' (+' + 1 + ') <= ' + this.buffer.byteLength) } if (d = b, e = 0, f = 0, g = 0, h = 0, h = this.view[b++], e = 127 & h, 128 & h && (h = this.view[b++], e |= (127 & h) << 7, (128 & h || this.noAssert && typeof h === 'undefined') && (h = this.view[b++], e |= (127 & h) << 14, (128 & h || this.noAssert && typeof h === 'undefined') && (h = this.view[b++], e |= (127 & h) << 21, (128 & h || this.noAssert && typeof h === 'undefined') && (h = this.view[b++], f = 127 & h, (128 & h || this.noAssert && typeof h === 'undefined') && (h = this.view[b++], f |= (127 & h) << 7, (128 & h || this.noAssert && typeof h === 'undefined') && (h = this.view[b++], f |= (127 & h) << 14, (128 & h || this.noAssert && typeof h === 'undefined') && (h = this.view[b++], f |= (127 & h) << 21, (128 & h || this.noAssert && typeof h === 'undefined') && (h = this.view[b++], g = 127 & h, (128 & h || this.noAssert && typeof h === 'undefined') && (h = this.view[b++], g |= (127 & h) << 7, 128 & h || this.noAssert && typeof h === 'undefined')))))))))) throw Error('Buffer overrun'); return i = a.fromBits(e | f << 28, f >>> 4 | g << 24, !1), c ? (this.offset = b, i) : { value: i, length: b - d } }, c.readVarint64ZigZag = function (c) { var d = this.readVarint64(c); return d && d.value instanceof a ? d.value = b.zigZagDecode64(d.value) : d = b.zigZagDecode64(d), d }), c.writeCString = function (a, b) { var d; var e; var g; var c = typeof b === 'undefined'; if (c && (b = this.offset), e = a.length, !this.noAssert) { if (typeof a !== 'string') throw TypeError('Illegal str: Not a string'); for (d = 0; e > d; ++d) if (a.charCodeAt(d) === 0) throw RangeError('Illegal str: Contains NULL-characters'); if (typeof b !== 'number' || b % 1 !== 0) throw TypeError('Illegal offset: ' + b + ' (not an integer)'); if (b >>>= 0, b < 0 || b + 0 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + b + ' (+' + 0 + ') <= ' + this.buffer.byteLength) } return e = k.calculateUTF16asUTF8(f(a))[1], b += e + 1, g = this.buffer.byteLength, b > g && this.resize((g *= 2) > b ? g : b), b -= e + 1, k.encodeUTF16toUTF8(f(a), function (a) { this.view[b++] = a; }.bind(this)), this.view[b++] = 0, c ? (this.offset = b, this) : e }, c.readCString = function (a) { var c; var e; var f; var b = typeof a === 'undefined'; if (b && (a = this.offset), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal offset: ' + a + ' (not an integer)'); if (a >>>= 0, a < 0 || a + 1 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + a + ' (+' + 1 + ') <= ' + this.buffer.byteLength) } return c = a, f = -1, k.decodeUTF8toUTF16(function () { if (f === 0) return null; if (a >= this.limit) throw RangeError('Illegal range: Truncated data, ' + a + ' < ' + this.limit); return f = this.view[a++], f === 0 ? null : f }.bind(this), e = g(), !0), b ? (this.offset = a, e()) : { string: e(), length: a - c } }, c.writeIString = function (a, b) { var e; var d; var g; var c = typeof b === 'undefined'; if (c && (b = this.offset), !this.noAssert) { if (typeof a !== 'string') throw TypeError('Illegal str: Not a string'); if (typeof b !== 'number' || b % 1 !== 0) throw TypeError('Illegal offset: ' + b + ' (not an integer)'); if (b >>>= 0, b < 0 || b + 0 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + b + ' (+' + 0 + ') <= ' + this.buffer.byteLength) } if (d = b, e = k.calculateUTF16asUTF8(f(a), this.noAssert)[1], b += 4 + e, g = this.buffer.byteLength, b > g && this.resize((g *= 2) > b ? g : b), b -= 4 + e, this.littleEndian ? (this.view[b + 3] = 255 & e >>> 24, this.view[b + 2] = 255 & e >>> 16, this.view[b + 1] = 255 & e >>> 8, this.view[b] = 255 & e) : (this.view[b] = 255 & e >>> 24, this.view[b + 1] = 255 & e >>> 16, this.view[b + 2] = 255 & e >>> 8, this.view[b + 3] = 255 & e), b += 4, k.encodeUTF16toUTF8(f(a), function (a) { this.view[b++] = a; }.bind(this)), b !== d + 4 + e) throw RangeError('Illegal range: Truncated data, ' + b + ' == ' + (b + 4 + e)); return c ? (this.offset = b, this) : b - d }, c.readIString = function (a) {
          var d; var e; var f; var c = typeof a === 'undefined';
          if (c && (a = this.offset), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal offset: ' + a + ' (not an integer)'); if (a >>>= 0, a < 0 || a + 4 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + a + ' (+' + 4 + ') <= ' + this.buffer.byteLength) } return d = a, e = this.readUint32(a), f = this.readUTF8String(e, b.METRICS_BYTES, a += 4), a += f.length, c ? (this.offset = a, f.string) : { string: f.string, length: a - d }
        }, b.METRICS_CHARS = 'c', b.METRICS_BYTES = 'b', c.writeUTF8String = function (a, b) { var d; var e; var g; var c = typeof b === 'undefined'; if (c && (b = this.offset), !this.noAssert) { if (typeof b !== 'number' || b % 1 !== 0) throw TypeError('Illegal offset: ' + b + ' (not an integer)'); if (b >>>= 0, b < 0 || b + 0 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + b + ' (+' + 0 + ') <= ' + this.buffer.byteLength) } return e = b, d = k.calculateUTF16asUTF8(f(a))[1], b += d, g = this.buffer.byteLength, b > g && this.resize((g *= 2) > b ? g : b), b -= d, k.encodeUTF16toUTF8(f(a), function (a) { this.view[b++] = a; }.bind(this)), c ? (this.offset = b, this) : b - e }, c.writeString = c.writeUTF8String, b.calculateUTF8Chars = function (a) { return k.calculateUTF16asUTF8(f(a))[0] }, b.calculateUTF8Bytes = function (a) { return k.calculateUTF16asUTF8(f(a))[1] }, b.calculateString = b.calculateUTF8Bytes, c.readUTF8String = function (a, c, d) { var e, i, f, h, j; if (typeof c === 'number' && (d = c, c = void 0), e = typeof d === 'undefined', e && (d = this.offset), typeof c === 'undefined' && (c = b.METRICS_CHARS), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal length: ' + a + ' (not an integer)'); if (a |= 0, typeof d !== 'number' || d % 1 !== 0) throw TypeError('Illegal offset: ' + d + ' (not an integer)'); if (d >>>= 0, d < 0 || d + 0 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + d + ' (+' + 0 + ') <= ' + this.buffer.byteLength) } if (f = 0, h = d, c === b.METRICS_CHARS) { if (i = g(), k.decodeUTF8(function () { return a > f && d < this.limit ? this.view[d++] : null }.bind(this), function (a) { ++f, k.UTF8toUTF16(a, i); }), f !== a) throw RangeError('Illegal range: Truncated data, ' + f + ' == ' + a); return e ? (this.offset = d, i()) : { string: i(), length: d - h } } if (c === b.METRICS_BYTES) { if (!this.noAssert) { if (typeof d !== 'number' || d % 1 !== 0) throw TypeError('Illegal offset: ' + d + ' (not an integer)'); if (d >>>= 0, d < 0 || d + a > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + d + ' (+' + a + ') <= ' + this.buffer.byteLength) } if (j = d + a, k.decodeUTF8toUTF16(function () { return j > d ? this.view[d++] : null }.bind(this), i = g(), this.noAssert), d !== j) throw RangeError('Illegal range: Truncated data, ' + d + ' == ' + j); return e ? (this.offset = d, i()) : { string: i(), length: d - h } } throw TypeError('Unsupported metrics: ' + c) }, c.readString = c.readUTF8String, c.writeVString = function (a, c) { var g; var h; var e; var i; var d = typeof c === 'undefined'; if (d && (c = this.offset), !this.noAssert) { if (typeof a !== 'string') throw TypeError('Illegal str: Not a string'); if (typeof c !== 'number' || c % 1 !== 0) throw TypeError('Illegal offset: ' + c + ' (not an integer)'); if (c >>>= 0, c < 0 || c + 0 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + c + ' (+' + 0 + ') <= ' + this.buffer.byteLength) } if (e = c, g = k.calculateUTF16asUTF8(f(a), this.noAssert)[1], h = b.calculateVarint32(g), c += h + g, i = this.buffer.byteLength, c > i && this.resize((i *= 2) > c ? i : c), c -= h + g, c += this.writeVarint32(g, c), k.encodeUTF16toUTF8(f(a), function (a) { this.view[c++] = a; }.bind(this)), c !== e + g + h) throw RangeError('Illegal range: Truncated data, ' + c + ' == ' + (c + g + h)); return d ? (this.offset = c, this) : c - e }, c.readVString = function (a) { var d; var e; var f; var c = typeof a === 'undefined'; if (c && (a = this.offset), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal offset: ' + a + ' (not an integer)'); if (a >>>= 0, a < 0 || a + 1 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + a + ' (+' + 1 + ') <= ' + this.buffer.byteLength) } return d = a, e = this.readVarint32(a), f = this.readUTF8String(e.value, b.METRICS_BYTES, a += e.length), a += f.length, c ? (this.offset = a, f.string) : { string: f.string, length: a - d } }, c.append = function (a, c, d) { var e, f, g; if ((typeof c === 'number' || typeof c !== 'string') && (d = c, c = void 0), e = typeof d === 'undefined', e && (d = this.offset), !this.noAssert) { if (typeof d !== 'number' || d % 1 !== 0) throw TypeError('Illegal offset: ' + d + ' (not an integer)'); if (d >>>= 0, d < 0 || d + 0 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + d + ' (+' + 0 + ') <= ' + this.buffer.byteLength) } return a instanceof b || (a = b.wrap(a, c)), f = a.limit - a.offset, f <= 0 ? this : (d += f, g = this.buffer.byteLength, d > g && this.resize((g *= 2) > d ? g : d), d -= f, this.view.set(a.view.subarray(a.offset, a.limit), d), a.offset += f, e && (this.offset += f), this) }, c.appendTo = function (a, b) { return a.append(this, b), this }, c.assert = function (a) { return this.noAssert = !a, this }, c.capacity = function () { return this.buffer.byteLength }, c.clear = function () { return this.offset = 0, this.limit = this.buffer.byteLength, this.markedOffset = -1, this }, c.clone = function (a) { var c = new b(0, this.littleEndian, this.noAssert); return a ? (c.buffer = new ArrayBuffer(this.buffer.byteLength), c.view = new Uint8Array(c.buffer)) : (c.buffer = this.buffer, c.view = this.view), c.offset = this.offset, c.markedOffset = this.markedOffset, c.limit = this.limit, c }, c.compact = function (a, b) { var c, e, f; if (typeof a === 'undefined' && (a = this.offset), typeof b === 'undefined' && (b = this.limit), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal begin: Not an integer'); if (a >>>= 0, typeof b !== 'number' || b % 1 !== 0) throw TypeError('Illegal end: Not an integer'); if (b >>>= 0, a < 0 || a > b || b > this.buffer.byteLength) throw RangeError('Illegal range: 0 <= ' + a + ' <= ' + b + ' <= ' + this.buffer.byteLength) } return a === 0 && b === this.buffer.byteLength ? this : (c = b - a, c === 0 ? (this.buffer = d, this.view = null, this.markedOffset >= 0 && (this.markedOffset -= a), this.offset = 0, this.limit = 0, this) : (e = new ArrayBuffer(c), f = new Uint8Array(e), f.set(this.view.subarray(a, b)), this.buffer = e, this.view = f, this.markedOffset >= 0 && (this.markedOffset -= a), this.offset = 0, this.limit = c, this)) }, c.copy = function (a, c) { if (typeof a === 'undefined' && (a = this.offset), typeof c === 'undefined' && (c = this.limit), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal begin: Not an integer'); if (a >>>= 0, typeof c !== 'number' || c % 1 !== 0) throw TypeError('Illegal end: Not an integer'); if (c >>>= 0, a < 0 || a > c || c > this.buffer.byteLength) throw RangeError('Illegal range: 0 <= ' + a + ' <= ' + c + ' <= ' + this.buffer.byteLength) } if (a === c) return new b(0, this.littleEndian, this.noAssert); var d = c - a; var e = new b(d, this.littleEndian, this.noAssert); return e.offset = 0, e.limit = d, e.markedOffset >= 0 && (e.markedOffset -= a), this.copyTo(e, 0, a, c), e }, c.copyTo = function (a, c, d, e) { var f, g, h; if (!this.noAssert && !b.isByteBuffer(a)) throw TypeError('Illegal target: Not a ByteBuffer'); if (c = (g = typeof c === 'undefined') ? a.offset : 0 | c, d = (f = typeof d === 'undefined') ? this.offset : 0 | d, e = typeof e === 'undefined' ? this.limit : 0 | e, c < 0 || c > a.buffer.byteLength) throw RangeError('Illegal target range: 0 <= ' + c + ' <= ' + a.buffer.byteLength); if (d < 0 || e > this.buffer.byteLength) throw RangeError('Illegal source range: 0 <= ' + d + ' <= ' + this.buffer.byteLength); return h = e - d, h === 0 ? a : (a.ensureCapacity(c + h), a.view.set(this.view.subarray(d, e), c), f && (this.offset += h), g && (a.offset += h), this) }, c.ensureCapacity = function (a) { var b = this.buffer.byteLength; return a > b ? this.resize((b *= 2) > a ? b : a) : this }, c.fill = function (a, b, c) { var d = typeof b === 'undefined'; if (d && (b = this.offset), typeof a === 'string' && a.length > 0 && (a = a.charCodeAt(0)), typeof b === 'undefined' && (b = this.offset), typeof c === 'undefined' && (c = this.limit), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal value: ' + a + ' (not an integer)'); if (a |= 0, typeof b !== 'number' || b % 1 !== 0) throw TypeError('Illegal begin: Not an integer'); if (b >>>= 0, typeof c !== 'number' || c % 1 !== 0) throw TypeError('Illegal end: Not an integer'); if (c >>>= 0, b < 0 || b > c || c > this.buffer.byteLength) throw RangeError('Illegal range: 0 <= ' + b + ' <= ' + c + ' <= ' + this.buffer.byteLength) } if (b >= c) return this; for (;c > b;) this.view[b++] = a; return d && (this.offset = b), this }, c.flip = function () { return this.limit = this.offset, this.offset = 0, this }, c.mark = function (a) { if (a = typeof a === 'undefined' ? this.offset : a, !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal offset: ' + a + ' (not an integer)'); if (a >>>= 0, a < 0 || a + 0 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + a + ' (+' + 0 + ') <= ' + this.buffer.byteLength) } return this.markedOffset = a, this }, c.order = function (a) { if (!this.noAssert && typeof a !== 'boolean') throw TypeError('Illegal littleEndian: Not a boolean'); return this.littleEndian = !!a, this }, c.LE = function (a) { return this.littleEndian = typeof a !== 'undefined' ? !!a : !0, this }, c.BE = function (a) { return this.littleEndian = typeof a !== 'undefined' ? !a : !1, this }, c.prepend = function (a, c, d) { var e, f, g, h, i; if ((typeof c === 'number' || typeof c !== 'string') && (d = c, c = void 0), e = typeof d === 'undefined', e && (d = this.offset), !this.noAssert) { if (typeof d !== 'number' || d % 1 !== 0) throw TypeError('Illegal offset: ' + d + ' (not an integer)'); if (d >>>= 0, d < 0 || d + 0 > this.buffer.byteLength) throw RangeError('Illegal offset: 0 <= ' + d + ' (+' + 0 + ') <= ' + this.buffer.byteLength) } return a instanceof b || (a = b.wrap(a, c)), f = a.limit - a.offset, f <= 0 ? this : (g = f - d, g > 0 ? (h = new ArrayBuffer(this.buffer.byteLength + g), i = new Uint8Array(h), i.set(this.view.subarray(d, this.buffer.byteLength), f), this.buffer = h, this.view = i, this.offset += g, this.markedOffset >= 0 && (this.markedOffset += g), this.limit += g, d += g) : new Uint8Array(this.buffer), this.view.set(a.view.subarray(a.offset, a.limit), d - f), a.offset = a.limit, e && (this.offset -= f), this) }, c.prependTo = function (a, b) { return a.prepend(this, b), this }, c.printDebug = function (a) { typeof a !== 'function' && (a = console.log.bind(console)), a(this.toString() + '\n-------------------------------------------------------------------\n' + this.toDebug(!0)); }, c.remaining = function () { return this.limit - this.offset }, c.reset = function () { return this.markedOffset >= 0 ? (this.offset = this.markedOffset, this.markedOffset = -1) : this.offset = 0, this }, c.resize = function (a) { var b, c; if (!this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal capacity: ' + a + ' (not an integer)'); if (a |= 0, a < 0) throw RangeError('Illegal capacity: 0 <= ' + a) } return this.buffer.byteLength < a && (b = new ArrayBuffer(a), c = new Uint8Array(b), c.set(this.view), this.buffer = b, this.view = c), this }, c.reverse = function (a, b) { if (typeof a === 'undefined' && (a = this.offset), typeof b === 'undefined' && (b = this.limit), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal begin: Not an integer'); if (a >>>= 0, typeof b !== 'number' || b % 1 !== 0) throw TypeError('Illegal end: Not an integer'); if (b >>>= 0, a < 0 || a > b || b > this.buffer.byteLength) throw RangeError('Illegal range: 0 <= ' + a + ' <= ' + b + ' <= ' + this.buffer.byteLength) } return a === b ? this : (Array.prototype.reverse.call(this.view.subarray(a, b)), this) }, c.skip = function (a) { if (!this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal length: ' + a + ' (not an integer)'); a |= 0; } var b = this.offset + a; if (!this.noAssert && (b < 0 || b > this.buffer.byteLength)) throw RangeError('Illegal length: 0 <= ' + this.offset + ' + ' + a + ' <= ' + this.buffer.byteLength); return this.offset = b, this }, c.slice = function (a, b) { if (typeof a === 'undefined' && (a = this.offset), typeof b === 'undefined' && (b = this.limit), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal begin: Not an integer'); if (a >>>= 0, typeof b !== 'number' || b % 1 !== 0) throw TypeError('Illegal end: Not an integer'); if (b >>>= 0, a < 0 || a > b || b > this.buffer.byteLength) throw RangeError('Illegal range: 0 <= ' + a + ' <= ' + b + ' <= ' + this.buffer.byteLength) } var c = this.clone(); return c.offset = a, c.limit = b, c }, c.toBuffer = function (a) { var e; var b = this.offset; var c = this.limit; if (!this.noAssert) { if (typeof b !== 'number' || b % 1 !== 0) throw TypeError('Illegal offset: Not an integer'); if (b >>>= 0, typeof c !== 'number' || c % 1 !== 0) throw TypeError('Illegal limit: Not an integer'); if (c >>>= 0, b < 0 || b > c || c > this.buffer.byteLength) throw RangeError('Illegal range: 0 <= ' + b + ' <= ' + c + ' <= ' + this.buffer.byteLength) } return a || b !== 0 || c !== this.buffer.byteLength ? b === c ? d : (e = new ArrayBuffer(c - b), new Uint8Array(e).set(new Uint8Array(this.buffer).subarray(b, c), 0), e) : this.buffer }, c.toArrayBuffer = c.toBuffer, c.toString = function (a, b, c) { if (typeof a === 'undefined') return 'ByteBufferAB(offset=' + this.offset + ',markedOffset=' + this.markedOffset + ',limit=' + this.limit + ',capacity=' + this.capacity() + ')'; switch (typeof a === 'number' && (a = 'utf8', b = a, c = b), a) { case 'utf8':return this.toUTF8(b, c); case 'base64':return this.toBase64(b, c); case 'hex':return this.toHex(b, c); case 'binary':return this.toBinary(b, c); case 'debug':return this.toDebug(); case 'columns':return this.toColumns(); default:throw Error('Unsupported encoding: ' + a) } }, j = (function () { var d; var e; var a = {}; var b = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47]; var c = []; for (d = 0, e = b.length; e > d; ++d)c[b[d]] = d; return a.encode = function (a, c) { for (var d, e; (d = a()) !== null;)c(b[63 & d >> 2]), e = (3 & d) << 4, (d = a()) !== null ? (e |= 15 & d >> 4, c(b[63 & (e | 15 & d >> 4)]), e = (15 & d) << 2, (d = a()) !== null ? (c(b[63 & (e | 3 & d >> 6)]), c(b[63 & d])) : (c(b[63 & e]), c(61))) : (c(b[63 & e]), c(61), c(61)); }, a.decode = function (a, b) { function g (a) { throw Error('Illegal character code: ' + a) } for (var d, e, f; (d = a()) !== null;) if (e = c[d], typeof e === 'undefined' && g(d), (d = a()) !== null && (f = c[d], typeof f === 'undefined' && g(d), b(e << 2 >>> 0 | (48 & f) >> 4), (d = a()) !== null)) { if (e = c[d], typeof e === 'undefined') { if (d === 61) break; g(d); } if (b((15 & f) << 4 >>> 0 | (60 & e) >> 2), (d = a()) !== null) { if (f = c[d], typeof f === 'undefined') { if (d === 61) break; g(d); }b((3 & e) << 6 >>> 0 | f); } } }, a.test = function (a) { return /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/.test(a) }, a }()), c.toBase64 = function (a, b) { if (typeof a === 'undefined' && (a = this.offset), typeof b === 'undefined' && (b = this.limit), a = 0 | a, b = 0 | b, a < 0 || b > this.capacity || a > b) throw RangeError('begin, end'); var c; return j.encode(function () { return b > a ? this.view[a++] : null }.bind(this), c = g()), c() }, b.fromBase64 = function (a, c) { if (typeof a !== 'string') throw TypeError('str'); var d = new b(3 * (a.length / 4), c); var e = 0; return j.decode(f(a), function (a) { d.view[e++] = a; }), d.limit = e, d }, b.btoa = function (a) { return b.fromBinary(a).toBase64() }, b.atob = function (a) { return b.fromBase64(a).toBinary() }, c.toBinary = function (a, b) { if (typeof a === 'undefined' && (a = this.offset), typeof b === 'undefined' && (b = this.limit), a |= 0, b |= 0, a < 0 || b > this.capacity() || a > b) throw RangeError('begin, end'); if (a === b) return ''; for (var c = [], d = []; b > a;)c.push(this.view[a++]), c.length >= 1024 && (d.push(String.fromCharCode.apply(String, c)), c = []); return d.join('') + String.fromCharCode.apply(String, c) }, b.fromBinary = function (a, c) { if (typeof a !== 'string') throw TypeError('str'); for (var f, d = 0, e = a.length, g = new b(e, c); e > d;) { if (f = a.charCodeAt(d), f > 255) throw RangeError('illegal char code: ' + f); g.view[d++] = f; } return g.limit = e, g }, c.toDebug = function (a) { for (var d, b = -1, c = this.buffer.byteLength, e = '', f = '', g = ''; c > b;) { if (b !== -1 && (d = this.view[b], e += d < 16 ? '0' + d.toString(16).toUpperCase() : d.toString(16).toUpperCase(), a && (f += d > 32 && d < 127 ? String.fromCharCode(d) : '.')), ++b, a && b > 0 && b % 16 === 0 && b !== c) { for (;e.length < 51;)e += ' '; g += e + f + '\n', e = f = ''; }e += b === this.offset && b === this.limit ? b === this.markedOffset ? '!' : '|' : b === this.offset ? b === this.markedOffset ? '[' : '<' : b === this.limit ? b === this.markedOffset ? ']' : '>' : b === this.markedOffset ? "'" : a || b !== 0 && b !== c ? ' ' : ''; } if (a && e !== ' ') { for (;e.length < 51;)e += ' '; g += e + f + '\n'; } return a ? g : e }, b.fromDebug = function (a, c, d) { for (var i, j, e = a.length, f = new b(0 | (e + 1) / 3, c, d), g = 0, h = 0, k = !1, l = !1, m = !1, n = !1, o = !1; e > g;) { switch (i = a.charAt(g++)) { case '!':if (!d) { if (l || m || n) { o = !0; break }l = m = n = !0; }f.offset = f.markedOffset = f.limit = h, k = !1; break; case '|':if (!d) { if (l || n) { o = !0; break }l = n = !0; }f.offset = f.limit = h, k = !1; break; case '[':if (!d) { if (l || m) { o = !0; break }l = m = !0; }f.offset = f.markedOffset = h, k = !1; break; case '<':if (!d) { if (l) { o = !0; break }l = !0; }f.offset = h, k = !1; break; case ']':if (!d) { if (n || m) { o = !0; break }n = m = !0; }f.limit = f.markedOffset = h, k = !1; break; case '>':if (!d) { if (n) { o = !0; break }n = !0; }f.limit = h, k = !1; break; case "'":if (!d) { if (m) { o = !0; break }m = !0; }f.markedOffset = h, k = !1; break; case ' ':k = !1; break; default:if (!d && k) { o = !0; break } if (j = parseInt(i + a.charAt(g++), 16), !d && (isNaN(j) || j < 0 || j > 255)) throw TypeError('Illegal str: Not a debug encoded string'); f.view[h++] = j, k = !0; } if (o) throw TypeError('Illegal str: Invalid symbol at ' + g) } if (!d) { if (!l || !n) throw TypeError('Illegal str: Missing offset or limit'); if (h < f.buffer.byteLength) throw TypeError('Illegal str: Not a debug encoded string (is it hex?) ' + h + ' < ' + e) } return f }, c.toHex = function (a, b) { if (a = typeof a === 'undefined' ? this.offset : a, b = typeof b === 'undefined' ? this.limit : b, !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal begin: Not an integer'); if (a >>>= 0, typeof b !== 'number' || b % 1 !== 0) throw TypeError('Illegal end: Not an integer'); if (b >>>= 0, a < 0 || a > b || b > this.buffer.byteLength) throw RangeError('Illegal range: 0 <= ' + a + ' <= ' + b + ' <= ' + this.buffer.byteLength) } for (var d, c = new Array(b - a); b > a;)d = this.view[a++], d < 16 ? c.push('0', d.toString(16)) : c.push(d.toString(16)); return c.join('') }, b.fromHex = function (a, c, d) { var g, e, f, h, i; if (!d) { if (typeof a !== 'string') throw TypeError('Illegal str: Not a string'); if (a.length % 2 !== 0) throw TypeError('Illegal str: Length not a multiple of 2') } for (e = a.length, f = new b(0 | e / 2, c), h = 0, i = 0; e > h; h += 2) { if (g = parseInt(a.substring(h, h + 2), 16), !d && (!isFinite(g) || g < 0 || g > 255)) throw TypeError('Illegal str: Contains non-hex characters'); f.view[i++] = g; } return f.limit = i, f }, k = (function () { var a = {}; return a.MAX_CODEPOINT = 1114111, a.encodeUTF8 = function (a, b) { var c = null; for (typeof a === 'number' && (c = a, a = function () { return null }); c !== null || (c = a()) !== null;)c < 128 ? b(127 & c) : c < 2048 ? (b(192 | 31 & c >> 6), b(128 | 63 & c)) : c < 65536 ? (b(224 | 15 & c >> 12), b(128 | 63 & c >> 6), b(128 | 63 & c)) : (b(240 | 7 & c >> 18), b(128 | 63 & c >> 12), b(128 | 63 & c >> 6), b(128 | 63 & c)), c = null; }, a.decodeUTF8 = function (a, b) { for (var c, d, e, f, g = function (a) { a = a.slice(0, a.indexOf(null)); var b = Error(a.toString()); throw b.name = 'TruncatedError', b.bytes = a, b }; (c = a()) !== null;) if ((128 & c) === 0)b(c); else if ((224 & c) === 192)(d = a()) === null && g([c, d]), b((31 & c) << 6 | 63 & d); else if ((240 & c) === 224)((d = a()) === null || (e = a()) === null) && g([c, d, e]), b((15 & c) << 12 | (63 & d) << 6 | 63 & e); else { if ((248 & c) !== 240) throw RangeError('Illegal starting byte: ' + c); ((d = a()) === null || (e = a()) === null || (f = a()) === null) && g([c, d, e, f]), b((7 & c) << 18 | (63 & d) << 12 | (63 & e) << 6 | 63 & f); } }, a.UTF16toUTF8 = function (a, b) { for (var c, d = null; ;) { if ((c = d !== null ? d : a()) === null) break; c >= 55296 && c <= 57343 && (d = a()) !== null && d >= 56320 && d <= 57343 ? (b(1024 * (c - 55296) + d - 56320 + 65536), d = null) : b(c); }d !== null && b(d); }, a.UTF8toUTF16 = function (a, b) { var c = null; for (typeof a === 'number' && (c = a, a = function () { return null }); c !== null || (c = a()) !== null;)c <= 65535 ? b(c) : (c -= 65536, b((c >> 10) + 55296), b(c % 1024 + 56320)), c = null; }, a.encodeUTF16toUTF8 = function (b, c) { a.UTF16toUTF8(b, function (b) { a.encodeUTF8(b, c); }); }, a.decodeUTF8toUTF16 = function (b, c) { a.decodeUTF8(b, function (b) { a.UTF8toUTF16(b, c); }); }, a.calculateCodePoint = function (a) { return a < 128 ? 1 : a < 2048 ? 2 : a < 65536 ? 3 : 4 }, a.calculateUTF8 = function (a) { for (var b, c = 0; (b = a()) !== null;)c += b < 128 ? 1 : b < 2048 ? 2 : b < 65536 ? 3 : 4; return c }, a.calculateUTF16asUTF8 = function (b) { var c = 0; var d = 0; return a.UTF16toUTF8(b, function (a) { ++c, d += a < 128 ? 1 : a < 2048 ? 2 : a < 65536 ? 3 : 4; }), [c, d] }, a }()), c.toUTF8 = function (a, b) { if (typeof a === 'undefined' && (a = this.offset), typeof b === 'undefined' && (b = this.limit), !this.noAssert) { if (typeof a !== 'number' || a % 1 !== 0) throw TypeError('Illegal begin: Not an integer'); if (a >>>= 0, typeof b !== 'number' || b % 1 !== 0) throw TypeError('Illegal end: Not an integer'); if (b >>>= 0, a < 0 || a > b || b > this.buffer.byteLength) throw RangeError('Illegal range: 0 <= ' + a + ' <= ' + b + ' <= ' + this.buffer.byteLength) } var c; try { k.decodeUTF8toUTF16(function () { return b > a ? this.view[a++] : null }.bind(this), c = g()); } catch (d) { if (a !== b) throw RangeError('Illegal range: Truncated data, ' + a + ' != ' + b) } return c() }, b.fromUTF8 = function (a, c, d) { if (!d && typeof a !== 'string') throw TypeError('Illegal str: Not a string'); var e = new b(k.calculateUTF16asUTF8(f(a), !0)[1], c, d); var g = 0; return k.encodeUTF16toUTF8(f(a), function (a) { e.view[g++] = a; }), e.limit = g, e }, b
      }(c)); var e = (function (b, c) {
        var f; var h; var e = {}; return e.ByteBuffer = b, e.c = b, f = b, e.Long = c || null, e.VERSION = '5.0.1', e.WIRE_TYPES = {}, e.WIRE_TYPES.VARINT = 0, e.WIRE_TYPES.BITS64 = 1, e.WIRE_TYPES.LDELIM = 2, e.WIRE_TYPES.STARTGROUP = 3, e.WIRE_TYPES.ENDGROUP = 4, e.WIRE_TYPES.BITS32 = 5, e.PACKABLE_WIRE_TYPES = [e.WIRE_TYPES.VARINT, e.WIRE_TYPES.BITS64, e.WIRE_TYPES.BITS32], e.TYPES = { int32: { name: 'int32', wireType: e.WIRE_TYPES.VARINT, defaultValue: 0 }, uint32: { name: 'uint32', wireType: e.WIRE_TYPES.VARINT, defaultValue: 0 }, sint32: { name: 'sint32', wireType: e.WIRE_TYPES.VARINT, defaultValue: 0 }, int64: { name: 'int64', wireType: e.WIRE_TYPES.VARINT, defaultValue: e.Long ? e.Long.ZERO : void 0 }, uint64: { name: 'uint64', wireType: e.WIRE_TYPES.VARINT, defaultValue: e.Long ? e.Long.UZERO : void 0 }, sint64: { name: 'sint64', wireType: e.WIRE_TYPES.VARINT, defaultValue: e.Long ? e.Long.ZERO : void 0 }, bool: { name: 'bool', wireType: e.WIRE_TYPES.VARINT, defaultValue: !1 }, double: { name: 'double', wireType: e.WIRE_TYPES.BITS64, defaultValue: 0 }, string: { name: 'string', wireType: e.WIRE_TYPES.LDELIM, defaultValue: '' }, bytes: { name: 'bytes', wireType: e.WIRE_TYPES.LDELIM, defaultValue: null }, fixed32: { name: 'fixed32', wireType: e.WIRE_TYPES.BITS32, defaultValue: 0 }, sfixed32: { name: 'sfixed32', wireType: e.WIRE_TYPES.BITS32, defaultValue: 0 }, fixed64: { name: 'fixed64', wireType: e.WIRE_TYPES.BITS64, defaultValue: e.Long ? e.Long.UZERO : void 0 }, sfixed64: { name: 'sfixed64', wireType: e.WIRE_TYPES.BITS64, defaultValue: e.Long ? e.Long.ZERO : void 0 }, float: { name: 'float', wireType: e.WIRE_TYPES.BITS32, defaultValue: 0 }, enum: { name: 'enum', wireType: e.WIRE_TYPES.VARINT, defaultValue: 0 }, message: { name: 'message', wireType: e.WIRE_TYPES.LDELIM, defaultValue: null }, group: { name: 'group', wireType: e.WIRE_TYPES.STARTGROUP, defaultValue: null } }, e.MAP_KEY_TYPES = [e.TYPES.int32, e.TYPES.sint32, e.TYPES.sfixed32, e.TYPES.uint32, e.TYPES.fixed32, e.TYPES.int64, e.TYPES.sint64, e.TYPES.sfixed64, e.TYPES.uint64, e.TYPES.fixed64, e.TYPES.bool, e.TYPES.string, e.TYPES.bytes], e.ID_MIN = 1, e.ID_MAX = 536870911, e.convertFieldsToCamelCase = !1, e.populateAccessors = !0, e.populateDefaults = !0, e.Util = (function () { var a = {}; return a.IS_NODE = !(typeof process !== 'object' || process + '' != '[object process]' || process.browser), a.XHR = function () { var c; var a = [function () { return new XMLHttpRequest() }, function () { return new ActiveXObject('Msxml2.XMLHTTP') }, function () { return new ActiveXObject('Msxml3.XMLHTTP') }, function () { return new ActiveXObject('Microsoft.XMLHTTP') }]; var b = null; for (c = 0; c < a.length; c++) { try { b = a[c](); } catch (d) { continue } break } if (!b) throw Error('XMLHttpRequest is not supported'); return b }, a.fetch = function (b, c) { if (c && typeof c !== 'function' && (c = null), a.IS_NODE) if (c)g.readFile(b, function (a, b) { a ? c(null) : c('' + b); }); else try { return g.readFileSync(b) } catch (d) { return null } else { var e = a.XHR(); if (e.open('GET', b, c ? !0 : !1), e.setRequestHeader('Accept', 'text/plain'), typeof e.overrideMimeType === 'function' && e.overrideMimeType('text/plain'), !c) return e.send(null), e.status == 200 || e.status == 0 && typeof e.responseText === 'string' ? e.responseText : null; if (e.onreadystatechange = function () { e.readyState == 4 && (e.status == 200 || e.status == 0 && typeof e.responseText === 'string' ? c(e.responseText) : c(null)); }, e.readyState == 4) return; e.send(null); } }, a.toCamelCase = function (a) { return a.replace(/_([a-zA-Z])/g, function (a, b) { return b.toUpperCase() }) }, a }()), e.Lang = { DELIM: /[\s\{\}=;:\[\],'"\(\)<>]/g, RULE: /^(?:required|optional|repeated|map)$/, TYPE: /^(?:double|float|int32|uint32|sint32|int64|uint64|sint64|fixed32|sfixed32|fixed64|sfixed64|bool|string|bytes)$/, NAME: /^[a-zA-Z_][a-zA-Z_0-9]*$/, TYPEDEF: /^[a-zA-Z][a-zA-Z_0-9]*$/, TYPEREF: /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)+$/, FQTYPEREF: /^(?:\.[a-zA-Z][a-zA-Z_0-9]*)+$/, NUMBER: /^-?(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+|([0-9]*(\.[0-9]*)?([Ee][+-]?[0-9]+)?)|inf|nan)$/, NUMBER_DEC: /^(?:[1-9][0-9]*|0)$/, NUMBER_HEX: /^0[xX][0-9a-fA-F]+$/, NUMBER_OCT: /^0[0-7]+$/, NUMBER_FLT: /^([0-9]*(\.[0-9]*)?([Ee][+-]?[0-9]+)?|inf|nan)$/, BOOL: /^(?:true|false)$/i, ID: /^(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+)$/, NEGID: /^\-?(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+)$/, WHITESPACE: /\s/, STRING: /(?:"([^"\\]*(?:\\.[^"\\]*)*)")|(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g, STRING_DQ: /(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g, STRING_SQ: /(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g }, e.DotProto = (function (a, b) {
          function h (a, c) { var d = -1; var e = 1; if (a.charAt(0) == '-' && (e = -1, a = a.substring(1)), b.NUMBER_DEC.test(a))d = parseInt(a); else if (b.NUMBER_HEX.test(a))d = parseInt(a.substring(2), 16); else { if (!b.NUMBER_OCT.test(a)) throw Error('illegal id value: ' + (e < 0 ? '-' : '') + a); d = parseInt(a.substring(1), 8); } if (d = 0 | e * d, !c && d < 0) throw Error('illegal id value: ' + (e < 0 ? '-' : '') + a); return d } function i (a) { var c = 1; if (a.charAt(0) == '-' && (c = -1, a = a.substring(1)), b.NUMBER_DEC.test(a)) return c * parseInt(a, 10); if (b.NUMBER_HEX.test(a)) return c * parseInt(a.substring(2), 16); if (b.NUMBER_OCT.test(a)) return c * parseInt(a.substring(1), 8); if (a === 'inf') return 1 / 0 * c; if (a === 'nan') return 0 / 0; if (b.NUMBER_FLT.test(a)) return c * parseFloat(a); throw Error('illegal number value: ' + (c < 0 ? '-' : '') + a) } function j (a, b, c) { typeof a[b] === 'undefined' ? a[b] = c : (Array.isArray(a[b]) || (a[b] = [a[b]]), a[b].push(c)); } var f; var g; var c = {}; var d = function (a) { this.source = a + '', this.index = 0, this.line = 1, this.stack = [], this._stringOpen = null; }; var e = d.prototype; return e._readString = function () { var c; var a = this._stringOpen === '"' ? b.STRING_DQ : b.STRING_SQ; if (a.lastIndex = this.index - 1, c = a.exec(this.source), !c) throw Error('unterminated string'); return this.index = a.lastIndex, this.stack.push(this._stringOpen), this._stringOpen = null, c[1] }, e.next = function () { var a, c, d, e, f, g; if (this.stack.length > 0) return this.stack.shift(); if (this.index >= this.source.length) return null; if (this._stringOpen !== null) return this._readString(); do { for (a = !1; b.WHITESPACE.test(d = this.source.charAt(this.index));) if (d === '\n' && ++this.line, ++this.index === this.source.length) return null; if (this.source.charAt(this.index) === '/') if (++this.index, this.source.charAt(this.index) === '/') { for (;this.source.charAt(++this.index) !== '\n';) if (this.index == this.source.length) return null; ++this.index, ++this.line, a = !0; } else { if ((d = this.source.charAt(this.index)) !== '*') return '/'; do { if (d === '\n' && ++this.line, ++this.index === this.source.length) return null; c = d, d = this.source.charAt(this.index); } while (c !== '*' || d !== '/'); ++this.index, a = !0; } } while (a); if (this.index === this.source.length) return null; if (e = this.index, b.DELIM.lastIndex = 0, f = b.DELIM.test(this.source.charAt(e++)), !f) for (;e < this.source.length && !b.DELIM.test(this.source.charAt(e));)++e; return g = this.source.substring(this.index, this.index = e), (g === '"' || g === "'") && (this._stringOpen = g), g }, e.peek = function () { if (this.stack.length === 0) { var a = this.next(); if (a === null) return null; this.stack.push(a); } return this.stack[0] }, e.skip = function (a) { var b = this.next(); if (b !== a) throw Error("illegal '" + b + "', '" + a + "' expected") }, e.omit = function (a) { return this.peek() === a ? (this.next(), !0) : !1 }, e.toString = function () { return 'Tokenizer (' + this.index + '/' + this.source.length + ' at line ' + this.line + ')' }, c.Tokenizer = d, f = function (a) { this.tn = new d(a), this.proto3 = !1; }, g = f.prototype, g.parse = function () { var c; var a = { name: '[ROOT]', package: null, messages: [], enums: [], imports: [], options: {}, services: [] }; var d = !0; try { for (;c = this.tn.next();) switch (c) { case 'package':if (!d || a.package !== null) throw Error("unexpected 'package'"); if (c = this.tn.next(), !b.TYPEREF.test(c)) throw Error('illegal package name: ' + c); this.tn.skip(';'), a.package = c; break; case 'import':if (!d) throw Error("unexpected 'import'"); c = this.tn.peek(), c === 'public' && this.tn.next(), c = this._readString(), this.tn.skip(';'), a.imports.push(c); break; case 'syntax':if (!d) throw Error("unexpected 'syntax'"); this.tn.skip('='), (a.syntax = this._readString()) === 'proto3' && (this.proto3 = !0), this.tn.skip(';'); break; case 'message':this._parseMessage(a, null), d = !1; break; case 'enum':this._parseEnum(a), d = !1; break; case 'option':this._parseOption(a); break; case 'service':this._parseService(a); break; case 'extend':this._parseExtend(a); break; default:throw Error("unexpected '" + c + "'") } } catch (e) { throw e.message = 'Parse error at line ' + this.tn.line + ': ' + e.message, e } return delete a.name, a }, f.parse = function (a) { return new f(a).parse() }, g._readString = function () { var b; var c; var a = ''; do { if (c = this.tn.next(), c !== "'" && c !== '"') throw Error('illegal string delimiter: ' + c); a += this.tn.next(), this.tn.skip(c), b = this.tn.peek(); } while (b === '"' || b === '"'); return a }, g._readValue = function (a) { var c = this.tn.peek(); if (c === '"' || c === "'") return this._readString(); if (this.tn.next(), b.NUMBER.test(c)) return i(c); if (b.BOOL.test(c)) return c.toLowerCase() === 'true'; if (a && b.TYPEREF.test(c)) return c; throw Error('illegal value: ' + c) }, g._parseOption = function (a, c) { var f; var d = this.tn.next(); var e = !1; if (d === '(' && (e = !0, d = this.tn.next()), !b.TYPEREF.test(d)) throw Error('illegal option name: ' + d); f = d, e && (this.tn.skip(')'), f = '(' + f + ')', d = this.tn.peek(), b.FQTYPEREF.test(d) && (f += d, this.tn.next())), this.tn.skip('='), this._parseOptionValue(a, f), c || this.tn.skip(';'); }, g._parseOptionValue = function (a, c) { var d = this.tn.peek(); if (d !== '{')j(a.options, c, this._readValue(!0)); else for (this.tn.skip('{'); (d = this.tn.next()) !== '}';) { if (!b.NAME.test(d)) throw Error('illegal option name: ' + c + '.' + d); this.tn.omit(':') ? j(a.options, c + '.' + d, this._readValue(!0)) : this._parseOptionValue(a, c + '.' + d); } }, g._parseService = function (a) { var d; var e; var c = this.tn.next(); if (!b.NAME.test(c)) throw Error('illegal service name at line ' + this.tn.line + ': ' + c); for (d = c, e = { name: d, rpc: {}, options: {} }, this.tn.skip('{'); (c = this.tn.next()) !== '}';) if (c === 'option') this._parseOption(e); else { if (c !== 'rpc') throw Error('illegal service token: ' + c); this._parseServiceRPC(e); } this.tn.omit(';'), a.services.push(e); }, g._parseServiceRPC = function (a) { var e; var f; var c = 'rpc'; var d = this.tn.next(); if (!b.NAME.test(d)) throw Error('illegal rpc service method name: ' + d); if (e = d, f = { request: null, response: null, request_stream: !1, response_stream: !1, options: {} }, this.tn.skip('('), d = this.tn.next(), d.toLowerCase() === 'stream' && (f.request_stream = !0, d = this.tn.next()), !b.TYPEREF.test(d)) throw Error('illegal rpc service request type: ' + d); if (f.request = d, this.tn.skip(')'), d = this.tn.next(), d.toLowerCase() !== 'returns') throw Error('illegal rpc service request type delimiter: ' + d); if (this.tn.skip('('), d = this.tn.next(), d.toLowerCase() === 'stream' && (f.response_stream = !0, d = this.tn.next()), f.response = d, this.tn.skip(')'), d = this.tn.peek(), d === '{') { for (this.tn.next(); (d = this.tn.next()) !== '}';) { if (d !== 'option') throw Error('illegal rpc service token: ' + d); this._parseOption(f); } this.tn.omit(';'); } else this.tn.skip(';'); typeof a[c] === 'undefined' && (a[c] = {}), a[c][e] = f; }, g._parseMessage = function (a, c) { var d = !!c; var e = this.tn.next(); var f = { name: '', fields: [], enums: [], messages: [], options: {}, services: [], oneofs: {} }; if (!b.NAME.test(e)) throw Error('illegal ' + (d ? 'group' : 'message') + ' name: ' + e); for (f.name = e, d && (this.tn.skip('='), c.id = h(this.tn.next()), f.isGroup = !0), e = this.tn.peek(), e === '[' && c && this._parseFieldOptions(c), this.tn.skip('{'); (e = this.tn.next()) !== '}';) if (b.RULE.test(e)) this._parseMessageField(f, e); else if (e === 'oneof') this._parseMessageOneOf(f); else if (e === 'enum') this._parseEnum(f); else if (e === 'message') this._parseMessage(f); else if (e === 'option') this._parseOption(f); else if (e === 'service') this._parseService(f); else if (e === 'extensions')f.extensions = this._parseExtensionRanges(); else if (e === 'reserved') this._parseIgnored(); else if (e === 'extend') this._parseExtend(f); else { if (!b.TYPEREF.test(e)) throw Error('illegal message token: ' + e); if (!this.proto3) throw Error('illegal field rule: ' + e); this._parseMessageField(f, 'optional', e); } return this.tn.omit(';'), a.messages.push(f), f }, g._parseIgnored = function () { for (;this.tn.peek() !== ';';) this.tn.next(); this.tn.skip(';'); }, g._parseMessageField = function (a, c, d) {
            var e, f, g; if (!b.RULE.test(c)) throw Error('illegal message field rule: ' + c); if (e = { rule: c, type: '', name: '', options: {}, id: 0 }, c === 'map') { if (d) throw Error('illegal type: ' + d); if (this.tn.skip('<'), f = this.tn.next(), !b.TYPE.test(f) && !b.TYPEREF.test(f)) throw Error('illegal message field type: ' + f); if (e.keytype = f, this.tn.skip(','), f = this.tn.next(), !b.TYPE.test(f) && !b.TYPEREF.test(f)) throw Error('illegal message field: ' + f); if (e.type = f, this.tn.skip('>'), f = this.tn.next(), !b.NAME.test(f)) throw Error('illegal message field name: ' + f); e.name = f, this.tn.skip('='), e.id = h(this.tn.next()), f = this.tn.peek(), f === '[' && this._parseFieldOptions(e), this.tn.skip(';'); } else if (d = typeof d !== 'undefined' ? d : this.tn.next(), d === 'group') { if (g = this._parseMessage(a, e), !/^[A-Z]/.test(g.name)) throw Error('illegal group name: ' + g.name); e.type = g.name, e.name = g.name.toLowerCase(), this.tn.omit(';'); } else {
              if (!b.TYPE.test(d) && !b.TYPEREF.test(d)) throw Error('illegal message field type: ' + d); if (e.type = d, f = this.tn.next(), !b.NAME.test(f)) throw Error('illegal message field name: ' + f)
              e.name = f, this.tn.skip('='), e.id = h(this.tn.next()), f = this.tn.peek(), f === '[' && this._parseFieldOptions(e), this.tn.skip(';');
            } return a.fields.push(e), e
          }, g._parseMessageOneOf = function (a) { var e; var d; var f; var c = this.tn.next(); if (!b.NAME.test(c)) throw Error('illegal oneof name: ' + c); for (d = c, f = [], this.tn.skip('{'); (c = this.tn.next()) !== '}';)e = this._parseMessageField(a, 'optional', c), e.oneof = d, f.push(e.id); this.tn.omit(';'), a.oneofs[d] = f; }, g._parseFieldOptions = function (a) { this.tn.skip('['); for (var c = !0; (this.tn.peek()) !== ']';)c || this.tn.skip(','), this._parseOption(a, !0), c = !1; this.tn.next(); }, g._parseEnum = function (a) { var e; var c = { name: '', values: [], options: {} }; var d = this.tn.next(); if (!b.NAME.test(d)) throw Error('illegal name: ' + d); for (c.name = d, this.tn.skip('{'); (d = this.tn.next()) !== '}';) if (d === 'option') this._parseOption(c); else { if (!b.NAME.test(d)) throw Error('illegal name: ' + d); this.tn.skip('='), e = { name: d, id: h(this.tn.next(), !0) }, d = this.tn.peek(), d === '[' && this._parseFieldOptions({ options: {} }), this.tn.skip(';'), c.values.push(e); } this.tn.omit(';'), a.enums.push(c); }, g._parseExtensionRanges = function () { var c; var d; var e; var b = []; do { for (d = []; ;) { switch (c = this.tn.next()) { case 'min':e = a.ID_MIN; break; case 'max':e = a.ID_MAX; break; default:e = i(c); } if (d.push(e), d.length === 2) break; if (this.tn.peek() !== 'to') { d.push(e); break } this.tn.next(); }b.push(d); } while (this.tn.omit(',')); return this.tn.skip(';'), b }, g._parseExtend = function (a) { var d; var c = this.tn.next(); if (!b.TYPEREF.test(c)) throw Error('illegal extend reference: ' + c); for (d = { ref: c, fields: [] }, this.tn.skip('{'); (c = this.tn.next()) !== '}';) if (b.RULE.test(c)) this._parseMessageField(d, c); else { if (!b.TYPEREF.test(c)) throw Error('illegal extend token: ' + c); if (!this.proto3) throw Error('illegal field rule: ' + c); this._parseMessageField(d, 'optional', c); } return this.tn.omit(';'), a.messages.push(d), d }, g.toString = function () { return 'Parser at line ' + this.tn.line }, c.Parser = f, c
        }(e, e.Lang)), e.Reflect = (function (a) { function k (b) { if (typeof b === 'string' && (b = a.TYPES[b]), typeof b.defaultValue === 'undefined') throw Error('default value for type ' + b.name + ' is not supported'); return b == a.TYPES.bytes ? new f(0) : b.defaultValue } function l (b, c) { if (b && typeof b.low === 'number' && typeof b.high === 'number' && typeof b.unsigned === 'boolean' && b.low === b.low && b.high === b.high) return new a.Long(b.low, b.high, typeof c === 'undefined' ? b.unsigned : c); if (typeof b === 'string') return a.Long.fromString(b, c || !1, 10); if (typeof b === 'number') return a.Long.fromNumber(b, c || !1); throw Error('not convertible to Long') } function o (b, c) { var d = c.readVarint32(); var e = 7 & d; var f = d >>> 3; switch (e) { case a.WIRE_TYPES.VARINT:do d = c.readUint8(); while ((128 & d) === 128); break; case a.WIRE_TYPES.BITS64:c.offset += 8; break; case a.WIRE_TYPES.LDELIM:d = c.readVarint32(), c.offset += d; break; case a.WIRE_TYPES.STARTGROUP:o(f, c); break; case a.WIRE_TYPES.ENDGROUP:if (f === b) return !1; throw Error('Illegal GROUPEND after unknown group: ' + f + ' (' + b + ' expected)'); case a.WIRE_TYPES.BITS32:c.offset += 4; break; default:throw Error('Illegal wire type in unknown group ' + b + ': ' + e) } return !0 } var g; var h; var i; var j; var m; var n; var p; var q; var r; var s; var t; var u; var v; var w; var x; var y; var z; var A; var B; var c = {}; var d = function (a, b, c) { this.builder = a, this.parent = b, this.name = c, this.className; }; var e = d.prototype; return e.fqn = function () { for (var a = this.name, b = this; ;) { if (b = b.parent, b == null) break; a = b.name + '.' + a; } return a }, e.toString = function (a) { return (a ? this.className + ' ' : '') + this.fqn() }, e.build = function () { throw Error(this.toString(!0) + ' cannot be built directly') }, c.T = d, g = function (a, b, c, e, f) { d.call(this, a, b, c), this.className = 'Namespace', this.children = [], this.options = e || {}, this.syntax = f || 'proto2'; }, h = g.prototype = Object.create(d.prototype), h.getChildren = function (a) { var b, c, d; if (a = a || null, a == null) return this.children.slice(); for (b = [], c = 0, d = this.children.length; d > c; ++c) this.children[c] instanceof a && b.push(this.children[c]); return b }, h.addChild = function (a) { var b; if (b = this.getChild(a.name)) if (b instanceof m.Field && b.name !== b.originalName && this.getChild(b.originalName) === null)b.name = b.originalName; else { if (!(a instanceof m.Field && a.name !== a.originalName && this.getChild(a.originalName) === null)) throw Error('Duplicate name in namespace ' + this.toString(!0) + ': ' + a.name); a.name = a.originalName; } this.children.push(a); }, h.getChild = function (a) { var c; var d; var b = typeof a === 'number' ? 'id' : 'name'; for (c = 0, d = this.children.length; d > c; ++c) if (this.children[c][b] === a) return this.children[c]; return null }, h.resolve = function (a, b) { var g; var d = typeof a === 'string' ? a.split('.') : a; var e = this; var f = 0; if (d[f] === '') { for (;e.parent !== null;)e = e.parent; f++; } do { do { if (!(e instanceof c.Namespace)) { e = null; break } if (g = e.getChild(d[f]), !(g && g instanceof c.T && (!b || g instanceof c.Namespace))) { e = null; break }e = g, f++; } while (f < d.length); if (e != null) break; if (this.parent !== null) return this.parent.resolve(a, b) } while (e != null); return e }, h.qn = function (a) { var e; var f; var b = []; var d = a; do b.unshift(d.name), d = d.parent; while (d !== null); for (e = 1; e <= b.length; e++) if (f = b.slice(b.length - e), a === this.resolve(f, a instanceof c.Namespace)) return f.join('.'); return a.fqn() }, h.build = function () { var e; var c; var d; var a = {}; var b = this.children; for (c = 0, d = b.length; d > c; ++c)e = b[c], e instanceof g && (a[e.name] = e.build()); return Object.defineProperty && Object.defineProperty(a, '$options', { value: this.buildOpt() }), a }, h.buildOpt = function () { var c; var d; var e; var f; var a = {}; var b = Object.keys(this.options); for (c = 0, d = b.length; d > c; ++c)e = b[c], f = this.options[b[c]], a[e] = f; return a }, h.getOption = function (a) { return typeof a === 'undefined' ? this.options : typeof this.options[a] !== 'undefined' ? this.options[a] : null }, c.Namespace = g, i = function (b, c, d, e) { if (this.type = b, this.resolvedType = c, this.isMapKey = d, this.syntax = e, d && a.MAP_KEY_TYPES.indexOf(b) < 0) throw Error('Invalid map key type: ' + b.name) }, j = i.prototype, i.defaultFieldValue = k, j.verifyValue = function (c) { var f; var g; var h; var d = function (a, b) { throw Error('Illegal value for ' + this.toString(!0) + ' of type ' + this.type.name + ': ' + a + ' (' + b + ')') }.bind(this); switch (this.type) { case a.TYPES.int32:case a.TYPES.sint32:case a.TYPES.sfixed32:return (typeof c !== 'number' || c === c && c % 1 !== 0) && d(typeof c, 'not an integer'), c > 4294967295 ? 0 | c : c; case a.TYPES.uint32:case a.TYPES.fixed32:return (typeof c !== 'number' || c === c && c % 1 !== 0) && d(typeof c, 'not an integer'), c < 0 ? c >>> 0 : c; case a.TYPES.int64:case a.TYPES.sint64:case a.TYPES.sfixed64:if (a.Long) try { return l(c, !1) } catch (e) { d(typeof c, e.message); } else d(typeof c, 'requires Long.js'); case a.TYPES.uint64:case a.TYPES.fixed64:if (a.Long) try { return l(c, !0) } catch (e) { d(typeof c, e.message); } else d(typeof c, 'requires Long.js'); case a.TYPES.bool:return typeof c !== 'boolean' && d(typeof c, 'not a boolean'), c; case a.TYPES.float:case a.TYPES.double:return typeof c !== 'number' && d(typeof c, 'not a number'), c; case a.TYPES.string:return typeof c === 'string' || c && c instanceof String || d(typeof c, 'not a string'), '' + c; case a.TYPES.bytes:return b.isByteBuffer(c) ? c : b.wrap(c); case a.TYPES.enum:for (f = this.resolvedType.getChildren(a.Reflect.Enum.Value), h = 0; h < f.length; h++) { if (f[h].name == c) return f[h].id; if (f[h].id == c) return f[h].id } if (this.syntax === 'proto3') return (typeof c !== 'number' || c === c && c % 1 !== 0) && d(typeof c, 'not an integer'), (c > 4294967295 || c < 0) && d(typeof c, 'not in range for uint32'), c; d(c, 'not a valid enum value'); case a.TYPES.group:case a.TYPES.message:if (c && typeof c === 'object' || d(typeof c, 'object expected'), c instanceof this.resolvedType.clazz) return c; if (c instanceof a.Builder.Message) { g = {}; for (h in c)c.hasOwnProperty(h) && (g[h] = c[h]); c = g; } return new this.resolvedType.clazz(c) } throw Error('[INTERNAL] Illegal value for ' + this.toString(!0) + ': ' + c + ' (undefined type ' + this.type + ')') }, j.calculateLength = function (b, c) { if (c === null) return 0; var d; switch (this.type) { case a.TYPES.int32:return c < 0 ? f.calculateVarint64(c) : f.calculateVarint32(c); case a.TYPES.uint32:return f.calculateVarint32(c); case a.TYPES.sint32:return f.calculateVarint32(f.zigZagEncode32(c)); case a.TYPES.fixed32:case a.TYPES.sfixed32:case a.TYPES.float:return 4; case a.TYPES.int64:case a.TYPES.uint64:return f.calculateVarint64(c); case a.TYPES.sint64:return f.calculateVarint64(f.zigZagEncode64(c)); case a.TYPES.fixed64:case a.TYPES.sfixed64:return 8; case a.TYPES.bool:return 1; case a.TYPES.enum:return f.calculateVarint32(c); case a.TYPES.double:return 8; case a.TYPES.string:return d = f.calculateUTF8Bytes(c), f.calculateVarint32(d) + d; case a.TYPES.bytes:if (c.remaining() < 0) throw Error('Illegal value for ' + this.toString(!0) + ': ' + c.remaining() + ' bytes remaining'); return f.calculateVarint32(c.remaining()) + c.remaining(); case a.TYPES.message:return d = this.resolvedType.calculate(c), f.calculateVarint32(d) + d; case a.TYPES.group:return d = this.resolvedType.calculate(c), d + f.calculateVarint32(b << 3 | a.WIRE_TYPES.ENDGROUP) } throw Error('[INTERNAL] Illegal value to encode in ' + this.toString(!0) + ': ' + c + ' (unknown type)') }, j.encodeValue = function (b, c, d) { var e, g; if (c === null) return d; switch (this.type) { case a.TYPES.int32:c < 0 ? d.writeVarint64(c) : d.writeVarint32(c); break; case a.TYPES.uint32:d.writeVarint32(c); break; case a.TYPES.sint32:d.writeVarint32ZigZag(c); break; case a.TYPES.fixed32:d.writeUint32(c); break; case a.TYPES.sfixed32:d.writeInt32(c); break; case a.TYPES.int64:case a.TYPES.uint64:d.writeVarint64(c); break; case a.TYPES.sint64:d.writeVarint64ZigZag(c); break; case a.TYPES.fixed64:d.writeUint64(c); break; case a.TYPES.sfixed64:d.writeInt64(c); break; case a.TYPES.bool:typeof c === 'string' ? d.writeVarint32(c.toLowerCase() === 'false' ? 0 : !!c) : d.writeVarint32(c ? 1 : 0); break; case a.TYPES.enum:d.writeVarint32(c); break; case a.TYPES.float:d.writeFloat32(c); break; case a.TYPES.double:d.writeFloat64(c); break; case a.TYPES.string:d.writeVString(c); break; case a.TYPES.bytes:if (c.remaining() < 0) throw Error('Illegal value for ' + this.toString(!0) + ': ' + c.remaining() + ' bytes remaining'); e = c.offset, d.writeVarint32(c.remaining()), d.append(c), c.offset = e; break; case a.TYPES.message:g = (new f()).LE(), this.resolvedType.encode(c, g), d.writeVarint32(g.offset), d.append(g.flip()); break; case a.TYPES.group:this.resolvedType.encode(c, d), d.writeVarint32(b << 3 | a.WIRE_TYPES.ENDGROUP); break; default:throw Error('[INTERNAL] Illegal value to encode in ' + this.toString(!0) + ': ' + c + ' (unknown type)') } return d }, j.decode = function (b, c, d) { if (c != this.type.wireType) throw Error('Unexpected wire type for element'); var e, f; switch (this.type) { case a.TYPES.int32:return 0 | b.readVarint32(); case a.TYPES.uint32:return b.readVarint32() >>> 0; case a.TYPES.sint32:return 0 | b.readVarint32ZigZag(); case a.TYPES.fixed32:return b.readUint32() >>> 0; case a.TYPES.sfixed32:return 0 | b.readInt32(); case a.TYPES.int64:return b.readVarint64(); case a.TYPES.uint64:return b.readVarint64().toUnsigned(); case a.TYPES.sint64:return b.readVarint64ZigZag(); case a.TYPES.fixed64:return b.readUint64(); case a.TYPES.sfixed64:return b.readInt64(); case a.TYPES.bool:return !!b.readVarint32(); case a.TYPES.enum:return b.readVarint32(); case a.TYPES.float:return b.readFloat(); case a.TYPES.double:return b.readDouble(); case a.TYPES.string:return b.readVString(); case a.TYPES.bytes:if (f = b.readVarint32(), b.remaining() < f) throw Error('Illegal number of bytes for ' + this.toString(!0) + ': ' + f + ' required but got only ' + b.remaining()); return e = b.clone(), e.limit = e.offset + f, b.offset += f, e; case a.TYPES.message:return f = b.readVarint32(), this.resolvedType.decode(b, f); case a.TYPES.group:return this.resolvedType.decode(b, -1, d) } throw Error('[INTERNAL] Illegal decode type') }, j.valueFromString = function (b) { if (!this.isMapKey) throw Error('valueFromString() called on non-map-key element'); switch (this.type) { case a.TYPES.int32:case a.TYPES.sint32:case a.TYPES.sfixed32:case a.TYPES.uint32:case a.TYPES.fixed32:return this.verifyValue(parseInt(b)); case a.TYPES.int64:case a.TYPES.sint64:case a.TYPES.sfixed64:case a.TYPES.uint64:case a.TYPES.fixed64:return this.verifyValue(b); case a.TYPES.bool:return b === 'true'; case a.TYPES.string:return this.verifyValue(b); case a.TYPES.bytes:return f.fromBinary(b) } }, j.valueToString = function (b) { if (!this.isMapKey) throw Error('valueToString() called on non-map-key element'); return this.type === a.TYPES.bytes ? b.toString('binary') : b.toString() }, c.Element = i, m = function (a, b, c, d, e, f) { g.call(this, a, b, c, d, f), this.className = 'Message', this.extensions = void 0, this.clazz = null, this.isGroup = !!e, this._fields = null, this._fieldsById = null, this._fieldsByName = null; }, n = m.prototype = Object.create(g.prototype), n.build = function (c) { var d, h, e, g; if (this.clazz && !c) return this.clazz; for (d = (function (a, c) { function k (b, c, d, e) { var g, h, i, j, l, m, n; if (b === null || typeof b !== 'object') return e && e instanceof a.Reflect.Enum && (g = a.Reflect.Enum.getName(e.object, b), g !== null) ? g : b; if (f.isByteBuffer(b)) return c ? b.toBase64() : b.toBuffer(); if (a.Long.isLong(b)) return d ? b.toString() : a.Long.fromValue(b); if (Array.isArray(b)) return h = [], b.forEach(function (a, b) { h[b] = k(a, c, d, e); }), h; if (h = {}, b instanceof a.Map) { for (i = b.entries(), j = i.next(); !j.done; j = i.next())h[b.keyElem.valueToString(j.value[0])] = k(j.value[1], c, d, b.valueElem.resolvedType); return h }l = b.$type, m = void 0; for (n in b)b.hasOwnProperty(n) && (h[n] = l && (m = l.getChild(n)) ? k(b[n], c, d, m.resolvedType) : k(b[n], c, d)); return h } var i; var j; var d = c.getChildren(a.Reflect.Message.Field); var e = c.getChildren(a.Reflect.Message.OneOf); var g = function (b) { var i, j, k, l; for (a.Builder.Message.call(this), i = 0, j = e.length; j > i; ++i) this[e[i].name] = null; for (i = 0, j = d.length; j > i; ++i)k = d[i], this[k.name] = k.repeated ? [] : k.map ? new a.Map(k) : null, !k.required && c.syntax !== 'proto3' || k.defaultValue === null || (this[k.name] = k.defaultValue); if (arguments.length > 0) if (arguments.length !== 1 || b === null || typeof b !== 'object' || !(typeof b.encode !== 'function' || b instanceof g) || Array.isArray(b) || b instanceof a.Map || f.isByteBuffer(b) || b instanceof ArrayBuffer || a.Long && b instanceof a.Long) for (i = 0, j = arguments.length; j > i; ++i) typeof (l = arguments[i]) !== 'undefined' && this.$set(d[i].name, l); else this.$set(b); }; var h = g.prototype = Object.create(a.Builder.Message.prototype); for (h.add = function (b, d, e) { var f = c._fieldsByName[b]; if (!e) { if (!f) throw Error(this + '#' + b + ' is undefined'); if (!(f instanceof a.Reflect.Message.Field)) throw Error(this + '#' + b + ' is not a field: ' + f.toString(!0)); if (!f.repeated) throw Error(this + '#' + b + ' is not a repeated field'); d = f.verifyValue(d, !0); } return this[b] === null && (this[b] = []), this[b].push(d), this }, h.$add = h.add, h.set = function (b, d, e) { var f, g, h; if (b && typeof b === 'object') { e = d; for (f in b)b.hasOwnProperty(f) && typeof (d = b[f]) !== 'undefined' && this.$set(f, d, e); return this } if (g = c._fieldsByName[b], e) this[b] = d; else { if (!g) throw Error(this + '#' + b + ' is not a field: undefined'); if (!(g instanceof a.Reflect.Message.Field)) throw Error(this + '#' + b + ' is not a field: ' + g.toString(!0)); this[g.name] = d = g.verifyValue(d); } return g && g.oneof && (h = this[g.oneof.name], d !== null ? (h !== null && h !== g.name && (this[h] = null), this[g.oneof.name] = g.name) : h === b && (this[g.oneof.name] = null)), this }, h.$set = h.set, h.get = function (b, d) { if (d) return this[b]; var e = c._fieldsByName[b]; if (!(e && e instanceof a.Reflect.Message.Field)) throw Error(this + '#' + b + ' is not a field: undefined'); if (!(e instanceof a.Reflect.Message.Field)) throw Error(this + '#' + b + ' is not a field: ' + e.toString(!0)); return this[e.name] }, h.$get = h.get, i = 0; i < d.length; i++)j = d[i], j instanceof a.Reflect.Message.ExtensionField || c.builder.options.populateAccessors && (function (a) { var d; var e; var f; var b = a.originalName.replace(/(_[a-zA-Z])/g, function (a) { return a.toUpperCase().replace('_', '') }); b = b.substring(0, 1).toUpperCase() + b.substring(1), d = a.originalName.replace(/([A-Z])/g, function (a) { return '_' + a }), e = function (b, c) { return this[a.name] = c ? b : a.verifyValue(b), this }, f = function () { return this[a.name] }, c.getChild('set' + b) === null && (h['set' + b] = e), c.getChild('set_' + d) === null && (h['set_' + d] = e), c.getChild('get' + b) === null && (h['get' + b] = f), c.getChild('get_' + d) === null && (h['get_' + d] = f); }(j)); return h.encode = function (a, d) { var e, f; typeof a === 'boolean' && (d = a, a = void 0), e = !1, a || (a = new b(), e = !0), f = a.littleEndian; try { return c.encode(this, a.LE(), d), (e ? a.flip() : a).LE(f) } catch (g) { throw a.LE(f), g } }, g.encode = function (a, b, c) { return new g(a).encode(b, c) }, h.calculate = function () { return c.calculate(this) }, h.encodeDelimited = function (a) { var d; var b = !1; return a || (a = new f(), b = !0), d = (new f()).LE(), c.encode(this, d).flip(), a.writeVarint32(d.remaining()), a.append(d), b ? a.flip() : a }, h.encodeAB = function () { try { return this.encode().toArrayBuffer() } catch (a) { throw a.encoded && (a.encoded = a.encoded.toArrayBuffer()), a } }, h.toArrayBuffer = h.encodeAB, h.encodeNB = function () { try { return this.encode().toBuffer() } catch (a) { throw a.encoded && (a.encoded = a.encoded.toBuffer()), a } }, h.toBuffer = h.encodeNB, h.encode64 = function () { try { return this.encode().toBase64() } catch (a) { throw a.encoded && (a.encoded = a.encoded.toBase64()), a } }, h.toBase64 = h.encode64, h.encodeHex = function () { try { return this.encode().toHex() } catch (a) { throw a.encoded && (a.encoded = a.encoded.toHex()), a } }, h.toHex = h.encodeHex, h.toRaw = function (a, b) { return k(this, !!a, !!b, this.$type) }, h.encodeJSON = function () { return JSON.stringify(k(this, !0, !0, this.$type)) }, g.decode = function (a, b) { var d, e; typeof a === 'string' && (a = f.wrap(a, b || 'base64')), a = f.isByteBuffer(a) ? a : f.wrap(a), d = a.littleEndian; try { return e = c.decode(a.LE()), a.LE(d), e } catch (g) { throw a.LE(d), g } }, g.decodeDelimited = function (a, b) { var d, e, g; if (typeof a === 'string' && (a = f.wrap(a, b || 'base64')), a = f.isByteBuffer(a) ? a : f.wrap(a), a.remaining() < 1) return null; if (d = a.offset, e = a.readVarint32(), a.remaining() < e) return a.offset = d, null; try { return g = c.decode(a.slice(a.offset, a.offset + e).LE()), a.offset += e, g } catch (h) { throw a.offset += e, h } }, g.decode64 = function (a) { return g.decode(a, 'base64') }, g.decodeHex = function (a) { return g.decode(a, 'hex') }, g.decodeJSON = function (a) { return new g(JSON.parse(a)) }, h.toString = function () { return c.toString() }, Object.defineProperty && (Object.defineProperty(g, '$options', { value: c.buildOpt() }), Object.defineProperty(h, '$options', { value: g.$options }), Object.defineProperty(g, '$type', { value: c }), Object.defineProperty(h, '$type', { value: c })), g }(a, this)), this._fields = [], this._fieldsById = {}, this._fieldsByName = {}, e = 0, g = this.children.length; g > e; e++) if (h = this.children[e], h instanceof t || h instanceof m || h instanceof x) { if (d.hasOwnProperty(h.name)) throw Error('Illegal reflect child of ' + this.toString(!0) + ': ' + h.toString(!0) + " cannot override static property '" + h.name + "'"); d[h.name] = h.build(); } else if (h instanceof m.Field)h.build(), this._fields.push(h), this._fieldsById[h.id] = h, this._fieldsByName[h.name] = h; else if (!(h instanceof m.OneOf || h instanceof w)) throw Error('Illegal reflect child of ' + this.toString(!0) + ': ' + this.children[e].toString(!0)); return this.clazz = d }, n.encode = function (a, b, c) { var e; var h; var f; var g; var i; var d = null; for (f = 0, g = this._fields.length; g > f; ++f)e = this._fields[f], h = a[e.name], e.required && h === null ? d === null && (d = e) : e.encode(c ? h : e.verifyValue(h), b, a); if (d !== null) throw i = Error('Missing at least one required field for ' + this.toString(!0) + ': ' + d), i.encoded = b, i; return b }, n.calculate = function (a) { for (var e, f, b = 0, c = 0, d = this._fields.length; d > c; ++c) { if (e = this._fields[c], f = a[e.name], e.required && f === null) throw Error('Missing at least one required field for ' + this.toString(!0) + ': ' + e); b += e.calculate(f, a); } return b }, n.decode = function (b, c, d) { var g, h, i, j, e, f, k, l, m, n, p, q; for (c = typeof c === 'number' ? c : -1, e = b.offset, f = new this.clazz(); b.offset < e + c || c === -1 && b.remaining() > 0;) { if (g = b.readVarint32(), h = 7 & g, i = g >>> 3, h === a.WIRE_TYPES.ENDGROUP) { if (i !== d) throw Error('Illegal group end indicator for ' + this.toString(!0) + ': ' + i + ' (' + (d ? d + ' expected' : 'not a group') + ')'); break } if (j = this._fieldsById[i])j.repeated && !j.options.packed ? f[j.name].push(j.decode(h, b)) : j.map ? (l = j.decode(h, b), f[j.name].set(l[0], l[1])) : (f[j.name] = j.decode(h, b), j.oneof && (m = f[j.oneof.name], m !== null && m !== j.name && (f[m] = null), f[j.oneof.name] = j.name)); else switch (h) { case a.WIRE_TYPES.VARINT:b.readVarint32(); break; case a.WIRE_TYPES.BITS32:b.offset += 4; break; case a.WIRE_TYPES.BITS64:b.offset += 8; break; case a.WIRE_TYPES.LDELIM:k = b.readVarint32(), b.offset += k; break; case a.WIRE_TYPES.STARTGROUP:for (;o(i, b););break; default:throw Error('Illegal wire type for unknown field ' + i + ' in ' + this.toString(!0) + '#decode: ' + h) } } for (n = 0, p = this._fields.length; p > n; ++n) if (j = this._fields[n], f[j.name] === null) if (this.syntax === 'proto3')f[j.name] = j.defaultValue; else { if (j.required) throw q = Error('Missing at least one required field for ' + this.toString(!0) + ': ' + j.name), q.decoded = f, q; a.populateDefaults && j.defaultValue !== null && (f[j.name] = j.defaultValue); } return f }, c.Message = m, p = function (b, c, e, f, g, h, i, j, k, l) { d.call(this, b, c, h), this.className = 'Message.Field', this.required = e === 'required', this.repeated = e === 'repeated', this.map = e === 'map', this.keyType = f || null, this.type = g, this.resolvedType = null, this.id = i, this.options = j || {}, this.defaultValue = null, this.oneof = k || null, this.syntax = l || 'proto2', this.originalName = this.name, this.element = null, this.keyElement = null, !this.builder.options.convertFieldsToCamelCase || this instanceof m.ExtensionField || (this.name = a.Util.toCamelCase(this.name)); }, q = p.prototype = Object.create(d.prototype), q.build = function () { this.element = new i(this.type, this.resolvedType, !1, this.syntax), this.map && (this.keyElement = new i(this.keyType, void 0, !0, this.syntax)), this.syntax !== 'proto3' || this.repeated || this.map ? typeof this.options.default !== 'undefined' && (this.defaultValue = this.verifyValue(this.options.default)) : this.defaultValue = i.defaultFieldValue(this.type); }, q.verifyValue = function (b, c) { var d, e, f; if (c = c || !1, d = function (a, b) { throw Error('Illegal value for ' + this.toString(!0) + ' of type ' + this.type.name + ': ' + a + ' (' + b + ')') }.bind(this), b === null) return this.required && d(typeof b, 'required'), this.syntax === 'proto3' && this.type !== a.TYPES.message && d(typeof b, 'proto3 field without field presence cannot be null'), null; if (this.repeated && !c) { for (Array.isArray(b) || (b = [b]), f = [], e = 0; e < b.length; e++)f.push(this.element.verifyValue(b[e])); return f } return this.map && !c ? b instanceof a.Map ? b : (b instanceof Object || d(typeof b, 'expected ProtoBuf.Map or raw object for map field'), new a.Map(this, b)) : (!this.repeated && Array.isArray(b) && d(typeof b, 'no array expected'), this.element.verifyValue(b)) }, q.hasWirePresence = function (b, c) { if (this.syntax !== 'proto3') return b !== null; if (this.oneof && c[this.oneof.name] === this.name) return !0; switch (this.type) { case a.TYPES.int32:case a.TYPES.sint32:case a.TYPES.sfixed32:case a.TYPES.uint32:case a.TYPES.fixed32:return b !== 0; case a.TYPES.int64:case a.TYPES.sint64:case a.TYPES.sfixed64:case a.TYPES.uint64:case a.TYPES.fixed64:return b.low !== 0 || b.high !== 0; case a.TYPES.bool:return b; case a.TYPES.float:case a.TYPES.double:return b !== 0; case a.TYPES.string:return b.length > 0; case a.TYPES.bytes:return b.remaining() > 0; case a.TYPES.enum:return b !== 0; case a.TYPES.message:return b !== null; default:return !0 } }, q.encode = function (b, c, d) { var e, g, h, i, j; if (this.type === null || typeof this.type !== 'object') throw Error('[INTERNAL] Unresolved type in ' + this.toString(!0) + ': ' + this.type); if (b === null || this.repeated && b.length == 0) return c; try { if (this.repeated) if (this.options.packed && a.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0) { for (c.writeVarint32(this.id << 3 | a.WIRE_TYPES.LDELIM), c.ensureCapacity(c.offset += 1), g = c.offset, e = 0; e < b.length; e++) this.element.encodeValue(this.id, b[e], c); h = c.offset - g, i = f.calculateVarint32(h), i > 1 && (j = c.slice(g, c.offset), g += i - 1, c.offset = g, c.append(j)), c.writeVarint32(h, g - i); } else for (e = 0; e < b.length; e++)c.writeVarint32(this.id << 3 | this.type.wireType), this.element.encodeValue(this.id, b[e], c); else this.map ? b.forEach(function (b, d) { var g = f.calculateVarint32(8 | this.keyType.wireType) + this.keyElement.calculateLength(1, d) + f.calculateVarint32(16 | this.type.wireType) + this.element.calculateLength(2, b); c.writeVarint32(this.id << 3 | a.WIRE_TYPES.LDELIM), c.writeVarint32(g), c.writeVarint32(8 | this.keyType.wireType), this.keyElement.encodeValue(1, d, c), c.writeVarint32(16 | this.type.wireType), this.element.encodeValue(2, b, c); }, this) : this.hasWirePresence(b, d) && (c.writeVarint32(this.id << 3 | this.type.wireType), this.element.encodeValue(this.id, b, c)); } catch (k) { throw Error('Illegal value for ' + this.toString(!0) + ': ' + b + ' (' + k + ')') } return c }, q.calculate = function (b, c) { var d, e, g; if (b = this.verifyValue(b), this.type === null || typeof this.type !== 'object') throw Error('[INTERNAL] Unresolved type in ' + this.toString(!0) + ': ' + this.type); if (b === null || this.repeated && b.length == 0) return 0; d = 0; try { if (this.repeated) if (this.options.packed && a.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0) { for (d += f.calculateVarint32(this.id << 3 | a.WIRE_TYPES.LDELIM), g = 0, e = 0; e < b.length; e++)g += this.element.calculateLength(this.id, b[e]); d += f.calculateVarint32(g), d += g; } else for (e = 0; e < b.length; e++)d += f.calculateVarint32(this.id << 3 | this.type.wireType), d += this.element.calculateLength(this.id, b[e]); else this.map ? b.forEach(function (b, c) { var g = f.calculateVarint32(8 | this.keyType.wireType) + this.keyElement.calculateLength(1, c) + f.calculateVarint32(16 | this.type.wireType) + this.element.calculateLength(2, b); d += f.calculateVarint32(this.id << 3 | a.WIRE_TYPES.LDELIM), d += f.calculateVarint32(g), d += g; }, this) : this.hasWirePresence(b, c) && (d += f.calculateVarint32(this.id << 3 | this.type.wireType), d += this.element.calculateLength(this.id, b)); } catch (h) { throw Error('Illegal value for ' + this.toString(!0) + ': ' + b + ' (' + h + ')') } return d }, q.decode = function (b, c, d) { var e; var f; var h; var j; var k; var l; var m; var g = !this.map && b == this.type.wireType || !d && this.repeated && this.options.packed && b == a.WIRE_TYPES.LDELIM || this.map && b == a.WIRE_TYPES.LDELIM; if (!g) throw Error('Illegal wire type for field ' + this.toString(!0) + ': ' + b + ' (' + this.type.wireType + ' expected)'); if (b == a.WIRE_TYPES.LDELIM && this.repeated && this.options.packed && a.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0 && !d) { for (f = c.readVarint32(), f = c.offset + f, h = []; c.offset < f;)h.push(this.decode(this.type.wireType, c, !0)); return h } if (this.map) { if (j = i.defaultFieldValue(this.keyType), e = i.defaultFieldValue(this.type), f = c.readVarint32(), c.remaining() < f) throw Error('Illegal number of bytes for ' + this.toString(!0) + ': ' + f + ' required but got only ' + c.remaining()); for (k = c.clone(), k.limit = k.offset + f, c.offset += f; k.remaining() > 0;) if (l = k.readVarint32(), b = 7 & l, m = l >>> 3, m === 1)j = this.keyElement.decode(k, b, m); else { if (m !== 2) throw Error('Unexpected tag in map field key/value submessage'); e = this.element.decode(k, b, m); } return [j, e] } return this.element.decode(c, b, this.id) }, c.Message.Field = p, r = function (a, b, c, d, e, f, g) { p.call(this, a, b, c, null, d, e, f, g), this.extension; }, r.prototype = Object.create(p.prototype), c.Message.ExtensionField = r, s = function (a, b, c) { d.call(this, a, b, c), this.fields = []; }, c.Message.OneOf = s, t = function (a, b, c, d, e) { g.call(this, a, b, c, d, e), this.className = 'Enum', this.object = null; }, t.getName = function (a, b) { var e; var d; var c = Object.keys(a); for (d = 0; d < c.length; ++d) if (a[e = c[d]] === b) return e; return null }, u = t.prototype = Object.create(g.prototype), u.build = function (b) { var c, d, e, f; if (this.object && !b) return this.object; for (c = new a.Builder.Enum(), d = this.getChildren(t.Value), e = 0, f = d.length; f > e; ++e)c[d[e].name] = d[e].id; return Object.defineProperty && Object.defineProperty(c, '$options', { value: this.buildOpt(), enumerable: !1 }), this.object = c }, c.Enum = t, v = function (a, b, c, e) { d.call(this, a, b, c), this.className = 'Enum.Value', this.id = e; }, v.prototype = Object.create(d.prototype), c.Enum.Value = v, w = function (a, b, c, e) { d.call(this, a, b, c), this.field = e; }, w.prototype = Object.create(d.prototype), c.Extension = w, x = function (a, b, c, d) { g.call(this, a, b, c, d), this.className = 'Service', this.clazz = null; }, y = x.prototype = Object.create(g.prototype), y.build = function (b) { return this.clazz && !b ? this.clazz : this.clazz = (function (a, b) { var g; var c = function (b) { a.Builder.Service.call(this), this.rpcImpl = b || function (a, b, c) { setTimeout(c.bind(this, Error('Not implemented, see: https://github.com/dcodeIO/ProtoBuf.js/wiki/Services')), 0); }; }; var d = c.prototype = Object.create(a.Builder.Service.prototype); var e = b.getChildren(a.Reflect.Service.RPCMethod); for (g = 0; g < e.length; g++)!(function (a) { d[a.name] = function (c, d) { try { try { c = a.resolvedRequestType.clazz.decode(f.wrap(c)); } catch (e) { if (!(e instanceof TypeError)) throw e } if (c === null || typeof c !== 'object') throw Error('Illegal arguments'); c instanceof a.resolvedRequestType.clazz || (c = new a.resolvedRequestType.clazz(c)), this.rpcImpl(a.fqn(), c, function (c, e) { if (c) return d(c), void 0; try { e = a.resolvedResponseType.clazz.decode(e); } catch (f) {} return e && e instanceof a.resolvedResponseType.clazz ? (d(null, e), void 0) : (d(Error('Illegal response type received in service method ' + b.name + '#' + a.name)), void 0) }); } catch (e) { setTimeout(d.bind(this, e), 0); } }, c[a.name] = function (b, d, e) { new c(b)[a.name](d, e); }, Object.defineProperty && (Object.defineProperty(c[a.name], '$options', { value: a.buildOpt() }), Object.defineProperty(d[a.name], '$options', { value: c[a.name].$options })); }(e[g])); return Object.defineProperty && (Object.defineProperty(c, '$options', { value: b.buildOpt() }), Object.defineProperty(d, '$options', { value: c.$options }), Object.defineProperty(c, '$type', { value: b }), Object.defineProperty(d, '$type', { value: b })), c }(a, this)) }, c.Service = x, z = function (a, b, c, e) { d.call(this, a, b, c), this.className = 'Service.Method', this.options = e || {}; }, A = z.prototype = Object.create(d.prototype), A.buildOpt = h.buildOpt, c.Service.Method = z, B = function (a, b, c, d, e, f, g, h) { z.call(this, a, b, c, h), this.className = 'Service.RPCMethod', this.requestName = d, this.responseName = e, this.requestStream = f, this.responseStream = g, this.resolvedRequestType = null, this.resolvedResponseType = null; }, B.prototype = Object.create(z.prototype), c.Service.RPCMethod = B, c }(e)), e.Builder = (function (a, b, c) {
          function f (a) { a.messages && a.messages.forEach(function (b) { b.syntax = a.syntax, f(b); }), a.enums && a.enums.forEach(function (b) { b.syntax = a.syntax; }); } var d = function (a) { this.ns = new c.Namespace(this, null, ''), this.ptr = this.ns, this.resolved = !1, this.result = null, this.files = {}, this.importRoot = null, this.options = a || {}; }; var e = d.prototype; return d.isMessage = function (a) { return typeof a.name !== 'string' ? !1 : typeof a.values !== 'undefined' || typeof a.rpc !== 'undefined' ? !1 : !0 }, d.isMessageField = function (a) { return typeof a.rule !== 'string' || typeof a.name !== 'string' || typeof a.type !== 'string' || typeof a.id === 'undefined' ? !1 : !0 }, d.isEnum = function (a) { return typeof a.name !== 'string' ? !1 : typeof a.values !== 'undefined' && Array.isArray(a.values) && a.values.length !== 0 ? !0 : !1 }, d.isService = function (a) { return typeof a.name === 'string' && typeof a.rpc === 'object' && a.rpc ? !0 : !1 }, d.isExtend = function (a) { return typeof a.ref !== 'string' ? !1 : !0 }, e.reset = function () { return this.ptr = this.ns, this }, e.define = function (a) { if (typeof a !== 'string' || !b.TYPEREF.test(a)) throw Error('illegal namespace: ' + a); return a.split('.').forEach(function (a) { var b = this.ptr.getChild(a); b === null && this.ptr.addChild(b = new c.Namespace(this, this.ptr, a)), this.ptr = b; }, this), this }, e.create = function (b) {
            var e, f, g, h, i; if (!b) return this; if (Array.isArray(b)) { if (b.length === 0) return this; b = b.slice(); } else b = [b]; for (e = [b]; e.length > 0;) {
              if (b = e.pop(), !Array.isArray(b)) throw Error('not a valid namespace: ' + JSON.stringify(b)); for (;b.length > 0;) {
                if (f = b.shift(), d.isMessage(f)) { if (g = new c.Message(this, this.ptr, f.name, f.options, f.isGroup, f.syntax), h = {}, f.oneofs && Object.keys(f.oneofs).forEach(function (a) { g.addChild(h[a] = new c.Message.OneOf(this, g, a)); }, this), f.fields && f.fields.forEach(function (a) { if (g.getChild(0 | a.id) !== null) throw Error('duplicate or invalid field id in ' + g.name + ': ' + a.id); if (a.options && typeof a.options !== 'object') throw Error('illegal field options in ' + g.name + '#' + a.name); var b = null; if (typeof a.oneof === 'string' && !(b = h[a.oneof])) throw Error('illegal oneof in ' + g.name + '#' + a.name + ': ' + a.oneof); a = new c.Message.Field(this, g, a.rule, a.keytype, a.type, a.name, a.id, a.options, b, f.syntax), b && b.fields.push(a), g.addChild(a); }, this), i = [], f.enums && f.enums.forEach(function (a) { i.push(a); }), f.messages && f.messages.forEach(function (a) { i.push(a); }), f.services && f.services.forEach(function (a) { i.push(a); }), f.extensions && (g.extensions = typeof f.extensions[0] === 'number' ? [f.extensions] : f.extensions), this.ptr.addChild(g), i.length > 0) { e.push(b), b = i, i = null, this.ptr = g, g = null; continue }i = null; } else if (d.isEnum(f))g = new c.Enum(this, this.ptr, f.name, f.options, f.syntax), f.values.forEach(function (a) { g.addChild(new c.Enum.Value(this, g, a.name, a.id)); }, this), this.ptr.addChild(g); else if (d.isService(f))g = new c.Service(this, this.ptr, f.name, f.options), Object.keys(f.rpc).forEach(function (a) { var b = f.rpc[a]; g.addChild(new c.Service.RPCMethod(this, g, a, b.request, b.response, !!b.request_stream, !!b.response_stream, b.options)); }, this), this.ptr.addChild(g); else {
                  if (!d.isExtend(f)) throw Error('not a valid definition: ' + JSON.stringify(f)); if (g = this.ptr.resolve(f.ref, !0)) {
                    f.fields.forEach(function (b) {
                      var d, e, f, h; if (g.getChild(0 | b.id) !== null) throw Error('duplicate extended field id in ' + g.name + ': ' + b.id)
                      if (g.extensions && (d = !1, g.extensions.forEach(function (a) { b.id >= a[0] && b.id <= a[1] && (d = !0); }), !d)) throw Error('illegal extended field id in ' + g.name + ': ' + b.id + ' (not within valid ranges)'); e = b.name, this.options.convertFieldsToCamelCase && (e = a.Util.toCamelCase(e)), f = new c.Message.ExtensionField(this, g, b.rule, b.type, this.ptr.fqn() + '.' + e, b.id, b.options), h = new c.Extension(this, this.ptr, b.name, f), f.extension = h, this.ptr.addChild(h), g.addChild(f);
                    }, this);
                  } else if (!/\.?google\.protobuf\./.test(f.ref)) throw Error('extended message ' + f.ref + ' is not defined')
                }f = null, g = null;
              }b = null, this.ptr = this.ptr.parent;
            } return this.resolved = !1, this.result = null, this
          }, e.import = function (b, c) { var e; var g; var h; var i; var j; var k; var l; var m; var d = '/'; if (typeof c === 'string') { if (a.Util.IS_NODE, this.files[c] === !0) return this.reset(); this.files[c] = !0; } else if (typeof c === 'object') { if (e = c.root, a.Util.IS_NODE, (e.indexOf('\\') >= 0 || c.file.indexOf('\\') >= 0) && (d = '\\'), g = e + d + c.file, this.files[g] === !0) return this.reset(); this.files[g] = !0; } if (b.imports && b.imports.length > 0) { for (i = !1, typeof c === 'object' ? (this.importRoot = c.root, i = !0, h = this.importRoot, c = c.file, (h.indexOf('\\') >= 0 || c.indexOf('\\') >= 0) && (d = '\\')) : typeof c === 'string' ? this.importRoot ? h = this.importRoot : c.indexOf('/') >= 0 ? (h = c.replace(/\/[^\/]*$/, ''), h === '' && (h = '/')) : c.indexOf('\\') >= 0 ? (h = c.replace(/\\[^\\]*$/, ''), d = '\\') : h = '.' : h = null, j = 0; j < b.imports.length; j++) if (typeof b.imports[j] === 'string') { if (!h) throw Error('cannot determine import root'); if (k = b.imports[j], k === 'google/protobuf/descriptor.proto') continue; if (k = h + d + k, this.files[k] === !0) continue; if (/\.proto$/i.test(k) && !a.DotProto && (k = k.replace(/\.proto$/, '.json')), l = a.Util.fetch(k), l === null) throw Error("failed to import '" + k + "' in '" + c + "': file not found"); /\.json$/i.test(k) ? this.import(JSON.parse(l + ''), k) : this.import(a.DotProto.Parser.parse(l), k); } else c ? /\.(\w+)$/.test(c) ? this.import(b.imports[j], c.replace(/^(.+)\.(\w+)$/, function (a, b, c) { return b + '_import' + j + '.' + c })) : this.import(b.imports[j], c + '_import' + j) : this.import(b.imports[j]); i && (this.importRoot = null); } return b.package && this.define(b.package), b.syntax && f(b), m = this.ptr, b.options && Object.keys(b.options).forEach(function (a) { m.options[a] = b.options[a]; }), b.messages && (this.create(b.messages), this.ptr = m), b.enums && (this.create(b.enums), this.ptr = m), b.services && (this.create(b.services), this.ptr = m), b.extends && this.create(b.extends), this.reset() }, e.resolveAll = function () { var d; if (this.ptr == null || typeof this.ptr.type === 'object') return this; if (this.ptr instanceof c.Namespace) this.ptr.children.forEach(function (a) { this.ptr = a, this.resolveAll(); }, this); else if (this.ptr instanceof c.Message.Field) { if (b.TYPE.test(this.ptr.type)) this.ptr.type = a.TYPES[this.ptr.type]; else { if (!b.TYPEREF.test(this.ptr.type)) throw Error('illegal type reference in ' + this.ptr.toString(!0) + ': ' + this.ptr.type); if (d = (this.ptr instanceof c.Message.ExtensionField ? this.ptr.extension.parent : this.ptr.parent).resolve(this.ptr.type, !0), !d) throw Error('unresolvable type reference in ' + this.ptr.toString(!0) + ': ' + this.ptr.type); if (this.ptr.resolvedType = d, d instanceof c.Enum) { if (this.ptr.type = a.TYPES.enum, this.ptr.syntax === 'proto3' && d.syntax !== 'proto3') throw Error('proto3 message cannot reference proto2 enum') } else { if (!(d instanceof c.Message)) throw Error('illegal type reference in ' + this.ptr.toString(!0) + ': ' + this.ptr.type); this.ptr.type = d.isGroup ? a.TYPES.group : a.TYPES.message; } } if (this.ptr.map) { if (!b.TYPE.test(this.ptr.keyType)) throw Error('illegal key type for map field in ' + this.ptr.toString(!0) + ': ' + this.ptr.keyType); this.ptr.keyType = a.TYPES[this.ptr.keyType]; } } else if (this.ptr instanceof a.Reflect.Service.Method) { if (!(this.ptr instanceof a.Reflect.Service.RPCMethod)) throw Error('illegal service type in ' + this.ptr.toString(!0)); if (d = this.ptr.parent.resolve(this.ptr.requestName, !0), !(d && d instanceof a.Reflect.Message)) throw Error('Illegal type reference in ' + this.ptr.toString(!0) + ': ' + this.ptr.requestName); if (this.ptr.resolvedRequestType = d, d = this.ptr.parent.resolve(this.ptr.responseName, !0), !(d && d instanceof a.Reflect.Message)) throw Error('Illegal type reference in ' + this.ptr.toString(!0) + ': ' + this.ptr.responseName); this.ptr.resolvedResponseType = d; } else if (!(this.ptr instanceof a.Reflect.Message.OneOf || this.ptr instanceof a.Reflect.Extension || this.ptr instanceof a.Reflect.Enum.Value)) throw Error('illegal object in namespace: ' + typeof this.ptr + ': ' + this.ptr); return this.reset() }, e.build = function (a) { var b, c, d; if (this.reset(), this.resolved || (this.resolveAll(), this.resolved = !0, this.result = null), this.result === null && (this.result = this.ns.build()), !a) return this.result; for (b = typeof a === 'string' ? a.split('.') : a, c = this.result, d = 0; d < b.length; d++) { if (!c[b[d]]) { c = null; break }c = c[b[d]]; } return c }, e.lookup = function (a, b) { return a ? this.ns.resolve(a, b) : this.ns }, e.toString = function () { return 'Builder' }, d.Message = function () {}, d.Enum = function () {}, d.Service = function () {}, d
        }(e, e.Lang, e.Reflect)), e.Map = (function (a, b) { function e (a) { var b = 0; return { next: function () { return b < a.length ? { done: !1, value: a[b++] } : { done: !0 } } } } var c = function (a, c) { var d, e, f, g; if (!a.map) throw Error('field is not a map'); if (this.field = a, this.keyElem = new b.Element(a.keyType, null, !0, a.syntax), this.valueElem = new b.Element(a.type, a.resolvedType, !1, a.syntax), this.map = {}, Object.defineProperty(this, 'size', { get: function () { return Object.keys(this.map).length } }), c) for (d = Object.keys(c), e = 0; e < d.length; e++)f = this.keyElem.valueFromString(d[e]), g = this.valueElem.verifyValue(c[d[e]]), this.map[this.keyElem.valueToString(f)] = { key: f, value: g }; }; var d = c.prototype; return d.clear = function () { this.map = {}; }, d.delete = function (a) { var b = this.keyElem.valueToString(this.keyElem.verifyValue(a)); var c = b in this.map; return delete this.map[b], c }, d.entries = function () { var d; var c; var a = []; var b = Object.keys(this.map); for (c = 0; c < b.length; c++)a.push([(d = this.map[b[c]]).key, d.value]); return e(a) }, d.keys = function () { var c; var a = []; var b = Object.keys(this.map); for (c = 0; c < b.length; c++)a.push(this.map[b[c]].key); return e(a) }, d.values = function () { var c; var a = []; var b = Object.keys(this.map); for (c = 0; c < b.length; c++)a.push(this.map[b[c]].value); return e(a) }, d.forEach = function (a, b) { var e; var d; var c = Object.keys(this.map); for (d = 0; d < c.length; d++)a.call(b, (e = this.map[c[d]]).value, e.key, this); }, d.set = function (a, b) { var c = this.keyElem.verifyValue(a); var d = this.valueElem.verifyValue(b); return this.map[this.keyElem.valueToString(c)] = { key: c, value: d }, this }, d.get = function (a) { var b = this.keyElem.valueToString(this.keyElem.verifyValue(a)); return b in this.map ? this.map[b].value : void 0 }, d.has = function (a) { var b = this.keyElem.valueToString(this.keyElem.verifyValue(a)); return b in this.map }, c }(e, e.Reflect)), e.loadProto = function (a, b, c) { return (typeof b === 'string' || b && typeof b.file === 'string' && typeof b.root === 'string') && (c = b, b = void 0), e.loadJson(e.DotProto.Parser.parse(a), b, c) }, e.protoFromString = e.loadProto, e.loadProtoFile = function (a, b, c) { if (b && typeof b === 'object' ? (c = b, b = null) : b && typeof b === 'function' || (b = null), b) return e.Util.fetch(typeof a === 'string' ? a : a.root + '/' + a.file, function (d) { if (d === null) return b(Error('Failed to fetch file')), void 0; try { b(null, e.loadProto(d, c, a)); } catch (f) { b(f); } }); var d = e.Util.fetch(typeof a === 'object' ? a.root + '/' + a.file : a); return d === null ? null : e.loadProto(d, c, a) }, e.protoFromFile = e.loadProtoFile, e.newBuilder = function (a) { return a = a || {}, typeof a.convertFieldsToCamelCase === 'undefined' && (a.convertFieldsToCamelCase = e.convertFieldsToCamelCase), typeof a.populateAccessors === 'undefined' && (a.populateAccessors = e.populateAccessors), new e.Builder(a) }, e.loadJson = function (a, b, c) { return (typeof b === 'string' || b && typeof b.file === 'string' && typeof b.root === 'string') && (c = b, b = null), b && typeof b === 'object' || (b = e.newBuilder()), typeof a === 'string' && (a = JSON.parse(a)), b.import(a, c), b.resolveAll(), b }, e.loadJsonFile = function (a, b, c) { if (b && typeof b === 'object' ? (c = b, b = null) : b && typeof b === 'function' || (b = null), b) return e.Util.fetch(typeof a === 'string' ? a : a.root + '/' + a.file, function (d) { if (d === null) return b(Error('Failed to fetch file')), void 0; try { b(null, e.loadJson(JSON.parse(d), c, a)); } catch (f) { b(f); } }); var d = e.Util.fetch(typeof a === 'object' ? a.root + '/' + a.file : a); return d === null ? null : e.loadJson(JSON.parse(d), c, a) }, h = a, e.loadProto(h, void 0, '').build('Modules').probuf
      }(d, c)); return e
    }

    const Codec = protobuf(SSMsg);
    Codec.getModule = (pbName) => {
        const modules = new Codec[pbName]();
        modules.getArrayData = () => {
            let data = modules.toArrayBuffer();
            data = isArrayBuffer(data) ? [].slice.call(new Int8Array(data)) : data;
            return data;
        };
        return modules;
    };

    const PublishTopic = {
        // 以下为发送消息操作, 本端发送、其他端同步都为以下值
        PRIVATE: 'ppMsgP',
        GROUP: 'pgMsgP',
        CHATROOM: 'chatMsg',
        CUSTOMER_SERVICE: 'pcMsgP',
        RECALL: 'recallMsg',
        // RTC 消息
        RTC_MSG: 'prMsgS',
        // 以下为服务端通知操作
        NOTIFY_PULL_MSG: 's_ntf',
        RECEIVE_MSG: 's_msg',
        SYNC_STATUS: 's_stat',
        SERVER_NOTIFY: 's_cmd',
        SETTING_NOTIFY: 's_us' // 服务端配置变更通知
    };
    // 状态消息
    const PublishStatusTopic = {
        PRIVATE: 'ppMsgS',
        GROUP: 'pgMsgS',
        CHATROOM: 'chatMsgS'
    };
    const QueryTopic = {
        GET_SYNC_TIME: 'qrySessionsAtt',
        PULL_MSG: 'pullMsg',
        GET_CONVERSATION_LIST: 'qrySessions',
        REMOVE_CONVERSATION_LIST: 'delSessions',
        DELETE_MESSAGES: 'delMsg',
        CLEAR_UNREAD_COUNT: 'updRRTime',
        PULL_USER_SETTING: 'pullUS',
        PULL_CHRM_MSG: 'chrmPull',
        JOIN_CHATROOM: 'joinChrm',
        JOIN_EXIST_CHATROOM: 'joinChrmR',
        QUIT_CHATROOM: 'exitChrm',
        GET_CHATROOM_INFO: 'queryChrmI',
        UPDATE_CHATROOM_KV: 'setKV',
        DELETE_CHATROOM_KV: 'delKV',
        PULL_CHATROOM_KV: 'pullKV',
        GET_OLD_CONVERSATION_LIST: 'qryRelationR',
        REMOVE_OLD_CONVERSATION: 'delRelation',
        GET_CONVERSATION_STATUS: 'pullSeAtts',
        SET_CONVERSATION_STATUS: 'setSeAtt',
        GET_UPLOAD_FILE_TOKEN: 'qnTkn',
        GET_UPLOAD_FILE_URL: 'qnUrl',
        CLEAR_MESSAGES: {
            PRIVATE: 'cleanPMsg',
            GROUP: 'cleanGMsg',
            CUSTOMER_SERVICE: 'cleanCMsg',
            SYSTEM: 'cleanSMsg'
        },
        // 以下为 RTC 操作
        JOIN_RTC_ROOM: 'rtcRJoin_data',
        QUIT_RTC_ROOM: 'rtcRExit',
        PING_RTC: 'rtcPing',
        SET_RTC_DATA: 'rtcSetData',
        USER_SET_RTC_DATA: 'userSetData',
        GET_RTC_DATA: 'rtcQryData',
        DEL_RTC_DATA: 'rtcDelData',
        SET_RTC_OUT_DATA: 'rtcSetOutData',
        GET_RTC_OUT_DATA: 'rtcQryUserOutData',
        GET_RTC_TOKEN: 'rtcToken',
        SET_RTC_STATE: 'rtcUserState',
        GET_RTC_ROOM_INFO: 'rtcRInfo',
        GET_RTC_USER_INFO_LIST: 'rtcUData',
        SET_RTC_USER_INFO: 'rtcUPut',
        DEL_RTC_USER_INFO: 'rtcUDel',
        GET_RTC_USER_LIST: 'rtcUList'
    };
    const QueryHistoryTopic = {
        PRIVATE: 'qryPMsg',
        GROUP: 'qryGMsg',
        CHATROOM: 'qryCHMsg',
        CUSTOMER_SERVICE: 'qryCMsg',
        SYSTEM: 'qrySMsg'
    };
    const PublishTopicToConversationType = {
        [PublishTopic.PRIVATE]: ConversationType$1.PRIVATE,
        [PublishTopic.GROUP]: ConversationType$1.GROUP,
        [PublishTopic.CHATROOM]: ConversationType$1.CHATROOM,
        [PublishTopic.CUSTOMER_SERVICE]: ConversationType$1.CUSTOMER_SERVICE
    };
    const ConversationTypeToQueryHistoryTopic = {
        [ConversationType$1.PRIVATE]: QueryHistoryTopic.PRIVATE,
        [ConversationType$1.GROUP]: QueryHistoryTopic.GROUP,
        [ConversationType$1.CHATROOM]: QueryHistoryTopic.CHATROOM,
        [ConversationType$1.CUSTOMER_SERVICE]: QueryHistoryTopic.CUSTOMER_SERVICE,
        [ConversationType$1.SYSTEM]: QueryHistoryTopic.SYSTEM
    };
    const ConversationTypeToClearMessageTopic = {
        [ConversationType$1.PRIVATE]: QueryTopic.CLEAR_MESSAGES.PRIVATE,
        [ConversationType$1.GROUP]: QueryTopic.CLEAR_MESSAGES.GROUP,
        [ConversationType$1.CUSTOMER_SERVICE]: QueryTopic.CLEAR_MESSAGES.CUSTOMER_SERVICE,
        [ConversationType$1.SYSTEM]: QueryTopic.CLEAR_MESSAGES.SYSTEM
    };
    const ConversationStatusConfig = {
        ENABLED: '1',
        DISABLED: '0'
    };
    const ConversationStatusType = {
        DO_NOT_DISTURB: 1,
        TOP: 2,
        TAGS: 3 // 标签列表
    };

    /**
     * 序列化、反序列化数据通道
    */
    class DataCodec {
        constructor(connectType) {
            this._codec = connectType === 'websocket' ? Codec : Codec$1;
            this._connectType = connectType;
        }
        /**
         * PB 数据 转为 rmtp 数据 反序列化 通用数据
         * 根据解析的 PBName 分配解码方法. 如果没有单独的解码方法定义. 直接返回 pb 解析后的结果
        */
        decodeByPBName(data, pbName, option) {
            const self = this;
            const formatEventMap = {
                [PBName.DownStreamMessages]: self._formatSyncMessages,
                [PBName.DownStreamMessage]: self._formatReceivedMessage,
                [PBName.UpStreamMessage]: self._formatSentMessage,
                [PBName.HistoryMsgOuput]: self._formatHistoryMessages,
                [PBName.RelationsOutput]: self._formatConversationList,
                [PBName.QueryChatRoomInfoOutput]: self._formatChatRoomInfos,
                [PBName.RtcUserListOutput]: self._formatRTCUserList,
                [PBName.RtcQryOutput]: self._formatRTCData,
                [PBName.ChrmKVOutput]: self._formatChatRoomKVList,
                [PBName.PullUserSettingOutput]: self._formatUserSetting,
                [PBName.SessionStates]: self._formatConversationStatus,
                [PBName.GrpReadReceiptQryResp]: self._formatGrpReadReceiptQryResp,
                [PBName.SetUserSettingOutput]: self._formatSetUserSettingOutput,
                [PBName.UserSettingNotification]: self._formatUserSettingNotification,
                [PBName.RtcKVOutput]: self._formatRTCRoomKVList,
                [PBName.RtcTokenOutput]: self._formatRTCAuidenceJoinRoomData,
                [PBName.RtcQueryUserJoinedOutput]: self._formatRTCJoinedUserInfo
            };
            let decodedData = data;
            const formatEvent = formatEventMap[pbName];
            try {
                const hasData = data.length > 0; // 判断是否有数据, 防止无数据 pb 解析报错
                decodedData = hasData && self._codec[pbName].decode(data); // pb 解析
                if (isObject(decodedData)) {
                    decodedData = batchInt64ToTimestamp(decodedData); // 时间转化
                }
                if (isFunction(formatEvent)) {
                    decodedData = formatEvent.call(this, decodedData, option); // 数据格式化
                }
            }
            catch (e) {
                logger.error('PB parse error\n', e, data, pbName);
            }
            return decodedData;
        }
        _readBytes(content) {
            const { offset, buffer, limit } = content;
            if (offset) {
                try {
                    const content = isArrayBuffer(buffer) ? new Uint8Array(buffer) : buffer;
                    // content = utils.ArrayBufferToUint8Array(buffer).subarray(offset, limit)
                    return BinaryHelper.readUTF(content.subarray(offset, limit));
                }
                catch (e) {
                    logger.info('readBytes error\n', e);
                }
            }
            return content;
        }
        /**
         * ====== 以下为 rmtp 数据 反序列化为 可用数据 ======
         */
        _formatBytes(content) {
            // 1. socket 下, content.buffer 为二进制 ArrayBuffer, 需调用 ArrayBufferToUint8Array 转换
            // 2. comet 下, content 为 JSON 字符串. socket、comet 解析后都需要 JSON to Object
            let formatRes = this._readBytes(content);
            try {
                formatRes = JSON.parse(formatRes);
            }
            catch (e) {
                logger.info('formatBytes error\n', e);
            }
            return formatRes || content;
        }
        /**
         * 格式化多端同步消息
        */
        _formatSyncMessages(data, option) {
            option = option || {};
            const self = this;
            const { list, syncTime, finished } = data;
            // Comet 与 聊天室没有 finished 字段定义，默认为 true
            if (isUndefined(finished) || finished === null) {
                data.finished = true;
            }
            data.syncTime = int64ToTimestamp(syncTime);
            data.list = map(list, (msgData) => {
                const message = self._formatReceivedMessage(msgData, option);
                return message;
            });
            return data;
        }
        /**
         * 格式化接收消息
        */
        _formatReceivedMessage(data, option) {
            // TODO: 需杜绝此类传参，参数在进入方法前进行类型值确认
            option = option || {};
            const self = this;
            const { currentUserId, connectedTime } = option;
            const { content, fromUserId, type, groupId, status, dataTime, classname: messageType, msgId: messageUId, extraContent, pushContent, pushExt, configFlag } = data;
            const direction = data.direction || MessageDirection$1.RECEIVE; // null || 0 都为收件箱
            const isSelfSend = direction === MessageDirection$1.SEND;
            const { isPersited, isCounted, isMentioned, disableNotification, receivedStatus, canIncludeExpansion } = getMessageOptionByStatus(status);
            // const targetId = type === ConversationType.GROUP || type === ConversationType.CHATROOM ? groupId : fromUserId
            const targetId = [ConversationType$1.GROUP, ConversationType$1.CHATROOM, ConversationType$1.RTC_ROOM].indexOf(type) > -1 ? groupId : fromUserId;
            const senderUserId = isSelfSend ? currentUserId : fromUserId;
            const sentTime = int64ToTimestamp(dataTime);
            const isOffLineMessage = sentTime < connectedTime;
            const isChatRoomMsg = type === ConversationType$1.CHATROOM;
            const utfContent = self._formatBytes(content);
            let _pushConfig = {};
            if (pushExt) {
                _pushConfig = pushJSONToConfigs(pushExt.pushConfigs, pushExt.pushId);
            }
            const pushConfig = Object.assign(Object.assign({}, _pushConfig), { pushTitle: pushExt === null || pushExt === void 0 ? void 0 : pushExt.title, pushContent: pushContent, pushData: pushContent, disablePushTitle: configFlag ? Boolean(configFlag & 0x04) : false, forceShowDetailContent: configFlag ? Boolean(configFlag & 0x08) : false, templateId: pushExt === null || pushExt === void 0 ? void 0 : pushExt.templateId });
            let messageDirection = isSelfSend ? MessageDirection$1.SEND : MessageDirection$1.RECEIVE;
            // 聊天室拉消息时, 自己发送的消息, direction 也为 null
            if (isChatRoomMsg && (fromUserId === currentUserId)) {
                messageDirection = MessageDirection$1.SEND;
            }
            let expansion;
            if (extraContent) {
                expansion = {};
                expansion = formatExtraContent(extraContent);
            }
            return {
                conversationType: type,
                targetId,
                senderUserId,
                messageType,
                messageUId,
                isPersited,
                isCounted,
                isMentioned,
                sentTime,
                isOffLineMessage,
                messageDirection,
                receivedTime: DelayTimer.getTime(),
                disableNotification,
                receivedStatus,
                canIncludeExpansion,
                content: utfContent,
                expansion,
                configFlag,
                pushConfig
            };
        }
        /**
         * 格式化发送消息
        */
        _formatSentMessage(data, option) {
            const self = this;
            const { content, classname: messageType, sessionId, msgId: messageUId, extraContent, pushExt, pushContent, configFlag } = data;
            const { signal, currentUserId } = option;
            const { date, topic, targetId } = signal;
            const { isPersited, isCounted, disableNotification, canIncludeExpansion } = getUpMessageOptionBySessionId(sessionId);
            let type = PublishTopicToConversationType[topic] || ConversationType$1.PRIVATE;
            const isStatusMessage = isInObject(PublishStatusTopic, topic);
            const _content = self._formatBytes(content);
            let _targetId = targetId;
            if (messageType === MessageType$1.RECALL) {
                type = _content.conversationType || type;
                _targetId = _content.targetId || targetId;
            }
            let expansion;
            if (extraContent) {
                expansion = {};
                expansion = formatExtraContent(extraContent);
            }
            let _pushConfig = {};
            if (pushExt) {
                _pushConfig = pushJSONToConfigs(pushExt.pushConfigs, pushExt.pushId);
            }
            const pushConfig = Object.assign(Object.assign({}, _pushConfig), { pushTitle: pushExt === null || pushExt === void 0 ? void 0 : pushExt.title, pushContent: pushContent, pushData: pushContent, disablePushTitle: configFlag ? Boolean(configFlag & 0x04) : false, forceShowDetailContent: configFlag ? Boolean(configFlag & 0x08) : false, templateId: pushExt === null || pushExt === void 0 ? void 0 : pushExt.templateId });
            return {
                conversationType: type,
                targetId: _targetId,
                messageType,
                messageUId,
                isPersited,
                isCounted,
                isStatusMessage,
                senderUserId: currentUserId,
                content: self._formatBytes(content),
                sentTime: date * 1000,
                receivedTime: DelayTimer.getTime(),
                messageDirection: MessageDirection$1.SEND,
                isOffLineMessage: false,
                disableNotification,
                canIncludeExpansion,
                expansion,
                pushConfig
            };
        }
        /**
         * 格式化历史消息
        */
        _formatHistoryMessages(data, option) {
            const conversation = option.conversation || {};
            const { list: msgList, hasMsg } = data;
            const targetId = conversation.targetId;
            const syncTime = int64ToTimestamp(data.syncTime);
            const list = [];
            forEach(msgList, (msgData) => {
                const msg = this._formatReceivedMessage(msgData, option);
                msg.targetId = targetId;
                list.push(msg);
            }, {
                isReverse: true
            });
            return { syncTime, list, hasMore: !!hasMsg };
        }
        /**
         * 格式化会话列表
        */
        _formatConversationList(serverData, option) {
            const self = this;
            let { info: conversationList } = serverData;
            const afterDecode = option.afterDecode || function () { };
            conversationList = map(conversationList, (serverConversation) => {
                const { msg, userId, type, unreadCount, channelId } = serverConversation;
                const latestMessage = self._formatReceivedMessage(msg, option);
                latestMessage.targetId = userId;
                const conversation = {
                    targetId: userId,
                    conversationType: type,
                    unreadMessageCount: unreadCount,
                    latestMessage,
                    channelId: channelId || ''
                };
                return afterDecode(conversation) || conversation;
            });
            return conversationList || [];
        }
        /**
         * 格式化用户设置
        */
        _formatSetUserSettingOutput(serverData) {
            return serverData;
        }
        /**
         * 格式化聊天室信息
        */
        _formatChatRoomInfos(data) {
            const { userTotalNums, userInfos } = data;
            const chrmInfos = map(userInfos, (user) => {
                const { id, time } = user;
                const timestamp = int64ToTimestamp(time);
                return { id, time: timestamp };
            });
            return {
                userCount: userTotalNums,
                userInfos: chrmInfos
            };
        }
        /**
         * 格式化 聊天室 KV 列表
        */
        _formatChatRoomKVList(data) {
            let { entries: kvEntries, bFullUpdate: isFullUpdate, syncTime } = data;
            kvEntries = kvEntries || [];
            kvEntries = map(kvEntries, (kv) => {
                const { key, value, status, timestamp, uid } = kv;
                const { isAutoDelete, isOverwrite, type } = getChatRoomKVByStatus(status);
                return {
                    key,
                    value,
                    isAutoDelete,
                    isOverwrite,
                    type,
                    userId: uid,
                    timestamp: int64ToTimestamp(timestamp)
                };
            });
            return {
                kvEntries, isFullUpdate, syncTime
            };
        }
        /**
         * 格式化 用户设置
        */
        _formatUserSetting(data) {
            const { items, version } = data;
            const settings = {};
            forEach(items || [], (setting) => {
                const { key, version, value } = setting;
                setting.version = int64ToTimestamp(version);
                setting.value = this._readBytes(value);
                if (key === 'Tag') {
                    setting.tags.forEach((tag) => {
                        tag.createdTime = int64ToTimestamp(tag.createdTime);
                        tag.tagName = tag.name;
                    });
                }
                settings[key] = setting;
            });
            return { settings, version };
        }
        /**
         * 格式化 会话状态 置顶、免打扰）
        */
        _formatConversationStatus(data) {
            const { state: stateList } = data;
            const statusList = [];
            forEach(stateList, (session) => {
                const { type, channelId: targetId, time: updatedTime, stateItem } = session;
                let notificationStatus = NotificationStatus$1.CLOSE;
                let isTop = false;
                let tags = [];
                forEach(stateItem, (item) => {
                    const { sessionStateType, value, tags: _tags } = item;
                    switch (sessionStateType) {
                        case ConversationStatusType.DO_NOT_DISTURB:
                            notificationStatus = value === ConversationStatusConfig.ENABLED ? NotificationStatus$1.OPEN : NotificationStatus$1.CLOSE;
                            break;
                        case ConversationStatusType.TOP:
                            isTop = value === ConversationStatusConfig.ENABLED;
                            break;
                        case ConversationStatusType.TAGS:
                            tags = _tags;
                            break;
                    }
                });
                statusList.push({
                    type,
                    targetId,
                    notificationStatus,
                    isTop,
                    updatedTime: int64ToTimestamp(updatedTime),
                    tags
                });
            });
            return statusList;
        }
        /**
         * 格式化 RTC 用户列表
        */
        _formatRTCUserList(rtcInfos) {
            const { users: list, token, sessionId, roomInfo } = rtcInfos;
            const users = {};
            forEach(list, (item) => {
                const { userId, userData } = item;
                const tmpData = {};
                forEach(userData, (data) => {
                    const { key, value } = data;
                    tmpData[key] = value;
                });
                users[userId] = tmpData;
            });
            return { users, token, sessionId, roomInfo };
        }
        /**
          * 格式化 RTC 数据
        */
        _formatRTCData(data) {
            const { outInfo: list } = data;
            const props = {};
            forEach(list, (item) => {
                props[item.key] = item.value;
            });
            return props;
        }
        /**
          * 格式化 RTC 房间信息
        */
        _formatRTCRoomInfo(data) {
            const { roomId: id, userCount: total, roomData } = data;
            const room = {
                id, total
            };
            forEach(roomData, (data) => {
                room[data.key] = data.value;
            });
            return room;
        }
        /**
          * 格式化 获取已读列表
        */
        _formatGrpReadReceiptQryResp(data) {
            const { totalMemberNum, list } = data;
            list.forEach((item) => {
                item.readTime = int64ToTimestamp(item.readTime);
            });
            return {
                totalMemberCount: totalMemberNum,
                list
            };
        }
        /**
         * 格式化用户配置通知
         */
        _formatUserSettingNotification(data) {
            return data;
        }
        /**
         * 格式化 RTC 用户加入房间后通知拉取的数据（房间内主播全量列表、房间全量资源）
         */
        _formatRTCRoomKVList(data) {
            let { entries: kvEntries, bFullUpdate: isFullUpdate, syncTime } = data;
            kvEntries = kvEntries || [];
            kvEntries = kvEntries.map((entry) => {
                const { timestamp } = entry;
                return Object.assign(entry, {
                    timestamp: int64ToTimestamp(timestamp)
                });
            });
            return {
                kvEntries, isFullUpdate, syncTime
            };
        }
        /**
         * 格式化观众加房间后返回数据
         */
        _formatRTCAuidenceJoinRoomData(data) {
            return data;
        }
        /**
         * 格式化加入 RTC 房间的用户信息
         */
        _formatRTCJoinedUserInfo(data) {
            return (data.info || []).map(item => {
                return {
                    deviceId: item.deviceId,
                    roomId: item.roomId,
                    joinTime: int64ToTimestamp(item.joinTime)
                };
            });
        }
        /**
         * ===== 以下为通用数据 序列化为 PB 数据 =====
         * Engine Index 调用处理数据
        */
        /**
         * ? 待补全注释
        */
        encodeServerConfParams() {
            const modules = this._codec.getModule(PBName.SessionsAttQryInput);
            modules.setNothing(1);
            return modules.getArrayData();
        }
        /**
         * 上行消息基础配置
        */
        _getUpMsgModule(conversation, option) {
            const isComet = this._connectType === 'comet';
            const { type } = conversation;
            const { messageType, isMentioned, mentionedType, mentionedUserIdList, content, pushContent, pushData, directionalUserIdList, isFilerWhiteBlacklist, isVoipPush, canIncludeExpansion, expansion, pushConfig } = option;
            const isGroupType = type === ConversationType$1.GROUP;
            const modules = this._codec.getModule(PBName.UpStreamMessage);
            const sessionId = getSessionId(option);
            const { pushTitle, pushContent: newPushContent, pushData: newPushData, iOSConfig, androidConfig, templateId, disablePushTitle, forceShowDetailContent } = pushConfig || {};
            let flag = 0;
            modules.setSessionId(sessionId);
            if (isGroupType && isMentioned && content) {
                content.mentionedInfo = {
                    userIdList: mentionedUserIdList,
                    type: mentionedType || MentionedType$1.ALL
                };
            }
            const _pushContent = newPushContent || pushContent || '';
            const _pushData = newPushData || pushData || '';
            _pushContent && modules.setPushText(_pushContent); // 设置 pushContent
            _pushData && modules.setAppData(_pushData); // 设置 pushData
            directionalUserIdList && modules.setUserId(directionalUserIdList); // 设置群定向消息人员
            // 设置 flag. 涉及业务: 1、iOS VoipPush  2、过滤黑/白名单
            flag |= (isVoipPush ? 0x01 : 0);
            flag |= (isFilerWhiteBlacklist ? 0x02 : 0);
            flag |= (disablePushTitle ? 0x04 : 0);
            flag |= (forceShowDetailContent ? 0x08 : 0);
            modules.setConfigFlag(flag);
            modules.setClassname(messageType); // 设置 objectName
            modules.setContent(JSON.stringify(content));
            if (canIncludeExpansion && expansion) {
                const extraContent = {};
                forEach(expansion, (val, key) => {
                    extraContent[key] = { v: val };
                });
                modules.setExtraContent(JSON.stringify(extraContent)); // 设置消息扩展内容
            }
            // 设置推送扩展
            if (pushConfig) {
                const pushExtraModule = this._codec.getModule(PBName.PushExtra);
                pushTitle && pushExtraModule.setTitle(pushTitle);
                if (iOSConfig && androidConfig) {
                    const pushConfigStr = pushConfigsToJSON(iOSConfig, androidConfig);
                    pushExtraModule.setPushConfigs(pushConfigStr);
                }
                (androidConfig === null || androidConfig === void 0 ? void 0 : androidConfig.notificationId) && pushExtraModule.setPushId(androidConfig === null || androidConfig === void 0 ? void 0 : androidConfig.notificationId);
                pushExtraModule.setTemplateId(templateId || '');
                modules.setPushExt(isComet ? pushExtraModule.getArrayData() : pushExtraModule);
            }
            return modules;
        }
        /**
         * 序列化上行消息
        */
        encodeUpMsg(conversation, option) {
            const modules = this._getUpMsgModule(conversation, option);
            return modules.getArrayData();
        }
        /**
         * 序列化拉取多端消息
        */
        encodeSyncMsg(syncMsgArgs) {
            const { sendboxTime, inboxTime } = syncMsgArgs;
            const modules = this._codec.getModule(PBName.SyncRequestMsg);
            modules.setIspolling(false);
            modules.setIsPullSend(true);
            modules.setSendBoxSyncTime(sendboxTime);
            modules.setSyncTime(inboxTime);
            return modules.getArrayData();
        }
        /**
         * 序列化拉取聊天室消息
        */
        encodeChrmSyncMsg(time, count) {
            time = time || 0;
            count = count || 0;
            const modules = this._codec.getModule(PBName.ChrmPullMsg);
            modules.setCount(count);
            modules.setSyncTime(time);
            return modules.getArrayData();
        }
        /**
         * 序列化历史消息
        */
        encodeGetHistoryMsg(targetId, option) {
            const { count, order, timestamp } = option;
            const modules = this._codec.getModule(PBName.HistoryMsgInput);
            modules.setTargetId(targetId);
            modules.setTime(timestamp);
            modules.setCount(count);
            modules.setOrder(order);
            return modules.getArrayData();
        }
        /**
         * 序列化会话列表
        */
        encodeGetConversationList(option) {
            option = option || {};
            const { count, startTime } = option;
            const modules = this._codec.getModule(PBName.RelationQryInput);
            // 默认值已在 modules 暴露层赋值. 传入此处, 必有值
            modules.setType(1); // type 可传任意值
            modules.setCount(count);
            modules.setStartTime(startTime);
            return modules.getArrayData();
        }
        /**
         * 旧会话列表. 获取、删除都调用此方法
        */
        encodeOldConversationList(option) {
            option = option || {};
            let { count, type, startTime, order } = option;
            count = count || 0; // 删除会话列表 count 传 0 , setCount 形参 count 为必填参数
            startTime = startTime || 0;
            order = order || 0;
            const modules = this._codec.getModule(PBName.RelationQryInput);
            modules.setType(type);
            modules.setCount(count);
            modules.setStartTime(startTime);
            modules.setOrder(order);
            return modules.getArrayData();
        }
        /**
         * 旧会话列表删除
        */
        encodeRemoveConversationList(conversationList) {
            const modules = this._codec.getModule(PBName.DeleteSessionsInput);
            const sessions = [];
            forEach(conversationList, (conversation) => {
                const { type, targetId } = conversation;
                const session = this._codec.getModule(PBName.SessionInfo);
                session.setType(type);
                session.setChannelId(targetId);
                sessions.push(session);
            });
            modules.setSessions(sessions);
            return modules.getArrayData();
        }
        /**
         * 批量删除消息通过消息 ID
        */
        encodeDeleteMessages(conversationType, targetId, list) {
            const modules = this._codec.getModule(PBName.DeleteMsgInput);
            const encodeMsgs = [];
            forEach(list, (message) => {
                encodeMsgs.push({
                    msgId: message.messageUId,
                    msgDataTime: message.sentTime,
                    direct: message.messageDirection
                });
            });
            modules.setType(conversationType);
            modules.setConversationId(targetId);
            modules.setMsgs(encodeMsgs);
            return modules.getArrayData();
        }
        /**
         * 批量删除消息通过时间
        */
        encodeClearMessages(targetId, timestamp) {
            const modules = this._codec.getModule(PBName.CleanHisMsgInput);
            timestamp = timestamp || new Date().getTime(); // 默认当前时间
            modules.setDataTime(timestamp);
            modules.setTargetId(targetId);
            return modules.getArrayData();
        }
        /**
         * 未读数清除
        */
        encodeClearUnreadCount(conversation, option) {
            const { type, targetId } = conversation;
            let { timestamp } = option;
            const modules = this._codec.getModule(PBName.SessionMsgReadInput);
            timestamp = timestamp || +new Date();
            modules.setType(type);
            modules.setChannelId(targetId);
            modules.setMsgTime(timestamp);
            return modules.getArrayData();
        }
        /**
         * 加入退出聊天室
        */
        encodeJoinOrQuitChatRoom() {
            const modules = this._codec.getModule(PBName.ChrmInput);
            modules.setNothing(1);
            return modules.getArrayData();
        }
        /**
         * 获取聊天室信息
         * @param count 获取人数
         * @param order 排序方式
        */
        encodeGetChatRoomInfo(count, order) {
            const modules = this._codec.getModule(PBName.QueryChatRoomInfoInput);
            modules.setCount(count);
            modules.setOrder(order);
            return modules.getArrayData();
        }
        /**
         * 上传文件认证信息获取
        */
        encodeGetFileToken(fileType, fileName, httpMethod, queryString) {
            const modules = this._codec.getModule(PBName.GetQNupTokenInput);
            modules.setType(fileType);
            modules.setKey(fileName);
            modules.setHttpMethod(httpMethod);
            modules.setQueryString(queryString);
            return modules.getArrayData();
        }
        /**
          * 获取七牛上传url
        */
        encodeGetFileUrl(inputPBName, fileType, fileName, originName) {
            const modules = this._codec.getModule(inputPBName);
            modules.setType(fileType);
            modules.setKey(fileName);
            if (originName) {
                modules.setFileName(originName);
            }
            return modules.getArrayData();
        }
        /**
          * 聊天室 KV 存储
        */
        encodeModifyChatRoomKV(chrmId, entry, currentUserId) {
            const isComet = this._connectType === 'comet';
            const modules = this._codec.getModule(PBName.SetChrmKV);
            const { key, value, notificationExtra: extra, isSendNotification, type } = entry;
            const action = type || ChatroomEntryType$1.UPDATE;
            const status = getChatRoomKVOptStatus(entry, action);
            const serverEntry = {
                key,
                value: value || '',
                uid: currentUserId
            };
            // 若 status 传空, server 会出问题
            if (!isUndefined(status)) {
                serverEntry.status = status;
            }
            modules.setEntry(serverEntry);
            if (isSendNotification) { // 如果需要发送通知, 设置通知消息
                const conversation = {
                    type: ConversationType$1.CHATROOM,
                    targetId: chrmId
                };
                const msgContent = { key, value, extra, type: action };
                // 通知消息内置, 由 Server 自动发送
                const msgModule = this._getUpMsgModule(conversation, {
                    messageType: MessageType$1.CHRM_KV_NOTIFY,
                    content: msgContent,
                    isPersited: false,
                    isCounted: false
                });
                isComet ? modules.setNotification(msgModule.getArrayData()) : modules.setNotification(msgModule);
                modules.setBNotify(true);
                modules.setType(ConversationType$1.CHATROOM);
            }
            return modules.getArrayData();
        }
        /**
          * KV 存储拉取
        */
        encodePullChatRoomKV(time) {
            const modules = this._codec.getModule(PBName.QueryChrmKV);
            modules.setTimestamp(time);
            return modules.getArrayData();
        }
        /**
          * 用户实时配置更新
        */
        encodePullUserSetting(version) {
            const modules = this._codec.getModule(PBName.PullUserSettingInput);
            modules.setVersion(version);
            return modules.getArrayData();
        }
        /**
          * 获取会话状态 (置顶、免打扰)
        */
        encodeGetConversationStatus(time) {
            const modules = this._codec.getModule(PBName.SessionReq);
            modules.setTime(time);
            return modules.getArrayData();
        }
        /**
          * 设置会话状态 (置顶、免打扰)
        */
        encodeSetConversationStatus(statusList) {
            const isComet = this._connectType === 'comet';
            const modules = this._codec.getModule(PBName.SessionStateModifyReq);
            const currentTime = DelayTimer.getTime();
            const stateModuleList = [];
            forEach(statusList, (status) => {
                const stateModules = this._codec.getModule(PBName.SessionState);
                const { conversationType: type, targetId, notificationStatus, isTop } = status;
                const stateItemModuleList = [];
                stateModules.setType(type);
                stateModules.setChannelId(targetId);
                stateModules.setTime(currentTime);
                const isNotDisturb = notificationStatus === NotificationStatus$1.OPEN;
                const TypeToVal = {};
                if (!isUndefined(notificationStatus)) {
                    TypeToVal[ConversationStatusType.DO_NOT_DISTURB] = isNotDisturb;
                }
                if (!isUndefined(isTop)) {
                    TypeToVal[ConversationStatusType.TOP] = isTop;
                }
                forEach(TypeToVal, (val, type) => {
                    if (!isUndefined(val)) {
                        const stateItemModules = this._codec.getModule(PBName.SessionStateItem);
                        val = val ? ConversationStatusConfig.ENABLED : ConversationStatusConfig.DISABLED;
                        stateItemModules.setSessionStateType(Number(type)); // TODO 暂时写死
                        stateItemModules.setValue(val);
                        const stateItemModulesData = isComet ? stateItemModules.getArrayData() : stateItemModules;
                        stateItemModuleList.push(stateItemModulesData);
                    }
                });
                stateModules.setStateItem(stateItemModuleList);
                const stateModulesData = isComet ? stateModules.getArrayData() : stateModules;
                stateModuleList.push(stateModulesData);
            });
            modules.setVersion(currentTime);
            modules.setState(stateModuleList);
            return modules.getArrayData();
        }
        /**
         * 序列化发送群组已读回执
         */
        encodeReadReceipt(messageUIds, channelId) {
            const modules = this._codec.getModule(PBName.GrpReadReceiptMsg);
            modules.setMsgId(messageUIds);
            channelId && modules.setChannelId(channelId);
            return modules.getArrayData();
        }
        /**
         * 序列化创建tag消息
         */
        encodeCreateTag(tags, version) {
            const isComet = this._connectType === 'comet';
            const modules = this._codec.getModule(PBName.SessionTagAddInput);
            const itemListModules = [];
            tags.forEach((tag) => {
                const itemModule = this._codec.getModule(PBName.SessionTagItem);
                itemModule.setTagId(tag.tagId);
                itemModule.setName(tag.tagName);
                itemListModules.push(isComet ? itemModule.getArrayData() : itemModule);
            });
            modules.setTags(itemListModules);
            modules.setVersion(version);
            return modules.getArrayData();
        }
        /**
         * 序列化获取群组消息已读列表
         */
        encodeMessageReader(messageUId, channelId) {
            const modules = this._codec.getModule(PBName.GrpReadReceiptMsg);
            modules.setMsgId(messageUId);
            channelId && modules.setChannelId(channelId);
            return modules.getArrayData();
        }
        /**
         * 序列化删除tag消息
         */
        encodeRemoveTag(tagIds, version) {
            const isComet = this._connectType === 'comet';
            const modules = this._codec.getModule(PBName.SessionTagDelInput);
            const itemListModules = [];
            tagIds.forEach((tagId) => {
                const itemModule = this._codec.getModule(PBName.SessionTagItem);
                itemModule.setTagId(tagId);
                itemListModules.push(isComet ? itemModule.getArrayData() : itemModule);
            });
            modules.setTags(itemListModules);
            modules.setVersion(version);
            return modules.getArrayData();
        }
        /**
         * 解除会话标签关系
         */
        encodeDisConversationTag(tagIds) {
            const modules = this._codec.getModule(PBName.SessionDisTagReq);
            modules.setTagId(tagIds);
            return modules.getArrayData();
        }
        /**
         * 序列化更新会话标签
         */
        encodeUpdateConversationTag(tags, conversations) {
            const isComet = this._connectType === 'comet';
            const modules = this._codec.getModule(PBName.SessionStateModifyReq);
            const sessionStateModule = [];
            conversations.forEach((_conversation) => {
                const SessionState = this._codec.getModule(PBName.SessionState);
                const SessionStateItem = this._codec.getModule(PBName.SessionStateItem);
                const SessionTagItemModules = [];
                tags.forEach((tag) => {
                    const SessionTagItem = this._codec.getModule(PBName.SessionTagItem);
                    SessionTagItem.setTagId(tag.tagId);
                    if (!isUndefined(tag.isTop)) {
                        SessionTagItem.setIsTop(tag.isTop);
                    }
                    SessionTagItemModules.push(isComet ? SessionTagItem.getArrayData() : SessionTagItem);
                });
                SessionStateItem.setSessionStateType(ConversationStatusType.TAGS);
                SessionStateItem.setValue(JSON.stringify(SessionTagItemModules));
                SessionStateItem.setTags(SessionTagItemModules);
                SessionState.setType(_conversation.type);
                SessionState.setChannelId(_conversation.targetId);
                SessionState.setTime(Date.now());
                SessionState.setStateItem([isComet ? SessionStateItem.getArrayData() : SessionStateItem]);
                sessionStateModule.push(isComet ? SessionState.getArrayData() : SessionState);
            });
            modules.setState(sessionStateModule);
            modules.setVersion(DelayTimer.getTime());
            return modules.getArrayData();
        }
        /**
         * 序列号上报SDK信息
         */
        encodeReportSDKInfo(info) {
            const modules = this._codec.getModule(PBName.ReportSDKInput);
            modules.setSdkInfo(info);
            return modules.getArrayData();
        }
        /**
         * ============ 以下为 RTC 相关 ============
         */
        /**
         * 加入 RTC 房间
         */
        encodeJoinRTCRoom(mode, broadcastType, joinType) {
            const modules = this._codec.getModule(PBName.RtcInput);
            mode = mode || 0;
            modules.setRoomType(mode);
            isUndefined(broadcastType) || modules.setBroadcastType(broadcastType);
            isUndefined(joinType) || modules.setBroadcastType(joinType);
            return modules.getArrayData();
        }
        /**
         * 退出 RTC 房间
         */
        encodeQuitRTCRoom() {
            return this._codec.getModule(PBName.SetUserStatusInput).getArrayData();
        }
        /**
         * 用户属性设置，及消息通知
         */
        encodeSetRTCData(key, value, isInner, apiType, message) {
            const modules = this._codec.getModule(PBName.RtcSetDataInput);
            modules.setInterior(isInner);
            modules.setTarget(apiType);
            modules.setKey(key);
            modules.setValue(value);
            if (message) {
                message.name && modules.setObjectName(message.name);
                let content = message.content;
                if (content) {
                    if (isObject(content)) {
                        content = JSON.stringify(content);
                    }
                    modules.setContent(content);
                }
            }
            return modules.getArrayData();
        }
        /**
         * 全量 URI
         */
        encodeUserSetRTCData(message, valueInfo, objectName, mcuValInfo) {
            const isComet = this._connectType === 'comet';
            const modules = this._codec.getModule(PBName.RtcUserSetDataInput);
            // 全量 URI 新增
            // 全量发布中
            // valueInfo: key 为 uris，值为 全量的订阅信息
            // content: key 为增量数据消息 RCRTC:ModifyResource，value 为增量订阅信息
            modules.setObjectName(objectName);
            // content
            const val = this._codec.getModule(PBName.RtcValueInfo);
            val.setKey(message.name);
            val.setValue(message.content);
            isComet ? modules.setContent([val.getArrayData()]) : modules.setContent(val);
            // // valueInfo
            // val = this._codec.getModule(PBName.RtcValueInfo)
            // val.setKey('uris')
            // val.setValue(valueInfo)
            // // mcuValInfo
            // val.setKey('mcu_uris')
            // val.setValue(mcuValInfo)
            // modules.setValueInfo(val)
            const valInfoKeys = ['uris', 'mcu_uris'];
            const valInfosModule = [];
            valInfoKeys.forEach(item => {
                const valueInfoModule = this._codec.getModule(PBName.RtcValueInfo);
                valueInfoModule.setKey(item);
                const value = item === 'uris' ? valueInfo : mcuValInfo;
                valueInfoModule.setValue(value);
                isComet ? valInfosModule.push(valueInfoModule.getArrayData()) : valInfosModule.push(valueInfoModule);
            });
            modules.setValueInfo(valInfosModule);
            return modules.getArrayData();
        }
        encodeUserSetRTCCDNUris(objectName, CDNUris) {
            this._connectType === 'comet';
            const modules = this._codec.getModule(PBName.RtcUserSetDataInput);
            modules.setObjectName(objectName);
            const val = this._codec.getModule(PBName.RtcValueInfo);
            val.setKey('cdn_uris');
            val.setValue(CDNUris);
            modules.setValueInfo(val);
            return modules.getArrayData();
        }
        /**
         * 用户属性获取
        */
        encodeGetRTCData(keys, isInner, apiType) {
            const modules = this._codec.getModule(PBName.RtcDataInput);
            modules.setInterior(isInner);
            modules.setTarget(apiType);
            modules.setKey(keys);
            return modules.getArrayData();
        }
        /**
         * 用户属性删除
        */
        encodeRemoveRTCData(keys, isInner, apiType, message) {
            const modules = this._codec.getModule(PBName.RtcDataInput);
            modules.setInterior(isInner);
            modules.setTarget(apiType);
            modules.setKey(keys);
            message = message || {};
            let { name, content } = message;
            !isUndefined(name) && modules.setObjectName(name);
            if (!isUndefined(content)) {
                if (isObject(content)) {
                    content = JSON.stringify(content);
                }
                modules.setContent(content);
            }
            return modules.getArrayData();
        }
        /**
         * 待完善注释
         * @deprecated
        */
        encodeSetRTCOutData(data, type, message) {
            const modules = this._codec.getModule(PBName.RtcSetOutDataInput);
            modules.setTarget(type);
            if (!isArray(data)) {
                data = [data];
            }
            forEach(data, (item, index) => {
                item.key = item.key ? item.key.toString() : item.key;
                item.value = item.value ? item.value.toString() : item.value;
                data[index] = item;
            });
            modules.setValueInfo(data);
            message = message || {};
            let { name, content } = message;
            !isUndefined(name) && modules.setObjectName(name);
            if (!isUndefined(content)) {
                if (isObject(content)) {
                    content = JSON.stringify(content);
                }
                modules.setContent(content);
            }
            return modules.getArrayData();
        }
        /**
         * 待完善注释
         * @deprecated
        */
        ecnodeGetRTCOutData(userIds) {
            const modules = this._codec.getModule(PBName.RtcQryUserOutDataInput);
            modules.setUserId(userIds);
            return modules.getArrayData();
        }
        /**
         * rtc 北极星数据上传
         */
        encodeSetRTCState(report) {
            const modules = this._codec.getModule(PBName.MCFollowInput);
            modules.setState(report);
            return modules.getArrayData();
        }
        /**
         * 获取房间用户资源
        */
        encodeGetRTCRoomInfo() {
            const modules = this._codec.getModule(PBName.RtcQueryListInput);
            modules.setOrder(2);
            return modules.getArrayData();
        }
        /**
         * 设置用户资源
        */
        encodeSetRTCUserInfo(key, value) {
            const modules = this._codec.getModule(PBName.RtcValueInfo);
            modules.setKey(key);
            modules.setValue(value);
            return modules.getArrayData();
        }
        /**
         * 删除用户及资源
        */
        encodeRemoveRTCUserInfo(keys) {
            const modules = this._codec.getModule(PBName.RtcKeyDeleteInput);
            modules.setKey(keys);
            return modules.getArrayData();
        }
        /**
         * RTC 直播房间身份切换
        */
        encodeIdentityChangeInfo(changeType, broadcastType, needSyncChrm = false) {
            const modules = this._codec.getModule(PBName.RtcInput);
            modules.setRoomType(exports.RTCMode.LIVE);
            broadcastType && modules.setBroadcastType(broadcastType);
            modules.setIdentityChangeType(changeType);
            modules.setNeedSysChatroom(needSyncChrm);
            return modules.getArrayData();
        }
        /**
         * RTC 直播观众拉取房间内 KV
        */
        encodePullRTCRoomKV(roomId, timestamp) {
            const modules = this._codec.getModule(PBName.RtcPullKV);
            modules.setTimestamp(timestamp);
            modules.setRoomId(roomId);
            return modules.getArrayData();
        }
        /**
         * RTC 查询在房间内用户的信息
         */
        encodeQueryUserJoinedInfo(userId) {
            const modules = this._codec.getModule(PBName.RtcQueryUserJoinedInput);
            modules.setUserId(userId);
            return modules.getArrayData();
        }
    }

    /**
     * 数据通道接口，为 long-polling 与 websocket 提供公共抽象
     */
    class ADataChannel {
        constructor(type, _watcher) {
            this._watcher = _watcher;
            this.codec = new DataCodec(type);
        }
    }

    const getIdentifier = (messageId, identifier) => {
        if (messageId && identifier) {
            return identifier + '_' + messageId;
        }
        else if (messageId) {
            return messageId;
        }
        else {
            return Date.now(); // 若无 messageId、identifer, 直接返回时间戳, 避免返回空造成唯一标识重复
        }
    };
    /**
     * @description
     * 与 Server 交互的信令封装
    */
    /**
     * @description
     * 读数据处理基类
    */
    class BaseReader {
        constructor(header) {
            this.header = header;
            this._name = null;
            this.lengthSize = 0;
            this.messageId = 0;
            this.timestamp = 0;
            this.syncMsg = false;
            this.identifier = ''; // string + messageId 作为唯一标识, 目前用处: 方便 Pub、Query 回执定位对应 Promise, 且增加前缀避免 Pub、Query 回执错乱
        }
        getIdentifier() {
            const { messageId, identifier } = this;
            return getIdentifier(messageId, identifier);
        }
        read(stream, length) {
            this.readMessage(stream, length);
            // return { stream, length }
        }
        readMessage(stream, length) {
            return {
                stream,
                length
            };
        }
    }
    /**
     * @description
     * 写数据处理基类
     */
    class BaseWriter {
        constructor(headerType) {
            this.lengthSize = 0;
            this.messageId = 0;
            this.topic = '';
            this.targetId = '';
            this.identifier = '';
            this._header = new Header(headerType, false, QOS.AT_MOST_ONCE, false);
        }
        getIdentifier() {
            const { messageId, identifier } = this;
            return getIdentifier(messageId, identifier);
        }
        write(stream) {
            const headerCode = this.getHeaderFlag();
            stream.write(headerCode); // 写入 Header
            this.writeMessage(stream);
        }
        setHeaderQos(qos) {
            this._header.qos = qos;
        }
        getHeaderFlag() {
            return this._header.encode();
        }
        getLengthSize() {
            return this.lengthSize;
        }
        getBufferData() {
            const stream = new RongStreamWriter();
            this.write(stream);
            const val = stream.getBytesArray();
            const binary = new Int8Array(val);
            return binary;
        }
        getCometData() {
            const data = this.data || {};
            return JSON.stringify(data);
        }
    }
    /**
     * @description
     * 连接成功后服务端的回执
     */
    class ConnAckReader extends BaseReader {
        constructor() {
            super(...arguments);
            this._name = MessageName.CONN_ACK;
            this.status = null; // 链接状态
            this.userId = null; // 用户 id
            // sessionId: string;
            this.timestamp = 0;
        }
        readMessage(stream, length) {
            stream.readByte(); // 去除 Header
            this.status = +stream.readByte();
            if (length > ConnAckReader.MESSAGE_LENGTH) {
                this.userId = stream.readUTF();
                const sessionId = stream.readUTF(); // 此处为取 sessionId, ws 未用到此值, 但也需执行, 否则读取后面数值时会不准
                logger.debug('server sessionId -> ' + sessionId);
                this.timestamp = stream.readLong();
            }
            return {
                stream,
                length
            };
        }
    }
    ConnAckReader.MESSAGE_LENGTH = 2;
    /**
     * @description
     * 服务端断开链接. 比如: 被踢
     */
    class DisconnectReader extends BaseReader {
        constructor() {
            super(...arguments);
            this._name = MessageName.DISCONNECT;
            this.status = 0;
        }
        readMessage(stream, length) {
            stream.readByte();
            // (1)、此处未转换为链接状态码  (2)、2.0 代码限制了 status 为 0 - 5, 不在范围内则报错. 此处去掉此判断
            this.status = +stream.readByte();
            return {
                stream,
                length
            };
        }
    }
    DisconnectReader.MESSAGE_LENGTH = 2;
    /**
     * @description
     * ping 请求
     */
    class PingReqWriter extends BaseWriter {
        constructor() {
            super(OperationType.PING_REQ);
            this._name = MessageName.PING_REQ;
        }
        writeMessage(stream) { }
    }
    /**
     * @description
     * ping 响应
     */
    class PingRespReader extends BaseReader {
        constructor(header) {
            super(header);
            this._name = MessageName.PING_RESP;
        }
    }
    class RetryableReader extends BaseReader {
        constructor() {
            super(...arguments);
            this.messageId = 0;
        }
        readMessage(stream, length) {
            const msgId = stream.readByte() * 256 + stream.readByte();
            this.messageId = parseInt(msgId.toString(), 10);
            return {
                stream,
                length
            };
        }
    }
    class RetryableWriter extends BaseWriter {
        constructor() {
            super(...arguments);
            this.messageId = 0;
        }
        writeMessage(stream) {
            const id = this.messageId;
            const lsb = id & 255;
            const msb = (id & 65280) >> 8; // 65280 -> 1111111100000000
            stream.write(msb);
            stream.write(lsb);
        }
    }
    class PublishReader extends RetryableReader {
        constructor() {
            super(...arguments);
            this._name = MessageName.PUBLISH;
            this.topic = '';
            this.targetId = '';
            this.syncMsg = false;
            this.identifier = IDENTIFIER.PUB;
        }
        readMessage(stream, length) {
            // let pos = 6;
            this.date = stream.readInt();
            this.topic = stream.readUTF();
            // pos += BinaryHelper.writeUTF(this.topic).length;
            this.targetId = stream.readUTF();
            // pos += BinaryHelper.writeUTF(this.targetId).length;
            // RetryableReader.prototype.readMessage.apply(this, arguments)
            super.readMessage(stream, length);
            // this.data = new Array(msgLength - pos);
            this.data = stream.readAll();
            return {
                stream,
                length
            };
        }
    }
    /**
     * @description
     * 发消息使用
     */
    class PublishWriter extends RetryableWriter {
        constructor(topic, data, targetId) {
            super(OperationType.PUBLISH);
            this._name = MessageName.PUBLISH;
            this.syncMsg = false;
            this.identifier = IDENTIFIER.PUB;
            this.topic = topic;
            this.data = isString(data) ? BinaryHelper.writeUTF(data) : data;
            this.targetId = targetId;
        }
        writeMessage(stream) {
            stream.writeUTF(this.topic);
            stream.writeUTF(this.targetId);
            super.writeMessage(stream);
            stream.write(this.data);
        }
    }
    /**
     * @description
     * 发消息, Server 给的 Ack 回执
     */
    class PubAckReader extends RetryableReader {
        constructor() {
            super(...arguments);
            this._name = MessageName.PUB_ACK;
            this.status = 0;
            this.date = 0;
            this.millisecond = 0;
            this.messageUId = '';
            this.timestamp = 0;
            this.identifier = IDENTIFIER.PUB;
            this.topic = '';
            this.targetId = '';
        }
        readMessage(stream, length) {
            super.readMessage(stream, length);
            this.date = stream.readInt();
            this.status = stream.readByte() * 256 + stream.readByte();
            this.millisecond = stream.readByte() * 256 + stream.readByte();
            this.timestamp = this.date * 1000 + this.millisecond;
            this.messageUId = stream.readUTF();
            return {
                stream,
                length
            };
        }
    }
    /**
     * @description
     * Server 下发 Pub, Web 给 Server 发送回执
     */
    class PubAckWriter extends RetryableWriter {
        constructor(messageId) {
            super(OperationType.PUB_ACK);
            this._name = MessageName.PUB_ACK;
            this.status = 0;
            this.date = 0;
            this.millisecond = 0;
            this.messageUId = '';
            this.timestamp = 0;
            this.messageId = messageId;
        }
        writeMessage(stream) {
            super.writeMessage(stream);
        }
    }
    /**
     * @description
     * Web 主动查询
     */
    class QueryWriter extends RetryableWriter {
        constructor(topic, data, targetId) {
            super(OperationType.QUERY);
            this.name = MessageName.QUERY;
            this.identifier = IDENTIFIER.QUERY;
            this.topic = topic;
            this.data = isString(data) ? BinaryHelper.writeUTF(data) : data;
            this.targetId = targetId;
        }
        writeMessage(stream) {
            stream.writeUTF(this.topic);
            stream.writeUTF(this.targetId);
            // RetryableWriter.prototype.writeMessage.call(this, stream)
            super.writeMessage(stream);
            stream.write(this.data);
        }
    }
    /**
     * @description
     * Server 发送 Query, Web 给 Server 的回执
     */
    class QueryConWriter extends RetryableWriter {
        constructor(messageId) {
            super(OperationType.QUERY_CONFIRM);
            this._name = MessageName.QUERY_CON;
            this.messageId = messageId;
        }
    }
    /**
     * @description
     * Server 对 Web 查询操作的回执
     */
    class QueryAckReader extends RetryableReader {
        constructor() {
            super(...arguments);
            this._name = MessageName.QUERY_ACK;
            this.status = 0;
            this.identifier = IDENTIFIER.QUERY;
            this.topic = '';
            this.targetId = '';
        }
        readMessage(stream, length) {
            // RetryableReader.prototype.readMessage.call(this, stream)
            super.readMessage(stream, length);
            this.date = stream.readInt();
            this.status = stream.readByte() * 256 + stream.readByte();
            this.data = stream.readAll();
            // if (msgLength > 0) {
            //   this.data = new Array(msgLength - 8);
            //   this.data = stream.readAll();
            // }
            return {
                stream,
                length
            };
        }
    }
    const getReaderByHeader = (header) => {
        const type = header.type;
        let msg;
        switch (type) {
            case OperationType.CONN_ACK:
                msg = new ConnAckReader(header);
                break;
            case OperationType.PUBLISH:
                msg = new PublishReader(header);
                msg.syncMsg = header.syncMsg;
                break;
            case OperationType.PUB_ACK:
                msg = new PubAckReader(header);
                break;
            case OperationType.QUERY_ACK:
                msg = new QueryAckReader(header);
                break;
            case OperationType.SUB_ACK:
            case OperationType.UNSUB_ACK:
            case OperationType.PING_RESP:
                msg = new PingRespReader(header);
                break;
            case OperationType.DISCONNECT:
                msg = new DisconnectReader(header);
                break;
            default:
                msg = new BaseReader(header);
                logger.error('No support for deserializing ' + type + ' messages');
        }
        return msg;
    };
    /**
     * 解析 websocket 收到的数据 ArrayBuffer 数据
     * @param {ArrayBuffer} data server 通过 webscoekt 传送的所有数据
     */
    const readWSBuffer = (data) => {
        const arr = new Uint8Array(data);
        const stream = new RongStreamReader(arr);
        const flags = stream.readByte();
        const header = new Header(flags);
        const msg = getReaderByHeader(header);
        msg.read(stream, arr.length - 1);
        return msg;
    };
    const readCometData = (data) => {
        const flags = data.headerCode;
        const header = new Header(flags);
        const msg = getReaderByHeader(header);
        // utils.forEach(data, (item: any, key: string) => {
        //   if (key in msg) {
        //     msg[key] = item;
        //   }
        // });
        for (const key in data) {
            // if (key in msg) {
            msg[key] = data[key];
            // }
        }
        return msg;
    };

    /* eslint-disable camelcase */
    /**
     * 信令名
     */
    var Topic;
    (function (Topic) {
        /** 发送消息进入离线消息存储，接收者不在线时，可转推送 */
        Topic[Topic["ppMsgP"] = 1] = "ppMsgP";
        /** 发送消息进入离线消息存储，接收者不在线时，不转推送 */
        Topic[Topic["ppMsgN"] = 2] = "ppMsgN";
        /** 发送消息不进入离线存储，用户在线时直发到接收者，不在线时消息丢弃，不转推送 */
        Topic[Topic["ppMsgS"] = 3] = "ppMsgS";
        Topic[Topic["pgMsgP"] = 4] = "pgMsgP";
        Topic[Topic["chatMsg"] = 5] = "chatMsg";
        Topic[Topic["pcMsgP"] = 6] = "pcMsgP";
        Topic[Topic["qryPMsg"] = 7] = "qryPMsg";
        Topic[Topic["qryGMsg"] = 8] = "qryGMsg";
        Topic[Topic["qryCHMsg"] = 9] = "qryCHMsg";
        Topic[Topic["qryCMsg"] = 10] = "qryCMsg";
        Topic[Topic["qrySMsg"] = 11] = "qrySMsg";
        Topic[Topic["recallMsg"] = 12] = "recallMsg";
        Topic[Topic["prMsgS"] = 13] = "prMsgS";
        /** 发送已读回执 */
        Topic[Topic["rrMsg"] = 14] = "rrMsg";
        /** 获取已读列表 */
        Topic[Topic["rrList"] = 15] = "rrList";
        /** 消息通知拉取 */
        Topic[Topic["s_ntf"] = 16] = "s_ntf";
        /** 服务直发消息 */
        Topic[Topic["s_msg"] = 17] = "s_msg";
        /**
         * 状态同步
         * @todo 需确定同步哪些状态
         */
        Topic[Topic["s_stat"] = 18] = "s_stat";
        /** 服务端通知：聊天室 kv 、会话状态 */
        Topic[Topic["s_cmd"] = 19] = "s_cmd";
        /** 实时配置变更通知 */
        Topic[Topic["s_us"] = 20] = "s_us";
        /** 拉取实时配置 */
        Topic[Topic["pullUS"] = 21] = "pullUS";
        Topic[Topic["pgMsgS"] = 22] = "pgMsgS";
        Topic[Topic["chatMsgS"] = 23] = "chatMsgS";
        Topic[Topic["qrySessionsAtt"] = 24] = "qrySessionsAtt";
        Topic[Topic["pullMsg"] = 25] = "pullMsg";
        Topic[Topic["qrySessions"] = 26] = "qrySessions";
        Topic[Topic["delSessions"] = 27] = "delSessions";
        Topic[Topic["delMsg"] = 28] = "delMsg";
        Topic[Topic["updRRTime"] = 29] = "updRRTime";
        /** 拉取聊天室消息 */
        Topic[Topic["chrmPull"] = 30] = "chrmPull";
        Topic[Topic["joinChrm"] = 31] = "joinChrm";
        Topic[Topic["joinChrmR"] = 32] = "joinChrmR";
        Topic[Topic["exitChrm"] = 33] = "exitChrm";
        Topic[Topic["queryChrmI"] = 34] = "queryChrmI";
        Topic[Topic["setKV"] = 35] = "setKV";
        Topic[Topic["delKV"] = 36] = "delKV";
        /** 拉取聊天室 KV 存储 */
        Topic[Topic["pullKV"] = 37] = "pullKV";
        Topic[Topic["qryRelation"] = 38] = "qryRelation";
        Topic[Topic["delRelation"] = 39] = "delRelation";
        Topic[Topic["pullSeAtts"] = 40] = "pullSeAtts";
        Topic[Topic["setSeAtt"] = 41] = "setSeAtt";
        Topic[Topic["qnTkn"] = 42] = "qnTkn";
        Topic[Topic["qnUrl"] = 43] = "qnUrl";
        Topic[Topic["aliUrl"] = 44] = "aliUrl";
        Topic[Topic["s3Url"] = 45] = "s3Url";
        Topic[Topic["stcUrl"] = 46] = "stcUrl";
        Topic[Topic["cleanPMsg"] = 47] = "cleanPMsg";
        Topic[Topic["cleanGMsg"] = 48] = "cleanGMsg";
        Topic[Topic["cleanCMsg"] = 49] = "cleanCMsg";
        Topic[Topic["cleanSMsg"] = 50] = "cleanSMsg";
        Topic[Topic["rtcRJoin_data"] = 51] = "rtcRJoin_data";
        Topic[Topic["rtcRExit"] = 52] = "rtcRExit";
        Topic[Topic["rtcPing"] = 53] = "rtcPing";
        Topic[Topic["rtcSetData"] = 54] = "rtcSetData";
        Topic[Topic["rtc_ntf"] = 55] = "rtc_ntf";
        Topic[Topic["viewerJoinR"] = 56] = "viewerJoinR";
        Topic[Topic["viewerExitR"] = 57] = "viewerExitR";
        Topic[Topic["rtcPullKv"] = 58] = "rtcPullKv";
        Topic[Topic["rtcIdentityChange"] = 59] = "rtcIdentityChange";
        /** 全量 URI 资源变更 */
        Topic[Topic["userSetData"] = 60] = "userSetData";
        Topic[Topic["rtcQryData"] = 61] = "rtcQryData";
        Topic[Topic["rtcDelData"] = 62] = "rtcDelData";
        Topic[Topic["rtcSetOutData"] = 63] = "rtcSetOutData";
        Topic[Topic["rtcQryUserOutData"] = 64] = "rtcQryUserOutData";
        Topic[Topic["rtcToken"] = 65] = "rtcToken";
        Topic[Topic["rtcUserState"] = 66] = "rtcUserState";
        Topic[Topic["rtcRInfo"] = 67] = "rtcRInfo";
        Topic[Topic["rtcUData"] = 68] = "rtcUData";
        Topic[Topic["rtcUPut"] = 69] = "rtcUPut";
        Topic[Topic["rtcUDel"] = 70] = "rtcUDel";
        Topic[Topic["rtcUList"] = 71] = "rtcUList";
        Topic[Topic["rtcQueryJoined"] = 72] = "rtcQueryJoined";
        Topic[Topic["addSeTag"] = 73] = "addSeTag";
        Topic[Topic["delSeTag"] = 74] = "delSeTag";
        Topic[Topic["addTag"] = 75] = "addTag";
        Topic[Topic["delTag"] = 76] = "delTag";
        Topic[Topic["disTag"] = 77] = "disTag";
        Topic[Topic["reportsdk"] = 78] = "reportsdk"; // 上报融云SDK信息
    })(Topic || (Topic = {}));
    var Topic$1 = Topic;

    /**
     * 通过 /ping 接口确定目标导航是否可用，并根据响应速度排序
     * @todo 需确认该嗅探的必要性，并确定是否需要删除
     * @param hosts
     * @param protocol
     * @param runtime
     */
    const getValidHosts = (hosts, protocol, runtime) => __awaiter(void 0, void 0, void 0, function* () {
        // 根据 /ping?r=<random> 的响应速度对 hosts 进行排序响应速度排序
        let pingRes = yield Promise.all(hosts.map((host) => __awaiter(void 0, void 0, void 0, function* () {
            const now = Date.now();
            const url = `${protocol}://${host}/ping?r=${randomNum(1000, 9999)}`;
            const res = yield runtime.httpReq({
                url,
                timeout: PING_REQ_TIMEOUT
            });
            return { status: res.status, host, cost: Date.now() - now };
        })));
        // 清理无效地址
        pingRes = pingRes.filter(item => item.status === 200);
        // 按响应时间排序
        if (pingRes.length > 1) {
            pingRes = pingRes.sort((a, b) => a.cost - b.cost);
        }
        return pingRes.map(item => item.host);
    });
    const formatWSUrl = (protocol, host, appkey, token, runtime, apiVersion, pid) => {
        return `${protocol}://${host}/websocket?appId=${appkey}&token=${encodeURIComponent(token)}&sdkVer=${apiVersion}&pid=${pid}&apiVer=${runtime.isFromUniapp ? 'uniapp' : 'normal'}${runtime.connectPlatform ? '&platform=' + runtime.connectPlatform : ''}`;
    };
    const isStatusMessage = (topic) => {
        return [Topic$1.ppMsgS, Topic$1.pgMsgS, Topic$1.chatMsgS].map(item => Topic$1[item]).indexOf(topic) >= 0;
    };

    /**
     * 服务器推送的 DisconnectAck 信令状态码
     */
    var DisconnectReason;
    (function (DisconnectReason) {
        /**
         * 重定向（兼容老版本）
         */
        DisconnectReason[DisconnectReason["REDIRECT"] = 0] = "REDIRECT";
        /**
         * 其他端登录
         */
        DisconnectReason[DisconnectReason["OTHER_DEVICE_LOGIN"] = 1] = "OTHER_DEVICE_LOGIN";
        /**
         * 用户被封禁（兼容老版本）
         */
        DisconnectReason[DisconnectReason["BLOCK"] = 2] = "BLOCK";
        /**
         * 服务器端关闭连接，收到时直接 SDK 内部重连
         */
        DisconnectReason[DisconnectReason["REMOTE_CLOSE"] = 3] = "REMOTE_CLOSE";
        /**
         * 注销登录，web 不涉及无需处理
         */
        DisconnectReason[DisconnectReason["LOGOUT"] = 4] = "LOGOUT";
        /**
         * 用户被封禁
         */
        DisconnectReason[DisconnectReason["BLOCK_NEW"] = 5] = "BLOCK_NEW";
        /**
         * 重定向，SDK 需重新取导航进行重连尝试
         */
        DisconnectReason[DisconnectReason["REDIRECT_NEW"] = 6] = "REDIRECT_NEW";
    })(DisconnectReason || (DisconnectReason = {}));

    const sendWSData = (writer, socket) => {
        logger.debug(`websocket send -> messageId: ${writer.messageId}`);
        const binary = writer.getBufferData();
        socket.send(binary.buffer);
    };
    /**
     * @todo 迁移中的 DataCodec 模块导致数据通道不够独立，与 xhr-polling 通信可能会有耦合，后续需解耦
     * @description
     * 1. 基于 WebSocket 协议建立数据通道，实现数据收发
     * 2. 基于 Protobuf 进行数据编解码
     */
    class WebSocketChannel extends ADataChannel {
        // 为避免 Circular dependency，此处 runtime 通过参数传入而非全局获取
        constructor(_runtime, watcher) {
            super('websocket', watcher);
            this._runtime = _runtime;
            this._socket = null;
            /**
             * 本端发送消息时等待接收 PubAck 的 Promise.resolve 函数
             */
            this._messageIds = {};
            /**
             * 接收多端同步消息时，等待 PubAck 的 Promise.resolve 函数
             */
            this._syncMessageIds = {};
            /**
             * 当前累计心跳超时次数
             */
            this._failedCount = 0;
            /**
             * 允许连续 PING 超时次数，次数内不主动关闭连接
             */
            this.ALLOW_FAILED_TIMES = 2;
            /**
             * ping定时器
             */
            this._timer = null;
            /**
             * 有效值 0 - 65535，超出 65535 位数超长溢出
             */
            this._idCount = 0;
            this._generateMessageId = () => {
                if (this._idCount >= 65535) {
                    this._idCount = 0;
                }
                return ++this._idCount;
            };
        }
        /**
         * 建立 websocket 连接
         * @param appkey
         * @param token
         * @param hosts
         * @param protocol
         * @param apiVersion - apiVersion 需符合 `/\d+(\.\d+){2}/` 规则
         */
        connect(appkey, token, hosts, protocol, apiVersion) {
            return __awaiter(this, void 0, void 0, function* () {
                // 祛除预发布包中的预发布标签，取真实版本号
                apiVersion = matchVersion(apiVersion);
                // 通知连接中
                this._watcher.status(ConnectionStatus$1.CONNECTING);
                logger.debug(`ping -> protocol: ${protocol}, hosts: ${JSON.stringify(hosts)}`);
                // 检索有效地址
                const validHosts = yield getValidHosts(hosts, protocol, this._runtime);
                logger.debug(`valid hosts -> ${validHosts.join(',')}`);
                if (validHosts.length === 0) {
                    logger.error('No valid websocket server hosts!');
                    return ErrorCode$1.RC_SOCKET_NOT_CREATED;
                }
                // 确定连接协议：http -> ws, https -> wss
                const wsProtocol = protocol.replace('http', 'ws');
                let code;
                // 逐个尝试建立 websocket 连接
                for (let i = 0, len = validHosts.length; i < len; i += 1) {
                    const url = formatWSUrl(wsProtocol, validHosts[i], appkey, token, this._runtime, apiVersion);
                    logger.debug(`conenct start -> ${url}`);
                    this.sendConnectTime = Date.now();
                    // 创建 socket，若超时一定时间未收到 ConnAck 确认，则视为连接超时
                    const socket = this._runtime.createWebSocket(url);
                    // 服务连接非主动断开，尝试重连
                    const disconnected = (code) => {
                        if (this._timer) {
                            clearTimeout(this._timer);
                            this._timer = null;
                        }
                        if (this._socket === socket) {
                            this._socket = null;
                            this._watcher.status(code);
                        }
                    };
                    // 等待连接结果
                    code = yield new Promise((resolve) => {
                        socket.onMessage((data) => {
                            if (Object.prototype.toString.call(data) !== '[object ArrayBuffer]') {
                                logger.error('Socket received invalid data:', data);
                                return;
                            }
                            const signal = readWSBuffer(data);
                            // Ping 响应
                            if (signal instanceof PingRespReader && this._pingResolve) {
                                this._pingResolve(ErrorCode$1.SUCCESS);
                                this._pingResolve = undefined;
                                return;
                            }
                            // 连接回执
                            if (signal instanceof ConnAckReader) {
                                logger.debug(`recv connect ack -> ${signal.status}`);
                                if (signal.status !== ConnectResultCode.ACCEPTED) {
                                    logger.warn(`connect failed: ${signal.status}`);
                                    resolve(signal.status);
                                    return;
                                }
                                logger.info(`connect success -> ${url}`);
                                this.connectedTime = signal.timestamp;
                                this.userId = signal.userId || '';
                                resolve(ErrorCode$1.SUCCESS);
                                return;
                            }
                            // 服务器主动断开
                            if (signal instanceof DisconnectReader) {
                                const { status } = signal;
                                logger.warn(`recv disconnect signal -> status: ${status}`);
                                switch (status) {
                                    case DisconnectReason.BLOCK:
                                        this._watcher.status(ConnectionStatus$1.BLOCKED);
                                        break;
                                    case DisconnectReason.OTHER_DEVICE_LOGIN:
                                        this._watcher.status(ConnectionStatus$1.KICKED_OFFLINE_BY_OTHER_CLIENT);
                                        break;
                                    case DisconnectReason.REDIRECT_NEW:
                                    case DisconnectReason.REDIRECT:
                                        this._watcher.status(ConnectionStatus$1.REDIRECT);
                                        break;
                                    default:
                                        this._watcher.status(ConnectionStatus$1.DISCONNECT_BY_SERVER);
                                        break;
                                }
                                return;
                            }
                            // 非连接信令处理
                            this._onReceiveSignal(signal);
                        });
                        socket.onClose((code, reason) => {
                            logger.warn('websocket closed! code:', code, 'reason:', reason);
                            disconnected(ConnectionStatus$1.CONNECTION_CLOSED);
                            resolve(code);
                        });
                        socket.onError((error) => {
                            var _a;
                            logger.error('websocket error!', (_a = error) === null || _a === void 0 ? void 0 : _a.stack);
                            disconnected(ConnectionStatus$1.WEBSOCKET_ERROR);
                            resolve(ErrorCode$1.NETWORK_ERROR);
                        });
                        socket.onOpen(() => logger.debug('websocket open =>', url));
                        // ConnAck 超时
                        timerSetTimeout(() => {
                            resolve(ErrorCode$1.TIMEOUT);
                        }, WEB_SOCKET_TIMEOUT);
                    });
                    if (code === ConnectResultCode.REDIRECT) {
                        return code;
                    }
                    if (code === ErrorCode$1.SUCCESS) {
                        this._socket = socket;
                        // 启动定时心跳
                        this._checkAlive();
                        return code;
                    }
                    else {
                        logger.warn(`connect result -> code: ${code}, url: ${url}`);
                        code = formatConnectResponseCode(code);
                    }
                    socket.close();
                }
                return code !== undefined ? code : ErrorCode$1.RC_NET_UNAVAILABLE;
            });
        }
        _checkAlive() {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._socket) {
                    // 连接已中断，停止发 Ping
                    return;
                }
                logger.debug('send ping ->');
                this.sendOnly(new PingReqWriter());
                // 等待响应
                const code = yield new Promise((resolve) => {
                    this._pingResolve = resolve;
                    if (this._timer) {
                        clearTimeout(this._timer);
                    }
                    this._timer = setTimeout(() => {
                        this._pingResolve = undefined;
                        resolve(ErrorCode$1.TIMEOUT);
                    }, IM_PING_TIMEOUT);
                });
                if (code !== ErrorCode$1.SUCCESS) {
                    // 响应超时，失败计数 +1
                    this._failedCount += 1;
                    logger.warn(`ping failed count: ${this._failedCount}, code: ${code}`);
                    // 超出计数，主动关闭连接以触发重连
                    if (this._failedCount >= this.ALLOW_FAILED_TIMES) {
                        this._failedCount = 0;
                        logger.warn('ping timeout, close current websocket to reconnect!');
                        (_a = this._socket) === null || _a === void 0 ? void 0 : _a.close();
                    }
                    else {
                        // 计数未超出，立即重新发 ping
                        this._checkAlive();
                    }
                    return;
                }
                logger.debug('recv pong <-');
                // 响应成功，清理失败计数
                this._failedCount = 0;
                // 重启定时任务
                setTimeout(() => this._checkAlive(), IM_PING_INTERVAL_TIME);
            });
        }
        _onReceiveSignal(signal) {
            return __awaiter(this, void 0, void 0, function* () {
                const { messageId } = signal;
                // 检查是否为 Ack, 如果是, 则处理回执
                const isQosNeedAck = signal.header && signal.header.qos !== QOS.AT_MOST_ONCE;
                if (isQosNeedAck) {
                    // Pub 回执
                    if (signal instanceof PublishReader && !signal.syncMsg) {
                        logger.debug(`send pubAck -> ${messageId}`);
                        this.sendOnly(new PubAckWriter(messageId));
                    }
                    // qry 回执
                    if (signal instanceof QueryAckReader) {
                        logger.debug(`send queryCon -> ${messageId}`);
                        this.sendOnly(new QueryConWriter(messageId));
                    }
                }
                // 处理 pubAck、queryAck 回执
                if (messageId > 0) {
                    logger.debug(`recv ack -> messageId: ${messageId}`);
                    const resolve = this._messageIds[messageId];
                    if (resolve) {
                        resolve(signal);
                        delete this._messageIds[messageId];
                    }
                    // 多端同步消息的 pubAck
                    const syncResolve = this._syncMessageIds[messageId];
                    if (syncResolve) {
                        delete this._syncMessageIds[messageId];
                        syncResolve(signal);
                    }
                }
                // PublishReader 处理
                if (signal instanceof PublishReader) {
                    const { syncMsg, topic } = signal;
                    if (topic === Topic$1[Topic$1.userSetData]) {
                        // 多端情况下，某端进行资源变更时，服务器会抄送 userSetData 给多端，收到此类信令可忽略
                        return;
                    }
                    // 非同步消息或者是状态消息（ppMsgS，pgMsgS，chatMsgS），则直接抛出到上层
                    if (!syncMsg || isStatusMessage(topic)) {
                        this._watcher.signal(signal);
                        return;
                    }
                    // 多端同步消息息需等待 CMP 发送的 PubAck（Comet 不发）
                    const ack = yield new Promise(resolve => {
                        this._syncMessageIds[messageId] = resolve;
                    });
                    delete this._syncMessageIds[messageId];
                    this._watcher.signal(signal, ack);
                }
            });
        }
        sendOnly(writer) {
            if (this._socket) {
                sendWSData(writer, this._socket);
            }
        }
        send(writer, respPBName, option, timeout = IM_SIGNAL_TIMEOUT) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this._socket) {
                    const messageId = this._generateMessageId();
                    writer.messageId = messageId;
                    sendWSData(writer, this._socket);
                    // 等待响应结果
                    const respSignal = yield new Promise((resolve) => {
                        this._messageIds[messageId] = resolve;
                        setTimeout(() => {
                            if (this._messageIds[messageId]) {
                                delete this._messageIds[messageId];
                            }
                            resolve(); // 无值认为 timeout 超时
                        }, timeout);
                    });
                    if (!respSignal) {
                        logger.warn(`send timeout -> message: ${messageId}, respPBName: ${respPBName}, timeout: ${timeout}`);
                        return { code: ErrorCode$1.TIMEOUT };
                    }
                    if (respSignal.status !== 0) {
                        logger.warn(`send failed -> message: ${messageId}, respPBName: ${respPBName}, status: ${respSignal.status}`);
                        return { code: respSignal.status };
                    }
                    const data = respPBName ? this.codec.decodeByPBName(respSignal.data, respPBName, option) : respSignal;
                    return { code: ErrorCode$1.SUCCESS, data };
                }
                return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
            });
        }
        close() {
            if (this._socket) {
                this._socket.close();
                this._socket = null;
                this._watcher.status(ConnectionStatus$1.DISCONNECTED);
            }
        }
    }

    exports.HttpMethod = void 0;
    (function (HttpMethod) {
        HttpMethod["GET"] = "GET";
        HttpMethod["POST"] = "POST";
    })(exports.HttpMethod || (exports.HttpMethod = {}));

    const isValidJSON = (jsonStr) => {
        if (isObject(jsonStr)) {
            return true;
        }
        let isValid = false;
        try {
            const obj = JSON.parse(jsonStr);
            const str = JSON.stringify(obj);
            isValid = str === jsonStr;
        }
        catch (e) {
            isValid = false;
        }
        return isValid;
    };
    class CometChannel extends ADataChannel {
        constructor(_runtime, watcher) {
            super('comet', watcher);
            this._runtime = _runtime;
            this._messageIds = {};
            this._syncMessageIds = {};
            this._idCount = 0;
            this._generateMessageId = () => {
                return ++this._idCount;
            };
            this._pid = encodeURIComponent(new Date().getTime() + Math.random() + '');
        }
        /**
         * 长轮询结果处理
         * @param data
         */
        handleCometRes(res) {
            if (res.status !== 200 && res.status !== 202) {
                return false;
            }
            const data = isString(res.data) ? JSON.parse(res.data) : res.data;
            if (!data) {
                logger.error('received data is not a validJson', data);
                return false;
            }
            if (!isArray(data)) {
                return true;
            }
            forEach(data, (item) => __awaiter(this, void 0, void 0, function* () {
                const { sessionid } = item;
                if (sessionid) {
                    this._sessionid = sessionid;
                }
                const signal = readCometData(item);
                const { messageId, _header, status, identifier } = signal;
                const isQosNeedAck = _header && _header.qos !== QOS.AT_MOST_ONCE;
                // 处理 pubAck、queryAck 回执
                if (messageId && signal.getIdentifier) {
                    const resolve = this._messageIds[messageId];
                    resolve && resolve(signal);
                    // 多端同步消息的 pubAck
                    this._syncMessageIds[messageId] && this._syncMessageIds[messageId](signal);
                }
                // 是否需要发回执
                if (isQosNeedAck) {
                    if (signal instanceof PublishReader && !signal.syncMsg) {
                        const writer = new PubAckWriter(messageId);
                        this.sendOnly(writer);
                    }
                    if (signal instanceof QueryAckReader) {
                        const writer = new QueryConWriter(messageId);
                        this.sendOnly(writer);
                    }
                }
                // 连接状态断开
                if (signal instanceof DisconnectReader) {
                    switch (status) {
                        case DisconnectReason.OTHER_DEVICE_LOGIN:
                            this._watcher.status(ConnectionStatus$1.KICKED_OFFLINE_BY_OTHER_CLIENT);
                            break;
                        case DisconnectReason.BLOCK:
                            this._watcher.status(ConnectionStatus$1.BLOCKED);
                            break;
                        case DisconnectReason.REDIRECT_NEW:
                        case DisconnectReason.REDIRECT:
                            this._watcher.status(ConnectionStatus$1.REDIRECT);
                            break;
                        default:
                            this._watcher.status(ConnectionStatus$1.DISCONNECT_BY_SERVER);
                            break;
                    }
                    return;
                }
                // 处理 publish
                if (signal instanceof PublishReader) {
                    const { syncMsg, topic } = signal;
                    // 非同步消息或者是状态消息（ppMsgS，pgMsgS，chatMsgS），则直接抛出到上层
                    if (!syncMsg || isStatusMessage(topic)) {
                        this._watcher.signal(signal);
                        return false;
                    }
                    // 多端同步消息需等待 CMP 发送的 PubAck
                    const ack = yield new Promise(resolve => {
                        this._syncMessageIds[messageId] = resolve;
                    });
                    delete this._syncMessageIds[messageId];
                    this._watcher.signal(signal, ack);
                }
            }));
            return true;
        }
        /**
         * 长轮询心跳
         */
        _startPullSignal(protocol) {
            return __awaiter(this, void 0, void 0, function* () {
                const timestamp = new Date().getTime();
                const url = `${protocol}://${this._domain}/pullmsg.js?sessionid=${this._sessionid}&timestrap=${timestamp}&pid=${this._pid}`;
                const res = yield this._runtime.httpReq({
                    url,
                    body: { pid: this._pid },
                    timeout: IM_COMET_PULLMSG_TIMEOUT
                });
                const isSuccess = this.handleCometRes(res);
                if (!this._isDisconnected) {
                    if (isSuccess) {
                        this._startPullSignal(protocol);
                    }
                    else {
                        this._isDisconnected = true;
                        this._watcher.status(ConnectionStatus$1.NETWORK_UNAVAILABLE);
                    }
                }
            });
        }
        connect(appkey, token, hosts, protocol, apiVersion) {
            return __awaiter(this, void 0, void 0, function* () {
                // 祛除预发布包中的预发布标签，取真实版本号
                apiVersion = matchVersion(apiVersion);
                this._protocol = protocol;
                this._isDisconnected = false;
                this._watcher.status(ConnectionStatus$1.CONNECTING);
                const validHosts = yield getValidHosts(hosts, protocol, this._runtime);
                if (validHosts.length === 0) {
                    logger.error('No valid comet server hosts!');
                    return ErrorCode$1.RC_SOCKET_NOT_CREATED;
                }
                /**
                 * 连接结果处理
                 */
                const handleConnectRes = (res) => {
                    if (res.status !== 200 && res.status !== 202) {
                        logger.error(`handle comet res -> res: ${JSON.stringify(res || {})}`);
                        return false;
                    }
                    if (res.data) {
                        if (!isValidJSON(res.data)) {
                            logger.error('received data is not a validJson', res.data);
                            return false;
                        }
                        return isObject(res.data) ? res.data : JSON.parse(res.data);
                    }
                    return false;
                };
                let code;
                for (let i = 0, len = validHosts.length; i < len; i += 1) {
                    const url = formatWSUrl(protocol, validHosts[i], appkey, token, this._runtime, apiVersion, this._pid);
                    this.sendConnectTime = Date.now();
                    const res = yield this._runtime.httpReq({
                        url,
                        body: {
                            pid: this._pid
                        },
                        timeout: WEB_SOCKET_TIMEOUT
                    });
                    const response = handleConnectRes(res);
                    this._domain = validHosts[i];
                    if (response && response.status === ConnectResultCode.REDIRECT) {
                        return response.status;
                    }
                    if (response && response.status === 0) {
                        this._watcher.status(ConnectionStatus$1.CONNECTED);
                        this._sessionid = response.sessionid;
                        this._startPullSignal(protocol);
                        this.userId = response.userId;
                        this.connectedTime = response.timestamp;
                        return response.status;
                    }
                    else {
                        logger.warn(`connect result -> code: ${response === null || response === void 0 ? void 0 : response.status}, url: ${url}`);
                        code = formatConnectResponseCode(response === null || response === void 0 ? void 0 : response.status);
                    }
                }
                return code !== undefined ? code : ErrorCode$1.RC_NET_UNAVAILABLE;
            });
        }
        sendCometData(writer, timeout = IM_SIGNAL_TIMEOUT) {
            return __awaiter(this, void 0, void 0, function* () {
                const { _domain, _sessionid, _pid } = this;
                const { messageId, topic, targetId, identifier } = writer;
                const headerCode = writer.getHeaderFlag();
                let url;
                if (topic) {
                    url = `${this._protocol}://${_domain}/websocket?messageid=${messageId}&header=${headerCode}&sessionid=${_sessionid}&topic=${topic}&targetid=${targetId}&pid=${_pid}`;
                }
                else {
                    url = `${this._protocol}://${_domain}/websocket?messageid=${messageId}&header=${headerCode}&sessionid=${_sessionid}&pid=${_pid}`;
                }
                const res = yield this._runtime.httpReq({
                    url,
                    method: exports.HttpMethod.POST,
                    body: writer.getCometData()
                });
                this.handleCometRes(res);
            });
        }
        sendOnly(writer) {
            this.sendCometData(writer);
        }
        send(writer, respPBName, option, timeout = IM_SIGNAL_TIMEOUT) {
            return __awaiter(this, void 0, void 0, function* () {
                const messageId = this._generateMessageId();
                writer.messageId = messageId;
                this.sendCometData(writer);
                const respSignal = yield new Promise((resolve) => {
                    this._messageIds[messageId] = resolve;
                    setTimeout(() => {
                        delete this._messageIds[messageId];
                        resolve(); // 无值认为 timeout 超时
                    }, timeout);
                });
                if (!respSignal) {
                    return { code: ErrorCode$1.TIMEOUT };
                }
                if (respSignal.status !== 0) {
                    return { code: respSignal.status };
                }
                const data = respPBName ? this.codec.decodeByPBName(respSignal.data, respPBName, option) : respSignal;
                return { code: ErrorCode$1.SUCCESS, data };
            });
        }
        close() {
            this._isDisconnected = true;
            this._watcher.status(ConnectionStatus$1.DISCONNECTED);
        }
    }

    /**
     * 引擎定义
     */
    class AEngine {
        /**
         * 引擎初始化
         * @param _appkey
         */
        constructor(runtime, _watcher, _options) {
            this.runtime = runtime;
            this._watcher = _watcher;
            this._options = _options;
            /**
             * 当前用户 Id
             */
            this.currentUserId = '';
            this._appkey = this._options.appkey;
            this._apiVer = this._options.apiVersion;
            this.navi = this._createNavi();
        }
    }

    const getKey = (appkey) => {
        return ['navi', appkey].join('_');
    };
    const getNaviInfoFromCache = (appkey, token, storage) => {
        var _a;
        const key = getKey(appkey);
        let caches;
        try {
            const jsonStr = storage.getItem(key);
            caches = jsonStr ? JSON.parse(jsonStr) : [];
        }
        catch (error) {
            // 缓存数据被篡改造成解析失败，缓存失效
            caches = [];
        }
        const timestamp = Date.now();
        if (caches.length > 0) {
            // 清理过期缓存
            caches = caches.filter(item => timestamp - item.timestamp < NAVI_CACHE_DURATION);
        }
        caches.length === 0 ? storage.removeItem(key) : storage.setItem(key, JSON.stringify(caches));
        return ((_a = caches.find(item => item.token === token)) === null || _a === void 0 ? void 0 : _a.naviInfo) || null;
    };
    const setNaviInfo2Cache = (appkey, token, naviInfo, storage) => {
        const key = getKey(appkey);
        let caches;
        try {
            const jsonStr = storage.getItem(key);
            caches = jsonStr ? JSON.parse(jsonStr) : [];
        }
        catch (error) {
            // 缓存数据被篡改造成解析失败，缓存失效
            caches = [];
        }
        const timestamp = Date.now();
        if (caches.length > 0) {
            // 清理过期缓存与同 token 缓存
            caches = caches.filter(item => timestamp - item.timestamp < NAVI_CACHE_DURATION && token !== item.token);
        }
        caches.push({ timestamp, naviInfo, token });
        storage.setItem(key, JSON.stringify(caches));
    };
    const clearCache = (appkey, token, storage) => {
        const key = getKey(appkey);
        let caches;
        try {
            const jsonStr = storage.getItem(key);
            caches = jsonStr ? JSON.parse(jsonStr) : [];
        }
        catch (error) {
            // 缓存数据被篡改造成解析失败，缓存失效
            caches = [];
        }
        const timestamp = Date.now();
        if (caches.length > 0) {
            // 清理过期缓存与同 token 缓存
            caches = caches.filter(item => timestamp - item.timestamp < NAVI_CACHE_DURATION && token !== item.token);
        }
        caches.length === 0 ? storage.removeItem(key) : storage.setItem(key, JSON.stringify(caches));
    };
    class ANavi {
        constructor(_runtime, _options) {
            this._runtime = _runtime;
            this._options = _options;
            this._naviInfo = null;
            this._appkey = this._options.appkey;
            this._apiVersion = matchVersion(this._options.apiVersion);
        }
        /**
         * 获取导航数据
         * @param token
         * @param dynamicUris token 携带的动态导航地址
         * @param force 是否强制重新获取并清空缓存数据
         */
        getInfo(token, dynamicUris, force, checkCA) {
            return __awaiter(this, void 0, void 0, function* () {
                // 判断是否需要重新获取导航数据，是则清空缓存数据
                if (force) {
                    this._clear(token);
                }
                // 判断是否有有效缓存数据
                let naviInfo = getNaviInfoFromCache(this._appkey, token, this._runtime.localStorage);
                if (naviInfo) {
                    this._naviInfo = naviInfo;
                    return naviInfo;
                }
                const uris = this._options.navigators.slice();
                dynamicUris.length && dynamicUris.forEach(uri => {
                    uris.indexOf(uri) < 0 && uris.unshift(uri);
                });
                // 串行请求，直到获取到导航数据或所有请求结束
                // TODO: 考虑是否可改为并行请求，串行请求时间过长
                naviInfo = yield this._reqNavi(uris, this._appkey, token, checkCA);
                if (naviInfo) {
                    this._naviInfo = naviInfo;
                    this.setNaviInfo2Cache(token, naviInfo);
                    return naviInfo;
                }
                // TODO: 所有请求已失败，公有云需要内置导航数据
                return naviInfo;
            });
        }
        setNaviInfo2Cache(token, naviInfo) {
            this._naviInfo = naviInfo;
            setNaviInfo2Cache(this._appkey, token, naviInfo, this._runtime.localStorage);
        }
        getInfoFromCache(token) {
            // 因为localstorage中naviInfo会过期，没有自动更新，所以这里使用内存中的导航
            return this._naviInfo;
        }
        /**
         * 清空导航数据：内存数据、缓存数据
         */
        _clear(token) {
            clearCache(this._appkey, token, this._runtime.localStorage);
        }
    }

    const OUTBOX_KEY = 'outbox';
    const INBOX_KEY = 'inbox';
    const generateKey$1 = (prefix, appkey, userId) => {
        return [prefix, appkey, userId].join('_');
    };
    /**
     * 用于维护用户的收件箱、发件箱时间
     */
    class Letterbox {
        constructor(_runtime, _appkey) {
            this._runtime = _runtime;
            this._appkey = _appkey;
            // 需要在内存维护一份时间戳数据，以避免同浏览器多标签页下多端拉取消息时共享时间戳
            this._inboxTime = 0;
            this._outboxTime = 0;
        }
        /**
         * 更新收件箱时间
         * @param timestamp
         * @param userId
         */
        setInboxTime(timestamp, userId) {
            if (this._inboxTime > timestamp) {
                return;
            }
            this._inboxTime = timestamp;
            const key = generateKey$1(INBOX_KEY, this._appkey, userId);
            this._runtime.localStorage.setItem(key, timestamp.toString());
        }
        /**
         * 获取收件箱时间
         * @param userId
         */
        getInboxTime(userId) {
            if (this._inboxTime === 0) {
                const key = generateKey$1(INBOX_KEY, this._appkey, userId);
                this._inboxTime = parseInt(this._runtime.localStorage.getItem(key)) || 0;
            }
            return this._inboxTime;
        }
        /**
         * 更新发件箱时间
         * @param timestamp
         * @param userId
         */
        setOutboxTime(timestamp, userId) {
            if (this._outboxTime >= timestamp) {
                return;
            }
            this._outboxTime = timestamp;
            const key = generateKey$1(OUTBOX_KEY, this._appkey, userId);
            this._runtime.localStorage.setItem(key, timestamp.toString());
        }
        /**
         * 获取发件箱时间
         * @param userId
         */
        getOutboxTime(userId) {
            if (this._outboxTime === 0) {
                const key = generateKey$1(OUTBOX_KEY, this._appkey, userId);
                this._outboxTime = parseInt(this._runtime.localStorage.getItem(key)) || 0;
            }
            return this._outboxTime;
        }
    }

    const PullTimeCache = {
        _caches: {},
        set(chrmId, time) {
            this._caches[chrmId] = time;
        },
        get(chrmId) {
            return this._caches[chrmId] || 0;
        },
        clear(chrmId) {
            this._caches[chrmId] = 0;
        }
    };
    class KVStore {
        constructor(chatroomId, currentUserId) {
            this._kvCaches = {};
            this._chatroomId = chatroomId;
            this._currentUserId = currentUserId;
        }
        _add(kv) {
            const { key } = kv;
            kv.isDeleted = false;
            this._kvCaches[key] = kv;
        }
        _remove(kv) {
            const { key } = kv;
            const cacheKV = this._kvCaches[key];
            if (cacheKV) {
                cacheKV.isDeleted = true;
                this._kvCaches[key] = cacheKV;
            }
        }
        _setEntry(data, isFullUpdate) {
            const { key, type, isOverwrite, userId } = data;
            const latestUserId = this._getSetUserId(key);
            const isDeleteOpt = type === ChatroomEntryType$1.DELETE;
            const isSameAtLastSetUser = latestUserId === userId;
            const isKeyNotExist = !this._isExisted(key);
            const event = isDeleteOpt ? this._remove : this._add;
            if (isFullUpdate) {
                event.call(this, data);
            }
            else if (isOverwrite || isSameAtLastSetUser || isKeyNotExist) {
                event.call(this, data);
            }
            else ;
        }
        getValue(key) {
            const kv = this._kvCaches[key] || {};
            const { isDeleted } = kv;
            return isDeleted ? null : kv.value;
        }
        getAllValue() {
            const entries = {};
            for (const key in this._kvCaches) {
                if (!this._kvCaches[key].isDeleted) {
                    entries[key] = this._kvCaches[key].value;
                }
            }
            return entries;
        }
        _getSetUserId(key) {
            const cache = this._kvCaches[key] || {};
            return cache.userId;
        }
        _isExisted(key) {
            const cache = this._kvCaches[key] || {};
            const { value, isDeleted } = cache;
            return (value && !isDeleted);
        }
        setEntries(data) {
            let { kvEntries, isFullUpdate } = data;
            kvEntries = kvEntries || [];
            isFullUpdate = isFullUpdate || false;
            isFullUpdate && this.clear();
            kvEntries.forEach((kv) => {
                this._setEntry(kv, isFullUpdate);
            });
            logger.debug('end setEntries');
        }
        clear() {
            this._kvCaches = {};
        }
    }
    class ChrmEntryHandler {
        constructor(engine) {
            this._pullQueue = [];
            this._isPulling = false;
            this._storeCaches = {}; // 所有聊天室的 Store 缓存
            this._engine = engine;
        }
        _startPull() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this._isPulling || this._pullQueue.length === 0) {
                    return;
                }
                this._isPulling = true;
                const { chrmId, timestamp } = this._pullQueue.splice(0, 1)[0];
                const pulledUpTime = PullTimeCache.get(chrmId);
                if (pulledUpTime > timestamp) { // 已经拉取过，不再拉取
                    this._isPulling = false;
                    this._startPull();
                    return;
                }
                const { code, data } = yield this._engine.pullChatroomEntry(chrmId, pulledUpTime);
                this._isPulling = false;
                if (code === ErrorCode$1.SUCCESS) {
                    PullTimeCache.set(chrmId, data.syncTime || 0);
                    this._startPull();
                }
                else {
                    this._startPull();
                }
            });
        }
        /**
         * 退出聊天室前清空 kv 缓存 和 拉取时间缓存，再次加入聊天室后重新拉取 kv 并更新本地
        */
        reset(chrmId) {
            // throw new Error('Method not implemented.')
            PullTimeCache.clear(chrmId);
            const kvStore = this._storeCaches[chrmId];
            kvStore && kvStore.clear();
        }
        /**
         * 向服务端拉取 kv
         * @description
         * 拉取时机: 1、加入聊天室成功后 2、收到 Server 拉取通知后
        */
        pullEntry(chrmId, timestamp) {
            this._pullQueue.push({ chrmId, timestamp });
            this._startPull();
        }
        /**
         * 向本地缓存己方设置或拉取到的 kv
        */
        setLocal(chrmId, data, userId) {
            // throw new Error('Method not implemented.')
            let kvStore = this._storeCaches[chrmId];
            if (!notEmptyObject(kvStore)) {
                kvStore = new KVStore(chrmId, userId);
            }
            kvStore.setEntries(data);
            this._storeCaches[chrmId] = kvStore;
        }
        /**
         * 获取聊天室 key 对应的 value
         * @param chrmId
         * @param key
        */
        getValue(chrmId, key) {
            // throw new Error('Method not implemented.')
            const kvStore = this._storeCaches[chrmId];
            return kvStore ? kvStore.getValue(key) : null;
        }
        /**
         * 获取聊天室所有 key value
         * @param chrmId
        */
        getAll(chrmId) {
            // throw new Error('Method not implemented.')
            const kvStore = this._storeCaches[chrmId];
            let entries = {};
            if (kvStore) {
                entries = kvStore.getAllValue();
            }
            return entries;
        }
    }
    class JoinedChrmManager {
        constructor(_runtime, _appkey, _userId, _canJoinMulipleChrm) {
            this._runtime = _runtime;
            this._appkey = _appkey;
            this._userId = _userId;
            this._canJoinMulipleChrm = _canJoinMulipleChrm;
            this._sessionKey = '';
            this._joinedChrmsInfo = {};
            this._sessionKey = `sync-chrm-${this._appkey}-${this._userId}`;
        }
        set(chrmId, count = 10) {
            !this._canJoinMulipleChrm && (this._joinedChrmsInfo = {});
            this._joinedChrmsInfo[chrmId] = count;
            this._runtime.sessionStorage.setItem(this._sessionKey, JSON.stringify(this._joinedChrmsInfo));
        }
        get() {
            let infos;
            let data;
            try {
                data = this._runtime.sessionStorage.getItem(this._sessionKey);
                infos = JSON.parse(data || '{}');
            }
            catch (err) {
                logger.error(`parse rejoined chrm infos error -> ${data}`);
                infos = {};
            }
            return infos;
        }
        remove(chrmId) {
            delete this._joinedChrmsInfo[chrmId];
            if (notEmptyObject(this._joinedChrmsInfo)) {
                this._runtime.sessionStorage.setItem(this._sessionKey, JSON.stringify(this._joinedChrmsInfo));
            }
            else {
                this.clear();
            }
        }
        clear() {
            this._joinedChrmsInfo = {};
            this._runtime.sessionStorage.removeItem(this._sessionKey);
        }
    }

    const EventName$1 = {
        STATUS_CHANGED: 'converStatusChanged'
    };
    class ConversationStatus {
        constructor(engine, appkey, currentUserId) {
            this._eventEmitter = new EventEmitter();
            this._pullQueue = [];
            this._isPulling = false;
            this._storage = createRootStorage(engine.runtime);
            this._appkey = appkey;
            this._currentUserId = currentUserId;
            this._engine = engine;
            this._storagePullTimeKey = `con-s-${appkey}-${currentUserId}`;
        }
        /**
         * 向本地设置拉取的时间, 并通知上层会话状态的变更
        */
        _set(list) {
            // todo('ConversationStatus set')
            if (isUndefined(list)) {
                return;
            }
            let localTime = this._storage.get(this._storagePullTimeKey) || 0;
            const listCount = list.length;
            list.forEach((statusItem, index) => {
                const updatedTime = statusItem.updatedTime || 0;
                localTime = updatedTime > localTime ? updatedTime : localTime;
                statusItem.conversationType = statusItem.type;
                this._eventEmitter.emit(EventName$1.STATUS_CHANGED, {
                    statusItem,
                    isLastPull: index === listCount - 1
                });
            });
            this._storage.set(this._storagePullTimeKey, localTime);
        }
        /**
         * 拉取队列
        */
        _startPull() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this._isPulling || this._pullQueue.length === 0) {
                    return;
                }
                this._isPulling = true;
                const time = this._pullQueue.splice(0, 1)[0];
                const { code, data } = yield this._engine.pullConversationStatus(time);
                if (code === ErrorCode$1.SUCCESS) {
                    this._isPulling = false;
                    this._set(data);
                    this._startPull();
                }
                else {
                    this._startPull();
                }
            });
        }
        /**
         * 从服务端拉取变更
        */
        pull(newPullTime) {
            const time = this._storage.get(this._storagePullTimeKey) || 0;
            if (newPullTime > time || newPullTime === 0) {
                // 拉取,并通知上层拉取到的数据
                this._pullQueue.push(time);
                this._startPull();
            }
        }
        /**
         * 注册会话状态变更事件
        */
        watch(event) {
            this._eventEmitter.on(EventName$1.STATUS_CHANGED, (data) => {
                event(data);
            });
        }
        /**
         * 断开连接的后，取消注册的会话状态变更时间，防止再次连接重复注册
        */
        unwatch() {
            this._eventEmitter.off(EventName$1.STATUS_CHANGED, (data) => { });
        }
    }

    const StorageKey2ConversationKey = {
        c: { keyName: 'unreadMessageCount', defaultVal: 0 },
        hm: { keyName: 'hasMentioned', defaultVal: false },
        m: { keyName: 'mentionedInfo', defaultVal: null },
        t: { keyName: 'lastUnreadTime', defaultVal: 0 },
        nc: { keyName: 'notificationStatus', defaultVal: 2 },
        to: { keyName: 'isTop', defaultVal: false },
        tg: { keyName: 'tags', defaultVal: {} }
    };
    const ConversationKey2StorageKey = {};
    for (const key in StorageKey2ConversationKey) {
        const keyName = StorageKey2ConversationKey[key].keyName;
        ConversationKey2StorageKey[keyName] = key;
    }
    /**
     * 存储再本地的 conversation 信息
     * 目前字段：
     *  未读数
     *  是否有 @  消息
     *  @ 内容
     *  免打扰状态
     *  置顶状态
     *  标签状态
     * 对应开发者字段
     *  unreadMessageCount
     *  hasMentioned
     *  mentionedInfo
     *  notificationStatus
     *  isTop
     *  tags
    */
    class ConversationStore {
        constructor(runtime, _appkey, _currentUserId) {
            this._appkey = _appkey;
            this._currentUserId = _currentUserId;
            const suffix = `con-${_appkey}-${_currentUserId}`;
            this.storage = new AppStorage(runtime, suffix);
        }
        _getStoreKey(type, targetId) {
            return `${type}_${targetId}`;
        }
        _getConOptionByKey(key) {
            key = key || '';
            const arr = key.split('_');
            if (arr.length >= 2) {
                return {
                    conversationType: arr[0],
                    targetId: key.match(/_.*/g)[0].substring(1)
                };
            }
            else {
                return {
                    conversationType: ConversationType$1.PRIVATE,
                    targetId: ''
                };
            }
        }
        /**
         * 更新 hasMentioned mentionedInfo 信息
        */
        updateMentionedData(message) {
            const { conversationType, targetId, messageType, isMentioned, content, senderUserId } = message;
            const key = this._getStoreKey(conversationType, targetId);
            const local = this.storage.get(key) || {};
            const storageMetionedInfoKey = ConversationKey2StorageKey.mentionedInfo;
            const storageHasMentionedKey = ConversationKey2StorageKey.hasMentioned;
            // let mentionedInfo = {}
            const localMentionedInfo = local[storageMetionedInfoKey] || {};
            const localUserIdList = localMentionedInfo.userIdList || [];
            let mentionedInfo = content.mentionedInfo;
            if (!mentionedInfo) {
                return;
            }
            // 如果是 @ 消息, 且 @ 列表里有自己, 更新本地的 MentionInfo.userIdList
            if (isMentioned && conversationType === ConversationType$1.GROUP) {
                const receiveUserIdList = mentionedInfo.userIdList || [];
                receiveUserIdList.forEach(userId => {
                    if (userId === this._currentUserId && localUserIdList.indexOf(senderUserId) < 0) {
                        localUserIdList.push(senderUserId);
                    }
                });
                if (mentionedInfo.type === MentionedType$1.ALL && localUserIdList.indexOf(senderUserId) < 0) {
                    localUserIdList.push(senderUserId);
                }
            }
            // 如果是撤回 @ 消息, 更新本地 userIdList， userIdList 为空时更新 hasMentioned 为 false
            if (messageType === MessageType$1.RECALL && conversationType === ConversationType$1.GROUP) {
                const index = localUserIdList.indexOf(senderUserId);
                if (index >= 0) {
                    localUserIdList.splice(index, 1);
                }
            }
            mentionedInfo = {
                userIdList: localUserIdList,
                type: (mentionedInfo === null || mentionedInfo === void 0 ? void 0 : mentionedInfo.type) || localMentionedInfo.type
            };
            if (localUserIdList.length !== 0) {
                local[storageMetionedInfoKey] = mentionedInfo;
                local[storageHasMentionedKey] = true;
            }
            else {
                delete local[storageMetionedInfoKey];
                delete local[storageHasMentionedKey];
            }
            if (notEmptyObject(local)) {
                this.storage.set(key, local);
            }
            else {
                this.storage.remove(key);
            }
        }
        /**
         * 设置会话信息
        */
        set(type, targetId, conversation) {
            const key = this._getStoreKey(type, targetId);
            const local = this.storage.get(key) || {};
            for (const key in conversation) {
                const storageKey = ConversationKey2StorageKey[key];
                const val = conversation[key];
                if (isUndefined(storageKey) || isUndefined(val) || key === 'hasMentioned' || key === 'MentionedInfo') {
                    continue;
                }
                const defaultVal = StorageKey2ConversationKey[storageKey].defaultVal;
                if (val === defaultVal || (key === 'tags' && !notEmptyObject(val))) {
                    // 默认值不存储，避免占用存储空间。获取时未获取到的返回默认值
                    delete local[storageKey];
                }
                else if (key === 'tags') {
                    // 清空isTop:false的字段，减少占用空间
                    const _val = val;
                    for (const key in _val) {
                        if (!_val[key].isTop) {
                            delete _val[key].isTop;
                        }
                    }
                    local[storageKey] = val;
                }
                else {
                    local[storageKey] = val;
                }
                if (!local.c) {
                    // 清空未读数则清空最后操作未读时间，避免占用空间
                    delete local.t;
                    // 清空@信息
                    delete local.hm;
                    delete local.m;
                }
            }
            if (notEmptyObject(local)) {
                this.storage.set(key, local);
            }
            else {
                this.storage.remove(key);
            }
        }
        /**
         * 获取单个会话本地存储信息
        */
        get(type, targetId) {
            const key = this._getStoreKey(type, targetId);
            const local = this.storage.get(key) || {};
            const conversation = {};
            for (const key in StorageKey2ConversationKey) {
                const { keyName, defaultVal } = StorageKey2ConversationKey[key];
                conversation[keyName] = local[key] || cloneByJSON(defaultVal);
            }
            return conversation;
        }
        /**
         * 获取所有会话信息
        */
        getValue(func) {
            const values = this.storage.getValues() || {};
            const storageConversationList = [];
            for (const key in values) {
                const { conversationType, targetId } = this._getConOptionByKey(key);
                let conversation = { conversationType, targetId };
                const store = values[key];
                for (const storeKey in store) {
                    const { keyName, defaultVal } = StorageKey2ConversationKey[storeKey];
                    conversation[keyName] = store[storeKey] || cloneByJSON(defaultVal);
                }
                conversation = func ? func(conversation) : conversation;
                storageConversationList.push(conversation);
            }
            return storageConversationList;
        }
        /**
         * 以标签为维度获取所有会话信息
        */
        getValueForTag() {
            const values = this.storage.getValues() || {};
            const tagObj = {};
            for (const key in values) {
                const { conversationType, targetId } = this._getConOptionByKey(key);
                const conversation = {};
                const store = values[key];
                for (const storeKey in store) {
                    const { keyName, defaultVal } = StorageKey2ConversationKey[storeKey];
                    conversation[keyName] = store[storeKey] || cloneByJSON(defaultVal);
                }
                // 以标签为维度重新组织
                for (const tagId in conversation.tags) {
                    if (isUndefined(tagObj[tagId])) {
                        tagObj[tagId] = [];
                    }
                    const _con = Object.assign({}, conversation, {
                        conversationType,
                        targetId
                    });
                    delete _con.tags;
                    tagObj[tagId].push(_con);
                }
            }
            return tagObj;
        }
    }

    const saveConversationType = [ConversationType$1.PRIVATE, ConversationType$1.GROUP, ConversationType$1.SYSTEM, ConversationType$1.PUBLIC_SERVICE];
    const EventName = {
        CHANGED: 'conversationChanged'
    };
    class ConversationManager {
        constructor(engine, appkey, userId, updatedConversationFunc) {
            this._updatedConversations = {};
            this._eventEmitter = new EventEmitter();
            this._draftMap = {};
            this._appkey = appkey;
            this._loginUserId = userId;
            this._store = new ConversationStore(engine.runtime, appkey, userId);
            this._statusManager = new ConversationStatus(engine, appkey, userId);
            this._statusManager.watch((data) => {
                const { statusItem, isLastPull } = data;
                this.addStatus(statusItem, isLastPull);
            });
            this._eventEmitter.on(EventName.CHANGED, (data) => {
                updatedConversationFunc(data);
            });
        }
        /**
         * 根据消息计算本地 localConversation 是否需要更新 和 更新的未读数
        */
        _calcUnreadCount(message, localConversation) {
            const { content, messageType, sentTime, isCounted, messageDirection, senderUserId } = message;
            const isSelfSend = messageDirection === MessageDirection$1.SEND && senderUserId === this._loginUserId;
            const isRecall = messageType === MessageType$1.RECALL;
            const hasContent = isObject(content);
            let hasChanged = false;
            const lastUnreadTime = localConversation.lastUnreadTime || 0;
            const unreadMessageCount = localConversation.unreadMessageCount || 0;
            const hasBeenAdded = lastUnreadTime > sentTime;
            // 自己发送的消息、已经计算过的消息 不更新本地存储
            if (hasBeenAdded || isSelfSend) {
                return { hasChanged, localConversation };
            }
            // 计数的消息，未读数 + 1
            if (isCounted) {
                localConversation.unreadMessageCount = unreadMessageCount + 1;
                localConversation.lastUnreadTime = sentTime;
                hasChanged = true;
            }
            // 测回的消息 且 符合撤回消息内容格式（ 撤回消息 content: {conversationType, targetId, messageUId, sentTime} ）
            if (isRecall && hasContent) {
                const isNotRead = lastUnreadTime >= content.sentTime;
                if (isNotRead && unreadMessageCount) {
                    localConversation.unreadMessageCount = unreadMessageCount - 1;
                    hasChanged = true;
                }
            }
            return { hasChanged, localConversation };
        }
        /**
         * 根据消息计算本地 localConversation 是否需要更新 和 更新的 mentionedInfo
        */
        _calcMentionedInfo(message, localConversation) {
            const { content, messageDirection, isMentioned } = message;
            messageDirection === MessageDirection$1.SEND;
            const hasContent = isObject(content);
            let hasChanged = false;
            if (isMentioned && hasContent && content.mentionedInfo) {
                localConversation.hasMentioned = true;
                // localConversation.mentionedInfo = (content.mentionedInfo as unknown as IMentionInfo)
                hasChanged = true;
            }
            return { hasChanged, localConversation };
        }
        /**
         * 更新内存中 updatedConversation 字段
        */
        _setUpdatedConversation(updatedConOptions) {
            if (isObject(updatedConOptions)) {
                const { conversationType, targetId } = updatedConOptions;
                const key = `${conversationType}_${targetId}`;
                const cacheConversation = this._store.get(conversationType, targetId) || {};
                this._updatedConversations[key] = Object.assign(cacheConversation, updatedConOptions);
            }
        }
        addStatus(statusItem, isLastPull) {
            const { conversationType, targetId, updatedTime, notificationStatus, isTop, tags } = statusItem;
            const tagValue = {};
            const updatedItems = {};
            if (!isUndefined(notificationStatus)) {
                updatedItems.notificationStatus = { time: updatedTime, val: notificationStatus };
            }
            if (!isUndefined(isTop)) {
                updatedItems.isTop = { time: updatedTime, val: isTop };
            }
            if (!isUndefined(tags)) {
                updatedItems.tags = { time: updatedTime, val: tags };
                tags === null || tags === void 0 ? void 0 : tags.forEach((tag) => {
                    tagValue[tag.tagId] = {
                        isTop: tag.isTop
                    };
                });
            }
            this._store.set(conversationType, targetId, {
                notificationStatus,
                isTop,
                tags: tagValue
            });
            this._setUpdatedConversation({
                conversationType,
                targetId,
                updatedItems
            });
            if (isLastPull) {
                this._notifyConversationChanged();
            }
        }
        /**
         * 通知会话更新
         * @description
         * 通知的条件: 会话状态变化、会话未读数变化（未读数增加、未读数清空）、会话 @ 信息（hasMentioned、mentionedInfo）、？会话最后一条消息
        */
        _notifyConversationChanged() {
            const list = [];
            for (const key in this._updatedConversations) {
                list.push(this._updatedConversations[key]);
            }
            this._eventEmitter.emit(EventName.CHANGED, list);
            this._updatedConversations = {};
        }
        /**
         * 根据消息向 localstorage 设置会话未读数、会话 @ 信息（ hasMentioned、MentionedInfo ）、会话状态（ 置顶、免打扰 ）
         * @description
         * 调用时机：1、收到消息后 2、发消息成功后 3、发送撤回消息成功后
        */
        setConversationCacheByMessage(message, isPullMessageFinished) {
            // 若不是存储会话的类型(比如: 聊天室类型), 则不作处理
            const { conversationType, isPersited, targetId } = message;
            const isSaveConversationType = saveConversationType.indexOf(conversationType) >= 0;
            if (!isSaveConversationType) {
                return;
            }
            let hasChanged = false;
            let storageConversation = this._store.get(conversationType, targetId);
            // 计算本地存储
            const CalcEvents = [this._calcUnreadCount, this._calcMentionedInfo];
            CalcEvents.forEach((func) => {
                const { hasChanged: hasCaclChanged, localConversation } = func.call(this, message, storageConversation);
                hasChanged = hasChanged || hasCaclChanged;
                storageConversation = cloneByJSON(localConversation);
            });
            if (hasChanged) {
                this._store.set(conversationType, targetId, storageConversation);
            }
            this._store.updateMentionedData(message);
            // 写入会话缓存中
            if (isPersited) {
                const conversation = this._store.get(conversationType, targetId);
                conversation.updatedItems = {
                    latestMessage: {
                        time: message.sentTime,
                        val: message
                    }
                };
                conversation.latestMessage = message;
                const updateConOptions = Object.assign(conversation, { conversationType, targetId });
                this._setUpdatedConversation(updateConOptions);
            }
            // 是否需要通知， 通知 API Context 本地会话变更
            if (isPullMessageFinished) {
                this._notifyConversationChanged();
            }
        }
        /**
         * 获取会话本地存储信息
        */
        get(conversationType, targetId) {
            return this._store.get(conversationType, targetId);
        }
        /**
         * 获取本地会话所有未读数
        */
        getAllUnreadCount(channelId, conversationTypes, includeMuted) {
            // TODO: 获取所有未读数需支持多组织、会话类型、免打扰过滤
            const conversationList = this._store.getValue();
            let totalCount = 0;
            conversationList.forEach(({ unreadMessageCount, notificationStatus, conversationType }) => {
                unreadMessageCount = unreadMessageCount || 0;
                // 判断是否包含免打扰
                if (includeMuted || notificationStatus !== 1) {
                    // 判断是否指定会话类型
                    if (conversationTypes.length > 0) {
                        if (conversationTypes.includes(Number(conversationType))) {
                            totalCount += Number(unreadMessageCount);
                        }
                    }
                    else {
                        totalCount += Number(unreadMessageCount);
                    }
                }
            });
            return totalCount;
        }
        /**
         * 获取本地会话指定标签下的所有未读数
        */
        getUnreadCountByTag(tagId, containMuted) {
            const tagAll = this._store.getValueForTag();
            const conversationList = tagAll[tagId] || [];
            let totalCount = 0;
            conversationList.forEach(({ unreadMessageCount, notificationStatus }) => {
                // 包含免打扰
                if (containMuted || notificationStatus !== 1) {
                    unreadMessageCount = unreadMessageCount || 0;
                    totalCount += Number(unreadMessageCount);
                }
            });
            return totalCount;
        }
        /**
         * 获取本地指定会话未读数
        */
        getUnreadCount(conversationType, targetId) {
            const conversation = this._store.get(conversationType, targetId);
            return conversation.unreadMessageCount || 0;
        }
        /**
         * 清除本地指定会话未读数
        */
        clearUnreadCount(conversationType, targetId) {
            const conversation = this._store.get(conversationType, targetId);
            const { unreadMessageCount, hasMentioned } = conversation;
            if (unreadMessageCount || hasMentioned) {
                conversation.unreadMessageCount = 0;
                conversation.hasMentioned = false;
                // conversation.mentionedInfo = null
            }
            this._store.set(conversationType, targetId, conversation);
            const updateConOptions = Object.assign(conversation, { conversationType, targetId });
            this._setUpdatedConversation(updateConOptions);
            this._notifyConversationChanged();
        }
        startPullConversationStatus(time) {
            this._statusManager.pull(time);
        }
        /**
         * 设置会话消息草稿
        */
        setDraft(conversationType, targetId, draft) {
            const key = `${conversationType}_${targetId}`;
            this._draftMap[key] = draft;
        }
        /**
         * 获取会话消息草稿
        */
        getDraft(conversationType, targetId) {
            const key = `${conversationType}_${targetId}`;
            return this._draftMap[key];
        }
        /**
         * 删除会话消息草稿
        */
        clearDraft(conversationType, targetId) {
            const key = `${conversationType}_${targetId}`;
            delete this._draftMap[key];
        }
        /**
         * 向本地会话状态中添加标签, 更新标签状态
         * @param conversationType 会话类型
         * @param targetId 会话id
         * @param tags 标签状态
         */
        addTagStatus(conversationType, targetId, tags) {
            const conversation = this._store.get(conversationType, targetId);
            let { tags: _tags } = conversation;
            _tags = Object.assign(_tags, tags);
            this._store.set(conversationType, targetId, { tags: _tags });
        }
        /**
         * 删除会话上的指定标签
         */
        deleteTagStatus(conversationType, targetId, tagIds) {
            const { tags } = this._store.get(conversationType, targetId);
            tagIds.forEach((id) => {
                delete tags[id];
            });
            this._store.set(conversationType, targetId, { tags });
        }
        /**
         * 以标签为维度获取会话状态列表
         */
        getConversationListForTag() {
            return this._store.getValueForTag();
        }
    }

    /**
     * 用户实时配置管理
     * @description 目前只实现了对tag的管理
     */
    class UserSettingManager {
        constructor(engine, appKey, currentUserId, tagWatcherFunc) {
            this._pullQueue = [];
            this._isPulling = false;
            this._storageTagKey = `tag-${appKey}-${currentUserId}`;
            this._storagePullTimeKey = `us-s-${appKey}-${currentUserId}`;
            this._storage = createRootStorage(engine.runtime);
            this._engine = engine;
            this._tagWatcherFunc = tagWatcherFunc;
        }
        /**
         * 根据用户配置设置更新本地标签 并 通知业务层(pb中的status无效，都是全量返回)
         * @param tagsSetting 用户配置设置
         */
        _updateTag(tagsSetting) {
            const { tags } = tagsSetting;
            const localTags = {};
            tags.forEach((tag) => {
                localTags[tag.tagId] = {
                    tagName: tag.tagName,
                    createdTime: tag.createdTime
                };
            });
            this._storage.set(this._storageTagKey, localTags);
            this._tagWatcherFunc();
        }
        /**
         * 添加标签，如果本地存在则更新
         * @param tags 标签列表
         */
        addTag(tags, version) {
            const localTags = this._storage.get(this._storageTagKey) || {};
            tags.forEach((tag) => {
                var _a;
                const createdTime = ((_a = localTags[tag.tagId]) === null || _a === void 0 ? void 0 : _a.createdTime) || tag.createdTime || 0;
                localTags[tag.tagId] = {
                    tagName: tag.tagName,
                    createdTime: createdTime
                };
            });
            this._storage.set(this._storageTagKey, localTags);
            this._storage.set(this._storagePullTimeKey, version);
        }
        /**
         * 删除本地标签
         * @param tagId 标签id
         */
        deleteTag(tagIds, version) {
            const localTags = this._storage.get(this._storageTagKey) || {};
            tagIds.forEach((tagId) => {
                delete localTags[tagId];
            });
            this._storage.set(this._storageTagKey, localTags);
            this._storage.set(this._storagePullTimeKey, version);
        }
        /**
         * 获取本地存储标签信息
         */
        getTagsInfo() {
            return this._storage.get(this._storageTagKey) || {};
        }
        /**
         * 获取本地标签列表
         */
        getTags() {
            const localTags = this._storage.get(this._storageTagKey) || {};
            const list = [];
            for (const tagId in localTags) {
                list.push({
                    tagId: tagId,
                    tagName: localTags[tagId].tagName,
                    createdTime: localTags[tagId].createdTime,
                    conversationCount: 0 // 真实数据在jsEngine里赋值
                });
            }
            function compare(a, b) {
                return (a.createdTime || 0) - (b.createdTime || 0);
            }
            return list.sort(compare);
        }
        /**
         * 获取指定标签
         */
        getTagById(tagId) {
            const localTags = this._storage.get(this._storageTagKey) || {};
            return localTags[tagId] ? {
                tagId: tagId,
                tagName: localTags[tagId].tagName,
                createdTime: localTags[tagId].createdTime,
                conversationCount: 0
            } : null;
        }
        _startPull() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this._isPulling || this._pullQueue.length === 0) {
                    return;
                }
                this._isPulling = true;
                const time = this._pullQueue.splice(0, 1)[0];
                const { code, data } = yield this._engine.pullUserSettings(time);
                if (code === ErrorCode$1.SUCCESS && !isUndefined(data)) {
                    const { settings, version } = data;
                    const tagsSetting = settings.Tag;
                    if (!isUndefined(tagsSetting)) {
                        this._updateTag(tagsSetting);
                    }
                    this._storage.set(this._storagePullTimeKey, version);
                    this._isPulling = false;
                    this._startPull();
                }
                else {
                    this._isPulling = false;
                    this._startPull();
                }
            });
        }
        /**
         * 拉取服务器标签列表
         * @param time
         */
        pullUserSettings(newPullTime) {
            const time = this._storage.get(this._storagePullTimeKey) || 0;
            if (newPullTime > time || newPullTime === 0) {
                this._pullQueue.push(time);
                this._startPull();
            }
        }
        getVersion() {
            return this._storage.get(this._storagePullTimeKey) || 0;
        }
    }

    class JsNavi extends ANavi {
        constructor(_runtime, _options) {
            super(_runtime, _options);
            // 小程序环境中导航里的 backupServer 地址
            this._miniConnectUrl = '';
            this._connectType = _options.connectionType;
        }
        _formatJSONPUrl(url, token, appkey, jsonpFunc) {
            const path = this._runtime.isSupportSocket() && (this._connectType === 'websocket') ? 'navi' : 'cometnavi';
            const tmpUrl = `${url}/${path}.js?appId=${appkey}&token=${encodeURIComponent(token)}&callBack=${jsonpFunc}&v=${this._apiVersion}&r=${Date.now()}`;
            return tmpUrl;
        }
        getInfo(token, dynamicUris, force) {
            const _super = Object.create(null, {
                getInfo: { get: () => super.getInfo }
            });
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                // 微信小程序特殊处理，取固定的 cmp 地址，不使用动态导航地址
                if (!this._runtime.useNavi) {
                    let connectUrl;
                    {
                        if (this._runtime.isSupportSocket() && this._connectType === 'websocket') {
                            connectUrl = MINI_SOCKET_CONNECT_URIS.join(',');
                        }
                        else {
                            connectUrl = MINI_COMET_CONNECT_URIS.join(',');
                        }
                    }
                    this._miniConnectUrl = ((_a = this._options.miniCMPProxy) === null || _a === void 0 ? void 0 : _a.length) ? this._options.miniCMPProxy.join(',') : connectUrl || '';
                    dynamicUris = [];
                }
                return _super.getInfo.call(this, token, dynamicUris, force);
            });
        }
        _reqNavi(uris, appkey, token) {
            return __awaiter(this, void 0, void 0, function* () {
                const jsonpFunc = 'getServerEndpoint';
                for (let i = 0, len = uris.length; i < len; i += 1) {
                    const url = this._formatJSONPUrl(uris[i], token, appkey, jsonpFunc);
                    logger.debug(`req navi => ${url}`);
                    const res = yield this._runtime.httpReq({
                        url,
                        timeout: NAVI_REQ_TIMEOUT
                    });
                    if (res.status !== 200) {
                        if (res.status === 403) {
                            logger.error('request navi error: ' + ErrorCode$1.RC_CONN_USER_OR_PASSWD_ERROR);
                        }
                        if (res.status === 401) {
                            logger.error('request navi error: ' + ErrorCode$1.RC_CONN_APP_BLOCKED_OR_DELETED);
                        }
                        continue;
                    }
                    try {
                        // 返回结果中，私有云无 ; 号，公有云有分号
                        // 解析 res 数据，解析成功则返回 naviInfo 数据
                        const jsonStr = res.data.replace(`${jsonpFunc}(`, '').replace(/\);?$/, '');
                        const naviInfo = JSON.parse(jsonStr);
                        // 补充导航数据请求使用的协议
                        const protocol = /^https/.test(url) ? 'https' : 'http';
                        naviInfo.protocol = protocol;
                        // 小程序环境使用默认的 cmp 地址
                        if (!this._runtime.useNavi) {
                            naviInfo.server = '';
                            naviInfo.backupServer = this._miniConnectUrl;
                            naviInfo.logSwitch = 0;
                        }
                        return naviInfo;
                    }
                    catch (err) {
                        logger.error('parse navi err =>', err);
                    }
                }
                // 小程序环境如果请求导航失败，则返回默认的导航信息
                if (!this._runtime.useNavi) {
                    const naviInfo = {
                        code: 200,
                        protocol: 'https',
                        server: '',
                        voipCallInfo: '',
                        kvStorage: 0,
                        openHttpDNS: false,
                        historyMsg: false,
                        chatroomMsg: false,
                        uploadServer: 'https://upload.qiniup.com',
                        bosAddr: 'https://gz.bcebos.com',
                        location: '',
                        monitor: 0,
                        joinMChrm: false,
                        openMp: 0,
                        openUS: 0,
                        grpMsgLimit: 0,
                        isFormatted: 0,
                        gifSize: 2048,
                        logSwitch: 0,
                        logPolicy: '',
                        compDays: 0,
                        msgAck: '',
                        activeServer: '',
                        qnAddr: '',
                        extkitSwitch: 0,
                        alone: false,
                        voipServer: '',
                        offlinelogserver: '',
                        backupServer: this._miniConnectUrl
                    };
                    return naviInfo;
                }
                return null;
            });
        }
    }

    class RTCEntryHandler {
        constructor(engine) {
            this._pullQueue = [];
            this._isPulling = false;
            this._pullTime = 0;
            this._engine = engine;
        }
        _startPull() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this._isPulling || this._pullQueue.length === 0) {
                    return;
                }
                this._isPulling = true;
                const { roomId, timestamp } = this._pullQueue.splice(0, 1)[0];
                const pulledUpTime = this._pullTime;
                if (pulledUpTime > timestamp) { // 已经拉取过，不再拉取
                    this._isPulling = false;
                    this._startPull();
                    return;
                }
                const { code, data } = yield this._engine.pullRTCRoomEntry(roomId, pulledUpTime);
                if (code === ErrorCode$1.SUCCESS) {
                    this._isPulling = false;
                    this._pullTime = data.syncTime || 0;
                    this._startPull();
                }
                else {
                    this._startPull();
                }
            });
        }
        pullEntry(roomId, timestamp) {
            this._pullQueue.push({ roomId, timestamp });
            this._startPull();
        }
        reset() {
            this._pullTime = 0;
            this._isPulling = false;
        }
    }

    // import { IRuntime } from '../../interfaces'
    const generateKey = (appkey, userId) => {
        return ['send_msg', appkey, userId].join('_');
    };
    /**
     * 本端发送消息存储
     * 需在内存和 localStorage 中分别存储
     * 内存存储：解决多浏览器tab页互相影响的问题
     * localStorage 存储：解决刷新页面后再次通知本端发送消息的问题
     */
    class SendMessageStore {
        constructor(_runtime, _appkey) {
            this._runtime = _runtime;
            this._appkey = _appkey;
            // 本端发送的消息记录，用于拉取消息时进行发件箱消息排重
            this._sendMessageMap = {};
            this._userId = '';
        }
        init(userId) {
            this._userId = userId;
            const key = generateKey(this._appkey, userId);
            this._sendMessageMap = this._getLocalInfo(key);
        }
        _getLocalInfo(key) {
            const localInfo = this._runtime.localStorage.getItem(key);
            try {
                return localInfo ? JSON.parse(localInfo) : {};
            }
            catch (error) {
                return {};
            }
        }
        setMessage(messageUID, timestamp) {
            this._sendMessageMap[messageUID] = timestamp;
            const key = generateKey(this._appkey, this._userId);
            const localInfo = this._getLocalInfo(key);
            localInfo[messageUID] = timestamp;
            this._runtime.localStorage.setItem(key, JSON.stringify(localInfo));
        }
        getSendMessageMap() {
            return this._sendMessageMap;
        }
        // 只清除内存中数据
        removeByUID(messageUID) {
            delete this._sendMessageMap[messageUID];
        }
        // 按时间戳清除 localStorage 中消息
        removeByTimestamp(timestamp) {
            const key = generateKey(this._appkey, this._userId);
            const localInfo = this._getLocalInfo(key);
            Object.keys(localInfo).forEach((item) => {
                if (localInfo[item] < timestamp) {
                    delete localInfo[item];
                }
            });
            this._runtime.localStorage.setItem(key, JSON.stringify(localInfo));
        }
    }

    const getDeviceId = (runtime) => {
        const key = 'RCDeviceId';
        const storage = createRootStorage(runtime);
        let deviceId = '';
        const localDeviceId = storage.get(key);
        if (localDeviceId) {
            deviceId = localDeviceId;
        }
        else {
            deviceId = getUUID22();
            storage.set(key, deviceId);
        }
        return deviceId;
    };

    ({
        [ConversationType$1.PRIVATE]: Topic$1.qryPMsg,
        [ConversationType$1.GROUP]: Topic$1.qryGMsg,
        [ConversationType$1.CHATROOM]: Topic$1.qryCHMsg,
        [ConversationType$1.CUSTOMER_SERVICE]: Topic$1.qryCMsg,
        [ConversationType$1.SYSTEM]: Topic$1.qrySMsg
    });
    const UpStreamMessageTopics = [
        Topic$1[Topic$1.recallMsg],
        Topic$1[Topic$1.ppMsgS],
        Topic$1[Topic$1.pgMsgS],
        Topic$1[Topic$1.ppMsgP],
        Topic$1[Topic$1.pgMsgP],
        Topic$1[Topic$1.chatMsg],
        Topic$1[Topic$1.pcMsgP],
        Topic$1[Topic$1.prMsgS]
    ];

    const getPubTopic = (type) => {
        return {
            [ConversationType$1.PRIVATE]: Topic$1.ppMsgP,
            [ConversationType$1.GROUP]: Topic$1.pgMsgP,
            [ConversationType$1.CHATROOM]: Topic$1.chatMsg,
            [ConversationType$1.CUSTOMER_SERVICE]: Topic$1.pcMsgP,
            [ConversationType$1.RTC_ROOM]: Topic$1.prMsgS
        }[type];
    };
    const getStatPubTopic = (type) => {
        return {
            [ConversationType$1.PRIVATE]: Topic$1.ppMsgS,
            [ConversationType$1.GROUP]: Topic$1.pgMsgS
        }[type];
    };
    const transSentAttrs2IReceivedMessage = (conversationType, targetId, options, messageUId, sentTime, senderUserId) => {
        return {
            conversationType,
            targetId,
            senderUserId,
            messageDirection: MessageDirection$1.SEND,
            isCounted: !!options.isCounted,
            isMentioned: !!options.isMentioned,
            content: options.content,
            messageType: options.messageType,
            isOffLineMessage: false,
            isPersited: !!options.isPersited,
            messageUId,
            sentTime,
            receivedTime: 0,
            disableNotification: !!options.disableNotification,
            isStatusMessage: !!options.isStatusMessage,
            canIncludeExpansion: !!options.canIncludeExpansion,
            expansion: options.canIncludeExpansion ? options.expansion : null,
            receivedStatus: ReceivedStatus$1.UNREAD,
            pushConfig: options.pushConfig
        };
    };
    /**
     * @description
     * 处理群已读同步消息逻辑：即时用户传 directionalUserIdList 也强制修改为当前登录用户。群内其他人接收无意义
    */
    const handleInnerMsgOptions = (options, currentUserId) => {
        const { messageType } = options;
        if (messageType === 'RC:SRSMsg') {
            Object.assign(options, {
                directionalUserIdList: [currentUserId]
            });
        }
        return options;
    };
    class JSEngine extends AEngine {
        constructor(runtime, watcher, initOptions) {
            super(runtime, watcher, initOptions);
            this._customMessageType = {};
            this._reconnectTimer = -1;
            this._pullOfflineFinished = false; // 拉取离线消息完成标识
            // 连接成功时服务器时间戳
            this._connectedTime = 0;
            // 连接成功时本地时间戳
            this._localConnectedTime = 0;
            /**
             * 拉取离线消息标记
             */
            this._pullingMsg = false;
            /**
             * 收到的所有消息拉取通知事件戳队列
             */
            this._pullQueue = [];
            /**
             * 聊天室消息拉取通知队列
             */
            this._chrmsQueue = {};
            /**
             * 最近一次拉取消息的时间戳
             */
            this._latestSyncTimestamp = 0;
            this._intervalTimer = -1;
            // 初始化信箱
            this._letterbox = new Letterbox(runtime, initOptions.appkey);
            // 初始化本地存储发件箱消息
            this._sendMessageStore = new SendMessageStore(runtime, initOptions.appkey);
            // 初始化 Chrm KV 处理
            this._chrmEntryHandler = new ChrmEntryHandler(this);
        }
        _createNavi() {
            return new JsNavi(this.runtime, this._options);
        }
        getConnectedTime() {
            return this._connectedTime;
        }
        connect(token, naviInfo) {
            return __awaiter(this, void 0, void 0, function* () {
                const hosts = [];
                this._naviInfo = naviInfo;
                if (naviInfo.server) {
                    hosts.push(naviInfo.server);
                }
                else {
                    // 私有云无法保证客户环境 Navi 配置有效性
                    logger.warn('navi.server is invalid');
                }
                const backupServer = naviInfo.backupServer;
                // 备用服务有效性验证与排重
                backupServer && backupServer.split(',').forEach(host => {
                    if (hosts.indexOf(host) < 0) {
                        hosts.push(host);
                    }
                });
                if (hosts.length === 0) {
                    logger.error('navi invaild.', hosts);
                    return ErrorCode$1.UNKNOWN;
                }
                // 创建数据通道
                const channel = this.runtime.createDataChannel({
                    status: (status) => {
                        this._connectionStatusHandler(status, token, hosts, naviInfo.protocol);
                    },
                    signal: this._signalHandler.bind(this)
                }, this._options.connectionType);
                // 建立连接
                const code = yield channel.connect(this._appkey, token, hosts, naviInfo.protocol, this._apiVer);
                if (code === ErrorCode$1.SUCCESS) {
                    this._channel = channel;
                    this.currentUserId = channel.userId;
                    this._connectedTime = channel.connectedTime;
                    this._localConnectedTime = Math.floor((Date.now() + channel.sendConnectTime) / 2);
                    this._watcher.status(ConnectionStatus$1.CONNECTED);
                    this._pullOfflineFinished = false;
                    this._conversationManager = new ConversationManager(this, this._appkey, this.currentUserId, this._watcher.conversation);
                    this._conversationManager.startPullConversationStatus(0);
                    this._userSettingManager = new UserSettingManager(this, this._appkey, this.currentUserId, this._watcher.tag);
                    this._userSettingManager.pullUserSettings(0);
                    this._sendMessageStore.init(this.currentUserId);
                    this._rtcKVManager = new RTCEntryHandler(this);
                    // 初始化加入 chrm 的信息
                    this._joinedChrmManager = new JoinedChrmManager(this.runtime, this._appkey, this.currentUserId, naviInfo.joinMChrm);
                    // 启动拉取离线消息队列
                    this._startSyncInterval();
                }
                else {
                    channel.close();
                }
                return code;
            });
        }
        _connectionStatusHandler(status, token, hosts, protocol) {
            logger.warn('connection status changed:', status);
            if (status === ConnectionStatus$1.CONNECTING || status === ConnectionStatus$1.CONNECTED) {
                this._watcher.status(status);
                return;
            }
            if (!this._channel || status === ConnectionStatus$1.DISCONNECTED) {
                // 用户主动断开连接，直接抛出连接状态
                this._watcher.status(status);
                return;
            }
            if (status === ConnectionStatus$1.BLOCKED ||
                status === ConnectionStatus$1.KICKED_OFFLINE_BY_OTHER_CLIENT ||
                status === ConnectionStatus$1.DISCONNECT_BY_SERVER) {
                // 用户被封禁，或多端被踢下线，或其他服务器原因通知断开
                this.disconnect();
                this._watcher.status(status);
                return;
            }
            if (status === ConnectionStatus$1.REDIRECT) {
                // 重定向
                this._watcher.status(status);
                return;
            }
            // 异常断开，尝试重连
            this._try2Reconnect(token, hosts, protocol);
        }
        _try2Reconnect(token, hosts, protocol) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return;
                }
                const code = yield this._channel.connect(this._appkey, token, hosts, protocol, this._apiVer);
                if (code === ErrorCode$1.SUCCESS) {
                    this._pullOfflineFinished = false;
                    // 启动拉取离线消息队列
                    this._startSyncInterval();
                    this._watcher.status(ConnectionStatus$1.CONNECTED);
                    this._rejoinChrm();
                    logger.__insertLogIntoDatabase();
                    return;
                }
                this._watcher.status(ConnectionStatus$1.WEBSOCKET_UNAVAILABLE);
                // 等待 5s 后重新尝试
                this._reconnectTimer = setTimeout(() => {
                    this._reconnectTimer = -1;
                    this._try2Reconnect(token, hosts, protocol);
                }, 5000);
            });
        }
        _signalHandler(signal, ack) {
            const { syncMsg, topic } = signal;
            if (syncMsg) {
                // 此消息为本人其他端发出的消息，此处为多端消息同步
                this._receiveSyncMsg(signal, ack);
                return;
            }
            const tmpTopic = Topic$1[topic];
            if (!tmpTopic) {
                logger.error('unknown topic:', topic);
                return;
            }
            switch (tmpTopic) {
                case Topic$1.s_ntf:
                    logger.debug(`recv s_ntf -> signal.messageId: ${signal.messageId}`);
                    this._pullMsg(signal); // 通知拉取
                    break;
                case Topic$1.s_msg:
                    this._receiveMsg(signal); // 接收直发消息
                    break;
                case Topic$1.s_cmd:
                    this._receiveStateNotify(signal);
                    break;
                case Topic$1.s_us:
                    this._receiveSettingNotify(signal);
                    break;
                case Topic$1.rtc_ntf:
                    this._receiveRtcKv(signal);
                    break;
            }
        }
        /**
         * 接收聊天室 kv 通知与会话状态变更通知
         * @param signal
         */
        _receiveStateNotify(signal) {
            var _a;
            const { time, type, chrmId } = (_a = this._channel) === null || _a === void 0 ? void 0 : _a.codec.decodeByPBName(signal.data, PBName.NotifyMsg);
            switch (type) {
                case 2:
                    // 聊天室 KC 拉取
                    this._chrmEntryHandler.pullEntry(chrmId, time);
                    break;
                case 3:
                    // 会话状态拉取
                    this._conversationManager.startPullConversationStatus(time);
                    break;
            }
        }
        /**
         * 接收实时配置变更通知
         * @param signal
         */
        _receiveSettingNotify(signal) {
            var _a;
            const { version } = (_a = this._channel) === null || _a === void 0 ? void 0 : _a.codec.decodeByPBName(signal.data, PBName.UserSettingNotification);
            this._userSettingManager.pullUserSettings(version);
        }
        /**
         * 接收 rtc 资源变更
         */
        _receiveRtcKv(signal) {
            var _a;
            const { time, type, roomId } = (_a = this._channel) === null || _a === void 0 ? void 0 : _a.codec.decodeByPBName(signal.data, PBName.RtcNotifyMsg);
            switch (type) {
                case 1:
                    // RTC KV拉取
                    this._rtcKVManager.pullEntry(roomId, time);
                    break;
            }
        }
        /**
         * 通知 API Content 扩展变更
        */
        _receiveMessageExpansion(message) {
            const { content } = message;
            const { put, del, mid } = content;
            if (put) {
                this._watcher.expansion({
                    updatedExpansion: {
                        messageUId: mid,
                        expansion: put
                    }
                });
            }
            if (del) {
                this._watcher.expansion({
                    deletedExpansion: {
                        messageUId: mid,
                        deletedKeys: del
                    }
                });
            }
        }
        /**
         * 接收多端同步消息
         * @param signal
         * @param ack 同步消息的 ack 信令数据，comet 连接无此数据
         */
        _receiveSyncMsg(signal, ack) {
            var _a;
            // 目前多端同步只解析 pb 是 PBName.UpStreamMessage 的信令，其他的有需要再动态加
            if (!UpStreamMessageTopics.includes(signal.topic))
                return;
            let msg = (_a = this._channel) === null || _a === void 0 ? void 0 : _a.codec.decodeByPBName(signal.data, PBName.UpStreamMessage, {
                currentUserId: this.currentUserId, signal
            });
            msg = this._handleMsgProperties(msg);
            // 更新消息并通知业务层
            msg.sentTime = ack.timestamp;
            msg.messageUId = ack.messageUId;
            // 当前正在拉取消息过程中，不需要同步直发消息到业务层，向拉取队列中重新添加一个时间戳等待当前拉取动作完成后递归拉取
            if (this._pullingMsg) {
                this._pullQueue.push(ack.timestamp);
                return;
            }
            // 多端同步消息不得直接更新发件箱时间，因当前离线消息可能未拉取完成，直接更新会导致拉取补偿时可能丢失部分发件箱消息
            // this._letterbox.setOutboxTime(ack.timestamp, this.currentUserId)
            this._sendMessageStore.setMessage(ack.messageUId, ack.timestamp);
            if (msg.messageType === MessageType$1.EXPANSION_NOTIFY) {
                this._receiveMessageExpansion(msg);
                return;
            }
            // 处理多端同步已读状态消息
            if (msg.messageType === MessageType$1.SYNC_READ_STATUS) {
                // 清理本地未读数
                this._conversationManager.clearUnreadCount(msg.conversationType, msg.targetId);
            }
            this._watcher.message(msg);
            this._conversationManager.setConversationCacheByMessage(msg, true);
        }
        /**
         * 拉取消息
         * @description 聊天室消息与普通消息都是通知拉取
         * @param signal
         */
        _pullMsg(signal) {
            if (!this._channel) {
                return;
            }
            const { type, chrmId, time } = this._channel.codec.decodeByPBName(signal.data, PBName.NotifyMsg);
            logger.debug(`s_ntf -> type: ${type}, chrmId: ${chrmId}, time: ${time}`);
            if (type === 2) {
                const info = this._chrmsQueue[chrmId];
                // 拉取通知可能是由于多端中其他端接收通知拉取
                if (!info) {
                    return;
                }
                info.queue.push(time);
                this._pullChrmMsg(chrmId);
            }
            else {
                // 记录消息拉取通知的时间戳
                this._pullQueue.push(time);
                this._syncMsg();
            }
        }
        _startSyncInterval() {
            this._stopSyncInterval();
            // 超出 3 分钟未更新拉取时间戳，则主动拉取一次
            const d = 3 * 60 * 1000;
            // 30s 检测一次当前时间与上一次同步的时间
            this._intervalTimer = setInterval(() => {
                if (Date.now() - this._latestSyncTimestamp >= d) {
                    this._syncMsg();
                }
            }, 30000);
            this._latestSyncTimestamp = Date.now();
            this._syncMsg();
        }
        _stopSyncInterval() {
            if (this._intervalTimer !== -1) {
                clearInterval(this._intervalTimer);
                this._intervalTimer = -1;
            }
        }
        /**
         * 拉取消息：离线 Or 通知拉取
         */
        _syncMsg() {
            return __awaiter(this, void 0, void 0, function* () {
                // 拉取中，队列等待
                if (this._pullingMsg) {
                    return;
                }
                if (!this._channel) {
                    // 连接中断，无需拉取离线消息
                    this._pullingMsg = false;
                    return;
                }
                this._pullingMsg = true;
                // 获取消息时间戳
                const outboxTime = this._letterbox.getOutboxTime(this.currentUserId);
                const inboxTime = this._letterbox.getInboxTime(this.currentUserId);
                logger.debug(`pullMsg -> sendboxTime: ${outboxTime}, inboxTime: ${inboxTime}`);
                const reqBody = this._channel.codec.encodeSyncMsg({ sendboxTime: outboxTime, inboxTime });
                const writer = new QueryWriter(Topic$1[Topic$1.pullMsg], reqBody, this.currentUserId);
                const { code, data } = yield this._channel.send(writer, PBName.DownStreamMessages, {
                    connectedTime: this._channel.connectedTime,
                    currentUserId: this.currentUserId
                });
                // 记录本次拉取同步时间
                this._latestSyncTimestamp = Date.now();
                if (code !== ErrorCode$1.SUCCESS || !data) {
                    logger.warn('pullMsg failed -> code:', code, ', data: ', data);
                    this._pullingMsg = false;
                    return;
                }
                const { list, finished, syncTime } = data;
                logger.debug(`pullMsg success -> syncTime: ${syncTime}, finished: ${finished}`);
                let newOutboxTime = 0;
                // 派发消息
                list.forEach(item => {
                    if (item.messageDirection === MessageDirection$1.SEND) {
                        newOutboxTime = Math.max(item.sentTime, newOutboxTime);
                        // 发件箱消息去重
                        const _sentMessageMap = this._sendMessageStore.getSendMessageMap();
                        const timestamp = _sentMessageMap[item.messageUId];
                        if (timestamp) {
                            // 清理记录，以防止内存泄露
                            this._sendMessageStore.removeByUID(item.messageUId);
                            return;
                        }
                    }
                    if (item.messageType === MessageType$1.EXPANSION_NOTIFY) {
                        this._receiveMessageExpansion(item);
                        return;
                    }
                    // 处理多端同步已读状态消息
                    if (item.messageType === MessageType$1.SYNC_READ_STATUS) {
                        if (item.senderUserId !== this.currentUserId) {
                            return;
                        }
                        // 清理本地未读数
                        this._conversationManager.clearUnreadCount(item.conversationType, item.targetId);
                    }
                    const msg = this._handleMsgProperties(item);
                    this._conversationManager.setConversationCacheByMessage(msg, true);
                    this._watcher.message(msg);
                });
                // 更新收件箱时间
                this._letterbox.setInboxTime(syncTime, this.currentUserId);
                // 更新发件箱时间
                this._letterbox.setOutboxTime(newOutboxTime, this.currentUserId);
                // 清理 localstorage 中存储的 sendMessage
                this._sendMessageStore.removeByTimestamp(newOutboxTime);
                this._pullingMsg = false;
                // 清除较 syncTime 更早的拉取通知时间戳
                const tmpPullQueue = this._pullQueue.filter(timestamp => timestamp > syncTime);
                this._pullQueue.length = 0;
                this._pullQueue.push(...tmpPullQueue);
                // 通知拉取离线消息完成
                if (finished && !this._pullOfflineFinished) {
                    this._pullOfflineFinished = true;
                    this._watcher.pullFinished();
                }
                if (!finished || tmpPullQueue.length > 0) {
                    // 继续拉取
                    this._syncMsg();
                }
            });
        }
        /**
         * 接收直发消息
         * @description 直发消息只有单聊、群聊存在，其他会话类型均为通知拉取
         * @param signal
         */
        _receiveMsg(signal) {
            if (!this._channel) {
                return;
            }
            // 当在拉取单群聊离线过程中，直发消息可直接抛弃
            if (this._pullingMsg) {
                return;
            }
            let msg = this._channel.codec.decodeByPBName(signal.data, PBName.DownStreamMessage, {
                currentUserId: this.currentUserId, connectedTime: this._channel.connectedTime
            });
            msg = this._handleMsgProperties(msg);
            // 服务端使用同一账户发送消息时，该账户的其他端会通过直发接受这条消息
            if (msg.senderUserId === this.currentUserId) {
                this._sendMessageStore.setMessage(msg.messageUId, msg.sentTime);
            }
            // 状态消息不更新收件箱时间
            if (!msg.isStatusMessage && msg.senderUserId !== this.currentUserId) {
                // 更新收件箱时间
                this._letterbox.setInboxTime(msg.sentTime, this.currentUserId);
            }
            if (msg.messageType === MessageType$1.EXPANSION_NOTIFY) {
                this._receiveMessageExpansion(msg);
                return;
            }
            // 处理多端同步已读状态消息
            if (msg.messageType === MessageType$1.SYNC_READ_STATUS) {
                if (msg.senderUserId !== this.currentUserId) {
                    return;
                }
            }
            this._conversationManager.setConversationCacheByMessage(msg, true);
            this._watcher.message(msg);
        }
        /**
         * 向 API Context 抛出消息时，处理消息的部分属性值
         * @description
         * 当前仅根据内置消息或自定义类型的消息处理消息的存储、计数属性
        */
        _handleMsgProperties(msgOptions, isSendMsg = false) {
            const { messageType, isCounted, isPersited, isStatusMessage } = msgOptions;
            let options;
            const inRCMessageType = messageType in SEND_MESSAGE_TYPE_OPTION;
            const inCustomMessageType = messageType in this._customMessageType;
            if (inRCMessageType) { // 内置消息
                options = SEND_MESSAGE_TYPE_OPTION[messageType];
            }
            else if (inCustomMessageType) { // 自定义消息
                options = this._customMessageType[messageType];
            }
            else { // 其他消息, 发消息已传参为准, 无参数默认 false. 收消息已服务端微赚
                options = {
                    isCounted: isNull(isCounted) ? false : isCounted,
                    isPersited: isNull(isPersited) ? false : isPersited
                };
            }
            Object.assign(msgOptions, {
                isCounted: options.isCounted,
                isPersited: options.isPersited,
                isStatusMessage: STATUS_MESSAGE.includes(messageType)
            });
            isSendMsg && (msgOptions.isStatusMessage = isStatusMessage);
            return msgOptions;
        }
        getHistoryMessage(conversationType, targetId, timestamp, count, order) {
            return __awaiter(this, void 0, void 0, function* () {
                const { currentUserId, _channel: channel } = this;
                const hisTopic = ConversationTypeToQueryHistoryTopic[conversationType] || QueryHistoryTopic.PRIVATE;
                // 当 count === 1 且 timestamp === 0 时，服务器为向前兼容不会返回任何数据，此时需要修改 count 为 2 并在最终结果中修订返回值给上层
                const needFix = count === 1 && timestamp === 0;
                if (channel) {
                    const data = channel.codec.encodeGetHistoryMsg(targetId, { timestamp, count: needFix ? 2 : count, order });
                    const resp = yield channel.send(new QueryWriter(hisTopic, data, currentUserId), PBName.HistoryMsgOuput, {
                        currentUserId, connectedTime: channel.connectedTime, conversation: { targetId }
                    });
                    const { code } = resp;
                    if (code !== ErrorCode$1.SUCCESS) {
                        return { code };
                    }
                    // 解析数据转换为业务层数据结构
                    const downstreamData = resp.data;
                    // 修订返回值
                    if (needFix && downstreamData.list.length === 2) {
                        downstreamData.hasMore = true;
                        if (order === 0) {
                            downstreamData.list.shift();
                        }
                        else {
                            downstreamData.list.pop();
                        }
                    }
                    return {
                        code,
                        data: { list: downstreamData.list, hasMore: downstreamData.hasMore }
                    };
                }
                return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
            });
        }
        // 上报SDK信息
        reportSDKInfo(versionInfo) {
            const { currentUserId, _channel: channel } = this;
            if (channel) {
                logger.debug('reportSDKInfo ->', versionInfo);
                const data = channel.codec.encodeReportSDKInfo(JSON.stringify(versionInfo));
                const writer = new QueryWriter(Topic$1[Topic$1.reportsdk], data, currentUserId);
                channel.send(writer).then(({ code }) => {
                    if (code !== ErrorCode$1.SUCCESS) {
                        logger.warn(`reportSDKInfo failed -> code: ${code}`);
                    }
                });
            }
        }
        deleteRemoteMessage(conversationType, targetId, list) {
            return __awaiter(this, void 0, void 0, function* () {
                const { currentUserId, _channel: channel } = this;
                if (channel) {
                    const data = channel.codec.encodeDeleteMessages(conversationType, targetId, list);
                    const writer = new QueryWriter(QueryTopic.DELETE_MESSAGES, data, currentUserId);
                    const resp = yield channel.send(writer);
                    const { code } = resp;
                    if (code !== ErrorCode$1.SUCCESS) {
                        return code;
                    }
                    return code;
                }
                return ErrorCode$1.RC_NET_CHANNEL_INVALID;
            });
        }
        deleteRemoteMessageByTimestamp(conversationType, targetId, timestamp) {
            return __awaiter(this, void 0, void 0, function* () {
                const { currentUserId, _channel: channel } = this;
                if (channel) {
                    const data = channel.codec.encodeClearMessages(targetId, timestamp);
                    const topic = ConversationTypeToClearMessageTopic[conversationType];
                    const writer = new QueryWriter(topic, data, currentUserId);
                    const resp = yield channel.send(writer);
                    const { code } = resp;
                    if (code !== ErrorCode$1.SUCCESS) {
                        return code;
                    }
                    return code;
                }
                return ErrorCode$1.RC_NET_CHANNEL_INVALID;
            });
        }
        getConversationList(count = 300, conversationType, startTime, order, channelId) {
            return __awaiter(this, void 0, void 0, function* () {
                const { currentUserId, _channel: channel } = this;
                // conversationType 服务端未用到此字段，直接返回所有类型
                conversationType = conversationType || ConversationType$1.PRIVATE;
                if (channel) {
                    const buff = channel.codec.encodeOldConversationList({ count, type: conversationType, startTime, order });
                    const writer = new QueryWriter(QueryTopic.GET_OLD_CONVERSATION_LIST, buff, currentUserId);
                    const resp = yield channel.send(writer, PBName.RelationsOutput, {
                        currentUserId,
                        connectedTime: channel.connectedTime,
                        afterDecode: (conversation) => {
                            const { conversationType, targetId } = conversation;
                            const localConversation = this._conversationManager.get(conversationType, targetId);
                            // 将本地存储的会话属性和从 Server 获取到的会话属性进行合并
                            Object.assign(conversation, localConversation);
                            return conversation;
                        }
                    });
                    const { code, data } = resp;
                    if (code !== ErrorCode$1.SUCCESS) {
                        return { code };
                    }
                    return {
                        code,
                        data: data
                    };
                }
                return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
            });
        }
        removeConversation(conversationType, targetId) {
            return __awaiter(this, void 0, void 0, function* () {
                const { _channel: channel } = this;
                if (channel) {
                    const data = channel.codec.encodeOldConversationList({ type: conversationType });
                    const writer = new QueryWriter(QueryTopic.REMOVE_OLD_CONVERSATION, data, targetId);
                    const resp = yield channel.send(writer);
                    logger.info('RemoveConversation =>', resp);
                    const { code } = resp;
                    if (code !== ErrorCode$1.SUCCESS) {
                        return code;
                    }
                    return code;
                }
                return ErrorCode$1.RC_NET_CHANNEL_INVALID;
            });
        }
        getConversation(conversationType, targetId, channelId) {
            return __awaiter(this, void 0, void 0, function* () {
                const localConversation = this._conversationManager.get(conversationType, targetId);
                if (!localConversation) {
                    return { code: ErrorCode$1.CONVER_GET_ERROR };
                }
                const { code, data } = yield this.getHistoryMessage(conversationType, targetId, 0, 1, 0);
                if (code !== ErrorCode$1.SUCCESS) {
                    return { code: ErrorCode$1.CONVER_GET_ERROR };
                }
                const latestMessage = (data === null || data === void 0 ? void 0 : data.list[0]) || null;
                const conversation = {
                    conversationType,
                    targetId,
                    channelId,
                    unreadMessageCount: localConversation.unreadMessageCount || 0,
                    latestMessage: latestMessage,
                    notificationStatus: localConversation.notificationStatus || NotificationStatus$1.CLOSE,
                    isTop: localConversation.isTop || false,
                    lastUnreadTime: localConversation.lastUnreadTime || 0
                };
                return { code: ErrorCode$1.SUCCESS, data: conversation };
            });
        }
        getAllConversationUnreadCount(channelId, conversationTypes, includeMuted) {
            const allUnreadCount = this._conversationManager.getAllUnreadCount(channelId, conversationTypes, includeMuted);
            return Promise.resolve({
                code: ErrorCode$1.SUCCESS,
                data: allUnreadCount
            });
        }
        getConversationUnreadCount(conversationType, targetId) {
            const unreadCount = this._conversationManager.getUnreadCount(conversationType, targetId);
            return Promise.resolve({
                code: ErrorCode$1.SUCCESS,
                data: unreadCount
            });
        }
        clearConversationUnreadCount(conversationType, targetId) {
            this._conversationManager.clearUnreadCount(conversationType, targetId);
            return Promise.resolve(ErrorCode$1.SUCCESS);
        }
        getFirstUnreadMessage(conversationType, targetId) {
            throw new Error('Method not implemented.');
        }
        saveConversationMessageDraft(conversationType, targetId, draft) {
            this._conversationManager.setDraft(conversationType, targetId, draft);
            return Promise.resolve(ErrorCode$1.SUCCESS);
        }
        getConversationMessageDraft(conversationType, targetId) {
            const draft = this._conversationManager.getDraft(conversationType, targetId);
            return Promise.resolve({
                code: ErrorCode$1.SUCCESS,
                data: draft
            });
        }
        clearConversationMessageDraft(conversationType, targetId) {
            this._conversationManager.clearDraft(conversationType, targetId);
            return Promise.resolve(ErrorCode$1.SUCCESS);
        }
        pullConversationStatus(timestamp) {
            return __awaiter(this, void 0, void 0, function* () {
                const { _channel: channel, currentUserId } = this;
                if (channel) {
                    const buff = channel.codec.encodeGetConversationStatus(timestamp);
                    const writer = new QueryWriter(Topic$1[Topic$1.pullSeAtts], buff, currentUserId);
                    const resp = yield channel.send(writer, PBName.SessionStates);
                    const { code, data } = resp;
                    if (code !== ErrorCode$1.SUCCESS) {
                        return { code };
                    }
                    return { code, data: data };
                }
                return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
            });
        }
        batchSetConversationStatus(statusList) {
            return __awaiter(this, void 0, void 0, function* () {
                const { currentUserId, _channel: channel } = this;
                if (channel) {
                    const buff = channel.codec.encodeSetConversationStatus(statusList);
                    const writer = new QueryWriter(QueryTopic.SET_CONVERSATION_STATUS, buff, currentUserId);
                    const resp = yield channel.send(writer, PBName.SessionStateModifyResp);
                    const { code, data } = resp;
                    if (code === ErrorCode$1.SUCCESS) {
                        const versionData = data;
                        statusList.forEach((item) => {
                            this._conversationManager.addStatus(Object.assign(Object.assign({}, item), { updatedTime: versionData.version }), true);
                        });
                        return code;
                    }
                    return code;
                }
                return ErrorCode$1.RC_NET_CHANNEL_INVALID;
            });
        }
        _joinChrm(chrmId, count, isJoinExist) {
            return __awaiter(this, void 0, void 0, function* () {
                const { _channel: channel } = this;
                if (!channel)
                    return ErrorCode$1.RC_NET_CHANNEL_INVALID;
                const buff = channel.codec.encodeJoinOrQuitChatRoom();
                const topic = isJoinExist ? QueryTopic.JOIN_EXIST_CHATROOM : QueryTopic.JOIN_CHATROOM;
                const writer = new QueryWriter(topic, buff, chrmId);
                const { code, data } = yield channel.send(writer, PBName.ChrmOutput);
                const { joinTime } = data;
                // 加入聊天室成功后，需要拉取聊天室最近消息, 并抛给消息监听器
                if (code === ErrorCode$1.SUCCESS) {
                    const info = this._chrmsQueue[chrmId];
                    // 断线重连情况下，重复加房间不能重置消息拉取信息
                    if (!info) {
                        this._chrmsQueue[chrmId] = { pulling: false, queue: [], timestamp: 0 };
                    }
                    this._pullChrmMsg(chrmId, count, joinTime);
                    // 如果开通聊天室 KV 存储服务, 加入成功后拉取聊天室 KV 存储
                    const { kvStorage: isOpenKVService } = this._naviInfo;
                    if (isOpenKVService) {
                        this._chrmEntryHandler.pullEntry(chrmId, 0);
                    }
                    // sessionStorage 存储加入房间的信息
                    this._joinedChrmManager.set(chrmId, count);
                }
                return code;
            });
        }
        /**
         * 断网重连成功后，从 sessionStorage 缓存中获取用户已加入的聊天室，然后重新加入已存在的聊天室，并拉取消息
        */
        _rejoinChrm() {
            return __awaiter(this, void 0, void 0, function* () {
                const joinedChrms = this._joinedChrmManager.get();
                for (const chrmId in joinedChrms) {
                    // 若用户传参时使用的是 0，会出现重连后不拉去聊天室历史消息问题，故需要修改为默认值 10
                    const code = yield this._joinChrm(chrmId, joinedChrms[chrmId] || 10, true);
                    if (code === ErrorCode$1.SUCCESS) {
                        this._watcher.chatroom({
                            rejoinedRoom: {
                                chatroomId: chrmId,
                                count: joinedChrms[chrmId]
                            }
                        });
                    }
                    else {
                        this._watcher.chatroom({
                            rejoinedRoom: {
                                chatroomId: chrmId,
                                errorCode: code
                            }
                        });
                    }
                }
            });
        }
        /**
         * 拉取聊天室消息
         * @param chrmId
         * @param count 默认拉取 10 条，最大一次拉取 50 条，只在加入房间时第一次拉取时有效
         * @param joinTime 加入房间时间，加入房间时，第一次拉取消息（历史消息）时传入
         */
        _pullChrmMsg(chrmId, count = 10, joinTime = 0) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return;
                }
                const chrmInfo = this._chrmsQueue[chrmId];
                const { pulling, timestamp } = chrmInfo;
                if (pulling) {
                    return;
                }
                chrmInfo.pulling = true;
                const reqBody = this._channel.codec.encodeChrmSyncMsg(timestamp, count);
                const signal = new QueryWriter(Topic$1[Topic$1.chrmPull], reqBody, chrmId);
                const { code, data } = yield this._channel.send(signal, PBName.DownStreamMessages, {
                    connectedTime: this._channel.connectedTime,
                    currentUserId: this.currentUserId
                });
                chrmInfo.pulling = false;
                if (code !== ErrorCode$1.SUCCESS || !data) {
                    logger.warn('pull chatroom msg failed, code:', code, ', data:', data);
                    return;
                }
                const { list, syncTime, finished } = data;
                chrmInfo.timestamp = joinTime ? Math.max(syncTime, joinTime) : syncTime;
                // 清除无效时间戳
                chrmInfo.queue = chrmInfo.queue.filter(item => item > syncTime);
                // 派发消息
                list.forEach(item => {
                    if (item.sentTime < timestamp) {
                        return;
                    }
                    this._watcher.message(item);
                });
                if (!finished || chrmInfo.queue.length > 0) {
                    this._pullChrmMsg(chrmId);
                }
            });
        }
        joinChatroom(chatroomId, count) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._joinChrm(chatroomId, count, false);
            });
        }
        joinExistChatroom(chatroomId, count) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._joinChrm(chatroomId, count, true);
            });
        }
        quitChatroom(chrmId) {
            return __awaiter(this, void 0, void 0, function* () {
                const { _channel: channel } = this;
                if (!channel) {
                    return ErrorCode$1.RC_NET_CHANNEL_INVALID;
                }
                const buff = channel.codec.encodeJoinOrQuitChatRoom();
                const writer = new QueryWriter(QueryTopic.QUIT_CHATROOM, buff, chrmId);
                const resp = yield channel.send(writer);
                const { code } = resp;
                if (code === ErrorCode$1.SUCCESS) {
                    delete this._chrmsQueue[chrmId];
                    this._chrmEntryHandler.reset(chrmId);
                    // 移除加入聊天室存储信息
                    this._joinedChrmManager.remove(chrmId);
                }
                return code;
            });
        }
        getChatroomInfo(chatroomId, count, order) {
            return __awaiter(this, void 0, void 0, function* () {
                const { _channel: channel } = this;
                if (!channel)
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                const buff = channel.codec.encodeGetChatRoomInfo(count, order);
                const writer = new QueryWriter(Topic$1[Topic$1.queryChrmI], buff, chatroomId);
                const resp = yield channel.send(writer, PBName.QueryChatRoomInfoOutput);
                const { code, data } = resp;
                if (code !== ErrorCode$1.SUCCESS)
                    return { code };
                return { code, data: data };
            });
        }
        getChatroomHistoryMessages(chatroomId, timestamp, count, order) {
            return __awaiter(this, void 0, void 0, function* () {
                const { _channel: channel } = this;
                if (!channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                const buff = channel.codec.encodeGetHistoryMsg(chatroomId, { timestamp, count, order });
                const writer = new QueryWriter(QueryHistoryTopic.CHATROOM, buff, chatroomId);
                const resp = yield channel.send(writer, PBName.HistoryMsgOuput, {
                    conversation: { targetId: chatroomId }
                });
                const { code } = resp;
                const data = resp.data;
                if (code !== ErrorCode$1.SUCCESS)
                    return { code };
                return { code, data: { list: data.list, hasMore: data.hasMore } };
            });
        }
        _modifyChatroomKV(chatroomId, entry) {
            return __awaiter(this, void 0, void 0, function* () {
                const { _channel: channel, currentUserId } = this;
                if (!channel)
                    return ErrorCode$1.RC_NET_CHANNEL_INVALID;
                const buff = channel.codec.encodeModifyChatRoomKV(chatroomId, entry, currentUserId);
                const topic = entry.type === ChatroomEntryType$1.UPDATE ? QueryTopic.UPDATE_CHATROOM_KV : QueryTopic.DELETE_CHATROOM_KV;
                const writer = new QueryWriter(topic, buff, chatroomId);
                const resp = yield channel.send(writer);
                const { code } = resp;
                if (code === ErrorCode$1.SUCCESS) {
                    this._chrmEntryHandler.setLocal(chatroomId, {
                        kvEntries: [entry],
                        syncTime: new Date().getTime()
                    }, currentUserId);
                    return code;
                }
                return code;
            });
        }
        setChatroomEntry(chatroomId, entry) {
            return __awaiter(this, void 0, void 0, function* () {
                entry.type = ChatroomEntryType$1.UPDATE;
                return this._modifyChatroomKV(chatroomId, entry);
            });
        }
        forceSetChatroomEntry(chatroomId, entry) {
            return __awaiter(this, void 0, void 0, function* () {
                entry.type = ChatroomEntryType$1.UPDATE;
                entry.isOverwrite = true;
                return this._modifyChatroomKV(chatroomId, entry);
            });
        }
        removeChatroomEntry(chatroomId, entry) {
            return __awaiter(this, void 0, void 0, function* () {
                entry.type = ChatroomEntryType$1.DELETE;
                return this._modifyChatroomKV(chatroomId, entry);
            });
        }
        forceRemoveChatroomEntry(chatroomId, entry) {
            return __awaiter(this, void 0, void 0, function* () {
                entry.type = ChatroomEntryType$1.DELETE;
                entry.isOverwrite = true;
                return this._modifyChatroomKV(chatroomId, entry);
            });
        }
        getChatroomEntry(chatroomId, key) {
            // 1、判断用户是否在聊天室，不在抛出 不在聊天室 错误码 2、从本地获取 key value 属性
            const entry = this._chrmEntryHandler.getValue(chatroomId, key);
            if (entry) {
                return Promise.resolve({
                    code: ErrorCode$1.SUCCESS,
                    data: entry
                });
            }
            else {
                return Promise.resolve({
                    code: ErrorCode$1.CHATROOM_KEY_NOT_EXIST
                });
            }
        }
        getAllChatroomEntry(chatroomId) {
            // 1、判断用户是否在聊天室，不在抛出 不在聊天室 错误码 2、从本地获取 key value 属性
            const entries = this._chrmEntryHandler.getAll(chatroomId);
            return Promise.resolve({
                code: ErrorCode$1.SUCCESS,
                data: entries
            });
        }
        /**
         * 拉取聊天室 KV 存储
         * @param chatroomId
         * @param timestamp
        */
        pullChatroomEntry(chatroomId, timestamp) {
            return __awaiter(this, void 0, void 0, function* () {
                const { _channel: channel, currentUserId } = this;
                if (!channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                const buff = channel.codec.encodePullChatRoomKV(timestamp);
                const writer = new QueryWriter(Topic$1[Topic$1.pullKV], buff, chatroomId);
                const resp = yield channel.send(writer, PBName.ChrmKVOutput);
                const { code, data } = resp;
                if (code === ErrorCode$1.SUCCESS) {
                    logger.debug('Pull success ChrmKV, ' + JSON.stringify(resp));
                    // 拉取完成后，向本地缓存 kv
                    this._chrmEntryHandler.setLocal(chatroomId, data, currentUserId);
                    logger.debug('Save into cache success!');
                    // 拉取完成后, 如果有拉取到更新的 entry 通知聊天室 KV 监听器
                    const { kvEntries } = data;
                    const updatedEntries = [];
                    if (kvEntries.length > 0) {
                        kvEntries.forEach(entry => {
                            const { key, value, type, timestamp } = entry;
                            updatedEntries.push({
                                key,
                                value: value,
                                type: type,
                                timestamp: timestamp,
                                chatroomId
                            });
                        });
                        this._watcher.chatroom({ updatedEntries });
                    }
                    return {
                        code,
                        data: data
                    };
                }
                return { code };
            });
        }
        /**
         * 消息发送
         * @param conversationType
         * @param targetId
         * @param options
         */
        sendMessage(conversationType, targetId, options) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                options = handleInnerMsgOptions(options, this.currentUserId);
                options = this._handleMsgProperties(options, true);
                // 检查是否为状态消息，状态消息只在单聊、群聊类型会话中有效
                const isStatusMessage = [ConversationType$1.PRIVATE, ConversationType$1.GROUP].includes(conversationType)
                    ? options.isStatusMessage
                    : false;
                const topic = isStatusMessage ? getStatPubTopic(conversationType) : (getPubTopic(conversationType) || Topic$1.ppMsgP);
                if (isStatusMessage) {
                    options.isPersited = false;
                    options.isCounted = false;
                }
                const data = this._channel.codec.encodeUpMsg({ type: conversationType, targetId }, options);
                const signal = new PublishWriter(Topic$1[topic], data, targetId);
                signal.setHeaderQos(QOS.AT_LEAST_ONCE);
                // 状态消息无 Ack 应答
                if (isStatusMessage) {
                    this._channel.sendOnly(signal);
                    return {
                        code: ErrorCode$1.SUCCESS,
                        data: transSentAttrs2IReceivedMessage(conversationType, targetId, Object.assign({}, options), '', 0, this.currentUserId)
                    };
                }
                // 发送失败时的发送时间
                const sentTime = Date.now() - this._localConnectedTime + this._connectedTime;
                const receivedMessage = transSentAttrs2IReceivedMessage(conversationType, targetId, Object.assign({}, options), '', sentTime, this.currentUserId);
                const { code, data: resp } = yield this._channel.send(signal);
                if (code !== ErrorCode$1.SUCCESS) {
                    return {
                        code,
                        data: receivedMessage
                    };
                }
                const pubAck = resp;
                // 发送消息时，不可更新本地发件箱时间戳
                // 换端登录、清理缓存或多端情况下，若拉取消息动作未完成时更新时间戳，会导致发件箱消息拉取错误，丢失部分发件箱消息
                // this._letterbox.setOutboxTime(pubAck.timestamp, this.currentUserId)
                this._sendMessageStore.setMessage(pubAck.messageUId, pubAck.timestamp);
                // 更新会话监听
                receivedMessage.sentTime = pubAck.timestamp;
                receivedMessage.messageUId = pubAck.messageUId;
                this._conversationManager.setConversationCacheByMessage(receivedMessage, true);
                return {
                    code: ErrorCode$1.SUCCESS,
                    data: receivedMessage
                };
            });
        }
        recallMsg(conversationType, targetId, messageUId, sentTime, recallMsgOptions) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                const { user } = recallMsgOptions;
                // user 为发送撤回消息携带的用户信息
                const msg = {
                    content: { conversationType, targetId, messageUId, sentTime, user },
                    messageType: 'RC:RcCmd',
                    disableNotification: recallMsgOptions === null || recallMsgOptions === void 0 ? void 0 : recallMsgOptions.disableNotification,
                    pushConfig: recallMsgOptions === null || recallMsgOptions === void 0 ? void 0 : recallMsgOptions.pushConfig,
                    pushContent: ((_a = recallMsgOptions.pushConfig) === null || _a === void 0 ? void 0 : _a.pushContent) || recallMsgOptions.pushContent || ''
                };
                const topic = Topic$1[Topic$1.recallMsg];
                const data = this._channel.codec.encodeUpMsg({ type: conversationType, targetId }, msg);
                const signal = new PublishWriter(topic, data, this.currentUserId);
                signal.setHeaderQos(QOS.AT_LEAST_ONCE);
                const { code, data: resp } = yield this._channel.send(signal);
                if (code !== ErrorCode$1.SUCCESS) {
                    return { code };
                }
                const pubAck = resp;
                this._sendMessageStore.setMessage(pubAck.messageUId, pubAck.timestamp);
                return {
                    code: ErrorCode$1.SUCCESS,
                    data: transSentAttrs2IReceivedMessage(conversationType, targetId, Object.assign({}, msg), pubAck.messageUId, pubAck.timestamp, this.currentUserId)
                };
            });
        }
        sendReadReceiptMessage(targetId, messageUIds, channelId) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                const buff = this._channel.codec.encodeReadReceipt(messageUIds, channelId);
                const signal = new QueryWriter(Topic$1[Topic$1.rrMsg], buff, targetId);
                return yield this._channel.send(signal);
            });
        }
        /**
         * 获取群组消息已读列表
         * @param targetId
         * @param messageUIds
         */
        getMessageReader(targetId, messageUId, channelId) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                const buff = this._channel.codec.encodeMessageReader(messageUId, channelId);
                const signal = new QueryWriter(Topic$1[Topic$1.rrList], buff, targetId);
                return yield this._channel.send(signal, PBName.GrpReadReceiptQryResp);
            });
        }
        /**
         * 拉取用户配置
         * @todo 需要确定 version 的作用是什么
         * @param version
         */
        pullUserSettings(version) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                const buff = this._channel.codec.encodePullUserSetting(version);
                const writer = new QueryWriter(Topic$1[Topic$1.pullUS], buff, this.currentUserId);
                return this._channel.send(writer, PBName.PullUserSettingOutput);
            });
        }
        getFileToken(fileType, fileName, httpMethod, queryString) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                // 若不设置 fileName 百度上传的认证数据均返回 null
                var uploadFileName;
                // stc上传分三个步骤，后面两个步骤复用第一个步骤获取的fileName
                if (queryString && queryString !== 'uploads')
                    uploadFileName = fileName || '';
                else
                    uploadFileName = getUploadFileName(fileType, fileName);
                const buff = this._channel.codec.encodeGetFileToken(fileType, uploadFileName, httpMethod || '', queryString || '');
                const writer = new QueryWriter(Topic$1[Topic$1.qnTkn], buff, this.currentUserId);
                let { code, data } = yield this._channel.send(writer, PBName.GetQNupTokenOutput);
                data = Object.assign(data, { fileName: uploadFileName });
                if (code === ErrorCode$1.SUCCESS) {
                    return {
                        code,
                        data: data
                    };
                }
                return { code };
            });
        }
        getFileUrl(fileType, serverType, fileName, saveName) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                let topic = '';
                let inputPBName = '';
                let outputPBName = '';
                if (serverType === UploadMethod$1.QINIU) {
                    inputPBName = PBName.GetQNdownloadUrlInput;
                    outputPBName = PBName.GetQNdownloadUrlOutput;
                }
                else {
                    inputPBName = PBName.GetDownloadUrlInput;
                    outputPBName = PBName.GetDownloadUrlOutput;
                }
                if (serverType === UploadMethod$1.QINIU) {
                    topic = Topic$1[Topic$1.qnUrl];
                }
                else if (serverType === UploadMethod$1.AWS) {
                    topic = Topic$1[Topic$1.s3Url];
                }
                else if (serverType === UploadMethod$1.STC) {
                    topic = Topic$1[Topic$1.stcUrl];
                }
                else {
                    topic = Topic$1[Topic$1.aliUrl];
                }
                const buff = this._channel.codec.encodeGetFileUrl(inputPBName, fileType, fileName, saveName);
                const writer = new QueryWriter(topic, buff, this.currentUserId);
                const { code, data } = yield this._channel.send(writer, outputPBName);
                const resp = data;
                if (code === ErrorCode$1.SUCCESS) {
                    return {
                        code,
                        data: resp
                    };
                }
                return { code };
            });
        }
        disconnect() {
            if (this._reconnectTimer !== -1) {
                clearTimeout(this._reconnectTimer);
                this._reconnectTimer = -1;
            }
            if (this._channel) {
                this._channel.close();
                this._channel = undefined;
            }
            this._stopSyncInterval();
        }
        destroy() {
            throw new Error('JSEngine\'s method not implemented.');
        }
        registerMessageType(objectName, isPersited, isCounted, searchProps) {
            // ✔️ 根据 objectName 将自定义消息属性内存态存储 [objectName]: {isPersited, isCounted}
            this._customMessageType[objectName] = { isPersited, isCounted };
            // 根据 messageName searchProps 生成构造消息（ V3 不实现 V2 API 层实现）
            // ✔️ SDK 发消息时，根据内置消息类型或自定义消息类型去处理 存储、计数属性
            // ✔️ SDK 收到消息后，内置消息类型的属性（存储、计数）去处理收到的消息、本地会话未读数存储
        }
        /**
         * 获取服务器时间
         */
        getServerTime() {
            return Date.now() - this._localConnectedTime + this._connectedTime;
        }
        // ===================== 标签 相关接口 =====================
        /**
         * 创建标签
         * @param tag 标签
         */
        createTag(tag) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                const version = this._userSettingManager.getVersion();
                const buff = this._channel.codec.encodeCreateTag([tag], version);
                const signal = new QueryWriter(Topic$1[Topic$1.addSeTag], buff, this.currentUserId);
                const { code, data } = yield this._channel.send(signal, PBName.SetUserSettingOutput);
                if (code !== ErrorCode$1.SUCCESS) {
                    return { code };
                }
                const { version: resVersion } = data;
                this._userSettingManager.addTag([Object.assign(Object.assign({}, tag), { createdTime: resVersion })], resVersion);
                return {
                    code: ErrorCode$1.SUCCESS,
                    data: data
                };
            });
        }
        /**
         * 删除标签
         * @param tagId 标签id
         */
        removeTag(tagId) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                const version = this._userSettingManager.getVersion();
                const buff = this._channel.codec.encodeRemoveTag([tagId], version);
                const signal = new QueryWriter(Topic$1[Topic$1.delSeTag], buff, this.currentUserId);
                const { code, data } = yield this._channel.send(signal, PBName.SetUserSettingOutput);
                if (code !== ErrorCode$1.SUCCESS) {
                    return { code };
                }
                const { version: resVersion } = data;
                this._userSettingManager.deleteTag([tagId], resVersion);
                return {
                    code: ErrorCode$1.SUCCESS
                };
            });
        }
        /**
         * 更新标签
         * @param tag 标签
         */
        updateTag(tag) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                const version = this._userSettingManager.getVersion();
                const buff = this._channel.codec.encodeCreateTag([tag], version);
                const signal = new QueryWriter(Topic$1[Topic$1.addSeTag], buff, this.currentUserId);
                const { code, data } = yield this._channel.send(signal, PBName.SetUserSettingOutput);
                if (code !== ErrorCode$1.SUCCESS) {
                    return { code };
                }
                const { version: resVersion } = data;
                this._userSettingManager.addTag([tag], resVersion);
                return {
                    code: ErrorCode$1.SUCCESS,
                    data: data
                };
            });
        }
        /**
         * 获取标签列表
         * @param timestamp
         */
        getTagList() {
            return __awaiter(this, void 0, void 0, function* () {
                const list = this._userSettingManager.getTags();
                const conversationObj = this._conversationManager.getConversationListForTag();
                list.forEach((item) => {
                    item.conversationCount = conversationObj[item.tagId] ? conversationObj[item.tagId].length : 0;
                });
                return {
                    code: ErrorCode$1.SUCCESS,
                    data: list
                };
            });
        }
        addTagForConversations(tagId, conversations) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                // 校验是否存在此标签
                if (!this._userSettingManager.getTagById(tagId)) {
                    return { code: ErrorCode$1.TAG_NOT_EXIST };
                }
                const buff = this._channel.codec.encodeUpdateConversationTag([{ tagId }], conversations);
                const signal = new QueryWriter(Topic$1[Topic$1.addTag], buff, this.currentUserId);
                const { code } = yield this._channel.send(signal);
                if (code !== ErrorCode$1.SUCCESS) {
                    return { code };
                }
                const tag = {};
                tag[tagId] = {};
                conversations.forEach((con) => {
                    this._conversationManager.addTagStatus(con.type, con.targetId, tag);
                });
                return {
                    code: ErrorCode$1.SUCCESS
                };
            });
        }
        removeTagForConversations(tagId, conversations) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                const buff = this._channel.codec.encodeUpdateConversationTag([{ tagId }], conversations);
                const signal = new QueryWriter(Topic$1[Topic$1.delTag], buff, this.currentUserId);
                const { code } = yield this._channel.send(signal);
                if (code !== ErrorCode$1.SUCCESS) {
                    return { code };
                }
                conversations.forEach((con) => {
                    this._conversationManager.deleteTagStatus(con.type, con.targetId, [tagId]);
                });
                return {
                    code: ErrorCode$1.SUCCESS
                };
            });
        }
        removeTagsForConversation(conversation, tagIds) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                const { type, targetId } = conversation;
                const tags = tagIds.map((tagId) => {
                    return { tagId };
                });
                const buff = this._channel.codec.encodeUpdateConversationTag(tags, [conversation]);
                const signal = new QueryWriter(Topic$1[Topic$1.delTag], buff, this.currentUserId);
                const { code } = yield this._channel.send(signal);
                if (code !== ErrorCode$1.SUCCESS) {
                    return { code };
                }
                this._conversationManager.deleteTagStatus(type, targetId, tagIds);
                return {
                    code: ErrorCode$1.SUCCESS
                };
            });
        }
        getConversationListByTag(tagId, startTime, count) {
            return __awaiter(this, void 0, void 0, function* () {
                const { currentUserId, _channel: channel } = this;
                if (!channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                // type 服务端未用到此字段，直接返回所有类型
                const buff = channel.codec.encodeOldConversationList({ count, type: ConversationType$1.PRIVATE, startTime });
                const writer = new QueryWriter(QueryTopic.GET_OLD_CONVERSATION_LIST, buff, currentUserId);
                const resp = yield channel.send(writer, PBName.RelationsOutput, {
                    currentUserId,
                    connectedTime: channel.connectedTime
                });
                const { code, data } = resp;
                const list = this._conversationHasTagFilter(tagId, data);
                logger.info('GetConversationListByTag', list);
                if (code !== ErrorCode$1.SUCCESS) {
                    return { code };
                }
                return {
                    code,
                    data: list
                };
            });
        }
        /**
         * 筛选出拥有指定标签的会话并排序
         * @param tagId
         * @param list
         */
        _conversationHasTagFilter(tagId, list) {
            const isTopList = [];
            const commonList = [];
            // 拆分数组为置顶和非置顶两个数组
            list.forEach((item) => {
                const { conversationType, targetId } = item;
                const { hasMentioned, mentionedInfo, lastUnreadTime, notificationStatus, isTop, tags, unreadMessageCount } = this._conversationManager.get(conversationType, targetId);
                const tagStatus = tags && tags[tagId];
                if (tagStatus) {
                    const con = Object.assign(Object.assign({}, item), { hasMentioned, mentionedInfo: mentionedInfo, lastUnreadTime: lastUnreadTime, notificationStatus: notificationStatus, isTop: isTop, unreadMessageCount: unreadMessageCount });
                    if (tagStatus.isTop) {
                        isTopList.push(Object.assign(Object.assign({}, con), { isTopInTag: true }));
                    }
                    else {
                        commonList.push(Object.assign(Object.assign({}, con), { isTopInTag: false }));
                    }
                }
            });
            function compare(a, b) {
                return a.latestMessage && b.latestMessage ? (a.latestMessage.sentTime - b.latestMessage.sentTime) : 0;
            }
            // 合并 并 排序
            const data = [...isTopList.sort(compare), ...commonList.sort(compare)];
            return data;
        }
        getUnreadCountByTag(tagId, containMuted) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                const count = this._conversationManager.getUnreadCountByTag(tagId, containMuted);
                return {
                    code: ErrorCode$1.SUCCESS,
                    data: count
                };
            });
        }
        setConversationStatusInTag(tagId, conversation, status) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                const { targetId, type } = conversation;
                const { isTop } = status;
                const tags = [{ tagId, isTop }];
                // 校验会话中是否存在标签
                const localConversation = this._conversationManager.get(type, targetId);
                if (!localConversation.tags || !Object.hasOwnProperty.call(localConversation.tags, tagId)) {
                    return { code: ErrorCode$1.NO_TAG_IN_CONVER };
                }
                const buff = this._channel.codec.encodeUpdateConversationTag(tags, [conversation]);
                const signal = new QueryWriter(Topic$1[Topic$1.addTag], buff, this.currentUserId);
                const { code } = yield this._channel.send(signal);
                if (code !== ErrorCode$1.SUCCESS) {
                    return { code };
                }
                const tagStatus = {};
                tagStatus[tagId] = {};
                if (isTop) {
                    tagStatus[tagId].isTop = true;
                }
                this._conversationManager.addTagStatus(type, targetId, tagStatus);
                return {
                    code: ErrorCode$1.SUCCESS
                };
            });
        }
        getTagsForConversation(conversation) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                const con = this._conversationManager.get(conversation.type, conversation.targetId);
                const tags = this._userSettingManager.getTagsInfo();
                const tagList = [];
                if (con.tags) {
                    for (const tagId in con.tags) {
                        tagList.push({
                            tagId,
                            tagName: (_a = tags[tagId]) === null || _a === void 0 ? void 0 : _a.tagName
                        });
                    }
                }
                return {
                    code: ErrorCode$1.SUCCESS,
                    data: tagList
                };
            });
        }
        // ===================== 标签 相关接口 end =====================
        // ===================== RTC 相关接口 =====================
        joinRTCRoom(roomId, mode, broadcastType, joinType) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                const reqBody = this._channel.codec.encodeJoinRTCRoom(mode, broadcastType, joinType);
                const writer = new QueryWriter(Topic$1[Topic$1.rtcRJoin_data], reqBody, roomId);
                return this._channel.send(writer, PBName.RtcUserListOutput);
            });
        }
        quitRTCRoom(roomId) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return ErrorCode$1.RC_NET_CHANNEL_INVALID;
                }
                const reqBody = this._channel.codec.encodeQuitRTCRoom();
                const writer = new QueryWriter(Topic$1[Topic$1.rtcRExit], reqBody, roomId);
                const { code } = yield this._channel.send(writer);
                return code;
            });
        }
        rtcPing(roomId, mode, broadcastType) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return ErrorCode$1.RC_NET_CHANNEL_INVALID;
                }
                const reqBody = this._channel.codec.encodeJoinRTCRoom(mode, broadcastType);
                const writer = new QueryWriter(Topic$1[Topic$1.rtcPing], reqBody, roomId);
                const { code } = yield this._channel.send(writer);
                return code;
            });
        }
        getRTCRoomInfo(roomId) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                const reqBody = this._channel.codec.encodeGetRTCRoomInfo();
                const writer = new QueryWriter(Topic$1[Topic$1.rtcRInfo], reqBody, roomId);
                return this._channel.send(writer, PBName.RtcRoomInfoOutput);
            });
        }
        getRTCUserInfoList(roomId) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                const reqBody = this._channel.codec.encodeGetRTCRoomInfo();
                const writer = new QueryWriter(Topic$1[Topic$1.rtcUData], reqBody, roomId);
                const { code, data } = yield this._channel.send(writer, PBName.RtcUserListOutput);
                return { code, data: data ? { users: data.users } : data };
            });
        }
        // TODO: 排查 rtcUPut 超时无响应问题
        setRTCUserInfo(roomId, key, value) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return ErrorCode$1.RC_NET_CHANNEL_INVALID;
                }
                const reqBody = this._channel.codec.encodeSetRTCUserInfo(key, value);
                const writer = new QueryWriter(Topic$1[Topic$1.rtcUPut], reqBody, roomId);
                const { code } = yield this._channel.send(writer);
                return code;
            });
        }
        removeRTCUserInfo(roomId, keys) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return ErrorCode$1.RC_NET_CHANNEL_INVALID;
                }
                const reqBody = this._channel.codec.encodeRemoveRTCUserInfo(keys);
                const writer = new PublishWriter(Topic$1[Topic$1.rtcUDel], reqBody, roomId);
                const { code } = yield this._channel.send(writer);
                return code;
            });
        }
        setRTCData(roomId, key, value, isInner, apiType, message) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return ErrorCode$1.RC_NET_CHANNEL_INVALID;
                }
                const reqBody = this._channel.codec.encodeSetRTCData(key, value, isInner, apiType, message);
                const writer = new PublishWriter(Topic$1[Topic$1.rtcSetData], reqBody, roomId);
                const { code } = yield this._channel.send(writer);
                return code;
            });
        }
        setRTCTotalRes(roomId, message, valueInfo, objectName, mcuValInfo) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return ErrorCode$1.RC_NET_CHANNEL_INVALID;
                }
                const reqBody = this._channel.codec.encodeUserSetRTCData(message, valueInfo, objectName, mcuValInfo);
                const writer = new QueryWriter(Topic$1[Topic$1.userSetData], reqBody, roomId);
                const { code } = yield this._channel.send(writer);
                return code;
            });
        }
        setRTCCDNUris(roomId, objectName, CDNUris) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return ErrorCode$1.RC_NET_CHANNEL_INVALID;
                }
                const reqBody = this._channel.codec.encodeUserSetRTCCDNUris(objectName, CDNUris);
                const writer = new QueryWriter(Topic$1[Topic$1.userSetData], reqBody, roomId);
                const { code } = yield this._channel.send(writer);
                return code;
            });
        }
        getRTCData(roomId, keys, isInner, apiType) {
            if (!this._channel) {
                return Promise.resolve({ code: ErrorCode$1.RC_NET_CHANNEL_INVALID });
            }
            const reqBody = this._channel.codec.encodeGetRTCData(keys, isInner, apiType);
            const writer = new QueryWriter(Topic$1[Topic$1.rtcQryData], reqBody, roomId);
            return this._channel.send(writer, PBName.RtcQryOutput);
        }
        removeRTCData(roomId, keys, isInner, apiType, message) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return ErrorCode$1.RC_NET_CHANNEL_INVALID;
                }
                const reqBody = this._channel.codec.encodeRemoveRTCData(keys, isInner, apiType, message);
                const writer = new PublishWriter(Topic$1[Topic$1.rtcDelData], reqBody, roomId);
                const { code } = yield this._channel.send(writer);
                return code;
            });
        }
        setRTCOutData(roomId, rtcData, type, message) {
            // const data = this._serverDataCodec.encodeSetRTCOutData(rtcData, type, message);
            // let writer = new PublishWriter(QUERY_TOPIC.SET_RTC_OUT_DATA, data, roomId);
            // return this._sendSignalForData(writer);
            throw new Error('JSEngine\'s method not implemented.');
        }
        getRTCOutData(roomId, userIds) {
            // const data = this._serverDataCodec.ecnodeGetRTCOutData(userIds);
            // let writer = new QueryWriter(QUERY_TOPIC.GET_RTC_OUT_DATA, data, roomId);
            // return this._sendSignalForData(writer, PBName.RtcUserOutDataOutput);
            throw new Error('JSEngine\'s method not implemented.');
        }
        getRTCToken(roomId, mode, broadcastType) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                const reqBody = this._channel.codec.encodeJoinRTCRoom(mode, broadcastType);
                const writer = new QueryWriter(Topic$1[Topic$1.rtcToken], reqBody, roomId);
                return this._channel.send(writer, PBName.RtcTokenOutput);
            });
        }
        setRTCState(roomId, report) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return ErrorCode$1.RC_NET_CHANNEL_INVALID;
                }
                const reqBody = this._channel.codec.encodeSetRTCState(report);
                const writer = new QueryWriter(Topic$1[Topic$1.rtcUserState], reqBody, roomId);
                const { code } = yield this._channel.send(writer);
                return code;
            });
        }
        getRTCUserInfo(roomId) {
            return __awaiter(this, void 0, void 0, function* () {
                throw new Error('Method not implemented.');
            });
        }
        getRTCUserList(roomId) {
            if (!this._channel) {
                return Promise.resolve({ code: ErrorCode$1.RC_NET_CHANNEL_INVALID });
            }
            const data = this._channel.codec.encodeGetRTCRoomInfo();
            const writer = new QueryWriter(Topic$1[Topic$1.rtcUList], data, roomId);
            return this._channel.send(writer, PBName.RtcUserListOutput);
        }
        joinLivingRoomAsAudience(roomId, mode = exports.RTCMode.LIVE, broadcastType) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                const reqBody = this._channel.codec.encodeJoinRTCRoom(mode, broadcastType);
                const writer = new QueryWriter(Topic$1[Topic$1.viewerJoinR], reqBody, roomId);
                const { code, data } = yield this._channel.send(writer, PBName.RtcTokenOutput);
                if (code !== ErrorCode$1.SUCCESS) {
                    return { code };
                }
                // 观众加入房间成功后，从头拉取资源
                this._rtcKVManager.pullEntry(roomId, 0);
                return {
                    code,
                    data: { token: data.rtcToken }
                };
            });
        }
        quitLivingRoomAsAudience(roomId) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return ErrorCode$1.RC_NET_CHANNEL_INVALID;
                }
                const reqBody = this._channel.codec.encodeQuitRTCRoom();
                const writer = new QueryWriter(Topic$1[Topic$1.viewerExitR], reqBody, roomId);
                const { code } = yield this._channel.send(writer);
                this._rtcKVManager.reset();
                return code;
            });
        }
        rtcIdentityChange(roomId, changeType, broadcastType) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                const reqBody = this._channel.codec.encodeIdentityChangeInfo(changeType, broadcastType);
                const writer = new QueryWriter(Topic$1[Topic$1.rtcIdentityChange], reqBody, roomId);
                const { code, data } = yield this._channel.send(writer, PBName.RtcUserListOutput);
                if (code === ErrorCode$1.SUCCESS && changeType === exports.RTCIdentityChangeType.AnchorToViewer) {
                    // 观众加入房间成功后，清空数据并从头拉取资源
                    this._rtcKVManager.reset();
                    this._rtcKVManager.pullEntry(roomId, 0);
                }
                if (code !== ErrorCode$1.SUCCESS) {
                    return { code };
                }
                return { code, data };
            });
        }
        pullRTCRoomEntry(roomId, timestamp) {
            return __awaiter(this, void 0, void 0, function* () {
                const { _channel: channel, currentUserId } = this;
                if (!channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                logger.info('audience in room start pull KV');
                // 拉取全量 KV
                const buff = channel.codec.encodePullRTCRoomKV(roomId, 0);
                const writer = new QueryWriter(Topic$1[Topic$1.rtcPullKv], buff, currentUserId);
                const { code, data } = yield channel.send(writer, PBName.RtcKVOutput);
                logger.info(`audience in room end pull KV, code: ${code}, data: ${JSON.stringify(data || {})}`);
                if (code === ErrorCode$1.SUCCESS) {
                    const { kvEntries } = data;
                    // 1、通知 API Context
                    this._watcher.onRTCDataChange(kvEntries, roomId);
                    return { code, data };
                }
                return { code };
            });
        }
        getRTCJoinedUserInfo(userId) {
            return __awaiter(this, void 0, void 0, function* () {
                const { _channel: channel, currentUserId } = this;
                if (!channel) {
                    return { code: ErrorCode$1.RC_NET_CHANNEL_INVALID };
                }
                // 拉取全量 KV
                const buff = channel.codec.encodeQueryUserJoinedInfo(userId);
                const writer = new QueryWriter(Topic$1[Topic$1.rtcQueryJoined], buff, currentUserId);
                const { code, data } = yield channel.send(writer, PBName.RtcQueryUserJoinedOutput);
                if (code === ErrorCode$1.SUCCESS) {
                    return { code, data };
                }
                return { code };
            });
        }
        getDeviceId() {
            return getDeviceId(this.runtime);
        }
        /* ================ 非标准接口调用实现 ================== */
        /**
         * 调用非标准方法。所谓非标准方法，是为某些特定需求或产品添加，暂未作为标准接口添加至 API 层。
         * 对于未实现的方法，接口响应 Unsupport 错误码
         * @param method 方法名
         * @param args
         */
        callExtra(method, ...args) {
            return Promise.resolve({ code: ErrorCode$1.EXTRA_METHOD_UNDEFINED });
        }
        /* ================ 以下为 CPP 特有接口，JSEngine 无需实现 ================== */
        clearConversations() {
            throw new Error('Method not implemented.');
        }
        setUserStatusListener(config, listener) {
            throw new Error('Method not implemented.');
        }
        setUserStatus(status) {
            throw new Error('Method not implemented.');
        }
        subscribeUserStatus(userIds) {
            throw new Error('Method not implemented.');
        }
        getUserStatus(userId) {
            throw new Error('Method not implemented.');
        }
        addToBlacklist(userId) {
            throw new Error('Method not implemented.');
        }
        removeFromBlacklist(userId) {
            throw new Error('Method not implemented.');
        }
        getBlacklist() {
            throw new Error('Method not implemented.');
        }
        getBlacklistStatus(userId) {
            throw new Error('Method not implemented.');
        }
        insertMessage(conversationType, targetId, insertOptions) {
            throw new Error('Method not implemented.');
        }
        deleteMessages(timestamps) {
            throw new Error('Method not implemented.');
        }
        deleteMessagesByTimestamp(conversationType, targetId, timestamp, cleanSpace, channelId) {
            throw new Error('Method not implemented.');
        }
        clearMessages(conversationType, targetId, channelId) {
            throw new Error('Method not implemented.');
        }
        getMessage(messageId) {
            throw new Error('Method not implemented.');
        }
        setMessageContent(messageId, content, objectName) {
            throw new Error('Method not implemented.');
        }
        setMessageSearchField(messageId, content, searchFiles) {
            throw new Error('Method not implemented.');
        }
        searchConversationByContent(keyword, messageTypes, channelId, conversationTypes) {
            throw new Error('Method not implemented.');
        }
        searchMessageByContent(conversationType, targetId, keyword, timestamp, count, total) {
            throw new Error('Method not implemented.');
        }
        getUnreadMentionedMessages(conversationType, targetId) {
            throw new Error('Method not implemented.');
        }
        setMessageSentStatus(messageId, sentStatus) {
            throw new Error('Method not implemented.');
        }
        setMessageReceivedStatus(messageId, receivedStatus) {
            throw new Error('Method not implemented.');
        }
        clearUnreadCountByTimestamp(conversationType, targetId, timestamp, channelId) {
            throw new Error('Method not implemented.');
        }
        getConversationNotificationStatus(conversationType, targetId, channelId) {
            throw new Error('Method not implemented.');
        }
        getRemoteHistoryMessages(conversationType, targetId, timestamp, count, order, channelId) {
            throw new Error('Method not implemented.');
        }
    }

    class PluginContext {
        constructor(_context) {
            this._context = _context;
        }
        /**
         * 获取 `@rongcloud/engine` 包版本
         */
        getCoreVersion() {
            return this._context.coreVersion;
        }
        /**
         * 获取当前运行中的 IMLib 版本号
         */
        getAPIVersion() {
            return this._context.apiVersion;
        }
        /**
         * 获取当前应用的 appkey
         */
        getAppkey() {
            return this._context.appkey;
        }
        /**
         * 获取当前已连接用户的 userId
         * 用户连接建立之前及 disconnect 之后，该方法返回 '' 值
         */
        getCurrentId() {
            return this._context.getCurrentUserId();
        }
        /**
         * 获取当前连接状态
         */
        getConnectionStatus() {
            return this._context.getConnectionStatus();
        }
        getDeviceId() {
            return this._context.getDeviceId();
        }
        /**
         * 发送消息
         */
        sendMessage(conversationType, targetId, options) {
            return this._context.sendMessage(conversationType, targetId, options);
        }
        /**
         * 消息注册
         * @description 消息注册需在应用初始化完成前进行
         * @param objectName 消息类型，如：RC:TxtMsg
         * @param isPersited 是否存储
         * @param isCounted 是否技术
         * @param searchProps 搜索字段，只在搭配协议栈使用时有效
         */
        registerMessageType(objectName, isPersited, isCounted, searchProps = []) {
            this._context.registerMessageType(objectName, isPersited, isCounted, searchProps);
        }
        /**
         * 获取服务时间
         */
        getServerTime() {
            return this._context.getServerTime();
        }
        /**
         * 获取加入 RTC 房间的用户信息（当前仅能查自己的）
         */
        getRTCJoinedUserInfo(userId) {
            return this._context.getRTCJoinedUserInfo(userId);
        }
    }

    class RTCPluginContext extends PluginContext {
        /**
         * 获取当前的导航数据
         */
        getNaviInfo() {
            return this._context.getInfoFromCache();
        }
        /**
         * 加入 RTC 房间
         * @todo 需确认 `broadcastType` 参数的作用与有效值
         * @param roomId
         * @param mode 房间模式：直播 or 会议
         * @param broadcastType
         */
        joinRTCRoom(roomId, mode, broadcastType, joinType) {
            return this._context.joinRTCRoom(roomId, mode, broadcastType, joinType);
        }
        quitRTCRoom(roomId) {
            return this._context.quitRTCRoom(roomId);
        }
        rtcPing(roomId, mode, broadcastType) {
            return this._context.rtcPing(roomId, mode, broadcastType);
        }
        getRTCRoomInfo(roomId) {
            return this._context.getRTCRoomInfo(roomId);
        }
        getRTCUserInfoList(roomId) {
            return this._context.getRTCUserInfoList(roomId);
        }
        getRTCUserInfo(roomId) {
            return this._context.getRTCUserInfo(roomId);
        }
        setRTCUserInfo(roomId, key, value) {
            return this._context.setRTCUserInfo(roomId, key, value);
        }
        removeRTCUserInfo(roomId, keys) {
            return this._context.removeRTCUserInfo(roomId, keys);
        }
        setRTCData(roomId, key, value, isInner, apiType, message) {
            return this._context.setRTCData(roomId, key, value, isInner, apiType, message);
        }
        /**
         * @param - roomId
         * @param - message 向前兼容的消息数据，以兼容旧版本 SDK，即增量数据，如：
         * ```
         * JSON.stringify({
         *  name: 'RCRTC:PublishResource',
         *  content: {
         *  }
         * })
         * ```
         * @param - valueInfo 全量资源数据
         * @param - 全量 URI 消息名，即 `RCRTC:TotalContentResources`
         */
        setRTCTotalRes(roomId, 
        /**
         * 向旧版本 RTCLib 兼容的消息数据
         */
        message, valueInfo, objectName, 
        /**
         * mcu 合流发布内容，是一个 JSON 字符串，解析类型为 {mediaType: number, msid: string, uri: string}[]
         */
        mcuValInfo) {
            return this._context.setRTCTotalRes(roomId, message, valueInfo, objectName, mcuValInfo);
        }
        /**
         * 设置 cdn_uris 扩散
         * @param objectName 全量 URI 消息名，即 `RCRTC:TotalContentResources`
         * @param CDNUris cdn_uris 扩散字段
         * {
            "broadcast":0,
            "fps":25,
            "h":640,
            "pull_safe":true,
            "push_mode":1,
            "url":"https://rtc-media-api-service-ucbj2-01.rongcloud.net/api/rtc/cdn/player",
            "w":360,
            "enableInnerCDN":true
          }[]
         */
        setRTCCDNUris(roomId, objectName, CDNUris) {
            return this._context.setRTCCDNUris(roomId, objectName, CDNUris);
        }
        getRTCData(roomId, keys, isInner, apiType) {
            return this._context.getRTCData(roomId, keys, isInner, apiType);
        }
        removeRTCData(roomId, keys, isInner, apiType, message) {
            return this._context.removeRTCData(roomId, keys, isInner, apiType, message);
        }
        setRTCOutData(roomId, rtcData, type, message) {
            return this._context.setRTCOutData(roomId, rtcData, type, message);
        }
        getRTCOutData(roomId, userIds) {
            return this._context.getRTCOutData(roomId, userIds);
        }
        getRTCToken(roomId, mode, broadcastType) {
            return this._context.getRTCToken(roomId, mode, broadcastType);
        }
        setRTCState(roomId, report) {
            return this._context.setRTCState(roomId, report);
        }
        getRTCUserList(roomId) {
            return this._context.getRTCUserList(roomId);
        }
        /**
         * 直播观众加房间
         */
        joinLivingRoomAsAudience(roomId, mode, broadcastType) {
            return this._context.joinLivingRoomAsAudience(roomId, mode, broadcastType);
        }
        /**
         * 直播观众退出房间
         */
        quitLivingRoomAsAudience(roomId) {
            return this._context.quitLivingRoomAsAudience(roomId);
        }
        /**
         * 直播身份切换
         */
        rtcIdentityChange(roomId, changeType, broadcastType) {
            return this._context.rtcIdentityChange(roomId, changeType, broadcastType);
        }
        /**
         * 拉取 RTC 全量 KV
         */
        pullRTCRoomEntry(roomId, timestamp) {
            return this._context.pullRTCRoomEntry(roomId, timestamp);
        }
    }

    class TextCompressor {
        static compress(data) {
            const self = this;
            const map = {};
            // 构建一个用于反向查询字符位置的 map
            for (let p = 0; p < data.length - 1; p++) {
                const c1 = data.charAt(p);
                const c2 = data.charAt(p + 1);
                const c = c1 + c2;
                /* eslint-disable */
                if (!map.hasOwnProperty(c)) {
                    map[c] = [p];
                    continue;
                }
                map[c].push(p);
            }
            const compressedData = [];
            let normalBlockBuffer = [];
            // 编码未压缩数据块
            const encodeNormalBlock = function () {
                if (normalBlockBuffer.length > 0) {
                    const normalBlock = normalBlockBuffer.join('');
                    normalBlockBuffer = [];
                    if (normalBlock.length > 26) {
                        const normalExtBlockLength = self.numberEncode(normalBlock.length);
                        const normalExtBlockHeader = String.fromCharCode(self.dataType.NormalExt | normalExtBlockLength.length);
                        compressedData.push(normalExtBlockHeader + normalExtBlockLength);
                    }
                    else {
                        const normalBlockHeader = String.fromCharCode(self.dataType.Normal | normalBlock.length);
                        compressedData.push(normalBlockHeader);
                    }
                    compressedData.push(normalBlock);
                }
            };
            let i = 0;
            while (i < data.length) {
                const r = self.indexOf(map, data, i);
                if (r.length < 2) {
                    normalBlockBuffer.push(data.charAt(i++));
                    continue;
                }
                if (r.length < 4) {
                    normalBlockBuffer.push(data.substr(i, r.length));
                    i += r.length;
                    continue;
                }
                const offset = self.numberEncode(i - r.offset);
                const length = self.numberEncode(r.length);
                // 欲压缩的数据与数据编码后的长度一致，则不进行压缩
                if (offset.length + length.length >= r.length) {
                    normalBlockBuffer.push(data.substr(i, r.length));
                    i += r.length;
                    continue;
                }
                // 编码未压缩数据块
                encodeNormalBlock();
                // 编码压缩数据块
                const compressedBlockHeader = String.fromCharCode(self.dataType.Compressed | (offset.length << 2) | length.length);
                compressedData.push(compressedBlockHeader + offset + length);
                i += r.length;
            }
            // 编码剩余未压缩数据块
            encodeNormalBlock();
            // 在数据尾部添加校验和
            const dataLengthTo62 = self.numberEncode(data.length);
            const tailBlockHeader = String.fromCharCode(self.dataType.Tail | dataLengthTo62.length);
            compressedData.push(tailBlockHeader + dataLengthTo62);
            return compressedData.join('');
        }
        static uncompress(data) {
            const self = this;
            let i = 0;
            let result = '';
            label1: do {
                const header = data.charCodeAt(i++);
                const headerType = header & self.dataType.Mark;
                const headerVal = header & 0xF;
                let num;
                switch (headerType) {
                    case self.dataType.Compressed:
                        const p1 = headerVal >> 2;
                        const p2 = headerVal & 3;
                        if (p1 === 0 || p2 === 0) {
                            throw new Error('Data parsing error,at ' + i);
                        }
                        let offset = self.numberDecode(data.substr(i, p1));
                        const len = self.numberDecode(data.substr(i += p1, p2));
                        offset = result.length - offset;
                        if (offset + len > result.length) {
                            throw new Error('Data parsing error,at ' + i);
                        }
                        i += p2;
                        result += result.substr(offset, len);
                        break;
                    case self.dataType.Tail:
                        num = self.numberDecode(data.substr(i, headerVal));
                        if (num !== result.length) {
                            console.log(result.length);
                            console.log(num);
                            throw new Error('Data parsing error,at ' + i);
                        }
                        i += headerVal;
                        break label1;
                    case self.dataType.NormalExt:
                        num = self.numberDecode(data.substr(i, headerVal));
                        result += data.substr(i += headerVal, num);
                        i += num;
                        break;
                    case self.dataType.Normal:
                        result += data.substr(i, headerVal);
                        i += headerVal;
                        break;
                    case self.dataType.Mark:
                        if (headerVal > 10) {
                            throw new Error('Data parsing error,at ' + i);
                        }
                        result += data.substr(i, 16 + headerVal);
                        i += (16 + headerVal);
                        break;
                    default:
                        throw new Error('Data parsing error,at ' + i + ' header:' + headerType);
                }
            } while (i < data.length);
            return result;
        }
        static indexOf(map, source, fromIndex) {
            const self = this;
            const result = {
                length: 0,
                offset: -1
            };
            source.length;
            if (fromIndex >= source.length - 1) {
                return result;
            }
            const c1 = source.charAt(fromIndex);
            const c2 = source.charAt(fromIndex + 1);
            const items = map[c1 + c2];
            if (items[0] === fromIndex) {
                return result;
            }
            const space1 = source.length - fromIndex;
            for (let i = 0, len = items.length; i < len; i++) {
                const item = items[i];
                const space2 = fromIndex - item;
                if (space2 > self.max) {
                    continue;
                }
                const end = Math.min(space1, space2);
                if (end <= result.length) {
                    break;
                }
                if (result.length > 2) {
                    if (source.charAt(item + result.length - 1) !== source.charAt(fromIndex + result.length - 1)) {
                        continue;
                    }
                }
                let m = 2;
                for (let j = m; j < end; j++) {
                    if (source.charAt(item + j) === source.charAt(fromIndex + j)) {
                        m++;
                    }
                    else {
                        break;
                    }
                }
                if (m >= result.length) {
                    result.length = m;
                    result.offset = item;
                }
            }
            return result;
        }
        /*
        * 将数字转化为 62 进制字符串。
        */
        static numberEncode(num) {
            const self = this;
            const result = [];
            let remainder = 0;
            do {
                remainder = num % self.scale;
                result.push(self.chars.charAt(remainder));
                num = (num - remainder) / self.scale;
            } while (num > 0);
            return result.join('');
        }
        /*
        * 将 62 进制字符串还原为数字。
        */
        static numberDecode(str) {
            const self = this;
            let num = 0;
            let index = 0;
            for (let i = str.length - 1; i >= 0; i--) {
                index = self.chars.indexOf(str.charAt(i));
                if (index === -1) {
                    throw new Error('decode number error, data is "' + str + '"');
                }
                num = num * self.scale + index;
            }
            return num;
        }
    }
    TextCompressor.dataType = {
        Tail: 0x30,
        Compressed: 0x40,
        NormalExt: 0x50,
        Normal: 0x60,
        Mark: 0x70
    };
    TextCompressor.chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    TextCompressor.scale = TextCompressor.chars.length;
    TextCompressor.max = 238327;

    // 上报实时日志次数
    let currentRTTimes = 1;
    // 上报开关
    let reportSwitch = false;
    const protocol = typeof location !== 'undefined' && location.protocol === 'https://' ? 'https://' : 'http://';
    /**
     * 日志上报类
     */
    class ReportLog {
        constructor(info) {
            this.info = info;
            this.logUrl = 'logcollection.ronghub.com';
            this.level = 1;
            this.itv = 30;
            this.times = 5;
            this.deviceId = '';
            this.deviceInfo = '';
            this.logSwitch = 0;
            this.logUrl = info.logPolicy.url || this.logUrl;
            this.level = info.logPolicy.level || this.level;
            this.itv = info.logPolicy.itv || this.itv;
            this.times = info.logPolicy.times || this.times;
            this.deviceId = getDeviceId(info.runtime);
            this.logSwitch = info.logSwitch;
            const browser = getBrowser(info.runtime);
            this.deviceInfo = `${browser.type}|${browser.version}|${Logger.sessionId}`;
            this.startReport();
        }
        static init(info) {
            reportSwitch = true;
            if (!ReportLog._instance) {
                ReportLog._instance = new ReportLog(info);
            }
            return ReportLog._instance;
        }
        static getInstance() {
            return ReportLog._instance;
        }
        // 开始上报实时日志
        startReport() {
            if (!this.logSwitch || !reportSwitch) {
                return;
            }
            const _itv = this.itv * Math.pow(2, currentRTTimes - 1);
            if (currentRTTimes < this.times) {
                currentRTTimes++;
            }
            setTimeout(() => {
                this.reportRealtimeLog();
            }, _itv * 1000);
        }
        /**
         * 上报实时日志
         */
        reportRealtimeLog() {
            // 组织数据
            const list = Logger.realTimeLogList.filter(item => item.level <= this.level);
            if (list.length === 0) {
                this.startReport();
                return;
            }
            const content = TextCompressor.compress(list.map(i => i.content).join(''));
            const url = `${protocol}${this.logUrl}?version=${this.info.version}&appkey=${this.info.appkey}&userId=${this.info.userId}&deviceId=${this.deviceId}&deviceInfo=${this.deviceInfo}&platform=Web`;
            // 上报数据
            this.info.runtime.httpReq({
                method: 'POST',
                url: url,
                body: content
            }).then((res) => {
                logger.__clearRealTimeLog();
                logger.debug('report real-time log success');
                let { data } = res;
                if (data) {
                    data = JSON.parse(data);
                    this.itv = data.nextTime;
                    this.level = data.level;
                    this.logSwitch = data.logSwitch;
                    currentRTTimes = 1;
                }
                this.startReport();
            }).catch((error) => {
                logger.debug('report real-time log error -> ' + error);
                this.startReport();
            });
        }
        /**
         * 上报全量日志
         */
        reportFullLog(params) {
            return __awaiter(this, void 0, void 0, function* () {
                const { startTime, endTime, platform, logId, uri } = params;
                const db = RCIndexDB.getInstance();
                if (platform.toLowerCase() !== 'web' || !db)
                    return;
                if (startTime > endTime) {
                    logger.warn(`report error: The start time(${startTime}) cannot be greater than the end time(${startTime})`);
                    return;
                }
                yield logger.__insertLogIntoDatabase();
                // 读取数据库数据
                let list = yield db.getRangeData(RCObjectStoreNames.RC_LOGS, 'time', startTime, endTime);
                list = list.filter(i => !i.userId || i.userId === this.info.userId);
                const content = TextCompressor.compress(list.map(i => i.content).join('') || 'no data');
                const itv = 5 * 1000;
                let currentTimes = 1;
                // 上传
                const _reportFullLog = () => {
                    if (currentTimes > 3 || !reportSwitch)
                        return;
                    const _uri = uri || this.logUrl;
                    const url = `${protocol}${_uri}?version=${this.info.version}&appkey=${this.info.appkey}&userId=${this.info.userId}&logId=${logId}&deviceId=${this.deviceId}&deviceInfo=${this.deviceInfo}&platform=Web`;
                    const _itv = itv * (currentTimes - 1);
                    currentTimes++;
                    setTimeout(() => {
                        if (!reportSwitch)
                            return;
                        this.info.runtime.httpReq({
                            url: url,
                            method: 'POST',
                            body: content
                        }).then(() => {
                            logger.debug('report full log success!');
                        }).catch((error) => {
                            _reportFullLog();
                            logger.warn('report full log error -> ' + error);
                        });
                    }, _itv);
                };
                _reportFullLog();
            });
        }
        distroy() {
            currentRTTimes = 1;
            reportSwitch = false;
        }
    }

    function cloneMessage(message) {
        return Object.assign({}, message);
    }
    class APIContext {
        constructor(_runtime, options) {
            this._runtime = _runtime;
            this._token = '';
            /**
             * 插件队列，用于逐一派发消息与信令
             */
            this._pluginContextQueue = [];
            /**
             * 插件实例Map，用于重复初始化时返回实例
             */
            this._pluginInstanseMap = {};
            /**
             * 核心库版本号，后期与 4.0 IM SDK 版本号保持一致
             */
            this.coreVersion = "4.5.0-alpha.1";
            this._versionInfo = {};
            this._typingInfo = {};
            /**
             * 内部连接状态标识，为 ture 时不允许调用 reconnect 方法
             */
            this._isInternalConnected = false;
            this._connectionStatus = ConnectionStatus$1.DISCONNECTED;
            this._canRedirectConnect = false;
            /**
             * 业务层事件监听器挂载点
             */
            this._watcher = {
                message: undefined,
                conversationState: undefined,
                chatroomState: undefined,
                connectionState: undefined,
                rtcInnerWatcher: undefined,
                expansion: undefined,
                tag: undefined,
                conversationTagChanged: undefined,
                typingState: undefined,
                pullFinished: undefined
            };
            this._typingInternalTimer = -1;
            this._typingExpireTime = 2 * 1000; // typing过期时间
            this._typingChangedList = []; // 轮询两个节点间userList发生变化的会话（时间戳变化除外）
            this._options = Object.assign({}, options);
            this.appkey = this._options.appkey;
            this.apiVersion = this._options.apiVersion;
            if (this._options.typingExpireTime) {
                if (this._options.typingExpireTime < 2000) {
                    this._typingExpireTime = 2000;
                }
                else if (this._options.typingExpireTime > 6000) {
                    this._typingExpireTime = 6000;
                }
                else {
                    this._typingExpireTime = this._options.typingExpireTime;
                }
            }
            // 过滤无效地址
            this._options.navigators = this._options.navigators.filter(item => /^https?:\/\//.test(item));
            this._options.navigators = this._options.navigators.map(item => item.replace(/\/$/g, ''));
            // 公有云包 && 没有自定义导航时，使用内置导航地址
            if (this._options.navigators.length === 0 && !false) {
                this._options.navigators.push(...PUBLIC_CLOUD_NAVI_URIS);
            }
            // 初始化引擎监听器，监听连接状态变化、消息变化以及聊天室状态变化
            const engineWatcher = {
                status: this._connectionStatusListener.bind(this),
                message: this._messageReceiver.bind(this),
                chatroom: this._chatroomInfoListener.bind(this),
                conversation: this._conversationInfoListener.bind(this),
                expansion: this._expansionInfoListener.bind(this),
                tag: this._tagListener.bind(this),
                conversationTag: this._conversationTagListener.bind(this),
                onRTCDataChange: this._rtcDataChange.bind(this),
                pullFinished: this._pullFinishedLister.bind(this)
            };
            // 初始化引擎
            this._engine = usingCppEngine()
                ? new RCCppEngine(_runtime, engineWatcher, this._options)
                : new JSEngine(_runtime, engineWatcher, this._options);
        }
        static init(runtime, options) {
            logger.setLogLevel(options.logLevel);
            logger.setLogStdout(options.logStdout);
            // indexDBSwitch 为 undefined 时也要初始化 indexDB
            if (options.indexDBSwitch || isUndefined(options.indexDBSwitch)) {
                RCIndexDB.init();
            }
            logger.debug('APIContext.init =>', options.appkey, options.navigators);
            if (this._context) {
                logger.error('Repeat initialize!');
                return this._context;
            }
            logger.warn('RCEngine Commit:', "9eb2824ec0bc60d60044918540ba9b5987b6f1d7");
            this._context = new APIContext(runtime, options);
            logger.__insertLogIntoDatabase();
            return this._context;
        }
        static destroy() {
            if (this._context) {
                this._context._destroy();
                this._context = undefined;
            }
        }
        /**
         * 安装使用插件，并初始化插件实例
         * @param plugin
         * @param options
         */
        install(plugin, options) {
            if (this._pluginInstanseMap[plugin.tag]) {
                logger.warn(`Repeat install plugin: ${plugin.tag}`);
                return this._pluginInstanseMap[plugin.tag];
            }
            const context = plugin.tag === 'RCRTC' ? new RTCPluginContext(this) : new PluginContext(this);
            let pluginClient = null;
            try {
                if (!plugin.verify(this._runtime)) {
                    return null;
                }
                pluginClient = plugin.setup(context, this._runtime, options);
            }
            catch (error) {
                logger.error('install plugin error!\n', error);
            }
            const internalTags = ['RCRTC', 'RCCall'];
            if (internalTags.includes(plugin.tag) && plugin.version && plugin.name) {
                this._versionInfo[plugin.name] = plugin.version;
            }
            pluginClient && this._pluginContextQueue.push(context);
            if (pluginClient) {
                this._pluginInstanseMap[plugin.tag] = pluginClient;
            }
            return pluginClient;
        }
        /**
         * 重定向后，递归调用 connect
         */
        _handleRedirect() {
            return __awaiter(this, void 0, void 0, function* () {
                logger.debug('_handleRedirct', this._token);
                const { code } = yield this.connect(this._token, true);
                if (code !== ErrorCode$1.SUCCESS && this._canRedirectConnect) {
                    setTimeout(() => {
                        this._handleRedirect();
                    }, 5000);
                }
            });
        }
        /**
         * 连接状态变更回调
         * @param message
         */
        _connectionStatusListener(status) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                // 重定向处理
                if (status === ConnectionStatus$1.REDIRECT) {
                    this._canRedirectConnect = true;
                    this._handleRedirect();
                }
                // 当重定向后监听到被禁、被多端、被 server 断开，禁止递归重定向连接
                if (status === ConnectionStatus$1.BLOCKED ||
                    status === ConnectionStatus$1.KICKED_OFFLINE_BY_OTHER_CLIENT ||
                    status === ConnectionStatus$1.DISCONNECT_BY_SERVER) {
                    this._canRedirectConnect = false;
                }
                this._connectionStatus = status;
                // 通知旧版本 RTCLib、CallLib
                ((_a = this._watcher.rtcInnerWatcher) === null || _a === void 0 ? void 0 : _a.status) && this._watcher.rtcInnerWatcher.status(status);
                // 通知插件连接状态变更
                this._pluginContextQueue.forEach(item => {
                    item.onconnectionstatechange && item.onconnectionstatechange(status);
                });
                // 通知应用层连接状态变更
                this._watcher.connectionState && this._watcher.connectionState(status);
            });
        }
        _messageReceiver(message, leftCount, hasMore) {
            var _a;
            /**
             * 为兼容非插件化的 RTCLib、CallLib，需预先将
             * conversationType === 12
             * 或
             * RCRTC:AcceptMsg... 等消息分别分发给 RTCLib\CallLib
             */
            if (message.conversationType === ConversationType$1.RTC_ROOM ||
                Object.prototype.hasOwnProperty.call(CallLibMsgType, message.messageType)) {
                /**
                 * 分发 RTCLib 或 CallLib 消息，如果未找到 RTCLib 或 CallLib 注册的消息监听，
                 * 说明未使用旧版本 RTCLib 或 CallLib，消息要分发到插件钩子
                 */
                if (this._watcher.rtcInnerWatcher && this._watcher.rtcInnerWatcher.message) {
                    this._watcher.rtcInnerWatcher.message(cloneMessage(message));
                    return;
                }
            }
            // 处理typing消息
            if (message.messageType === 'RC:TypSts') {
                this._addTypingInfo(cloneMessage(message));
                if (this._watcher.typingState)
                    return;
            }
            // 处理日志上传消息
            if (message.messageType === MessageType$1.LOG_COMMAND && message.senderUserId === 'rongcloudsystem') {
                const { startTime, endTime, platform, logId, uri, packageName } = message.content;
                const params = {
                    startTime: parseInt(startTime),
                    endTime: parseInt(endTime),
                    platform: platform,
                    logId: logId,
                    uri: uri,
                    packageName: packageName
                };
                (_a = ReportLog.getInstance()) === null || _a === void 0 ? void 0 : _a.reportFullLog(params);
                return;
            }
            // 消息分发至插件，并根据插件响应结果确定是否继续向业务层派发
            if (this._pluginContextQueue.some((item) => {
                // 插件不接收消息
                if (!item.onmessage) {
                    return false;
                }
                try {
                    return item.onmessage(cloneMessage(message));
                }
                catch (err) {
                    logger.error('plugin error =>', err);
                    return false;
                }
            })) {
                return;
            }
            // 最终未被过滤的消息派发给应用层
            this._watcher.message && this._watcher.message(cloneMessage(message), leftCount, hasMore);
        }
        /**
         * 聊天室相关信息监听
        */
        _chatroomInfoListener(info) {
            this._watcher.chatroomState && this._watcher.chatroomState(info);
        }
        /**
         * 会话监听相关
        */
        _conversationInfoListener(info) {
            this._watcher.conversationState && this._watcher.conversationState(info);
        }
        /**
         * 消息扩展监听相关
        */
        _expansionInfoListener(info) {
            this._watcher.expansion && this._watcher.expansion(info);
        }
        /**
         * 标签增删改监听
         */
        _tagListener() {
            this._watcher.tag && this._watcher.tag();
        }
        /**
         * 会话标签状态监听
         */
        _conversationTagListener() {
            this._watcher.conversationTagChanged && this._watcher.conversationTagChanged();
        }
        _typingStatusListener(info) {
            this._watcher.typingState && this._watcher.typingState(info);
        }
        _pullFinishedLister() {
            this._watcher.pullFinished && this._watcher.pullFinished();
        }
        /**
         * rtc 数据变更通知 pluginContext
         */
        _rtcDataChange(data, roomId) {
            // 消息分发至插件
            this._pluginContextQueue.forEach((plugin) => {
                plugin.onrtcdatachange && plugin.onrtcdatachange(data, roomId);
            });
        }
        /**
         * 添加事件监听
         * @param options
         */
        assignWatcher(watcher) {
            // 只取有效的四个 key，避免引用透传造成内存泄露
            Object.keys(this._watcher).forEach((key) => {
                if (Object.prototype.hasOwnProperty.call(watcher, key)) {
                    const value = watcher[key];
                    this._watcher[key] = isFunction(value) || isObject(value) ? value : undefined;
                }
            });
        }
        /**
         * 向内存中添加 typing 信息
         * 添加 typing 时不触发通知，只有在轮询时间点校验 _typingChangedList 的长度大于 0 时才通知
         */
        _addTypingInfo(message) {
            const { senderUserId, conversationType, targetId, content, channelId } = message;
            const { typingContentType } = content;
            const _channelId = channelId || '';
            const key = `${conversationType}#${targetId}#${_channelId}`;
            if (!this._typingInfo[key]) {
                this._typingInfo[key] = [];
            }
            const index = this._typingInfo[key].findIndex((user) => {
                return user.userId === senderUserId;
            });
            // 判断当前会话的 typing 列表中是否有该发送者并且类型相同，如果有则更新时间，如果没有则加入
            if (index >= 0 && this._typingInfo[key][index].messageType === typingContentType) {
                this._typingInfo[key][index].timestamp = Date.now();
                return;
            }
            if (index >= 0) {
                this._typingInfo[key].splice(index, 1);
            }
            this._typingInfo[key].push({
                userId: senderUserId,
                messageType: typingContentType,
                timestamp: Date.now()
            });
            if (!this._typingChangedList.includes(key)) {
                this._typingChangedList.push(key);
            }
            this._startCheckTypingInfo();
        }
        /**
         * 启动定时移除typing
         */
        _startCheckTypingInfo() {
            if (this._typingInternalTimer !== -1 || Object.keys(this._typingInfo).length === 0) {
                return;
            }
            this._typingInternalTimer = setInterval(() => {
                for (const key in this._typingInfo) {
                    const oldCount = this._typingInfo[key].length;
                    // 筛选出未超时的数据
                    this._typingInfo[key] = this._typingInfo[key].filter((item) => Date.now() - item.timestamp < this._typingExpireTime);
                    if (this._typingInfo[key].length !== oldCount && !this._typingChangedList.includes(key)) {
                        this._typingChangedList.push(key);
                    }
                    if (this._typingInfo[key].length === 0) {
                        delete this._typingInfo[key];
                    }
                }
                // 给业务层发通知
                if (this._typingChangedList.length > 0) {
                    const list = this._typingChangedList.map((key) => {
                        return {
                            conversationType: Number(key.split('#')[0]),
                            targetId: key.split('#')[1],
                            channelId: key.split('#')[2],
                            list: this._typingInfo[key] || []
                        };
                    });
                    this._typingStatusListener(list);
                    this._typingChangedList = [];
                }
                if (Object.keys(this._typingInfo).length === 0) {
                    clearInterval(this._typingInternalTimer);
                    this._typingInternalTimer = -1;
                }
            }, 500);
        }
        getConnectedTime() {
            return this._engine.getConnectedTime();
        }
        getServerTime() {
            return this._engine.getServerTime();
        }
        getDeviceId() {
            return this._engine.getDeviceId();
        }
        getCurrentUserId() {
            return this._engine.currentUserId;
        }
        getConnectionStatus() {
            return this._connectionStatus;
        }
        /**
         * 建立连接，连接失败则抛出异常，连接成功后返回用户 userId，否则返回相应的错误码
         * @param token
         * @param refreshNavi 是否需要重新请求导航，当值为 `false` 时，优先使用有效缓存导航，若缓存失效则重新获取导航
         */
        connect(token, refreshNavi = false) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this._connectionStatus === ConnectionStatus$1.CONNECTED) {
                    return { code: ErrorCode$1.SUCCESS, userId: this._engine.currentUserId };
                }
                if (this._connectionStatus === ConnectionStatus$1.CONNECTING) {
                    return { code: ErrorCode$1.BIZ_ERROR_CONNECTING };
                }
                if (typeof token !== 'string' || token.length === 0) {
                    return { code: ErrorCode$1.RC_CONN_USER_OR_PASSWD_ERROR };
                }
                this._token = token;
                // 根据 token 解析动态导航，优先从动态导航获取数据
                const [, tmpArr] = token.split('@');
                const dynamicUris = tmpArr
                    ? tmpArr.split(';').map(item => /^https?:/.test(item) ? item : `https://${item}`)
                    : [];
                // 获取导航数据
                const naviInfo = yield this._engine.navi.getInfo(this._getTokenWithoutNavi(), dynamicUris, refreshNavi, this._options.checkCA);
                if (!naviInfo) {
                    return { code: ErrorCode$1.RC_NAVI_RESOURCE_ERROR };
                }
                // 公有云 SDK 包不允许连接私有云环境
                if ((naviInfo === null || naviInfo === void 0 ? void 0 : naviInfo.type) === 1) {
                    return { code: ErrorCode$1.PACKAGE_ENVIRONMENT_ERROR };
                }
                // 全部版本信息
                const versionInfo = Object.assign({ engine: this.coreVersion, imlib: this.apiVersion }, this._versionInfo);
                // 开始连接，并监听链接状态变化，状态为 0 则连接成功
                const code = yield this._engine.connect(this._getTokenWithoutNavi(), naviInfo);
                logger.__insertLogIntoDatabase();
                // 重定向
                if (code === ConnectResultCode.REDIRECT) {
                    this._connectionStatus = ConnectionStatus$1.REDIRECT;
                    return yield this.connect(token, true);
                }
                if (code === ErrorCode$1.SUCCESS) {
                    logger.info(`connect success, userId: ${this._engine.currentUserId}`);
                    // 发送版本号
                    (naviInfo === null || naviInfo === void 0 ? void 0 : naviInfo.type) !== 1 && this._engine.reportSDKInfo && this._engine.reportSDKInfo(versionInfo);
                    // 初始化日志上报
                    ReportLog.init({
                        runtime: this._runtime,
                        logSwitch: (naviInfo === null || naviInfo === void 0 ? void 0 : naviInfo.logSwitch) || 0,
                        logPolicy: JSON.parse((naviInfo === null || naviInfo === void 0 ? void 0 : naviInfo.logPolicy) || '{}'),
                        appkey: this.appkey,
                        version: this.apiVersion,
                        userId: this._engine.currentUserId
                    });
                    Logger.init(this._engine.currentUserId);
                    this._isInternalConnected = true;
                }
                if (code === ErrorCode$1.SUCCESS && !usingCppEngine()) { // TODO 限制 !isCppMode 防止报错，临时解决方案
                    // 拉取用户级配置
                    naviInfo.openUS === 1 && this._pullUserSettings();
                }
                if (code !== ErrorCode$1.SUCCESS) {
                    this._connectionStatus = ConnectionStatus$1.CONNECTION_CLOSED;
                }
                return { code, userId: this._engine.currentUserId };
            });
        }
        /**
         * 拉取实时配置 web 端需更新 voipCall 字段
         */
        _pullUserSettings() {
            return __awaiter(this, void 0, void 0, function* () {
                // TODO: 持续迭代中，防止 comet 报错
                // const res = await this._engine.pullUserSettings(version)
                // logger.error('TODO：存储配置，需要使用时获取', res)
            });
        }
        disconnect() {
            var _a;
            this._isInternalConnected = false;
            clearInterval(this._typingInternalTimer);
            this._typingInternalTimer = -1;
            (_a = ReportLog.getInstance()) === null || _a === void 0 ? void 0 : _a.distroy();
            // 重置日志模块
            logger.__insertLogIntoDatabase();
            Logger.reset();
            this._engine.disconnect();
            this._pluginContextQueue.forEach(item => {
                if (!item.ondisconnect) {
                    return;
                }
                try {
                    item.ondisconnect();
                }
                catch (err) {
                    logger.error('plugin error =>', err);
                }
            });
            // 为照顾 API 层的 Promise 链式调用，故增加返回 Promise
            return Promise.resolve();
        }
        reconnect() {
            // 调用 reconnect 前需先调用 disconnect
            if (this._isInternalConnected) {
                return Promise.resolve({
                    code: ErrorCode$1.CAN_NOT_RECONNECT
                });
            }
            return this.connect(this._getTokenWithoutNavi());
        }
        // 获取 token 动态导航前的部分
        _getTokenWithoutNavi() {
            return this._token.replace(/@.+$/, '@');
        }
        /**
         * 获取当前缓存的导航数据
         */
        getInfoFromCache() {
            return this._engine.navi.getInfoFromCache(this._getTokenWithoutNavi());
        }
        /**
         * 消息注册
         * @description 消息注册需在应用初始化完成前进行
         * @param objectName 消息类型，如：RC:TxtMsg
         * @param isPersited 是否存储
         * @param isCounted 是否技术
         * @param searchProps 搜索字段，只在搭配协议栈使用时有效
         */
        registerMessageType(objectName, isPersited, isCounted, searchProps = []) {
            this._engine.registerMessageType(objectName, isPersited, isCounted, searchProps);
        }
        /**
         * 发送消息
         * @param conversationType
         * @param targetId
         * @param objectName
         * @param content
         * @param options
         */
        sendMessage(conversationType, targetId, options, onBefore) {
            const naviInfo = this.getInfoFromCache();
            const readReceiptStatus = (naviInfo === null || naviInfo === void 0 ? void 0 : naviInfo.grpRRVer) || 0;
            // 导航已读回执开关为 1 并且是已读响应消息 时返回错误
            if (readReceiptStatus === 1 && options.messageType === MessageType$1.READ_RECEIPT_RESPONSE) {
                return Promise.resolve({ code: ErrorCode$1.READ_RECEIPT_ERROR });
            }
            // 消息 content 需小于 128 KB
            const contentJson = JSON.stringify(options.content);
            if (getByteLength(contentJson) > MAX_MESSAGE_CONTENT_BYTES) {
                return Promise.resolve({ code: ErrorCode$1.RC_MSG_CONTENT_EXCEED_LIMIT });
            }
            return this._engine.sendMessage(conversationType, targetId, options, onBefore);
        }
        /**
         * 发送扩展消息
         * @param messageUId 消息 Id
         * @param keys 需要删除的 key
         * @param expansion 设置的扩展
        */
        sendExpansionMessage(options) {
            return __awaiter(this, void 0, void 0, function* () {
                let { channelId, conversationType, targetId, messageUId, keys, expansion, originExpansion, removeAll, canIncludeExpansion } = options;
                // 校验消息是否支持扩展
                if (!canIncludeExpansion) {
                    return { code: ErrorCode$1.MESSAGE_KV_NOT_SUPPORT };
                }
                let isExceedLimit = false;
                let isIllgalEx = false;
                if (isObject(expansion)) {
                    // 验证扩展总数是否 大于 300
                    originExpansion = originExpansion || {};
                    const exKeysLength = Object.keys(expansion).length;
                    const totalExpansion = Object.assign(originExpansion, expansion);
                    const totalExKeysLength = Object.keys(totalExpansion).length;
                    isExceedLimit = totalExKeysLength > 300 || exKeysLength > 20;
                    // 验证 expansion key value 是否合法
                    for (const key in expansion) {
                        const val = expansion[key];
                        isExceedLimit = key.length > 32 || val.length > 64;
                        isIllgalEx = !/^[A-Za-z0-9_=+-]+$/.test(key);
                    }
                }
                if (isExceedLimit) {
                    return { code: ErrorCode$1.EXPANSION_LIMIT_EXCEET };
                }
                if (isIllgalEx) {
                    return { code: ErrorCode$1.BIZ_ERROR_INVALID_PARAMETER };
                }
                const content = {
                    mid: messageUId
                };
                expansion && (content.put = expansion);
                keys && (content.del = keys);
                removeAll && (content.removeAll = 1);
                // RC:MsgExMsg 类型消息需使用单群聊消息信令：ppMsgP、pgMsgP（ Server 端处理不存到历史消息云存储）
                const { code } = yield this._engine.sendMessage(conversationType, targetId, {
                    content,
                    messageType: MessageType$1.EXPANSION_NOTIFY,
                    channelId
                });
                return { code };
            });
        }
        /**
         * 发送群组消息已读回执
         * 导航下发已读回执开关为 true 时调用
         * @param targetId 群组会话id
         * @param messageUIds 消息id
         */
        sendReadReceiptMessage(targetId, messageUIds, channelId) {
            return __awaiter(this, void 0, void 0, function* () {
                const naviInfo = this.getInfoFromCache();
                const readReceiptStatus = (naviInfo === null || naviInfo === void 0 ? void 0 : naviInfo.grpRRVer) || 0;
                // 已读回执开关为 0 时返回错误
                if (readReceiptStatus === 0) {
                    return {
                        code: ErrorCode$1.READ_RECEIPT_ERROR,
                        data: 'The read receipt switch is not on, please call the sendMessage method!'
                    };
                }
                return this._engine.sendReadReceiptMessage(targetId, messageUIds, channelId);
            });
        }
        /**
         * 获取群组消息已读列表
         * @param targetId
         * @param messageUIds
         */
        getMessageReader(targetId, messageUId, channelId) {
            return __awaiter(this, void 0, void 0, function* () {
                const naviInfo = this.getInfoFromCache();
                const readReceiptStatus = (naviInfo === null || naviInfo === void 0 ? void 0 : naviInfo.grpRRVer) || 0;
                // 已读回执开关为 0 时返回错误
                if (readReceiptStatus === 0) {
                    return {
                        code: ErrorCode$1.READ_RECEIPT_ERROR
                    };
                }
                return this._engine.getMessageReader(targetId, messageUId, channelId);
            });
        }
        /**
         * 反初始化，清空所有监听及计时器
         */
        _destroy() {
            var _a;
            this._isInternalConnected = false;
            // _watcher 不能直接重置为 {}, 因为添加监听是需要里边有 key
            this._watcher = {
                message: undefined,
                conversationState: undefined,
                chatroomState: undefined,
                connectionState: undefined,
                rtcInnerWatcher: undefined,
                expansion: undefined,
                tag: undefined,
                conversationTagChanged: undefined,
                typingState: undefined,
                pullFinished: undefined
            };
            this._engine.disconnect();
            this._pluginContextQueue.forEach(item => {
                if (!item.ondestroy) {
                    return;
                }
                try {
                    item.ondestroy();
                }
                catch (err) {
                    logger.error('plugin error =>', err);
                }
            });
            this._pluginContextQueue.length = 0;
            this._pluginInstanseMap = {};
            (_a = ReportLog.getInstance()) === null || _a === void 0 ? void 0 : _a.distroy();
            // 重置日志模块
            Logger.reset();
        }
        /**
         * @param conversationType
         * @param targetId 会话 Id
         * @param timestamp 拉取时间戳
         * @param count 拉取条数
         * @param order 1 正序拉取，0 为倒序拉取
         * @param channelId
         * @param objectName
         */
        getHistoryMessage(conversationType, targetId, timestamp = 0, count = 20, order = 0, channelId = '', objectName = '') {
            return this._engine.getHistoryMessage(conversationType, targetId, timestamp, count, order, channelId, objectName || '');
        }
        /**
         * 获取会话列表
         * @param count 指定获取数量, 不传则获取全部会话列表，默认 `300`
         */
        getConversationList(count = 300, conversationType, startTime, order, channelId = '') {
            return this._engine.getConversationList(count, conversationType, startTime, order, channelId);
        }
        /**
         * 获取单一会话数据
         * @param conversationType
         * @param targetId
         * @param channelId
         */
        getConversation(conversationType, targetId, channelId) {
            return this._engine.getConversation(conversationType, targetId, channelId);
        }
        /**
         * 删除会话
         */
        removeConversation(conversationType, targetId, channelId = '') {
            return this._engine.removeConversation(conversationType, targetId, channelId);
        }
        /**
         * 清除会话消息未读数
         */
        clearUnreadCount(conversationType, targetId, channelId = '') {
            return this._engine.clearConversationUnreadCount(conversationType, targetId, channelId);
        }
        /**
         * 获取指定会话消息未读数
         */
        getUnreadCount(conversationType, targetId, channelId = '') {
            return this._engine.getConversationUnreadCount(conversationType, targetId, channelId);
        }
        /**
         * 获取所有会话未读数
         * @param channelId 多组织 Id
         * @param conversationTypes
         * @param includeMuted 包含已设置免打扰的会话
         */
        getTotalUnreadCount(channelId, conversationTypes, includeMuted) {
            return this._engine.getAllConversationUnreadCount(channelId, conversationTypes && conversationTypes.length > 0 ? conversationTypes : [ConversationType$1.PRIVATE, ConversationType$1.GROUP, ConversationType$1.SYSTEM, ConversationType$1.PUBLIC_SERVICE], !!includeMuted);
        }
        /**
         * 获取第一个未读消息
         */
        getFirstUnreadMessage(conversationType, targetId, channelId = '') {
            return this._engine.getFirstUnreadMessage(conversationType, targetId, channelId);
        }
        setConversationStatus(conversationType, targetId, isTop, notificationStatus, channelId = '') {
            const statusList = [{ conversationType, targetId, isTop, notificationStatus, channelId }];
            return this._engine.batchSetConversationStatus(statusList);
        }
        saveConversationMessageDraft(conversationType, targetId, draft) {
            return this._engine.saveConversationMessageDraft(conversationType, targetId, draft);
        }
        getConversationMessageDraft(conversationType, targetId) {
            return this._engine.getConversationMessageDraft(conversationType, targetId);
        }
        clearConversationMessageDraft(conversationType, targetId) {
            return this._engine.clearConversationMessageDraft(conversationType, targetId);
        }
        recallMessage(conversationType, targetId, messageUId, sentTime, recallMsgOptions) {
            return this._engine.recallMsg(conversationType, targetId, messageUId, sentTime, recallMsgOptions);
        }
        /**
         * 删除远端消息
         * @param conversationType
         * @param targetId
         * @param list
         */
        deleteRemoteMessage(conversationType, targetId, list, channelId = '') {
            return this._engine.deleteRemoteMessage(conversationType, targetId, list, channelId);
        }
        /**
         * 根据时间戳删除指定时间之前的
         * @param conversationType
         * @param targetId
         * @param timestamp
         */
        deleteRemoteMessageByTimestamp(conversationType, targetId, timestamp, channelId = '') {
            return this._engine.deleteRemoteMessageByTimestamp(conversationType, targetId, timestamp, channelId);
        }
        /**
         * 加入聊天室，若聊天室不存在则创建聊天室
         * @param roomId 聊天室房间 Id
         * @param count 进入聊天室成功后，自动拉取的历史消息数量，默认值为 `10`，最大有效值为 `50`，`-1` 为不拉取
         */
        joinChatroom(roomId, count = 10) {
            return this._engine.joinChatroom(roomId, count);
        }
        /**
         * 加入聊天室，若聊天室不存在则抛出异常
         * @param roomId 聊天室房间 Id
         * @param count 进入聊天室成功后，自动拉取的历史消息数量，默认值为 `10`，最大有效值为 `50`，`-1` 为不拉取
         */
        joinExistChatroom(roomId, count = 10) {
            return this._engine.joinExistChatroom(roomId, count);
        }
        /**
         * 退出聊天室
         * @param roomId
         */
        quitChatroom(roomId) {
            return this._engine.quitChatroom(roomId);
        }
        /**
         * 获取聊天室房间数据
         * @description count 或 order 有一个为 0 时，只返回成员总数，不返回成员列表信息
         * @param roomId 聊天室 Id
         * @param count 获取房间人员列表数量，最大有效值 `20`，最小值未 `0`，默认为 0
         * @param order 人员排序方式，`1` 为正序，`2` 为倒序，默认为 0
         */
        getChatroomInfo(roomId, count = 0, order = 0) {
            return this._engine.getChatroomInfo(roomId, count, order);
        }
        /**
         * 在指定聊天室中设置自定义属性
         * @description 仅聊天室中不存在此属性或属性设置者为己方时可设置成功
         * @param roomId 聊天室房间 id
         * @param entry 属性信息
         */
        setChatroomEntry(roomId, entry) {
            const { key, value } = entry;
            if (!isValidChrmEntryKey(key) || !isValidChrmEntryValue(value)) {
                return Promise.resolve(ErrorCode$1.BIZ_ERROR_INVALID_PARAMETER);
            }
            return this._engine.setChatroomEntry(roomId, entry);
        }
        /**
         * 在指定聊天室中强制增加 / 修改任意聊天室属性
         * @description 仅聊天室中不存在此属性或属性设置者为己方时可设置成功
         * @param roomId 聊天室房间 id
         * @param entry 属性信息
         */
        forceSetChatroomEntry(roomId, entry) {
            const { key, value } = entry;
            if (!isValidChrmEntryKey(key) || !isValidChrmEntryValue(value)) {
                return Promise.resolve(ErrorCode$1.BIZ_ERROR_INVALID_PARAMETER);
            }
            return this._engine.forceSetChatroomEntry(roomId, entry);
        }
        /**
         * 删除聊天室属性
         * @description 该方法仅限于删除自己设置的聊天室属性
         * @param roomId 聊天室房间 id
         * @param entry 要移除的属性信息
         */
        removeChatroomEntry(roomId, entry) {
            const { key } = entry;
            if (!isValidChrmEntryKey(key)) {
                return Promise.resolve(ErrorCode$1.BIZ_ERROR_INVALID_PARAMETER);
            }
            return this._engine.removeChatroomEntry(roomId, entry);
        }
        /**
         * 强制删除任意聊天室属性
         * @description 该方法仅限于删除自己设置的聊天室属性
         * @param roomId 聊天室房间 id
         * @param entry 要移除的属性信息
         */
        forceRemoveChatroomEntry(roomId, entry) {
            const { key } = entry;
            if (!isValidChrmEntryKey(key)) {
                return Promise.resolve(ErrorCode$1.BIZ_ERROR_INVALID_PARAMETER);
            }
            return this._engine.forceRemoveChatroomEntry(roomId, entry);
        }
        /**
         * 获取聊天室中的指定属性
         * @param roomId 聊天室房间 id
         * @param key 属性键名
         */
        getChatroomEntry(roomId, key) {
            return this._engine.getChatroomEntry(roomId, key);
        }
        /**
         * 获取聊天室内的所有属性
         * @param roomId 聊天室房间 id
         */
        getAllChatroomEntries(roomId) {
            return this._engine.getAllChatroomEntry(roomId);
        }
        /**
         * 拉取聊天室内的历史消息
         * @param roomId
         * @param count 拉取消息条数, 有效值范围 `1 - 20`
         * @param order 获取顺序，默认值为 0。
         * * 0：降序，用于获取早于指定时间戳发送的消息
         * * 1：升序，用于获取晚于指定时间戳发送的消息
         * @param timestamp 指定拉取消息用到的时间戳。默认值为 `0`，表示按当前时间拉取
         */
        getChatRoomHistoryMessages(roomId, count = 20, order = 0, timestamp = 0) {
            return this._engine.getChatroomHistoryMessages(roomId, timestamp, count, order);
        }
        /**
         * 获取存储服务鉴权信息
         * @param fileType 文件类型
         * @param fileName 文件名称
         * @param httpMethod STC 分段上传时的必填参数，有效值为 PUT | POST
         * @param queryString STC 分段上传时的查询字符串
         * @description
         * `httpMethod` 与 `queryString` 为 STC S3 分段上传时的专属参数，STC 分段上传包含三个过程：
         * 1. 开始分段前调用，此时 `httpMethod` 值应为 `POST`， `queryString` 值为 `uploads`
         * 2. 上传请求前调用，此时 `httpMethod` 值应为 `PUT`，`queryString` 值为 `partNumber={partamNumer}&uploadId={uploadId}`
         * 3. 上传结束前调用，此时 `httpMethod` 值应为 `POST`，`queryString` 值为 `uploadId={uploadId}`
         * @returns
         */
        getFileToken(fileType, fileName, httpMethod, queryString) {
            return __awaiter(this, void 0, void 0, function* () {
                const naviInfo = this.getInfoFromCache();
                const bos = (naviInfo === null || naviInfo === void 0 ? void 0 : naviInfo.bosAddr) || '';
                const qiniu = (naviInfo === null || naviInfo === void 0 ? void 0 : naviInfo.uploadServer) || '';
                const ossConfig = (naviInfo === null || naviInfo === void 0 ? void 0 : naviInfo.ossConfig) || '';
                const { code, data } = yield this._engine.getFileToken(fileType, fileName, httpMethod, queryString);
                if (code === ErrorCode$1.SUCCESS) {
                    return Promise.resolve(Object.assign(data, { bos, qiniu, ossConfig }));
                }
                return Promise.reject(code);
            });
        }
        /**
         * 获取 七牛、百度、阿里云 上传成功可下载的 URL
         * @param fileType 文件类型
         * @param fileName 文件名
         * @param saveName 下载后的存储文件名
         * @param uploadRes 插件上传返回的结果。降级百度上传后，用户传入返回结果，再把结果里的下载地址返回给用户，保证兼容之前结果获取
         * @param serverType 使用的存储服务标识
        */
        getFileUrl(fileType, fileName, saveName, uploadRes, serverType = UploadMethod$1.QINIU) {
            return __awaiter(this, void 0, void 0, function* () {
                if (uploadRes === null || uploadRes === void 0 ? void 0 : uploadRes.isBosRes) {
                    return Promise.resolve(uploadRes);
                }
                const { code, data } = yield this._engine.getFileUrl(fileType, serverType, fileName, saveName);
                if (code === ErrorCode$1.SUCCESS) {
                    return Promise.resolve(data);
                }
                return Promise.reject(code);
            });
        }
        /**
         * 创建标签
         * @param tag 标签
         */
        createTag(tag) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.createTag(tag);
            });
        }
        /**
         * 删除标签
         * @param tagId 标签id
         */
        removeTag(tagId) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.removeTag(tagId);
            });
        }
        /**
         * 更新标签
         * @param tag 标签
         */
        updateTag(tag) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.updateTag(tag);
            });
        }
        /**
         * 获取标签列表
         */
        getTagList() {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.getTagList();
            });
        }
        /**
         * 添加会话到标签（给多个会话增加标签）
         * @param tagId 标签id
         * @param conversations 要添加的会话列表
         */
        addTagForConversations(tagId, conversations) {
            return __awaiter(this, void 0, void 0, function* () {
                if (conversations.length > 1000) {
                    return Promise.reject(ErrorCode$1.CONVER_OUT_LIMIT_ERROR);
                }
                return this._engine.addTagForConversations(tagId, conversations);
            });
        }
        /**
         * 删除标签中的会话(从多个会话中批量删除指定标签)
         * @param tagId 标签id
         * @param conversations 要删除的会话列表
         */
        removeTagForConversations(tagId, conversations) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.removeTagForConversations(tagId, conversations);
            });
        }
        /**
         * 删除会话中的标签(从单一会话中批量删除标签)
         * @param conversationType 会话类型
         * @param targetId 会话id
         * @param tagIds 要删除的标签列表
         */
        removeTagsForConversation(conversation, tagIds) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.removeTagsForConversation(conversation, tagIds);
            });
        }
        /**
         * 获取标签下的会话列表
         * @param tagId 标签id
         */
        getConversationListByTag(tagId, startTime, count, channelId) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.getConversationListByTag(tagId, startTime, count, channelId);
            });
        }
        /**
         * 获取标签下的未读消息数
         * @param tagId 标签id
         * @param containMuted 是否包含免打扰会话
         */
        getUnreadCountByTag(tagId, containMuted) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.getUnreadCountByTag(tagId, containMuted);
            });
        }
        /**
         * 设置标签中会话置顶
         * @param conversation 会话
         */
        setConversationStatusInTag(tagId, conversation, status) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.setConversationStatusInTag(tagId, conversation, status);
            });
        }
        /**
         * 获取会话里的标签
         * @param conversation
         */
        getTagsForConversation(conversation) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.getTagsForConversation(conversation);
            });
        }
        /* ============================= 以下为 CPP 接口 ================================== */
        /**
         * 调用非标准方法。所谓非标准方法，是为某些特定需求或产品添加，暂未作为标准接口添加至 API 层。
         * 对于未实现的方法，接口响应 Unsupport 错误码
         * @param method 方法名
         * @param args
         */
        callExtra(method, ...args) {
            return this._engine.callExtra(method, ...args);
        }
        /* ============================= 以下为 CPP 接口 ================================== */
        /**
         * 删除所有会话
        */
        clearConversations(conversationTypes, tag) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this._engine.clearConversations(conversationTypes, tag);
            });
        }
        /**
         * 设置用户连接状态监听器
        */
        setUserStatusListener(config, listener) {
            return this._engine.setUserStatusListener(config, (data) => {
                try {
                    listener(data);
                }
                catch (error) {
                    logger.error(error);
                }
            });
        }
        /**
         * 添加用户黑名单
        */
        addToBlacklist(userId) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.addToBlacklist(userId);
            });
        }
        /**
         * 将指定用户移除黑名单
        */
        removeFromBlacklist(userId) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.removeFromBlacklist(userId);
            });
        }
        /**
         * 获取黑名单列表
        */
        getBlacklist() {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.getBlacklist();
            });
        }
        /**
         * 获取指定人员在黑名单中的状态
        */
        getBlacklistStatus(userId) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.getBlacklistStatus(userId);
            });
        }
        /**
         * 向本地插入一条消息，不发送到服务器
        */
        insertMessage(conversationType, targetId, insertOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.insertMessage(conversationType, targetId, insertOptions);
            });
        }
        /**
         * 删除本地消息
        */
        deleteMessages(timestamp) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.deleteMessages(timestamp);
            });
        }
        /**
         * 从本地消息数据库中删除某一会话指定时间之前的消息数据
        */
        deleteMessagesByTimestamp(conversationType, targetId, timestamp, cleanSpace, channelId = '') {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.deleteMessagesByTimestamp(conversationType, targetId, timestamp, cleanSpace, channelId);
            });
        }
        /**
         * 清空会话下历史消息
        */
        clearMessages(conversationType, targetId, channelId = '') {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.clearMessages(conversationType, targetId, channelId);
            });
        }
        /**
         * 获取本地消息
        */
        getMessage(messageId) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.getMessage(messageId);
            });
        }
        /**
         * 设置消息内容
        */
        setMessageContent(messageId, content, messageType) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.setMessageContent(messageId, content, messageType);
            });
        }
        /**
         * 设置消息搜索字段
        */
        setMessageSearchField(messageId, content, searchFiles) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.setMessageSearchField(messageId, content, searchFiles);
            });
        }
        /**
         * 设置消息发送状态
        */
        setMessageSentStatus(messageId, sentStatus) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.setMessageSentStatus(messageId, sentStatus);
            });
        }
        /**
        * 设置消息接收状态
        */
        setMessageReceivedStatus(messageId, receivedStatus) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.setMessageReceivedStatus(messageId, receivedStatus);
            });
        }
        /**
         * 设置当前用户在线状态
        */
        setUserStatus(status) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.setUserStatus(status);
            });
        }
        /**
         * 订阅用户在线状态
        */
        subscribeUserStatus(userIds) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.subscribeUserStatus(userIds);
            });
        }
        /**
         * 获取用户在线状态
        */
        getUserStatus(userId) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.getUserStatus(userId);
            });
        }
        searchConversationByContent(keyword, customMessageTypes = [], channelId = '', conversationTypes) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.searchConversationByContent(keyword, customMessageTypes, channelId, conversationTypes);
            });
        }
        searchMessageByContent(conversationType, targetId, keyword, timestamp, count, total, channelId = '') {
            return __awaiter(this, void 0, void 0, function* () {
                return this._engine.searchMessageByContent(conversationType, targetId, keyword, timestamp, count, total, channelId);
            });
        }
        getUnreadMentionedMessages(conversationType, targetId, channelId = '') {
            return this._engine.getUnreadMentionedMessages(conversationType, targetId, channelId);
        }
        clearUnreadCountByTimestamp(conversationType, targetId, timestamp, channelId = '') {
            return this._engine.clearUnreadCountByTimestamp(conversationType, targetId, timestamp, channelId);
        }
        /**
         * 获取会话免打扰状态
        */
        getConversationNotificationStatus(conversationType, targetId, channelId = '') {
            return this._engine.getConversationNotificationStatus(conversationType, targetId, channelId);
        }
        getRemoteHistoryMessages(conversationType, targetId, timestamp, count, order, channelId) {
            return this._engine.getRemoteHistoryMessages(conversationType, targetId, timestamp, count, order, channelId);
        }
        /* ============================= CPP 接口 END =================================== */
        /* ============================= 以下为 RTC 相关接口 ============================== */
        /**
         * 加入房间
         * @param roomId
         * @param mode 房间模式：直播 or 会议
         * @param mediaType 直播房间模式下的媒体资源类型
         */
        joinRTCRoom(roomId, mode, mediaType, joinType) {
            return this._engine.joinRTCRoom(roomId, mode, mediaType, joinType);
        }
        quitRTCRoom(roomId) {
            return this._engine.quitRTCRoom(roomId);
        }
        rtcPing(roomId, mode, mediaType) {
            return this._engine.rtcPing(roomId, mode, mediaType);
        }
        getRTCRoomInfo(roomId) {
            return this._engine.getRTCRoomInfo(roomId);
        }
        getRTCUserInfoList(roomId) {
            return this._engine.getRTCUserInfoList(roomId);
        }
        getRTCUserInfo(roomId) {
            return this._engine.getRTCUserInfo(roomId);
        }
        setRTCUserInfo(roomId, key, value) {
            return this._engine.setRTCUserInfo(roomId, key, value);
        }
        removeRTCUserInfo(roomId, keys) {
            return this._engine.removeRTCUserInfo(roomId, keys);
        }
        setRTCData(roomId, key, value, isInner, apiType, message) {
            return this._engine.setRTCData(roomId, key, value, isInner, apiType, message);
        }
        setRTCTotalRes(roomId, message, valueInfo, objectName, mcuValInfo = '') {
            return this._engine.setRTCTotalRes(roomId, message, valueInfo, objectName, mcuValInfo);
        }
        setRTCCDNUris(roomId, objectName, CDNUris) {
            return this._engine.setRTCCDNUris(roomId, objectName, CDNUris);
        }
        getRTCData(roomId, keys, isInner, apiType) {
            return this._engine.getRTCData(roomId, keys, isInner, apiType);
        }
        removeRTCData(roomId, keys, isInner, apiType, message) {
            return this._engine.removeRTCData(roomId, keys, isInner, apiType, message);
        }
        setRTCOutData(roomId, rtcData, type, message) {
            return this._engine.setRTCOutData(roomId, rtcData, type, message);
        }
        getRTCOutData(roomId, userIds) {
            return this._engine.getRTCOutData(roomId, userIds);
        }
        getRTCToken(roomId, mode, broadcastType) {
            return this._engine.getRTCToken(roomId, mode, broadcastType);
        }
        // RTC 北极星数据上报
        setRTCState(roomId, report) {
            return this._engine.setRTCState(roomId, report);
        }
        getRTCUserList(roomId) {
            return this._engine.getRTCUserList(roomId);
        }
        /**
         * 直播观众加房间
         */
        joinLivingRoomAsAudience(roomId, mode, broadcastType) {
            return this._engine.joinLivingRoomAsAudience(roomId, mode, broadcastType);
        }
        /**
         * 直播观众退出房间
         */
        quitLivingRoomAsAudience(roomId) {
            return this._engine.quitLivingRoomAsAudience(roomId);
        }
        /**
         * 直播身份切换
         */
        rtcIdentityChange(roomId, changeType, broadcastType) {
            return this._engine.rtcIdentityChange(roomId, changeType, broadcastType);
        }
        /**
         * 获取加入 RTC 房间的用户信息（当前仅能查自己的）
         */
        getRTCJoinedUserInfo(userId) {
            return this._engine.getRTCJoinedUserInfo(userId);
        }
        /**
         * 拉取 RTC 全量 KV
         */
        pullRTCRoomEntry(roomId, timestamp) {
            return this._engine.pullRTCRoomEntry(roomId, timestamp);
        }
    }

    /**
     * 标签相关接口
     */
    exports.TagChangeType = void 0;
    (function (TagChangeType) {
        TagChangeType[TagChangeType["add"] = 1] = "add";
        TagChangeType[TagChangeType["update"] = 2] = "update";
        TagChangeType[TagChangeType["delete"] = 3] = "delete";
    })(exports.TagChangeType || (exports.TagChangeType = {}));
    // export interface ITagChange {
    //   type: TagChangeType,
    //   list: ITagParam[]
    // }
    // export interface IReceivedTag {
    //   tagId: string
    //   name?: string
    //   createdTime?: number
    // }

    /**
     * engine 版本号
     */
    const version = "4.5.0-alpha.1";

    exports.AEngine = AEngine;
    exports.ANavi = ANavi;
    exports.APIContext = APIContext;
    exports.AppStorage = AppStorage;
    exports.CPP_PROTOCAL_MSGTYPE_OPTION = CPP_PROTOCAL_MSGTYPE_OPTION;
    exports.CallLibMsgType = CallLibMsgType;
    exports.ChatroomEntryType = ChatroomEntryType$1;
    exports.CometChannel = CometChannel;
    exports.ConnectResultCode = ConnectResultCode;
    exports.ConnectionStatus = ConnectionStatus$1;
    exports.ConversationType = ConversationType$1;
    exports.DelayTimer = DelayTimer;
    exports.ErrorCode = ErrorCode$1;
    exports.EventEmitter = EventEmitter;
    exports.FileType = FileType$1;
    exports.IM_COMET_PULLMSG_TIMEOUT = IM_COMET_PULLMSG_TIMEOUT;
    exports.IM_PING_INTERVAL_TIME = IM_PING_INTERVAL_TIME;
    exports.IM_PING_MIN_TIMEOUT = IM_PING_MIN_TIMEOUT;
    exports.IM_PING_TIMEOUT = IM_PING_TIMEOUT;
    exports.IM_SIGNAL_TIMEOUT = IM_SIGNAL_TIMEOUT;
    exports.Logger = Logger;
    exports.MAX_MESSAGE_CONTENT_BYTES = MAX_MESSAGE_CONTENT_BYTES;
    exports.MINI_COMET_CONNECT_URIS = MINI_COMET_CONNECT_URIS;
    exports.MINI_SOCKET_CONNECT_URIS = MINI_SOCKET_CONNECT_URIS;
    exports.MentionedType = MentionedType$1;
    exports.MessageDirection = MessageDirection$1;
    exports.MessageType = MessageType$1;
    exports.NAVI_CACHE_DURATION = NAVI_CACHE_DURATION;
    exports.NAVI_REQ_TIMEOUT = NAVI_REQ_TIMEOUT;
    exports.NotificationStatus = NotificationStatus$1;
    exports.PING_REQ_TIMEOUT = PING_REQ_TIMEOUT;
    exports.PUBLIC_CLOUD_NAVI_URIS = PUBLIC_CLOUD_NAVI_URIS;
    exports.PluginContext = PluginContext;
    exports.RCAssertError = RCAssertError;
    exports.RTCPluginContext = RTCPluginContext;
    exports.ReceivedStatus = ReceivedStatus$1;
    exports.SEND_MESSAGE_TYPE_OPTION = SEND_MESSAGE_TYPE_OPTION;
    exports.STATUS_MESSAGE = STATUS_MESSAGE;
    exports.STORAGE_ROOT_KEY = STORAGE_ROOT_KEY;
    exports.UploadMethod = UploadMethod$1;
    exports.WEB_SOCKET_TIMEOUT = WEB_SOCKET_TIMEOUT;
    exports.WebSocketChannel = WebSocketChannel;
    exports.appendUrl = appendUrl;
    exports.assert = assert;
    exports.cloneByJSON = cloneByJSON;
    exports.forEach = forEach;
    exports.formatConnectResponseCode = formatConnectResponseCode;
    exports.getBrowser = getBrowser;
    exports.getMimeKey = getMimeKey;
    exports.getUploadFileName = getUploadFileName;
    exports.indexOf = indexOf;
    exports.isArray = isArray;
    exports.isArrayBuffer = isArrayBuffer;
    exports.isBoolean = isBoolean;
    exports.isFunction = isFunction;
    exports.isHttpUrl = isHttpUrl;
    exports.isInObject = isInObject;
    exports.isInclude = isInclude;
    exports.isNull = isNull;
    exports.isNumber = isNumber;
    exports.isObject = isObject;
    exports.isString = isString;
    exports.isUndefined = isUndefined;
    exports.isValidChrmEntryKey = isValidChrmEntryKey;
    exports.isValidChrmEntryValue = isValidChrmEntryValue;
    exports.isValidConversationType = isValidConversationType;
    exports.isValidFileType = isValidFileType;
    exports.map = map;
    exports.notEmptyArray = notEmptyArray;
    exports.notEmptyObject = notEmptyObject;
    exports.notEmptyString = notEmptyString;
    exports.pushConfigsToJSON = pushConfigsToJSON;
    exports.pushJSONToConfigs = pushJSONToConfigs;
    exports.todo = todo;
    exports.usingCppEngine = usingCppEngine;
    exports.validate = validate;
    exports.version = version;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("@rongcloud/engine")):"function"==typeof define&&define.amd?define(["exports","@rongcloud/engine"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).RongIMLib={},e.RCEngine)}(this,(function(e,t){"use strict";function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function n(e,t,r,n,o,i,s){try{var a=e[i](s),u=a.value}catch(e){return void r(e)}a.done?t(u):Promise.resolve(u).then(n,o)}function o(e){return function(){var t=this,r=arguments;return new Promise((function(o,i){var s=e.apply(t,r);function a(e){n(s,o,i,a,u,"next",e)}function u(e){n(s,o,i,a,u,"throw",e)}a(void 0)}))}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function a(e,t,r){return t&&s(e.prototype,t),r&&s(e,r),e}function u(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function f(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){u(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function d(e){return function(e){if(Array.isArray(e))return l(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||p(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function p(e,t){if(e){if("string"==typeof e)return l(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?l(e,t):void 0}}function l(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function h(e,t){var r;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(r=p(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,o=function(){};return{s:o,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,s=!0,a=!1;return{s:function(){r=e[Symbol.iterator]()},n:function(){var e=r.next();return s=e.done,e},e:function(e){a=!0,i=e},f:function(){try{s||null==r.return||r.return()}finally{if(a)throw i}}}}var g="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function m(e){var t={exports:{}};return e(t,t.exports),t.exports}m((function(e){var t=function(e){var t,r=Object.prototype,n=r.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",s=o.asyncIterator||"@@asyncIterator",a=o.toStringTag||"@@toStringTag";function u(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{u({},"")}catch(e){u=function(e,t,r){return e[t]=r}}function c(e,t,r,n){var o=t&&t.prototype instanceof m?t:m,i=Object.create(o.prototype),s=new O(n||[]);return i._invoke=function(e,t,r){var n=d;return function(o,i){if(n===l)throw new Error("Generator is already running");if(n===h){if("throw"===o)throw i;return k()}for(r.method=o,r.arg=i;;){var s=r.delegate;if(s){var a=T(s,r);if(a){if(a===g)continue;return a}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===d)throw n=h,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n=l;var u=f(e,t,r);if("normal"===u.type){if(n=r.done?h:p,u.arg===g)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(n=h,r.method="throw",r.arg=u.arg)}}}(e,r,s),i}function f(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}e.wrap=c;var d="suspendedStart",p="suspendedYield",l="executing",h="completed",g={};function m(){}function y(){}function v(){}var S={};S[i]=function(){return this};var C=Object.getPrototypeOf,E=C&&C(C(_([])));E&&E!==r&&n.call(E,i)&&(S=E);var b=v.prototype=m.prototype=Object.create(S);function R(e){["next","throw","return"].forEach((function(t){u(e,t,(function(e){return this._invoke(t,e)}))}))}function I(e,t){function r(o,i,s,a){var u=f(e[o],e,i);if("throw"!==u.type){var c=u.arg,d=c.value;return d&&"object"==typeof d&&n.call(d,"__await")?t.resolve(d.__await).then((function(e){r("next",e,s,a)}),(function(e){r("throw",e,s,a)})):t.resolve(d).then((function(e){c.value=e,s(c)}),(function(e){return r("throw",e,s,a)}))}a(u.arg)}var o;this._invoke=function(e,n){function i(){return new t((function(t,o){r(e,n,t,o)}))}return o=o?o.then(i,i):i()}}function T(e,r){var n=e.iterator[r.method];if(n===t){if(r.delegate=null,"throw"===r.method){if(e.iterator.return&&(r.method="return",r.arg=t,T(e,r),"throw"===r.method))return g;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method")}return g}var o=f(n,e.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,g;var i=o.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function w(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function x(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function O(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(w,this),this.reset(!0)}function _(e){if(e){var r=e[i];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,s=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return s.next=s}}return{next:k}}function k(){return{value:t,done:!0}}return y.prototype=b.constructor=v,v.constructor=y,y.displayName=u(v,a,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===y||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,v):(e.__proto__=v,u(e,a,"GeneratorFunction")),e.prototype=Object.create(b),e},e.awrap=function(e){return{__await:e}},R(I.prototype),I.prototype[s]=function(){return this},e.AsyncIterator=I,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var s=new I(c(t,r,n,o),i);return e.isGeneratorFunction(r)?s:s.next().then((function(e){return e.done?e.value:s.next()}))},R(b),u(b,a,"Generator"),b[i]=function(){return this},b.toString=function(){return"[object Generator]"},e.keys=function(e){var t=[];for(var r in e)t.push(r);return t.reverse(),function r(){for(;t.length;){var n=t.pop();if(n in e)return r.value=n,r.done=!1,r}return r.done=!0,r}},e.values=_,O.prototype={constructor:O,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(x),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return a.type="throw",a.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var s=this.tryEntries[i],a=s.completion;if("root"===s.tryLoc)return o("end");if(s.tryLoc<=this.prev){var u=n.call(s,"catchLoc"),c=n.call(s,"finallyLoc");if(u&&c){if(this.prev<s.catchLoc)return o(s.catchLoc,!0);if(this.prev<s.finallyLoc)return o(s.finallyLoc)}else if(u){if(this.prev<s.catchLoc)return o(s.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<s.finallyLoc)return o(s.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===e||"continue"===e)&&i.tryLoc<=t&&t<=i.finallyLoc&&(i=null);var s=i?i.completion:{};return s.type=e,s.arg=t,i?(this.method="next",this.next=i.finallyLoc,g):this.complete(s)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),g},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),x(r),g}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;x(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:_(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}(e.exports);try{regeneratorRuntime=t}catch(e){Function("r","regeneratorRuntime = r")(t)}}));var y=function(e){return e&&e.Math==Math&&e},v=y("object"==typeof globalThis&&globalThis)||y("object"==typeof window&&window)||y("object"==typeof self&&self)||y("object"==typeof g&&g)||function(){return this}()||Function("return this")(),S=function(e){try{return!!e()}catch(e){return!0}},C=!S((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]})),E={}.propertyIsEnumerable,b=Object.getOwnPropertyDescriptor,R={f:b&&!E.call({1:2},1)?function(e){var t=b(this,e);return!!t&&t.enumerable}:E},I=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}},T={}.toString,w=function(e){return T.call(e).slice(8,-1)},x="".split,O=S((function(){return!Object("z").propertyIsEnumerable(0)}))?function(e){return"String"==w(e)?x.call(e,""):Object(e)}:Object,_=function(e){if(null==e)throw TypeError("Can't call method on "+e);return e},k=function(e){return O(_(e))},M=function(e){return"object"==typeof e?null!==e:"function"==typeof e},N=function(e,t){if(!M(e))return e;var r,n;if(t&&"function"==typeof(r=e.toString)&&!M(n=r.call(e)))return n;if("function"==typeof(r=e.valueOf)&&!M(n=r.call(e)))return n;if(!t&&"function"==typeof(r=e.toString)&&!M(n=r.call(e)))return n;throw TypeError("Can't convert object to primitive value")},A={}.hasOwnProperty,P=function(e,t){return A.call(e,t)},U=v.document,j=M(U)&&M(U.createElement),L=function(e){return j?U.createElement(e):{}},D=!C&&!S((function(){return 7!=Object.defineProperty(L("div"),"a",{get:function(){return 7}}).a})),G=Object.getOwnPropertyDescriptor,B={f:C?G:function(e,t){if(e=k(e),t=N(t,!0),D)try{return G(e,t)}catch(e){}if(P(e,t))return I(!R.f.call(e,t),e[t])}},F=function(e){if(!M(e))throw TypeError(String(e)+" is not an object");return e},V=Object.defineProperty,H={f:C?V:function(e,t,r){if(F(e),t=N(t,!0),F(r),D)try{return V(e,t,r)}catch(e){}if("get"in r||"set"in r)throw TypeError("Accessors not supported");return"value"in r&&(e[t]=r.value),e}},K=C?function(e,t,r){return H.f(e,t,I(1,r))}:function(e,t,r){return e[t]=r,e},q=function(e,t){try{K(v,e,t)}catch(r){v[e]=t}return t},W="__core-js_shared__",Y=v[W]||q(W,{}),X=Function.toString;"function"!=typeof Y.inspectSource&&(Y.inspectSource=function(e){return X.call(e)});var J,Q,z,Z=Y.inspectSource,$=v.WeakMap,ee="function"==typeof $&&/native code/.test(Z($)),te=m((function(e){(e.exports=function(e,t){return Y[e]||(Y[e]=void 0!==t?t:{})})("versions",[]).push({version:"3.9.1",mode:"global",copyright:"© 2021 Denis Pushkarev (zloirock.ru)"})})),re=0,ne=Math.random(),oe=function(e){return"Symbol("+String(void 0===e?"":e)+")_"+(++re+ne).toString(36)},ie=te("keys"),se=function(e){return ie[e]||(ie[e]=oe(e))},ae={},ue=v.WeakMap;if(ee){var ce=Y.state||(Y.state=new ue),fe=ce.get,de=ce.has,pe=ce.set;J=function(e,t){return t.facade=e,pe.call(ce,e,t),t},Q=function(e){return fe.call(ce,e)||{}},z=function(e){return de.call(ce,e)}}else{var le=se("state");ae[le]=!0,J=function(e,t){return t.facade=e,K(e,le,t),t},Q=function(e){return P(e,le)?e[le]:{}},z=function(e){return P(e,le)}}var he,ge,me={set:J,get:Q,has:z,enforce:function(e){return z(e)?Q(e):J(e,{})},getterFor:function(e){return function(t){var r;if(!M(t)||(r=Q(t)).type!==e)throw TypeError("Incompatible receiver, "+e+" required");return r}}},ye=m((function(e){var t=me.get,r=me.enforce,n=String(String).split("String");(e.exports=function(e,t,o,i){var s,a=!!i&&!!i.unsafe,u=!!i&&!!i.enumerable,c=!!i&&!!i.noTargetGet;"function"==typeof o&&("string"!=typeof t||P(o,"name")||K(o,"name",t),(s=r(o)).source||(s.source=n.join("string"==typeof t?t:""))),e!==v?(a?!c&&e[t]&&(u=!0):delete e[t],u?e[t]=o:K(e,t,o)):u?e[t]=o:q(t,o)})(Function.prototype,"toString",(function(){return"function"==typeof this&&t(this).source||Z(this)}))})),ve=v,Se=function(e){return"function"==typeof e?e:void 0},Ce=function(e,t){return arguments.length<2?Se(ve[e])||Se(v[e]):ve[e]&&ve[e][t]||v[e]&&v[e][t]},Ee=Math.ceil,be=Math.floor,Re=function(e){return isNaN(e=+e)?0:(e>0?be:Ee)(e)},Ie=Math.min,Te=function(e){return e>0?Ie(Re(e),9007199254740991):0},we=Math.max,xe=Math.min,Oe=function(e){return function(t,r,n){var o,i=k(t),s=Te(i.length),a=function(e,t){var r=Re(e);return r<0?we(r+t,0):xe(r,t)}(n,s);if(e&&r!=r){for(;s>a;)if((o=i[a++])!=o)return!0}else for(;s>a;a++)if((e||a in i)&&i[a]===r)return e||a||0;return!e&&-1}},_e={includes:Oe(!0),indexOf:Oe(!1)},ke=_e.indexOf,Me=function(e,t){var r,n=k(e),o=0,i=[];for(r in n)!P(ae,r)&&P(n,r)&&i.push(r);for(;t.length>o;)P(n,r=t[o++])&&(~ke(i,r)||i.push(r));return i},Ne=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],Ae=Ne.concat("length","prototype"),Pe={f:Object.getOwnPropertyNames||function(e){return Me(e,Ae)}},Ue={f:Object.getOwnPropertySymbols},je=Ce("Reflect","ownKeys")||function(e){var t=Pe.f(F(e)),r=Ue.f;return r?t.concat(r(e)):t},Le=function(e,t){for(var r=je(t),n=H.f,o=B.f,i=0;i<r.length;i++){var s=r[i];P(e,s)||n(e,s,o(t,s))}},De=/#|\.prototype\./,Ge=function(e,t){var r=Fe[Be(e)];return r==He||r!=Ve&&("function"==typeof t?S(t):!!t)},Be=Ge.normalize=function(e){return String(e).replace(De,".").toLowerCase()},Fe=Ge.data={},Ve=Ge.NATIVE="N",He=Ge.POLYFILL="P",Ke=Ge,qe=B.f,We=function(e,t){var r,n,o,i,s,a=e.target,u=e.global,c=e.stat;if(r=u?v:c?v[a]||q(a,{}):(v[a]||{}).prototype)for(n in t){if(i=t[n],o=e.noTargetGet?(s=qe(r,n))&&s.value:r[n],!Ke(u?n:a+(c?".":"#")+n,e.forced)&&void 0!==o){if(typeof i==typeof o)continue;Le(i,o)}(e.sham||o&&o.sham)&&K(i,"sham",!0),ye(r,n,i,e)}},Ye=function(e){if("function"!=typeof e)throw TypeError(String(e)+" is not a function");return e},Xe=function(e,t,r){if(Ye(e),void 0===t)return e;switch(r){case 0:return function(){return e.call(t)};case 1:return function(r){return e.call(t,r)};case 2:return function(r,n){return e.call(t,r,n)};case 3:return function(r,n,o){return e.call(t,r,n,o)}}return function(){return e.apply(t,arguments)}},Je=function(e){return Object(_(e))},Qe=Array.isArray||function(e){return"Array"==w(e)},ze="process"==w(v.process),Ze=Ce("navigator","userAgent")||"",$e=v.process,et=$e&&$e.versions,rt=et&&et.v8;rt?ge=(he=rt.split("."))[0]+he[1]:Ze&&(!(he=Ze.match(/Edge\/(\d+)/))||he[1]>=74)&&(he=Ze.match(/Chrome\/(\d+)/))&&(ge=he[1]);var nt=ge&&+ge,ot=!!Object.getOwnPropertySymbols&&!S((function(){return!Symbol.sham&&(ze?38===nt:nt>37&&nt<41)})),it=ot&&!Symbol.sham&&"symbol"==typeof Symbol.iterator,st=te("wks"),at=v.Symbol,ut=it?at:at&&at.withoutSetter||oe,ct=function(e){return P(st,e)&&(ot||"string"==typeof st[e])||(ot&&P(at,e)?st[e]=at[e]:st[e]=ut("Symbol."+e)),st[e]},ft=ct("species"),dt=function(e,t){var r;return Qe(e)&&("function"!=typeof(r=e.constructor)||r!==Array&&!Qe(r.prototype)?M(r)&&null===(r=r[ft])&&(r=void 0):r=void 0),new(void 0===r?Array:r)(0===t?0:t)},pt=[].push,lt=function(e){var t=1==e,r=2==e,n=3==e,o=4==e,i=6==e,s=7==e,a=5==e||i;return function(u,c,f,d){for(var p,l,h=Je(u),g=O(h),m=Xe(c,f,3),y=Te(g.length),v=0,S=d||dt,C=t?S(u,y):r||s?S(u,0):void 0;y>v;v++)if((a||v in g)&&(l=m(p=g[v],v,h),e))if(t)C[v]=l;else if(l)switch(e){case 3:return!0;case 5:return p;case 6:return v;case 2:pt.call(C,p)}else switch(e){case 4:return!1;case 7:pt.call(C,p)}return i?-1:n||o?o:C}},ht={forEach:lt(0),map:lt(1),filter:lt(2),some:lt(3),every:lt(4),find:lt(5),findIndex:lt(6),filterOut:lt(7)},gt=ct("species"),mt=function(e){return nt>=51||!S((function(){var t=[];return(t.constructor={})[gt]=function(){return{foo:1}},1!==t[e](Boolean).foo}))},yt=ht.map,vt=mt("map");We({target:"Array",proto:!0,forced:!vt},{map:function(e){return yt(this,e,arguments.length>1?arguments[1]:void 0)}});var St=v.Promise,Ct=H.f,Et=ct("toStringTag"),bt=function(e,t,r){e&&!P(e=r?e:e.prototype,Et)&&Ct(e,Et,{configurable:!0,value:t})},Rt=ct("species"),It={},Tt=ct("iterator"),wt=Array.prototype,xt={};xt[ct("toStringTag")]="z";var Ot="[object z]"===String(xt),_t=ct("toStringTag"),kt="Arguments"==w(function(){return arguments}()),Mt=Ot?w:function(e){var t,r,n;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(r=function(e,t){try{return e[t]}catch(e){}}(t=Object(e),_t))?r:kt?w(t):"Object"==(n=w(t))&&"function"==typeof t.callee?"Arguments":n},Nt=ct("iterator"),At=function(e){var t=e.return;if(void 0!==t)return F(t.call(e)).value},Pt=function(e,t){this.stopped=e,this.result=t},Ut=function(e,t,r){var n,o,i,s,a,u,c,f,d=r&&r.that,p=!(!r||!r.AS_ENTRIES),l=!(!r||!r.IS_ITERATOR),h=!(!r||!r.INTERRUPTED),g=Xe(t,d,1+p+h),m=function(e){return n&&At(n),new Pt(!0,e)},y=function(e){return p?(F(e),h?g(e[0],e[1],m):g(e[0],e[1])):h?g(e,m):g(e)};if(l)n=e;else{if("function"!=typeof(o=function(e){if(null!=e)return e[Nt]||e["@@iterator"]||It[Mt(e)]}(e)))throw TypeError("Target is not iterable");if(void 0!==(f=o)&&(It.Array===f||wt[Tt]===f)){for(i=0,s=Te(e.length);s>i;i++)if((a=y(e[i]))&&a instanceof Pt)return a;return new Pt(!1)}n=o.call(e)}for(u=n.next;!(c=u.call(n)).done;){try{a=y(c.value)}catch(e){throw At(n),e}if("object"==typeof a&&a&&a instanceof Pt)return a}return new Pt(!1)},jt=ct("iterator"),Lt=!1;try{var Dt=0,Gt={next:function(){return{done:!!Dt++}},return:function(){Lt=!0}};Gt[jt]=function(){return this},Array.from(Gt,(function(){throw 2}))}catch(e){}var Bt,Ft,Vt,Ht=ct("species"),Kt=Ce("document","documentElement"),qt=/(iphone|ipod|ipad).*applewebkit/i.test(Ze),Wt=v.location,Yt=v.setImmediate,Xt=v.clearImmediate,Jt=v.process,Qt=v.MessageChannel,zt=v.Dispatch,Zt=0,$t={},er="onreadystatechange",tr=function(e){if($t.hasOwnProperty(e)){var t=$t[e];delete $t[e],t()}},rr=function(e){return function(){tr(e)}},nr=function(e){tr(e.data)},or=function(e){v.postMessage(e+"",Wt.protocol+"//"+Wt.host)};Yt&&Xt||(Yt=function(e){for(var t=[],r=1;arguments.length>r;)t.push(arguments[r++]);return $t[++Zt]=function(){("function"==typeof e?e:Function(e)).apply(void 0,t)},Bt(Zt),Zt},Xt=function(e){delete $t[e]},ze?Bt=function(e){Jt.nextTick(rr(e))}:zt&&zt.now?Bt=function(e){zt.now(rr(e))}:Qt&&!qt?(Vt=(Ft=new Qt).port2,Ft.port1.onmessage=nr,Bt=Xe(Vt.postMessage,Vt,1)):v.addEventListener&&"function"==typeof postMessage&&!v.importScripts&&Wt&&"file:"!==Wt.protocol&&!S(or)?(Bt=or,v.addEventListener("message",nr,!1)):Bt=er in L("script")?function(e){Kt.appendChild(L("script")).onreadystatechange=function(){Kt.removeChild(this),tr(e)}}:function(e){setTimeout(rr(e),0)});var ir,sr,ar,ur,cr,fr,dr,pr,lr={set:Yt,clear:Xt},hr=/web0s(?!.*chrome)/i.test(Ze),gr=B.f,mr=lr.set,yr=v.MutationObserver||v.WebKitMutationObserver,vr=v.document,Sr=v.process,Cr=v.Promise,Er=gr(v,"queueMicrotask"),br=Er&&Er.value;br||(ir=function(){var e,t;for(ze&&(e=Sr.domain)&&e.exit();sr;){t=sr.fn,sr=sr.next;try{t()}catch(e){throw sr?ur():ar=void 0,e}}ar=void 0,e&&e.enter()},qt||ze||hr||!yr||!vr?Cr&&Cr.resolve?(dr=Cr.resolve(void 0),pr=dr.then,ur=function(){pr.call(dr,ir)}):ur=ze?function(){Sr.nextTick(ir)}:function(){mr.call(v,ir)}:(cr=!0,fr=vr.createTextNode(""),new yr(ir).observe(fr,{characterData:!0}),ur=function(){fr.data=cr=!cr}));var Rr,Ir,Tr,wr,xr=br||function(e){var t={fn:e,next:void 0};ar&&(ar.next=t),sr||(sr=t,ur()),ar=t},Or=function(e){var t,r;this.promise=new e((function(e,n){if(void 0!==t||void 0!==r)throw TypeError("Bad Promise constructor");t=e,r=n})),this.resolve=Ye(t),this.reject=Ye(r)},_r={f:function(e){return new Or(e)}},kr=function(e,t){if(F(e),M(t)&&t.constructor===e)return t;var r=_r.f(e);return(0,r.resolve)(t),r.promise},Mr=function(e){try{return{error:!1,value:e()}}catch(e){return{error:!0,value:e}}},Nr=lr.set,Ar=ct("species"),Pr="Promise",Ur=me.get,jr=me.set,Lr=me.getterFor(Pr),Dr=St,Gr=v.TypeError,Br=v.document,Fr=v.process,Vr=Ce("fetch"),Hr=_r.f,Kr=Hr,qr=!!(Br&&Br.createEvent&&v.dispatchEvent),Wr="function"==typeof PromiseRejectionEvent,Yr="unhandledrejection",Xr=Ke(Pr,(function(){if(!(Z(Dr)!==String(Dr))){if(66===nt)return!0;if(!ze&&!Wr)return!0}if(nt>=51&&/native code/.test(Dr))return!1;var e=Dr.resolve(1),t=function(e){e((function(){}),(function(){}))};return(e.constructor={})[Ar]=t,!(e.then((function(){}))instanceof t)})),Jr=Xr||!function(e,t){if(!t&&!Lt)return!1;var r=!1;try{var n={};n[jt]=function(){return{next:function(){return{done:r=!0}}}},e(n)}catch(e){}return r}((function(e){Dr.all(e).catch((function(){}))})),Qr=function(e){var t;return!(!M(e)||"function"!=typeof(t=e.then))&&t},zr=function(e,t){if(!e.notified){e.notified=!0;var r=e.reactions;xr((function(){for(var n=e.value,o=1==e.state,i=0;r.length>i;){var s,a,u,c=r[i++],f=o?c.ok:c.fail,d=c.resolve,p=c.reject,l=c.domain;try{f?(o||(2===e.rejection&&tn(e),e.rejection=1),!0===f?s=n:(l&&l.enter(),s=f(n),l&&(l.exit(),u=!0)),s===c.promise?p(Gr("Promise-chain cycle")):(a=Qr(s))?a.call(s,d,p):d(s)):p(n)}catch(e){l&&!u&&l.exit(),p(e)}}e.reactions=[],e.notified=!1,t&&!e.rejection&&$r(e)}))}},Zr=function(e,t,r){var n,o;qr?((n=Br.createEvent("Event")).promise=t,n.reason=r,n.initEvent(e,!1,!0),v.dispatchEvent(n)):n={promise:t,reason:r},!Wr&&(o=v["on"+e])?o(n):e===Yr&&function(e,t){var r=v.console;r&&r.error&&(1===arguments.length?r.error(e):r.error(e,t))}("Unhandled promise rejection",r)},$r=function(e){Nr.call(v,(function(){var t,r=e.facade,n=e.value;if(en(e)&&(t=Mr((function(){ze?Fr.emit("unhandledRejection",n,r):Zr(Yr,r,n)})),e.rejection=ze||en(e)?2:1,t.error))throw t.value}))},en=function(e){return 1!==e.rejection&&!e.parent},tn=function(e){Nr.call(v,(function(){var t=e.facade;ze?Fr.emit("rejectionHandled",t):Zr("rejectionhandled",t,e.value)}))},rn=function(e,t,r){return function(n){e(t,n,r)}},nn=function(e,t,r){e.done||(e.done=!0,r&&(e=r),e.value=t,e.state=2,zr(e,!0))},on=function(e,t,r){if(!e.done){e.done=!0,r&&(e=r);try{if(e.facade===t)throw Gr("Promise can't be resolved itself");var n=Qr(t);n?xr((function(){var r={done:!1};try{n.call(t,rn(on,r,e),rn(nn,r,e))}catch(t){nn(r,t,e)}})):(e.value=t,e.state=1,zr(e,!1))}catch(t){nn({done:!1},t,e)}}};Xr&&(Dr=function(e){!function(e,t,r){if(!(e instanceof t))throw TypeError("Incorrect "+(r?r+" ":"")+"invocation")}(this,Dr,Pr),Ye(e),Rr.call(this);var t=Ur(this);try{e(rn(on,t),rn(nn,t))}catch(e){nn(t,e)}},(Rr=function(e){jr(this,{type:Pr,done:!1,notified:!1,parent:!1,reactions:[],rejection:!1,state:0,value:void 0})}).prototype=function(e,t,r){for(var n in t)ye(e,n,t[n],r);return e}(Dr.prototype,{then:function(e,t){var r,n,o,i=Lr(this),s=Hr((r=Dr,void 0===(o=F(this).constructor)||null==(n=F(o)[Ht])?r:Ye(n)));return s.ok="function"!=typeof e||e,s.fail="function"==typeof t&&t,s.domain=ze?Fr.domain:void 0,i.parent=!0,i.reactions.push(s),0!=i.state&&zr(i,!1),s.promise},catch:function(e){return this.then(void 0,e)}}),Ir=function(){var e=new Rr,t=Ur(e);this.promise=e,this.resolve=rn(on,t),this.reject=rn(nn,t)},_r.f=Hr=function(e){return e===Dr||e===Tr?new Ir(e):Kr(e)},"function"==typeof St&&(wr=St.prototype.then,ye(St.prototype,"then",(function(e,t){var r=this;return new Dr((function(e,t){wr.call(r,e,t)})).then(e,t)}),{unsafe:!0}),"function"==typeof Vr&&We({global:!0,enumerable:!0,forced:!0},{fetch:function(e){return kr(Dr,Vr.apply(v,arguments))}}))),We({global:!0,wrap:!0,forced:Xr},{Promise:Dr}),bt(Dr,Pr,!1),function(e){var t=Ce(e),r=H.f;C&&t&&!t[Rt]&&r(t,Rt,{configurable:!0,get:function(){return this}})}(Pr),Tr=Ce(Pr),We({target:Pr,stat:!0,forced:Xr},{reject:function(e){var t=Hr(this);return t.reject.call(void 0,e),t.promise}}),We({target:Pr,stat:!0,forced:Xr},{resolve:function(e){return kr(this,e)}}),We({target:Pr,stat:!0,forced:Jr},{all:function(e){var t=this,r=Hr(t),n=r.resolve,o=r.reject,i=Mr((function(){var r=Ye(t.resolve),i=[],s=0,a=1;Ut(e,(function(e){var u=s++,c=!1;i.push(void 0),a++,r.call(t,e).then((function(e){c||(c=!0,i[u]=e,--a||n(i))}),o)})),--a||n(i)}));return i.error&&o(i.value),r.promise},race:function(e){var t=this,r=Hr(t),n=r.reject,o=Mr((function(){var o=Ye(t.resolve);Ut(e,(function(e){o.call(t,e).then(r.resolve,n)}))}));return o.error&&n(o.value),r.promise}});var sn=Ot?{}.toString:function(){return"[object "+Mt(this)+"]"};Ot||ye(Object.prototype,"toString",sn,{unsafe:!0});var an=function(e,t,r){var n=N(t);n in e?H.f(e,n,I(0,r)):e[n]=r},un=ct("isConcatSpreadable"),cn=9007199254740991,fn="Maximum allowed index exceeded",dn=nt>=51||!S((function(){var e=[];return e[un]=!1,e.concat()[0]!==e})),pn=mt("concat"),ln=function(e){if(!M(e))return!1;var t=e[un];return void 0!==t?!!t:Qe(e)};We({target:"Array",proto:!0,forced:!dn||!pn},{concat:function(e){var t,r,n,o,i,s=Je(this),a=dt(s,0),u=0;for(t=-1,n=arguments.length;t<n;t++)if(ln(i=-1===t?s:arguments[t])){if(u+(o=Te(i.length))>cn)throw TypeError(fn);for(r=0;r<o;r++,u++)r in i&&an(a,u,i[r])}else{if(u>=cn)throw TypeError(fn);an(a,u++,i)}return a.length=u,a}});var hn=new t.Logger("RCIM"),gn={TIMEOUT:{code:-1,msg:"Network timeout"},SDK_INTERNAL_ERROR:{code:-2,msg:"SDK internal error"},PARAMETER_ERROR:{code:-3,msg:"Please check the parameters, the {param} expected a value of {expect} but received {current}"},REJECTED_BY_BLACKLIST:{code:405,msg:"Blacklisted by the other party"},SEND_TOO_FAST:{code:20604,msg:"Sending messages too quickly"},NOT_IN_GROUP:{code:22406,msg:"Not in group"},FORBIDDEN_IN_GROUP:{code:22408,msg:"Forbbiden from speaking in the group"},NOT_IN_CHATROOM:{code:23406,msg:"Not in chatRoom"},FORBIDDEN_IN_CHATROOM:{code:23408,msg:"Forbbiden from speaking in the chatRoom"},KICKED_FROM_CHATROOM:{code:23409,msg:"Kicked out and forbbiden from joining the chatRoom"},CHATROOM_NOT_EXIST:{code:23410,msg:"ChatRoom does not exist"},CHATROOM_IS_FULL:{code:23411,msg:"ChatRoom members exceeded"},PARAMETER_INVALID_CHATROOM:{code:23412,msg:"Invalid chatRoom parameters"},ROAMING_SERVICE_UNAVAILABLE_CHATROOM:{code:23414,msg:"ChatRoom message roaming service is not open, Please go to the developer to open this service"},RECALLMESSAGE_PARAMETER_INVALID:{code:25101,msg:"Invalid recall message parameter"},ROAMING_SERVICE_UNAVAILABLE_MESSAGE:{code:25102,msg:"Single group chat roaming service is not open, Please go to the developer to open this service"},PUSHSETTING_PARAMETER_INVALID:{code:26001,msg:"Invalid push parameter"},OPERATION_BLOCKED:{code:20605,msg:"Operation is blocked"},OPERATION_NOT_SUPPORT:{code:20606,msg:"Operation is not supported"},MSG_BLOCKED_SENSITIVE_WORD:{code:21501,msg:"The sent message contains sensitive words"},REPLACED_SENSITIVE_WORD:{code:21502,msg:"Sensitive words in the message have been replaced"},NOT_CONNECTED:{code:30001,msg:"Please connect successfully first"},NAVI_REQUEST_ERROR:{code:30007,msg:"Navigation http request failed"},CMP_REQUEST_ERROR:{code:30010,msg:"CMP sniff http request failed"},CONN_APPKEY_FAKE:{code:31002,msg:"Your appkey is fake"},CONN_MINI_SERVICE_NOT_OPEN:{code:31003,msg:"Mini program service is not open, Please go to the developer to open this service"},CONN_ACK_TIMEOUT:{code:31e3,msg:"Connection ACK timeout"},CONN_TOKEN_INCORRECT:{code:31004,msg:"Your token is not valid or expired"},CONN_NOT_AUTHRORIZED:{code:31005,msg:"AppKey and Token do not match"},CONN_REDIRECTED:{code:31006,msg:"Connection redirection"},CONN_APP_BLOCKED_OR_DELETED:{code:31008,msg:"AppKey is banned or deleted"},CONN_USER_BLOCKED:{code:31009,msg:"User blocked"},CONN_DOMAIN_INCORRECT:{code:31012,msg:"Connect domain error, Please check the set security domain"},ROAMING_SERVICE_UNAVAILABLE:{code:33007,msg:"Roaming service cloud is not open, Please go to the developer to open this service"},RC_CONNECTION_EXIST:{code:34001,msg:"Connection already exists"},CHATROOM_KV_EXCEED:{code:23423,msg:"ChatRoom KV setting exceeds maximum"},CHATROOM_KV_OVERWRITE_INVALID:{code:23424,msg:"ChatRoom KV already exists"},CHATROOM_KV_STORE_NOT_OPEN:{code:23426,msg:"ChatRoom KV storage service is not open, Please go to the developer to open this service"},CHATROOM_KEY_NOT_EXIST:{code:23427,msg:"ChatRoom key does not exist"},MSG_KV_NOT_SUPPORT:{code:34008,msg:"The message cannot be extended"},SEND_MESSAGE_KV_FAIL:{code:34009,msg:"Sending RC expansion message fail"},EXPANSION_LIMIT_EXCEET:{code:34010,msg:"The message expansion size is beyond the limit"},ILLGAL_PARAMS:{code:33003,msg:"Incorrect parameters passed in while calling the interface"}},mn={};for(var yn in gn){var vn=gn[yn].code;mn[vn]=yn}function Sn(e){var r=e.conversationType,n=e.messageType,o=e.content,i=e.senderUserId,s=e.targetId,a=e.sentTime,u=e.receivedTime,c=e.messageUId,f=e.messageDirection,d=e.isPersited,p=e.isCounted,l=e.isOffLineMessage,h=e.canIncludeExpansion,g=e.expansion,m=e.receivedStatus,y=e.disableNotification,v=e.isMentioned,S=e.isStatusMessage,C=e.readReceiptInfo;return m||(m=t.ReceivedStatus.UNREAD),{messageType:n,content:o,senderUserId:i,targetId:s,type:r,sentTime:a,receivedTime:u,messageUId:c,messageDirection:f,isPersited:d,isCounted:p,isOffLineMessage:l,isMentioned:v,disableNotification:y,isStatusMessage:S,canIncludeExpansion:h,expansion:g,receivedStatus:m,readReceiptInfo:C}}function Cn(e){var t=e.conversationType,r=e.targetId,n=e.latestMessage,o=e.unreadMessageCount,i=e.hasMentioned,s=e.mentionedInfo,a=e.lastUnreadTime,u=e.notificationStatus,c=e.isTop;return{type:t,targetId:r,latestMessage:n&&Sn(n),unreadMessageCount:o,hasMentioned:i,mentionedInfo:i?{type:null==s?void 0:s.type,userIdList:null==s?void 0:s.userIdList}:void 0,lastUnreadTime:a,notificationStatus:u,isTop:c}}function En(e){t.assert("options.messageType",e.messageType,t.AssertRules.STRING,!0),t.assert("options.content",e.content,(function(e){return t.isObject(e)}),!0),t.assert("options.isPersited",e.isPersited,t.AssertRules.BOOLEAN),t.assert("options.isCounted",e.isCounted,t.AssertRules.BOOLEAN),t.assert("options.pushContent",e.pushContent,t.AssertRules.STRING),t.assert("options.pushData",e.pushData,t.AssertRules.STRING),t.assert("options.isVoipPush",e.isVoipPush,t.AssertRules.BOOLEAN),t.assert("options.isStatusMessage",e.isStatusMessage,t.AssertRules.BOOLEAN),t.assert("options.isMentioned",e.isMentioned,t.AssertRules.BOOLEAN),t.assert("options.mentionedType",e.mentionedType,t.AssertRules.NUMBER),t.assert("options.mentionedUserIdList",e.mentionedUserIdList,(function(e){return t.isArray(e)&&(0===e.length||e.every(t.isString))})),t.assert("options.directionalUserIdList",e.directionalUserIdList,(function(e){return t.isArray(e)&&(0===e.length||e.every(t.isString))})),t.isUndefined(e.isPersited)&&t.isUndefined(e.isCounted)&&t.isUndefined(e.isStatusMessage)||hn.warn("The parameters `isPersited`, `isCounted`, `isStatusMessage` will be deprecated in future releases due to inconsistance of the values on mobile side and web side. Please use `registerMessageType` instead for non-integrated message type.")}var bn={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0},Rn=function(e,t){var r=[][e];return!!r&&S((function(){r.call(null,t||function(){throw 1},1)}))},In=ht.forEach,Tn=Rn("forEach")?[].forEach:function(e){return In(this,e,arguments.length>1?arguments[1]:void 0)};for(var wn in bn){var xn=v[wn],On=xn&&xn.prototype;if(On&&On.forEach!==Tn)try{K(On,"forEach",Tn)}catch(e){On.forEach=Tn}}var _n=[].join,kn=O!=Object,Mn=Rn("join",",");We({target:"Array",proto:!0,forced:kn||!Mn},{join:function(e){return _n.call(k(this),void 0===e?",":e)}});var Nn,An=function(e,t){if(!e)return[];var r=Pn(e),n=jn(r.topConversationList,t),o=jn(r.unToppedConversationList,t);return n.push.apply(n,o),n},Pn=function(e){var r=[],n=[];return t.forEach(e,(function(e){var t=e.hasMentioned,o=e.mentionedInfo;e.hasMentioned=t,e.mentionedInfo=o,e.isTop||!1?r.push(e):n.push(e)})),{topConversationList:r||[],unToppedConversationList:n||[]}},Un=function(e){return e.type+"_"+e.targetId},jn=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return Dn(e,(function(e,r){r=r||{};var n=(e=e||{}).latestMessage||{},o=r.latestMessage||{},i=n.sentTime||0,s=o.sentTime||0;return t?s>=i:s<=i}))},Ln=function(e){var r=e=e||{},n=r.targetId,o=r.type,i=t.ConversationType.PRIVATE,s={messageType:t.MessageType.TextMessage,sentTime:t.DelayTimer.getTime(),content:{content:""},senderUserId:n,targetId:n,type:o};return e.type=o||i,e.targetId=n||"",e.latestMessage=e.latestMessage||s,e},Dn=function(e,t){return function e(t,r,n,o){if(o=o||function(e,t){return e<=t},r<n){for(var i,s=t[n],a=r-1,u=r;u<=n;u++)o(t[u],s)&&(i=t[++a],t[a]=t[u],t[u]=i);e(t,r,a-1,o),e(t,a+1,n,o)}return t}(e,0,e.length-1,t)},Gn=function(e){return!e.type||!e.targetId||!t.isObject(e.latestMessage)||t.isUndefined(e.unreadMessageCount)},Bn=function(e,r,n){var o=(n=n||{}).isAllowNull;for(var i in e=e||{},r=r||{}){var s=r[i];t.isUndefined(s)&&!o||(e[i]=s)}return e},Fn=function(){function e(t,r){i(this,e),this._context=t,this.targetId=r.targetId,this.type=r.type}var r,n,s,u,c,f,d,p,l,g,m,y,v,S,C,E,b,R;return a(e,[{key:"destory",value:(R=o(regeneratorRuntime.mark((function e(){var r,n;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this._context.removeConversation(this.type,this.targetId);case 2:if(r=e.sent,n="type:"+this.type+",targetId:"+this.targetId,hn.debug("destroy conversation ->"+n),r===t.ErrorCode.SUCCESS){e.next=8;break}return hn.warn("destroy conversation fail ->"+r+":"+mn[r]+","+n),e.abrupt("return",Promise.reject({code:r,msg:mn[r]}));case 8:case"end":return e.stop()}}),e,this)}))),function(){return R.apply(this,arguments)})},{key:"read",value:(b=o(regeneratorRuntime.mark((function e(){var r,n;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this._context.clearUnreadCount(this.type,this.targetId);case 2:if(r=e.sent,n="type:"+this.type+",targetId:"+this.targetId,hn.debug("clear unreadMsgNum ->"+n),r===t.ErrorCode.SUCCESS){e.next=8;break}return hn.warn("clear unreadMsgNum fail ->"+r+":"+mn[r]+","+n),e.abrupt("return",Promise.reject({code:r,msg:mn[r]}));case 8:case"end":return e.stop()}}),e,this)}))),function(){return b.apply(this,arguments)})},{key:"getUnreadCount",value:(E=o(regeneratorRuntime.mark((function e(){var r,n,o,i;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this._context.getUnreadCount(this.type,this.targetId);case 2:if(r=e.sent,n=r.code,o=r.data,i="type:"+this.type+",targetId:"+this.targetId,hn.debug("get unreadCount ->"+i),n!==t.ErrorCode.SUCCESS){e.next=9;break}return e.abrupt("return",o);case 9:return hn.warn("get unreadCount fail ->"+n+":"+mn[n]+","+i),e.abrupt("return",Promise.reject({code:n,msg:mn[n]}));case 11:case"end":return e.stop()}}),e,this)}))),function(){return E.apply(this,arguments)})},{key:"send",value:(C=o(regeneratorRuntime.mark((function e(r){var n,o,i,s;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return En(r),Object.prototype.hasOwnProperty.call(r,"isPersited")||(r.isPersited=!0),Object.prototype.hasOwnProperty.call(r,"isCounted")||(r.isCounted=!0),n="type:"+this.type+",targetId:"+this.targetId,hn.debug("send message  ->"+n),e.next=7,this._context.sendMessage(this.type,this.targetId,r);case 7:if(o=e.sent,i=o.code,s=o.data,i!==t.ErrorCode.SUCCESS){e.next=12;break}return e.abrupt("return",Sn(s));case 12:return hn.warn("send message fail ->"+i+":"+mn[i]+","+n),e.abrupt("return",Promise.reject({code:i,msg:mn[i],data:Sn({isMentioned:!!r.isMentioned,content:r.content,messageType:r.messageType,isPersited:r.isPersited||!1,isCounted:r.isCounted||!1,disableNotification:!(null==r||!r.disableNotification),canIncludeExpansion:!(null==r||!r.canIncludeExpansion),expansion:(null==r?void 0:r.expansion)||null,conversationType:this.type,targetId:this.targetId,senderUserId:this._context.getCurrentUserId(),messageUId:"",messageDirection:t.MessageDirection.SEND,isOffLineMessage:!1,sentTime:(null==s?void 0:s.sentTime)||0,receivedTime:0,isStatusMessage:r.isStatusMessage||!1,receivedStatus:t.ReceivedStatus.UNREAD})}));case 14:case"end":return e.stop()}}),e,this)}))),function(e){return C.apply(this,arguments)})},{key:"setStatus",value:(S=o(regeneratorRuntime.mark((function e(r){var n,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.assert("options.notificationStatus",r.notificationStatus,(function(e){return 1===e||2===e})),t.assert("options.isTop",r.isTop,t.AssertRules.BOOLEAN),n="type:"+this.type+",targetId:"+this.targetId,hn.debug("set conversation status ->"+n),e.next=6,this._context.setConversationStatus(this.type,this.targetId,r.isTop,r.notificationStatus);case 6:if((o=e.sent)===t.ErrorCode.SUCCESS){e.next=10;break}return hn.warn("set conversation status fail ->"+o+":"+mn[o]+","+n),e.abrupt("return",Promise.reject({code:o,msg:mn[o]}));case 10:case"end":return e.stop()}}),e,this)}))),function(e){return S.apply(this,arguments)})},{key:"getMessages",value:(v=o(regeneratorRuntime.mark((function e(r){var n,o,i,s,a;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.assert("options.timestamp",r.timestamp,t.AssertRules.NUMBER),t.assert("options.count",r.count,t.AssertRules.NUMBER),t.assert("options.order",r.order,(function(e){return 0===e||1===e})),n="type:"+this.type+",targetId:"+this.targetId,hn.debug("get history message ->"+n),e.next=7,this._context.getHistoryMessage(this.type,this.targetId,null==r?void 0:r.timestamp,null==r?void 0:r.count,null==r?void 0:r.order);case 7:if(o=e.sent,i=o.code,s=o.data,i!==t.ErrorCode.SUCCESS||!s){e.next=13;break}return a=s.list.map((function(e){return Sn(e)})),e.abrupt("return",Promise.resolve({list:a,hasMore:s.hasMore}));case 13:return hn.warn("get history message fail ->"+i+":"+mn[i]+","+n),e.abrupt("return",Promise.reject({code:i,msg:mn[i]}));case 15:case"end":return e.stop()}}),e,this)}))),function(e){return v.apply(this,arguments)})},{key:"recall",value:(y=o(regeneratorRuntime.mark((function e(r){var n,o,i,s,a;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.assert("options.messageUId",r.messageUId,t.AssertRules.STRING,!0),t.assert("options.sentTime",r.sentTime,t.AssertRules.NUMBER,!0),t.assert("options.disableNotification",null==r?void 0:r.disableNotification,t.AssertRules.BOOLEAN),t.assert("options.pushConfig",null==r?void 0:r.pushConfig,t.AssertRules.OBJECT),n={user:r.user,channelId:"",disableNotification:null==r?void 0:r.disableNotification,pushConfig:null==r?void 0:r.pushConfig},o="type:"+this.type+",targetId:"+this.targetId+",messageUId:"+r.messageUId,hn.debug("recall message ->"+o),e.next=9,this._context.recallMessage(this.type,this.targetId,r.messageUId,r.sentTime,n);case 9:if(i=e.sent,s=i.code,a=i.data,s!==t.ErrorCode.SUCCESS||!a){e.next=14;break}return e.abrupt("return",Sn(a));case 14:return hn.warn("recall message fail ->"+s+":"+mn[s]+","+o),e.abrupt("return",Promise.reject({code:s,msg:mn[s]}));case 16:case"end":return e.stop()}}),e,this)}))),function(e){return y.apply(this,arguments)})},{key:"deleteMessages",value:(m=o(regeneratorRuntime.mark((function e(r){var n,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.assert("options",r,(function(e){return t.isArray(e)&&e.length}),!0),r.forEach((function(e){t.assert("options.messageUId",e.messageUId,t.AssertRules.STRING,!0),t.assert("options.sentTime",e.sentTime,t.AssertRules.NUMBER,!0),t.assert("options.messageDirection",e.messageDirection,(function(e){return 1===e||2===e}),!0)})),n="type:"+this.type+",targetId:"+this.targetId,hn.debug("delete messages ->"+n),e.next=6,this._context.deleteRemoteMessage(this.type,this.targetId,r);case 6:if((o=e.sent)===t.ErrorCode.SUCCESS){e.next=10;break}return hn.warn("delete message fail ->"+o+":"+mn[o]+","+n),e.abrupt("return",Promise.reject({code:o,msg:mn[o]}));case 10:case"end":return e.stop()}}),e,this)}))),function(e){return m.apply(this,arguments)})},{key:"clearMessages",value:(g=o(regeneratorRuntime.mark((function e(r){var n,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.assert("options.timestamp",r.timestamp,t.AssertRules.NUMBER,!0),n="type:"+this.type+",targetId:"+this.targetId,hn.debug("clear message ->"+n),e.next=5,this._context.deleteRemoteMessageByTimestamp(this.type,this.targetId,r.timestamp);case 5:if((o=e.sent)===t.ErrorCode.SUCCESS){e.next=9;break}return hn.warn("clear message ->"+o+":"+mn[o]+","+n),e.abrupt("return",Promise.reject({code:o,msg:mn[o]}));case 9:case"end":return e.stop()}}),e,this)}))),function(e){return g.apply(this,arguments)})},{key:"updateMessageExpansion",value:(l=o(regeneratorRuntime.mark((function e(r,n){var o,i,s,a,u,c,f,d;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.assert("expansion",r,t.AssertRules.OBJECT,!0),t.assert("message",n,t.AssertRules.OBJECT,!0),o=n.type,i=n.targetId,s=n.messageUId,a=n.canIncludeExpansion,u=n.expansion,c="type:"+o+",targetId:"+this.targetId+",messageUId:"+s,hn.debug("update message expansion ->"+c),e.next=7,this._context.sendExpansionMessage({conversationType:o,targetId:i,messageUId:s,expansion:r,canIncludeExpansion:a,originExpansion:u,channelId:""});case 7:if(f=e.sent,(d=f.code)===t.ErrorCode.SUCCESS){e.next=12;break}return hn.warn("update message expansion fail ->"+d+":"+mn[d]+","+c),e.abrupt("return",Promise.reject({code:d,msg:mn[d]}));case 12:case"end":return e.stop()}}),e,this)}))),function(e,t){return l.apply(this,arguments)})},{key:"removeMessageExpansion",value:(p=o(regeneratorRuntime.mark((function e(r,n){var o,i,s,a,u,c,f;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.assert("keys",r,t.AssertRules.ARRAY,!0),t.assert("message",n,t.AssertRules.OBJECT,!0),o=n.type,i=n.targetId,s=n.messageUId,a=n.canIncludeExpansion,u="type:"+o+",targetId:"+this.targetId+",messageUId:"+s,hn.debug("remove message expansion ->"+u),e.next=7,this._context.sendExpansionMessage({conversationType:o,targetId:i,messageUId:s,canIncludeExpansion:a,keys:r,channelId:""});case 7:if(c=e.sent,(f=c.code)===t.ErrorCode.SUCCESS){e.next=12;break}return hn.warn("remove message expansion fail ->"+f+":"+mn[f]+","+u),e.abrupt("return",Promise.reject({code:f,msg:mn[f]}));case 12:case"end":return e.stop()}}),e,this)}))),function(e,t){return p.apply(this,arguments)})},{key:"setDraft",value:(d=o(regeneratorRuntime.mark((function e(r){var n,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.assert("draft",r,t.AssertRules.STRING,!0),n="type:"+this.type+",targetId:"+this.targetId,hn.debug("set draft ->"+n),e.next=5,this._context.saveConversationMessageDraft(this.type,this.targetId,r);case 5:if((o=e.sent)!==t.ErrorCode.SUCCESS){e.next=8;break}return e.abrupt("return",Promise.resolve());case 8:hn.warn("set draft fail ->"+o+":"+mn[o]+","+n);case 9:case"end":return e.stop()}}),e,this)}))),function(e){return d.apply(this,arguments)})},{key:"getDraft",value:(f=o(regeneratorRuntime.mark((function e(){var r,n,o,i;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this._context.getConversationMessageDraft(this.type,this.targetId);case 2:if(r=e.sent,n=r.code,o=r.data,i="type:"+this.type+",targetId:"+this.targetId,hn.debug("get draft ->"+i),n!==t.ErrorCode.SUCCESS){e.next=9;break}return e.abrupt("return",Promise.resolve(o));case 9:return hn.warn("get draft fail ->"+n+":"+mn[n]+","+i),e.abrupt("return",Promise.reject({code:n,msg:mn[n]}));case 11:case"end":return e.stop()}}),e,this)}))),function(){return f.apply(this,arguments)})},{key:"deleteDraft",value:(c=o(regeneratorRuntime.mark((function e(){var r,n;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r="type:"+this.type+",targetId:"+this.targetId,hn.debug("delete draft  ->"+r),e.next=4,this._context.clearConversationMessageDraft(this.type,this.targetId);case 4:if((n=e.sent)!==t.ErrorCode.SUCCESS){e.next=7;break}return e.abrupt("return",Promise.resolve());case 7:hn.warn("delete draft fail ->"+n+":"+mn[n]+","+r);case 8:case"end":return e.stop()}}),e,this)}))),function(){return c.apply(this,arguments)})},{key:"sendReadReceiptMessage",value:(u=o(regeneratorRuntime.mark((function e(r){var n,o,i,s,a,u;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t.assert("messageUIds",r,t.AssertRules.ARRAY,!0),n=h(r);try{for(n.s();!(o=n.n()).done;)i=o.value,t.assert("messageUId",i,t.AssertRules.STRING)}catch(e){n.e(e)}finally{n.f()}return s="messageUIds:"+r.join(",")+",targetId:"+this.targetId,hn.debug("send read receipt message ->"+s),e.next=7,this._context.sendReadReceiptMessage(this.targetId,r);case 7:if(a=e.sent,(u=a.code)!==t.ErrorCode.SUCCESS){e.next=11;break}return e.abrupt("return",Promise.resolve());case 11:return hn.warn("send read receipt message fail ->"+u+":"+mn[u]+","+s),e.abrupt("return",Promise.reject(u));case 13:case"end":return e.stop()}}),e,this)}))),function(e){return u.apply(this,arguments)})},{key:"sendTypingStatusMessage",value:(s=o(regeneratorRuntime.mark((function e(r){var n,o,i,s,a;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.assert("typingContentType",r,t.AssertRules.STRING,!0),n="type:"+this.type+",targetId:"+this.targetId,hn.debug("send typing status message ->"+n),o={messageType:"RC:TypSts",content:{typingContentType:r},isStatusMessage:!0,channelId:""},e.next=6,this._context.sendMessage(this.type,this.targetId,o);case 6:if(i=e.sent,s=i.code,a=i.data,s!==t.ErrorCode.SUCCESS){e.next=11;break}return e.abrupt("return",Sn(a));case 11:return hn.warn("send typing status message fail ->"+s+":"+mn[s]+","+n),e.abrupt("return",Promise.reject({code:s,msg:mn[s]}));case 13:case"end":return e.stop()}}),e,this)}))),function(e){return s.apply(this,arguments)})},{key:"getMessageReader",value:(n=o(regeneratorRuntime.mark((function e(r){var n,o,i,s;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.assert("messageUId",r,t.AssertRules.STRING,!0),n="messageUId:"+r+",targetId:"+this.targetId,hn.debug("get message reader ->"+n),e.next=5,this._context.getMessageReader(this.targetId,r);case 5:if(o=e.sent,i=o.code,s=o.data,i!==t.ErrorCode.SUCCESS){e.next=10;break}return e.abrupt("return",Promise.resolve(s));case 10:return hn.warn("get message reader fail ->"+i+":"+mn[i]+","+n),e.abrupt("return",Promise.reject(i));case 12:case"end":return e.stop()}}),e,this)}))),function(e){return n.apply(this,arguments)})},{key:"getInfo",value:(r=o(regeneratorRuntime.mark((function e(){var r,n,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this._context.getConversation(this.type,this.targetId,"");case 2:if(r=e.sent,n=r.code,o=r.data,n!==t.ErrorCode.SUCCESS||!o){e.next=7;break}return e.abrupt("return",Cn(o));case 7:return e.abrupt("return",Promise.reject({code:n,msg:mn[n]}));case 8:case"end":return e.stop()}}),e,this)}))),function(){return r.apply(this,arguments)})}]),e}(),Vn=function(){function e(t){i(this,e),this._context=t}var r,n;return a(e,[{key:"getList",value:(n=o(regeneratorRuntime.mark((function e(r){var n,o,i,s;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return hn.debug("get conversation list ->"),e.next=3,this._context.getConversationList(null==r?void 0:r.count,void 0,null==r?void 0:r.startTime,null==r?void 0:r.order);case 3:if(n=e.sent,o=n.code,i=n.data,o!==t.ErrorCode.SUCCESS||!i){e.next=9;break}return s=i.map((function(e){return Cn(e)})),e.abrupt("return",An(s));case 9:return hn.warn("get conversation list fail ->"+o+":"+mn[o]),e.abrupt("return",Promise.reject({code:o,msg:mn[o]}));case 11:case"end":return e.stop()}}),e,this)}))),function(e){return n.apply(this,arguments)})},{key:"get",value:function(e){return t.assert("options.type",e.type,t.isValidConversationType,!0),new Fn(this._context,e)}},{key:"remove",value:function(e){return t.assert("options.type",e.type,t.isValidConversationType,!0),new Fn(this._context,e).destory()}},{key:"getTotalUnreadCount",value:(r=o(regeneratorRuntime.mark((function e(r,n){var o,i,s,a,u,c;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(hn.debug("get total unread count -> ConversationType:"+JSON.stringify(n)+" includeMuted:"+r),t.assert("includeMuted",r,t.AssertRules.BOOLEAN,!1),t.assert("conversationTypes",n,t.AssertRules.ARRAY,!1),n){o=h(n);try{for(o.s();!(i=o.n()).done;)s=i.value,t.assert("conversationType",s,t.AssertRules.NUMBER)}catch(e){o.e(e)}finally{o.f()}}return e.next=6,this._context.getTotalUnreadCount("",n,r);case 6:if(a=e.sent,u=a.code,c=a.data,u!==t.ErrorCode.SUCCESS){e.next=11;break}return e.abrupt("return",c);case 11:return hn.warn("getTotalUnreadCount fail ->"+u+":"+mn[u]),e.abrupt("return",Promise.reject({code:u,msg:mn[u]}));case 13:case"end":return e.stop()}}),e,this)}))),function(e,t){return r.apply(this,arguments)})},{key:"merge",value:function(e){return!e.conversationList&&hn.warn("Parameter option.conversationList are required!"),function(e){var r=e=e||{},n=r.conversationList,o=r.updatedConversationList;n=n||[];var i=[].concat(d(o=o||[]),d(n)),s={},a=[],u=[];return t.forEach(i,(function(e){if(t.isObject(e)){var r=e,n=r.type,o=r.targetId,i=Un({type:n,targetId:o}),c=s[i]||{},f=t.isUndefined(c.index)?a.length:c.index,d=c.val||{},p=d.updatedItems||{},l=e.updatedItems;e=Bn(e,d),t.forEach(p,(function(t,r){e[r]=t.val})),t.forEach(l,(function(t,r){var n=(p[r]||{}).time||0;t.time>n&&(e[r]=t.val)})),s[i]={index:f,val:e},a[f]=e,Gn(e)&&u.push(f)}})),t.forEach(u,(function(e){var t=a[e];a[e]=Ln(t)})),a=An(a),t.map(a,(function(e){return delete e.updatedItems,e}))}(e)}}]),e}(),Hn=Object.keys||function(e){return Me(e,Ne)},Kn=C?Object.defineProperties:function(e,t){F(e);for(var r,n=Hn(t),o=n.length,i=0;o>i;)H.f(e,r=n[i++],t[r]);return e},qn=se("IE_PROTO"),Wn=function(){},Yn=function(e){return"<script>"+e+"</"+"script>"},Xn=function(){try{Nn=document.domain&&new ActiveXObject("htmlfile")}catch(e){}var e,t;Xn=Nn?function(e){e.write(Yn("")),e.close();var t=e.parentWindow.Object;return e=null,t}(Nn):((t=L("iframe")).style.display="none",Kt.appendChild(t),t.src=String("javascript:"),(e=t.contentWindow.document).open(),e.write(Yn("document.F=Object")),e.close(),e.F);for(var r=Ne.length;r--;)delete Xn.prototype[Ne[r]];return Xn()};ae[qn]=!0;var Jn=Object.create||function(e,t){var r;return null!==e?(Wn.prototype=F(e),r=new Wn,Wn.prototype=null,r[qn]=e):r=Xn(),void 0===t?r:Kn(r,t)},Qn=ct("unscopables"),zn=Array.prototype;null==zn[Qn]&&H.f(zn,Qn,{configurable:!0,value:Jn(null)});var Zn=function(e){zn[Qn][e]=!0},$n=_e.includes;We({target:"Array",proto:!0},{includes:function(e){return $n(this,e,arguments.length>1?arguments[1]:void 0)}}),Zn("includes");var eo,to,ro,no=function(e){t.assert("options.key",e.key,t.AssertRules.STRING,!0),t.assert("options.value",e.value,t.AssertRules.STRING,!0),t.assert("options.isAutoDelete",e.isAutoDelete,t.AssertRules.BOOLEAN),t.assert("options.isSendNotification",e.isSendNotification,t.AssertRules.BOOLEAN),t.assert("options.notificationExtra",e.notificationExtra,t.AssertRules.STRING)},oo=function(e){t.assert("options.key",e.key,t.AssertRules.STRING,!0),t.assert("options.isSendNotification",e.isSendNotification,t.AssertRules.BOOLEAN),t.assert("options.notificationExtra",e.notificationExtra,t.AssertRules.STRING)},io=function(){function e(t,r){i(this,e),this._context=t,this._id=r}var r,n,s,u,c,f,d,p,l,h,g,m,y;return a(e,[{key:"join",value:(y=o(regeneratorRuntime.mark((function e(r){var n,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.assert("options.count",r.count,t.AssertRules.NUMBER,!0),n="id:"+this._id,hn.debug("join chatroom ->"+n),e.next=5,this._context.joinChatroom(this._id,r.count);case 5:if((o=e.sent)===t.ErrorCode.SUCCESS){e.next=9;break}return hn.warn("join chatroom fail ->code+:"+mn[o]+","+n),e.abrupt("return",Promise.reject({code:o,msg:mn[o]}));case 9:case"end":return e.stop()}}),e,this)}))),function(e){return y.apply(this,arguments)})},{key:"joinExist",value:(m=o(regeneratorRuntime.mark((function e(r){var n,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.assert("options.count",r.count,t.AssertRules.NUMBER,!0),n="id:"+this._id,hn.debug("join exist chatroom ->"+n),e.next=5,this._context.joinExistChatroom(this._id,r.count);case 5:if((o=e.sent)===t.ErrorCode.SUCCESS){e.next=9;break}return hn.warn("join exist chatroom fail ->code:"+mn[o]+","+n),e.abrupt("return",Promise.reject({code:o,msg:mn[o]}));case 9:case"end":return e.stop()}}),e,this)}))),function(e){return m.apply(this,arguments)})},{key:"quit",value:(g=o(regeneratorRuntime.mark((function e(){var r,n;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r="id:"+this._id,hn.debug("quit chatroom ->"+r),e.next=4,this._context.quitChatroom(this._id);case 4:if((n=e.sent)===t.ErrorCode.SUCCESS){e.next=8;break}return hn.warn("quit chatroom fail ->code+:"+mn[n]+","+r),e.abrupt("return",Promise.reject({code:n,msg:mn[n]}));case 8:case"end":return e.stop()}}),e,this)}))),function(){return g.apply(this,arguments)})},{key:"getInfo",value:(h=o(regeneratorRuntime.mark((function e(){var r,n,o,i,s,a=arguments;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=a.length>0&&void 0!==a[0]?a[0]:{},t.assert("options.count",r.count,t.AssertRules.NUMBER),t.assert("options.order",r.order,(function(e){return[0,1,2].includes(e)})),n="id:"+this._id,hn.debug("get chatroom info ->"+n),e.next=7,this._context.getChatroomInfo(this._id,r.count,r.order);case 7:if(o=e.sent,i=o.code,s=o.data,i!==t.ErrorCode.SUCCESS||!s){e.next=12;break}return e.abrupt("return",s);case 12:return hn.warn("get chatroom info fail ->code+:"+mn[i]+","+n),e.abrupt("return",Promise.reject({code:i,msg:mn[i]}));case 14:case"end":return e.stop()}}),e,this)}))),function(){return h.apply(this,arguments)})},{key:"setEntry",value:(l=o(regeneratorRuntime.mark((function e(r){var n,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return no(r),n="id:"+this._id,hn.debug("set chatroom entry->"+n),e.next=5,this._context.setChatroomEntry(this._id,r);case 5:if((o=e.sent)===t.ErrorCode.SUCCESS){e.next=9;break}return hn.warn("set chatroom entry fail ->code+:"+mn[o]+","+n),e.abrupt("return",Promise.reject({code:o,msg:mn[o]}));case 9:case"end":return e.stop()}}),e,this)}))),function(e){return l.apply(this,arguments)})},{key:"forceSetEntry",value:(p=o(regeneratorRuntime.mark((function e(r){var n,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return no(r),n="id:"+this._id,hn.debug("force set chatroom entry ->"+n),e.next=5,this._context.forceSetChatroomEntry(this._id,r);case 5:if((o=e.sent)===t.ErrorCode.SUCCESS){e.next=9;break}return hn.warn("force set chatroom entry fail ->code+:"+mn[o]+","+n),e.abrupt("return",Promise.reject({code:o,msg:mn[o]}));case 9:case"end":return e.stop()}}),e,this)}))),function(e){return p.apply(this,arguments)})},{key:"removeEntry",value:(d=o(regeneratorRuntime.mark((function e(r){var n,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return oo(r),n="id:"+this._id,hn.debug("remove chatroom entry->"+n),e.next=5,this._context.removeChatroomEntry(this._id,r);case 5:if((o=e.sent)===t.ErrorCode.SUCCESS){e.next=9;break}return hn.warn("remove chatroom entry fail ->code+:"+mn[o]+","+n),e.abrupt("return",Promise.reject({code:o,msg:mn[o]}));case 9:case"end":return e.stop()}}),e,this)}))),function(e){return d.apply(this,arguments)})},{key:"forceRemoveEntry",value:(f=o(regeneratorRuntime.mark((function e(r){var n,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return oo(r),n="id:"+this._id,hn.debug("force remove chatroom entry ->"+n),e.next=5,this._context.forceRemoveChatroomEntry(this._id,r);case 5:if((o=e.sent)===t.ErrorCode.SUCCESS){e.next=9;break}return hn.warn("force remove chatroom entry fail ->code+:"+mn[o]+","+n),e.abrupt("return",Promise.reject({code:o,msg:mn[o]}));case 9:case"end":return e.stop()}}),e,this)}))),function(e){return f.apply(this,arguments)})},{key:"getEntry",value:(c=o(regeneratorRuntime.mark((function e(r){var n,o,i,s;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.assert("key",r,(function(e){return t.isString(e)&&/[\w+=-]+/.test(e)&&e.length<=128}),!0),n="id:"+this._id,hn.debug("get chatroom entry->"+n),e.next=5,this._context.getChatroomEntry(this._id,r);case 5:if(o=e.sent,i=o.code,s=o.data,i!==t.ErrorCode.SUCCESS||!s){e.next=10;break}return e.abrupt("return",s);case 10:return hn.warn("get chatroom entry fail ->code+:"+mn[i]+","+n),e.abrupt("return",Promise.reject({code:i,msg:mn[i]}));case 12:case"end":return e.stop()}}),e,this)}))),function(e){return c.apply(this,arguments)})},{key:"getAllEntries",value:(u=o(regeneratorRuntime.mark((function e(){var r,n,o,i;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r="id:"+this._id,hn.debug("get all chatroom entries->"+r),e.next=4,this._context.getAllChatroomEntries(this._id);case 4:if(n=e.sent,o=n.code,i=n.data,o!==t.ErrorCode.SUCCESS||!i){e.next=9;break}return e.abrupt("return",i);case 9:return hn.warn("get all chatroom entries fail ->code+:"+mn[o]+","+r),e.abrupt("return",Promise.reject({code:o,msg:mn[o]}));case 11:case"end":return e.stop()}}),e,this)}))),function(){return u.apply(this,arguments)})},{key:"send",value:(s=o(regeneratorRuntime.mark((function e(r){var n,o,i,s;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return En(r),n="id:"+this._id,hn.debug("send chatroom message ->"+n),Object.prototype.hasOwnProperty.call(r,"isPersited")||(r.isPersited=!0),Object.prototype.hasOwnProperty.call(r,"isCounted")||(r.isCounted=!0),e.next=7,this._context.sendMessage(t.ConversationType.CHATROOM,this._id,r);case 7:if(o=e.sent,i=o.code,s=o.data,i!==t.ErrorCode.SUCCESS){e.next=12;break}return e.abrupt("return",Sn(s));case 12:return hn.warn("send chatroom message fail ->code+:"+mn[i]+","+n),e.abrupt("return",Promise.reject({code:i,msg:mn[i]}));case 14:case"end":return e.stop()}}),e,this)}))),function(e){return s.apply(this,arguments)})},{key:"getMessages",value:(n=o(regeneratorRuntime.mark((function e(r){var n,o,i,s,a;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.assert("options.timestamp",r.timestamp,t.AssertRules.NUMBER),t.assert("options.count",r.count,t.AssertRules.NUMBER),t.assert("options.order",r.order,(function(e){return 0===e||1===e})),n="id:"+this._id,hn.debug("get chatroom history message->"+n),e.next=7,this._context.getChatRoomHistoryMessages(this._id,r.count,r.order,r.timestamp);case 7:if(o=e.sent,i=o.code,s=o.data,i!==t.ErrorCode.SUCCESS||!s){e.next=13;break}return a=s.list.map((function(e){return Sn(e)})),e.abrupt("return",{list:a,hasMore:s.hasMore});case 13:return hn.warn("get chatroom history message fail ->code+:"+mn[i]+","+n),e.abrupt("return",Promise.reject({code:i,msg:mn[i]}));case 15:case"end":return e.stop()}}),e,this)}))),function(e){return n.apply(this,arguments)})},{key:"recall",value:(r=o(regeneratorRuntime.mark((function e(r){var n,o,i,s,a;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.assert("options.messageUId",r.messageUId,t.AssertRules.STRING,!0),t.assert("options.sentTime",r.sentTime,t.AssertRules.NUMBER,!0),n="id:"+this._id+",messageUId:"+r.messageUId,hn.debug("chatroom recall->"+n),o=t.ConversationType.CHATROOM,e.next=7,this._context.recallMessage(o,this._id,r.messageUId,r.sentTime,{channelId:"",user:r.user});case 7:if(i=e.sent,s=i.code,a=i.data,s!==t.ErrorCode.SUCCESS||!a){e.next=12;break}return e.abrupt("return",Sn(a));case 12:return hn.warn("chatroom recall fail->code+:"+mn[s]+","+n),e.abrupt("return",Promise.reject({code:s,msg:mn[s]}));case 14:case"end":return e.stop()}}),e,this)}))),function(e){return r.apply(this,arguments)})}]),e}(),so=function(){function e(t){i(this,e),this._context=t}return a(e,[{key:"get",value:function(e){return t.assert("option.id",e.id,t.notEmptyString,!0),new io(this._context,e.id)}}]),e}(),ao=!S((function(){function e(){}return e.prototype.constructor=null,Object.getPrototypeOf(new e)!==e.prototype})),uo=se("IE_PROTO"),co=Object.prototype,fo=ao?Object.getPrototypeOf:function(e){return e=Je(e),P(e,uo)?e[uo]:"function"==typeof e.constructor&&e instanceof e.constructor?e.constructor.prototype:e instanceof Object?co:null},po=ct("iterator"),lo=!1;[].keys&&("next"in(ro=[].keys())?(to=fo(fo(ro)))!==Object.prototype&&(eo=to):lo=!0),(null==eo||S((function(){var e={};return eo[po].call(e)!==e})))&&(eo={}),P(eo,po)||K(eo,po,(function(){return this}));var ho={IteratorPrototype:eo,BUGGY_SAFARI_ITERATORS:lo},go=ho.IteratorPrototype,mo=function(){return this},yo=Object.setPrototypeOf||("__proto__"in{}?function(){var e,t=!1,r={};try{(e=Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set).call(r,[]),t=r instanceof Array}catch(e){}return function(r,n){return F(r),function(e){if(!M(e)&&null!==e)throw TypeError("Can't set "+String(e)+" as a prototype")}(n),t?e.call(r,n):r.__proto__=n,r}}():void 0),vo=ho.IteratorPrototype,So=ho.BUGGY_SAFARI_ITERATORS,Co=ct("iterator"),Eo="keys",bo="values",Ro="entries",Io=function(){return this},To="Array Iterator",wo=me.set,xo=me.getterFor(To),Oo=function(e,t,r,n,o,i,s){!function(e,t,r){var n=t+" Iterator";e.prototype=Jn(go,{next:I(1,r)}),bt(e,n,!1),It[n]=mo}(r,t,n);var a,u,c,f=function(e){if(e===o&&g)return g;if(!So&&e in l)return l[e];switch(e){case Eo:case bo:case Ro:return function(){return new r(this,e)}}return function(){return new r(this)}},d=t+" Iterator",p=!1,l=e.prototype,h=l[Co]||l["@@iterator"]||o&&l[o],g=!So&&h||f(o),m="Array"==t&&l.entries||h;if(m&&(a=fo(m.call(new e)),vo!==Object.prototype&&a.next&&(fo(a)!==vo&&(yo?yo(a,vo):"function"!=typeof a[Co]&&K(a,Co,Io)),bt(a,d,!0))),o==bo&&h&&h.name!==bo&&(p=!0,g=function(){return h.call(this)}),l[Co]!==g&&K(l,Co,g),It[t]=g,o)if(u={values:f(bo),keys:i?g:f(Eo),entries:f(Ro)},s)for(c in u)(So||p||!(c in l))&&ye(l,c,u[c]);else We({target:t,proto:!0,forced:So||p},u);return u}(Array,"Array",(function(e,t){wo(this,{type:To,target:k(e),index:0,kind:t})}),(function(){var e=xo(this),t=e.target,r=e.kind,n=e.index++;return!t||n>=t.length?(e.target=void 0,{value:void 0,done:!0}):"keys"==r?{value:n,done:!1}:"values"==r?{value:t[n],done:!1}:{value:[n,t[n]],done:!1}}),"values");It.Arguments=It.Array,Zn("keys"),Zn("values"),Zn("entries");var _o=ct("iterator"),ko=ct("toStringTag"),Mo=Oo.values;for(var No in bn){var Ao=v[No],Po=Ao&&Ao.prototype;if(Po){if(Po[_o]!==Mo)try{K(Po,_o,Mo)}catch(e){Po[_o]=Mo}if(Po[ko]||K(Po,ko,No),bn[No])for(var Uo in Oo)if(Po[Uo]!==Oo[Uo])try{K(Po,Uo,Oo[Uo])}catch(e){Po[Uo]=Oo[Uo]}}}var jo=function(){function e(t,r){i(this,e),this._options=t,this._context=r,this._roomId=t.id}var r,n,s,u,c,d,p,l,h,g,m,y,v,S,C;return a(e,[{key:"join",value:(C=o(regeneratorRuntime.mark((function e(){var r,n,o,i;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r="roomId:"+this._roomId,hn.debug("join ->"+r),e.next=4,this._context.joinRTCRoom(this._roomId,this._options.mode,this._options.broadcastType);case 4:if(n=e.sent,o=n.code,i=n.data,o!==t.ErrorCode.SUCCESS){e.next=9;break}return e.abrupt("return",i);case 9:return hn.warn("join fail ->"+o+":"+mn[o]+","+r),e.abrupt("return",Promise.reject(o));case 11:case"end":return e.stop()}}),e,this)}))),function(){return C.apply(this,arguments)})},{key:"quit",value:(S=o(regeneratorRuntime.mark((function e(){var r,n;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r="roomId:"+this._roomId,hn.debug("quit ->"+r),e.next=4,this._context.quitRTCRoom(this._roomId);case 4:if((n=e.sent)!==t.ErrorCode.SUCCESS){e.next=7;break}return e.abrupt("return",n);case 7:return hn.warn("quit fail ->"+n+":"+mn[n]+","+r),e.abrupt("return",Promise.reject(n));case 9:case"end":return e.stop()}}),e,this)}))),function(){return S.apply(this,arguments)})},{key:"getRoomInfo",value:(v=o(regeneratorRuntime.mark((function e(){var r,n,o,i;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r="roomId:"+this._roomId,hn.debug("get roomInfo ->"+r),e.next=4,this._context.getRTCRoomInfo(this._roomId);case 4:if(n=e.sent,o=n.code,i=n.data,o!==t.ErrorCode.SUCCESS){e.next=9;break}return e.abrupt("return",i);case 9:return hn.warn("get roomInfo fail ->"+o+":"+mn[o]+","+r),e.abrupt("return",Promise.reject(o));case 11:case"end":return e.stop()}}),e,this)}))),function(){return v.apply(this,arguments)})},{key:"setUserInfo",value:(y=o(regeneratorRuntime.mark((function e(r){var n,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n="roomId:"+this._roomId+",key:"+r.key+",value:"+r.value,hn.debug("set userInfo ->"+n),e.next=4,this._context.setRTCUserInfo(this._roomId,r.key,r.value);case 4:if((o=e.sent)!==t.ErrorCode.SUCCESS){e.next=7;break}return e.abrupt("return",o);case 7:return hn.warn("set userInfo fail ->"+o+":"+mn[o]+","+n),e.abrupt("return",Promise.reject(o));case 9:case"end":return e.stop()}}),e,this)}))),function(e){return y.apply(this,arguments)})},{key:"removeUserInfo",value:(m=o(regeneratorRuntime.mark((function e(r){var n,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n="roomId:"+this._roomId+",keys:"+(r.keys||[]).join(","),hn.debug("remove useerInfo ->"+n),e.next=4,this._context.removeRTCUserInfo(this._roomId,r.keys);case 4:if((o=e.sent)!==t.ErrorCode.SUCCESS){e.next=7;break}return e.abrupt("return",o);case 7:return hn.warn("remove userInfo fail ->"+o+":"+mn[o]+","+n),e.abrupt("return",Promise.reject(o));case 9:case"end":return e.stop()}}),e,this)}))),function(e){return m.apply(this,arguments)})},{key:"setData",value:(g=o(regeneratorRuntime.mark((function e(r,n,o,i,s){var a,u;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a="roomId:"+this._roomId+",key:"+r+",value:"+n,hn.debug("set data ->"+a),e.next=4,this._context.setRTCData(this._roomId,r,n,o,i,s);case 4:if((u=e.sent)!==t.ErrorCode.SUCCESS){e.next=7;break}return e.abrupt("return",u);case 7:return hn.warn("set data fail ->"+u+":"+mn[u]+","+a),e.abrupt("return",Promise.reject(u));case 9:case"end":return e.stop()}}),e,this)}))),function(e,t,r,n,o){return g.apply(this,arguments)})},{key:"setUserData",value:function(e,r,n,o){return this.setData(e,r,n,t.RTCApiType.PERSON,o)}},{key:"setRTCUserData",value:(h=o(regeneratorRuntime.mark((function e(r,n,o){var i,s;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return i="roomId:"+this._roomId,hn.debug("set rtc user ->"+i),e.next=4,this._context.setRTCTotalRes(this._roomId,r,n,o);case 4:if((s=e.sent)!==t.ErrorCode.SUCCESS){e.next=7;break}return e.abrupt("return",s);case 7:return hn.warn("set rtc user fail ->"+s+":"+mn[s]+","+i),e.abrupt("return",Promise.reject(s));case 9:case"end":return e.stop()}}),e,this)}))),function(e,t,r){return h.apply(this,arguments)})},{key:"getData",value:(l=o(regeneratorRuntime.mark((function e(r,n,o){var i,s,a,u;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return i="roomId:"+this._roomId,hn.debug("get data ->"+i),e.next=4,this._context.getRTCData(this._roomId,r,n,o);case 4:if(s=e.sent,a=s.code,u=s.data,a!==t.ErrorCode.SUCCESS){e.next=9;break}return e.abrupt("return",u);case 9:return hn.warn("get data fail ->"+a+":"+mn[a]+","+i),e.abrupt("return",Promise.reject(a));case 11:case"end":return e.stop()}}),e,this)}))),function(e,t,r){return l.apply(this,arguments)})},{key:"getUserData",value:function(e,r){return this.getData(e,r,t.RTCApiType.PERSON)}},{key:"removeData",value:(p=o(regeneratorRuntime.mark((function e(r,n,o,i){var s,a;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return s="roomId:"+this._roomId+",keys:"+r.join(","),hn.debug("remove data ->"+s),e.next=4,this._context.removeRTCData(this._roomId,r,n,o,i);case 4:if((a=e.sent)!==t.ErrorCode.SUCCESS){e.next=7;break}return e.abrupt("return",a);case 7:return hn.warn("remove data fail ->"+a+":"+mn[a]+","+s),e.abrupt("return",Promise.reject(a));case 9:case"end":return e.stop()}}),e,this)}))),function(e,t,r,n){return p.apply(this,arguments)})},{key:"removeUserData",value:function(e,r,n){return this.removeData(e,r,t.RTCApiType.PERSON,n)}},{key:"setRoomData",value:function(e,r,n,o){return this.setData(e,r,n,t.RTCApiType.ROOM,o)}},{key:"getRoomData",value:function(e,r){return this.getData(e,r,t.RTCApiType.ROOM)}},{key:"removeRoomData",value:function(e,r,n){return this.removeData(e,r,t.RTCApiType.ROOM,n)}},{key:"setState",value:(d=o(regeneratorRuntime.mark((function e(r){var n,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n="roomId:"+this._roomId,hn.debug("set state ->"+n),e.next=4,this._context.setRTCState(this._roomId,r.report);case 4:if((o=e.sent)!==t.ErrorCode.SUCCESS){e.next=7;break}return e.abrupt("return",o);case 7:return hn.warn("set state fail ->"+o+":"+mn[o]+","+n),e.abrupt("return",Promise.reject(o));case 9:case"end":return e.stop()}}),e,this)}))),function(e){return d.apply(this,arguments)})},{key:"getUserList",value:(c=o(regeneratorRuntime.mark((function e(){var r,n,o,i;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r="roomId:"+this._roomId,hn.debug("get userList ->"+r),e.next=4,this._context.getRTCUserInfoList(this._roomId);case 4:if(n=e.sent,o=n.code,i=n.data,o!==t.ErrorCode.SUCCESS){e.next=9;break}return e.abrupt("return",i);case 9:return hn.warn("get userList fail ->"+o+":"+mn[o]+","+r),e.abrupt("return",Promise.reject(o));case 11:case"end":return e.stop()}}),e,this)}))),function(){return c.apply(this,arguments)})},{key:"getUserInfoList",value:(u=o(regeneratorRuntime.mark((function e(){var r,n,o,i,s;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r="roomId:"+this._roomId,hn.debug("get userInfo list ->"+r),e.next=4,this._context.getRTCUserInfoList(this._roomId);case 4:if(n=e.sent,o=n.code,i=n.data,o!==t.ErrorCode.SUCCESS){e.next=10;break}return s=null==i?void 0:i.users,e.abrupt("return",s);case 10:return hn.warn("get userInfo list fail ->"+o+":"+mn[o]+","+r),e.abrupt("return",Promise.reject(o));case 12:case"end":return e.stop()}}),e,this)}))),function(){return u.apply(this,arguments)})},{key:"getToken",value:(s=o(regeneratorRuntime.mark((function e(){var r,n,o,i;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r="roomId:"+this._roomId,hn.debug("getToken ->"+r),e.next=4,this._context.getRTCToken(this._roomId,this._options.mode,this._options.broadcastType);case 4:if(n=e.sent,o=n.data,(i=n.code)!==t.ErrorCode.SUCCESS){e.next=9;break}return e.abrupt("return",o);case 9:return hn.warn("getToken fail ->"+i+":"+mn[i]+","+r),e.abrupt("return",Promise.reject(i));case 11:case"end":return e.stop()}}),e,this)}))),function(){return s.apply(this,arguments)})},{key:"ping",value:(n=o(regeneratorRuntime.mark((function e(){var r,n;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r="roomId:"+this._roomId,hn.debug("ping ->"+r),e.next=4,this._context.rtcPing(this._roomId,this._options.mode,this._options.broadcastType);case 4:if((n=e.sent)!==t.ErrorCode.SUCCESS){e.next=7;break}return e.abrupt("return",n);case 7:return hn.warn("ping fail ->"+n+":"+mn[n]+","+r),e.abrupt("return",Promise.reject(n));case 9:case"end":return e.stop()}}),e,this)}))),function(){return n.apply(this,arguments)})},{key:"send",value:(r=o(regeneratorRuntime.mark((function e(r){var n,o,i,s;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n="roomId:"+this._roomId,hn.debug("send ->"+n),e.next=4,this._context.sendMessage(t.ConversationType.RTC_ROOM,this._roomId,{content:f({},r.content),messageType:r.messageType});case 4:if(o=e.sent,i=o.code,s=o.data,i!==t.ErrorCode.SUCCESS){e.next=9;break}return e.abrupt("return",s);case 9:return hn.warn("send fail ->"+i+":"+mn[i]+","+n),e.abrupt("return",Promise.reject(i));case 11:case"end":return e.stop()}}),e,this)}))),function(e){return r.apply(this,arguments)})}]),e}(),Lo=[].slice,Do=/MSIE .\./.test(Ze),Go=function(e){return function(t,r){var n=arguments.length>2,o=n?Lo.call(arguments,2):void 0;return e(n?function(){("function"==typeof t?t:Function(t)).apply(this,o)}:t,r)}};We({global:!0,bind:!0,forced:Do},{setTimeout:Go(v.setTimeout),setInterval:Go(v.setInterval)});var Bo,Fo,Vo=function(){return!("undefined"==typeof uni||!function(e){for(var t=["canIUse","getSystemInfo"],r=0,n=t.length;r<n;r++)if(!e[t[r]])return!1;return!0}(uni))},Ho=Vo();var Ko,qo={tag:"browser",httpReq:function(e){var n=e.method||t.HttpMethod.GET,o=e.timeout||6e4,i=e.headers,s=e.query,a=e.body,u=t.appendUrl(e.url,s);return new Promise((function(e){var t,s=(t="undefined"!=typeof XMLHttpRequest&&"withCredentials"in new XMLHttpRequest,"undefined"!=typeof XMLHttpRequest&&t?new XMLHttpRequest:"undefined"!=typeof XDomainRequest?new XDomainRequest:new ActiveXObject("Microsoft.XMLHTTP")),c="[object XDomainRequest]"===Object.prototype.toString.call(s);if(s.open(n,u),i&&s.setRequestHeader)for(var f in i)s.setRequestHeader(f,i[f]);if(c){s.timeout=o,s.onload=function(){e({data:s.responseText,status:s.status||200})},s.onerror=function(){e({status:s.status||0})},s.ontimeout=function(){e({status:s.status||0})};var d="object"===r(a)?JSON.stringify(a):a;s.send(d)}else s.onreadystatechange=function(){4===s.readyState&&e({data:s.responseText,status:s.status})},s.onerror=function(){e({status:s.status||0})},setTimeout((function(){return e({status:s.status||0})}),o),s.send(a)}))},localStorage:null===(Bo=window)||void 0===Bo?void 0:Bo.localStorage,sessionStorage:null===(Fo=window)||void 0===Fo?void 0:Fo.sessionStorage,isSupportSocket:function(){var e="undefined"!=typeof WebSocket;return e||hn.warn("websocket not support"),e},useNavi:!0,connectPlatform:"",isFromUniapp:Ho,createWebSocket:function(e,t){var r=new WebSocket(e,t);return r.binaryType="arraybuffer",{onClose:function(e){r.onclose=function(t){var r=t.code,n=t.reason;e(r,n)}},onError:function(e){r.onerror=e},onMessage:function(e){r.onmessage=function(t){e(t.data)}},onOpen:function(e){r.onopen=e},send:function(e){r.send(e)},close:function(e,t){r.close(e,t)}}},createDataChannel:function(e,r){return this.isSupportSocket()&&"websocket"===r?new t.WebSocketChannel(this,e):new t.CometChannel(this,e)}},Wo=Vo(),Yo=function(e){return function(){try{var t;return(t=wx)[e].apply(t,arguments)}catch(e){hn.error(e)}}},Xo={setItem:Yo("setStorageSync"),getItem:Yo("getStorageSync"),removeItem:Yo("removeStorageSync"),clear:Yo("clearStorageSync")},Jo={tag:"wechat",httpReq:function(e){var r=e.method||t.HttpMethod.GET,n=e.timeout||6e4,o=e.headers,i=e.query,s=e.body,a=t.appendUrl(e.url,i);return new Promise((function(e){wx.request({url:a,method:r,headers:o,timeout:n,data:s,success:function(t){e({data:t.data,status:t.statusCode})},fail:function(){e({status:t.ErrorCode.RC_HTTP_REQ_TIMEOUT})}})}))},localStorage:Xo,sessionStorage:Xo,isSupportSocket:function(){return!0},useNavi:!1,connectPlatform:"MiniProgram",isFromUniapp:Wo,createWebSocket:function(e,t){var r=wx.connectSocket({url:e,protocols:t});return{onClose:function(e){r.onClose((function(t){e(t.code,t.reason)}))},onError:function(e){r.onError((function(t){e(t.errMsg)}))},onMessage:function(e){r.onMessage((function(t){e(t.data)}))},onOpen:function(e){r.onOpen(e)},send:function(e){r.send({data:e})},close:function(e,t){r.close({code:e,reason:t})}}},createDataChannel:function(e,r){return"websocket"===r?new t.WebSocketChannel(this,e):new t.CometChannel(this,e)}},Qo=Vo(),zo=function(e){return function(){try{var t;return(t=my)[e].apply(t,arguments)}catch(e){hn.error(e)}}},Zo={setItem:zo("setStorageSync"),getItem:zo("getStorageSync"),removeItem:zo("removeStorageSync"),clear:zo("clearStorageSync")},$o={tag:"alipay",httpReq:function(e){var r=e.method||t.HttpMethod.GET,n=e.timeout||6e4,o=e.headers,i=e.query,s=e.body,a=t.appendUrl(e.url,i);return new Promise((function(e){my.request({url:a,method:r,headers:o,timeout:n,data:s,success:function(t){e({data:t.data,status:t.status})},fail:function(){e({status:t.ErrorCode.RC_HTTP_REQ_TIMEOUT})}})}))},localStorage:Zo,sessionStorage:Zo,isSupportSocket:function(){return!1},useNavi:!1,connectPlatform:"MiniProgram",isFromUniapp:Qo,createDataChannel:function(e,r){return"websocket"===r?new t.WebSocketChannel(this,e):new t.CometChannel(this,e)}},ei=Vo(),ti=function(e){return function(){try{var t;return console.log("tt",tt),(t=tt)[e].apply(t,arguments)}catch(e){hn.error(e)}}},ri={setItem:ti("setStorageSync"),getItem:ti("getStorageSync"),removeItem:ti("removeStorageSync"),clear:ti("clearStorageSync")},ni={tag:"toutiao",isSupportSocket:function(){return!0},useNavi:!1,connectPlatform:"MiniProgram",isFromUniapp:ei,localStorage:ri,sessionStorage:ri,httpReq:function(e){return new Promise((function(t,r){tt.request({url:e.url,data:e.body,header:e.headers,method:e.method,success:function(e){console.log("调用成功",e.data);var r=(null==e?void 0:e.data)||{},n={data:JSON.stringify(r),status:e.statusCode};t(n)},fail:function(e){console.log("调用失败",e.errMsg),r({data:e.errMsg})}})}))},createWebSocket:function(e,t){var r=tt.connectSocket({url:e,protocols:t});return{onOpen:function(e){r.onOpen(e)},onClose:function(e){r.onClose((function(t){return e(t.code,t.reason)}))},onError:function(e){r.onError((function(t){return e(t.errMsg)}))},onMessage:function(e){r.onMessage((function(t){return e(t.data)}))},send:function(e){r.send({data:e})},close:function(e,t){r.close({code:e,reason:t})}}},createDataChannel:function(e,r){return"websocket"===r?new t.WebSocketChannel(this,e):new t.CometChannel(this,e)}},oi=Vo(),ii=function(e){return function(){try{var t;return console.log("swan",swan),(t=swan)[e].apply(t,arguments)}catch(e){hn.error(e)}}},si={setItem:ii("setStorageSync"),getItem:ii("getStorageSync"),removeItem:ii("removeStorageSync"),clear:ii("clearStorageSync")},ai={tag:"baidu",isSupportSocket:function(){return!0},useNavi:!1,connectPlatform:"MiniProgram",isFromUniapp:oi,localStorage:si,sessionStorage:si,httpReq:function(e){return new Promise((function(t,r){swan.request({url:e.url,data:e.body,header:e.headers,method:e.method,success:function(e){console.log("调用成功",e.data);var r=(null==e?void 0:e.data)||{},n={data:JSON.stringify(r),status:e.statusCode};t(n)},fail:function(e){console.log("调用失败",e.errorCode),r({data:e.errorCode})}})}))},createWebSocket:function(e,t){var r=swan.connectSocket({url:e,protocols:t});return{onOpen:function(e){r.onOpen(e)},onClose:function(e){r.onClose((function(t){return e(t.code,t.reason)}))},onError:function(e){r.onError((function(t){return e(t.errMsg)}))},onMessage:function(e){r.onMessage((function(t){return e(t.data)}))},send:function(e){r.send({data:e})},close:function(e,t){r.close({code:e,reason:t})}}},createDataChannel:function(e,r){return"websocket"===r?new t.WebSocketChannel(this,e):new t.CometChannel(this,e)}},ui=function(e){return function(){try{var t;return(t=uni)[e].apply(t,arguments)}catch(e){hn.error(e)}}},ci={setItem:ui("setStorageSync"),getItem:ui("getStorageSync"),removeItem:ui("removeStorageSync"),clear:ui("clearStorageSync")},fi={tag:"uniapp",httpReq:function(e){var r=e.method||t.HttpMethod.GET,n=e.timeout||6e4,o=e.headers,i=e.query,s=e.body,a=t.appendUrl(e.url,i);return new Promise((function(e){uni.request({url:a,method:r,headers:o,timeout:n,sslVerify:!1,data:s,success:function(t){e({data:t.data,status:t.statusCode})},fail:function(){e({status:t.ErrorCode.RC_HTTP_REQ_TIMEOUT})}})}))},localStorage:ci,sessionStorage:ci,isSupportSocket:function(){return!0},useNavi:!0,connectPlatform:"",isFromUniapp:!0,createWebSocket:function(e,t){var r={complete:function(){},url:e,protocols:t},n=uni.connectSocket(r);return{onClose:function(e){n.onClose((function(t){e(t.code,t.reason)}))},onError:function(e){n.onError((function(t){e(t.errMsg)}))},onMessage:function(e){n.onMessage((function(t){e(t.data)}))},onOpen:function(e){n.onOpen(e)},send:function(e){n.send({data:e})},close:function(e,t){n.close({code:e,reason:t})}}},createDataChannel:function(e,r){return"websocket"===r?new t.WebSocketChannel(this,e):new t.CometChannel(this,e)}},di=function(e){return e&&e.canIUse&&e.getSystemInfo},pi="undefined"!=typeof uni&&di(uni)?function(){switch(process.env.VUE_APP_PLATFORM){case"app-plus":return fi;case"mp-baidu":return ai;case"mp-toutiao":return ni;case"mp-alipay":return $o;case"mp-weixin":return Jo;case"h5":default:return qo}}():"undefined"!=typeof wx&&di(wx)?Jo:"undefined"!=typeof my&&di(my)?$o:"undefined"!=typeof tt&&di(tt)?ni:"undefined"!=typeof swan&&di(swan)?ai:qo,li=[],hi=[],gi={message:function(e){li.forEach((function(t){return t(e)}))},status:function(e){hi.forEach((function(t){return t(e)}))}},mi=function(){function e(r){i(this,e),this._token="",this._context=r,this.Conversation=new Vn(r),this.ChatRoom=new so(r),this.RTC=function(e){return t.assert("options.id",e.id,t.notEmptyString,!0),new jo(e,r)}}var r,n,s;return a(e,[{key:"install",value:function(e,t){return this._context.install(e,t)}},{key:"watch",value:function(e){var t=e.status,r=e.conversation,n=e.message,o=e.chatroom,i=e.expansion,s=e.typingStatus,a=e.pullFinished,u={};t&&(u.connectionState=function(e){try{t({status:e})}catch(e){hn.error(e)}}),r&&(u.conversationState=function(e){try{var t=e.map((function(e){return r=(t=e).updatedItems,n=t.conversationType,o=t.targetId,i=t.latestMessage,s=t.unreadMessageCount,a=t.lastUnreadTime,u=t.notificationStatus,c=t.isTop,f=t.mentionedInfo,d=t.hasMentioned,p=i&&Sn(i),r&&r.latestMessage&&(r.latestMessage.val=p),{updatedItems:r,type:n,targetId:o,latestMessage:p,unreadMessageCount:s,lastUnreadTime:a,notificationStatus:u,isTop:c,mentionedInfo:f,hasMentioned:d};var t,r,n,o,i,s,a,u,c,f,d,p}));r({updatedConversationList:t})}catch(e){hn.error(e)}}),n&&(u.message=function(e){try{n({message:Sn(e)})}catch(e){hn.error(e)}}),o&&(u.chatroomState=function(e){try{o(e)}catch(e){hn.error(e)}}),i&&(u.expansion=function(e){try{i(e)}catch(e){hn.error(e)}}),a&&(u.pullFinished=function(){try{a()}catch(e){hn.error(e)}}),s&&(u.typingState=function(e){try{s(e)}catch(e){hn.error(e)}}),this._context.assignWatcher(u)}},{key:"unwatch",value:function(){this._context.assignWatcher({message:void 0,connectionState:void 0,conversationState:void 0,chatroomState:void 0,expansion:void 0})}},{key:"rtcInnerWatch",value:function(e){var t=e.message,r=e.status;t&&li.push((function(e){try{t({message:Sn(e)})}catch(e){hn.error(e)}})),r&&hi.push((function(e){try{r({status:e})}catch(e){hn.error(e)}})),this._context.assignWatcher({rtcInnerWatcher:gi})}},{key:"rtcInnerUnwatch",value:function(){hi.length=hi.length=0,this._context.assignWatcher({rtcInnerWatcher:void 0})}},{key:"connect",value:(s=o(regeneratorRuntime.mark((function e(r){var n,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.assert("options.token",r.token,t.AssertRules.STRING,!0),n=r.token,this._token=n,e.next=5,this._context.connect(n,!0);case 5:if((o=e.sent).code!==t.ErrorCode.SUCCESS){e.next=8;break}return e.abrupt("return",{id:o.userId});case 8:return e.abrupt("return",Promise.reject({code:o.code,msg:mn[o.code]}));case 9:case"end":return e.stop()}}),e,this)}))),function(e){return s.apply(this,arguments)})},{key:"reconnect",value:(n=o(regeneratorRuntime.mark((function e(){var r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this._context.reconnect();case 2:if((r=e.sent).code!==t.ErrorCode.SUCCESS){e.next=5;break}return e.abrupt("return",{id:r.userId});case 5:return e.abrupt("return",Promise.reject({code:r.code,msg:mn[r.code]}));case 6:case"end":return e.stop()}}),e,this)}))),function(){return n.apply(this,arguments)})},{key:"disconnect",value:function(){return this._context.disconnect()}},{key:"getAppInfo",value:function(){return{appkey:this._context.appkey,token:this._token,navi:this._context.getInfoFromCache()}}},{key:"getConnectedTime",value:function(){return this._context.getConnectedTime()}},{key:"getServerTime",value:function(){return this._context.getServerTime()}},{key:"getConnectionStatus",value:function(){return this._context.getConnectionStatus()}},{key:"getConnectionUserId",value:function(){return this._context.getCurrentUserId()}},{key:"getFileToken",value:function(e,r,n,o){return t.assert("fileType",e,t.isValidFileType,!0),this._context.getFileToken(e,r,n,o)}},{key:"getFileUrl",value:function(e,r,n,o,i){return t.assert("fileType",e,t.isValidFileType,!0),t.assert("filename",r,t.AssertRules.STRING),t.assert("saveName",n,t.AssertRules.STRING),t.assert("serverType",i,t.AssertRules.NUMBER),this._context.getFileUrl(e,r,n,o,i)}},{key:"changeUser",value:(r=o(regeneratorRuntime.mark((function e(r){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return hn.warn("Method is deprecated"),t.assert("options.token",r.token,t.AssertRules.STRING,!0),e.next=4,this.disconnect();case 4:return e.abrupt("return",this.connect(r));case 5:case"end":return e.stop()}}),e,this)}))),function(e){return r.apply(this,arguments)})},{key:"registerMessageType",value:function(e,t,r,n){this._context.registerMessageType(e,t,r,n)}}]),e}(),yi=t.MessageDirection,vi=t.ConversationType,Si=t.FileType,Ci={DO_NOT_DISTURB:t.NotificationStatus.OPEN,NOTIFY:t.NotificationStatus.CLOSE},Ei=t.ChatroomEntryType;Object.defineProperty(e,"ChatroomEntryType",{enumerable:!0,get:function(){return t.ChatroomEntryType}}),Object.defineProperty(e,"ConnectionStatus",{enumerable:!0,get:function(){return t.ConnectionStatus}}),Object.defineProperty(e,"ConversationType",{enumerable:!0,get:function(){return t.ConversationType}}),Object.defineProperty(e,"FileType",{enumerable:!0,get:function(){return t.FileType}}),Object.defineProperty(e,"LogLevel",{enumerable:!0,get:function(){return t.LogLevel}}),Object.defineProperty(e,"MessageDirection",{enumerable:!0,get:function(){return t.MessageDirection}}),Object.defineProperty(e,"NotificationStatus",{enumerable:!0,get:function(){return t.NotificationStatus}}),Object.defineProperty(e,"UploadMethod",{enumerable:!0,get:function(){return t.UploadMethod}}),e.CHATROOM_ENTRY_TYPE=Ei,e.CHATROOM_ORDER={ASC:1,DESC:2},e.CONNECTION_STATUS={CONNECTED:0,CONNECTING:1,DISCONNECTED:2,NETWORK_UNAVAILABLE:3,SOCKET_ERROR:4,KICKED_OFFLINE_BY_OTHER_CLIENT:6,BLOCKED:12},e.CONNECT_TYPE={COMET:"comet",WEBSOCKET:"websocket"},e.CONVERSATION_TYPE=vi,e.ERROR_CODE=mn,e.FILE_TYPE=Si,e.IMClient=mi,e.MENTIONED_TYPE={ALL:1,SINGAL:2},e.MESSAGE_DIRECTION=yi,e.MESSAGE_TYPE={TEXT:"RC:TxtMsg",VOICE:"RC:VcMsg",HQ_VOICE:"RC:HQVCMsg",IMAGE:"RC:ImgMsg",GIF:"RC:GIFMsg",RICH_CONTENT:"RC:ImgTextMsg",LOCATION:"RC:LBSMsg",FILE:"RC:FileMsg",SIGHT:"RC:SightMsg",COMBINE:"RC:CombineMsg",CHRM_KV_NOTIFY:"RC:chrmKVNotiMsg",LOG_COMMAND:"RC:LogCmdMsg",EXPANSION_NOTIFY:"RC:MsgExMsg",REFERENCE:"RC:ReferenceMsg"},e.MESSAGS_TIME_ORDER={DESC:0,ASC:1},e.NOTIFICATION_STATUS=Ci,e.RECALL_MESSAGE_TYPE="RC:RcCmd",e.RECEIVED_STATUS={READ:1,LISTENED:2,DOWNLOADED:4,RETRIEVED:8,UNREAD:0},e.SDK_VERSION="4.4.8",e.getInstance=function(){return Ko||hn.error("Please call the init method first"),Ko},e.init=function(e){if(hn.setLogLevel(e.logLevel),hn.setLogStdout(e.logStdout),Ko)return hn.error("The instance already exists. Do not repeatedly call the init method"),Ko;t.assert("options.appkey",e.appkey,t.AssertRules.STRING,!0),t.assert("options.debug",e.debug,t.AssertRules.BOOLEAN),t.assert("options.navigators",e.navigators,(function(e){return t.isArray(e)&&(0===e.length||e.every(t.isHttpUrl))}));var r=null==e?void 0:e.connectType;r?t.CONNECTION_TYPE.WEBSOCKET!==r&&t.CONNECTION_TYPE.COMET!==r&&(hn.warn("RongIMLib connectionType must be ".concat(t.CONNECTION_TYPE.WEBSOCKET," or ").concat(t.CONNECTION_TYPE.COMET)),r=t.CONNECTION_TYPE.WEBSOCKET):r=t.CONNECTION_TYPE.WEBSOCKET;var n=t.APIContext.init(pi,{appkey:e.appkey,apiVersion:"4.4.8",navigators:e.navigators||[],miniCMPProxy:e.customCMP||[],connectionType:r,logLevel:e.logLevel,logStdout:e.logStdout,indexDBSwitch:e.indexDBSwitch,checkCA:e.checkCA});return hn.warn("RongIMLib Version: ".concat("4.4.8",", Commit: ","04f45251530378a83b93d97e63832dd24d3070c8")),Ko=new mi(n)},Object.defineProperty(e,"__esModule",{value:!0})}));
