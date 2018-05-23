import convert from './convert.js';
import transform from '../transform.js';
let func = convert('transform', transform);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
