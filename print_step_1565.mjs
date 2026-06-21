import fs from 'fs';

const logPath = 'C:\\Users\\rawi1\\.gemini\\antigravity\\brain\\6aea1a38-7a44-4925-afbe-5f304909435d\\.system_generated\\logs\\transcript.jsonl';

const fileContent = fs.readFileSync(logPath, 'utf8');
const lines = fileContent.split('\n');

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.step_index === 1565 || obj.step_index === 1566 || obj.step_index === 1567 || (obj.tool_calls && JSON.stringify(obj.tool_calls).includes("Only display the City badge"))) {
      console.log(`Step ${obj.step_index} (${obj.source} - ${obj.type}):`);
      if (obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          console.log(`Tool: ${tc.name}`);
          console.log(`TargetFile: ${tc.args.TargetFile}`);
          console.log(`TargetContent:\n${tc.args.TargetContent}`);
          console.log(`ReplacementContent:\n${tc.args.ReplacementContent}`);
        }
      }
    }
  } catch (e) {}
}
