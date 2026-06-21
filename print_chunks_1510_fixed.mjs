import fs from 'fs';

const logPath = 'C:\\Users\\rawi1\\.gemini\\antigravity\\brain\\6aea1a38-7a44-4925-afbe-5f304909435d\\.system_generated\\logs\\transcript.jsonl';

const fileContent = fs.readFileSync(logPath, 'utf8');
const lines = fileContent.split('\n');

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.step_index === 1510) {
      if (obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          if (tc.name === 'multi_replace_file_content') {
            let chunks = tc.args.ReplacementChunks;
            if (typeof chunks === 'string') {
              chunks = JSON.parse(chunks);
            }
            for (let idx = 0; idx < chunks.length; idx++) {
              console.log(`--- CHUNK ${idx} ---`);
              console.log(`StartLine: ${chunks[idx].StartLine}, EndLine: ${chunks[idx].EndLine}`);
              console.log(`TargetContent:\n${chunks[idx].TargetContent}`);
              console.log(`ReplacementContent:\n${chunks[idx].ReplacementContent}`);
            }
          }
        }
      }
    }
  } catch (e) {
    console.error("Error parsing line:", e);
  }
}
