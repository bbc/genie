import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import constant from '../constant.js';
let func = convert('constant', constant, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
