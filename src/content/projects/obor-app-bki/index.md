---
title: "On Board Reporting App - BKI"
description: "A cross-platform desktop application that empowers marine surveyors with offline data synchronization for PT Biro Klasifikasi Indonesia (BKI)"
date: "Februari, 10 2026"
demoURL: "https://drive.google.com/file/d/1Z6EMo5IXiEuHaoh_zYKpw12nsXu3n3yL/view?usp=drive_link"
---

![On Board Reporting App - BKI](/projects/onboard.png)

<div class="animate">
  <span class="text-sm font-bold">
    📝:
  </span>
  <span class="text-green-500 me-4">
    Completed
  </span>
  <span class="text-sm font-bold">
    🔒:
  </span>
    <span class="text-gray-500">
    Private
  </span>
</div>

A cross-platform desktop application for Windows and macOS that empowers marine surveyors with offline data synchronization. Effortlessly conduct on-site inspections and survey submissions, generate official documentation, and deliver certificates to stakeholders.

### Technology Used

<div class="grid grid-cols-2 sm:grid-cols-12 gap-4">
    <div class="flex flex-col items-center">
      <img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/typescript.png" alt="typescript" class="w-8 h-8">
    </div>      
    <div class="flex flex-col items-center">
      <img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/react.png" alt="react" class="w-8 h-8">
    </div>   
    <div class="flex flex-col items-center">
      <img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/laravel.png" alt="laravel" class="w-8 h-8">
    </div>
    <div class="flex flex-col items-center">
      <img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/sqlite.png" alt="sqlite" class="w-8 h-8">
    </div>
</div>

### Key Responsibilities

- Architected and maintained the offline-first desktop frontend, enabling surveyors to capture, store, and edit inspection data locally via SQLite
- implemented robust background-sync to push completed surveys to the Laravel backend once connectivity is restored, guaranteeing seamless certificate generation and stakeholder delivery.

### Features

- **Surat Pelaksanaan Survey** – Generate and manage official survey-execution letters offline; auto-sync to the back-office when online.  
- **Form Laporan Survey** – Capture inspection findings, attach photos, and compile structured survey reports on-site; data is cached locally and uploaded automatically upon reconnection.  
- **Form Konfirmasi KU** – Record customer confirmation (Konfirmasi KU) signatures and feedback digitally, ensuring certificates can be released immediately after approval.
