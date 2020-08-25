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
    var MinerServerCenter = (function (_super) {
        __extends(MinerServerCenter, _super);
        function MinerServerCenter(info) {
            var _this = _super.call(this) || this;
            _this.skinName = "MinerServerCenter";
            _this.init(info);
            _this.initEvent();
            return _this;
        }
        MinerServerCenter.prototype.init = function (info) {
            // init
            var role = createDB('Lv1');
            role.x = role.width / 2;
            this.role_group.addChild(role);
            role.animation.play();
            this.head_group.addChild(new Game.headComment(this, '矿工管理处', 'MINER'));
            this._minerserverInfo = info;
            this.ownerList.itemRenderer = OwnerItem;
            for (var k in info) {
                info[k].code = info[k].code + "矿区";
                info[k].user_nickname = "矿主：" + info[k].user_nickname;
                info[k].name = "矿区等级：" + info[k].name;
                info[k].miner_num = info[k].current_work_count + '/' + info[k].max_work_count;
            }
            this.ownerList.dataProvider = new eui.ArrayCollection(info);
        };
        MinerServerCenter.prototype.initEvent = function () {
        };
        return MinerServerCenter;
    }(cor.BaseScene));
    Game.MinerServerCenter = MinerServerCenter;
    __reflect(MinerServerCenter.prototype, "Game.MinerServerCenter");
    var OwnerItem = (function (_super) {
        __extends(OwnerItem, _super);
        function OwnerItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "OwnerItem";
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.addToStage, _this);
            _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.removeFromStage, _this);
            return _this;
        }
        OwnerItem.prototype.addToStage = function () {
        };
        OwnerItem.prototype.removeFromStage = function () {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeFromStage, this);
        };
        OwnerItem.prototype.dataChanged = function () {
        };
        return OwnerItem;
    }(eui.ItemRenderer));
    __reflect(OwnerItem.prototype, "OwnerItem");
})(Game || (Game = {}));
//# sourceMappingURL=MinerServerCenter.js.map