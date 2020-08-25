namespace Game {
    export class GameScene extends cor.BaseScene {
        public readonly skinName = "GameScene";


        public headMask: eui.Image;
        public headImg: eui.Image;
        public mine_group: eui.Group;
        public expbar: eui.Image;
        public owner_icon: eui.Image;
        public gst_num: eui.Label;
        public mine_num: eui.Label;
        public level: eui.Label;
        public nickname: eui.Label;
        public exitbtn: eui.Button;
        public labelDisplay: eui.Label;
        public mine_btn: eui.Button;
        public tools_store_btn: eui.Button;
        public exchange_center_btn: eui.Button;
        public manager_btn: eui.Button;
        public warehouse_btn: eui.Button;
        public server_center_btn: eui.Button;
        public share_btn: eui.Button;
        public friend_btn: eui.Button;
        public setting_btn: eui.Button;
        public notice_group: eui.Group;
        public email_btn: eui.Button;
        public notice_info: eui.Label;
        public notic_tip_img: eui.Image;
        public role: eui.Image;

        private _dig_time_int = -1;
        constructor() {
            super();

            this.init();
            this.initEnent();
            this.getNotice();
        }

        public init() {
            // init
            if (GameData.UserInfo.identity == IDENTITY.Miner) {
                this.mine_btn.touchEnabled = false;
                this.owner_icon.visible = false;
                this.level.text = GameData.UserInfo.grade;
                this.role.source = 'role_01_png';
            } else {
                this.mine_group.visible = false;
                this.level.text = 'v' + GameData.UserInfo.current_hold_area_grade;
                this.role.source = `Lv.${GameData.UserInfo.current_hold_area_grade}_png`;
            }
            this.headImg.source = GameData.UserInfo.picture;
            this.nickname.text = GameData.UserInfo.nickname;
            this.gst_num.text = GameData.UserInfo.gts_number + '';
            this.mine_num.text = GameData.UserInfo.mineral + '';

            this.setExpbar();

            //颜色矩阵数组
            var colorMatrix = [
                0.3, 0.3, 0, 0, 0,
                0.3, 0.3, 0, 0, 0,
                0.3, 0.3, 0, 0, 0,
                0, 0, 0, 1, 0
            ];

            var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
            // this.friend_btn.filters = [colorFlilter];
            this.share_btn.filters = [colorFlilter];
            // this.exchange_center_btn.filters = [colorFlilter];
            // this.server_center_btn.filters = [colorFlilter];
            // this.mine_btn.filters = [colorFlilter];
            // this.tools_store_btn.filters = [colorFlilter];
            // this.warehouse_btn.filters = [colorFlilter];
            if (typeof (GameData.UserInfo.dig_time) === 'string') {
                GameData.UserInfo.dig_time = TimeTonumber(GameData.UserInfo.dig_time);
            }
            if (GameData.UserInfo.dig_time > 0) {
                this.startDigMine();
            }
        }

        private initEnent() {
            this.addEvent(this.exitbtn, egret.TouchEvent.TOUCH_TAP, this, this.exitGame);
            this.addEvent(this.manager_btn, egret.TouchEvent.TOUCH_TAP, this, this.showManager);
            this.addEvent(this.mine_btn, egret.TouchEvent.TOUCH_TAP, this, this.showMine);
            this.addEvent(this.exchange_center_btn, egret.TouchEvent.TOUCH_TAP, this, this.showExchange_center);
            this.addEvent(this.server_center_btn, egret.TouchEvent.TOUCH_TAP, this, this.showServer_center);
            this.addEvent(this.tools_store_btn, egret.TouchEvent.TOUCH_TAP, this, this.showToolsStore);
            this.addEvent(this.warehouse_btn, egret.TouchEvent.TOUCH_TAP, this, this.showWarehouse);
            this.addEvent(this.email_btn, egret.TouchEvent.TOUCH_TAP, this, this.tapNotice);
            this.addEvent(this.setting_btn, egret.TouchEvent.TOUCH_TAP, this, this.showSetting);
            this.addEvent(this.share_btn, egret.TouchEvent.TOUCH_TAP, this, this.showShare);
            this.addEvent(this.friend_btn, egret.TouchEvent.TOUCH_TAP, this, this.showFriend);
            this.addEvent(cor.EventManage.instance(), ChangeIdentity, this, this.changeIdentity);
            this.addEvent(cor.EventManage.instance(), ExitGame, this, this.exitGame);
            this.addEvent(cor.EventManage.instance(), UpdataUserInfo, this, this.updata_info);
            this.addEvent(cor.EventManage.instance(), UpdataGameInfo, this, this.updata_gameinfo);
            this.addEvent(cor.EventManage.instance(), NEW_NOTICE, this, this.noticTip);
            this.addEvent(cor.EventManage.instance(), StartDigMine, this, this.startDigMine);

            egret.ExternalInterface.addCallback("creatQRCode", (message: string) => {
                // alert("message from Native is = " + message);
                console.log(message);
                let qr = new eui.Image();
                qr.source = "data:image/png;base64," + message;
                this.addChild(qr);
            });
        }

        private setExpbar() {
            this.expbar.width = (GameData.UserInfo.experience / GameData.UserInfo.current_grade_max_experience) * 248;
        }

        /**
         * 公告
         */
        private getNotice() {
            cor.Socket.getIntance().sendmsg('GET_NOTICE', {}, (rdata) => {
                Log(rdata);
                this.notice_info.text = '暂无公告';
                this.showNotice();
                if (rdata != null) {
                    this.notice_info.text = rdata.content;
                }
                this._notice_timeTag = setTimeout(() => {
                    this._notice_timeTag = null;
                    this.hideNotice();
                }, 2000);
            }, this)
        }
        private _notice_timeTag = null;
        private _notice_move = false;
        private showNotice() {
            this._notice_move = true;
            egret.Tween.get(this.notice_group).to({ x: 0 }, 300).call(() => { this._notice_move = false; });
        }
        private hideNotice() {
            this._notice_move = true;
            egret.Tween.get(this.notice_group).to({ x: -311 }, 300).call(() => { this._notice_move = false; });
        }
        private tapNotice() {
            if (this._notice_move) {
                return;
            }
            if (this.notice_group.x == 0) {
                if (this._notice_timeTag != null) {
                    clearTimeout(this._notice_timeTag);
                    this._notice_timeTag = null;
                }
                this.hideNotice();
            } else {
                if (this.notic_tip_img.visible) {
                    this.notic_tip_img.visible = false;
                }
                this.showNotice();
            }
        }
        private noticTip(rdata) {
            this.notic_tip_img.visible = true;
            this.notice_info.text = rdata.data;
            egret.Tween.get(this.notic_tip_img).wait(400).to({ alpha: 0 }).wait(100).to({ alpha: 1 }).wait(400).to({ alpha: 0 }).wait(100).to({ alpha: 1 });
        }
        /**
         * 矿区管理处
         */
        private showManager() {
            cor.Socket.getIntance().sendmsg('HOLD_AREA_LIST', {}, (rdata) => {
                Log(rdata);
                cor.MainScene.instance().addChild(new MineManager(rdata));
            }, this)
        }
        /**
         * 矿区
         */
        private showMine() {
            cor.Socket.getIntance().sendmsg('GET_USER_HOLD_AREA_CONFIG', {}, (rdata) => {
                Log(rdata);
                cor.MainScene.instance().addChild(new MineArea(rdata));
            }, this)
        }
        /**
         * 工具商店
         */
        private showToolsStore() {
            cor.Socket.getIntance().sendmsg('STORE_GOOD_LIST', {}, (rdata) => {
                Log(rdata);
                cor.MainScene.instance().addChild(new ToolsStore(rdata));
            }, this)
        }
        /**
         * 仓库
         */
        private showWarehouse() {
            cor.Socket.getIntance().sendmsg('USER_GOOD_LIST', {}, (rdata) => {
                Log(rdata);
                cor.MainScene.instance().addChild(new Warehouse(rdata));
            }, this)
        }
        /**
         * 服务中心
         */
        private showServer_center() {
            // egret.ExternalInterface.call("creatQRCode", "test");
            cor.Socket.getIntance().sendmsg('USER_HOLD_AREA_LIST', {}, (rdata) => {
                Log(rdata);
                cor.MainScene.instance().addChild(new MinerServerCenter(rdata));
            }, this)
        }
        /**
         * 交易中心
         */
        private showExchange_center() {
            cor.Socket.getIntance().sendmsg('EVERY_CONVERT_RECORD', {}, (rdata) => {
                Log(rdata);
                cor.MainScene.instance().addChild(new ExchangeCenter(rdata));
            }, this)
        }
        /**
         * 设置
         */
        private showSetting() {
            this.addChild(new GameSetting);
        }
        /**
         * 分享
         */
        private showShare() {
            this.addChild(new GameShare);
        }
        /**
         * 好友
         */
        private showFriend() {
            cor.Socket.getIntance().sendmsg('FRIEND_LIST', {}, (rdata) => {
                Log(rdata);
                this.addChild(new GameFriend(rdata));
            }, this)

        }
        /**
         * 退出游戏
         */
        private exitGame() {
            egret.MainContext.instance.stage.setContentSize(750, 1334);
            egret.MainContext.instance.stage.orientation = egret.OrientationMode.PORTRAIT;
            egret.MainContext.instance.stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;

            GameData.GameWidth = egret.MainContext.instance.stage.stageWidth;
            GameData.GameHeigth = egret.MainContext.instance.stage.stageHeight;

            if (this._dig_time_int != -1) {
                clearInterval(this._dig_time_int);
            }

            this.dispose();
        }
        /**
         * 改变身份事件
         */
        private changeIdentity(e) {
            if (GameData.UserInfo.identity == IDENTITY.Owner) {
                this.mine_btn.touchEnabled = true;
                this.mine_group.visible = false;
                this.owner_icon.visible = true;
                this.level.text = 'v' + GameData.UserInfo.current_hold_area_grade;
                this.role.source = `Lv.${GameData.UserInfo.current_hold_area_grade}_png`;
            } else {
                this.mine_btn.touchEnabled = false;
                this.mine_group.visible = true;
                this.owner_icon.visible = false;
                this.level.text = GameData.UserInfo.grade;
                this.role.source = 'role_01_png';
            }

        }
        /**
         * 更新用户信息
         */
        private updata_info() {
            this.nickname.text = GameData.UserInfo.nickname;
        }
        /**
         * 更新游戏信息
         */
        private updata_gameinfo() {
            this.gst_num.text = GameData.UserInfo.gts_number + '';
            this.mine_num.text = GameData.UserInfo.mineral + '';
        }
        /**
         * 开始挖矿
         */
        private startDigMine() {
            this._dig_time_int = setInterval(() => {
                GameData.UserInfo.dig_time--;
                if (GameData.UserInfo.dig_time <= 0) {
                    GameData.UserInfo.dig_time = 0;
                    clearInterval(this._dig_time_int);
                    this._dig_time_int = -1;
                }
                cor.EventManage.instance().sendEvent(DigMineTime);
            }, 1000);
        }
    }
}
