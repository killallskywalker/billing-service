import { DataSource } from 'typeorm';
import { BillingRecord } from '../../entity/billing-record.entity';

const seedData: Partial<BillingRecord>[] = [
  {
    email: 'george.bluth@yahoo.com.my',
    first_name: 'George',
    last_name: 'Bluth',
    photo_url: 'https://reqres.in/img/faces/1-image.jpg',
    product_code: '4000',
    location: 'West Malaysia',
    premium_paid: 521.03,
  },
  {
    email: 'janet.weaver@gmail.com',
    first_name: 'Janet',
    last_name: 'Weaver',
    photo_url: 'https://reqres.in/img/faces/2-image.jpg',
    product_code: '5000',
    location: 'East Malaysia',
    premium_paid: 0.0,
  },
  {
    email: 'emma.wong@mailsaur.net',
    first_name: 'Emma',
    last_name: 'Wong',
    photo_url: 'https://reqres.in/img/faces/3-image.jpg',
    product_code: '5000',
    location: 'East Malaysia',
    premium_paid: 1453.5,
  },
  {
    email: 'eve.holt@googlemail.co.uk',
    first_name: 'Eve',
    last_name: 'Holt',
    photo_url: 'https://reqres.in/img/faces/4-image.jpg',
    product_code: '5000',
    location: 'East Malaysia',
    premium_paid: 210.0,
  },
  {
    email: 'charles.morris@grabmart.com.my',
    first_name: 'Charles',
    last_name: 'Morris',
    photo_url: 'https://reqres.in/img/faces/5-image.jpg',
    product_code: '4000',
    location: 'West Malaysia',
    premium_paid: 700.0,
  },
  {
    email: 'tracey.remos@gmail.com',
    first_name: 'Tracey',
    last_name: 'Ramos',
    photo_url: 'https://reqres.in/img/faces/6-image.jpg',
    product_code: '4000',
    location: 'West Malaysia',
    premium_paid: 0.0,
  },
  {
    email: 'michael.jackson@sony.com',
    first_name: 'Michael',
    last_name: 'Jackson',
    photo_url: 'https://reqres.in/img/faces/7-image.jpg',
    product_code: '5000',
    location: 'East Malaysia',
    premium_paid: 0.0,
  },
  {
    email: 'gwen.ferguson@bluebottle.com',
    first_name: 'Gwendolyn',
    last_name: 'Ferguson',
    photo_url: 'https://reqres.in/img/faces/8-image.jpg',
    product_code: '4000',
    location: 'West Malaysia',
    premium_paid: 342.2,
  },
  {
    email: 'tobias.funke@docomo.co.jp',
    first_name: 'Tobias',
    last_name: 'Funke',
    photo_url: 'https://reqres.in/img/faces/9-image.jpg',
    product_code: '4000',
    location: 'East Malaysia',
    premium_paid: 95.55,
  },
  {
    email: 'byron.fields@gmail.com',
    first_name: 'Byron',
    last_name: 'Fields',
    photo_url: 'https://reqres.in/img/faces/10-image.jpg',
    product_code: '4000',
    location: 'West Malaysia',
    premium_paid: 0.0,
  },
  {
    email: 'george.edwards@yahoo.co.id',
    first_name: 'George',
    last_name: 'Edwards',
    photo_url: 'https://reqres.in/img/faces/11-image.jpg',
    product_code: '5000',
    location: 'East Malaysia',
    premium_paid: 105.9,
  },
  {
    email: 'rachel.winterson@altavista.com',
    first_name: 'Rachel',
    last_name: 'Winterson',
    photo_url: 'https://reqres.in/img/faces/12-image.jpg',
    product_code: '4000',
    location: 'West Malaysia',
    premium_paid: 0.0,
  },
];

export const run = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(BillingRecord);
  for (const record of seedData) {
    const existingRecord = await repo.findOne({
      where: { email: record.email },
    });

    if (!existingRecord) {
      await repo.save(record);
      console.log(`✅ Billing data inserted for ${record.email}`);
    } else {
      console.log(
        `🔑 Billing data already exists for ${record.email}, skipping...`,
      );
    }
  }
  console.log('✅ Billing data seeded!');
};
