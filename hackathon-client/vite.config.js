import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {fileURLToPath} from 'url';
import {dirname, resolve} from 'path';
import tailwindcss from '@tailwindcss/vite'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve:{
    alias:{
      '#': resolve(__dirname, 'src'),
      '#layouts': resolve(__dirname, 'src/layouts'),
      '#components': resolve(__dirname, 'src/components'),
      '#pages': resolve(__dirname, 'src/pages'),
    }
  },
})
