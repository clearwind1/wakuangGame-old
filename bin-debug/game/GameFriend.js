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
    var GameFriend = (function (_super) {
        __extends(GameFriend, _super);
        function GameFriend(rdata) {
            var _this = _super.call(this) || this;
            _this.skinName = "GameFriend";
            _this.init(rdata);
            _this.initEvent();
            return _this;
        }
        GameFriend.prototype.init = function (rdata) {
            // init
            var friendData = rdata;
            for (var k in friendData) {
                friendData[k].curLevel = rdata[k].identity == IDENTITY.Miner ? rdata[k].grade : 'v' + rdata[k].current_hold_area_grade;
                friendData[k].isower = (rdata[k].identity == IDENTITY.Owner);
            }
            this.friendList.dataProvider = new eui.ArrayCollection(friendData);
        };
        GameFriend.prototype.initEvent = function () {
            this.addEvent(this.back_btn, egret.TouchEvent.TOUCH_TAP, this, this.dispose);
        };
        return GameFriend;
    }(cor.BaseScene));
    Game.GameFriend = GameFriend;
    __reflect(GameFriend.prototype, "Game.GameFriend");
})(Game || (Game = {}));
//# sourceMappingURL=GameFriend.js.map