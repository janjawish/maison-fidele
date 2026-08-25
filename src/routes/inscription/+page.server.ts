import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createMember } from '$lib/server/members';
import { fieldErrors, registrationSchema } from '$lib/server/validation';

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const values = {
      firstName: String(formData.get('firstName') ?? ''),
      lastName: String(formData.get('lastName') ?? ''),
      email: String(formData.get('email') ?? '')
    };
    const parsed = registrationSchema.safeParse(values);
    if (!parsed.success) return fail(400, { values, errors: fieldErrors(parsed.error) });
    try {
      const member = createMember(parsed.data);
      redirect(303, `/membre/${member.id}`);
    } catch (error: any) {
      if (String(error?.message).includes('UNIQUE constraint failed: members.email')) {
        return fail(409, { values, errors: { email: 'Cette adresse email est déjà inscrite.' } });
      }
      throw error;
    }
  }
};
