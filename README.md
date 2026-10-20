# eCountyServices
### Public Service Request and Management System

## 1. Project Overview

eCounty Services is a web-based public service request management system designed to improve communication between citizens and county government service departments. It provides a centralized platform for reporting public service issues, assigning work to technicians, monitoring progress, and tracking resolution.

The system follows a client-server architecture with a React frontend and a Spring Boot REST API backend. It supports role-based access control to ensure that citizens, administrators, and technicians can access the functions appropriate to their responsibilities.

**Live application:** https://e-county-service.vercel.app/

**Backend API:** https://ecountyservices.onrender.com/

## 2. Objectives

The main objectives are to:

- Provide citizens with an online platform for submitting public service requests.
- Enable citizens to track the progress of submitted requests.
- Allow administrators to manage users, service requests, and technicians.
- Support assignment of service requests to appropriate technicians.
- Allow technicians to update the progress and status of assigned work.
- Provide administrators with an overview of pending, ongoing, and resolved cases.
- Improve accountability, transparency, and efficiency in county service delivery.

## 3. System Design and Architecture

The application uses a three-layer logical architecture.

### 3.1 Presentation Layer

The presentation layer is the React frontend. It provides the user interface for registration, authentication, dashboards, service request submission, and request tracking.

The frontend communicates with the backend through HTTP requests to REST API endpoints.

### 3.2 Application Layer

The application layer is implemented using Spring Boot. It processes incoming requests, validates user input, enforces authorization rules, executes business logic, and communicates with the database.

The backend exposes REST endpoints for authentication, user management, service request management, technician management, assignment, and status tracking.

### 3.3 Data Layer

The data layer uses MySQL to persist application information. The database stores user accounts, roles, service requests, assignments, and other application records according to the implemented entity relationships.

Passwords should be stored as secure hashes rather than plaintext. The backend uses Spring Security and a password encoder for authentication-related security.

### Architecture Diagram

```text
+----------------------------------+
|          Users / Browsers        |
|  Citizens | Admins | Technicians |
+----------------+-----------------+
                 |
                 v
+----------------------------------+
|        React + Vite Frontend     |
| Pages | Forms | Dashboards       |
| Role-based navigation            |
+----------------+-----------------+
                 |
                 | HTTPS / REST / JSON
                 v
+----------------------------------+
|       Spring Boot REST API       |
| Authentication and Authorization|
| Business Logic and Validation    |
| Request and Assignment Management|
+----------------+-----------------+
                 |
                 | Spring Data JPA / Hibernate
                 v
+----------------------------------+
|             MySQL                |
| Users | Requests | Assignments   |
| Status and Related Records       |
+----------------------------------+
```

## 4. Technologies Used

| Technology | Purpose |
|---|---|
| React | Builds reusable frontend components and interactive user interfaces. |
| Vite | Provides frontend development tooling and production builds. |
| Java | Implements backend application logic. |
| Spring Boot | Creates and runs the REST API backend. |
| Spring Security | Enforces authentication and authorization. |
| JWT | Supports token-based authentication where configured by the application. |
| Spring Data JPA | Provides repository-based database operations. |
| Hibernate | Maps Java entities to relational database tables. |
| MySQL | Stores persistent application data. |
| Axios | Sends HTTP requests from the frontend to the backend. |
| Tailwind CSS | Supports responsive layouts and interface styling. |
| Lucide React | Supplies interface icons. |
| Vercel | Hosts the frontend application. |
| Render | Hosts the Spring Boot backend. |
| Git and GitHub | Support source-code version control and collaboration. |

*Note: The listed libraries should match the actual dependencies and implementation in the repository. JWT is applicable to the current design where the frontend sends a bearer token.*

## 5. User Roles and Responsibilities

The application uses role-based access control to separate responsibilities.

### 5.1 Citizen

Citizens are the primary users of the public service request system.

**Responsibilities and permissions:**

- Register for an account and sign in.
- Submit service requests for public issues such as broken streetlights, water supply problems, and garbage collection.
- Provide the request category, location, description, and an optional image where supported.
- View their submitted requests.
- Track request status and progress.
- Review available updates about their requests.

Citizens should provide accurate information and sufficient details to help the county respond to reported issues.

### 5.2 Administrator

The administrator manages the overall operation of the system.

**Responsibilities and permissions:**

- Access the administrative dashboard.
- Review and manage submitted service requests.
- Create technician accounts.
- Assign service requests to appropriate technicians.
- Monitor assigned, pending, in-progress, and resolved cases.
- Review system statistics and service delivery performance.
- Manage operational workflows and ensure that requests are directed to the appropriate personnel.

Administrator privileges must be restricted to authorized accounts. Public registration must not allow users to assign themselves the `ADMIN` role.

### 5.3 Technician

Technicians handle the practical investigation and resolution of assigned service requests.

**Responsibilities and permissions:**

- Sign in to the technician dashboard.
- View service requests assigned to them.
- Review the reported issue and its location.
- Update the status of assigned work according to the permitted workflow.
- Mark work as in progress when resolution activities begin.
- Mark work as resolved when the issue has been addressed.
- Provide progress information where the application supports it.

Technicians should only manage work they are authorized to access. They should not create administrator accounts or assign themselves unrestricted administrative permissions.

## 6. Service Request Workflow

The typical workflow is:

1. **Registration and authentication:** A citizen creates an account and signs in.
2. **Request submission:** The citizen reports an issue with the relevant category, location, description, and optional image.
3. **Administrative review:** An administrator reviews the request and determines the appropriate action.
4. **Technician assignment:** The administrator assigns the request to a suitable technician.
5. **Work in progress:** The technician investigates and works on the issue.
6. **Resolution:** The technician updates the request to indicate that the issue has been resolved.
7. **Tracking and monitoring:** The citizen can view the available status updates, while administrators monitor service delivery.

The intended status progression is:

`Pending → In Progress → Resolved`

The backend should enforce valid status transitions and ensure that users cannot modify requests outside their permissions.

## 7. Security Design

The system uses several security measures:

- **Authentication:** Users must sign in before accessing protected functionality.
- **Authorization:** Spring Security restricts protected endpoints according to user roles.
- **Password protection:** Passwords are hashed before storage using the configured password encoder.
- **Input validation:** Incoming data should be validated before business operations are performed.
- **API protection:** Administrative and technician endpoints should require the appropriate authenticated role.
- **Configuration management:** Database credentials, JWT secrets, and administrator credentials should be stored in environment variables rather than committed to source control.
- **Transport security:** Production frontend and backend communications should use HTTPS.
- **Upload controls:** Image uploads should be subject to file type, file size, and access restrictions.

Security configuration must be verified against the deployed backend, including how JWTs are issued, validated, and expired.

## 8. Installation and Local Development

### Prerequisites

Install the following:

- Java Development Kit compatible with the project's Spring Boot version.
- Maven, or use the Maven wrapper included in the backend project.
- Node.js and npm.
- MySQL Server.
- Git.

### 8.1 Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

Replace the placeholders with the actual repository URL and directory name.

### 8.2 Configure the backend

Configure the required environment variables for the database connection, JWT secret, administrator seeding, and other enabled services.

Example configuration:

```properties
server.port=${PORT:8080}

spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

app.jwt.secret=${JWT_SECRET}
app.jwt.expiration-minutes=60

app.admin.id-number=${ADMIN_ID:ADMIN001}
app.admin.full-name=${ADMIN_FULL_NAME:System Administrator}
app.admin.email=${ADMIN_EMAIL}
app.admin.phone=${ADMIN_PHONE}
app.admin.password=${ADMIN_PASSWORD}

app.cors.allowed-origin=${CORS_ALLOWED_ORIGIN:http://localhost:5173}
```

These properties are illustrative of the current configuration. Retain the remaining settings required by the actual application.

Create the MySQL database and configure the connection details before starting the backend.

Run the backend using the Maven wrapper from the backend project directory:

```bash
./mvnw spring-boot:run
```

On Windows PowerShell, use:

```powershell
.\mvnw.cmd spring-boot:run
```

### 8.3 Configure the frontend

Create or update the frontend `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8080
```

The Axios client appends `/api` to this base URL. Therefore, the environment variable should not include the `/api` suffix.

Install dependencies and start the frontend:

```bash
npm install
npm run dev
```

The frontend development server is normally available at `http://localhost:5173`.

For production, configure the frontend environment variable in Vercel and the corresponding allowed frontend origin in the backend environment.

## 9. Production Deployment

### Frontend — Vercel

The frontend is deployed at:

https://e-county-service.vercel.app/

Configure the production environment variable:

```env
VITE_API_BASE_URL=https://ecountyservices.onrender.com
```

Redeploy the frontend after changing production environment variables.

### Backend — Render

The backend is deployed at:

https://ecountyservices.onrender.com/

Configure the necessary environment variables in Render, including:

- Database URL, username, and password.
- JWT signing secret.
- Administrator seed details.
- Allowed frontend origin.
- Any other application-specific secrets.

The backend's CORS configuration must allow the exact deployed frontend origin. Environment variables should contain the correct values, not the variable names themselves.

### Database

MySQL stores persistent application data. Production database access should be restricted to authorized services and administrators. Database credentials must never be published in the README or committed to the repository.

## 10. Testing and Verification

The application should be tested across the following areas:

| Test Area | Expected Result |
|---|---|
| Citizen registration | A valid citizen account is created. |
| Login | Valid credentials authenticate successfully. |
| Invalid login | Invalid credentials are rejected. |
| Request submission | An authorized citizen can submit a request. |
| Request tracking | Citizens can view their own requests. |
| Technician creation | An authorized administrator can create technician accounts. |
| Request assignment | An administrator can assign work to a technician. |
| Status updates | Authorized technicians can update assigned work. |
| Role authorization | Users cannot access restricted endpoints without permission. |
| Dashboard analytics | Displayed counts reflect the underlying request records. |
| Production integration | The frontend communicates with the deployed backend successfully. |

## 11. Limitations and Future Improvements

Potential improvements include:

- Email notifications when requests are assigned or resolved.
- SMS notifications where an appropriate messaging service is configured.
- More detailed reporting and analytics.
- Request prioritization based on urgency and public impact.
- Audit logs for administrative actions and status changes.
- Improved image storage using dedicated object storage.
- Automated integration and end-to-end tests.
- Accessibility and multilingual interface improvements.
- More detailed service-level monitoring and operational reporting.

These items should be treated as proposed improvements unless they are already implemented.

## 12. Conclusion

eCounty Services provides a centralized approach to reporting and managing public service issues. Its React frontend offers an accessible interface, while the Spring Boot backend manages application rules, authentication, authorization, and data access. MySQL provides persistent storage, and the deployed frontend and backend support access through the web.

By separating citizen, administrator, and technician responsibilities, the system is designed to improve accountability, work assignment, progress tracking, and the efficiency of public service delivery.

## 13. License and Usage

Specify the project's license and permitted usage before distributing the application publicly. If this is an academic or demonstration project, identify it as such and document any limitations relevant to production use.
