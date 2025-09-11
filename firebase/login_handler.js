import { signUp, login, logout } from './authentication/auth';

signUp('email@example.com', 'password123')
  .then(user => console.log('User signed up:', user))
  .catch(error => console.error(error));

login('email@example.com', 'password123')
  .then(user => console.log('User logged in:', user))
  .catch(error => console.error(error));

logout()
  .then(() => console.log('User logged out'))
  .catch(error => console.error(error));
