/**
 * Small helper to mock the console._stdout.write method, which maps to Node's
 * process.stdout method. It's what winston/transports/console uses to log in
 * our context.
 *
 * WARNING: This mock helper is probably NOT feature complete. It will need to
 * be iterated upon.
 */
export class ConsoleMock {
  private static readonly originalConsoleWrite = (console as any)._stdout.write;

  public static mock() {
    (console as any)._stdout.write = jest.fn();
  }

  public static restore() {
    jest.resetAllMocks();
    (console as any)._stdout.write = ConsoleMock.originalConsoleWrite;
  }

  public static lastCall() {
    const calls: unknown[] = (console as any)._stdout.write.mock.calls;

    return (calls[calls.length - 1] && calls[calls.length - 1][0]) || undefined;
  }
}
