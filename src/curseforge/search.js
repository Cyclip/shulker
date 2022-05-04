import {
    getCurseForge,
    getChildrenCategories,
} from './requests.js';

export async function getVersions() {
    let versionsResp = await getCurseForge("/v1/minecraft/version", {});
    console.log("resp", versionsResp);
    let versions = ["Any version"].concat(versionsResp['data'].map((i) => i.versionString));

    console.log("getVersions() versions", versions);

    return versions;
}