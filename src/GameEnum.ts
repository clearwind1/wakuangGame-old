
const UserPhone = 'UserPhone';
const UserPassword = 'UserPassword';

const UpdataUserInfo = 'UpdataUserInfo';
const ChangeIdentity = 'ChangeIdentity';
const ExitGame = 'ExitGame';

const NEW_NOTICE = 'NEW_NOTICE';
const GameMusic = 'GameMusic';
const UpdataGameInfo = 'UpdataGameInfo';

const StartDigMine = 'StartDigMine';
const DigMineTime = 'DigMineTime';

/**
 * 性别：男：1，女：2
 */
enum SEX { Man = 1, Woman }
/**
 * 身份： 矿工：1，矿主：2
 */
enum IDENTITY { Miner = 1, Owner }
/**
 * 机器类型： 挖掘机：1，淘洗机器：2
 */
enum ENGINE_TYPE { EXCAVATE = 1, PANNING }