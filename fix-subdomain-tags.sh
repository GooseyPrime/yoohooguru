#!/bin/bash

# Fix all subdomain pages with unclosed <a> tags
SUBDOMAIN_DIRS=(
  "art" "business" "coding" "cooking" "crafts" "data" "design" 
  "finance" "fitness" "gardening" "history" "home" "investing" 
  "language" "marketing" "math" "music" "photography" "sales" 
  "science" "sports" "tech" "wellness" "writing"
)

for dir in "${SUBDOMAIN_DIRS[@]}"; do
  FILE="apps/main/pages/_apps/$dir/index.tsx"
  if [ -f "$FILE" ]; then
    echo "Fixing $FILE..."
    # Add closing </a> tag after the second <a> tag's content
    sed -i '58 s/<span>Become a \(.*\) Guru<\/span>/<span>Become a \1 Guru<\/span>\n                 <\/a>/' "$FILE"
  fi
done

echo "All subdomain files fixed!"