# ♛ Chess World: An Immersive Visual Experience

![Chess World Banner](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge) ![Tech Stack](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20Three.js-blue?style=for-the-badge)

**Where strategy meets art.** 
Chess World is a fully interactive, stunningly designed web application that breathes life into the classic game of chess. Built using pure HTML, CSS, Vanilla JavaScript, and rendered with Three.js, it offers a premium, cinematic browser experience.

## ✨ Features

* **Interactive 3D Renderings:** Watch all classic pieces (King, Queen, Rook, Bishop, Knight, Pawn) come to life through dynamic, auto-rotating 3D models.
* **Cinematic Visuals & Animations:** Smooth page transitions with flying piece effects and fluid card-stacking layouts.
* **Custom 3D Animated Cursor:** An intricate floating cursor with orbiting rings, a glowing core, and trailing piece particles that reacts perfectly to user interactions.
* **Interactive Move Demonstrations:** Clicking on any piece opens an animated 2D chessboard showing precisely how that piece moves and captures.
* **Piece Comparison Matrix:** A built-in floating panel system that allows you to pit any two pieces against each other to compare their stats (Value, Range, Directions, Speed, Role).
* **Thematic Design System:** Swap seamlessly between 3 beautiful color palettes:
  * 🌌 **Dark Mode** (Onyx & Gold)
  * 🏛 **Light Mode** (Marble & Amber)
  * 🌅 **Balanced Mode** (Pastel Sunset)
* **Gamified Achievement System:** Receive elegant toast notifications as you explore the site, open demos, try different themes, and uncover all features.
* **100% Responsive Design:** Impeccably scales from small mobile touchscreens all the way up to ultra-wide 4K desktop monitors.

## 🛠️ Technology Stack

* **Structure:** HTML5
* **Styling:** CSS3 (Advanced custom variables, Grid, Flexbox, Media queries, Keyframe animations)
* **Logic:** Vanilla JavaScript (ES5/ES6 Patterns, Intersectional Observers, Modular Architecture)
* **3D Rendering:** [Three.js (r128)](https://threejs.org/) for beautiful, lightweight WebGL canvas rendering.

## 🚀 How to Run Locally

You don't need Node.js or any build tools to run this application!

1. **Clone the repository:**
   ```bash
2. **Open the project:**
   Simply navigate to the folder and open `index.html` in your favorite modern web browser (Chrome, Firefox, Safari, Edge).
   
   *(Note: For the absolute best 3D performance and to avoid any CORS warnings with local assets if you add textures later, running a simple local server like the VS Code "Live Server" extension is recommended).*

## 📂 Project Structure

* `index.html` - The structural backbone of the app and dynamic page containers.
* `style.css` - The expansive styling document bridging themes, typography, layout, and visual FX.
* `app.js` - Global orchestration, navigation transitions, and theme management.
* `pieces.js` - Data handling and DOM injection for the rich piece display cards.
* `moveDemo.js` - Logic mapping and DOM drawing for the interactive chessboard popups.
* `cursorFx.js` - The WebGL and mathematics powering the immersive 3D custom mouse cursor.
* `visuals.js` - Logic for the cinematic page transitions, piece comparison panel, and gamified achievement system. 

---
*Created with a passion for web development and a love for the timeless game of Chess.*
