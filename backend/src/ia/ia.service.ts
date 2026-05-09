import { Injectable } from '@nestjs/common';
import {
  buildGenerateStepsPrompt,
  buildInferTaskDescriptionPrompt,
} from './prompts';
import { stepSchema, taskDescriptionSchema } from './schemas';

type AiProvider = 'ollama' | 'openai';

@Injectable()
export class IaService {
  private readonly ollamaBaseUrl =
    process.env.OLLAMA_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:11434';
  private readonly ollamaModel = process.env.OLLAMA_MODEL ?? 'llama3.2:1b';
  private readonly openAiModel = process.env.OPENAI_MODEL ?? 'gpt-5';
  private readonly debugEnabled = process.env.IA_DEBUG === 'true';
  private readonly provider = this.getProvider();

  private getProvider(): AiProvider {
    const provider = process.env.IA_PROVIDER ?? 'ollama';

    if (provider === 'ollama' || provider === 'openai') {
      return provider;
    }

    throw new Error(
      `Unsupported IA_PROVIDER "${provider}". Use "ollama" or "openai".`,
    );
  }

  private parseTaskDescription(rawResponse: string): string {
    try {
      return this.validateTaskDescription(JSON.parse(rawResponse));
    } catch {
      const firstBraceIndex = rawResponse.indexOf('{');
      const lastBraceIndex = rawResponse.lastIndexOf('}');

      if (firstBraceIndex === -1 || lastBraceIndex === -1) {
        throw new Error(`Failed to parse AI response as JSON: ${rawResponse}`);
      }

      const jsonCandidate = rawResponse
        .slice(firstBraceIndex, lastBraceIndex + 1)
        .trim();

      try {
        return this.validateTaskDescription(JSON.parse(jsonCandidate));
      } catch {
        throw new Error(`Failed to parse AI response as JSON: ${rawResponse}`);
      }
    }
  }

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

  private validateTaskDescription(parsed: unknown): string {
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !('description' in parsed) ||
      typeof parsed.description !== 'string'
    ) {
      throw new Error('AI response is not a description object');
    }

    const description = parsed.description.trim();

    if (description.length < 5 || description.length > 150) {
      throw new Error('AI description must contain between 5 and 150 chars');
    }

    return description;
  }

  private async chat(
    prompt: string,
    format: Record<string, unknown> = stepSchema,
    formatName = 'ai_response',
  ): Promise<string> {
    if (this.provider === 'openai') {
      return this.chatWithOpenAi(prompt, format, formatName);
    }

    return this.chatWithOllama(prompt, format);
  }

  private logRawResponse(label: string, rawResponse: string) {
    if (!this.debugEnabled) {
      return;
    }

    console.debug(`\n\nIA raw ${label} response: \nSTART`, rawResponse, 'END\n\n');
  }

  private async chatWithOllama(
    prompt: string,
    format: Record<string, unknown>,
  ): Promise<string> {
    const response = await fetch(`${this.ollamaBaseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.ollamaModel,
        stream: false,
        format,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        errorMessage || `Ollama request failed with status ${response.status}.`,
      );
    }

    const data = (await response.json()) as {
      message?: {
        content?: string;
      };
    };

    if (!data.message?.content) {
      throw new Error('Ollama response did not include message content.');
    }

    return data.message.content;
  }

  private async chatWithOpenAi(
    prompt: string,
    format: Record<string, unknown>,
    formatName: string,
  ): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is required when IA_PROVIDER=openai.');
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.openAiModel,
        input: prompt,
        text: {
          format: {
            type: 'json_schema',
            name: formatName,
            schema: format,
          },
        },
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        errorMessage || `OpenAI request failed with status ${response.status}.`,
      );
    }

    const data = (await response.json()) as {
      output?: Array<{
        content?: Array<{
          text?: string;
        }>;
      }>;
      output_text?: string;
    };

    const outputText =
      data.output_text ??
      data.output
        ?.flatMap((item) => item.content ?? [])
        .find((content) => typeof content.text === 'string')?.text;

    if (!outputText) {
      throw new Error('OpenAI response did not include text output.');
    }

    return outputText;
  }

  async generateHelloMessage() {
    return this.chat('Say hello!');
  }

  async inferTaskDescription(taskTitle: string): Promise<string> {
    const rawResponse = await this.chat(
      buildInferTaskDescriptionPrompt(taskTitle),
      taskDescriptionSchema,
      'task_description',
    );

    this.logRawResponse('description', rawResponse);

    return this.parseTaskDescription(rawResponse);
  }

  async generateSteps(
    taskTitle: string,
    taskDescription: string,
  ): Promise<string[]> {
    const rawResponse = await this.chat(
      buildGenerateStepsPrompt(taskTitle, taskDescription),
      stepSchema,
      'task_steps',
    );

    this.logRawResponse('task steps', rawResponse);

    return this.parseJsonStringArray(rawResponse);
  }
}
