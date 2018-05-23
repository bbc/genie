import convert from './convert.js';
import assignAllWith from '../assignWith.js';
let func = convert('assignAllWith', assignAllWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
