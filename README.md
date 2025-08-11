# VUMC vpn-control

Frontend/portal for Fortigate VPN connection manager rewritten to use a React
SPA with an Express backend instead of Meteor.

## Development

1. Install dependencies with `npm install`.
2. Start both the API server and the React dev server:

```bash
npm run dev
```

The Express API listens on port 3001 and the Vite dev server on 5173. API
requests from the frontend are proxied to the backend.

## Building

```bash
npm run build
```

This creates a production build of the client in `dist/`.

## Testing

There are currently no automated tests.
