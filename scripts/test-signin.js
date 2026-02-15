// use global fetch in Node 18+

async function run() {
  const base = "http://localhost:3000";
  // get csrf
  const csrfRes = await fetch(base + "/api/auth/csrf");
  const csrfJson = await csrfRes.json().catch(()=>null);
  console.log("csrfRes status", csrfRes.status, "body", csrfJson);
  const csrfToken = csrfJson?.csrfToken;

  // prepare form data
  const params = new URLSearchParams();
  params.append("csrfToken", csrfToken || "");
  params.append("callbackUrl", base + "/profile");
  params.append("email", "test@otobilir.dev");
  params.append("password", "password");

  const loginRes = await fetch(base + "/api/auth/callback/credentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
    redirect: "manual",
  });

  console.log("login status:", loginRes.status);
  console.log("set-cookie:", loginRes.headers.raw()["set-cookie"]);
  const text = await loginRes.text();
  console.log("body preview:", text.slice(0,200));

  // check session
  const me = await fetch(base + "/api/auth/me", { credentials: "include" });
  console.log("/api/auth/me status", me.status);
  const mej = await me.json().catch(()=>null);
  console.log("me:", mej);
}

run().catch(e=>{ console.error("ERR", e); process.exit(1) });

