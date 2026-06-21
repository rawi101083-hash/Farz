import fs from 'fs';

const logPath = 'C:\\Users\\rawi1\\.gemini\\antigravity\\brain\\6aea1a38-7a44-4925-afbe-5f304909435d\\.system_generated\\logs\\transcript.jsonl';
const outPath = 'C:\\Users\\rawi1\\.gemini\\antigravity\\brain\\6aea1a38-7a44-4925-afbe-5f304909435d\\scratch\\scratch_step_1556.txt';

const fileContent = fs.readFileSync(logPath, 'utf8');
const lines = fileContent.split('\n');

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.step_index === 1556) {
      if (obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          if (tc.name === 'replace_file_content') {
            fs.writeFileSync(outPath, tc.args.ReplacementContent, 'utf8');
            console.log(`Saved step 1556 ReplacementContent to: ${outPath}`);
          }
        }
      }
    }
  } catch (e) {}
}
