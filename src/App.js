import { invoke } from '@tauri-apps/api/tauri'
import React, { Component } from 'react';
import './scrollbar.css';
import './fonts.css';
import './animations.css';
import './App.css';
import './mainPage.css';
import './versionsPage.css';
import loadingSvg from './loading.svg';
import versionIcon from './version.svg';

// icon imports
import {
    CodeIcon,
    CubeTransparentIcon,
    PlusIcon,
    ChipIcon,
    HomeIcon,
} from '@heroicons/react/outline'

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // current page opened
            page: "versions",

            // --=  VERSIONS PAGE =--
            // if changes made
            versionChangesMade: false,

            // flash for if they wanna leave but they made unsaved changes
            saveChangesVersionsFlash: false,

            // currently editing version name?
            editingName: false,

            // mapped profiles
            profiles: [],

            // selected version rn
            selectedVersion: {
                // id of the profile
                id: "0c0b7b30094372140e1dcc4c90d24744",
                
                // formatted time
                lastUsed: "5th March 2022",

                // all info contained inside the profile (key as id)
                contents: {
                    "created" : "2021-11-06T11:53:48.727Z",
                    "icon" : "Glazed_Terracotta_Light_Blue",
                    "javaArgs" : "-Xmx4G -XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=32M",
                    "lastUsed" : "2022-03-05T13:56:12.353Z",
                    "lastVersionId" : "1.8.9-OptiFine_HD_U_M5",
                    "name" : "Optifine",
                    "type" : "custom"
                }
            }
        };
    }

    updateProfileList = () => {
        invoke('get_profiles').then((result) => {
            console.log(result);
            this.setState({
                profiles: result["profiles"]
            });
        });
    }

    setVersionChangesMade = (val) => {
        this.setState({
            versionChangesMade: val
        });
    }

    openSetting = (window) => {
        this.setState({
            page: window
        });

        if (window === "versions") {
            this.updateProfileList();
        }

        console.log(this.state);
    }

    updateJavaArgsInput = (e) => {
        this.setVersionChangesMade(true);
        const val = e.target.value;

        // update nested
        this.setState(state => {
            state.selectedVersion.contents.javaArgs = val
        });
    }

    updateIconInput = (e) => {
        this.setVersionChangesMade(true);
        const val = e.target.value;

        // update nested
        this.setState(state => {
            state.selectedVersion.contents.icon = val
        });
    }

    updateName = (e) => {
        this.setVersionChangesMade(true);
        const val = e.target.value;

        // update nested
        this.setState(state => {
            state.selectedVersion.contents.name = val
        });

        console.log(val, this.state.selectedVersion.contents.name);
    }

    saveVersions = () => {
        if (this.state.versionChangesMade === true) {
            this.setState({
                versionChangesMade: false
            });
        }
    }

    setEditingName = (v) => {
        if (this.state.editingName === !v) {
            this.setState({
                editingName: v,
            });
        }
    }

    home = () => {
        this.updateProfileList();
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

    selectVersionID = (id) => {
        invoke("get_profile", { id: id }).then((result) => {
            console.log("result");
            console.log(result);
            this.setState({
                selectedVersion: {
                    // id of the profile
                    id: id,
                    
                    // formatted time
                    lastUsed: this.formatTime(result["last_used"]),
    
                    // all info contained inside the profile (key as id)
                    contents: {
                        "created": result["created"].slice(1, -1),
                        "icon": result["icon"].slice(1, -1),
                        "javaArgs": result["java_args"].slice(1, -1),
                        "lastUsed": result["last_used"].slice(1, -1),
                        "lastVersionId": result["last_version_id"].slice(1, -1),
                        "name": result["name"].slice(1, -1),
                        "type": result["type"].slice(1, -1)
                    }
                },

            })
        })
        .catch((error) => {
            console.error(error);
        });
    }

    formatTime = (timestr) => {
        return timestr;
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
                        <div className="panel">
                            <CubeTransparentIcon className="panelIcon inverted"></CubeTransparentIcon>
                            <h2 className="text">
                                Resource packs
                            </h2>
                            <h6 className="text">
                                Customise textures and manage shaders
                            </h6>
                        </div>
                        <div className="panel">
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

            <div className="page versions">
                <div className="versionList">
                    <div className="listContainer">
                        {
                            this.state.profiles.length > 0 
                            ? this.state.profiles.map((item) => {
                                return (
                                <div 
                                    className={"bar " + (
                                        this.state.selectedVersion.id === item["id"] ? "selected" : ""
                                    )}
                                    onClick={() => {this.selectVersionID(item["id"]);}}>
                                    <ChipIcon className="icon"></ChipIcon>
                                    <h5 className="label truncate">{item["name"].length > 0 ? item["name"] : item["version_id"]}</h5>
                                    <h6 className="trueVer truncate">{item["version_id"]}</h6>
                                </div>
                                );
                            })
                            : <div className="loading-container">
                                <img className="loading" src={loadingSvg}></img>
                            </div>
                        }
                        
                    </div>
                    <div className="bar fixed">
                        <PlusIcon className="icon"></PlusIcon>
                        <h5 className="label">Add new version</h5>
                    </div>
                </div>
                <div className="versionDetails">
                    <button className="editName" onClick={(e) => {this.setEditingName(true)}}>Edit name</button>
                    <div className="name">
                        {
                            this.state.editingName
                            ? <input 
                                className="nameEdit" 
                                onInput={(e) => {console.log(e); this.updateName(e)}} defaultValue={this.state.selectedVersion.contents.name} 
                                spellCheck={false}
                                onKeyPress={(e) => {
                                    if (e.key == 'Enter') {
                                        this.setEditingName(false)
                                    }
                                }
                                }
                            ></input>
                            : <h1>{this.state.selectedVersion.contents.name}</h1>
                        }
                        <h6>{this.state.selectedVersion.contents.lastVersionId}</h6>
                    </div>
                    <h6>Last used {this.state.selectedVersion.lastUsed}</h6>
                    <div className="versionInputs">
                        <div className="input">
                            <h3>Java arguments</h3>
                            <input 
                            onInput={(e) => {this.updateJavaArgsInput(e)}}
                            defaultValue={this.state.selectedVersion.contents.javaArgs}
                            value={this.state.selectedVersion.contents.javaArgs}
                            spellCheck={false}></input>
                            <h6>The argument <span className="code">-Xmx?G</span> is the GB of ram to use</h6>
                        </div>
                        <div className="input">
                            <h3>Icon</h3>
                            <input onInput={(e) => {this.updateIconInput(e)}}
                            defaultValue={this.state.selectedVersion.contents.icon}
                            value={this.state.selectedVersion.contents.icon}
                            spellCheck={false}></input>
                            <h6>It is possible to use a URI (base64) image here</h6>
                        </div>
                        
                    </div>

                    <div 
                        className={
                            "saveChanges toFade " +
                            (this.state.versionChangesMade ? "show " : "hide ") +
                            (this.state.saveChangesVersionsFlash ? "flash" : "")
                        }
                        onAnimationEnd={() => this.setState({saveChangesVersionsFlash: false})}
                        onClick={(e) => {this.saveVersions()}}
                    >
                        <h4>Save changes</h4>
                    </div>
                </div>
            </div>
        </div>
        //{
        //    this.state.page === "main" &&
         //   
        //}
      ;
    }
}

export default App;
