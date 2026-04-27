import { z } from 'zod';

export const personalInfoSchema = z.object({
  firstName: z.string().nonoptional('Name is the required field'),
  lastName: z.string().nonoptional('Name is the required field'),
  email: z.email().nonoptional(),
  phone: z.string().nonoptional().max(10),
});

export const professionalSchema = z.object({
  company: z.string().nonoptional(),
  position: z.string().nonoptional(),
  experience: z.enum(['<1', '2-5', '6-10', '>10']),
  industry: z.string().nonoptional(),
});

export const paymentDetails = z.object({
  cardNumber: z.number().nonoptional().length(16),
  cardHolderName: z.string().nonoptional(),
  expiryDate: z
    .string()
    .nonoptional()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid format. Use MM/YY'),
  cvv: z.number().length(3),
});
