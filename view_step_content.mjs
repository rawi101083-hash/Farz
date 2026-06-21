import fs from 'fs';

const logPath = 'C:\\Users\\rawi1\\.gemini\\antigravity\\brain\\6aea1a38-7a44-4925-afbe-5f304909435d\\.system_generated\\logs\\transcript.jsonl';

const fileContent = fs.readFileSync(logPath, 'utf8');
const lines = fileContent.split('\n');

const stepsToPrint = [1565, 1589, 1614];

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    if (stepsToPrint.includes(obj.step_index)) {
      console.log(`\n========================================`);
      console.log(`Step ${obj.step_index} (${obj.type}):`);
      if (obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          console.log(`Tool: ${tc.name}`);
          console.log(`Arguments:`, JSON.stringify(tc.args, null, 2));
        }
      }
    }
  } catch (e) {}
}
