"use client";

import { useActionState, useState } from "react";
import { submitLogin, type LoginState } from "./actions";

interface LoginFormProps {
  /** Lets a page refresh mid-OTP-step stay on the OTP screen instead of resetting. */
  initialStep?: "credentials" | "otp";
  initialBrand?: string | null;
}

export function LoginForm({ initialStep = "credentials", initialBrand = null }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(submitLogin, {
    step: initialStep,
    brand: initialBrand,
    error: null,
  });
  // Overrides `state.step` only for the "Back to sign in" escape hatch —
  // submitting either form again lets the action's own step take over.
  const [forcedStep, setForcedStep] = useState<"credentials" | null>(null);

  const step = forcedStep ?? state.step;

  if (step === "otp") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
        <form
          action={formAction}
          onSubmit={() => setForcedStep(null)}
          className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-8 shadow-sm"
        >
          <h1 className="mb-1 text-lg font-semibold text-neutral-900">Enter verification code</h1>
          <p className="mb-6 text-sm text-neutral-500">
            We generated a one-time code for{state.brand ? ` ${state.brand}` : " your brand"}.
          </p>

          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-neutral-700">
              Verification code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              required
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm tracking-widest text-neutral-900 focus:border-neutral-500 focus:outline-none"
            />
          </div>

          {state.error && (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-6 w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Verifying…" : "Verify"}
          </button>

          <button
            type="button"
            onClick={() => setForcedStep("credentials")}
            className="mt-3 w-full text-center text-sm text-neutral-500 hover:text-neutral-700"
          >
            Back to sign in
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <form
        action={formAction}
        onSubmit={() => setForcedStep(null)}
        className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-8 shadow-sm"
      >
        <h1 className="mb-1 text-lg font-semibold text-neutral-900">Brand Partner Portal</h1>
        <p className="mb-6 text-sm text-neutral-500">Sign in to manage your catalog.</p>

        <div className="space-y-4">
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-neutral-700">
              Brand
            </label>
            <input
              id="brand"
              name="brand"
              type="text"
              autoComplete="off"
              required
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="off"
              required
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-none"
            />
          </div>
        </div>

        {forcedStep === null && state.error && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
