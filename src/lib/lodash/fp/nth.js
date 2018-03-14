import convert from './convert.js';
import nth from '../nth.js';
let func = convert('nth', nth);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
