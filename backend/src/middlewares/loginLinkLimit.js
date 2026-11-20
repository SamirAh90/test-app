const { createHash } = require("node:crypto");
const buckets = new Map();
const windowMs = 15 * 60 * 1000;

// Single-process limiter. Expired entries are removed; storage stays bounded.
module.exports = (req, res, next) => {
  const now = Date.now();
  for (const [key, bucket] of buckets) if (bucket.until <= now) buckets.delete(key);
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const keys = [[`ip:${req.ip}`, 20]];
  if (email) keys.push([`email:${createHash("sha256").update(email).digest("hex")}`, 3]);
  if (buckets.size > 10000 || keys.some(([key, limit]) => (buckets.get(key)?.count || 0) >= limit)) {
    res.set("Retry-After", "900");
    return res.status(429).json({ message: "För många försök. Vänta 15 minuter och försök igen." });
  }
  for (const [key] of keys) {
    const bucket = buckets.get(key) || { count: 0, until: now + windowMs };
    bucket.count++;
    buckets.set(key, bucket);
  }
  return next();
};
