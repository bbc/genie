import convert from './convert.js';
import lt from '../lt.js';
var func = convert('lt', lt);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
