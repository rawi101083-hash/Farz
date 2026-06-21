import fs from 'fs';

const logPath = 'C:\\Users\\rawi1\\.gemini\\antigravity\\brain\\6aea1a38-7a44-4925-afbe-5f304909435d\\.system_generated\\logs\\transcript.jsonl';

const fileContent = fs.readFileSync(logPath, 'utf8');
const lines = fileContent.split('\n');

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.tool_calls) {
      for (const tc of obj.tool_calls) {
        if (tc.name === 'run_command' && (tc.args.CommandLine.includes('checkout') || tc.args.CommandLine.includes('restore') || tc.args.CommandLine.includes('reset') || tc.args.CommandLine.includes('stash'))) {
          console.log(`Step ${obj.step_index}: ${tc.args.CommandLine}`);
        }
      }
    }
  } catch (e) {}
}
