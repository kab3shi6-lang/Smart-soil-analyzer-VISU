#!/usr/bin/env python3
import os
import json

base_path = r'c:\Users\Akena\OneDrive\Desktop\smart_soil_website'

files_to_read = ['bridge.js', 'advanced-v5.html', 'app-advanced.js']

for filename in files_to_read:
    filepath = os.path.join(base_path, filename)
    print('\n' + '='*100)
    print(f'FILE: {filename}')
    print('='*100 + '\n')
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            print(content)
    except Exception as e:
        print(f'Error reading {filename}: {str(e)}')
    
    print('\n' + '='*100 + '\n')
