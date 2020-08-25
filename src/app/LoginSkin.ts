namespace Game {
    export class LoginSkin extends cor.BaseScene {
        public readonly skinName = "LoginSkin";

        public bg: eui.Image;
        public wz_wk: eui.Label;
        public lg_group: eui.Group;
        public wx_lg_btn: eui.Button;
        public lg_btn: eui.Button;
        public wz_more: eui.Label;
        public login_group: eui.Group;
        public back_btn: eui.Button;
        public phone_group: eui.Group;
        public phone_input: eui.EditableText;
        public nextstep_btn: eui.Button;
        public password_group: eui.Group;
        public paswd_input: eui.EditableText;
        public sure_login_btn: eui.Button;
        public lost_password_btn: eui.Button;
        public regist_group: eui.Group;
        public code_input: eui.EditableText;
        public regist_psw_input: eui.EditableText;
        public regist_btn: eui.Button;
        public code_btn: eui.Button;
        public reset_code_btn: eui.Button;
        public wz_pawtip: eui.Label;
        public invite_group: eui.Group;
        public invite_input: eui.EditableText;

        private regist_state = 0;
        private isRestPsw = false;

        private code_key = '';
        private regist_code_Int = -1;
        private reset_code_Int = -1;
        private regist_code_time = 0;
        private reset_code_time = 0;

        constructor() {
            super();

            this.init();
            this.initEnent();
            this.showPhoneLgRe();
        }

        public init() {
            // init
            if (readLocalData(UserPhone)) {
                this.phone_input.text = readLocalData(UserPhone);
            }
        }

        private initEnent() {
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
        }

        private backHome() {
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
        }

        //微信登录
        private wxLogin() {
            // TipsSkin.instance().show("暂未开放,请使用手机账号登录");
            // return;
            cor.Socket.getIntance().sendmsg('LOGIN', {
                "mobile": '15017557355',
                "password": '123456'
            }, (rdata) => {
                TipsSkin.instance().show("登录成功");
                this.dispose();
                cor.MainScene.instance().addChild(new HomePage());
            }, this)
        }
        //手机账号登录
        private phoneLogin() {
            this.regist_state = 1;
            this.showPhoneLgRe();
        }
        private nextstep() {
            if (!checkPhone(this.phone_input.text)) {
                TipsSkin.instance().show('手机格式不正确');
                return;
            }
            cor.Socket.getIntance().sendmsg('CHECK_MOBILE', {
                "mobile": this.phone_input.text
            }, (rdata) => {
                if (rdata) {
                    this.regist_state = 2;
                    this.showPhoneLgRe();
                } else {
                    this.regist_state = 3;
                    this.showPhoneLgRe();
                }
            }, this, false)

        }
        //手机账号注册
        private phoneRegist() {
            this.regist_state = 2;
            this.showPhoneLgRe();
            this.isRestPsw = false;
            this.regist_btn['wz'].text = "注册";
            this.reset_code_btn.visible = false;
            this.code_btn.visible = true;
            this.invite_group.visible = true;
        }
        //重置密码
        private RestPassword() {
            this.regist_state = 3;
            this.showPhoneLgRe();
            this.isRestPsw = true;
            this.regist_btn['wz'].text = "重置密码";
            this.reset_code_btn.visible = true;
            this.code_btn.visible = false;
            this.invite_group.visible = false;
        }
        //发送验证码
        private sendCode() {
            let type = "register";
            if (this.isRestPsw) {
                type = "force_password";
            }
            cor.Socket.getIntance().sendmsg('SEND_SMS_CODE', {
                "mobile": this.phone_input.text,
                "type": type
            }, (rdata) => {
                this.code_key = rdata.key;
                if (this.isRestPsw) {
                    if (this.reset_code_time > 0) {
                        return;
                    }
                    this.reset_code_time = 60;
                    this.reset_code_btn['wz'].text = this.reset_code_time + '秒后重新获取';
                    this.reset_code_btn['wz'].size = 18;
                    this.reset_code_Int = setInterval(() => {
                        this.reset_code_time--;
                        this.reset_code_btn['wz'].text = this.reset_code_time + '秒后重新获取';
                        if (this.reset_code_time == 0) {
                            clearInterval(this.reset_code_Int);
                            this.reset_code_btn['wz'].text = "获取验证码";
                            this.reset_code_btn['wz'].size = 18;
                        }
                    }, 1000);
                } else {
                    if (this.regist_code_time > 0) {
                        return;
                    }
                    this.regist_code_time = 60;
                    this.code_btn['wz'].text = this.regist_code_time + '秒后重新获取';
                    this.code_btn['wz'].size = 18;
                    this.regist_code_Int = setInterval(() => {
                        this.regist_code_time--;
                        this.code_btn['wz'].text = this.regist_code_time + '秒后重新获取';
                        if (this.regist_code_time == 0) {
                            clearInterval(this.regist_code_Int);
                            this.code_btn['wz'].text = "获取验证码";
                            this.code_btn['wz'].size = 20;
                        }
                    }, 1000);
                }
            }, this);
        }
        //注册
        private sendRegist() {
            if (!checkPassword(this.regist_psw_input.text)) {
                TipsSkin.instance().show('密码格式不正确');
                return;
            }
            if (this.isRestPsw) {
                cor.Socket.getIntance().sendmsg('FORGET_PASSWORD', {
                    "mobile": this.phone_input.text,
                    "code": this.code_input.text,
                    "key": this.code_key,
                    "password": this.regist_psw_input.text
                }, (rdata) => {
                    TipsSkin.instance().show("重置密码成功");
                    this.regist_state = 2;
                    this.showPhoneLgRe();
                }, this)
            } else {
                cor.Socket.getIntance().sendmsg('REGISTER', {
                    "mobile": this.phone_input.text,
                    "code": this.code_input.text,
                    "key": this.code_key,
                    "invitation_code": this.invite_input.text,
                    "password": this.regist_psw_input.text
                }, (rdata) => {
                    TipsSkin.instance().show("注册成功");
                    // this.regist_state = 2;
                    // this.showPhoneLgRe();
                    this.paswd_input.text = this.regist_psw_input.text;
                    this.sendLogin();
                }, this)
            }

        }
        //手机登录
        private sendLogin() {
            cor.Socket.getIntance().sendmsg('LOGIN', {
                "mobile": this.phone_input.text,
                "password": this.paswd_input.text
            }, (rdata) => {
                TipsSkin.instance().show("登录成功");
                GameData.UserPhone = this.phone_input.text;
                GameData.UserPassword = this.paswd_input.text;
                saveLocalData(UserPhone, GameData.UserPhone);
                this.dispose();
                cor.MainScene.instance().addChild(new HomePage());
            }, this)

        }

        private showPhoneLgRe() {
            if (this.regist_state == 0) {
                this.login_group.visible = false;
                this.lg_group.visible = true;
            } else {
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
        }
    }
}
