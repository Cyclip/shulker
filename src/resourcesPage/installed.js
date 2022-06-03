import { invoke, convertFileSrc } from '@tauri-apps/api/tauri'
import React, { Component } from 'react';
import '../scrollbar.css';
import '../fonts.css';
import '../animations.css';
import '../App.css';
import './installed.css';
import '../colouring.css';
import LoadingSVG from '../loading.svg';
import { ColouredString } from '../colouring';

import { 
    TrashIcon,
    FolderOpenIcon,
 } from '@heroicons/react/solid'

 import {
    EmojiSadIcon,
 } from '@heroicons/react/outline'

export class InstalledTab extends Component {
    constructor(props) {
        super(props);
        // setTab prop required

        this.state = {
            /* list of all installed packs, example:
                [
                    {
                        name: "coloured resource pack name",
                        desc: "pack description",
                        filename: "pack.zip",
                        path: "path/to/pack.zip",
                        cached_img_path: "path/to/icon.png"
                    }
                ]

                All resource packs root files' contents (pack.mcmeta, pack.png)
                are cached, and the image path is specified as tmpImagePath
            */
            installedPacks: [],
        };
    }

    async componentDidMount() {
        this.loadPacks();
    }

    loadPacks = async() => {
        console.warn("no packs loaded");
        invoke("get_all_installed_packs")
        .then((r) => {
            this.setState({
                installedPacks: r
            });
        })
        .catch((err) => console.error("get_all_installed_packs", err));
    }

    render() {
        const packList = this.state.installedPacks.map((pack, index) => (
            <div className='pack' key={pack.name}>
                <div className='image'>
                    {
                        pack.cached_img_path === ''
                        ? <img src="https://static.wikia.nocookie.net/minecraft_gamepedia/images/7/78/Unknown_pack.png/"></img>
                        : <img src={convertFileSrc(pack.cached_img_path)}></img>
                    }
                </div>
                <div className='details'>
                    <h3 className='text name'>{new ColouredString(pack.name).toHtml()}</h3>
                    <h5 className='text desc'>{new ColouredString(pack.desc).toHtml()}</h5>
                    <h5 className='text filename'>{pack.filename}</h5>
                </div>
                <div className="buttons">
                    <button className='openFolder'>
                        <FolderOpenIcon className='icon'/>
                        <h3 className='text'>Open</h3>
                    </button>
                    <button className='uninstall'>
                        <TrashIcon className='icon'/>
                        <h3 className='text'>Uninstall</h3>
                    </button>
                </div>
            </div>
        ));

        const emptyList = (
            <div className='emptyContainer'>
                <div className='contents'>
                    <EmojiSadIcon className='icon'/>
                    <h4 className='text'>You don't have any resource packs installed right now.</h4>
                    <h5 
                        className='text slim no-select'
                        onClick={() => {
                            console.log("cCLIKEDD");
                            this.props.setTab("search")
                        }}
                    >Click here to install some!</h5>
                </div>                
            </div>
        )

        return (
            <div className='packContainer'>
                {
                    this.state.installedPacks.length > 0
                    ? packList
                    : emptyList
                }
            </div>
        );
    }
}