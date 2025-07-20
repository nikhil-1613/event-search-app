# 🔍 Event Search App

A full-stack event search web application to search logs based on IP addresses, fields, and time ranges. Built using:

- ⚙️ Django REST Framework (Backend)
- ⚛️ React.js (Frontend)
- 🐳 Docker & Docker Compose (Containerization)

---

## 🚀 Overview

This application allows users to:

- Search through event data logs
- Filter by **IP address**, **field-based queries**, and **time ranges**
- Handle **10+ concurrent searches**
- View matching results, log file name, and time taken for the search

---


## 🔧 Features

- ✅ Search by IP (e.g. `58.205.48.62`)
- ✅ Search by field-value (e.g. `dstaddr=221.181.27.227`)
- ✅ Time-based filtering (epoch format)
- ✅ Display results with:
  - Matching Event Info
  - Filename where the event was found
  - Total time taken for the search
- ✅ Handles 10+ concurrent users
- ✅ Fully Dockerized

---

## 🏗️ Project Structure

<img width="509" height="472" alt="image" src="https://github.com/user-attachments/assets/e4dd2484-d8da-4f46-a5e7-073c7c2cc9f7" />

---

# Step 1: Clone the repository
git clone https://github.com/nikhil-1613/event-search-app.git
cd event-search-app

# Step 2: Run the app using Docker Compose
docker-compose up --build
🔗 Frontend: http://localhost:3000
🔗 Backend API: http://localhost:8000/api/search/



---
**1. From the UI (React app)**
Enter:

Search String → e.g. 159.62.125.136
Search String → e.g. dstaddr=159.62.125.136

Start Time → e.g. 1725850449

End Time → e.g. 1725855086

Click Search

View:

Matching Events

File in which they were found

Search duration


