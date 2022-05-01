// Handle curseforge requests

import { invoke } from '@tauri-apps/api/tauri'

const API_KEY = invoke('get_curseforge_api_key')
    .then((data) => {data.text()})
    .catch((err) => {
        console.error(`couldnt retrieve curseforge api key: ${err}`);
});

const HEADERS = {
    'Accept': 'application/json',
    'x-api-key': API_KEY
};

const BASE = "https://api.curseforge.com";

// GET request to curseforge
export default function getCurseForge(path, params) {
    let params = stringFromParams(params);
    let a = await fetch(BASE + path + params,
        {
            method: 'GET',
            headers: headers
        }
    ).then(function(res) {
        return res.json();
    });

    return a;
}

function stringFromParams(params) {
    let s = "";

    for (const [key, value] of Object.entries(params)) {
        s += `${key}=${value}&`;
    };

    // remove last char '&'
    s = s.splice(0, -1);
    return s;
}