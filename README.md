<div style="text-decoration: none; color: inherit; display: flex; align-items: center;">

  <a href="https://mixura-saves.vercel.app">
    <img src="./mixura-assets/" alt="Mixura Icon" style="width:50px; height:50px; vertical-align: middle; margin-right: 5px;">
  </a>

  <span style="font-size:50px; font-weight: bold; color:black;">
    Mixura - Your Idea Organizer
  </span>
</div>
Mixura is a simple, personal space to save and organize images. It's like your own private Pinterest for creative inspiration, now with AI help to make organizing even easier.





<img src="./mixura-assets/walkt.gif" alt="Mixura Logo" style="width: 100%; max-width: 800px; margin: 20px 0;">


## ✨ What Mixura Does

*   **Save & Sort**: Easily save picture links. Add titles, notes, tags, and even colors to keep them neat.
*   **Lots of Boards**: Make different "boards" to group your inspirations. There's also an "All Boards" view to see everything at once.
*   **Smart Help**: Use "Auto-fill with AI" to automatically add a title, notes, tags, and main colors for any picture. It makes organizing super easy!
*   **Different Ways to View**:
    *   **Moodboard**: A classic grid view that adjusts to your screen.
    *   **List**: A compact, detailed list for quick scanning.
    *   **Canvas**: A flexible, zoomable space where you can arrange pictures exactly how you want.
*   **Easy Search**: Quickly find anything you've saved by searching words, tags, or colors.
*   **Your Data, Your Control**: All your saved items are stored on your computer. You can easily save (export) your whole collection to a file and bring it back (import) whenever you need.
*   **Light & Dark Views**: Looks good day or night.

## 📦 Getting Started

### Prerequisites

*   Node.js (v18 or newer recommended)
*   npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/mixura.git
    cd mixura
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```


3.  **Set Up AI Integration**
    *   Create a new `.env.local` file in the root directory.
    *   Get your API key from: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
    ```env
    # .env.local
    GEMINI_API_KEY="YOUR_AI_API_KEY_HERE"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application should now be running at `http://localhost:3000`.



## 🚀 Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **AI Integration**: [Genkit (Google AI)](https://firebase.google.com/docs/genkit)
*   **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Canvas**: [react-zoom-pan-pinch](https://github.com/prc5/react-zoom-pan-pinch)



## 🤝 Contributing

Contributions are welcome! If you have ideas for improvements or find a bug, feel free to open an issue or submit a pull request.
