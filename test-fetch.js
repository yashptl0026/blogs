async function test() {
  try {
    const res = await fetch("http://127.0.0.1:3000/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "state", nameEn: "Test" })
    });
    console.log(res.status);
    console.log(await res.text());
  } catch (e) {
    console.log(e.message);
  }
}
test();
