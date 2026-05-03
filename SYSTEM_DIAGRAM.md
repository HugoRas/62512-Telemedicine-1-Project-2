# Diabetes Monitor – System Diagram

## 1. System Architecture

```mermaid
graph TB
    subgraph Browser["🌐 Browser (Client)"]
        subgraph Pages["Route Pages"]
            Login["/  Login Page"]
            Home["/home  Dashboard"]
            Log["/log  Log Glucose"]
            History["/history  14-day Trend"]
        end

        subgraph Store["lib/store.js  Business Logic"]
            getLogs["getLogs()"]
            saveLog["saveLog(entry)"]
            hasLoggedToday["hasLoggedToday()"]
            glucoseStatus["glucoseStatus(log)"]
        end

        subgraph Storage["Browser localStorage"]
            DB1["diabetes_logs"]
        end

        Pages -- "read/write data" --> Store
        Store -- "persist" --> Storage
    end

    subgraph Server["⚙️ SvelteKit Server"]
        Middleware["hooks.server.js\nJWT Middleware\n(validates all requests)"]
        LoginAction["+page.server.js\nLogin Action\n(validate credentials, sign JWT)"]
        LogoutAction["logout/+server.js\nLogout Action\n(clear cookie, redirect)"]
    end

    subgraph Auth["🔐 Auth Layer"]
        Cookie["httpOnly Cookie\n(JWT token, 24h expiry)"]
        JWT_SECRET["JWT_SECRET\nenv variable"]
    end

    Browser -- "HTTP requests" --> Middleware
    Middleware -- "validates token" --> Cookie
    LoginAction -- "signs token" --> Cookie
    LoginAction -- "uses" --> JWT_SECRET
    Middleware -- "uses" --> JWT_SECRET
    Login -- "POST form" --> LoginAction
    LogoutAction -- "deletes" --> Cookie
```

---

## 2. Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant Login as Login Page (/)
    participant Server as +page.server.js
    participant Middleware as hooks.server.js
    participant Home as /home

    User->>Login: Enter username/password
    Login->>Server: POST form (default action)
    Server->>Server: Validate: admin / 123456
    alt Valid credentials
        Server->>User: Set httpOnly JWT cookie (24h)
        Server-->>Home: Redirect to /home
    else Invalid credentials
        Server-->>Login: Return error message
    end

    User->>Home: Navigate to /home
    Home->>Middleware: Request with JWT cookie
    Middleware->>Middleware: Verify JWT signature
    alt Valid JWT
        Middleware-->>Home: Allow request
    else Invalid/missing JWT
        Middleware-->>Login: Redirect to /
    end
```

---

## 3. Glucose Logging Flow

```mermaid
sequenceDiagram
    actor Patient
    participant LogPage as /log Page
    participant Store as lib/store.js
    participant LS as localStorage

    Patient->>LogPage: Fill form (glucose, fasting, weight, notes)
    Patient->>LogPage: Click "Gem & vis status"
    LogPage->>Store: glucoseStatus(log)
    Store->>Store: Check fasting flag + glucose thresholds
    Note over Store: Fasting: ≤7.0 Normal, 7.1–10.0 Elevated, >10.0 Contact doctor<br>Non-fasting: ≤11.1 Normal, 11.1–15.0 Elevated, >15.0 Contact doctor
    Store-->>LogPage: { label, color, badge }
    LogPage->>Store: saveLog(entry)
    Store->>LS: Prepend to diabetes_logs
    LogPage->>Patient: Show result card (colored status badge + guidance)
```

---

## 4. Dashboard & History Flow

```mermaid
sequenceDiagram
    actor Patient
    participant Home as /home Dashboard
    participant History as /history Trend
    participant Store as lib/store.js
    participant LS as localStorage

    Patient->>Home: Navigate to /home
    Home->>Store: getLogs()
    Store->>LS: Read diabetes_logs
    LS-->>Store: All log entries
    Home->>Store: hasLoggedToday()
    alt Not logged today
        Home->>Patient: Show yellow alert + "Register now" button
    end
    Home->>Patient: Show latest reading + status badge

    Patient->>History: Navigate to /history
    History->>Store: getLogs()
    Store-->>History: All entries (use last 14)
    History->>Store: glucoseStatus(log) per entry
    History->>Patient: Bar chart (height = glucose, color = status)
    History->>Patient: Scrollable list with timestamps & badges
```

---

## 5. Data Model

```mermaid
erDiagram
    GLUCOSE_LOG {
        number id "Date.now() timestamp"
        string date "ISO 8601"
        number glucose "mmol/l (1–30)"
        boolean fasting "8+ hours no food"
        number weight "kg (optional)"
        string notes "Symptoms/observations (optional)"
    }

    STATUS_OBJECT {
        string label "e.g. Grøn – Normal fastende"
        string color "success | warning | error"
        string badge "badge-success | badge-warning | badge-error"
    }

    GLUCOSE_LOG ||--|| STATUS_OBJECT : "glucoseStatus() produces"
```

---

## 6. Component Responsibility Map

```mermaid
graph LR
    subgraph Auth
        A1["hooks.server.js\nProtect all routes"]
        A2["+page.server.js\nIssue JWT on login"]
        A3["logout/+server.js\nRevoke JWT"]
    end

    subgraph UI_Pages["UI Pages"]
        U1["/  Login form"]
        U2["/home  Dashboard"]
        U3["/log  Log entry + result"]
        U4["/history  14-day bar chart"]
    end

    subgraph Logic["Business Logic (lib/store.js)"]
        L1["getLogs()"]
        L2["saveLog(entry)"]
        L3["hasLoggedToday()"]
        L4["glucoseStatus(log)\nClinical classification"]
    end

    subgraph Persistence["Persistence"]
        P1["localStorage: diabetes_logs"]
        P2["httpOnly Cookie: JWT token"]
    end

    U1 --> A2
    A2 --> P2
    A1 --> P2
    U2 --> L1 & L3
    U3 --> L2 & L4
    U4 --> L1 & L4
    L1 & L2 & L3 --> P1
```
