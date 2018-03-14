import convert from './convert.js';
import lastIndexOf from '../lastIndexOf.js';
let func = convert('lastIndexOf', lastIndexOf);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
