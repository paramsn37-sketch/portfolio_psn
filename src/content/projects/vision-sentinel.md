---
title: Vision Sentinel
tagline: Real-time industrial safety monitoring
summary: Computer vision that watches site cameras, checks each person for PPE, enforces no-entry zones and explains every alert with a heatmap.
year: '2026'
categories: [AI/ML, Web]
place: College
tags: [Computer Vision, YOLO, Explainable AI, Real-time]
role: Lead developer
team: College team; Mithun contributed phone alerts and extras to v2
duration: v1 in 2025, v2 rebuilt in October 2026
stack: [Python, YOLO, ByteTrack, Grad-CAM, FastAPI, React, Docker]
order: 5
cardStyle: window
annotation: Took us to the UIP semi-finals
cover: { src: /portfolio_psn/images/vision-sentinel-live-dark.webp, alt: Vision Sentinel live view with detections on a camera feed }
keyFeatures:
  - { icon: shield-check, text: Per-person PPE checks for helmet, vest, gloves, boots and goggles }
  - { icon: map-pin, text: Polygon zones for no entry, PPE required, occupancy and dwell time }
  - { icon: users, text: Tracks and counts distinct people, not per-frame boxes }
  - { icon: sparkles, text: Grad-CAM heatmap explaining every detection }
  - { icon: file-text, text: Incidents with evidence, plus PDF and CSV shift reports }
gallery:
  - { src: /portfolio_psn/images/vision-sentinel-incidents-dark.webp, alt: Incidents list, caption: Incidents with evidence frames and status }
  - { src: /portfolio_psn/images/vision-sentinel-zones-editor-dark.webp, alt: Zone editor, caption: Drawing no-entry and PPE zones on a camera }
  - { src: /portfolio_psn/images/vision-sentinel-xai-panel-light.webp, alt: Explanation panel, caption: The heatmap behind a detection }
links: { repo: 'https://github.com/paramsn37-sketch/Vision_Sentinel_2.0_GMP' }
demo: false
---

## Overview

Vision Sentinel watches camera feeds on industrial sites. It counts the distinct people on site, checks each one for PPE, raises an incident when someone enters a no-entry zone or a hazard area goes over its limits, and explains every alert with a heatmap of what the model looked at. Our first version was the project we presented at the Unisys Innovation Program, where we reached the semi-finals. In October 2026 I rebuilt it from scratch as Vision Sentinel 2.0.

## Problem

Safety officers can't watch every camera all the time, and a missed helmet or someone walking into a restricted zone can mean a serious accident. A system that flags these moments needs to be trusted, so it also has to show why it raised each alert.

## My role

I led the project. For version 2 I rebuilt everything myself: the training pipeline and model, tracking and counting, the zone and incident engine, explanations, the web app and the evaluation scripts. A teammate, Mithun, added phone alerts, phone-camera input and multi-language options.

## Process

Version 1 was a college prototype built on YOLOv11 with polygon geofencing and Grad-CAM, and it carried us through the UIP rounds. For version 2 I started over with a written blueprint and a rule that every claim must be backed by a measurement in the repository. I trained a YOLO26n model on person and PPE classes on a CPU only, and tuned ByteTrack for counting. Every result was evaluated on data the model never saw.

## Decisions

- **Two models, each where it's strongest.** People come from the stock COCO model, which is better on small, distant figures, and PPE comes from our own fine-tuned model.
- **Tracks, not frames.** Counting confirmed tracks instead of boxes per frame cut the counting error from 108% to 20%.
- **Explanations you can check.** Every detection gets a Grad-CAM heatmap, and the explanations themselves are tested with sanity checks.

## Results

Our model detects helmets at 0.90 mAP50 and vests at 0.89 on a frozen test set of 559 images. It runs at 8 to 10 frames per second on a 4-core CPU with no GPU, and the app passed a 60-minute, three-camera soak test without leaks. Gloves and goggles aren't reliable yet, and the counting error target of 10% isn't met yet. The repository says so openly.

## Learnings

Measuring honestly changes what you build. Writing down the target first, such as a 10% counting error, made it obvious where the model was still falling short.
