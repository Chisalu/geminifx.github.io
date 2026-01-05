/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "gemini-bg": "#070b0d",
        "gemini-red": "#E6463A",
        "gemini-blue": "#37A7FF",
        "gemini-panel": "rgba(255,255,255,0.03)",
        "gemini-panel-strong": "rgba(0,0,0,0.40)",
        "gemini-text": "#E9EEF2",
        "gemini-sub": "#A6B0B8",
      },
      backgroundImage: {
        "gemini-radial":
          "radial-gradient(1400px 800px at 20% -10%, rgba(230,70,58,0.18), transparent 60%), radial-gradient(1000px 600px at 80% 0%, rgba(55,167,255,0.15), transparent 60%), #070b0d",
      },
      boxShadow: {
        "gemini-red": "0 0 30px rgba(230,70,58,0.45)",
        "gemini-blue": "0 0 30px rgba(55,167,255,0.45)",
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
