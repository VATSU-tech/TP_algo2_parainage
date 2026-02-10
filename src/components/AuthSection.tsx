import type { FormEvent } from "react";
import type { AuthUser, LoginFormState, Role } from "../types/app";
import AuthPanel from "./AuthPanel";
import RolesPanel from "./RolesPanel";

type AuthSectionProps = {
  currentUser: AuthUser | null;
  roleLabels: Record<Role, string>;
  authMessage: string;
  loginForm: LoginFormState;
  onLoginSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onLogout: () => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  demoAccounts: string[];
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
      <RolesPanel demoAccounts={demoAccounts} />
    </section>
  );
}
