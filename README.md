# Music Player

A music player built with HTML, CSS and JavaScript.

- Play, pause, next, previous
- Song title, artist and duration (current time and total)
- Progress bar (click or drag to seek) and volume control with mute
- Bonus: playlist (click any song) and autoplay (next song starts automatically; toggle in the player)
- Keyboard: Space play/pause, Left/Right seek, Up/Down volume, N next, P previous, M mute

## Run
Open `index.html` in a browser, then press play.

## Use your own songs
1. Put your mp3 files in the `audio/` folder.
2. Edit the `tracks` list at the top of `script.js`:
   `{ title: 'My Song', artist: 'My Artist', src: 'audio/my-song.mp3', hue: 200 }`
   (`hue` is 0-360 and changes the accent color.)

The three included tracks are short original demo tunes generated for testing.

## Deploy
- Netlify: drag this folder onto app.netlify.com/drop
- GitHub Pages: upload files to a repo, then Settings > Pages > Deploy from branch > main
