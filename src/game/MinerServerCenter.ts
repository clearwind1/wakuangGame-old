namespace Game {
    export class MinerServerCenter extends cor.BaseScene {
        public readonly skinName = "MinerServerCenter";

        public head_group: eui.Group;
        public ownerList: eui.List;
        public role_group: eui.Group;

        private _minerserverInfo;
        constructor(info) {
            super();

            this.init(info);
            this.initEvent();
        }

        public init(info) {
            // init
            let role = createDB('Lv1');
            role.x = role.width / 2;
            this.role_group.addChild(role);
            role.animation.play();

            this.head_group.addChild(new headComment(this, '矿工管理处', 'MINER'));
            this._minerserverInfo = info;
            this.ownerList.itemRenderer = OwnerItem;
            for (var k in info) {
                info[k].code = info[k].code + "矿区";
                info[k].user_nickname = "矿主：" + info[k].user_nickname;
                info[k].name = "矿区等级：" + info[k].name;
                info[k].miner_num = info[k].current_work_count + '/' + info[k].max_work_count;
            }
            this.ownerList.dataProvider = new eui.ArrayCollection(info);
        }

        private initEvent() {

        }
    }

    class OwnerItem extends eui.ItemRenderer {
        public readonly skinName = "OwnerItem";

        public btn: eui.Button;

        constructor() {
            super();

            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeFromStage, this);
        }

        private addToStage() {

        }

        private removeFromStage() {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeFromStage, this);
        }

        protected dataChanged() {

        }

    }
}
