namespace Game {
    export class NewsItem extends eui.ItemRenderer {
        public readonly skinName = "NewsItem";

        constructor() {
            super();

            this.init();
            this.initEnent();
        }

        public init() {
            // init
        }

        private initEnent() {
            this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
			this.addEventListener(eui.UIEvent.REMOVED_FROM_STAGE, this.dispose, this);
        }

        private onComplete() {
			
        }
        
        protected dataChanged(): void {

		}

		public dispose(): void {
			this.removeChildren();
			this.removeEventListener(eui.UIEvent.REMOVED_FROM_STAGE, this.dispose, this);
		}
    }
}
