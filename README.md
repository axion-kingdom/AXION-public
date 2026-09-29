# AXION Public

Public-safe source extraction of AXION, a construction-accounting application.

This repository is independent of the private AXION repository. It contains only reviewed source that passed a fail-closed surface scan:

- `@axion/validation` — shared input contracts
- `@axion/security` — request-rate protection
- `@axion/ui` — shared interface components
- `@axion/domain` — public construction-accounting well schema

Operational runbooks, deployment automation, credentials, and production topology are not included.

## Use

```bash
npm install
npm run lint
npm run typecheck
npm test
npm run build
python3 scripts/scan-public-surface.py .
```

## License

MIT. See `LICENSE`.
