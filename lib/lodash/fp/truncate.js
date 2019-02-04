import convert from './convert.js';
import truncate from '../truncate.js';
var func = convert('truncate', truncate);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
