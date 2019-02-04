import convert from './convert.js';
import spreadFrom from '../spread.js';
var func = convert('spreadFrom', spreadFrom);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
