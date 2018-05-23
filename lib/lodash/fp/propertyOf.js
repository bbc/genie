import convert from './convert.js';
import propertyOf from '../get.js';
let func = convert('propertyOf', propertyOf);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
