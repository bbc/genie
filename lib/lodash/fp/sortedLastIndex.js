import convert from './convert.js';
import sortedLastIndex from '../sortedLastIndex.js';
let func = convert('sortedLastIndex', sortedLastIndex);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
