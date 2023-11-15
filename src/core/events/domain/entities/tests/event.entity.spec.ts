import exp from 'constants';
import { Event } from '../event.entity';
import { PartnerId } from '../partner.entity';

test('deve criar um evento', () => {
  const event = Event.create({
    name: 'Evento de teste',
    description: 'Descrição do evento de teste',
    date: new Date(),
    partner_id: new PartnerId(),
  });

  event.addSection({
    name: 'Seção de teste',
    description: 'Descrição da seção de teste',
    price: 1000,
    total_spots: 100,
  });

  expect(event.sections.size).toBe(1);
  expect(event.total_spots).toBe(100);
  const [section] = event.sections;
  expect(section.spots.size).toBe(100);
});

test('deve publicar todos os itens do evento', () => {
  const event = Event.create({
    name: 'Evento de teste',
    description: 'Descrição do evento de teste',
    date: new Date(),
    partner_id: new PartnerId(),
  });

  event.addSection({
    name: 'Seção de teste',
    description: 'Descrição da seção de teste',
    price: 1000,
    total_spots: 100,
  });

  event.addSection({
    name: 'Seção de teste 2',
    description: 'Descrição da seção de teste 2',
    price: 50,
    total_spots: 1000,
  });

  event.publishAll();
  expect(event.is_published).toBe(true);

  const [section1, section2] = event.sections.values();
  expect(section1.is_published).toBe(true);
  expect(section2.is_published).toBe(true);

  [...section1.spots, ...section2.spots].forEach((spot) => {
    expect(spot.is_published).toBe(true);
  });
});
