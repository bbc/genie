import convert from './convert.js';
import sortedLastIndexOf from '../sortedLastIndexOf.js';
let func = convert('sortedLastIndexOf', sortedLastIndexOf);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
