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

/* It's a React component that renders a list of Category components. */
class CategoryList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedId: props.selected,
            selectCallback: props.selectCallback,
        }
    }

    update = (newId) => {
        console.log("updating id from", this.state.selectedId, "to", newId);
        this.setState({
            selectedId: newId,
        });
    }

    select = (id) => {
        console.log("calling callback for", id);
        this.state.selectCallback(id);
    }

    render() {
        const listItems = this.props.categories.map((category) => 
            <div className={"category " + (
                this.state.selectedId === category.id ? "selected" : ""
            )} onClick={() => this.select(category.id)} key={category.id}>
                <img src={category.iconUrl} className='thumbnail'/>
                <h4 className='name'>{category.name}</h4>
                <div className='sep'></div>
            </div>
        );

        return (
            <div className='categoriesContainer'>
                {listItems}
            </div>
        );
    }
}

// Search tab
export class SearchTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // all categories to be mapped out
            categories: [],

            // selected category id
            selectedCategoryId: 5244,
        }
    }

    // When component mounts/loads
    async componentDidMount() {
        let categories = await getCategories();

        this.setState({
            categories: categories,
            selectedCategoryId: categories[0].id,
        });
        
        console.log("cat", categories);
    }

    // Callback from single category
    selectCallback = (id) => {
        console.log("recieved select callback from", this.state.selectedCategoryId, "to", id);
        this.setState({
            selectedCategoryId: id,
        });
        this.categoryList.update(id);
    }

    render() {
        return (
            <div className='search no-select'>
                <div className='categories'>
                    <h2>Categories</h2>
                    <CategoryList 
                        categories={this.state.categories}
                        selected={this.state.selectedCategoryId}
                        selectCallback={this.selectCallback}
                        ref={(ip) => this.categoryList = ip}
                    />
                </div>
                <div className='explorer'>
                    
                </div>
            </div>
        )
    }
}