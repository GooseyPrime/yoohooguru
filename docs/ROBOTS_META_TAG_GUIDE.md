# Robots Meta Tag Usage Guide

## Overview

The `robots` prop in the SEOMetadata component controls how search engines index and follow links on your pages.

## Common Values

### Public Pages (Default)
```javascript
<SEOMetadata 
  robots="index,follow"  // Allow indexing and following links
/>
```
Or simply omit the `robots` prop - search engines will index by default.

### Private/Auth-Required Pages
```javascript
<SEOMetadata 
  robots="noindex,nofollow"  // Prevent indexing and following links
/>
```

Use this for:
- User dashboards
- Profile pages
- Account settings
- Admin pages
- Private content
- Onboarding flows

### Specific Use Cases

#### Allow Indexing but Don't Follow Links
```javascript
<SEOMetadata 
  robots="index,nofollow"
/>
```
Use for pages with user-generated content or external links you don't endorse.

#### Don't Index but Follow Links
```javascript
<SEOMetadata 
  robots="noindex,follow"
/>
```
Use for pagination pages or duplicate content where you want link equity to flow.

#### No Caching
```javascript
<SEOMetadata 
  robots="noindex,nofollow,noarchive"
/>
```
Use for sensitive pages that shouldn't be cached by search engines.

#### Block Image Indexing
```javascript
<SEOMetadata 
  robots="noimageindex"
/>
```
Use when you don't want images on the page to appear in image search results.

## Implementation Examples

### Dashboard Page (Private)
```javascript
import SEOMetadata from '../components/SEOMetadata';

function DashboardPage() {
  return (
    <>
      <SEOMetadata 
        title="Dashboard - yoohoo.guru"
        description="Your personal dashboard"
        robots="noindex,nofollow"  // Private page, don't index
      />
      {/* Dashboard content */}
    </>
  );
}
```

### Login/Signup Pages (Public but Low Priority)
```javascript
<SEOMetadata 
  title="Login - yoohoo.guru"
  description="Sign in to your yoohoo.guru account"
  // Omit robots prop - allow indexing with low priority
/>
```

### Blog Post (Public, High Priority)
```javascript
<SEOMetadata 
  title="How to Master Design Skills - yoohoo.guru"
  description="Learn expert design tips from top professionals..."
  robots="index,follow"  // Explicitly allow indexing
  // ... other SEO props
/>
```

### User Profile (Private)
```javascript
<SEOMetadata 
  title={`${user.name}'s Profile - yoohoo.guru`}
  description="User profile page"
  robots="noindex,nofollow"  // Private user data
/>
```

### Coming Soon Page (Temporary)
```javascript
<SEOMetadata 
  title="Coming Soon - yoohoo.guru"
  description="This feature is coming soon"
  robots="noindex,follow"  // Don't index but follow navigation links
/>
```

## Best Practices

1. **Default to Indexable**: Only use `noindex` when necessary. Public pages should be indexable.

2. **Auth-Required = noindex**: Always use `noindex,nofollow` for pages that require authentication.

3. **Consistent with robots.txt**: Ensure robots meta tags align with your robots.txt file.

4. **Test Before Deploy**: Use Google Search Console's URL Inspection tool to verify robots directives.

5. **Monitor Search Console**: Check for unintended `noindex` tags blocking important pages.

## Common Mistakes to Avoid

❌ **Don't** add `noindex` to public marketing pages
❌ **Don't** use `noindex` on blog posts or content pages
❌ **Don't** forget to add `noindex` to admin/dashboard pages
❌ **Don't** use `nofollow` on internal site navigation

✅ **Do** use `noindex,nofollow` for private content
✅ **Do** allow indexing of public pages (default behavior)
✅ **Do** test robots directives in Search Console
✅ **Do** document any non-standard robots usage

## Validation

To verify robots meta tags are correctly set:

1. **View Page Source**: Check for `<meta name="robots" content="...">` tag
2. **Browser DevTools**: Inspect the `<head>` element
3. **Search Console**: Use URL Inspection tool
4. **Screaming Frog**: Crawl site and check robots directives

## Additional Resources

- [Google Robots Meta Tag Documentation](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [Robots.txt vs Robots Meta Tag](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [SEO Implementation Guide](./SEO_IMPLEMENTATION.md)

---

**Last Updated:** 2025-10-15  
**Version:** 1.0
