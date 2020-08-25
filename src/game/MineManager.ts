namespace Game {
    export class MineManager extends cor.BaseScene {
        public readonly skinName = "MineManager";

        public mine_name: eui.Label;
        public description: eui.Label;
        public surplus: eui.Label;
        public total_output: eui.Label;
        public price: eui.Label;
        public last_btn: eui.Button;
        public next_btn: eui.Button;
        public buy_btn: eui.Button;
        public head_group: eui.Group;
        public mine_area_bg: eui.Image;
        public role: eui.Image;

        private _minedata = [{
            "id": 1,
            "name": "V1矿区",
            "total_output": 2000,
            "price": "0.01",
            "description": "V1矿区",
            "grade": 1,
            "max_user": 5,
            "surplus": 100,
            "is_can_buy": true
        }];
        private _currentIndex;
        constructor(mineData) {
            super();

            this.init(mineData);
            this.initEnent();
        }

        public init(mineData) {
            // init
            this.head_group.addChild(new headComment(this, '矿区管理', 'ADMINISTRATIVE OFFICE'));

            this._currentIndex = 0;
            this._minedata = mineData;

            this.showMineInfo();
            if (GameData.UserInfo.identity == IDENTITY.Owner) {
                this.setbuyBtnGray();
            }
        }

        private initEnent() {
            this.addEvent(this.last_btn, egret.TouchEvent.TOUCH_TAP, this, this.showLastMine);
            this.addEvent(this.next_btn, egret.TouchEvent.TOUCH_TAP, this, this.showNextMine);
            this.addEvent(this.buy_btn, egret.TouchEvent.TOUCH_TAP, this, this.buyMine);
        }
        //显示矿区信息
        private showMineInfo() {
            let mineData = this._minedata[this._currentIndex];
            this.surplus.text = '剩余:' + mineData.surplus;
            this.mine_name.text = mineData.name;
            this.description.text = mineData.description;
            this.total_output.text = mineData.total_output + '';
            this.mine_area_bg.source = `Banner_Kuangquguanli_lv.${mineData.grade}_png`
            this.role.source = `Lv.${mineData.grade}_png`;
            // this.is_can_buy.text = '矿区管理处：' + (mineData.is_can_buy ? '可购买矿区' : '已售罄矿区');
            this.price.text = mineData.price.split('.')[0] + 'GST';
            this.buy_btn.label = (mineData.is_can_buy ? '购买' : '已售罄');
            if (!mineData.is_can_buy) {
                this.setbuyBtnGray();
            } else {
                this.setbuyBtnNormal();
            }
            this.checkLANbtn();
        }
        //检查上一个，下一个，按钮的显示
        private checkLANbtn() {
            this.last_btn.visible = this._currentIndex > 0;
            this.next_btn.visible = this._currentIndex < (this._minedata.length - 1)
        }
        //显示上一个矿区
        private showLastMine() {
            this._currentIndex--;
            this.showMineInfo();
        }
        //显示下一个矿区
        private showNextMine() {
            this._currentIndex++;
            this.showMineInfo();
        }
        private setbuyBtnNormal() {
            if (GameData.UserInfo.identity != IDENTITY.Owner) {
                this.buy_btn.filters = [];
            }
        }
        private setbuyBtnGray() {
            //颜色矩阵数组
            var colorMatrix = [
                0.3, 0.3, 0, 0, 0,
                0.3, 0.3, 0, 0, 0,
                0.3, 0.3, 0, 0, 0,
                0, 0, 0, 1, 0
            ];

            var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
            this.buy_btn.filters = [colorFlilter];
        }
        //购买矿区
        private buyMine() {

            if (GameData.UserInfo.identity == IDENTITY.Owner) {
                TipsSkin.instance().show('您已是矿主');
                return;
            }

            let mineData = this._minedata[this._currentIndex];
            if (!mineData.is_can_buy) {
                TipsSkin.instance().show('已售罄');
                return;
            }

            let id = this._minedata[this._currentIndex].id;
            let grade = this._minedata[this._currentIndex].grade;
            let price = Number(this._minedata[this._currentIndex].price.split('.')[0]);
            cor.Socket.getIntance().sendmsg('BUY_HOLD_AREA', {
                "hold_area_id": id
            }, (rdata) => {
                TipsSkin.instance().show('购买成功');
                GameData.UserInfo.gts_number -= price;
                GameData.UserInfo.current_hold_area_grade = grade;
                GameData.UserInfo.identity = IDENTITY.Owner;
                cor.EventManage.instance().sendEvent(ChangeIdentity);
                cor.EventManage.instance().sendEvent(UpdataGameInfo);
                this.dispose();
            }, this)
        }
    }
}
