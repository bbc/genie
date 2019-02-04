import convert from './convert.js';
import sortedLastIndex from '../sortedLastIndex.js';
var func = convert('sortedLastIndex', sortedLastIndex);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
