import convert from './convert.js';
import uniqBy from '../uniqBy.js';
let func = convert('uniqBy', uniqBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
