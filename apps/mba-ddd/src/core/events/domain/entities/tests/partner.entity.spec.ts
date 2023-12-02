import { Partner } from '../partner.entity';

test('deve criar um evento', () => {
  const partner = Partner.create({ name: 'Parceiro de teste' });
  const event = partner.initEvent({
    name: 'Evento de teste',
    description: 'Descrição do evento de teste',
    date: new Date(),
  });
  partner.changeName('Novo nome do parceiro');
  console.log(partner);
});
