import { error } from '@sveltejs/kit';
import QRCode from 'qrcode';
import type { PageServerLoad } from './$types';
import { getMember, getTransactions } from '$lib/server/members';
import { walletStatus } from '$lib/server/wallet/config';

export const load: PageServerLoad = async ({ params }) => {
  const member = getMember(params.id);
  if (!member) error(404, 'Membre introuvable');
  const qrCode = await QRCode.toDataURL(member.id, { width: 320, margin: 2, color: { dark: '#112a25', light: '#fffdf8' } });
  return { member, transactions: getTransactions(member.id), qrCode, wallet: walletStatus() };
};
