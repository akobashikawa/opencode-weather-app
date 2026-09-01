import { spyOn, type Mock } from "bun:test";

const ANSI_PATTERN = /\x1b\[[0-9;]*m/g;

let promptSpy: Mock<typeof prompt> | null = null;
let fetchSpy: Mock<typeof fetch> | null = null;
let logSpy: Mock<typeof console.log> | null = null;
let promptQueue: string[] = [];

export function stubPrompt(...answers: string[]): void {
  promptQueue = [...answers];
  if (!promptSpy) {
    promptSpy = spyOn(globalThis, "prompt");
    promptSpy.mockImplementation(() => promptQueue.shift() ?? null);
  }
  promptSpy.mockClear();
}

export function promptCalls(): string[] {
  return promptSpy ? promptSpy.mock.calls.map((call) => String(call[0])) : [];
}

export function stubFetch(handler: (url: string) => Response): void {
  if (!fetchSpy) {
    fetchSpy = spyOn(globalThis, "fetch");
  }
  fetchSpy.mockClear();
  fetchSpy.mockImplementation(((input: string | URL | Request) => {
    return Promise.resolve(handler(String(input)));
  }) as typeof fetch);
}

export function fetchUrls(): string[] {
  return fetchSpy ? fetchSpy.mock.calls.map((call) => String(call[0])) : [];
}

export function captureConsole(): string[] {
  const lines: string[] = [];
  if (!logSpy) {
    logSpy = spyOn(console, "log");
  }
  logSpy.mockClear();
  logSpy.mockImplementation((...args: unknown[]) => {
    const text = args.map((arg) => (typeof arg === "string" ? arg : String(arg))).join(" ");
    lines.push(text.replace(ANSI_PATTERN, ""));
  });
  return lines;
}

export function restoreGlobals(): void {
  promptSpy?.mockRestore();
  promptSpy = null;
  fetchSpy?.mockRestore();
  fetchSpy = null;
  logSpy?.mockRestore();
  logSpy = null;
}
