fetch('http://localhost:8000/api/v1/extract-cv', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer change_me_in_production'
  },
  body: JSON.stringify({
    applicant_id: '123',
    job_id: '123',
    cv_file_url: 'http://example.com/cv.pdf',
    job_context: {title: 'dev'}
  })
}).then(r => r.json()).then(console.log).catch(console.error);
