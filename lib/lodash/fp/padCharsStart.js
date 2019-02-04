import convert from './convert.js';
import padCharsStart from '../padStart.js';
var func = convert('padCharsStart', padCharsStart);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
