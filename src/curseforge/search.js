import { invoke } from '@tauri-apps/api/tauri'

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
        "classId": 12,
        "sortField": 2, // sort by popularity
        "sortOrder": "desc"
    };

    if (categoryId !== 0) {
        params["categoryId"] = categoryId;
    }

    if (searchQuery !== "") {
        params["searchFilter"] = searchQuery;
    }

    if ((versionString !== "any") && (versionString != "")) {
        params["gameVersion"] = versionString;
    }

    let resp = await getCurseForge(
        "/v1/mods/search",
        params
    );

    return resp['data'];
}

export async function filterInstalled(packs) {
    let filenames = getFilenames(packs);
    console.log("filenames", filenames);
    
    // Example response:
    // {
    //     " Astral Sorcery Modpack": [
    //         "java's astral modpack.zip"
    //     ],
    //     " Ultra Mlnecraft": [
    //         "Minecraft Ultra-v1.zip"
    //     ],
    //     ...
    // }

    const installed = await invoke('get_installed_packs', {"packs": filenames}
    ).then(function(data) {
            return data;
        })
        .catch((err) => {
            console.error(`couldnt retrieve installed packs: ${err}`);
    });
    
    return installed;
}

/**
 * It takes an array of objects, and returns an object whose keys are the values of the `name` property
 * of each object in the array, and whose values are arrays of the unique values of the `fileName`
 * property of each object in the `latestFiles` property of each object in the array.
 * @param packs - an array of objects, each of which has a name and a latestFiles property.
 * @returns An object with the name of the pack as the key and an array of filenames as the value.
 */
function getFilenames(packs) {
    let rv = {};

    for (const pack of packs) {
        rv[pack['name']] = Array.from(
            new Set(
                pack["latestFiles"].map(i => i["fileName"])
            )
        );
    };

    return rv;
}