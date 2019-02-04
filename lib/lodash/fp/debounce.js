import convert from './convert.js';
import debounce from '../debounce.js';
var func = convert('debounce', debounce);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
