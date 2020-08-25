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
    var InfoSettingPage = (function (_super) {
        __extends(InfoSettingPage, _super);
        function InfoSettingPage() {
            var _this = _super.call(this) || this;
            _this.skinName = "InfoSettingPage";
            _this.init();
            _this.initEnent();
            return _this;
        }
        InfoSettingPage.prototype.init = function () {
            // init
            this.headImg.mask = this.headMask;
            this.headImg.source = GameData.UserInfo.picture;
            this.nickname.text = GameData.UserInfo.nickname;
            this.sex.text = GameData.UserInfo.sex == SEX.Man ? "男" : "女";
            this.birth.text = GameData.UserInfo.birthday;
            this.reset_head_btn.visible = false;
            this._radioGroup = new eui.RadioButtonGroup();
            this.rdb_man.group = this._radioGroup;
            this.rdb_woman.group = this._radioGroup;
        };
        InfoSettingPage.prototype.initEnent = function () {
            var _this = this;
            this.addEvent(this.back_btn, egret.TouchEvent.TOUCH_TAP, this, this.dispose);
            this.addEvent(this.reset_head_btn, egret.TouchEvent.TOUCH_TAP, this, this.selectImg);
            this.addEvent(this.reset_nickname_btn, egret.TouchEvent.TOUCH_TAP, this, this.reset_nickname);
            this.addEvent(this.nickname_cancel_btn, egret.TouchEvent.TOUCH_TAP, this, function () { _this.change_nickname_group.visible = false; });
            this.addEvent(this.changeNickname_btn, egret.TouchEvent.TOUCH_TAP, this, this.changeNickname);
            this.addEvent(this.reset_sex_btn, egret.TouchEvent.TOUCH_TAP, this, this.reset_sex);
            this.addEvent(this.changeSex_cancel_btn, egret.TouchEvent.TOUCH_TAP, this, function () { _this.change_sex_group.visible = false; });
            this.addEvent(this.changeSex_btn, egret.TouchEvent.TOUCH_TAP, this, this.changeSex);
            this.addEvent(this._radioGroup, eui.UIEvent.CHANGE, this, function (evt) {
                var radioGroup = evt.target;
                _this._sex_select = radioGroup.selectedValue;
            });
            this.addEvent(this.reset_birth_btn, egret.TouchEvent.TOUCH_TAP, this, this.reset_birth);
            this.addEvent(this.changeBirth_cancel_btn, egret.TouchEvent.TOUCH_TAP, this, function () { _this.change_birth_group.visible = false; });
            this.addEvent(this.changeBirth_btn, egret.TouchEvent.TOUCH_TAP, this, this.changeBirth);
            this.addEvent(this.year_select, egret.TouchEvent.TOUCH_TAP, this, this.showSelect, [0]);
            this.addEvent(this.month_select, egret.TouchEvent.TOUCH_TAP, this, this.showSelect, [1]);
            this.addEvent(this.day_select, egret.TouchEvent.TOUCH_TAP, this, this.showSelect, [2]);
            this.addEvent(this.birth_list, eui.ItemTapEvent.ITEM_TAP, this, this.itemSelect);
            // this.addEvent(cor.EventManage.instance(), UpdataHead, this, this.updata_head);
            egret.ExternalInterface.addCallback("selectImg_head_result", function (message) {
                Game.TipsSkin.instance().show(message);
                cor.Socket.getIntance().sendmsg('UPDATE_USER_PROFILE', {
                    "picture": "data:image/png;base64," + message
                }, function (rdata) {
                    Log(rdata);
                    GameData.UserInfo = rdata;
                    cor.EventManage.instance().sendEvent(UpdataUserInfo);
                }, _this);
            });
        };
        InfoSettingPage.prototype.selectImg = function () {
            egret.ExternalInterface.call("sendToNative", "selectImg$0");
        };
        InfoSettingPage.prototype.updata_head = function () {
            this.headImg.source = GameData.UserInfo.picture;
        };
        InfoSettingPage.prototype.reset_nickname = function () {
            this.change_nickname_group.visible = true;
            this.nickname_input.text = "";
            this.nickname_input.prompt = GameData.UserInfo.nickname;
        };
        InfoSettingPage.prototype.changeNickname = function () {
            var _this = this;
            cor.Socket.getIntance().sendmsg('UPDATE_USER_PROFILE', {
                "nickname": this.nickname_input.text
            }, function (rdata) {
                Log(rdata);
                GameData.UserInfo = rdata;
                cor.EventManage.instance().sendEvent(UpdataUserInfo);
                _this.nickname.text = GameData.UserInfo.nickname;
                _this.change_nickname_group.visible = false;
            }, this);
        };
        InfoSettingPage.prototype.reset_sex = function () {
            this.change_sex_group.visible = true;
            GameData.UserInfo.sex == SEX.Man ? (this.rdb_man.selected = true) : (this.rdb_woman.selected = true);
        };
        InfoSettingPage.prototype.changeSex = function () {
            var _this = this;
            cor.Socket.getIntance().sendmsg('UPDATE_USER_PROFILE', {
                "sex": this._sex_select
            }, function (rdata) {
                Log(rdata);
                GameData.UserInfo = rdata;
                _this.sex.text = GameData.UserInfo.sex == SEX.Man ? "男" : "女";
                _this.change_sex_group.visible = false;
            }, this);
        };
        InfoSettingPage.prototype.reset_birth = function () {
            this.change_birth_group.visible = true;
            this.birth_list.dataProvider = new eui.ArrayCollection();
            this.birth_scroller.visible = false;
            var birthday = GameData.UserInfo.birthday.split('-');
            this.year_select.text = birthday[0];
            this.month_select.text = birthday[1];
            this.day_select.text = birthday[2];
        };
        InfoSettingPage.prototype.showSelect = function (type) {
            var bx = 176 + 155 * type;
            if (bx == this.birth_scroller.x && this.birth_scroller.visible) {
                this.birth_scroller.visible = false;
                return;
            }
            this.birth_scroller.visible = true;
            this.birth_scroller.x = bx;
            this.birth_scroller.viewport.scrollV = 0;
            this.birth_scroller.stopAnimation();
            var start = 0;
            var end = 2000;
            switch (type) {
                case 0:
                    start = 1920;
                    end = 2001;
                    break;
                case 1:
                    start = 1;
                    end = 12;
                    break;
                case 2:
                    start = 1;
                    end = 31;
                    break;
            }
            var birthdata = [];
            for (var i = start; i < end; i++) {
                var num = i < 10 ? '0' + i : '' + i;
                birthdata.push({ num: num, type: type });
            }
            this.birth_list.dataProvider = new eui.ArrayCollection(birthdata);
        };
        InfoSettingPage.prototype.itemSelect = function (e) {
            var item = e.item;
            switch (item.type) {
                case 0:
                    this.year_select.text = item.num;
                    break;
                case 1:
                    this.month_select.text = item.num;
                    break;
                case 2:
                    this.day_select.text = item.num;
                    break;
            }
            this.birth_list.dataProvider = new eui.ArrayCollection();
            this.birth_scroller.visible = false;
        };
        InfoSettingPage.prototype.changeBirth = function () {
            var _this = this;
            var birth = this.year_select.text + '-' + this.month_select.text + '-' + this.day_select.text;
            cor.Socket.getIntance().sendmsg('UPDATE_USER_PROFILE', {
                "birthday": birth
            }, function (rdata) {
                Log(rdata);
                GameData.UserInfo = rdata;
                _this.birth.text = GameData.UserInfo.birthday;
                _this.change_birth_group.visible = false;
            }, this);
        };
        return InfoSettingPage;
    }(cor.BaseScene));
    Game.InfoSettingPage = InfoSettingPage;
    __reflect(InfoSettingPage.prototype, "Game.InfoSettingPage");
})(Game || (Game = {}));
//# sourceMappingURL=InfoSettingPage.js.map