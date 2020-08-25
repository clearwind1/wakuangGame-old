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
    var ToolInfo = (function (_super) {
        __extends(ToolInfo, _super);
        function ToolInfo(goodsInfo) {
            var _this = _super.call(this) || this;
            _this.skinName = "ToolInfo";
            _this.init(goodsInfo);
            _this.initEvent();
            return _this;
        }
        ToolInfo.prototype.init = function (goodsInfo) {
            // init
            this.goods_name.text = goodsInfo.name;
            this.goods_desc.text = goodsInfo.description;
            this.goods_img.source = goodsInfo.id_card;
            this.buy_one_btn.label = goodsInfo.price;
            this._goodsId = goodsInfo.id;
            this.goods_num.text = "1";
        };
        ToolInfo.prototype.initEvent = function () {
            this.addEvent(this.back_btn, egret.TouchEvent.TOUCH_TAP, this, this.dispose);
            this.addEvent(this.buy_one_btn, egret.TouchEvent.TOUCH_TAP, this, this.buy_one);
            this.addEvent(this.sub_btn, egret.TouchEvent.TOUCH_TAP, this, this.sub);
            this.addEvent(this.add_btn, egret.TouchEvent.TOUCH_TAP, this, this.add);
        };
        ToolInfo.prototype.add = function () {
            var cur_num = Number(this.goods_num.text);
            if (cur_num < 10) {
                cur_num++;
                this.goods_num.text = cur_num + '';
            }
        };
        ToolInfo.prototype.sub = function () {
            var cur_num = Number(this.goods_num.text);
            if (cur_num > 1) {
                cur_num--;
                this.goods_num.text = cur_num + '';
            }
        };
        ToolInfo.prototype.buy_one = function () {
            var _this = this;
            var cur_num = Number(this.goods_num.text);
            var price = Number(this.buy_one_btn.label.split('GST')[0]) * cur_num;
            cor.Socket.getIntance().sendmsg('BUY_GOOD', {
                "good_id": this._goodsId,
                "number": cur_num
            }, function (rdata) {
                Game.TipsSkin.instance().show('租用成功');
                GameData.UserInfo.gts_number -= price;
                cor.EventManage.instance().sendEvent(UpdataGameInfo);
                _this.dispose();
            }, this);
        };
        return ToolInfo;
    }(cor.BaseScene));
    Game.ToolInfo = ToolInfo;
    __reflect(ToolInfo.prototype, "Game.ToolInfo");
})(Game || (Game = {}));
//# sourceMappingURL=ToolInfo.js.map