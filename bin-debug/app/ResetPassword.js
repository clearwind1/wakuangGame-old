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
    var ResetPassword = (function (_super) {
        __extends(ResetPassword, _super);
        function ResetPassword() {
            var _this = _super.call(this) || this;
            _this.skinName = "ResetPassword";
            _this.init();
            _this.initEnent();
            return _this;
        }
        ResetPassword.prototype.init = function () {
            // init
        };
        ResetPassword.prototype.initEnent = function () {
            this.addEvent(this.changepassword_cancel_btn, egret.TouchEvent.TOUCH_TAP, this, this.dispose);
            this.addEvent(this.changePassword_btn, egret.TouchEvent.TOUCH_TAP, this, this.changePassword);
        };
        ResetPassword.prototype.changePassword = function () {
            var _this = this;
            if (this.old_password_input.text != GameData.UserPassword) {
                Game.TipsSkin.instance().show("原密码不正确");
                return;
            }
            if (this.new_password_input.text == "") {
                Game.TipsSkin.instance().show("密码不能为空");
                return;
            }
            if (!checkPassword(this.new_password_input.text)) {
                Game.TipsSkin.instance().show('密码格式不正确');
                return;
            }
            if (this.new_password_input.text == this.old_password_input.text) {
                Game.TipsSkin.instance().show('新旧密码相同');
                return;
            }
            cor.Socket.getIntance().sendmsg('UPDATE_USER_PROFILE', {
                "password": this.new_password_input.text
            }, function (rdata) {
                Log(rdata);
                GameData.UserPassword = _this.new_password_input.text;
                Game.TipsSkin.instance().show('新密码设置成功');
                _this.dispose();
            }, this);
        };
        return ResetPassword;
    }(cor.BaseScene));
    Game.ResetPassword = ResetPassword;
    __reflect(ResetPassword.prototype, "Game.ResetPassword");
})(Game || (Game = {}));
//# sourceMappingURL=ResetPassword.js.map