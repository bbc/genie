import convert from './convert.js';
import rest from '../rest.js';
let func = convert('rest', rest);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
