# StudentVault - MERN Stack Project
A collaborative platform for students to upload, store, and share study materials.
___
StudentVault is a MERN stack-based web platform designed for students to upload, store, and share their study materials, including notes, assignments, and reference documents. With secure authentication and authorization, students can manage their files safely while ensuring access control.
## Features 
* ✅ User Authentication & Authorization – Secure login and signup using JWT-based authentication stored in HTTP-only cookies.
* ✅ File Upload & Storage – Upload study materials (PDFs, images, text files) securely using Cloudinary.
* ✅ Material Sharing – Share study resources with classmates.
* ✅ User Dashboard – Manage uploaded files, delete or update documents.
* ✅ Search & Filter – Find materials by title, subject, or upload date.
* ✅ Responsive Design – Fully optimized for both mobile and desktop.

## Installation & Setup
* Clone the repo
  ```javascript
  git clone https://github.com/Jsid21/StudentVault.git
  cd StudentVault
  ```
* Backend Setup
  ```javascript
  cd server
  npm install
  ```
  create `.env` file -
```javascript
  MONGO_URI=your_mongodb_uri
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  JWT_SECRET=your_jwt_secret
```
  start server
  ```javascript
  npx nodemon app.js
  ```
* Frontend setup
  ```javascript
  cd client
  npm install
  npm run dev
  ```
  
