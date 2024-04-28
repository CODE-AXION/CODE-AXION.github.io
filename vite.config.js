import { defineConfig } from 'vite'
import postcss from './postcss.config.cjs'
import react from '@vitejs/plugin-react'
// const path = require('path');

// https://vitejs.dev/config/

export default ({ mode }) => {
  return defineConfig({
    define: {
      "process.env.NODE_ENV": `"${mode}"`,
    },
    css: {
      postcss,
    },
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: /^~.+/,
          replacement: (val) => {
            return val.replace(/^~/, "");
          },
        },
      ],
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      }
    } 
  })
}

// export default defineConfig({
//   define: {
//     'process.env': process.env
//   },
//   css: {
//     postcss,
//   },
//   plugins: [react()],
//   resolve: {
//     alias: [
//       {
//         find: /^~.+/,
//         replacement: (val) => {
//           return val.replace(/^~/, "");
//         },
//       },
//     ],
//   },
//   build: {
//     commonjsOptions: {
//       transformMixedEsModules: true,
//     }
//   } 
// })
