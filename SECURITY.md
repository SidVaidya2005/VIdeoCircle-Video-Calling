# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Report vulnerabilities privately by emailing **siddarthvaidya2005@gmail.com**
with the subject line `[VideoCircle Security] <short description>`.

Include:
- A description of the issue and the impact.
- Steps to reproduce (proof-of-concept code or a recording is ideal).
- The affected component (`frontend`, `backend`, or both) and version/commit.

### Response timeline

- **Acknowledgement**: within 72 hours.
- **Initial assessment**: within 7 days.
- **Fix or mitigation plan**: within 30 days for high/critical severity.

Once a fix is released, we will credit reporters in the release notes unless
you ask to remain anonymous.

## Scope

In scope:
- The Express backend in `backend/` (auth, LiveKit token issuance, MongoDB access).
- The React frontend in `frontend/`.
- Any GitHub Actions workflows in `.github/workflows/`.

Out of scope:
- LiveKit Cloud itself — report to LiveKit.
- MongoDB Atlas itself — report to MongoDB.
- Third-party npm dependencies — please report upstream, but feel free to CC us.
