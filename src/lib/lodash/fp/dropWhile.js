import convert from './convert.js';
import dropWhile from '../dropWhile.js';
let func = convert('dropWhile', dropWhile);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
