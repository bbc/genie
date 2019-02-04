import convert from './convert.js';
import template from '../template.js';
var func = convert('template', template);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
