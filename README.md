# **Kusini Backend**

**A robust backend solution for managing an ecommerce platform with seamless payment integration, media management, and scalable data storage.**


## **Table of Contents**

1. [Overview](#overview)
2. [Technologies Used](#technologies-used)
3. [Environment Variables](#environment-variables)
4. [Setup Instructions](#setup-instructions)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
5. [API Endpoints](#api-endpoints)
6. [Error Handling](#error-handling)
7. [Security Best Practices](#security-best-practices)
8. [Deployment](#deployment)
9. [Monitoring and Logging](#monitoring-and-logging)
10. [Contributing](#contributing)
11. [License](#license)

---

## **Overview**

This **Kusini Backend** powers Kusini Liquor ecommerce platform. It integrates payment processing using MPESA, media management through Cloudinary, and data storage with MongoDB. This backend provides RESTful APIs for authentication, user management, product management, and order processing.

---

## **Technologies Used**

- **Node.js**: Runtime environment for server-side development.
- **Express.js**: Framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing and managing data.
- **MPESA**: Payment gateway for secure transactions.
- **Cloudinary**: Service for media file storage and management.



## **Environment Variables**

The application requires specific environment variables defined in a `.env` file. Below are the key variables:

### MPESA Integration

- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_SHORTCODE`
- `MPESA_PASSKEY`
- `MPESA_ENV` (sandbox or live)
- `MPESA_BASE_URL`

### Cloudinary Configuration

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Application Settings

- `CALLBACK_URI`
- `MONGO_URI`



## **Setup Instructions**

### **Prerequisites**

Ensure you have the following installed:

- Node.js (v14.x or higher)
- MongoDB (cloud or local setup)
- Cloudinary account



### **Installation**

1. **Clone the Repository**

   ```bash
   git clone <https://github.com/Levin-ops/Kusini-Backend>
   cd kusini-backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**  
   Create a `.env` file in the root directory and configure it with your credentials.

4. **Start the Application**

   ```bash
   npm start
   ```

5. **Run Tests**
   ```bash
   npm test
   ```



## **API Endpoints**

### **Authentication**

- `POST /api/auth/login`
  - **Description**: Logs in a user and returns a JWT token.
  - **Request Body**: `{ username, password }`

### **MPESA Integration**

- `POST /api/mpesa/initiate`
  - **Description**: Initiates an MPESA payment.
  - **Request Body**: `{ amount, phoneNumber, shortcode, callbackUri }`

### **Media Management**

- `POST /api/media/upload`
  - **Description**: Uploads a media file to Cloudinary.
  - **Request**: Form-data with the media file.

### **User Management**

- `GET /api/users`
  - **Description**: Retrieves a list of all users.



## **Error Handling**

The application implements centralized error handling with meaningful status codes:

- **400**: Bad Request (Invalid input).
- **401**: Unauthorized (Authentication failure).
- **404**: Not Found (Resource unavailable).
- **500**: Internal Server Error (Unexpected errors).



## **Security Best Practices**

1. **Secure Environment Variables**:  `.env` is not exposed.
2. **Uses HTTPS**: Protect data during transmission.
3. **Dependency Updates**: Packages regularly updated to avoid vulnerabilities.



## **Deployment**

The application is deployed using **Render**. Follow these steps for deployment:

1. Create a Render app and configure your environment variables under **Environment Settings**.
2. Push your code to a version control platform (e.g., GitHub).
3. Link your repository to Render and deploy your app.
4. Test your endpoints to ensure functionality.





## **Contributing**

I welcome contributions to enhance **Kusini Backend**.

### Steps to Contribute:

1. **Fork the Repository**.
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature
   ```
3. **Commit Your Changes**:
   ```bash
   git commit -m "Add your feature"
   ```
4. **Push to Your Branch**:
   ```bash
   git push origin feature/your-feature
   ```
5. **Open a Pull Request**: Clearly describe your changes and why they should be merged.



## **License**

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.



**Happy Coding!** 🚀
