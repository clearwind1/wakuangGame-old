namespace Game {
    export class GoodsInfo extends cor.BaseScene {
        public readonly skinName = "GoodsInfo";

        public goods_name: eui.Label;
        public goods_desc: eui.Label;
        public goods_img: eui.Image;
        public back_btn: eui.Button;


        constructor(goodsInfo) {
            super();

            this.init(goodsInfo);
            this.initEvent();
        }

        public init(goodsInfo) {
            // init
            this.goods_name.text = goodsInfo.name;
            this.goods_desc.text = goodsInfo.description;
            this.goods_img.source = goodsInfo.id_card;
        }

        private initEvent() {
            this.addEvent(this.back_btn, egret.TouchEvent.TOUCH_TAP, this, this.dispose);
        }
    }
}
