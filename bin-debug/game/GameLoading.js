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
    var GameLoading = (function (_super) {
        __extends(GameLoading, _super);
        function GameLoading() {
            var _this = _super.call(this) || this;
            _this.skinName = "GameLoading";
            _this.init();
            _this.initEnent();
            return _this;
        }
        GameLoading.prototype.init = function () {
            // init
        };
        GameLoading.prototype.initEnent = function () {
        };
        return GameLoading;
    }(cor.BaseScene));
    Game.GameLoading = GameLoading;
    __reflect(GameLoading.prototype, "Game.GameLoading");
})(Game || (Game = {}));
//# sourceMappingURL=GameLoading.js.map