"use client";

import LoginButton from "@/components/signin-buttons/LoginButton";
import { useSignIn } from "@/lib/services/auth/use-auth";
import { useEffect, useState } from "react";
import style from "./style.module.css";
import Link from "next/link";

export interface SignInProps {
  redirectTo: string | undefined;
}

function SignIn(props: SignInProps) {
  const [variant, setVariant] = useState<"signin" | "signup">("signin");
  const [isSignedUp, setIsSignedUp] = useState(false);
  const { signInMutation, signUpMutation, isLoading } = useSignIn({
    redirectTo: props.redirectTo,
    onSignUp: () => {
      setVariant("signin");
      setIsSignedUp(true);
    },
  });

  useEffect(() => {
    if (variant === "signup") {
      setIsSignedUp(false);
    }
  }, [variant]);

  return (
    <div className={`container d-flex justify-content-center align-items-center ${style.container}`}>
      <form
        method="POST"
        className="w-100"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);

          if (variant === "signin") {
            signInMutation.mutate({
              login: fd.get("email")?.toString()!,
              password: fd.get("password")?.toString()!,
            });
          }

          if (variant === "signup") {
            signUpMutation.mutate({
              email: fd.get("email")?.toString()!,
              password: fd.get("password")?.toString()!,
              password_confirmation: fd.get("password-confirm")?.toString()!,
              name: fd.get("name")?.toString()!,
              phone: fd.get("phone")?.toString()!,
              email_is_public: false,
              phone_is_public: false,
            });
          }
        }}
      >
        <div className="text-center mb-4 fs-2 fw-semibold">
          {isSignedUp ? (
            <div>Vous vous êtes inscrit avec succès ! Connectez-vous maintenant avec vos identifiants</div>
          ) : null}
          {variant === "signin" && !isSignedUp ? <div>Se connecter</div> : null}
          {variant === "signup" ? <div>S&lsquo;inscrire</div> : null}
        </div>

        <div className="form-outline mb-2">
          <input required name="email" type="email" id="email" className="form-control" disabled={isLoading} />
          <label className="form-label" htmlFor="email">
            Adresse e-mail
          </label>
        </div>

        {variant === "signup" ? (
          <>
            <div className="form-outline ">
              <input name="name" type="text" id="name" className="form-control" disabled={isLoading} />
              <div className="d-flex justify-content-between w-100">
                <label className="form-label" htmlFor="name">
                  Nom
                </label>
              </div>
            </div>
            <div className="form-outline ">
              <input name="phone" type="phone" id="phone" className="form-control" disabled={isLoading} />
              <div className="d-flex justify-content-between w-100">
                <label className="form-label" htmlFor="phone">
                  Phone
                </label>
              </div>
            </div>
          </>
        ) : null}

        <div className="form-outline ">
          <input required name="password" type="password" id="password" className="form-control" disabled={isLoading} />
          <div className="d-flex justify-content-between w-100">
            <label className="form-label" htmlFor="password">
              Mot de passe
            </label>
            {/* {variant === "signin" ? <a href="#!">Forgot password?</a> : null} */}
          </div>
        </div>

        {variant === "signup" ? (
          <div className="form-outline ">
            <input
              name="password-confirm"
              type="password"
              required
              id="password-confirm"
              className="form-control"
              disabled={isLoading}
            />
            <div className="d-flex justify-content-between w-100">
              <label className="form-label" htmlFor="password-confirm">
                Confirmez le mot de passe
              </label>
            </div>
          </div>
        ) : null}
        <div className="mb-4"></div>
        {variant === "signin" ? (
          <>
            <div className="mb-2">
              <LoginButton isLoading={isLoading} />
            </div>
            <div className="text-center mb-2">Vous n&lsquo;avez pas de compte ?</div>
            <button
              className="btn btn-outline-primary w-100"
              onClick={() => {
                setVariant("signup");
              }}
              disabled={isLoading}
            >
              S&lsquo;inscrire
            </button>
          </>
        ) : null}

        {variant === "signup" ? (
          <>
            <div className="mb-2">
              <LoginButton isLoading={isLoading} />
            </div>
            <div className="text-center mb-2">Vous avez déjà un compte ?</div>
            <button
              className="btn btn-outline-primary w-100"
              onClick={() => {
                setVariant("signin");
              }}
              disabled={isLoading}
            >
              Se connecter
            </button>
          </>
        ) : null}
        <div className={`${style["conditions"]} text-center mt-3`}>
          <Link href="/policy">Politique de confidentialité</Link>
          <br />
          <Link href="/rules">Règles et conditions</Link>
          <br />
          <br />
          Contactez-nous par email:
          <br /> mail@monbusiness.com
        </div>
      </form>
    </div>
  );
}

export default SignIn;
