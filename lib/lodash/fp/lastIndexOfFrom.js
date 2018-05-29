import convert from './convert.js';
import lastIndexOfFrom from '../lastIndexOf.js';
let func = convert('lastIndexOfFrom', lastIndexOfFrom);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
