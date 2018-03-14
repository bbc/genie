import convert from './convert.js';
import flatMapDeep from '../flatMapDeep.js';
let func = convert('flatMapDeep', flatMapDeep);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
