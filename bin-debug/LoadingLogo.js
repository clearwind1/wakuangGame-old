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
var Game;
(function (Game) {
    var LoadingLogo = (function (_super) {
        __extends(LoadingLogo, _super);
        function LoadingLogo() {
            var _this = _super.call(this) || this;
            _this.skinName = "LoadingLogo";
            _this.isEnd = false;
            _this.init();
            _this.initEnent();
            return _this;
        }
        LoadingLogo.prototype.init = function () {
            var _this = this;
            // init
            egret.Tween.get(this.logo).to({ alpha: 1 }, 500).call(function () {
                _this.isEnd = true;
            });
        };
        LoadingLogo.prototype.initEnent = function () {
        };
        LoadingLogo.prototype.hideAndShow = function (callback, obj) {
            var _this = this;
            if (this.isEnd) {
                egret.Tween.get(this.logo).to({ alpha: 0 }, 500).call(function () {
                    _this.dispose();
                    callback.apply(obj);
                });
            }
            else {
                setTimeout(function () {
                    egret.Tween.get(_this.logo).to({ alpha: 0 }, 500).call(function () {
                        _this.dispose();
                        callback.apply(obj);
                    });
                }, 500);
            }
        };
        return LoadingLogo;
    }(cor.BaseScene));
    Game.LoadingLogo = LoadingLogo;
    __reflect(LoadingLogo.prototype, "Game.LoadingLogo");
})(Game || (Game = {}));
//# sourceMappingURL=LoadingLogo.js.map