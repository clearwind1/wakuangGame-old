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
    var LoginSkin = (function (_super) {
        __extends(LoginSkin, _super);
        function LoginSkin() {
            var _this = _super.call(this) || this;
            _this.skinName = "LoginSkin";
            _this.regist_state = 0;
            _this.isRestPsw = false;
            _this.code_key = '';
            _this.regist_code_Int = -1;
            _this.reset_code_Int = -1;
            _this.regist_code_time = 0;
            _this.reset_code_time = 0;
            _this.init();
            _this.initEnent();
            _this.showPhoneLgRe();
            return _this;
        }
        LoginSkin.prototype.init = function () {
            // init
            if (readLocalData(UserPhone)) {
                this.phone_input.text = readLocalData(UserPhone);
            }
        };
        LoginSkin.prototype.initEnent = function () {
            this.addEvent(this.wx_lg_btn, egret.TouchEvent.TOUCH_TAP, this, this.wxLogin);
            this.addEvent(this.lg_btn, egret.TouchEvent.TOUCH_TAP, this, this.phoneLogin);
            this.addEvent(this.nextstep_btn, egret.TouchEvent.TOUCH_TAP, this, this.nextstep);
            this.addEvent(this.sure_login_btn, egret.TouchEvent.TOUCH_TAP, this, this.sendLogin);
            //注册
            this.addEvent(this.back_btn, egret.TouchEvent.TOUCH_TAP, this, this.backHome);
            // this.addEvent(this.regist_now_btn, egret.TouchEvent.TOUCH_TAP, this, this.phoneRegist);
            this.addEvent(this.lost_password_btn, egret.TouchEvent.TOUCH_TAP, this, this.RestPassword);
            this.addEvent(this.code_btn, egret.TouchEvent.TOUCH_TAP, this, this.sendCode);
            this.addEvent(this.reset_code_btn, egret.TouchEvent.TOUCH_TAP, this, this.sendCode);
            this.addEvent(this.regist_btn, egret.TouchEvent.TOUCH_TAP, this, this.sendRegist);
        };
        LoginSkin.prototype.backHome = function () {
            switch (this.regist_state) {
                case 1:
                case 2:
                    this.regist_state--;
                    break;
                case 3:
                    this.regist_state = 1;
                    break;
            }
            this.showPhoneLgRe();
        };
        //微信登录
        LoginSkin.prototype.wxLogin = function () {
            var _this = this;
            // TipsSkin.instance().show("暂未开放,请使用手机账号登录");
            // return;
            cor.Socket.getIntance().sendmsg('LOGIN', {
                "mobile": '15017557355',
                "password": '123456'
            }, function (rdata) {
                Game.TipsSkin.instance().show("登录成功");
                _this.dispose();
                cor.MainScene.instance().addChild(new Game.HomePage());
            }, this);
        };
        //手机账号登录
        LoginSkin.prototype.phoneLogin = function () {
            this.regist_state = 1;
            this.showPhoneLgRe();
        };
        LoginSkin.prototype.nextstep = function () {
            var _this = this;
            if (!checkPhone(this.phone_input.text)) {
                Game.TipsSkin.instance().show('手机格式不正确');
                return;
            }
            cor.Socket.getIntance().sendmsg('CHECK_MOBILE', {
                "mobile": this.phone_input.text
            }, function (rdata) {
                if (rdata) {
                    _this.regist_state = 2;
                    _this.showPhoneLgRe();
                }
                else {
                    _this.regist_state = 3;
                    _this.showPhoneLgRe();
                }
            }, this, false);
        };
        //手机账号注册
        LoginSkin.prototype.phoneRegist = function () {
            this.regist_state = 2;
            this.showPhoneLgRe();
            this.isRestPsw = false;
            this.regist_btn['wz'].text = "注册";
            this.reset_code_btn.visible = false;
            this.code_btn.visible = true;
            this.invite_group.visible = true;
        };
        //重置密码
        LoginSkin.prototype.RestPassword = function () {
            this.regist_state = 3;
            this.showPhoneLgRe();
            this.isRestPsw = true;
            this.regist_btn['wz'].text = "重置密码";
            this.reset_code_btn.visible = true;
            this.code_btn.visible = false;
            this.invite_group.visible = false;
        };
        //发送验证码
        LoginSkin.prototype.sendCode = function () {
            var _this = this;
            var type = "register";
            if (this.isRestPsw) {
                type = "force_password";
            }
            cor.Socket.getIntance().sendmsg('SEND_SMS_CODE', {
                "mobile": this.phone_input.text,
                "type": type
            }, function (rdata) {
                _this.code_key = rdata.key;
                if (_this.isRestPsw) {
                    if (_this.reset_code_time > 0) {
                        return;
                    }
                    _this.reset_code_time = 60;
                    _this.reset_code_btn['wz'].text = _this.reset_code_time + '秒后重新获取';
                    _this.reset_code_btn['wz'].size = 18;
                    _this.reset_code_Int = setInterval(function () {
                        _this.reset_code_time--;
                        _this.reset_code_btn['wz'].text = _this.reset_code_time + '秒后重新获取';
                        if (_this.reset_code_time == 0) {
                            clearInterval(_this.reset_code_Int);
                            _this.reset_code_btn['wz'].text = "获取验证码";
                            _this.reset_code_btn['wz'].size = 18;
                        }
                    }, 1000);
                }
                else {
                    if (_this.regist_code_time > 0) {
                        return;
                    }
                    _this.regist_code_time = 60;
                    _this.code_btn['wz'].text = _this.regist_code_time + '秒后重新获取';
                    _this.code_btn['wz'].size = 18;
                    _this.regist_code_Int = setInterval(function () {
                        _this.regist_code_time--;
                        _this.code_btn['wz'].text = _this.regist_code_time + '秒后重新获取';
                        if (_this.regist_code_time == 0) {
                            clearInterval(_this.regist_code_Int);
                            _this.code_btn['wz'].text = "获取验证码";
                            _this.code_btn['wz'].size = 20;
                        }
                    }, 1000);
                }
            }, this);
        };
        //注册
        LoginSkin.prototype.sendRegist = function () {
            var _this = this;
            if (!checkPassword(this.regist_psw_input.text)) {
                Game.TipsSkin.instance().show('密码格式不正确');
                return;
            }
            if (this.isRestPsw) {
                cor.Socket.getIntance().sendmsg('FORGET_PASSWORD', {
                    "mobile": this.phone_input.text,
                    "code": this.code_input.text,
                    "key": this.code_key,
                    "password": this.regist_psw_input.text
                }, function (rdata) {
                    Game.TipsSkin.instance().show("重置密码成功");
                    _this.regist_state = 2;
                    _this.showPhoneLgRe();
                }, this);
            }
            else {
                cor.Socket.getIntance().sendmsg('REGISTER', {
                    "mobile": this.phone_input.text,
                    "code": this.code_input.text,
                    "key": this.code_key,
                    "invitation_code": this.invite_input.text,
                    "password": this.regist_psw_input.text
                }, function (rdata) {
                    Game.TipsSkin.instance().show("注册成功");
                    // this.regist_state = 2;
                    // this.showPhoneLgRe();
                    _this.paswd_input.text = _this.regist_psw_input.text;
                    _this.sendLogin();
                }, this);
            }
        };
        //手机登录
        LoginSkin.prototype.sendLogin = function () {
            var _this = this;
            cor.Socket.getIntance().sendmsg('LOGIN', {
                "mobile": this.phone_input.text,
                "password": this.paswd_input.text
            }, function (rdata) {
                Game.TipsSkin.instance().show("登录成功");
                GameData.UserPhone = _this.phone_input.text;
                GameData.UserPassword = _this.paswd_input.text;
                saveLocalData(UserPhone, GameData.UserPhone);
                _this.dispose();
                cor.MainScene.instance().addChild(new Game.HomePage());
            }, this);
        };
        LoginSkin.prototype.showPhoneLgRe = function () {
            if (this.regist_state == 0) {
                this.login_group.visible = false;
                this.lg_group.visible = true;
            }
            else {
                this.login_group.visible = true;
                this.lg_group.visible = false;
            }
            switch (this.regist_state) {
                case 1:
                    this.phone_group.visible = true;
                    this.password_group.visible = this.regist_group.visible = false;
                    break;
                case 2:
                    this.password_group.visible = true;
                    this.phone_group.visible = this.regist_group.visible = false;
                    this.paswd_input.text = "";
                    break;
                case 3:
                    this.regist_group.visible = true;
                    this.phone_group.visible = this.password_group.visible = false;
                    this.regist_psw_input.text = "";
                    this.code_input.text = "";
                    break;
            }
        };
        return LoginSkin;
    }(cor.BaseScene));
    Game.LoginSkin = LoginSkin;
    __reflect(LoginSkin.prototype, "Game.LoginSkin");
})(Game || (Game = {}));
//# sourceMappingURL=LoginSkin.js.map