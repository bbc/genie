import convert from './convert.js';
import pullAll from '../pullAll.js';
let func = convert('pullAll', pullAll);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
