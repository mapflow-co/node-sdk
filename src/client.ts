/**
 * MapFlow API Client
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  MapFlowConfig,
  PaginatedResponse,
  Customer,
  CustomerCreate,
  CustomerUpdate,
  DeliveryLocation,
  DeliveryLocationCreate,
  DeliveryLocationUpdate,
  Warehouse,
  WarehouseCreate,
  WarehouseUpdate,
  GlobalCustomer,
  GlobalCustomerCreate,
  LocationContact,
  LocationContactCreate,
  LocationContactUpdate,
  LocationOpeningHours,
  LocationOpeningHoursCreate,
  LocationOpeningHoursUpdate,
  DeliveryItem,
  DeliveryItemCreate,
  DeliveryItemUpdate,
  DriverPicker,
  DriverPickerCreate,
  DriverPickerUpdate,
  Vehicle,
  VehicleCreate,
  VehicleUpdate,
  Tag,
  TagCreate,
  TagUpdate,
  Visit,
  VisitCreate,
  VisitUpdate,
  VisitProduct,
  VisitProductCreate,
  VisitProductUpdate,
  BulkActionRequest,
  BulkActionResponse,
} from './types';
import {
  MapFlowError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
  ForbiddenError,
  ServerError,
  RateLimitError,
} from './errors';

const DEFAULT_BASE_URL = 'https://api.mapflow.co';
const DEFAULT_TIMEOUT = 30000;

export class MapFlowClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(config: MapFlowConfig) {
    this.apiKey = config.apiKey;

    this.client = axios.create({
      baseURL: config.baseUrl || DEFAULT_BASE_URL,
      timeout: config.timeout || DEFAULT_TIMEOUT,
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const { status, data } = error.response;
          
          // Build detailed error message
          let message = data?.detail || data?.message || error.message;
          
          // If data contains validation errors (object with field errors), format them
          if (data && typeof data === 'object' && !data.detail && !data.message) {
            const errorMessages: string[] = [];
            for (const [field, errors] of Object.entries(data)) {
              if (Array.isArray(errors)) {
                errorMessages.push(`${field}: ${errors.join(', ')}`);
              } else if (typeof errors === 'string') {
                errorMessages.push(`${field}: ${errors}`);
              }
            }
            if (errorMessages.length > 0) {
              message = errorMessages.join('; ');
            }
          }

          switch (status) {
            case 400:
              throw new ValidationError(message, data);
            case 401:
              throw new AuthenticationError(message, data);
            case 403:
              throw new ForbiddenError(message, data);
            case 404:
              throw new NotFoundError(message, data);
            case 429:
              throw new RateLimitError(message, data);
            case 500:
            case 502:
            case 503:
            case 504:
              throw new ServerError(message, data);
            default:
              throw new MapFlowError(message, status, data);
          }
        }
        throw new MapFlowError(error.message);
      }
    );
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    // Add /api/v1 prefix if not already present
    if (config.url && !config.url.startsWith('/api/')) {
      config.url = `/api/v1${config.url}`;
    }
    const response: AxiosResponse<T> = await this.client.request(config);
    return response.data;
  }

  // ========================================================================
  // Customer Methods
  // ========================================================================

  async listCustomers(params?: Record<string, any>): Promise<PaginatedResponse<Customer>> {
    return this.request<PaginatedResponse<Customer>>({
      method: 'GET',
      url: '/locations/customers/',
      params,
    });
  }

  async createCustomer(data: CustomerCreate): Promise<Customer> {
    return this.request<Customer>({
      method: 'POST',
      url: '/locations/customers/',
      data,
    });
  }

  async getCustomer(id: string): Promise<Customer> {
    return this.request<Customer>({
      method: 'GET',
      url: `/locations/customers/${id}/`,
    });
  }

  async updateCustomer(id: string, data: CustomerUpdate): Promise<Customer> {
    return this.request<Customer>({
      method: 'PUT',
      url: `/locations/customers/${id}/`,
      data,
    });
  }

  async patchCustomer(id: string, data: Partial<CustomerUpdate>): Promise<Customer> {
    return this.request<Customer>({
      method: 'PATCH',
      url: `/locations/customers/${id}/`,
      data,
    });
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.request<void>({
      method: 'DELETE',
      url: `/locations/customers/${id}/`,
    });
  }

  async customerBulkAction(action: BulkActionRequest): Promise<BulkActionResponse> {
    return this.request<BulkActionResponse>({
      method: 'POST',
      url: '/locations/customers/bulk_action/',
      data: action,
    });
  }

  // ========================================================================
  // Delivery Location Methods
  // ========================================================================

  async listDeliveryLocations(params?: Record<string, any>): Promise<PaginatedResponse<DeliveryLocation>> {
    return this.request<PaginatedResponse<DeliveryLocation>>({
      method: 'GET',
      url: '/locations/delivery-locations/',
      params,
    });
  }

  async createDeliveryLocation(data: DeliveryLocationCreate): Promise<DeliveryLocation> {
    return this.request<DeliveryLocation>({
      method: 'POST',
      url: '/locations/delivery-locations/',
      data,
    });
  }

  async getDeliveryLocation(id: string): Promise<DeliveryLocation> {
    return this.request<DeliveryLocation>({
      method: 'GET',
      url: `/locations/delivery-locations/${id}/`,
    });
  }

  async updateDeliveryLocation(id: string, data: DeliveryLocationUpdate): Promise<DeliveryLocation> {
    return this.request<DeliveryLocation>({
      method: 'PUT',
      url: `/locations/delivery-locations/${id}/`,
      data,
    });
  }

  async patchDeliveryLocation(id: string, data: Partial<DeliveryLocationUpdate>): Promise<DeliveryLocation> {
    return this.request<DeliveryLocation>({
      method: 'PATCH',
      url: `/locations/delivery-locations/${id}/`,
      data,
    });
  }

  async deleteDeliveryLocation(id: string): Promise<void> {
    await this.request<void>({
      method: 'DELETE',
      url: `/locations/delivery-locations/${id}/`,
    });
  }

  async deliveryLocationBulkAction(action: BulkActionRequest): Promise<BulkActionResponse> {
    return this.request<BulkActionResponse>({
      method: 'POST',
      url: '/locations/delivery-locations/bulk_action/',
      data: action,
    });
  }

  // ========================================================================
  // Warehouse Methods
  // ========================================================================

  async listWarehouses(params?: Record<string, any>): Promise<PaginatedResponse<Warehouse>> {
    return this.request<PaginatedResponse<Warehouse>>({
      method: 'GET',
      url: '/locations/warehouses/',
      params,
    });
  }

  async createWarehouse(data: WarehouseCreate): Promise<Warehouse> {
    return this.request<Warehouse>({
      method: 'POST',
      url: '/locations/warehouses/',
      data,
    });
  }

  async getWarehouse(id: string): Promise<Warehouse> {
    return this.request<Warehouse>({
      method: 'GET',
      url: `/locations/warehouses/${id}/`,
    });
  }

  async updateWarehouse(id: string, data: WarehouseUpdate): Promise<Warehouse> {
    return this.request<Warehouse>({
      method: 'PUT',
      url: `/locations/warehouses/${id}/`,
      data,
    });
  }

  async patchWarehouse(id: string, data: Partial<WarehouseUpdate>): Promise<Warehouse> {
    return this.request<Warehouse>({
      method: 'PATCH',
      url: `/locations/warehouses/${id}/`,
      data,
    });
  }

  async deleteWarehouse(id: string): Promise<void> {
    await this.request<void>({
      method: 'DELETE',
      url: `/locations/warehouses/${id}/`,
    });
  }

  async setDefaultWarehouse(id: string): Promise<Warehouse> {
    return this.request<Warehouse>({
      method: 'POST',
      url: `/locations/warehouses/${id}/set_default/`,
    });
  }

  async warehouseBulkAction(action: BulkActionRequest): Promise<BulkActionResponse> {
    return this.request<BulkActionResponse>({
      method: 'POST',
      url: '/locations/warehouses/bulk_action/',
      data: action,
    });
  }

  // ========================================================================
  // Global Customer Methods
  // ========================================================================

  async createGlobalCustomer(data: GlobalCustomerCreate): Promise<GlobalCustomer> {
    return this.request<GlobalCustomer>({
      method: 'POST',
      url: '/locations/global-customers/',
      data,
    });
  }

  // ========================================================================
  // Contact Methods
  // ========================================================================

  async listContacts(params?: Record<string, any>): Promise<PaginatedResponse<LocationContact>> {
    return this.request<PaginatedResponse<LocationContact>>({
      method: 'GET',
      url: '/locations/contacts/',
      params,
    });
  }

  async createContact(data: LocationContactCreate): Promise<LocationContact> {
    return this.request<LocationContact>({
      method: 'POST',
      url: '/locations/contacts/',
      data,
    });
  }

  async getContact(id: string): Promise<LocationContact> {
    return this.request<LocationContact>({
      method: 'GET',
      url: `/locations/contacts/${id}/`,
    });
  }

  async updateContact(id: string, data: LocationContactUpdate): Promise<LocationContact> {
    return this.request<LocationContact>({
      method: 'PUT',
      url: `/locations/contacts/${id}/`,
      data,
    });
  }

  async patchContact(id: string, data: Partial<LocationContactUpdate>): Promise<LocationContact> {
    return this.request<LocationContact>({
      method: 'PATCH',
      url: `/locations/contacts/${id}/`,
      data,
    });
  }

  async deleteContact(id: string): Promise<void> {
    await this.request<void>({
      method: 'DELETE',
      url: `/locations/contacts/${id}/`,
    });
  }

  // ========================================================================
  // Opening Hours Methods
  // ========================================================================

  async listOpeningHours(params?: Record<string, any>): Promise<PaginatedResponse<LocationOpeningHours>> {
    return this.request<PaginatedResponse<LocationOpeningHours>>({
      method: 'GET',
      url: '/locations/opening-hours/',
      params,
    });
  }

  async createOpeningHours(data: LocationOpeningHoursCreate): Promise<LocationOpeningHours> {
    return this.request<LocationOpeningHours>({
      method: 'POST',
      url: '/locations/opening-hours/',
      data,
    });
  }

  async getOpeningHours(id: string): Promise<LocationOpeningHours> {
    return this.request<LocationOpeningHours>({
      method: 'GET',
      url: `/locations/opening-hours/${id}/`,
    });
  }

  async updateOpeningHours(id: string, data: LocationOpeningHoursUpdate): Promise<LocationOpeningHours> {
    return this.request<LocationOpeningHours>({
      method: 'PUT',
      url: `/locations/opening-hours/${id}/`,
      data,
    });
  }

  async patchOpeningHours(id: string, data: Partial<LocationOpeningHoursUpdate>): Promise<LocationOpeningHours> {
    return this.request<LocationOpeningHours>({
      method: 'PATCH',
      url: `/locations/opening-hours/${id}/`,
      data,
    });
  }

  async deleteOpeningHours(id: string): Promise<void> {
    await this.request<void>({
      method: 'DELETE',
      url: `/locations/opening-hours/${id}/`,
    });
  }

  // ========================================================================
  // Delivery Item Methods
  // ========================================================================

  async listDeliveryItems(params?: Record<string, any>): Promise<PaginatedResponse<DeliveryItem>> {
    return this.request<PaginatedResponse<DeliveryItem>>({
      method: 'GET',
      url: '/catalog/delivery-items/',
      params,
    });
  }

  async createDeliveryItem(data: DeliveryItemCreate): Promise<DeliveryItem> {
    return this.request<DeliveryItem>({
      method: 'POST',
      url: '/catalog/delivery-items/',
      data,
    });
  }

  async getDeliveryItem(id: string): Promise<DeliveryItem> {
    return this.request<DeliveryItem>({
      method: 'GET',
      url: `/catalog/delivery-items/${id}/`,
    });
  }

  async updateDeliveryItem(id: string, data: DeliveryItemUpdate): Promise<DeliveryItem> {
    return this.request<DeliveryItem>({
      method: 'PUT',
      url: `/catalog/delivery-items/${id}/`,
      data,
    });
  }

  async patchDeliveryItem(id: string, data: Partial<DeliveryItemUpdate>): Promise<DeliveryItem> {
    return this.request<DeliveryItem>({
      method: 'PATCH',
      url: `/catalog/delivery-items/${id}/`,
      data,
    });
  }

  async deleteDeliveryItem(id: string): Promise<void> {
    await this.request<void>({
      method: 'DELETE',
      url: `/catalog/delivery-items/${id}/`,
    });
  }

  async deliveryItemBulkAction(action: BulkActionRequest): Promise<BulkActionResponse> {
    return this.request<BulkActionResponse>({
      method: 'POST',
      url: '/catalog/delivery-items/bulk_action/',
      data: action,
    });
  }

  // ========================================================================
  // Driver/Picker Methods
  // ========================================================================

  async listDrivers(params?: Record<string, any>): Promise<PaginatedResponse<DriverPicker>> {
    return this.request<PaginatedResponse<DriverPicker>>({
      method: 'GET',
      url: '/drivers-pickers/people/',
      params,
    });
  }

  async createDriver(data: DriverPickerCreate): Promise<DriverPicker> {
    return this.request<DriverPicker>({
      method: 'POST',
      url: '/drivers-pickers/people/',
      data,
    });
  }

  async getDriver(id: string): Promise<DriverPicker> {
    return this.request<DriverPicker>({
      method: 'GET',
      url: `/drivers-pickers/people/${id}/`,
    });
  }

  async updateDriver(id: string, data: DriverPickerUpdate): Promise<DriverPicker> {
    return this.request<DriverPicker>({
      method: 'PUT',
      url: `/drivers-pickers/people/${id}/`,
      data,
    });
  }

  async patchDriver(id: string, data: Partial<DriverPickerUpdate>): Promise<DriverPicker> {
    return this.request<DriverPicker>({
      method: 'PATCH',
      url: `/drivers-pickers/people/${id}/`,
      data,
    });
  }

  async deleteDriver(id: string): Promise<void> {
    await this.request<void>({
      method: 'DELETE',
      url: `/drivers-pickers/people/${id}/`,
    });
  }

  // ========================================================================
  // Vehicle Methods
  // ========================================================================

  async listVehicles(params?: Record<string, any>): Promise<Vehicle[]> {
    return this.request<Vehicle[]>({
      method: 'GET',
      url: '/vehicles/vehicles/',
      params,
    });
  }

  async createVehicle(data: VehicleCreate): Promise<Vehicle> {
    return this.request<Vehicle>({
      method: 'POST',
      url: '/vehicles/vehicles/',
      data,
    });
  }

  async getVehicle(id: string): Promise<Vehicle> {
    return this.request<Vehicle>({
      method: 'GET',
      url: `/vehicles/vehicles/${id}/`,
    });
  }

  async updateVehicle(id: string, data: VehicleUpdate): Promise<Vehicle> {
    return this.request<Vehicle>({
      method: 'PUT',
      url: `/vehicles/vehicles/${id}/`,
      data,
    });
  }

  async patchVehicle(id: string, data: Partial<VehicleUpdate>): Promise<Vehicle> {
    return this.request<Vehicle>({
      method: 'PATCH',
      url: `/vehicles/vehicles/${id}/`,
      data,
    });
  }

  async deleteVehicle(id: string): Promise<void> {
    await this.request<void>({
      method: 'DELETE',
      url: `/vehicles/vehicles/${id}/`,
    });
  }

  async vehicleBulkAction(action: BulkActionRequest): Promise<BulkActionResponse> {
    return this.request<BulkActionResponse>({
      method: 'POST',
      url: '/vehicles/vehicles/bulk_action/',
      data: action,
    });
  }

  // ========================================================================
  // Tag Methods
  // ========================================================================

  async listTags(params?: Record<string, any>): Promise<PaginatedResponse<Tag>> {
    return this.request<PaginatedResponse<Tag>>({
      method: 'GET',
      url: '/tags/visits/',
      params,
    });
  }

  async createTag(data: TagCreate): Promise<Tag> {
    return this.request<Tag>({
      method: 'POST',
      url: '/tags/visits/',
      data,
    });
  }

  async getTag(id: string): Promise<Tag> {
    return this.request<Tag>({
      method: 'GET',
      url: `/tags/visits/${id}/`,
    });
  }

  async updateTag(id: string, data: TagUpdate): Promise<Tag> {
    return this.request<Tag>({
      method: 'PUT',
      url: `/tags/visits/${id}/`,
      data,
    });
  }

  async patchTag(id: string, data: Partial<TagUpdate>): Promise<Tag> {
    return this.request<Tag>({
      method: 'PATCH',
      url: `/tags/visits/${id}/`,
      data,
    });
  }

  async deleteTag(id: string): Promise<void> {
    await this.request<void>({
      method: 'DELETE',
      url: `/tags/visits/${id}/`,
    });
  }

  async tagBulkAction(action: BulkActionRequest): Promise<BulkActionResponse> {
    return this.request<BulkActionResponse>({
      method: 'POST',
      url: '/tags/visits/bulk_action/',
      data: action,
    });
  }

  // ========================================================================
  // Visit Methods
  // ========================================================================

  async listVisits(params?: Record<string, any>): Promise<PaginatedResponse<Visit>> {
    return this.request<PaginatedResponse<Visit>>({
      method: 'GET',
      url: '/visits/',
      params,
    });
  }

  async createVisit(data: VisitCreate): Promise<Visit> {
    return this.request<Visit>({
      method: 'POST',
      url: '/visits/',
      data,
    });
  }

  async getVisit(id: string): Promise<Visit> {
    return this.request<Visit>({
      method: 'GET',
      url: `/visits/${id}/`,
    });
  }

  async updateVisit(id: string, data: VisitUpdate): Promise<Visit> {
    return this.request<Visit>({
      method: 'PUT',
      url: `/visits/${id}/`,
      data,
    });
  }

  async patchVisit(id: string, data: Partial<VisitUpdate>): Promise<Visit> {
    return this.request<Visit>({
      method: 'PATCH',
      url: `/visits/${id}/`,
      data,
    });
  }

  async deleteVisit(id: string): Promise<void> {
    await this.request<void>({
      method: 'DELETE',
      url: `/visits/${id}/`,
    });
  }

  async visitBulkAction(action: BulkActionRequest): Promise<BulkActionResponse> {
    return this.request<BulkActionResponse>({
      method: 'POST',
      url: '/visits/bulk_action/',
      data: action,
    });
  }

  // ========================================================================
  // Visit Product Methods
  // ========================================================================

  async listVisitProducts(params?: Record<string, any>): Promise<PaginatedResponse<VisitProduct>> {
    return this.request<PaginatedResponse<VisitProduct>>({
      method: 'GET',
      url: '/visits/products/',
      params,
    });
  }

  async createVisitProduct(data: VisitProductCreate): Promise<VisitProduct> {
    return this.request<VisitProduct>({
      method: 'POST',
      url: '/visits/products/',
      data,
    });
  }

  async getVisitProduct(id: string): Promise<VisitProduct> {
    return this.request<VisitProduct>({
      method: 'GET',
      url: `/visits/products/${id}/`,
    });
  }

  async updateVisitProduct(id: string, data: VisitProductUpdate): Promise<VisitProduct> {
    return this.request<VisitProduct>({
      method: 'PUT',
      url: `/visits/products/${id}/`,
      data,
    });
  }

  async patchVisitProduct(id: string, data: Partial<VisitProductUpdate>): Promise<VisitProduct> {
    return this.request<VisitProduct>({
      method: 'PATCH',
      url: `/visits/products/${id}/`,
      data,
    });
  }

  async deleteVisitProduct(id: string): Promise<void> {
    await this.request<void>({
      method: 'DELETE',
      url: `/visits/products/${id}/`,
    });
  }

  async visitProductBulkAction(action: BulkActionRequest): Promise<BulkActionResponse> {
    return this.request<BulkActionResponse>({
      method: 'POST',
      url: '/visits/products/bulk_action/',
      data: action,
    });
  }
}

