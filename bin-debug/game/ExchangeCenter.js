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
    var ExchangeCenter = (function (_super) {
        __extends(ExchangeCenter, _super);
        function ExchangeCenter(exchangedata) {
            var _this = _super.call(this) || this;
            _this.skinName = "ExchangeCenter";
            _this.init(exchangedata);
            _this.initEvent();
            return _this;
        }
        ExchangeCenter.prototype.init = function (exchangedata) {
            var _this = this;
            // init
            this.exchange_num.restrict = "0-9";
            this._exchangedata = exchangedata;
            this.head_group.addChild(new Game.headComment(this, '矿石交易所', 'ORE EXCHANGE'));
            var sortexd = [];
            for (var i = 0; i < 7; i++) {
                sortexd.push(exchangedata[i]);
            }
            sortexd.sort(compare('value', false));
            Log(sortexd);
            var lastSY = 0;
            for (var i = 0; i < 7; i++) {
                var datelb = this.date_group.getChildAt(i);
                datelb.text = exchangedata[i].date.substr(5);
                var exchangeratelb = this.rate_group.getChildAt(i);
                exchangeratelb.text = exchangedata[i].value + '';
                var sharp = this.sharp_group.getChildAt(i);
                sharp.scaleY = 0;
                var endSY = exchangedata[i].value / sortexd[0].value;
                var putY = 246 * (1 - endSY);
                if (i > 0 && i < 6) {
                    var point = this.point_group.getChildAt(i - 1);
                    point.y = putY;
                }
                exchangeratelb.y = putY;
                egret.Tween.get(sharp).wait(200).to({ scaleY: endSY }, 500, egret.Ease.backOut);
                if (i > 0) {
                    var sharp0 = this.sharp_group.getChildAt(i - 1);
                    var dis = egret.Point.distance(new egret.Point(sharp.x, putY), new egret.Point(sharp0.x, lastSY));
                    var line = this.line_group.getChildAt(i - 1);
                    line.y = lastSY + 10;
                    line.x = sharp0.x + 5;
                    line.width = dis;
                    var cod = Math.round(Math.atan((lastSY - putY) / (sharp0.x - sharp.x)) * 180 / Math.PI);
                    line.rotation = cod;
                }
                lastSY = putY;
            }
            cor.Socket.getIntance().sendmsg('GET_EXCHANGE_CONFIG', {}, function (rdata) {
                Log(rdata);
                _this._today_rate = rdata;
                _this.rateTx.text = _this.rateTx.text.replace('@num', rdata);
            }, this);
        };
        ExchangeCenter.prototype.initEvent = function () {
            var _this = this;
            this.addEvent(this.recode_btn, egret.TouchEvent.TOUCH_TAP, this, this.showRecode);
            this.addEvent(this.exchange_btn, egret.TouchEvent.TOUCH_TAP, this, this.exchange);
            this.addEvent(this.exchange_num, eui.UIEvent.CHANGE, this, this.showExchangeRate);
            this.addEvent(this.close_btn, egret.TouchEvent.TOUCH_TAP, this, function () { _this.rdcode_group.visible = false; });
        };
        ExchangeCenter.prototype.showExchangeRate = function (e) {
            this.exchangeRate.text = "GST=" + Number(e.target.text) * this._today_rate + "矿石";
        };
        ExchangeCenter.prototype.exchange = function () {
            var _this = this;
            cor.Socket.getIntance().sendmsg('EXCHANGE_GST', {
                "number": Number(this.exchange_num.text)
            }, function (rdata) {
                Log(rdata);
                GameData.UserInfo.gts_number += Number(_this.exchange_num.text);
                GameData.UserInfo.mineral -= (Number(_this.exchange_num.text) * _this._today_rate);
                cor.EventManage.instance().sendEvent(UpdataGameInfo);
            }, this);
        };
        ExchangeCenter.prototype.showRecode = function () {
            var _this = this;
            this.rdcode_group.visible = true;
            cor.Socket.getIntance().sendmsg('GET_EXCHANGE_RECODE', {}, function (rdata) {
                Log(rdata);
                _this.recode_list.dataProvider = new eui.ArrayCollection(rdata);
            }, this);
        };
        return ExchangeCenter;
    }(cor.BaseScene));
    Game.ExchangeCenter = ExchangeCenter;
    __reflect(ExchangeCenter.prototype, "Game.ExchangeCenter");
})(Game || (Game = {}));
//# sourceMappingURL=ExchangeCenter.js.map