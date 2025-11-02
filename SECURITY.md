# Security Guidelines for MySKYN

## Environment Variables Setup
1. Copy `.env.example` to `.env`
2. Fill in your Firebase credentials
3. Never commit `.env` to version control

## Firebase Security Rules
Set these rules in Firebase Console:

### Database Rules:
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

### Auth Domain Restrictions:
- Add your domain to authorized domains in Firebase Console
- Remove unauthorized domains

## Deployment Environment Variables
Add these variables to your hosting platform:
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_DATABASE_URL
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_MEASUREMENT_ID

## Important Notes
- Firebase web API keys are designed to be public
- Security comes from Firebase Rules, not hiding API keys
- Always use environment variables for organization
- Set up proper Firebase Security Rules