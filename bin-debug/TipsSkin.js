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
var Game;
(function (Game) {
    var TipsSkin = (function (_super) {
        __extends(TipsSkin, _super);
        function TipsSkin() {
            var _this = _super.call(this) || this;
            _this.skinName = "TipsSkin";
            _this.init();
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.addToStage, _this);
            _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.removeFromStage, _this);
            return _this;
        }
        TipsSkin.prototype.addToStage = function () {
            // Added to the on stage display list.
        };
        TipsSkin.prototype.removeFromStage = function () {
            // Removed from the display list.
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeFromStage, this);
        };
        TipsSkin.prototype.init = function () {
            // init
            this.visible = false;
            this.anchorOffsetX = 375;
            this.anchorOffsetY = 49;
            // this.height = GameData.GameHeigth;
        };
        TipsSkin.prototype.show = function (str, dis) {
            var _this = this;
            if (dis === void 0) { dis = true; }
            this.x = egret.MainContext.instance.stage.stageWidth / 2;
            this.y = egret.MainContext.instance.stage.stageHeight / 2;
            egret.Tween.removeTweens(this);
            this.visible = true;
            this.tipsLabel.text = str;
            this.alpha = 1;
            if (dis) {
                egret.Tween.get(this).wait(300).to({ alpha: 0 }, 500).call(function () {
                    _this.hide();
                });
            }
        };
        TipsSkin.prototype.hide = function () {
            this.visible = false;
        };
        TipsSkin.instance = function () {
            return this._i || (this._i = new TipsSkin());
        };
        return TipsSkin;
    }(eui.Component));
    Game.TipsSkin = TipsSkin;
    __reflect(TipsSkin.prototype, "Game.TipsSkin");
})(Game || (Game = {}));
//# sourceMappingURL=TipsSkin.js.map