/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "./gmi/gmi.js";
import fp from "../../lib/lodash/fp/fp.js";

const getId = x => x.id;
const getGenieStore = () => gmi.getAllSettings().gameData?.genie ?? {};
const mergeItems = itemList => item => ({ ...item, ...itemList?.find(def => def.id === item.id) });
const getFilterParams = config => ({ ids: config.defaults?.map(getId) ?? [], tags: config.include ?? [] });
const tagIn = config => tag => config.tags.includes(tag);
const include = (config, keepIds) => item =>
	!config.tags.length || config.ids.includes(item.id) || item.tags?.some(tagIn(config)) || keepIds.includes(item.id);
const addQty = qty => item => ({ ...item, qty }); //TODO this should be add global defaults. qty might not even be present? needed for shop
const getStoredFn = key => () => getGenieStore()?.collections?.[key] ?? [];
const keyById = arr => Object.fromEntries(arr.map(x => [x.id, x]));
const mergeToList = (stored, item) => Object.values(fp.merge(keyById(stored), keyById(item)));

const warn = message => {
	console.warn(message); // eslint-disable-line no-console
	return false;
};

const validateFn = catalogue =>
	fp.cond([
		[
			config => typeof config !== "object",
			() => warn('config must be an object, e.g: {id: "hammer", state: "purchased", qty: 1}'),
		],
		[config => catalogue.every(item => item.id !== config.id), () => warn("Item id does not exist in catalogue")],
		[fp.stubTrue, fp.stubTrue],
	]);

export const initCollection = screen => key => {
	const getStored = getStoredFn(key);
	const config = screen.cache.json.get(`collections/${key}`);

	const storagePath = ["collections", key];
	const catalogue = fp.isString(config.catalogue)
		? screen.cache.json.get(`collections/${config.catalogue}`)
		: config.catalogue;

	const valid = validateFn(catalogue);

	const getAll = () =>
		catalogue
			.filter(include(getFilterParams(config), getStored().map(getId)))
			.map(addQty(config.defaultQty ?? 1))
			.map(mergeItems(config.defaults))
			.map(mergeItems(getStored()));

	const get = key => getAll().find(item => item.id === key);

	const set = config => {
		if (!valid(config)) return;

		gmi.setGameData("genie", fp.setWith(Object, storagePath, mergeToList(getStored(), [config]), getGenieStore()));
	};

	const collection = {
		config,
		get,
		getAll,
		set,
	};

	collections.set(key, collection);

	return collection;
};

export let collections = new Map();
