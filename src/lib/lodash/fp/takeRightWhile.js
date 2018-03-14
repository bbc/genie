import convert from './convert.js';
import takeRightWhile from '../takeRightWhile.js';
let func = convert('takeRightWhile', takeRightWhile);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
