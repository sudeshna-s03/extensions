const vscode = require("vscode");
const axios = require("axios");
const fs = require("fs");

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  const res = await axios.get(
    "http://codepedia.herokuapp.com/get-snippet-data/"
  );
  console.log(res.data);
  const articles = res.data.data.map((article) => {
    return {
      label: article.language,
      description: article.description,
      detail: article.body,
    };
  });
  console.log(articles);

  let disposable = vscode.commands.registerCommand(
    "wds-blog-search.searchWdsBlog",
    async function () {
      const article = await vscode.window.showQuickPick(articles, {
        matchOnDetail: true,
      });

      if (article == null) return;

      var content = {
        "my snippet": {
          prefix: "longinput",
          body: [
            "#include <iosteam>",
            "using namespace std;"
          ],
          description: "basic snippet for cpp",
        },
      };

      fs.writeFileSync(
        `C:\Users\sahas\AppData\Roaming\Code\User\snippets${article.title}.code-snippets`,
        JSON.stringify(content)
      );

      vscode.window.showInformationMessage("File Saved Successfully!!!");
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};