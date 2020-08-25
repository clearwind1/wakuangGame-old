var UserPhone = 'UserPhone';
var UserPassword = 'UserPassword';
var UpdataUserInfo = 'UpdataUserInfo';
var ChangeIdentity = 'ChangeIdentity';
var ExitGame = 'ExitGame';
var NEW_NOTICE = 'NEW_NOTICE';
var GameMusic = 'GameMusic';
var UpdataGameInfo = 'UpdataGameInfo';
var StartDigMine = 'StartDigMine';
var DigMineTime = 'DigMineTime';
/**
 * 性别：男：1，女：2
 */
var SEX;
(function (SEX) {
    SEX[SEX["Man"] = 1] = "Man";
    SEX[SEX["Woman"] = 2] = "Woman";
})(SEX || (SEX = {}));
/**
 * 身份： 矿工：1，矿主：2
 */
var IDENTITY;
(function (IDENTITY) {
    IDENTITY[IDENTITY["Miner"] = 1] = "Miner";
    IDENTITY[IDENTITY["Owner"] = 2] = "Owner";
})(IDENTITY || (IDENTITY = {}));
/**
 * 机器类型： 挖掘机：1，淘洗机器：2
 */
var ENGINE_TYPE;
(function (ENGINE_TYPE) {
    ENGINE_TYPE[ENGINE_TYPE["EXCAVATE"] = 1] = "EXCAVATE";
    ENGINE_TYPE[ENGINE_TYPE["PANNING"] = 2] = "PANNING";
})(ENGINE_TYPE || (ENGINE_TYPE = {}));
//# sourceMappingURL=GameEnum.js.map