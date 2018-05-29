import convert from './convert.js';
import omit from '../omit.js';
let func = convert('omit', omit);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
