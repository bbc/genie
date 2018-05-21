import convert from './convert.js';
import parseInt from '../parseInt.js';
let func = convert('parseInt', parseInt);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
