namespace Game {
    export class InfoSettingPage extends cor.BaseScene {
        public readonly skinName = "InfoSettingPage";

        public back_btn: eui.Image;
        public headImg: eui.Image;
        public headMask: eui.Image;
        public nickname: eui.Label;
        public sex: eui.Label;
        public birth: eui.Label;
        public reset_head_btn: eui.Button;
        public reset_nickname_btn: eui.Button;
        public reset_sex_btn: eui.Button;
        public reset_birth_btn: eui.Button;
        public change_nickname_group: eui.Group;
        public nickname_input: eui.EditableText;
        public changeNickname_btn: eui.Button;
        public nickname_cancel_btn: eui.Button;
        public change_sex_group: eui.Group;
        public rdb_man: eui.RadioButton;
        public rdb_woman: eui.RadioButton;
        public changeSex_btn: eui.Button;
        public changeSex_cancel_btn: eui.Button;
        public change_birth_group: eui.Group;
        public changeBirth_btn: eui.Button;
        public changeBirth_cancel_btn: eui.Button;
        public year_select: eui.Label;
        public month_select: eui.Label;
        public day_select: eui.Label;
        public birth_scroller: eui.Scroller;
        public birth_list: eui.List;

        private _radioGroup: eui.RadioButtonGroup;
        private _sex_select;
        constructor() {
            super();

            this.init();
            this.initEnent();
        }

        public init() {
            // init
            this.headImg.mask = this.headMask;
            this.headImg.source = GameData.UserInfo.picture;
            this.nickname.text = GameData.UserInfo.nickname;
            this.sex.text = GameData.UserInfo.sex == SEX.Man ? "男" : "女";
            this.birth.text = GameData.UserInfo.birthday;
            this.reset_head_btn.visible = false;
            this._radioGroup = new eui.RadioButtonGroup();
            this.rdb_man.group = this._radioGroup;
            this.rdb_woman.group = this._radioGroup;
        }

        private initEnent() {
            this.addEvent(this.back_btn, egret.TouchEvent.TOUCH_TAP, this, this.dispose);
            this.addEvent(this.reset_head_btn, egret.TouchEvent.TOUCH_TAP, this, this.selectImg);
            this.addEvent(this.reset_nickname_btn, egret.TouchEvent.TOUCH_TAP, this, this.reset_nickname);
            this.addEvent(this.nickname_cancel_btn, egret.TouchEvent.TOUCH_TAP, this, () => { this.change_nickname_group.visible = false; });
            this.addEvent(this.changeNickname_btn, egret.TouchEvent.TOUCH_TAP, this, this.changeNickname);
            this.addEvent(this.reset_sex_btn, egret.TouchEvent.TOUCH_TAP, this, this.reset_sex);
            this.addEvent(this.changeSex_cancel_btn, egret.TouchEvent.TOUCH_TAP, this, () => { this.change_sex_group.visible = false; });
            this.addEvent(this.changeSex_btn, egret.TouchEvent.TOUCH_TAP, this, this.changeSex);
            this.addEvent(this._radioGroup, eui.UIEvent.CHANGE, this, (evt: eui.UIEvent) => {
                var radioGroup: eui.RadioButtonGroup = evt.target;
                this._sex_select = radioGroup.selectedValue;
            })
            this.addEvent(this.reset_birth_btn, egret.TouchEvent.TOUCH_TAP, this, this.reset_birth);
            this.addEvent(this.changeBirth_cancel_btn, egret.TouchEvent.TOUCH_TAP, this, () => { this.change_birth_group.visible = false; });
            this.addEvent(this.changeBirth_btn, egret.TouchEvent.TOUCH_TAP, this, this.changeBirth);
            this.addEvent(this.year_select, egret.TouchEvent.TOUCH_TAP, this, this.showSelect, [0]);
            this.addEvent(this.month_select, egret.TouchEvent.TOUCH_TAP, this, this.showSelect, [1]);
            this.addEvent(this.day_select, egret.TouchEvent.TOUCH_TAP, this, this.showSelect, [2]);
            this.addEvent(this.birth_list, eui.ItemTapEvent.ITEM_TAP, this, this.itemSelect);
            // this.addEvent(cor.EventManage.instance(), UpdataHead, this, this.updata_head);
            egret.ExternalInterface.addCallback("selectImg_head_result", (message: string) => {
                TipsSkin.instance().show(message);
                cor.Socket.getIntance().sendmsg('UPDATE_USER_PROFILE', {
                    "picture": "data:image/png;base64," + message
                }, (rdata) => {
                    Log(rdata);
                    GameData.UserInfo = rdata;
                    cor.EventManage.instance().sendEvent(UpdataUserInfo);
                }, this)
            });
        }
        private selectImg() {
            egret.ExternalInterface.call("sendToNative", "selectImg$0");
        }

        private updata_head() {
            this.headImg.source = GameData.UserInfo.picture;
        }

        private reset_nickname() {
            this.change_nickname_group.visible = true;
            this.nickname_input.text = "";
            this.nickname_input.prompt = GameData.UserInfo.nickname;
        }
        private changeNickname() {
            cor.Socket.getIntance().sendmsg('UPDATE_USER_PROFILE', {
                "nickname": this.nickname_input.text
            }, (rdata) => {
                Log(rdata);
                GameData.UserInfo = rdata;
                cor.EventManage.instance().sendEvent(UpdataUserInfo);
                this.nickname.text = GameData.UserInfo.nickname;
                this.change_nickname_group.visible = false;
            }, this)
        }

        private reset_sex() {
            this.change_sex_group.visible = true;
            GameData.UserInfo.sex == SEX.Man ? (this.rdb_man.selected = true) : (this.rdb_woman.selected = true);
        }
        private changeSex() {
            cor.Socket.getIntance().sendmsg('UPDATE_USER_PROFILE', {
                "sex": this._sex_select
            }, (rdata) => {
                Log(rdata);
                GameData.UserInfo = rdata;
                this.sex.text = GameData.UserInfo.sex == SEX.Man ? "男" : "女";
                this.change_sex_group.visible = false;
            }, this)
        }

        private reset_birth() {
            this.change_birth_group.visible = true;
            this.birth_list.dataProvider = new eui.ArrayCollection();
            this.birth_scroller.visible = false;
            let birthday = GameData.UserInfo.birthday.split('-');
            this.year_select.text = birthday[0];
            this.month_select.text = birthday[1];
            this.day_select.text = birthday[2];
        }
        private showSelect(type) {
            let bx = 176 + 155 * type;
            
            if (bx == this.birth_scroller.x && this.birth_scroller.visible) {
                this.birth_scroller.visible = false;
                return;
            }
            this.birth_scroller.visible = true;
            this.birth_scroller.x = bx;
            this.birth_scroller.viewport.scrollV = 0;
            this.birth_scroller.stopAnimation();
            let start = 0;
            let end = 2000;
            switch (type) {
                case 0:
                    start = 1920;
                    end = 2001;
                    break;
                case 1:
                    start = 1;
                    end = 12;
                    break;
                case 2:
                    start = 1;
                    end = 31;
                    break;
            }
            let birthdata = [];
            for (let i = start; i < end; i++) {
                let num = i < 10 ? '0' + i : '' + i;
                birthdata.push({ num: num, type: type });
            }
            this.birth_list.dataProvider = new eui.ArrayCollection(birthdata);
        }
        private itemSelect(e: eui.ItemTapEvent) {
            let item = e.item;
            switch (item.type) {
                case 0:
                    this.year_select.text = item.num;
                    break;
                case 1:
                    this.month_select.text = item.num;
                    break;
                case 2:
                    this.day_select.text = item.num;
                    break;
            }
            this.birth_list.dataProvider = new eui.ArrayCollection();
            this.birth_scroller.visible = false;
        }
        private changeBirth() {
            let birth = this.year_select.text + '-' + this.month_select.text + '-' + this.day_select.text;
            cor.Socket.getIntance().sendmsg('UPDATE_USER_PROFILE', {
                "birthday": birth
            }, (rdata) => {
                Log(rdata);
                GameData.UserInfo = rdata;
                this.birth.text = GameData.UserInfo.birthday;
                this.change_birth_group.visible = false;
            }, this)
        }
    }
}
