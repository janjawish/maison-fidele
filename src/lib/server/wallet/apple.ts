import { PKPass } from 'passkit-generator';
import { readFile } from 'node:fs/promises';
import { env } from '$env/dynamic/private';
import type { Member } from '../db/schema';
import { appleConfigured } from './config';

// Minimal valid 1x1 PNG used for the MVP pass icons. Replace with branded PNGs for production.
const transparentPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64');

export async function createApplePass(member: Member) {
  if (!appleConfigured()) throw new Error('APPLE_DEVELOPMENT_MODE');
  const [signerCert, signerKey, wwdr] = await Promise.all([
    readFile(env.APPLE_SIGNER_CERT_PATH!),
    readFile(env.APPLE_SIGNER_KEY_PATH!),
    readFile(env.APPLE_WWDR_CERT_PATH!)
  ]);

  const pass = new PKPass(
    {
      'icon.png': transparentPng,
      'icon@2x.png': transparentPng,
      'logo.png': transparentPng,
      'logo@2x.png': transparentPng
    },
    { signerCert, signerKey, wwdr, signerKeyPassphrase: env.APPLE_SIGNER_KEY_PASSPHRASE || undefined },
    {
      formatVersion: 1,
      passTypeIdentifier: env.APPLE_PASS_TYPE_IDENTIFIER!,
      teamIdentifier: env.APPLE_TEAM_IDENTIFIER!,
      serialNumber: member.id,
      organizationName: env.APPLE_ORGANIZATION_NAME || 'Ma Maison',
      description: 'Carte de fidélité Ma Maison',
      logoText: 'MA MAISON',
      foregroundColor: 'rgb(247, 241, 226)',
      backgroundColor: 'rgb(17, 42, 37)',
      labelColor: 'rgb(197, 164, 99)'
    }
  );
  pass.type = 'storeCard';
  pass.primaryFields.push({ key: 'points', label: 'POINTS', value: member.points });
  pass.secondaryFields.push({ key: 'member', label: 'MEMBRE', value: member.memberNumber });
  pass.auxiliaryFields.push({ key: 'name', label: 'TITULAIRE', value: `${member.firstName} ${member.lastName}` });
  pass.setBarcodes({ format: 'PKBarcodeFormatQR', message: member.id, messageEncoding: 'iso-8859-1', altText: member.memberNumber });
  return pass.getAsBuffer();
}
