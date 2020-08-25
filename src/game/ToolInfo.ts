namespace Game {
    export class ToolInfo extends cor.BaseScene {
        public readonly skinName = "ToolInfo";

        public goods_name: eui.Label;
        public goods_desc: eui.Label;
        public goods_num: eui.Label;
        public goods_funtion: eui.Label;
        public goods_img: eui.Image;
        public back_btn: eui.Button;
        public buy_one_btn: eui.Button;
        public sub_btn: eui.Button;
        public add_btn: eui.Button;

        private _goodsId;
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
            this.buy_one_btn.label = goodsInfo.price;
            this._goodsId = goodsInfo.id;
            this.goods_num.text = `1`;
        }

        private initEvent() {
            this.addEvent(this.back_btn, egret.TouchEvent.TOUCH_TAP, this, this.dispose);
            this.addEvent(this.buy_one_btn, egret.TouchEvent.TOUCH_TAP, this, this.buy_one);
            this.addEvent(this.sub_btn, egret.TouchEvent.TOUCH_TAP, this, this.sub);
            this.addEvent(this.add_btn, egret.TouchEvent.TOUCH_TAP, this, this.add);
        }

        private add() {
            let cur_num = Number(this.goods_num.text);
            if (cur_num < 10) {
                cur_num++;
                this.goods_num.text = cur_num + '';
            }
        }
        private sub() {
            let cur_num = Number(this.goods_num.text);
            if (cur_num > 1) {
                cur_num--;
                this.goods_num.text = cur_num + '';
            }
        }

        private buy_one() {
            let cur_num = Number(this.goods_num.text);
            let price = Number(this.buy_one_btn.label.split('GST')[0]) * cur_num;
            cor.Socket.getIntance().sendmsg('BUY_GOOD', {
                "good_id": this._goodsId,
                "number": cur_num
            }, (rdata) => {
                TipsSkin.instance().show('租用成功');
                GameData.UserInfo.gts_number -= price;
                cor.EventManage.instance().sendEvent(UpdataGameInfo);
                this.dispose();
            }, this)
        }
    }
}
