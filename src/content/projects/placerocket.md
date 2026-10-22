---
title: PlaceRocket Fleet & Logistics
tagline: Dispatch, tracking, delivery proof
summary: A logistics engine and fleet platform with live tracking, route optimisation and OTP-verified delivery, built for an established shipping company.
year: '2026'
categories: [Web]
tags: [Full Stack, Logistics, Real-time Tracking, Route Optimisation]
role: Sole developer, logistics engine
team: Me on fleet and logistics; Lavanya and Kiran on inventory, picking and packing
duration: 3 weeks of planning, 1 month of build
stack: [Python, FastAPI, PostgreSQL + PostGIS, Redis, Redpanda, OSRM, VROOM, React, MapLibre GL, Docker, GitHub Actions]
order: 2
cardStyle: dossier
annotation: Order ready → delivered
cover: { alt: PlaceRocket ops dashboard with a live driver map }
keyFeatures:
  - { icon: truck, text: Auto-dispatch to the nearest idle driver, hub drivers first }
  - { icon: route, text: Route optimisation on real Bengaluru roads }
  - { icon: map-pinned, text: Live driver tracking with breadcrumb trails }
  - { icon: qr-code, text: QR-verified pickup and OTP-verified delivery }
  - { icon: calendar-check, text: Same-day or 2–3 day estimates by PIN code }
gallery:
  - { alt: Ops dashboard, caption: Live map, routes and driver management }
  - { alt: Driver app, caption: The driver's pickup and delivery flow }
  - { alt: System workflow diagram, caption: Order to delivery, end to end }
links: {}
demo: false
---

## Overview

PlaceRocket's fleet and logistics engine handles everything from "order ready" to "delivered". It dispatches orders to drivers, optimises their routes, tracks them live on a map and confirms each delivery with a QR scan and an OTP. It is one engine of a larger platform, and my teammates are building the inventory, picking and packing side alongside it.

## Problem

The client is an established shipping company with no logistics or inventory management portal. Dispatch, driver tracking and proof of delivery all needed a real system. Even adding a driver or a warehouse had no proper tool.

## My role

I built the logistics engine and fleet management platform on my own: the FastAPI backend, the ops dashboard, the driver app and the event contract the inventory team integrates with. I spent three weeks planning and talking with the client, then a month building. I worked closely with Lavanya and Kiran to integrate my engine with their inventory and packing engine. I used Claude to plan and design, and I made the final decisions.

## Process

The build went in seven phases. I started with infrastructure and the data model, then driver login and dispatch, then routing and tracking, then the two interfaces. A hardening phase split pickup from delivery, added retries for failed deliveries and fixed a double-booking race that only showed up under load testing. Two independent audits then turned up a list of issues, including an OTP injection that allowed a driver account takeover, and I fixed and re-verified each one. The last round added warehouse creation, hub editing, driver onboarding and PIN-code serviceability.

## Decisions

- **Sync handlers over async.** Async handlers stalled at 10 concurrent users in a load test, so I switched to plain handlers with a sync Kafka client.
- **A short-lived login token for the ops dashboard.** An audit showed that a key baked into the front end could be read in devtools, so the dashboard now exchanges a login for a short-lived token.
- **Real integration tests over mocks.** CI runs against the live Docker stack, so the database and routing engines are tested for real.
- **Integration only through events.** Inventory stays out of this codebase and talks to it through an `order.*` event contract, so the two teams can ship independently.

## Results

The engine is complete and runs locally. It isn't deployed yet because the other engines are still being built. After hardening, the 95th-percentile dispatch time in a load test dropped from 368 ms to 331 ms, and a 2,675-request JMeter run finished with zero errors. The MVP covers Bengaluru only.

## Learnings

Load testing found a double-booking race that functional tests missed, and a fresh audit found a security hole I hadn't seen. The race and the OTP takeover were the two hardest problems in the project.
