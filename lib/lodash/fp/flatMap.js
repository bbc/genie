import convert from './convert.js';
import flatMap from '../flatMap.js';
let func = convert('flatMap', flatMap);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
