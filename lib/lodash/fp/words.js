import convert from './convert.js';
import words from '../words.js';
let func = convert('words', words);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
