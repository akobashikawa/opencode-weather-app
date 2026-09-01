const enabled = !process.env.NO_COLOR && process.stdout.isTTY;

function colorize(code: string, text: string): string {
  return enabled ? `\x1b[${code}m${text}\x1b[0m` : text;
}

export function cyan(text: string): string {
  return colorize("36", text);
}

export function yellow(text: string): string {
  return colorize("33", text);
}

export function green(text: string): string {
  return colorize("32", text);
}

export function red(text: string): string {
  return colorize("31", text);
}
