import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const externalAssetsDir = path.join(__dirname, '../external-assets');
const outputFile = path.join(externalAssetsDir, 'sample.html');

/**
 * Parses a .env file content and returns an object with the variables.
 * @param {string} content
 * @returns {Object}
 */
function parseEnv(content) {
  const lines = content.split(/\r?\n/);
  const env = {};
  lines.forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      // Remove surrounding quotes
      if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.substring(1, value.length - 1);
      } else if (value.length > 0 && value.charAt(0) === "'" && value.charAt(value.length - 1) === "'") {
        value = value.substring(1, value.length - 1);
      }
      env[key] = value;
    }
  });
  return env;
}

function generate() {
  if (!fs.existsSync(externalAssetsDir)) {
    console.error(`Directory not found: ${externalAssetsDir}`);
    return;
  }

  const files = fs.readdirSync(externalAssetsDir);
  const journals = [];

  files.forEach(file => {
    if (file.startsWith('.env.local.')) {
      try {
        const content = fs.readFileSync(path.join(externalAssetsDir, file), 'utf8');
        const env = parseEnv(content);
        
        const rvCode = env['VITE_JOURNAL_RVCODE'];
        const primaryColor = env['VITE_JOURNAL_PRIMARY_COLOR'];
        const primaryTextColor = env['VITE_JOURNAL_PRIMARY_TEXT_COLOR'];

        if (rvCode && primaryColor && primaryTextColor) {
          journals.push({
            rvCode,
            primaryColor,
            primaryTextColor,
            fileName: file
          });
        }
      } catch (e) {
        console.error('Error reading ' + file + ':', e.message);
      }
    }
  });

  // Sort journals by RVCODE
  journals.sort((a, b) => a.rvCode.localeCompare(b.rvCode));

  let journalsHtml = '';
  journals.forEach(j => {
    const logoPath = 'logos/logo-' + j.rvCode + '.svg';
    const hasLogo = fs.existsSync(path.join(externalAssetsDir, logoPath));
    
    journalsHtml += `
        <div class="container">
            <div class="card">
                <div class="logo-area">
                    ${hasLogo 
                        ? `<img src="${logoPath}" alt="Logo for ${j.rvCode}">` 
                        : '<span style="color: #ccc;">No logo found</span>'}
                </div>
                <div class="color-area" style="background-color: ${j.primaryColor}; color: ${j.primaryTextColor};">
                    ${j.rvCode}
                </div>
            </div>
            <div class="info">${j.fileName}</div>
        </div>`;
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Episciences Journal Configurations</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        h1 {
            text-align: center;
            margin-bottom: 40px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
            gap: 20px;
        }
        .container {
            display: flex;
            flex-direction: column;
        }
        .card {
            display: flex;
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            height: 100px;
            border: 1px solid #ddd;
        }
        .logo-area {
            flex: 0 0 150px;
            background-color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px;
            border-right: 1px solid #eee;
        }
        .logo-area img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        .color-area {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            font-weight: bold;
            font-size: 1.2rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .info {
            font-size: 0.8rem;
            color: #666;
            margin-top: 5px;
            text-align: center;
        }
        @media (max-width: 450px) {
            .grid {
                grid-template-columns: 1fr;
            }
            .card {
                height: auto;
                flex-direction: column;
            }
            .logo-area {
                flex: 0 0 100px;
                border-right: none;
                border-bottom: 1px solid #eee;
                height: 100px;
            }
            .color-area {
                padding: 15px;
            }
        }
    </style>
</head>
<body>
    <h1>Episciences Journal Configurations</h1>
    <div class="grid">${journalsHtml}
    </div>
</body>
</html>`;

  fs.writeFileSync(outputFile, html);
  console.log('Successfully generated ' + outputFile + ' with ' + journals.length + ' journals.');
}

generate();
