import convert from './convert.js';
import differenceWith from '../differenceWith.js';
let func = convert('differenceWith', differenceWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
