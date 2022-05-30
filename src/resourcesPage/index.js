import { invoke } from '@tauri-apps/api/tauri'
import React, { Component } from 'react';
import '../scrollbar.css';
import '../fonts.css';
import '../animations.css';
import '../App.css';
import './style.css';

import {SearchTab} from './search.js';
import {InstalledTab} from './installed.js';

export default class ResourcesPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: "installed",
        };
    }

    setTab = (tab) => {
        this.setState({
            activeTab: tab
        });
    }

    render() {
        let tabDisplay;

        if (this.state.activeTab === "search") {
            tabDisplay = <SearchTab/>;
        } else {
            tabDisplay = <InstalledTab/>;
        }

        return (
            <div className='page resources'>
                <div className='tabs no-select'>
                    <div className={"tab " + (
                        this.state.activeTab === "installed" ? "active" : ""
                    )}
                    onClick={() => this.setTab("installed")}>
                        Installed
                        <div className='line'></div>
                    </div>
                    <div className={"tab " + (
                        this.state.activeTab === "search" ? "active" : ""
                    )}
                    onClick={() => this.setTab("search")}>
                        Search
                        <div className='line'></div>
                    </div>
                </div>

                <div className='frame'>
                    {tabDisplay}
                </div>
            </div>
        )
    }
}