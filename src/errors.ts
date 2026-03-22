/**
 * Custom error classes for MapFlow SDK
 */

export class MapFlowError extends Error {
  public statusCode?: number;
  public response?: any;

  constructor(message: string, statusCode?: number, response?: any) {
    super(message);
    this.name = 'MapFlowError';
    this.statusCode = statusCode;
    this.response = response;
    Object.setPrototypeOf(this, MapFlowError.prototype);
  }
}

export class AuthenticationError extends MapFlowError {
  constructor(message: string = 'Authentication failed', response?: any) {
    super(message, 401, response);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class NotFoundError extends MapFlowError {
  constructor(message: string = 'Resource not found', response?: any) {
    super(message, 404, response);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ValidationError extends MapFlowError {
  constructor(message: string = 'Validation failed', response?: any) {
    super(message, 400, response);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class ForbiddenError extends MapFlowError {
  constructor(message: string = 'Access forbidden', response?: any) {
    super(message, 403, response);
    this.name = 'ForbiddenError';
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class ServerError extends MapFlowError {
  constructor(message: string = 'Server error', response?: any) {
    super(message, 500, response);
    this.name = 'ServerError';
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export class RateLimitError extends MapFlowError {
  constructor(message: string = 'Rate limit exceeded', response?: any) {
    super(message, 429, response);
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

