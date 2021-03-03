/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const parseBooleans = val => {
    const decodedComponent = decodeURIComponent(val);

    if (decodedComponent === "true") {
        return true;
    } else if (decodedComponent === "false") {
        return false;
    } else {
        return decodedComponent;
    }
};

const valid = paramsString => {
    const hasQuestionMark = paramsString.indexOf("?") >= 0;
    const hasEqualsSymbol = paramsString.indexOf("=") >= 0;

    return hasQuestionMark && hasEqualsSymbol;
};

export function parseUrlParams(paramsString) {
    if (!valid(paramsString)) {
        return {};
    }

    const keyValues = paramsString.slice(paramsString.indexOf("?") + 1).split("&");
    return keyValues.reduce((params, hash) => {
        const [key, val] = hash.split("=");
        return Object.assign(params, { [key]: parseBooleans(val) });
    }, {});
}
