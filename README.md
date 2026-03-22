# MapFlow Node.js SDK

**Official Node.js & TypeScript SDK for [MapFlow](https://mapflow.co) — Route Optimization & Delivery Management API**

[![npm version](https://img.shields.io/npm/v/mapflow-co-sdk.svg)](https://www.npmjs.com/package/mapflow-co-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D16-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![API Docs](https://img.shields.io/badge/API-Docs-blue.svg)](https://mapflow.readme.io/reference)

MapFlow is a SaaS platform for **route optimization**, **delivery planning**, and **logistics management**. This SDK gives JavaScript and TypeScript developers full programmatic access to the MapFlow API — manage customers, warehouses, drivers, vehicles, delivery schedules, and hierarchical product structures from your own applications.

→ **Website**: https://mapflow.co  
→ **API Documentation**: https://mapflow.readme.io/reference  
→ **Get your API key**: app.mapflow.co → Settings → API Keys  
→ **Python SDK**: https://github.com/mapflow-co/python-sdk

---

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Authentication](#authentication)
- [Core Resources](#core-resources)
  - [Customers](#customers)
  - [Delivery Locations](#delivery-locations)
  - [Warehouses](#warehouses)
  - [Drivers & Pickers](#drivers--pickers)
  - [Vehicles](#vehicles)
  - [Product Catalog](#product-catalog)
  - [Visits & Scheduling](#visits--scheduling)
  - [Visit Products](#visit-products)
  - [Contacts](#contacts)
  - [Opening Hours](#opening-hours)
  - [Tags](#tags)
  - [Global Customer](#global-customer-atomic-creation)
- [Pagination](#pagination)
- [Bulk Operations](#bulk-operations)
- [Error Handling](#error-handling)
- [TypeScript Support](#typescript-support)
- [Examples](#examples)
- [Support](#support)

---

## Features

- **Full API coverage** — customers, locations, warehouses, drivers, vehicles, catalog, visits, tags, contacts, and opening hours
- **TypeScript first** — complete type definitions with full IntelliSense and autocompletion
- **Promise-based** — modern async/await throughout
- **Typed errors** — `AuthenticationError`, `NotFoundError`, `ValidationError`, `RateLimitError`, and more
- **Paginated responses** — generic `PaginatedResponse<T>` with automatic deserialization
- **Bulk operations** — activate, deactivate, update, tag multiple records in one request
- **Flexible input** — pass typed objects or plain records to any write method
- **Zero bloat** — only `axios` as a runtime dependency
- **Node.js ≥ 16** compatible

---

## Requirements

- Node.js ≥ 16.0.0
- `axios` ≥ 1.6.0 (installed automatically)

---

## Installation

```bash
npm install mapflow-co-sdk
```

```bash
yarn add mapflow-co-sdk
```

```bash
pnpm add mapflow-co-sdk
```

---

## Quick Start

```typescript
import { MapFlowClient, CustomerType, VisitType } from 'mapflow-co-sdk';

const client = new MapFlowClient({ apiKey: 'your-api-key' });

// Create a customer
const customer = await client.createCustomer({
  customer_type: CustomerType.COMPANY,
  company_name: 'Acme Corp',
  email: 'contact@acme.com',
  billing_address: '42 Rue de la Paix',
  billing_zip_code: '75001',
  billing_city: 'Paris',
  billing_country: 'FR',
});

// Create a delivery location
const location = await client.createDeliveryLocation({
  customer: customer.id,
  name: 'Main Office',
  address: '42 Rue de la Paix',
  zip_code: '75001',
  city: 'Paris',
  country: 'FR',
  latitude: 48.8566,
  longitude: 2.3522,
});

// Schedule a delivery visit
const visit = await client.createVisit({
  location: location.id,
  visit_type: VisitType.DELIVERY,
  visit_date: '2026-04-01',
  planned_arrival_time: new Date('2026-04-01T09:00:00').toISOString(),
  notes: 'Ring bell at entrance',
});

console.log(`Visit scheduled: ${visit.id}`);
```

---

## Authentication

All requests require an API key sent as the `X-API-Key` header. Get your key from [app.mapflow.co](https://app.mapflow.co) → Settings → API Keys.

```typescript
const client = new MapFlowClient({
  apiKey: 'your-api-key',               // required
  baseUrl: 'https://api.mapflow.co',    // optional — default shown
  timeout: 30000,                        // optional — milliseconds
});
```

Use environment variables for security:

```typescript
const client = new MapFlowClient({
  apiKey: process.env.MAPFLOW_API_KEY!,
  baseUrl: process.env.MAPFLOW_BASE_URL,
});
```

```bash
# .env
MAPFLOW_API_KEY=your-api-key-here
```

---

## Core Resources

### Customers

Manage individual and business customers including billing details, VAT numbers, and SIRET.

```typescript
import { MapFlowClient, CustomerType } from 'mapflow-co-sdk';

const client = new MapFlowClient({ apiKey: 'your-api-key' });

// Create
const customer = await client.createCustomer({
  customer_type: CustomerType.COMPANY,
  company_name: 'Acme Corporation',
  email: 'contact@acme.com',
  phone: '+33123456789',
  billing_address: '123 Rue de la Paix',
  billing_zip_code: '75001',
  billing_city: 'Paris',
  billing_country: 'FR',
});

// List with filters
const customers = await client.listCustomers({
  is_active: true,
  customer_type: 'company',
});
for (const c of customers.results) {
  console.log(c.display_name, c.email);
}

// Read / Update / Delete
const found = await client.getCustomer(customer.id);
await client.patchCustomer(customer.id, { notes: 'VIP client' });
await client.deleteCustomer(customer.id);
```

### Delivery Locations

Physical addresses where deliveries or pickups take place, with geolocation and access constraints.

```typescript
const location = await client.createDeliveryLocation({
  customer: customer.id,
  name: 'Main Warehouse',
  address: '456 Avenue des Champs',
  zip_code: '75008',
  city: 'Paris',
  country: 'FR',
  latitude: 48.8566,
  longitude: 2.3522,
  delivery_instructions: 'Loading dock on the left',
  access_code: '1234',
});

const locations = await client.listDeliveryLocations({ city: 'Paris' });
```

### Warehouses

Operational bases for your fleet — supports start/end points, loading docks, and multi-vehicle assignment.

```typescript
import { WarehouseType } from 'mapflow-co-sdk';

const warehouse = await client.createWarehouse({
  name: 'Paris Nord Hub',
  code: 'PARIS-01',
  warehouse_type: WarehouseType.HUB,
  address: '12 Rue Industrielle',
  zip_code: '93200',
  city: 'Saint-Denis',
  latitude: 48.9356,
  longitude: 2.3539,
  opening_time: '08:00:00',
  closing_time: '18:00:00',
  is_start_point: true,
  is_end_point: true,
  max_vehicles: 50,
});

await client.setDefaultWarehouse(warehouse.id);
```

### Drivers & Pickers

Manage drivers and warehouse order pickers with licence types, certifications, and vehicle capabilities.

```typescript
import { UserRole, DriverLicenceType, VehicleType, Language } from 'mapflow-co-sdk';

const driver = await client.createDriver({
  email: 'driver@example.com',
  first_name: 'Jean',
  last_name: 'Dupont',
  phone: '+33612345678',
  role: UserRole.DRIVER,
  language: Language.FR,
  has_valid_driving_license: true,
  driver_licence_type: [DriverLicenceType.B, DriverLicenceType.C],
  vehicle_types: [VehicleType.VAN_MEDIUM],
});

await client.patchDriver(driver.id, { employee_id: 'EMP-001' });
```

### Vehicles

Fleet management including capacity, fuel type, maintenance status, and GPS tracking.

```typescript
import { VehicleType, EnergyType } from 'mapflow-co-sdk';

const vehicle = await client.createVehicle({
  name: 'Van 01',
  license_plate: 'AB-123-CD',
  vehicle_type: VehicleType.VAN_MEDIUM,
  brand: 'Renault',
  model: 'Master',
  year: 2023,
  energy_type: EnergyType.DIESEL,
  max_weight_kg: 1500,
  max_volume_m3: 12.0,
  assigned_warehouses: [warehouse.id],
});
```

### Product Catalog

Define products, services, packages, and pallets with weight, volume, pricing, and temperature constraints.

```typescript
import { ItemType, WeightUnit, VolumeUnit } from 'mapflow-co-sdk';

const product = await client.createDeliveryItem({
  name: 'Laptop Pro 16',
  reference: 'PROD-001',
  item_type: ItemType.PRODUCT,
  weight: 2.1,
  weight_unit: WeightUnit.KG,
  length: 36,
  width: 25,
  height: 2,
  selling_price: 2499.00,
  currency: 'EUR',
  is_fragile: true,
});

const fragile = await client.listDeliveryItems({
  item_type: ItemType.PRODUCT,
  is_fragile: true,
});
```

### Visits & Scheduling

Schedule delivery, pickup, or service stops at delivery locations with driver and vehicle assignment.

```typescript
import { VisitType } from 'mapflow-co-sdk';

const visit = await client.createVisit({
  location: location.id,
  visit_type: VisitType.DELIVERY,
  visit_date: '2026-04-01',
  planned_arrival_time: '2026-04-01T09:00:00.000Z',
  planned_departure_time: '2026-04-01T10:00:00.000Z',
  driver: driver.id,
  vehicle: vehicle.id,
  priority: 3,
  notes: 'Ring bell at entrance',
  tags: [tagId],
  products: [{ product: product.id, quantity: 3 }],
});

const visits = await client.listVisits({
  visit_date: '2026-04-01',
  visit_type: 'delivery',
});
```

### Visit Products

Link catalog items to a scheduled visit with quantities.

```typescript
const visitProduct = await client.createVisitProduct({
  visit: visit.id,
  product: product.id,
  quantity: 3,
});

await client.patchVisitProduct(visitProduct.id, { quantity: 5 });
```

### Contacts

Manage contacts linked to delivery locations.

```typescript
const contact = await client.createContact({
  first_name: 'Marie',
  last_name: 'Martin',
  position: 'Logistics Manager',
  emails: ['marie@techsolutions.fr'],
  phones: ['+33987654321'],
  is_primary: true,
  location_ids: [location.id],
});
```

### Opening Hours

Define opening and closing times per day of week for delivery locations.

```typescript
import { DayOfWeek } from 'mapflow-co-sdk';

const hours = await client.createOpeningHours({
  location: location.id,
  day_of_week: DayOfWeek.MONDAY,
  opening_time: '09:00:00',
  closing_time: '18:00:00',
  is_closed: false,
});
```

### Tags

Color-coded labels for visits, drivers, and customers.

```typescript
const tag = await client.createTag({
  name: 'Urgent',
  color: '#FF0000',
  description: 'Priority deliveries',
});

await client.customerBulkAction({
  action: 'add_tags',
  customer_ids: [c1.id, c2.id],
  tag_ids: [tag.id],
});
```

### Global Customer (Atomic Creation)

Create a customer, delivery location, contact, and opening hours in a single atomic request.

```typescript
import { CustomerType, DayOfWeek } from 'mapflow-co-sdk';

const globalCustomer = await client.createGlobalCustomer({
  customer_type: CustomerType.COMPANY,
  company_name: 'Tech Solutions SARL',
  email: 'contact@techsolutions.fr',
  delivery_location: {
    name: 'Head Office',
    address: '10 Rue de la Tech',
    zip_code: '69001',
    city: 'Lyon',
    country: 'FR',
  },
  contact: {
    first_name: 'Marie',
    last_name: 'Martin',
    position: 'Logistics Manager',
    emails: ['marie@techsolutions.fr'],
    is_primary: true,
  },
  opening_hours: [
    { day_of_week: DayOfWeek.MONDAY, opening_time: '09:00:00', closing_time: '18:00:00' },
    { day_of_week: DayOfWeek.TUESDAY, opening_time: '09:00:00', closing_time: '18:00:00' },
  ],
});
```

---

## Pagination

All list endpoints return a `PaginatedResponse<T>` with full IDE autocomplete on results.

```typescript
const page = await client.listCustomers({ page: 1, page_size: 20 });

console.log(`Total: ${page.count}`);
console.log(`Next: ${page.next}`);

for (const customer of page.results) {
  console.log(customer.display_name);
}

// Iterate all pages with an async generator
async function* allCustomers() {
  let pageNum = 1;
  while (true) {
    const page = await client.listCustomers({ page: pageNum, page_size: 50 });
    yield* page.results;
    if (!page.next) break;
    pageNum++;
  }
}

for await (const customer of allCustomers()) {
  console.log(customer.id);
}
```

---

## Bulk Operations

Most resources support bulk actions to reduce API round-trips.

```typescript
// Activate / deactivate customers
await client.customerBulkAction({ action: 'activate', customer_ids: [id1, id2, id3] });

// Change vehicle status
await client.vehicleBulkAction({ action: 'change_status', vehicle_ids: [v1, v2], new_status: 'maintenance' });

// Bulk tagging
await client.customerBulkAction({ action: 'add_tags', customer_ids: [id1, id2], tag_ids: [tag.id] });

// Bulk product quantity update
await client.visitProductBulkAction({ action: 'update_quantity', visitproduct_ids: [vp1, vp2], new_quantity: 5 });

// Bulk delivery item flags
await client.deliveryItemBulkAction({ action: 'update_fragile', delivery_item_ids: [p1, p2], is_fragile: true });
```

---

## Error Handling

The SDK raises typed exceptions for every HTTP error class.

```typescript
import {
  MapFlowError,
  AuthenticationError,   // 401
  ForbiddenError,        // 403
  NotFoundError,         // 404
  ValidationError,       // 400
  RateLimitError,        // 429
  ServerError,           // 5xx
} from 'mapflow-co-sdk';

try {
  const customer = await client.getCustomer(customerId);
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key — check your credentials at app.mapflow.co → Settings → API Keys');
  } else if (error instanceof NotFoundError) {
    console.error('Customer not found');
  } else if (error instanceof ValidationError) {
    console.error('Validation error:', error.message);
    console.error('Details:', error.response);
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded — slow down requests');
  } else if (error instanceof ServerError) {
    console.error('MapFlow server error — try again later');
  } else if (error instanceof MapFlowError) {
    console.error(`Error ${error.statusCode}: ${error.message}`);
  }
}
```

---

## TypeScript Support

This SDK is written in TypeScript and ships complete type definitions.

```typescript
import type {
  Customer,
  CustomerCreate,
  DeliveryLocation,
  Vehicle,
  Visit,
  PaginatedResponse,
} from 'mapflow-co-sdk';

const data: CustomerCreate = {
  customer_type: CustomerType.COMPANY,
  company_name: 'Example Corp',
  billing_city: 'Paris',
  billing_country: 'FR',
};

const page: PaginatedResponse<Customer> = await client.listCustomers();
```

### Enums Reference

| Enum | Values |
|------|--------|
| `CustomerType` | `individual`, `company` |
| `ItemType` | `PRODUCT`, `SERVICE`, `PACKAGE`, `PALLET` |
| `VisitType` | `delivery`, `pickup`, `service`, `delivery_pickup` |
| `VehicleType` | `bicycle`, `cargo_bike`, `motorcycle`, `van_small`, `van_medium`, `van_large`, `truck_small`, `truck_medium`, `truck_large`, `semi_trailer`, `refrigerated`, … |
| `VehicleStatus` | `available`, `in_use`, `maintenance`, `broken`, `retired` |
| `EnergyType` | `gasoline`, `diesel`, `electric`, `hybrid`, `hydrogen` |
| `DriverLicenceType` | `B`, `C`, `CE`, `C1`, `C1E`, `D`, `DE` |
| `WarehouseType` | `distribution`, `storage`, `hub`, `pickup`, `cross_dock`, `other` |
| `WeightUnit` | `kg`, `g`, `lb`, `oz`, `t` |
| `VolumeUnit` | `m3`, `l`, `ml`, `cm3`, `ft3`, `gal` |
| `DayOfWeek` | `MONDAY` (0) … `SUNDAY` (6) |
| `Language` | `fr`, `en`, `es`, `de`, `it` |
| `UserRole` | `admin`, `manager`, `operator`, `driver` |

---

## Examples

The `examples/` directory contains ready-to-run scripts:

```bash
export MAPFLOW_API_KEY="your-api-key"
npx ts-node examples/basic-usage.ts
```

---

## API Reference — Client Methods

### Customers
`listCustomers(params?)` · `createCustomer(data)` · `getCustomer(id)` · `updateCustomer(id, data)` · `patchCustomer(id, data)` · `deleteCustomer(id)` · `customerBulkAction(action)`

### Delivery Locations
`listDeliveryLocations(params?)` · `createDeliveryLocation(data)` · `getDeliveryLocation(id)` · `updateDeliveryLocation(id, data)` · `patchDeliveryLocation(id, data)` · `deleteDeliveryLocation(id)` · `deliveryLocationBulkAction(action)`

### Warehouses
`listWarehouses(params?)` · `createWarehouse(data)` · `getWarehouse(id)` · `updateWarehouse(id, data)` · `patchWarehouse(id, data)` · `deleteWarehouse(id)` · `setDefaultWarehouse(id)` · `warehouseBulkAction(action)`

### Drivers & Pickers
`listDrivers(params?)` · `createDriver(data)` · `getDriver(id)` · `updateDriver(id, data)` · `patchDriver(id, data)` · `deleteDriver(id)`

### Vehicles
`listVehicles(params?)` · `createVehicle(data)` · `getVehicle(id)` · `updateVehicle(id, data)` · `patchVehicle(id, data)` · `deleteVehicle(id)` · `vehicleBulkAction(action)`

### Product Catalog
`listDeliveryItems(params?)` · `createDeliveryItem(data)` · `getDeliveryItem(id)` · `updateDeliveryItem(id, data)` · `patchDeliveryItem(id, data)` · `deleteDeliveryItem(id)` · `deliveryItemBulkAction(action)`

### Visits
`listVisits(params?)` · `createVisit(data)` · `getVisit(id)` · `updateVisit(id, data)` · `patchVisit(id, data)` · `deleteVisit(id)` · `visitBulkAction(action)`

### Visit Products
`listVisitProducts(params?)` · `createVisitProduct(data)` · `getVisitProduct(id)` · `updateVisitProduct(id, data)` · `patchVisitProduct(id, data)` · `deleteVisitProduct(id)` · `visitProductBulkAction(action)`

### Tags
`listTags(params?)` · `createTag(data)` · `getTag(id)` · `updateTag(id, data)` · `patchTag(id, data)` · `deleteTag(id)` · `tagBulkAction(action)`

### Contacts
`listContacts(params?)` · `createContact(data)` · `getContact(id)` · `updateContact(id, data)` · `patchContact(id, data)` · `deleteContact(id)`

### Opening Hours
`listOpeningHours(params?)` · `createOpeningHours(data)` · `getOpeningHours(id)` · `updateOpeningHours(id, data)` · `patchOpeningHours(id, data)` · `deleteOpeningHours(id)`

### Global Customer
`createGlobalCustomer(data)` — atomic creation of customer + location + contact + hours

---

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run build:watch

# Run tests
npm test

# Lint & format
npm run lint
npm run format
```

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and pull request process.

---

## Support

- **Website**: https://mapflow.co
- **API Documentation**: https://mapflow.readme.io/reference
- **Email**: support@mapflow.co
- **GitHub Issues**: https://github.com/mapflow-co/node-sdk/issues

---

## Related SDKs

- **Python SDK**: https://github.com/mapflow-co/python-sdk — `pip install mapflow-co-sdk`
- **Node.js SDK**: https://github.com/mapflow-co/node-sdk — `npm install mapflow-co-sdk`

---

## License

MIT © [MapFlow](https://mapflow.co)
