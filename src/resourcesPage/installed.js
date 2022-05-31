import { invoke } from '@tauri-apps/api/tauri'
import React, { Component } from 'react';
import '../scrollbar.css';
import '../fonts.css';
import '../animations.css';
import '../App.css';
import './installed.css';
import LoadingSVG from '../loading.svg';

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

            </div>
        );
    }
}