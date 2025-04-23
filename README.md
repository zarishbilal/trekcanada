# Trek Canada Trail Explorer

A modern Next.js application showcasing hiking trails across Canada. Users can search for trails, view trail details with maps and photos, save favorite trails, and get AI-generated hiking insights.

## Key Features

- Browse and search trails using ArcGIS and Google Places data.
- Interactive map view powered by Mapbox.
- View detailed trail information including distance, duration, difficulty, and seasons.
- Google Places integration for trail photos and reviews.
- AI-generated insights (weather, wildlife, packing list) via Google Gemini or OpenAI.
- Firebase Authentication (Google Sign-In) for user accounts.
- Firestore-powered **Favorites**: sign in and save your favorite trails.
- Responsive UI built with Tailwind CSS.

Right now this app has 1349 trail information.
It only covers the land from these co ordinates:
"xmin": -12943494.6058741,
"ymin": 6569815.87936587,
"xmax": -12796365.6213477,
"ymax": 6867369.05726533,
Which is mostly Alberta. This app will go through further updates to cover all Canada soon.

## Tech Stack

- Next.js (App Router) + React
- Tailwind CSS for utility-first styling
- Firebase Auth & Firestore for user management and data
- Mapbox GL for dynamic trail maps
- Google Places API for photos & reviews
- Google Gemini / OpenAI for AI insights
- Heroicons for icons

## Getting Started

### Prerequisites

- Node.js v16+ and npm
- Firebase project with Authentication (Google) and Firestore enabled
- Google Cloud project with Generative Language API (Gemini) enabled (optional)
- Google Places API Key
- Mapbox Access Token

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/trekcanada.git
   cd trekcanada
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file at the project root:

   ```ini
   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...

   # Google APIs
   NEXT_PUBLIC_MAPBOX_TOKEN=...
   NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=...

   # Optional AI (OpenAI)
   OPENAI_API_KEY=...
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view.

### Building for Production

```bash
npm run build
npm start
```

## Folder Structure

```
/ app/              # Next.js App Router pages & layouts
/ components/       # Reusable UI components
/ app/_utils/       # Firebase & Auth context, Favorites API
/ services/         # External API clients (trails, googlePlaces)
/ public/           # Static assets (images, icons)
/ styles/           # Custom CSS modules
README.md           # Project overview and instructions
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -m "feat: add feature"`)
4. Push to the branch (`git push origin feat/your-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
