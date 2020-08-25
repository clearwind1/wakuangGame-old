/***
 * GameData:  游戏基础数据
 */
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameData = (function () {
    function GameData() {
    }
    /**游戏名称 */
    GameData.GAMENAME = "RichManGame";
    /**游戏设计宽度 */
    GameData.GameDesignWidth = 750;
    /**游戏设计高度 */
    GameData.GameDesignHeigth = 1334;
    /**屏幕宽度 */
    GameData.GameWidth = 750;
    /**屏幕高度 */
    GameData.GameHeigth = 1334;
    /**主场景宽度偏移量 */
    GameData.WidthOFFX = 0;
    /**主场景高度偏移量 */
    GameData.HeigthOFFY = 0;
    /**服务器连接地址 */
    GameData.ServerUrl = "http://47.107.80.152:8082/";
    GameData.ServerSocketUrl = "ws://148.70.80.204:9001/app";
    ///
    /**游戏界面 */
    GameData.BGame = false;
    //用户手机号
    GameData.UserPhone = '';
    //用户密码
    GameData.UserPassword = '';
    //用户信息
    GameData.UserInfo = {
        "nickname": "",
        "picture": "",
        "identity": 1,
        "invitation_code": "",
        "is_bind_mobile": true,
        "mobile": "",
        "is_bind_wx": false,
        "experience": 0,
        "grade": "1级",
        "designation": "初级学徒",
        "sex": 1,
        "birthday": "",
        "gts_number": 0,
        "mineral": 0,
        "current_grade_max_experience": 2427,
        "current_hold_area_grade": 1,
        "dig_time": -1,
        "current_hold_area_code": ""
    };
    return GameData;
}());
__reflect(GameData.prototype, "GameData");
//# sourceMappingURL=GameData.js.map