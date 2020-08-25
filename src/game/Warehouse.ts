namespace Game {
    export class Warehouse extends cor.BaseScene {
        public readonly skinName = "Warehouse";

        public warehouseList: eui.List;
        public head_group: eui.Group;

        private _warehousedata = [];
        constructor(warehouseData) {
            super();

            this.init(warehouseData);
            this.initEnent();
        }

        public init(warehouseData) {
            // init
            this.head_group.addChild(new headComment(this, '仓库', 'WAREHOUSE'));
            // this._warehousedata = warehouseData;
            for (var k in warehouseData) {
                if (warehouseData[k].good.type == 3) {
                    warehouseData[k].total = warehouseData[k].content.value + "吨";
                } else {
                    warehouseData[k].total = warehouseData[k].total + "个";
                }
            }
            this.warehouseList.dataProvider = new eui.ArrayCollection(warehouseData);
        }

        private initEnent() {
            this.addEvent(this.warehouseList, eui.ItemTapEvent.ITEM_TAP, this, this.goodsInfo);
        }

        private goodsInfo(e: eui.ItemTapEvent) {
            this.addChild(new GoodsInfo(e.item.good));
        }
    }
}
