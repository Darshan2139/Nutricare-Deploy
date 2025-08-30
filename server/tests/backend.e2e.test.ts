import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import { createServer } from '../index';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer | undefined;
let app: ReturnType<typeof createServer>;

// Mock Gemini and Cloudinary network calls
vi.stubGlobal('fetch', async (url: string, _opts?: any) => {
  if (url.includes('generativelanguage.googleapis.com')) {
    return { ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: 'Mock AI text' }] } }] }) } as any;
  }
  return { ok: true, json: async () => ({}) } as any;
});

async function getToken() {
  const res = await request(app).post('/api/auth/register').send({
    email: 'test@example.com',
    password: 'Secret123',
    name: 'Tester',
    role: 'pregnant'
  });
  expect(res.status).toBe(201);
  return res.body.token as string;
}

beforeAll(async () => {
  mongod = await MongoMemoryServer.create({ binary: { version: '6.0.6' } });
  process.env.MONGO_URI = mongod.getUri();
  process.env.JWT_SECRET = 'test_secret';
  await mongoose.connect(process.env.MONGO_URI!, { dbName: 'testdb' });
  app = createServer();
}, 600000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongod?.stop();
}, 600000);

describe('Backend E2E', () => {
  it('auth: register + login + profile', async () => {
    const token = await getToken();

    const login = await request(app).post('/api/auth/login').send({ email: 'test@example.com', password: 'Secret123' });
    expect(login.status).toBe(200);
    const profile = await request(app).get('/api/auth/profile').set('Authorization', `Bearer ${token}`);
    expect(profile.status).toBe(200);
    expect(profile.body.email).toBe('test@example.com');
  });

  it('health entries: create + list', async () => {
    const token = await getToken();
    const created = await request(app)
      .post('/api/health/entries')
      .set('Authorization', `Bearer ${token}`)
      .send({ entryDate: new Date().toISOString(), height: 160, weight: 55 });
    expect(created.status).toBe(201);

    const list = await request(app).get('/api/health/entries').set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
  });

  it('plans: generate', async () => {
    const token = await getToken();
    const res = await request(app)
      .post('/api/plans/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({ healthEntryId: new mongoose.Types.ObjectId().toString(), mockPlan: { overallScore: 80 } });
    expect(res.status).toBe(201);
    expect(res.body.overallScore).toBe(80);
  });

  it('chatbot: restriction + valid', async () => {
    const token = await getToken();
    const general = await request(app)
      .post('/api/chatbot/message')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'Tell me about football clubs' });
    expect(general.status).toBe(200);
    expect(general.body.response).toContain('pregnancy and nutrition');

    const nutrition = await request(app)
      .post('/api/chatbot/message')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'What are good nutrition tips during pregnancy?' });
    expect(nutrition.status).toBe(200);
    expect(nutrition.body.response).toBeTruthy();
  });

  it('hospitals: nearby gujarat via gemini', async () => {
    const token = await getToken();
    const res = await request(app)
      .get('/api/hospitals/nearby?lat=23.0225&lng=72.5714&radius=100')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});