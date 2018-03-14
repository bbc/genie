import convert from './convert.js';
import join from '../join.js';
let func = convert('join', join);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
