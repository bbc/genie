import convert from './convert.js';
import drop from '../drop.js';
let func = convert('drop', drop);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
