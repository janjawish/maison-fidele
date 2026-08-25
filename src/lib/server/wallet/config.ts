import { env } from '$env/dynamic/private';

export const appleConfigured = () => Boolean(env.APPLE_PASS_TYPE_IDENTIFIER && env.APPLE_TEAM_IDENTIFIER && env.APPLE_SIGNER_CERT_PATH && env.APPLE_SIGNER_KEY_PATH && env.APPLE_WWDR_CERT_PATH);
export const googleConfigured = () => Boolean(env.GOOGLE_WALLET_ISSUER_ID && env.GOOGLE_SERVICE_ACCOUNT_EMAIL && env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);

export function walletStatus() {
  return {
    apple: appleConfigured() ? 'configured' as const : 'development' as const,
    google: googleConfigured() ? 'configured' as const : 'development' as const
  };
}
