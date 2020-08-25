namespace Game {
    export class headComment extends cor.BaseScene {
        public readonly skinName = "headComment";

        public gst_num: eui.Label;
        public mine_num: eui.Label;
        public back_btn: eui.Button;
        public title_en: eui.Label;
        public title: eui.Label;

        constructor(parent: cor.BaseScene, title, title_en) {
            super();

            this.init(title, title_en);
            this.initEvent(parent);
        }

        public init( title, title_en) {
            // init
            this.gst_num.text = GameData.UserInfo.gts_number + '';
            this.mine_num.text = GameData.UserInfo.mineral + '';
            this.title.text = title;
            this.title_en.text = title_en;
        }

        private initEvent(parent: cor.BaseScene) {
            this.addEvent(this.back_btn, egret.TouchEvent.TOUCH_TAP, this, () => {
                this.dispose();
                parent.dispose();
            });
            this.addEvent(cor.EventManage.instance(), UpdataGameInfo, this, this.updata_gameinfo);
        }
        /**
         * 更新游戏信息
         */
        private updata_gameinfo() {
            this.gst_num.text = GameData.UserInfo.gts_number + '';
            this.mine_num.text = GameData.UserInfo.mineral + '';
        }
    }
}
