# GRADE A REALTY
## Phase 1 Pre-Implementation Review Summary
### Printable Internal Reference Document

---

**Document Date:** January 1, 2025  
**Status:** PENDING APPROVAL  
**Prepared For:** Internal Review  

---

# SECTION 1: HIGH-IMPACT SCHEMA CHANGES

## 1.1 Critical New Tables (Gap Resolutions)

These tables were **missing** from the original specification and are **essential** for core functionality:

### 🔴 CRITICAL: Vendors Table
**Impact:** Required for entire maintenance workflow
**Dependencies:** Maintenance Requests, Cost Approvals, SLA Tracking

```sql
CREATE TABLE vendors (
  id UUID PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  
  -- Capabilities
  categories JSONB,        -- ['plumbing', 'electrical', 'hvac']
  service_areas JSONB,     -- Geographic coverage
  
  -- Performance Metrics
  rating DECIMAL(3, 2) DEFAULT 0,
  total_jobs INT DEFAULT 0,
  completed_jobs INT DEFAULT 0,
  avg_response_time_hours DECIMAL(5, 2),
  
  -- Verification Status
  status ENUM('active', 'inactive', 'suspended'),
  verified BOOLEAN DEFAULT FALSE,
  insurance_verified BOOLEAN DEFAULT FALSE,
  license_verified BOOLEAN DEFAULT FALSE
);
```

**Why Critical:** Without this table, the maintenance workflow cannot assign vendors or track performance.

---

### 🔴 CRITICAL: Offers Table
**Impact:** Required for purchase negotiation workflow
**Dependencies:** Buyer workflow, Counter-offer logic, Contract generation

```sql
CREATE TABLE offers (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  buyer_id UUID REFERENCES users(id),
  
  -- Offer Details
  offer_amount DECIMAL(15, 2) NOT NULL,
  earnest_money DECIMAL(10, 2),
  contingencies JSONB,           -- ['inspection', 'financing', 'appraisal']
  proposed_closing_date DATE,
  expiry_date TIMESTAMP,
  
  -- Status & Negotiation
  status ENUM('draft', 'submitted', 'countered', 'accepted', 'rejected', 'expired', 'withdrawn'),
  parent_offer_id UUID REFERENCES offers(id),  -- Counter-offer chain
  counter_amount DECIMAL(15, 2),
  counter_count INT DEFAULT 0                   -- Max 5 rounds
);
```

**Why Critical:** The buyer workflow describes offer/counter-offer but original Applications table doesn't support negotiation.

---

### 🟡 IMPORTANT: Property Images Table
**Impact:** Required for property listing display
**Dependencies:** Property listing, Media management

```sql
CREATE TABLE property_images (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  
  url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  display_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  caption VARCHAR(255),
  
  -- Metadata
  width INT,
  height INT,
  file_size INT
);
```

**Why Important:** Property listings reference photos but no storage schema was defined.

---

### 🟡 IMPORTANT: Lease Renewal Schema Extension
**Impact:** Required for tenant retention workflow
**Dependencies:** Renter workflow, Transaction management

```sql
-- Add to existing transactions table
ALTER TABLE transactions ADD COLUMN 
  renewal_of UUID REFERENCES transactions(id),
  is_renewal BOOLEAN DEFAULT FALSE;
```

**Why Important:** Renewal workflow mentioned in customer portal but no schema support existed.

---

## 1.2 Conflict Resolutions

### Conflict #1: Application Status Values
**Problem:** Architecture doc and Customer Portal had different status flows.

**RESOLVED - Unified Status Flow:**
```
draft → submitted → screening → under_review → approved | rejected | conditional
                                                                       ↓
                                                               fulfilled → approved
```

| Status | Description |
|--------|-------------|
| `draft` | Started but not submitted |
| `submitted` | Awaiting processing |
| `screening` | Background/credit checks in progress |
| `under_review` | Admin reviewing + screening results |
| `approved` | Application approved |
| `rejected` | Application rejected |
| `conditional` | Approved with conditions (co-signer, extra deposit) |
| `withdrawn` | Applicant withdrew |

---

### Conflict #2: Maintenance Cost Approval Thresholds
**Problem:** Inconsistent approval levels between documents.

**RESOLVED - Tiered Approval Chain:**

| Cost Range | Approver(s) Required |
|------------|---------------------|
| < $200 | **Auto-approved** |
| $200 - $1,000 | Maintenance Admin |
| $1,000 - $5,000 | Maintenance Admin + Finance Admin |
| > $5,000 | Maintenance Admin + Finance Admin + Super Admin |

---

# SECTION 2: HIGH-IMPACT WORKFLOWS

## 2.1 Property Lifecycle (Most Complex)

```
                    ┌──────────────┐
              ┌────▶│   rejected   │
              │     └──────────────┘
              │            │
              │     (owner corrects)
              │            ▼
┌─────────┐   │     ┌──────────────┐     ┌──────────────┐
│  draft  │───┴────▶│   pending    │────▶│    active    │
└─────────┘         │   approval   │     └──────────────┘
                    └──────────────┘            │
                                               ▼
                          ┌──────────────┬──────────────┬──────────────┐
                          │under_contract│    sold      │   rented     │
                          └──────────────┴──────────────┴──────────────┘
```

**Key Approval Thresholds:**

| Listing Value | Approver Required |
|---------------|-------------------|
| < $500K | Operations Admin |
| $500K - $2M | Operations Admin + Senior Review |
| > $2M | Operations Admin + Super Admin |

---

## 2.2 Rental Application Workflow

```
┌─────────┐     ┌───────────┐     ┌───────────┐     ┌─────────────┐
│  draft  │────▶│ submitted │────▶│ screening │────▶│under_review │
└─────────┘     └───────────┘     └───────────┘     └─────────────┘
     │                                                     │
     │                                                     ▼
     │                              ┌────────┬────────┬────────────┐
     │                              │approved│rejected│conditional │
     │                              └────────┴────────┴────────────┘
     │                                   │                  │
     │                                   ▼                  ▼
     │                              ┌────────┐         ┌──────────┐
     └─────────────────────────────▶│withdrawn│        │fulfilled │
                                    └────────┘         └──────────┘
```

**SLA Requirements:**
- Application Review: **48 hours**
- KYC Verification: **24 hours**
- Screening Results: **24-72 hours**

---

## 2.3 Payment Collection & Payout

```
DAY -3    │ Reminder sent to renter
DAY 1     │ Payment due - Status: 'pending'
DAY 1-5   │ Grace period - No penalty
DAY 6     │ Late fee applied (5% or $50, whichever greater)
DAY 15    │ Escalation to Operations Admin
DAY 15+   │ Owner payout processed on 15th of month
```

**Platform Fee:** 8% deduction before owner payout

---

## 2.4 Maintenance Request SLA

| Priority | Response Time | Examples |
|----------|--------------|----------|
| **Emergency** | 4 hours | Gas leak, flood, no heat |
| **High** | 24 hours | No hot water, broken lock |
| **Medium** | 72 hours | Appliance issues, minor leaks |
| **Low** | 7 days | Cosmetic, minor repairs |

---

# SECTION 3: ROLE PERMISSIONS SUMMARY

## 3.1 Customer Roles (4)

| Role | Primary Actions |
|------|----------------|
| **Buyer** | Submit offers, sign contracts, make payments |
| **Renter** | Submit applications, sign leases, pay rent, request maintenance |
| **Owner** | List properties, approve tenants, receive payouts |
| **Investor** | All Owner + portfolio analytics, ROI tracking, market insights |

## 3.2 Admin Roles (5)

| Role | Authority |
|------|-----------|
| **Super Admin** | Full system control, all overrides |
| **Operations Admin** | Listing/application approval, day-to-day ops |
| **Finance Admin** | Payments, payouts, refunds up to $5K |
| **Compliance Admin** | KYC/KYB verification, user suspension |
| **Maintenance Admin** | Ticket triage, vendor assignment, cost approval up to $1K |

---

# SECTION 4: PHASE 1 IMPLEMENTATION SCOPE

## What Phase 1 Includes (Weeks 1-4)

| Component | Status | Priority |
|-----------|--------|----------|
| Database schema setup | To Do | P0 |
| All core tables + gap tables | To Do | P0 |
| Authentication (JWT + 2FA) | To Do | P0 |
| User management & roles | To Do | P0 |
| RBAC permission system | To Do | P0 |
| Property CRUD operations | To Do | P1 |
| Search & filtering logic | To Do | P1 |

## What Phase 1 Does NOT Include

- ❌ Payment processing (Phase 2)
- ❌ Contract generation (Phase 2)
- ❌ E-signature integration (Phase 2)
- ❌ Maintenance workflow (Phase 5)
- ❌ Vendor management (Phase 5)
- ❌ Market insights (Phase 6)

---

# SECTION 5: DATA INTEGRITY RULES

## Critical Constraints

| Entity | Cannot Delete If |
|--------|-----------------|
| User | Has active properties, transactions, or payments |
| Property | Has active lease or pending applications |
| Application | Linked to active transaction |
| Transaction | Has pending payments |

## Business Rules (API Enforced)

| Rule | Enforcement Level |
|------|------------------|
| Property must be 'active' to receive applications | API validation |
| Application requires KYC verified | API validation |
| Only one active lease per property | Database constraint |
| Max 5 counter-offers per negotiation | Application logic |
| Payout requires completed payment | Transaction logic |

---

# SECTION 6: SECURITY REQUIREMENTS (Phase 1)

## Authentication
- ✅ JWT-based with refresh tokens
- ✅ Secure httpOnly cookies
- ✅ Two-factor authentication (TOTP)
- ✅ Password: min 12 chars, complexity rules
- ✅ Rate limiting on auth endpoints
- ✅ Account lockout after failed attempts

## Data Protection
- ✅ AES-256 encryption at rest
- ✅ TLS 1.3 in transit
- ✅ PII fields encrypted in database
- ✅ Immutable audit logs

---

# SECTION 7: APPROVAL CHECKLIST

## Pre-Implementation Sign-Off

| Item | Reviewed | Approved |
|------|----------|----------|
| Database schema (including gaps) | ☐ | ☐ |
| 11 system roles defined | ☐ | ☐ |
| 15+ workflows documented | ☐ | ☐ |
| 5 state machines defined | ☐ | ☐ |
| Approval chains documented | ☐ | ☐ |
| Security requirements | ☐ | ☐ |
| 50+ API endpoints mapped | ☐ | ☐ |

---

## Approval Signatures

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | _____________ | ___/___/___ | _________ |
| Tech Lead | _____________ | ___/___/___ | _________ |
| Security Lead | _____________ | ___/___/___ | _________ |

---

**NEXT STEPS AFTER APPROVAL:**
1. Set up database with complete schema (including gap resolutions)
2. Implement authentication system with JWT
3. Build RBAC permission system
4. Create Property CRUD endpoints
5. Connect existing UI to new backend

---

*Document Version: 1.0*  
*Generated: January 1, 2025*  
*Source: Consolidated from MASTER-SYSTEM-BLUEPRINT.md*

---

**⚠️ IMPORTANT:** This document is for internal review only.  
Phase 1 implementation will NOT begin until explicit approval is received.
