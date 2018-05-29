import convert from './convert.js';
import wrap from '../wrap.js';
let func = convert('wrap', wrap);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
