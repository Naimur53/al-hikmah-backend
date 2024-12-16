# 📚 API Documentation

## 🚀 Blog API

### 📝 Schema Fields:
- **id** (String) - *Unique Identifier*
- **title** (string) - *Required* 🔴
- **description** (string) - *Required* 🔴
- **status** (string) - *Required* 🔴

### 🔗 API Endpoints:

#### ➡️ GET /blog
This endpoint supports pagination, searching, and filtering 🔍.
You can search using any of these fields: **title, description**.
Exact match filtering is supported for these fields: **status**.

Example query:
```sh
GET /blog?searchTerm=someTerm&title=bookTitle&page=1&limit=10
```
Response:
```json
{
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  },
  "data": [...]
}
```
#### ➕ POST /blog
This endpoint creates a new **blo** 🆕.
Payload example:
```json
{
  "title": "value" *,
  "description": "value" *,
  "status": "value" *,
}
```
Response:
```json
{
  "message": "blog created successfully",
  "data": {
    "id": "newId",
    ...
  }
}
```
#### ✏️ PATCH /blog/:id
This endpoint updates an existing **blo** by id ✨.
Payload example:
```json
{
  "title": "newValue",
  "description": "newValue",
  "status": "newValue",
}
```
Response:
```json
{
  "message": "blog updated successfully",
  "data": {
    "id": "updatedId",
    ...
  }
}
```
#### ❌ DELETE /blog/:id
This endpoint deletes a **blo** by id 🗑️.
Response:
```json
{
  "message": "blog deleted successfully"
}
```
## 🚀 BookCategory API

### 📝 Schema Fields:
- **id** (String) - *Unique Identifier*
- **name** (string) - *Required* 🔴

### 🔗 API Endpoints:

#### ➡️ GET /bookCategory
This endpoint supports pagination, searching, and filtering 🔍.
You can search using any of these fields: **name**.
Exact match filtering is supported for these fields: **name**.

Example query:
```sh
GET /bookCategory?searchTerm=someTerm&title=bookTitle&page=1&limit=10
```
Response:
```json
{
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  },
  "data": [...]
}
```
#### ➕ POST /bookCategory
This endpoint creates a new **bookCategor** 🆕.
Payload example:
```json
{
  "name": "value" *,
}
```
Response:
```json
{
  "message": "bookCategory created successfully",
  "data": {
    "id": "newId",
    ...
  }
}
```
#### ✏️ PATCH /bookCategory/:id
This endpoint updates an existing **bookCategor** by id ✨.
Payload example:
```json
{
  "name": "newValue",
}
```
Response:
```json
{
  "message": "bookCategory updated successfully",
  "data": {
    "id": "updatedId",
    ...
  }
}
```
#### ❌ DELETE /bookCategory/:id
This endpoint deletes a **bookCategor** by id 🗑️.
Response:
```json
{
  "message": "bookCategory deleted successfully"
}
```
## 🚀 User API

### 📝 Schema Fields:
- **id** (String) - *Unique Identifier*

### 🔗 API Endpoints:

#### ➡️ GET /user
This endpoint supports pagination, searching, and filtering 🔍.

Example query:
```sh
GET /user?searchTerm=someTerm&title=bookTitle&page=1&limit=10
```
Response:
```json
{
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  },
  "data": [...]
}
```
#### ➕ POST /user
This endpoint creates a new **use** 🆕.
Payload example:
```json
{
}
```
Response:
```json
{
  "message": "user created successfully",
  "data": {
    "id": "newId",
    ...
  }
}
```
#### ✏️ PATCH /user/:id
This endpoint updates an existing **use** by id ✨.
Payload example:
```json
{
}
```
Response:
```json
{
  "message": "user updated successfully",
  "data": {
    "id": "updatedId",
    ...
  }
}
```
#### ❌ DELETE /user/:id
This endpoint deletes a **use** by id 🗑️.
Response:
```json
{
  "message": "user deleted successfully"
}
```
## 🚀 Book API

### 📝 Schema Fields:
- **id** (String) - *Unique Identifier*
- **name** (string) - *Required* 🔴
- **photo** (string) - *Required* 🔴

### 🔗 API Endpoints:

#### ➡️ GET /book
This endpoint supports pagination, searching, and filtering 🔍.

Example query:
```sh
GET /book?searchTerm=someTerm&title=bookTitle&page=1&limit=10
```
Response:
```json
{
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  },
  "data": [...]
}
```
#### ➕ POST /book
This endpoint creates a new **boo** 🆕.
Payload example:
```json
{
  "name": "value" *,
  "photo": "value" *,
}
```
Response:
```json
{
  "message": "book created successfully",
  "data": {
    "id": "newId",
    ...
  }
}
```
#### ✏️ PATCH /book/:id
This endpoint updates an existing **boo** by id ✨.
Payload example:
```json
{
  "name": "newValue",
  "photo": "newValue",
}
```
Response:
```json
{
  "message": "book updated successfully",
  "data": {
    "id": "updatedId",
    ...
  }
}
```
#### ❌ DELETE /book/:id
This endpoint deletes a **boo** by id 🗑️.
Response:
```json
{
  "message": "book deleted successfully"
}
```
## 🚀 Author API

### 📝 Schema Fields:
- **id** (String) - *Unique Identifier*

### 🔗 API Endpoints:

#### ➡️ GET /author
This endpoint supports pagination, searching, and filtering 🔍.

Example query:
```sh
GET /author?searchTerm=someTerm&title=bookTitle&page=1&limit=10
```
Response:
```json
{
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  },
  "data": [...]
}
```
#### ➕ POST /author
This endpoint creates a new **autho** 🆕.
Payload example:
```json
{
}
```
Response:
```json
{
  "message": "author created successfully",
  "data": {
    "id": "newId",
    ...
  }
}
```
#### ✏️ PATCH /author/:id
This endpoint updates an existing **autho** by id ✨.
Payload example:
```json
{
}
```
Response:
```json
{
  "message": "author updated successfully",
  "data": {
    "id": "updatedId",
    ...
  }
}
```
#### ❌ DELETE /author/:id
This endpoint deletes a **autho** by id 🗑️.
Response:
```json
{
  "message": "author deleted successfully"
}
```
## 🚀 Publisher API

### 📝 Schema Fields:
- **id** (String) - *Unique Identifier*

### 🔗 API Endpoints:

#### ➡️ GET /publisher
This endpoint supports pagination, searching, and filtering 🔍.

Example query:
```sh
GET /publisher?searchTerm=someTerm&title=bookTitle&page=1&limit=10
```
Response:
```json
{
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  },
  "data": [...]
}
```
#### ➕ POST /publisher
This endpoint creates a new **publishe** 🆕.
Payload example:
```json
{
}
```
Response:
```json
{
  "message": "publisher created successfully",
  "data": {
    "id": "newId",
    ...
  }
}
```
#### ✏️ PATCH /publisher/:id
This endpoint updates an existing **publishe** by id ✨.
Payload example:
```json
{
}
```
Response:
```json
{
  "message": "publisher updated successfully",
  "data": {
    "id": "updatedId",
    ...
  }
}
```
#### ❌ DELETE /publisher/:id
This endpoint deletes a **publishe** by id 🗑️.
Response:
```json
{
  "message": "publisher deleted successfully"
}
```
## 🚀 Chapter API

### 📝 Schema Fields:
- **id** (String) - *Unique Identifier*

### 🔗 API Endpoints:

#### ➡️ GET /chapter
This endpoint supports pagination, searching, and filtering 🔍.

Example query:
```sh
GET /chapter?searchTerm=someTerm&title=bookTitle&page=1&limit=10
```
Response:
```json
{
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  },
  "data": [...]
}
```
#### ➕ POST /chapter
This endpoint creates a new **chapte** 🆕.
Payload example:
```json
{
}
```
Response:
```json
{
  "message": "chapter created successfully",
  "data": {
    "id": "newId",
    ...
  }
}
```
#### ✏️ PATCH /chapter/:id
This endpoint updates an existing **chapte** by id ✨.
Payload example:
```json
{
}
```
Response:
```json
{
  "message": "chapter updated successfully",
  "data": {
    "id": "updatedId",
    ...
  }
}
```
#### ❌ DELETE /chapter/:id
This endpoint deletes a **chapte** by id 🗑️.
Response:
```json
{
  "message": "chapter deleted successfully"
}
```
## 🚀 SubChapter API

### 📝 Schema Fields:
- **id** (String) - *Unique Identifier*

### 🔗 API Endpoints:

#### ➡️ GET /subChapter
This endpoint supports pagination, searching, and filtering 🔍.

Example query:
```sh
GET /subChapter?searchTerm=someTerm&title=bookTitle&page=1&limit=10
```
Response:
```json
{
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  },
  "data": [...]
}
```
#### ➕ POST /subChapter
This endpoint creates a new **subChapte** 🆕.
Payload example:
```json
{
}
```
Response:
```json
{
  "message": "subChapter created successfully",
  "data": {
    "id": "newId",
    ...
  }
}
```
#### ✏️ PATCH /subChapter/:id
This endpoint updates an existing **subChapte** by id ✨.
Payload example:
```json
{
}
```
Response:
```json
{
  "message": "subChapter updated successfully",
  "data": {
    "id": "updatedId",
    ...
  }
}
```
#### ❌ DELETE /subChapter/:id
This endpoint deletes a **subChapte** by id 🗑️.
Response:
```json
{
  "message": "subChapter deleted successfully"
}
```
## 🚀 Wishlist API

### 📝 Schema Fields:
- **id** (String) - *Unique Identifier*

### 🔗 API Endpoints:

#### ➡️ GET /wishlist
This endpoint supports pagination, searching, and filtering 🔍.

Example query:
```sh
GET /wishlist?searchTerm=someTerm&title=bookTitle&page=1&limit=10
```
Response:
```json
{
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  },
  "data": [...]
}
```
#### ➕ POST /wishlist
This endpoint creates a new **wishlis** 🆕.
Payload example:
```json
{
}
```
Response:
```json
{
  "message": "wishlist created successfully",
  "data": {
    "id": "newId",
    ...
  }
}
```
#### ✏️ PATCH /wishlist/:id
This endpoint updates an existing **wishlis** by id ✨.
Payload example:
```json
{
}
```
Response:
```json
{
  "message": "wishlist updated successfully",
  "data": {
    "id": "updatedId",
    ...
  }
}
```
#### ❌ DELETE /wishlist/:id
This endpoint deletes a **wishlis** by id 🗑️.
Response:
```json
{
  "message": "wishlist deleted successfully"
}
```
## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### 🛠️ Prerequisites

What things you need to install and how to install them:

- Node.js (version 14 or higher)
- npm (version 7 or higher)

### 📦 Installing

A step-by-step series of examples that tell you how to get a development environment running.

1. Clone this repository to your local machine:

```bash
git clone https://github.com/your-username/your-project-name.git
```

2. Run scripts:

```bash
npm run init
```
Or
```bash
npm install
```

3. Start the project:

```bash
npm run dev
```

# al-hikmah-backend
