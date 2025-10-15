import { useEffect } from 'react';

interface SEOMetadataProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
  structuredData?: any;
}

function SEOMetadata({ 
  title, 
  description, 
  keywords, 
  ogTitle, 
  ogDescription, 
  ogImage, 
  ogUrl,
  canonicalUrl,
  structuredData 
}: SEOMetadataProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const finalUrl = window.location.href;
    
    // Normalize URL to use canonical www subdomain for main domain
    let normalizedCanonicalUrl = canonicalUrl;
    if (!normalizedCanonicalUrl) {
      try {
        const currentUrl = new URL(finalUrl);
        // If on yoohoo.guru (without www), normalize to www.yoohoo.guru
        if (currentUrl.hostname === 'yoohoo.guru') {
          currentUrl.hostname = 'www.yoohoo.guru';
        }
        normalizedCanonicalUrl = currentUrl.href;
      } catch (e) {
        normalizedCanonicalUrl = finalUrl;
      }
    }
    
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string | undefined, isProperty = false) => {
      if (!content) return;
      
      const attribute = isProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }
      
      tag.content = content;
    };

    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('og:title', ogTitle || title, true);
    updateMetaTag('og:description', ogDescription || description, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:url', ogUrl || normalizedCanonicalUrl, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:site_name', 'yoohoo.guru', true);
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', ogTitle || title);
    updateMetaTag('twitter:description', ogDescription || description);
    updateMetaTag('twitter:image', ogImage);

    // Update canonical URL with normalized www URL
    if (normalizedCanonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = normalizedCanonicalUrl;
    }

    // Add structured data
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl, canonicalUrl, structuredData]);

  return null;
}

export default SEOMetadata;
