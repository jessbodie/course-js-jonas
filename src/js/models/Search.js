import axios from 'axios';
import * as SearchView from './../views/searchView';


export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        const key = 'cee9c06f729ff41a34e4754dc91fadb0';
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        try {
            const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            // console.log(this.result);
        } catch (err) {
            alert(err);
        }
    }
}


