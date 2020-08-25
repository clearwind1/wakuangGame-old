namespace Game {
    export class NewsContant extends cor.BaseScene {
        public readonly skinName = "NewsContant";

        public img: eui.Image;
        public title: eui.Label;
        public time: eui.Label;
        public contants: eui.Label;
        public back: eui.Button;
        public contentScroller: eui.Scroller;

        constructor(newsData) {
            super();

            this.init(newsData);
            this.initEnent();
        }

        public init(newsData) {
            // init
            this.contentScroller.height = this.height - this.contentScroller.y - 10;
            Log(newsData);
            this.title.text = newsData.title;
            this.time.text = newsData.publish_at;
            this.img.source = newsData.thumb;
            this.contants.text = newsData.content;
        }

        private initEnent() {
            this.addEvent(this.back, egret.TouchEvent.TOUCH_TAP, this, this.dispose);
        }
    }
}
