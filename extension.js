// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerCommand('endy.goEnd', function() {
        // The code you place here will be executed every time your command is executed
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            return;
        }        
        
        const position = editor.selection.active;

        const str = editor.document.lineAt(position.line).text;
        let newLine = str.replace(/[ ]+$/, '');
        let newCursorCharNum = newLine.length;
        
        if (newCursorCharNum === 0 && position.line !== 0) {
            const prevStr = editor.document.lineAt(position.line - 1).text;
            let match = prevStr.match(/^[ ]+/);
            if (match) {
                newCursorCharNum = match[0].length;
            }
            
            if (prevStr.match(/{[ ]*$/)) {
                newCursorCharNum += editor.options.tabSize;
            }
            
            for (let i = 0; i < newCursorCharNum; i++) {
                newLine += ' ';
            }
        }

        editor.edit(function(editBuilder) {
            var range = new vscode.Range(position.line, 0, position.line, newLine.length);
            editBuilder.replace(range, newLine);
        });

        var newPosition = position.with(position.line, newCursorCharNum);
        var newSelection = new vscode.Selection(newPosition, newPosition);
        editor.selection = newSelection;        
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
