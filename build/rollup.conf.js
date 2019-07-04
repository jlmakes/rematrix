import buble from 'rollup-plugin-buble'
import { standard as banner } from './rollup.conf.banner'

export default {
  input: 'src/index.js',
  plugins: [buble()],
  output: [
    { banner, file: 'dist/rematrix.js', format: 'umd', name: 'Rematrix' },
    { banner, file: 'dist/rematrix.es.js', format: 'es' },
  ],
}
