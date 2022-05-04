import { invoke } from '@tauri-apps/api/tauri'
import React, { Component } from 'react';
import '../scrollbar.css';
import '../fonts.css';
import '../animations.css';
import '../App.css';
import './search.css';

import {getCategories} from '../curseforge/categories.js';
import {
    getVersions
} from '../curseforge/search.js';

import { SearchIcon } from '@heroicons/react/solid'
import { toHaveAccessibleDescription } from '@testing-library/jest-dom/dist/matchers';


class SelectVersion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedVal: props.selected,
            selectCallback: props.selectCallback
        };
    }

    update = (id) => {
        this.setState({
            selectedVal: id
        });
    }

    updateSelectedVersion = (e) => {
        console.log("callback for", e.target.value);
        this.state.selectCallback(e.target.value);
    }

    render() {
        return (
            <select 
                className='searchbarItemBig'
                value={this.state.selectedVal}
                onChange={this.updateSelectedVersion}
            >
                {
                    this.props.versions.length > 0 ? this.props.versions.map((ver) => (
                        <option key={ver} value={ver}>{ver}</option>
                    ))
                    : <option key="loading">Loading..</option>
                }
            </select>
        );
    }
}


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

            // all versions to be selected
            versions: [],

            // selected category id
            selectedCategoryId: 5244,

            // Search bar query
            searchQuery: "",

            // Current selected search version filter
            selectedVersion: "",
        }
    }

    
    // When component mounts/loads
    async componentDidMount() {
        let categories = await getCategories();
        let versions = await getVersions();

        this.setState({
            categories: categories,
            versions: versions,
            selectedCategoryId: categories[0].id,
            selectedVersion: "any",
        });
    }

    // Callback from single category
    selectCallback = (id) => {
        console.log("recieved select callback from", this.state.selectedCategoryId, "to", id);
        this.setState({
            selectedCategoryId: id,
        });
        this.categoryList.update(id);
    }

    versionSelectCallback = (id) => {
        this.setState({
            selectedVersion: id
        });
        this.versionListRef.update();
    }

    /* It's a function that updates the search query. */
    updateSearchQuery = (e) => {
        const val = e.target.value;

        this.setState({
            searchQuery: val
        });
    }

    /* It's a function that updates the selected version. */
    updateSelectedVersion = (event) => {
        this.setState({
            selectedVersion: event.target.value
        });
    }

    render() {
        const SearchBar = (
            <input
                className='searchbarItemSmall'
                placeholder='Search resource pack..'
                value={this.state.searchQuery}
                onInput={(e) => this.updateSearchQuery(e)}
            ></input>
        );

        return (

            <div className='search no-select'>
                <div className='categories'>
                    <h3>Categories</h3>
                    <CategoryList 
                        categories={this.state.categories}
                        selected={this.state.selectedCategoryId}
                        selectCallback={this.selectCallback}
                        ref={(ip) => this.categoryList = ip}
                    />
                </div>
                <div className='explorer'>
                    <div className='searchbar'>
                        {SearchBar}
                        <button className='searchbarItemBig searchButton'>
                            <SearchIcon className='searchIcon'/>
                        </button>
                        <SelectVersion
                            versions={this.state.versions}
                            selected={this.state.selectedVersion}
                            selectCallback={this.versionSelectCallback}
                            ref={(ip) => this.versionListRef = ip}
                        />
                    </div>
                </div>
            </div>
        )
    }
}