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
        return second.id - first.id;
    })

    return resourcePackCats;
}