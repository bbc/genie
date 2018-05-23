import convert from './convert.js';
import round from '../round.js';
let func = convert('round', round);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
