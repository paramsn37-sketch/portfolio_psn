---
title: UGRID VM Provisioning
tagline: Request a VM by chatting
summary: An agentic chatbot that turns a plain-language VM request into a validated build sheet and a one-click Morpheus build, replacing rounds of emails, calls and manual data entry.
year: '2026'
categories: [AI/ML]
place: Unisys
tags: [Agentic AI, Chatbot, Automation, Cloud Infrastructure]
role: AI engineering intern
team: Four interns in Unisys's CIT Infra business unit
duration: August 2026 – present
stack: [LLM agent, Morpheus API, Admin dashboard]
order: 3
cardStyle: window
annotation: From chat to VM
cover: { alt: UGRID chatbot collecting a VM request }
keyFeatures:
  - { icon: message-circle, text: Chat interface that asks only for missing fields, in plain words }
  - { icon: list-checks, text: Field-by-field policies and rules for every build }
  - { icon: shield-check, text: Cloud review that looks only at what the agent flagged }
  - { icon: server, text: One-click Morpheus build from the admin dashboard }
  - { icon: users, text: Handles many requests at once }
gallery:
  - { alt: Chat request, caption: A user requesting a VM in plain language }
  - { alt: Admin dashboard, caption: Review and one-click build }
links: {}
demo: false
---

## Overview

UGRID is the first project my team delivered as AI engineering interns in Unisys's Corporate Infrastructure (CIT Infra) business unit. A user asks a chatbot for a virtual machine in plain language. The agent collects what's needed, turns it into a proper build sheet, routes it through a quick cloud review and triggers the build in Morpheus automatically. It is one part of a larger agentic automation platform the unit is building, with an agent that knows CIT, VMs, networking, cloud services and the domain knowledge of the people who run them.

## Problem

Requesting a VM used to take several rounds. Requesters filled in a long form, and most of the time they didn't know every detail, so they gave very little. The cloud team then followed up over email or Teams calls, sometimes several times, before it could validate the request by hand. The server team then read the build sheet, logged in to Morpheus and typed in every field one by one before sending it for provisioning. There was also no proper rule book for things like sizing for a given number of users.

## My role

There are only four interns in our unit and no senior developer, so we own the AI solutions for the unit's projects end to end. On UGRID we went through every requirement field by field with the teams involved and wrote policies and rules for each one. Then we built the agent, the build-sheet conversion, the review flow, the admin dashboard and the Morpheus integration.

## Process

The new flow works like this:

- **Chat.** The user describes what they need, and the agent asks only for the fields that are missing or invalid, in simple terms.
- **Build sheet.** Once everything is there, the request becomes a build sheet in the standard template and goes to the cloud team.
- **Cloud review.** The cloud team reviews only what the agent flagged and confirms.
- **Build.** The server team is out of the loop. The manager or server head reviews the confirmed build in the admin dashboard and clicks Build. The sheet becomes JSON and goes to Morpheus through its API, which provisions the VM.

## Decisions

- **Rules before the agent.** We wrote clear policies for every field first, so the agent asks questions only where they're valid instead of guessing.
- **Review by exception.** Reviewers see only the flagged items, not the whole request.
- **API instead of manual entry.** Linking builds straight to Morpheus removed the error-prone step of typing each field in by hand.

## Results

What used to take repeated emails, calls and manual entry is now one conversation, a short review and a click. The flow can serve many users at the same time, which saves the cloud and server teams a lot of time and load.

## Learnings

Working in CIT means picking up real domain knowledge of cloud services and corporate infrastructure alongside building AI. Alongside the project I completed Unisys's C2C training and made connections across departments and with fellow interns in the US and UK offices. I'm grateful to my mentor [Amith KK](https://in.linkedin.com/in/amithkk), my reporting manager [Rashmi Prakash](https://in.linkedin.com/in/rashmi-prakash-315980b) and our unit director [Jithin Sarath](https://in.linkedin.com/in/jithinsarath), and to my three fellow interns.
