# 🚀 Clinic Management SaaS — Feature Inventory

**Project Status Summary**
- **Total Modules**: 11
- **Total Features**: 45
- **System Maturity Level**: **Production-ready**

---

## 1. Overview
A multi-tenant, secure, and modern Clinic Management System (SaaS) designed to streamline clinic workflows, automate patient scheduling, and provide AI-driven medical report analysis. The system is built with a high-performance **Go** backend and a premium **Next.js** frontend.

---

## 2. Core Modules
- **Authentication & Security**
- **Multi-tenancy (Platform Engine)**
- **Patient Management**
- **Appointment Scheduling**
- **Interactive Calendar**
- **Medical Records (Visits)**
- **Billing & Invoices**
- **Attachment Management**
- **AI Report Analysis**
- **Notification System**
- **Advanced Doctor Availability**

---

## 3. Feature Breakdown

### 🔐 Authentication & Security

#### Features:
- **JWT Authentication**: Secure stateless authentication using JSON Web Tokens.
- **Rotating Refresh Tokens**: Enhanced security with 7-day revolving refresh tokens to maintain sessions.
- **RBAC (Role Based Access Control)**: Permission-based access for `admin`, `doctor`, and `receptionist`.
- **Session Persistence**: Automatic re-authentication and session management in the frontend.

#### Related API:
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/me`

#### Frontend:
- `/login`
- `useAuthStore` (Global state)

---

### 🏢 Multi-tenancy (Platform Engine)

#### Features:
- **Tenant Isolation**: Strict data partitioning at the database and API level (Enforced by `tenant_id`).
- **White-label Branding**: Dynamic configuration of Clinic Name, Logo, Primary/Secondary colors.
- **UI Customization**: Runtime injection of theme tokens (Border radius, Font family).
- **Timezone Management**: Tenant-specific timezone support for global clinic operations.

#### Related API:
- `GET /api/v1/tenants/config` (Discovery by subdomain)

#### Frontend:
- `ThemeProvider` (Runtime styling)
- `/settings` (Tenant config)

---

### 👥 Patient Management

#### Features:
- **Patient CRUD**: Complete lifecycle management of patient profiles.
- **Patient Overview**: Compact summary header with persistent vital info in detail view.
- **Tabbed Interface**: Organized view including Overview, Appointments, Billing, Reports, and Notes.
- **Patient Timeline**: Visual history of all medical interactions, visits, and appointments.

#### Related API:
- `GET /api/v1/patients`
- `POST /api/v1/patients`
- `GET /api/v1/patients/{id}`

#### Frontend:
- `/patients`
- `/patients/[id]` (Tabbed view)

---

### 📅 Appointment Scheduling

#### Features:
- **Time Slot Management**: Dynamic slot generation with status (Available, Booked, Past, Selected).
- **Conflict Prevention**: Real-time checking of double-bookings and doctor availability.
- **Rescheduling Engine**: Flexible rescheduling with state mutation rules (Scheduled -> Confirmed -> Completed).
- **Next Available Search**: Automated discovery of the earliest possible appointment opening.

#### Related API:
- `POST /api/v1/appointments`
- `PATCH /api/v1/appointments/{id}/reschedule`
- `GET /api/v1/appointments/availability`
- `GET /api/v1/appointments/next-available`

#### Frontend:
- `BookingModal` (Unified scheduling UI)
- `AvailabilitySelector` (Visual slot picking)

---

### 🗓️ Interactive Calendar

#### Features:
- **Drag-and-drop Reschedule**: Move appointments across time slots directly on the calendar.
- **Range-based View**: Fetch and display enriched appointments for specific date ranges.
- **Doctor Context**: Filter calendar by specific doctors or view clinic-wide workload.

#### Related API:
- `GET /api/v1/appointments/calendar`

#### Frontend:
- `/appointments/calendar`
- `AppointmentCalendar` component

---

### 📝 Medical Records (Visits)

#### Features:
- **Visit Documentation**: Record detailed observations, diagnoses, and prescriptions.
- **Enrichment**: Link visits to specific appointments for complete record keeping.
- **Historical Analysis**: View past visits chronologically.

#### Related API:
- `POST /api/v1/visits`
- `GET /api/v1/patients/{id}/timeline`

#### Frontend:
- `VisitsList` (Inside patient tabs)

---

### 💰 Billing & Invoices

#### Features:
- **Invoice Generation**: Automated creation of billing records for appointments/services.
- **Payment Tracking**: Management of `pending` and `paid` states.
- **Patient Ledger**: List of all financial history per patient.

#### Related API:
- `POST /api/v1/invoices`
- `GET /api/v1/patients/{id}/invoices`
- `PATCH /api/v1/invoices/{id}/pay`

#### Frontend:
- `Billing` tab (Patient detail)

---

### 📂 Attachment Management

#### Features:
- **High-capacity Uploads**: Support for files up to 50MB (PDFs, Images, Medical Reports).
- **Secure Storage**: Storage abstraction for patient-sensitive documents.
- **File Metadata**: Tracking of upload date, user, size, and mime type.

#### Related API:
- `POST /api/v1/patients/{id}/attachments`
- `GET /api/v1/attachments/{id}`
- `DELETE /api/v1/attachments/{id}`

#### Frontend:
- `Reports` tab (Patient detail)

---

### 🧠 AI Report Analysis

#### Features:
- **Medical Report Summary**: AI-driven summarization of uploaded medical PDFs.
- **Analysis Categories**: Support for different analysis types (Summary, Abnormalities, Action Items).
- **Persistent Analysis History**: Retrieve past AI analyses for any given attachment.

#### Related API:
- `POST /api/v1/attachments/{id}/analyze`
- `GET /api/v1/attachments/{id}/analyses`

#### Frontend:
- `AIAnalysisCard` (Integration in Patient detail)

---

### 🔔 Notification System

#### Features:
- **System Alerts**: Real-time listing of important clinic events and reminders.
- **Unread Indicators**: Visual tracking of new notifications.
- **History Feed**: Searchable history of past alerts.

#### Related API:
- `GET /api/v1/notifications`
- `PATCH /api/v1/notifications/{id}/read`

#### Frontend:
- `AppTopbar` dropdown
- `/notifications`

---

### 🗓️ Advanced Doctor Availability

#### Features:
- **Weekly Schedule Management**: Define recurring working shifts per day of week, supporting multiple shifts per day (e.g. morning + evening) with no schema changes required.
- **Break Windows**: Carve named break periods (e.g. Lunch, Prayer) out of a shift. Breaks are stored as first-class entities, enabling individual auditing and removal.
- **Date-Specific Exceptions**: Override or cancel a doctor's availability for a specific calendar date:
  - `day_off` — doctor is fully unavailable on that date.
  - `override` — doctor works non-standard hours on that date.
- **Smart Slot Generation**: Computes bookable time slots for a date range, integrating schedule shifts, breaks, exceptions, and existing appointment conflicts into a single prioritised result (`available`, `booked`, `break`, `unavailable`).
- **Tenant-Aware**: All availability records are strictly scoped to a tenant; cross-tenant data leakage is impossible.
- **Appointment Integration**: `IsDoctorAvailableAt()` is the single authoritative availability gate used by the appointment booking and rescheduling engine.

#### Related API:
- `GET  /api/v1/doctors/{id}/availability` — full config view (schedules + breaks + exceptions)
- `GET  /api/v1/doctors/{id}/availability/slots` — computed slot list for a date range
- `POST /api/v1/doctors/{id}/availability/schedules` — create a weekly shift
- `PATCH /api/v1/doctors/{id}/availability/schedules/{sid}` — update a shift
- `DELETE /api/v1/doctors/{id}/availability/schedules/{sid}` — remove a shift
- `POST /api/v1/doctors/{id}/availability/schedules/{sid}/breaks` — add a break to a shift
- `DELETE /api/v1/doctors/{id}/availability/breaks/{bid}` — remove a break
- `GET  /api/v1/doctors/{id}/availability/exceptions` — list date exceptions
- `POST /api/v1/doctors/{id}/availability/exceptions` — create a day-off or override
- `DELETE /api/v1/doctors/{id}/availability/exceptions/{eid}` — remove an exception

#### Database:
- `doctor_schedule` — recurring weekly shifts (replaces/extends legacy `doctor_availability`)
- `doctor_breaks` — named break windows linked to a schedule shift
- `doctor_exceptions` — date-specific day-off or custom-hours entries

#### Architecture:
- Module: `internal/availability` (Backend) & `features/doctors/availability` (Frontend)
- Pattern: `handler → service → repository` (clean architecture, no cross-layer leakage)
- Integration point: `AvailabilityService.IsDoctorAvailableAt()` consumed by `AppointmentService`

#### Frontend:
- `features/doctors/availability/components/WeeklyScheduleEditor.tsx`
- `features/doctors/availability/components/BreaksEditor.tsx`
- `features/doctors/availability/components/ExceptionsEditor.tsx`
- `app/(dashboard)/doctors/[id]/availability`
- Fully typed TanStack standard API Hooks

---

## 4. Advanced Features
- **Drag & Drop Calendar**: Fully interactive calendar with direct state mutation from the UI.
- **White-label Theme System**: Runtime branding switching based on the logged-in tenant.
- **Complex Availability Logic**: Smart slot calculation across multiple doctors and timezones.
- **AI-Enhanced Patient Detail**: Automated summaries of medical history for quick doctor review.

---

## 5. UX Features
- **Premium Dashboard**: Glassmorphism cards with vibrant gradients and data visualizations.
- **High-performance Loading**: Widespread use of Skeletons instead of generic spinners.
- **Unified Booking UI**: Identical, robust booking flow available from both Patients and Appointments modules.
- **Intelligent Search**: Quick command-style search (Cmd+K) in the top navigation bar.

---

## 6. Technical Features
- **Clean Architecture (Go)**: Strictly layered backend (Handler -> Service -> Repository).
- **Atomic Repository Pattern**: Database interactions isolated from business logic.
- **Tailwind CSS v4**: Cutting-edge styling engine for ultra-fast performance.
- **React Query Persistence**: Advanced caching and auto-invalidation for consistent UI states.
- **Subdomain Routing**: Infrastructure-level multi-tenancy support.

---

## 7. Planned / Potential Improvements
- [ ] **Real-time Comms**: WebSocket integration for instant notification push.
- [ ] **Patient Portal**: Dedicated secure entry point for patients to self-book.
- [ ] **Advanced Analytics**: Deeper financial reporting and seasonal volume predictions.
- [ ] **External Integrations**: HL7/FHIR support for electronic health information exchange.
