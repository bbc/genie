import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isSymbol from '../isSymbol.js';
let func = convert('isSymbol', isSymbol, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
