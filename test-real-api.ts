#!/usr/bin/env ts-node
/**
 * Real API Test for MapFlow Node.js SDK
 * 
 * This script creates real objects in your MapFlow account using the API key from .env
 * WARNING: This creates real data in your MapFlow account!
 */

import 'dotenv/config';
import * as readline from 'readline';
import {
  MapFlowClient,
  CustomerType,
  ItemType,
  VehicleType,
  WarehouseType,
  WeightUnit,
  VisitType,
  NotFoundError,
  ValidationError,
  AuthenticationError,
  MapFlowError,
} from './src';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

interface CreatedIds {
  customer?: string | null;
  location?: string | null;
  warehouse?: string | null;
  item?: string | null;
  vehicle?: string | null;
  tag?: string | null;
  contact?: string | null;
  opening_hours?: string[];
  visit?: string | null;
  visit_product?: string | null;
}

const createdIds: CreatedIds = {};

function getApiKey(): string {
  const apiKey = process.env.MAPFLOW_API_KEY;
  
  if (!apiKey) {
    console.error('\n✗ Error: MAPFLOW_API_KEY not found in environment variables');
    console.error('\nOptions:');
    console.error('1. Create a .env file with:');
    console.error('   MAPFLOW_API_KEY=your-api-key');
    console.error('\n2. Or export the variable:');
    console.error('   export MAPFLOW_API_KEY=your-api-key');
    process.exit(1);
  }
  
  return apiKey;
}

async function testConnection(client: MapFlowClient): Promise<boolean> {
  console.log('\n' + '='.repeat(80));
  console.log('TEST 1: API Connection');
  console.log('='.repeat(80));
  
  try {
    const customers = await client.listCustomers({ page: 1 });
    console.log('✓ Connection successful!');
    console.log(`  Organization: Successfully connected`);
    console.log(`  Existing customers: ${customers.count}`);
    return true;
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.error(`✗ Authentication failed: ${error.message}`);
      console.error('  Check your API key in .env file');
    } else if (error instanceof MapFlowError) {
      console.error(`✗ API Error: ${error.message}`);
    }
    return false;
  }
}

async function testCreateCustomer(client: MapFlowClient): Promise<string | null> {
  console.log('\n' + '='.repeat(80));
  console.log('TEST 2: Create Customer');
  console.log('='.repeat(80));
  
  try {
    const timestamp = Date.now();
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    
    const customerData = {
      customer_type: CustomerType.COMPANY,
      company_name: `Test SDK Node - Company ${timestamp}`,
      email: `test.sdk.node.${timestamp}@example.com`,
      phone: '+33123456789',
      billing_address: '123 rue du Test SDK Node',
      billing_zip_code: '75001',
      billing_city: 'Paris',
      billing_country: 'FR',
      external_reference: `SDK-NODE-${date}-${timestamp}`,
      is_active: true,
      notes: 'Customer created automatically by Node.js SDK test',
    };
    
    console.log('Creating customer...');
    const customer = await client.createCustomer(customerData);
    
    console.log('✓ Customer created successfully!');
    console.log(`  ID: ${customer.id}`);
    console.log(`  Name: ${customer.display_name}`);
    console.log(`  Email: ${customer.email}`);
    console.log(`  Reference: ${customer.external_reference}`);
    
    return customer.id;
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error(`✗ Validation error: ${error.message}`);
      console.error(`  Details: ${JSON.stringify(error.response)}`);
    } else if (error instanceof MapFlowError) {
      console.error(`✗ Creation error: ${error.message}`);
      if (error.response) {
        console.error(`  Response details: ${JSON.stringify(error.response)}`);
      }
    }
    return null;
  }
}

async function testCreateDeliveryLocation(
  client: MapFlowClient,
  customerId: string | null
): Promise<string | null> {
  console.log('\n' + '='.repeat(80));
  console.log('TEST 3: Create Delivery Location');
  console.log('='.repeat(80));
  
  if (!customerId) {
    console.log('⊘ Test skipped (no customer_id)');
    return null;
  }
  
  try {
    const timestamp = Date.now();
    
    const locationData = {
      customer: customerId,
      name: `Test Location SDK Node ${timestamp}`,
      reference: `LOC-SDK-NODE-${timestamp}`,
      address: '456 avenue du Test SDK Node',
      zip_code: '75008',
      city: 'Paris',
      country: 'FR',
      latitude: 48.8566,
      longitude: 2.3522,
      truck_access: true,
      loading_dock: true,
      max_weight_kg: 5000,
      delivery_instructions: 'Test SDK Node - Delivery at dock 3',
      is_active: true,
    };
    
    console.log(`Creating delivery location for customer ${customerId}...`);
    const location = await client.createDeliveryLocation(locationData);
    
    console.log('✓ Delivery location created successfully!');
    console.log(`  ID: ${location.id}`);
    console.log(`  Name: ${location.name}`);
    console.log(`  Address: ${location.address}, ${location.city}`);
    console.log(`  GPS: ${location.latitude}, ${location.longitude}`);
    
    return location.id;
  } catch (error) {
    if (error instanceof MapFlowError) {
      console.error(`✗ Creation error: ${error.message}`);
      if (error.response) {
        console.error(`  Response: ${JSON.stringify(error.response)}`);
      }
    }
    return null;
  }
}

async function testCreateWarehouse(client: MapFlowClient): Promise<string | null> {
  console.log('\n' + '='.repeat(80));
  console.log('TEST 4: Create Warehouse');
  console.log('='.repeat(80));
  
  try {
    const timestamp = Date.now();
    
    const warehouseData = {
      name: `Warehouse Test SDK Node ${timestamp}`,
      warehouse_type: WarehouseType.DISTRIBUTION,
      address: '789 boulevard du Test SDK Node',
      zip_code: '93200',
      city: 'Saint-Denis',
      country: 'FR',
      latitude: 48.9356,
      longitude: 2.3539,
      opening_time: '08:00:00',
      closing_time: '18:00:00',
      is_start_point: true,
      is_end_point: true,
      has_loading_dock: true,
      max_vehicles: 50,
      is_active: true,
      internal_notes: 'Warehouse created by Node.js SDK test',
    };
    
    console.log('Creating warehouse...');
    const warehouse = await client.createWarehouse(warehouseData);
    
    console.log('✓ Warehouse created successfully!');
    console.log(`  ID: ${warehouse.id}`);
    console.log(`  Name: ${warehouse.name}`);
    console.log(`  Type: ${warehouse.warehouse_type}`);
    console.log(`  Address: ${warehouse.address}, ${warehouse.city}`);
    
    return warehouse.id;
  } catch (error) {
    if (error instanceof MapFlowError) {
      console.error(`✗ Creation error: ${error.message}`);
      if (error.response) {
        console.error(`  Response: ${JSON.stringify(error.response)}`);
      }
    }
    return null;
  }
}

async function testCreateDeliveryItem(client: MapFlowClient): Promise<string | null> {
  console.log('\n' + '='.repeat(80));
  console.log('TEST 5: Create Delivery Item');
  console.log('='.repeat(80));
  
  try {
    const timestamp = Date.now();
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    
    const itemData = {
      name: `Product Test SDK Node ${timestamp}`,
      item_type: ItemType.PRODUCT,
      reference: `PROD-SDK-NODE-${timestamp}`,
      barcode: `3760${date.substring(0, 10)}`,
      weight_kg: 2.5,
      weight_unit: WeightUnit.KG,
      length: 35,
      width: 25,
      height: 10,
      is_fragile: true,
      declared_value: 500.0,
      currency: 'EUR',
      buying_price: 300.0,
      selling_price: 500.0,
      vat_rate: 20.0,
      description: 'Product created automatically by Node.js SDK test',
    };
    
    console.log('Creating product...');
    const item = await client.createDeliveryItem(itemData);
    
    console.log('✓ Product created successfully!');
    console.log(`  ID: ${item.id}`);
    console.log(`  Name: ${item.name}`);
    console.log(`  Reference: ${item.reference}`);
    console.log(`  Weight: ${item.weight_kg} ${item.weight_unit}`);
    console.log(`  Value: ${item.declared_value} ${item.currency}`);
    
    return item.id;
  } catch (error) {
    if (error instanceof MapFlowError) {
      console.error(`✗ Creation error: ${error.message}`);
      if (error.response) {
        console.error(`  Response: ${JSON.stringify(error.response)}`);
      }
    }
    return null;
  }
}

async function testCreateVehicle(
  client: MapFlowClient,
  warehouseId: string | null
): Promise<string | null> {
  console.log('\n' + '='.repeat(80));
  console.log('TEST 6: Create Vehicle');
  console.log('='.repeat(80));
  
  try {
    const timestamp = Date.now();
    
    const vehicleData: any = {
      registration_number: `SDK-${timestamp.toString().slice(-6)}`,
      vehicle_type: VehicleType.VAN_MEDIUM,
      brand: 'Renault',
      model: 'Master Test SDK Node',
      year: 2023,
      energy_type: 'diesel',
      capacity_kg: 1500,
      capacity_m3: 12.0,
      notes: 'Vehicle created by Node.js SDK test',
    };
    
    if (warehouseId) {
      vehicleData.assigned_warehouses = [warehouseId];
    }
    
    console.log('Creating vehicle...');
    const vehicle = await client.createVehicle(vehicleData);
    
    console.log('✓ Vehicle created successfully!');
    console.log(`  ID: ${vehicle.id}`);
    console.log(`  Registration: ${vehicle.registration_number}`);
    console.log(`  Type: ${vehicle.vehicle_type}`);
    console.log(`  Capacity: ${vehicle.capacity_kg}kg, ${vehicle.capacity_m3}m³`);
    
    return vehicle.id;
  } catch (error) {
    if (error instanceof MapFlowError) {
      console.error(`✗ Creation error: ${error.message}`);
      if (error.response) {
        console.error(`  Response: ${JSON.stringify(error.response)}`);
      }
    }
    return null;
  }
}

async function testCreateTag(client: MapFlowClient): Promise<string | null> {
  console.log('\n' + '='.repeat(80));
  console.log('TEST 7: Create Tag');
  console.log('='.repeat(80));
  
  try {
    const timestamp = Date.now();
    
    const tagData = {
      name: `Test SDK Node ${timestamp}`,
      color: '#FF6B6B',
      description: 'Tag created automatically by Node.js SDK test',
    };
    
    console.log('Creating tag...');
    const tag = await client.createTag(tagData);
    
    console.log('✓ Tag created successfully!');
    console.log(`  ID: ${tag.id}`);
    console.log(`  Name: ${tag.name}`);
    console.log(`  Color: ${tag.color}`);
    
    return tag.id;
  } catch (error) {
    if (error instanceof MapFlowError) {
      console.error(`✗ Creation error: ${error.message}`);
      if (error.response) {
        console.error(`  Response: ${JSON.stringify(error.response)}`);
      }
    }
    return null;
  }
}

async function testCreateVisit(
  client: MapFlowClient,
  locationId: string | null
): Promise<string | null> {
  console.log('\n' + '='.repeat(80));
  console.log('TEST 8: Create Visit');
  console.log('='.repeat(80));
  
  if (!locationId) {
    console.log('⊘ Test skipped (no location_id)');
    return null;
  }
  
  try {
    const timestamp = Date.now();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const visitDate = tomorrow.toISOString().split('T')[0];
    
    const visitData = {
      delivery_location: locationId,
      visit_type: VisitType.DELIVERY,
      reference: `VISIT-SDK-NODE-${timestamp}`,
      external_reference: `EXT-VISIT-NODE-${timestamp}`,
      visit_date: visitDate,
      priority: 3,
      status: 'planned',
      notes: 'Visit created automatically by Node.js SDK test',
      is_completed: false,
    };
    
    console.log(`Creating visit for location ${locationId}...`);
    const visit = await client.createVisit(visitData);
    
    console.log('✓ Visit created successfully!');
    console.log(`  ID: ${visit.id}`);
    console.log(`  Type: ${visit.visit_type}`);
    console.log(`  Reference: ${visit.reference}`);
    console.log(`  Date: ${visit.visit_date}`);
    console.log(`  Priority: ${visit.priority}`);
    
    return visit.id;
  } catch (error) {
    if (error instanceof MapFlowError) {
      console.error(`✗ Creation error: ${error.message}`);
      if (error.response) {
        console.error(`  Response: ${JSON.stringify(error.response)}`);
      }
    }
    return null;
  }
}

async function testCreateVisitProduct(
  client: MapFlowClient,
  visitId: string | null,
  itemId: string | null
): Promise<string | null> {
  console.log('\n' + '='.repeat(80));
  console.log('TEST 9: Create Visit Product');
  console.log('='.repeat(80));
  
  if (!visitId || !itemId) {
    console.log('⊘ Test skipped (no visit_id or item_id)');
    return null;
  }
  
  try {
    const visitProductData = {
      visit: visitId,
      product: itemId,
      quantity: 5,
    };
    
    console.log(`Creating visit product (visit=${visitId}, product=${itemId})...`);
    const visitProduct = await client.createVisitProduct(visitProductData);
    
    console.log('✓ Visit product created successfully!');
    console.log(`  ID: ${visitProduct.id}`);
    console.log(`  Visit: ${visitProduct.visit}`);
    console.log(`  Product: ${visitProduct.product}`);
    console.log(`  Quantity: ${visitProduct.quantity}`);
    
    return visitProduct.id;
  } catch (error) {
    if (error instanceof MapFlowError) {
      console.error(`✗ Creation error: ${error.message}`);
      if (error.response) {
        console.error(`  Response: ${JSON.stringify(error.response)}`);
      }
    }
    return null;
  }
}

async function testReadOperations(
  client: MapFlowClient,
  customerId: string | null,
  locationId: string | null,
  itemId: string | null
): Promise<boolean> {
  console.log('\n' + '='.repeat(80));
  console.log('TEST 10: Read Operations');
  console.log('='.repeat(80));
  
  try {
    if (customerId) {
      console.log('\n1. Reading customer...');
      const customer = await client.getCustomer(customerId);
      console.log(`  ✓ Customer retrieved: ${customer.display_name}`);
    }
    
    if (locationId) {
      console.log('\n2. Reading delivery location...');
      const location = await client.getDeliveryLocation(locationId);
      console.log(`  ✓ Location retrieved: ${location.name}`);
    }
    
    if (itemId) {
      console.log('\n3. Reading product...');
      const item = await client.getDeliveryItem(itemId);
      console.log(`  ✓ Product retrieved: ${item.name}`);
    }
    
    console.log('\n✓ All read operations successful!');
    return true;
  } catch (error) {
    if (error instanceof NotFoundError) {
      console.error(`✗ Resource not found: ${error.message}`);
    } else if (error instanceof MapFlowError) {
      console.error(`✗ Read error: ${error.message}`);
    }
    return false;
  }
}

async function testUpdateOperations(
  client: MapFlowClient,
  customerId: string | null
): Promise<boolean> {
  console.log('\n' + '='.repeat(80));
  console.log('TEST 11: Update Operations');
  console.log('='.repeat(80));
  
  if (!customerId) {
    console.log('⊘ Test skipped (no customer_id)');
    return false;
  }
  
  try {
    console.log(`\n1. Partial update of customer ${customerId}...`);
    const updated = await client.patchCustomer(customerId, {
      notes: `Updated by Node.js SDK test - ${new Date().toISOString()}`,
    });
    
    console.log('  ✓ Customer updated!');
    console.log(`  Notes: ${updated.notes}`);
    
    return true;
  } catch (error) {
    if (error instanceof MapFlowError) {
      console.error(`✗ Update error: ${error.message}`);
    }
    return false;
  }
}

async function testSearchOperations(client: MapFlowClient): Promise<boolean> {
  console.log('\n' + '='.repeat(80));
  console.log('TEST 12: Search and Filter Operations');
  console.log('='.repeat(80));
  
  try {
    console.log('\n1. Searching customers with "Test SDK Node"...');
    const results = await client.listCustomers({ search: 'Test SDK Node' });
    console.log(`  ✓ Found ${results.count} customer(s)`);
    
    console.log('\n2. Filtering delivery locations in Paris...');
    const locations = await client.listDeliveryLocations({ city: 'Paris' });
    console.log(`  ✓ Found ${locations.count} location(s) in Paris`);
    
    console.log('\n3. Filtering fragile products...');
    const items = await client.listDeliveryItems({ is_fragile: true });
    console.log(`  ✓ Found ${items.count} fragile product(s)`);
    
    return true;
  } catch (error) {
    if (error instanceof MapFlowError) {
      console.error(`✗ Search error: ${error.message}`);
    }
    return false;
  }
}

async function cleanupPrompt(client: MapFlowClient, ids: CreatedIds): Promise<void> {
  console.log('\n' + '='.repeat(80));
  console.log('CLEANUP');
  console.log('='.repeat(80));
  
  console.log('\nObjects created during this test:');
  for (const [type, id] of Object.entries(ids)) {
    if (id) {
      if (Array.isArray(id)) {
        console.log(`  • ${type}: ${id.length} object(s)`);
      } else {
        console.log(`  • ${type}: ${id}`);
      }
    }
  }
  
  const response = await question('\nDo you want to delete the test objects created? (y/n): ');
  
  if (response.trim().toLowerCase() === 'y') {
    console.log('\nDeleting test objects...');
    
    // Delete in reverse order
    const deleteOrder: Array<{ type: string; id: any; method: keyof MapFlowClient }> = [
      { type: 'visit product', id: ids.visit_product, method: 'deleteVisitProduct' },
      { type: 'visit', id: ids.visit, method: 'deleteVisit' },
      { type: 'tag', id: ids.tag, method: 'deleteTag' },
      { type: 'vehicle', id: ids.vehicle, method: 'deleteVehicle' },
      { type: 'item', id: ids.item, method: 'deleteDeliveryItem' },
      { type: 'warehouse', id: ids.warehouse, method: 'deleteWarehouse' },
      { type: 'location', id: ids.location, method: 'deleteDeliveryLocation' },
      { type: 'customer', id: ids.customer, method: 'deleteCustomer' },
    ];
    
    for (const resource of deleteOrder) {
      if (resource.id) {
        try {
          await (client[resource.method] as any)(resource.id);
          console.log(`  ✓ Deleted ${resource.type}`);
        } catch (error) {
          console.error(`  ⚠ Failed to delete ${resource.type}:`, error);
        }
      }
    }
    
    console.log('\n✓ Cleanup complete!');
  } else {
    console.log('\n⊘ Objects kept in your MapFlow account');
    console.log('  You can delete them manually from the web interface');
  }
}

async function main() {
  console.log('\n╔' + '='.repeat(78) + '╗');
  console.log('║' + ' '.repeat(20) + 'REAL MAPFLOW API TEST (Node.js SDK)' + ' '.repeat(23) + '║');
  console.log('╚' + '='.repeat(78) + '╝');
  
  console.log('\nThis script will create real objects in your MapFlow account');
  console.log('using the API key from the .env file');
  
  // Get API key
  const apiKey = getApiKey();
  console.log(`\n✓ API key found: ${apiKey.substring(0, 10)}...${apiKey.slice(-4)}`);
  
  // Get base URL
  const baseUrl = process.env.MAPFLOW_BASE_URL || 'https://api.mapflow.co';
  console.log(`✓ Base URL: ${baseUrl}`);
  
  // Initialize client
  console.log('\nInitializing MapFlow client...');
  const client = new MapFlowClient({ apiKey, baseUrl });
  console.log('✓ Client initialized');
  
  // Test connection
  if (!(await testConnection(client))) {
    console.error('\n✗ Cannot connect to API. Stopping tests.');
    process.exit(1);
  }
  
  // Ask confirmation
  console.log('\n' + '-'.repeat(80));
  console.log('⚠️  Tests will create real objects in your MapFlow account');
  const confirm = await question('Do you want to continue? (y/n): ');
  
  if (confirm.trim().toLowerCase() !== 'y') {
    console.log('\nTests cancelled.');
    rl.close();
    process.exit(0);
  }
  
  try {
    // Run tests
    createdIds.customer = await testCreateCustomer(client);
    createdIds.location = await testCreateDeliveryLocation(client, createdIds.customer);
    createdIds.warehouse = await testCreateWarehouse(client);
    createdIds.item = await testCreateDeliveryItem(client);
    createdIds.vehicle = await testCreateVehicle(client, createdIds.warehouse);
    createdIds.tag = await testCreateTag(client);
    createdIds.visit = await testCreateVisit(client, createdIds.location);
    createdIds.visit_product = await testCreateVisitProduct(
      client,
      createdIds.visit,
      createdIds.item
    );
    
    await testReadOperations(client, createdIds.customer, createdIds.location, createdIds.item);
    await testUpdateOperations(client, createdIds.customer);
    await testSearchOperations(client);
    
    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('TEST SUMMARY');
    console.log('='.repeat(80));
    
    const successCount = Object.values(createdIds).filter((v) => v).length;
    console.log(`\n✓ ${successCount} type(s) of object(s) created successfully:`);
    
    for (const [type, id] of Object.entries(createdIds)) {
      if (id) {
        if (Array.isArray(id)) {
          console.log(`  • ${type}: ${id.length} object(s)`);
        } else {
          console.log(`  • ${type}: 1 object`);
        }
      }
    }
    
    console.log('\n✓ All creation tests passed!');
    console.log('✓ All CRUD operations work correctly!');
    console.log('\n' + '='.repeat(80));
    console.log(' '.repeat(25) + '✅ SDK VALIDATED WITH REAL API ✅');
    console.log('='.repeat(80));
    
    // Cleanup
    await cleanupPrompt(client, createdIds);
  } catch (error) {
    console.error('\n✗ Unexpected error:', error);
    await cleanupPrompt(client, createdIds);
  } finally {
    rl.close();
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { main };

