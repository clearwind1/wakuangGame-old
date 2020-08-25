module core {

	export class Http {
		public constructor() {
		}

		/**
		 * @action 要发送的命令
		 * @data 要发送的数据
		 * @callback获取数据后的回调方法
		 * @type Http发送方法类型
		*/
		public static sendPostData(action: string, cdata: any, callback: (data: any) => void, obj?: any) {
			if (obj) {
				game.Socket.getIntance().sendmsg(action, cdata, callback, obj);
			} else {
				let httpPost: HttpPost = new HttpPost();
				httpPost.sendPostData(action, cdata, callback);
			}

		}

		/**
		 * @action要发送的命令
		 * @data 要发送的数据
		 * @callback获取数据后的回调方法
		 * @type Http发送方法类型
		*/
		public static sendGetData(action: string, cdata: any, callback: (data: any) => void, obj?: any, isHide: boolean = false) {
			if (obj) {
				game.Socket.getIntance().sendmsg(action, cdata, callback, obj, isHide);
			} else {
				let httpGet: HttpGet = new HttpGet();
				httpGet.sendGetData(action, cdata, callback);
			}
		}
	}

	/**
	 * 连网等待覆盖
	 */
	export class Covershap extends egret.DisplayObjectContainer {
		private mc: egret.MovieClip;
		private loading: egret.Bitmap;
		public constructor() {
			super();
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
			// this.addEventListener(egret.Event.RESIZE, this.onStageResize, this);
		}

		// private onStageResize(evt: egret.Event): void {
		// 	this.width = core.LayerCenter.getInstance().stage.stageWidth;
		// 	this.height = core.LayerCenter.getInstance().stage.stageHeight;
		// }

		private onAddedToStage(event: egret.Event) {

			this.touchEnabled = true;

			this.width = GameData.GameWidth;
			this.height = GameData.GameHeigth;
			this.addChild(createRect(0, 0, this.width, this.height, 0.6));
			//动画
			// this.createan();
		}

		public createan() {
			this.loading = createBitmap("loadingIcon_png");
			this.loading.x = this.width / 2;
			this.loading.y = this.height / 2;
			this.addChild(this.loading);

			egret.Tween.get(this.loading, { loop: true }).to({ rotation: 360 }, 500);
		}
		private timeoutInt;
		public show() {
			this.alpha = 0;
			let self = this;
			this.timeoutInt = setTimeout(() => {
				self.alpha = 1;
				clearTimeout(self.timeoutInt);
			}, 500)
		}
		public hide() {
			clearTimeout(this.timeoutInt);
			this.visible = false;
		}

		private static _ins: Covershap = null;
		public static getInstance(): Covershap {
			if (this._ins == null) {
				this._ins = new Covershap();
			}

			return this._ins;
		}

	}

	class HttpPost {
		public sendPostData(action: string, cdata: any, callback: (data: any) => void) {
			let linkTimes: number = 0;
			let url: string;
			let self = this;
			let redata: any = cdata;
			url = GameData.ServerUrl + action;
			url = url.replace("ws", "http")
			var patt1 = /cnrgame\/websocket|cnrGame\/websocket/;
			url = url.replace(patt1,"")

			cdata = JSON.stringify(cdata);

			Log("sendMessage", action, cdata);


			let httpAction: egret.HttpRequest = new egret.HttpRequest();
			httpAction.responseType = egret.HttpResponseType.TEXT;
			httpAction.setRequestHeader("Content-Type", "application/text;charset=UTF-8");

			//Log("getMessage", action, httpAction);

			httpAction.open(url, "POST");
			httpAction.send(cdata);
			httpAction.addEventListener(egret.Event.COMPLETE, loadComplete, this);
			httpAction.addEventListener(egret.IOErrorEvent.IO_ERROR, onGetIOError, this);
			core.Covershap.getInstance().show();
			function loadComplete(): void {
				httpAction.removeEventListener(egret.Event.COMPLETE, loadComplete, this);
				httpAction.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);

				var back_data: any = JSON.parse(httpAction.response.substring());
				Log("getMessage", action, back_data);

				if (back_data.code == 1) {
					httpAction = new egret.HttpRequest();
					httpAction.responseType = egret.HttpResponseType.TEXT;
					httpAction.setRequestHeader("Content-Type", "application/text;charset=UTF-8");
					url = GameData.ServerUrl + "refreshLogin";
					httpAction.open(url, "POST");

					let refreshParam: Object = {
						"refreshToken": ""
					};

					httpAction.send(JSON.stringify(refreshParam));
					httpAction.addEventListener(egret.Event.COMPLETE, refreshComplete, this);
					httpAction.addEventListener(egret.IOErrorEvent.IO_ERROR, onGetIOError, this);
				} else {
					core.Covershap.getInstance().hide();
					callback(back_data);
				}
			}

			function refreshComplete(evt: egret.Event): void {
				//Log()
				httpAction.removeEventListener(egret.Event.COMPLETE, refreshComplete, this);
				httpAction.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);

				var back_data: any = JSON.parse(httpAction.response.substring());
				Log("getMessage", "refreshLogin", back_data);

				if (back_data.code == 0) {
					
					redata.token = back_data.data.token;
					self.sendPostData(action, redata, callback);
				} else if (back_data.code == 2) {
					Log(back_data.errMsg);
					window.location.reload();
					//self.login();
				}
				else {
					// tips.Tips.tipJustStr("网络异常");
				}
			}

			function onGetIOError(evt: egret.IOErrorEvent): void {
				Log("onGetIOError_" + evt.target._url);
				// tips.Tips.tipJustStr("网络异常");
			}
		}
	}

	class HttpGet {
		public sendGetData(action: string, cdata: any, callback: (data: any) => void) {
			let self = this;
			let url: string;
			let redata: any = cdata;
			url = GameData.ServerUrl + action;

			Log("sendMessage", action, cdata);
			let paramStr: string = "";
			let property: string;
			let i: number = 0;
			for (property in cdata) {
				if (i > 0) {
					paramStr += "&";
				}
				paramStr += property + "=" + cdata[property];
				i++;
			}

			let httpAction: egret.HttpRequest = new egret.HttpRequest();

			url = url + "?" + paramStr;

			httpAction = new egret.HttpRequest();
			httpAction.responseType = egret.HttpResponseType.TEXT;
			httpAction.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");

			httpAction.open(url, "GET");
			httpAction.send();
			httpAction.addEventListener(egret.Event.COMPLETE, loadComplete, this);
			httpAction.addEventListener(egret.IOErrorEvent.IO_ERROR, onGetIOError, this);

			//Log(new Date().getTime(), "========================================1");
			function loadComplete(): void {
				httpAction.removeEventListener(egret.Event.COMPLETE, loadComplete, this);
				httpAction.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);

				var back_data: any = JSON.parse(httpAction.response.substring());
				Log("getMessage", action, back_data);

				if (back_data.code == 1) {
					
					httpAction = new egret.HttpRequest();
					httpAction.responseType = egret.HttpResponseType.TEXT;
					httpAction.setRequestHeader("Content-Type", "application/plain;charset=UTF-8");
					url = GameData.ServerUrl + "refreshLogin";
					httpAction.open(url, "POST");
					let refreshParam: Object = {
						"refreshToken": ""
					}
					httpAction.send(JSON.stringify(refreshParam));
					httpAction.addEventListener(egret.Event.COMPLETE, refreshComplete, this);
					httpAction.addEventListener(egret.IOErrorEvent.IO_ERROR, onGetIOError, this);
				} else {
					callback(back_data);
				}
			}

			function refreshComplete(evt: egret.Event): void {
				httpAction.removeEventListener(egret.Event.COMPLETE, refreshComplete, this);
				httpAction.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);

				var back_data: any = JSON.parse(httpAction.response.substring());
				Log("getMessage", "refreshLogin", back_data);

				if (back_data.code == 0) {
					redata.token = back_data.data.token;
					self.sendGetData(action, redata, callback);
				} else if (back_data.code == 2) {
					Log(back_data.errMsg);
					window.location.reload();
					//self.login();
				} else {
					// tips.Tips.tipJustStr("网络异常");
				}
			}

			function onGetIOError(evt: egret.IOErrorEvent): void {
				Log("onGetIOError_" + evt.target._url);
				// tips.Tips.tipJustStr("网络异常");
			}
		}

	}
}