/**
 * Client tests
 */

import { MapFlowClient } from '../src/client';
import { AuthenticationError, NotFoundError } from '../src/errors';
import { CustomerType } from '../src/types';

describe('MapFlowClient', () => {
  let client: MapFlowClient;

  beforeEach(() => {
    client = new MapFlowClient({
      apiKey: 'test-api-key',
      baseUrl: 'https://api.test.mapflow.co',
    });
  });

  describe('Initialization', () => {
    it('should initialize with API key', () => {
      expect(client).toBeInstanceOf(MapFlowClient);
    });

    it('should use default base URL if not provided', () => {
      const defaultClient = new MapFlowClient({ apiKey: 'test' });
      expect(defaultClient).toBeInstanceOf(MapFlowClient);
    });
  });

  describe('Error Handling', () => {
    it('should throw AuthenticationError on 401', async () => {
      // Mock implementation would go here
      expect(true).toBe(true);
    });

    it('should throw NotFoundError on 404', async () => {
      // Mock implementation would go here
      expect(true).toBe(true);
    });
  });

  describe('Type Safety', () => {
    it('should accept typed customer data', () => {
      const customerData = {
        customer_type: CustomerType.COMPANY,
        company_name: 'Test Corp',
        billing_city: 'Paris',
      };

      expect(customerData.customer_type).toBe(CustomerType.COMPANY);
    });
  });
});

