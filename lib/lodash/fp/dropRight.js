import convert from './convert.js';
import dropRight from '../dropRight.js';
let func = convert('dropRight', dropRight);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
