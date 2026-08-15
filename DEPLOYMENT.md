# SAATHI Vercel Deployment

## Project Settings

- Framework preset: `Vite`
- Root directory: `Saathi`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`
- Development command: `npm run dev`

The `vercel.json` file rewrites every path to `/index.html`, which lets React Router handle direct visits and refreshes for `/`, `/dashboard`, `/explorer`, `/prices`, and `/buyers`.

## Deploy From The Vercel Dashboard

1. Import the Git repository into Vercel.
2. Set the project root directory to `Saathi`.
3. Confirm the framework preset is `Vite`.
4. Confirm the build settings:
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add any required environment variables from the local `.env` file in Vercel Project Settings.
6. Deploy.

## Deploy With The Vercel CLI

From this directory:

```bash
cd Saathi
npm install
npm run build
npx vercel
```

For a production deployment:

```bash
npx vercel --prod
```

## Route Verification

After deployment, verify that these URLs load the SAATHI app instead of returning a 404:

- `/`
- `/dashboard`
- `/explorer`
- `/prices`
- `/buyers`

## Notes

- Vite outputs production files to `dist`, which is the configured Vercel output directory.
- Static hashed assets generated under `dist/assets` are automatically optimized by Vercel.
- Security headers are applied to all routes through `vercel.json`.
