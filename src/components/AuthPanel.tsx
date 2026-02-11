import type { FormEvent } from "react"; // Type d'événement pour onSubmit.
import type { AuthUser, LoginFormState, Role } from "../types/app"; // Types d'auth.

type AuthPanelProps = {
  currentUser: AuthUser | null; // Utilisateur connecté ou null.
  roleLabels: Record<Role, string>; // Labels lisibles des rôles.
  authMessage: string; // Message d'erreur d'auth.
  loginForm: LoginFormState; // Valeurs du formulaire.
  onLoginSubmit: (event: FormEvent<HTMLFormElement>) => void; // Handler submit.
  onLogout: () => void; // Handler logout.
  onEmailChange: (value: string) => void; // Handler champ email.
  onPasswordChange: (value: string) => void; // Handler champ password.
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
      {/* Affichage conditionnel: connecté -> carte, sinon formulaire */}
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
            {/* Remonte la saisie au parent */}
            <input
              type="email"
              value={loginForm.email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="admin@demo.fr"
            />
          </label>
          <label>
            Mot de passe
            {/* Remonte la saisie au parent */}
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
      {/* Message d'erreur si besoin */}
      {authMessage ? <p className="alert alert--mini">{authMessage}</p> : null}
    </div>
  );
}

/*
Résumé pédagogique du composant:
- AuthPanel affiche soit l'état connecté, soit le formulaire de login.
- Il remonte les changements au parent via onEmailChange/onPasswordChange.
- Les badges de rôle utilisent le mapping roleLabels.
*/
