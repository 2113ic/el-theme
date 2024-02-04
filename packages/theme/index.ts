import type { ComponentInfo, ComponentResolver, SideEffectsInfo } from 'unplugin-vue-components'
import { kebabCase } from 'unplugin-vue-components'

interface ElPlusResolverOptions {
  /**
   * import style css or sass with components
   *
   * @default true
   */
  importStyle?: boolean

  /**
   * auto import for directives
   *
   * @default true
   */
  directives?: boolean

  /**
   * exclude component name, if match do not resolve the name
   */
  exclude?: RegExp

  /**
   * a list of component names that have no styles, so resolving their styles file should be prevented
   */
  noStylesComponents?: string[]
}

type ElPlusResolverOptionsResolved =
  Required<Omit<ElPlusResolverOptions, 'exclude'>> &
  Pick<ElPlusResolverOptions, 'exclude'>

const noStylesComponents = ['ElAutoResizer']

export default function ElementPlusResolver(
  options: ElPlusResolverOptions = {},
): ComponentResolver[] {
  let optionsResolved: ElPlusResolverOptionsResolved

  async function resolveOptions() {
    if (optionsResolved) return optionsResolved

    optionsResolved = {
      importStyle: true,
      directives: true,
      exclude: undefined,
      noStylesComponents: options.noStylesComponents || [],
      ...options,
    }
    return optionsResolved
  }

  return [
    {
      type: 'component',
      resolve: async (name: string) => {
        const options = await resolveOptions()

        if ([...options.noStylesComponents, ...noStylesComponents].includes(name))
          return resolveComponent(name, { ...options, importStyle: false })
        else return resolveComponent(name, options)
      },
    },
    {
      type: 'directive',
      resolve: async (name: string) => {
        return resolveDirective(name, await resolveOptions())
      },
    },
  ]
}

function resolveComponent(name: string, options: ElPlusResolverOptionsResolved): ComponentInfo | undefined {
  if (options.exclude && name.match(options.exclude)) return
  if (!name.match(/^El[A-Z]/)) return
  if (name.match(/^ElIcon.+/)) {
    return {
      name: name.replace(/^ElIcon/, ''),
      from: '@element-plus/icons-vue',
    }
  }

  const partialName = kebabCase(name.slice(2)) // ElTableColumn -> table-column

  return {
    name,
    from: `element-plus/es`,
    sideEffects: getSideEffects(partialName, options),
  }
}

function resolveDirective(name: string, options: ElPlusResolverOptionsResolved): ComponentInfo | undefined {
  if (!options.directives) return

  const directives: Record<string, { importName: string, styleName: string }> = {
    Loading: { importName: 'ElLoadingDirective', styleName: 'loading' },
    Popover: { importName: 'ElPopoverDirective', styleName: 'popover' },
    InfiniteScroll: { importName: 'ElInfiniteScroll', styleName: 'infinite-scroll' },
  }

  const directive = directives[name]
  if (!directive) return

  return {
    name: directive.importName,
    from: `element-plus/es`,
    sideEffects: getSideEffects(directive.styleName, options),
  }
}

function getSideEffects(dirname: string, options: ElPlusResolverOptionsResolved): SideEffectsInfo {
  if (!options.importStyle) return
  // return `@icxy/el-theme/c/el-${dirname}.css`
  return `@el-theme/comps/${dirname}/index.js`
}
