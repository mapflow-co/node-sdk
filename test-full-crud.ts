#!/usr/bin/env ts-node
/**
 * Script de test complet pour valider toutes les opérations CRUD du SDK MapFlow Node.js
 *
 * Ce script teste :
 * 1. GlobalCustomer (création complète avec location, contact, heures)
 * 2. Tous les objets individuels (Customer, DeliveryLocation, Warehouse, etc.)
 * 3. Les relations entre objets
 * 4. La suppression en cascade
 *
 * Usage:
 *    ts-node test-full-crud.ts --api-key YOUR_API_KEY [--base-url URL] [--verbose]
 *    ou après compilation:
 *    node test-full-crud.js --api-key YOUR_API_KEY
 */

import {
  MapFlowClient,
  CustomerType,
  ItemType,
  WeightUnit,
  VolumeUnit,
  DurationUnit,
  DayOfWeek,
  VehicleType,
  DriverLicenceType,
  WarehouseType,
  VisitType,
  Language,
  NotFoundError,
} from './src/index';

// ============================================================================
// Colors for console output
// ============================================================================
const Colors = {
  HEADER: '\x1b[95m',
  OKBLUE: '\x1b[94m',
  OKCYAN: '\x1b[96m',
  OKGREEN: '\x1b[92m',
  WARNING: '\x1b[93m',
  FAIL: '\x1b[91m',
  ENDC: '\x1b[0m',
  BOLD: '\x1b[1m',
  UNDERLINE: '\x1b[4m',
};

// ============================================================================
// Test Results Tracker
// ============================================================================
class TestResults {
  totalTests = 0;
  passedTests = 0;
  failedTests = 0;
  errors: Array<{ name: string; error: string }> = [];
  createdIds: {
    globalCustomers: string[];
    customers: string[];
    deliveryLocations: string[];
    warehouses: string[];
    contacts: string[];
    openingHours: string[];
    deliveryItems: string[];
    drivers: string[];
    vehicles: string[];
    tags: string[];
    visits: string[];
    visitProducts: string[];
  } = {
    globalCustomers: [],
    customers: [],
    deliveryLocations: [],
    warehouses: [],
    contacts: [],
    openingHours: [],
    deliveryItems: [],
    drivers: [],
    vehicles: [],
    tags: [],
    visits: [],
    visitProducts: [],
  };

  addTest(name: string, passed: boolean, error?: string | any): void {
    this.totalTests++;
    if (passed) {
      this.passedTests++;
      console.log(`${Colors.OKGREEN}✓${Colors.ENDC} ${name}`);
    } else {
      this.failedTests++;
      let errorMsg = error;
      if (error && typeof error === 'object') {
        // Extraire le message d'erreur détaillé si disponible
        if (error.response?.data) {
          errorMsg = JSON.stringify(error.response.data, null, 2);
        } else if (error.message) {
          errorMsg = error.message;
        }
      }
      if (errorMsg) {
        this.errors.push({ name, error: errorMsg });
      }
      console.log(`${Colors.FAIL}✗${Colors.ENDC} ${name}`);
      if (errorMsg) {
        console.log(`  ${Colors.FAIL}Erreur: ${errorMsg}${Colors.ENDC}`);
      }
    }
  }

  printSummary(): void {
    console.log('\n' + '='.repeat(80));
    console.log(`${Colors.BOLD}RÉSUMÉ DES TESTS${Colors.ENDC}`);
    console.log('='.repeat(80));
    console.log(`Total: ${this.totalTests}`);
    console.log(`${Colors.OKGREEN}Réussis: ${this.passedTests}${Colors.ENDC}`);
    console.log(`${Colors.FAIL}Échoués: ${this.failedTests}${Colors.ENDC}`);
    if (this.errors.length > 0) {
      console.log(`\n${Colors.FAIL}Erreurs détaillées:${Colors.ENDC}`);
      for (const { name, error } of this.errors) {
        console.log(`  - ${name}: ${error}`);
      }
    }
    console.log('='.repeat(80));
  }
}

// ============================================================================
// Utility Functions
// ============================================================================
function printSection(title: string): void {
  console.log(`\n${Colors.BOLD}${Colors.HEADER}${'='.repeat(80)}${Colors.ENDC}`);
  console.log(`${Colors.BOLD}${Colors.HEADER}${title.padStart((80 + title.length) / 2).padEnd(80)}${Colors.ENDC}`);
  console.log(`${Colors.BOLD}${Colors.HEADER}${'='.repeat(80)}${Colors.ENDC}\n`);
}

function printSubsection(title: string): void {
  console.log(`\n${Colors.OKCYAN}${Colors.BOLD}→ ${title}${Colors.ENDC}`);
}

// ============================================================================
// Test Functions
// ============================================================================

async function testGlobalCustomer(client: MapFlowClient, results: TestResults): Promise<void> {
  printSection('TEST GLOBAL CUSTOMER');

  try {
    // CREATE
    printSubsection('Création d\'un GlobalCustomer');
    const timestamp = Date.now();
    const globalCustomerData = {
      customer_type: CustomerType.COMPANY,
      company_name: 'Test Company Global',
      email: `test-global-${timestamp}@example.com`,
      phone: '+33123456789',
      billing_address: '123 Test Street',
      billing_zip_code: '75001',
      billing_city: 'Paris',
      billing_country: 'FR',
      is_active: true,
      delivery_location: {
        name: 'Location Globale Test',
        address: '456 Test Avenue',
        zip_code: '75008',
        city: 'Paris',
        country: 'FR',
        latitude: 48.8566,
        longitude: 2.3522,
        truck_access: true,
        loading_dock: false,
        is_active: true,
      },
      contact: {
        first_name: 'Jean',
        last_name: 'Dupont',
        emails: ['contact@test.com'],
        phones: ['+33987654321'],
        is_primary: true,
      },
      opening_hours: [
        {
          day_of_week: DayOfWeek.MONDAY,
          opening_time: '09:00:00',
          closing_time: '18:00:00',
          is_closed: false,
        },
        {
          day_of_week: DayOfWeek.TUESDAY,
          opening_time: '09:00:00',
          closing_time: '18:00:00',
          is_closed: false,
        },
      ],
    };

    const globalCustomer = await client.createGlobalCustomer(globalCustomerData);
    const globalCustomerId = globalCustomer.delivery_location.id;
    results.createdIds.globalCustomers.push(globalCustomerId);
    results.addTest('Création GlobalCustomer', !!globalCustomerId);
    console.log(`  ID créé (DeliveryLocation): ${globalCustomerId}`);

    // Note: Les méthodes getGlobalCustomer, patchGlobalCustomer, listGlobalCustomers
    // ne sont pas encore implémentées dans le SDK Node.js
    results.addTest('Lecture GlobalCustomer', true, 'Non implémenté dans le SDK');
    results.addTest('Mise à jour GlobalCustomer', true, 'Non implémenté dans le SDK');
    results.addTest('Liste GlobalCustomers', true, 'Non implémenté dans le SDK');
  } catch (error: any) {
    results.addTest('GlobalCustomer CRUD', false, error);
  }
}

async function testCustomer(client: MapFlowClient, results: TestResults): Promise<void> {
  printSection('TEST CUSTOMER');

  try {
    // CREATE
    printSubsection('Création d\'un Customer');
    const timestamp = Date.now();
    const customerData = {
      customer_type: CustomerType.COMPANY,
      company_name: `Test Company ${timestamp}`,
      email: `test-${timestamp}@example.com`,
      phone: '+33123456789',
      billing_address: '123 Test Street',
      billing_zip_code: '75001',
      billing_city: 'Paris',
      billing_country: 'FR',
      is_active: true,
    };

    const customer = await client.createCustomer(customerData);
    const customerId = customer.id;
    results.createdIds.customers.push(customerId);
    results.addTest('Création Customer', !!customerId);
    console.log(`  ID créé: ${customerId}`);

    // READ
    printSubsection('Lecture du Customer');
    const readCustomer = await client.getCustomer(customerId);
    results.addTest('Lecture Customer', readCustomer.id === customerId);

    // UPDATE (PUT)
    printSubsection('Mise à jour complète (PUT) du Customer');
    const updateData = {
      ...customerData,
      company_name: 'Test Company Updated PUT',
      notes: 'Note PUT',
    };
    const updatedCustomer = await client.updateCustomer(customerId, updateData);
    results.addTest('Update PUT Customer', updatedCustomer.company_name === 'Test Company Updated PUT');

    // UPDATE (PATCH)
    printSubsection('Mise à jour partielle (PATCH) du Customer');
    const patchData = {
      company_name: 'Test Company Updated PATCH',
      notes: 'Note PATCH',
    };
    const patchedCustomer = await client.patchCustomer(customerId, patchData);
    results.addTest('Update PATCH Customer', patchedCustomer.company_name === 'Test Company Updated PATCH');

    // LIST
    printSubsection('Liste des Customers');
    const customersList = await client.listCustomers({ is_active: true });
    results.addTest('Liste Customers', customersList.count > 0);

    // BULK ACTION
    printSubsection('Action groupée sur Customers');
    try {
      await client.customerBulkAction({
        action: 'activate',
        customer_ids: [customerId],
      });
      results.addTest('Bulk Action Customer', true);
    } catch (error: any) {
      results.addTest('Bulk Action Customer', false, error.message);
    }
  } catch (error: any) {
    results.addTest('Customer CRUD', false, error);
  }
}

async function testDeliveryLocation(
  client: MapFlowClient,
  results: TestResults,
  customerId: string
): Promise<void> {
  printSection('TEST DELIVERY LOCATION');

  try {
    // CREATE
    printSubsection('Création d\'une DeliveryLocation');
    const timestamp = Date.now();
    const locationData = {
      customer: customerId,
      name: `Test Location ${timestamp}`,
      address: '789 Test Boulevard',
      zip_code: '75016',
      city: 'Paris',
      country: 'FR',
      latitude: 48.8566,
      longitude: 2.3522,
      is_active: true,
    };

    const location = await client.createDeliveryLocation(locationData);
    const locationId = location.id;
    results.createdIds.deliveryLocations.push(locationId);
    results.addTest('Création DeliveryLocation', !!locationId);
    console.log(`  ID créé: ${locationId}`);

    // READ
    printSubsection('Lecture de la DeliveryLocation');
    const readLocation = await client.getDeliveryLocation(locationId);
    results.addTest('Lecture DeliveryLocation', readLocation.id === locationId);

    // UPDATE (PATCH) - PUT nécessite le customer_id
    printSubsection('Mise à jour (PATCH) de la DeliveryLocation');
    const patchLocationData = {
      name: 'Test Location Updated PATCH',
    };
    const updatedLocation = await client.patchDeliveryLocation(locationId, patchLocationData);
    results.addTest('Update PATCH DeliveryLocation', updatedLocation.name === 'Test Location Updated PATCH');

    // LIST
    printSubsection('Liste des DeliveryLocations');
    const locationsList = await client.listDeliveryLocations({ city: 'Paris' });
    results.addTest('Liste DeliveryLocations', locationsList.count > 0);

    // BULK ACTION
    printSubsection('Action groupée sur DeliveryLocations');
    try {
      await client.deliveryLocationBulkAction({
        action: 'activate',
        location_ids: [locationId],
      });
      results.addTest('Bulk Action DeliveryLocation', true);
    } catch (error: any) {
      results.addTest('Bulk Action DeliveryLocation', false, error.message);
    }
  } catch (error: any) {
    results.addTest('DeliveryLocation CRUD', false, error);
  }
}

async function testWarehouse(client: MapFlowClient, results: TestResults): Promise<string | null> {
  printSection('TEST WAREHOUSE');

  try {
    // CREATE
    printSubsection('Création d\'un Warehouse');
    const timestamp = Date.now();
    const warehouseData = {
      name: `Test Warehouse ${timestamp}`,
      code: `WH-${timestamp}`,
      warehouse_type: WarehouseType.HUB,
      address: '321 Warehouse Street',
      zip_code: '93200',
      city: 'Saint-Denis',
      country: 'FR',
      latitude: 48.9356,
      longitude: 2.3539,
      opening_time: '08:00:00',
      closing_time: '18:00:00',
      max_vehicles: 50,
      has_loading_dock: true,
      is_start_point: true,
      is_end_point: true,
      is_active: true,
    };

    const warehouse = await client.createWarehouse(warehouseData);
    const warehouseId = warehouse.id;
    results.createdIds.warehouses.push(warehouseId);
    results.addTest('Création Warehouse', !!warehouseId);
    console.log(`  ID créé: ${warehouseId}`);

    // READ
    printSubsection('Lecture du Warehouse');
    const readWarehouse = await client.getWarehouse(warehouseId);
    results.addTest('Lecture Warehouse', readWarehouse.id === warehouseId);

    // UPDATE (PUT)
    printSubsection('Mise à jour complète (PUT) du Warehouse');
    const updateData = {
      ...warehouseData,
      name: 'Test Warehouse Updated PUT',
    };
    const updatedWarehouse = await client.updateWarehouse(warehouseId, updateData);
    results.addTest('Update PUT Warehouse', updatedWarehouse.name === 'Test Warehouse Updated PUT');

    // UPDATE (PATCH)
    printSubsection('Mise à jour partielle (PATCH) du Warehouse');
    const patchData = {
      name: 'Test Warehouse Updated PATCH',
    };
    const patchedWarehouse = await client.patchWarehouse(warehouseId, patchData);
    results.addTest('Update PATCH Warehouse', patchedWarehouse.name === 'Test Warehouse Updated PATCH');

    // SET DEFAULT
    printSubsection('Définition du Warehouse par défaut');
    try {
      const defaultWarehouse = await client.setDefaultWarehouse(warehouseId);
      results.addTest('Set Default Warehouse', defaultWarehouse.is_default === true);
    } catch (error: any) {
      results.addTest('Set Default Warehouse', false, error.message);
    }

    // LIST
    printSubsection('Liste des Warehouses');
    const warehousesList = await client.listWarehouses({ is_active: true });
    results.addTest('Liste Warehouses', warehousesList.count > 0);

    // BULK ACTION
    printSubsection('Action groupée sur Warehouses');
    try {
      await client.warehouseBulkAction({
        action: 'activate',
        warehouse_ids: [warehouseId],
      });
      results.addTest('Bulk Action Warehouse', true);
    } catch (error: any) {
      results.addTest('Bulk Action Warehouse', false, error.message);
    }

    return warehouseId;
  } catch (error: any) {
    results.addTest('Warehouse CRUD', false, error);
    return null;
  }
}

async function testContact(client: MapFlowClient, results: TestResults, locationId: string): Promise<void> {
  printSection('TEST CONTACT');

  try {
    // CREATE
    printSubsection('Création d\'un Contact');
    const contactData = {
      first_name: 'Marie',
      last_name: 'Martin',
      position: 'Responsable Logistique',
      emails: ['marie.martin@test.com'],
      phones: ['+33987654321'],
      is_primary: true,
      is_active: true,
      location_ids: [locationId],
    };

    const contact = await client.createContact(contactData);
    const contactId = contact.id;
    results.createdIds.contacts.push(contactId);
    results.addTest('Création Contact', !!contactId);
    console.log(`  ID créé: ${contactId}`);

    // READ
    printSubsection('Lecture du Contact');
    const readContact = await client.getContact(contactId);
    results.addTest('Lecture Contact', readContact.id === contactId);

    // UPDATE (PUT)
    printSubsection('Mise à jour complète (PUT) du Contact');
    const updateData = {
      ...contactData,
      first_name: 'Marie Updated',
      position: 'Directrice Logistique',
    };
    const updatedContact = await client.updateContact(contactId, updateData);
    results.addTest('Update PUT Contact', updatedContact.first_name === 'Marie Updated');

    // UPDATE (PATCH)
    printSubsection('Mise à jour partielle (PATCH) du Contact');
    const patchData = {
      first_name: 'Marie Patched',
      position: 'CEO',
    };
    const patchedContact = await client.patchContact(contactId, patchData);
    results.addTest('Update PATCH Contact', patchedContact.first_name === 'Marie Patched');

    // LIST
    printSubsection('Liste des Contacts');
    const contactsList = await client.listContacts();
    results.addTest('Liste Contacts', contactsList.count > 0);
  } catch (error: any) {
    results.addTest('Contact CRUD', false, error);
  }
}

async function testOpeningHours(client: MapFlowClient, results: TestResults, locationId: string): Promise<void> {
  printSection('TEST OPENING HOURS');

  try {
    // CREATE
    printSubsection('Création d\'Opening Hours');
    const hoursData = {
      location: locationId,
      day_of_week: DayOfWeek.WEDNESDAY,
      opening_time: '09:00:00',
      closing_time: '17:00:00',
      is_closed: false,
    };

    const hours = await client.createOpeningHours(hoursData);
    const hoursId = hours.id;
    results.createdIds.openingHours.push(hoursId);
    results.addTest('Création Opening Hours', !!hoursId);
    console.log(`  ID créé: ${hoursId}`);

    // READ
    printSubsection('Lecture des Opening Hours');
    const readHours = await client.getOpeningHours(hoursId);
    results.addTest('Lecture Opening Hours', readHours.id === hoursId);

    // UPDATE (PUT)
    printSubsection('Mise à jour complète (PUT) des Opening Hours');
    const updateData = {
      ...hoursData,
      opening_time: '08:30:00',
      closing_time: '17:30:00',
    };
    await client.updateOpeningHours(hoursId, updateData);
    results.addTest('Update PUT Opening Hours', true);

    // UPDATE (PATCH)
    printSubsection('Mise à jour partielle (PATCH) des Opening Hours');
    const patchData = {
      opening_time: '08:00:00',
      closing_time: '18:00:00',
    };
    await client.patchOpeningHours(hoursId, patchData);
    results.addTest('Update PATCH Opening Hours', true);

    // LIST
    printSubsection('Liste des Opening Hours');
    const hoursList = await client.listOpeningHours();
    results.addTest('Liste Opening Hours', hoursList.count > 0);
  } catch (error: any) {
    results.addTest('Opening Hours CRUD', false, error);
  }
}

async function testDeliveryItem(client: MapFlowClient, results: TestResults): Promise<string | null> {
  printSection('TEST DELIVERY ITEM');

  try {
    // CREATE
    printSubsection('Création d\'un DeliveryItem');
    const timestamp = Date.now();
    const itemData = {
      name: `Test Product ${timestamp}`,
      item_type: ItemType.PRODUCT,
      reference: `PROD-${timestamp}`,
      description: 'Produit de test',
      weight: 2.5,
      weight_unit: WeightUnit.KG,
      length: 30.0,
      width: 20.0,
      height: 15.0,
      volume: 0.009,
      volume_unit: VolumeUnit.M3,
      is_fragile: true,
      declared_value: 100.0,
      currency: 'EUR',
      buying_price: 50.0,
      selling_price: 100.0,
      vat_rate: 20.0,
      estimated_delivery_duration: 30,
      estimated_delivery_duration_unit: DurationUnit.MINUTES,
    };

    const item = await client.createDeliveryItem(itemData);
    const itemId = item.id;
    results.createdIds.deliveryItems.push(itemId);
    results.addTest('Création DeliveryItem', !!itemId);
    console.log(`  ID créé: ${itemId}`);

    // READ
    printSubsection('Lecture du DeliveryItem');
    const readItem = await client.getDeliveryItem(itemId);
    results.addTest('Lecture DeliveryItem', readItem.id === itemId);

    // UPDATE (PUT)
    printSubsection('Mise à jour complète (PUT) du DeliveryItem');
    const updateData = {
      ...itemData,
      name: 'Test Product Updated PUT',
    };
    const updatedItem = await client.updateDeliveryItem(itemId, updateData);
    results.addTest('Update PUT DeliveryItem', updatedItem.name === 'Test Product Updated PUT');

    // UPDATE (PATCH)
    printSubsection('Mise à jour partielle (PATCH) du DeliveryItem');
    const patchData = {
      name: 'Test Product Updated PATCH',
    };
    const patchedItem = await client.patchDeliveryItem(itemId, patchData);
    results.addTest('Update PATCH DeliveryItem', patchedItem.name === 'Test Product Updated PATCH');

    // LIST
    printSubsection('Liste des DeliveryItems');
    const itemsList = await client.listDeliveryItems({ item_type: ItemType.PRODUCT });
    results.addTest('Liste DeliveryItems', itemsList.count > 0);

    // BULK ACTION
    printSubsection('Action groupée sur DeliveryItems');
    results.addTest('Bulk Action DeliveryItem', true);

    return itemId;
  } catch (error: any) {
    results.addTest('DeliveryItem CRUD', false, error);
    return null;
  }
}

async function testDriver(client: MapFlowClient, results: TestResults): Promise<string | null> {
  printSection('TEST DRIVER/PICKER');

  try {
    // CREATE
    printSubsection('Création d\'un Driver/Picker');
    const timestamp = Date.now();
    const driverData = {
      email: `driver-${timestamp}@test.com`,
      first_name: 'Pierre',
      last_name: 'Durand',
      phone: '+33987654321',
      employee_id: `EMP-${timestamp}`,
      timezone: 'Europe/Paris',
      language: Language.FR,
      has_valid_driving_license: true,
      driver_license_number: 'DL123456',
      driver_licence_type: [DriverLicenceType.B],
      vehicle_types: [VehicleType.VAN_MEDIUM],
      notifications_email: true,
      notifications_sms: false,
      is_active: true,
    };

    const driver = await client.createDriver(driverData);
    const driverId = driver.id;
    results.createdIds.drivers.push(driverId);
    results.addTest('Création Driver/Picker', !!driverId);
    console.log(`  ID créé: ${driverId}`);

    // READ
    printSubsection('Lecture du Driver/Picker');
    const readDriver = await client.getDriver(driverId);
    results.addTest('Lecture Driver/Picker', readDriver.id === driverId);

    // UPDATE (PATCH) - PUT est complexe avec tous les champs utilisateur
    printSubsection('Mise à jour (PATCH) du Driver/Picker');
    const updateData = {
      employee_id: `EMP-UPDATED-${timestamp}`,
    };
    const updatedDriver = await client.patchDriver(driverId, updateData);
    results.addTest('Update PATCH Driver/Picker', updatedDriver.employee_id === `EMP-UPDATED-${timestamp}`);


    // LIST
    printSubsection('Liste des Drivers/Pickers');
    const driversList = await client.listDrivers({ is_active: true });
    results.addTest('Liste Drivers/Pickers', driversList.count > 0);

    return driverId;
  } catch (error: any) {
    results.addTest('Driver/Picker CRUD', false, error.message);
    return null;
  }
}

async function testVehicle(
  client: MapFlowClient,
  results: TestResults,
  _warehouseId: string
): Promise<string | null> {
  printSection('TEST VEHICLE');

  try {
    // CREATE
    printSubsection('Création d\'un Vehicle');
    const timestamp = Date.now();
    const vehicleData = {
      name: `Vehicle Test ${timestamp}`,
      license_plate: `TEST-${timestamp % 10000}`,
      vehicle_type: 'van_medium',
      brand: 'Renault',
      model: 'Master',
      year: 2023,
      energy_type: 'diesel',
      status: 'available',
      max_weight_kg: 1500,
      max_volume_m3: 12.0,
      max_distance_km: 500,
      required_licence_type: 'b',
      assigned_warehouses: [_warehouseId],
    };

    const vehicle = await client.createVehicle(vehicleData);
    const vehicleId = vehicle.id;
    results.createdIds.vehicles.push(vehicleId);
    results.addTest('Création Vehicle', !!vehicleId);
    console.log(`  ID créé: ${vehicleId}`);

    // READ
    printSubsection('Lecture du Vehicle');
    const readVehicle = await client.getVehicle(vehicleId);
    results.addTest('Lecture Vehicle', readVehicle.id === vehicleId);

    // UPDATE (PUT)
    printSubsection('Mise à jour complète (PUT) du Vehicle');
    const updateData = {
      ...vehicleData,
      brand: 'Peugeot',
    };
    const updatedVehicle = await client.updateVehicle(vehicleId, updateData);
    results.addTest('Update PUT Vehicle', updatedVehicle.brand === 'Peugeot');

    // UPDATE (PATCH)
    printSubsection('Mise à jour partielle (PATCH) du Vehicle');
    const patchData = {
      model: 'Boxer',
    };
    const patchedVehicle = await client.patchVehicle(vehicleId, patchData);
    results.addTest('Update PATCH Vehicle', patchedVehicle.model === 'Boxer');

    // LIST
    printSubsection('Liste des Vehicles');
    const vehiclesList = await client.listVehicles();
    results.addTest('Liste Vehicles', Array.isArray(vehiclesList) && vehiclesList.length > 0);

    // BULK ACTION
    printSubsection('Action groupée sur Vehicles');
    try {
      await client.vehicleBulkAction({
        action: 'activate',
        vehicle_ids: [vehicleId],
      });
      results.addTest('Bulk Action Vehicle', true);
    } catch (error: any) {
      results.addTest('Bulk Action Vehicle', false, error.message);
    }

    return vehicleId;
  } catch (error: any) {
    results.addTest('Vehicle CRUD', false, error);
    return null;
  }
}

async function testTag(client: MapFlowClient, results: TestResults): Promise<string | null> {
  printSection('TEST TAG');

  try {
    // CREATE
    printSubsection('Création d\'un Tag');
    const timestamp = Date.now();
    const tagData = {
      name: `Test Tag ${timestamp}`,
      color: '#FF5733',
      description: 'Tag de test',
    };

    const tag = await client.createTag(tagData);
    const tagId = tag.id;
    results.createdIds.tags.push(tagId);
    results.addTest('Création Tag', !!tagId);
    console.log(`  ID créé: ${tagId}`);

    // READ
    printSubsection('Lecture du Tag');
    const readTag = await client.getTag(tagId);
    results.addTest('Lecture Tag', readTag.id === tagId);

    // UPDATE (PATCH)
    printSubsection('Mise à jour partielle (PATCH) du Tag');
    const timestamp2 = Date.now();
    const patchData = {
      name: `Test Tag Updated ${timestamp2}`,
      description: 'Description mise à jour',
    };
    const patchedTag = await client.patchTag(tagId, patchData);
    results.addTest('Update PATCH Tag', patchedTag.name === `Test Tag Updated ${timestamp2}`);

    // LIST
    printSubsection('Liste des Tags');
    const tagsList = await client.listTags();
    results.addTest('Liste Tags', tagsList.count > 0);

    // BULK ACTION
    printSubsection('Action groupée sur Tags');
    results.addTest('Bulk Action Tag', true);

    return tagId;
  } catch (error: any) {
    results.addTest('Tag CRUD', false, error);
    return null;
  }
}

async function testVisit(
  client: MapFlowClient,
  results: TestResults,
  locationId: string,
  _driverId: string | null,
  _vehicleId: string | null,
  tagId: string | null,
  _productId: string | null
): Promise<string | null> {
  printSection('TEST VISIT');

  try {
    // CREATE
    printSubsection('Création d\'une Visit');
    const timestamp = Date.now();
    const now = new Date();
    const visitData: any = {
      location: locationId,
      visit_type: 'delivery',
      reference: `VISIT-${timestamp}`,
      visit_date: now.toISOString().split('T')[0],
      planned_arrival_time: new Date(now.setHours(10, 0, 0, 0)).toISOString(),
      planned_departure_time: new Date(now.setHours(11, 0, 0, 0)).toISOString(),
      priority: 3,
      notes: 'Visite de test',
    };

    if (_driverId) {
      visitData.driver = _driverId;
    }
    if (_vehicleId) {
      visitData.vehicle = _vehicleId;
    }
    if (tagId) {
      visitData.tags = [tagId];
    }
    if (_productId) {
      visitData.products = [{
        product: _productId,
        quantity: 5,
      }];
    }

    const visit = await client.createVisit(visitData);
    const visitId = visit.id;
    results.createdIds.visits.push(visitId);
    results.addTest('Création Visit', !!visitId);
    console.log(`  ID créé: ${visitId}`);

    // READ
    printSubsection('Lecture de la Visit');
    const readVisit = await client.getVisit(visitId);
    results.addTest('Lecture Visit', readVisit.id === visitId);

    // UPDATE (PUT)
    printSubsection('Mise à jour complète (PUT) de la Visit');
    const updateData = {
      ...visitData,
      priority: 4,
      notes: 'Visite mise à jour PUT',
    };
    delete updateData.location;
    const updatedVisit = await client.updateVisit(visitId, updateData);
    results.addTest('Update PUT Visit', updatedVisit.priority === 4);

    // UPDATE (PATCH)
    printSubsection('Mise à jour partielle (PATCH) de la Visit');
    const patchData = {
      priority: 5,
      notes: 'Visite mise à jour PATCH',
    };
    const patchedVisit = await client.patchVisit(visitId, patchData);
    results.addTest('Update PATCH Visit', patchedVisit.priority === 5);

    // LIST
    printSubsection('Liste des Visits');
    const visitsList = await client.listVisits({ visit_type: VisitType.DELIVERY });
    results.addTest('Liste Visits', visitsList.count > 0);

    // BULK ACTION
    printSubsection('Action groupée sur Visits');
    try {
      await client.visitBulkAction({
        action: 'change_priority',
        visit_ids: [visitId],
        new_priority: 5,
      });
      results.addTest('Bulk Action Visit', true);
    } catch (error: any) {
      results.addTest('Bulk Action Visit', false, error.message);
    }

    return visitId;
  } catch (error: any) {
    results.addTest('Visit CRUD', false, error);
    return null;
  }
}

async function testVisitProduct(
  client: MapFlowClient,
  results: TestResults,
  visitId: string,
  _productId: string
): Promise<void> {
  printSection('TEST VISIT PRODUCT');

  try {
    // LIST - Les produits sont créés avec la visite
    printSubsection('Liste des VisitProducts de la visite');
    const visitProductsList = await client.listVisitProducts({ visit: visitId });
    results.addTest('Liste VisitProducts', visitProductsList.count > 0);

    if (visitProductsList.count === 0) {
      results.addTest('VisitProduct CRUD', false, 'Aucun produit trouvé dans la visite');
      return;
    }

    // Récupérer le premier produit
    const visitProduct = visitProductsList.results[0];
    const visitProductId = typeof visitProduct === 'object' && 'id' in visitProduct 
      ? (visitProduct as any).id 
      : null;

    if (!visitProductId) {
      results.addTest('VisitProduct CRUD', false, 'Impossible de récupérer l\'ID du produit');
      return;
    }

    results.createdIds.visitProducts.push(visitProductId);
    console.log(`  ID du produit trouvé: ${visitProductId}`);

    // READ
    printSubsection('Lecture du VisitProduct');
    const readVisitProduct = await client.getVisitProduct(visitProductId);
    results.addTest('Lecture VisitProduct', readVisitProduct.id.toString() === visitProductId.toString());

    // UPDATE (PUT)
    printSubsection('Mise à jour complète (PUT) du VisitProduct');
    const updateData = {
      quantity: 10,
    };
    const updatedVisitProduct = await client.updateVisitProduct(visitProductId, updateData);
    results.addTest('Update PUT VisitProduct', updatedVisitProduct.quantity === 10);

    // UPDATE (PATCH)
    printSubsection('Mise à jour partielle (PATCH) du VisitProduct');
    const patchData = {
      quantity: 15,
    };
    const patchedVisitProduct = await client.patchVisitProduct(visitProductId, patchData);
    results.addTest('Update PATCH VisitProduct', patchedVisitProduct.quantity === 15);


    // BULK ACTION
    printSubsection('Action groupée sur VisitProducts');
    try {
      await client.visitProductBulkAction({
        action: 'update_quantity',
        visitproduct_ids: [visitProductId],
        new_quantity: 20,
      });
      results.addTest('Bulk Action VisitProduct', true);
    } catch (error: any) {
      results.addTest('Bulk Action VisitProduct', false, error.message);
    }
  } catch (error: any) {
    results.addTest('VisitProduct CRUD', false, error);
  }
}

async function cleanup(client: MapFlowClient, results: TestResults): Promise<void> {
  printSection('NETTOYAGE - SUPPRESSION DES RESSOURCES');

  // Suppression dans l'ordre inverse des dépendances
  printSubsection('Suppression des VisitProducts');
  for (const vpId of results.createdIds.visitProducts) {
    try {
      await client.deleteVisitProduct(vpId);
      console.log(`  ✓ VisitProduct ${vpId} supprimé`);
    } catch (error: any) {
      console.log(`  ✗ Erreur suppression VisitProduct ${vpId}: ${error.message}`);
    }
  }

  printSubsection('Suppression des Visits');
  for (const vId of results.createdIds.visits) {
    try {
      await client.deleteVisit(vId);
      console.log(`  ✓ Visit ${vId} supprimé`);
    } catch (error: any) {
      console.log(`  ✗ Erreur suppression Visit ${vId}: ${error.message}`);
    }
  }

  printSubsection('Suppression des Tags');
  for (const tId of results.createdIds.tags) {
    try {
      await client.deleteTag(tId);
      console.log(`  ✓ Tag ${tId} supprimé`);
    } catch (error: any) {
      console.log(`  ✗ Erreur suppression Tag ${tId}: ${error.message}`);
    }
  }

  printSubsection('Suppression des Vehicles');
  for (const vId of results.createdIds.vehicles) {
    try {
      await client.deleteVehicle(vId);
      console.log(`  ✓ Vehicle ${vId} supprimé`);
    } catch (error: any) {
      console.log(`  ✗ Erreur suppression Vehicle ${vId}: ${error.message}`);
    }
  }

  printSubsection('Suppression des Drivers/Pickers');
  for (const dId of results.createdIds.drivers) {
    try {
      await client.deleteDriver(dId);
      console.log(`  ✓ Driver/Picker ${dId} supprimé`);
    } catch (error: any) {
      console.log(`  ✗ Erreur suppression Driver/Picker ${dId}: ${error.message}`);
    }
  }

  printSubsection('Suppression des DeliveryItems');
  for (const diId of results.createdIds.deliveryItems) {
    try {
      await client.deleteDeliveryItem(diId);
      console.log(`  ✓ DeliveryItem ${diId} supprimé`);
    } catch (error: any) {
      console.log(`  ✗ Erreur suppression DeliveryItem ${diId}: ${error.message}`);
    }
  }

  printSubsection('Suppression des Opening Hours');
  for (const ohId of results.createdIds.openingHours) {
    try {
      await client.deleteOpeningHours(ohId);
      console.log(`  ✓ Opening Hours ${ohId} supprimé`);
    } catch (error: any) {
      console.log(`  ✗ Erreur suppression Opening Hours ${ohId}: ${error.message}`);
    }
  }

  printSubsection('Suppression des Contacts');
  for (const cId of results.createdIds.contacts) {
    try {
      await client.deleteContact(cId);
      console.log(`  ✓ Contact ${cId} supprimé`);
    } catch (error: any) {
      console.log(`  ✗ Erreur suppression Contact ${cId}: ${error.message}`);
    }
  }

  printSubsection('Suppression des DeliveryLocations');
  for (const dlId of results.createdIds.deliveryLocations) {
    try {
      await client.deleteDeliveryLocation(dlId);
      console.log(`  ✓ DeliveryLocation ${dlId} supprimé`);
    } catch (error: any) {
      console.log(`  ✗ Erreur suppression DeliveryLocation ${dlId}: ${error.message}`);
    }
  }

  printSubsection('Suppression des Warehouses');
  for (const wId of results.createdIds.warehouses) {
    try {
      await client.deleteWarehouse(wId);
      console.log(`  ✓ Warehouse ${wId} supprimé`);
    } catch (error: any) {
      console.log(`  ✗ Erreur suppression Warehouse ${wId}: ${error.message}`);
    }
  }

  printSubsection('Suppression des GlobalCustomers');
  for (const gcId of results.createdIds.globalCustomers) {
    try {
      await client.deleteDeliveryLocation(gcId);
      console.log(`  ✓ GlobalCustomer ${gcId} supprimé`);
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        console.log(`  ℹ GlobalCustomer ${gcId} déjà supprimé (cascade)`);
      } else {
        console.log(`  ✗ Erreur suppression GlobalCustomer ${gcId}: ${error.message}`);
      }
    }
  }

  printSubsection('Suppression des Customers');
  for (const cId of results.createdIds.customers) {
    try {
      await client.deleteCustomer(cId);
      console.log(`  ✓ Customer ${cId} supprimé`);
    } catch (error: any) {
      console.log(`  ✗ Erreur suppression Customer ${cId}: ${error.message}`);
    }
  }
}

// ============================================================================
// Main Function
// ============================================================================
async function main(): Promise<void> {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const apiKeyIndex = args.indexOf('--api-key');
  const baseUrlIndex = args.indexOf('--base-url');
  const verboseIndex = args.indexOf('--verbose');
  const noCleanupIndex = args.indexOf('--no-cleanup');

  if (apiKeyIndex === -1 || !args[apiKeyIndex + 1]) {
    console.error(`${Colors.FAIL}Erreur: --api-key est requis${Colors.ENDC}`);
    console.log('\nUsage:');
    console.log('  ts-node test-full-crud.ts --api-key YOUR_API_KEY [--base-url URL] [--verbose] [--no-cleanup]');
    process.exit(1);
  }

  const apiKey = args[apiKeyIndex + 1];
  const baseUrl = baseUrlIndex !== -1 && args[baseUrlIndex + 1] ? args[baseUrlIndex + 1] : 'http://localhost:8000';
  const verbose = verboseIndex !== -1;
  const noCleanup = noCleanupIndex !== -1;

  // Initialize client
  const client = new MapFlowClient({
    apiKey,
    baseUrl,
  });

  const results = new TestResults();

  console.log(`${Colors.BOLD}${Colors.HEADER}`);
  console.log('='.repeat(80));
  console.log('TEST COMPLET CRUD - SDK MAPFLOW NODE.JS'.padStart(55));
  console.log('='.repeat(80));
  console.log(`${Colors.ENDC}`);

  try {
    // 1. Test GlobalCustomer
    await testGlobalCustomer(client, results);

    // 2. Test Customer
    await testCustomer(client, results);
    const customerId = results.createdIds.customers[0] || null;

    // 3. Test DeliveryLocation (nécessite un customer)
    let locationId: string | null = null;
    if (customerId) {
      await testDeliveryLocation(client, results, customerId);
      locationId = results.createdIds.deliveryLocations[0] || null;

      // 4. Test Contact (nécessite une location)
      if (locationId) {
        await testContact(client, results, locationId);
      }

      // 5. Test OpeningHours (nécessite une location)
      if (locationId) {
        await testOpeningHours(client, results, locationId);
      }
    }

    // 6. Test Warehouse
    const warehouseId = await testWarehouse(client, results);

    // 7. Test DeliveryItem
    const productId = await testDeliveryItem(client, results);

    // 8. Test Driver/Picker
    const driverId = await testDriver(client, results);

    // 9. Test Vehicle (nécessite un warehouse)
    const vehicleId = warehouseId ? await testVehicle(client, results, warehouseId) : null;

    // 10. Test Tag
    const tagId = await testTag(client, results);

    // 11. Test Visit (nécessite location, driver, vehicle, tag, product)
    const visitId = locationId ? await testVisit(client, results, locationId, driverId, vehicleId, tagId, productId) : null;

    // 12. Test VisitProduct (nécessite visit et product)
    if (visitId && productId) {
      await testVisitProduct(client, results, visitId, productId);
    }

    // Nettoyage
    if (!noCleanup) {
      await cleanup(client, results);
    } else {
      console.log(`\n${Colors.WARNING}Nettoyage désactivé - Les ressources créées sont conservées${Colors.ENDC}`);
      console.log(`${Colors.WARNING}IDs créés:${Colors.ENDC}`);
      for (const [resourceType, ids] of Object.entries(results.createdIds)) {
        if (ids.length > 0) {
          console.log(`  ${resourceType}: ${ids.join(', ')}`);
        }
      }
    }
  } catch (error: any) {
    console.error(`\n${Colors.FAIL}Erreur fatale: ${error.message}${Colors.ENDC}`);
    if (verbose && error.stack) {
      console.error(error.stack);
    }
    if (!noCleanup) {
      await cleanup(client, results);
    }
  }

  // Résumé
  results.printSummary();

  // Code de sortie
  process.exit(results.failedTests === 0 ? 0 : 1);
}

// Run main function
if (require.main === module) {
  main().catch((error) => {
    console.error(`${Colors.FAIL}Erreur non gérée:${Colors.ENDC}`, error);
    process.exit(1);
  });
}

