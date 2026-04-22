const MIN_STEPS = 3;
const MAX_STEPS = 15;

export function buildGenerateStepsPrompt(
  taskTitle: string,
  taskDescription: string,
): string {
  return [
    'Generate actionable steps for the task below.',
    `Use the language of taskTitle. If taskTitle is ambiguous, use taskDescription.`,
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
