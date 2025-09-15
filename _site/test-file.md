# Comprehensive Theme Test File

This file contains various syntax elements to test how themes handle different languages and markup.

## HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Theme Test</title>
    <!-- HTML Comment -->
    <style>
        body { background: #f0f0f0; }
    </style>
</head>
<body>
    <header class="main-header" id="top">
        <h1>Testing HTML Elements</h1>
        <nav>
            <ul>
                <li><a href="#section1" data-target="main">Link 1</a></li>
                <li><a href="#section2" class="active">Link 2</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <form action="/submit" method="POST">
            <input type="text" name="username" placeholder="Enter username" required>
            <input type="email" value="test@example.com" disabled>
            <button type="submit">Submit</button>
        </form>
        
        <img src="image.jpg" alt="Test image" width="200" height="150">
        <p>Special chars: &lt;&gt;&amp;&quot;&#39;</p>
    </main>
    
    <script>
        const element = document.querySelector('.main-header');
        element.addEventListener('click', () => console.log('clicked'));
    </script>
</body>
</html>
```

## CSS

```css
/* CSS Theme Test */
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --font-size: 16px;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: var(--font-size);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #333;
}

#main-content {
    max-width: 1200px;
    margin: 0 auto;
}

.container {
    background-color: rgba(255, 255, 255, 0.9);
    border: 2px solid var(--primary-color);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Pseudo-classes and pseudo-elements */
a:hover {
    color: var(--primary-color);
    text-decoration: none;
}

.item::before {
    content: "→ ";
    color: var(--secondary-color);
}

/* Attribute selectors */
[data-theme="dark"] {
    background-color: #2d3748;
}

input[type="text"] {
    border: 1px solid #ccc;
    padding: 8px 12px;
}

/* Media queries */
@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
}

@keyframes slideIn {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(0); }
}

.animated {
    animation: slideIn 0.3s ease-in-out;
    width: calc(100% - 40px);
    height: clamp(200px, 50vh, 400px);
}
```

## Python

```python
#!/usr/bin/env python3
"""
Python Theme Test Module
This module tests various Python syntax elements
"""

import os
import sys
from typing import List, Dict, Optional, Union
from dataclasses import dataclass
from collections import defaultdict
import asyncio

# Global constants
DEBUG = True
API_URL = "https://api.example.com"
REGEX_PATTERN = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"

@dataclass
class User:
    """User data class with type hints"""
    id: int
    name: str
    email: str
    is_active: bool = True
    metadata: Optional[Dict[str, Union[str, int]]] = None

class DatabaseManager:
    """Database manager with various method types"""
    
    def __init__(self, connection_string: str):
        self.connection_string = connection_string
        self._cache = defaultdict(list)
        self.__private_key = "secret"
    
    @property
    def is_connected(self) -> bool:
        """Check if database is connected"""
        return self.connection_string is not None
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        import re
        return re.match(REGEX_PATTERN, email) is not None
    
    async def fetch_users(self, limit: int = 10) -> List[User]:
        """Fetch users from database"""
        # Simulate database query
        users = []
        for i in range(limit):
            user = User(
                id=i + 1,
                name=f"User {i + 1}",
                email=f"user{i + 1}@example.com",
                metadata={"created_at": "2024-01-01", "role": "user"}
            )
            users.append(user)
        return users
    
    def process_data(self, data: Dict[str, any]) -> None:
        """Process incoming data with error handling"""
        try:
            # List comprehension
            filtered_data = [item for item in data.get('items', []) if item['active']]
            
            # Dictionary comprehension
            user_map = {user['id']: user['name'] for user in filtered_data}
            
            # Set operations
            active_ids = {user['id'] for user in filtered_data if user['active']}
            
            # String formatting
            message = f"Processed {len(filtered_data)} items"
            print(f"Debug: {message}")
            
            # Multiple assignment
            first, *middle, last = filtered_data
            
            # Context manager
            with open('output.txt', 'w') as f:
                f.write(f"Results: {user_map}")
                
        except KeyError as e:
            print(f"Missing key: {e}")
        except Exception as e:
            print(f"Unexpected error: {e}")
        finally:
            print("Processing complete")

# Lambda functions
square = lambda x: x ** 2
filter_evens = lambda numbers: [n for n in numbers if n % 2 == 0]

# Generator function
def fibonacci_generator(n: int):
    """Generate fibonacci sequence"""
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

# Decorator
def timer(func):
    """Time function execution"""
    import time
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

@timer
def example_function():
    """Example function with decorator"""
    numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    
    # Various operations
    squared = [square(n) for n in numbers]
    evens = filter_evens(numbers)
    
    # f-strings and raw strings
    raw_string = r"C:\Users\test\file.txt"
    formatted = f"Squared: {squared}, Evens: {evens}"
    
    # Boolean operations
    is_valid = True and not False or (1 in numbers)
    
    # Walrus operator (Python 3.8+)
    if (length := len(numbers)) > 5:
        print(f"Long list with {length} items")
    
    return {
        'squared': squared,
        'evens': evens,
        'is_valid': is_valid,
        'raw_string': raw_string
    }

# Main execution
if __name__ == "__main__":
    # Multiline string
    docstring = """
    This is a multiline string
    with multiple lines and 'quotes'
    """
    
    db = DatabaseManager("postgresql://user:pass@localhost/db")
    
    # Async execution
    async def main():
        users = await db.fetch_users(5)
        for user in users:
            print(f"User: {user.name} ({user.email})")
    
    # Run async function
    asyncio.run(main())
    
    # Call decorated function
    result = example_function()
    
    # Print with various types
    print(f"Result: {result}")
    print(f"Fibonacci: {list(fibonacci_generator(10))}")
    
    # Exception handling
    try:
        1 / 0
    except ZeroDivisionError:
        print("Cannot divide by zero!")
```

## JavaScript

```javascript
// JavaScript Theme Test
'use strict';

// Various variable declarations
const API_BASE_URL = 'https://api.example.com';
let currentUser = null;
var isLoggedIn = false;

// Object literals and destructuring
const config = {
    apiUrl: API_BASE_URL,
    timeout: 5000,
    retries: 3,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
};

// Array methods and arrow functions
const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', active: true },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', active: false },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', active: true }
];

// Template literals and array methods
const activeUsers = users
    .filter(user => user.active)
    .map(user => ({
        ...user,
        displayName: `${user.name} <${user.email}>`
    }));

// Class definition
class UserManager {
    #privateField = 'secret';
    
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
        this.cache = new Map();
    }
    
    // Static method
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Async method
    async fetchUser(id) {
        if (this.cache.has(id)) {
            return this.cache.get(id);
        }
        
        try {
            const response = await fetch(`${this.apiUrl}/users/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const user = await response.json();
            this.cache.set(id, user);
            return user;
        } catch (error) {
            console.error('Failed to fetch user:', error);
            throw error;
        }
    }
    
    // Generator method
    * generateUserIds() {
        for (let i = 1; i <= 100; i++) {
            yield i;
        }
    }
}

// Function declarations and expressions
function traditionalFunction(param1, param2 = 'default') {
    return `${param1} - ${param2}`;
}

const arrowFunction = (x, y) => x + y;

// Destructuring assignment
const { apiUrl, timeout } = config;
const [firstUser, secondUser, ...restUsers] = users;

// Promise handling
const userManager = new UserManager(apiUrl);

userManager.fetchUser(1)
    .then(user => {
        console.log('User fetched:', user);
        return userManager.fetchUser(2);
    })
    .then(user => console.log('Second user:', user))
    .catch(error => console.error('Error:', error))
    .finally(() => console.log('Promise chain completed'));

// Async/await
async function processUsers() {
    try {
        const promises = [1, 2, 3].map(id => userManager.fetchUser(id));
        const users = await Promise.all(promises);
        
        users.forEach((user, index) => {
            console.log(`User ${index + 1}:`, user);
        });
        
        return users;
    } catch (error) {
        console.error('Error processing users:', error);
        throw error;
    }
}

// Event handling
document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('#submit-btn');
    
    button?.addEventListener('click', async (event) => {
        event.preventDefault();
        
        const formData = new FormData(event.target.form);
        const data = Object.fromEntries(formData);
        
        try {
            await processUsers();
            console.log('Form submitted successfully');
        } catch (error) {
            console.error('Form submission failed:', error);
        }
    });
});

// Regular expressions
const patterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^\(\d{3}\) \d{3}-\d{4}$/,
    url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
};

// Modern JavaScript features
const uniqueEmails = [...new Set(users.map(user => user.email))];
const userMap = new Map(users.map(user => [user.id, user]));

// Nullish coalescing and optional chaining
const userName = currentUser?.name ?? 'Guest';
const userEmail = currentUser?.email || 'no-email@example.com';

// Dynamic imports (commented for static analysis)
// const { default: moment } = await import('moment');
```

## JSON

```json
{
    "name": "theme-test-package",
    "version": "1.0.0",
    "description": "A test package for theme colors",
    "main": "index.js",
    "scripts": {
        "start": "node index.js",
        "test": "jest",
        "build": "webpack --mode production",
        "dev": "webpack serve --mode development"
    },
    "keywords": ["theme", "test", "colors"],
    "author": "Test Author <test@example.com>",
    "license": "MIT",
    "dependencies": {
        "express": "^4.18.2",
        "lodash": "^4.17.21",
        "moment": "^2.29.4"
    },
    "devDependencies": {
        "jest": "^29.5.0",
        "webpack": "^5.82.0",
        "webpack-cli": "^5.1.1"
    },
    "config": {
        "port": 3000,
        "database": {
            "host": "localhost",
            "port": 5432,
            "name": "testdb",
            "ssl": false
        }
    },
    "repository": {
        "type": "git",
        "url": "https://github.com/user/theme-test.git"
    },
    "bugs": {
        "url": "https://github.com/user/theme-test/issues"
    },
    "homepage": "https://github.com/user/theme-test#readme"
}
```

## YAML

```yaml
# YAML Theme Test Configuration
name: theme-test-app
version: "1.0.0"
description: |
  A multi-line description
  that spans several lines
  and tests YAML syntax

# Environment configuration
environment:
  development:
    database:
      host: localhost
      port: 5432
      name: testdb_dev
      ssl: false
    logging:
      level: debug
      file: ./logs/dev.log
  
  production:
    database:
      host: ${DATABASE_HOST}
      port: ${DATABASE_PORT:-5432}
      name: testdb_prod
      ssl: true
    logging:
      level: info
      file: ./logs/prod.log

# Application settings
app:
  port: 3000
  workers: 4
  timeout: 30
  features:
    - authentication
    - authorization
    - caching
    - monitoring
  
  middleware:
    cors:
      enabled: true
      origins: 
        - "https://example.com"
        - "https://app.example.com"
    
    rate_limiting:
      enabled: true
      requests_per_minute: 100
      burst_size: 50

# Docker configuration
docker:
  image: node:18-alpine
  ports:
    - "3000:3000"
    - "9229:9229"
  volumes:
    - ./app:/usr/src/app
    - node_modules:/usr/src/app/node_modules
  environment:
    NODE_ENV: development
    DEBUG: "app:*"

# Database migrations
migrations:
  - version: "001"
    description: "Create users table"
    up: |
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    down: "DROP TABLE users;"
  
  - version: "002"
    description: "Add user profiles"
    up: |
      CREATE TABLE user_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        bio TEXT,
        avatar_url VARCHAR(500)
      );
    down: "DROP TABLE user_profiles;"

# Test configuration
testing:
  unit_tests:
    framework: jest
    coverage_threshold: 80
    files:
      - "**/*.test.js"
      - "**/*.spec.js"
  
  integration_tests:
    database: testdb_integration
    fixtures:
      - users.json
      - products.json
```

## SQL

```sql
-- SQL Theme Test Queries
-- This file contains various SQL syntax elements

-- Database setup
CREATE DATABASE theme_test_db;
USE theme_test_db;

-- Table creation with constraints
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    birth_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_email CHECK (email LIKE '%@%.%'),
    CONSTRAINT chk_birth_date CHECK (birth_date < CURDATE())
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_name ON users(first_name, last_name);
CREATE INDEX idx_users_created ON users(created_at);

-- Insert sample data
INSERT INTO users (username, email, password_hash, first_name, last_name, birth_date) VALUES
('john_doe', 'john@example.com', 'hashed_password_123', 'John', 'Doe', '1990-05-15'),
('jane_smith', 'jane@example.com', 'hashed_password_456', 'Jane', 'Smith', '1985-08-22'),
('bob_johnson', 'bob@example.com', 'hashed_password_789', 'Bob', 'Johnson', '1992-12-10');

-- Complex SELECT queries
SELECT 
    u.id,
    u.username,
    u.email,
    CONCAT(u.first_name, ' ', u.last_name) AS full_name,
    YEAR(CURDATE()) - YEAR(u.birth_date) AS age,
    CASE 
        WHEN u.is_active = 1 THEN 'Active'
        ELSE 'Inactive'
    END AS status,
    DATE_FORMAT(u.created_at, '%Y-%m-%d %H:%i:%s') AS formatted_created
FROM users u
WHERE u.created_at > '2024-01-01'
    AND u.email LIKE '%@example.com'
ORDER BY u.created_at DESC
LIMIT 10;

-- Aggregate functions and GROUP BY
SELECT 
    YEAR(created_at) as year,
    COUNT(*) as user_count,
    COUNT(DISTINCT email) as unique_emails,
    AVG(YEAR(CURDATE()) - YEAR(birth_date)) as avg_age,
    MIN(created_at) as first_user,
    MAX(created_at) as last_user
FROM users
GROUP BY YEAR(created_at)
HAVING COUNT(*) > 0
ORDER BY year DESC;

-- Subqueries and CTEs
WITH recent_users AS (
    SELECT id, username, email, created_at
    FROM users
    WHERE created_at > DATE_SUB(CURDATE(), INTERVAL 30 DAY)
),
user_stats AS (
    SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_users
    FROM users
)
SELECT 
    ru.username,
    ru.email,
    ru.created_at,
    us.total_users,
    us.active_users,
    (us.active_users / us.total_users * 100) as active_percentage
FROM recent_users ru
CROSS JOIN user_stats us
ORDER BY ru.created_at DESC;

-- Window functions
SELECT 
    username,
    email,
    created_at,
    ROW_NUMBER() OVER (ORDER BY created_at) as row_num,
    RANK() OVER (ORDER BY created_at) as rank_num,
    DENSE_RANK() OVER (ORDER BY created_at) as dense_rank,
    LAG(created_at) OVER (ORDER BY created_at) as prev_created,
    LEAD(created_at) OVER (ORDER BY created_at) as next_created
FROM users;

-- UPDATE with JOIN
UPDATE users u
SET u.updated_at = CURRENT_TIMESTAMP
WHERE u.id IN (
    SELECT id FROM (
        SELECT id 
        FROM users 
        WHERE created_at < DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
    ) as old_users
);

-- Stored procedure
DELIMITER //
CREATE PROCEDURE GetUsersByAge(IN min_age INT, IN max_age INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE user_count INT;
    
    -- Get user count
    SELECT COUNT(*) INTO user_count 
    FROM users 
    WHERE (YEAR(CURDATE()) - YEAR(birth_date)) BETWEEN min_age AND max_age;
    
    -- Return results
    SELECT 
        id,
        username,
        email,
        (YEAR(CURDATE()) - YEAR(birth_date)) as age,
        user_count as total_in_range
    FROM users
    WHERE (YEAR(CURDATE()) - YEAR(birth_date)) BETWEEN min_age AND max_age
    ORDER BY birth_date DESC;
    
END //
DELIMITER ;

-- Function
DELIMITER //
CREATE FUNCTION GetUserAge(birth_date DATE) 
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    RETURN YEAR(CURDATE()) - YEAR(birth_date);
END //
DELIMITER ;

-- Trigger
DELIMITER //
CREATE TRIGGER users_before_update
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- Views
CREATE VIEW active_users_view AS
SELECT 
    id,
    username,
    email,
    CONCAT(first_name, ' ', last_name) as full_name,
    GetUserAge(birth_date) as age
FROM users
WHERE is_active = TRUE;

-- Permissions
GRANT SELECT, INSERT, UPDATE ON theme_test_db.users TO 'app_user'@'localhost';
GRANT ALL PRIVILEGES ON theme_test_db.* TO 'admin_user'@'localhost';

-- Cleanup
-- DROP PROCEDURE IF EXISTS GetUsersByAge;
-- DROP FUNCTION IF EXISTS GetUserAge;
-- DROP VIEW IF EXISTS active_users_view;
-- DROP TABLE IF EXISTS users;
```

---

## Testing Instructions

1. **Save this file** as `theme-test.md` in your workspace
2. **Open in VS Code** and use **Ctrl/Cmd + K, Ctrl/Cmd + T** to open theme picker
3. **Navigate themes** with arrow keys to see live previews
4. **Look for these key elements** in each theme:
   - **Comments** (green/gray in most themes)
   - **Strings** (red/orange/yellow usually)
   - **Keywords** (blue/purple - `const`, `class`, `def`, etc.)
   - **Functions** (yellow/blue - function names)
   - **Numbers** (orange/red - `42`, `3.14`, etc.)
   - **Operators** (white/gray - `+`, `-`, `=`, etc.)
   - **Brackets/Braces** (white/gray/colored)
   - **Variables** (white/light blue)
   - **Types** (green/blue - `int`, `string`, etc.)

This single file will show you how any theme handles syntax highlighting across all major languages!