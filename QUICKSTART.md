# Quick Start - MapFlow Node.js SDK

Get started with the MapFlow Node.js SDK in 5 minutes!

## Installation

```bash
npm install mapflow-co-sdk
```

## Get Your API Key

1. Sign up at [mapflow.co](https://mapflow.co)
2. Navigate to Settings > API Keys
3. Create a new API key
4. Copy your key (keep it secure!)

## First Steps

### 1. Initialize the Client

```typescript
import { MapFlowClient } from 'mapflow-co-sdk';

const client = new MapFlowClient({
  apiKey: 'your-api-key'
});
```

### 2. Create Your First Customer

```typescript
import { CustomerType } from 'mapflow-co-sdk';

const customer = await client.createCustomer({
  customer_type: CustomerType.COMPANY,
  company_name: 'My First Company',
  email: 'contact@company.com',
  billing_city: 'Paris',
  billing_country: 'FR'
});

console.log(`Created: ${customer.display_name}`);
console.log(`ID: ${customer.id}`);
```

### 3. Create a Delivery Location

```typescript
const location = await client.createDeliveryLocation({
  customer: customer.id,
  name: 'Main Office',
  address: '123 Business Street',
  zip_code: '75001',
  city: 'Paris',
  country: 'FR'
});

console.log(`Location created: ${location.name}`);
```

### 4. Create a Warehouse

```typescript
import { WarehouseType } from 'mapflow-co-sdk';

const warehouse = await client.createWarehouse({
  name: 'Main Warehouse',
  warehouse_type: WarehouseType.HUB,
  address: '456 Industrial Ave',
  zip_code: '93100',
  city: 'Montreuil',
  country: 'FR',
  is_start_point: true,
  is_end_point: true,
});
```

### 5. List Your Resources

```typescript
// List customers
const customers = await client.listCustomers();
console.log(`Total customers: ${customers.count}`);

// List with filters
const parisCustomers = await client.listCustomers({
  billing_city: 'Paris',
  is_active: true,
  page_size: 10
});

// Iterate results
parisCustomers.results.forEach(customer => {
  console.log(`- ${customer.display_name}`);
});
```

## TypeScript Support

The SDK is written in TypeScript with full type definitions:

```typescript
import type {
  Customer,
  CustomerCreate,
  DeliveryLocation,
  PaginatedResponse
} from 'mapflow-co-sdk';

// Types are automatically inferred
const customerData: CustomerCreate = {
  customer_type: CustomerType.COMPANY,
  company_name: 'Example Corp',
  billing_city: 'Paris',
  billing_country: 'FR',
};

const customer: Customer = await client.createCustomer(customerData);
```

## Error Handling

```typescript
import {
  NotFoundError,
  ValidationError,
  AuthenticationError
} from 'mapflow-co-sdk';

try {
  const customer = await client.getCustomer('non-existent-id');
} catch (error) {
  if (error instanceof NotFoundError) {
    console.error('Customer not found');
  } else if (error instanceof ValidationError) {
    console.error('Invalid data:', error.response);
  } else if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  }
}
```

## Environment Variables

Create a `.env` file:

```bash
MAPFLOW_API_KEY=your-api-key-here
```

Then use it:

```typescript
import 'dotenv/config';

const client = new MapFlowClient({
  apiKey: process.env.MAPFLOW_API_KEY!
});
```

## Next Steps

- Read the full [README](README.md)
- Check [examples/](examples/) for more code samples
- Browse the [API Reference](README.md#api-reference---client-methods)
- Report issues on [GitHub](https://github.com/mapflow-co/node-sdk/issues)

## Common Use Cases

### Create Complete Customer Setup

```typescript
import { CustomerType, DayOfWeek } from 'mapflow-co-sdk';

// Use Global Customer API for atomic creation
const setup = await client.createGlobalCustomer({
  customer_type: CustomerType.COMPANY,
  company_name: 'Quick Setup Corp',
  email: 'contact@company.com',
  delivery_location: {
    name: 'Main Office',
    address: '123 Street',
    zip_code: '75001',
    city: 'Paris',
    country: 'FR'
  },
  contact: {
    first_name: 'John',
    last_name: 'Doe',
    phones: ['+33123456789'],
    is_primary: true,
  },
  opening_hours: [
    { day_of_week: DayOfWeek.MONDAY, opening_time: '09:00:00', closing_time: '18:00:00' },
  ],
});
```

### Manage Visits

```typescript
import { VisitType } from 'mapflow-co-sdk';

// Create visit
const visit = await client.createVisit({
  location: locationId,
  visit_type: VisitType.DELIVERY,
  visit_date: '2026-04-01',
  priority: 3
});

// Add products to visit
await client.createVisitProduct({
  visit: visit.id,
  product: itemId,
  quantity: 5
});
```

### Search and Filter

```typescript
// Search customers
const results = await client.listCustomers({
  customer_type: CustomerType.COMPANY,
  is_active: true,
});

// Filter fragile items
const fragileItems = await client.listDeliveryItems({
  is_fragile: true,
});
```

## Tips

- Always use TypeScript for better autocompletion
- Use enums instead of string literals
- Handle errors with try/catch
- Store API key in environment variables
- Use pagination for large datasets

## Getting Help

- Email: support@mapflow.co
- API Documentation: https://mapflow.readme.io/reference
- GitHub Issues: https://github.com/mapflow-co/node-sdk/issues

---

**Ready to optimize your routes? Visit [mapflow.co](https://mapflow.co) to get started.**
