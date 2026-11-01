---
title: AI PC & Copilot Readiness
tagline: Buy only the AI hardware you need
summary: A 24-hour hackathon app that scores every device for AI PC readiness and guides hardware refresh and Copilot adoption decisions.
year: '2026'
categories: [AI/ML, Web]
place: Unisys
tags: [Hackathon, Dashboard, Decision Support]
role: Team lead
team: Team Unimoggers, four interns from CIT, led by me
duration: 24 hours
stack: [FastAPI, Scoring engine, Dashboard]
order: 6
cardStyle: dossier
annotation: Built in 24 hours
cover: { alt: AI PC readiness fleet dashboard }
keyFeatures:
  - { icon: chart-column, text: Scores every device into a readiness tier, T0–T3 }
  - { icon: users, text: Considers capability, licensing, usage, personas and workload placement }
  - { icon: search, text: Finds idle AI hardware to redeploy before buying }
  - { icon: file-text, text: Plain-English buy or don't-buy brief for every seat }
gallery:
  - { alt: Fleet view, caption: The whole fleet scored by tier }
  - { alt: Device check, caption: Checking a single device live }
links: {}
demo: false
---

## Overview

At Unisys Hack Horizon 2026 I led a team of four interns representing our Corporate Infrastructure unit. Our topic was AI PC and Copilot readiness planning. In 24 hours we built an app that assesses every device across capability, licensing, usage, personas, workload placement and expected business value, to guide hardware refresh and Copilot adoption.

## Problem

Companies are about to buy AI hardware nobody asked for. IT buys NPU laptops by default without seeing what's already sitting idle, while cloud AI needs no special hardware at all. The next refresh risks wasting money on capacity that won't be used.

## My role

I led the team and kept the build on track. We split the work into a FastAPI backend, a scoring engine, an estimator and a dashboard, one per teammate.

## Process

The app scores every seat into a tier, redeploys idle capacity before recommending anything new, and then suggests buying only what's left, at the best value per seat. We tested it on a 500-device fleet and demoed it live on the running stack, including a check of the visitor's own device.

## Decisions

- **Deterministic rules, not a black box.** Every tier comes from explainable rules, so procurement can trust and check the result.
- **Unknown stays unknown.** When data is missing, the app says so instead of guessing.
- **Reuse before buying.** Idle AI hardware gets redeployed first.

## Results

We didn't win, but we built a complete, working application in 24 hours, with every one of the 500 test devices scored and briefed.
