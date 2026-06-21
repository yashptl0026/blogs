fetch('http://localhost:3000/api/seed')
  .then(res => res.text())
  .then(text => console.log('Response:', text))
  .catch(err => console.error('Fetch error:', err));
