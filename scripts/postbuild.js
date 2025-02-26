import fs from "fs";
import manifest from "../public/manifest.json" assert { type: "json" };

/**
 * readFile uses a Regex to filter, match, and return the static file based on
 * the `prefix` and `extension` in the directory based on the `path`.
 *
 * @param {string} path File path relative to the build directory - `'js'`
 * @param {string} prefix File prefix for the file name - `'index'`
 * @param {string} extension File extension - 'js'
 * @returns {string|null} File path or null if not found
 */
function readFile(path, prefix, extension) {
  const fullPath = `./dist/${path}`;

  if (!fs.existsSync(fullPath)) {
    console.error(`Directory ${fullPath} does not exist.`);
    return null;
  }

  const file = new RegExp(`^${prefix}\.[a-z0-9]+\.${extension}$`);
  const files = fs
    .readdirSync(fullPath)
    .filter((filename) => file.test(filename))
    .map((filename) => `${path}/${filename}`);

  if (files.length === 0) {
    console.error(
      `No matching files found in ${fullPath} for prefix ${prefix} and extension ${extension}`
    );
    return null;
  }

  return files[0];
}

const content = readFile("js", "content", "js");
const js = readFile("js", "index", "js");
const css = readFile("css", "index", "css");
console.log(js,'js')
if (!js || !css) {
  console.error("Required JS or CSS files are missing. Build may have failed.");
  // process.exit(1);
}

const newManifest = {
  ...manifest,
  content_scripts: [
    {
      matches: ["https://*.linkedin.com/*", "https://*.x.com/*"],
      js: [js],
      // css: [css],
      match_about_blank: true,
      all_frames: false,
    },
  ],
  // content_scripts: [],
};

fs.writeFileSync("./dist/manifest.json", JSON.stringify(newManifest, null, 2));
console.log("Manifest updated successfully!");
