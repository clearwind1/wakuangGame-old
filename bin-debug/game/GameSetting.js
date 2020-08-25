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
    var GameSetting = (function (_super) {
        __extends(GameSetting, _super);
        function GameSetting() {
            var _this = _super.call(this) || this;
            _this.skinName = "GameSetting";
            _this.init();
            _this.initEvent();
            return _this;
        }
        GameSetting.prototype.init = function () {
            // init
            this.nickname_edt.text = GameData.UserInfo.nickname;
            if (readLocalData(GameMusic) && readLocalData(GameMusic) == '1') {
                this.music_switch.selected = true;
            }
            else {
                this.music_switch.selected = false;
            }
        };
        GameSetting.prototype.initEvent = function () {
            this.addEvent(this.back_btn, egret.TouchEvent.TOUCH_TAP, this, this.dispose);
            this.addEvent(this.return_game_btn, egret.TouchEvent.TOUCH_TAP, this, this.dispose);
            this.addEvent(this.exit_game_btn, egret.TouchEvent.TOUCH_TAP, this, this.exitGame);
            this.addEvent(this.change_nickname_btn, egret.TouchEvent.TOUCH_TAP, this, this.change_nickname);
            this.addEvent(this.music_switch, eui.UIEvent.CHANGE, this, this.set_music);
        };
        GameSetting.prototype.exitGame = function () {
            this.dispose();
            cor.EventManage.instance().sendEvent(ExitGame);
        };
        GameSetting.prototype.change_nickname = function () {
            var _this = this;
            cor.Socket.getIntance().sendmsg('UPDATE_USER_PROFILE', {
                "nickname": this.nickname_edt.text
            }, function (rdata) {
                Log(rdata);
                GameData.UserInfo.nickname = _this.nickname_edt.text;
                cor.EventManage.instance().sendEvent(UpdataUserInfo);
                Game.TipsSkin.instance().show('昵称修改成功');
            }, this);
        };
        GameSetting.prototype.set_music = function (e) {
            Log(e.target.selected);
            var saveStr = e.target.selected ? "1" : "0";
            saveLocalData(GameMusic, saveStr);
        };
        return GameSetting;
    }(cor.BaseScene));
    Game.GameSetting = GameSetting;
    __reflect(GameSetting.prototype, "Game.GameSetting");
})(Game || (Game = {}));
//# sourceMappingURL=GameSetting.js.map