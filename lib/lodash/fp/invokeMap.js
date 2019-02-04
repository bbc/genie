import convert from './convert.js';
import invokeMap from '../invokeMap.js';
var func = convert('invokeMap', invokeMap);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
