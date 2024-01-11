/* Uses a Node.js script written by Roland Doda, which enables automatic
 * deployment and is based on the execa package.
 *
 * https://dev.to/the_one/deploy-to-github-pages-like-a-pro-with-github-actions-4hdg
 * https://github.com/sindresorhus/execa
 */

/* eslint-disable no-console */
const execa = require("execa");
const fs = require("fs");
(async () => {
	try {
		await execa("git", ["checkout", "--orphan", "gh-pages"]);
		// eslint-disable-next-line no-console
		console.log("Build started...");
		await execa("npm", ["run", "build"]);
		const folderName = fs.existsSync("dist") ? "dist" : "build";
		await execa("git", ["--work-tree", folderName, "add", "--all"]);
		await execa("git", ["--work-tree", folderName, "commit", "-m", "gh-pages"]);
		console.log("Pushing to gh-pages...");
		await execa("git", ["push", "origin", "HEAD:gh-pages", "--force"]);
		await execa("rm", ["-r", folderName]);
		await execa("git", ["checkout", "-f", "main"]);
		await execa("git", ["branch", "-D", "gh-pages"]);
		console.log("Successfully deployed!");
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log(error.message);
		process.exit(1);
	}
})();
