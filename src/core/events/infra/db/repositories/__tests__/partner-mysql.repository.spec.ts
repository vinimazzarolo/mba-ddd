import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { PartnerSchema } from '../../schemas';
import { Partner } from '../../../../domain/entities/partner.entity';
import { PartnerMysqlRepository } from '../partner-mysql.repository';

test('partner repository', async () => {
  const orm = await MikroORM.init<MySqlDriver>({
    entities: [PartnerSchema],
    entitiesTs: ['./src/core/events/infra/db/schemas.ts'],
    host: 'localhost',
    port: 3306,
    dbName: 'events',
    user: 'root',
    password: 'root',
    type: 'mysql',
    forceEntityConstructor: true,
  });
  await orm.schema.refreshDatabase();
  const em = orm.em.fork();
  const partnerRepo = new PartnerMysqlRepository(em);
  const partner = Partner.create({ name: 'Partner 1' });
  await partnerRepo.add(partner);
  await em.flush();
  await em.clear();

  let partnerFound = await partnerRepo.findById(partner.id);
  expect(partnerFound.id.equals(partner.id)).toBeTruthy();
  expect(partnerFound.name).toBe(partner.name);

  partner.changeName('Partner 2');
  await partnerRepo.add(partner);
  await em.flush();
  await em.clear();

  partnerFound = await partnerRepo.findById(partner.id);
  expect(partnerFound.id.equals(partner.id)).toBeTruthy();
  expect(partnerFound.name).toBe(partner.name);

  partnerRepo.delete(partner);
  await em.flush();

  await orm.close();
});
