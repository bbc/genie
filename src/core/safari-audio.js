/**
 * Resumes the Web Audio Context in Safari when its state is interrupted.
 * Temporary fix for a bug in Phaser.
 * See https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/state#resuming_interrupted_play_states_in_ios_safari
 *
 * @module core/safari-audio
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

export const addResumeSafariAudioContextEvent = game =>
    window.addEventListener("focus", () => game?.sound?.context?.state === "interrupted" && game?.sound?.context?.resume());
