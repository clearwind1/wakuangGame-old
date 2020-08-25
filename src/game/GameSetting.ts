namespace Game {
    export class GameSetting extends cor.BaseScene {
        public readonly skinName = "GameSetting";

        public change_nickname_btn: eui.Button;
        public back_btn: eui.Button;
        public labelDisplay: eui.Label;
        public exit_game_btn: eui.Button;
        public return_game_btn: eui.Button;
        public nickname_edt: eui.EditableText;
        public music_switch: eui.ToggleSwitch;


        constructor() {
            super();

            this.init();
            this.initEvent();
        }

        public init() {
            // init
            this.nickname_edt.text = GameData.UserInfo.nickname;
            if (readLocalData(GameMusic) && readLocalData(GameMusic) == '1') {
                this.music_switch.selected = true;
            } else {
                this.music_switch.selected = false;
            }
            
        }

        private initEvent() {
            this.addEvent(this.back_btn, egret.TouchEvent.TOUCH_TAP, this, this.dispose);
            this.addEvent(this.return_game_btn, egret.TouchEvent.TOUCH_TAP, this, this.dispose);
            this.addEvent(this.exit_game_btn, egret.TouchEvent.TOUCH_TAP, this, this.exitGame);
            this.addEvent(this.change_nickname_btn, egret.TouchEvent.TOUCH_TAP, this, this.change_nickname);
            this.addEvent(this.music_switch, eui.UIEvent.CHANGE, this, this.set_music);
        }

        private exitGame() {
            this.dispose();
            cor.EventManage.instance().sendEvent(ExitGame);
        }

        private change_nickname() {
            cor.Socket.getIntance().sendmsg('UPDATE_USER_PROFILE', {
                "nickname": this.nickname_edt.text
            }, (rdata) => {
                Log(rdata);
                GameData.UserInfo.nickname = this.nickname_edt.text
                cor.EventManage.instance().sendEvent(UpdataUserInfo);
                TipsSkin.instance().show('昵称修改成功');
            }, this)
        }

        private set_music(e: eui.UIEvent) {
            Log(e.target.selected);
            let saveStr = e.target.selected ? "1" : "0";
            saveLocalData(GameMusic, saveStr);
        }
    }
}
