import convert from './convert.js';
import partition from '../partition.js';
let func = convert('partition', partition);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
