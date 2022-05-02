import { invoke } from '@tauri-apps/api/tauri'
import React, { Component } from 'react';
import '../scrollbar.css';
import '../fonts.css';
import '../animations.css';
import '../App.css';
import '../style.css';
import {
    getChildrenCategories
} from '../curseforge/categories.js';

export default class ResourcesPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
        };
    }

    render() {
        return (
            <div className='page resources'>
                
            </div>
        )
    }
}