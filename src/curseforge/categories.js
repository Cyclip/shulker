import {
    getCurseForge,
    getChildrenCategories,
} from './requests.js';

/**
 * It gets all the categories from CurseForge, then it gets all the children of the resource pack
 * category, and then it sorts them by ID
 * @returns An array of objects.
 */
export async function getCategories() {
    let cats = await getCurseForge("/v1/categories", {"gameId": 432});

    // resource pack ID: 12
    // find children of this
    let resourcePackCats = getChildrenCategories(cats, 12);
    resourcePackCats.sort(function(first, second) {
        return first.id - second.id;
    })
    let concatCats = [{
        "id": 0,
        "gameId": 432,
        "name": "All resource packs",
        "slug": "all_resource_packs",
        "url": "https://www.curseforge.com/minecraft/texture-packs",
        "iconUrl": "https://media.forgecdn.net/avatars/409/149/637623854107756264.png",
        "dateModified": "2016-10-03T22:53:09.303Z",
        "isClass": true
    }].concat(resourcePackCats);

    return concatCats;
}