import convert from './convert.js';
import invokeArgsMap from '../invokeMap.js';
var func = convert('invokeArgsMap', invokeArgsMap);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
