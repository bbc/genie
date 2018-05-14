export function parseUrlParams(paramsString) {
    if (!valid()) {
        return {};
    }

    const keyValues = paramsString.slice(paramsString.indexOf("?") + 1).split("&");
    return keyValues.reduce((params, hash) => {
        const [key, val] = hash.split("=");
        return Object.assign(params, { [key]: parseBooleans(val) });
    }, {});

    function parseBooleans(val) {
        const decodedComponent = decodeURIComponent(val);

        if (decodedComponent === "true") {
            return true;
        } else if (decodedComponent === "false") {
            return false;
        } else {
            return decodedComponent;
        }
    }

    function valid() {
        const hasQuestionMark = paramsString.indexOf("?") >= 0;
        const hasEqualsSymbol = paramsString.indexOf("=") >= 0;

        return hasQuestionMark && hasEqualsSymbol;
    }
}
