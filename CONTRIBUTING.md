# Contributing to MapFlow Node.js SDK

Thank you for your interest in contributing to the MapFlow Node.js SDK!

## Development Setup

1. **Clone the repository**

```bash
git clone https://github.com/mapflow/sdk-node.git
cd sdk-node
```

2. **Install dependencies**

```bash
npm install
```

3. **Build the project**

```bash
npm run build
```

4. **Run tests**

```bash
npm test
```

## Development Workflow

### Building

```bash
# One-time build
npm run build

# Watch mode (rebuilds on file changes)
npm run build:watch
```

### Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

### Linting and Formatting

```bash
# Lint
npm run lint

# Format code
npm run format
```

## Project Structure

```
sdk-node/
├── src/                    # Source code
│   ├── client.ts           # Main MapFlowClient class
│   ├── types.ts            # TypeScript type definitions
│   ├── errors.ts           # Custom error classes
│   └── index.ts            # Main entry point
├── tests/                  # Test files
│   └── client.test.ts      # Client tests
├── examples/               # Usage examples
│   ├── basic-usage.ts      # Basic examples
│   └── integration-test.ts # Real API tests
├── dist/                   # Compiled JavaScript (generated)
└── package.json            # Package configuration
```

## Code Style

This project uses:

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for formatting
- **Jest** for testing

Please ensure your code:

- ✅ Passes all tests
- ✅ Has no linting errors
- ✅ Is properly formatted
- ✅ Includes type definitions
- ✅ Has JSDoc comments

### TypeScript Guidelines

```typescript
// ✅ Good: Use proper types
async function getCustomer(id: string): Promise<Customer> {
  return this.client.get(`/customers/${id}`);
}

// ❌ Bad: Avoid 'any'
async function getCustomer(id: any): Promise<any> {
  return this.client.get(`/customers/${id}`);
}

// ✅ Good: Use enums
const customerType = CustomerType.COMPANY;

// ❌ Bad: Magic strings
const customerType = 'company';
```

## Adding New Features

### 1. Add Types

Update `src/types.ts`:

```typescript
export interface NewFeature {
  id: string;
  name: string;
  // ... other fields
}

export interface NewFeatureCreate extends Omit<NewFeature, 'id'> {}
```

### 2. Add Client Methods

Update `src/client.ts`:

```typescript
async listNewFeatures(params?: Record<string, any>): Promise<PaginatedResponse<NewFeature>> {
  return this.request<PaginatedResponse<NewFeature>>({
    method: 'GET',
    url: '/new-features/',
    params,
  });
}

async createNewFeature(data: NewFeatureCreate): Promise<NewFeature> {
  return this.request<NewFeature>({
    method: 'POST',
    url: '/new-features/',
    data,
  });
}
```

### 3. Add Tests

Update `tests/client.test.ts`:

```typescript
describe('NewFeature Methods', () => {
  it('should list new features', async () => {
    // Test implementation
  });

  it('should create new feature', async () => {
    // Test implementation
  });
});
```

### 4. Add Examples

Create or update example files in `examples/`:

```typescript
async function newFeatureExample() {
  const feature = await client.createNewFeature({
    name: 'Example Feature',
  });
  
  console.log(`Created: ${feature.name}`);
}
```

### 5. Update Documentation

Update `README.md` with usage examples and API reference.

## Testing

### Unit Tests

Place unit tests in `tests/` directory:

```typescript
import { MapFlowClient } from '../src/client';

describe('MapFlowClient', () => {
  let client: MapFlowClient;

  beforeEach(() => {
    client = new MapFlowClient({ apiKey: 'test-key' });
  });

  it('should initialize correctly', () => {
    expect(client).toBeInstanceOf(MapFlowClient);
  });
});
```

### Integration Tests

For testing with real API:

```bash
# Set API key
export MAPFLOW_API_KEY=your-key

# Run integration test
ts-node examples/integration-test.ts
```

## Pull Request Process

1. **Fork the repository**

2. **Create a feature branch**

```bash
git checkout -b feature/my-new-feature
```

3. **Make your changes**

- Write code
- Add tests
- Update documentation

4. **Ensure quality**

```bash
npm run lint
npm run format
npm test
npm run build
```

5. **Commit your changes**

```bash
git commit -m "feat: add new feature"
```

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `style:` Formatting, missing semicolons, etc
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance

6. **Push and create PR**

```bash
git push origin feature/my-new-feature
```

Then create a pull request on GitHub.

## Code Review

All submissions require review. We use GitHub pull requests for this purpose.

Please:

- ✅ Write clear commit messages
- ✅ Keep PRs focused and small
- ✅ Update documentation
- ✅ Add tests for new features
- ✅ Ensure CI passes

## Release Process

Releases are handled by maintainers:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag
4. Publish to npm

## Questions?

- 📧 Email: support@mapflow.co
- 💬 GitHub Discussions
- 🐛 GitHub Issues

Thank you for contributing! 🙏

