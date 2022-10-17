import joi from "joi";

export const getActivityValidation = joi.number().messages({
  "number.base": "Parameter 'id' must be a number",
});
