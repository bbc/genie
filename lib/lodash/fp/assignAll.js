import convert from './convert.js';
import assignAll from '../assign.js';
let func = convert('assignAll', assignAll);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
