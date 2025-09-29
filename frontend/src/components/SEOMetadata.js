import { useEffect } from 'react';

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
}) {
  useEffect(() => {
    const finalUrl = window.location.href;
    
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update meta description and check for default descriptions
    updateMetaTag('description', description);
    
    // SEO Warning: Check for default or missing meta descriptions
    if (!description || description.length < 50 || 
        description.includes('Learn') && description.includes('skills') && description.includes('expert')) {
      console.warn(`SEO Warning: Page ${finalUrl} is using the default meta description. This may harm indexing.`);
    }
    
    // Update meta keywords
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    // Open Graph tags
    updateMetaProperty('og:title', ogTitle || title);
    updateMetaProperty('og:description', ogDescription || description);
    updateMetaProperty('og:image', ogImage);
    updateMetaProperty('og:url', ogUrl);
    updateMetaProperty('og:type', 'website');
    updateMetaProperty('og:site_name', 'yoohoo.guru');

    // Twitter Card tags
    updateMetaName('twitter:card', 'summary_large_image');
    updateMetaName('twitter:title', ogTitle || title);
    updateMetaName('twitter:description', ogDescription || description);
    updateMetaName('twitter:image', ogImage);

    // Canonical URL - ensure it's set
    if (canonicalUrl) {
      updateCanonicalLink(canonicalUrl);
    } else {
      // Set current URL as canonical if not explicitly provided
      updateCanonicalLink(finalUrl);
    }

    // Structured data
    if (structuredData) {
      updateStructuredData(structuredData);
    }

    // Cleanup function to remove dynamically added elements
    return () => {
      // Remove any script tags added for structured data
      const existingScripts = document.querySelectorAll('script[data-seo="true"]');
      existingScripts.forEach(script => script.remove());
    };
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl, canonicalUrl, structuredData]);

  return null; // This component doesn't render anything
}

// Helper functions
function updateMetaTag(name, content) {
  if (!content) return;
  
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function updateMetaProperty(property, content) {
  if (!content) return;
  
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function updateMetaName(name, content) {
  if (!content) return;
  
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function updateCanonicalLink(url) {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
}

function updateStructuredData(data) {
  // Remove existing structured data
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"][data-seo="true"]');
  existingScripts.forEach(script => script.remove());

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-seo', 'true');
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export default SEOMetadata;