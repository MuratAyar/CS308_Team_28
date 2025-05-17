/**
 * URL Migration Script
 * 
 * This script helps update all hardcoded references to http://localhost:5000
 * by replacing them with the appropriate apiUrl() function calls.
 * 
 * To use this script:
 * 1. Make sure you have Node.js installed
 * 2. Run: node update_api_urls.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const searchPattern = 'http://localhost:5000';
const clientDir = path.join(__dirname, 'client');
const configPath = path.join(clientDir, 'src', 'config', 'api.js');

// Check if API config file exists
if (!fs.existsSync(configPath)) {
  console.error('API config file not found. Please create it first.');
  process.exit(1);
}

// Let's do this without relying on grep
// Instead, we'll recursively search through files manually

function findFilesWithPattern(dir, pattern, fileTypes = ['.js', '.jsx']) {
  const filesToUpdate = new Set();
  
  function searchDir(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules
        if (entry.name !== 'node_modules') {
          searchDir(fullPath);
        }
      } else if (entry.isFile() && fileTypes.some(type => entry.name.endsWith(type))) {
        // Read file content and check for the pattern
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes(pattern)) {
            filesToUpdate.add(fullPath);
          }
        } catch (err) {
          console.error(`Error reading file ${fullPath}:`, err);
        }
      }
    }
  }
  
  searchDir(dir);
  return filesToUpdate;
}

// Find all files containing the pattern
console.log(`Searching for files containing "${searchPattern}"...`);
const srcDir = path.join(clientDir, 'src');
const filesToUpdate = findFilesWithPattern(srcDir, searchPattern);

console.log(`Found ${filesToUpdate.size} files with hardcoded URLs`);

// Process each file
for (const filePath of filesToUpdate) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Calculate relative path to config file
    const relativePathToConfig = path.relative(path.dirname(filePath), path.join(clientDir, 'src', 'config')).replace(/\\/g, '/');
    const importPath = relativePathToConfig === '' ? './config/api' : `${relativePathToConfig}/api`;
    
    // Check if import already exists
    if (!content.includes('import { apiUrl }') && !content.includes('import {apiUrl}')) {
      // Add import at the top, after the first import statement
      const importRegex = /(import .* from .*;\n)/;
      const importStatement = `import { apiUrl } from "${importPath}";\n`;
      
      if (importRegex.test(content)) {
        content = content.replace(importRegex, `$1${importStatement}`);
      } else {
        content = `${importStatement}${content}`;
      }
    }
    
    // Replace direct URL references in different contexts
    
    // Regular axios calls
    content = content.replace(
      new RegExp(`${searchPattern}/api/([^"']+)`, 'g'), 
      'apiUrl("/api/$1")'
    );
    
    // Template literal URLs with variables
    content = content.replace(
      new RegExp(`\`${searchPattern}/api/([^$\`]+)\\$\\{([^}]+)\\}([^$\`]*)\``, 'g'),
      'apiUrl(`/api/$1${$2}$3`)'
    );

    // If there was a change, write the file
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

console.log('URL migration completed!');
console.log('Please review the changes and test your app.');
console.log('Some manual fixes may still be required, especially for complex template literals.'); 