namespace Game {
    export class SettingPage extends cor.BaseScene {
        public readonly skinName = "SettingPage";

        public back_btn: eui.Image;
        public message_tip: eui.Label;
        public reset_password_btn: eui.Button;
        public info_setting_btn: eui.Button;
        public message_tip_btn: eui.Button;
        public exit_login_btn: eui.Button;


        constructor() {
            super();

            this.init();
            this.initEnent();
        }

        public init() {
            // init
            if (GameData.UserPassword === "") {
                this.reset_password_btn.visible = false;
            }
        }

        private initEnent() {
            this.addEvent(this.back_btn, egret.TouchEvent.TOUCH_TAP, this, this.dispose);
            this.addEvent(this.info_setting_btn, egret.TouchEvent.TOUCH_TAP, this, this.showInfoSetting);
            this.addEvent(this.exit_login_btn, egret.TouchEvent.TOUCH_TAP, this, this.exit_login);
            this.addEvent(this.reset_password_btn, egret.TouchEvent.TOUCH_TAP, this, this.reset_password);
        }

        private showInfoSetting() {
            cor.MainScene.instance().addChild(new InfoSettingPage);
        }

        private exit_login() {
            cor.MainScene.instance().clearScene();
            cor.MainScene.instance().addChild(new LoginSkin);
            cor.Socket.getIntance().changeUrl();
        }

        private reset_password() {
            cor.MainScene.instance().addChild(new ResetPassword);            
        }
    }
}
