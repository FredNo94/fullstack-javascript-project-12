import { Formik, Form, Field } from 'formik';

export default function LoginForm() {
  const initialValues = {
    username: '',
    password: '',
  };

  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      <Form>
        <div>
          <h1>Войти</h1>
        </div>
        <div>
          <Field
            id="username"
            name="username"
            type="text"
            placeholder="Ваш ник"
            required
          />
        </div>
        <div>
          <Field
            id="password"
            name="password"
            type="password"
            placeholder="Ваш пароль"
            required
          />
        </div>
        <button type="submit">Войти</button>
      </Form>
    </Formik>
  );
}
