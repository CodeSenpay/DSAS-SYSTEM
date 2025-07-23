# DSAS-SYSTEM Docker Image Build Guide

## Prerequisites

- Docker installed ([Download Docker](https://www.docker.com/products/docker-desktop/))
- Project source code (this repository)
- Terminal/command prompt

---

## 1. Backend (Node API) Image

### a. Build the Backend Image

1. Open your terminal and navigate to the project root directory:

   ```sh
   cd /path/to/DSAS-SYSTEM
   ```

2. Build the Docker image for the backend:
   ```sh
   docker build -t my-node-api:latest -f node-api/Dockerfile .
   ```
   - `-t my-node-api:latest` names the image.
   - `-f node-api/Dockerfile` specifies the backend Dockerfile.

### b. Run the Backend Container

1. Ensure you have a `.env` file with the required environment variables (e.g., database credentials, JWT secret).
2. Run the container, mapping the desired port (e.g., 3000):
   ```sh
   docker run --env-file .env -p 3000:3000 my-node-api:latest
   ```
   - Adjust the port if your backend uses a different one.
   - Make sure your MySQL database is accessible to the container.

---

## 2. Frontend (React App) Image

### a. Build the Frontend Image

1. From the project root, build the frontend image using the provided Dockerfile:
   ```sh
   docker build -t dsas-webapp-nginx:latest -f Dockerfile .
   ```
   - This uses the root-level `Dockerfile` to build and serve the frontend with Nginx.

### b. Run the Frontend Container

1. Run the container, mapping the desired port (e.g., 80):
   ```sh
   docker run -p 80:80 dsas-webapp-nginx:latest
   ```
   - The frontend will be accessible at `http://localhost` (or the mapped port).

---

## Notes & Troubleshooting

- **Environment Variables:**  
  Ensure your `.env` file does not have extra spaces around variable names (e.g., use `JWT_SECRET=your_secret` not `JWT_SECRET = your_secret`).
- **Database Connection:**  
  The backend must be able to reach your MySQL server. If running MySQL in another container, use Docker networking or link containers.
- **Build Context:**  
  Always run the build commands from the project root to ensure Docker has access to all necessary files.

---

## Example: Full Build & Run

```sh
# Build backend
docker build -t my-node-api:latest -f node-api/Dockerfile .

# Build frontend
docker build -t dsas-webapp-nginx:latest -f Dockerfile .

# Run backend (ensure .env is correct)
docker run --env-file .env -p 3000:3000 my-node-api:latest

# Run frontend
docker run -p 80:80 dsas-webapp-nginx:latest
```

---

If you need further customization (e.g., multi-container orchestration), consider using Docker Compose.
