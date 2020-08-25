namespace Game {
    export class ResetPassword extends cor.BaseScene {
        public readonly skinName = "ResetPassword";

        public old_password_input: eui.EditableText;
        public new_password_input: eui.EditableText;
        public changePassword_btn: eui.Button;
        public changepassword_cancel_btn: eui.Button;


        constructor() {
            super();

            this.init();
            this.initEnent();
        }

        public init() {
            // init
        }

        private initEnent() {
            this.addEvent(this.changepassword_cancel_btn, egret.TouchEvent.TOUCH_TAP, this, this.dispose);
            this.addEvent(this.changePassword_btn, egret.TouchEvent.TOUCH_TAP, this, this.changePassword);
        }

        private changePassword() {
            if (this.old_password_input.text != GameData.UserPassword) {
                TipsSkin.instance().show("原密码不正确");
                return;
            }
            if (this.new_password_input.text == "") {
                TipsSkin.instance().show("密码不能为空");
                return;
            }
            if (!checkPassword(this.new_password_input.text)) {
                TipsSkin.instance().show('密码格式不正确');
                return;
            }
            if (this.new_password_input.text == this.old_password_input.text) {
                TipsSkin.instance().show('新旧密码相同');
                return;
            }
            cor.Socket.getIntance().sendmsg('UPDATE_USER_PROFILE', {
                "password": this.new_password_input.text
            }, (rdata) => {
                Log(rdata);
                GameData.UserPassword = this.new_password_input.text;
                TipsSkin.instance().show('新密码设置成功');
                this.dispose();
            }, this)
        }
    }
}
