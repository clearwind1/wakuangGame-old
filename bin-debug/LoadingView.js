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
    var LoadingView = (function (_super) {
        __extends(LoadingView, _super);
        function LoadingView() {
            var _this = _super.call(this) || this;
            _this.skinName = "LoadingView";
            _this._index = 0;
            _this.init();
            _this.initEnent();
            return _this;
        }
        LoadingView.prototype.init = function () {
            // init
            this.loadingTx.text = "";
            this.tipTx.text = "";
            this.loadingBar.width = 0;
            this._index = 0;
            this.showTip();
        };
        LoadingView.prototype.showTip = function () {
            var _this = this;
            var changeTx = ['欢迎来到Richman（有矿）',
                '正在招聘专属矿区管家',
                '正在前往矿石挖掘场地',
                '马上就要抵达目的地，请稍等',
                '越大的矿区，越能产出更多的矿石',
                '想要快速挖到矿石，试不试配置齐全的人员与设备如何',
                '交易所的交易价格会不定时更新，一定留意好',
                '想要招募或应聘矿工？去矿区管理处看看吧'];
            this.tipTx.text = changeTx[this._index];
            this._tag = setTimeout(function () {
                _this._index = (_this._index + 1) % changeTx.length;
                _this.showTip();
            }, 1500);
        };
        LoadingView.prototype.initEnent = function () {
        };
        LoadingView.prototype.onProgress = function (current, total) {
            this.loadingTx.text = "Loading..." + Math.floor(current / total * 100) + "%";
            this.loadingBar.width = 600 * (current / total);
        };
        LoadingView.prototype.dispose = function () {
            clearTimeout(this._tag);
            this.parent.removeChild(this);
        };
        return LoadingView;
    }(cor.BaseScene));
    Game.LoadingView = LoadingView;
    __reflect(LoadingView.prototype, "Game.LoadingView", ["RES.PromiseTaskReporter"]);
})(Game || (Game = {}));
//# sourceMappingURL=LoadingView.js.map