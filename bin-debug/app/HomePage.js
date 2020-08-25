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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Game;
(function (Game) {
    var HomePage = (function (_super) {
        __extends(HomePage, _super);
        function HomePage() {
            var _this = _super.call(this) || this;
            _this.skinName = "HomePage";
            //banner点击事件
            _this.banner_currentIndex = 0;
            _this.banner_touch_bx = 0;
            _this.banner_urls = [];
            _this.init();
            _this.initEnent();
            _this.getNews();
            _this.getBanners();
            return _this;
        }
        HomePage.prototype.init = function () {
            // init
            this.news_scroller.height = this.height - 100 - this.news_scroller.y;
            this.home_btn.currentState = "down";
            this.currentNav = this.home_btn;
            this.cureentPage = this.home_group;
            this.headImg.mask = this.headMask;
        };
        HomePage.prototype.initEnent = function () {
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
        };
        //获取资讯
        HomePage.prototype.getNews = function () {
            var _this = this;
            cor.Socket.getIntance().sendmsg('GET_POST_LIST', {
                "page": 1,
                "page_size": 10,
                "is_index": 1
            }, function (rdata) {
                _this.news_list.dataProvider = new eui.ArrayCollection(rdata);
            }, this);
        };
        //显示资讯详细信息
        HomePage.prototype.showNewsContant = function (e) {
            cor.Socket.getIntance().sendmsg('GET_POST_INFO', {
                "id": e.item.id
            }, function (rdata) {
                // Log(rdata);
                cor.MainScene.instance().addChild(new Game.NewsContant(rdata));
            }, this);
        };
        //获取banner信息
        HomePage.prototype.getBanners = function () {
            var _this = this;
            cor.Socket.getIntance().sendmsg('GET_AD_LIST_BY_POSITION_ID', {
                "page_size": 3,
                "position_id": 1
            }, function (rdata) {
                for (var i = 0; i < rdata.length; i++) {
                    var item = rdata[i];
                    _this.banner_urls.push(item.url);
                    var banImg = new eui.Image(item.content);
                    banImg.width = 600;
                    banImg.height = 360;
                    banImg.anchorOffsetX = 315;
                    banImg.anchorOffsetY = 180;
                    banImg.x = 315 + 60 + i * 540;
                    banImg.y = 180;
                    if (i > 0) {
                        banImg.scaleX = banImg.scaleY = 0.7;
                    }
                    _this.banner_group.addChild(banImg);
                    var line = new eui.Image("Banner_Switch_png");
                    if (i > 0) {
                        line.source = "Line_Main01_png";
                    }
                    _this.bannerIndex_group.addChild(line);
                }
                setInterval(function () {
                    _this.banner_move(1);
                }, 3000);
            }, this);
        };
        HomePage.prototype.banner_touch_begin = function (evt) {
            this.banner_touch_bx = evt.stageX;
        };
        HomePage.prototype.banner_touch_end = function (evt) {
            var movex = evt.stageX - this.banner_touch_bx;
            if (movex > 100) {
                this.banner_move(0);
            }
            else if (movex < -100) {
                this.banner_move(1);
            }
            else {
                this.banner_move(2);
            }
        };
        HomePage.prototype.banner_move = function (cmd) {
            var cur_banItem = this.banner_group.getChildAt(this.banner_currentIndex);
            var cur_lineItem = this.bannerIndex_group.getChildAt(this.banner_currentIndex);
            switch (cmd) {
                case 0:
                    if (this.banner_currentIndex > 0) {
                        this.banner_currentIndex--;
                    }
                    else {
                        this.banner_currentIndex = this.banner_group.numChildren - 1;
                    }
                    var next_banItem = this.banner_group.getChildAt(this.banner_currentIndex);
                    var next_lineItem = this.bannerIndex_group.getChildAt(this.banner_currentIndex);
                    egret.Tween.get(this.banner_group).to({ x: -this.banner_currentIndex * 540 }, 300);
                    egret.Tween.get(cur_banItem).to({ scaleX: 0.7, scaleY: 0.7 }, 300);
                    egret.Tween.get(next_banItem).to({ scaleX: 1, scaleY: 1 }, 300);
                    cur_lineItem.source = "Line_Main01_png";
                    next_lineItem.source = "Banner_Switch_png";
                    break;
                case 1:
                    if (this.banner_currentIndex < this.banner_group.numChildren - 1) {
                        this.banner_currentIndex++;
                    }
                    else {
                        this.banner_currentIndex = 0;
                    }
                    var next_lineItem = this.bannerIndex_group.getChildAt(this.banner_currentIndex);
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
        };
        HomePage.prototype.changeBtnState = function (btn) {
            if (this.currentNav == btn) {
                return false;
            }
            this.currentNav.currentState = "up";
            btn.currentState = "down";
            this.currentNav = btn;
            cor.MainScene.instance().clearPage();
            return true;
        };
        //显示主页
        HomePage.prototype.showHome = function () {
            if (this.changeBtnState(this.home_btn)) {
                this.cureentPage.visible = false;
                this.home_group.visible = true;
                this.cureentPage = this.home_group;
            }
        };
        //显示资讯页
        HomePage.prototype.showNews = function () {
            var _this = this;
            cor.Socket.getIntance().sendmsg('GET_POST_LIST', {
                "page": 1,
                "page_size": 100,
                "is_index": 0
            }, function (rdata) {
                Log(rdata);
                _this.news_list0.dataProvider = new eui.ArrayCollection(rdata);
                if (_this.changeBtnState(_this.news_btn)) {
                    _this.cureentPage.visible = false;
                    _this.news_group.visible = true;
                    _this.cureentPage = _this.news_group;
                }
            }, this);
        };
        //显示交易所
        HomePage.prototype.showExchange = function () {
            Game.TipsSkin.instance().show("暂未开放");
            return;
            this.changeBtnState(this.exchange_btn);
        };
        //显示个人中心
        HomePage.prototype.showPersonal = function () {
            var _this = this;
            cor.Socket.getIntance().sendmsg('GET_ME', {}, function (rdata) {
                Log(rdata);
                if (_this.changeBtnState(_this.personal_btn)) {
                    _this.cureentPage.visible = false;
                    _this.personal_group.visible = true;
                    _this.cureentPage = _this.personal_group;
                    _this.nickName.text = rdata.nickname;
                    _this.my_invite_code.text = rdata.invitation_code;
                    _this.telNum.text = GameData.UserPhone;
                    _this.headImg.source = rdata.picture;
                    GameData.UserInfo = rdata;
                }
            }, this);
        };
        HomePage.prototype.updata_info = function () {
            this.headImg.source = GameData.UserInfo.picture;
            this.nickName.text = GameData.UserInfo.nickname;
        };
        //进入游戏
        HomePage.prototype.gotoGame = function () {
            var _this = this;
            cor.Socket.getIntance().sendmsg('GET_USER_BASE_INFO', {}, function (rdata) { return __awaiter(_this, void 0, void 0, function () {
                var loadingScene;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Log(rdata);
                            egret.MainContext.instance.stage.setContentSize(1334, 750);
                            egret.MainContext.instance.stage.orientation = egret.OrientationMode.LANDSCAPE;
                            egret.MainContext.instance.stage.scaleMode = egret.StageScaleMode.FIXED_HEIGHT;
                            GameData.GameWidth = egret.MainContext.instance.stage.stageWidth;
                            GameData.GameHeigth = egret.MainContext.instance.stage.stageHeight;
                            GameData.BGame = true;
                            GameData.UserInfo = rdata;
                            loadingScene = new Game.LoadingView();
                            this.addChild(loadingScene);
                            return [4 /*yield*/, RES.loadGroup("gameres", 0, loadingScene)];
                        case 1:
                            _a.sent();
                            loadingScene.dispose();
                            cor.MainScene.instance().addChild(new Game.GameScene);
                            return [2 /*return*/];
                    }
                });
            }); }, this);
        };
        //显示钱包界面
        HomePage.prototype.showPurse = function () {
            Game.TipsSkin.instance().show("暂未开放");
        };
        //显示卡界面
        HomePage.prototype.showCard = function () {
            Game.TipsSkin.instance().show("暂未开放");
        };
        //设置界面
        HomePage.prototype.showSettingPage = function () {
            cor.MainScene.instance().addChild(new Game.SettingPage());
        };
        return HomePage;
    }(cor.BaseScene));
    Game.HomePage = HomePage;
    __reflect(HomePage.prototype, "Game.HomePage");
})(Game || (Game = {}));
//# sourceMappingURL=HomePage.js.map