import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import wrapperLodash from '../wrapperLodash';
let func = convert('wrapperLodash', wrapperLodash, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
