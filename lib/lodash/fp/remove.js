import convert from './convert.js';
import remove from '../remove.js';
let func = convert('remove', remove);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
