# 🎌 ReAnime

A community-driven anime platform where users can explore anime content, watch clips, read story scenarios, rewrite scenes creatively, and interact with other fans.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-22c55e?style=for-the-badge)](https://re-anime.vercel.app/)

[![GitHub Repository](https://img.shields.io/badge/GitHub%20Repository-181717?style=for-the-badge\&logo=github)](https://github.com/mhmdkh1905/ReAnime)

---

## Overview

ReAnime is a creative community platform designed for anime fans who want to do more than only watch content.

Users can explore anime titles, view clips, read important story scenarios, and create their own alternative versions of those scenarios.

The platform supports two creative-writing experiences:

* **Actor Mode** — users imagine themselves inside the story as a character
* **Creator Mode** — users rewrite the story from the perspective of the original author

Users can also interact with community submissions through comments, likes, and dislikes.

---

## Table of Contents

* [Overview](#overview)
* [Main Features](#main-features)
* [User Experience](#user-experience)
* [Technology Stack](#technology-stack)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)
* [Firebase Configuration](#firebase-configuration)
* [Available Scripts](#available-scripts)
* [Future Improvements](#future-improvements)
* [Author](#author)

---

## Main Features

### Anime Discovery

* Browse anime movies and series
* View anime information and visual content
* Open detailed pages for individual titles
* Explore selected clips and trailers

### Story Scenarios

* Read important story summaries
* Explore key events from anime stories
* View creative submissions from other users

### Creative Writing

Users can create alternative versions of anime scenarios through two modes.

#### Actor Mode

* Enter the story as an imagined character
* Rewrite events from a personal perspective
* Describe how the story would change with the user involved

#### Creator Mode

* Rewrite the plot as the story creator
* Change events, outcomes, and character decisions
* Publish alternative story directions

### User Accounts

* User registration and login
* Firebase Authentication
* Protected application routes
* Persistent user sessions
* User profile pages

### Community Interaction

* Publish creative scenarios
* Comment on user submissions
* Like or dislike content
* View community responses
* Build an interactive anime-writing community

### User Profiles

* View personal profile information
* Manage user-created content
* View published scenarios
* Access account-related features

### Administration

* Administrative dashboard
* Manage anime content
* Manage platform data
* Control selected community content

---

## User Experience

The platform is designed around a simple creative flow:

1. Browse anime movies and series
2. Select an anime title
3. Watch available clips
4. Read the original story scenario
5. Choose Actor Mode or Creator Mode
6. Write an alternative scenario
7. Publish the submission
8. Receive comments, likes, and dislikes from the community

---

## Technology Stack

| Technology              | Purpose                                      |
| ----------------------- | -------------------------------------------- |
| React                   | Component-based user interface               |
| Vite                    | Development server and production build tool |
| React Router            | Client-side routing                          |
| Firebase Authentication | Registration, login, and user sessions       |
| Cloud Firestore         | Application data storage                     |
| Firebase Storage        | Media and file storage                       |
| CSS                     | Responsive styling and interface design      |

---

## Project Structure

```text
src/
├── components/
│   ├── homeSections/
│   ├── layout/
│   └── movie/
├── pages/
│   ├── admin/
│   ├── home/
│   ├── login-register/
│   ├── movie/
│   └── profile/
├── services/
├── context/
├── router/
└── main.jsx
```

### Folder Responsibilities

| Folder         | Purpose                                |
| -------------- | -------------------------------------- |
| `components`   | Reusable interface components          |
| `homeSections` | Sections displayed on the homepage     |
| `layout`       | Navbar, footer, and shared page layout |
| `movie`        | Anime and movie-related components     |
| `pages`        | Main application pages                 |
| `admin`        | Administrative dashboard               |
| `services`     | Firebase and data-access functions     |
| `context`      | Shared React application state         |
| `router`       | Application route configuration        |

---

## Getting Started

### Prerequisites

Install the following before running the project:

* Node.js 18 or newer
* npm
* A Firebase project

### Clone the Repository

```bash
git clone https://github.com/mhmdkh1905/ReAnime.git
cd ReAnime
```

### Install Dependencies

```bash
npm install
```

### Configure Firebase

Create a `.env` file in the project root.

Add your Firebase configuration values:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Use the exact variable names expected by your Firebase configuration file.

### Start the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## Firebase Configuration

ReAnime uses Firebase for authentication, application data, and media storage.

### Firebase Authentication

Used for:

* User registration
* User login
* Session management
* Protected application features

### Cloud Firestore

Used for storing data such as:

* Anime information
* User profiles
* Creative scenarios
* Comments
* Likes and dislikes

### Firebase Storage

Used for storing media such as:

* User-uploaded images
* Profile images
* Anime-related media

> Do not commit private Firebase service-account credentials or administrative keys.

Firebase web configuration values may be visible in frontend applications, but your Firestore and Storage security rules must prevent unauthorized access.

---

## Available Scripts

### Start Development Server

```bash
npm run dev
```

### Create Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Run Linter

```bash
npm run lint
```

---

## Future Improvements

* Add search and advanced anime filters
* Add bookmarks and favorite anime lists
* Add notifications for comments and reactions
* Add scenario categories and tags
* Improve moderation tools
* Add report functionality for inappropriate content
* Improve accessibility
* Add automated tests
* Add loading skeletons and better error states
* Improve mobile and tablet layouts
* Add multilingual support
* Add content recommendations
* Add pagination for community submissions

---

## Live Application

* [Open ReAnime](https://re-anime.vercel.app/)

---

## Author

**Mohammad Khateeb**

* [GitHub](https://github.com/mhmdkh1905)
* [LinkedIn](https://www.linkedin.com/in/mohammad-khateeb-891332303)
* [Email](mailto:mhmd52kh@gmail.com)

---

## License

This project was created for educational and personal portfolio purposes.
