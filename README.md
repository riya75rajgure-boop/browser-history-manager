# Browser History Manager

A responsive browser-history simulation mini project demonstrating a **Doubly Linked List**. Built with plain HTML, CSS, and JavaScript so it can be hosted directly on GitHub Pages or Vercel.

## Features
- Visit a URL (adds `https://` if no protocol is entered)
- Back and forward navigation
- View history with timestamps
- Select a page from the history
- Delete individual entries
- Clear the complete history
- Responsive layout for mobile and desktop
- New visits remove any forward history, matching typical browser behavior

## Data structure
Each `HistoryNode` contains a URL, timestamp, and `prev` / `next` pointers. The `BrowserHistory` class maintains `head`, `tail`, and `current` references. Navigation follows the links in either direction; removal reconnects neighboring nodes.

## Run locally
Open `index.html` in a browser. No build step or package installation is required.

## Deploy on Vercel
1. Import this GitHub repository in Vercel.
2. Choose **Other** as the framework preset if prompted.
3. Leave build command and output directory blank/default; the site is static.
4. Deploy.

## Project note
This is an educational simulation, not a browser extension and does not actually navigate the current browser tab. It models history within the page.
