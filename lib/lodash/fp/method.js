import convert from './convert.js';
import method from '../method.js';
let func = convert('method', method);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
