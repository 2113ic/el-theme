import type { ComponentResolver } from 'unplugin-vue-components';

interface ElPlusResolverOptions {
	/**
	 * import style css or sass with components
	 *
	 * @default true
	 */
	importStyle?: boolean;
	/**
	 * auto import for directives
	 *
	 * @default true
	 */
	directives?: boolean;
	/**
	 * exclude component name, if match do not resolve the name
	 */
	exclude?: RegExp;
	/**
	 * a list of component names that have no styles, so resolving their styles file should be prevented
	 */
	noStylesComponents?: string[];
}

export default function ElementPlusResolver(options?: ElPlusResolverOptions): ComponentResolver[];
export {};
