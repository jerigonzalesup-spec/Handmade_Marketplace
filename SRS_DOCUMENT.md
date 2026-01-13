# Craftly - Software Requirements Specification (SRS)
## Checkpoint 1: Requirements & Analysis Review

**Project Name:** Craftly  
**Document Version:** 1.0  
**Date:** January 12, 2026  
**Status:** Active Development

---

## 1. System Overview

### 1.1 Purpose and Objectives
Craftly is a full-stack e-commerce marketplace platform designed to connect craft creators with buyers. The system enables users to browse, purchase, and sell handmade crafts through an intuitive web-based interface with secure payment processing and order management.

### 1.2 Users and Stakeholders
- **Buyers:** Users who browse and purchase crafts from the marketplace
- **Sellers:** Users who create accounts to list and sell their crafts
- **Administrators:** Platform managers with elevated privileges for system oversight
- **System Administrators:** Technical staff managing infrastructure and database

### 1.3 Context Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                        Craftly Platform                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐      ┌──────────┐      ┌──────────────┐       │
│  │  Buyers  │      │ Sellers  │      │ Admins/Mods  │       │
│  └──────────┘      └──────────┘      └──────────────┘       │
│        │                  │                    │              │
│        └──────────────────┼────────────────────┘              │
│                           │                                   │
│        ┌──────────────────┴──────────────────┐                │
│        │                                     │                │
│   ┌─────────┐                          ┌─────────┐           │
│   │Frontend  │                          │ Backend │           │
│   │ (React)  │◄────────────────────────►│ (Node)  │           │
│   └─────────┘                          └─────────┘           │
│        │                                     │                │
│        └──────────────────┬──────────────────┘                │
│                           │                                   │
│                      ┌─────────┐                              │
│                      │ Database │                              │
│                      │ (MongoDB)│                              │
│                      └─────────┘                              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Functional Requirements

### 2.1 Functional Requirements Table

| ID | Requirement Description | Priority | Source | Notes |
|---|---|---|---|---|
| FR-001 | User Authentication & Authorization | High | Stakeholder | JWT-based auth, role-based access control |
| FR-002 | User Registration (Buyer/Seller) | High | Stakeholder | Email verification required |
| FR-003 | User Profile Management | High | User | Edit profile info, profile picture, seller settings |
| FR-004 | Browse Crafts Catalog | High | Buyer | Search, filter by category, price, rating |
| FR-005 | Product Listing & Management | High | Seller | Create, edit, delete craft listings with images |
| FR-006 | Shopping Cart Functionality | High | Buyer | Add/remove items, update quantities, persist cart |
| FR-007 | Checkout & Payment Processing | High | Buyer | Multiple payment methods, order confirmation |
| FR-008 | Order Management | High | Buyer/Seller | View order history, order status tracking |
| FR-009 | Review & Rating System | Medium | Buyer | Leave reviews on purchased crafts |
| FR-010 | Admin Dashboard | High | Admin | User management, order oversight, analytics |
| FR-011 | Seller Dashboard | High | Seller | Sales analytics, inventory management |
| FR-012 | Notifications System | Medium | User | Email notifications for orders, updates |
| FR-013 | Search Functionality | High | Buyer | Full-text search with autocomplete |
| FR-014 | Product Details Page | High | Buyer | Images, description, price, reviews, seller info |
| FR-015 | Seller Verification | Medium | Seller | Seller badge/status on marketplace |

---

## 3. Non-Functional Requirements

### 3.1 Non-Functional Requirements Table

| Category | Requirement | Metric/Target | Notes |
|---|---|---|---|
| **Performance** | Page Load Time | < 2 seconds | Optimize images, implement caching |
| **Performance** | API Response Time | < 500ms | 95th percentile |
| **Scalability** | Concurrent Users | 1000+ simultaneous | Load balanced deployment |
| **Security** | Password Encryption | BCrypt/Argon2 | Minimum 12 character requirement |
| **Security** | Data Encryption | HTTPS/TLS 1.2+ | All data in transit encrypted |
| **Security** | SQL Injection Prevention | Parameterized queries | Use ORM/prepared statements |
| **Security** | Authentication Timeout | 30 minutes | Session expiration |
| **Reliability** | System Uptime | 99.5% | Monitored via health checks |
| **Reliability** | Database Backup | Daily backups | 30-day retention |
| **Usability** | Mobile Responsiveness | 100% coverage | Mobile-first design approach |
| **Usability** | Accessibility | WCAG 2.1 AA | Screen reader compatible |
| **Maintainability** | Code Coverage | > 70% | Unit tests required |
| **Compliance** | Data Privacy | GDPR compliant | User data handling policies |

---

## 4. Use Cases & Processes

### 4.1 Swimlane Diagram: Major System Interactions

```
                    BUYER              SYSTEM             SELLER            ADMIN
                      │                   │                  │                │
    1. Browse Crafts   │──────────────────►│                  │                │
                       │◄──────────────────│                  │                │
                       │  Display Catalog  │                  │                │
                       │                   │                  │                │
    2. View Details    │──────────────────►│                  │                │
                       │◄──────────────────│                  │                │
                       │  Product Details  │                  │                │
                       │                   │                  │                │
    3. Add to Cart     │──────────────────►│                  │                │
                       │◄──────────────────│                  │                │
                       │  Cart Updated     │                  │                │
                       │                   │                  │                │
    4. Checkout        │──────────────────►│                  │                │
                       │◄──────────────────│                  │                │
                       │  Process Payment  │                  │                │
                       │                   │                  │                │
    5. Order Created   │                   │──────────────────►│                │
                       │◄──────────────────┤                  │                │
                       │ Order Confirmed   │◄──────────────────│                │
                       │                   │  Inventory Update │                │
                       │                   │                  │  Report        │
                       │                   │                  │───────────────►│
                       │                   │                  │◄───────────────│
                       │                   │                  │  Acknowledge   │
                       │                   │                  │                │
```

### 4.2 Key Use Cases

**UC-001: User Registration**
- Actor: New User
- Precondition: User has access to platform
- Main Flow: Enter email → Set password → Verify email → Select role (Buyer/Seller)
- Postcondition: Account created, user logged in

**UC-002: Browse & Purchase**
- Actor: Buyer
- Precondition: User logged in
- Main Flow: Search crafts → View details → Add to cart → Checkout → Pay
- Postcondition: Order placed, confirmation sent

**UC-003: List & Sell Crafts**
- Actor: Seller
- Precondition: Seller account verified
- Main Flow: Create listing → Upload images → Set price → Publish
- Postcondition: Product visible in marketplace

**UC-004: Manage Orders**
- Actor: Seller/Buyer
- Precondition: Order exists
- Main Flow: View order status → Update shipping → View history
- Postcondition: Order tracked and updated

---

## 5. High-Level Architecture

### 5.1 BPMN Diagram: System Architecture Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                      CRAFTLY ARCHITECTURE                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   FRONTEND LAYER                         │    │
│  │  React.js + Tailwind CSS + Vite                          │    │
│  │  ├─ Pages (Browse, Checkout, Auth, Dashboard)          │    │
│  │  ├─ Components (Cards, Forms, Navigation)              │    │
│  │  └─ Services (API client, Auth service)                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                            │                                      │
│                            ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   API GATEWAY / MIDDLEWARE               │    │
│  │  Error Handling, Authentication, Logging                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                            │                                      │
│                            ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   BACKEND LAYER                          │    │
│  │  Node.js + Express.js                                   │    │
│  │  ├─ Controllers (Auth, Craft, Cart, Order, User)       │    │
│  │  ├─ Routes & Endpoints                                 │    │
│  │  ├─ Middleware (JWT Auth, Error handling)              │    │
│  │  └─ Services (Business logic)                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                            │                                      │
│                            ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   DATA ACCESS LAYER                      │    │
│  │  ├─ Models (User, Craft, Cart, Order)                  │    │
│  │  ├─ Database Queries                                   │    │
│  │  └─ ORM Operations                                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                            │                                      │
│                            ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  DATABASE LAYER                          │    │
│  │  MongoDB - Collections:                                 │    │
│  │  ├─ Users (credentials, profile, role)                 │    │
│  │  ├─ Crafts (listings, images, prices)                  │    │
│  │  ├─ Orders (transactions, status)                      │    │
│  │  └─ Carts (user shopping carts)                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                    │
│  ┌──────────────────────────────────────┐                        │
│  │      EXTERNAL INTEGRATIONS            │                        │
│  │  ├─ Payment Gateway (Stripe/PayPal)  │                        │
│  │  ├─ Email Service (SendGrid/SMTP)    │                        │
│  │  └─ File Storage (Cloudinary/AWS S3) │                        │
│  └──────────────────────────────────────┘                        │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

### 5.2 System Modules & Components

| Module | Components | Responsibility |
|---|---|---|
| **Authentication** | Auth Controller, JWT Config, Auth Middleware | User login, registration, token validation |
| **User Management** | User Controller, User Model | Profile management, seller verification |
| **Craft Catalog** | Craft Controller, Craft Model | Product listings, search, filtering |
| **Shopping Cart** | Cart Controller, Cart Model | Cart operations, item management |
| **Order Processing** | Order Controller, Order Model | Order creation, status tracking, history |
| **Admin Panel** | Admin Routes, Admin Controller | User oversight, analytics, moderation |
| **Notifications** | Notification Service | Email alerts, order updates |

### 5.3 Integration Points & Data Flows

1. **Frontend ↔ Backend Communication**
   - REST API endpoints over HTTP/HTTPS
   - JSON request/response format
   - CORS enabled for cross-origin requests

2. **Backend ↔ Database**
   - MongoDB connection via Mongoose ODM
   - Transaction support for orders
   - Indexed queries for performance

3. **Payment Integration**
   - PCI DSS compliant payment processing
   - Webhook handling for payment confirmations
   - Transaction logging and audit trail

4. **Email Notifications**
   - Order confirmation emails
   - Shipping updates
   - Account verification emails

---

## 6. Risk Assessment

### 6.1 Risk Matrix

| Risk | Likelihood (L/M/H) | Impact (L/M/H) | Mitigation |
|---|---|---|---|
| **R-001: Payment Processing Failures** | Medium | High | Implement retry logic, redundant payment gateways, comprehensive error handling |
| **R-002: Database Corruption** | Low | High | Daily automated backups, database replication, point-in-time recovery setup |
| **R-003: DDoS Attacks** | Medium | High | WAF implementation, rate limiting, CDN with DDoS protection |
| **R-004: Security Breaches** | Medium | High | Regular security audits, penetration testing, encryption of sensitive data |
| **R-005: API Performance Degradation** | Medium | Medium | Caching strategy (Redis), load balancing, database indexing optimization |
| **R-006: Seller Fraud** | Medium | Medium | Seller verification process, payment escrow, dispute resolution system |
| **R-007: Data Loss** | Low | High | Multi-region backups, disaster recovery plan, automated testing |
| **R-008: Third-party Service Outage** | Medium | Medium | Service monitoring, fallback providers, graceful degradation |
| **R-009: Scope Creep** | High | Medium | Clear requirements documentation, change control process, agile sprints |
| **R-010: Development Delays** | Medium | Medium | Resource allocation, milestone tracking, risk review meetings |

---

## 7. Assumptions & Constraints

### 7.1 Technical Assumptions
- Users have reliable internet connectivity
- MongoDB database will remain accessible and stable
- Third-party APIs (payment, email) maintain 99.9% uptime
- Browser compatibility: Chrome, Firefox, Safari, Edge (latest 2 versions)
- JavaScript enabled on client-side

### 7.2 Organizational Assumptions
- Team has expertise in Node.js, React, and MongoDB
- Adequate hosting infrastructure available (VM, CDN)
- Support team available during business hours
- Marketing and user acquisition handled separately

### 7.3 Constraints
- **Budget Constraint:** Limited initial hosting budget
- **Time Constraint:** MVP delivery in 4 months
- **Regulatory Constraint:** Must comply with e-commerce regulations and data privacy laws
- **Technical Constraint:** Mobile app development out of scope (web only)
- **Resource Constraint:** 5-person development team

### 7.4 Environmental Limitations
- Dependency on external payment processors
- Email delivery reliability depends on mail service provider
- Bandwidth limitations for file uploads

---

## 8. Validation & Feasibility Notes

### 8.1 Requirement Completeness
- All functional requirements map to at least one use case
- Non-functional requirements have measurable targets
- Requirements are testable and verifiable
- No conflicting or duplicate requirements identified

### 8.2 Feasibility Assessment

| Aspect | Status | Notes |
|---|---|---|
| **Technical Feasibility** | ✅ Feasible | Stack is proven, team has required skills |
| **Timeline Feasibility** | ✅ Feasible | MVP scope well-defined, realistic estimates |
| **Budget Feasibility** | ⚠️ Conditional | Depends on third-party service costs |
| **Resource Feasibility** | ✅ Feasible | 5-person team adequate for scope |
| **Operational Feasibility** | ✅ Feasible | Clear operational procedures defined |

### 8.3 Validation Methods

**Requirement Validation:**
- ✅ Stakeholder reviews and sign-off
- ✅ Use case walkthroughs with business users
- ✅ Prototype testing with target users
- ✅ Performance benchmarking against targets

**System Testing:**
- Unit tests (>70% code coverage)
- Integration tests (API endpoints)
- End-to-end tests (user workflows)
- Security testing (OWASP Top 10)
- Load testing (concurrent user simulation)

**Acceptance Criteria:**
- All FR requirements implemented and tested
- All NFR metrics meet defined targets
- No critical/high severity bugs remaining
- User acceptance testing passed
- Stakeholder sign-off obtained

---

## 9. Document Sign-Off

| Role | Name | Date | Signature |
|---|---|---|---|
| Project Manager | TBD | - | |
| Business Analyst | TBD | - | |
| Lead Developer | TBD | - | |
| Client/Stakeholder | TBD | - | |

---

## 10. Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | Jan 12, 2026 | Development Team | Initial SRS creation |

---

**End of Document**
