import convert from './convert.js';
import defaultsAll from '../defaults.js';
let func = convert('defaultsAll', defaultsAll);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
