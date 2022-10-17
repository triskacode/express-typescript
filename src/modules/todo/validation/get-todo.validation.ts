import joi from "joi";

export const getTodoValidation = joi.number().messages({
  "number.base": "Parameter 'id' must be a number",
});
