import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getMember } from '$lib/server/members';
import { createApplePass } from '$lib/server/wallet/apple';

export const GET: RequestHandler = async ({ params }) => {
  const member = getMember(params.id);
  if (!member) error(404, 'Membre introuvable');
  try {
    const pass = await createApplePass(member);
    return new Response(new Uint8Array(pass), { headers: { 'Content-Type': 'application/vnd.apple.pkpass', 'Content-Disposition': `attachment; filename="maison-fidele-${member.memberNumber}.pkpass"`, 'Cache-Control': 'no-store' } });
  } catch (cause: any) {
    if (cause?.message === 'APPLE_DEVELOPMENT_MODE') error(503, 'Apple Wallet est en mode développement. Configurez les certificats dans .env.');
    console.error('Apple Wallet:', cause);
    error(500, 'Impossible de générer le pass Apple Wallet. Vérifiez la configuration des certificats.');
  }
};
