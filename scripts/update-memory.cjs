const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const memoryFilePath = path.join(rootDir, 'memory.md');
const distDir = path.join(rootDir, 'dist');

// Helper to format bytes to human readable string
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = 2;
  const sizes = ['Bytes', 'kB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Helper to get recursive files in a directory
function getFilesRecursively(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFilesRecursively(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// 1. Generate Git Development History Table
function generateGitHistoryTable() {
  try {
    const logOutput = execSync(
      'git log --pretty=format:"%h%x09%ad%x09%s%x09%an" --date=short',
      { encoding: 'utf8', cwd: rootDir }
    ).trim();

    if (!logOutput) {
      return '| No commits found | | | | |';
    }

    const lines = logOutput.split('\n');
    let tableRows = [];

    for (const line of lines) {
      const [hash, date, message, author] = line.split('\t');
      if (!hash) continue;

      // Get files modified in this commit
      let modifiedFilesStr = '';
      try {
        const filesOutput = execSync(`git show --pretty="" --name-only ${hash}`, {
          encoding: 'utf8',
          cwd: rootDir,
        }).trim();

        if (filesOutput) {
          const files = filesOutput.split('\n');
          if (files.length > 5) {
            modifiedFilesStr = `Modified ${files.slice(0, 4).map(f => path.basename(f)).join(', ')} + ${files.length - 4} more files`;
          } else {
            modifiedFilesStr = `Modified ${files.map(f => path.basename(f)).join(', ')}`;
          }
        } else {
          modifiedFilesStr = 'No files changed';
        }
      } catch (err) {
        modifiedFilesStr = 'Error fetching changed files';
      }

      // Escape markdown table pipes
      const cleanMessage = message.replace(/\|/g, '\\|');
      const cleanFiles = modifiedFilesStr.replace(/\|/g, '\\|');

      tableRows.push(`| **\`${hash}\`** | ${date} | ${cleanMessage} | ${author} | ${cleanFiles} |`);
    }

    return tableRows.join('\n');
  } catch (error) {
    console.error('Error generating Git history:', error);
    return '| Error generating history | | | | |';
  }
}

// 2. Generate Production Build Table
function generateProductionBuildTable() {
  if (!fs.existsSync(distDir)) {
    return '*No production build artifacts found in `dist/`. Run `npm run build` to generate them.*';
  }

  try {
    const allFiles = getFilesRecursively(distDir);
    if (allFiles.length === 0) {
      return '*`dist/` directory is empty.*';
    }

    let rows = [];
    rows.push('| Asset Path | Size | Description |');
    rows.push('| :--- | :--- | :--- |');

    // Sort files to make table deterministic/clean
    allFiles.sort();

    for (const filePath of allFiles) {
      const relativePath = path.relative(rootDir, filePath);
      const stats = fs.statSync(filePath);
      const sizeStr = formatBytes(stats.size);
      
      let description = '';
      if (relativePath === 'dist/index.html') {
        description = 'Entry HTML document';
      } else if (relativePath.endsWith('.css')) {
        description = 'Compiled application stylesheets';
      } else if (relativePath.includes('rolldown-runtime') || relativePath.includes('runtime')) {
        description = 'Bundler runtime orchestrator';
      } else if (relativePath.includes('HeroCanvas')) {
        description = 'Interactive 3D background canvas';
      } else if (relativePath.includes('SectorBar') || relativePath.includes('charts')) {
        description = 'Data visualization charting components';
      } else if (relativePath.includes('CompanyDirectory')) {
        description = 'Interactive database directory components';
      } else if (relativePath.includes('react-vendor')) {
        description = 'React core libraries vendor chunk';
      } else if (relativePath.includes('charting')) {
        description = 'Recharts visualization library chunk';
      } else if (relativePath.includes('3d-graphics')) {
        description = 'Three.js 3D graphics rendering library';
      } else if (relativePath.endsWith('.js')) {
        description = 'Application code bundle / chunk';
      } else {
        description = 'Static asset resource';
      }

      rows.push(`| \`${relativePath}\` | \`${sizeStr}\` | ${description} |`);
    }

    return rows.join('\n');
  } catch (error) {
    console.error('Error reading dist directory:', error);
    return '*Error reading production build files.*';
  }
}

const gitHistoryTable = generateGitHistoryTable();
const productionBuildTable = generateProductionBuildTable();
const timestamp = new Date().toISOString().split('T')[0];

const newContent = `# 🧠 Codebase Build & Development Memory Log

This document records the builds, data compilation runs, and major development milestones/commits executed in this repository. Automatically updated on commits and builds.

---

## 🚀 Git Development History & Milestones

The following table details all the commits that have shaped the current codebase up to the present date (**${timestamp}**).

| Commit Hash | Date | Description | Author | Key Changes / Context |
| :--- | :--- | :--- | :--- | :--- |
${gitHistoryTable}

---

## 📊 Dataset Compilation Builds (\`build-data\`)

The dataset compilation is built via a TypeScript pipeline from \`scripts/build-data.ts\`.

- **Command**: \`npx tsx scripts/build-data.ts\`
- **Inputs**: Raw data array inside \`scripts/build-data.ts\`
- **Output Files**:
  - \`data/companies.json\` — Structured JSON array of companies sorted by rank/valuation (imported by the frontend application).
  - \`data/companies.csv\` — CSV format of the computed dataset for research and external usage.
- **Rules applied at build-time**:
  1. Computes synthetic rank based on \`valuationOrMarketCapUSD\` (descending), then funding raised (descending), then name.
  2. Ensures all coordinates and numerical fields (revenue, valuation, funding) conform to the \`Company\` type interface.

---

## ⚡ Production Frontend Builds (\`npm run build\`)

Compiles and optimizes the React 19 application for production.

- **Command**: \`tsc -b && vite build\`
- **Assets Bundles & Code Splitting**:

${productionBuildTable}
`;

fs.writeFileSync(memoryFilePath, newContent, 'utf8');
console.log('Successfully updated memory.md with latest git history and build assets.');
