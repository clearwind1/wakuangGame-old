module game {

	export class Socket {

		private connectCount;						//接连次数
		public webSocket: egret.WebSocket;
		private param: any[];						//发送消息参数
		private bconnect: boolean = false;			//是否连接
		private breflesh: boolean = false;			//是否重新连接
		private breLogin: boolean = false;			//重新连接提示
		private inteval: number = -1;
		public firstConnect: boolean = true;		//是否首次连接
		private loginSuccess: boolean = false;
		private bconnecting: boolean = false;

		public constructor() {
			this.connectCount = 0;
			this.breLogin = false;
			this.param = [];
			this.webSocket = null;
			this.firstConnect = true;
		}

		public connect(url) {
			Game.TipsSkin.instance().show('connet...', false);
			// core.Covershap.getInstance().show();
			this.webSocket = new egret.WebSocket();
			this.webSocket.type = egret.WebSocket.TYPE_BINARY;
			this.webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
			this.webSocket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
			this.webSocket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
			Log("url=====", url);
			this.webSocket.connectByUrl(url);
		}
		private heartCount = 0;
		private onReceiveMessage(e: egret.ProgressEvent) {

			var msgBuff: ArrayBuffer;
			var btyearray: egret.ByteArray = new egret.ByteArray();
			this.webSocket.readBytes(btyearray);
			var len = btyearray.buffer.byteLength;

			let str = this.byteToString(btyearray.bytes);

			if (str.indexOf("#HeartBeat$") != -1) {
				Log("心跳响应:", str);
				this.heartCount--;
				return;
			}

			let starr;
			// if (str.indexOf("#OnDraw") != -1) {
			// 	if (GameData.GameLog.DrawnNumbers == "") {
			// 		return;
			// 	}
			// 	starr = (str.split("#OnDraw,")[1]);
			// 	starr = starr.substr(0, starr.length - 2);
			// 	GameData.GameOnDraw = JSON.parse(starr);
			// 	Log("GameData.GameOnDraw.NumberPosition:", GameData.GameOnDraw.NumberPosition);
			// 	view.GameSceneSkin.instance().changeBall();
			// } else if (str.indexOf("#GameLog") != -1) {
			// 	starr = (str.split("#GameLog")[1]);
			// 	starr = starr.substr(0, starr.length - 2);
			// 	GameData.GameLog = JSON.parse(starr);

			// 	if (!this.loginSuccess) {
			// 		this.loginSuccess = true;
			// 		if (this.HeartTag == -1) {
			// 			this.HeartTag = setInterval(() => {
			// 				this.sendHeart();
			// 			}, 5000);
			// 		}
			// 	}

			// } else if (str.indexOf("UserMessage$") != -1) {
			// 	starr = (str.split("$")[1]);
			// 	GameData.GameUserMessage = JSON.parse(starr);
			// } else if (str.indexOf("#GameMessage") != -1) {
			// 	starr = (str.split("#")[1]).split("GameMessage-")[1];
			// } else if (str.indexOf("#OnStatusMessage,") != -1) {
			// 	if (GameData.GameLog.DrawnNumbers == "") {
			// 		return;
			// 	}
			// 	starr = (str.split('#OnStatusMessage,')[1]);
			// 	starr = starr.substr(0, starr.length - 2);
			// 	let message = JSON.parse(starr);
			// 	view.GameSceneSkin.instance().GameMessage(message.MessageType);
			// } else if (str.indexOf("#BankMessage$") != -1) {
			// 	if (GameData.GameLog.DrawnNumbers == "") {
			// 		return;
			// 	}
			// 	starr = (str.split('#BankMessage$')[1]);
			// 	starr = starr.substr(0, starr.length - 2);
			// 	let message = JSON.parse(starr);
			// 	GameData.GameUserMessage.Money = message.CreditChange;
			// 	view.GameSceneSkin.instance().GameMessage(MessageType.BankCreditChanged);
			// }
			Game.TipsSkin.instance().hide();
			Log(JSON.parse(starr));
			if (this.param.length > 0) {
				let cb = this.param[0].callback;
				let ob = this.param[0].obj;

				this.param = [];

				cb.apply(ob, [JSON.parse(starr)]);

			}
		}

		public sendByteMsg(action, str, callback: (data?: any) => void, obj: any, bshowTip = true) {

			if (this.param.length > 0) {
				return;
			}
			if (bshowTip)
				Game.TipsSkin.instance().show("waiting....", false);
			let param = {
				action: action,
				msg: str,
				callback: callback,
				targetObj: obj
			}

			str = "#" + action + "$" + JSON.stringify(str) + "$#";
			var btyearray: egret.ByteArray = this.stringToByte(str);
			this.webSocket.writeBytes(btyearray);
			this.webSocket.flush();

			if (callback != null)
				this.param.push(param);

		}

		private byteToString(arr) {
			if (typeof arr === 'string') {
				return arr;
			}
			var str = '',
				_arr = arr;
			for (var i = 0; i < _arr.length; i++) {
				var one = _arr[i].toString(2),
					v = one.match(/^1+?(?=0)/);
				if (v && one.length == 8) {
					var bytesLength = v[0].length;
					var store = _arr[i].toString(2).slice(7 - bytesLength);
					for (var st = 1; st < bytesLength; st++) {
						store += _arr[st + i].toString(2).slice(2);
					}
					str += String.fromCharCode(parseInt(store, 2));
					i += bytesLength - 1;
				} else {
					str += String.fromCharCode(_arr[i]);
				}
			}
			return str;
		}
		//字符串转字符串ArrayBuffer
		private stringToByte(str) {
			var bytes = new egret.ByteArray();
			var len, c;
			len = str.length;
			for (var i = 0; i < len; i++) {
				c = str.charCodeAt(i);
				if (c >= 0x010000 && c <= 0x10FFFF) {
					bytes.writeByte(((c >> 18) & 0x07) | 0xF0);
					bytes.writeByte(((c >> 12) & 0x3F) | 0x80);
					bytes.writeByte(((c >> 6) & 0x3F) | 0x80);
					bytes.writeByte((c & 0x3F) | 0x80);
				} else if (c >= 0x000800 && c <= 0x00FFFF) {
					bytes.writeByte(((c >> 12) & 0x0F) | 0xE0);
					bytes.writeByte(((c >> 6) & 0x3F) | 0x80);
					bytes.writeByte((c & 0x3F) | 0x80);
				} else if (c >= 0x000080 && c <= 0x0007FF) {
					bytes.writeByte(((c >> 6) & 0x1F) | 0xC0);
					bytes.writeByte((c & 0x3F) | 0x80);
				} else {
					bytes.writeByte(c & 0xFF);
				}
			}
			return bytes;

		}

		public sendmsg(action: string, msg: any, callback: (data: any) => void, obj: any, isHide?: boolean) {
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

			var cmd = JSON.stringify(msg);
			cmd = action + ":" + cmd;
			Log("发送数据：" + cmd);
			if (this.bconnect) {
				this.webSocket.writeUTF(cmd);
				if (!isHide)
					core.Covershap.getInstance().show();
			} else {
				core.Covershap.getInstance().show();
				this.onSocketClose();
			}

			if (!this.webSocket.connected) {
				// tips.Tips.tip("与服务器断开连接");
				core.Covershap.getInstance().hide();
				// let buytext = "是否重新连接";

				// if (core.LayerCenter.getInstance().getLayer(LayerEnum.MAXTOP).getChildByName("TIPS")) {
				// 	return;
				// }
				// core.LayerCenter.getInstance().getLayer(LayerEnum.MAXTOP).addChild(new view.GjtipsWindow(new view.tipsWindow.TipsData("与服务器断开连接", buytext, "", "", this.RLogin, this)));
				return;
			}
		}

		private sendHeart() {

			if (!this.bconnecting) {
				return;
			}
			if (this.heartCount >= 3) {
				Log('心跳3次没反应，主动断线重连');
				this.webSocket.close();
				this.heartCount = 0;
				this.bconnecting = false;
				// this.refreshLogin();
			}

			if (this.webSocket.connected) {
				var str = "#HeartBeat$?$#";
				var btyearray: egret.ByteArray = this.stringToByte(str);
				this.webSocket.writeBytes(btyearray);
				this.webSocket.flush();
				this.heartCount++;
			}
		}
		private reSendTimesCount = 0;
		private HeartTag = -1;
		private onSocketOpen(): void {
			Log("webSocket连接成功");
			this.connectCount = 0;
			Game.TipsSkin.instance().hide();
			this.bconnecting = true;

			// core.Covershap.getInstance().hide();
			this.bconnect = true;
			if (this.breflesh) {
				this.breflesh = false;
				this.param = [];
				var cmd;
				if (this.param.length > 0) {
					let action = this.param[0].action;
					cmd = this.param[0].msg;
					let callback = this.param[0].callback;
					let obj = this.param[0].targetObj;
					Log("重连发送数据：" + cmd);
					this.param = [];
					this.sendByteMsg(action, cmd, callback, obj);
					// core.Covershap.getInstance().show();
				}

			} else if (this.breLogin) {
				this.breLogin = false;
				this.LoginGame();
			}
		}
		private onReceiveMessageT(e: egret.Event): void {
			var msg = this.webSocket.readUTF();
			let index = msg.indexOf(":");
			if (index == -1) {
				this.webSocket.close();
				return;
			}

			var action = msg.substr(0, index);
			let msgobj = JSON.parse(msg.substr(index + 1));

			Log("收到数据：", "Action: ", action);
			Log(msgobj);
			// alert(msgobj.code);

			if (this.inteval != -1)
				clearTimeout(this.inteval);

			if (msgobj.code == 401) {
				// tips.Tips.tip("与服务器断开连接");
				core.Covershap.getInstance().hide();
				let buytext = "是否重新连接";

				// if (core.LayerCenter.getInstance().getLayer(LayerEnum.MAXTOP).getChildByName("TIPS")) {
				// 	return;
				// }
				// core.LayerCenter.getInstance().getLayer(LayerEnum.MAXTOP).addChild(new view.GjtipsWindow(new view.tipsWindow.TipsData("与服务器断开连接", buytext, "", "", this.RLogin, this)));
				return;
			}
			if (msgobj.code == 404) {
				this.webSocket.close();
				return;
			}

			for (let i = 0; i < this.param.length; i++) {
				let param = this.param[i];
				if (param && action == param.action) {
					let targetObj = param.targetObj;
					let callback = param.callback;

					this.param[i] = null;

					callback.apply(targetObj, [msgobj]);
				}
			}

			for (let i = this.param.length - 1; i >= 0; i--) {
				let param = this.param[i];
				if (null == param) {
					this.param.splice(i, 1);
				}
			}

			if (this.firstConnect) {
				this.firstConnect = false;
			}

			switch (action) {

			}

		}

		private onSocketClose() {

			this.connectCount++;
			Log('重连++++++', this.connectCount, "次");
			if (this.connectCount >= 12) {
				this.connectCount = 0;

				Game.TipsSkin.instance().show("connect fail");

				// core.Covershap.getInstance().hide();
				// let buytext = "是否重新连接";
				// if (core.LayerCenter.getInstance().getLayer(LayerEnum.MAXTOP).getChildByName("TIPS")) {
				// 	return;
				// }
				// core.LayerCenter.getInstance().getLayer(LayerEnum.MAXTOP).addChild(new view.GjtipsWindow(new view.tipsWindow.TipsData("与服务器断开连接", buytext, "", "", this.RLogin, this)));
			} else {
				this.refreshLogin();
			}
		}

		public refreshLogin() {
			core.Covershap.getInstance().show();
			this.breflesh = true;
			this.webSocket.connectByUrl(GameData.ServerSocketUrl);
		}

		private RLogin() {
			this.webSocket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
			this.webSocket.removeEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
			this.webSocket.removeEventListener(egret.Event.CLOSE, this.onSocketClose, this);
			this.connectCount = 0;
			this.param = [];
			this.breLogin = true;
			this.webSocket = null;
			this.connect("");
		}

		private LoginGame() {

		}

		public changeUrl() {
			this.webSocket.close();
			this.webSocket.connectByUrl(GameData.ServerSocketUrl);
		}

		private static _i: Socket = null;
		public static getIntance(): Socket {
			return this._i = this._i || new Socket();
		}
	}
}