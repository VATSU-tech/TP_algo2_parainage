import type { FormEvent } from "react"; // Type d'événement pour submit.
import type { Client, ClientFormState, PurchaseFormState, RelationFormState } from "../types/app"; // Types des formulaires.

type FormsSectionProps = {
  clients: Client[]; // Liste pour alimenter les selects.
  isAdmin: boolean; // Détermine si les champs sont actifs.
  formMessage: string; // Message d'erreur/succès global.
  clientForm: ClientFormState; // Valeurs du formulaire client.
  relationForm: RelationFormState; // Valeurs du formulaire relation.
  purchaseForm: PurchaseFormState; // Valeurs du formulaire achat.
  onClientSubmit: (event: FormEvent<HTMLFormElement>) => void; // Handler submit client.
  onRelationSubmit: (event: FormEvent<HTMLFormElement>) => void; // Handler submit relation.
  onPurchaseSubmit: (event: FormEvent<HTMLFormElement>) => void; // Handler submit achat.
  onClientNameChange: (value: string) => void; // Handler champ nom.
  onClientEmailChange: (value: string) => void; // Handler champ email.
  onClientCityChange: (value: string) => void; // Handler champ ville.
  onClientJoinedAtChange: (value: string) => void; // Handler champ date.
  onRelationParrainChange: (value: number) => void; // Handler select parrain.
  onRelationFilleulChange: (value: number) => void; // Handler select filleul.
  onPurchaseClientChange: (value: number) => void; // Handler select client.
  onPurchaseAmountChange: (value: string) => void; // Handler champ montant.
  onPurchaseDateChange: (value: string) => void; // Handler champ date.
};

export default function FormsSection({
  clients,
  isAdmin,
  formMessage,
  clientForm,
  relationForm,
  purchaseForm,
  onClientSubmit,
  onRelationSubmit,
  onPurchaseSubmit,
  onClientNameChange,
  onClientEmailChange,
  onClientCityChange,
  onClientJoinedAtChange,
  onRelationParrainChange,
  onRelationFilleulChange,
  onPurchaseClientChange,
  onPurchaseAmountChange,
  onPurchaseDateChange,
}: FormsSectionProps) {
  return (
    <section>
      <div className="grid grid--forms">
        <div className="panel">
          <h3>Ajouter un client</h3>
          <form onSubmit={onClientSubmit} className="form">
            <label>
              Nom complet
              {/* Remonte la valeur au parent */}
              <input
                value={clientForm.name}
                onChange={(event) => onClientNameChange(event.target.value)}
                placeholder="Ex: Amine Diallo"
                disabled={!isAdmin}
              />
            </label>
            <label>
              Email
              {/* Remonte la valeur au parent */}
              <input
                type="email"
                value={clientForm.email}
                onChange={(event) => onClientEmailChange(event.target.value)}
                placeholder="prenom@entreprise.fr"
                disabled={!isAdmin}
              />
            </label>
            <label>
              Ville
              {/* Remonte la valeur au parent */}
              <input
                value={clientForm.city}
                onChange={(event) => onClientCityChange(event.target.value)}
                placeholder="Ex: Paris"
                disabled={!isAdmin}
              />
            </label>
            <label>
              Date d'inscription
              {/* Remonte la valeur au parent */}
              <input
                type="date"
                value={clientForm.joinedAt}
                onChange={(event) => onClientJoinedAtChange(event.target.value)}
                disabled={!isAdmin}
              />
            </label>
            <button type="submit" className="button button--primary" disabled={!isAdmin}>
              Ajouter
            </button>
          </form>
        </div>

        <div className="panel">
          <h3>Ajouter une relation</h3>
          <form onSubmit={onRelationSubmit} className="form">
            <label>
              Parrain
              {/* Conversion string -> number pour l'ID */}
              <select
                value={relationForm.parrainId}
                onChange={(event) => onRelationParrainChange(Number(event.target.value))}
                disabled={!isAdmin}
              >
                {/* Liste des clients pour le select */}
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Filleul
              {/* Conversion string -> number pour l'ID */}
              <select
                value={relationForm.filleulId}
                onChange={(event) => onRelationFilleulChange(Number(event.target.value))}
                disabled={!isAdmin}
              >
                {/* Liste des clients pour le select */}
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="button button--primary" disabled={!isAdmin}>
              Ajouter
            </button>
          </form>
        </div>

        <div className="panel">
          <h3>Ajouter un achat</h3>
          <form onSubmit={onPurchaseSubmit} className="form">
            <label>
              Client
              {/* Conversion string -> number pour l'ID */}
              <select
                value={purchaseForm.clientId}
                onChange={(event) => onPurchaseClientChange(Number(event.target.value))}
                disabled={!isAdmin}
              >
                {/* Liste des clients pour le select */}
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Montant ($)
              {/* Remonte la valeur textuelle au parent */}
              <input
                type="number"
                min="1"
                step="0.01"
                value={purchaseForm.amount}
                onChange={(event) => onPurchaseAmountChange(event.target.value)}
                placeholder="Ex: 250"
                disabled={!isAdmin}
              />
            </label>
            <label>
              Date
              {/* Remonte la valeur au parent */}
              <input
                type="date"
                value={purchaseForm.date}
                onChange={(event) => onPurchaseDateChange(event.target.value)}
                disabled={!isAdmin}
              />
            </label>
            <button type="submit" className="button button--primary" disabled={!isAdmin}>
              Ajouter
            </button>
          </form>
        </div>
      </div>

      {/* Avertissement si l'utilisateur n'est pas admin */}
      {!isAdmin ? (
        <p className="notice notice--warn">
          Mode lecture seule: connecte-toi en administrateur pour ajouter des données.
        </p>
      ) : null}

      {/* Message de validation/erreur */}
      {formMessage ? <p className="alert">{formMessage}</p> : null}
    </section>
  );
}

/*
Résumé pédagogique du composant:
- Contient 3 formulaires: client, relation, achat.
- Tous les champs sont contrôlés (value + onChange) et délégués au parent.
- Les selects convertissent leurs valeurs en number avant envoi.
- Affiche des messages de statut et bloque les champs si non-admin.
*/
