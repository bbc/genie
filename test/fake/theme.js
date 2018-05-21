const Stub = {
    panels: [{}],
};

const WithPanels = panels => {
    return Object.assign({}, Stub, { panels: panels });
};

export { Stub, WithPanels };
