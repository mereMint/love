How to Customize Themes:

1. Open the folder for the theme you want to change (e.g., 'christmas', 'valentine', 'default').
2. BOTTOM DECORATION:
   - Place an image named 'bottom.png' in the folder. 
   - It will automatically appear at the bottom of the page.
   - Recommended size: 1920x150px (transparent PNG).

3. FALLING PARTICLES:
   - OPTION A (Easy): Name your images `falling_effect_1.png`, `falling_effect_2.png`, etc.
     - Then in `assets/config.js`, set `falling_effect_count: 5` (or however many you have).
   - OPTION B (Custom): List specific filenames in `config.js` under `particles: [...]`.

4. BACKGROUND IMAGE:
   - Place an image named `background.png` in the theme folder.
   - It will automatically become the page background (fixed position).

Example config.js:
window.LOVE_CONFIG = {
    // ...
    themes: {
        christmas: {
            particles: ['snowflake.png', 'tree.png', '❄️'] 
        }
    }
}
