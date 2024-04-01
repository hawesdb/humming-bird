import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2'
import image from '@rollup/plugin-image'
import copy from 'rollup-plugin-copy'

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
    peerDepsExternal(),
    resolve(),
    commonjs(),
    json(),
    typescript({ useTsconfigDeclarationDir: true }),
    postcss({
      extensions: ['.scss'],
    }),
    image(),
    copy({
      targets: [{ src: 'src/assets/fonts', dest: 'dist/assets' }],
    }),
  ],
}

export default config
