const config = require('../../../config/config.data.json').IMAP;
const imaps = require('imap-simple');
const imapUser = config.EMAIL;
const imapPassword = config.PASSWORD;
const imapHost = config.HOST;

export class EmailHelper {

  static async getEmailCode(user: any, type: string): Promise<string> {
    let code = '';
    let subject = '';
    let sep = '';
    let sep2 = '';
    const config = {
      imap: {
        user: imapUser,
        password: imapPassword,
        host: imapHost,
        port: 993,
        markSeen: true,
        authTimeout: 10000,
        tls: true,
        tlsOptions: {servername: imapHost},
      },
    };
    const fetchOptions = {
      bodies: ['TEXT'],
      markSeen: false,
      unseen: true,
      recent: true
    };
    switch (type) {
      case 'signup': {
        subject = 'Visme Registration Confirmation Pin:';
        sep = 'font-weight: 700;">';
        sep2 = '</span>';
        break;
      }
      case 'reset password': {
        subject = 'Restore Your Visme Password';
        sep = 'reset-password/';
        sep2 = '" style=3D';
        break;
      }
    }
    const searchCriteria = [
      'ALL',
      ['TO', await user.email],
      ['SUBJECT', subject],
    ];
    for (let i = 0; i < 20; i++) {
      if (code !== '') {
        break;
      }
      await imaps
          .connect(config)
          .then(
              async (connection: {
                openBox: (arg0: string) => Promise<any>;
                search: (
                    arg0: (string | string[])[],
                    arg1: { bodies: string[]; markSeen: boolean },
                ) => Promise<any>;
                end: (arg0: string) => Promise<any>;
              }) => {
                return await connection.openBox('INBOX').then(async () => {
                  return await connection
                      .search(searchCriteria, fetchOptions)
                      .then(async results => {
                        if (results.length >= 1) {
                          const temp = await results[results.length - 1].parts[0].body;
                          code = temp
                              .split(sep)[1]
                              .split(sep2)[0]
                              .trim();
                        }
                        return await connection.end(code);
                      });
                });
              },
          )
          .catch((error: any) => {
            console.log('ERROR: ', error);
          });
    }
    if (code === '') {
      throw new Error('Cannot get email');
    }
    return code;
  }
}