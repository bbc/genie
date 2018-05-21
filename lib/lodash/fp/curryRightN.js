import convert from './convert.js';
import curryRightN from '../curryRight.js';
let func = convert('curryRightN', curryRightN);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
