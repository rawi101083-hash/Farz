import { execSync } from 'child_process';

const cwd = 'c:\\Users\\rawi1\\Downloads\\التوظيف-الذكي-_-smart-recruitment';
const log = execSync('git log -g --oneline -- src/Shared.tsx', { cwd, encoding: 'utf8' });
console.log(log);
