import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import defer from '../defer.js';
let func = convert('defer', defer, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
