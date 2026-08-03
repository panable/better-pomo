# Better Pomodoro

![Status](https://img.shields.io/badge/status-under%20construction-orange)

## Description
Better Pomodoro is a Pomodoro timer inspired by the implementation used in [Yeolpumta](https://www.yeolpumta.com/en/)

Unlike traditional Pomodoro timers, this version does not force a hard stop when the countdown reaches zero. Instead, the timer continues into a **count-up mode** e.g. (00:00 -> +00:01) allowing you to keep working without interruption while still tracking the extra time spent.

## Motivation
Most Pomodoro timers stop immediately when the timer is up (or instantly begins the break timer) - while this is *technically* what Pomodoro is, it breaks flow-state in practice.

After using Yet, I found their approach much more natural:
- Timer hits `00:00`, it continues counting upward
- You can finish your current thought, function, or task without disruption.
- The extra time is still tracked, giving a more accurate representation of the work done.

This workflow promotes **flow state over strict timeboxing** while still maintaining the benefits of the Pomodoro method and time tracking. When the timer is up, it should be a signal to "take a break - you've earned it" not a "get out of your chair right now".

## Current Plan
Initial version will be a simple browser-based application with:
- Minimal UI for tasks (programming, maths, leetcode, etc).
- Ability to start a Pomodoro session tied to specific task.
- Automatic time tracking per task, including overtime.
- Persistence with `localStorage` (no backend yet).

The goal is simply to keep this iteration lightweight and fast to use.

---

## Future plans
### Visualisations
Charts and insights showing time spent on each task, etc. Perhaps a calendar view
### Persistent Storage
Move from `localStorage` to a database (like MySQL)
### Web / Server Daemon
Run the application as a local web server with a web interface. The timer state will be managed by the daemon rather than the browser.
### API + External interfaces
Expose the timer through an API (HTTP and/or RPC), allowing external clients to interact with it.
This allows the creations of alternative frontends such as:
  - Terminal UI
  - DWM status bar integration
  - Obsidian plugin
  - Custom scripts or automations
### Realtime Synchronisation
Use some form of socket connection to broadcast the timer changes across clients so the timer state is maintained across clients. Allowing all the frontends to stay in sync.