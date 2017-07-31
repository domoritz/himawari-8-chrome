import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/main.ts',
  format: 'iife',
  dest: 'bundle.js',
  sourceMap: true,
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true
    }),
    typescript({
      tsconfig: "tsconfig.json"
    }),
    uglify()
  ]
};
