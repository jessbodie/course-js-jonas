import Search from './models/Search'; 
import * as SearchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';


// Global state of the app
// Search object
// Current recipe object
// Shopping list object
// Liked recipes
const state = {};

const controlSearch = async () => {
    // 1. Get query from view
    const query = SearchView.getInput();

    if (query) {
        // 2. New search object and add to state
        state.search = new Search(query);

        // 3. Prepare UI for results
        SearchView.clearInput();
        SearchView.clearResults();
        renderLoader(elements.searchRes);
        

        // 4. Search for recipes
        await state.search.getResults();

        // 5. Render results on UI
        // console.log(state.search.result);
        clearLoader();
        SearchView.renderResults(state.search.result);
    }
};

elements.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    controlSearch();
});

elements.SearchResPages.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        SearchView.clearResults();
        SearchView.renderResults(state.search.result, goToPage);
    }
});

// Importing
// import str from './models/Search';
// import { add, multiply as m, ID } from './views/searchView';
// console.log(`Using ${str} imported functions! ${add(ID,2)} and ${m(2, 5)}.`);
// import * as searchView from './views/searchView';
// console.log(`Using imported functions! ${searchView.add(searchView.ID, 3)} and ${searchView.multiply(2, 5)}.`);



// http://food2fork.com/api/search 
// http://food2fork.com/api/get 

// API Key
//  