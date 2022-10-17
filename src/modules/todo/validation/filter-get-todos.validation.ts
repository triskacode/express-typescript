import joi from "joi";
import { FilterGetTodosDto } from "../dto/filter-get-todos.dto";

export const filterGetTodosValidation = joi
  .object<FilterGetTodosDto>({
    where: joi.object({
      activity_group_id: joi.number().optional().messages({
        "string.base": "Parameter 'activity_group_id' must be a number",
      }),
    }),
  })
  .prefs({ allowUnknown: true });
