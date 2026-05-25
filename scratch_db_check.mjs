const url = 'https://zpcooectdwokmvbgttsf.supabase.co/rest/v1/applicants?limit=1';
const headers = {
  'apikey': 'sb_publishable_PEdl1_uBW_syIiVsYpwf4g_0gJP8pZH',
  'Authorization': 'Bearer sb_publishable_PEdl1_uBW_syIiVsYpwf4g_0gJP8pZH'
};

fetch(url, { headers })
  .then(res => res.json())
  .then(data => {
    if (data && data.length > 0) {
      console.log(Object.keys(data[0]).join('\n'));
    } else {
      console.log('No data found');
    }
  })
  .catch(err => console.error(err));
