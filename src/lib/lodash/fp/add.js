import convert from './convert.js';
import add from '../add.js';
let func = convert('add', add);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
