/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import notp from "notp";
const genToken = () => notp.totp.gen("sdK3uk]'mDCj,,zq");
export const appendToken = url => (url.includes("?") ? `${url}&token=${genToken()}` : `${url}?token=${genToken()}`);
