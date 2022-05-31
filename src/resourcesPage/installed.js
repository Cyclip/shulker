import { invoke } from '@tauri-apps/api/tauri'
import React, { Component } from 'react';
import '../scrollbar.css';
import '../fonts.css';
import '../animations.css';
import '../App.css';
import './installed.css';
import LoadingSVG from '../loading.svg';

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
                        filename: "path/to/pack.zip",
                        tmpImagePath: "path/to/icon.png"
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
        
        let sample = [];
        for (let i = 0; i < 0; i++) {
            sample.push({
                name: `pack${i}`,
                desc: "example desc",
                filename: `pack${i}.zip`,
                // empty => placeholder
                tmpImagePath: ``,
            });
        }

        this.setState({
            installedPacks: sample
        }, () => console.log(this.state));
    }

    render() {
        const packList = this.state.installedPacks.map((pack, index) => (
            <div className='pack'>
                <div className='image'>
                    {
                        pack.tmpImagePath === ''
                        ? <img src="https://static.wikia.nocookie.net/minecraft_gamepedia/images/7/78/Unknown_pack.png/"></img>
                        : <img src={pack.tmpImagePath}></img>
                    }
                </div>
                <div className='details'>
                    <h3 className='text name'>{pack.name}</h3>
                    <h5 className='text desc'>{pack.desc}</h5>
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