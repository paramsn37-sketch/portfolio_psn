---
title: DSA Masterclass Funnel
tagline: Landing page to paid signup
summary: A ₹99 webinar funnel for PlaceValue that takes a visitor from landing page to Razorpay payment, welcome email and WhatsApp group.
year: '2026'
categories: [Web, Design]
tags: [Full Stack, Payments, Funnel, DevOps]
role: Designer and full-stack developer
team: Solo
duration: 5 days of work
stack: [Node.js, Express, PostgreSQL, Razorpay, Brevo, HTML/CSS/JS, AWS EC2, Nginx, PM2, Microsoft Clarity]
order: 5
cardStyle: dossier
annotation: Visitor → paid seat
cover: { alt: DSA Masterclass landing page }
keyFeatures:
  - { icon: credit-card, text: Razorpay checkout with server-side verification }
  - { icon: shield-check, text: Duplicate-safe, idempotent payment confirmation }
  - { icon: mail, text: Welcome email and WhatsApp redirect after payment }
  - { icon: timer, text: Countdown timer that survives a refresh }
  - { icon: database, text: Admin CSV export of registrations }
gallery:
  - { alt: Landing page, caption: The landing page }
  - { alt: Funnel flow diagram, caption: Landing page → form → Razorpay → email and WhatsApp }
links: { live: 'https://masterclass.placevalue.in' }
demo: false
---

## Overview

This is the full signup and payment funnel for PlaceValue's ₹99 DSA Masterclass. A visitor lands on the page, registers, pays through Razorpay, and then gets a welcome email and a link to the WhatsApp group. I built it during my internship at PlaceValue, from the landing-page design to the payment backend and deployment.

## My role

I designed the whole landing page and built everything behind it. The Express API handles registration, order creation, Razorpay signature checks, a backup webhook, an admin CSV export and welcome emails. I deployed it on EC2 behind Nginx and PM2. I spent two days designing the front end, one day finalising it and two days wiring and testing the payment gateway. I used Claude to plan and design, and I made the final decisions.

## Process

The scaffold, the backend and the front-end wiring came first. Then I did a production-readiness pass: separate dev and prod config, CORS locked to one origin, structured logging and a health check. I swapped AWS SES for Brevo for email, and moved the deploy from Elastic Beanstalk to EC2 with Nginx and PM2.

## Decisions

- **The webhook as a backup.** Razorpay's signature is verified on the server, with a webhook as a second path. The confirmation is idempotent, so a payment confirmed twice never sends two welcome emails.
- **Emails never block a payment.** A failed email doesn't break a paid registration.
- **One secrets file.** A single root `.env` works whether the app starts from the backend folder or through PM2.

## Results

The funnel is deployed at masterclass.placevalue.in and ready to take registrations.
