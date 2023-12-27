const fs = require("fs");
const nReadlines = require("n-readlines");
const rawData = new nReadlines("./input/spanish.json");
const cliProgress = require("cli-progress");

const OUTPUT_FILE = "./output/spanish.json";

const MAX_LINES = 749192;

let line;
let lineNumber = 0;

const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
bar1.start(MAX_LINES, 0);

fs.writeFileSync(OUTPUT_FILE, "[");

let part = "";
const partSize = 2000;

while ((line = rawData.next())) {
  const isLastLine = lineNumber === MAX_LINES - 1;
  let lineString = line.toString("utf8");

  const parsed = JSON.parse(lineString);
  const words = getWords(parsed);

  for (const word of words) {
    let wordString = "\n" + JSON.stringify(word, null, 2);
    if (!isLastLine) {
      wordString = wordString + ",";
    }

    part += wordString;
  }

  if (lineNumber % partSize === 0) {
    fs.appendFileSync(OUTPUT_FILE, part);
    part = "";
  }

  lineNumber++;
  bar1.update(lineNumber);
}

bar1.stop();
fs.appendFileSync(OUTPUT_FILE, "\n]");

function getWords(word) {
  return word.senses.map((sense) => {
    return {
      pos: word.pos,
      lemma: word.word,
      raw_translation: sense.raw_glosses,
      translation: sense.glosses,
      tags: sense.tags,
      form_of: sense.form_of,
      wiki_id: sense.id,
      examples: (sense.examples ?? []).filter(
        (example) => example.type !== "quotation"
      ),
    };
  });
}
