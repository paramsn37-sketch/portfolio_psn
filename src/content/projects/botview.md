---
title: BotView
tagline: AI mock interviews, by voice
summary: An AI interviewer that runs voice mock interviews, scores every answer and sends a PDF report, built into Taskverse as a new assessment type.
year: '2026'
categories: [AI/ML, Web]
tags: [AI Agent, Voice, RAG, Integration]
role: Founder, lead developer and AI engineer
team: Me, with Kiran on deployment
duration: Core build in July 2026, infrastructure work into October
stack: [FastAPI, Python, MongoDB Atlas, Supabase pgvector, Gemini 2.5 Flash, Sarvam AI, OpenAI embeddings, React, Tailwind, Zustand]
order: 3
cardStyle: window
annotation: Talk to the interviewer
cover: { alt: BotView live voice interview screen }
keyFeatures:
  - { icon: mic, text: Live voice interviews with streaming speech-to-text }
  - { icon: bot, text: Gemini interviewer with a warm intro before scored questions }
  - { icon: search, text: Semantic question search over the question bank }
  - { icon: file-text, text: PDF score report with confidence analysis }
  - { icon: plug, text: Built into Taskverse with single sign-on }
gallery:
  - { alt: Interview screen, caption: A student mid-interview }
  - { alt: Score report, caption: The PDF report after the interview }
links: { live: '#' }
demo: false
---

## Overview

BotView is an AI-run mock interview. Students talk to a Gemini-powered interviewer by voice, every answer is scored, and they get a PDF report at the end. I built it as my own product and then integrated it into Taskverse, PlaceValue's assessment platform, where trainers can schedule an interview just like any other assessment.

## Problem

Interview practice for students usually means waiting for a mentor's time. BotView lets a student practise a realistic spoken interview whenever it's scheduled, and get specific feedback afterwards.

## My role

I drove BotView end to end: the FastAPI backend on MongoDB, the Gemini interview loop, semantic search over the question bank, scoring and sentiment analysis, and the Taskverse integration. That integration includes single sign-on, a scheduling window and a one-attempt rule. Kiran set up the deployment pipeline. I used AI coding tools heavily and made the architecture and infrastructure calls myself.

## Process

After the first scaffold in early July, the core came together in an intense two weeks. In that time I added question search, gamification, sentiment analysis, a consent gate and the full Taskverse login handoff. The project started on a no-code platform called Emergent, and I moved it off mid-build. It was first deployed on AWS and later moved to Atfenix, a private server provider in Noida.

## Decisions

- **Reading Taskverse's database directly.** BotView reads Taskverse's Postgres directly instead of going through its API. That made the integration tighter at the cost of coupling the two codebases.
- **Streaming speech-to-text with a fallback.** If the live connection drops, recording falls back to uploading the audio, so a student's answer is never lost.
- **Free-tier MongoDB Atlas for now.** It fits the current scale, and moving to our own servers later stays an option.

## Results

BotView is live inside Taskverse, and students reach it through that platform. A public demo is coming soon.

## Learnings

The hardest parts were making streaming speech-to-text hold up over real, multi-sentence answers, and handling the Gemini model failing partway through a conversation. Real-time voice punishes every small failure.
