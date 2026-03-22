/**
 * MapFlow Node.js SDK
 * 
 * Official Node.js/TypeScript SDK for MapFlow route optimization API
 * 
 * @example
 * ```typescript
 * import { MapFlowClient, CustomerType } from '@mapflow/sdk';
 * 
 * const client = new MapFlowClient({ apiKey: 'your-api-key' });
 * 
 * const customers = await client.listCustomers();
 * console.log(`Total customers: ${customers.count}`);
 * ```
 */

// Export main client
export { MapFlowClient } from './client';

// Export error classes
export {
  MapFlowError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
  ForbiddenError,
  ServerError,
  RateLimitError,
} from './errors';

// Export all types and enums
export * from './types';

// Package version
export const VERSION = '1.0.0';

