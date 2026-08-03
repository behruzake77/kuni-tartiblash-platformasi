# Ordo HTTP sync contract

## Built-in (default path)

Ordo ships with:

- `GET  /api/sync/state?workspace=KEY`
- `PUT  /api/sync/state` body `SyncPayload` (+ workspace)
- `GET  /api/sync/health`

Set a **workspace key** in Settings (e.g. your email). Devices with the same key share state on this deployment. Data files: `.data/sync/`.

Optional lock: `ORDO_SYNC_TOKEN` (or `NEXT_PUBLIC_ORDO_SYNC_TOKEN`).

## External

When `NEXT_PUBLIC_ORDO_SYNC_URL` is set, Ordo uses that API instead.

## Payload (`SyncPayload`)

```json
{
  "version": 1,
  "updatedAt": "2026-08-03T12:00:00.000Z",
  "deviceId": "dev_abc",
  "user": { "id": "...", "name": "...", "email": "...", "createdAt": "..." },
  "prefs": { "locale": "en", "dayStart": "08:00", "focusMinutes": 45, "maxPriorities": 3, "reminderLeadMinutes": 5, "remindersEnabled": true, "inAppReminders": true },
  "day": { "version": 1, "date": "2026-08-03", "tasks": [], "habits": [], "schedule": [], "focusSessions": [], "focusSecondsToday": 0, "review": {}, "updatedAt": "..." }
}
```

## Endpoints

### `GET {BASE}/state`
- **200** + payload JSON
- **404** if no state yet

### `PUT {BASE}/state`
- Body: full `SyncPayload`
- **200** `{ "ok": true }`

Optional: `Authorization: Bearer {NEXT_PUBLIC_ORDO_SYNC_TOKEN}`

## Merge strategy
Client uses **last-write-wins** on `updatedAt` (ISO string).
