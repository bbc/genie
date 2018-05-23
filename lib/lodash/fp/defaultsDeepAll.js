import convert from './convert.js';
import defaultsDeepAll from '../defaultsDeep.js';
let func = convert('defaultsDeepAll', defaultsDeepAll);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
