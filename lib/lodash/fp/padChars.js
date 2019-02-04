import convert from './convert.js';
import padChars from '../pad.js';
var func = convert('padChars', padChars);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
