const MIN_STEPS = 3;
const MAX_STEPS = 15;

export function buildInferTaskDescriptionPrompt(taskTitle: string): string {
  return [
    'Infer a short description for the task below.',
    'Use the same language as taskTitle.',
    'Return only a valid JSON object with this exact shape: {"description":"..."}',
    'The description must be concrete and under 150 characters.',
    'No markdown.',
    'No explanations.',
    '',
    `taskTitle: ${taskTitle}`,
  ].join('\n');
}

export function buildGenerateStepsPrompt(
  taskTitle: string,
  taskDescription: string,
): string {
  return [
    'Generate actionable steps for the task below.',
    'Use the language of taskTitle. If taskTitle is ambiguous, use taskDescription.',
    `Return only a valid JSON array of strings.`,
    `Generate between ${MIN_STEPS} and ${MAX_STEPS} steps.`,
    'Each step must be short, concrete, and executable.',
    'No markdown.',
    'No explanations.',
    'No numbering.',
    '',
    `taskTitle: ${taskTitle}`,
    `taskDescription: ${taskDescription || ''}`,
  ].join('\n');
}
