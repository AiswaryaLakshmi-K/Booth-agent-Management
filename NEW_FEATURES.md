# New Features Added

## 1. Booth Agent Management (Admin Only)
- **Route**: `/agents`
- **Features**:
  - Admin can add new booth agents
  - Assign agents to specific booths
  - View all agents with their assigned booths
  - Edit agent details and booth assignments
  - Activate/deactivate agents

## 2. Enhanced Family Form (Agent Dashboard)
- **Route**: `/families/new` or `/families/:id/edit`
- **Features**:
  - Family head information (name, phone, address)
  - Dynamic family member addition
  - For each family member:
    - Name, Age, Gender, Relation
    - **Party Preference dropdown**: Party A, Party B, Party C, Others
    - **Remarks field**: For additional notes per member
  - Auto-calculates eligible voters (age >= 18)
  - Agents see only their assigned booth (auto-selected)
  - Additional notes field for family-level comments

## 3. Admin Family View
- **Route**: `/families`
- **Features**:
  - Filter families by booth (dropdown)
  - View all family members with their party preferences
  - See remarks for each member
  - Color-coded party preference badges
  - Complete family details in expandable cards

## Backend Updates
- Added POST `/api/users/` endpoint for creating booth agents
- Updated Family schema to include `party_preference` and `remarks` per member
- CORS updated to support Vite default port (5173)

## User Roles
### Admin
- Manage booths
- Create and manage booth agents
- View all families across all booths
- Filter families by booth

### Agent
- Add family data for their assigned booth
- View families in their booth
- Cannot change booth assignment

## Login Credentials
- **Admin**: username: `admin`, password: `Admin@123`
- **Agents**: Created by admin with custom credentials

## How to Use
1. Admin logs in and creates booth agents via `/agents/new`
2. Admin assigns each agent to a specific booth
3. Agent logs in and adds family data via `/families/new`
4. Agent fills family member details with party preferences
5. Admin can view all data filtered by booth
