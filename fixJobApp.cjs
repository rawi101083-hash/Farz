const fs = require('fs');
let content = fs.readFileSync('src/components/JobApplication.tsx', 'utf-8');
const lines = content.split(/\r?\n/);
let outputLines = [];

// Find where the mess starts
let i = 0;
while (i < lines.length) {
  if (lines[i] === '              qualification: activeRole?.qualification || job.qualification,') {
    if (lines[i+1] === '  };' && lines[i+2] === '  const now = new Date();') {
      // The mess starts here!
      outputLines.push(lines[i]); // Keep the qualification line
      
      let j = i + 1;
      while (j < lines.length) {
        if (lines[j] === '              isSalaryHidden: activeRole?.isSalaryHidden ?? job.isSalaryHidden,') {
          // This is the real one at line 864
          break;
        }
        j++;
      }
      
      // We found the real one. Replace from lines[i+1] to lines[j] with the missing properties:
      outputLines.push('              salaryMin: activeRole?.salaryMin || job.salaryMin,');
      outputLines.push('              salaryMax: activeRole?.salaryMax || job.salaryMax,');
      outputLines.push('              isSalaryHidden: activeRole?.isSalaryHidden ?? job.isSalaryHidden,');
      outputLines.push('            };');
      outputLines.push('            return (');
      
      i = j + 2; // skip the return line
      continue;
    }
  }
  
  if (lines[i].includes('ارفع سيرتك الذاتية وسنقوم باستخراج بياناتك تلقائياً.')) {
    // Missing closing tags before this line!
    outputLines.push('                )}');
    outputLines.push('              </div>');
    outputLines.push('            </div>');
    outputLines.push('            );');
    outputLines.push('          })()}');
    outputLines.push('');
    outputLines.push('          {formStep === "details" && (');
    outputLines.push('            <div className="md:col-span-2 text-center mt-2 mb-4">');
    outputLines.push('              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">');
    outputLines.push(lines[i]);
    outputLines.push('              </p>');
    outputLines.push('            </div>');
    outputLines.push('          )}');
    outputLines.push('');
    outputLines.push('          {formStep === "details" && (');
    outputLines.push('            <div className="md:col-span-2">');
    outputLines.push('              <div');
    outputLines.push('                onDragOver={(e) => {');
    outputLines.push('                  e.preventDefault();');
    outputLines.push('                  setIsDragging(true);');
    outputLines.push('                }}');
    
    if (lines[i+1] && lines[i+1].includes('</p>')) {
      i += 2;
    } else {
      i++;
    }
    continue;
  }
  
  outputLines.push(lines[i]);
  i++;
}

fs.writeFileSync('src/components/JobApplication.tsx', outputLines.join('\n'));
console.log('Fixed JobApplication.tsx');
