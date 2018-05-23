import convert from './convert.js';
import pull from '../pull.js';
let func = convert('pull', pull);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
