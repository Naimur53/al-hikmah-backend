import { z } from 'zod';

        const createValidation = z.object({
          body: z.object({
           
          }),
        });
        const updateValidation = z.object({
          body: z.object({ 
          }),
        });
        export const BlogValidation = {
          createValidation,
          updateValidation,
        };
        