import convert from './convert.js';
import unset from '../unset.js';
let func = convert('unset', unset);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
