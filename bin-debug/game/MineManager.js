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
    var MineManager = (function (_super) {
        __extends(MineManager, _super);
        function MineManager(mineData) {
            var _this = _super.call(this) || this;
            _this.skinName = "MineManager";
            _this._minedata = [{
                    "id": 1,
                    "name": "V1矿区",
                    "total_output": 2000,
                    "price": "0.01",
                    "description": "V1矿区",
                    "grade": 1,
                    "max_user": 5,
                    "surplus": 100,
                    "is_can_buy": true
                }];
            _this.init(mineData);
            _this.initEnent();
            return _this;
        }
        MineManager.prototype.init = function (mineData) {
            // init
            this.head_group.addChild(new Game.headComment(this, '矿区管理', 'ADMINISTRATIVE OFFICE'));
            this._currentIndex = 0;
            this._minedata = mineData;
            this.showMineInfo();
            if (GameData.UserInfo.identity == IDENTITY.Owner) {
                this.setbuyBtnGray();
            }
        };
        MineManager.prototype.initEnent = function () {
            this.addEvent(this.last_btn, egret.TouchEvent.TOUCH_TAP, this, this.showLastMine);
            this.addEvent(this.next_btn, egret.TouchEvent.TOUCH_TAP, this, this.showNextMine);
            this.addEvent(this.buy_btn, egret.TouchEvent.TOUCH_TAP, this, this.buyMine);
        };
        //显示矿区信息
        MineManager.prototype.showMineInfo = function () {
            var mineData = this._minedata[this._currentIndex];
            this.surplus.text = '剩余:' + mineData.surplus;
            this.mine_name.text = mineData.name;
            this.description.text = mineData.description;
            this.total_output.text = mineData.total_output + '';
            this.mine_area_bg.source = "Banner_Kuangquguanli_lv." + mineData.grade + "_png";
            this.role.source = "Lv." + mineData.grade + "_png";
            // this.is_can_buy.text = '矿区管理处：' + (mineData.is_can_buy ? '可购买矿区' : '已售罄矿区');
            this.price.text = mineData.price.split('.')[0] + 'GST';
            this.buy_btn.label = (mineData.is_can_buy ? '购买' : '已售罄');
            if (!mineData.is_can_buy) {
                this.setbuyBtnGray();
            }
            else {
                this.setbuyBtnNormal();
            }
            this.checkLANbtn();
        };
        //检查上一个，下一个，按钮的显示
        MineManager.prototype.checkLANbtn = function () {
            this.last_btn.visible = this._currentIndex > 0;
            this.next_btn.visible = this._currentIndex < (this._minedata.length - 1);
        };
        //显示上一个矿区
        MineManager.prototype.showLastMine = function () {
            this._currentIndex--;
            this.showMineInfo();
        };
        //显示下一个矿区
        MineManager.prototype.showNextMine = function () {
            this._currentIndex++;
            this.showMineInfo();
        };
        MineManager.prototype.setbuyBtnNormal = function () {
            if (GameData.UserInfo.identity != IDENTITY.Owner) {
                this.buy_btn.filters = [];
            }
        };
        MineManager.prototype.setbuyBtnGray = function () {
            //颜色矩阵数组
            var colorMatrix = [
                0.3, 0.3, 0, 0, 0,
                0.3, 0.3, 0, 0, 0,
                0.3, 0.3, 0, 0, 0,
                0, 0, 0, 1, 0
            ];
            var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
            this.buy_btn.filters = [colorFlilter];
        };
        //购买矿区
        MineManager.prototype.buyMine = function () {
            var _this = this;
            if (GameData.UserInfo.identity == IDENTITY.Owner) {
                Game.TipsSkin.instance().show('您已是矿主');
                return;
            }
            var mineData = this._minedata[this._currentIndex];
            if (!mineData.is_can_buy) {
                Game.TipsSkin.instance().show('已售罄');
                return;
            }
            var id = this._minedata[this._currentIndex].id;
            var grade = this._minedata[this._currentIndex].grade;
            var price = Number(this._minedata[this._currentIndex].price.split('.')[0]);
            cor.Socket.getIntance().sendmsg('BUY_HOLD_AREA', {
                "hold_area_id": id
            }, function (rdata) {
                Game.TipsSkin.instance().show('购买成功');
                GameData.UserInfo.gts_number -= price;
                GameData.UserInfo.current_hold_area_grade = grade;
                GameData.UserInfo.identity = IDENTITY.Owner;
                cor.EventManage.instance().sendEvent(ChangeIdentity);
                cor.EventManage.instance().sendEvent(UpdataGameInfo);
                _this.dispose();
            }, this);
        };
        return MineManager;
    }(cor.BaseScene));
    Game.MineManager = MineManager;
    __reflect(MineManager.prototype, "Game.MineManager");
})(Game || (Game = {}));
//# sourceMappingURL=MineManager.js.map