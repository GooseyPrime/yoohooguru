# Content Backup Directory

This directory contains automated backups of all YooHoo.guru content including:
- News articles from all subdomains
- Blog posts from all subdomains
- Site statistics and metadata

## Backup System

### Automatic Backups
- **Schedule**: Daily at 2 AM server time
- **Format**: JSON files named `backup-YYYY-MM-DD-timestamp.json`
- **Retention**: Unlimited file backups (Firestore backups retained for 30 days)

### Backup Contents
Each backup file contains:
```json
{
  "timestamp": 1234567890,
  "date": "YYYY-MM-DD",
  "metadata": {
    "totalSubdomains": 28,
    "totalArticles": 140,
    "totalPosts": 28,
    "backupVersion": "1.0.0"
  },
  "subdomains": {
    "cooking": {
      "subdomain": "cooking",
      "news": [...],
      "posts": [...],
      "stats": {...}
    },
    ...
  }
}
```

### Manual Backup
To create a manual backup, use the admin API:
```bash
POST /api/admin/backup/create
Headers: Cookie: yoohoo_admin=1
```

### Restore from Backup
To restore from a backup:
```bash
POST /api/admin/backup/restore
Headers: Cookie: yoohoo_admin=1
Body: { "backupId": "backup-YYYY-MM-DD-timestamp" }
```

### List Backups
To view available backups:
```bash
GET /api/admin/backup/list
Headers: Cookie: yoohoo_admin=1
```

## Disaster Recovery

In case of complete site failure:

1. Locate the most recent backup file in this directory
2. Use the restore API endpoint with the backup ID
3. Or manually import the JSON data into Firestore

## Important Notes

- **Do not delete** backup files unless disk space is critical
- Backups are also stored in Firestore `backups` collection for 30 days
- File backups serve as long-term disaster recovery
- Each backup is a complete snapshot of all content at that point in time
