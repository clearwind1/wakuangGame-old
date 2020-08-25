namespace Game {
    export class GameShare extends cor.BaseScene {
        public readonly skinName = "GameShare";

        public back_btn: eui.Button;
        public labelDisplay: eui.Label;
        public shareUrl_btn: eui.Button;
        public shareFriend_btn: eui.Button;
        public shareGroup_btn: eui.Button;


        constructor() {
            super();

            this.init();
            this.initEvent();
        }

        public init() {
            // init
        }

        private initEvent() {
            this.addEvent(this.back_btn, egret.TouchEvent.TOUCH_TAP, this, this.dispose);
            this.addEvent(this.shareFriend_btn, egret.TouchEvent.TOUCH_TAP, this, this.shareFriend);
            this.addEvent(this.shareGroup_btn, egret.TouchEvent.TOUCH_TAP, this, this.shareGroup);
            this.addEvent(this.shareUrl_btn, egret.TouchEvent.TOUCH_TAP, this, this.shareUrl);
        }

        private shareFriend() {
            egret.ExternalInterface.call("sendToNative", "shareFriend$" + GameData.UserInfo.invitation_code);
        }
        private shareGroup() {
            egret.ExternalInterface.call("sendToNative", "shareGroup$" + GameData.UserInfo.invitation_code);
        }
        private shareUrl() {
            egret.ExternalInterface.call("sendToNative", "shareUrl$" + GameData.UserInfo.invitation_code);
        }
    }
}
