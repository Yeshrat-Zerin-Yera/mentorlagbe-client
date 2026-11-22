
# MentorLagbe – Smart Tuition & Mentorship Platform

MentorLagbe is a full-stack tuition and mentorship platform that connects students with qualified tutors. Students can discover tuition opportunities and apply, tutors can manage tuition posts and applicants, and admins can manage the platform.

## Live Website

[https://mentorlagbe-client-jet.vercel.app](https://mentorlagbe-client-jet.vercel.app)

## Server

[https://mentorlagbe-server-87cn.onrender.com](https://mentorlagbe-server-87cn.onrender.com)

## Features

### Public Features
- Responsive homepage with featured tuitions and popular subjects.
- Browse approved and active tuition opportunities.
- Search and filter tuitions by subject, class level, and mode.
- View detailed tuition information.
- User registration and login.

### Student Dashboard
- View application statistics.
- Browse and manage submitted applications.
- Cancel pending applications.
- View current subscription plan.
- Manage profile information.

### Tutor Dashboard
- View tuition and applicant statistics.
- Create tuition posts with image uploads.
- Manage, edit, activate, and delete tuition posts.
- Accept or reject student applications.
- Upgrade to the Pro subscription plan.

### Admin Dashboard
- View platform statistics.
- Manage users and roles.
- Approve or reject tuition posts.
- View payment transactions and revenue.

### Additional Features
- Better Auth authentication with JWT.
- Role-based dashboard navigation.
- Stripe payment integration.
- ImgBB image uploads.
- Sonner toast notifications.
- Custom loading, error, and 404 pages.
- Responsive dashboard with collapsible sidebar.

## Technologies Used

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Node.js
- Express.js
- MongoDB
- Better Auth
- Stripe
- ImgBB
- Sonner
- Lucide React

## Installation

### Prerequisites

- Node.js and npm
- Running MentorLagbe backend
- MongoDB database

### Clone the Repository

```bash
git clone https://github.com/Yeshrat-Zerin-Yera/mentorlagbe-client
```

Navigate to the project directory:

```bash
cd mentorlagbe-client
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Add any other environment variables required by your project.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## User Roles

| Role | Permissions |
|---|---|
| Student | Browse tuitions, apply, and manage applications |
| Tutor | Post tuitions and manage applicants |
| Admin | Manage users, moderate tuitions, and monitor payments |

## Subscription Plans

| User | Pro Plan |
|---|---:|
| Student | $10 |
| Tutor | $15 |

## Backend Repository

[https://github.com/Yeshrat-Zerin-Yera/mentorlagbe-server](https://github.com/Yeshrat-Zerin-Yera/mentorlagbe-server)

## Developer

**Yeshrat Zerin Yera**

- GitHub: https://github.com/Yeshrat-Zerin-Yera
- LinkedIn: https://www.linkedin.com/in/yeshrat-zerin-yera/
