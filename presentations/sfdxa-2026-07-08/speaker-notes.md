# Speaker Notes — SFDXA Talk (Zoom)

Full script-grade notes. Read through it before the call. Same notes also
live in `index.html` (press `S` while presenting for Reveal's speaker
view), but the in-deck versions are condensed — this file is the long-form
prep.

This is a **Zoom talk to a DX club** — the South Florida DX Association.
Two calibrations to keep in mind the whole way through:

1. **They chase DX.** Lead every feature with the DX payoff — the ATNO, the
   pileup, the gray-line, the honor roll. POTA and EmComm are side dishes.
2. **You're on Zoom.** "Hands up" becomes "type it in the chat." Share the
   browser _window_, keep the deck and the live site as tabs in that one
   window, and never switch windows while sharing.

Personal placeholders in `[BRACKETS]` — swap them with your own details
before the call.

---

## Slide 1 — Title (~30 sec)

**The goal of this slide:** establish who you are and what they're in for,
no more.

**Sample opening:**

> "Thanks for having me tonight. I'm Chris, K0CJH, [LICENSED SINCE YEAR],
> [LOCATION / WHERE YOU OPERATE FROM]. I want to spend the next 25 minutes
> or so on a project called OpenHamClock — what it is, what it does for a
> DXer specifically, and how you can run it on whatever you've already got.
> Then we'll save time for questions."

**Don't:** read the title off the slide. Don't apologize for technical
problems before they happen. Don't open with "so…"

**Do (Zoom version):** look at the camera lens, not the gallery, for the
first ten seconds. Ask people to drop their callsign in the chat as you
start — it warms the room up and gives you names to use later.

**Transition into slide 2:**

> "Before I show you any of it, the elevator-pitch version."

---

## Slide 2 — One-breath pitch (~1 min)

**The goal:** give the audience a frame so the rest of the talk lands. Don't
read the bullets — _talk through_ them.

**Sample line:**

> "OpenHamClock is the screen you wish was always running in your shack. DX
> spots, DXpeditions, propagation, PSKReporter, rig control — all in one
> browser tab instead of eight."

**Read the room — chat check, don't dwell:**

- "Type in the chat — who has DX Heat or a cluster page open right now?"
- "Who has VOACAP online bookmarked?"
- "Right. That's the problem this solves."

**The point to land:** it's free, open source, runs in any browser, and you
can be using it ninety seconds from now.

**Transition into slide 3:**

> "Before I show you anything new, I want to acknowledge where the idea
> came from. This isn't a slide I'd skip."

---

## Slide 3 — Dedication to WB0OEW (~1 min)

**The most important slide on a human level.** Slow down. Don't rush this.

**Sample:**

> "Anyone who's been licensed for more than a few years probably knows the
> name Elwood Downey, WB0OEW. He built the original HamClock — the little
> dashboard you've seen mounted on Raspberry Pis in shacks all over the
> place. He became a Silent Key in early 2026."
>
> "HamClock ran on Pis, on tablets, on old laptops, on those cheap 800x480
> screens. It was honest, it was useful, it was beautifully crafted. And it
> was free."
>
> "OpenHamClock is _not_ a fork of his code. It's a ground-up rewrite in
> modern web technology — but the goal is identical. Give an operator one
> screen that tells them what's happening in the world. The dedication in
> the LICENSE file is real. This project exists because his did."

Pause. Let it land. Then move on.

**Don't:** make it longer than a minute. The respect is in the
acknowledgment, not the length.

**Transition into slide 4:**

> "So — what does this thing actually look like?"

---

## Slide 4 — The big picture (~1.5 min)

**The goal:** orient them spatially before you start naming features.

**Sample:**

> "The default layout is a world map with everything else floating on top of
> it. Your callsign and the time are up top. Solar weather — SFI, K-index,
> sunspot number — runs across the header. Your DX cluster, the satellites,
> the activations, the weather, all live in dockable panels around the map."
>
> "And it's _dockable_ in a real sense. Panels tear off, redock, resize.
> You can save a layout for casual monitoring, another for contest weekend,
> another for chasing a DXpedition — one click to switch."

**Transition:**

> "Let's go around the map and the panels one at a time."

---

## Slide 5 — The map (~1.5 min)

**The goal:** sell the map as the _application_, not as a backdrop — and
say the magic words: **gray-line**. This room knows exactly what that means.

**Sample:**

> "Almost everything in OpenHamClock happens on this map. It's a real
> Leaflet world map — pan, zoom, projection of your choice. The day/night
> terminator updates in real time — and you all know why the terminator
> matters. When the gray line is crossing that entity you need, you can
> _see_ it, live, next to the spots."
>
> "You pick where you are — your **DE** — and where you're working — your
> **DX** — and instantly you have distance, bearing, gridsquare, sunrise
> and sunset at both ends. Click a DX cluster spot and it draws the
> great-circle path right there on the map."

**Promise to deliver later:**

> "I'll show you all of this live in a few minutes."

**Transition:**

> "What's _on_ that map? Let's start with the cluster."

---

## Slide 6 — DX cluster + PSKReporter (~2 min)

**The goal:** convince a room full of cluster power users that this is the
cluster interface they've been waiting for. This crowd has STRONG opinions
about cluster software — lean into that.

**Sample:**

> "The DX cluster has been around since the late '80s — and most cluster
> interfaces still look like it. OHC's cluster is the version you wish
> you'd had all along."
>
> "Filter by band, by mode, by CQ zone, by your own watchlist. Maintain an
> exclude list for calls or prefixes you never want to see again.
> Thirty-minute retention, so you see the _trend_ on a band, not just
> whoever spotted last."

**The new stuff — hit each one, they shipped since spring:**

> "New since spring, four things this room will actually use. There's a
> real **mode column** now, plus sorting by time, frequency, or call. A
> one-click **'Show only DXpeditions'** filter — it cross-references the
> DXpedition calendar, so the list collapses to just the ATNOs. A
> **contest filter**, for taming the firehose on contest weekends when
> you're trying to find the one rare one in a wall of spots. And you can
> now **send a spot straight from the panel** — no separate telnet
> session."

**Then PSKReporter:**

> "PSKReporter runs alongside. Real-time, via MQTT — not the old
> five-minute polling. Who's hearing you, who you're hearing. 'MySpots'
> lights up the moment your callsign hits the cluster."

**Transition:**

> "Now — about where those spots come from. This is the newest thing I'm
> showing tonight."

---

## Slide 7 — OHC Cluster: our own node (~2 min) — NEW

**The goal:** tell the story. This shipped THIS WEEK and it's a genuinely
good yarn for a DX club — they all have opinions about cluster nodes.

**Sample:**

> "OpenHamClock now runs its **own DX cluster node**. Here's the story: the
> hosted site used to connect to public DXSpider nodes, like everyone
> else. And when an upstream node had a bad day, we had a bad day —
> reconnect storms, login problems, the works. At one point a node sysop
> suggested — maybe with some exasperation — that we should go build our
> own cluster."
>
> _(beat)_
>
> "OK. Done."
>
> "OHC Cluster ingests the Reverse Beacon Network skimmer feeds — CW and
> RTTY on one pipe, FT8 and FT4 on another — plus human spots. And it
> serves a **classic telnet cluster interface**, which means you don't
> need OpenHamClock to use it. You can point your regular logging program
> at it like any other node."
>
> "And there's a nice touch — the telnet login banner is dedicated to the
> memory of Elwood, WB0OEW."

**If asked for the telnet address:** it's brand new — check
openhamclock.com / the GitHub README for the current public host and port.

**Transition:**

> "Two more new things, small but pure DXer workflow."

---

## Slide 8 — Chasing tools (~1.5 min) — NEW

**The goal:** two quick quality-of-life features that map directly onto the
DX reflexes everyone in this room has.

**The callsign popup:**

> "You know the reflex — a call you don't recognize hits the cluster, and
> you go 'who is this guy?' and open QRZ in another tab. Now you just
> click the call — in the cluster panel or on the map — and you get an
> inline card: name, QTH, grid, country, and — the part I like —
> **local time at his end**. Because half of deciding whether to sit in
> the pileup is knowing if the operator is about to go to bed. One more
> click takes you to QRZ or HamQTH if you want the full page."

**DX target lookup + honest local time:**

> "And the DX target now takes a callsign directly — type a call, and the
> crosshair, bearing, and distance snap to his QTH. Under the hood the DX
> local time uses real IANA timezones now instead of longitude math —
> sounds pedantic until you look up somewhere like Manila or Perth, where
> sun time and civil time disagree by a lot."

**Transition:**

> "OK — the part every DXer actually cares about. Propagation."

---

## Slide 9 — Propagation + VOACAP (~2 min)

**The goal:** establish OHC's propagation as _actually live_ — and land the
FT8 fix, which is the technical wow-moment of the talk.

**Sample:**

> "Most propagation tools you've used are effectively screenshots. OHC runs
> the ITU-R P.533 engine — the same physics VOACAP is built on — itself,
> every ten minutes. The colored band overlay on the map isn't last week's
> prediction. It's generated for _your_ QTH, _now_. Real-time indices —
> SFI, K, A, sunspots — as gauges. Solar imagery from SDO. X-ray flux so
> you can see the flare before the band drops out."

**The FT8 fix — slow down, this is the wow moment:**

> "Two things shipped this month that I want to flag. First: if you ever
> looked at an FT8 propagation prediction anywhere and thought 'that band
> is NOT closed, I'm watching people work Japan on it' — you were right.
> Traditionally, tools run the engine at SSB listening thresholds and then
> sort of… sprinkle an FT8 bonus on top afterwards. The problem is that a
> bonus can't reopen a band the engine already scored at zero — and a band
> that's dead for SSB but wide open for FT8 is _exactly where FT8 earns
> its keep_. OHC now runs the engine at each mode's real decode threshold
> — FT8 at minus 19 dB, WSPR at minus 26, CW at plus 5. Real example:
> Atlanta to Tokyo, 15 meters, noon — zero percent on SSB, sixty-seven on
> FT8. That matches what you actually hear."

**Real-time Kp:**

> "Second: the Kp index used to update every three hours, because that's
> the product most sites use. It now follows NOAA's one-minute estimate —
> so when a geomagnetic storm hits, the console reacts in minutes. When
> the bands go weird, you'll know _why_ right away."

**Transition:**

> "Beyond the DX chase proper, the same map covers the portable world."

---

## Slide 10 — POTA / SOTA / WWFF / WWBOTA (~1.5 min)

**The goal:** quick breadth slide. Don't dwell — this is a DX club — but
don't skip it either; every club has chasers.

**Sample:**

> "Same map, four kinds of activator markers — POTA, SOTA, WWFF, WWBOTA.
> Click any of them: reference, callsign, frequency, mode, time. Same
> filters and same click-to-tune as the DX cluster. And a rare WWFF or
> POTA entity counts for the chase too."

**Chat check:**

> "Anyone here chase parks between openings? Type it in the chat."

**The WWBOTA aside — usually lands, even on Zoom:**

> "WWBOTA is the new one — _bunkers_. Old military and civil defense
> relics. Anyone activated a bunker yet?"

**Bonus feature to mention:**

> "Audio alerts on a band you're watching — you can be in the kitchen and
> still know when someone shows up on 17 meters."

**Transition:**

> "Satellites — same story, same map."

---

## Slide 11 — Satellites (~1.5 min)

**The goal:** cover quickly; frame as DX. Trim to 45 seconds if the clock
is tight.

**Sample:**

> "Satellites are on the same map as everything else. Live SGP4 tracking,
> pass predictions for your QTH sorted by next AOS, footprint and ground
> track drawn right on the map. And grids on the birds are real DX —
> there are DXCC entities that mostly get worked on satellites these
> days."
>
> "Pick from the active catalog — AO-91, SO-50, ISS, RS-44, FO-29, the
> QO-100 geostationary footprint. Overlay several at once, next to your
> DX spots."

**Credibility point if asked about reliability:**

> "The TLE pipeline pulls from three independent sources now — CelesTrak,
> AMSAT, SatNOGS — so the birds don't vanish when one upstream has a bad
> day."

**Transition:**

> "All right — let's talk about your radio."

---

## Slide 12 — Rig control + WSJT-X + N3FJP (~2 min)

**The goal:** the power-user payoff. For a DX club, frame it as **pileup
speed**.

**Sample:**

> "Click a spot. Your radio tunes. That's the whole pitch — and in a
> pileup race, it's the difference. The spot appears, you click, you're
> on frequency with the right mode while the other guy is still spinning
> his VFO."
>
> "Under the hood there's a plugin layer called the Rig Bridge. Direct
> USB CAT with no hamlib. rigctld if you already run it. flrig. SmartSDR
> for the Flexes. TCI. Even RTL-SDR for receive-only."

**Models — light name-drop, only if asked:**

> "Yaesu FT-991A/891/710/DX10/5000, Kenwood TS-890/590/2000/480, Icom
> 7300/7610/9700/705/7851, Elecraft K3/K4, FlexRadio, SunSDR,
> Hermes-Lite 2, ANAN."

**The reverse direction:**

> "WSJT-X, JTDX, MSHV, JS8Call — decodes stream onto the map in real
> time. You can literally _watch_ an opening build toward the entity you
> need before you ever transmit."

**N3FJP — new this cycle:**

> "And if you log with N3FJP — that's now built in. Configure it from
> Settings, and your logged QSOs appear on the map. It even plots the
> call you're _currently typing_ in the entry window as a live preview,
> so you see the path before you commit the QSO."

**Transition:**

> "The project moves fast — here's a 60-second sampler of everything else
> that's shipped since spring."

---

## Slide 13 — What else since spring (~1 min) — NEW

**The goal:** rapid-fire velocity slide. Don't explain each item — the
_meta-point_ is the point.

**Sample:**

> "Quick sampler, ten seconds each: a live aircraft layer and a worldwide
> ATC-sector overlay — fun to match what you hear on HF to who owns the
> airspace. Map style rotation for wall displays. Sixteen languages now —
> Simplified Chinese just joined. A full screen-reader accessibility pass,
> including a text view of the entire map. The Windows install got
> overhauled — one-line PowerShell that actually works. And self-hosters
> now get the real propagation engine in local builds."

**The meta-point — land this:**

> "The reason I show this slide: this project ships a release drop every
> month, and the two headline fixes in July — the FT8 predictions and the
> real-time Kp — both started as users emailing 'this looks wrong.' If
> you find something wrong, tell us. It will probably be fixed in the
> next drop with your callsign in the release notes."

**Transition:**

> "All right — enough slides. Let me show you the actual thing."

---

## Slide 14 — LIVE DEMO (~5 min)

**The heart of the talk.** If only one part of the deck has to land, it's
this one.

**How the slide works:**

OpenHamClock blocks iframe embedding on purpose, so the slide is a
big-button "open the live site" treatment, not an embed. Press `L` from
the slide (or click the button) and the live site opens in a new tab.

**Zoom mechanics — this is the part to rehearse:**

- You are sharing the **browser window**. The deck and openhamclock.com
  are **tabs in that same window**. Switch tabs (`Cmd+Option+→` /
  `Ctrl+Tab`), never windows.
- **Invite the audience to follow along** — "openhamclock.com is live
  right now, open it yourself and click around while I talk." On Zoom
  this works beautifully; half the room will be playing with it during
  Q&A.
- If your connection hiccups, keep talking over the pre-loaded tab.

**The DX-flavored walk — practice it once before the call:**

1. **The map with the terminator.** Point at the gray line. "That's right
   now — and you can see who's sitting on it."
2. **Click a DX cluster spot** on another continent. The great-circle
   path draws. Distance, bearing.
3. **Click the callsign itself.** The new info popup — name, country,
   grid, _local time at the DX end_.
4. **"Show only DXpeditions" filter.** Watch the list collapse to ATNOs.
5. **Show the send-a-spot button.** Show it, don't send one.
6. **PSKReporter pane.** MySpots / TX / RX tabs.
7. **Propagation panel: flip SSB → FT8.** Watch bands reopen. This is the
   money moment for this room — narrate it: "same path, same hour, honest
   FT8 physics."
8. **Space weather pane.** Real-time Kp. Aurora overlay if K is elevated.

**Safety rules — read these to yourself before the call:**

- **Don't live-edit settings during the demo.** Stay in defaults.
- **Don't try the rig-control demo** unless your shack rig is reachable
  and you rehearsed it today.
- **If the site is slow, narrate over it.** Don't refresh repeatedly on
  camera.

**Transition out of the demo:**

> "I could click around in this for an hour, but let me come back to the
> deck so you don't leave without the URLs."

---

## Slide 15 — Built to be hacked (~1 min)

**The goal:** establish credibility — open source, real plugin system,
real contributors, real velocity.

**Sample:**

> "OpenHamClock is MIT licensed. Seventeen rig-bridge plugins. Sixteen
> languages. Six-plus map overlays. Fifty-plus contributors — and this
> project is about _five months old_. That velocity is the point."
>
> "Map overlays are React hooks. If you can write JavaScript, you can
> copy a built-in, edit it, restart, and your overlay shows up in the
> layer toggle. The architecture docs and the plugin guide are both in
> the repo. There's also an AddOns folder for community userscripts —
> APRS auto-position, calculators, news feeds."

**Transition:**

> "How do you get it on your stuff?"

---

## Slide 16 — Install options (~1.5 min)

**The goal:** lower the activation energy. Tell them which path is right
for _them_.

**Sample:**

> "Four ways in. Pick whichever matches your patience."
>
> "Zero install — visit openhamclock.com. The wizard asks for your
> callsign and your grid. You're operating in 30 seconds."
>
> "Raspberry Pi kiosk — one curl command, runs the install script,
> reboots into fullscreen Chromium. Perfect for a wall display in the
> shack. I run one on a Pi 3 — it's fine."
>
> "Local install on a Mac, Linux box, or WSL — clone, npm ci, npm start,
> open localhost:3000."
>
> "Docker if you want it isolated on your home server."

**Windows folks — new this month:**

> "If you tried the Windows install before and it fought you — it was
> overhauled this month. One-line PowerShell install, a real updater. If
> a previous attempt failed on you, it's worth a retry."

**Privacy note worth flagging:**

> "If you self-host, all API calls are proxied through your own backend.
> Nothing about your operating goes anywhere you don't control."

**Transition:**

> "Last real slide — how to get involved."

---

## Slide 17 — Get involved (~1 min)

**The goal:** make the ask explicit. Tell them exactly what to do next.
**Drop the links in the Zoom chat on this slide** — openhamclock.com and
github.com/accius/openhamclock.

**Sample:**

> "If you take nothing else from tonight, take this: try it. openhamclock
> dot com, no install, your callsign and grid in the wizard. Five minutes."
>
> "If you find a bug, or there's a feature you want, file a GitHub issue.
> Negative feedback is more valuable than silence — I showed you two July
> headliners that started as user emails. The Facebook group
> 'OpenHamClock' is the most active community channel; there's also
> r/OpenHamClock."
>
> "If you write code — pull requests against the Staging branch. If
> you've been looking for a project to contribute to, this is one where
> your first PR has a real chance of being merged."

**Transition into closing:**

> "And with that —"

---

## Slide 18 — Thank you + Q&A

**Sample close:**

> "Thanks again to SFDXA for having me. This project exists because of
> fifty-some people who decided to send PRs to a brand-new repo — and
> because users keep telling us what's wrong. If anyone has questions —
> I'm Chris, K0CJH, my contact's on the screen — I'd love to take them.
> And drop your callsign in the chat if you try it this week; I read
> the Facebook group."

**73, sit back, take questions.** On Zoom, watch the chat as well as the
raised hands — half the questions arrive in text.

### Q&A bank — be ready for these

> **"Which cluster node does the hosted site use?"**
> Our own now — OHC Cluster, new this month. It aggregates RBN skimmer
> feeds (CW/RTTY + FT8/FT4) and human spots, and serves classic telnet,
> so any logger can connect to it. Self-hosters can point at any node
> they like.

> **"Are the FT8 predictions really running different physics per mode?"**
> Yes — the P.533 engine runs at each mode's decode threshold (FT8 −19 dB,
> FT4 −15, WSPR −26, JT65 −23, CW +5, relative to the same 3 kHz
> reference). It's not a fudge factor applied after the fact. SSB
> predictions are unchanged.

> **"Does it do LoTW / Club Log / logbook integration?"**
> Not yet — N3FJP is the first logger integration (new this month). File
> an issue for the one you use; logbook integration is on the roadmap.

> **"Does it work offline?"**
> Mostly no. Some panes do — the clock, satellite pass predictions.
> The propagation panel, cluster, and PSKReporter all need internet.

> **"Will it run on my old Pi 3?"**
> Yes. Kiosk mode is happy on a Pi 3. A Pi 4 with 2GB+ is more
> comfortable.

> **"How is it different from HamClock?"**
> Modern web stack — React, Node.js — instead of native C++. Plugin
> system from day one. Active contributor community. Web-first instead
> of local-display-first. Same spiritual goal; it's not a fork, it's a
> homage.

> **"Who funds this?"**
> Nobody. It's open source, no funder. Hosting at openhamclock.com is
> out of pocket. Donations welcome but not required. If you want zero
> dependence on the cloud instance, self-host — that's the whole point.

> **"Is my data private?"**
> Self-host for zero external dependencies. Otherwise, only public APIs
> see your callsign — the DX cluster and PSKReporter, both of which
> already get it if you operate at all.

> **"Can I run it on a tablet?"**
> Yes. Layout is responsive. iPad on the bench works well. Phone is
> usable but cramped.

> **"Does it support [MY SPECIFIC RADIO MODEL]?"**
> If it speaks Hamlib, yes — via the rigctld plugin. If it has a Yaesu,
> Kenwood, or Icom CAT protocol, probably also yes via direct USB. If
> it's something weird — open an issue and we'll figure it out.

> **"What about contests?"**
> Contest calendar built in, and the cluster gained a contest filter this
> month for spot noise. Active contest logging (dupes, exchanges) is out
> of scope — N1MM does that better.

> **"How does it handle weak-signal modes — JT9, FST4, MFSK?"**
> Anything WSJT-X / JTDX / MSHV decodes flows through the relay and shows
> up on the map.

> **"I'm not a coder — how can I help?"**
> File good bug reports — the July headliners were user emails. Suggest
> features. Translate strings (16 languages today, more welcome). Make a
> video showing how you use it.

---

## Pre-talk checklist — before the Zoom call

- [ ] Open `index.html` on the presentation machine. Verify the deck
      renders and the title slide looks right.
- [ ] Press `S` — verify Reveal's speaker view opens in a second window,
      and put it on the monitor you are NOT sharing.
- [ ] Open `openhamclock.com` in a **second tab of the same browser
      window** as the deck. Set callsign + grid so the demo doesn't start
      from the setup wizard. Click around once to warm the cache.
- [ ] Only two tabs in that window — deck and live site — so tab
      switching is predictable on camera.
- [ ] On slide 14, click the "Open in new tab" button once to verify it.
- [ ] Walk the 8-step demo path once (slide 14 notes) — time it.
- [ ] Set browser zoom to 100%. Hide the bookmarks bar.
- [ ] Clear autocomplete history in the URL bar.
- [ ] Notifications OFF — macOS Focus / Windows Do Not Disturb.
- [ ] Zoom: test **Share → the browser window** (not the desktop) in a
      solo meeting. Confirm the speaker-view window does NOT leak.
- [ ] Zoom: enable "Optimize for video clip" OFF (it blurs text), and
      check "Share sound" is off unless you need it.
- [ ] Wired internet if you have it. Charge/plug in the laptop.
- [ ] Have the GitHub and openhamclock.com links ready to paste into the
      Zoom chat at slide 17.
- [ ] Water within reach. Mic check. Camera at eye level.
- [ ] Before slide 1: breathe, look at the lens, smile.

73 and good luck out there.
