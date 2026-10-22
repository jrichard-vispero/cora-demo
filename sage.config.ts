import { defineConfig } from '@vispero/sage/config'

export default defineConfig({
  // The app's address. Targets given as paths resolve against it.
  baseUrl: 'http://localhost:5173',
  // The pages sage scan scans when the command line names none.
  targets: ['/', '/orders', '/orders/WM-10482', '/customers', '/settings'],
})
