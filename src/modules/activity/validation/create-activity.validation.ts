import joi from "joi";
import { CreateActivityDto } from "../dto/create-activity.dto";

export const createActivityValidation = joi.object<CreateActivityDto>({
  email: joi.string().email().required().messages({
    "string.base": "Parameter 'email' must be a string",
    "string.email": "Parameter 'email' must be a valid email",
    "any.required": "Parameter 'email' is required",
  }),
  title: joi.string().required().messages({
    "string.base": "Parameter 'title' must be a string",
    // "any.required": "Parameter 'title' is required",
    "any.required": "title cannot be null",
  }),
});
