import convert from './convert.js';
import defaultsDeepAll from '../defaultsDeep.js';
var func = convert('defaultsDeepAll', defaultsDeepAll);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
