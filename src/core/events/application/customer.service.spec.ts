import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { CustomerSchema } from '../infra/db/schemas';
import { CustomerService } from './customer.service';
import { CustomerMysqlRepository } from '../infra/db/repositories/customer-mysql.repository';
import { Customer } from '../domain/entities/customer.entity';
import { UnitOfWorkMikroOrm } from '../../common/infra/unit-of-work-mikro-orm';

test('deve listar os customers', async () => {
  const orm = await MikroORM.init<MySqlDriver>({
    entities: [CustomerSchema],
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
  const customerRepo = new CustomerMysqlRepository(em);
  const uow = new UnitOfWorkMikroOrm(em);
  const customerService = new CustomerService(customerRepo, uow);
  const customer = Customer.create({
    name: 'Customer 1',
    cpf: '230.171.310-50',
  });
  await customerRepo.add(customer);
  await em.flush();
  await em.clear();

  const customers = await customerService.list();
  console.log(customers);

  await orm.close();
});

test('deve registrar um customer', async () => {
  const orm = await MikroORM.init<MySqlDriver>({
    entities: [CustomerSchema],
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
  const customerRepo = new CustomerMysqlRepository(em);
  const uow = new UnitOfWorkMikroOrm(em);
  const customerService = new CustomerService(customerRepo, uow);

  const customer = await customerService.register({
    name: 'Customer 1',
    cpf: '230.171.310-50',
  });

  expect(customer).toBeInstanceOf(Customer);
  expect(customer.id).toBeDefined();
  expect(customer.name).toBe('Customer 1');
  expect(customer.cpf.value).toBe('23017131050');

  await em.clear();

  const customerFound = await customerRepo.findById(customer.id);
  expect(customerFound).toBeInstanceOf(Customer);
  expect(customerFound.id).toBeDefined();
  expect(customerFound.name).toBe('Customer 1');
  expect(customerFound.cpf.value).toBe('23017131050');

  await orm.close();
});
