# LinkBoard - Your Visual Inspiration Hub

LinkBoard is a sleek, responsive, and highly customizable web application designed for creatives, designers, and anyone who needs a personal space to save and organize visual inspiration. Inspired by Pinterest, it allows you to save image links, categorize them into "boards," and arrange them in various layouts, including a freeform canvas.

## ✨ Core Features

*   **Save & Organize**: Easily save image URLs and organize them with titles, notes, tags, and colors.
*   **Multiple Boards**: Create, rename, and manage multiple boards to keep your inspirations neatly categorized. An "All Boards" view provides a consolidated look at all your saved items.
*   **AI-Powered Assistance**: Use the "Auto-fill with AI" feature to automatically generate a title, notes, tags, and dominant colors for any image, making organization a breeze.
*   **Flexible Viewing Modes**:
    *   **Moodboard**: A classic, responsive masonry grid.
    *   **List**: A compact, detailed view for easy scanning.
    *   **Canvas**: A zoomable, pannable, freeform canvas to arrange your images exactly how you want.
*   **Powerful Filtering**: Instantly search your entire collection by keywords, or filter by specific tags and colors.
*   **Data Portability**: Your data is saved securely in your browser's local storage. You can easily export your entire collection to a JSON file for backup and import it back anytime.
*   **Light & Dark Modes**: A beautiful and consistent experience, day or night.

## 🚀 Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **AI Integration**: [Genkit (Google AI)](https://firebase.google.com/docs/genkit)
*   **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Canvas**: [react-zoom-pan-pinch](https://github.com/prc5/react-zoom-pan-pinch)

## 📦 Getting Started

### Prerequisites

*   Node.js (v18 or newer recommended)
*   npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/linkboard.git
    cd linkboard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    *   This project uses Genkit for its AI features, which requires a Google AI API key.
    *   Rename the `.env.example` file to `.env.local` and add your API key.
    ```env
    # .env.local
    GOOGLE_API_KEY="YOUR_GOOGLE_AI_API_KEY_HERE"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application should now be running at `http://localhost:3000`.

## 🤝 Contributing

Contributions are welcome! If you have ideas for improvements or find a bug, feel free to open an issue or submit a pull request.
