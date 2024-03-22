import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2'

const config = {
  input: 'src/game.tsx',
  output: [
    {
      file: 'dist/game.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/game.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    json(),
    typescript({ useTsconfigDeclarationDir: true }),
    postcss({
      extensions: ['.scss'],
    }),
  ],
}

export default config
