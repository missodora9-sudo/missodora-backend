// checkUpdateUserProfile.js
// Usage: node checkUpdateUserProfile.js

const fs = require("fs");
const path = require("path");

const projectDir = path.resolve(__dirname); // Racine du projet
const targetFunction = "updateUserProfile";

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else if (fullPath.endsWith(".js") || fullPath.endsWith(".jsx")) {
      callback(fullPath);
    }
  });
}

const unsafeCalls = [];

walkDir(projectDir, (file) => {
  const content = fs.readFileSync(file, "utf-8");
  const lines = content.split("\n");
  lines.forEach((line, index) => {
    if (line.includes(targetFunction)) {
      // Vérifie si le userId est littéral ou peut être undefined
      if (!line.match(/\b(user\.uid|someUserId|userId)\b/)) {
        unsafeCalls.push({
          file,
          line: index + 1,
          code: line.trim()
        });
      }
    }
  });
});

if (unsafeCalls.length > 0) {
  console.log("⚠️  Appels potentiellement dangereux à updateUserProfile trouvés :\n");
  unsafeCalls.forEach(call => {
    console.log(`Fichier: ${call.file}:${call.line}`);
    console.log(`  ${call.code}\n`);
  });
} else {
  console.log("✅ Aucun appel dangereux à updateUserProfile trouvé.");
}
