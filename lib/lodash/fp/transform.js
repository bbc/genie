import convert from './convert.js';
import transform from '../transform.js';
var func = convert('transform', transform);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
