import {mkdirp, writeFile} from "fs-extra";
import path from "path";
import os from "os";
import {TerminalScreenshotOptions} from "./options";

export async function generateTemplate(options: TerminalScreenshotOptions): Promise<string> {
  const lines = options.data.split(/\r?\n/);

  // Trim head empty lines
  while (lines.length && lines[0].length === 0) lines.shift()

  // Trim tail empty lines
  while (lines.length && lines[lines.length - 1].length === 0) lines.pop()

  // Normalize data line endings
  const normalizedData = lines.join('\r\n');

  const terminalRows = lines.length;
  const terminalColumns = Math.max(...lines.map(measureLength));

  const template = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <style>
            body {
                margin: ${options.margin}px;
                background-color: ${options.backgroundColor};
            }
            #terminal {
                font-smooth: never;
            }
            .xterm-cursor {
                display: none !important;
            }
        </style>

        <link rel="stylesheet" href="${require.resolve(`xterm/css/xterm.css`)}" />
        <link rel="stylesheet" href="http://fonts.cdnfonts.com/css/${options.fontFamily}" />

        <script src="${require.resolve(`xterm/lib/xterm.js`)}"></script>
    </head>

    <body>
        <div id="terminal">
        </div>

        <script>
            document.fonts.load('1rem "${options.fontFamily}"').then(() => {
                const terminal = new Terminal({
                    theme: {background: "${options.backgroundColor}"},
                    fontFamily: "${options.fontFamily}",
                    fontSize: "${options.fontSize}",
                    lineHeight: "${options.lineHeight}",
                    rows: ${terminalRows},
                    cols: ${terminalColumns},
                });

                terminal.open(document.getElementById("terminal"));
                terminal.write(${JSON.stringify(normalizedData)});
            });
        </script>
    </body>
    </html>
`;

  const templateDir = path.join(os.tmpdir(), "terminal-screenshot-template");
  await mkdirp(templateDir);

  const templateId = Math.floor(Math.random() * 1000000).toString();
  const templatePath = path.join(templateDir, templateId + ".html");
  await writeFile(templatePath, template);

  return templatePath;
}

function measureLength(data: string): number {
  // Inspired by: https://github.com/chalk/strip-ansi/blob/main/index.js

  const pattern = [
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
  ].join("|");

  return data.replace(new RegExp(pattern, "g"), "").length;
}
