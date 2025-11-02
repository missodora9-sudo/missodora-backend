// checkProfileCalls.js
// 🔍 Détecte tous les appels à updateUserProfile ou updateUserAddress dans ton projet

const fs = require("fs");
const path = require("path");

const targetFunctions = ["updateUserProfile", "updateUserAddress"];
const projectDir = path.resolve(__dirname);
const suspiciousCalls = [];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    targetFunctions.forEach(func => {
      if (line.includes(func)) {
        suspiciousCalls.push({
          file: filePath,
          line: index + 1,
          code: line.trim()
        });
      }
    });
  });
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith(".js") || fullPath.endsWith(".jsx")) {
        scanFile(fullPath);
    }
  });
}

walkDir(projectDir);

if (suspiciousCalls.length > 0) {
  console.log("⚠️  Appels à updateUserProfile / updateUserAddress trouvés :\n");
  suspiciousCalls.forEach(call => {
    console.log(`📂 ${call.file}:${call.line}`);
    console.log(`   ${call.code}\n`);
  });
} else {
  console.log("✅ Aucun appel à updateUserProfile ou updateUserAddress trouvé !");
}
