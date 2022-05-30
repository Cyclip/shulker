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
            installedPacks: [],
        };
    }

    render() {
        return (
            <div className='packContainer'>

            </div>
        );
    }
}