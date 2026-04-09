# Job Tracker

A full-stack job application tracker with a .NET API and a React frontend.

## Best local setup for personal use

If this is just for you on your own computer, the easiest way to use it is as a single local app.

Double-click `open-job-tracker.cmd` in the project root, or run:

```powershell
.\open-job-tracker.cmd
```

That script will:

- Build the React frontend for local use.
- Copy the built frontend into the .NET app.
- Start one local server at `http://localhost:5194`.
- Open the website in your browser.

Your data is stored locally in `src/JobTracker.Api/jobtracker.db`.

When you want to stop the app, run:

```powershell
.\stop-job-tracker.cmd
```

If you want even quicker access, create a desktop shortcut to `open-job-tracker.cmd` and pin that shortcut to Start or the taskbar.

## What it does

- Create job applications with a job title, company name, job post link, date applied, and status.
- Track each application through these statuses:
  - `Applied`
  - `Denied`
  - `Interview`
  - `JobOffer`
- Update or delete existing applications.
- Persist data locally with SQLite.

## Project structure

- `src/JobTracker.Api`
  ASP.NET Core Web API with SQLite persistence.
- `client`
  React + Vite frontend for managing the job tracker.

## Run the backend

```powershell
dotnet run --project src/JobTracker.Api --launch-profile http
```

The API will run on `http://localhost:5194`.

You can also start it with the Windows helper script:

```powershell
.\start-api.cmd
```

## Run the frontend

From PowerShell on Windows, use `npm.cmd` instead of `npm` if script execution is blocked:

```powershell
npm.cmd install
npm.cmd run dev
```

The React app is configured to run on `http://localhost:5173`.

You can also use the helper script:

```powershell
.\start-client.cmd
```

To launch both the API and frontend in separate terminals:

```powershell
.\start-dev.cmd
```

If you want to permanently allow `npm` in PowerShell, you can run this once in a PowerShell window:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

If you do not want to change your execution policy, sticking with `npm.cmd` is completely fine.

If you want to point the frontend at a different API URL, copy `client/.env.example` to `client/.env` and change `VITE_API_BASE_URL`.

## Recommended development workflow

If you are actively editing the project, use the dev setup:

- `.\start-dev.cmd` to run the API and Vite frontend in separate windows.
- `.\open-job-tracker.cmd` when you just want to use the app locally.

## API endpoints

- `GET /api/job-applications`
- `GET /api/job-applications/{id}`
- `POST /api/job-applications`
- `PUT /api/job-applications/{id}`
- `PATCH /api/job-applications/{id}/status`
- `DELETE /api/job-applications/{id}`
