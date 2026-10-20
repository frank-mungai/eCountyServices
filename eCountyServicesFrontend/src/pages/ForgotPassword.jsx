import { useState } from "react";
import { Link } from "react-router-dom";
import api, { errorMessage } from "../api";
import { confirmPhoneCode, normalizePhone, phoneErrorMessage, sendPhoneCode } from "../firebase";
import AuthLayout from "../components/AuthLayout";
import Field, { Alert, SubmitButton } from "../components/Field";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [phoneInput, setPhoneInput] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const sendCode = async (e) => {
    e?.preventDefault();
    setError("");
    setLoading(true);
    try {
      setConfirmation(await sendPhoneCode(normalizePhone(phoneInput)));
      setStep(2);
    } catch (err) {
      setError(phoneErrorMessage(err) || "Could not send the code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const idToken = await confirmPhoneCode(confirmation, code);
      const res = await api.post("/auth/reset-password", { idToken, newPassword });
      setInfo(res.data.message);
      setStep(3);
    } catch (err) {
      setError(phoneErrorMessage(err) || errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={step === 1 ? "Enter the phone number on your account." : undefined}
      footer={
        <Link to="/login" className="font-medium text-brand hover:underline">
          Back to sign in
        </Link>
      }
    >
      <div id="recaptcha-container" />

      {step === 1 && (
        <form onSubmit={sendCode} className="space-y-5">
          <Alert>{error}</Alert>
          <Field label="Phone number" id="phone" type="tel" placeholder="0712345678" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} />
          <SubmitButton loading={loading}>Send reset code</SubmitButton>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={reset} className="space-y-5">
          <Alert>{error}</Alert>
          <Field label="6-digit code" id="code" inputMode="numeric" maxLength={6} autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} />
          <Field label="New password" id="newPassword" type="password" minLength={8} autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <SubmitButton loading={loading}>Update password</SubmitButton>
          <button type="button" onClick={sendCode} disabled={loading} className="w-full text-center text-sm font-medium text-brand hover:underline disabled:opacity-60">
            Send a new code
          </button>
        </form>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <Alert kind="success">{info}</Alert>
          <Link to="/login" className="block w-full rounded-md bg-brand px-4 py-2.5 text-center font-medium text-white hover:bg-brand-dark">
            Sign in
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
