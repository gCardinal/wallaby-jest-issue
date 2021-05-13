import * as getPort from 'get-port';

export const findAvailablePort = async (): Promise<number> => getPort();

export const findAvailablePortAsString = async (): Promise<string> => {
  const port = await findAvailablePort();

  return port.toString();
};
