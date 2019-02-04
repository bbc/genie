import convert from './convert.js';
import mapKeys from '../mapKeys.js';
var func = convert('mapKeys', mapKeys);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
