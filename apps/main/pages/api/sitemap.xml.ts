import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const baseUrl = 'https://www.yoohoo.guru';
  
  // Main domain pages
  const mainPages = [
    '',
    'about',
    'how-it-works',
    'pricing',
    'contact',
    'blog',
    'help',
    'faq',
    'terms',
    'privacy',
    'cookies',
    'safety',
    'login',
    'signup',
    'skills/coding'
  ];

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${mainPages.map(page => `  <url>
    <loc>${baseUrl}/${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(sitemap);
}