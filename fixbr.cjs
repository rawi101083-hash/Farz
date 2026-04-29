const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
const i = lines.findIndex(l => l.includes('window.localStorage.setItem(\'mock_n8n_response\', JSON.stringify(fallbackData));'));
if (i !== -1 && lines[i+1].includes('});')) {
    lines.splice(i+2, 0, '  };');
    fs.writeFileSync('src/App.tsx', lines.join('\n'));
    console.log('Restored bracket');
}
