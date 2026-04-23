import { Formik, Form, Field, ErrorMessage } from 'formik';

export default function LoginForm() {
  const initialValues = {
    username: '',
    password: ''
  };

  const handleSubmit = () => {
    alert('Форма отправлена');
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <Form>
        <div>
          <h1>Войти</h1>
        </div>
        <div>
          <Field id="username" name="username" type="text" placeholder="Ваш ник" />
          <ErrorMessage name="username" component="div" style={{ color: 'red' }} />
        </div>
        <div>
          <Field id="password" name="password" type="password" placeholder="Ваш пароль" />
          <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
        </div>

        <button type="submit">Войти</button>
      </Form>
    </Formik>
  );
}
