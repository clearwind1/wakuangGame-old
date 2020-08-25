namespace Game {
    export class TipsSkin extends eui.Component {
        public readonly skinName = "TipsSkin";

        private logoBg: eui.Image;
        private tipsLabel: eui.Label;


        constructor() {
            super();

            this.init();

            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeFromStage, this);
        }

        private addToStage() {
            // Added to the on stage display list.
        }

        private removeFromStage() {
            // Removed from the display list.
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeFromStage, this);
        }

        private init() {
            // init
            this.visible = false;
            this.anchorOffsetX = 375;
            this.anchorOffsetY = 49;
            // this.height = GameData.GameHeigth;
        }

        public show(str, dis = true) {
            this.x = egret.MainContext.instance.stage.stageWidth / 2;
            this.y = egret.MainContext.instance.stage.stageHeight / 2;
            egret.Tween.removeTweens(this);
            this.visible = true;
            this.tipsLabel.text = str;
            this.alpha = 1;
            if (dis) {
                egret.Tween.get(this).wait(300).to({ alpha: 0 }, 500).call(() => { 
                    this.hide();
                });
            }
        }

        public hide() {
            this.visible = false;
        }

        private static _i: TipsSkin;
        public static instance(): TipsSkin {
            return this._i || (this._i = new TipsSkin());
        }
    }
}
