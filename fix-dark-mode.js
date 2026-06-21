const fs = require('fs');
const path = require('path');

const replacements = [
    { regex: /(?<![:a-zA-Z0-9-])bg-white(?!\/|-)/g, replacement: 'bg-white dark:bg-neutral-900' },
    { regex: /(?<![:a-zA-Z0-9-])bg-gray-50\/50/g, replacement: 'bg-gray-50/50 dark:bg-neutral-900/50' },
    { regex: /(?<![:a-zA-Z0-9-])bg-gray-50(?!\/|-)/g, replacement: 'bg-gray-50 dark:bg-neutral-800' },
    { regex: /(?<![:a-zA-Z0-9-])bg-gray-100(?!\/|-)/g, replacement: 'bg-gray-100 dark:bg-neutral-800' },
    { regex: /(?<![:a-zA-Z0-9-])bg-gray-200(?!\/|-)/g, replacement: 'bg-gray-200 dark:bg-neutral-700' },
    
    { regex: /(?<![:a-zA-Z0-9-])text-gray-900/g, replacement: 'text-gray-900 dark:text-gray-100' },
    { regex: /(?<![:a-zA-Z0-9-])text-gray-800/g, replacement: 'text-gray-800 dark:text-gray-200' },
    { regex: /(?<![:a-zA-Z0-9-])text-gray-700/g, replacement: 'text-gray-700 dark:text-gray-300' },
    { regex: /(?<![:a-zA-Z0-9-])text-gray-600/g, replacement: 'text-gray-600 dark:text-gray-400' },
    { regex: /(?<![:a-zA-Z0-9-])text-gray-500/g, replacement: 'text-gray-500 dark:text-gray-400' },
    { regex: /(?<![:a-zA-Z0-9-])text-gray-400/g, replacement: 'text-gray-400 dark:text-gray-500' },
    
    { regex: /(?<![:a-zA-Z0-9-])border-gray-100/g, replacement: 'border-gray-100 dark:border-neutral-800' },
    { regex: /(?<![:a-zA-Z0-9-])border-gray-200/g, replacement: 'border-gray-200 dark:border-neutral-700' },
    { regex: /(?<![:a-zA-Z0-9-])border-gray-300/g, replacement: 'border-gray-300 dark:border-neutral-600' },

    // hover states
    { regex: /hover:bg-white(?!\/|-)/g, replacement: 'hover:bg-white dark:hover:bg-neutral-800' },
    { regex: /hover:bg-gray-50(?!\/|-)/g, replacement: 'hover:bg-gray-50 dark:hover:bg-neutral-800' },
    { regex: /hover:bg-gray-100(?!\/|-)/g, replacement: 'hover:bg-gray-100 dark:hover:bg-neutral-700' },
    { regex: /hover:text-gray-900/g, replacement: 'hover:text-gray-900 dark:hover:text-white' },
    { regex: /hover:text-gray-700/g, replacement: 'hover:text-gray-700 dark:hover:text-gray-200' },
    { regex: /hover:text-gray-600/g, replacement: 'hover:text-gray-600 dark:hover:text-gray-300' },
    { regex: /hover:text-gray-500/g, replacement: 'hover:text-gray-500 dark:hover:text-gray-300' },
    { regex: /hover:border-gray-300/g, replacement: 'hover:border-gray-300 dark:hover:border-neutral-500' },
    
    // focus states
    { regex: /focus:bg-white(?!\/|-)/g, replacement: 'focus:bg-white dark:focus:bg-neutral-900' },
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('dark:bg-neutral-900') && content.includes('dark:border-neutral-700')) {
        return; // likely already processed
    }
    
    let newContent = content;
    for (const {regex, replacement} of replacements) {
        newContent = newContent.replace(regex, replacement);
    }
    
    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log('Updated:', filePath);
    }
}

function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

walkDir('e:/my projects/blogs/app/admin');
walkDir('e:/my projects/blogs/components/Admin');
