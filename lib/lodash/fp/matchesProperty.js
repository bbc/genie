import convert from './convert.js';
import matchesProperty from '../matchesProperty.js';
var func = convert('matchesProperty', matchesProperty);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
