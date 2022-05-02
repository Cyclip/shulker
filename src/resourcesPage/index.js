import { invoke } from '@tauri-apps/api/tauri'
import React, { Component } from 'react';
import '../scrollbar.css';
import '../fonts.css';
import '../animations.css';
import '../App.css';
import './style.css';
import {
    getChildrenCategories
} from '../curseforge/categories.js';

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
        return (
            <div className='page resources'>
                <div className='tabs'>
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
            </div>
        )
    }
}