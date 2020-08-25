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
    var GoodsInfo = (function (_super) {
        __extends(GoodsInfo, _super);
        function GoodsInfo(goodsInfo) {
            var _this = _super.call(this) || this;
            _this.skinName = "GoodsInfo";
            _this.init(goodsInfo);
            _this.initEvent();
            return _this;
        }
        GoodsInfo.prototype.init = function (goodsInfo) {
            // init
            this.goods_name.text = goodsInfo.name;
            this.goods_desc.text = goodsInfo.description;
            this.goods_img.source = goodsInfo.id_card;
        };
        GoodsInfo.prototype.initEvent = function () {
            this.addEvent(this.back_btn, egret.TouchEvent.TOUCH_TAP, this, this.dispose);
        };
        return GoodsInfo;
    }(cor.BaseScene));
    Game.GoodsInfo = GoodsInfo;
    __reflect(GoodsInfo.prototype, "Game.GoodsInfo");
})(Game || (Game = {}));
//# sourceMappingURL=GoodsInfo.js.map