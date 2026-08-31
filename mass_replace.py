import os
import re

directory = '/Users/thanhlong/Desktop/duancanhanhoa'

replacements = {
    r'Club Trải Nghiệm': 'PIVO',
    r'CLUB TRẢI NGHIỆM': 'PIVO',
    r'Club trải nghiệm': 'PIVO',
    r'club trải nghiệm': 'pivo',
    r'clubtrainghiem': 'pivo',
    r'ClubTraiNghiem': 'PIVO',
    r'CLUB TRAI NGHIEM': 'PIVO',
    r'Club Trai Nghiem': 'PIVO',
    r'club_trai_nghiem': 'pivo'
}

exclude_dirs = {'.git', 'node_modules', 'vendor', 'storage', '.agents', '.vscode', 'bootstrap'}

changed_files = 0
for root, dirs, files in os.walk(directory):
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    for file in files:
        if not (file.endswith('.jsx') or file.endswith('.js') or file.endswith('.php') or file.endswith('.txt') or file.endswith('.html') or file.endswith('.sh') or file.endswith('.md')):
            continue
            
        filepath = os.path.join(root, file)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            for old, new in replacements.items():
                new_content = new_content.replace(old, new)
                
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
                changed_files += 1
        except Exception as e:
            print(f"Error {filepath}: {e}")

print(f"Total files updated: {changed_files}")
