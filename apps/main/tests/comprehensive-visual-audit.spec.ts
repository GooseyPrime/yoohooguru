import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Create screenshots directory
const screenshotsDir = path.join(__dirname, '../test-results/visual-audit');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const allPages = [
  { name: 'Home', url: '/', category: 'main' },
  { name: 'About', url: '/about', category: 'main' },
  { name: 'How It Works', url: '/how-it-works', category: 'main' },
  { name: 'Pricing', url: '/pricing', category: 'main' },
  { name: 'Blog', url: '/blog', category: 'main' },
  { name: 'Help', url: '/help', category: 'support' },
  { name: 'Safety', url: '/safety', category: 'support' },
  { name: 'Contact', url: '/contact', category: 'support' },
  { name: 'FAQ', url: '/faq', category: 'support' },
  { name: 'Hubs', url: '/hubs', category: 'content' },
  { name: 'Terms', url: '/terms', category: 'legal' },
  { name: 'Privacy', url: '/privacy', category: 'legal' },
  { name: 'Cookies', url: '/cookies', category: 'legal' },
  { name: 'Login', url: '/login', category: 'auth' },
  { name: 'Signup', url: '/signup', category: 'auth' },
];

test.describe('Comprehensive Visual Audit', () => {
  test('Generate visual audit report', async ({ page }) => {
    const report: any = {
      timestamp: new Date().toISOString(),
      pages: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0,
      },
    };

    for (const pageInfo of allPages) {
      console.log(`\n📄 Auditing: ${pageInfo.name} (${pageInfo.url})`);
      
      const pageReport: any = {
        name: pageInfo.name,
        url: pageInfo.url,
        category: pageInfo.category,
        checks: [],
        screenshots: [],
        issues: [],
      };

      try {
        await page.goto(pageInfo.url, { waitUntil: 'networkidle', timeout: 30000 });
        
        // 1. Check page loads successfully
        pageReport.checks.push({
          name: 'Page Load',
          status: 'passed',
          message: 'Page loaded successfully',
        });

        // 2. Take full page screenshot
        const screenshotPath = path.join(screenshotsDir, `${pageInfo.name.toLowerCase().replace(/\s+/g, '-')}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        pageReport.screenshots.push(screenshotPath);

        // 3. Check for console errors
        const consoleErrors: string[] = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });

        if (consoleErrors.length > 0) {
          pageReport.issues.push({
            severity: 'warning',
            type: 'Console Errors',
            count: consoleErrors.length,
            details: consoleErrors.slice(0, 5),
          });
        }

        // 4. Check navigation exists
        const nav = page.locator('nav');
        const navVisible = await nav.isVisible();
        pageReport.checks.push({
          name: 'Navigation Present',
          status: navVisible ? 'passed' : 'failed',
          message: navVisible ? 'Navigation found' : 'Navigation missing',
        });

        // 5. Check footer exists
        const footer = page.locator('footer');
        const footerVisible = await footer.isVisible();
        pageReport.checks.push({
          name: 'Footer Present',
          status: footerVisible ? 'passed' : 'failed',
          message: footerVisible ? 'Footer found' : 'Footer missing',
        });

        // 6. Check for broken images
        const images = await page.locator('img').all();
        let brokenImages = 0;
        for (const img of images) {
          const src = await img.getAttribute('src');
          if (src && !src.startsWith('data:')) {
            const isVisible = await img.isVisible().catch(() => false);
            if (!isVisible) brokenImages++;
          }
        }
        
        if (brokenImages > 0) {
          pageReport.issues.push({
            severity: 'error',
            type: 'Broken Images',
            count: brokenImages,
          });
        }

        // 7. Check heading hierarchy
        const h1Count = await page.locator('h1').count();
        const h2Count = await page.locator('h2').count();
        
        pageReport.checks.push({
          name: 'Heading Hierarchy',
          status: h1Count >= 1 ? 'passed' : 'warning',
          message: `H1: ${h1Count}, H2: ${h2Count}`,
        });

        // 8. Check for interactive elements
        const buttons = await page.locator('button, a[role="button"]').count();
        const links = await page.locator('a[href]').count();
        
        pageReport.checks.push({
          name: 'Interactive Elements',
          status: 'passed',
          message: `Buttons: ${buttons}, Links: ${links}`,
        });

        // 9. Check responsive meta tag
        const viewport = await page.locator('meta[name="viewport"]').count();
        pageReport.checks.push({
          name: 'Responsive Meta Tag',
          status: viewport > 0 ? 'passed' : 'failed',
          message: viewport > 0 ? 'Viewport meta tag present' : 'Missing viewport meta tag',
        });

        // 10. Check for accessibility attributes
        const ariaLabels = await page.locator('[aria-label]').count();
        const altTexts = await page.locator('img[alt]').count();
        
        pageReport.checks.push({
          name: 'Accessibility Attributes',
          status: 'info',
          message: `ARIA labels: ${ariaLabels}, Alt texts: ${altTexts}`,
        });

        // 11. Check page title
        const title = await page.title();
        pageReport.checks.push({
          name: 'Page Title',
          status: title && title.length > 0 ? 'passed' : 'failed',
          message: title || 'No title found',
        });

        // 12. Check for gradient text elements (style consistency)
        const gradientElements = await page.locator('[class*="gradient-text"]').count();
        pageReport.checks.push({
          name: 'Style Consistency (Gradients)',
          status: 'info',
          message: `Gradient elements: ${gradientElements}`,
        });

        // 13. Check for glass effect elements (style consistency)
        const glassElements = await page.locator('[class*="glass"]').count();
        pageReport.checks.push({
          name: 'Style Consistency (Glass Effect)',
          status: 'info',
          message: `Glass elements: ${glassElements}`,
        });

        // Calculate page score
        const passedChecks = pageReport.checks.filter((c: any) => c.status === 'passed').length;
        const totalChecks = pageReport.checks.filter((c: any) => c.status !== 'info').length;
        pageReport.score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;

        console.log(`✅ ${pageInfo.name}: ${pageReport.score}% passed`);

      } catch (error: any) {
        pageReport.checks.push({
          name: 'Page Load',
          status: 'failed',
          message: `Error: ${error.message}`,
        });
        pageReport.score = 0;
        console.log(`❌ ${pageInfo.name}: Failed to load`);
      }

      report.pages.push(pageReport);
      report.summary.total++;
      
      if (pageReport.score >= 80) {
        report.summary.passed++;
      } else if (pageReport.score >= 50) {
        report.summary.warnings++;
      } else {
        report.summary.failed++;
      }
    }

    // Generate HTML report
    const htmlReport = generateHTMLReport(report);
    const reportPath = path.join(screenshotsDir, 'visual-audit-report.html');
    fs.writeFileSync(reportPath, htmlReport);

    // Generate JSON report
    const jsonReportPath = path.join(screenshotsDir, 'visual-audit-report.json');
    fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2));

    console.log(`\n📊 Visual Audit Complete!`);
    console.log(`   Total Pages: ${report.summary.total}`);
    console.log(`   ✅ Passed: ${report.summary.passed}`);
    console.log(`   ⚠️  Warnings: ${report.summary.warnings}`);
    console.log(`   ❌ Failed: ${report.summary.failed}`);
    console.log(`\n📄 Reports saved to: ${screenshotsDir}`);

    // Assert that most pages pass
    expect(report.summary.passed).toBeGreaterThan(report.summary.failed);
  });
});

function generateHTMLReport(report: any): string {
  const pageRows = report.pages.map((page: any) => {
    const statusColor = page.score >= 80 ? '#10b981' : page.score >= 50 ? '#f59e0b' : '#ef4444';
    const statusIcon = page.score >= 80 ? '✅' : page.score >= 50 ? '⚠️' : '❌';
    
    const checksHTML = page.checks.map((check: any) => {
      const checkColor = check.status === 'passed' ? '#10b981' : 
                        check.status === 'failed' ? '#ef4444' : 
                        check.status === 'warning' ? '#f59e0b' : '#6b7280';
      return `
        <div style="padding: 8px; border-left: 3px solid ${checkColor}; margin: 4px 0; background: #1f2937;">
          <strong>${check.name}:</strong> ${check.message}
        </div>
      `;
    }).join('');

    const issuesHTML = page.issues.length > 0 ? `
      <div style="margin-top: 12px;">
        <strong>Issues:</strong>
        ${page.issues.map((issue: any) => `
          <div style="padding: 8px; background: #7f1d1d; margin: 4px 0; border-radius: 4px;">
            ${issue.type}: ${issue.count} ${issue.details ? `<br><small>${issue.details.join(', ')}</small>` : ''}
          </div>
        `).join('')}
      </div>
    ` : '';

    return `
      <div style="margin: 20px 0; padding: 20px; background: #111827; border-radius: 8px; border: 1px solid #374151;">
        <h3 style="margin: 0 0 12px 0; color: white;">
          ${statusIcon} ${page.name} 
          <span style="color: ${statusColor}; float: right;">${page.score}%</span>
        </h3>
        <p style="color: #9ca3af; margin: 0 0 12px 0;">
          <strong>URL:</strong> ${page.url} | <strong>Category:</strong> ${page.category}
        </p>
        ${checksHTML}
        ${issuesHTML}
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>YooHoo.Guru Visual Audit Report</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #0f172a;
          color: white;
          padding: 40px;
          margin: 0;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        .summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .summary-card {
          background: #1e293b;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #334155;
        }
        .summary-card h2 {
          margin: 0;
          font-size: 48px;
        }
        .summary-card p {
          margin: 8px 0 0 0;
          color: #94a3b8;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎨 YooHoo.Guru Visual Audit Report</h1>
        <p style="color: #94a3b8;">Generated: ${new Date(report.timestamp).toLocaleString()}</p>
      </div>
      
      <div class="summary">
        <div class="summary-card">
          <h2>${report.summary.total}</h2>
          <p>Total Pages</p>
        </div>
        <div class="summary-card" style="border-color: #10b981;">
          <h2 style="color: #10b981;">${report.summary.passed}</h2>
          <p>Passed</p>
        </div>
        <div class="summary-card" style="border-color: #f59e0b;">
          <h2 style="color: #f59e0b;">${report.summary.warnings}</h2>
          <p>Warnings</p>
        </div>
        <div class="summary-card" style="border-color: #ef4444;">
          <h2 style="color: #ef4444;">${report.summary.failed}</h2>
          <p>Failed</p>
        </div>
      </div>
      
      <h2>Page Details</h2>
      ${pageRows}
    </body>
    </html>
  `;
}