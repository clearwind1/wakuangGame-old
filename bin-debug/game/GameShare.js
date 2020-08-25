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
    var GameShare = (function (_super) {
        __extends(GameShare, _super);
        function GameShare() {
            var _this = _super.call(this) || this;
            _this.skinName = "GameShare";
            _this.init();
            _this.initEvent();
            return _this;
        }
        GameShare.prototype.init = function () {
            // init
        };
        GameShare.prototype.initEvent = function () {
            this.addEvent(this.back_btn, egret.TouchEvent.TOUCH_TAP, this, this.dispose);
            this.addEvent(this.shareFriend_btn, egret.TouchEvent.TOUCH_TAP, this, this.shareFriend);
            this.addEvent(this.shareGroup_btn, egret.TouchEvent.TOUCH_TAP, this, this.shareGroup);
            this.addEvent(this.shareUrl_btn, egret.TouchEvent.TOUCH_TAP, this, this.shareUrl);
        };
        GameShare.prototype.shareFriend = function () {
            egret.ExternalInterface.call("sendToNative", "shareFriend$" + GameData.UserInfo.invitation_code);
        };
        GameShare.prototype.shareGroup = function () {
            egret.ExternalInterface.call("sendToNative", "shareGroup$" + GameData.UserInfo.invitation_code);
        };
        GameShare.prototype.shareUrl = function () {
            egret.ExternalInterface.call("sendToNative", "shareUrl$" + GameData.UserInfo.invitation_code);
        };
        return GameShare;
    }(cor.BaseScene));
    Game.GameShare = GameShare;
    __reflect(GameShare.prototype, "Game.GameShare");
})(Game || (Game = {}));
//# sourceMappingURL=GameShare.js.map