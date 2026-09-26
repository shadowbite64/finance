# Database
## MySQL

### Table `transactions`

| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PRIMARY KEY AUTO_INCREMENT |
| type| ENUM('INCOME', 'EXPENSE') |  |
| amount | DECIMAL(15, 2) | NOT NULL |
| category | TEXT |  |
| description | TEXT | |
| transactionDate | DATETIME |  |
| createdAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updatedAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |


## MongoDB (Optional)

### Collection `transactions`

```json
{
  "_id": "ObjectId(\"69282fb06588df5c3416589b\")",
  "type": "INCOME",
  "amount": 5000000.00,
  "category": "Salary",
  "description": "Monthly salary",
  "transactionDate": "2026-09-26T17:09:36.363Z",
  "createdAt": "2026-09-26T17:09:36.363Z",
  "updatedAt": "2026-09-26T17:09:36.363Z",
  "__v": 0
}
```

# API
## Endpoints

**Base URL**: `/api/transactions`

### Fetch All Transactions
Method: `GET`  
URL: `/`  
Response Body:
```
[
    {
        "id": 1,
        "type": "INCOME",
        "amount": 5000000.00,
        "category": "Salary",
        "description": "Monthly salary",
        "transactionDate": "2026-09-26T17:09:36.363Z",
        "createdAt": "2026-09-26T17:09:36.363Z",
        "updatedAt": "2026-09-26T17:09:36.363Z"
    },
    {
        "id": 2,
        "type": "EXPENSE",
        "amount": 1000000.00,
        "category": "Food",
        "description": "Lunch",
        "transactionDate": "2026-09-26T17:09:36.363Z",
        "createdAt": "2026-09-26T17:09:36.363Z",
        "updatedAt": "2026-09-26T17:09:36.363Z"
    }
]
```

### Fetch Transaction By ID
Method: `GET`  
URL: `/:id`  
Response Body:
```
{
    "id": 1,
    "type": "INCOME",
    "amount": 5000000.00,
    "category": "Salary",
    "description": "Monthly salary",
    "transactionDate": "2026-09-26T17:09:36.363Z",
    "createdAt": "2026-09-26T17:09:36.363Z",
    "updatedAt": "2026-09-26T17:09:36.363Z"
}
```

### Create Transcation
Method: `POST`  
URL: `/`  
Request Body:
```
{
    "type": "INCOME",
    "amount": 5000000.00,
    "category": "Salary",
    "description": "Monthly salary",
    "transactionDate": "2026-09-26T17:09:36.363Z"
}
```

### Update Transcation
Method: `PATCH`  
URL: `/:id`  
Request Body:
```
{
    "type": "INCOME",
    "amount": 5000000.00,
    "category": "Salary",
    "description": "Monthly salary",
    "transactionDate": "2026-09-26T17:09:36.363Z"
}
```

### Upload Image to a Transaction
Method: `Patch`  
URL: `/:id`  
Request Body: `form-data` `multipart/form-data`

File Name: `image`

### Delete Transaction
Method: `DELETE`  
URL: `/:id`  