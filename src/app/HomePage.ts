namespace Game {
    export class HomePage extends cor.BaseScene {
        public readonly skinName = "HomePage";

        public home_group: eui.Group;
        public banner_group: eui.Group;
        public bannerIndex_group: eui.Group;
        public game_btn: eui.Button;
        public purse_btn: eui.Button;
        public card_btn: eui.Button;
        public news_list: eui.List;
        public news_scroller: eui.Scroller;
        public home_btn: eui.Button;
        public news_btn: eui.Button;
        public exchange_btn: eui.Button;
        public personal_btn: eui.Button;

        public news_group: eui.Group;
        public news_scroller0: eui.Scroller;
        public news_list0: eui.List;

        public personal_group: eui.Group;
        public headMask: eui.Image;
        public headImg: eui.Image;
        public purseManage_btn: eui.Button;
        public cardManage_btn: eui.Button;
        public my_invite_code: eui.Label;
        public invite_code_btn: eui.Button;
        public about_btn: eui.Button;
        public setting_btn: eui.Button;
        public nickName: eui.Label;
        public telNum: eui.Label;

        private currentNav;
        private cureentPage: eui.Group;

        constructor() {
            super();

            this.init();
            this.initEnent();
            this.getNews();
            this.getBanners();
        }

        public init() {
            // init
            this.news_scroller.height = this.height - 100 - this.news_scroller.y;
            this.home_btn.currentState = "down";
            this.currentNav = this.home_btn;
            this.cureentPage = this.home_group;
            this.headImg.mask = this.headMask;
        }

        private initEnent() {
            this.addEvent(this.home_btn, egret.TouchEvent.TOUCH_TAP, this, this.showHome);
            this.addEvent(this.news_btn, egret.TouchEvent.TOUCH_TAP, this, this.showNews);
            this.addEvent(this.exchange_btn, egret.TouchEvent.TOUCH_TAP, this, this.showExchange);
            this.addEvent(this.personal_btn, egret.TouchEvent.TOUCH_TAP, this, this.showPersonal);

            this.addEvent(this.banner_group, egret.TouchEvent.TOUCH_BEGIN, this, this.banner_touch_begin);
            this.addEvent(this.banner_group, egret.TouchEvent.TOUCH_END, this, this.banner_touch_end);

            this.addEvent(this.game_btn, egret.TouchEvent.TOUCH_TAP, this, this.gotoGame);
            this.addEvent(this.purse_btn, egret.TouchEvent.TOUCH_TAP, this, this.showPurse);
            this.addEvent(this.card_btn, egret.TouchEvent.TOUCH_TAP, this, this.showCard);

            this.addEvent(this.news_list, eui.ItemTapEvent.ITEM_TAP, this, this.showNewsContant);
            this.addEvent(this.news_list0, eui.ItemTapEvent.ITEM_TAP, this, this.showNewsContant);

            this.addEvent(this.setting_btn, egret.TouchEvent.TOUCH_TAP, this, this.showSettingPage);

            this.addEvent(cor.EventManage.instance(), UpdataUserInfo, this, this.updata_info);
        }
        //获取资讯
        private getNews() {
            cor.Socket.getIntance().sendmsg('GET_POST_LIST', {
                "page": 1,
                "page_size": 10,
                "is_index": 1
            }, (rdata) => {
                this.news_list.dataProvider = new eui.ArrayCollection(rdata);
            }, this)
        }
        //显示资讯详细信息
        private showNewsContant(e: eui.ItemTapEvent) {
            cor.Socket.getIntance().sendmsg('GET_POST_INFO', {
                "id": e.item.id
            }, (rdata) => {
                // Log(rdata);
                cor.MainScene.instance().addChild(new NewsContant(rdata));
            }, this)
        }
        //获取banner信息
        private getBanners() {
            cor.Socket.getIntance().sendmsg('GET_AD_LIST_BY_POSITION_ID', {
                "page_size": 3,
                "position_id": 1
            }, (rdata) => {
                for (let i = 0; i < rdata.length; i++) {
                    let item = rdata[i];
                    this.banner_urls.push(item.url);
                    let banImg = new eui.Image(item.content);
                    banImg.width = 600;
                    banImg.height = 360;
                    banImg.anchorOffsetX = 315;
                    banImg.anchorOffsetY = 180;
                    banImg.x = 315 + 60 + i * 540;
                    banImg.y = 180;
                    if (i > 0) {
                        banImg.scaleX = banImg.scaleY = 0.7;
                    }
                    this.banner_group.addChild(banImg);
                    let line = new eui.Image("Banner_Switch_png");
                    if (i > 0) {
                        line.source = "Line_Main01_png";
                    }
                    this.bannerIndex_group.addChild(line);
                }

                setInterval(() => {
                    this.banner_move(1);
                }, 3000);
            }, this)
        }
        //banner点击事件
        private banner_currentIndex = 0;
        private banner_touch_bx = 0;
        private banner_urls = [];
        private banner_touch_begin(evt: egret.TouchEvent) {
            this.banner_touch_bx = evt.stageX;
        }
        private banner_touch_end(evt: egret.TouchEvent) {
            let movex = evt.stageX - this.banner_touch_bx;
            if (movex > 100) {
                this.banner_move(0);
            } else if (movex < -100) {
                this.banner_move(1);
            } else {
                this.banner_move(2);
            }
        }
        private banner_move(cmd) {

            let cur_banItem = this.banner_group.getChildAt(this.banner_currentIndex);
            let cur_lineItem = this.bannerIndex_group.getChildAt(this.banner_currentIndex) as eui.Image;
            switch (cmd) {
                case 0:
                    if (this.banner_currentIndex > 0) {
                        this.banner_currentIndex--;
                    } else {
                        this.banner_currentIndex = this.banner_group.numChildren - 1;
                    }
                    var next_banItem = this.banner_group.getChildAt(this.banner_currentIndex);
                    var next_lineItem = this.bannerIndex_group.getChildAt(this.banner_currentIndex) as eui.Image;
                    egret.Tween.get(this.banner_group).to({ x: -this.banner_currentIndex * 540 }, 300);
                    egret.Tween.get(cur_banItem).to({ scaleX: 0.7, scaleY: 0.7 }, 300);
                    egret.Tween.get(next_banItem).to({ scaleX: 1, scaleY: 1 }, 300);
                    cur_lineItem.source = "Line_Main01_png";
                    next_lineItem.source = "Banner_Switch_png";
                    break;
                case 1:
                    if (this.banner_currentIndex < this.banner_group.numChildren - 1) {
                        this.banner_currentIndex++;
                    } else {
                        this.banner_currentIndex = 0;
                    }
                    var next_lineItem = this.bannerIndex_group.getChildAt(this.banner_currentIndex) as eui.Image;
                    var next_banItem = this.banner_group.getChildAt(this.banner_currentIndex);
                    egret.Tween.get(this.banner_group).to({ x: -this.banner_currentIndex * 540 }, 300);
                    egret.Tween.get(cur_banItem).to({ scaleX: 0.7, scaleY: 0.7 }, 300);
                    egret.Tween.get(next_banItem).to({ scaleX: 1, scaleY: 1 }, 300);
                    cur_lineItem.source = "Line_Main01_png";
                    next_lineItem.source = "Banner_Switch_png";
                    break;
                case 2:
                    // Log(this.banner_urls[this.banner_currentIndex]);
                    egret.ExternalInterface.call("sendToNative", "webview$" + this.banner_urls[this.banner_currentIndex]);
                    break;
            }
        }

        private changeBtnState(btn): boolean {
            if (this.currentNav == btn) {
                return false;
            }
            this.currentNav.currentState = "up";
            btn.currentState = "down";
            this.currentNav = btn;
            cor.MainScene.instance().clearPage();
            return true;
        }
        //显示主页
        private showHome() {
            if (this.changeBtnState(this.home_btn)) {
                this.cureentPage.visible = false;
                this.home_group.visible = true;
                this.cureentPage = this.home_group;
            }
        }
        //显示资讯页
        private showNews() {
            cor.Socket.getIntance().sendmsg('GET_POST_LIST', {
                "page": 1,
                "page_size": 100,
                "is_index": 0
            }, (rdata) => {
                Log(rdata);
                this.news_list0.dataProvider = new eui.ArrayCollection(rdata);
                if (this.changeBtnState(this.news_btn)) {
                    this.cureentPage.visible = false;
                    this.news_group.visible = true;
                    this.cureentPage = this.news_group;
                }
            }, this)
        }
        //显示交易所
        private showExchange() {
            TipsSkin.instance().show("暂未开放");
            return;
            this.changeBtnState(this.exchange_btn);
        }
        //显示个人中心
        private showPersonal() {
            cor.Socket.getIntance().sendmsg('GET_ME', {}, (rdata) => {
                Log(rdata);
                if (this.changeBtnState(this.personal_btn)) {
                    this.cureentPage.visible = false;
                    this.personal_group.visible = true;
                    this.cureentPage = this.personal_group;
                    this.nickName.text = rdata.nickname;
                    this.my_invite_code.text = rdata.invitation_code;
                    this.telNum.text = GameData.UserPhone;
                    this.headImg.source = rdata.picture;
                    GameData.UserInfo = rdata;
                }
            }, this)
        }
        private updata_info() {
            this.headImg.source = GameData.UserInfo.picture;
            this.nickName.text = GameData.UserInfo.nickname;
        }

        //进入游戏
        private gotoGame() {
            cor.Socket.getIntance().sendmsg('GET_USER_BASE_INFO', {}, async (rdata) => {
                Log(rdata);
                egret.MainContext.instance.stage.setContentSize(1334, 750);
                egret.MainContext.instance.stage.orientation = egret.OrientationMode.LANDSCAPE;
                egret.MainContext.instance.stage.scaleMode = egret.StageScaleMode.FIXED_HEIGHT;

                GameData.GameWidth = egret.MainContext.instance.stage.stageWidth;
                GameData.GameHeigth = egret.MainContext.instance.stage.stageHeight;
                GameData.BGame = true;
                GameData.UserInfo = rdata;
                let loadingScene = new LoadingView();
                this.addChild(loadingScene);
                await RES.loadGroup("gameres", 0, loadingScene);
                loadingScene.dispose();
                cor.MainScene.instance().addChild(new GameScene);
            }, this)
        }

        //显示钱包界面
        private showPurse() {
            TipsSkin.instance().show("暂未开放");
        }
        //显示卡界面
        private showCard() {
            TipsSkin.instance().show("暂未开放");
        }

        //设置界面
        private showSettingPage() {
            cor.MainScene.instance().addChild(new SettingPage());
        }
    }
}
