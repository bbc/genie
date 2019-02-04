import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import sortedUniq from '../sortedUniq.js';
var func = convert('sortedUniq', sortedUniq, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
