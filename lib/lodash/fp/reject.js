import convert from './convert.js';
import reject from '../reject.js';
let func = convert('reject', reject);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
