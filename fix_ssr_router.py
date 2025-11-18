#!/usr/bin/env python3
"""
Script to fix NextRouter SSR issues across all pages by implementing the SSR-safe pattern
"""

import os
import re
import sys
from pathlib import Path

def fix_ssr_router_in_file(file_path):
    """Fix SSR router issues in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Check if file already has the SSR-safe pattern
        if 'mounted' in content and 'useState(false)' in content:
            print(f"✓ {file_path} already has SSR-safe pattern")
            return False
        
        # Check if file uses useRouter
        if 'useRouter' not in content:
            return False
        
        # Pattern 1: Add SSR-safe imports and state
        # Find the imports section
        import_pattern = r'(import\s+\{[^}]*useRouter[^}]*\}\s+from\s+[\'"][^\'"]*next/router[\'"])'
        
        if re.search(import_pattern, content):
            # Add useEffect import if not present
            if 'useEffect' not in content:
                content = re.sub(
                    r'(import\s+[^;]+from\s+[\'"][^\'"]*react[\'"];?)',
                    r'\1\nimport { useEffect } from \'react\';',
                    content
                )
            
            # Find the component function
            component_pattern = r'(export\s+default\s+function\s+(\w+)\s*\([^)]*\)\s*\{)'
            
            if re.search(component_pattern, content):
                # Add SSR-safe state after function opening
                content = re.sub(
                    component_pattern,
                    r'\1\n  const [mounted, setMounted] = useState(false);\n\n  // Track when component mounts on client side\n  useEffect(() => {\n    setMounted(true);\n  }, []);',
                    content
                )
                
                # Replace useRouter calls with conditional logic
                # Find and replace the router declaration
                router_decl_pattern = r'\s*const\s+router\s*=\s*useRouter\(\);'
                content = re.sub(router_decl_pattern, '', content)
                
                # Replace router.push calls with conditional logic
                content = re.sub(
                    r'router\.push\(([^)]+)\)',
                    r'if (mounted) { router.push(\1) }',
                    content
                )
                
                # Replace router.back calls with conditional logic
                content = re.sub(
                    r'router\.back\(\)',
                    r'if (mounted) { router.back() }',
                    content
                )
                
                # Replace router.replace calls with conditional logic
                content = re.sub(
                    r'router\.replace\(([^)]+)\)',
                    r'if (mounted) { router.replace(\1) }',
                    content
                )
                
                # Add router declaration inside useEffect or at component level
                # Find a good place to add the router declaration
                if 'useEffect' in content:
                    # Add after the first useEffect
                    content = re.sub(
                        r'(useEffect\(\(\)\s*=>\s*\{\s*setMounted\(true\);\s*\},\s*\[\]);)',
                        r'\1\n  const router = useRouter();',
                        content
                    )
                else:
                    # Add before the return statement
                    content = re.sub(
                        r'(\s+return\s*\()',
                        r'  const router = useRouter();\n\1',
                        content
                    )
        
        # Only write if content changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Fixed {file_path}")
            return True
        else:
            print(f"✓ {file_path} no changes needed")
            return False
            
    except Exception as e:
        print(f"✗ Error fixing {file_path}: {e}")
        return False

def main():
    """Main function to fix all files"""
    pages_dir = Path("apps/main/pages")
    
    if not pages_dir.exists():
        print("❌ Pages directory not found!")
        sys.exit(1)
    
    # Find all .tsx files with useRouter
    files_to_fix = []
    for file_path in pages_dir.rglob("*.tsx"):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                if 'useRouter' in content:
                    files_to_fix.append(file_path)
        except Exception as e:
            print(f"⚠️ Could not read {file_path}: {e}")
    
    print(f"🔧 Found {len(files_to_fix)} files to fix")
    
    fixed_count = 0
    for file_path in files_to_fix:
        if fix_ssr_router_in_file(file_path):
            fixed_count += 1
    
    print(f"\n✅ Successfully fixed {fixed_count} files")
    print(f"📝 Total files processed: {len(files_to_fix)}")

if __name__ == "__main__":
    main()