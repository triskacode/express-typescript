import joi from "joi";
import { UpdateTodoDto } from "../dto/update-todo.dto";
import { Priority } from "../entities/types/todo.type";

export const updateTodoValidation = joi.object<UpdateTodoDto>({
  title: joi.string().optional().messages({
    "string.base": "Parameter 'title' must be a string",
  }),
  activity_group_id: joi.number().optional().messages({
    "string.base": "Parameter 'activity_group_id' must be a number",
  }),
  is_active: joi.boolean().optional().messages({
    "boolean.base": "Parameter 'is_active' must be a boolean",
  }),
  priority: joi
    .string()
    .valid(...Object.values(Priority))
    .optional()
    .messages({
      "string.base": "Parameter 'priority' must be a string",
      "any.only": `Parameter 'priority' is not valid, possible value is ${Object.values(
        Priority
      )
        .join(", ")
        .slice()}`,
    }),
});
