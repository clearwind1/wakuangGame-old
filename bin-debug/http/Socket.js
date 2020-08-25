var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var cor;
(function (cor) {
    var Socket = (function () {
        function Socket() {
            this.bconnect = false; //是否连接
            this.breflesh = false; //是否重新连接
            this.breLogin = false; //重新连接提示
            this.inteval = -1;
            this.firstConnect = true; //是否首次连接
            this.reSendTimesCount = 0;
            this._bchange = false;
            this.connectCount = 0;
            this.breLogin = false;
            this.param = [];
            this.webSocket = null;
            this.firstConnect = true;
        }
        Socket.prototype.ProConnet = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            _this.connect(function () {
                                resolve();
                            }, _this);
                        })];
                });
            });
        };
        Socket.prototype.connect = function (callback, obj) {
            Game.TipsSkin.instance().show("连接网络...", false);
            Log("连接：", GameData.ServerSocketUrl);
            this.webSocket = new egret.WebSocket();
            this.webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
            this.webSocket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
            this.webSocket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
            this.webSocket.connectByUrl(GameData.ServerSocketUrl);
            this.connetCB = callback;
            this.connetObj = obj;
        };
        Socket.prototype.sendmsg = function (action, msg, callback, obj, isHide) {
            if (!this.webSocket.connected) {
                Game.TipsSkin.instance().show('网络重连中...');
                this.refreshLogin();
                return;
            }
            var param = {
                action: action,
                param: msg,
                callback: callback,
                targetObj: obj
            };
            var ishave = false;
            for (var i = 0; i < this.param.length; i++) {
                if (this.param[i] && this.param[i].action == param.action) {
                    ishave = true;
                    break;
                }
            }
            if (!ishave)
                this.param.push(param);
            var reqData = {
                "cmd": action,
                "data": msg,
                "msg": ""
            };
            var cmd = JSON.stringify(reqData);
            Log("发送数据：" + JSON.stringify(cmd));
            if (this.webSocket.connected) {
                this.webSocket.writeUTF(cmd);
                if (!isHide) {
                    core.Covershap.getInstance().show();
                    this.inteval = setTimeout(function () {
                        core.Covershap.getInstance().hide();
                    }, 10000);
                }
            }
        };
        Socket.prototype.onSocketOpen = function () {
            console.log("连接websocket成功");
            // alert('success')
            Game.TipsSkin.instance().hide();
            this.connetCB.apply(this.connetObj);
            this.param = [];
            this._bchange = false;
            if (this.breflesh) {
                this.breflesh = false;
                cor.Socket.getIntance().sendmsg('LOGIN', {
                    "mobile": GameData.UserPhone,
                    "password": GameData.UserPassword
                }, function (rdata) { }, this);
            }
            // for (let i = 0; i < this.param.length; i++){
            // 	let item = this.param[i];
            // 	this.sendmsg(item.action, item.param, item.callback, item.targetObj);
            // }
        };
        Socket.prototype.onReceiveMessage = function (e) {
            var msg = this.webSocket.readUTF();
            Log(msg);
            // console.log("收到action：" + msg.split("$")[0]);
            var msgarr = JSON.parse(msg);
            switch (msgarr.cmd) {
                case 'NEW_NOTICE':
                    cor.EventManage.instance().sendEvent(NEW_NOTICE, msgarr.data);
                    return;
            }
            for (var i = 0; i < this.param.length; i++) {
                var item = this.param[i];
                if (item && item.action == msgarr.cmd) {
                    var contant = msgarr.data;
                    // Log("收到数据：")
                    // Log(contant);
                    core.Covershap.getInstance().hide();
                    clearTimeout(this.inteval);
                    // item.callback.apply(item.targetObj, [contant]);
                    if (msgarr.code == 0) {
                        item.callback.apply(item.targetObj, [contant]);
                    }
                    else {
                        Log("报错啦：", msgarr.code);
                        Game.TipsSkin.instance().show(msgarr.msg);
                    }
                    this.param.splice(i, 1);
                    break;
                }
            }
        };
        Socket.prototype.onSocketClose = function () {
            this.connectCount++;
            Log('重连++++++', this.connectCount, "次");
            if (this.connectCount >= 12) {
                this.connectCount = 0;
                core.Covershap.getInstance().hide();
            }
            else {
                // this.webSocket.connectByUrl(GameData.ServerSocketUrl);
                this.refreshLogin();
            }
        };
        Socket.prototype.refreshLogin = function () {
            core.Covershap.getInstance().show();
            if (!this._bchange) {
                this.breflesh = true;
            }
            this.webSocket.connectByUrl(GameData.ServerSocketUrl);
        };
        Socket.prototype.changeUrl = function () {
            this._bchange = true;
            this.webSocket.close();
            // this.webSocket.connectByUrl(GameData.ServerSocketUrl);
        };
        Socket.getIntance = function () {
            return this._i = this._i || new Socket();
        };
        Socket._i = null;
        return Socket;
    }());
    cor.Socket = Socket;
    __reflect(Socket.prototype, "cor.Socket");
})(cor || (cor = {}));
//# sourceMappingURL=Socket.js.map