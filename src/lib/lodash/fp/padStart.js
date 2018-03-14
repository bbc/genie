import convert from './convert.js';
import padStart from '../padStart.js';
let func = convert('padStart', padStart);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
