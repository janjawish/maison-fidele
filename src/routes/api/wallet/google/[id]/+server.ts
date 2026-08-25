import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getMember } from '$lib/server/members';
import { createGoogleSaveUrl } from '$lib/server/wallet/google';

export const GET: RequestHandler = async ({ params }) => {
  const member = getMember(params.id);
  if (!member) error(404, 'Membre introuvable');
  try {
    const url = await createGoogleSaveUrl(member);
    redirect(303, url);
  } catch (cause: any) {
    if (cause?.message === 'GOOGLE_DEVELOPMENT_MODE') error(503, 'Google Wallet est en mode développement. Configurez les credentials dans .env.');
    console.error('Google Wallet:', cause);
    error(500, 'Impossible de créer la carte Google Wallet. Vérifiez la configuration Google.');
  }
};
