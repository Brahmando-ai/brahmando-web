# brahmando-web
public repo of brahmando

## Platform Health

The `/platform` page polls a health-check aggregator to show live service statuses.

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_PLATFORM_HEALTH_URL` | `https://api.brahmando.com/platform-health` | URL of the platform-health JSON endpoint |

Create a `.env.local` to override:

```
NEXT_PUBLIC_PLATFORM_HEALTH_URL=https://api.brahmando.com/platform-health
```

If the aggregator endpoint is unreachable, the page falls back to direct
`no-cors` probes against each service URL and shows a banner:
_"Health service unreachable — using direct checks"_.

