import { invoke } from '@tauri-apps/api/tauri'
import React, { Component } from 'react';
import '../scrollbar.css';
import '../fonts.css';
import '../animations.css';
import '../App.css';
import './search.css';

import {
    getCategories
} from '../curseforge/categories.js';

export class SearchTab extends Component {
    constructor(props) {
        super(props);

        let cats = getCategories();
        console.log(cats);

        this.state = {
            // all categories to be mapped out
            categories: cats,
        }
    }

    render() {
        return (
            <div className='search'>
                <div className='categories'>
                    <h2>Categories</h2>
                </div>
                <div className='explorer'>
                    
                </div>
            </div>
        )
    }
}