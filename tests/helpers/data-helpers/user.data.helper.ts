import { faker } from '@faker-js/faker';

const config = require('../../../config/config.data.json');

export class UserDataHelper {

  static async getUser(type: string) {
    switch (type) {
      case 'default_user': {
        return  {
          email: config.LOGIN.EMAIL,
          password: config.LOGIN.PASSWORD,
        }
      }
      case 'new_user': {
        return  {
          username: faker.person.firstName(),
          email: `e2e.test.user12345+${ faker.string.alphanumeric(5) }@gmail.com`,
          password: faker.internet.password(),
        }
      }
      case 'aut_user': {
        return  {
          username: config.RESETPASSWORD.USERNAME,
          email: config.RESETPASSWORD.EMAIL,
          password: faker.internet.password(),
        }
      }
    }
  }
}
