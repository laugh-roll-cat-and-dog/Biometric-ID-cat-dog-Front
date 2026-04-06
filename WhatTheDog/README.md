# 🐕 WhatTheDog - Biometric Dog Identification App

A cross-platform mobile application for identifying dogs using biometric data and image recognition. The app allows users to search for dog information by name, ID, or image, and upload new dog profiles to the community database.

## 📱 Features

- **🔍 Text Search**: Search for dogs by name or ID
- **📸 Image Search**: Upload dog photos to find matches
- **⬆️ Dog Upload**: Contribute new dog profiles with photos and information
- **🎨 Dark/Light Mode**: Automatic theme switching based on system settings
- **📱 Responsive Design**: Optimized for Android and iOS devices
- **⚡ Fast Performance**: Efficient image processing and API calls
- **🔐 Error Handling**: User-friendly error messages and validation

## 🛠️ Tech Stack

### Frontend

- **React Native** with **Expo** (SDK 54)
- **Expo Router** - File-based routing
- **TypeScript** - Type-safe development
- **React Hooks** - State management
- **Axios** - HTTP client for API communication
- **React Native Safe Area Context** - Proper layout handling

### Backend

- **FastAPI** (Python) - High-performance API framework
- **PostgreSQL** - Relational database
- **SQLAlchemy** - ORM for database operations
- **Docker & Docker Compose** - Containerization
- **Python-Multipart** - File upload handling

## 📁 Project Structure

```
WhatTheDog/
├── app/                          # Frontend screens & navigation
│   ├── (tabs)/                   # Tabbed navigation
│   │   ├── search.tsx           # Dog search screen
│   │   ├── upload.tsx           # Dog upload screen
│   │   └── _layout.tsx          # Tab navigation
│   ├── dog-detail.tsx           # Dog detail view
│   ├── index.tsx                # Home screen
│   ├── modal.tsx                # Modal screens
│   └── _layout.tsx              # Root layout
├── components/                   # Reusable UI components
│   ├── common/                  # Common components (Card, Alert, etc.)
│   ├── search/                  # Search-specific components
│   ├── upload/                  # Upload-specific components
│   └── ui/                      # UI elements (icons, etc.)
├── config/                       # Configuration files
│   └── api.ts                   # API configuration & base URL
├── constants/                    # App constants
│   ├── style.ts                 # Styling constants
│   └── theme.ts                 # Color themes
├── hooks/                        # Custom React hooks
│   ├── use-image-picker.ts      # Image selection logic
│   ├── use-color-scheme.ts      # Theme hook
│   └── use-theme-color.ts       # Theme color hook
├── services/                     # API services
│   └── api.ts                   # API client with error handling
├── utils/                        # Utility functions
│   ├── user-error.ts            # Error message translation
│   ├── validation.ts            # Form validation
│   └── formatting.ts            # Text formatting
├── types/                        # TypeScript types
│   └── index.ts                 # Type definitions
├── assets/                       # Images, fonts, etc.
├── ios/                          # iOS native code
├── android/                      # Android native code
├── backend/                      # FastAPI backend
│   ├── main.py                  # FastAPI application
│   ├── requirements.txt         # Python dependencies
│   ├── docker-compose.yml       # Docker orchestration
│   ├── Dockerfile               # Backend container
│   ├── init.sql                 # Database schema
│   └── DOCKER_SETUP.md          # Backend setup guide
├── app.json                      # Expo configuration
├── package.json                  # NPM dependencies
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Android Studio (for Android development) or iOS Xcode
- Docker & Docker Compose (for backend)
- Android SDK level 33+

### Frontend Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npm start
   ```

3. **Open in Android Emulator**
   - Press `a` in the terminal
   - Or manually open Android Emulator first, then press `a`

4. **Open in iOS Simulator** (macOS only)
   - Press `i` in the terminal

### Backend Setup

See [backend/DOCKER_SETUP.md](./backend/DOCKER_SETUP.md) for detailed Docker setup instructions.

**Quick Start:**

```bash
cd backend
cp .env.example .env
docker-compose up --build
```

This will:

- Start PostgreSQL on `localhost:5432`
- Start FastAPI on `localhost:8000`
- Initialize database with schema

## 📚 API Endpoints

All API endpoints are accessed through the FastAPI backend. Base URL: `http://localhost:8000`

### Search

- `POST /search/text` - Search dogs by text (name/ID)
- `POST /search/image` - Search dogs by image

### Upload

- `POST /upload/dog` - Upload dog profile with images

### Utilities

- `GET /health` - API health check
- `GET /images/{dog_id}/{filename}` - Retrieve dog images

## 🔧 Configuration

### API Configuration

Edit `config/api.ts` to change the API base URL:

```typescript
export const API_CONFIG = {
  BASE_URL: "http://localhost:8000",  // Local development
  // BASE_URL: "https://your-ngrok-url.ngrok-free.dev",  // Production
  ...
}
```

### Environment Variables (Backend)

Create `backend/.env` from `backend/.env.example`:

```env
DATABASE_URL=postgresql://whatthedog:whatthedog_password@postgres:5432/whatthedog_db
ENV=production
API_HOST=0.0.0.0
API_PORT=8000
IMAGE_ROOT=/srv/storage/whatthedog
```

## 📱 Building the APK

Create a production APK for Android:

```bash
# Clean build
cd android && ./gradlew clean

# Build APK
./gradlew :app:assembleRelease

# APK location: android/app/build/outputs/apk/release/app-release.apk
```

Install on device:

```bash
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

## 🎯 Development Workflow

### Running in Development Mode

```bash
npm start
```

- Press `a` for Android
- Press `i` for iOS
- Press `w` for web (if configured)

### Development Tools

- **Debugger**: Expo DevTools in terminal
- **Hot Reload**: Automatic on code changes
- **TypeScript Checks**: `npx tsc --noEmit`

### Testing the Upload Feature

1. Open the "Upload" tab
2. Add dog name and photos
3. Fill in breed and age (optional)
4. Press "Upload Dog"
5. Wait for success alert

### Testing the Search Feature

1. Open the "Search" tab
2. Choose text or image search
3. Enter search query or upload image
4. View results with dog information

## 🐛 Troubleshooting

### Android App Issues

**App crashes on startup:**

- Clear cache: `npm start -- --clear`
- Reinstall: `adb uninstall com.withwws.whatthedog`

**API connection errors:**

- Verify backend is running: `curl http://your-api-url/health`
- Check API URL in `config/api.ts`
- Ensure device/emulator can reach backend (same network for local)

**Upload not working:**

- Check backend logs: `docker-compose logs api`
- Verify image permissions on device
- Check available storage space

### Backend Issues

**Database connection error:**

```bash
docker-compose down
docker-compose up --build --force-recreate
```

**Port already in use:**

- Change ports in `docker-compose.yml`
- Kill process: `lsof -ti:5432 | xargs kill -9`

**View logs:**

```bash
docker-compose logs api          # API logs
docker-compose logs postgres     # Database logs
docker-compose logs -f           # Follow logs
```

## 📸 Screenshots & Demo

[Add screenshots of search, upload, and result screens]

## 🌐 Deployment

### Frontend Deployment

- Build APK for Google Play Store
- Build IPA for Apple App Store
- Use EAS Build for managed builds: `eas build`

### Backend Deployment

- Push Docker image to registry (Docker Hub, ECR, etc.)
- Deploy to cloud platform (AWS ECS, GCP Cloud Run, DigitalOcean, etc.)
- Set up domain and SSL certificate
- Configure environment variables for production

## 📝 Development Notes

### File-Based Routing

The app uses Expo Router with file-based routing. Routes are automatically generated from the file structure in the `app/` directory.

### TypeScript

All code is strictly typed. Enable strict mode in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

### Error Handling

User-facing errors are managed through `utils/user-error.ts` for consistent messaging across the app.

### State Management

The app uses React Hooks (useState, useContext) for state management. No Redux/Mobx required for this project's complexity level.

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

## 📄 License

[Add your license here]

## 👥 Team

- **Frontend Developer**: React Native/Expo specialist
- **Backend Developer**: Python/FastAPI specialist
- **Project Manager**: [Your role]

## ❓ FAQ

**Q: Can I use this in production?**
A: The backend setup with Docker and PostgreSQL is production-ready. Ensure to configure environment variables, use managed database services, and set up proper monitoring.

**Q: How do I add more features?**
A: Follow the existing structure in `components/`, `hooks/`, and `services/`. Add new routes in the `app/` directory.

**Q: Should I use Expo Go or create a custom development build?**
A: Use Expo Go for quick development. Create a custom dev build for native modules or advanced features.

## 📞 Support

For issues and questions:

- Check existing issues on GitHub
- Create a new issue with detailed description
- Join our community Discord

---

**Last Updated**: April 5, 2026 | **Version**: 1.0.0
