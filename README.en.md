[中文](./README.md)

# WorkDay

WorkDay is a workday time dashboard for office and knowledge workers. Its default page focuses on the countdown to the end of the workday and allocation of the remaining time. Long-term plans, time insights, and data settings are available through separate pages or drawers.

## Features

- Live end-of-work countdown and workday progress
- Remaining-time blocks split by configurable durations
- Time-zone creation, editing, and block allocation
- Long-term item countdown management (list view)
- Editable life milestone timeline (e.g., graduation, marriage, age 30)
- Annual progress and plan-count insights
- Light and dark themes
- Local JSON and Google Drive backups
- Compatibility with legacy WorkDay JSON and scattered localStorage data
- Tabs switch on hover; Plans page is the default home

## Local Development

```powershell
npm install
npm run dev
```

## Verification

```powershell
npm run typecheck
npm test
npm run build
```

## Stack

React, TypeScript, Vite, Vitest, Zod, and Lucide Icons. The main branch is built and published to GitHub Pages with GitHub Actions.