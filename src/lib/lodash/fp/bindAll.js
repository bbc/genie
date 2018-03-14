import convert from './convert.js';
import bindAll from '../bindAll.js';
let func = convert('bindAll', bindAll);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
