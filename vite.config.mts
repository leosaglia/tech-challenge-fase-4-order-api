import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    coverage: {
      exclude: [
        'src/infraestructure/frameworks/prisma/**',
        'src/core/application/interfaces/**',
      ],
      reporter: ['lcovonly', 'html'],
    },
  },
})
