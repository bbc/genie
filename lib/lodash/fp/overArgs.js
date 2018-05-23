import convert from './convert.js';
import overArgs from '../overArgs.js';
let func = convert('overArgs', overArgs);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
