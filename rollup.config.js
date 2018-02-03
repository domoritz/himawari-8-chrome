import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify';

export default {
  input: 'src/main.ts',
  output: {
    file: 'bundle.js',
    format: 'iife',
    sourcemap: true
  },
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
