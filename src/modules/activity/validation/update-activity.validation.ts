import joi from "joi";
import { UpdateActivityDto } from "../dto/update-activity.dto";

export const updateActivityValidation = joi.object<UpdateActivityDto>({
  email: joi.string().email().optional().messages({
    "string.base": "Parameter 'email' must be a string",
    "string.email": "Parameter 'email' must be a valid email",
  }),
  title: joi.string().optional().messages({
    "string.base": "Parameter 'title' must be a string",
  }),
});
