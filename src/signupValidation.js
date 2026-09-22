import { hasLength, isNotEmpty, matchesField } from '@mantine/form';

export const signupValidation = (t) => ({
  username: hasLength({ min: 3, max: 20 }, t('validation.nameLength')),
  password: (value) => isNotEmpty(t('validation.required'))(value)
    || (value.length < 6 ? t('validation.passwordLength') : null),
  confirmPassword: (value, values) => isNotEmpty(t('validation.required'))(value)
    || matchesField('password', t('validation.passwordMatch'))(value, values),
});
