import convert from './convert.js';
import differenceBy from '../differenceBy.js';
let func = convert('differenceBy', differenceBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
