import convert from './convert.js';
import trimChars from '../trim.js';
var func = convert('trimChars', trimChars);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
