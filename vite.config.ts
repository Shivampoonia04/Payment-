import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    	__VARIABLE_NAME__: JSON.stringify(process.env.VARIABLE_NAME)
    },
    
})
