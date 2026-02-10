type RolesPanelProps = {
  demoAccounts: string[];
};

export default function RolesPanel({ demoAccounts }: RolesPanelProps) {
  return (
    <div className="panel">
      <h3>Rôles et accès</h3>
      <div className="role-list">
        <p>
          <strong>Administrateur:</strong> ajoute clients, relations, achats et exporte le PDF.
        </p>
        <p>
          <strong>Analyste:</strong> consulte les commissions, le graphe et les statistiques.
        </p>
        <p>
          <strong>Visiteur:</strong> accès lecture seule.
        </p>
      </div>
      <div className="demo-accounts">
        <p className="card__label">Comptes de démo</p>
        {demoAccounts.map((line) => (
          <p key={line} className="demo-line">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
