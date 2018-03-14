import convert from './convert.js';
import mapValues from '../mapValues.js';
let func = convert('mapValues', mapValues);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
