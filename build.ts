import fs from 'fs-extra'
import glob from 'fast-glob'
import { resolve, basename } from 'path'
import { build } from 'vite'
import * as sass from 'sass'

const pkgPath = resolve('./package')
const compPath = resolve(pkgPath, 'src', './components')

start()

async function start() {
  const comps = await glob.async('*.scss', {
    cwd: compPath,
    absolute: true
  })

  // build element-plus resolver
  await build({
    build: {
      outDir: './packages/theme/dist',
      lib: {
        entry: './packages/theme/index.ts',
        formats: ['es', 'cjs'],
        fileName: 'index',
      },
      rollupOptions: {
        external: ['unplugin-vue-components']
      }
    }
  })

  // build element-plus theme
  const result = sass.compile(
    resolve(pkgPath, 'src/base.scss'),
    { style: 'compressed' }
  )

  fs.outputFile(resolve(pkgPath, 'dist/base.css'), result.css)

  Promise.all(
    comps.map(c => {
      const name = basename(c, '.scss')
      const result = sass.compile(c, { style: 'compressed' })
      const filename = name === 'display' ? name : `el-${name}`

      return fs.outputFile(
        resolve(pkgPath, `./dist/styles/${filename}.css`), 
        result.css
      )
    }),
  )
}
