const fs = require("fs");
const path = require("path");

// folder yang berisi routes kamu, ganti kalau beda
const ROUTES_DIR = path.join(__dirname, "/router");

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith(".js")) {
      const content = fs.readFileSync(fullPath, "utf-8");

      const regex = /(app\.get|app\.post|app\.put|app\.delete|router\.get|router\.post|router\.put|router\.delete)\([^)]*\)/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        const line = match[0];

        if (line.includes("/:?" ) || line.includes("/?")) {
          console.log(`⚠️  Mungkin error di file: ${fullPath}`);
          console.log(`   👉 Route: ${line.trim()}`);
        }
      }
    }
  });
}

scanDir(ROUTES_DIR);
