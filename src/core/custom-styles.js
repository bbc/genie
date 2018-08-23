export const addCustomStyles = () => {
    const customStyles = [
        "html, body { overflow: hidden; }",
        ".hide-focus-ring:focus { outline:none; }",
        ".gel-button { -webkit-user-select: none; }",
    ];
    const styleElement = document.createElement("style");
    styleElement.innerHTML = customStyles.join(" ");
    document.head.appendChild(styleElement);
};
