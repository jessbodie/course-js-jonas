import Search from './models/Search'; 
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';


// Global state of the app
// Search object
// Current recipe object
// Shopping list object
// Liked recipes
const state = {};

///////////////////////
// SEARCH CONTROLLER //
const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput();

    if (query) {
        // 2. New search object and add to state
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);        

        try {
            // 4. Search for recipes
            await state.search.getResults();

            // 5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (err) {
            alert('There was an error with returning search results');
            console.log(err);
            clearLoader();
        }
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
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

///////////////////////
// RECIPE CONTROLLER //

const controlRecipe = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#', '');

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) {
            searchView.highlightSelected(id);
        }

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render the recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
            // console.log(state.recipe);
        } catch (err) {
            alert('Error processing recipe')
        }
    }
};

['hashchange', 'load'].forEach((event) => {
    window.addEventListener(event, controlRecipe);
});


// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    console.log(state.recipe);
});






///////////////////////
// NOTES
// Importing
// import str from './models/Search';
// import { add, multiply as m, ID } from './views/searchView';
// console.log(`Using ${str} imported functions! ${add(ID,2)} and ${m(2, 5)}.`);
// import * as searchView from './views/searchView';
// console.log(`Using imported functions! ${searchView.add(searchView.ID, 3)} and ${searchView.multiply(2, 5)}.`);



// http://food2fork.com/api/search 
// http://food2fork.com/api/get 