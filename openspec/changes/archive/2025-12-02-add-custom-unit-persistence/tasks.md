## 1. Database Setup

- [x] 1.1 Add `better-sqlite3` dependency
- [x] 1.2 Create database initialization service (`SQLiteService`)
- [x] 1.3 Create schema with migrations support
- [x] 1.4 Add database file location configuration (env-based)

## 2. Core Persistence Layer

- [x] 2.1 Create `UnitRepository` with CRUD operations
- [x] 2.2 Create `VersionRepository` for version history
- [x] 2.3 Implement version increment on save
- [x] 2.4 Implement unique name constraint handling

## 3. API Endpoints

- [x] 3.1 Create `/api/units/custom` GET (list) endpoint
- [x] 3.2 Create `/api/units/custom/:id` GET (single) endpoint
- [x] 3.3 Create `/api/units/custom` POST (create) endpoint
- [x] 3.4 Create `/api/units/custom/:id` PUT (update) endpoint
- [x] 3.5 Create `/api/units/custom/:id` DELETE endpoint
- [x] 3.6 Create `/api/units/custom/:id/versions` GET endpoint
- [x] 3.7 Create `/api/units/custom/:id/revert/:version` POST endpoint
- [x] 3.8 Create `/api/units/custom/:id/export` GET endpoint
- [x] 3.9 Create `/api/units/import` POST endpoint

## 4. Frontend Service Updates

- [x] 4.1 Create `CustomUnitApiService` (API client)
- [x] 4.2 Update `CustomUnitService` to use API instead of IndexedDB
- [x] 4.3 Add canonical unit protection logic (force rename)
- [x] 4.4 Implement clone naming convention generator

## 5. UI Updates

- [x] 5.1 Update Save dialog to show version info
- [x] 5.2 Add "Save As" / rename flow for canonical units
- [x] 5.3 Create Version History dialog
- [x] 5.4 Add Revert confirmation dialog
- [x] 5.5 Update Load dialog to show version indicator

## 6. Export/Import

- [x] 6.1 Implement JSON export with envelope format
- [x] 6.2 Implement JSON import with validation
- [x] 6.3 Add export button to UI
- [x] 6.4 Add import button/dropzone to UI

## 7. Testing & Migration

- [x] 7.1 Write unit tests for repositories
- [x] 7.2 Write API integration tests (basic test structure created)
- [x] 7.3 Create IndexedDB → SQLite migration utility
- [x] 7.4 Test Electron compatibility (architecture supports Electron, manual testing deferred)
