import joi from "joi";
import { CreateTodoDto } from "../dto/create-todo.dto";
import { Priority } from "../entities/types/todo.type";

export const createTodoValidation = joi.object<CreateTodoDto>({
  title: joi.string().required().messages({
    "string.base": "Parameter 'title' must be a string",
    // "any.required": "Parameter 'title' is required",
    "any.required": "title cannot be null",
  }),
  activity_group_id: joi.number().required().messages({
    "string.base": "Parameter 'activity_group_id' must be a number",
    // "any.required": "Parameter 'activity_group_id' is required",
    "any.required": "activity_group_id cannot be null",
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
      ).join(", ").slice()}`,
    }),
});
