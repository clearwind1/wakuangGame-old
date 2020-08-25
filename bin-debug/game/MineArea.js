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
    var MineArea = (function (_super) {
        __extends(MineArea, _super);
        function MineArea(configdata) {
            var _this = _super.call(this) || this;
            _this.skinName = "MineArea";
            _this._configdata = [{
                    "id": 8,
                    "user_hold_area_id": 2,
                    "good_id": 6,
                    "good_type": 2,
                    "status": 1,
                    "created_at": "2020-08-10 23:06:50",
                    "updated_at": "2020-08-10 23:06:50",
                    "good": {
                        "id": 6,
                        "name": "淘洗机器",
                        "type": 2,
                        "id_card": "taoxijiqi",
                        "price": "10.00",
                        "content": {
                            "every_min_use_fuel_value": "0.001"
                        },
                        "description": "淘洗机器",
                        "is_can_buy": 1,
                        "buy_user_type": 2,
                        "remark": null,
                        "status": 1,
                        "sort": 0,
                        "created_at": "2020-08-08 22:18:30",
                        "updated_at": "2020-08-08 22:18:30"
                    }
                }];
            _this.init(configdata);
            _this.initEvent();
            return _this;
        }
        MineArea.prototype.init = function (configdata) {
            // init
            this.head_group.addChild(new Game.headComment(this, '矿区', 'MINING AREA'));
            this.bg.source = "Bg_MiningArea_Lv" + GameData.UserInfo.current_hold_area_grade + "_png";
            this._configdata = configdata;
            this.area_grade.text = GameData.UserInfo.current_hold_area_code + '矿区：v' + GameData.UserInfo.current_hold_area_grade;
            Log(configdata);
            this.config_engine();
            this.check_start_btn_state();
        };
        MineArea.prototype.config_engine = function () {
            this.config_excavate_engine_btn.visible = true;
            var configdata = this._configdata;
            var count = 0;
            for (var k in configdata) {
                var item = configdata[k];
                if (item.good_type == ENGINE_TYPE.PANNING) {
                    this.panning_engine.visible = true;
                    this.config_panning_engine_btn.visible = false;
                }
                else {
                    this['excavate_engine' + count].source = item.good.id_card;
                    this['excavate_engine' + count].visible = true;
                    this['excavate_engine' + count].name = item.id;
                    count++;
                }
            }
            if (this.config_panning_engine_btn.visible || count == 5 || GameData.UserInfo.dig_time != -1) {
                this.config_excavate_engine_btn.visible = false;
            }
        };
        MineArea.prototype.initEvent = function () {
            var _this = this;
            this.addEvent(this.config_panning_engine_btn, egret.TouchEvent.TOUCH_TAP, this, this.showExcavate, [ENGINE_TYPE.PANNING]);
            this.addEvent(this.config_excavate_engine_btn, egret.TouchEvent.TOUCH_TAP, this, this.showExcavate, [ENGINE_TYPE.EXCAVATE]);
            this.addEvent(this.start_dig_btn, egret.TouchEvent.TOUCH_TAP, this, this.start_dig);
            this.addEvent(this.select_close_btn, egret.TouchEvent.TOUCH_TAP, this, function () { _this.select_group.visible = false; });
            this.addEvent(this.warehouseList, eui.ItemTapEvent.ITEM_TAP, this, this.intall_excavate_engine);
            this.addEvent(cor.EventManage.instance(), DigMineTime, this, this.check_start_btn_state);
        };
        MineArea.prototype.showExcavate = function (type) {
            var _this = this;
            cor.Socket.getIntance().sendmsg('USER_GOOD_LIST', {}, function (rdata) {
                Log(rdata);
                var excavateData = [];
                for (var k in rdata) {
                    if (rdata[k].good.type == type) {
                        excavateData.push(rdata[k]);
                    }
                }
                _this.warehouseList.dataProvider = new eui.ArrayCollection(excavateData);
                _this.select_group.visible = true;
            }, this);
        };
        MineArea.prototype.intall_excavate_engine = function (e) {
            var _this = this;
            var goodsID = e.item.id;
            var cmd = e.item.good.type == ENGINE_TYPE.EXCAVATE ? 'CONFIG_EXCAVATE_ENGINE' : 'CONFIG_PANNING_ENGINE';
            cor.Socket.getIntance().sendmsg(cmd, {
                "user_good_id": goodsID
            }, function (rdata) {
                _this.select_group.visible = false;
                Log(rdata);
                _this.refresh();
            }, this);
        };
        MineArea.prototype.refresh = function () {
            var _this = this;
            cor.Socket.getIntance().sendmsg('GET_USER_HOLD_AREA_CONFIG', {}, function (rdata) {
                Log(rdata);
                _this._configdata = rdata;
                _this.config_engine();
            }, this);
        };
        MineArea.prototype.start_dig = function () {
            var _this = this;
            if (GameData.UserInfo.dig_time == -1) {
                cor.Socket.getIntance().sendmsg('USER_HOLD_AREA_START', {}, function (rdata) {
                    Log(rdata);
                    Game.TipsSkin.instance().show('开始挖矿');
                    GameData.UserInfo.dig_time = 60 * 60 * 4;
                    _this.config_excavate_engine_btn.visible = false;
                    // this.start_dig_btn.visible = false;
                    _this.check_start_btn_state();
                    cor.EventManage.instance().sendEvent(StartDigMine);
                }, this);
            }
            else if (GameData.UserInfo.dig_time == 0) {
            }
            else {
            }
        };
        MineArea.prototype.check_start_btn_state = function () {
            if (GameData.UserInfo.dig_time == -1) {
                this.start_dig_btn['tx'].text = "开始挖矿";
                this.start_dig_btn['tx'].stroke = 2;
            }
            else if (GameData.UserInfo.dig_time == 0) {
                this.start_dig_btn['tx'].text = "领取奖励";
                this.start_dig_btn['tx'].stroke = 2;
            }
            else {
                this.start_dig_btn['tx'].text = "领取奖励倒计时:\n" + numberToTime(GameData.UserInfo.dig_time * 1000, 1);
                this.start_dig_btn['tx'].stroke = 0;
            }
        };
        return MineArea;
    }(cor.BaseScene));
    Game.MineArea = MineArea;
    __reflect(MineArea.prototype, "Game.MineArea");
})(Game || (Game = {}));
//# sourceMappingURL=MineArea.js.map