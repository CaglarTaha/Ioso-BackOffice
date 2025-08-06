# Bun-TypeORM-Backend-Base ⚡

A high-performance backend API built with **Bun.js**, **TypeScript**, and **TypeORM**, featuring user authentication, role management, and RESTful endpoints. **3-4x faster than traditional Node.js applications!**

## 🚀 Features

- ⚡ **Bun.js Runtime** - Lightning-fast JavaScript/TypeScript runtime
- 🔐 **User Management** - Complete CRUD operations for users
- 👥 **Role Management** - Role-based access control (RBAC)
- 🛡️ **JWT Authentication** - Secure token-based authentication
- 🌐 **RESTful API** - Well-structured REST endpoints
- 📚 **Swagger Documentation** - Interactive API documentation
- 🗄️ **TypeORM Integration** - Modern ORM with TypeScript support
- 🐬 **MySQL Support** - Reliable database integration
- ✅ **Input Validation** - Joi schema validation
- 🚨 **Error Handling** - Centralized error management
- 🐳 **Docker Support** - Containerized deployment
- 📧 **Email Integration** - Gmail SMTP support
- 🔥 **Hot Reload** - Built-in watch mode for development
- 📦 **Ultra-fast Package Management** - Bun's native package manager

## 🛠️ Tech Stack

- **Runtime:** Bun.js ⚡
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** TypeORM
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Joi
- **Documentation:** Swagger/OpenAPI
- **Email:** Nodemailer (Gmail)
- **Containerization:** Docker

## 📋 Prerequisites

- **Bun.js** (v1.0 or higher) - [Install Bun](https://bun.sh/)
- **MySQL** (v5.7 or higher)
- **Git**

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/CaglarTaha/Bun-TypeORM-Backend-Base.git
cd Bun-TypeORM-Backend-Base
```

### 2. Install dependencies
```bash
bun install
```

### 3. Environment Setup
Copy the example environment file and configure your settings:
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# Database Configuration
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=your_database_name
DB_HOST=localhost
DB_PORT=3306

# Gmail Configuration (for email functionality)
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-gmail-app-password
GMAIL_NAME=Your Name

# Contact Information
CONTACT_ADDRESS=Your contact address

# Application Configuration
APP_PORT=8080
NODE_ENV=development

# JWT Configuration
SECRET_KEY=your-very-secret-jwt-key-here
```

### 4. Database Setup
Make sure MySQL is running and create your database:
```sql
CREATE DATABASE your_database_name;
```

### 5. Run the application

**Development mode (with hot reload):**
```bash
bun run dev
```

**Production mode:**
```bash
bun start
```

**Build for production (optional):**
```bash
bun run build
```

The server will start on `http://localhost:8080`

## ⚡ Bun.js Commands

### Package Management
```bash
# Install dependencies
bun install

# Add new package
bun add <package-name>

# Add development dependency
bun add -d <package-name>

# Remove package
bun remove <package-name>

# Update packages
bun update
```

### Development
```bash
# Development mode with hot reload
bun run dev

# Production mode (runs TypeScript directly)
bun start

# Build TypeScript to JavaScript
bun run build

# Clean build and rebuild
bun run build:clean

# Run TypeORM commands
bun run typeorm

# Kill server on port 8080
bun run kill
```

### Why Bun.js?
- 🚀 **3-4x faster** than Node.js
- 📦 **Ultra-fast package installation**
- 🔥 **Built-in hot reload** (no nodemon needed)
- 🎯 **Native TypeScript support** (no compilation needed for dev)
- 🧪 **Built-in test runner**
- 📂 **Built-in bundler**

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI:** `http://localhost:8080/api-docs`

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 👥 Default Roles

- **Admin** - Full access to all resources
- **User** - Limited access to user-specific resources

## 🐳 Docker Support

### Using Docker Compose
```bash
docker-compose up -d
```

### Building Docker Image with Bun.js
```bash
docker build -t backend-bun-typeorm .
docker run -p 8080:8080 backend-bun-typeorm
```

> **Note**: Docker configuration may need updates to support Bun.js runtime. Consider updating the Dockerfile to use Bun base image for optimal performance.

## 📁 Project Structure

```
├── src/
│   ├── controllers/     # Request handlers
│   ├── core/           # Core configurations
│   ├── entity/         # TypeORM entities
│   ├── interfaces/     # TypeScript interfaces
│   ├── middleware/     # Express middlewares
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── swagger/        # API documentation schemas
│   ├── utils/          # Utility functions
│   ├── validators/     # Input validation schemas
│   ├── types.d.ts      # Custom type declarations
│   └── index.ts        # Main application entry
├── build/              # Compiled JavaScript (when using build)
├── bun.lockb          # Bun lock file
├── bunfig.toml        # Bun configuration
├── package.json       # Project dependencies
├── tsconfig.json      # TypeScript configuration
└── .env              # Environment variables
```

## 🔧 Available Scripts

- `bun run dev` - Start development server with hot reload ⚡
- `bun start` - Start production server (runs TypeScript directly)
- `bun run build` - Build TypeScript to JavaScript
- `bun run build:clean` - Clean build directory and rebuild
- `bun run typeorm` - Run TypeORM CLI commands
- `bun run kill` - Kill server running on port 8080

## 📦 Bun.js Migration Benefits

This project has been migrated from Node.js to Bun.js, providing:

- ⚡ **Performance**: 3-4x faster execution
- 📦 **Package Management**: Lightning-fast dependency installation
- 🔥 **Development Experience**: Built-in hot reload without external tools
- 🎯 **TypeScript**: Native support, no compilation needed for development
- 🚀 **Startup Time**: Instant server startup
- 💾 **Memory Usage**: Lower memory footprint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For any questions or suggestions, please open an issue or contact the repository maintainer.

## 🙏 Acknowledgments

- **Bun.js** for incredible performance and developer experience
- **TypeORM** for excellent ORM functionality
- **Express.js** for robust web framework
- **JWT** for secure authentication
- **Swagger** for API documentation# Ioso-BackOffice
