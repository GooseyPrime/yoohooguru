/**
 * SEO Metadata Component
 * Manages page metadata for SEO and social media sharing
 * 
 * @module components/SEOMetadata
 */

import { useEffect } from 'react';

/**
 * SEO Metadata props
 */
interface SEOMetadataProps {
  /** Page title */
  title?: string;
  /** Page description */
  description?: string;
  /** Comma-separated keywords */
  keywords?: string;
  /** Open Graph title (defaults to title) */
  ogTitle?: string;
  /** Open Graph description (defaults to description) */
  ogDescription?: string;
  /** Open Graph image URL */
  ogImage?: string;
  /** Open Graph URL (defaults to current page) */
  ogUrl?: string;
  /** Canonical URL for the page */
  canonicalUrl?: string;
  /** Structured data JSON-LD object */
  structuredData?: Record<string, unknown>;
  /** Robots meta tag value (e.g., 'noindex,nofollow', 'index,follow') */
  robots?: string;
}

/**
 * SEO Metadata component
 * Updates document metadata for SEO and social sharing
 * 
 * @param {SEOMetadataProps} props - Component props
 * @returns {null} This component renders nothing
 * 
 * @example
 * ```tsx
 * <SEOMetadata
 *   title="YoohooGuru - Skill Sharing Platform"
 *   description="Share and learn skills with the community"
 *   keywords="skills, learning, teaching, community"
 *   ogImage="https://yoohoo.guru/og-image.png"
 *   robots="index,follow"
 * />
 * ```
 */
function SEOMetadata({
  title, 
  description, 
  keywords, 
  ogTitle, 
  ogDescription, 
  ogImage, 
  ogUrl,
  canonicalUrl,
  structuredData,
  robots
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
    updateMetaTag('robots', robots); // Control indexing behavior
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
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl, canonicalUrl, structuredData, robots]);

  return null;
}

export default SEOMetadata;
