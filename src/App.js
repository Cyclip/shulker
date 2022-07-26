import { invoke } from '@tauri-apps/api/tauri'
import React, { Component } from 'react';
import './scrollbar.css';
import './fonts.css';
import './animations.css';
import './App.css';
import './mainPage.css';
import versionIcon from './version.svg';

// icon imports
import {
    CodeIcon,
    CubeTransparentIcon,
    HomeIcon,
} from '@heroicons/react/outline'

// pages
import VersionsPage from './versionsPage/index.js';
import ResourcesPage from './resourcesPage/index.js';
import AddonsPage from './addonsPage/index.js';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // current page opened
            page: "addons",
        };
    }

    openSetting = (window) => {
        this.setState({
            page: window
        });

        switch (window) {
            case "main":
                break;
            case "versions":
                window.versionComponent.updateProfileList(true);
                break;
        }
    }

    home = () => {
        if (this.state.versionChangesMade) {
            this.setState({
                saveChangesVersionsFlash: true,
            });
            return;
        }

        this.setState({
            page: "main",
        });
    }

    render() {
        return <div className="App">
            <div className="home" onClick={() => this.home()}>
                <HomeIcon/>
            </div>
            
            {
                this.state.page === "main" &&
                <div className="page main">
                    <h1 className="title">Select setting</h1>
                    <div className="panels">
                        <div className="panel" onClick={() => this.openSetting("versions")}>
                            <img src={versionIcon} className="panelIcon"></img>
                            <h2 className="text">
                                Versions
                            </h2>
                            <h6 className="text">
                                Manage your versions and its settings
                            </h6>
                        </div>
                        <div className="panel" onClick={() => this.openSetting("resources")}>
                            <CubeTransparentIcon className="panelIcon inverted"></CubeTransparentIcon>
                            <h2 className="text">
                                Resource packs
                            </h2>
                            <h6 className="text">
                                Customise textures and manage shaders
                            </h6>
                        </div>
                        <div className="panel" onClick={() => this.openSetting("addons")}>
                            <CodeIcon className="panelIcon inverted"></CodeIcon>
                            <h2 className="text">
                                Addons
                            </h2>
                            <h6 className="text">
                                Manage mods for Minecraft
                            </h6>
                        </div>
                    </div>
                </div>
            }

            {
                this.state.page === "versions" &&
                <VersionsPage/>
            }

{
                this.state.page === "resources" &&
                <ResourcesPage/>
            }

            {
                this.state.page === "addons" &&
                <AddonsPage/>
            }
        </div>
      ;
    }
}

export default App;
