/**
 * Integration test with real API
 * 
 * This script tests the SDK with your real MapFlow API key.
 * Set MAPFLOW_API_KEY environment variable before running.
 */

import 'dotenv/config';
import {
  MapFlowClient,
  CustomerType,
  ItemType,
  VehicleType,
  WarehouseType,
  VisitType,
  DayOfWeek,
  NotFoundError,
  ValidationError,
} from '../src';

const apiKey = process.env.MAPFLOW_API_KEY;

if (!apiKey) {
  console.error('❌ MAPFLOW_API_KEY environment variable is required');
  console.error('Set it in .env file or run: MAPFLOW_API_KEY=your-key npm run test:integration');
  process.exit(1);
}

const client = new MapFlowClient({ apiKey });
const createdIds: Record<string, string> = {};

async function testConnection() {
  console.log('\n=== TEST 1: Connection ===\n');
  
  try {
    const customers = await client.listCustomers({ page_size: 1 });
    console.log(`✓ Connected successfully`);
    console.log(`✓ Total customers in account: ${customers.count}`);
    return true;
  } catch (error) {
    console.error('✗ Connection failed:', error);
    return false;
  }
}

async function testCreateCustomer() {
  console.log('\n=== TEST 2: Create Customer ===\n');
  
  try {
    const timestamp = Date.now();
    const customer = await client.createCustomer({
      customer_type: CustomerType.COMPANY,
      company_name: `SDK Test Corp ${timestamp}`,
      email: `test-${timestamp}@example.com`,
      phone: '+33123456789',
      billing_city: 'Paris',
      billing_country: 'FR',
      notes: 'Created by Node.js SDK integration test',
    });
    
    console.log(`✓ Customer created: ${customer.display_name}`);
    console.log(`  ID: ${customer.id}`);
    createdIds.customer = customer.id;
    
    return customer.id;
  } catch (error) {
    console.error('✗ Failed to create customer:', error);
    throw error;
  }
}

async function testCreateLocation(customerId: string) {
  console.log('\n=== TEST 3: Create Delivery Location ===\n');
  
  try {
    const timestamp = Date.now();
    const location = await client.createDeliveryLocation({
      customer: customerId,
      name: `Test Location ${timestamp}`,
      address: '123 Test Street',
      zip_code: '75001',
      city: 'Paris',
      country: 'FR',
      delivery_instructions: 'Created by SDK test',
    });
    
    console.log(`✓ Location created: ${location.name}`);
    console.log(`  ID: ${location.id}`);
    createdIds.location = location.id;
    
    return location.id;
  } catch (error) {
    console.error('✗ Failed to create location:', error);
    throw error;
  }
}

async function testCreateWarehouse() {
  console.log('\n=== TEST 4: Create Warehouse ===\n');
  
  try {
    const timestamp = Date.now();
    const warehouse = await client.createWarehouse({
      name: `Test Warehouse ${timestamp}`,
      warehouse_type: WarehouseType.DISTRIBUTION,
      address: '456 Warehouse Ave',
      zip_code: '93100',
      city: 'Montreuil',
      country: 'FR',
      capacity_m3: 1000,
    });
    
    console.log(`✓ Warehouse created: ${warehouse.name}`);
    console.log(`  ID: ${warehouse.id}`);
    createdIds.warehouse = warehouse.id;
    
    return warehouse.id;
  } catch (error) {
    console.error('✗ Failed to create warehouse:', error);
    throw error;
  }
}

async function testCreateItem() {
  console.log('\n=== TEST 5: Create Delivery Item ===\n');
  
  try {
    const timestamp = Date.now();
    const item = await client.createDeliveryItem({
      name: `Test Product ${timestamp}`,
      item_type: ItemType.PRODUCT,
      reference: `TEST-${timestamp}`,
      weight_kg: 1.5,
      volume_m3: 0.01,
    });
    
    console.log(`✓ Item created: ${item.name}`);
    console.log(`  ID: ${item.id}`);
    createdIds.item = item.id;
    
    return item.id;
  } catch (error) {
    console.error('✗ Failed to create item:', error);
    throw error;
  }
}

async function testCreateVehicle() {
  console.log('\n=== TEST 6: Create Vehicle ===\n');
  
  try {
    const timestamp = Date.now();
    const vehicle = await client.createVehicle({
      registration_number: `SDK-${timestamp}`,
      vehicle_type: VehicleType.VAN_MEDIUM,
      brand: 'Test Brand',
      model: 'Test Model',
    });
    
    console.log(`✓ Vehicle created: ${vehicle.registration_number}`);
    console.log(`  ID: ${vehicle.id}`);
    createdIds.vehicle = vehicle.id;
    
    return vehicle.id;
  } catch (error) {
    console.error('✗ Failed to create vehicle:', error);
    throw error;
  }
}

async function testCreateVisit(locationId: string) {
  console.log('\n=== TEST 7: Create Visit ===\n');
  
  try {
    const timestamp = Date.now();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const visit = await client.createVisit({
      delivery_location: locationId,
      visit_type: VisitType.DELIVERY,
      reference: `SDK-VISIT-${timestamp}`,
      visit_date: tomorrow.toISOString().split('T')[0],
      priority: 3,
    });
    
    console.log(`✓ Visit created: ${visit.reference}`);
    console.log(`  ID: ${visit.id}`);
    createdIds.visit = visit.id;
    
    return visit.id;
  } catch (error) {
    console.error('✗ Failed to create visit:', error);
    throw error;
  }
}

async function testCreateVisitProduct(visitId: string, itemId: string) {
  console.log('\n=== TEST 8: Create Visit Product ===\n');
  
  try {
    const visitProduct = await client.createVisitProduct({
      visit: visitId,
      product: itemId,
      quantity: 5,
    });
    
    console.log(`✓ Visit product created`);
    console.log(`  ID: ${visitProduct.id}`);
    console.log(`  Quantity: ${visitProduct.quantity}`);
    createdIds.visitProduct = visitProduct.id;
    
    return visitProduct.id;
  } catch (error) {
    console.error('✗ Failed to create visit product:', error);
    throw error;
  }
}

async function testUpdate(customerId: string) {
  console.log('\n=== TEST 9: Update Operations ===\n');
  
  try {
    const updated = await client.patchCustomer(customerId, {
      notes: 'Updated by SDK integration test',
    });
    
    console.log(`✓ Customer updated`);
    console.log(`  New notes: ${updated.notes}`);
  } catch (error) {
    console.error('✗ Failed to update customer:', error);
  }
}

async function testList() {
  console.log('\n=== TEST 10: List Operations ===\n');
  
  try {
    const customers = await client.listCustomers({ page_size: 5 });
    console.log(`✓ Listed ${customers.results.length} customers (total: ${customers.count})`);
    
    const locations = await client.listDeliveryLocations({ page_size: 5 });
    console.log(`✓ Listed ${locations.results.length} locations (total: ${locations.count})`);
    
    const items = await client.listDeliveryItems({ page_size: 5 });
    console.log(`✓ Listed ${items.results.length} items (total: ${items.count})`);
  } catch (error) {
    console.error('✗ Failed to list resources:', error);
  }
}

async function cleanup() {
  console.log('\n=== Cleanup ===\n');
  console.log('Would you like to delete the created test resources? (yes/no)');
  
  // For automated testing, skip cleanup prompt
  // In interactive mode, you'd wait for user input here
  
  console.log('Cleaning up created resources...');
  
  const deleteOrder = [
    { type: 'visit product', id: createdIds.visitProduct, method: 'deleteVisitProduct' },
    { type: 'visit', id: createdIds.visit, method: 'deleteVisit' },
    { type: 'vehicle', id: createdIds.vehicle, method: 'deleteVehicle' },
    { type: 'item', id: createdIds.item, method: 'deleteDeliveryItem' },
    { type: 'warehouse', id: createdIds.warehouse, method: 'deleteWarehouse' },
    { type: 'location', id: createdIds.location, method: 'deleteDeliveryLocation' },
    { type: 'customer', id: createdIds.customer, method: 'deleteCustomer' },
  ];
  
  for (const resource of deleteOrder) {
    if (resource.id) {
      try {
        await (client as any)[resource.method](resource.id);
        console.log(`  ✓ Deleted ${resource.type}`);
      } catch (error) {
        console.error(`  ⚠ Failed to delete ${resource.type}:`, error);
      }
    }
  }
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                                                          ║');
  console.log('║         MapFlow Node.js SDK - Integration Test          ║');
  console.log('║                                                          ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  
  try {
    // Test connection
    const connected = await testConnection();
    if (!connected) {
      console.error('\n❌ Failed to connect to API. Check your API key.');
      process.exit(1);
    }
    
    // Create resources
    const customerId = await testCreateCustomer();
    const locationId = await testCreateLocation(customerId);
    const warehouseId = await testCreateWarehouse();
    const itemId = await testCreateItem();
    const vehicleId = await testCreateVehicle();
    const visitId = await testCreateVisit(locationId);
    const visitProductId = await testCreateVisitProduct(visitId, itemId);
    
    // Test operations
    await testUpdate(customerId);
    await testList();
    
    // Summary
    console.log('\n=== Summary ===\n');
    console.log('Created resources:');
    console.log(`  Customer:       ${customerId}`);
    console.log(`  Location:       ${locationId}`);
    console.log(`  Warehouse:      ${warehouseId}`);
    console.log(`  Item:           ${itemId}`);
    console.log(`  Vehicle:        ${vehicleId}`);
    console.log(`  Visit:          ${visitId}`);
    console.log(`  Visit Product:  ${visitProductId}`);
    
    // Cleanup
    await cleanup();
    
    console.log('\n✅ All integration tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Integration test failed:', error);
    
    if (Object.keys(createdIds).length > 0) {
      console.log('\n⚠️  Some resources may need manual cleanup:');
      Object.entries(createdIds).forEach(([type, id]) => {
        console.log(`  ${type}: ${id}`);
      });
    }
    
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { main };

