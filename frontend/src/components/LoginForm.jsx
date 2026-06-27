import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { setAuth } from "../slices/authSlice";
import authService from "../services/authService";
import avatarImg from "../assets/avatar.jpg";

const validationSchema = yup.object().shape({
  username: yup.string().required("Обязательное поле"),
  password: yup.string().required("Обязательное поле"),
});

const initialValues = {
  username: "",
  password: "",
};

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(null);

  const handleSubmit = async (values, { setSubmitting }) => {
    setAuthError(null);

    try {
      const { token, username } = await authService.login(values);
      dispatch(setAuth({ token, username }));
      navigate("/");
    } catch (error) {
      if (!error.response) {
        setAuthError(
          "Не удалось подключиться к серверу. Запустите make start в корне проекта.",
        );
        return;
      }

      if (error.response.status === 401) {
        setAuthError("Неверные имя пользователя или пароль");
      } else {
        setAuthError("Ошибка сервера");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      noValidate
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img
                  src={avatarImg}
                  className="rounded-circle"
                  alt="Войти"
                />
              </div>
              <Form className="col-12 col-md-6 mt-3 mt-md-0">
                <h1 className="text-center mb-4">Войти</h1>
                {authError && (
                  <Alert
                    variant="danger"
                    dismissible
                    onClose={() => setAuthError(null)}
                  >
                    {authError}
                  </Alert>
                )}
                <div className="form-floating mb-3">
                  <Field name="username">
                    {({ field, meta }) => (
                      <>
                        <input
                          {...field}
                          autoComplete="username"
                          id="username"
                          type="text"
                          className={`form-control${meta.touched && meta.error ? " is-invalid" : ""}`}
                          placeholder="Ваш ник"
                        />
                        {meta.touched && meta.error && (
                          <div className="invalid-feedback">{meta.error}</div>
                        )}
                      </>
                    )}
                  </Field>
                  <label htmlFor="username">Ваш ник</label>
                </div>
                <div className="form-floating mb-4">
                  <Field name="password">
                    {({ field, meta }) => (
                      <>
                        <input
                          {...field}
                          id="password"
                          type="password"
                          className={`form-control${meta.touched && meta.error ? " is-invalid" : ""}`}
                          placeholder="Ваш пароль"
                        />
                        {meta.touched && meta.error && (
                          <div className="invalid-feedback">{meta.error}</div>
                        )}
                      </>
                    )}
                  </Field>
                  <label htmlFor="password">
                    Пароль
                  </label>
                </div>
                <Button
                  type="submit"
                  variant="outline-primary"
                  disabled={isSubmitting}
                  className="w-100 mb-3"
                >
                  Войти
                </Button>
              </Form>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>Нет аккаунта?</span> <Link to="/signup">Регистрация</Link>
              </div>
            </div>
          </div>
      )}
    </Formik>
  );
}
