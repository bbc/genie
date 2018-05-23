import convert from './convert.js';
import merge from '../merge.js';
let func = convert('merge', merge);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
