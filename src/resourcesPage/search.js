import { invoke } from '@tauri-apps/api/tauri'
import React, { Component } from 'react';
import '../scrollbar.css';
import '../fonts.css';
import '../animations.css';
import '../App.css';
import './search.css';
import LoadingSVG from '../loading.svg';

import {getCategories} from '../curseforge/categories.js';
import {
    getVersions,
    getResourcePacks,
    filterInstalled,
    getPackFiles,
} from '../curseforge/search.js';

import { 
    SearchIcon,
    DownloadIcon,
 } from '@heroicons/react/solid'
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
            selectedCategoryId: 0,

            // Search bar query
            searchQuery: "",

            // Current selected search version filter
            selectedVersion: "",

            /* resource pack listings */
            // all listed resource packs
            resourcePacks: [],

            // cooldown for searching
            lastSearch: 0,

            // if download list popup shown
            downloadListPopupVisible: false,

            // name of current download
            downloadListName: "name",

            // map of all versions to download url
            downloadListFiles: [["pp", "pprul"]],
        }
    }

    
    // When component mounts/loads
    async componentDidMount() {
        console.log("mounting component");
        this.loadCategories();
        this.loadVersions();
        this.loadResourcePacks();
    }

    // Load resource packs into state based on filters
    // (selectedCategoryId, searchQuery, selectedVersion)
    loadResourcePacks = async() => {
        // get packs
        let packs = await getResourcePacks(
            this.state.selectedCategoryId,
            this.state.searchQuery,
            this.state.selectedVersion,
        );

        console.log("packs", packs);

        // packs are retrieved from api, does not contain
        // info regarding if it is installed
        // refresh pack states to determine whether they are
        // installed or not
        let installedPacks = await filterInstalled(packs);
        
        // apply
        packs.map(i => {
            i['installed'] = installedPacks.includes(i['name']) ? "installed" : "uninstalled";
        });

        //packs = packs.slice(2, 6);
        //console.warn("Packs are truncated");

        this.setState({
            resourcePacks: packs
        });

        console.log("packs", packs);
    }

    // Load categories into state
    loadCategories = async() => {
        let categories = await getCategories();
        this.setState({
            categories: categories,
            selectedCategoryId: categories[0].id,
        });
    }

    // Load versions into state
    loadVersions = async() => {
        let versions = await getVersions();

        this.setState({
            versions: versions,
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

    // reload all resource packs
    search = () => {
        console.log("called search");
        let now = Date.now();
        let next = this.state.lastSearch + 1000;

        // if cooldown passed
        if (now > next) {
            this.setState({
                resourcePacks: [],
                lastSearch: now
            },
                // callback when it finishes changing
                () => this.loadResourcePacks()
            );
        }
    }

    /* It's a function that returns the logo of a resource pack. */
    getLogo = (pack) => {
        if (pack['logo'] !== null) {
            return pack['logo']['thumbnailUrl'];
        } else {
            return "https://via.placeholder.com/150";
        }
    }

    /* It's a function that adds commas to numbers. */
    numberWithCommas = (x) => {
        return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }

    showDownloadList = () => {
        this.setState({
            downloadListPopupVisible: true,
        });

        console.log("state files", this.state.downloadListFiles);
    }

    downloadUrl = (url) => {
        console.log("downloadUrl", url);
    }

    // try to downlaod the resouce pack
    tryDownload = async(packIndex) => {
        let files = await getPackFiles(this.state.resourcePacks[packIndex].id);
        // returns an object where the key is the version and string is the download url

        this.setState({
            downloadListFiles: files,
        }, () => {
            // callback
            this.showDownloadList();
        })

        // // disgustingly update state
        // console.log("try download called for", packIndex);
        // this.setState(state => {
        //     state.resourcePacks[packIndex]["installed"] = "installing";
        //     return state;
        // }, () => {
        //     // actually try to download it
            
        // });
    }

    render() {
        const SearchBar = (
            <input
                className='searchbarItemSmall'
                placeholder='Search resource packs..'
                value={this.state.searchQuery}
                onInput={(e) => this.updateSearchQuery(e)}
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        console.log("search bar search")
                        this.search();
                    }
                }}
            ></input>
        );

        let ResourcePackList;

        if (this.state.resourcePacks.length === 0) {
            ResourcePackList = (<div className="loading-container">
                <img className="loading" src={LoadingSVG}></img>
            </div>);
        } else {
            ResourcePackList = (
                <div className='resourcePacks'>
                    {
                        this.state.resourcePacks.map((pack, index) => (
                            <div className='pack' key={pack['id']}>
                                <img className='preview' src={this.getLogo(pack)}/>
                                <div className='desc'>
                                    <div className='title'>
                                        <h3 className='packName'>{pack['name']}</h3>
                                        <h6 className='packAuthor'>By {
                                            pack['authors'].length > 0 ? pack['authors'][0]['name']
                                            : "unknown author"
                                        }</h6>
                                    </div>
                                    <h6 className='packSummary'>{pack['summary']}</h6>
                                </div>
                                <div className='stats'>
                                        <DownloadIcon className='icon'/>
                                        <h6 className='packDownloads'>{this.numberWithCommas(pack['downloadCount'])}</h6>
                                    </div>
                                <button 
                                    className={
                                        'packButton ' + (pack['installed'])
                                    }
                                    onClick={() => {
                                        console.log("click registered")
                                        if (pack['installed'] === "uninstalled") {
                                            this.tryDownload(index)
                                        }
                                    }}
                                ><span className='buttonText'></span></button>
                                <div className='sep'></div>
                            </div>
                        ))
                    }
                </div>
            );
        }

        const DownloadList = (
            <div className='downloadList'>
                <div className='box'>
                    <h2 className='title'>Select version for {this.state.downloadListName}</h2>
                    <div className='versions'>
                        {
                            this.state.downloadListFiles.map((item) => (
                                <button
                                    key={item[0]}
                                    className='download'
                                    onClick={() => {this.downloadUrl(item[1])}}
                                >{item[0]}</button>
                            ))
                        }
                    </div>
                </div>
            </div>
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
                        <SelectVersion
                            versions={this.state.versions}
                            selected={this.state.selectedVersion}
                            selectCallback={this.versionSelectCallback}
                            ref={(ip) => this.versionListRef = ip}
                        />
                        <button className='searchbarItemBig searchButton' onClick={() => {
                            this.search();
                            console.log("icon search");
                        }}>
                            <SearchIcon className='searchIcon'/>
                        </button>
                    </div>

                    {ResourcePackList}
                
                </div>

                {
                    this.state.downloadListPopupVisible && DownloadList
                }
            </div>
        )
    }
}