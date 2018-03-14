import convert from './convert.js';
import mergeAll from '../merge.js';
let func = convert('mergeAll', mergeAll);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
