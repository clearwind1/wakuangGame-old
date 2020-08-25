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
    var GameScene = (function (_super) {
        __extends(GameScene, _super);
        function GameScene() {
            var _this = _super.call(this) || this;
            _this.skinName = "GameScene";
            _this._dig_time_int = -1;
            _this._notice_timeTag = null;
            _this._notice_move = false;
            _this.init();
            _this.initEnent();
            _this.getNotice();
            return _this;
        }
        GameScene.prototype.init = function () {
            // init
            if (GameData.UserInfo.identity == IDENTITY.Miner) {
                this.mine_btn.touchEnabled = false;
                this.owner_icon.visible = false;
                this.level.text = GameData.UserInfo.grade;
                this.role.source = 'role_01_png';
            }
            else {
                this.mine_group.visible = false;
                this.level.text = 'v' + GameData.UserInfo.current_hold_area_grade;
                this.role.source = "Lv." + GameData.UserInfo.current_hold_area_grade + "_png";
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
        };
        GameScene.prototype.initEnent = function () {
            var _this = this;
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
            egret.ExternalInterface.addCallback("creatQRCode", function (message) {
                // alert("message from Native is = " + message);
                console.log(message);
                var qr = new eui.Image();
                qr.source = "data:image/png;base64," + message;
                _this.addChild(qr);
            });
        };
        GameScene.prototype.setExpbar = function () {
            this.expbar.width = (GameData.UserInfo.experience / GameData.UserInfo.current_grade_max_experience) * 248;
        };
        /**
         * 公告
         */
        GameScene.prototype.getNotice = function () {
            var _this = this;
            cor.Socket.getIntance().sendmsg('GET_NOTICE', {}, function (rdata) {
                Log(rdata);
                _this.notice_info.text = '暂无公告';
                _this.showNotice();
                if (rdata != null) {
                    _this.notice_info.text = rdata.content;
                }
                _this._notice_timeTag = setTimeout(function () {
                    _this._notice_timeTag = null;
                    _this.hideNotice();
                }, 2000);
            }, this);
        };
        GameScene.prototype.showNotice = function () {
            var _this = this;
            this._notice_move = true;
            egret.Tween.get(this.notice_group).to({ x: 0 }, 300).call(function () { _this._notice_move = false; });
        };
        GameScene.prototype.hideNotice = function () {
            var _this = this;
            this._notice_move = true;
            egret.Tween.get(this.notice_group).to({ x: -311 }, 300).call(function () { _this._notice_move = false; });
        };
        GameScene.prototype.tapNotice = function () {
            if (this._notice_move) {
                return;
            }
            if (this.notice_group.x == 0) {
                if (this._notice_timeTag != null) {
                    clearTimeout(this._notice_timeTag);
                    this._notice_timeTag = null;
                }
                this.hideNotice();
            }
            else {
                if (this.notic_tip_img.visible) {
                    this.notic_tip_img.visible = false;
                }
                this.showNotice();
            }
        };
        GameScene.prototype.noticTip = function (rdata) {
            this.notic_tip_img.visible = true;
            this.notice_info.text = rdata.data;
            egret.Tween.get(this.notic_tip_img).wait(400).to({ alpha: 0 }).wait(100).to({ alpha: 1 }).wait(400).to({ alpha: 0 }).wait(100).to({ alpha: 1 });
        };
        /**
         * 矿区管理处
         */
        GameScene.prototype.showManager = function () {
            cor.Socket.getIntance().sendmsg('HOLD_AREA_LIST', {}, function (rdata) {
                Log(rdata);
                cor.MainScene.instance().addChild(new Game.MineManager(rdata));
            }, this);
        };
        /**
         * 矿区
         */
        GameScene.prototype.showMine = function () {
            cor.Socket.getIntance().sendmsg('GET_USER_HOLD_AREA_CONFIG', {}, function (rdata) {
                Log(rdata);
                cor.MainScene.instance().addChild(new Game.MineArea(rdata));
            }, this);
        };
        /**
         * 工具商店
         */
        GameScene.prototype.showToolsStore = function () {
            cor.Socket.getIntance().sendmsg('STORE_GOOD_LIST', {}, function (rdata) {
                Log(rdata);
                cor.MainScene.instance().addChild(new Game.ToolsStore(rdata));
            }, this);
        };
        /**
         * 仓库
         */
        GameScene.prototype.showWarehouse = function () {
            cor.Socket.getIntance().sendmsg('USER_GOOD_LIST', {}, function (rdata) {
                Log(rdata);
                cor.MainScene.instance().addChild(new Game.Warehouse(rdata));
            }, this);
        };
        /**
         * 服务中心
         */
        GameScene.prototype.showServer_center = function () {
            // egret.ExternalInterface.call("creatQRCode", "test");
            cor.Socket.getIntance().sendmsg('USER_HOLD_AREA_LIST', {}, function (rdata) {
                Log(rdata);
                cor.MainScene.instance().addChild(new Game.MinerServerCenter(rdata));
            }, this);
        };
        /**
         * 交易中心
         */
        GameScene.prototype.showExchange_center = function () {
            cor.Socket.getIntance().sendmsg('EVERY_CONVERT_RECORD', {}, function (rdata) {
                Log(rdata);
                cor.MainScene.instance().addChild(new Game.ExchangeCenter(rdata));
            }, this);
        };
        /**
         * 设置
         */
        GameScene.prototype.showSetting = function () {
            this.addChild(new Game.GameSetting);
        };
        /**
         * 分享
         */
        GameScene.prototype.showShare = function () {
            this.addChild(new Game.GameShare);
        };
        /**
         * 好友
         */
        GameScene.prototype.showFriend = function () {
            var _this = this;
            cor.Socket.getIntance().sendmsg('FRIEND_LIST', {}, function (rdata) {
                Log(rdata);
                _this.addChild(new Game.GameFriend(rdata));
            }, this);
        };
        /**
         * 退出游戏
         */
        GameScene.prototype.exitGame = function () {
            egret.MainContext.instance.stage.setContentSize(750, 1334);
            egret.MainContext.instance.stage.orientation = egret.OrientationMode.PORTRAIT;
            egret.MainContext.instance.stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
            GameData.GameWidth = egret.MainContext.instance.stage.stageWidth;
            GameData.GameHeigth = egret.MainContext.instance.stage.stageHeight;
            if (this._dig_time_int != -1) {
                clearInterval(this._dig_time_int);
            }
            this.dispose();
        };
        /**
         * 改变身份事件
         */
        GameScene.prototype.changeIdentity = function (e) {
            if (GameData.UserInfo.identity == IDENTITY.Owner) {
                this.mine_btn.touchEnabled = true;
                this.mine_group.visible = false;
                this.owner_icon.visible = true;
                this.level.text = 'v' + GameData.UserInfo.current_hold_area_grade;
                this.role.source = "Lv." + GameData.UserInfo.current_hold_area_grade + "_png";
            }
            else {
                this.mine_btn.touchEnabled = false;
                this.mine_group.visible = true;
                this.owner_icon.visible = false;
                this.level.text = GameData.UserInfo.grade;
                this.role.source = 'role_01_png';
            }
        };
        /**
         * 更新用户信息
         */
        GameScene.prototype.updata_info = function () {
            this.nickname.text = GameData.UserInfo.nickname;
        };
        /**
         * 更新游戏信息
         */
        GameScene.prototype.updata_gameinfo = function () {
            this.gst_num.text = GameData.UserInfo.gts_number + '';
            this.mine_num.text = GameData.UserInfo.mineral + '';
        };
        /**
         * 开始挖矿
         */
        GameScene.prototype.startDigMine = function () {
            var _this = this;
            this._dig_time_int = setInterval(function () {
                GameData.UserInfo.dig_time--;
                if (GameData.UserInfo.dig_time <= 0) {
                    GameData.UserInfo.dig_time = 0;
                    clearInterval(_this._dig_time_int);
                    _this._dig_time_int = -1;
                }
                cor.EventManage.instance().sendEvent(DigMineTime);
            }, 1000);
        };
        return GameScene;
    }(cor.BaseScene));
    Game.GameScene = GameScene;
    __reflect(GameScene.prototype, "Game.GameScene");
})(Game || (Game = {}));
//# sourceMappingURL=GameScene.js.map