import convert from './convert.js';
import includes from '../includes.js';
let func = convert('includes', includes);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
