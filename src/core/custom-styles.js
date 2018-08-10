export const addCustomStyles = parentElement => {
    const customStyles = {
        ".hide-focus-ring:focus": "{outline:none;}",
        ".gel-button": "{ -webkit-user-select: none; }",
    };
    const styleElement = document.createElement("style");
    const styles = Object.keys(customStyles).map(style => {
        return style + customStyles[style];
    });
    styleElement.innerHTML = styles.join(" ");
    parentElement.appendChild(styleElement);
};
