import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { changePoints, getMember, getTransactions, searchMembers } from '$lib/server/members';
import { fieldErrors, pointsSchema } from '$lib/server/validation';

export const load: PageServerLoad = ({ url }) => {
  const query = url.searchParams.get('q') ?? '';
  const selectedId = url.searchParams.get('member') ?? '';
  const selected = selectedId ? getMember(selectedId) : undefined;
  return { query, results: searchMembers(query), selected, transactions: selected ? getTransactions(selected.id) : [] };
};

export const actions: Actions = {
  points: async ({ request }) => {
    const formData = await request.formData();
    const parsed = pointsSchema.safeParse({ memberId: formData.get('memberId'), amount: formData.get('amount'), note: formData.get('note') });
    if (!parsed.success) return fail(400, { pointErrors: fieldErrors(parsed.error), pointValues: Object.fromEntries(formData) });
    try {
      const balance = changePoints(parsed.data.memberId, parsed.data.amount, parsed.data.note);
      return { success: true, balance, memberId: parsed.data.memberId };
    } catch (error: any) {
      return fail(400, { pointErrors: { amount: error?.message ?? 'Modification impossible.' }, pointValues: Object.fromEntries(formData) });
    }
  }
};
