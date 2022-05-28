// Handle curseforge requests

import { invoke } from '@tauri-apps/api/tauri'

const BASE = "https://api.curseforge.com";

/**
 * It takes a path and a body, and returns a JSON object.
 * Makes a POST request containing a body rather than GET with parameters
 * @param path - /api/v2/addon/search
 * @param body - {
 * @returns A Promise.
 */
export async function getCurseForgeBody(path, body) {
    let inputBody = JSON.stringify(body);
    let HEADERS = getHeaders();
    let path = BASE + path;

    let r = await fetch(path, {
        method: 'POST',
        headers: HEADERS,
        body: inputBody
    })
    .then(function(resp) {
        console.log(`body response from ${path}`);

        if (!resp.ok) {
            throw `Server error: [${resp.status}] [${resp.statusText}] [${resp.url}]`;
        }
        return resp.json()
    })
    .catch((err) => {
        console.error(`error fetching from ${finalPath}: ${err}`);
        return;
    });

    return r;
}


/**
 * It takes a path and a params object, and returns a JSON object from the CurseForge API
 * https://docs.curseforge.com/
 * @param path - The path to the API endpoint.
 * @param params - {
 * @returns A function that returns a promise.
 */
export async function getCurseForge(path, params) {
    const HEADERS = await getHeaders();

    let paramsStr = stringFromParams(params);
    let finalPath = BASE + path + paramsStr;

    console.log(`Calling ${finalPath} with`, HEADERS)

    let r = await fetch(finalPath,
        {
            method: 'GET',
            headers: HEADERS,
            mode: 'cors',
        }
    ).then(function(resp) {
        console.log(`response from ${finalPath}`);
        if (!resp.ok) {
            throw `Server error: [${resp.status}] [${resp.statusText}] [${resp.url}]`;
        }
        return resp.json();
    })
    .catch((err) => {
        console.error(`error fetching from ${finalPath}: ${err}`);
        return;
    });

    return r;
}
/**
 * It returns an object containing the headers required to make a request to
 * the CurseForge API
 * @returns a promise.
 */

async function getHeaders() {
    const API_KEY = await invoke('get_curseforge_api_key')
        .then(function(data) {
            return data;
        })
        .catch((err) => {
            console.error(`couldnt retrieve curseforge api key: ${err}`);
    });

    return {
        'Content-Type':'application/json',
        'Accept':'application/json',
        'x-api-key': API_KEY
    };
}

/**
 * For each category in the array of categories, if the parentCategoryId of the category is equal to
 * the parentCategoryId of the node, then push the category to the children array.
 * @param cats - the array of categories
 * @param n - the current node
 * @returns An array of objects.
 */
export function getChildrenCategories(cats, n) {
    let children = [];
    
    for (const cat of cats['data']) {
        if (cat['parentCategoryId'] == n) {
            children.push(cat);
        }
    }

    return children;
}

/**
 * It takes an object and returns a string of the form "key1=value1&key2=value2&key3=value3"
 * @param params - {
 * @returns A string of the form "key1=value1&key2=value2&key3=value3"
 */
function stringFromParams(params) {
    let s = "?";

    for (const [key, value] of Object.entries(params)) {
        s += `${key}=${value}&`;
    };

    // remove last char '&'
    s = s.substring(0, s.length - 1);
    return s;
}