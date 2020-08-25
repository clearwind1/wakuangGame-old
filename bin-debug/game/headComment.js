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
    var headComment = (function (_super) {
        __extends(headComment, _super);
        function headComment(parent, title, title_en) {
            var _this = _super.call(this) || this;
            _this.skinName = "headComment";
            _this.init(title, title_en);
            _this.initEvent(parent);
            return _this;
        }
        headComment.prototype.init = function (title, title_en) {
            // init
            this.gst_num.text = GameData.UserInfo.gts_number + '';
            this.mine_num.text = GameData.UserInfo.mineral + '';
            this.title.text = title;
            this.title_en.text = title_en;
        };
        headComment.prototype.initEvent = function (parent) {
            var _this = this;
            this.addEvent(this.back_btn, egret.TouchEvent.TOUCH_TAP, this, function () {
                _this.dispose();
                parent.dispose();
            });
            this.addEvent(cor.EventManage.instance(), UpdataGameInfo, this, this.updata_gameinfo);
        };
        /**
         * 更新游戏信息
         */
        headComment.prototype.updata_gameinfo = function () {
            this.gst_num.text = GameData.UserInfo.gts_number + '';
            this.mine_num.text = GameData.UserInfo.mineral + '';
        };
        return headComment;
    }(cor.BaseScene));
    Game.headComment = headComment;
    __reflect(headComment.prototype, "Game.headComment");
})(Game || (Game = {}));
//# sourceMappingURL=headComment.js.map