import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.integration.test.ts'],
    setupFiles: ['./vitest.integration.setup.ts'],
  },
})
