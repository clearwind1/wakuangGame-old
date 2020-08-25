namespace Game {
    export class MineArea extends cor.BaseScene {
        public readonly skinName = "MineArea";

        public config_panning_engine_btn: eui.Button;
        public config_excavate_engine_btn: eui.Button;
        public start_dig_btn: eui.Button;
        public panning_engine: eui.Image;
        public excavate_engine0: eui.Image;
        public excavate_engine1: eui.Image;
        public excavate_engine2: eui.Image;
        public excavate_engine3: eui.Image;
        public excavate_engine4: eui.Image;
        public bg: eui.Image;
        public area_grade: eui.Label;
        public select_group: eui.Group;
        public warehouseList: eui.List;
        public select_close_btn: eui.Image;
        public head_group: eui.Group;

        private _configdata = [{
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
        constructor(configdata) {
            super();

            this.init(configdata);
            this.initEvent();
        }

        public init(configdata) {
            // init
            this.head_group.addChild(new headComment(this, '矿区', 'MINING AREA'));
            this.bg.source = `Bg_MiningArea_Lv${GameData.UserInfo.current_hold_area_grade}_png`;
            this._configdata = configdata;
            this.area_grade.text = GameData.UserInfo.current_hold_area_code + '矿区：v' + GameData.UserInfo.current_hold_area_grade;
            Log(configdata);
            this.config_engine();
            this.check_start_btn_state();
        }

        private config_engine() {
            this.config_excavate_engine_btn.visible = true;
            let configdata = this._configdata;
            let count = 0;
            for (var k in configdata) {
                let item = configdata[k];
                if (item.good_type == ENGINE_TYPE.PANNING) {
                    this.panning_engine.visible = true;
                    this.config_panning_engine_btn.visible = false;
                } else {
                    this['excavate_engine' + count].source = item.good.id_card;
                    this['excavate_engine' + count].visible = true;
                    this['excavate_engine' + count].name = item.id;
                    count++;
                }
            }
            if (this.config_panning_engine_btn.visible || count == 5 || GameData.UserInfo.dig_time != -1) {
                this.config_excavate_engine_btn.visible = false;
            }
        }

        private initEvent() {
            this.addEvent(this.config_panning_engine_btn, egret.TouchEvent.TOUCH_TAP, this, this.showExcavate, [ENGINE_TYPE.PANNING]);
            this.addEvent(this.config_excavate_engine_btn, egret.TouchEvent.TOUCH_TAP, this, this.showExcavate, [ENGINE_TYPE.EXCAVATE]);
            this.addEvent(this.start_dig_btn, egret.TouchEvent.TOUCH_TAP, this, this.start_dig);
            this.addEvent(this.select_close_btn, egret.TouchEvent.TOUCH_TAP, this, () => { this.select_group.visible = false; });
            this.addEvent(this.warehouseList, eui.ItemTapEvent.ITEM_TAP, this, this.intall_excavate_engine);
            this.addEvent(cor.EventManage.instance(), DigMineTime, this, this.check_start_btn_state);
        }

        private showExcavate(type: ENGINE_TYPE) {
            cor.Socket.getIntance().sendmsg('USER_GOOD_LIST', {}, (rdata) => {
                Log(rdata);
                let excavateData = [];
                for (var k in rdata) {
                    if (rdata[k].good.type == type) {
                        excavateData.push(rdata[k]);
                    }
                }
                this.warehouseList.dataProvider = new eui.ArrayCollection(excavateData);
                this.select_group.visible = true;
            }, this)
        }
        private intall_excavate_engine(e: eui.ItemTapEvent) {
            let goodsID = e.item.id;
            let cmd = e.item.good.type == ENGINE_TYPE.EXCAVATE ? 'CONFIG_EXCAVATE_ENGINE' : 'CONFIG_PANNING_ENGINE';

            cor.Socket.getIntance().sendmsg(cmd, {
                "user_good_id": goodsID
            }, (rdata) => {
                this.select_group.visible = false;
                Log(rdata);
                this.refresh();
            }, this)
        }

        private refresh() {
            cor.Socket.getIntance().sendmsg('GET_USER_HOLD_AREA_CONFIG', {}, (rdata) => {
                Log(rdata);
                this._configdata = rdata;
                this.config_engine();
            }, this)
        }

        private start_dig() {
            if (GameData.UserInfo.dig_time == -1) {
                cor.Socket.getIntance().sendmsg('USER_HOLD_AREA_START', {}, (rdata) => {
                    Log(rdata);
                    TipsSkin.instance().show('开始挖矿');
                    GameData.UserInfo.dig_time = 60 * 60 * 4;
                    this.config_excavate_engine_btn.visible = false;
                    // this.start_dig_btn.visible = false;
                    this.check_start_btn_state();
                    cor.EventManage.instance().sendEvent(StartDigMine);
                }, this)
            } else if (GameData.UserInfo.dig_time == 0) {

            } else {

            }
        }

        private check_start_btn_state() {
            if (GameData.UserInfo.dig_time == -1) {
                this.start_dig_btn['tx'].text = "开始挖矿";
                this.start_dig_btn['tx'].stroke = 2;
            } else if (GameData.UserInfo.dig_time == 0) {
                this.start_dig_btn['tx'].text = "领取奖励";
                this.start_dig_btn['tx'].stroke = 2;
            } else {
                this.start_dig_btn['tx'].text = "领取奖励倒计时:\n" + numberToTime(GameData.UserInfo.dig_time * 1000, 1);
                this.start_dig_btn['tx'].stroke = 0;
            }
        }
    }
}
