import fs from 'fs';

const logPath = 'C:\\Users\\rawi1\\.gemini\\antigravity\\brain\\6aea1a38-7a44-4925-afbe-5f304909435d\\.system_generated\\logs\\transcript.jsonl';

const fileContent = fs.readFileSync(logPath, 'utf8');
const lines = fileContent.split('\n');

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.step_index >= 1550 && obj.step_index <= 1575) {
      if (obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          if (tc.name.includes('file_content') || tc.name === 'write_to_file') {
            console.log(`\n========================================`);
            console.log(`Step ${obj.step_index} (${obj.source} - ${obj.type}):`);
            console.log(`Tool: ${tc.name}`);
            console.log(`Target: ${tc.args.TargetFile}`);
            console.log(`Instruction: ${tc.args.Instruction}`);
            if (tc.args.TargetContent) {
              console.log(`Target Content:\n${tc.args.TargetContent}`);
            }
            if (tc.args.ReplacementContent) {
              console.log(`Replacement Content:\n${tc.args.ReplacementContent}`);
            }
          }
        }
      }
    }
  } catch (e) {}
}
