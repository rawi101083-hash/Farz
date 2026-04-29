const PDFDocument = require('pdfkit'); 
const fs = require('fs'); 
const doc = new PDFDocument(); 
doc.pipe(fs.createWriteStream('real_resume.pdf')); 
doc.fontSize(20).text('Ahmed Ali - Senior Software Engineer', { align: 'center' }); 
doc.moveDown(); 
doc.fontSize(12).text('Email: ahmed@example.com | Phone: +966501234567', { align: 'center' }); 
doc.moveDown(); 
doc.fontSize(16).text('Professional Summary'); 
doc.fontSize(12).text('A highly skilled Software Engineer with over 8 years of experience in developing scalable web applications using React, Node.js, TypeScript, and AWS. Proven track record in leading teams and delivering high-impact SaaS products.'); 
doc.moveDown(); 
doc.fontSize(16).text('Experience'); 
doc.fontSize(12).text(`Smart Recruitment Solutions (2020 - Present)
Senior Software Engineer
- Led a team of 5 developers to build an AI-powered applicant tracking system.
- Improved application performance by 40% and reduced server costs by utilizing AWS Lambda.

Tech Innovations (2016 - 2020)
Frontend Developer
- Developed responsive user interfaces using React and Tailwind CSS.
- Collaborated with UX designers to improve user engagement by 25%.`); 
doc.moveDown(); 
doc.fontSize(16).text('Skills'); 
doc.fontSize(12).text(`- Programming Languages: JavaScript, TypeScript, Python
- Frameworks: React, Node.js, Next.js, Express
- Cloud & DevOps: AWS, Docker, CI/CD
- Other: Agile Methodologies, Team Leadership`); 
doc.end();
