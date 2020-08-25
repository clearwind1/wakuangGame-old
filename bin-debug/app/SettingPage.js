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
    var SettingPage = (function (_super) {
        __extends(SettingPage, _super);
        function SettingPage() {
            var _this = _super.call(this) || this;
            _this.skinName = "SettingPage";
            _this.init();
            _this.initEnent();
            return _this;
        }
        SettingPage.prototype.init = function () {
            // init
            if (GameData.UserPassword === "") {
                this.reset_password_btn.visible = false;
            }
        };
        SettingPage.prototype.initEnent = function () {
            this.addEvent(this.back_btn, egret.TouchEvent.TOUCH_TAP, this, this.dispose);
            this.addEvent(this.info_setting_btn, egret.TouchEvent.TOUCH_TAP, this, this.showInfoSetting);
            this.addEvent(this.exit_login_btn, egret.TouchEvent.TOUCH_TAP, this, this.exit_login);
            this.addEvent(this.reset_password_btn, egret.TouchEvent.TOUCH_TAP, this, this.reset_password);
        };
        SettingPage.prototype.showInfoSetting = function () {
            cor.MainScene.instance().addChild(new Game.InfoSettingPage);
        };
        SettingPage.prototype.exit_login = function () {
            cor.MainScene.instance().clearScene();
            cor.MainScene.instance().addChild(new Game.LoginSkin);
            cor.Socket.getIntance().changeUrl();
        };
        SettingPage.prototype.reset_password = function () {
            cor.MainScene.instance().addChild(new Game.ResetPassword);
        };
        return SettingPage;
    }(cor.BaseScene));
    Game.SettingPage = SettingPage;
    __reflect(SettingPage.prototype, "Game.SettingPage");
})(Game || (Game = {}));
//# sourceMappingURL=SettingPage.js.map