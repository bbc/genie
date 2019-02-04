import convert from './convert.js';
import map from '../map.js';
var func = convert('map', map);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
