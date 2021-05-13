import { MockWebsocketServer } from './utils/tests/websocket-server';
import { bootstrap } from './bootstrap';
import * as request from 'supertest';
import { findAvailablePortAsString } from './utils/tests/ports';
import { INestApplication } from '@nestjs/common';
import { ConsoleMock } from './utils/tests/mock-console';

describe(`application`, () => {
  const originalProcess = process;
  const mockServer = new MockWebsocketServer();

  let app: INestApplication;

  beforeEach(async () => {
    await mockServer.start();
    ConsoleMock.mock();

    process.env.BLENDER_URI = mockServer.getAddress();
    process.env.APP_PORT = await findAvailablePortAsString();

    app = await bootstrap();
  });

  afterEach(async () => {
    await app.close();
    await mockServer.close();
    ConsoleMock.restore();
    process = originalProcess;
  });

  it(`listens on the configured port`, async () => {
    // Ping /health just because it's the only available endpoint.
    await request(app.getHttpServer()).get('/').expect(200);
  });
});
