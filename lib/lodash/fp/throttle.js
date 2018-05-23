import convert from './convert.js';
import throttle from '../throttle.js';
let func = convert('throttle', throttle);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
