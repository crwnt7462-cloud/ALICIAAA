import request from 'supertest';
import app from '../../server/app';

describe('Salons ownership', () => {
  let salonId: string;
  let userToken: string;
  let otherToken: string;

  beforeAll(async () => {
    // login as pro
    userToken = await loginAsPro();
    otherToken = await loginAsOtherPro();
  });

  it('crée un salon', async () => {
    const res = await request(app)
      .post('/api/salons')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Salon Test' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    salonId = res.body.id;
  });

  it('modifie le nom du salon (owner)', async () => {
    const res = await request(app)
      .put(`/api/salons/${salonId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Salon Modifié' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Salon Modifié');
  });

  it('refuse modification par un autre utilisateur', async () => {
    const res = await request(app)
      .put(`/api/salons/${salonId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ name: 'Salon Hack' });
    expect(res.status).toBe(403);
  });
});
