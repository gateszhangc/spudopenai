const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const namespace = process.env.ACME_NAMESPACE || "spudopenai";
const outputDir = path.join(process.cwd(), ".well-known", "acme-challenge");

const raw = execFileSync("kubectl", ["-n", namespace, "get", "challenge", "-o", "json"], {
  encoding: "utf8"
});
const json = JSON.parse(raw);
const items = json.items || [];

fs.mkdirSync(outputDir, { recursive: true });

for (const item of items) {
  const token = item?.spec?.token;
  const key = item?.spec?.key;

  if (!token || !key) {
    continue;
  }

  fs.writeFileSync(path.join(outputDir, token), `${key}\n`);
  process.stdout.write(`synced ${token}\n`);
}
