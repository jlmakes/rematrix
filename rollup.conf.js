import buble from 'rollup-plugin-buble'
import banner from './rollup.conf.banner'

export default {
	banner,
	input: 'src/index.js',
	plugins: [
		buble(),
	],
	output: [
		{ file: 'dist/rematrix.js', format: 'umd', name: 'Rematrix' },
		{ file: 'dist/rematrix.es.js', format: 'es' },
	],
}
