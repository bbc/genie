import convert from './convert.js';
import rearg from '../rearg.js';
let func = convert('rearg', rearg);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
