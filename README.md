# Cambly Transcript Copier

<img src="icons/icon_128.png" alt="Cambly Transcript Copier" width="64" />

A Chrome extension that extracts your Cambly lesson transcript and copies it to the clipboard — pre-loaded with a revision prompt — ready to paste into any AI chat (Claude, ChatGPT, Gemini, etc.).

## What it does

After a Cambly lesson, open the past-lesson page and click **Copy Transcript**. The extension grabs everything said in the lesson, prepends a detailed English revision prompt, and copies the whole thing to your clipboard. Paste it into any AI chat to get native-level corrections on your side of the conversation only.

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select the project folder

## Usage

1. Go to a past lesson on Cambly (`cambly.com/en/student/progress/past-lesson/...`)
2. Click the **Copy Transcript** button that appears on the page
3. Paste into any AI chat (Claude, ChatGPT, Gemini, etc.)

## Revision prompt

The copied text includes a structured prompt that instructs the AI to:

- Revise only **your statements** (lines labeled "Me")
- Preserve the full meaning — no summarizing or skipping
- Correct grammar and naturalness to match how native speakers actually talk
- Output each correction with the original, revised version, and explanation

## License

MIT
