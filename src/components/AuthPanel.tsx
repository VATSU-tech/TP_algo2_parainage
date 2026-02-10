import type { FormEvent } from "react";
import type { AuthUser, LoginFormState, Role } from "../types/app";

type AuthPanelProps = {
  currentUser: AuthUser | null;
  roleLabels: Record<Role, string>;
  authMessage: string;
  loginForm: LoginFormState;
  onLoginSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onLogout: () => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
};

export default function AuthPanel({
  currentUser,
  roleLabels,
  authMessage,
  loginForm,
  onLoginSubmit,
  onLogout,
  onEmailChange,
  onPasswordChange,
}: AuthPanelProps) {
  return (
    <div className="panel">
      <h3>Authentification</h3>
      {currentUser ? (
        <div className="auth-card">
          <div>
            <p className="card__label">Connecté en tant que</p>
            <p className="card__value">{currentUser.name}</p>
            <p className="card__hint">{currentUser.email}</p>
          </div>
          <span className={`badge badge--${currentUser.role}`}>{roleLabels[currentUser.role]}</span>
          <button type="button" className="button button--ghost" onClick={onLogout}>
            Se déconnecter
          </button>
        </div>
      ) : (
        <form onSubmit={onLoginSubmit} className="form">
          <label>
            Email
            <input
              type="email"
              value={loginForm.email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="admin@demo.fr"
            />
          </label>
          <label>
            Mot de passe
            <input
              type="password"
              value={loginForm.password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="admin123"
            />
          </label>
          <button type="submit" className="button button--primary">
            Se connecter
          </button>
        </form>
      )}
      {authMessage ? <p className="alert alert--mini">{authMessage}</p> : null}
    </div>
  );
}
