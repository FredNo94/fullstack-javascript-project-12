import { hasLength, isNotEmpty, matchesField } from '@mantine/form';

export const signupValidation = {
  username: hasLength({ min: 3, max: 20 }, 'От 3 до 20 символов'),
  password: (value) => isNotEmpty('Обязательное поле')(value)
    || (value.length < 6 ? 'Не менее 6 символов' : null),
  confirmPassword: (value, values) => isNotEmpty('Обязательное поле')(value)
    || matchesField('password', 'Пароли должны совпадать')(value, values),
};
