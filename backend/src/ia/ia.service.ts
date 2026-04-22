import { Injectable } from '@nestjs/common';
import ollama from 'ollama';
import { buildGenerateStepsPrompt } from './prompts';
import { stepSchema } from './schemas';

@Injectable()
export class IaService {
  private parseJsonStringArray(rawResponse: string): string[] {
    try {
      return this.validateSteps(JSON.parse(rawResponse));
    } catch {
      const firstBracketIndex = rawResponse.indexOf('[');
      const lastBracketIndex = rawResponse.lastIndexOf(']');

      if (firstBracketIndex === -1 || lastBracketIndex === -1) {
        throw new Error(`Failed to parse AI response as JSON: ${rawResponse}`);
      }

      const jsonCandidate = rawResponse
        .slice(firstBracketIndex, lastBracketIndex + 1)
        .trim();

      try {
        return this.validateSteps(JSON.parse(jsonCandidate));
      } catch {
        throw new Error(`Failed to parse AI response as JSON: ${rawResponse}`);
      }
    }
  }

  private validateSteps(parsed: unknown): string[] {
    if (
      !Array.isArray(parsed) ||
      !parsed.every((item) => typeof item === 'string')
    ) {
      throw new Error('AI response is not a string array');
    }

    if (parsed.length < 3 || parsed.length > 15) {
      throw new Error('AI response must contain between 3 and 15 steps');
    }

    return parsed;
  }

  private async chat(prompt: string): Promise<string> {
    const response = await ollama.chat({
      model: 'llama3.2:1b',
      stream: false,
      format: stepSchema,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return response.message.content;
  }

  async generateHelloMessage() {
    return this.chat('Say hello!');
  }

  async generateSteps(
    taskTitle: string,
    taskDescription: string,
  ): Promise<string[]> {
    const rawResponse = await this.chat(
      buildGenerateStepsPrompt(taskTitle, taskDescription),
    );

    console.log('\n\nIA raw response: \nSTART', rawResponse, 'END\n\n');

    return this.parseJsonStringArray(rawResponse);
  }
}
