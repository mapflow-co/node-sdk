# MapFlow Node.js SDK

**Official Node.js & TypeScript SDK for [MapFlow](https://mapflow.co) — Route Optimization & Delivery Management API**  
**SDK Node.js & TypeScript officiel pour [MapFlow](https://mapflow.co) — Optimisation de tournées & Gestion de livraisons**

[![npm version](https://img.shields.io/npm/v/mapflow-co-sdk.svg)](https://www.npmjs.com/package/mapflow-co-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D16-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![API Docs](https://img.shields.io/badge/API-Docs-blue.svg)](https://mapflow.readme.io/reference)

---

## 🇬🇧 English

MapFlow is a SaaS platform for **route optimization**, **delivery planning**, and **logistics management**. This SDK gives JavaScript and TypeScript developers full programmatic access to the MapFlow API — manage customers, warehouses, drivers, vehicles, delivery schedules, and product catalog from your own applications.

→ **Website**: https://mapflow.co  
→ **API Documentation**: https://mapflow.readme.io/reference  
→ **Get your API key**: app.mapflow.co → Settings → API Keys  
→ **Python SDK**: https://github.com/mapflow-co/python-sdk

### Features

- **Full API coverage** — customers, locations, warehouses, drivers, vehicles, catalog, visits, tags, contacts, and opening hours
- **TypeScript first** — complete type definitions with full IntelliSense and autocompletion
- **Promise-based** — modern async/await throughout
- **Typed errors** — `AuthenticationError`, `NotFoundError`, `ValidationError`, `RateLimitError`, and more
- **Paginated responses** — generic `PaginatedResponse<T>` with automatic deserialization
- **Bulk operations** — activate, deactivate, update, tag multiple records in one request
- **Node.js ≥ 16** compatible

### Installation

```bash
npm install mapflow-co-sdk
```

```bash
yarn add mapflow-co-sdk
```

### Quick Start

```typescript
import { MapFlowClient, CustomerType, VisitType } from 'mapflow-co-sdk';

const client = new MapFlowClient({ apiKey: 'your-api-key' });

// Create a customer
const customer = await client.createCustomer({
  customer_type: CustomerType.COMPANY,
  company_name: 'Acme Corp',
  email: 'contact@acme.com',
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
  latitude: 48.8566,
  longitude: 2.3522,
});

// Schedule a delivery visit
const visit = await client.createVisit({
  location: location.id,
  visit_type: VisitType.DELIVERY,
  visit_date: '2026-04-01',
  notes: 'Ring bell at entrance',
});

console.log(`Visit scheduled: ${visit.id}`);
```

### Authentication

All requests require an API key sent as the `X-API-Key` header. Get your key from [app.mapflow.co](https://app.mapflow.co) → Settings → API Keys.

```typescript
const client = new MapFlowClient({
  apiKey: process.env.MAPFLOW_API_KEY!,
  baseUrl: 'https://api.mapflow.co', // optional
  timeout: 30000,                     // optional, ms
});
```

### Core Resources

#### Customers

```typescript
import { CustomerType } from 'mapflow-co-sdk';

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

const customers = await client.listCustomers({ is_active: true });
await client.patchCustomer(customer.id, { notes: 'VIP client' });
await client.deleteCustomer(customer.id);
```

#### Warehouses

```typescript
import { WarehouseType } from 'mapflow-co-sdk';

const warehouse = await client.createWarehouse({
  name: 'Paris Nord Hub',
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
});

await client.setDefaultWarehouse(warehouse.id);
```

#### Drivers & Vehicles

```typescript
import { VehicleType, DriverLicenceType, EnergyType } from 'mapflow-co-sdk';

const driver = await client.createDriver({
  email: 'driver@example.com',
  first_name: 'Jean',
  last_name: 'Dupont',
  driver_licence_type: [DriverLicenceType.B],
  vehicle_types: [VehicleType.VAN_MEDIUM],
});

const vehicle = await client.createVehicle({
  name: 'Van 01',
  license_plate: 'AB-123-CD',
  vehicle_type: VehicleType.VAN_MEDIUM,
  brand: 'Renault',
  model: 'Master',
  energy_type: EnergyType.DIESEL,
  max_weight_kg: 1500,
  max_volume_m3: 12.0,
});
```

#### Visits & Scheduling

```typescript
import { VisitType, ItemType, WeightUnit } from 'mapflow-co-sdk';

const product = await client.createDeliveryItem({
  name: 'Laptop Pro 16',
  item_type: ItemType.PRODUCT,
  weight: 2.1,
  weight_unit: WeightUnit.KG,
  is_fragile: true,
  selling_price: 2499.00,
});

const visit = await client.createVisit({
  location: location.id,
  visit_type: VisitType.DELIVERY,
  visit_date: '2026-04-01',
  driver: driver.id,
  vehicle: vehicle.id,
  priority: 3,
  products: [{ product: product.id, quantity: 2 }],
});
```

#### Global Customer (Atomic Creation)

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
  },
  contact: {
    first_name: 'Marie',
    last_name: 'Martin',
    emails: ['marie@techsolutions.fr'],
    is_primary: true,
  },
  opening_hours: [
    { day_of_week: DayOfWeek.MONDAY, opening_time: '09:00:00', closing_time: '18:00:00' },
    { day_of_week: DayOfWeek.TUESDAY, opening_time: '09:00:00', closing_time: '18:00:00' },
  ],
});
```

### Pagination

```typescript
const page = await client.listCustomers({ page: 1, page_size: 20 });
console.log(`Total: ${page.count}`);

async function* allCustomers() {
  let pageNum = 1;
  while (true) {
    const p = await client.listCustomers({ page: pageNum, page_size: 50 });
    yield* p.results;
    if (!p.next) break;
    pageNum++;
  }
}

for await (const customer of allCustomers()) {
  console.log(customer.display_name);
}
```

### Bulk Operations

```typescript
await client.customerBulkAction({ action: 'activate', customer_ids: [id1, id2] });
await client.vehicleBulkAction({ action: 'change_status', vehicle_ids: [v1], new_status: 'maintenance' });
await client.visitProductBulkAction({ action: 'update_quantity', visitproduct_ids: [vp1], new_quantity: 5 });
```

### Error Handling

```typescript
import {
  MapFlowError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ServerError,
} from 'mapflow-co-sdk';

try {
  await client.getCustomer(customerId);
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key — check app.mapflow.co → Settings → API Keys');
  } else if (error instanceof NotFoundError) {
    console.error('Customer not found');
  } else if (error instanceof ValidationError) {
    console.error('Validation error:', error.message);
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded');
  } else if (error instanceof MapFlowError) {
    console.error(`Error ${error.statusCode}: ${error.message}`);
  }
}
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
| `DayOfWeek` | `MONDAY` (0) … `SUNDAY` (6) |

### API Reference — All Methods

**Customers** — `listCustomers` · `createCustomer` · `getCustomer` · `updateCustomer` · `patchCustomer` · `deleteCustomer` · `customerBulkAction`

**Delivery Locations** — `listDeliveryLocations` · `createDeliveryLocation` · `getDeliveryLocation` · `updateDeliveryLocation` · `patchDeliveryLocation` · `deleteDeliveryLocation` · `deliveryLocationBulkAction`

**Warehouses** — `listWarehouses` · `createWarehouse` · `getWarehouse` · `updateWarehouse` · `patchWarehouse` · `deleteWarehouse` · `setDefaultWarehouse` · `warehouseBulkAction`

**Drivers** — `listDrivers` · `createDriver` · `getDriver` · `updateDriver` · `patchDriver` · `deleteDriver`

**Vehicles** — `listVehicles` · `createVehicle` · `getVehicle` · `updateVehicle` · `patchVehicle` · `deleteVehicle` · `vehicleBulkAction`

**Product Catalog** — `listDeliveryItems` · `createDeliveryItem` · `getDeliveryItem` · `updateDeliveryItem` · `patchDeliveryItem` · `deleteDeliveryItem` · `deliveryItemBulkAction`

**Visits** — `listVisits` · `createVisit` · `getVisit` · `updateVisit` · `patchVisit` · `deleteVisit` · `visitBulkAction`

**Visit Products** — `listVisitProducts` · `createVisitProduct` · `getVisitProduct` · `updateVisitProduct` · `patchVisitProduct` · `deleteVisitProduct` · `visitProductBulkAction`

**Tags** — `listTags` · `createTag` · `getTag` · `updateTag` · `patchTag` · `deleteTag` · `tagBulkAction`

**Contacts** — `listContacts` · `createContact` · `getContact` · `updateContact` · `patchContact` · `deleteContact`

**Opening Hours** — `listOpeningHours` · `createOpeningHours` · `getOpeningHours` · `updateOpeningHours` · `patchOpeningHours` · `deleteOpeningHours`

**Global Customer** — `createGlobalCustomer`

### Support

- **Website**: https://mapflow.co
- **API Documentation**: https://mapflow.readme.io/reference
- **npm**: https://www.npmjs.com/package/mapflow-co-sdk
- **GitHub Issues**: https://github.com/mapflow-co/node-sdk/issues
- **Email**: support@mapflow.co
- **Python SDK**: https://github.com/mapflow-co/python-sdk

---

## 🇫🇷 Français

MapFlow est une plateforme SaaS d'**optimisation de tournées**, de **planification de livraisons** et de **gestion logistique**. Ce SDK donne aux développeurs JavaScript et TypeScript un accès programmatique complet à l'API MapFlow — gérez vos clients, entrepôts, chauffeurs, véhicules, tournées de livraison et catalogue produits depuis vos propres applications.

→ **Site web** : https://mapflow.co  
→ **Documentation API** : https://mapflow.readme.io/reference  
→ **Obtenir une clé API** : app.mapflow.co → Paramètres → Clés API  
→ **SDK Python** : https://github.com/mapflow-co/python-sdk

### Fonctionnalités

- **Couverture API complète** — clients, points de livraison, entrepôts, chauffeurs, véhicules, catalogue, visites, étiquettes, contacts et horaires d'ouverture
- **TypeScript natif** — définitions de types complètes avec IntelliSense et autocomplétion
- **Basé sur les Promesses** — async/await moderne dans tout le SDK
- **Erreurs typées** — `AuthenticationError`, `NotFoundError`, `ValidationError`, `RateLimitError`, etc.
- **Réponses paginées** — `PaginatedResponse<T>` générique avec désérialisation automatique
- **Actions groupées** — activer, désactiver, mettre à jour, étiqueter plusieurs enregistrements en une seule requête
- **Compatible Node.js ≥ 16**

### Installation

```bash
npm install mapflow-co-sdk
```

```bash
yarn add mapflow-co-sdk
```

### Démarrage rapide

```typescript
import { MapFlowClient, CustomerType, VisitType } from 'mapflow-co-sdk';

const client = new MapFlowClient({ apiKey: 'votre-clé-api' });

// Créer un client
const client_mapflow = await client.createCustomer({
  customer_type: CustomerType.COMPANY,
  company_name: 'Transports Dupont SARL',
  email: 'contact@transports-dupont.fr',
  billing_zip_code: '69001',
  billing_city: 'Lyon',
  billing_country: 'FR',
});

// Créer un point de livraison
const pointLivraison = await client.createDeliveryLocation({
  customer: client_mapflow.id,
  name: 'Siège social',
  address: '10 Rue de la République',
  zip_code: '69001',
  city: 'Lyon',
  latitude: 45.7578,
  longitude: 4.8320,
});

// Planifier une visite de livraison
const visite = await client.createVisit({
  location: pointLivraison.id,
  visit_type: VisitType.DELIVERY,
  visit_date: '2026-04-01',
  notes: 'Sonner à l\'interphone',
});

console.log(`Tournée planifiée : ${visite.id}`);
```

### Authentification

Toutes les requêtes nécessitent une clé API envoyée dans l'en-tête `X-API-Key`. Obtenez votre clé sur [app.mapflow.co](https://app.mapflow.co) → Paramètres → Clés API.

```typescript
const client = new MapFlowClient({
  apiKey: process.env.MAPFLOW_API_KEY!,
  baseUrl: 'https://api.mapflow.co', // optionnel
  timeout: 30000,                     // optionnel, en ms
});
```

### Ressources principales

#### Clients (Customers)

Gérez vos clients particuliers et entreprises avec coordonnées de facturation, numéros de TVA et SIRET.

```typescript
import { CustomerType } from 'mapflow-co-sdk';

const client_data = await client.createCustomer({
  customer_type: CustomerType.COMPANY,
  company_name: 'Boulangerie Martin',
  email: 'contact@boulangerie-martin.fr',
  phone: '+33123456789',
  billing_address: '5 Rue du Four',
  billing_zip_code: '75006',
  billing_city: 'Paris',
  billing_country: 'FR',
  siret: '12345678901234',
});

// Lister avec filtres
const clients = await client.listCustomers({ is_active: true });
for (const c of clients.results) {
  console.log(c.display_name, c.email);
}

// Lire / Modifier / Supprimer
await client.patchCustomer(client_data.id, { notes: 'Client fidèle depuis 2020' });
await client.deleteCustomer(client_data.id);
```

#### Points de livraison (Delivery Locations)

Adresses physiques de livraison ou d'enlèvement, avec géolocalisation et contraintes d'accès.

```typescript
const pointLivraison = await client.createDeliveryLocation({
  customer: client_data.id,
  name: 'Dépôt principal',
  address: '45 Avenue de la Logistique',
  zip_code: '93200',
  city: 'Saint-Denis',
  country: 'FR',
  latitude: 48.9356,
  longitude: 2.3539,
  delivery_instructions: 'Quai de déchargement côté gauche',
  access_code: '4321',
});

// Filtrer par ville
const points = await client.listDeliveryLocations({ city: 'Paris' });
```

#### Entrepôts (Warehouses)

Points de départ et d'arrivée pour vos tournées — gestion des quais de chargement, certifications et affectation multi-véhicules.

```typescript
import { WarehouseType } from 'mapflow-co-sdk';

const entrepot = await client.createWarehouse({
  name: 'Hub Paris Nord',
  code: 'PARIS-01',
  warehouse_type: WarehouseType.HUB,
  address: '12 Rue Industrielle',
  zip_code: '93200',
  city: 'Saint-Denis',
  latitude: 48.9356,
  longitude: 2.3539,
  opening_time: '06:00:00',
  closing_time: '22:00:00',
  is_start_point: true,
  is_end_point: true,
  max_vehicles: 50,
  has_loading_dock: true,
});

// Définir comme entrepôt par défaut
await client.setDefaultWarehouse(entrepot.id);
```

#### Chauffeurs & Livreurs (Drivers & Pickers)

Gérez vos chauffeurs et préparateurs de commandes avec types de permis, certifications et capacités véhicule.

```typescript
import { UserRole, DriverLicenceType, VehicleType, Language } from 'mapflow-co-sdk';

const chauffeur = await client.createDriver({
  email: 'chauffeur@transportsdupont.fr',
  first_name: 'Pierre',
  last_name: 'Durand',
  phone: '+33612345678',
  role: UserRole.DRIVER,
  language: Language.FR,
  has_valid_driving_license: true,
  driver_licence_type: [DriverLicenceType.B, DriverLicenceType.C],
  vehicle_types: [VehicleType.VAN_MEDIUM, VehicleType.TRUCK_SMALL],
});
```

#### Flotte de véhicules (Vehicles)

Gestion de flotte incluant capacité, type de carburant, statut de maintenance et suivi GPS.

```typescript
import { VehicleType, EnergyType } from 'mapflow-co-sdk';

const vehicule = await client.createVehicle({
  name: 'Camionnette 01',
  license_plate: 'AB-123-CD',
  vehicle_type: VehicleType.VAN_MEDIUM,
  brand: 'Renault',
  model: 'Master',
  year: 2023,
  energy_type: EnergyType.DIESEL,
  max_weight_kg: 1500,
  max_volume_m3: 12.0,
  max_distance_km: 500,
  assigned_warehouses: [entrepot.id],
});
```

#### Catalogue produits (Product Catalog)

Définissez vos produits, services, colis et palettes avec poids, volume, tarification et contraintes de température.

```typescript
import { ItemType, WeightUnit } from 'mapflow-co-sdk';

const produit = await client.createDeliveryItem({
  name: 'Ordinateur Portable Pro',
  reference: 'PROD-001',
  item_type: ItemType.PRODUCT,
  weight: 2.1,
  weight_unit: WeightUnit.KG,
  length: 36,
  width: 25,
  height: 2,
  selling_price: 2499.00,
  currency: 'EUR',
  vat_rate: 20.0,
  is_fragile: true,
});

// Palettes et colis (hiérarchie conteneurs)
const palette = await client.createDeliveryItem({
  name: 'Palette Export EU',
  item_type: ItemType.PALLET,
  weight: 25,
  weight_unit: WeightUnit.KG,
});
```

#### Visites & Planification de tournées

Planifiez des arrêts de livraison, d'enlèvement ou de service aux points de livraison avec affectation chauffeur et véhicule.

```typescript
import { VisitType } from 'mapflow-co-sdk';

const visite = await client.createVisit({
  location: pointLivraison.id,
  visit_type: VisitType.DELIVERY,
  visit_date: '2026-04-01',
  planned_arrival_time: '2026-04-01T09:00:00.000Z',
  planned_departure_time: '2026-04-01T10:00:00.000Z',
  driver: chauffeur.id,
  vehicle: vehicule.id,
  priority: 3,
  notes: 'Appeler avant livraison',
  products: [{ product: produit.id, quantity: 3 }],
});

// Lister les tournées du jour
const visitesDuJour = await client.listVisits({
  visit_date: '2026-04-01',
  visit_type: 'delivery',
});
```

#### Création globale client (atomique)

Créez un client, un point de livraison, un contact et les horaires d'ouverture en une seule requête atomique.

```typescript
import { CustomerType, DayOfWeek } from 'mapflow-co-sdk';

const globalClient = await client.createGlobalCustomer({
  customer_type: CustomerType.COMPANY,
  company_name: 'Epicerie du Marché SARL',
  email: 'contact@epicerie-marche.fr',
  delivery_location: {
    name: 'Magasin principal',
    address: '15 Place du Marché',
    zip_code: '31000',
    city: 'Toulouse',
    country: 'FR',
    latitude: 43.6047,
    longitude: 1.4442,
  },
  contact: {
    first_name: 'Sophie',
    last_name: 'Bernard',
    position: 'Responsable Approvisionnement',
    emails: ['sophie@epicerie-marche.fr'],
    phones: ['+33561234567'],
    is_primary: true,
  },
  opening_hours: [
    { day_of_week: DayOfWeek.MONDAY, opening_time: '08:00:00', closing_time: '19:00:00' },
    { day_of_week: DayOfWeek.TUESDAY, opening_time: '08:00:00', closing_time: '19:00:00' },
    { day_of_week: DayOfWeek.WEDNESDAY, opening_time: '08:00:00', closing_time: '19:00:00' },
    { day_of_week: DayOfWeek.THURSDAY, opening_time: '08:00:00', closing_time: '19:00:00' },
    { day_of_week: DayOfWeek.FRIDAY, opening_time: '08:00:00', closing_time: '20:00:00' },
    { day_of_week: DayOfWeek.SATURDAY, opening_time: '09:00:00', closing_time: '13:00:00' },
  ],
});
```

### Pagination

```typescript
const page = await client.listCustomers({ page: 1, page_size: 20 });
console.log(`Total clients : ${page.count}`);

// Itérer toutes les pages
async function* tousLesClients() {
  let pageNum = 1;
  while (true) {
    const p = await client.listCustomers({ page: pageNum, page_size: 50 });
    yield* p.results;
    if (!p.next) break;
    pageNum++;
  }
}

for await (const c of tousLesClients()) {
  console.log(c.display_name);
}
```

### Actions groupées (Bulk Operations)

```typescript
// Activer plusieurs clients
await client.customerBulkAction({ action: 'activate', customer_ids: [id1, id2, id3] });

// Changer le statut de plusieurs véhicules
await client.vehicleBulkAction({ action: 'change_status', vehicle_ids: [v1, v2], new_status: 'maintenance' });

// Étiqueter des clients en masse
await client.customerBulkAction({ action: 'add_tags', customer_ids: [id1, id2], tag_ids: [tag.id] });

// Mettre à jour les quantités de produits en tournée
await client.visitProductBulkAction({ action: 'update_quantity', visitproduct_ids: [vp1, vp2], new_quantity: 5 });
```

### Gestion des erreurs

```typescript
import {
  MapFlowError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ServerError,
} from 'mapflow-co-sdk';

try {
  await client.getCustomer(clientId);
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Clé API invalide — vérifiez app.mapflow.co → Paramètres → Clés API');
  } else if (error instanceof NotFoundError) {
    console.error('Client introuvable');
  } else if (error instanceof ValidationError) {
    console.error('Erreur de validation :', error.message);
    console.error('Détails :', error.response);
  } else if (error instanceof RateLimitError) {
    console.error('Limite de requêtes dépassée — ralentissez vos appels API');
  } else if (error instanceof ServerError) {
    console.error('Erreur serveur MapFlow — réessayez plus tard');
  } else if (error instanceof MapFlowError) {
    console.error(`Erreur ${error.statusCode} : ${error.message}`);
  }
}
```

### Référence des énumérations

| Enum | Valeurs |
|------|---------|
| `CustomerType` | `individual` (particulier), `company` (entreprise) |
| `ItemType` | `PRODUCT` (produit), `SERVICE`, `PACKAGE` (colis), `PALLET` (palette) |
| `VisitType` | `delivery` (livraison), `pickup` (enlèvement), `service`, `delivery_pickup` |
| `VehicleType` | `bicycle`, `cargo_bike`, `motorcycle`, `van_small`, `van_medium`, `van_large`, `truck_small`, `truck_medium`, `truck_large`, `semi_trailer`, `refrigerated` (frigorifique), … |
| `VehicleStatus` | `available` (disponible), `in_use` (en cours), `maintenance`, `broken` (en panne), `retired` (retiré) |
| `EnergyType` | `gasoline` (essence), `diesel`, `electric` (électrique), `hybrid` (hybride), `hydrogen` (hydrogène) |
| `DriverLicenceType` | `B`, `C`, `CE`, `C1`, `C1E`, `D`, `DE` |
| `WarehouseType` | `distribution`, `storage` (stockage), `hub`, `pickup` (retrait), `cross_dock`, `other` |
| `WeightUnit` | `kg`, `g`, `lb`, `oz`, `t` |
| `DayOfWeek` | `MONDAY` (lundi, 0) … `SUNDAY` (dimanche, 6) |

### Support

- **Site web** : https://mapflow.co
- **Documentation API** : https://mapflow.readme.io/reference
- **npm** : https://www.npmjs.com/package/mapflow-co-sdk
- **GitHub Issues** : https://github.com/mapflow-co/node-sdk/issues
- **Email** : support@mapflow.co
- **SDK Python** : https://github.com/mapflow-co/python-sdk

---

## License / Licence

MIT © [MapFlow](https://mapflow.co)
