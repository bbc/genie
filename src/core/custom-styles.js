export const addCustomStyles = parentElement => {
    let styles = "";
    const element = document.createElement("style");
    Object.keys(customStyles()).forEach(style => {
        styles = styles + style + customStyles()[style];
    });
    element.innerHTML = styles;
    parentElement.appendChild(element);
};

const customStyles = () => {
    return {
        ".hide-focus-ring:focus": "{outline:none;}",
    };
};
