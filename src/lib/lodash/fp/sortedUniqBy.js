import convert from './convert.js';
import sortedUniqBy from '../sortedUniqBy.js';
let func = convert('sortedUniqBy', sortedUniqBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
