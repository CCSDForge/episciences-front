# Episciences Front

> [!WARNING]
> **Project Archived / Projet archivé**
>
> This repository is archived and no longer maintained. It has been replaced by [episciences-front-next](https://github.com/CCSDForge/episciences-front-next).  
> Please report new issues or contributions on [episciences-front-next/issues](https://github.com/CCSDForge/episciences-front-next/issues).
>
> *Ce dépôt est archivé et n'est plus maintenu. Il est remplacé par [episciences-front-next](https://github.com/CCSDForge/episciences-front-next).*  
> *Merci d'ouvrir vos signalements et tickets sur [episciences-front-next/issues](https://github.com/CCSDForge/episciences-front-next/issues).*

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

## Updating Projects with assets

1. update application code: `git pull`
2. update assets: `cd external-assets;git pull`
3. test : `cd ..; npm run dev`
