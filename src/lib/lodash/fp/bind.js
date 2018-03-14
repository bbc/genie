import convert from './convert.js';
import bind from '../bind.js';
let func = convert('bind', bind);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
