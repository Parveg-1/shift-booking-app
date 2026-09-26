# Shift Booking App

React Native shift booking application built on top of the provided shift mock API.
Book and cancel work shifts, browse them grouped by date and filter them by city.

## Assignment mapping

- **My shifts:** shows all booked shifts, grouped by date, with cancellation.
- **Available shifts:** shows upcoming shifts, grouped by date, with city filtering and live city counts.
- **Booking:** unbooked shifts can be booked unless the API/design rules mark them as started or overlapping.
- **Cancellation:** booked shifts can be cancelled through the mock API.
- **State management:** Context API + `useReducer` provides one shared source of truth for both tabs.
- **API:** the provided mock API remains unchanged; its validation is the source of truth for booking/cancellation failures.

## Features

- View available shifts (upcoming only)
- Filter shifts by city, with live per-city counts
- Group shifts by date (`Today`, `Tomorrow`, `Monday, Sep 28`)
- Book a shift
- Cancel a booked shift
- View booked shifts in **My shifts**
- Loading, error and empty states everywhere
- Shared global state, so both tabs always show the same data
- Accessible buttons, labels and touch targets
- Inline spinners on the shift that is being booked/cancelled

## Tech stack

- React Native (Expo SDK 57)
- JavaScript
- React Navigation (bottom tabs)
- Context API + `useReducer`
- `fetch` API
- `StyleSheet`
- `SectionList` for the date grouped lists

No Redux, no data-fetching library, no axios.

## Project structure

```
.
├── api/                     # provided mock API (untouched)
├── assets/                  # provided assets (spinner SVGs)
├── design-spec.pdf          # provided design specification
├── package.json             # runs the mock API
└── mobile/                  # React Native app
    ├── App.js
    ├── app.json
    ├── index.js
    ├── .env.example
    └── src
        ├── components       # ShiftCard, ShiftList, CityFilter, states, Spinner, TabBarIcon
        ├── config           # API base URL + timeout
        ├── context          # ShiftContext (useReducer)
        ├── navigation       # bottom tab navigator
        ├── screens          # AvailableShiftsScreen, MyShiftsScreen
        ├── services         # api.js (fetch wrapper)
        ├── theme            # colors, spacing, radii, typography
        └── utils            # shifts.js (grouping, filtering, formatting)
```

## Requirements

- Node.js >= 18 and npm
- Expo Go on a physical device, or Android Studio / an iOS simulator
- The mock API (see below)

## Run the mock API

The API lives in the repository root (`package.json` there starts it):

```bash
npm install
npm start
```

The API listens on `http://127.0.0.1:8080` (`localhost:8080`).

### Important: use Node.js 12 for the API

The provided API is built on **hapi 17** (2018). On Node.js >= 14 every `POST`
request (`/book` and `/cancel`) never receives a response, while `GET` keeps
working. This is an incompatibility between hapi 17 and modern Node, not an
application bug, and the API source is left untouched on purpose.

```bash
nvm install 12
nvm use 12
npm install     # once, with Node 12
npm start
```

The mobile app itself runs on any modern Node version (>= 18); only the API
process needs Node 12.

## Run the mobile app

```bash
cd mobile
npm install
npx expo start
```

Then press `a` for an Android emulator, `i` for an iOS simulator, or scan the QR
code with Expo Go.

## API base URL

The base URL is configured in one place, `mobile/src/config/api.js`:

| Environment         | URL                                    |
| ------------------- | -------------------------------------- |
| Android emulator    | `http://10.0.2.2:8080` (default)       |
| iOS simulator       | `http://localhost:8080` (default)      |
| Physical device     | `http://<your-computer-ip>:8080`       |

To override it, copy `.env.example` to `.env` and set the URL:

```bash
cd mobile
cp .env.example .env
```

```dotenv
EXPO_PUBLIC_API_URL=http://192.168.1.20:8080
```

The default is already correct per platform, so the override is only needed for
physical devices. A device and the computer must be on the same network, and the
API must be reachable from it (`host: '127.0.0.1'` in `api/server.js` only listens
on loopback, so for a physical device change it to `0.0.0.0`).

## Architecture

```
Screens  ──uses──▶  ShiftContext (useReducer)  ──calls──▶  api.js (fetch)  ──▶  Mock API
   ▲                        │
   └── single source of truth: shifts[]
```

- `services/api.js` is the only place that talks to the network. It knows the
  endpoints, sends the JSON body the API expects, and turns every failure into an
  `ApiError` with a readable message.
- `context/ShiftContext.js` owns the state (`shifts`, `loading`, `error`,
  `pendingIds`) and the actions `FETCH_START`, `FETCH_SUCCESS`, `FETCH_ERROR`,
  `UPDATE_SHIFT`, `SET_PENDING`. It fetches once on mount and exposes
  `book`, `cancel` and `reload`.
- Screens derive what they need with `useMemo` (upcoming shifts, booked shifts,
  city filter, grouped sections) and share the same `shifts` array, so there is
  no duplicated state between the two tabs.
- The API is the source of truth. A booking or cancellation updates the store
  only with the shift the API returned. If the API rejects a request, the state
  is left untouched, an alert explains why, and the user can refresh.
- Business rules (overlaps, already booked, already started) are enforced by the
  API. The UI only mirrors them: shifts that overlap a booked shift, or that have
  already started, are shown as disabled.

## API used

Base URL from the config above. Data model:
`{ id, area, booked, startTime, endTime }`, with `startTime` / `endTime` as Unix
epoch milliseconds.

| Method | Endpoint               | Purpose                        |
| ------ | ---------------------- | ------------------------------ |
| GET    | `/shifts`              | all shifts                     |
| POST   | `/shifts/{id}/book`    | book a shift, returns the shift |
| POST   | `/shifts/{id}/cancel`  | cancel a shift, returns the shift |

Errors are surfaced from the API message, for example
`Cannot book an overlapping shift` or `Shift is already booked`.

## Testing checklist

Verified against the running mock API while building this app (all API cases
below pass, including the error messages):

- [x] API starts successfully
- [x] `GET /shifts` returns 34 shifts with the documented schema
- [x] `POST /shifts/{id}/book` books a shift and returns the updated shift
- [x] `POST /shifts/{id}/cancel` cancels a shift and returns the updated shift
- [x] Rejections are returned as messages: already booked, not booked,
      overlapping, already finished, already started, not found

The following needs a device or simulator (`npx expo start` plus `a` / `i`):

### Available shifts

- [ ] Shifts load
- [ ] Loading state appears
- [ ] Errors are handled (stop the API, then "Try again")
- [ ] Dates are grouped
- [ ] City filter works
- [ ] "All" works
- [ ] Book button works
- [ ] Cancel button works for booked shifts
- [ ] Overlapping and already started shifts are disabled

### My shifts

- [ ] Only booked shifts appear
- [ ] Dates are grouped
- [ ] Cancel works
- [ ] Empty state with a shortcut to the available shifts

### State

- [ ] Booking updates Available shifts
- [ ] Booking immediately appears in My shifts
- [ ] Cancelling removes the shift from My shifts
- [ ] Cancelling changes Available shifts correctly
- [ ] No duplicated state between screens

### UI

- [ ] No overflow
- [ ] Buttons are tappable (44pt minimum height)
- [ ] Loading, error and empty states work
- [ ] Layout works from small phones to tablets
# shift-booking-app
# shift-booking-app
