import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errorMessage } from "../api";
import AuthLayout from "../components/AuthLayout";
import Field, { Alert, SubmitButton } from "../components/Field";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "", idNumber: "", email: "", phone: "", password: "", confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    setLoading(true);
    try {
      const { confirm, ...payload } = form;
      const res = await api.post("/auth/register", payload);
      navigate("/login", { state: { message: res.data.message } });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="One account for all county services."
      footer={
        <>
          Already registered?{" "}
          <Link to="/login" className="font-medium text-brand hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Alert>{error}</Alert>
        <Field label="Full name" id="fullName" name="fullName" value={form.fullName} onChange={onChange} />
        <Field label="ID or passport number" id="idNumber" name="idNumber" value={form.idNumber} onChange={onChange} />
        <Field label="Email" id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={onChange} />
        <Field label="Phone number" id="phone" name="phone" type="tel" placeholder="0712345678" value={form.phone} onChange={onChange} />
        <Field label="Password" id="password" name="password" type="password" minLength={8} autoComplete="new-password" value={form.password} onChange={onChange} />
        <Field label="Confirm password" id="confirm" name="confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={onChange} />
        <SubmitButton loading={loading}>Create account</SubmitButton>
      </form>
    </AuthLayout>
  );
}
