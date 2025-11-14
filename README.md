# Sensitive File Sharing Service (SFSS)
SFSS is a platform to securely share & view sensitive documents through a trusted execution enviornment, for a limited viewing window.

## Backend Development Tips

Naming conventions:
- Controllers use eg. FooController.js
- Services use eg. FooService.js

>**Note**: Deviating from these convetions would result in them not being detected & registered automatically. As a result you wouldn't see them working in the backend.

Services and Controllers do not require imports, an example is below:
```js
// src/services/ProductService.js
const { Service } = require('../utils/decorators');

@Service()
class ProductService {
  constructor({ productModel }) {  // Auto-injected!
    this.productModel = productModel;
  }
  // ... methods
}
module.exports = ProductService;

// src/controllers/ProductController.js
const { Controller, Get, Post } = require('../utils/decorators');

@Controller('/products')
class ProductController {
  constructor({ productService }) {  // Auto-injected!
    this.productService = productService;
  }

  @Get('/')
  async getAll(req, res) { /* ... */ }
}
module.exports = ProductController;
```

The backend uses dependency injection (resolved via name and strings). Example resolution of middleware
```js
const logger = require('../config/logger');
const { Controller, Post, Get, Delete } = require('../utils/decorators');
const validateDto = require('../middlewares/validateDto');
const CreateUserDto = require('../dtos/CreateUserDto');

// Example protected controller
@Controller('/users')
class UserController {
  constructor({ userService }) {
    this.userService = userService;
  }

  // NOTICE: we don't need to import the authenticate middleware

  @Post('/', [validateDto(CreateUserDto), 'authenticate'])
  async create(req, res) {
    const user = await this.userService.createUser(req.body);
    logger.info('User created successfully', { userId: user._id });
    res.status(201).json({ success: true, data: user });
  }

  // ...
```

similarly resolution via name:

```js
const NotFoundException = require("../exceptions/NotFoundException");
const UnauthorizedException = require("../exceptions/UnauthorizedException");
const logger = require("../config/logger");
const { Service } = require("../utils/decorators");

@Service()
class UserService {
  constructor({ userModel, passwordEncoder }) {
    this.userModel = userModel;
    // NOTICE: we don't need to import the passwordEncoder
    this.passwordEncoder = passwordEncoder;
  }

  async createUser(userData) {
    logger.info('Creating user', { email: userData.email });
    const hasedPassword = await this.passwordEncoder.encode(userData.password);
    
    // ...
```

## Backend API Usage
- Register a user
```bash
curl -X POST -H "Content-type: application/json" -d '{"name":"Foo Bar","email":"test@email.com","password":"12345678"}' http://localhost:3000/api/auth/register
```

```json
{
  "success": true,
  "data": {
    "user": {
      "name": "Foo Bar",
      "email": "test@email.com",
      "_id": "691797df5293e9d5b467b2c2",
      "createdAt": "2025-11-14T20:58:07.569Z",
      "updatedAt": "2025-11-14T20:58:07.569Z",
      "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MTc5N2RmNTI5M2U5ZDViNDY3YjJjMiIsImVtYWlsIjoidGVzdEBlbWFpbC5jb20iLCJuYW1lIjoiRm9vIEJhciIsImlhdCI6MTc2MzE1Mzg4NywiZXhwIjoxNzYzMjQwMjg3fQ.G4KrbcMAXeqNgrFNxGJSN_M0JEiARkdQTVdg08JB8ak"
  }
}
```

- Login as a user
```bash
curl -X POST -H "Content-type: application/json" -d '{"email":"test@email.com","password":"12345678"}' http://localhost:3000/api/auth/login
```

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "691797df5293e9d5b467b2c2",
      "name": "Foo Bar",
      "email": "test@email.com",
      "createdAt": "2025-11-14T20:58:07.569Z",
      "updatedAt": "2025-11-14T20:58:07.569Z",
      "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MTc5N2RmNTI5M2U5ZDViNDY3YjJjMiIsImVtYWlsIjoidGVzdEBlbWFpbC5jb20iLCJuYW1lIjoiRm9vIEJhciIsImlhdCI6MTc2MzE1Mzg5MywiZXhwIjoxNzYzMjQwMjkzfQ.AIk35ovdqoEzQtgKoqFLg7XB_wUDdTw9hk4XjYZxvpc"
  }
}
```

- View profile (protected route)
```bash
curl -X GET -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MTc5N2RmNTI5M2U5ZDViNDY3YjJjMiIsImVtYWlsIjoidGVzdEBlbWFpbC5jb20iLCJuYW1lIjoiRm9vIEJhciIsImlhdCI6MTc2MzE1Mzg5MywiZXhwIjoxNzYzMjQwMjkzfQ.AIk35ovdqoEzQtgKoqFLg7XB_wUDdTw9hk4XjYZxvpc" http://localhost:3000/api/users/profile
```

```json
{
  "success": true,
  "user": {
    "id": "691797df5293e9d5b467b2c2",
    "email": "test@email.com",
    "name": "Foo Bar",
    "iat": 1763153893,
    "exp": 1763240293
  }
}
```

## Running the backend (locally)
1. Start the MongoDB container:
```bash
docker compose -f infra/dev/docker-compose.yml up
```

2. Start the backend:
```bash
npm run dev:run
```

3. To stop the backend press `Ctrl + C` and optionally bring the MonogoDB container down:
```bash
docker compose -f infra/dev/docker-compose.yml down
```