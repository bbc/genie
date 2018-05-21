import convert from './convert.js';
import reduceRight from '../reduceRight.js';
let func = convert('reduceRight', reduceRight);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
