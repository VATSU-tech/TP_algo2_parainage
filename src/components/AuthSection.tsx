import type { FormEvent } from "react"; // Type d'événement pour onSubmit.
import type { AuthUser, LoginFormState, Role } from "../types/app"; // Types des données d'auth.
import AuthPanel from "./AuthPanel"; // Sous-composant: connexion / statut.
import RolesPanel from "./RolesPanel"; // Sous-composant: explication des rôles.

type AuthSectionProps = {
  currentUser: AuthUser | null; // Utilisateur connecté ou null.
  roleLabels: Record<Role, string>; // Labels lisibles des rôles.
  authMessage: string; // Message d'erreur/succès d'auth.
  loginForm: LoginFormState; // Valeurs du formulaire de login.
  onLoginSubmit: (event: FormEvent<HTMLFormElement>) => void; // Handler submit.
  onLogout: () => void; // Handler logout.
  onEmailChange: (value: string) => void; // Handler champ email.
  onPasswordChange: (value: string) => void; // Handler champ password.
  demoAccounts: string[]; // Liste "email / password" pour démo.
};

export default function AuthSection({
  currentUser,
  roleLabels,
  authMessage,
  loginForm,
  onLoginSubmit,
  onLogout,
  onEmailChange,
  onPasswordChange,
  demoAccounts,
}: AuthSectionProps) {
  return (
    <section className="grid grid--auth">
      {/* Panneau de connexion ou statut utilisateur */}
      <AuthPanel
        currentUser={currentUser}
        roleLabels={roleLabels}
        authMessage={authMessage}
        loginForm={loginForm}
        onLoginSubmit={onLoginSubmit}
        onLogout={onLogout}
        onEmailChange={onEmailChange}
        onPasswordChange={onPasswordChange}
      />
      {/* Panneau d'explication des rôles + comptes de démo */}
      <RolesPanel demoAccounts={demoAccounts} />
    </section>
  );
}

/*
Résumé pédagogique du composant:
- AuthSection regroupe AuthPanel (connexion) et RolesPanel (infos rôles).
- Il ne possède pas d'état interne: tout vient des props.
*/
