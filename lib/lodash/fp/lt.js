import convert from './convert.js';
import lt from '../lt.js';
let func = convert('lt', lt);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
