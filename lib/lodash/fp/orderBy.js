import convert from './convert.js';
import orderBy from '../orderBy.js';
let func = convert('orderBy', orderBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
