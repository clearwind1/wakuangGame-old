namespace Game {
    export class ToolsStore extends cor.BaseScene {
        public readonly skinName = "ToolsStore";

        public head_group: eui.Group;
        public toolsList: eui.List;

        private _toolsdata = [];
        constructor(toolsData) {
            super();

            this.init(toolsData);
            this.initEnent();
        }

        public init(toolsData) {
            // init

            this.head_group.addChild(new headComment(this,'工具商店','TOOL SHOP'));

            this._toolsdata = [];
            for (var k in toolsData) {
                if (toolsData[k].buy_user_type == 0 || toolsData[k].buy_user_type == GameData.UserInfo.identity) {
                    this._toolsdata.push(toolsData[k]);
                    let index = this._toolsdata.length - 1;
                    this._toolsdata[index].price = toolsData[k].price.split('.')[0] + 'GST';
                }
            }
            this.toolsList.dataProvider = new eui.ArrayCollection(this._toolsdata);
        }

        private initEnent() {
            this.addEvent(this.toolsList, eui.ItemTapEvent.ITEM_TAP, this, this.toolsInfo);
        }

        private toolsInfo(e: eui.ItemTapEvent) {
            this.addChild(new ToolInfo(e.item));
        }
    }
}
