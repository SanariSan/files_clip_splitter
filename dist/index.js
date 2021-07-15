/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __nccwpck_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__nccwpck_require__.r(__webpack_exports__);

;// CONCATENATED MODULE: external "fs"
const external_fs_namespaceObject = require("fs");;
;// CONCATENATED MODULE: external "readline"
const external_readline_namespaceObject = require("readline");;
;// CONCATENATED MODULE: external "util"
const external_util_namespaceObject = require("util");;
;// CONCATENATED MODULE: ./clip.js




const sleep = (0,external_util_namespaceObject.promisify)(setTimeout);
const statAsync = (0,external_util_namespaceObject.promisify)(external_fs_namespaceObject.stat);
const { READ_FOLDER, WRITE_FOLDER, WRITE_FILE_NAME, LINES } = JSON.parse(
	(0,external_fs_namespaceObject.readFileSync)("./settings.json"),
);

async function prepareFS() {
	let err = false;

	await statAsync(`./${READ_FOLDER}`).catch(() => {
		console.warn("NO READ FOLDER");
		err = true;
	});

	await statAsync(`./${WRITE_FOLDER}`).catch(() => {
		console.warn("NO WRITE FOLDER");
		err = true;
	});

	if (err) {
		await sleep(10000);
		process.exit(1);
	}
}

async function init() {
	await prepareFS();

	const dirNames = (0,external_fs_namespaceObject.readdirSync)(`./${READ_FOLDER}`);
	let fileCounter = 0;
	let linesReaded = 0;
	let timeout = null;

	function log() {
		console.log(linesReaded);
		timeout = setTimeout(function () {
			log();
		}, 1000);
	}

	log();

	for (let fName of dirNames) {
		const rs = (0,external_fs_namespaceObject.createReadStream)(`./${READ_FOLDER}/${fName}`);
		const rl = (0,external_readline_namespaceObject.createInterface)({
			input: rs,
			crlfDelay: Infinity,
		});

		for await (let line of rl) {
			if (linesReaded < LINES) {
				linesReaded++;
			} else {
				console.log(`_____\n READY | ${fileCounter}_${WRITE_FILE_NAME}.csv\n_____`);
				linesReaded = 1;
				fileCounter++;
			}

			(0,external_fs_namespaceObject.appendFileSync)(`./${WRITE_FOLDER}/${fileCounter}_${WRITE_FILE_NAME}.csv`, `${line}\n`);
		}
	}

	await sleep(1000);
	clearTimeout(timeout);
	await sleep(2147483647);
}

init();

module.exports = __webpack_exports__;
/******/ })()
;