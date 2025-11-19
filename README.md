# Attendance Tracker

## Overview

Attendance Tracker is a modern Progressive Web App (PWA) built to help students effortlessly monitor their attendance ensuring they always stay above 75%.

The app automatically retrieves the timetable from branch-specific departmental Google Sheets maintained by Class Representatives. It leverages the **Google Sheets GViz Table Feed API** for lightning-fast data retrieval.

## Tech Stack

- **Frontend**: Next.js, TailwindCSS, Chart.js
- **Backend**: Firebase
- **Authentication**:
  - Microsoft OAuth (for IIT Patna students)
  - JWT-based signup/login (for external users)

## Installation Guide

To set up the project, clone this repository and install all dependencies from the root directory:

```bash
npm i
```

## Running Guide

To start the development environment, run the following command:

```bash
npm run dev
```

This will launch the application, which will be accessible at:

- **Client**: [http://localhost:3000](http://localhost:3000)


## Screenshots

| **Auth Page** | **Home Page** | **Lectures Page** | **Stats Page** |
|--------------------|------------------|------------------|------------------|
| <img width="210" height="420" src="https://github.com/user-attachments/assets/8560579c-b5b2-4044-9e98-1a7d9f6d0621" /> | <img width="210" height="420" src="https://github.com/user-attachments/assets/8602f6ea-e5fe-4ca3-bdba-7fe51c90a3ee" /> | <img width="210" height="420" alt="image" src="https://github.com/user-attachments/assets/5fe50ef3-30d1-4dd6-aa9a-28f8b6c96422" /> | <img width="210" height="420" alt="image" src="https://github.com/user-attachments/assets/d8702bd8-d969-4230-8cbe-9523dd2498b4" />



