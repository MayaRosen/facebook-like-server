# **Facebook-Like Server**

Welcome to the **Backend of the Facebook-like project**!🎉

This backend powers the core functionalities of our Facebook-like platform, built using **Express** and **MongoDB**. Designed for **real-time interactions**, it provides a seamless experience for both web and Android users. The backend follows a **RESTful API architecture**, enabling flexibility and scalability to support a wide range of operations.

By leveraging **MongoDB**, we ensure a reliable and efficient solution for managing user accounts, posts, comments, friend connections, and more. Whether it's enabling social features or processing requests, this backend is built to handle everything with precision.


In addition to this server, there are separate repositories in this GitHub for:

  * [The Web Application](https://github.com/MayaRosen/facebook-like-web): A React-based frontend that delivers an intuitive user interface and allows seamless interaction with the platform.
  * [The Android Application](https://github.com/MayaRosen/facebook-like-android): A mobile app providing similar functionality for Android devices.


## **API Endpoints**

### **Users**
- **POST** `/users`: Register a new user.  
- **GET** `/users/:id`: Retrieve details of a specific user.  
- **PUT** `/users/:id`: Update user details.  
- **PATCH** `/users/:id`: Partially update a user’s information.  
- **DELETE** `/users/:id`: Remove a user.  

### **Posts**
- **GET** `/posts`: Retrieve posts accessible to the user, respecting friend connections.  
- **POST** `/posts`: Create a new post.  
- **PATCH** `/posts/:pid`: Edit a specific post.  
- **DELETE** `/posts/:pid`: Delete a specific post.  
- **POST** `/posts/:pid/likes`: Like a post.  
- **DELETE** `/posts/:pid/likes`: Unlike a post.  

### **Comments**
- **GET** `/posts/:pid/comments`: Fetch comments for a specific post.  
- **POST** `/posts/:pid/comments`: Add a comment to a post.  
- **PATCH** `/posts/:pid/comments/:cid`: Edit a specific comment.  
- **DELETE** `/posts/:pid/comments/:cid`: Remove a specific comment.  

### **Friends**
- **GET** `/users/:id/friends`: View a user’s friend list.  
- **POST** `/users/:id/friends`: Send a friend request.  
- **PATCH** `/users/:id/friends/:fid`: Accept a friend request.  
- **DELETE** `/users/:id/friends/:fid`: Remove a friend.  

### **Tokens**
- **POST** `/tokens`: Generate a new authentication token for a user.

---

 ## **Prerequisites**
Ensure the following are installed on your machine:
- **Node.js**
- **npm**
- **MongoDB**

## **Installation Steps**
1. Clone the repository:
   ```bash
   git clone https://github.com/MayaRosen/facebook-like-server.git
2. Set Up MongoDB:
   ```bash
   mongod --dbpath=/path/to/your/mongodb/database
3. Launch the backend server:
   ```bash
   node app.js
4. Access the backend services in your browser:
   ```bash
   http://localhost:12345

   ---

## **Exploring the Entire System**
This repository is part of a complete system that includes:

* The React Web Application Repository
* The Android Application Repository
Visit these repositories to explore the front end of the project.

 ## **Visualisations**

### Homepage
![image](https://github.com/user-attachments/assets/facc27aa-1a93-4d6a-a7fa-7d9091e4def9) 
_A preview of the homepage._

### Private account
![image](https://github.com/user-attachments/assets/455df0c0-118c-465c-adcc-dc23e165fc4e)
 
_A preview of a user's private account._

### Edit Profile
![image](https://github.com/user-attachments/assets/f4cc1911-d787-4858-9983-ca802a2f5125)

_A preview of a user's personal page and edit popup._

### Login
![image](https://github.com/user-attachments/assets/9dc87b1f-7a33-405d-a0d9-37fa27717c0d)

_A preview of login page in android._

### Private account
![image](https://github.com/user-attachments/assets/3be3901c-f0ea-4c0e-ace3-88a3ce32f0c2)

_A preview of a friends's private account._

### Friend Feed Page
![image](https://github.com/user-attachments/assets/ce9df529-a1cc-4219-a17c-04831c803f18)

_A preview of a friend feedpage._

### Upload Post
![image](https://github.com/user-attachments/assets/3371c656-c153-41f2-9c42-9baab625dca3)

_A preview of uploading posts._

---

## **Enjoy!**
