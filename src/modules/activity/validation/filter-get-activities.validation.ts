import joi from "joi";
import { FilterGetActivitiesDto } from "../dto/filter-get-activities.dto";

export const filterGetActivitiesValidation = joi
  .object<FilterGetActivitiesDto>({
    where: joi.object({
      email: joi.string().email().optional().messages({
        "string.base": "Parameter 'email' must be a string",
        "string.email": "Parameter 'email' must be a valid email",
      }),
    }),
  })
  .prefs({ allowUnknown: true });
