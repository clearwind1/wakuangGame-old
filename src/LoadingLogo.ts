namespace Game {
    export class LoadingLogo extends cor.BaseScene {
        public readonly skinName = "LoadingLogo";

        public logo: eui.Image;
        private isEnd: boolean = false;

        constructor() {
            super();

            this.init();
            this.initEnent();
        }

        public init() {
            // init
            egret.Tween.get(this.logo).to({ alpha: 1 }, 500).call(() => {
                this.isEnd = true;
            });
        }

        private initEnent() {

        }

        public hideAndShow(callback: Function, obj) {
            if (this.isEnd) {
                egret.Tween.get(this.logo).to({ alpha: 0 }, 500).call(() => {
                    this.dispose();
                    callback.apply(obj);
                })
            } else {
                setTimeout(() => {
                    egret.Tween.get(this.logo).to({ alpha: 0 }, 500).call(() => {
                        this.dispose();
                        callback.apply(obj);
                    })
                }, 500);
            }
        }
    }
}
