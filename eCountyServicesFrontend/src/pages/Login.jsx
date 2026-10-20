import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api, { errorMessage } from "../api";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import Field, { Alert, SubmitButton } from "../components/Field";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      signIn(res.data);
      navigate(res.data.user.role === "ADMIN" ? "/admin" : "/dashboard", { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Use the email and password of your account."
      footer={
        <>
          New here?{" "}
          <Link to="/register" className="font-medium text-brand hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        {location.state?.message && <Alert kind="success">{location.state.message}</Alert>}
        <Alert>{error}</Alert>

        <Field
          label="Email"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={onChange}
        />
        <Field
          label="Password"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={onChange}
        />

        <SubmitButton loading={loading}>Sign in</SubmitButton>
      </form>
    </AuthLayout>
  );
}
