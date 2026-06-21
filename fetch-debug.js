fetch('http://localhost:3000/api/debug')
  .then(res => res.json().catch(() => res.text()))
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(err => console.error(err));
