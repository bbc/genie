import convert from './convert.js';
import overSome from '../overSome.js';
let func = convert('overSome', overSome);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
