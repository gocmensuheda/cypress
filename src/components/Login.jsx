import { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const initialForm = {
  email: '',
  password: '',
  terms: false,
};

const errorMessages = {
  email: 'Geçerli bir e-posta adresi giriniz.',
  password: 'Şifre en az 4 karakter olmalıdır.',
};

export default function Login() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [isValid, setIsValid] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const emailValid = form.email.includes('@') && form.email.includes('.');
    const passwordValid = form.password.length >= 4;
    setIsValid(emailValid && passwordValid && form.terms);
  }, [form]);

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    if (name === 'email') {
      const emailValid = nextValue.includes('@') && nextValue.includes('.');
      setErrors((prev) => ({
        ...prev,
        email: emailValid ? '' : errorMessages.email,
      }));
    }

    if (name === 'password') {
      setErrors((prev) => ({
        ...prev,
        password: nextValue.length >= 4 ? '' : errorMessages.password,
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValid) return;

    axios
      .get('https://6540a96145bedb25bfc247b4.mockapi.io/api/login')
      .then((res) => {
        const user = res.data.find(
          (item) => item.password === form.password && item.email === form.email
        );
        if (user) {
          setForm(initialForm);
          setErrors({ email: '', password: '' });
          navigate('/success');
        }
      })
      .catch(() => {
        // İstek hatası durumunda kullanıcıya geri bildirim eklenebilir
      });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '420px' }}>
      <h2 className="mb-4 text-center">Login</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="E-posta adresinizi girin"
            type="email"
            value={form.email}
            onChange={handleChange}
            invalid={!!errors.email}
            data-cy="email-input"
          />
          {errors.email && <FormFeedback>{errors.email}</FormFeedback>}
        </FormGroup>

        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="Şifrenizi girin"
            type="password"
            value={form.password}
            onChange={handleChange}
            invalid={!!errors.password}
            data-cy="password-input"
          />
          {errors.password && <FormFeedback>{errors.password}</FormFeedback>}
        </FormGroup>

        <FormGroup check className="mb-3">
          <Input
            id="terms"
            name="terms"
            type="checkbox"
            checked={form.terms}
            onChange={handleChange}
            data-cy="terms-checkbox"
          />{' '}
          <Label htmlFor="terms" check>
            Şartları ve koşulları kabul ediyorum
          </Label>
        </FormGroup>

        <div className="text-center">
          <Button color="primary" disabled={!isValid} data-cy="submit-button">
            Login
          </Button>
        </div>
      </Form>
    </div>
  );
}