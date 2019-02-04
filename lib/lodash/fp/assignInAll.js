import convert from './convert.js';
import assignInAll from '../assignIn.js';
var func = convert('assignInAll', assignInAll);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
