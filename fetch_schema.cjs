const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'oteijgwivctlznzdysqo.supabase.co',
  port: 443,
  path: '/rest/v1/',
  method: 'GET',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90ZWlqZ3dpdmN0bHpuemR5c3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNzUxMTcsImV4cCI6MjEwMTk1MTExN30.6M3Q8TQWWQU2aaEtH0MQis64Nhv7SSzJQc6Uowy048Q'
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('schema.json', data);
  });
});

req.on('error', error => console.error(error));
req.end();
