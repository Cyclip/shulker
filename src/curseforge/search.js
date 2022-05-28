import { invoke } from '@tauri-apps/api/tauri'

import {
    getCurseForge,
    getCurseForgeBody,
    getChildrenCategories,
} from './requests.js';

// Get a list of versions
export async function getVersions() {
    let versionsResp = await getCurseForge("/v1/minecraft/version", {});
    let versions = ["All versions"].concat(versionsResp['data'].map((i) => i.versionString));

    return versions;
}

export async function getPackFiles(id) {
    let data = await getCurseForge(`/v1/mods/${id}/files`, {});
    data = data.data;
    
    let versions = {};

    for (const fileIndex in data) {
        let file = data[fileIndex];
        for (const verIndex in file["gameVersions"]) {
            let ver = file["gameVersions"][verIndex];

            if (!versions.hasOwnProperty(ver)) {
                versions[ver] = file["downloadUrl"];
            }
        }
    }

    return objectToArr(versions);
}

function objectToArr(obj) {
    let result = [];

    for (const i in obj) {
        result.push([i, obj[i]]);
    }

    return result;
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
export async function filterInstalled(packs) {
    // get array of all mod IDs
    let ids = packs.map(i => i.id);
   
    // try to get all mods
    let resp = await getCurseForgeBody(
        "/v1/mods",
        {
            "modIds": ids
        }
    );

    resp = resp.data;
    console.log("response data", resp);

    // get filenames
    let filenames = {}

    for (const modIndex in resp) {
        let mod = resp[modIndex];
        let name = mod.name;
        let files = [];

        console.log("checking mod", mod);

        for (const fileIndex in mod.latestFilesIndexes) {
            let filename = mod.latestFilesIndexes[fileIndex].filename;

            if (!files.includes(filename)) {
                files.push(filename);
            }
        }
        
        filenames[name] = files;
        console.log(`setting ${name} to ${filenames}`);
    }

    console.log("filterInstalled filenames:", filenames);

    // check for each mod if its installed
    let installed = await invoke('get_installed_packs', {"packs": filenames})
    .then(function(data) {
        return data;
    })
    .catch((err) => {
        console.error(`couldnt retrieve installed packs: ${err}`);
        return;
    });

    console.log("filterInstalled installed:", installed);

    return installed;
}
