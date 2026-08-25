import { z } from 'zod';

export const registrationSchema = z.object({
  firstName: z.string().trim().min(2, 'Le prénom doit contenir au moins 2 caractères.').max(60),
  lastName: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères.').max(60),
  email: z.email('Saisissez une adresse email valide.').trim().toLowerCase()
});

export const pointsSchema = z.object({
  memberId: z.uuid(),
  amount: z.coerce.number().int().min(-100000).max(100000).refine((value) => value !== 0, 'Le montant ne peut pas être nul.'),
  note: z.string().trim().min(2, 'Ajoutez un motif.').max(120)
});

export function fieldErrors(error: z.ZodError) {
  return Object.fromEntries(error.issues.map((issue) => [String(issue.path[0]), issue.message]));
}
