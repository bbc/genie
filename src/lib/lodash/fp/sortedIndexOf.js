import convert from './convert.js';
import sortedIndexOf from '../sortedIndexOf.js';
let func = convert('sortedIndexOf', sortedIndexOf);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
