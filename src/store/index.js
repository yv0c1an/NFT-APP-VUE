import authStore from "./auth"
import permissionStore from "./permission"
import roleStore from "./role"
import goodsStore from "./goods"
import userStore from "./user"
import AttachmentGroupStore from "./attachment_group"
import AttachmentStore from "./attachment"
import configStore from "./config"
import settingStore from "./setting"
import logStore from "./log"
import rechargeStore from "./recharge"
import pageStore from "./page"
import announcementStore from "./announcement"
import messageStore from "./message"
import authenticationStore from "./authentication";
import helpCategoryStore from "./help_category";
import helpStore from "./help";
import accountStore from "./account";
import withdrawalStore from "./withdrawal";
import goodsAlbumStore from "./goods_album";

let api = {
    authStore,
    permissionStore,
    roleStore,
    goodsStore,
    AttachmentGroupStore,
    AttachmentStore,
    configStore,
    userStore,
    settingStore,
    logStore,
    rechargeStore,
    pageStore,
    announcementStore,
    messageStore,
    authenticationStore,
    helpCategoryStore,
    helpStore,
    accountStore,
    withdrawalStore,
    goodsAlbumStore
}
export default api
