import buble from 'rollup-plugin-buble'
import banner from './rollup.conf.banner'

export default {
	banner,
	entry: 'src/index.js',
	plugins: [
		buble(),
	],
	targets: [
		{ dest: 'dist/rematrix.js', format: 'umd', moduleName: 'Rematrix' },
		{ dest: 'dist/rematrix.es.js', format: 'es' },
	],
}
