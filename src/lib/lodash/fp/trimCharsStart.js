import convert from './convert.js';
import trimCharsStart from '../trimStart.js';
let func = convert('trimCharsStart', trimCharsStart);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
