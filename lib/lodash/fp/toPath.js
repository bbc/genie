import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import toPath from '../toPath.js';
var func = convert('toPath', toPath, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
