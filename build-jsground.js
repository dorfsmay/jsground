#!/usr/bin/env node

const sourceDir = "./src";
const htmlFile = `${sourceDir}/jsground.html`;
const cssFile = `${sourceDir}/jsground.css`;
const templateFile = `${sourceDir}/jsground-pre-build.js`;
const targetDir = "./dist";
const targetFile = `${targetDir}/jsground.js`;

const fsPromises = require("fs").promises;
const fs = require("fs");

async function readFile(fn) {
  const content = await fsPromises.readFile(fn, "utf8").catch((err) => {
    console.error(`Error while reading file "${fn}"`);
    console.error(err);
    process.exit(err.errno);
  });
  return content;
}

function cleanHtml(dirty) {
  const clean = dirty.match(/<!--BEGIN-->\n(.+?)\n\s*<!--END-->/s);
  if (clean === null) {
    console.error("Match for BEGIN/END comment in html file failed.");
    process.exit(1);
  }
  return clean[1];
}

async function distDir() {
  const dir = "dist";
  if (!fs.existsSync(dir)) {
    await fsPromises.mkdir(dir).catch((err) => {
      console.error(`Error while creating directory "${dir}"`);
      console.error(err);
      process.exit(err.errno);
    });
  }
}

async function main() {
  const [html, _distDirResult, css, script ] = await Promise.all([
    readFile(htmlFile).then((content) => cleanHtml(content)),
    distDir(),
    readFile(cssFile),
    readFile(templateFile),
  ]);

  let data = "const html = `\n";
  data += html;
  data += "\n`\n";
  data += "const css = `\n";
  data += css;
  data += "\n`\n";
  data += script;

  await fsPromises.writeFile(targetFile, data).catch((err) => {
    console.error(`Error while writing file "${targetFile}"`);
    console.error(err);
    process.exit(err.errno);
  });
}

main();
