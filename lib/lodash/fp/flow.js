import convert from './convert.js';
import flow from '../flow.js';
let func = convert('flow', flow);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
