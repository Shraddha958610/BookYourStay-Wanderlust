# 🏡 BookYourStay – Wanderlust

A full-stack accommodation booking web application inspired by modern vacation-rental platforms.

BookYourStay – Wanderlust allows users to explore property listings, view detailed information, create and manage listings, and interact through reviews.

## 🚀 Features

- 🏠 Browse accommodation listings
- 🔍 View detailed property information
- ➕ Create new listings
- ✏️ Edit existing listings
- 🗑️ Delete listings
- ⭐ Add and manage reviews
- 👤 User authentication
- 🔐 Secure password handling
- ⚡ Flash messages for user feedback
- 🛡️ Server-side validation
- 📱 Responsive user interface
- 🗄️ MongoDB database integration

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- EJS
- EJS-Mate

### Backend
- Node.js
- Express.js
- Mongoose
- Passport.js

### Database
- MongoDB

### Other Tools
- Express Session
- Connect Flash
- Method Override
- Dotenv

## 📂 Project Structure

```text
BookYourStay-Wanderlust/
│
├── models/
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── routes/
│   └── listing.js
│
├── views/
│   ├── includes/
│   ├── layouts/
│   └── listings/
│
├── public/
│   ├── css/
│   └── js/
│
├── utils/
│   ├── ExpressError.js
│   └── wrapAsync.js
│
├── init/
│   ├── data.js
│   └── index.js
│
├── app.js
├── schema.js
├── package.json
├── package-lock.json
└── .gitignore
