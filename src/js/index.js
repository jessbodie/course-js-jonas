import Search from './models/Search'; 
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';


// Global state of the app
// Search object
// Current recipe object
// Shopping list object
// Liked recipes
const state = {};
window.state = state;

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
            recipeView.renderRecipe(
                state.recipe,
                false
                // state.likes.isLiked(id)
            );

            // console.log(state.recipe);
        } catch (err) {
            console.log(err);
            alert('Error processing recipe')
        }
    }
};

['hashchange', 'load'].forEach((event) => {
    window.addEventListener(event, controlRecipe);
});

/////////////////////
// LIST CONTROLLER //
const controlList = () => {
    // Create a new list IF there is none yet
    if (!state.list) {
        state.list = new List();
    }

    // Add each ingredient to the list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};


/////////////////////
// LIKE CONTROLLER //

const controlLike = () => {
    // Create a new likes list IF there is none yet
    if (!state.likes) {
        state.likes = new Likes();
    }

    const currentID = state.recipe.id;

    // Add each recipe to the likes list, it not already liked
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to the UI
        likesView.renderLikes(newLike);

    // User liked current recipe already
    } else {
        // Add like to the state
        state.likes.deleteLike(currentID);
        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Add like to the UI
        likesView.deleteLike(currentID);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
};




// Handle delete and update list item events
elements.shopping.addEventListener('click', (e) => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state and UI
        state.list.deleteItem(id);
        listView.deleteItem(id);
    // Handle the count    
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

// Restore liked recipes on the page
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    
    // Render the existing likes
    state.likes.likes.forEach((like) => {
        likesView.renderLikes(like);
    });
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
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients for shopping list
    controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Add likes to Like List
        controlLike();
    }
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