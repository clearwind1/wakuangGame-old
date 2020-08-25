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
    var NewsContant = (function (_super) {
        __extends(NewsContant, _super);
        function NewsContant(newsData) {
            var _this = _super.call(this) || this;
            _this.skinName = "NewsContant";
            _this.init(newsData);
            _this.initEnent();
            return _this;
        }
        NewsContant.prototype.init = function (newsData) {
            // init
            this.contentScroller.height = this.height - this.contentScroller.y - 10;
            Log(newsData);
            this.title.text = newsData.title;
            this.time.text = newsData.publish_at;
            this.img.source = newsData.thumb;
            this.contants.text = newsData.content;
        };
        NewsContant.prototype.initEnent = function () {
            this.addEvent(this.back, egret.TouchEvent.TOUCH_TAP, this, this.dispose);
        };
        return NewsContant;
    }(cor.BaseScene));
    Game.NewsContant = NewsContant;
    __reflect(NewsContant.prototype, "Game.NewsContant");
})(Game || (Game = {}));
//# sourceMappingURL=NewsContant.js.map