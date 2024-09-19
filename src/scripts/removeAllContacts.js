import { writeContacts } from '../utils/writeContacts.js';

const removeAllContacts = async () => {
  await writeContacts([]);
};

removeAllContacts();
