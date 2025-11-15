import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const robotsTxt = `User-agent: *
Allow: /

# Disallow admin and private pages
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/

# Sitemap
Sitemap: https://www.yoohoo.guru/api/sitemap.xml
`;

  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(robotsTxt);
}