---
title: NCC SJBIT Command Portal
tagline: Running a cadet unit, online
summary: A volunteer-built portal for my college NCC unit covering parades, attendance, weekly reports, quizzes, achievements and alumni.
year: '2026'
categories: [Web]
tags: [Full Stack, Volunteer, Dashboard]
role: Sole developer, end to end
team: Solo
duration: April 2026
stack: [React, TypeScript, Vite, Tailwind, Supabase, PostgreSQL, Recharts, jsPDF]
order: 6
cardStyle: dossier
annotation: Built for my unit
cover: { alt: NCC SJBIT Command Center dashboard }
keyFeatures:
  - { icon: calendar-days, text: Parade scheduling and live roll call }
  - { icon: file-text, text: One-click weekly reports with PDF export }
  - { icon: chart-column, text: Attendance analytics by batch and platoon }
  - { icon: list-checks, text: Quizzes with a leaderboard }
  - { icon: medal, text: Achievements, rank holders, alumni and unit history }
gallery:
  - { alt: Command Center, caption: Live unit stats and announcements }
  - { alt: Weekly report, caption: A generated weekly report }
links: {}
demo: false
---

## Overview

The NCC SJBIT Command Portal runs the day-to-day operations of the National Cadet Corps unit at my college, SJBIT in Bengaluru, under 39 KAR BN NCC. It covers parades, attendance, weekly reports, quizzes, achievements, study materials, alumni and the unit's history. I built it end to end as a volunteer project and gave it to my unit.

## Problem

Running a cadet unit means a lot of paperwork: scheduling parades, taking roll, writing weekly reports and keeping track of camps, certificates and rank holders. The portal puts all of it in one place, so seniors spend less time on records and more on the unit.

## My role

I designed and built everything myself: the React front end, the Supabase database of 14 tables with row-level security, and three roles. Cadets can view, senior NCOs take attendance and generate reports, and admins manage everything.

## Process

The first version covered the core: a command center, parade management, attendance, analytics, achievements, study materials, alumni, rank holders and history. Version 2 made weekly reports generate themselves from the week's parades and attendance, redesigned the report archive, added a quiz system with a leaderboard, and extended analytics with batch and platoon filters.

## Decisions

- **Supabase with row-level security.** Permissions live in the database, so a cadet can't read or change what they shouldn't, whatever the front end does.
- **Regimental numbers as logins.** Cadets register with the number they already know, and the portal builds their account from it.
- **Reports generated from data.** Weekly reports are compiled from real parade and attendance records instead of being typed up by hand.
