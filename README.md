# Secure PDF Print System

A secure document printing platform that ensures files are encrypted, temporarily accessible, and automatically deleted after printing.

## Features
- **AES-256 Encryption**: Files are encrypted before being stored.
- **GridFS Storage**: Managed storage for large PDF files in MongoDB Atlas.
- **JWT Protection**: Secure, time-limited links for third-party access (e.g., Xerox shops).
- **One-Time Access**: Files are automatically deleted from GridFS and metadata is revoked after a successful print trigger.
- **WhatsApp Integration**: Easily share secure links with one click.

## Tech Stack
- **Frontend**: React (Vite), Lucide Icons, Axios.
- **Backend**: Spring Boot, Spring Security, MongoDB Atlas (GridFS), JJWT.

## Setup Instructions

### Option 1: Using Docker (Recommended for easy deployment)
1. Ensure Docker and Docker Compose are installed.
2. Run the application:
   ```bash
   docker-compose up --build
   ```
3. Access the application at `http://localhost:8081`.

### Option 2: Manual Setup

#### 1. Backend (Spring Boot)
1. Navigate to `backend/`.
2. Update `src/main/resources/application.properties` with your **MongoDB Atlas URI**.
3. Run with Maven:
   ```bash
   mvn spring-boot:run
   ```

#### 2. Frontend (React)
1. Navigate to `frontend/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Workflow
1. **User** uploads a PDF on the React app.
2. **Backend** encrypts the PDF and stores it in **MongoDB Atlas GridFS**.
3. **Backend** generates a **JWT link** valid for 30 minutes.
4. **User** shares the link via **WhatsApp** to the Xerox shop.
5. **Xerox Shop** opens the link in the secure viewer.
6. **Xerox Shop** clicks **Print**.
7. **System** triggers browser print and immediately **deletes** the file and session data from the server.
