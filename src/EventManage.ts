module cor {
	export class EventManage extends egret.EventDispatcher {
		public constructor() {
			super();
		}

		public sendEvent(eventName, data?) {
			this.dispatchEventWith(eventName, false, data);
		}

		private static _i: EventManage;
		public static instance(): EventManage {
			return this._i || (this._i = new EventManage());
		}
	}
}