-- =============================================================================
-- GRADE A REALTY - DATABASE SCHEMA
-- Version: 1.0.0
-- Phase 1 Implementation
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- USERS TABLE
-- Core user account information
-- -----------------------------------------------------------------------------
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url VARCHAR(500),
  
  -- Verification status
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  
  -- KYC status
  kyc_status VARCHAR(20) DEFAULT 'pending' 
    CHECK (kyc_status IN ('pending', 'submitted', 'verified', 'rejected')),
  kyc_verified_at TIMESTAMP,
  kyc_documents JSONB DEFAULT '[]',
  
  -- Security
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret VARCHAR(255),
  failed_login_attempts INT DEFAULT 0,
  locked_until TIMESTAMP,
  
  -- Account status
  status VARCHAR(20) DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'deactivated')),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

-- Create index for email lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- -----------------------------------------------------------------------------
-- USER ROLES TABLE
-- Multi-role support for users
-- -----------------------------------------------------------------------------
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(30) NOT NULL
    CHECK (role IN (
      'buyer', 'renter', 'owner', 'investor',
      'super_admin', 'operations_admin', 'finance_admin', 
      'compliance_admin', 'maintenance_admin'
    )),
  
  -- Grant tracking
  granted_at TIMESTAMP DEFAULT NOW(),
  granted_by UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Ensure unique role per user
  UNIQUE(user_id, role)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);

-- -----------------------------------------------------------------------------
-- REFRESH TOKENS TABLE
-- JWT refresh token management
-- -----------------------------------------------------------------------------
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  revoked_at TIMESTAMP,
  device_info JSONB
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);

-- -----------------------------------------------------------------------------
-- PROPERTIES TABLE
-- Property listings for sale or rent
-- -----------------------------------------------------------------------------
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic info
  title VARCHAR(255) NOT NULL,
  description TEXT,
  property_type VARCHAR(20) NOT NULL
    CHECK (property_type IN ('house', 'apartment', 'condo', 'townhouse', 'commercial', 'land')),
  listing_type VARCHAR(10) NOT NULL
    CHECK (listing_type IN ('sale', 'rent', 'both')),
  status VARCHAR(20) DEFAULT 'draft'
    CHECK (status IN ('draft', 'pending_approval', 'active', 'under_contract', 'sold', 'rented', 'off_market', 'rejected')),
  
  -- Location
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'United States',
  postal_code VARCHAR(20),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Pricing
  sale_price DECIMAL(15, 2),
  rent_price DECIMAL(10, 2),
  rent_period VARCHAR(10) DEFAULT 'monthly'
    CHECK (rent_period IN ('monthly', 'weekly', 'yearly')),
  deposit_amount DECIMAL(10, 2),
  
  -- Features
  bedrooms INT,
  bathrooms DECIMAL(3, 1),
  square_feet INT,
  lot_size INT,
  year_built INT,
  parking_spaces INT,
  
  -- Amenities (JSON array)
  amenities JSONB DEFAULT '[]',
  
  -- Financial estimates
  estimated_annual_income DECIMAL(12, 2),
  estimated_expenses DECIMAL(12, 2),
  cap_rate DECIMAL(5, 2),
  estimated_roi DECIMAL(5, 2),
  hoa_fees DECIMAL(8, 2),
  property_tax DECIMAL(10, 2),
  
  -- Ownership
  owner_id UUID NOT NULL REFERENCES users(id),
  
  -- Availability
  available_from DATE,
  lease_term_months INT,
  instant_booking BOOLEAN DEFAULT FALSE,
  
  -- Approval tracking
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES users(id),
  rejection_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_properties_owner_id ON properties(owner_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_listing_type ON properties(listing_type);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_price_sale ON properties(sale_price);
CREATE INDEX idx_properties_price_rent ON properties(rent_price);

-- -----------------------------------------------------------------------------
-- PROPERTY IMAGES TABLE
-- Media storage for property listings
-- -----------------------------------------------------------------------------
CREATE TABLE property_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  
  url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  
  display_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  caption VARCHAR(255),
  
  -- Metadata
  width INT,
  height INT,
  file_size INT,
  mime_type VARCHAR(50),
  
  uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_property_images_property_id ON property_images(property_id);

-- -----------------------------------------------------------------------------
-- OFFERS TABLE
-- Purchase negotiation and counter-offers
-- -----------------------------------------------------------------------------
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id),
  buyer_id UUID NOT NULL REFERENCES users(id),
  
  -- Offer details
  offer_amount DECIMAL(15, 2) NOT NULL,
  earnest_money DECIMAL(10, 2),
  contingencies JSONB DEFAULT '[]', -- ['inspection', 'financing', 'appraisal']
  proposed_closing_date DATE,
  expiry_date TIMESTAMP,
  notes TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft'
    CHECK (status IN ('draft', 'submitted', 'countered', 'accepted', 'rejected', 'expired', 'withdrawn')),
  
  -- Counter-offer chain
  parent_offer_id UUID REFERENCES offers(id),
  counter_amount DECIMAL(15, 2),
  counter_count INT DEFAULT 0,
  
  -- Response tracking
  responded_at TIMESTAMP,
  responded_by UUID REFERENCES users(id),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_offers_property_id ON offers(property_id);
CREATE INDEX idx_offers_buyer_id ON offers(buyer_id);
CREATE INDEX idx_offers_status ON offers(status);

-- -----------------------------------------------------------------------------
-- APPLICATIONS TABLE
-- Rental applications
-- -----------------------------------------------------------------------------
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id),
  applicant_id UUID NOT NULL REFERENCES users(id),
  application_type VARCHAR(10) NOT NULL
    CHECK (application_type IN ('buy', 'rent')),
  
  -- Status with full workflow support
  status VARCHAR(20) DEFAULT 'draft'
    CHECK (status IN ('draft', 'submitted', 'screening', 'under_review', 'approved', 'rejected', 'conditional', 'fulfilled', 'withdrawn')),
  
  -- Offer/Terms
  offered_price DECIMAL(15, 2),
  proposed_move_in DATE,
  lease_term_months INT,
  
  -- Applicant information
  employment_status VARCHAR(50),
  employer_name VARCHAR(255),
  employer_contact VARCHAR(100),
  annual_income DECIMAL(12, 2),
  credit_score_range VARCHAR(50),
  
  -- Rental history
  rental_history JSONB DEFAULT '[]',
  
  -- Additional occupants
  occupants JSONB DEFAULT '[]',
  pets JSONB DEFAULT '[]',
  
  -- Screening results
  background_check_status VARCHAR(20),
  credit_check_status VARCHAR(20),
  screening_completed_at TIMESTAMP,
  screening_results JSONB,
  
  -- Conditional approval
  conditions JSONB, -- [{ type: 'co-signer', fulfilled: false }]
  
  -- Review tracking
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  rejection_reason TEXT,
  
  -- Payment
  application_fee_paid BOOLEAN DEFAULT FALSE,
  application_fee_amount DECIMAL(6, 2),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_applications_property_id ON applications(property_id);
CREATE INDEX idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX idx_applications_status ON applications(status);

-- -----------------------------------------------------------------------------
-- TRANSACTIONS TABLE
-- Purchase and lease transactions
-- -----------------------------------------------------------------------------
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id),
  offer_id UUID REFERENCES offers(id),
  property_id UUID NOT NULL REFERENCES properties(id),
  buyer_renter_id UUID NOT NULL REFERENCES users(id),
  seller_owner_id UUID NOT NULL REFERENCES users(id),
  
  transaction_type VARCHAR(10) NOT NULL
    CHECK (transaction_type IN ('purchase', 'lease')),
  status VARCHAR(20) DEFAULT 'initiated'
    CHECK (status IN ('initiated', 'contract_pending', 'contract_signed', 'payment_pending', 'completed', 'cancelled')),
  
  -- Financial
  total_amount DECIMAL(15, 2) NOT NULL,
  platform_fee DECIMAL(10, 2),
  platform_fee_percentage DECIMAL(4, 2) DEFAULT 8.00,
  deposit_amount DECIMAL(10, 2),
  
  -- Contract
  contract_document_id UUID,
  contract_signed_at TIMESTAMP,
  
  -- Lease specifics
  move_in_date DATE,
  lease_start_date DATE,
  lease_end_date DATE,
  monthly_rent DECIMAL(10, 2),
  
  -- Renewal tracking
  renewal_of UUID REFERENCES transactions(id),
  is_renewal BOOLEAN DEFAULT FALSE,
  
  -- Payment tracking
  payment_completed_at TIMESTAMP,
  
  -- Cancellation
  cancelled_at TIMESTAMP,
  cancelled_by UUID REFERENCES users(id),
  cancellation_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_property_id ON transactions(property_id);
CREATE INDEX idx_transactions_buyer_renter_id ON transactions(buyer_renter_id);
CREATE INDEX idx_transactions_seller_owner_id ON transactions(seller_owner_id);
CREATE INDEX idx_transactions_status ON transactions(status);

-- -----------------------------------------------------------------------------
-- PAYMENTS TABLE
-- All payment records
-- -----------------------------------------------------------------------------
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES transactions(id),
  payer_id UUID NOT NULL REFERENCES users(id),
  payee_id UUID REFERENCES users(id),
  
  payment_type VARCHAR(20) NOT NULL
    CHECK (payment_type IN ('rent', 'purchase', 'deposit', 'platform_fee', 'maintenance', 'refund', 'late_fee', 'application_fee')),
  
  amount DECIMAL(12, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
  
  -- Payment processing
  payment_method VARCHAR(50),
  stripe_payment_id VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  
  -- Scheduling
  due_date DATE,
  paid_at TIMESTAMP,
  
  -- Late fee tracking
  is_late BOOLEAN DEFAULT FALSE,
  late_fee_applied BOOLEAN DEFAULT FALSE,
  late_fee_amount DECIMAL(8, 2),
  grace_period_end DATE,
  
  -- Refund tracking
  refund_of UUID REFERENCES payments(id),
  refund_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payments_payer_id ON payments(payer_id);
CREATE INDEX idx_payments_payee_id ON payments(payee_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_due_date ON payments(due_date);

-- -----------------------------------------------------------------------------
-- VENDORS TABLE
-- Service providers for maintenance
-- -----------------------------------------------------------------------------
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  
  -- Capabilities
  categories JSONB DEFAULT '[]', -- ['plumbing', 'electrical', 'hvac']
  service_areas JSONB DEFAULT '[]', -- ['zip_codes' or 'cities']
  
  -- Performance metrics
  rating DECIMAL(3, 2) DEFAULT 0,
  total_jobs INT DEFAULT 0,
  completed_jobs INT DEFAULT 0,
  avg_response_time_hours DECIMAL(5, 2),
  
  -- Status & verification
  status VARCHAR(20) DEFAULT 'active'
    CHECK (status IN ('active', 'inactive', 'suspended')),
  verified BOOLEAN DEFAULT FALSE,
  insurance_verified BOOLEAN DEFAULT FALSE,
  license_verified BOOLEAN DEFAULT FALSE,
  
  -- Documents
  insurance_document_url VARCHAR(500),
  license_document_url VARCHAR(500),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_vendors_status ON vendors(status);
CREATE INDEX idx_vendors_categories ON vendors USING GIN(categories);

-- -----------------------------------------------------------------------------
-- MAINTENANCE REQUESTS TABLE
-- Property maintenance tickets
-- -----------------------------------------------------------------------------
CREATE TABLE maintenance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id),
  reported_by UUID NOT NULL REFERENCES users(id),
  assigned_vendor_id UUID REFERENCES vendors(id),
  
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(20) DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high', 'emergency')),
  category VARCHAR(30) NOT NULL
    CHECK (category IN ('plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'landscaping', 'pest_control', 'cleaning', 'other')),
  status VARCHAR(20) DEFAULT 'open'
    CHECK (status IN ('open', 'assigned', 'in_progress', 'pending_approval', 'completed', 'cancelled')),
  
  -- Media
  photos JSONB DEFAULT '[]',
  
  -- Cost tracking
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  cost_approved BOOLEAN DEFAULT FALSE,
  cost_approved_by UUID REFERENCES users(id),
  cost_approved_at TIMESTAMP,
  
  -- SLA tracking
  sla_deadline TIMESTAMP,
  sla_met BOOLEAN,
  
  -- Completion
  completed_at TIMESTAMP,
  completion_notes TEXT,
  completion_photos JSONB DEFAULT '[]',
  
  -- Tenant feedback
  tenant_rating INT CHECK (tenant_rating >= 1 AND tenant_rating <= 5),
  tenant_feedback TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_maintenance_requests_property_id ON maintenance_requests(property_id);
CREATE INDEX idx_maintenance_requests_reported_by ON maintenance_requests(reported_by);
CREATE INDEX idx_maintenance_requests_status ON maintenance_requests(status);
CREATE INDEX idx_maintenance_requests_priority ON maintenance_requests(priority);

-- -----------------------------------------------------------------------------
-- DOCUMENTS TABLE
-- Document storage and management
-- -----------------------------------------------------------------------------
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id),
  
  related_entity_type VARCHAR(30) NOT NULL
    CHECK (related_entity_type IN ('user', 'property', 'application', 'transaction', 'maintenance', 'vendor')),
  related_entity_id UUID NOT NULL,
  
  document_type VARCHAR(30) NOT NULL
    CHECK (document_type IN ('lease', 'contract', 'deed', 'id_verification', 'income_proof', 'insurance', 'inspection', 'tax_document', 'disclosure', 'addendum', 'other')),
  
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_size INT,
  mime_type VARCHAR(100),
  
  -- Security
  is_encrypted BOOLEAN DEFAULT TRUE,
  access_level VARCHAR(20) DEFAULT 'private'
    CHECK (access_level IN ('private', 'shared', 'public')),
  
  -- Signatures (for contracts/leases)
  requires_signature BOOLEAN DEFAULT FALSE,
  signed_by JSONB DEFAULT '[]', -- [{ user_id, signed_at, ip_address }]
  fully_executed BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  uploaded_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

CREATE INDEX idx_documents_owner_id ON documents(owner_id);
CREATE INDEX idx_documents_related ON documents(related_entity_type, related_entity_id);

-- -----------------------------------------------------------------------------
-- AUDIT LOGS TABLE
-- Immutable audit trail
-- -----------------------------------------------------------------------------
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  
  old_values JSONB,
  new_values JSONB,
  
  -- Request context
  ip_address INET,
  user_agent TEXT,
  request_id VARCHAR(100),
  
  -- Approval chain tracking
  approval_chain JSONB, -- [{ level, approver_id, approved_at }]
  
  result VARCHAR(20) DEFAULT 'success'
    CHECK (result IN ('success', 'failure')),
  failure_reason TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit logs should be append-only (no updates/deletes allowed)
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- -----------------------------------------------------------------------------
-- NOTIFICATIONS TABLE
-- User notifications
-- -----------------------------------------------------------------------------
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  
  -- Related entity
  related_entity_type VARCHAR(30),
  related_entity_id UUID,
  
  -- Channels
  channels JSONB DEFAULT '["in_app"]', -- ['in_app', 'email', 'sms', 'push']
  
  -- Status
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  -- Action
  action_url VARCHAR(500),
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);

-- -----------------------------------------------------------------------------
-- SAVED PROPERTIES TABLE
-- User favorites/saved properties
-- -----------------------------------------------------------------------------
CREATE TABLE saved_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  
  -- Price alerts
  price_alert_enabled BOOLEAN DEFAULT FALSE,
  alert_price_threshold DECIMAL(15, 2),
  
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, property_id)
);

CREATE INDEX idx_saved_properties_user_id ON saved_properties(user_id);

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_requests_updated_at
  BEFORE UPDATE ON maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- VIEWS
-- =============================================================================

-- Active listings view
CREATE VIEW active_listings AS
SELECT 
  p.*,
  u.first_name as owner_first_name,
  u.last_name as owner_last_name,
  (SELECT url FROM property_images WHERE property_id = p.id AND is_primary = true LIMIT 1) as primary_image
FROM properties p
JOIN users u ON p.owner_id = u.id
WHERE p.status = 'active';

-- User portfolio summary view
CREATE VIEW user_portfolio_summary AS
SELECT 
  u.id as user_id,
  u.email,
  u.first_name,
  u.last_name,
  COUNT(DISTINCT p.id) as total_properties,
  COUNT(DISTINCT CASE WHEN p.status = 'active' THEN p.id END) as active_listings,
  COUNT(DISTINCT CASE WHEN p.status = 'rented' THEN p.id END) as rented_properties,
  COUNT(DISTINCT t.id) as total_transactions,
  SUM(CASE WHEN t.transaction_type = 'lease' AND t.status = 'completed' THEN t.monthly_rent ELSE 0 END) as monthly_rental_income
FROM users u
LEFT JOIN properties p ON u.id = p.owner_id
LEFT JOIN transactions t ON u.id = t.seller_owner_id
WHERE EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id AND ur.role IN ('owner', 'investor'))
GROUP BY u.id, u.email, u.first_name, u.last_name;

-- =============================================================================
-- SEED DATA (Development Only)
-- =============================================================================

-- Create Super Admin user (password: "SuperAdmin123!")
-- Note: In production, create this through secure setup process
INSERT INTO users (id, email, password_hash, first_name, last_name, email_verified, kyc_status, status)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'admin@gradea.realty',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNiAYmyLeaH.y', -- bcrypt hash
  'System',
  'Administrator',
  true,
  'verified',
  'active'
);

INSERT INTO user_roles (user_id, role, is_active)
VALUES ('a0000000-0000-0000-0000-000000000001', 'super_admin', true);

-- =============================================================================
-- END OF SCHEMA
-- =============================================================================
