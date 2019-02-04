import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import toLower from '../toLower.js';
var func = convert('toLower', toLower, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
