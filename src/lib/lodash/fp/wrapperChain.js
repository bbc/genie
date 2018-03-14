import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import wrapperChain from '../wrapperChain';
let func = convert('wrapperChain', wrapperChain, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
