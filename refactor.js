const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdir(dir, function(err, list) {
        if (err) return callback(err);
        let pending = list.length;
        if (!pending) return callback(null);
        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        if (!--pending) callback(null);
                    });
                } else {
                    if (file.endsWith('.tsx')) {
                        processFile(file);
                    }
                    if (!--pending) callback(null);
                }
            });
        });
    });
}

function processFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Pattern for: export function Name(args) { or export async function Name(args) {
    const namedExportRegex = /export\s+(async\s+)?function\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)\s*\{/g;
    if (namedExportRegex.test(content)) {
        content = content.replace(namedExportRegex, (match, isAsync, name, args) => {
            const asyncPrefix = isAsync ? 'async ' : '';
            return `export const ${name} = ${asyncPrefix}(${args}) => {`;
        });
        modified = true;
    }

    // Pattern for: export default function Name(args) { or export default async function Name(args) {
    const defaultExportRegex = /export\s+default\s+(async\s+)?function\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)\s*\{/g;
    let defaultExportName = null;
    if (defaultExportRegex.test(content)) {
        content = content.replace(defaultExportRegex, (match, isAsync, name, args) => {
            defaultExportName = name;
            const asyncPrefix = isAsync ? 'async ' : '';
            return `const ${name} = ${asyncPrefix}(${args}) => {`;
        });
        modified = true;
    }

    // Pattern for: function Name(args) { (non-exported, if any)
    const normalFuncRegex = /^(?!\s*(?:export|const|let|var)\s+)\s*(async\s+)?function\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)\s*\{/gm;
    if (normalFuncRegex.test(content)) {
        content = content.replace(normalFuncRegex, (match, isAsync, name, args) => {
            const asyncPrefix = isAsync ? 'async ' : '';
            // preserve leading whitespace
            const leadingWhitespace = match.match(/^\s*/)[0];
            return `${leadingWhitespace}const ${name} = ${asyncPrefix}(${args}) => {`;
        });
        modified = true;
    }

    if (modified) {
        if (defaultExportName) {
            content += `\n\nexport default ${defaultExportName};\n`;
        }
        fs.writeFileSync(file, content, 'utf8');
        console.log('Modified:', file);
    }
}

walk(path.join(__dirname, 'src'), (err) => {
    if (err) console.error(err);
    else console.log('Done!');
});
