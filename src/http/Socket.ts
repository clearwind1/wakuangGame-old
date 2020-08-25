module cor {

	export class Socket {

		private connectCount;						//接连次数
		public webSocket: egret.WebSocket;
		private param: any[];						//发送消息参数
		private bconnect: boolean = false;			//是否连接
		private breflesh: boolean = false;			//是否重新连接
		private breLogin: boolean = false;			//重新连接提示
		private inteval: number = -1;
		public firstConnect: boolean = true;		//是否首次连接

		private connetCB: Function;
		private connetObj: any;

		public constructor() {
			this.connectCount = 0;
			this.breLogin = false;
			this.param = [];
			this.webSocket = null;
			this.firstConnect = true;
		}

		public async ProConnet() {
			return new Promise((resolve, reject) => {
				this.connect(() => {
					resolve();
				}, this);
			})
		}

		public connect(callback: (data: any) => void, obj: any) {
			Game.TipsSkin.instance().show("连接网络...", false);
			Log("连接：", GameData.ServerSocketUrl);
			this.webSocket = new egret.WebSocket();
			this.webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
			this.webSocket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
			this.webSocket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
			this.webSocket.connectByUrl(GameData.ServerSocketUrl);

			this.connetCB = callback;
			this.connetObj = obj;

		}

		public sendmsg(action: string, msg: any, callback: (data: any) => void, obj: any, isHide?: boolean) {

			if (!this.webSocket.connected) {
				Game.TipsSkin.instance().show('网络重连中...');
				this.refreshLogin();
				return;
			}

			let param = {
				action: action,
				param: msg,
				callback: callback,
				targetObj: obj
			}
			let ishave = false;
			for (let i = 0; i < this.param.length; i++) {
				if (this.param[i] && this.param[i].action == param.action) {
					ishave = true;
					break;
				}
			}
			if (!ishave)
				this.param.push(param);

			let reqData = {
				"cmd": action,
				"data": msg,
				"msg": ""
			}

			var cmd = JSON.stringify(reqData);

			Log("发送数据：" + JSON.stringify(cmd));
			if (this.webSocket.connected) {
				this.webSocket.writeUTF(cmd);
				if (!isHide) {
					core.Covershap.getInstance().show();
					this.inteval = setTimeout(() => {
						core.Covershap.getInstance().hide();
					}, 10000);
				}
			}

		}
		private reSendTimesCount = 0;
		private onSocketOpen(): void {
			console.log("连接websocket成功");
			// alert('success')
			Game.TipsSkin.instance().hide();
			this.connetCB.apply(this.connetObj);
			this.param = [];
			this._bchange = false;
			if (this.breflesh) {
				this.breflesh = false;
				cor.Socket.getIntance().sendmsg('LOGIN', {
					"mobile": GameData.UserPhone,
					"password": GameData.UserPassword
				}, (rdata) => {}, this)
			}
			// for (let i = 0; i < this.param.length; i++){
			// 	let item = this.param[i];
			// 	this.sendmsg(item.action, item.param, item.callback, item.targetObj);
			// }

		}
		private onReceiveMessage(e: egret.Event): void {
			var msg = this.webSocket.readUTF();
			Log(msg);

			// console.log("收到action：" + msg.split("$")[0]);
			let msgarr = JSON.parse(msg);

			switch (msgarr.cmd) {
				case 'NEW_NOTICE':
					cor.EventManage.instance().sendEvent(NEW_NOTICE,msgarr.data);	
					return;
			}
			
			for (let i = 0; i < this.param.length; i++) {
				let item = this.param[i];
				if (item && item.action == msgarr.cmd) {
					let contant = msgarr.data;
					// Log("收到数据：")
					// Log(contant);
					core.Covershap.getInstance().hide();
					clearTimeout(this.inteval);
					// item.callback.apply(item.targetObj, [contant]);
					if (msgarr.code == 0) {
						item.callback.apply(item.targetObj, [contant]);
					} else {
						Log("报错啦：", msgarr.code);
						Game.TipsSkin.instance().show(msgarr.msg);
					}

					this.param.splice(i, 1);

					break;
				}
			}
		}

		private onSocketClose() {
			this.connectCount++;
			Log('重连++++++', this.connectCount, "次");
			if (this.connectCount >= 12) {
				this.connectCount = 0;
				core.Covershap.getInstance().hide();
			} else {
				// this.webSocket.connectByUrl(GameData.ServerSocketUrl);
				this.refreshLogin();
			}
		}

		public refreshLogin() {
			core.Covershap.getInstance().show();
			if (!this._bchange) {
				this.breflesh = true;
			}
			this.webSocket.connectByUrl(GameData.ServerSocketUrl);
		}
		private _bchange = false;
		public changeUrl() {
			this._bchange = true;
			this.webSocket.close();
			// this.webSocket.connectByUrl(GameData.ServerSocketUrl);
		}

		private static _i: Socket = null;
		public static getIntance(): Socket {
			return this._i = this._i || new Socket();
		}
	}
}