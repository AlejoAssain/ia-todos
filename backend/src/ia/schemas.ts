export const taskDescriptionSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['description'],
  properties: {
    description: {
      type: 'string',
      minLength: 5,
      maxLength: 150,
    },
  },
};

export const stepSchema = {
  type: 'array',
  minItems: 3,
  maxItems: 15,
  items: {
    type: 'string',
  },
};
