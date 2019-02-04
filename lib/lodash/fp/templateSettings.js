import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import templateSettings from '../templateSettings';
var func = convert('templateSettings', templateSettings, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
