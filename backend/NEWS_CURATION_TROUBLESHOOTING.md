# News Curation Troubleshooting Guide

This document provides guidance for troubleshooting news article and summary generation issues in the YooHoo.guru platform.

## Common Issues and Solutions

### 1. Summary Generation Failed

**Error Message:**
```
⚠️ Summary generation failed (Network connectivity issue - unable to reach OpenRouter AI service), using original articles
```

**Possible Causes:**
- Network connectivity issues
- OpenRouter API service is down
- Invalid or missing OPENROUTER_API_KEY

**Solutions:**
1. **Check network connectivity:**
   - Verify the server can reach https://openrouter.ai
   - Check firewall rules
   - Test with: `curl -I https://openrouter.ai/api/v1/chat/completions`

2. **Verify API key:**
   - Ensure `OPENROUTER_API_KEY` is set in environment variables
   - Verify the key is valid at https://openrouter.ai/keys
   - Check for any key rotation or expiration

3. **Check service status:**
   - Visit https://status.openrouter.ai for service status
   - Try using the OPENAI_API_KEY fallback if available

---

### 2. RSS Feed Failures

**Error Message:**
```
❌ RSS feed failed: https://feeds.reuters.com/reuters/topNews - Network connectivity issue - unable to reach feeds.reuters.com
```

**Possible Causes:**
- Network connectivity issues (DNS resolution failure)
- RSS feed URL has changed or is no longer available
- Firewall blocking external requests
- Request timeout (feed taking too long to respond)

**Solutions:**
1. **Network connectivity:**
   - Test DNS resolution: `nslookup feeds.reuters.com`
   - Test connectivity: `curl -I https://feeds.reuters.com/reuters/topNews`
   - Check firewall/security group rules

2. **RSS feed URL verification:**
   - Verify the RSS feed URL is still valid
   - Update RSS feed URLs in `backend/src/agents/curationAgents.js`
   - Common alternatives:
     - Reuters: `https://www.reuters.com/rssFeed/topNews`
     - NPR: `https://feeds.npr.org/1001/rss.xml`
     - NY Times: `https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml`

3. **Timeout configuration:**
   - Default timeout is 10 seconds for RSS feeds
   - Adjust in `curationAgents.js` if feeds are consistently slow
   - Consider using NewsAPI instead of RSS feeds

---

### 3. NewsAPI Failures

**Error Message:**
```
⚠️ NewsAPI did not return articles: Invalid NewsAPI key - check NEWS_API_KEY environment variable
```

**Possible Causes:**
- Missing or invalid NEWS_API_KEY
- NewsAPI rate limit exceeded
- Network connectivity issues
- Request timeout

**Error Code Reference:**
- `ENOTFOUND`: Network connectivity issue - unable to reach NewsAPI.org
- `ETIMEDOUT`/`ECONNABORTED`: Request timeout - NewsAPI.org took too long to respond
- HTTP 401: Invalid NewsAPI key - check NEWS_API_KEY environment variable
- HTTP 429: NewsAPI rate limit exceeded - try again later
- HTTP 402: OpenRouter payment required - check account balance

**Solutions:**
1. **Get a NewsAPI key:**
   - Register at https://newsapi.org/register
   - Free tier allows 100 requests/day
   - Add to `.env`: `NEWS_API_KEY=your_newsapi_key_here`

2. **Rate limit management:**
   - Free tier: 100 requests/day
   - Developer tier: 500 requests/day
   - Business tier: 10,000+ requests/day
   - Monitor usage at https://newsapi.org/account

3. **Network and timeout:**
   - Default timeout is 10 seconds
   - Test connectivity: `curl -I https://newsapi.org/v2/everything`
   - Check firewall rules

---

### 4. All News Sources Failed

**Error Message:**
```
❌ All real news sources failed: NewsAPI: Not configured (missing NEWS_API_KEY); RSS: Network connectivity issue
```

**Solutions:**
1. **Configure at least one source:**
   - Add `NEWS_API_KEY` for NewsAPI.org (recommended)
   - OR ensure RSS feeds are accessible from your server

2. **Test each source individually:**
   ```bash
   # Test NewsAPI
   curl -H "X-API-Key: YOUR_KEY" \
     "https://newsapi.org/v2/everything?q=technology&language=en"
   
   # Test RSS feeds
   curl -I https://techcrunch.com/feed/
   ```

3. **Check environment configuration:**
   ```bash
   # In your deployment environment
   echo $NEWS_API_KEY  # Should show your key
   echo $OPENROUTER_API_KEY  # Should show your key
   ```

---

## Environment Variables

### Required for News Curation

| Variable | Purpose | Where to Get |
|----------|---------|--------------|
| `OPENROUTER_API_KEY` | AI summary generation | https://openrouter.ai/keys |
| `NEWS_API_KEY` | Fetch real news articles | https://newsapi.org/register |
| `OPENAI_API_KEY` | Fallback AI provider | https://platform.openai.com/api-keys |

### Add to `.env` file:
```bash
# NewsAPI.org Configuration (for real news article curation)
# Get your free API key at: https://newsapi.org/register
NEWS_API_KEY=your_newsapi_key_here

# OpenRouter AI Configuration (Primary)
OPENROUTER_API_KEY=your_openrouter_api_key

# OpenAI Configuration (Fallback)
OPENAI_API_KEY=sk-your_openai_api_key_here
```

---

## Timeout Configuration

The system uses the following timeouts to prevent hanging:

- **NewsAPI requests:** 10 seconds
- **RSS feed parsing:** 10 seconds  
- **AI summary generation:** 30 seconds

To adjust timeouts, edit `backend/src/agents/curationAgents.js`:

```javascript
// NewsAPI timeout
timeout: 10000  // milliseconds

// RSS parser timeout
const parser = new Parser({
  timeout: 10000  // milliseconds
});

// AI request timeout
timeout: 30000  // milliseconds
```

---

## Testing News Curation

### Test Error Messages
```bash
cd backend
node test-error-messages.js
```

### Test News Fetching (requires API keys)
```bash
cd backend
node test-news-only.js
```

### Manual Trigger via Admin API
```bash
curl -X POST https://api.yoohoo.guru/api/admin/curate \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Monitoring and Logs

### Check Agent Status
```bash
GET /api/health
```

Response includes curation agent status:
```json
{
  "newsAgent": {
    "status": "running",
    "error": null,
    "lastStarted": "2024-12-07T18:00:00.000Z"
  },
  "blogAgent": {
    "status": "running",
    "error": null,
    "lastStarted": "2024-12-07T18:00:00.000Z"
  }
}
```

### View Logs
Logs include detailed error context:
```
📰 Attempting NewsAPI.org...
❌ NewsAPI search failed: Network connectivity issue - unable to reach NewsAPI.org
📡 Attempting RSS feeds as fallback...
✅ Successfully fetched 2 articles from https://techcrunch.com/feed/
```

---

## Production Deployment Checklist

- [ ] Set `NEWS_API_KEY` environment variable
- [ ] Set `OPENROUTER_API_KEY` environment variable
- [ ] Verify network access to newsapi.org
- [ ] Verify network access to openrouter.ai
- [ ] Test RSS feed accessibility
- [ ] Review firewall rules for outbound HTTPS
- [ ] Monitor rate limits (NewsAPI free tier: 100/day)
- [ ] Set up alerts for curation failures
- [ ] Review logs after first curation run

---

## Support

If you continue to experience issues:

1. Check the logs for detailed error messages
2. Run the error message test: `node test-error-messages.js`
3. Verify environment variables are set correctly
4. Test network connectivity to external services
5. Review this troubleshooting guide
6. Contact support with logs and error messages

For more information, see:
- [Content Curation System Documentation](../CONTENT_CURATION_SYSTEM.md)
- [Environment Variables Guide](../docs/ENVIRONMENT_VARIABLES.md)
- [Deployment Guide](../DEPLOYMENT_GUIDE.md)
