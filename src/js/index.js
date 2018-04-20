import str from './models/Search';

// import { add, multiply as m, ID } from './views/searchView';
import * as searchView from './views/searchView';

console.log(str);
// console.log(`Using imported functions! ${add(ID,2)} and ${m(2, 5)}.`);
console.log(`Using imported functions! ${searchView.add(searchView.ID, 3)} and ${searchView.multiply(2, 5)}.`);