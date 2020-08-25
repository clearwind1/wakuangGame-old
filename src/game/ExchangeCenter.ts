namespace Game {
    export class ExchangeCenter extends cor.BaseScene {
        public readonly skinName = "ExchangeCenter";

        public head_group: eui.Group;
        public exchange_btn: eui.Button;
        public recode_btn: eui.Button;
        public rateTx: eui.Label;
        public exchangeRate: eui.Label;
        public exchange_num: eui.EditableText;
        public date_group: eui.Group;
        public rate_group: eui.Group;
        public sharp_group: eui.Group;
        public point_group: eui.Group;
        public line_group: eui.Group;
        public role: eui.Image;
        public rdcode_group: eui.Group;
        public recode_list: eui.List;
        public close_btn: eui.Image;

        private _exchangedata;
        private _today_rate;
        constructor(exchangedata) {
            super();

            this.init(exchangedata);
            this.initEvent();
        }

        public init(exchangedata) {
            // init
            this.exchange_num.restrict = "0-9";
            this._exchangedata = exchangedata;
            this.head_group.addChild(new headComment(this, '矿石交易所', 'ORE EXCHANGE'));

            let sortexd = [];
            for (let i = 0; i < 7; i++) {
                sortexd.push(exchangedata[i]);
            }
            sortexd.sort(compare('value', false));
            Log(sortexd);

            let lastSY = 0;
            for (let i = 0; i < 7; i++) {
                let datelb = this.date_group.getChildAt(i) as eui.Label;
                datelb.text = exchangedata[i].date.substr(5);
                let exchangeratelb = this.rate_group.getChildAt(i) as eui.Label;
                exchangeratelb.text = exchangedata[i].value + '';
                let sharp = this.sharp_group.getChildAt(i) as eui.Image;
                sharp.scaleY = 0;
                let endSY = exchangedata[i].value / sortexd[0].value;
                let putY = 246 * (1 - endSY);
                if (i > 0 && i < 6) {
                    let point = this.point_group.getChildAt(i - 1) as eui.Image;
                    point.y = putY;
                }
                exchangeratelb.y = putY;

                egret.Tween.get(sharp).wait(200).to({ scaleY: endSY }, 500, egret.Ease.backOut);

                if (i > 0) {
                    let sharp0 = this.sharp_group.getChildAt(i - 1) as eui.Image;
                    let dis = egret.Point.distance(new egret.Point(sharp.x, putY), new egret.Point(sharp0.x, lastSY));
                    let line = this.line_group.getChildAt(i - 1);
                    line.y = lastSY + 10;
                    line.x = sharp0.x + 5;
                    line.width = dis;
                    let cod = Math.round(Math.atan((lastSY - putY) / (sharp0.x - sharp.x)) * 180 / Math.PI);
                    line.rotation = cod;
                }

                lastSY = putY;
            }


            cor.Socket.getIntance().sendmsg('GET_EXCHANGE_CONFIG', {}, (rdata) => {
                Log(rdata);
                this._today_rate = rdata;
                this.rateTx.text = this.rateTx.text.replace('@num', rdata);
            }, this)
        }

        private initEvent() {
            this.addEvent(this.recode_btn, egret.TouchEvent.TOUCH_TAP, this, this.showRecode);
            this.addEvent(this.exchange_btn, egret.TouchEvent.TOUCH_TAP, this, this.exchange);
            this.addEvent(this.exchange_num, eui.UIEvent.CHANGE, this, this.showExchangeRate);
            this.addEvent(this.close_btn, egret.TouchEvent.TOUCH_TAP, this, () => { this.rdcode_group.visible = false;});
        }

        private showExchangeRate(e: eui.UIEvent) {
            this.exchangeRate.text = "GST=" + Number(e.target.text)*this._today_rate + "矿石";
        }

        private exchange() {
            cor.Socket.getIntance().sendmsg('EXCHANGE_GST', {
                "number": Number(this.exchange_num.text)
            }, (rdata) => {
                Log(rdata);
                GameData.UserInfo.gts_number += Number(this.exchange_num.text);
                GameData.UserInfo.mineral -= (Number(this.exchange_num.text) * this._today_rate);
                cor.EventManage.instance().sendEvent(UpdataGameInfo);
            }, this)
        }

        private showRecode() {
            this.rdcode_group.visible = true;
            cor.Socket.getIntance().sendmsg('EXCHANGE_RECORD', {}, (rdata) => {
                Log(rdata);
                this.recode_list.dataProvider = new eui.ArrayCollection(rdata);
            }, this)
        }
    }
}
