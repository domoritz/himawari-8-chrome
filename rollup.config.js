import { rollup } from 'rollup';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/main.js',
  format: 'iife',
  dest: 'bundle.js',
  sourceMap: true,
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true
    }),
    uglify()
  ]
};
