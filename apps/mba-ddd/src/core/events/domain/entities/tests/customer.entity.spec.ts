import Cpf from '../../../../common/domain/value-objects/cpf.vo';
import { Customer, CustomerId } from '../customer.entity';

test('deve criar um cliente', () => {
  const customer = Customer.create({
    name: 'Vini',
    cpf: '482.510.750-84',
  });
  expect(customer).toBeInstanceOf(Customer);
  expect(customer.id).toBeDefined();
  expect(customer.id).toBeInstanceOf(CustomerId);
  expect(customer.name).toBe('Vini');
  expect(customer.cpf.value).toBe('48251075084');

  const customer2 = new Customer({
    id: new CustomerId(customer.id.value),
    name: 'João',
    cpf: new Cpf('601.892.730-62'),
  });

  console.log(customer.equals(customer2));
});
