module cor {
	export class MainScene extends egret.DisplayObjectContainer {
		public constructor() {
			super();

			egret.ExternalInterface.addCallback("back", (message: string) => {
				// alert("MainScene numChildren = " + this.numChildren);
				if (this.numChildren == 1) {
					egret.ExternalInterface.call("sendToNative", "exit$0");
				} else if (GameData.BGame) {
					//询问退出游戏
				} else {
					let index = this.numChildren - 1;
					let lastScene = this.getChildAt(index) as cor.BaseScene;
					lastScene.dispose();
				}
			});
		}

		public clearPage() {
			if (this.numChildren > 1) {
				for (let i = this.numChildren - 1; i > 0; i--) {
					let page = this.getChildAt(i) as cor.BaseScene;
					page.dispose();
				}
			}
		}

		public clearScene() {
			for (let i = this.numChildren - 1; i >= 0; i--) {
				let page = this.getChildAt(i) as cor.BaseScene;
				page.dispose();
			}
		}

		private static _i: MainScene;
		public static instance(): MainScene {
			return this._i || (this._i = new MainScene);
		}
	}
}