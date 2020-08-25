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
    var NewsItem = (function (_super) {
        __extends(NewsItem, _super);
        function NewsItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "NewsItem";
            _this.init();
            _this.initEnent();
            return _this;
        }
        NewsItem.prototype.init = function () {
            // init
        };
        NewsItem.prototype.initEnent = function () {
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.addEventListener(eui.UIEvent.REMOVED_FROM_STAGE, this.dispose, this);
        };
        NewsItem.prototype.onComplete = function () {
        };
        NewsItem.prototype.dataChanged = function () {
        };
        NewsItem.prototype.dispose = function () {
            this.removeChildren();
            this.removeEventListener(eui.UIEvent.REMOVED_FROM_STAGE, this.dispose, this);
        };
        return NewsItem;
    }(eui.ItemRenderer));
    Game.NewsItem = NewsItem;
    __reflect(NewsItem.prototype, "Game.NewsItem");
})(Game || (Game = {}));
//# sourceMappingURL=NewsItem.js.map