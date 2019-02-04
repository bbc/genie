import convert from './convert.js';
import bindKey from '../bindKey.js';
var func = convert('bindKey', bindKey);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
