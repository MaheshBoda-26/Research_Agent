import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split vendor libraries into separate chunks
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor';
            if (id.includes('recharts')) return 'charting';
            if (id.includes('three')) return '3d-graphics';
            return 'vendor';
          }

          // Split components by feature
          if (id.includes('/components/animations/')) return 'animations';
          if (id.includes('/components/charts/')) return 'charts';
          if (id.includes('/components/') &&
              (id.includes('FilterBar') ||
               id.includes('KpiStrip') ||
               id.includes('CompanyDrawer') ||
               id.includes('CompareDrawer'))) {
            return 'ui-components';
          }

          if (id.includes('/pages/')) return 'agent-page';
        }
      }
    }
  }
})