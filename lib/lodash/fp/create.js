import convert from './convert.js';
import create from '../create.js';
let func = convert('create', create);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
