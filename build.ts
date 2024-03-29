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

  await build({
    build: {
      outDir: './package/dist',
      lib: {
        entry: './package/index.ts',
        formats: ['es', 'cjs'],
        fileName: 'index',
      },
      rollupOptions: {
        external: ['unplugin-vue-components']
      }
    }
  })

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
