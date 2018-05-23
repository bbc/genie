import convert from './convert.js';
import zipObject from '../zipObject.js';
let func = convert('zipObject', zipObject);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
