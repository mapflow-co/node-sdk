/**
 * Type definitions for MapFlow SDK
 */

// ============================================================================
// Enums
// ============================================================================

export enum CustomerType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company',
}

export enum ItemType {
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE',
  PACKAGE = 'PACKAGE',
  PALLET = 'PALLET',
}

export enum WeightUnit {
  KG = 'kg',
  G = 'g',
  LB = 'lb',
  OZ = 'oz',
  T = 't',
}

export enum VolumeUnit {
  M3 = 'm3',
  L = 'l',
  ML = 'ml',
  CM3 = 'cm3',
  FT3 = 'ft3',
  GAL = 'gal',
}

export enum DurationUnit {
  MINUTES = 'minutes',
  HOURS = 'hours',
  DAYS = 'days',
}

export enum DayOfWeek {
  MONDAY = 0,
  TUESDAY = 1,
  WEDNESDAY = 2,
  THURSDAY = 3,
  FRIDAY = 4,
  SATURDAY = 5,
  SUNDAY = 6,
}

export enum VehicleType {
  BICYCLE = 'bicycle',
  CARGO_BIKE = 'cargo_bike',
  ELECTRIC_SCOOTER = 'electric_scooter',
  SCOOTER_50 = 'scooter_50',
  SCOOTER_125 = 'scooter_125',
  MOTORCYCLE = 'motorcycle',
  CAR = 'car',
  VAN_SMALL = 'van_small',
  VAN_MEDIUM = 'van_medium',
  VAN_LARGE = 'van_large',
  VAN_XL = 'van_xl',
  TRUCK_SMALL = 'truck_small',
  TRUCK_MEDIUM = 'truck_medium',
  TRUCK_LARGE = 'truck_large',
  TRUCK_XL = 'truck_xl',
  TRUCK_TRAILER = 'truck_trailer',
  SEMI_TRAILER = 'semi_trailer',
  REFRIGERATED = 'refrigerated',
  TANKER = 'tanker',
}

export enum EnergyType {
  GASOLINE = 'gasoline',
  DIESEL = 'diesel',
  ELECTRIC = 'electric',
  HYBRID = 'hybrid',
  LPG = 'lpg',
  CNG = 'cng',
  HYDROGEN = 'hydrogen',
}

export enum VehicleStatus {
  AVAILABLE = 'available',
  IN_USE = 'in_use',
  MAINTENANCE = 'maintenance',
  BROKEN = 'broken',
  IMPOUNDED = 'impounded',
  IMMOBILIZED = 'immobilized',
  RETIRED = 'retired',
}

export enum DriverLicenceType {
  B = 'B',
  C = 'C',
  CE = 'CE',
  C1 = 'C1',
  C1E = 'C1E',
  D = 'D',
  DE = 'DE',
}

export enum WarehouseType {
  HUB = 'hub',
  DISTRIBUTION = 'distribution',
  STORAGE = 'storage',
  PICKUP = 'pickup',
  CROSS_DOCK = 'cross_dock',
  OTHER = 'other',
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  OPERATOR = 'operator',
  DRIVER = 'driver',
}

export enum Department {
  LOGISTICS = 'logistics',
  WAREHOUSE = 'warehouse',
  DELIVERY = 'delivery',
  CUSTOMER_SERVICE = 'customer_service',
  SALES = 'sales',
}

export enum Language {
  FR = 'fr',
  EN = 'en',
  ES = 'es',
  DE = 'de',
  IT = 'it',
}

export enum WarehouseCertification {
  ISO_9001 = 'ISO_9001',
  ISO_14001 = 'ISO_14001',
  HACCP = 'HACCP',
  GDP = 'GDP',
}

export enum KmSource {
  MANUAL = 'manual',
  GPS = 'gps',
  OBD = 'obd',
  FUEL = 'fuel',
}

export enum VisitType {
  DELIVERY = 'delivery',
  PICKUP = 'pickup',
  SERVICE = 'service',
  DELIVERY_PICKUP = 'delivery_pickup',
}

// ============================================================================
// Base Interfaces
// ============================================================================

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface MapFlowConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

// ============================================================================
// Customer Models
// ============================================================================

export interface CustomerBase {
  customer_type: CustomerType;
  company_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  billing_address?: string;
  billing_zip_code?: string;
  billing_city?: string;
  billing_country?: string;
  billing_state?: string;
  notes?: string;
  is_active?: boolean;
  external_id?: string;
  external_reference?: string;
  tags?: string[];
}

export interface CustomerCreate extends CustomerBase {}

export interface CustomerUpdate extends Partial<CustomerBase> {}

export interface Customer extends CustomerBase {
  id: string;
  display_name: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Delivery Location Models
// ============================================================================

export interface DeliveryLocationBase {
  customer: string;
  name: string;
  address: string;
  zip_code: string;
  city: string;
  country?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  delivery_instructions?: string;
  access_code?: string;
  floor?: string;
  building?: string;
  notes?: string;
  is_active?: boolean;
  external_id?: string;
  external_reference?: string;
  tags?: string[];
}

export interface DeliveryLocationCreate extends DeliveryLocationBase {}

export interface DeliveryLocationUpdate extends Partial<Omit<DeliveryLocationBase, 'customer'>> {}

export interface DeliveryLocation extends DeliveryLocationBase {
  id: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Warehouse Models
// ============================================================================

export interface WarehouseBase {
  name: string;
  code?: string;
  warehouse_type: WarehouseType;
  address: string;
  zip_code: string;
  city: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  opening_time?: string;
  closing_time?: string;
  capacity_m3?: number;
  capacity_pallets?: number;
  max_weight_capacity_kg?: number;
  max_vehicles?: number;
  has_loading_dock?: boolean;
  has_forklift?: boolean;
  has_crane?: boolean;
  has_cold_storage?: boolean;
  has_security?: boolean;
  has_parking?: boolean;
  is_start_point?: boolean;
  is_end_point?: boolean;
  is_break_point?: boolean;
  cost_per_hour?: number;
  cost_per_m3?: number;
  is_active?: boolean;
  is_default?: boolean;
  access_instructions?: string;
  loading_instructions?: string;
  special_requirements?: string;
  internal_notes?: string;
  external_id?: string;
  external_reference?: string;
  certifications?: WarehouseCertification[];
}

export interface WarehouseCreate extends WarehouseBase {}

export interface WarehouseUpdate extends Partial<WarehouseBase> {}

export interface Warehouse extends WarehouseBase {
  id: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Global Customer Models
// ============================================================================

export interface GlobalCustomerCreate {
  customer_type: CustomerType;
  email?: string;
  phone?: string;
  emails?: string[];
  phones?: string[];
  company_name?: string;
  siret?: string;
  vat_number?: string;
  first_name?: string;
  last_name?: string;
  billing_address?: string;
  billing_zip_code?: string;
  billing_city?: string;
  billing_country?: string;
  external_reference?: string;
  external_id?: string;
  is_active?: boolean;
  notes?: string;
  delivery_location: Record<string, any>;
  contact?: Record<string, any>;
  opening_hours?: Record<string, any>[];
}

export interface GlobalCustomer {
  customer: Customer;
  delivery_location: DeliveryLocation;
  contact?: LocationContact;
  opening_hours?: LocationOpeningHours[];
}

// ============================================================================
// Contact Models
// ============================================================================

export interface LocationContactBase {
  first_name: string;
  last_name: string;
  position?: string;
  emails?: string[];
  phones?: string[];
  is_primary?: boolean;
  is_active?: boolean;
  notes?: string;
}

export interface LocationContactCreate extends LocationContactBase {
  location_ids: string[];
}

export interface LocationContactUpdate extends Partial<LocationContactBase> {
  location_ids?: string[];
}

export interface LocationContact extends LocationContactBase {
  id: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Opening Hours Models
// ============================================================================

export interface LocationOpeningHoursBase {
  location: string;
  day_of_week: DayOfWeek;
  opening_time?: string;
  closing_time?: string;
  is_closed?: boolean;
  break_start?: string;
  break_end?: string;
  notes?: string;
}

export interface LocationOpeningHoursCreate extends LocationOpeningHoursBase {}

export interface LocationOpeningHoursUpdate extends Partial<Omit<LocationOpeningHoursBase, 'location'>> {}

export interface LocationOpeningHours extends LocationOpeningHoursBase {
  id: string;
  location_name?: string;
  day_name?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Delivery Item Models
// ============================================================================

export interface DeliveryItemBase {
  name: string;
  item_type: ItemType;
  reference?: string;
  barcode?: string;
  description?: string;
  external_id?: string;
  external_reference?: string;
  weight?: number;
  weight_unit?: WeightUnit;
  length?: number;
  width?: number;
  height?: number;
  volume?: number;
  volume_unit?: VolumeUnit;
  temperature_min?: number;
  temperature_max?: number;
  is_fragile?: boolean;
  is_dangerous?: boolean;
  is_biohazard?: boolean;
  declared_value?: number;
  currency?: string;
  buying_price?: number;
  selling_price?: number;
  vat_rate?: number;
  estimated_delivery_duration?: number;
  estimated_delivery_duration_unit?: DurationUnit;
  package_code?: string;
  number_of_packages?: number;
  is_active?: boolean;
  notes?: string;
}

export interface DeliveryItemCreate extends DeliveryItemBase {}

export interface DeliveryItemUpdate extends Partial<DeliveryItemBase> {}

export interface DeliveryItem extends DeliveryItemBase {
  id: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Driver/Picker Models
// ============================================================================

export interface DriverPickerBase {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role?: UserRole;
  department?: Department;
  employee_id?: string;
  timezone?: string;
  language?: Language;
  has_valid_driving_license?: boolean;
  driver_license_number?: string;
  driver_licence_type?: DriverLicenceType[];
  last_license_check_date?: string;
  vehicle_types?: VehicleType[];
  warehouse_certifications?: WarehouseCertification[];
  notifications_email?: boolean;
  notifications_sms?: boolean;
  notifications_push?: boolean;
  is_active?: boolean;
  notes?: string;
  tags?: string[];
}

export interface DriverPickerCreate extends DriverPickerBase {}

export interface DriverPickerUpdate extends Partial<Omit<DriverPickerBase, 'email'>> {}

export interface DriverPicker extends DriverPickerBase {
  id: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Vehicle Models
// ============================================================================

export interface VehicleBase {
  name: string;
  license_plate?: string;
  reference?: string;
  external_id?: string;
  external_reference?: string;
  assigned_warehouses?: string[];
  tags?: string[];
  vehicle_type?: string;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  latitude?: number;
  longitude?: number;
  max_weight_kg?: number;
  max_volume_m3?: number;
  max_distance_km?: number;
  fixed_cost?: number;
  cost_per_km?: number;
  cost_per_hour?: number;
  max_items_count?: number;
  max_speed?: number;
  energy_type?: string;
  consumption_per_100km?: number;
  tank_capacity?: number;
  fuel_level?: number;
  remaining_range?: number;
  status?: string;
  required_licence_type?: string;
  acquisition_date?: string;
  current_km?: number;
  last_km_update?: string;
  last_km_source?: string;
  technical_inspection_expiry?: string;
  fuel_card_number?: string;
  notes?: string;
}

export interface VehicleCreate extends VehicleBase {}

export interface VehicleUpdate extends Partial<VehicleBase> {}

export interface Vehicle extends VehicleBase {
  id: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Tag Models
// ============================================================================

export interface TagBase {
  name: string;
  color?: string;
  description?: string;
}

export interface TagCreate extends TagBase {}

export interface TagUpdate extends Partial<TagBase> {}

export interface Tag extends TagBase {
  id: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Visit Models
// ============================================================================

export interface VisitBase {
  location: string;
  visit_type: VisitType;
  reference?: string;
  external_id?: string;
  external_reference?: string;
  visit_date?: string;
  planned_arrival_time?: string;
  planned_departure_time?: string;
  actual_arrival_time?: string;
  actual_departure_time?: string;
  priority?: number;
  status?: string;
  driver?: number;
  vehicle?: string;
  notes?: string;
  delivery_notes?: string;
  customer_signature?: string;
  driver_signature?: string;
  is_completed?: boolean;
  tags?: string[];
  products?: Array<{ product: string; quantity: number }>;
}

export interface VisitCreate extends VisitBase {}

export interface VisitUpdate extends Partial<Omit<VisitBase, 'location'>> {}

export interface Visit extends VisitBase {
  id: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Visit Product Models
// ============================================================================

export interface VisitProductBase {
  visit: string;
  product: string;
  quantity: number;
}

export interface VisitProductCreate extends VisitProductBase {}

export interface VisitProductUpdate extends Partial<Omit<VisitProductBase, 'visit' | 'product'>> {}

export interface VisitProduct extends VisitProductBase {
  id: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Bulk Action Types
// ============================================================================

export interface BulkActionRequest {
  action: string;
  [key: string]: any;
}

export interface BulkActionResponse {
  success: boolean;
  message?: string;
  results?: any;
}

