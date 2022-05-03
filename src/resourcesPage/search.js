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

function Category(props) {
    const value = props.categoryData;
    console.log("Category", value);

    return (
        <div className='category'>
            <h1>{value.id}</h1>
        </div>
    );
}

class CategoryList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const listItems = this.props.categories.map((category) => 
            <Category categoryData={category}/>
        );

        return (
            <div className='categoriesContainer'>
                {listItems}
            </div>
        );
    }
}

export class SearchTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // all categories to be mapped out
            categories: [],
        }
    }

    async componentDidMount() {
        let categories = await getCategories();

        this.setState({
            categories: categories,
        });
        
        console.log("cat", categories);
    }

    render() {
        return (
            <div className='search'>
                <div className='categories'>
                    <h2>Categories</h2>
                    <CategoryList categories={this.state.categories}/>
                </div>
                <div className='explorer'>
                    
                </div>
            </div>
        )
    }
}