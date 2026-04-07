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
- **Notification & Messaging Platform**
- **WhatsApp Bot (Self-Service)**
- **Advanced Doctor Availability**
- **Smart Scheduling & Recommendations**
- **Recurring Appointments**
- **Inventory Management**
- **Procedure Catalog (Stock Integration)**
- **Doctor Dashboard**
- **Operational Intelligence (AI-Driven)**

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
- **Patient CRUD**: Complete lifecycle management of patient profiles with multi-tenant isolation.
- **Enterprise-Standard Header**: Bold identification with persistent meta-info subheaders (Phone | Email | Age) and segmented quick actions.
- **Categorized Quick Actions**: Logical grouping of high-frequency tasks (Booking, Notes, Invoices) and secondary administrative actions (Export, Print, Archive).
- **Minimalist Tab Navigation**: Underlined enterprise indicators for localized workspaces: Overview, Clinical, Financial, Documents, and Engagement.
- **Unified Activity Stream**: High-performance medical timeline with **Infinite Scroll** (Aggregated UNION ALL from Appointments, Medical Records, Invoices, and WhatsApp).
- **Row Factory Pattern**: Specialized UI rendering for different history events (Invoices vs Clinical Notes) within the same stream.
- **Smart-Dumb Architecture**: Strict separation of data-fetching containers from presentational components for maximum responsiveness.

#### Related API:
- `GET /api/v1/patients`
- `POST /api/v1/patients`
- `GET /api/v1/patients/{id}`
- `GET /api/v1/patients/{id}/profile` (Thinner core profile)
- `GET /api/v1/patients/{id}/activities` (Paginated stream)

#### Frontend:
- `/patients/[id]` (Standardized Detail View)
- `PatientHeader` (Enterprise Compound Component)
- `PatientRecentActivity` (Infinite scroll stream with Factory Row)
- `useIntersectionObserver` (Scroll triggering hook)
- `useInfiniteQuery` (State management for history)


---

### 📅 Appointment Scheduling

#### Features:
- **Time Slot Management**: Dynamic slot generation with status (Available, Booked, Past, Selected).
- **Conflict Prevention**: Real-time checking of double-bookings and doctor availability.
- **Rescheduling Engine**: Flexible rescheduling with state mutation rules (Scheduled -> Confirmed -> Completed).
- **Next Available Search**: Automated discovery of the earliest possible appointment opening.
- **No-show Tracking**: Mark appointments as 'no_show' from scheduled or confirmed states with automatic dashboard metric updates.

#### Related API:
- `POST /api/v1/appointments`
- `PATCH /api/v1/appointments/{id}/reschedule`
- `PATCH /api/v1/appointments/{id}/no-show`
- `GET /api/v1/appointments/availability`
- `GET /api/v1/appointments/next-available`

#### Frontend:
- `BookingModal` (Unified scheduling UI)
- `AvailabilitySelector` (Visual slot picking)

---

### 🧠 Smart Scheduling & Recommendations

#### Features:
- **Intelligent Ranking**: AI-ready ranking of available slots based on strategies (`Fastest`, `Best-Fit`).
- **Gap Minimization**: Suggestions optimized for schedule density to reduce idle time for doctors.
- **Context-Aware Suggestions**: Recommendations based on patient history and doctor workload.
- **Visual Highlighting**: "Best Fit" badges in the booking flow for quick selection.

#### Related API:
- `GET /api/v1/appointments/smart-suggestions`

#### Frontend:
- `SmartSuggestions` component (Integrated in `BookingModal`)
- `useSmartSuggestions` hook

---

### 🧠 Operational Intelligence (AI-Driven)

#### Features:
- **No-Show Predictor**: Behavioral analysis scoring (Low, Medium, High) based on patient history, gaps, and last attendance.
- **Automated Revenue Capture**: Keyword-based scanning ("stitches", "x-ray", etc.) in medical notes cross-referenced with invoices.
- **Unified Communications Inbox**: Centralized message hub for WhatsApp, Email, and SMS.
- **AI Classification**: Automatic categorization of incoming messages (Emergency, Booking, Complaint).

#### Related API:
- `GET /api/v1/appointments/{id}/no-show-risk`
- `GET /api/v1/revenue/missing`
- `GET /api/v1/communications`

#### Frontend:
- `NoShowBadge` component
- `RevenueAlerts` component
- `InboxList` & `InboxMessage` components

---

### 🔁 Recurring Appointments

#### Features:
- **Flexible Recurrence Patterns**: Support for Weekly and Monthly recurring appointments.
- **Strict Validation**: Every generated occurrence is validated against doctor availability, shifts, breaks, and existing conflicts.
- **Configurable Limits**: Safe 1-year maximum limit for recurrence to prevent infinite data generation.
- **Status Tracking**: Link appointments to a parent `Recurrence Rule` for synchronized management.

#### Related API:
- `POST /api/v1/appointments/recurring`
- `GET /api/v1/appointments/recurring`

#### Frontend:
- `RecurrenceSelector` (Integrated in `BookingModal`)
- `useCreateRecurrence` hook

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

### 📝 Medical Records System (Clinical Data)

#### Features:
- **Structured Clinical Data**: Detailed tracking of diagnoses, clinical notes, and specific arrays of Vitals and Medications.
- **Enrichment**: Link records to specific appointments and doctors for complete record keeping.
- **Historical Timeline**: View past medical records chronologically integrated with the overall Patient Timeline alongside visits and appointments.
- **Linked Procedures**: Record medical procedures performed during a visit, which automatically triggers linked inventory stock deductions.
- **Flexible Management**: Support for creating and partially updating comprehensive clinical histories.

#### Related API:
- `GET /api/v1/patients/{id}/medical-records`
- `POST /api/v1/patients/{id}/medical-records`
- `GET /api/v1/medical-records/{id}`
- `PATCH /api/v1/medical-records/{id}`
- `DELETE /api/v1/medical-records/{id}`
- `GET /api/v1/patients/{id}/timeline` (Integrated)

#### Frontend:
- `MedicalRecordList` and `MedicalRecordCard` components
- `MedicalRecordForm` with dynamic nested vital and medication trackers
- "Medical Records" tab inside patient detail views

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

### 📦 Inventory Management

#### Features:
- **Stock Tracking**: Real-time monitoring of clinical supplies and consumables levels.
- **Low Stock Alerts**: Visual indicators (badges) to highlight items below critical thresholds.
- **Stock Adjustments**: Manual adjustment engine for restocks or wastage, with full movement history.
- **Categorization**: Group items by category (PPE, Lab, Surgical) and SKU for enterprise organization.

#### Related API:
- `GET /api/v1/inventory/items`
- `POST /api/v1/inventory/items`
- `PATCH /api/v1/inventory/items/{id}`
- `POST /api/v1/inventory/items/{id}/adjust`
- `GET /api/v1/inventory/items/{id}/movements`

#### Frontend:
- `/inventory` (Main management page)
- `useInventoryItems`, `useAdjustStock` hooks

---

### 🧬 Procedure Catalog

#### Features:
- **Procedure Blueprinting**: Define standard clinic procedures with fixed durations and base pricing.
- **Inventory Linkage**: Map specific inventory items and quantities consumed by a procedure.
- **Transactional Consistency**: Atomic backend engine that deducts stock precisely when a procedure is added to a visit.
- **Doctor Workflow Integration**: Quick-select procedure picker accessible directly within the medical record editor.

#### Related API:
- `GET /api/v1/procedures`
- `POST /api/v1/procedures`
- `PATCH /api/v1/procedures/{id}`
- `POST /api/v1/medical-records/{id}/procedures`

#### Frontend:
- `/procedures` (Blueprint management)
- `AddProcedureDialog` (Visit integration)
- `useProcedures` hook


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

### 🔔 Notification System & Patient Messaging

#### Features:
- **System Alerts**: Real-time listing of important clinic events and reminders for clinic staff.
- **Unread Indicators**: Visual tracking of new notifications in the dashboard.
- **Multi-Channel Dispatcher**: Modular abstraction for patient-facing events routed via Email or WhatsApp.
- **Automated Triggers**: Booking confirmations, 24-hr reminders, and cancellations dispatched automatically via background workers.
- **Fine-Grained Preferences**: Granular opt-in/opt-out per patient for specific event messaging types across different channels.
- **Delivery History**: Unified chronological UI of all outbound messages sent to a patient, including their delivery statuses.

#### Related API:
- `GET /api/v1/notifications`
- `PATCH /api/v1/notifications/{id}/read`
- `GET /api/v1/patients/{id}/notifications`
- `GET /api/v1/patients/{id}/notification-preferences`
- `PUT /api/v1/patients/{id}/notification-preferences`

#### Frontend:
- `AppTopbar` dropdown
- `/notifications`
- **Patient Communications Tab**: Unified view of messaging readiness, opt-in status, and full delivery logs for a specific patient.

---

### 🤖 WhatsApp Bot (Self-Service)

#### Features:
- **Stateful Conversational Engine**: Session-based router handling multi-step patient intents (Book, View, Cancel) over WhatsApp using context-aware state management.
- **Webhook Integration**: Secure inbound webhook receiver for parsing external messaging provider payloads (e.g., Meta, Twilio).
- **Patient Verification**: E.164 phone number normalization for automatic profile linking with inbound messages.
- **Automated Booking Flow**: Guided self-service for selecting dates and time slots based on real-time doctor availability and existing appointments.
- **Appointment Retrieval**: Instant "View Next Appointment" inquiry with doctor and time details.
- **One-Tap Cancellation**: Secure confirmation-based cancellation of upcoming appointments directly from the chat.

#### Related API:
- `POST /webhooks/whatsapp`
- `GET /api/v1/patients/{id}/whatsapp/history` (Administrative log)
- `GET /api/v1/patients/{id}/whatsapp/status` (Readiness check)

#### Architecture:
- `whatsappbot` internal module with session tracking in PostgreSQL (JSONB state).
- Decoupled `whatsapp.Sender` interface for easy provider swapping.
- Integration with `AvailabilityService` for real-time slot generation.

---

---

### 🔍 Unified Global Search Platform

#### Features:
- **Universal Discovery**: One-stop search across Patients, Doctors, Appointments, Billing, Reports, Medical Notes, Notifications, AI Memory, and Audit Logs.
- **Command-Center UI**: Instant keyboard access (`Cmd+K`) from any screen with a grouped, categorized results dropdown.
- **Dedicated Search Engine Page**: Full-screen results view at `/search` for deep exploration of matches across the entire clinic ecosystem.
- **Intelligent Ranking**: Proprietary scoring algorithm that weights exact matches, title prefixes, and relevant metadata to ensure the most useful results appear first.
- **Tenant-Safe Architecture**: Strict data partitioning ensures a clinic only ever sees its own records, enforced at the provider level.
- **Scalable Provider Pattern**: Plugin-based backend architecture allows new system modules to register for search in minutes without modifying core logic.

#### Searchable Content:
- **Patients**: First name, last name, phone, email.
- **Doctors**: Full name, specialty, license number.
- **Appointments**: Patient name, doctor name, status, reason, notes.
- **Billing**: Invoice status, amount,

### Patient Management
- **Centralized Patient List**: Advanced search and filtering for patient records.
- **Patient Profile 360°**: Complete 360-degree view of a patient, including:
  - Personal & Contact Information
  - Medical History & Clinical Notes
  - Appointment Timeline (Past & Upcoming)
  - billing & Invoice status
  - Document & Report management with AI analysis
  - Communication History (WhatsApp & Notifications)
  - Quick Actions for streamlined workflows
- **Medical Records**: Structured storage of diagnoses, vitals, and prescriptions.
, clinical notes.
- **AI Memory**: Summaries of medical insights and automated report analyses.
- **Notifications**: Title, message content, type, status.
- **Audit Logs**: Actions, entity types, per-user activity history.

#### Related API:
- `GET /api/v1/search?q={query}&types={optional_csv}`

#### Frontend:
- `features/search/components/GlobalSearch` (Topbar integration)
- `app/(dashboard)/search/page.tsx` (Deep-dive results page)
- `features/search/hooks/useSearch` (High-performance TanStack query integration)

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

### 👨‍⚕️ Doctor Dashboard

#### Features:
- **Focused Workspace**: Dedicated entry point for doctors to manage their daily clinical operations.
- **Dynamic Stats Cards**: Real-time tracking of appointments today, upcoming, completed, no-shows, and pending notes.
- **Today's Schedule**: High-priority list of patients today with direct links to profiles and status indicators.
- **Medical Activity Feed**: Chronological timeline of recent visits and notes managed by the doctor.
- **Quick Action Center**: Keyboard-friendly shortcuts for scheduling, patient search, and clinical documentation.
- **Pending Notes Tracker**: Automated discovery of completed visits requiring documentation (notes/diagnosis).
- **Tenant & Role Aware**: Strict security ensures doctors only see their own workload and patient data within their tenant.

#### Related API:
- `GET /api/v1/doctor-dashboard`

#### Frontend:
- `/doctor-dashboard` (Main workspace)
- `features/doctor-dashboard/components` (Specialized UI widgets)
- `useDoctorDashboard` (Real-time data synchronization hook)

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
