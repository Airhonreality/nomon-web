const BASE = "https://www.rednomon.com";
const SECRET = "a6702500c40b1cba49c8a6d44d966829184925c5fd9a763e8d5a7e19d6bd3afe";

// 1. Login
const loginRes = await fetch(`${BASE}/api/auth/mail-login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "contacto@rednomon.com", password: "Nomon2026!" }),
});
const sc = loginRes.headers.get("set-cookie");
const cookie = sc?.split(";")[0];
console.log("1) Login OK, cookie:", cookie);

// 2. Listar bandeja (GET /api/correo)
const listRes = await fetch(`${BASE}/api/correo`, { headers: { Cookie: cookie } });
console.log("\n2) GET /api/correo ->", listRes.status);
const bandeja = await listRes.json();
console.log("   Mensajes:", bandeja.length);
for (const m of bandeja.slice(0, 5)) {
  console.log(`   - [${m.direccion}] de=${m.de} para=${m.para} asunto="${m.asunto}" adjuntos=${(m.adjuntos || []).length}`);
}

// 3. Smoke test del webhook (recepción entrante)
const webhookRes = await fetch(`${BASE}/api/webhooks/incoming-email`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${SECRET}` },
  body: JSON.stringify({
    messageId: `smoke-${Date.now()}`,
    from: "audit@rednomon.com",
    to: "contacto@rednomon.com",
    subject: "Smoke test post-fix auth",
    bodyText: "Verificación tras deploy del fix de auth.",
  }),
});
console.log("\n3) POST /api/webhooks/incoming-email ->", webhookRes.status, await webhookRes.text());

// 4. Re-listar para confirmar que el mensaje entró
const listRes2 = await fetch(`${BASE}/api/correo`, { headers: { Cookie: cookie } });
const bandeja2 = await listRes2.json();
console.log("\n4) Bandeja tras smoke test:", bandeja2.length, "mensajes");
console.log("   Ultimo:", bandeja2[0] ? `${bandeja2[0].direccion} de ${bandeja2[0].de} - ${bandeja2[0].asunto}` : "vacia");

// 5. Logout
const logoutRes = await fetch(`${BASE}/api/auth/mail-logout`, {
  method: "POST", headers: { Cookie: cookie },
});
console.log("\n5) POST /api/auth/mail-logout ->", logoutRes.status);
