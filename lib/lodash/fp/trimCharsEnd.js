import convert from './convert.js';
import trimCharsEnd from '../trimEnd.js';
let func = convert('trimCharsEnd', trimCharsEnd);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
