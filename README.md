# FlushFinder 🚽

**A NewHacks 25 Hackathon Project**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-flusherfinder.web.app-blue?style=for-the-badge&logo=firebase)](https://flusherfinder.web.app)

FlushFinder is a web application designed to help people with IBS, Crohn's disease, ulcerative colitis, and other digestive conditions find clean, accessible restrooms nearby. Built during NewHacks 25, this project addresses a real-world accessibility challenge that affects millions of people worldwide.

## 🌟 Live Demo

**Visit the live application: [flusherfinder.web.app](https://flusherfinder.web.app)**

## 🎯 Problem Statement

For millions of people worldwide, digestive conditions create invisible barriers to daily life. The constant worry about finding a clean, accessible restroom can turn simple activities like grocery shopping, commuting, or dining out into sources of anxiety and stress. Many people with these conditions limit their activities or avoid leaving home altogether.

## 💡 Solution

FlushFinder provides:
- **📍 Location-based search** for nearby restrooms using GPS
- **⭐ Community-driven reviews** from people who understand your experiences
- **ℹ️ Detailed accessibility information** about cleanliness and amenities
- **🗺️ Interactive maps** with Google Maps integration
- **🔐 Secure user accounts** with personalized experiences

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - Modern React with hooks and functional components
- **Google Maps API** - Interactive mapping and location services
- **CSS3** - Responsive design with custom styling
- **React Router** - Client-side routing

### Backend
- **FastAPI** - High-performance Python web framework
- **SQLAlchemy** - Python ORM for database operations
- **PostgreSQL** - Robust relational database with spatial support
- **JWT Authentication** - Secure token-based authentication

### Deployment
- **Firebase Hosting** - Frontend deployment
- **Railway** - Backend API and database hosting
- **Docker** - Containerization for consistent deployment

## 🚀 Key Features

### Smart Rating System
- **Bayesian Smoothing Algorithm** - Prevents extreme ratings with few reviews
- **2 Decimal Precision** - Clean, professional rating display

### User Experience
- **Responsive Design** - Works seamlessly on desktop (Mobile coming soon!)
- **Real-time Search** - Find restrooms as you move around
- **Community Reviews** - Honest feedback from users who understand
- **Accessibility Focus** - Designed with diverse user needs in mind

### Technical Highlights
- **Spatial Queries** - Efficient location-based search
- **RESTful API** - Clean, well-documented endpoints
- **Security First** - JWT authentication and secure data handling
- **Scalable Architecture** - Modern full-stack design

## 📊 Rating Algorithm

FlushFinder uses a sophisticated Bayesian smoothing algorithm:

```
Bayesian Rating = (total_ratings × avg_rating + prior_rating × prior_weight) / (total_ratings + prior_weight)
```

- **Prior Rating**: 3.6 (optimistic default)
- **Prior Weight**: 8 (equivalent to 8 virtual reviews)
- **Result**: More reliable ratings that prevent extreme scores

## 🏗️ Architecture

```
React Frontend ←→ FastAPI Backend ←→ PostgreSQL Database
     ↓                    ↓                    ↓
Firebase Hosting    Railway Platform    Railway PostgreSQL
```

## 🎓 NewHacks 25

This project was built during NewHacks 25, a hackathon focused on creating innovative solutions to real-world problems. FlushFinder addresses the accessibility challenges faced by people with digestive conditions, promoting inclusivity and improving quality of life.

## 🤝 Contributing

We welcome contributions! Please feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Share feedback

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NewHacks 25** - For providing the platform to build this project
- **Google Maps API** - For location services
- **Firebase** - For hosting and deployment
- **Railway** - For backend infrastructure

---
