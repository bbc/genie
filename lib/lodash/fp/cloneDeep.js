import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import cloneDeep from '../cloneDeep.js';
let func = convert('cloneDeep', cloneDeep, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
