// Integration check: creates one temporary user, captures mail locally, removes its data.
// Run manually: node scripts/check-login-links.js
const assert = require("node:assert/strict");
const { randomBytes, createHash } = require("node:crypto");
const { sequelize } = require("../src/config/database");
const User = require("../src/models/User");
const LoginLink = require("../src/models/LoginLink");
const mail = require("../src/utils/loginEmail");
const controller = require("../src/controllers/loginLinkController");
const limiter = require("../src/middlewares/loginLinkLimit");

const email = `login-link-check-${randomBytes(8).toString("hex")}@example.com`;
let user;
let capturedLink;
let deliveries = 0;
function response() {
  return { statusCode: 200, headers: {}, status(code) { this.statusCode = code; return this; },
    set(key, value) { this.headers[key] = value; return this; }, json(data) { this.data = data; return this; } };
}
async function request(address = email) {
  const res = response();
  await controller.requestLink({ body: { email: address } }, res);
  return res;
}
async function issue() {
  capturedLink = null;
  assert.equal((await request()).statusCode, 200);
  assert.ok(capturedLink);
  return new URL(capturedLink).hash.slice(1);
}
async function consume(token) {
  const res = response();
  await controller.consumeLink({ body: { token } }, res);
  return res;
}

(async () => {
  try {
    await LoginLink.sync();
    user = await User.create({ firstName: "Temporary", lastName: "Check", email,
      password: "unused-integration-test-placeholder", role: "user", isPremium: false });
    process.env.FRONTEND_URL = "http://localhost:5173";
    mail.emailConfigured = () => false;
    assert.equal((await request()).statusCode, 503);
    mail.emailConfigured = () => true;
    mail.sendLoginEmail = async (to, link) => { assert.equal(to, email); capturedLink = link; deliveries++; };
    assert.equal((await request("bad-address")).statusCode, 400);
    const unknown = await request(`unknown-${email}`);
    assert.equal(unknown.statusCode, 200);
    assert.equal(deliveries, 0);
    const token = await issue();
    assert.equal((await request(`unknown-${email}`)).data.message, unknown.data.message);
    const stored = await LoginLink.findByPk(createHash("sha256").update(token).digest("hex"));
    assert.ok(stored);
    assert.notEqual(stored.tokenHash, token);
    assert.equal((await consume("bad-token")).statusCode, 400);
    assert.equal((await consume("a".repeat(64))).statusCode, 401);
    const results = await Promise.all([consume(token), consume(token)]);
    assert.deepEqual(results.map(result => result.statusCode).sort(), [200, 401]);
    assert.equal(results.find(result => result.statusCode === 200).data.user.id, user.id);
    assert.ok(results.find(result => result.statusCode === 200).data.token);
    assert.equal((await consume(token)).statusCode, 401);
    const expired = await issue();
    await LoginLink.update({ expiresAt: new Date(Date.now() - 1000) }, { where: { userId: user.id } });
    assert.equal((await consume(expired)).statusCode, 401);
    const inactive = await issue();
    await user.update({ isActive: false });
    assert.equal((await consume(inactive)).statusCode, 401);
    const before = deliveries;
    assert.equal((await request()).statusCode, 200);
    assert.equal(deliveries, before);
    await user.update({ isActive: true });
    const changedEmail = await issue();
    await user.update({ email: `changed-${email}` });
    assert.equal((await consume(changedEmail)).statusCode, 401);
    await user.update({ email });
    const privileged = await issue();
    await user.update({ role: "admin" });
    assert.equal((await consume(privileged)).statusCode, 401);
    await user.update({ role: "user" });
    const countBefore = await LoginLink.count({ where: { userId: user.id } });
    mail.sendLoginEmail = async () => { throw Object.assign(new Error("simulated delivery failure"), { code: "TEST_FAILURE" }); };
    assert.equal((await request()).statusCode, 200);
    assert.equal(await LoginLink.count({ where: { userId: user.id } }), countBefore);
    for (let i = 0; i < 4; i++) {
      let nextCalled = false;
      const res = response();
      limiter({ ip: "integration-check", body: { email } }, res, () => { nextCalled = true; });
      assert.equal(nextCalled, i < 3);
      if (i === 3) assert.equal(res.statusCode, 429);
    }
    console.log("PASS: config, validation, unknown address, hashed storage, invalid token, concurrent single use, replay, expiry, inactive account, changed email, privileged account, delivery failure cleanup, rate limit.");
    console.log("No real email was sent.");
  } finally {
    if (user) {
      await LoginLink.destroy({ where: { userId: user.id } });
      await user.destroy();
    }
    await sequelize.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
