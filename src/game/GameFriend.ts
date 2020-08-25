namespace Game {
    export class GameFriend extends cor.BaseScene {
        public readonly skinName = "GameFriend";

        public back_btn: eui.Button;
        public friendList: eui.List;


        constructor(rdata) {
            super();

            this.init(rdata);
            this.initEvent();
        }

        public init(rdata) {
            // init
            let friendData = rdata;
            for (var k in friendData) {
                friendData[k].curLevel = rdata[k].identity == IDENTITY.Miner ? rdata[k].grade : 'v' + rdata[k].current_hold_area_grade;
                friendData[k].isower = (rdata[k].identity == IDENTITY.Owner);
            }
            this.friendList.dataProvider = new eui.ArrayCollection(friendData);
        }

        private initEvent() {
            this.addEvent(this.back_btn, egret.TouchEvent.TOUCH_TAP, this, this.dispose);
        }
    }
}
