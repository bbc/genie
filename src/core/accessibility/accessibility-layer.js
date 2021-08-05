/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import crel from "../../../lib/crel.es.js";
import { getContainerDiv } from "../loader/container.js";

let domButtons = [];
let domGroups = [];
let root = crel("div", { id: "accessibility", role: "application" });

const hasAccessibleElement = button => Boolean(fp.get("accessibleElement.el.id", button));

const removeFromParent = el => el.parentElement && el.parentElement.removeChild(el);

const clear = () => {
	const children = Array.from(root.childNodes);
	const groups = children.filter(child => child.dataset.type === "group");
	const rootButtons = children.filter(child => child.dataset.type !== "group");
	const buttons = groups.reduce((acc, group) => acc.concat(Array.from(group.childNodes)), []).concat(rootButtons);

	buttons.map(removeFromParent);
	groups.map(removeFromParent);
};

const clearButtons = () => {
	domButtons = [];
	domGroups = [];
};

const getParent = (sceneGroups, buttonGroup) => {
	const group = sceneGroups.find(group => group.id === buttonGroup);
	return group ? group.el : root;
};

const addButtonToLayer = button => {
	const parent = getParent(domGroups, button.config.group);
	parent.appendChild(button.accessibleElement.el);
};

const addGroupToLayer = group => root.appendChild(group.el);

const createDom = () => {
	domGroups.forEach(addGroupToLayer);
	domButtons.filter(hasAccessibleElement).forEach(addButtonToLayer);
};

export const addGroupAt = (id, pos) => {
	pos = pos || domGroups.length;

	const el = crel("div", { id: "accessible-group-" + id, "data-type": "group" });
	domGroups.splice(pos, 0, { el, id });
};

export const create = () => getContainerDiv().appendChild(root);
export const addButton = button => domButtons.push(button);
export const removeButton = buttonToRemove => (domButtons = domButtons.filter(button => button !== buttonToRemove));
export const destroy = fp.flow([clear, clearButtons]);
export const reset = fp.flow([clear, createDom]);
