import convert from './convert.js';
import methodOf from '../methodOf.js';
let func = convert('methodOf', methodOf);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
