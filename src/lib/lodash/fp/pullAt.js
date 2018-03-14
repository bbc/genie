import convert from './convert.js';
import pullAt from '../pullAt.js';
let func = convert('pullAt', pullAt);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
