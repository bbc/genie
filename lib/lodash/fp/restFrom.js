import convert from './convert.js';
import restFrom from '../rest.js';
var func = convert('restFrom', restFrom);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
