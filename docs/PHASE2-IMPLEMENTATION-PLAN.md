# Grade A Realty - Phase 2 Implementation Plan

## 📋 Version: 1.0 | Date: January 1, 2026

---

## Overview

Phase 2 focuses on **backend integration** to transform the Phase 1 demo into a functional application with real data persistence, authentication, and file storage.

---

# 📦 Phase 2 Scope

| Priority | Feature | Description | Estimated Effort |
|----------|---------|-------------|------------------|
| P0 | API Integration | Connect frontend to backend REST API | 5 days |
| P0 | JWT Authentication | Real login/register with token management | 3 days |
| P1 | Image Upload | S3/Cloudinary integration for property images | 3 days |
| P1 | Server-Side Validation | API validation with error responses | 2 days |
| P2 | Form Draft Persistence | Save incomplete forms to localStorage/API | 2 days |
| P2 | Property Edit Page | Edit form with data pre-fill | 2 days |
| | **Total** | | **17 days** |

---

# 🔧 Task Breakdown

## Task 1: API Integration

### 1.1 API Client Configuration

**File:** `src/api/client.ts`

```typescript
// Current: Base structure exists
// Phase 2 Updates:
- [ ] Configure base URL from environment variable
- [ ] Add request interceptors for auth token injection
- [ ] Add response interceptors for error handling
- [ ] Implement automatic token refresh on 401
- [ ] Add request retry logic with exponential backoff
```

**Environment Setup:**
```env
# .env.local
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_API_TIMEOUT=30000
```

### 1.2 API Service Layer

**New Files:**
```
src/services/
├── api/
│   ├── authApi.ts        # Login, register, refresh, logout
│   ├── propertyApi.ts    # Property CRUD operations
│   ├── imageApi.ts       # Image upload/delete
│   ├── userApi.ts        # User profile, settings
│   ├── applicationApi.ts # Rental applications
│   └── index.ts          # Barrel export
└── index.ts              # Updated exports
```

**Property API Example:**
```typescript
// src/services/api/propertyApi.ts
export const propertyApi = {
  // List properties with filters
  list: (filters: PropertyFilters) => 
    apiClient.get<PaginatedResponse<Property>>('/properties', { params: filters }),
  
  // Get single property
  getById: (id: string) => 
    apiClient.get<Property>(`/properties/${id}`),
  
  // Create property (owner)
  create: (data: CreatePropertyRequest) => 
    apiClient.post<Property>('/properties', data),
  
  // Update property (owner)
  update: (id: string, data: UpdatePropertyRequest) => 
    apiClient.put<Property>(`/properties/${id}`, data),
  
  // Delete property (owner)
  delete: (id: string) => 
    apiClient.delete(`/properties/${id}`),
  
  // Admin: Approve/Reject
  updateStatus: (id: string, status: PropertyStatus, reason?: string) =>
    apiClient.patch(`/properties/${id}/status`, { status, reason }),
};
```

### 1.3 Hook Updates

**Update:** `src/hooks/useProperties.ts`

```typescript
// Replace mockDataService with propertyApi
- import { mockDataService } from '../services/mockDataService';
+ import { propertyApi } from '../services/api';

// Update fetchProperties
const fetchProperties = async () => {
  setIsLoading(true);
  setError(null);
  try {
-   const result = await mockDataService.searchProperties(filters);
+   const response = await propertyApi.list(filters);
+   const result = response.data;
    setProperties(result.properties);
    setTotalCount(result.total);
  } catch (err) {
    setError(err instanceof Error ? err : new Error('Failed to fetch'));
    showErrorToast('Error', 'Failed to load properties');
  } finally {
    setIsLoading(false);
  }
};
```

### 1.4 Acceptance Criteria

- [ ] All API endpoints defined in `src/api/routes.ts` are callable
- [ ] API errors display user-friendly messages
- [ ] Network failures show retry option
- [ ] Loading states shown during API calls
- [ ] Stale data refreshed on page focus

---

## Task 2: JWT Authentication

### 2.1 Auth Flow Implementation

**Current State:** Mock login with simulated tokens
**Target State:** Real JWT authentication with refresh

**Flow Diagram:**
```
Login Request
    ↓
POST /auth/login (email, password)
    ↓
Response: { accessToken, refreshToken, user, expiresIn }
    ↓
Store tokens in authStore (memory + localStorage for refresh)
    ↓
Inject accessToken in API request headers
    ↓
On 401 response:
    ↓
POST /auth/refresh (refreshToken)
    ↓
New accessToken → Retry original request
    ↓
If refresh fails → Logout user
```

### 2.2 Implementation Steps

**File:** `src/hooks/useAuth.ts`

```typescript
// Remove mock implementation, add real API calls

export function useAuth() {
  const authStore = useAuthStore();
  
  const login = async (credentials: LoginRequest) => {
    authStore.setLoading(true);
    authStore.setError(null);
    
    try {
      const response = await authApi.login(credentials);
      const { accessToken, refreshToken, user, expiresIn } = response.data;
      
      // Store tokens and user
      authStore.login(user, accessToken, refreshToken, expiresIn);
      
      // Start token refresh timer
      scheduleTokenRefresh(expiresIn);
      
      showSuccessToast('Welcome!', `Logged in as ${user.firstName}`);
      return { success: true };
      
    } catch (error) {
      const authError = parseAuthError(error);
      authStore.setError(authError);
      showErrorToast('Login Failed', authError.message);
      return { success: false, error: authError };
    } finally {
      authStore.setLoading(false);
    }
  };
  
  // ... register, logout, refreshToken, etc.
}
```

### 2.3 Token Refresh Strategy

**File:** `src/services/tokenRefresh.ts`

```typescript
let refreshTimer: NodeJS.Timeout | null = null;

export function scheduleTokenRefresh(expiresIn: number) {
  // Refresh 60 seconds before expiry
  const refreshTime = (expiresIn - 60) * 1000;
  
  if (refreshTimer) clearTimeout(refreshTimer);
  
  refreshTimer = setTimeout(async () => {
    const authStore = useAuthStore.getState();
    const { refreshToken } = authStore;
    
    if (!refreshToken) {
      authStore.logout();
      return;
    }
    
    try {
      const response = await authApi.refresh(refreshToken);
      const { accessToken, expiresIn: newExpiresIn } = response.data;
      
      authStore.setTokens(accessToken, refreshToken, newExpiresIn);
      scheduleTokenRefresh(newExpiresIn);
      
    } catch (error) {
      console.error('Token refresh failed:', error);
      authStore.logout();
      showErrorToast('Session Expired', 'Please log in again');
    }
  }, refreshTime);
}
```

### 2.4 Acceptance Criteria

- [ ] Login returns real JWT from backend
- [ ] AccessToken included in all API requests
- [ ] Token auto-refreshes before expiry
- [ ] Expired tokens trigger re-login
- [ ] Logout clears all tokens and state
- [ ] 2FA flow works if enabled
- [ ] Remember me extends refresh token lifetime

---

## Task 3: Image Upload

### 3.1 Architecture Decision

**Option A: Direct Upload to S3**
- Frontend gets presigned URL from backend
- Uploads directly to S3
- Faster, scales better

**Option B: Upload Through Backend**
- Frontend sends to backend
- Backend uploads to S3
- More control, simpler CORS

**Recommendation:** Option A (Direct Upload) for performance

### 3.2 Upload Flow

```
User selects image
    ↓
Client validates (type, size)
    ↓
POST /images/presigned-url
    { filename, contentType, propertyId }
    ↓
Backend generates presigned URL
    { uploadUrl, imageId, publicUrl }
    ↓
PUT to uploadUrl with file
    ↓
On success, save imageId with property
    ↓
Display publicUrl in UI
```

### 3.3 Implementation

**New File:** `src/services/api/imageApi.ts`

```typescript
export const imageApi = {
  // Get presigned URL for upload
  getUploadUrl: (data: { 
    filename: string; 
    contentType: string;
    propertyId?: string;
  }) => apiClient.post<{
    uploadUrl: string;
    imageId: string;
    publicUrl: string;
  }>('/images/presigned-url', data),
  
  // Confirm upload complete
  confirmUpload: (imageId: string) => 
    apiClient.post(`/images/${imageId}/confirm`),
  
  // Delete image
  delete: (imageId: string) => 
    apiClient.delete(`/images/${imageId}`),
  
  // Set primary image
  setPrimary: (propertyId: string, imageId: string) =>
    apiClient.patch(`/properties/${propertyId}/primary-image`, { imageId }),
  
  // Reorder images
  reorder: (propertyId: string, imageIds: string[]) =>
    apiClient.patch(`/properties/${propertyId}/image-order`, { imageIds }),
};
```

**Update:** `src/app/components/ImageUpload.tsx`

```typescript
// Add real upload functionality
const uploadFile = async (file: File): Promise<UploadedImage> => {
  // 1. Get presigned URL
  const { data } = await imageApi.getUploadUrl({
    filename: file.name,
    contentType: file.type,
    propertyId: propertyId,
  });
  
  // 2. Upload to S3
  await fetch(data.uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });
  
  // 3. Confirm upload
  await imageApi.confirmUpload(data.imageId);
  
  return {
    id: data.imageId,
    url: data.publicUrl,
    filename: file.name,
  };
};
```

### 3.4 Acceptance Criteria

- [ ] Images upload to cloud storage (S3/Cloudinary)
- [ ] Upload progress shown in UI
- [ ] Failed uploads show error with retry
- [ ] Images persist after page refresh
- [ ] Delete removes from storage
- [ ] Primary image selection persists
- [ ] Image order persists

---

## Task 4: Server-Side Validation

### 4.1 Error Response Format

**Standard API Error Response:**
```typescript
interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: {
    field: string;
    message: string;
  }[];
}

// Example:
{
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "Invalid property data",
  "details": [
    { "field": "title", "message": "Title must be at least 10 characters" },
    { "field": "salePrice", "message": "Price must be a positive number" }
  ]
}
```

### 4.2 Client-Side Error Handling

**File:** `src/utils/errorHandler.ts`

```typescript
export function parseApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.data as ApiError;
  }
  return {
    status: 500,
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
  };
}

export function mapFieldErrors(details: ApiError['details']): Record<string, string> {
  return (details || []).reduce((acc, { field, message }) => {
    acc[field] = message;
    return acc;
  }, {} as Record<string, string>);
}
```

### 4.3 Form Integration

**Update:** `src/app/components/PropertyForm.tsx`

```typescript
const handleSubmit = async () => {
  setIsSubmitting(true);
  setServerErrors({});
  
  try {
    if (isEditing) {
      await propertyApi.update(propertyId, formData);
    } else {
      await propertyApi.create(formData);
    }
    showSuccessToast('Success', 'Property saved!');
    navigate('/my-properties');
    
  } catch (error) {
    const apiError = parseApiError(error);
    
    if (apiError.details) {
      // Map field errors to form
      setServerErrors(mapFieldErrors(apiError.details));
      showErrorToast('Validation Error', 'Please fix the highlighted fields');
    } else {
      showErrorToast('Error', apiError.message);
    }
  } finally {
    setIsSubmitting(false);
  }
};
```

### 4.4 Acceptance Criteria

- [ ] All API endpoints validate input
- [ ] Field-level errors display on form
- [ ] General errors show toast notification
- [ ] Client validation matches server rules
- [ ] Error messages are user-friendly

---

## Task 5: Form Draft Persistence

### 5.1 Strategy

**Approach:** Hybrid localStorage + API

1. **localStorage:** Auto-save every 30 seconds
2. **API (optional):** Save draft on explicit action

### 5.2 Implementation

**New Hook:** `src/hooks/useFormDraft.ts`

```typescript
import { useEffect, useCallback } from 'react';
import { debounce } from '../utils';

interface UseFormDraftOptions<T> {
  key: string;
  data: T;
  onRestore?: (data: T) => void;
}

export function useFormDraft<T extends object>({
  key,
  data,
  onRestore,
}: UseFormDraftOptions<T>) {
  const storageKey = `form_draft_${key}`;
  
  // Auto-save draft
  const saveDraft = useCallback(
    debounce((formData: T) => {
      localStorage.setItem(storageKey, JSON.stringify({
        data: formData,
        savedAt: Date.now(),
      }));
    }, 2000),
    [storageKey]
  );
  
  // Save on data change
  useEffect(() => {
    saveDraft(data);
  }, [data, saveDraft]);
  
  // Restore draft on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const { data: savedData, savedAt } = JSON.parse(saved);
        // Only restore if less than 24 hours old
        if (Date.now() - savedAt < 24 * 60 * 60 * 1000) {
          onRestore?.(savedData);
        }
      } catch {
        localStorage.removeItem(storageKey);
      }
    }
  }, []);
  
  // Clear draft
  const clearDraft = useCallback(() => {
    localStorage.removeItem(storageKey);
  }, [storageKey]);
  
  // Check if draft exists
  const hasDraft = useCallback(() => {
    return !!localStorage.getItem(storageKey);
  }, [storageKey]);
  
  return { saveDraft, clearDraft, hasDraft };
}
```

### 5.3 Form Integration

**Update:** `src/app/components/PropertyForm.tsx`

```typescript
export default function PropertyForm({ propertyId }: PropertyFormProps) {
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  
  const { clearDraft, hasDraft } = useFormDraft({
    key: propertyId || 'new-property',
    data: formData,
    onRestore: (savedData) => {
      setShowDraftPrompt(true);
      // User confirms before restoring
    },
  });
  
  // Prompt UI
  {showDraftPrompt && (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
      <p className="font-medium text-amber-900">
        You have an unsaved draft from your last session.
      </p>
      <div className="flex gap-3 mt-3">
        <button onClick={restoreDraft} className="...">
          Restore Draft
        </button>
        <button onClick={discardDraft} className="...">
          Start Fresh
        </button>
      </div>
    </div>
  )}
  
  // Clear on successful submit
  const handleSubmit = async () => {
    // ... submit logic
    clearDraft();
  };
}
```

### 5.4 Acceptance Criteria

- [ ] Form data auto-saves every 30 seconds
- [ ] Draft restored on return to form
- [ ] User prompted to restore or discard
- [ ] Draft cleared on successful submit
- [ ] Drafts expire after 24 hours
- [ ] Draft indicator shown in UI

---

## Task 6: Property Edit Page

### 6.1 Route Setup

**Update:** `src/app/App.tsx`

```typescript
// Already exists:
<Route
  path="/properties/:id/edit"
  element={
    <ProtectedRoute requireAuth requireAnyRole={['owner', 'investor', ...]}>
      <EditPropertyPage />
    </ProtectedRoute>
  }
/>
```

### 6.2 Edit Page Component

**New File:** `src/app/pages/EditPropertyPage.tsx`

```typescript
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PropertyForm from '../components/PropertyForm';
import { propertyApi } from '../../services/api';
import { LoadingState } from '../components/PageHeader';

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;
      
      try {
        const response = await propertyApi.getById(id);
        setProperty(response.data);
      } catch (err) {
        setError('Failed to load property');
        showErrorToast('Error', 'Property not found');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProperty();
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState message="Loading property..." />
      </div>
    );
  }
  
  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <button onClick={() => navigate('/my-properties')} className="...">
            Back to My Properties
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <PropertyForm 
      mode="edit"
      propertyId={id}
      initialData={mapPropertyToFormData(property)}
      onSuccess={() => {
        showSuccessToast('Updated', 'Property saved successfully');
        navigate('/my-properties');
      }}
    />
  );
}

// Helper to map API property to form data structure
function mapPropertyToFormData(property: Property): PropertyFormData {
  return {
    propertyType: property.propertyType,
    listingType: property.listingType,
    title: property.title,
    description: property.description,
    address: {
      street: property.addressLine1,
      unit: property.addressLine2 || '',
      city: property.city,
      state: property.state,
      zipCode: property.zipCode,
    },
    pricing: {
      salePrice: property.salePrice,
      rentPrice: property.rentPrice,
      securityDeposit: property.securityDeposit,
    },
    details: {
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      sqft: property.sqft,
      yearBuilt: property.yearBuilt,
      lotSize: property.lotSize,
    },
    amenities: property.amenities || [],
    images: property.images || [],
  };
}
```

### 6.3 Update PropertyForm for Edit Mode

**Update:** `src/app/components/PropertyForm.tsx`

```typescript
interface PropertyFormProps {
  mode?: 'create' | 'edit';
  propertyId?: string;
  initialData?: PropertyFormData;
  onSuccess?: () => void;
}

export default function PropertyForm({
  mode = 'create',
  propertyId,
  initialData,
  onSuccess,
}: PropertyFormProps) {
  const [formData, setFormData] = useState<PropertyFormData>(
    initialData || getInitialFormData()
  );
  
  const isEditing = mode === 'edit';
  
  // Update header text based on mode
  <h1 className="text-3xl font-bold">
    {isEditing ? 'Edit Property' : 'List Your Property'}
  </h1>
  
  // Update submit logic
  const handleSubmit = async () => {
    try {
      if (isEditing && propertyId) {
        await propertyApi.update(propertyId, formData);
      } else {
        await propertyApi.create(formData);
      }
      onSuccess?.();
    } catch (error) {
      // error handling
    }
  };
}
```

### 6.4 Navigation Integration

**Update:** `src/app/pages/MyPropertiesPage.tsx`

```typescript
const handleEdit = (propertyId: string) => {
-  showInfoToast('Edit Property', 'Navigating to edit form...');
-  navigate('/properties/new');
+  navigate(`/properties/${propertyId}/edit`);
};
```

### 6.5 Acceptance Criteria

- [ ] Edit route loads property data
- [ ] Form pre-filled with existing values
- [ ] All steps show existing data
- [ ] Images display from storage
- [ ] Update saves changes to backend
- [ ] Validation works same as create
- [ ] Success redirects to property list

---

# 📅 Phase 2 Timeline

## Sprint 1 (Week 1-2)
| Day | Task | Deliverable |
|-----|------|-------------|
| 1-2 | API Client Setup | Environment config, interceptors |
| 3-5 | Auth API Integration | Login, register, refresh |
| 6-7 | Token Refresh Logic | Auto-refresh, session management |
| 8-10 | Property API Integration | CRUD operations connected |

## Sprint 2 (Week 3-4)
| Day | Task | Deliverable |
|-----|------|-------------|
| 11-13 | Image Upload | S3 presigned URLs, upload flow |
| 14-15 | Server Validation | Error handling, field errors |
| 16-17 | Form Draft Persistence | localStorage auto-save |
| 18-19 | Property Edit Page | Pre-fill, update flow |
| 20 | Testing & Polish | E2E testing, bug fixes |

---

# ✅ Phase 2 Definition of Done

Phase 2 is complete when:

1. [ ] All API endpoints integrated (no mock data in core flows)
2. [ ] JWT authentication with refresh tokens working
3. [ ] Images persist to cloud storage
4. [ ] Form drafts survive page refresh
5. [ ] Server validation errors display correctly
6. [ ] Property edit page pre-fills and saves
7. [ ] All Phase 1 E2E flows still pass
8. [ ] No critical bugs or regressions

---

# 🔗 Dependencies

## Backend Requirements

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/login` | POST | User authentication |
| `/auth/register` | POST | User registration |
| `/auth/refresh` | POST | Token refresh |
| `/auth/logout` | POST | Session invalidation |
| `/properties` | GET, POST | List, create properties |
| `/properties/:id` | GET, PUT, DELETE | Property CRUD |
| `/images/presigned-url` | POST | Get upload URL |
| `/images/:id/confirm` | POST | Confirm upload |

## Infrastructure

- [ ] Backend API deployed
- [ ] S3 bucket or Cloudinary account
- [ ] Database with property and user tables
- [ ] Environment variables configured

---

**Document Created:** January 1, 2026  
**Status:** Ready for Phase 2 Development
