import fs from 'fs';

const appTsx = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
const startApp = appTsx.findIndex(line => line.includes('// ⚠️ هام جداً (تحذير من نظام المعاينة الحية):'));
let endApp = -1;
for (let i = startApp + 1; i < appTsx.length; i++) {
    if (appTsx[i].trim() === '};' && appTsx[i-1].trim() === ');') {
        endApp = i;
        break;
    }
}

if (startApp === -1 || endApp === -1) {
    console.error('Could not find PublicJobPage in App.tsx', startApp, endApp);
    process.exit(1);
}

const componentCode = appTsx.slice(startApp, endApp + 1).join('\n');

let createJobTsx = fs.readFileSync('src/components/CreateJob.tsx', 'utf8').split('\n');
const startCreateJob = createJobTsx.findIndex(line => line.includes('export const PublicJobPage = ({'));
let endCreateJob = -1;
for (let i = startCreateJob + 1; i < createJobTsx.length; i++) {
    if (createJobTsx[i].trim() === '};' && createJobTsx[i-1].trim() === ');') {
        endCreateJob = i;
        break;
    }
}

if (startCreateJob === -1 || endCreateJob === -1) {
    console.error('Could not find PublicJobPage in CreateJob.tsx', startCreateJob, endCreateJob);
    process.exit(1);
}

let newComponentCode = componentCode.replace('const PublicJobPage = ({', 'export const PublicJobPage = ({');

createJobTsx.splice(startCreateJob, endCreateJob - startCreateJob + 1, newComponentCode);

fs.writeFileSync('src/components/CreateJob.tsx', createJobTsx.join('\n'));
console.log('Successfully replaced PublicJobPage in CreateJob.tsx!');
