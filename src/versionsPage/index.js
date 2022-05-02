import { invoke } from '@tauri-apps/api/tauri'
import React, { Component } from 'react';
import '../scrollbar.css';
import '../fonts.css';
import '../animations.css';
import '../App.css';
import './style.css';
import loadingSvg from '../loading.svg';

// icon imports
import {
    PlusIcon,
    ChipIcon,
} from '@heroicons/react/outline'

export default class VersionsPage extends Component {
    constructor(props) {
        super(props);

        // communicate with parents
        window.versionComponent = this;

        this.state = {
            // if changes made
            versionChangesMade: false,

            // flash for if they wanna leave but they made unsaved changes
            saveChangesVersionsFlash: false,

            // currently editing version name?
            editingName: false,

            // mapped profiles
            profiles: [],

            // whether the user has selected a version
            // if false, load the first profile
            userSelected: false,

            // selected version rn
            selectedVersion: {
                // id of the profile
                id: "",
                
                // formatted time
                lastUsed: "",

                // all info contained inside the profile (key as id)
                contents: {
                    "created" : "",
                    "icon" : "",
                    "javaArgs" : "",
                    "lastUsed" : "",
                    "lastVersionId" : "",
                    "name" : "",
                    "type" : ""
                }
            }
        };
    }

    componentDidMount() {
        // set timer interval to update profile list
        this.interval = setInterval(() => this.updateProfileList(false), 1000);
    }

    updateProfileList = () => {
        invoke('get_profiles').then((result) => {
            this.setState({
                profiles: result["profiles"]
            });

            if (!this.state.userSelected) {
                // empty id ⇒ nothing selected
                this.selectVersionID(result[0]["id"], false);
            }
        });
    }

    setVersionChangesMade = (val) => {
        this.setState({
            versionChangesMade: val
        });
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
            invoke(
                "save_profile",
                {
                    id: this.state.selectedVersion.id,
                    profile: {
                        created: this.state.selectedVersion.contents.created,
                        icon: this.state.selectedVersion.contents.icon,
                        java_args: this.state.selectedVersion.contents.javaArgs,
                        last_used: this.state.selectedVersion.contents.lastUsed,
                        last_version_id: this.state.selectedVersion.contents.lastVersionId,
                        name: this.state.selectedVersion.contents.name,
                        prof_type: this.state.selectedVersion.contents.type,
                    }
                }
            )
                .then(() => {console.log("saved");})
                .catch((err) => {return console.error(err)})

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

    selectVersionID = (id, isUserAction) => {
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
                        "type": result["prof_type"].slice(1, -1)
                    }
                },
                userSelected: this.state.userSelected ? true : isUserAction
            });
        })
        .catch((error) => {
            console.error(error);
        });
    }

    formatTime = (timestr) => {
        return timestr;
    }

    test() {
        console.log("pp");
    }

    render() {        
        return (
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
                                    onClick={() => {this.selectVersionID(item["id"], true);}}>
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
        )
    }
}