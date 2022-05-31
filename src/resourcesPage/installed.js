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

export class InstalledTab extends Component {
    constructor(props) {
        super(props);

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
        for (let i = 0; i < 10; i++) {
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
        return (
            <div className='packContainer'>
                {
                    this.state.installedPacks.map((pack, index) => (
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
                    ))
                }
            </div>
        );
    }
}