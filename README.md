# Episciences Front

## Run project (local environment)

1. Clone repository `git clone git@github.com:outplay-team/episciences-front.git`
2. Install dependencies `npm i`
3. Create `.env.local` file
4. Run project `npm run dev`

## Deploy project (staging environment)

1. Make sure to have Firebase CLI installed ( follow https://firebase.google.com/docs/cli#install_the_firebase_cli )
2. Login to Firebase `firebase login`
3. Build & deploy project `rm -rf dist && npm run build && firebase deploy`

## Build (production environment)
1. Create a `.env.local` file with production values
2. `npm run build`
3. `npm run preview` (optional preview build)
4. copy `dist` folder to production
