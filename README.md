# Catalogue FastAPI Backend

A FastAPI backend application for the catalogue system with product management, user management, and shopping cart functionality.

## Features

- **Product Management**: CRUD operations for products with categories and search
- **User Management**: User registration and profile management
- **Shopping Cart**: Add/remove items, view cart contents
- **RESTful API**: Clean, documented API endpoints
- **CORS Support**: Configured for frontend integration
- **Data Validation**: Pydantic models for request/response validation

## API Endpoints

### Products
- `GET /products` - Get all products (with filtering and pagination)
- `GET /products/{product_id}` - Get specific product
- `POST /products` - Create new product
- `PUT /products/{product_id}` - Update product
- `DELETE /products/{product_id}` - Delete product

### Users
- `POST /users` - Create new user
- `GET /users/{user_id}` - Get user profile

### Cart
- `GET /carts/{user_id}` - Get user's cart
- `POST /carts/{user_id}/items` - Add item to cart
- `DELETE /carts/{user_id}/items/{product_id}` - Remove item from cart
- `DELETE /carts/{user_id}` - Clear cart

### Utility
- `GET /` - API welcome message
- `GET /health` - Health check
- `GET /categories` - Get all product categories

## Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the application:**
   ```bash
   python main.py
   ```
   
   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Access the API:**
   - API: http://localhost:8000
   - Interactive API docs: http://localhost:8000/docs
   - Alternative API docs: http://localhost:8000/redoc

## Development

- The app runs on port 8000 by default
- CORS is configured for localhost:3000 and localhost:5173 (React dev servers)
- Sample data is automatically loaded on startup
- Data is stored in memory (replace with database in production)

## Production Considerations

- Replace in-memory storage with a proper database (PostgreSQL, MongoDB, etc.)
- Implement proper authentication and authorization
- Add password hashing for user passwords
- Configure environment variables for sensitive data
- Add logging and monitoring
- Implement rate limiting and security headers

## Sample Data

The application comes with sample products:
- Laptop ($999.99)
- Smartphone ($699.99)
- Headphones ($199.99)
