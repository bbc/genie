//TODO what happens when this is minified?
export const SCRIPT_PATH = import.meta.url.split("/").slice(0,-1).join("/");

console.log("SCRIPT_PATH", SCRIPT_PATH);
