// Handle curseforge requests

import { invoke } from '@tauri-apps/api/tauri'

const API_KEY = invoke('get_curseforge_api_key')
    .then((data) => {data.text()})
    .catch((err) => {
        console.error(`couldnt retrieve curseforge api key: ${err}`);
});
