const fs = require('fs');

['src/App.tsx', 'src/Shared.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Remove { " " } and spaces right after <tr> and right before <td>
  content = content.replace(/<tr([^>]*)>\s*\{\s*["']\s*["']\s*\}\s*<td/g, '<tr$1>\n<td');
  content = content.replace(/<tr([^>]*)>\s*\{\s*["']\s+["']\s*\}\s*<td/g, '<tr$1>\n<td');
  
  // Just in case it's <motion.tr>
  content = content.replace(/<motion\.tr([^>]*)>\s*\{\s*["']\s*["']\s*\}\s*<td/g, '<motion.tr$1>\n<td');
  content = content.replace(/<motion\.tr([^>]*)>\s*\{\s*["']\s+["']\s*\}\s*<td/g, '<motion.tr$1>\n<td');

  fs.writeFileSync(file, content, 'utf8');
});

console.log('Done cleaning spaces.');
