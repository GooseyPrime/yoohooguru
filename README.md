
# RIPPLE Community Platform

Create a comprehensive skill-sharing platform called "RIPPLE Community" — a neighborhood-based app where users exchange skills, discover purpose, and create exponential community impact.

## MCP Server Implementation

This repository contains a minimal, scalable **Multi-Component Platform (MCP) server** built with FastAPI as the backend foundation for the RIPPLE Community project. The server provides a modular structure designed for easy extension with additional components and services.

## Features

- **FastAPI-based REST API** with automatic OpenAPI documentation
- **Modular architecture** designed for easy extension
- **Type-safe Python code** with Pydantic models
- **Comprehensive test suite** using pytest
- **Docker containerization** for easy deployment
- **Health check endpoints** for monitoring
- **Production-ready configuration** with proper error handling

## Project Structure

```
├── src/
│   ├── __init__.py
│   ├── main.py          # FastAPI application and MCP server
│   └── config.py        # Configuration management
├── tests/
│   ├── __init__.py
│   ├── conftest.py      # Test fixtures and configuration
│   └── test_main.py     # Test cases for API endpoints
├── requirements.txt     # Python dependencies
├── Dockerfile          # Docker container configuration
├── pyproject.toml      # Pytest configuration
├── .gitignore          # Git ignore patterns
└── README.md           # This file
```

## API Endpoints

- **GET /** - Root endpoint returning service status
- **GET /health** - Health check endpoint for monitoring
- **GET /docs** - Interactive API documentation (Swagger UI)
- **GET /redoc** - Alternative API documentation (ReDoc)
- **GET /openapi.json** - OpenAPI schema

## Requirements

- Python 3.11 or higher
- pip (Python package manager)
- Docker (optional, for containerization)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/GooseyPrime/RIPPLE.git
cd RIPPLE
```

### 2. Create Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Run the Server

```bash
# Development mode with hot reload
python src/main.py

# Or using uvicorn directly
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

The server will start on `http://localhost:8000`

### 5. Access the API

- **Root endpoint**: http://localhost:8000/
- **Health check**: http://localhost:8000/health
- **API documentation**: http://localhost:8000/docs
- **Alternative docs**: http://localhost:8000/redoc

## Testing

### Run All Tests

```bash
pytest tests/ -v
```

### Run Specific Test Classes

```bash
# Test root endpoint
pytest tests/test_main.py::TestRootEndpoint -v

# Test health endpoint
pytest tests/test_main.py::TestHealthEndpoint -v

# Test API documentation
pytest tests/test_main.py::TestAPIDocumentation -v
```

### Test Coverage

```bash
# Install coverage if not already installed
pip install coverage

# Run tests with coverage
coverage run -m pytest tests/
coverage report
coverage html  # Generate HTML coverage report
```

## Docker Deployment

### Build Docker Image

```bash
docker build -t ripple-mcp-server .
```

### Run Docker Container

```bash
# Run in foreground
docker run -p 8000:8000 ripple-mcp-server

# Run in background
docker run -d -p 8000:8000 --name ripple-server ripple-mcp-server

# View logs
docker logs ripple-server

# Stop container
docker stop ripple-server
```

### Docker Compose (Optional)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  ripple-server:
    build: .
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
      - LOG_LEVEL=info
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Run with Docker Compose:

```bash
docker-compose up -d
```

## Environment Variables

The server supports the following environment variables for configuration:

| Variable | Default | Description |
|----------|---------|-------------|
| `HOST` | `0.0.0.0` | Server host address |
| `PORT` | `8000` | Server port |
| `LOG_LEVEL` | `info` | Logging level (debug, info, warning, error) |
| `ENVIRONMENT` | `development` | Environment (development, staging, production) |
| `DATABASE_URL` | `None` | Database connection URL (for future use) |
| `REDIS_URL` | `None` | Redis connection URL (for future use) |
| `SECRET_KEY` | `None` | Secret key for JWT tokens (for future use) |

Example:

```bash
export HOST=0.0.0.0
export PORT=8080
export LOG_LEVEL=debug
export ENVIRONMENT=development
python src/main.py
```

## API Response Format

All endpoints return JSON responses with the following structure:

```json
{
    "status": "healthy",
    "message": "RIPPLE Community MCP Server is running",
    "timestamp": "2025-08-30T19:21:46.822343Z",
    "version": "1.0.0"
}
```

## Code Quality

The codebase follows modern Python best practices:

- **PEP 8** compliance for code style
- **Type hints** for all functions and methods
- **Pydantic models** for data validation
- **Comprehensive docstrings** for all modules and functions
- **Structured logging** for debugging and monitoring

## Development Guidelines

### Adding New Endpoints

1. Add new route methods to the `MCPServer` class in `src/main.py`
2. Create corresponding Pydantic models if needed
3. Add comprehensive tests in `tests/test_main.py`
4. Update this README with new endpoint documentation

### Extending the Configuration

1. Add new settings to the `Settings` class in `src/config.py`
2. Update environment variable documentation in this README
3. Add corresponding tests if the settings affect functionality

## Monitoring and Health Checks

The server provides health check endpoints suitable for:

- **Load balancers** (ALB, HAProxy, etc.)
- **Container orchestration** (Kubernetes, Docker Swarm)
- **Monitoring systems** (Prometheus, DataDog, etc.)

Health check endpoint: `GET /health`

## Future Extensions

The MCP (Multi-Component Platform) architecture is designed to support:

- **User authentication and authorization**
- **Skill management APIs**
- **Community features**
- **Real-time messaging**
- **File upload and storage**
- **Search and filtering**
- **Analytics and reporting**

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Make your changes following the coding standards
4. Add tests for new functionality
5. Ensure all tests pass (`pytest tests/`)
6. Update documentation as needed
7. Commit your changes (`git commit -am 'Add new feature'`)
8. Push to the branch (`git push origin feature/new-feature`)
9. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions, issues, or contributions, please:

1. Check the [Issues](https://github.com/GooseyPrime/RIPPLE/issues) page
2. Create a new issue if needed
3. Provide detailed information about your problem or suggestion

## Next Steps

1. **Database Integration**: Add PostgreSQL or MongoDB support
2. **Authentication**: Implement JWT-based authentication
3. **API Versioning**: Add versioned API endpoints
4. **Rate Limiting**: Implement request rate limiting
5. **Caching**: Add Redis-based caching
6. **Monitoring**: Integrate with monitoring solutions
7. **CI/CD**: Set up automated testing and deployment pipelines
