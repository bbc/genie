import convert from './convert.js';
import intersection from '../intersection.js';
let func = convert('intersection', intersection);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
