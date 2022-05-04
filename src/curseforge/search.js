import {
    getCurseForge,
    getChildrenCategories,
} from './requests.js';

// Get a list of versions
export async function getVersions() {
    let versionsResp = await getCurseForge("/v1/minecraft/version", {});
    let versions = ["All versions"].concat(versionsResp['data'].map((i) => i.versionString));

    return versions;
}

// Get a filtered list of resource packs
export async function getResourcePacks(categoryId, searchQuery, versionString) {
    let params = {
        "gameId": 432,
        "pageSize": 30,
    };

    if (categoryId !== 0) {
        params["categoryId"] = categoryId;
    }

    if (searchQuery !== "") {
        params["searchFilter"] = searchQuery;
    }

    if ((versionString !== "All versions") && (versionString != "")) {
        params["gameVersion"] = versionString;
    }

    let resp = await getCurseForge(
        "/v1/mods/search",
        params
    );

    return resp['data'];
}