---
title: "Projects - Jonathan Roemer"
url: https://pid1.space/projects
description: "Personal projects spanning AI tooling, full-stack web apps, ham radio, and cyber-physical hardware."
---

# Projects

## Cygnus Strategy

Made by my company, [Cygnus Strategy](https://cygnusstrategy.com).

### [Pocket Shack](https://pocketshack.cygnusstrategy.com)

The AllStarLink network in your pocket. Talk and listen on amateur radio repeaters and hubs around the world from your iPhone, Mac or Apple Watch: listening is free, and Pro adds push to talk.

pocketshack.cygnusstrategy.com

### [Small Hours](https://smallhours.cygnusstrategy.com)

A simple, private baby log made for the middle of the night. Feeds, sleep, diapers, pumping, medicine and growth in a tap, both parents log to the same history, and every log is free.

smallhours.cygnusstrategy.com

### [Ground Truth](https://groundtruth.cygnusstrategy.com)

Is it your Wi-Fi, your router or your provider? Ground Truth finds out, room by room and over days, before you buy a router you may not need, and when the problem is your provider, it helps you prove it.

groundtruth.cygnusstrategy.com

### [Callboard](https://callboard.club)

One place to find, run and grow nets, however people join: repeater, simplex, HF, GMRS, AllStarLink, EchoLink or DMR. Net control logs check-ins from a keyboard-first console, and anyone can open a net's live page to see if they're logged, no account needed.

callboard.club

### [sadr](https://github.com/Cygnus-Strategy/sadr)

A dark factory for software, named for the star at the heart of Cygnus. On a schedule, with the lights off, it builds the issues you label `sadr`, keeps dependencies and CI current behind a week-long supply-chain cooldown, and fixes what the scanners find. Every change is tested and arrives as a pull request. Nothing merges until you say so.

github.com/Cygnus-Strategy/sadr

### [Albireo](https://albireo.cygnusstrategy.com)

Free live solar data and HF band conditions for apps and AI agents, as an API and MCP server, computed from NOAA and ITU data. No key needed, and the band conditions card on this site runs on it.

albireo.cygnusstrategy.com

## Systems

### [rally](https://github.com/pid1/rally)

Your family command center, self-hosted. One shared calendar, to-dos, a shopping list, dinner plans, packing lists and an emergency-kit inventory, plus an AI-written briefing every morning. Claude can read and change nearly all of it through an MCP connector, and every call lands in an audit log under whoever asked.

github.com/pid1/rally

### [tsundoku](https://github.com/pid1/tsundoku)

積ん読: buying books and letting them pile up unread. This is somewhere to pile them. Drop in an EPUB or CBZ and it reads the title and cover, serves the library to your e-reader over OPDS 2.0, syncs your place with KOReader, and has a browser reader that picks up where KOReader left off. Private accounts, one Cloudflare Worker, free tier.

github.com/pid1/tsundoku

### [kosync-conformance](https://github.com/pid1/kosync-conformance)

KOReader's sync protocol went eight years without a spec. This is one, with every claim cited to source, plus a zero-dependency verifier that tells you where your server disagrees.

github.com/pid1/kosync-conformance

### [scram](https://github.com/pid1/scram)

Cloudflare has no hard spending limit. This is the missing kill switch: it prices your account's usage every 15 minutes and, past a line you set, cuts every Worker off the internet before the bill runs away. It never touches code or data, and one call puts it all back.

github.com/pid1/scram

### [rx](https://github.com/pid1/rx)

Comms for when the infrastructure isn't. One idempotent script turns a ClockworkPi uConsole into a field station: rxd as its receiver, a Meshtastic node with offline maps, and GPS-disciplined time that holds without a network.

github.com/pid1/rx

### [rxd](https://github.com/pid1/rxd)

A whole receive station in a fifth of a Raspberry Pi core. One RTL-SDR behind an HTTP API, with its own JS8 decoder and WSPR via wsprd: it picks the band from conditions and the hour, reports WSPR spots, sets its own gain, and maps every station it hears on offline tiles. Receive only. A phone-sized web UI and a terminal UI come with it, or bring your own client.

github.com/pid1/rxd

### [reveille](https://github.com/pid1/reveille)

Your morning briefing when the network is on fire. One tiny plaintext page with no JavaScript, rebuilt before dawn: weather alerts, grid status, local police and fire feeds, and incidents within 25 miles, topped by a short AI summary that just says NSTR on quiet days and pushes to your phone when it isn't.

github.com/pid1/reveille

### [tattoo](https://github.com/pid1/tattoo)

The evening counterpart to reveille. Watches a curated set of feeds and YouTube channels, reads the full article or transcript behind each new item, and has Claude keep only what matches what you care about. What survives becomes a nightly briefing, every point linked to the paragraph or timestamp it came from. On a quiet day your phone hears nothing.

github.com/pid1/tattoo

## Applications and tools

### leverage

Exploits Kalshi mispricing for profit. The math is sound. The vibes are immaculate.

### [onhold](https://github.com/pid1/onhold)

Sits on hold so you don't. Brief it from Claude and an AI voice agent makes the call for you: it says up front that it's an AI calling on your behalf, asks your questions, and writes down the answers. Nothing dials until you approve the exact call, and the report waits for Claude when it hangs up. Runs on Cloudflare's free tier with ElevenLabs and Twilio.

github.com/pid1/onhold

### [pineapple](https://github.com/pid1/pineapple)

A sweet and tart resume generator. Write your resume in Markdown and get a clean single-column PDF that ATS and AI screeners parse properly, with an optional video intro card and a writing guide your AI assistant can follow to draft it.

github.com/pid1/pineapple

## Hardware

### [loam](https://github.com/pid1/loam)

A plant that pings your phone when it's thirsty. CircuitPython on an Adafruit QT Py ESP32-S3 with a capacitive soil sensor, no soldering: it wakes once a day, sends a Pushover alert only if the soil is dry, and goes back to deep sleep for months on one battery.

github.com/pid1/loam

## Smaller things

### [kunnandi](https://github.com/pid1/kunnandi)

From Old Norse for "knowledge." A living repository of dictum: short essays on decisions, complexity, leadership, quiet software and AI, revised in place instead of blogged once.

github.com/pid1/kunnandi

### [recipes](https://github.com/pid1/recipes)

A family cookbook in version control, so every pecan pie has a commit history. About fifty recipes in one Markdown file, typeset into a PDF with pandoc and LaTeX and published as a new release on every push.

github.com/pid1/recipes

## Inactive

### [textmaxxing](https://github.com/pid1/textmaxxing)

Your SMS grindset coach. Touching grass optional. A small webhook that puts Claude behind a Twilio number, keeps replies text-sized, remembers the last 20 messages, and can be set to answer only your number.

github.com/pid1/textmaxxing

### [promptchad](https://github.com/pid1/promptchad)

Which prompt lifts more? Runs two prompt variants against OpenAI, Anthropic and Gemini and shows the answers side by side, in a small Flask web UI with a CLI alongside.

github.com/pid1/promptchad

### [test-sec-flags](https://github.com/pid1/test-sec-flags)

Would turning on PIE, full RELRO and friends make every Arch package slower? These scripts benchmarked xz, UnixBench and ffmpeg under eight hardening-flag combinations so volunteers could compare machines. In October 2016 Arch announced it would turn the flags on.

github.com/pid1/test-sec-flags

### [voxthief](https://github.com/pid1/voxthief)

Steals every word off the airwaves. Point it at an RTL-SDR or a radio plugged into your sound card and it transcribes each transmission locally with whisper.cpp, keeps the transcripts in SQLite, and pushes keyword matches to your phone. Terminal UI, or headless on a Raspberry Pi.

github.com/pid1/voxthief

### [lgtm](https://github.com/pid1/lgtm)

Looks good to me. Approve Claude Code from the couch: a Miyoo Mini Plus chimes when an agent wants permission, shows what it wants, why, and anything risky, and takes an A or a B. If the handheld is off, the prompt falls back to the computer that asked, never to yes.

github.com/pid1/lgtm

### [hotslice](https://github.com/pid1/hotslice)

A hot take, one slice at a time. Turn Markdown into a single self-contained HTML slide deck, with a couple hundred themes, from the CLI, a web UI, or an MCP server.

github.com/pid1/hotslice

### [puffin](https://github.com/pid1/puffin)

A baby tracker for the early days, when nobody can remember which side was last. Logs feedings with a live breastfeeding timer, bottles, diapers, meds and temperatures for more than one kid, and exports to CSV, JSON or PDF. One container, one SQLite file.

github.com/pid1/puffin

### [yeet](https://github.com/pid1/yeet)

For when you just need to throw a file at someone. One curl uploads it and hands back a short link like golden-phoenix. Files expire after 7 days. Runs on Cloudflare Workers + R2.

github.com/pid1/yeet

### [twobraincells](https://github.com/pid1/twobraincells)

A minimally viable CSS library for text-first, accessible, resource intelligent websites. One small stylesheet, no build step, and optional CSS-only snowflakes for December.

github.com/pid1/twobraincells

### [patrIoT](https://github.com/pid1/patrIoT)

The Internet of Things, but make it patriotic. Press a button on an Adafruit MagTag and it lights up red, white and blue, plays the opening of the Star-Spangled Banner, and pulls down an AI-drawn bald eagle, Lincoln or Saturn V onto the e-ink screen.

github.com/pid1/patrIoT

### [fridgefriend](https://github.com/pid1/fridgefriend)

A virtual pet for your fridge. A CircuitPython Tamagotchi for the Adafruit MagTag e-ink display: four buttons play with, pet, feed or tuck in a chibi dino, each with its own tune. It deep-sleeps between visits with its face still on screen, so it lives on battery, and it looks sleepy after 6 PM.

github.com/pid1/fridgefriend

### [knee-deep-in-the-crib](https://github.com/pid1/knee-deep-in-the-crib)

A baby's night light that plays DOOM. Custom firmware for the Nanit Light & Sound: E1M1 as a chiptune with the lamp flashing red on the beat, "dOOM" on the clock, and a shotgun-and-BFG interlude between loops. Flashes over USB-C with no soldering, after backing up the stock firmware.

github.com/pid1/knee-deep-in-the-crib

### [duck](https://github.com/pid1/duck)

A URL shortener with no server, no database and no tracking. A small Python script writes one tiny HTML redirect per link into your static site, ready to push to GitHub Pages.

github.com/pid1/duck

### [whelp](https://github.com/pid1/whelp)

The Mythical Mammal-Month. Nine women can't make a baby in one month, and 22 elephants can't make a calf in one either: a one-page site that applies Brooks's Law to 43 mammals using their real gestation periods. Live at [brookszoo.pid1.space](https://brookszoo.pid1.space/).

github.com/pid1/whelp

### [stayinalive](https://github.com/pid1/stayinalive)

Conway's Game of Life with disco visuals in your terminal, set to a beat in BPM. It keeps your Mac awake with caffeinate, and when the board dies or settles into still lifes and blinkers it reseeds itself, so the party never stops.

github.com/pid1/stayinalive

### [strangerduino](https://github.com/pid1/strangerduino)

The Upside Down, ported to Arduino. Drives a 100-bulb WS2811 string with FastLED and spells HELP, then RUN, one red bulb at a time, with a burst of Christmas colors in between.

github.com/pid1/strangerduino

### [bonk](https://github.com/pid1/bonk)

Turns your Windows PC into a 2004 DVD player on standby. A bouncing DVD logo screensaver that changes color on every wall hit and runs one logo per monitor, so you can watch several of them miss the corner at once.

github.com/pid1/bonk

### [kill complexity](https://killcomplexity.com)

Cytracom's April Fools 2026 Playdate game.

killcomplexity.com
