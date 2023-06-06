/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import FontLoaderPlugin from "../font-loader/font-plugin.js";
import { JSON5Plugin } from "../json5-loader/json5-plugin.js";
import { ParticlesPlugin } from "../particles-loader/particles-plugin.js";
import BBCodeTextPlugin from "../../../../lib/rexbbcodetextplugin.min.js";
import "/node_modules/phaser/plugins/spine4.1/dist/SpinePlugin.min.js";
import NinePatchPlugin from "../../../../lib/rexninepatchplugin.min.js";

export const getDefaultPlugins = options => {
	const defaultPlugins = {
		global: [
			{
				key: "FontLoader",
				plugin: FontLoaderPlugin,
				start: true,
			},
			{
				key: "JSON5Loader",
				plugin: JSON5Plugin,
				start: true,
			},
			{
				key: "ParticlesLoader",
				plugin: ParticlesPlugin,
				start: true,
			},
			{
				key: "rexBBCodeTextPlugin",
				plugin: BBCodeTextPlugin,
				start: true,
			},
			{
				key: "rexNinePatchPlugin",
				plugin: NinePatchPlugin,
				start: true,
			},
		],
		scene: [
			{
				key: "SpinePlugin",
				plugin: window.SpinePlugin,
				mapping: "spine",
			},
		],
	};

	return {
		global: [...defaultPlugins.global, ...(options?.plugins?.global ?? [])],
		scene: [...defaultPlugins.scene, ...(options?.plugins?.scene ?? [])],
	};
};
