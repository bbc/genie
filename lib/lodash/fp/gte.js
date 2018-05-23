import convert from './convert.js';
import gte from '../gte.js';
let func = convert('gte', gte);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
