/**
 * Basic usage examples for MapFlow SDK
 */

import {
  MapFlowClient,
  CustomerType,
  ItemType,
  VehicleType,
  WarehouseType,
  WeightUnit,
} from '../src';

// Initialize client
const apiKey = process.env.MAPFLOW_API_KEY || 'your-api-key-here';
const client = new MapFlowClient({ apiKey });

async function customerExamples() {
  console.log('\n=== Customer Examples ===\n');

  // Create a company customer
  const customer = await client.createCustomer({
    customer_type: CustomerType.COMPANY,
    company_name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+33123456789',
    billing_address: '123 rue de la Paix',
    billing_zip_code: '75001',
    billing_city: 'Paris',
    billing_country: 'FR',
    notes: 'Premium client',
    is_active: true,
  });

  console.log(`Created customer: ${customer.display_name} (ID: ${customer.id})`);

  // Get customer
  const retrieved = await client.getCustomer(customer.id);
  console.log(`Retrieved: ${retrieved.display_name}`);

  // Update customer
  const updated = await client.patchCustomer(customer.id, {
    notes: 'VIP client - Updated',
  });
  console.log(`Updated notes: ${updated.notes}`);

  // List customers
  const list = await client.listCustomers({
    customer_type: CustomerType.COMPANY,
    page_size: 5,
  });
  console.log(`Total customers: ${list.count}`);

  return customer.id;
}

async function locationExamples(customerId: string) {
  console.log('\n=== Delivery Location Examples ===\n');

  // Create delivery location
  const location = await client.createDeliveryLocation({
    customer: customerId,
    name: 'Paris Office',
    address: '123 rue de Rivoli',
    zip_code: '75001',
    city: 'Paris',
    country: 'FR',
    latitude: 48.8606,
    longitude: 2.3376,
    delivery_instructions: 'Ring doorbell twice',
    access_code: '1234',
    is_active: true,
  });

  console.log(`Created location: ${location.name} (ID: ${location.id})`);

  // List locations for customer
  const locations = await client.listDeliveryLocations({
    customer: customerId,
  });
  console.log(`Customer has ${locations.results.length} location(s)`);

  return location.id;
}

async function warehouseExamples() {
  console.log('\n=== Warehouse Examples ===\n');

  // Create warehouse
  const warehouse = await client.createWarehouse({
    name: 'Main Distribution Center',
    warehouse_type: WarehouseType.MAIN,
    address: '456 Industrial Avenue',
    zip_code: '93100',
    city: 'Montreuil',
    country: 'FR',
    capacity_m3: 5000,
    capacity_pallets: 200,
    is_default: true,
    is_active: true,
  });

  console.log(`Created warehouse: ${warehouse.name} (ID: ${warehouse.id})`);

  // List warehouses
  const warehouses = await client.listWarehouses({ is_active: true });
  console.log(`Total active warehouses: ${warehouses.count}`);

  return warehouse.id;
}

async function deliveryItemExamples() {
  console.log('\n=== Delivery Item Examples ===\n');

  // Create delivery item
  const item = await client.createDeliveryItem({
    name: 'Laptop Computer',
    item_type: ItemType.PRODUCT,
    reference: 'LAPTOP-001',
    barcode: '1234567890123',
    category: 'Electronics',
    weight_kg: 2.5,
    weight_unit: WeightUnit.KG,
    volume_m3: 0.02,
    is_fragile: true,
    declared_value: 1200,
    currency: 'EUR',
    is_active: true,
  });

  console.log(`Created item: ${item.name} (ID: ${item.id})`);

  // Search items
  const items = await client.listDeliveryItems({
    search: 'laptop',
    is_fragile: true,
  });
  console.log(`Found ${items.count} fragile laptop(s)`);

  return item.id;
}

async function vehicleExamples() {
  console.log('\n=== Vehicle Examples ===\n');

  // Create vehicle
  const vehicle = await client.createVehicle({
    registration_number: 'AB-123-CD',
    vehicle_type: VehicleType.VAN_MEDIUM,
    brand: 'Renault',
    model: 'Master',
    year: 2022,
    capacity_kg: 1200,
    capacity_m3: 12,
    is_active: true,
  });

  console.log(`Created vehicle: ${vehicle.registration_number} (ID: ${vehicle.id})`);

  // List vehicles
  const vehicles = await client.listVehicles({
    vehicle_type: VehicleType.VAN_MEDIUM,
  });
  console.log(`Total medium vans: ${vehicles.count}`);

  return vehicle.id;
}

async function tagExamples() {
  console.log('\n=== Tag Examples ===\n');

  // Create tag
  const tag = await client.createTag({
    name: 'Urgent',
    color: '#FF0000',
    description: 'Urgent deliveries',
  });

  console.log(`Created tag: ${tag.name} (ID: ${tag.id})`);

  // List tags
  const tags = await client.listTags();
  console.log(`Total tags: ${tags.count}`);

  return tag.id;
}

// Main execution
async function main() {
  try {
    console.log('MapFlow SDK - Basic Usage Examples');
    console.log('===================================');

    const customerId = await customerExamples();
    const locationId = await locationExamples(customerId);
    const warehouseId = await warehouseExamples();
    const itemId = await deliveryItemExamples();
    const vehicleId = await vehicleExamples();
    const tagId = await tagExamples();

    console.log('\n=== Summary ===\n');
    console.log('Created resources:');
    console.log(`  Customer:   ${customerId}`);
    console.log(`  Location:   ${locationId}`);
    console.log(`  Warehouse:  ${warehouseId}`);
    console.log(`  Item:       ${itemId}`);
    console.log(`  Vehicle:    ${vehicleId}`);
    console.log(`  Tag:        ${tagId}`);

    console.log('\n✅ All examples completed successfully!');
  } catch (error) {
    console.error('\n❌ Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
    }
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { main };

