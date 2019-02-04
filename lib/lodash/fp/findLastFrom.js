import convert from './convert.js';
import findLastFrom from '../findLast.js';
var func = convert('findLastFrom', findLastFrom);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
