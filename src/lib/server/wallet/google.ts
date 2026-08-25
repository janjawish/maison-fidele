import { GoogleAuth } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';
import type { Member } from '../db/schema';
import { googleConfigured } from './config';

const baseUrl = 'https://walletobjects.googleapis.com/walletobjects/v1';
const normalizedKey = () => env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\\n/g, '\n');

export async function createGoogleSaveUrl(member: Member) {
  if (!googleConfigured()) throw new Error('GOOGLE_DEVELOPMENT_MODE');
  const issuerId = env.GOOGLE_WALLET_ISSUER_ID!;
  const classId = `${issuerId}.${env.GOOGLE_WALLET_CLASS_ID || 'loyalty_class'}`;
  const objectId = `${issuerId}.${member.id.replaceAll('-', '_')}`;
  const credentials = { client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL!, private_key: normalizedKey() };
  const auth = new GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'] });
  const client = await auth.getClient();

  try {
    await client.request({ url: `${baseUrl}/loyaltyClass/${classId}` });
  } catch (error: any) {
    if (error?.response?.status !== 404) throw error;
    await client.request({ method: 'POST', url: `${baseUrl}/loyaltyClass`, data: {
      id: classId,
      issuerName: env.APPLE_ORGANIZATION_NAME || 'Ma Maison',
      programName: 'Programme fidélité',
      programLogo: { sourceUri: { uri: 'https://placehold.co/660x660/112a25/f7f1e2.png?text=M' }, contentDescription: { defaultValue: { language: 'fr', value: 'Ma Maison' } } },
      reviewStatus: 'UNDER_REVIEW',
      hexBackgroundColor: '#112a25'
    } });
  }

  const loyaltyObject = {
    id: objectId,
    classId,
    state: 'ACTIVE',
    accountId: member.memberNumber,
    accountName: `${member.firstName} ${member.lastName}`,
    loyaltyPoints: { label: 'Points', balance: { int: member.points } },
    barcode: { type: 'QR_CODE', value: member.id, alternateText: member.memberNumber }
  };
  try {
    await client.request({ url: `${baseUrl}/loyaltyObject/${objectId}` });
  } catch (error: any) {
    if (error?.response?.status !== 404) throw error;
    await client.request({ method: 'POST', url: `${baseUrl}/loyaltyObject`, data: loyaltyObject });
  }

  const token = jwt.sign({ iss: credentials.client_email, aud: 'google', typ: 'savetowallet', origins: [], payload: { loyaltyObjects: [loyaltyObject] } }, credentials.private_key, { algorithm: 'RS256' });
  return `https://pay.google.com/gp/v/save/${token}`;
}
