---
title: Taskverse
tagline: Proctored assessments for colleges
summary: An in-house LMS for PlaceValue where colleges run daily proctored objective and coding assessments, with automated scoring and reports.
year: '2026'
categories: [Web]
tags: [Full Stack, SaaS, Microservices, Coding Engine]
role: Full-stack developer, coding engine lead
team: Team of six at PlaceValue
duration: About 3 months
stack: [Angular, TypeScript, ASP.NET Core, .NET microservices, EF Core, PostgreSQL, Judge0, Monaco, AWS CodeDeploy]
order: 2
cardStyle: dossier
annotation: 600 students and counting
cover: { alt: Taskverse student assessment with the Monaco code editor }
keyFeatures:
  - { icon: code, text: In-browser coding with Judge0 execution in 7 languages }
  - { icon: shield-check, text: Proctored objective and coding assessments }
  - { icon: layout-dashboard, text: Dashboards for super admins, college admins, trainers and students }
  - { icon: chart-column, text: Drill-down reports with Excel export and email }
  - { icon: mic, text: AI mock interviews through BotView }
gallery:
  - { alt: Coding assessment screen, caption: The Monaco editor with run and submit }
  - { alt: Reports view, caption: Batch and question-wise drill-down reports }
  - { alt: Execution pipeline diagram, caption: How a submission travels from browser to Judge0 and back }
links: { live: 'https://taskverse.placevalue.in/login' }
demo: false
---

## Overview

Taskverse is the in-house learning and assessment platform at PlaceValue, the startup where I intern. Colleges use it to run daily proctored assessments that mix objective questions with real coding problems, scored automatically. PlaceValue uses it in its own training and offers it to colleges on subscription. A team of six built it as a set of .NET microservices behind an Angular front end.

## Problem

Colleges need to test a lot of students every day, and checking code by hand doesn't scale. Taskverse had to run hundreds of coding submissions at once, score them fairly, and turn the results into reports that trainers and college admins can act on.

## My role

I led the coding engine. I built the coding question UI with the Monaco editor and the run and submit flow, then brought in the Judge0 execution pipeline and made it reliable. I added multi-node Judge0 dispatch with health checks and backpressure. Beyond the engine, I built the reports system for every role, password change and reset flows, the student results pages and the UI colour redesign.

I worked across the full production build and spent a lot of time testing and fixing bugs. Srishty, our team lead, reviewed and merged the work. I also built BotView, our AI mock-interview product, and integrated it into Taskverse as a new assessment type.

## Process

I started in late June on the coding engine branch, shipping the editor first and the execution pipeline right after. Then I moved through UI polish, reports, results and password features, each on its own branch. A backlog of coding-assessment bugs came to a head in early July. In two days I fixed scores never reaching the final result, attempts marked submitted before the code was queued, broken gateway and callback routes, and the API also running as a worker. I used AI for parts of the feature work and spent most of my own time on testing and debugging.

## Decisions

- **Leases on queued submissions.** Two workers could claim the same submission. I added lease columns, so a claimed job belongs to one worker until it finishes or the lease expires.
- **Health-aware dispatch across several Judge0 nodes.** One execution node couldn't take peak load, so I added a node registry with health checks and sent work only to healthy nodes.
- **Backpressure with a hybrid response.** When the queue is busy, a submission waits briefly for its result and then falls back to polling, so a student isn't stuck on a hung request.

## Results

Taskverse is live and around 600 students have taken assessments on it so far. Before release the platform passed 113 of 113 automated tests and built cleanly for production.

## Learnings

Most of the real work was in testing. The concurrency bugs in the execution queue only appeared under real load, and fixing them took longer than writing the features.
