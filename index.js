#!/usr/bin/env node
const asciichart = require("asciichart");
const cp = require("child_process");

const s0 = [];

function summarize(input, length) {
  const scale = Math.ceil(input.length / length);

  const retCount = Math.floor(input.length / scale);
  const ret = [];
  for (let i = 0; i < retCount; i++) {
    ret[i] = 0;
    for (let j = 0; j < scale; j++) {
      ret[i] += input[i * scale + j];
    }
    ret[i] /= scale;
  }

  return ret;
}

const getUsedMemory = () => {
  return parseFloat(
    cp
      .execSync("nvidia-smi --query-gpu=memory.used --format=csv,nounits")
      .toString()
      .split("\n")[1]
  );
};

const memTotal = parseFloat(
  cp
    .execSync("nvidia-smi --query-gpu=memory.total --format=csv,nounits")
    .toString()
    .split("\n")[1]
);

setInterval(() => {
  s0.push(getUsedMemory());
  const q0 = summarize(s0, 100);

  console.clear();
  console.log(asciichart.plot(q0, { height: 15 }));
  console.log("Total memory:", memTotal, "(MiB)");
}, 1000);
