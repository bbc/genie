import convert from './convert.js';
import words from '../words.js';
var func = convert('words', words);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
