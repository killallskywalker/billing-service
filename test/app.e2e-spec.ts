import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateBillingRecordDto } from '../src/billing-records/dto/create-billing-record.dto';
import { UpdateBillingRecordDto } from '../src/billing-records/dto/update-billing-record.dto';
import { ResponseBillingRecordDto } from '../src/billing-records/dto/response-billing-record.dto';
import { PaginatedResponseDto } from '../src/common/dto/api-response.dto';
import { DataSource } from 'typeorm';
import { connectionSource } from '../src/config/typeorm';

let jwtAdmin: string;
let jwtUser: string;

describe('Billing E2E', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    if (!connectionSource.isInitialized) {
      await connectionSource.initialize();
    }

    await connectionSource.runMigrations();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue(connectionSource)
      .compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    dataSource = moduleFixture.get(DataSource);

    const resAuthenticateAdmin = await request(app.getHttpServer())
      .get('/authenticate/generate')
      .query({ role: 'admin' });

    const resAuthenticateUser = await request(app.getHttpServer())
      .get('/authenticate/generate')
      .query({ role: 'user' });

    jwtAdmin = resAuthenticateAdmin.text;
    jwtUser = resAuthenticateUser.text;
  });

  afterAll(async () => {
    await app.close();
  });

  let createdId: number;

  describe('As Admin', () => {
    it('POST /billing - create record', async () => {
      const payload: CreateBillingRecordDto = {
        first_name: 'Kylo',
        last_name: 'Ren',
        email: 'kylo@new-empire.com',
        product_code: 'P001',
        location: 'Singapore',
        premium_paid: 100.0,
      };

      const res = await request(app.getHttpServer())
        .post('/billing')
        .set('Authorization', `Bearer ${jwtAdmin}`)
        .send(payload);

      const result = res.body as ResponseBillingRecordDto;

      expect(res.status).toBe(201);

      expect(result.first_name).toBe(payload.first_name);
      expect(result.last_name).toBe(payload.last_name);
      expect(result.email).toBe(payload.email);
      expect(result.product_code).toBe(payload.product_code);
      expect(result.location).toBe(payload.location);
      expect(result.premium_paid).toBe('100.00');

      createdId = result.id;
    });

    it('GET /billing - list all records as admin', async () => {
      const res = await request(app.getHttpServer())
        .get('/billing')
        .set('Authorization', `Bearer ${jwtAdmin}`);

      const result = res.body as PaginatedResponseDto<ResponseBillingRecordDto>;
      const totalBillingRecords = await dataSource
        .getRepository('billing_records')
        .count();

      expect(res.status).toBe(200);

      expect(result.meta.totalItems).toBe(totalBillingRecords);
    });

    it('GET /billing/:id - get specific record as admin', async () => {
      const res = await request(app.getHttpServer())
        .get(`/billing/${createdId}`)
        .set('Authorization', `Bearer ${jwtAdmin}`);

      const result = res.body as ResponseBillingRecordDto;

      expect(res.status).toBe(200);
      expect(result.id).toBe(createdId);
    });

    it('PATCH /billing/:id - update record as admin', async () => {
      const updatePayload: UpdateBillingRecordDto = {
        premium_paid: 200,
      };

      const res = await request(app.getHttpServer())
        .patch(`/billing/${createdId}`)
        .set('Authorization', `Bearer ${jwtAdmin}`)
        .send(updatePayload);

      const result = res.body as ResponseBillingRecordDto;

      expect(result.premium_paid).toBe('200.00');
    });

    it('DELETE /billing/:id - delete record as admin', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/billing/${createdId}`)
        .set('Authorization', `Bearer ${jwtAdmin}`);

      expect(res.status).toBe(204);

      const deletedBilling = await dataSource
        .getRepository('billing_records')
        .findOneBy({ id: createdId });

      expect(deletedBilling).toBe(null);
    });
  });

  describe('As Normal User', () => {
    it('POST /billing - cannot create record', async () => {
      const payload: CreateBillingRecordDto = {
        first_name: 'Kylo',
        last_name: 'Ren',
        email: 'kylo@new-empire.com',
        product_code: 'P001',
        location: 'Singapore',
        premium_paid: 100.0,
      };

      const res = await request(app.getHttpServer())
        .post('/billing')
        .set('Authorization', `Bearer ${jwtUser}`)
        .send(payload);

      expect(res.status).toBe(403);
    });

    it('GET /billing - list all records as user', async () => {
      const res = await request(app.getHttpServer())
        .get('/billing')
        .set('Authorization', `Bearer ${jwtUser}`);

      const result = res.body as PaginatedResponseDto<ResponseBillingRecordDto>;
      const totalBillingRecords = await dataSource
        .getRepository('billing_records')
        .count();

      expect(res.status).toBe(200);

      expect(result.meta.totalItems).toBe(totalBillingRecords);
    });

    it('GET /billing/:id - get specific record as user', async () => {
      const res = await request(app.getHttpServer())
        .get(`/billing/${createdId}`)
        .set('Authorization', `Bearer ${jwtUser}`);

      const result = res.body as ResponseBillingRecordDto;

      expect(res.status).toBe(200);
      expect(result.id).toBe(createdId);
    });

    it('PATCH /billing/:id - update record as admin', async () => {
      const updatePayload: UpdateBillingRecordDto = {
        premium_paid: 200,
      };

      const res = await request(app.getHttpServer())
        .patch(`/billing/${createdId}`)
        .set('Authorization', `Bearer ${jwtUser}`)
        .send(updatePayload);

      expect(res.status).toBe(403);
    });

    it('DELETE /billing/:id - delete record as admin', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/billing/${createdId}`)
        .set('Authorization', `Bearer ${jwtUser}`);

      expect(res.status).toBe(403);
    });
  });
});
