import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    coverage: {
      enabled: true,
      exclude: [
        'src/infraestructure/database/prisma/**',
        'src/core/application/interfaces/**',
      ],
      reporter: ['lcovonly', 'html'],
      reportsDirectory: './coverage',
    },
  },
})
