import convert from './convert.js';
import some from '../some.js';
let func = convert('some', some);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
