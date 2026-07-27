# Ember & Oak - Production-Ready Backend API

> An AI-powered SaaS platform that transforms restaurant operations through digital automation, real-time management, and intelligent business insights.

![License](https://img.shields.io/badge/License-MIT-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-success)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Status](https://img.shields.io/badge/Status-Completed-orange)

---

# 📖 Overview

The **Smart Restaurant Management System** is a modern SaaS platform developed for **VibeAthon 6.0**. It solves common restaurant operational challenges by digitizing the complete workflow—from customer reservations and ordering to inventory management, billing, analytics, and AI-powered business insights.

Unlike traditional restaurant software, our platform connects **customers, restaurant staff, kitchen, and management** into one intelligent ecosystem that improves efficiency, customer satisfaction, and business growth.

---

# 🚀 Problem Statement

Many restaurants still rely on manual processes that lead to:

- Long customer waiting times
- No live food availability
- Manual billing
- Poor inventory management
- Staff coordination issues
- Lack of business analytics
- Communication delays between kitchen and customers

Our solution addresses these challenges using automation and AI.

---

# ✨ Features

## 👨‍🍳 Customer Module

- Digital Menu
- Live Item Availability
- QR Menu
- Smart Table Reservation
- Online Ordering
- Live Order Tracking
- Customer Notifications
- Digital Payments
- Order History

---

## 🏢 Restaurant Management

- Admin Dashboard
- Table Management
- Order Management
- Staff Management
- Customer Management
- Inventory Tracking
- Billing System
- Sales Reports
- Business Analytics

---

## 🤖 AI Features

- Personalized Food Recommendations
- Inventory Prediction
- Demand Forecasting
- AI Chat Assistant
- Smart Notifications
- Operational Insights

---

# 🛠 Tech Stack

## Frontend

- React.js
- Next.js
- Tailwind CSS
- ShadCN UI

## Backend

- Node.js
- Express.js

## Database

- MongoDB Atlas

## Authentication

- JWT Authentication
- Google OAuth
- Email OTP Verification


## Deployment

- Netlify
- Render

## Version Control

- Git & GitHub

---

# 🏗 System Architecture

```
                    Customer
                        │
                        ▼
              React / Next.js Frontend
                        │
                REST API + Socket.IO
                        │
                        ▼
            Node.js + Express Backend
                        │
      ┌─────────────────┼─────────────────┐
      │                 │                 │
      ▼                 ▼                 ▼
 MongoDB           Gemini API        Cloud Storage
      │
      ▼
   Admin Dashboard
```

---

# 🔄 Workflow

```
Customer Login
        │
        ▼
Browse Digital Menu
        │
        ▼
Reserve Table
        │
        ▼
Place Order
        │
        ▼
Kitchen Receives Order
        │
        ▼
Order Preparation
        │
        ▼
Live Order Tracking
        │
        ▼
Payment
        │
        ▼
Inventory Updated
        │
        ▼
Analytics Dashboard
        │
        ▼
AI Business Insights
```

---

# 📂 Project Structure

```
Restaurant-Management-System
│
├── client/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── assets/
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── config/
│   └── utils/
│
├── public/
├── README.md
└── package.json
```

---

# 📸 Major Modules

### Customer Portal

- Register/Login
- Browse Menu
- Reserve Table
- Place Orders
- Live Tracking

### Restaurant Dashboard

- Dashboard Overview
- Inventory
- Orders
- Tables
- Staff
- Customers
- Sales Analytics

### AI Module

- Recommendation Engine
- Demand Prediction
- Inventory Forecast
- Smart Alerts

---

# 🎯 User Stories Completed

✅ Modern User Interface

✅ Secure Authentication

✅ Google OAuth

✅ Email OTP Authentication

✅ Digital Menu

✅ Live Item Availability

✅ Smart Reservation

✅ Order Management

✅ Queue Management

✅ Billing System

✅ Inventory Management

✅ Staff Management

✅ Analytics Dashboard

✅ AI Recommendations

✅ Demand Forecasting

---

# 📈 Expected Benefits

- Reduced waiting time
- Better customer experience
- Improved inventory management
- Reduced food wastage
- Increased operational efficiency
- Data-driven decision making
- Higher customer retention
- Better restaurant profitability

---

# 👥 Target Users

- Restaurant Owners
- Restaurant Managers
- Waiters
- Kitchen Staff
- Customers
- Cafés
- Hotels
- Restaurant Chains

---

# 🔮 Future Enhancements

- Voice Ordering
- IoT Kitchen Integration
- Robot Waiters
- Blockchain Loyalty System
- Facial Recognition Check-in
- Dynamic Pricing
- Multi-Branch Management
- Mobile Applications
- Smart Kitchen Automation

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/ADITYADAV-0/ember-oak.git
```

## Navigate

```bash
cd ember-oak
```

## Install Frontend

```bash
cd client
npm install
```

## Install Backend

```bash
cd ../server
npm install
```

## Configure Environment Variables

Create a `.env` file.

```env
PORT=5000

MONGODB_URI=

JWT_SECRET=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=


```

---

## Run Backend

```bash
npm run dev
```

## Run Frontend

```bash
npm run dev
```

---

# 📊 Future Scope

- Cloud Kitchen Support
- Franchise Management
- Multi-Language Support
- Mobile Applications
- AI Sales Prediction
- Customer Loyalty Programs
- POS Hardware Integration

---

# 🏆 Hackathon

**VibeAthon 6.0 (2026)**

Problem Statement:
**Smart Restaurant Management System**

---

# 👨‍💻 Team

**Team Name:** *Tech Guardians*

### Members

- Aditya Yadav 
- Divyanshu Vishwakarma
- Yash Verma

---

# 🔗 Links

### Live Demo

```
https://ember-o.netlify.app

### GitHub Repository

```
https://github.com/ADITYADAV-0/ember-oak.git
```

---

# 📄 License

This project is developed for educational and hackathon purposes.

MIT License

---

## ⭐ If you like this project, don't forget to star the repository!
