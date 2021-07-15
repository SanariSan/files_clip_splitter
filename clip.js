import { createReadStream, readdirSync, appendFileSync, readFileSync, stat } from "fs";
import { createInterface } from "readline";
import { promisify } from "util";

const sleep = promisify(setTimeout);
const statAsync = promisify(stat);
const { READ_FOLDER, WRITE_FOLDER, WRITE_FILE_NAME, LINES } = JSON.parse(
	readFileSync("./settings.json"),
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

	const dirNames = readdirSync(`./${READ_FOLDER}`);
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
		const rs = createReadStream(`./${READ_FOLDER}/${fName}`);
		const rl = createInterface({
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

			appendFileSync(`./${WRITE_FOLDER}/${fileCounter}_${WRITE_FILE_NAME}.csv`, `${line}\n`);
		}
	}

	await sleep(1000);
	clearTimeout(timeout);
	await sleep(2147483647);
}

init();
