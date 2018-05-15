import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import plant from '../plant';
let func = convert('plant', plant, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
