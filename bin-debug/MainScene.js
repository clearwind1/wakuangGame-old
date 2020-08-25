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
var cor;
(function (cor) {
    var MainScene = (function (_super) {
        __extends(MainScene, _super);
        function MainScene() {
            var _this = _super.call(this) || this;
            egret.ExternalInterface.addCallback("back", function (message) {
                // alert("MainScene numChildren = " + this.numChildren);
                if (_this.numChildren == 1) {
                    egret.ExternalInterface.call("sendToNative", "exit$0");
                }
                else if (GameData.BGame) {
                    //询问退出游戏
                }
                else {
                    var index = _this.numChildren - 1;
                    var lastScene = _this.getChildAt(index);
                    lastScene.dispose();
                }
            });
            return _this;
        }
        MainScene.prototype.clearPage = function () {
            if (this.numChildren > 1) {
                for (var i = this.numChildren - 1; i > 0; i--) {
                    var page = this.getChildAt(i);
                    page.dispose();
                }
            }
        };
        MainScene.prototype.clearScene = function () {
            for (var i = this.numChildren - 1; i >= 0; i--) {
                var page = this.getChildAt(i);
                page.dispose();
            }
        };
        MainScene.instance = function () {
            return this._i || (this._i = new MainScene);
        };
        return MainScene;
    }(egret.DisplayObjectContainer));
    cor.MainScene = MainScene;
    __reflect(MainScene.prototype, "cor.MainScene");
})(cor || (cor = {}));
//# sourceMappingURL=MainScene.js.map