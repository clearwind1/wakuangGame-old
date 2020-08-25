var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var core;
(function (core) {
    var Http = (function () {
        function Http() {
        }
        /**
         * @action 要发送的命令
         * @data 要发送的数据
         * @callback获取数据后的回调方法
         * @type Http发送方法类型
        */
        Http.sendPostData = function (action, cdata, callback, obj) {
            if (obj) {
                game.Socket.getIntance().sendmsg(action, cdata, callback, obj);
            }
            else {
                var httpPost = new HttpPost();
                httpPost.sendPostData(action, cdata, callback);
            }
        };
        /**
         * @action要发送的命令
         * @data 要发送的数据
         * @callback获取数据后的回调方法
         * @type Http发送方法类型
        */
        Http.sendGetData = function (action, cdata, callback, obj, isHide) {
            if (isHide === void 0) { isHide = false; }
            if (obj) {
                game.Socket.getIntance().sendmsg(action, cdata, callback, obj, isHide);
            }
            else {
                var httpGet = new HttpGet();
                httpGet.sendGetData(action, cdata, callback);
            }
        };
        return Http;
    }());
    core.Http = Http;
    __reflect(Http.prototype, "core.Http");
    /**
     * 连网等待覆盖
     */
    var Covershap = (function (_super) {
        __extends(Covershap, _super);
        function Covershap() {
            var _this = _super.call(this) || this;
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddedToStage, _this);
            return _this;
            // this.addEventListener(egret.Event.RESIZE, this.onStageResize, this);
        }
        // private onStageResize(evt: egret.Event): void {
        // 	this.width = core.LayerCenter.getInstance().stage.stageWidth;
        // 	this.height = core.LayerCenter.getInstance().stage.stageHeight;
        // }
        Covershap.prototype.onAddedToStage = function (event) {
            this.touchEnabled = true;
            this.width = GameData.GameWidth;
            this.height = GameData.GameHeigth;
            this.addChild(createRect(0, 0, this.width, this.height, 0.6));
            //动画
            // this.createan();
        };
        Covershap.prototype.createan = function () {
            this.loading = createBitmap("loadingIcon_png");
            this.loading.x = this.width / 2;
            this.loading.y = this.height / 2;
            this.addChild(this.loading);
            egret.Tween.get(this.loading, { loop: true }).to({ rotation: 360 }, 500);
        };
        Covershap.prototype.show = function () {
            this.alpha = 0;
            var self = this;
            this.timeoutInt = setTimeout(function () {
                self.alpha = 1;
                clearTimeout(self.timeoutInt);
            }, 500);
        };
        Covershap.prototype.hide = function () {
            clearTimeout(this.timeoutInt);
            this.visible = false;
        };
        Covershap.getInstance = function () {
            if (this._ins == null) {
                this._ins = new Covershap();
            }
            return this._ins;
        };
        Covershap._ins = null;
        return Covershap;
    }(egret.DisplayObjectContainer));
    core.Covershap = Covershap;
    __reflect(Covershap.prototype, "core.Covershap");
    var HttpPost = (function () {
        function HttpPost() {
        }
        HttpPost.prototype.sendPostData = function (action, cdata, callback) {
            var linkTimes = 0;
            var url;
            var self = this;
            var redata = cdata;
            url = GameData.ServerUrl + action;
            url = url.replace("ws", "http");
            var patt1 = /cnrgame\/websocket|cnrGame\/websocket/;
            url = url.replace(patt1, "");
            cdata = JSON.stringify(cdata);
            Log("sendMessage", action, cdata);
            var httpAction = new egret.HttpRequest();
            httpAction.responseType = egret.HttpResponseType.TEXT;
            httpAction.setRequestHeader("Content-Type", "application/text;charset=UTF-8");
            //Log("getMessage", action, httpAction);
            httpAction.open(url, "POST");
            httpAction.send(cdata);
            httpAction.addEventListener(egret.Event.COMPLETE, loadComplete, this);
            httpAction.addEventListener(egret.IOErrorEvent.IO_ERROR, onGetIOError, this);
            core.Covershap.getInstance().show();
            function loadComplete() {
                httpAction.removeEventListener(egret.Event.COMPLETE, loadComplete, this);
                httpAction.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
                var back_data = JSON.parse(httpAction.response.substring());
                Log("getMessage", action, back_data);
                if (back_data.code == 1) {
                    httpAction = new egret.HttpRequest();
                    httpAction.responseType = egret.HttpResponseType.TEXT;
                    httpAction.setRequestHeader("Content-Type", "application/text;charset=UTF-8");
                    url = GameData.ServerUrl + "refreshLogin";
                    httpAction.open(url, "POST");
                    var refreshParam = {
                        "refreshToken": ""
                    };
                    httpAction.send(JSON.stringify(refreshParam));
                    httpAction.addEventListener(egret.Event.COMPLETE, refreshComplete, this);
                    httpAction.addEventListener(egret.IOErrorEvent.IO_ERROR, onGetIOError, this);
                }
                else {
                    core.Covershap.getInstance().hide();
                    callback(back_data);
                }
            }
            function refreshComplete(evt) {
                //Log()
                httpAction.removeEventListener(egret.Event.COMPLETE, refreshComplete, this);
                httpAction.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
                var back_data = JSON.parse(httpAction.response.substring());
                Log("getMessage", "refreshLogin", back_data);
                if (back_data.code == 0) {
                    redata.token = back_data.data.token;
                    self.sendPostData(action, redata, callback);
                }
                else if (back_data.code == 2) {
                    Log(back_data.errMsg);
                    window.location.reload();
                    //self.login();
                }
                else {
                    // tips.Tips.tipJustStr("网络异常");
                }
            }
            function onGetIOError(evt) {
                Log("onGetIOError_" + evt.target._url);
                // tips.Tips.tipJustStr("网络异常");
            }
        };
        return HttpPost;
    }());
    __reflect(HttpPost.prototype, "HttpPost");
    var HttpGet = (function () {
        function HttpGet() {
        }
        HttpGet.prototype.sendGetData = function (action, cdata, callback) {
            var self = this;
            var url;
            var redata = cdata;
            url = GameData.ServerUrl + action;
            Log("sendMessage", action, cdata);
            var paramStr = "";
            var property;
            var i = 0;
            for (property in cdata) {
                if (i > 0) {
                    paramStr += "&";
                }
                paramStr += property + "=" + cdata[property];
                i++;
            }
            var httpAction = new egret.HttpRequest();
            url = url + "?" + paramStr;
            httpAction = new egret.HttpRequest();
            httpAction.responseType = egret.HttpResponseType.TEXT;
            httpAction.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
            httpAction.open(url, "GET");
            httpAction.send();
            httpAction.addEventListener(egret.Event.COMPLETE, loadComplete, this);
            httpAction.addEventListener(egret.IOErrorEvent.IO_ERROR, onGetIOError, this);
            //Log(new Date().getTime(), "========================================1");
            function loadComplete() {
                httpAction.removeEventListener(egret.Event.COMPLETE, loadComplete, this);
                httpAction.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
                var back_data = JSON.parse(httpAction.response.substring());
                Log("getMessage", action, back_data);
                if (back_data.code == 1) {
                    httpAction = new egret.HttpRequest();
                    httpAction.responseType = egret.HttpResponseType.TEXT;
                    httpAction.setRequestHeader("Content-Type", "application/plain;charset=UTF-8");
                    url = GameData.ServerUrl + "refreshLogin";
                    httpAction.open(url, "POST");
                    var refreshParam = {
                        "refreshToken": ""
                    };
                    httpAction.send(JSON.stringify(refreshParam));
                    httpAction.addEventListener(egret.Event.COMPLETE, refreshComplete, this);
                    httpAction.addEventListener(egret.IOErrorEvent.IO_ERROR, onGetIOError, this);
                }
                else {
                    callback(back_data);
                }
            }
            function refreshComplete(evt) {
                httpAction.removeEventListener(egret.Event.COMPLETE, refreshComplete, this);
                httpAction.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
                var back_data = JSON.parse(httpAction.response.substring());
                Log("getMessage", "refreshLogin", back_data);
                if (back_data.code == 0) {
                    redata.token = back_data.data.token;
                    self.sendGetData(action, redata, callback);
                }
                else if (back_data.code == 2) {
                    Log(back_data.errMsg);
                    window.location.reload();
                    //self.login();
                }
                else {
                    // tips.Tips.tipJustStr("网络异常");
                }
            }
            function onGetIOError(evt) {
                Log("onGetIOError_" + evt.target._url);
                // tips.Tips.tipJustStr("网络异常");
            }
        };
        return HttpGet;
    }());
    __reflect(HttpGet.prototype, "HttpGet");
})(core || (core = {}));
//# sourceMappingURL=Http.js.map