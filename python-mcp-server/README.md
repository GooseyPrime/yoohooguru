# Python MCP Server

This directory contains the FastAPI-based Multi-Component Platform (MCP) server for testing and development purposes.

## Purpose

The Python MCP server is a minimal FastAPI application used for:
- Testing API endpoints
- Development and prototyping
- MCP (Model Context Protocol) integration testing

## Installation

```bash
cd python-mcp-server
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Running the Server

```bash
cd python-mcp-server
source venv/bin/activate
python src/main.py
```

The server will start on `http://localhost:8000`

## Testing

```bash
cd python-mcp-server
source venv/bin/activate
pytest tests/ -v
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Production Deployment

**Important**: This Python MCP server is for development/testing only. The production architecture uses:
- **Frontend**: Next.js apps deployed to Vercel
- **Backend**: Node.js/Express API deployed to Railway
- **Database**: Firebase Firestore

See `/docs/DEPLOYMENT.md` for the complete deployment guide.

## Deployment Note

This Python server is designed for local development and testing. It should be deployed separately from the frontend application.
