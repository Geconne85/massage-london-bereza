import { resolve } from 'path'
import { defineConfig } from 'vite'
import { readdirSync, statSync } from 'fs'

// Recursively find all HTML files, excluding node_modules and admin
function getHtmlEntries(dir, base = '') {
    const entries = {}
    const EXCLUDE = ['node_modules', 'admin', 'dist', '.git', '.vite']
    try {
        const items = readdirSync(dir)
        for (const item of items) {
            if (EXCLUDE.includes(item)) continue
            const fullPath = resolve(dir, item)
            const relPath = base ? `${base}/${item}` : item
            if (statSync(fullPath).isDirectory()) {
                Object.assign(entries, getHtmlEntries(fullPath, relPath))
            } else if (item.endsWith('.html')) {
                const name = relPath.replace(/\.html$/, '').replace(/[\\/]/g, '_')
                entries[name] = fullPath
            }
        }
    } catch (e) { }
    return entries
}

export default defineConfig({
    build: {
        rollupOptions: {
            input: getHtmlEntries(resolve(__dirname, '.'))
        }
    }
})
