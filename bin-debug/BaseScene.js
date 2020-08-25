var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var cor;
(function (cor) {
    /**
     * 基础页面
     */
    var BaseScene = (function (_super) {
        __extends(BaseScene, _super);
        function BaseScene() {
            var _this = _super.call(this) || this;
            _this.eventList = [];
            _this.tweenList = [];
            // this.visible = false;
            _this.touchEnabled = false;
            _this.width = GameData.GameWidth;
            _this.height = GameData.GameHeigth;
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.addToStage, _this);
            _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.removeFromStage, _this);
            return _this;
        }
        BaseScene.prototype.addToStage = function () {
            // Added to the on stage display list.
            // Log("add");
            // this.setFontFamily([]);
        };
        BaseScene.prototype.removeFromStage = function () {
            // Removed from the display list.
            this.removeEvent();
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeFromStage, this);
            // Log("remove");
        };
        /**设置外部字体 */
        BaseScene.prototype.setFontFamily = function (pro) {
        };
        BaseScene.prototype.showVb = function () {
            this.visible = true;
            this.show();
        };
        BaseScene.prototype.show = function (any) {
        };
        BaseScene.prototype.hide = function () {
            this.visible = false;
        };
        /**
         * 添加事件
         */
        BaseScene.prototype.addEvent = function (target, event, obj, fun, parmar) {
            var parm = { target: target, event: event, obj: obj, fun: fun, parmar: parmar };
            this.eventList.push(parm);
            target.addEventListener(event, this.touchEnd, obj);
        };
        /**绑定事件回调 */
        BaseScene.prototype.touchEnd = function (event) {
            var parm;
            for (var k in this.eventList) {
                if (this.eventList[k].target == event.currentTarget && this.eventList[k].event == event.type) {
                    parm = this.eventList[k];
                    break;
                }
            }
            // Log("type===", egret.is(parm.target, 'eui.Button'));
            // if (egret.is(parm.target, 'eui.Button')) {
            // 	cor.SoundMannage.instance().playByRes("click");
            // }
            if (parm.parmar) {
                parm.parmar.push(event);
            }
            else {
                parm.parmar = [event];
            }
            parm.fun.apply(parm.obj, parm.parmar);
        };
        /**
         * 删除事件
         * @param target: 删除某一事件监听，没有传删除全部
         */
        BaseScene.prototype.removeEvent = function (target) {
            if (target) {
                // Log(this.eventList);
                var parm = void 0;
                for (var i in this.eventList) {
                    if (this.eventList[i].target == target) {
                        parm = this.eventList[i];
                        break;
                    }
                }
                if (parm) {
                    (parm.target).removeEventListener(parm.event, this.touchEnd, parm.obj);
                    this.eventList.splice(this.eventList.indexOf(parm), 1);
                    // Log(this.eventList);
                }
            }
            else {
                for (var i_1 = 0; i_1 < this.eventList.length; i_1++) {
                    var parm = this.eventList[i_1];
                    (parm.target).removeEventListener(parm.event, this.touchEnd, parm.obj);
                }
                this.eventList = [];
            }
        };
        BaseScene.prototype.dispose = function () {
            if (this.parent) {
                this.parent.removeChild(this);
            }
        };
        return BaseScene;
    }(eui.Component));
    cor.BaseScene = BaseScene;
    __reflect(BaseScene.prototype, "cor.BaseScene");
})(cor || (cor = {}));
//# sourceMappingURL=BaseScene.js.map