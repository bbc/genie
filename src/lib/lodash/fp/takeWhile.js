import convert from './convert.js';
import takeWhile from '../takeWhile.js';
let func = convert('takeWhile', takeWhile);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
