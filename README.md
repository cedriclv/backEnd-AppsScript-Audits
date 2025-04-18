# 📊 Google Apps Script Audit API

This project is a **RESTful API** built with **Google Apps Script** to manage audit records stored in a Google Spreadsheet. It supports basic CRUD operations (Create, Read, Update, Delete) with authentication via an API key.

## 🚀 Features

- ✅ **GET**: Retrieve audit records with optional filters.
- 📝 **POST**: Add a new audit entry.
- ✏️ **PUT**: Update an existing audit record by ID.
- ❌ **DELETE**: Delete an audit record by ID.
- 🔐 Secured by API key.

## 📁 Folder Structure

GAS-Simple-API/ ├── backend.gs # Main logic and route handling ├── appsscript.json # Apps Script project configuration

csharp
Copier
Modifier

## 🔧 Configuration

- Set your Google Spreadsheet ID and sheet name:
  ```js
  const SPREADSHEET_ID = "your_spreadsheet_id_here";
  const AUDITSHEET_NAME = "audits";
  const API_KEY = "your_api_key_here";
📡 Endpoints
GET /exec?key=API_KEY&[filters]
Retrieve records, optionally filtered by parameters like client, status, etc.

Example:
GET https://script.google.com/macros/s/.../exec?key=myKey&client=thomas

POST /exec
Create a new record. Payload must include the API key and method.

Payload (JSON):

json
Copier
Modifier
{
  "key": "myKey",
  "method": "POST",
  "client": "Thomas",
  "date": "2025-04-06",
  "reason": "damaged",
  "status": "rejet",
  "comment": "item broken"
}
PUT /exec
Update a record by ID.

Payload:

json
Copier
Modifier
{
  "key": "myKey",
  "method": "PUT",
  "id": 1743854332123,
  "client": "Thomas",
  "date": "2025-04-06",
  "reason": "updated reason",
  "status": "ok",
  "comment": "fixed"
}
DELETE /exec
Delete a record by ID.

Payload:

json
Copier
Modifier
{
  "key": "myKey",
  "method": "DELETE",
  "id": 1743854332123
}
🛠 Deployment
Create a new Google Apps Script project.

Copy the contents of backend.gs into the project.

Deploy as a API App:

Select Deploy > Manage deployments

Choose API App

Execute as: Me

Who has access: Anyone

Copy the Web App URL and use it to send requests.

🧪 Testing
You can test this API using:

Postman

curl commands

Any frontend or backend application

📌 Notes
Dates should be in YYYY-MM-DD format.

Ensure your Google Sheet has appropriate column headers matching the payload fields.

The first row of the sheet must be headers: id, client, date, reason, status, comment.