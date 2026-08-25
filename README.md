<div align="center">

# Maison Fidèle

**A polished loyalty card MVP for Apple Wallet and Google Wallet.**

[![SvelteKit](https://img.shields.io/badge/SvelteKit-5-FF3E00?logo=svelte&logoColor=white)](https://svelte.dev/docs/kit)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/status-MVP_ready-1f6f50)](#roadmap)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

</div>

Maison Fidèle is a compact, production-minded starter for businesses that need digital loyalty cards without a heavy platform. Customers can register, track points, present a unique QR code, and add their card to Apple Wallet or Google Wallet. The application runs locally without Wallet credentials through explicit development modes.

## ✨ Features

- Customer registration with server-side validation
- Unique member number, QR code, and point balance
- Customer dashboard with complete transaction history
- Admin search and transactional point adjustments
- Signed Apple Wallet `.pkpass` generation with `passkit-generator`
- Official Google Wallet Loyalty API integration
- SQLite persistence with Drizzle ORM
- Credential-free development mode for both Wallet providers
- Responsive premium interface without a UI framework
- Automatic database setup and demo data

## Preview

| Customer experience | Member card |
| --- | --- |
| ![Maison Fidèle home page](docs/screenshots/home.png) | ![Maison Fidèle member card](docs/screenshots/member.png) |

![Maison Fidèle admin dashboard](docs/screenshots/admin.png)

## 🧰 Tech stack

| Area | Technology |
| --- | --- |
| Application | SvelteKit, Svelte 5, TypeScript |
| Database | SQLite, Drizzle ORM, `better-sqlite3` |
| Validation | Zod |
| Apple Wallet | `passkit-generator` |
| Google Wallet | Google Wallet Loyalty API, `google-auth-library` |
| QR codes | `qrcode` |
| Deployment | Node.js adapter |

## 🚀 Quick start

Requirements: Node.js 20+ and npm.

```bash
git clone <repository-url>
cd maison-fidele
npm install
cp .env.example .env
npm run dev
```

On PowerShell, replace the copy command with `Copy-Item .env.example .env`. Open [http://localhost:5173](http://localhost:5173). Wallet credentials are optional for local development.

The SQLite database and tables are created automatically. A demo member is seeded with the email `camille@example.com` and 120 points.

### Available commands

```bash
npm run dev          # Start the development server
npm run check        # Run Svelte and TypeScript checks
npm run build        # Create a production Node build
npm run preview      # Preview the production build
npm run db:generate  # Generate Drizzle migrations after schema changes
npm run db:studio    # Open Drizzle Studio
```

## 🍎 Apple Wallet configuration

The Apple endpoint produces a real, signed `.pkpass`. Create a Pass Type ID and Pass Type ID certificate in the Apple Developer portal, export the signing material as PEM files, and download the current Apple WWDR certificate.

```dotenv
APPLE_PASS_TYPE_IDENTIFIER=pass.com.example.loyalty
APPLE_TEAM_IDENTIFIER=XXXXXXXXXX
APPLE_ORGANIZATION_NAME=Maison Fidele
APPLE_SIGNER_CERT_PATH=./certificates/signer-cert.pem
APPLE_SIGNER_KEY_PATH=./certificates/signer-key.pem
APPLE_SIGNER_KEY_PASSPHRASE=
APPLE_WWDR_CERT_PATH=./certificates/wwdr.pem
```

Certificate directories and common key formats are ignored by Git. Never place certificate contents directly in source files. Replace the minimal embedded pass artwork with production brand assets before distributing passes to customers.

## Google Wallet configuration

Enable the Google Wallet API, create an issuer account, and add a service account as an authorized issuer user. Store its credentials only in the environment:

```dotenv
GOOGLE_WALLET_ISSUER_ID=3388000000000000000
GOOGLE_WALLET_CLASS_ID=loyalty_class
GOOGLE_SERVICE_ACCOUNT_EMAIL=wallet-service@example-project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

The application creates the Loyalty Class when needed, creates each member's Loyalty Object through the official API, and signs the **Save to Google Wallet** URL. Use a public, branded logo URL in `src/lib/server/wallet/google.ts` before production.

When credentials are absent, the corresponding integration remains visibly in development mode and the rest of the application continues to work.

## Architecture

```text
src/
├── lib/server/
│   ├── db/             # Drizzle schema and SQLite initialization
│   ├── wallet/         # Apple and Google Wallet integrations
│   ├── members.ts      # Member and transaction operations
│   └── validation.ts   # Server-side schemas
├── routes/
│   ├── inscription/    # Customer registration
│   ├── membre/[id]/    # Card, QR code, balance and history
│   ├── admin/          # Member search and point management
│   └── api/wallet/     # Wallet endpoints
└── styles.css          # Lightweight responsive design
```

Point updates and their history entries are written in a single SQLite transaction. The admin screen intentionally has no authentication in this MVP; protect `/admin` before a public production deployment.

## Roadmap

- [x] Customer enrollment, QR card, point balance, and history
- [x] Apple Wallet and Google Wallet integrations
- [x] Lightweight admin point management
- [ ] Brand-ready Wallet artwork and pass update notifications
- [ ] Authentication and role-based admin access
- [ ] Automated integration and end-to-end test suite

## Contributing

Contributions are welcome. Please open an issue before a substantial change, keep pull requests focused, and run the following checks locally:

```bash
npm run check
npm run build
```

Do not include local databases, `.env` files, service-account JSON, private keys, certificates, or customer data in issues or commits.

## License

Released under the [MIT License](LICENSE).

---

<div align="center">
If this starter saves you time, consider giving the project a star.
</div>
