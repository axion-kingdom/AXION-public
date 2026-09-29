/**
 * CLI توليد/فحص العقود:
 *   tsx src/contract-cli.ts            → يكتب contracts/axion-validation-contracts.json
 *   tsx src/contract-cli.ts --check    → يفشل إن اختلف الملف الملتزم عن التوليد الجديد
 * (أتمتة: أي انحراف في العقود = بوابة حمراء = لا دمج)
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateContracts } from "./contract.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const CONTRACTS_PATH = resolve(HERE, "../contracts/axion-validation-contracts.json");

function main() {
  const contracts = generateContracts();
  // الطابع الزمني للتوليد معلومات تشغيلية — يُستثنى من الملف ليكون الفحص حتمياً
  const { generatedAt: _generatedAt, ...stable } = contracts;
  const fresh = JSON.stringify(stable, null, 2) + "\n";
  const check = process.argv.includes("--check");

  if (check) {
    let committed: string | null = null;
    try {
      committed = readFileSync(CONTRACTS_PATH, "utf8");
    } catch {
      console.error("❌ عقود OpenAPI غير ملتزمة — شغّل: npm run generate:contracts");
      process.exit(1);
    }
    if (committed !== fresh) {
      console.error("❌ انحراف في عقود OpenAPI — أعد التوليد والتزم: npm run generate:contracts");
      process.exit(1);
    }
    console.log("✅ عقود OpenAPI مطابقة — لا انحراف");
    return;
  }

  mkdirSync(dirname(CONTRACTS_PATH), { recursive: true });
  writeFileSync(CONTRACTS_PATH, fresh);
  console.log(`✅ وُلّدت العقود: ${CONTRACTS_PATH}`);
}

main();
