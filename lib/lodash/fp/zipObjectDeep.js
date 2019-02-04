import convert from './convert.js';
import zipObjectDeep from '../zipObjectDeep.js';
var func = convert('zipObjectDeep', zipObjectDeep);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
