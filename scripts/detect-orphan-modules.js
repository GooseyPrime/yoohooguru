#!/usr/bin/env node

/**
 * Orphan Module Detection Script
 * Detects unused dependencies, unreferenced modules, and dead code
 * for the yoohoo.guru platform
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class OrphanModuleDetector {
  constructor(options = {}) {
    this.options = {
      rootDir: options.rootDir || process.cwd(),
      outputDir: options.outputDir || path.join(process.cwd(), 'orphan-reports'),
      includeDevDeps: options.includeDevDeps || false,
      verbose: options.verbose || false,
      ...options
    };
    
    // Supported JavaScript/TypeScript file extensions
    this.JS_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.mjs'];
    this.JS_INDEX_FILES = ['/index.js', '/index.jsx', '/index.ts', '/index.tsx'];
    
    this.results = {
      timestamp: new Date().toISOString(),
      summary: {
        totalOrphans: 0,
        unusedDependencies: 0,
        unreachableModules: 0,
        orphanedFiles: 0
      },
      details: {
        unusedDependencies: [],
        unreachableModules: [],
        orphanedFiles: [],
        recommendations: []
      }
    };
  }

  async analyze() {
    console.log('🔍 Starting orphan module analysis...');
    
    try {
      await this.ensureOutputDir();
      await this.analyzeUnusedDependencies();
      await this.analyzeUnreachableModules();
      await this.analyzeOrphanedFiles();
      await this.generateRecommendations();
      await this.generateReports();
      
      console.log(`✅ Analysis complete! Found ${this.results.summary.totalOrphans} potential orphans`);
      return this.results;
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
      throw error;
    }
  }

  async ensureOutputDir() {
    const outputDir = this.options.outputDir;
    if (outputDir && !fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  }

  async analyzeUnusedDependencies() {
    console.log('📦 Analyzing unused dependencies...');
    
    // Load depcheck ignore list
    const depcheckIgnores = this.loadDepcheckIgnores();
    
    const packageAreas = [
      { name: 'root', path: this.options.rootDir },
      { name: 'apps/main', path: path.join(this.options.rootDir, 'apps', 'main') },
      { name: 'backend', path: path.join(this.options.rootDir, 'backend') }
    ];

    for (const area of packageAreas) {
      const packageJsonPath = path.join(area.path, 'package.json');
      if (!fs.existsSync(packageJsonPath)) continue;

      try {
        const unusedDeps = await this.checkDependenciesInArea(area);
        // Filter out dependencies that are in the depcheck ignore list
        const filteredDeps = unusedDeps.filter(dep => !depcheckIgnores.includes(dep));
        
        if (filteredDeps.length > 0) {
          this.results.details.unusedDependencies.push({
            area: area.name,
            path: area.path,
            unused: filteredDeps
          });
          this.results.summary.unusedDependencies += filteredDeps.length;
        }
      } catch (error) {
        console.warn(`⚠️ Could not analyze dependencies in ${area.name}:`, error.message);
      }
    }
  }

  loadDepcheckIgnores() {
    const depcheckrcPath = path.join(this.options.rootDir, '.depcheckrc.json');
    if (!fs.existsSync(depcheckrcPath)) return [];
    
    try {
      const config = JSON.parse(fs.readFileSync(depcheckrcPath, 'utf8'));
      return config.ignores || [];
    } catch (error) {
      console.warn('⚠️ Could not load .depcheckrc.json:', error.message);
      return [];
    }
  }

  async checkDependenciesInArea(area) {
    return new Promise((resolve, reject) => {
      // Use depcheck if available, fallback to manual analysis
      const depcheck = spawn('npx', ['depcheck', '--json'], { 
        cwd: area.path,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let output = '';
      let error = '';

      depcheck.stdout.on('data', (data) => {
        output += data.toString();
      });

      depcheck.stderr.on('data', (data) => {
        error += data.toString();
      });

      depcheck.on('close', (code) => {
        if (code === 0 && output.trim()) {
          try {
            const result = JSON.parse(output);
            const unused = Object.keys(result.dependencies || {});
            resolve(unused);
          } catch (parseError) {
            // Fallback to manual dependency analysis
            resolve(this.manualDependencyCheck(area.path));
          }
        } else {
          // Fallback to manual dependency analysis
          resolve(this.manualDependencyCheck(area.path));
        }
      });

      depcheck.on('error', () => {
        // Fallback to manual dependency analysis
        resolve(this.manualDependencyCheck(area.path));
      });
    });
  }

  manualDependencyCheck(areaPath) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(areaPath, 'package.json'), 'utf8'));
      const dependencies = Object.keys(packageJson.dependencies || {});
      const devDependencies = this.options.includeDevDeps ? Object.keys(packageJson.devDependencies || {}) : [];
      const allDeps = [...dependencies, ...devDependencies];

      const unused = [];
      
      // Simple heuristic: check if dependency is mentioned in any JS file
      for (const dep of allDeps) {
        if (!this.isDependencyUsed(areaPath, dep)) {
          unused.push(dep);
        }
      }

      return unused;
    } catch (error) {
      console.warn(`Could not perform manual dependency check in ${areaPath}:`, error.message);
      return [];
    }
  }

  isDependencyUsed(areaPath, dependency) {
    try {
      const result = this.searchInFiles(areaPath, [
        `require('${dependency}')`,
        `require("${dependency}")`,
        `from '${dependency}'`,
        `from "${dependency}"`,
        `import.*${dependency}`,
        dependency // Simple name match
      ]);
      return result.length > 0;
    } catch {
      return true; // Assume used if we can't check
    }
  }

  searchInFiles(dir, patterns) {
    const results = [];
    const files = this.getJavaScriptFiles(dir);

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        for (const pattern of patterns) {
          const regex = new RegExp(pattern, 'gi');
          if (regex.test(content)) {
            results.push({ file, pattern });
            break; // Found at least one match
          }
        }
      } catch (error) {
        // Skip files we can't read
      }
    }

    return results;
  }

  getJavaScriptFiles(dir) {
    const files = [];
    
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !this.shouldSkipDirectory(entry.name)) {
          files.push(...this.getJavaScriptFiles(fullPath));
        } else if (entry.isFile() && this.isJavaScriptFile(entry.name)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }

    return files;
  }

  shouldSkipDirectory(name) {
    const skipDirs = ['node_modules', '.git', 'build', 'dist', 'coverage', '.next'];
    return skipDirs.includes(name) || name.startsWith('.');
  }

  isJavaScriptFile(filename) {
    return this.JS_EXTENSIONS.some(ext => filename.endsWith(ext));
  }

  async analyzeUnreachableModules() {
    console.log('🔗 Analyzing unreachable modules...');
    
    // Load orphan ignore patterns
    const ignorePatterns = this.loadOrphanIgnorePatterns();
    
    // Find all JavaScript modules and check reachability from entry points
    const areas = [
      { 
        name: 'apps/main', 
        path: path.join(this.options.rootDir, 'apps', 'main'), 
        entryPoints: this.getNextJsEntryPoints(path.join(this.options.rootDir, 'apps', 'main')),
        isNextJs: true
      },
      { 
        name: 'backend', 
        path: path.join(this.options.rootDir, 'backend'), 
        entryPoints: ['src/server.js', 'src/index.js', 'src/app.js'],
        isNextJs: false
      }
    ];

    for (const area of areas) {
      if (!fs.existsSync(area.path)) continue;

      const allModules = this.getJavaScriptFiles(area.path);
      const reachableModules = new Set();
      
      // Start from entry points and traverse dependencies
      for (const entryPoint of area.entryPoints) {
        const fullEntryPath = path.join(area.path, entryPoint);
        if (fs.existsSync(fullEntryPath)) {
          this.traverseModuleDependencies(fullEntryPath, reachableModules, area.path);
        }
      }

      // Find unreachable modules, applying ignore patterns
      const unreachable = allModules.filter(module => {
        if (reachableModules.has(module)) return false;
        
        const relativePath = path.relative(area.path, module);
        return !this.shouldIgnoreModule(relativePath, ignorePatterns);
      });
      
      if (unreachable.length > 0) {
        this.results.details.unreachableModules.push({
          area: area.name,
          path: area.path,
          unreachable: unreachable.map(mod => path.relative(area.path, mod))
        });
        this.results.summary.unreachableModules += unreachable.length;
      }
    }
  }

  getNextJsEntryPoints(appPath) {
    // In Next.js, ALL pages are entry points because they're auto-routed
    const entryPoints = ['pages/_app.tsx', 'middleware.ts'];
    const pagesDir = path.join(appPath, 'pages');
    
    if (fs.existsSync(pagesDir)) {
      const pageFiles = this.findPageFiles(pagesDir);
      entryPoints.push(...pageFiles.map(p => path.relative(appPath, p)));
    }
    
    return entryPoints;
  }

  findPageFiles(dir) {
    const pageFiles = [];
    
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          // Include ALL directories (including api, _apps, etc) - they're all valid Next.js routes
          pageFiles.push(...this.findPageFiles(fullPath));
        } else if (entry.isFile() && this.isJavaScriptFile(entry.name)) {
          pageFiles.push(fullPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
    
    return pageFiles;
  }

  loadOrphanIgnorePatterns() {
    const ignoreFile = path.join(this.options.rootDir, '.orphanignore');
    if (!fs.existsSync(ignoreFile)) return [];
    
    try {
      const content = fs.readFileSync(ignoreFile, 'utf8');
      return content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));
    } catch {
      return [];
    }
  }

  shouldIgnoreModule(relativePath, ignorePatterns) {
    for (const pattern of ignorePatterns) {
      // Convert glob pattern to regex
      // First, handle ** and * BEFORE escaping other characters
      // Use unique placeholders to avoid conflicts with actual file content
      let regexPattern = pattern
        .replace(/\*\*/g, '__GLOB_DOUBLESTAR_PLACEHOLDER__')  // Placeholder for **
        .replace(/\*/g, '__GLOB_STAR_PLACEHOLDER__');  // Placeholder for *
      
      // Now escape special regex characters
      regexPattern = regexPattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
      
      // Replace placeholders with regex patterns
      regexPattern = regexPattern
        .replace(/__GLOB_DOUBLESTAR_PLACEHOLDER__/g, '.*')  // ** matches any path including /
        .replace(/__GLOB_STAR_PLACEHOLDER__/g, '[^/]*');  // * matches anything except /
      
      const regex = new RegExp(`^${regexPattern}$`);
      if (regex.test(relativePath)) {
        return true;
      }
    }
    return false;
  }

  traverseModuleDependencies(filePath, visited, rootPath) {
    if (visited.has(filePath) || !fs.existsSync(filePath)) return;
    
    visited.add(filePath);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const imports = this.extractImports(content);
      
      for (const importPath of imports) {
        const resolvedPath = this.resolveImportPath(importPath, filePath, rootPath);
        if (resolvedPath) {
          this.traverseModuleDependencies(resolvedPath, visited, rootPath);
        }
      }
    } catch (error) {
      // Skip files we can't read
    }
  }

  extractImports(content) {
    const imports = [];
    
    // Match require() statements
    const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    let match;
    while ((match = requireRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    // Match ES6 import statements
    const importRegex = /import.*?from\s+['"]([^'"]+)['"]/g;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    // Match dynamic imports: import('...') 
    const dynamicImportRegex = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    while ((match = dynamicImportRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    // Match re-exports: export { ... } from '...'
    const reExportRegex = /export\s+(?:\{[^}]*\}|\*)\s+from\s+['"]([^'"]+)['"]/g;
    while ((match = reExportRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    return imports.filter(imp => imp.startsWith('.') || imp.startsWith('/'));
  }

  resolveImportPath(importPath, currentFile, rootPath) {
    try {
      const currentDir = path.dirname(currentFile);
      let resolvedPath;
      
      if (importPath.startsWith('.')) {
        resolvedPath = path.resolve(currentDir, importPath);
      } else if (importPath.startsWith('/')) {
        resolvedPath = path.resolve(rootPath, importPath.slice(1));
      } else {
        return null; // External dependency
      }
      
      // Try common extensions using shared constants
      const extensions = ['', ...this.JS_EXTENSIONS, ...this.JS_INDEX_FILES];
      for (const ext of extensions) {
        const testPath = resolvedPath + ext;
        if (fs.existsSync(testPath) && fs.statSync(testPath).isFile()) {
          return testPath;
        }
      }
      
      return null;
    } catch {
      return null;
    }
  }

  async analyzeOrphanedFiles() {
    console.log('📄 Analyzing orphaned files...');
    
    // Look for common orphaned file patterns
    const orphanPatterns = [
      '**/*.js.bak',
      '**/*.old',
      '**/unused_*',
      '**/deprecated_*',
      '**/temp_*',
      '**/*_backup.*'
    ];

    // Find files matching orphan patterns
    const orphanedFiles = this.findOrphanedFiles(this.options.rootDir, orphanPatterns);
    
    if (orphanedFiles.length > 0) {
      this.results.details.orphanedFiles = orphanedFiles.map(file => 
        path.relative(this.options.rootDir, file)
      );
      this.results.summary.orphanedFiles = orphanedFiles.length;
    }
  }

  findOrphanedFiles(dir, patterns) {
    const orphaned = [];
    
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !this.shouldSkipDirectory(entry.name)) {
          orphaned.push(...this.findOrphanedFiles(fullPath, patterns));
        } else if (entry.isFile()) {
          // Check if file matches any orphan pattern
          // Note: patterns are hardcoded in analyzeOrphanedFiles(), not user input
          // The [^/]* pattern prevents matching across directory separators
          for (const pattern of patterns) {
            const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
            if (regex.test(fullPath)) {
              orphaned.push(fullPath);
              break;
            }
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }

    return orphaned;
  }

  async generateRecommendations() {
    console.log('💡 Generating recommendations...');
    
    const recommendations = [];

    // Unused dependencies recommendations
    if (this.results.summary.unusedDependencies > 0) {
      recommendations.push({
        type: 'unused-dependencies',
        priority: 'medium',
        title: `Remove ${this.results.summary.unusedDependencies} unused dependencies`,
        description: 'These dependencies are taking up space and could pose security risks',
        action: 'Run `npm uninstall <package-name>` for each unused dependency'
      });
    }

    // Unreachable modules recommendations
    if (this.results.summary.unreachableModules > 0) {
      recommendations.push({
        type: 'unreachable-modules',
        priority: 'low',
        title: `Remove or refactor ${this.results.summary.unreachableModules} unreachable modules`,
        description: 'These modules are not reachable from any entry point and may be dead code',
        action: 'Review each module and either delete it or add proper imports'
      });
    }

    // Orphaned files recommendations
    if (this.results.summary.orphanedFiles > 0) {
      recommendations.push({
        type: 'orphaned-files',
        priority: 'low',
        title: `Clean up ${this.results.summary.orphanedFiles} orphaned files`,
        description: 'These files appear to be backup or temporary files',
        action: 'Review and safely delete these files'
      });
    }

    this.results.details.recommendations = recommendations;
    this.results.summary.totalOrphans = 
      this.results.summary.unusedDependencies + 
      this.results.summary.unreachableModules + 
      this.results.summary.orphanedFiles;
  }

  async generateReports() {
    console.log('📊 Generating reports...');
    
    // Generate JSON report
    await this.generateJsonReport();
    
    // Generate HTML report
    await this.generateHtmlReport();
    
    // Generate markdown summary
    await this.generateMarkdownSummary();
  }

  async generateJsonReport() {
    let jsonPath;
    if (this.options.outputDir) {
      jsonPath = path.join(this.options.outputDir, 'orphan-modules.json');
      fs.writeFileSync(jsonPath, JSON.stringify(this.results, null, 2));
      console.log(`📄 JSON report: ${jsonPath}`);
    }
  }

  async generateHtmlReport() {
    if (this.options.outputDir) {
      const htmlContent = this.createHtmlReport();
      const htmlPath = path.join(this.options.outputDir, 'orphan-modules.html');
      fs.writeFileSync(htmlPath, htmlContent);
      console.log(`🌐 HTML report: ${htmlPath}`);
    }
  }

  createHtmlReport() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orphan Module Report - yoohoo.guru</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .header .timestamp { opacity: 0.9; margin-top: 10px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; padding: 30px; }
        .metric { background: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #007bff; }
        .metric .value { font-size: 32px; font-weight: bold; color: #2c3e50; }
        .metric .label { color: #6c757d; margin-top: 5px; }
        .section { padding: 0 30px 30px; }
        .section h2 { color: #2c3e50; border-bottom: 2px solid #e9ecef; padding-bottom: 10px; }
        .item-list { background: #f8f9fa; border-radius: 6px; padding: 15px; margin: 10px 0; }
        .item { padding: 10px; border-bottom: 1px solid #dee2e6; }
        .item:last-child { border-bottom: none; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
        .badge.medium { background: #ffc107; color: #000; }
        .badge.low { background: #28a745; color: white; }
        .no-items { color: #6c757d; font-style: italic; text-align: center; padding: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 Orphan Module Report</h1>
            <div class="timestamp">Generated: ${this.results.timestamp}</div>
        </div>
        
        <div class="summary">
            <div class="metric">
                <div class="value">${this.results.summary.totalOrphans}</div>
                <div class="label">Total Orphans Found</div>
            </div>
            <div class="metric">
                <div class="value">${this.results.summary.unusedDependencies}</div>
                <div class="label">Unused Dependencies</div>
            </div>
            <div class="metric">
                <div class="value">${this.results.summary.unreachableModules}</div>
                <div class="label">Unreachable Modules</div>
            </div>
            <div class="metric">
                <div class="value">${this.results.summary.orphanedFiles}</div>
                <div class="label">Orphaned Files</div>
            </div>
        </div>

        ${this.generateHtmlSection('Recommendations', this.results.details.recommendations, 'recommendation')}
        ${this.generateHtmlSection('Unused Dependencies', this.results.details.unusedDependencies, 'dependency')}
        ${this.generateHtmlSection('Unreachable Modules', this.results.details.unreachableModules, 'module')}
        ${this.generateHtmlSection('Orphaned Files', this.results.details.orphanedFiles, 'file')}
    </div>
</body>
</html>`;
  }

  generateHtmlSection(title, items, type) {
    if (!items || items.length === 0) {
      return `
        <div class="section">
            <h2>${title}</h2>
            <div class="no-items">No ${title.toLowerCase()} found ✅</div>
        </div>
      `;
    }

    let content = '';
    
    if (type === 'recommendation') {
      content = items.map(item => `
        <div class="item">
            <strong>${item.title}</strong> 
            <span class="badge ${item.priority}">${item.priority}</span>
            <div style="margin-top: 8px; color: #6c757d;">${item.description}</div>
            <div style="margin-top: 8px; font-family: monospace; background: #e9ecef; padding: 8px; border-radius: 4px; font-size: 14px;">
                ${item.action}
            </div>
        </div>
      `).join('');
    } else if (type === 'dependency') {
      content = items.map(area => `
        <div class="item">
            <strong>${area.area}</strong> (${area.unused.length} unused)
            <div style="margin-top: 8px; font-family: monospace; color: #dc3545;">
                ${area.unused.join(', ')}
            </div>
        </div>
      `).join('');
    } else if (type === 'module') {
      content = items.map(area => `
        <div class="item">
            <strong>${area.area}</strong> (${area.unreachable.length} unreachable)
            <div style="margin-top: 8px; font-family: monospace; color: #dc3545;">
                ${area.unreachable.join('<br>')}
            </div>
        </div>
      `).join('');
    } else if (type === 'file') {
      content = items.map(file => `
        <div class="item">
            <span style="font-family: monospace; color: #dc3545;">${file}</span>
        </div>
      `).join('');
    }

    return `
      <div class="section">
          <h2>${title}</h2>
          <div class="item-list">
              ${content}
          </div>
      </div>
    `;
  }

  async generateMarkdownSummary() {
    const markdown = `# Orphan Module Analysis Report

**Generated:** ${this.results.timestamp}

## Summary

- **Total Orphans:** ${this.results.summary.totalOrphans}
- **Unused Dependencies:** ${this.results.summary.unusedDependencies}
- **Unreachable Modules:** ${this.results.summary.unreachableModules}
- **Orphaned Files:** ${this.results.summary.orphanedFiles}

## Recommendations

${this.results.details.recommendations.length > 0 
  ? this.results.details.recommendations.map(rec => 
      `### ${rec.title} (${rec.priority} priority)\n${rec.description}\n\n**Action:** ${rec.action}`
    ).join('\n\n')
  : 'No recommendations - codebase is clean! ✅'
}

## Details

${this.results.summary.unusedDependencies > 0 
  ? `### Unused Dependencies\n${this.results.details.unusedDependencies.map(area => 
      `**${area.area}:** ${area.unused.join(', ')}`
    ).join('\n')}`
  : ''
}

${this.results.summary.unreachableModules > 0
  ? `### Unreachable Modules\n${this.results.details.unreachableModules.map(area =>
      `**${area.area}:**\n${area.unreachable.map(mod => `- ${mod}`).join('\n')}`
    ).join('\n\n')}`
  : ''
}

${this.results.summary.orphanedFiles > 0
  ? `### Orphaned Files\n${this.results.details.orphanedFiles.map(file => `- ${file}`).join('\n')}`
  : ''
}
`;

    if (this.options.outputDir) {
      const markdownPath = path.join(this.options.outputDir, 'orphan-modules-summary.md');
      fs.writeFileSync(markdownPath, markdown);
      console.log(`📝 Markdown summary: ${markdownPath}`);
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const options = {
    verbose: args.includes('--verbose') || args.includes('-v'),
    includeDevDeps: args.includes('--include-dev-deps'),
    outputDir: args.find(arg => arg.startsWith('--output='))?.split('=')[1] || undefined
  };

  try {
    const detector = new OrphanModuleDetector(options);
    const results = await detector.analyze();
    
    // Exit with error code if orphans found (for CI)
    const errorThreshold = parseInt(process.env.ORPHAN_ERROR_THRESHOLD || '0');
    if (results.summary.totalOrphans > errorThreshold) {
      console.log(`\n⚠️ Found ${results.summary.totalOrphans} orphans (threshold: ${errorThreshold})`);
      process.exit(1);
    }
    
    console.log('\n✅ Analysis completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Analysis failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { OrphanModuleDetector };