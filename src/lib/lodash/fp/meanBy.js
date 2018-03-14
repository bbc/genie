import convert from './convert.js';
import meanBy from '../meanBy.js';
let func = convert('meanBy', meanBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
