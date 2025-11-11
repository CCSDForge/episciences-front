import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from './mocks/handlers'

// Setup MSW server
export const server = setupServer(...handlers)

// Mock environment variables
vi.mock('import.meta', () => ({
  env: {
    VITE_API_ROOT_ENDPOINT: 'http://localhost:3001/api',
    VITE_JOURNAL_RVCODE: 'test-journal',
    VITE_JOURNAL_PRIMARY_COLOR: '#7A020D',
    VITE_JOURNAL_ACCEPTED_LANGUAGES: 'en,fr',
    VITE_JOURNAL_DEFAULT_LANGUAGE: 'en',
  }
}))

// Mock fetch globally
global.fetch = vi.fn()

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    hostname: 'localhost',
  },
  writable: true,
})

// Mock react-helmet-async
vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }: { children: React.ReactNode }) => children,
  HelmetProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Reset handlers after each test
afterEach(() => server.resetHandlers())

// Close server after all tests
afterAll(() => server.close())