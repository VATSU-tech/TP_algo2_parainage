import type { FormEvent } from "react";
import type { Client, ClientFormState, PurchaseFormState, RelationFormState } from "../types/app";

type FormsSectionProps = {
  clients: Client[];
  isAdmin: boolean;
  formMessage: string;
  clientForm: ClientFormState;
  relationForm: RelationFormState;
  purchaseForm: PurchaseFormState;
  onClientSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onRelationSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onPurchaseSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClientNameChange: (value: string) => void;
  onClientEmailChange: (value: string) => void;
  onClientCityChange: (value: string) => void;
  onClientJoinedAtChange: (value: string) => void;
  onRelationParrainChange: (value: number) => void;
  onRelationFilleulChange: (value: number) => void;
  onPurchaseClientChange: (value: number) => void;
  onPurchaseAmountChange: (value: string) => void;
  onPurchaseDateChange: (value: string) => void;
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
              <input
                value={clientForm.name}
                onChange={(event) => onClientNameChange(event.target.value)}
                placeholder="Ex: Amine Diallo"
                disabled={!isAdmin}
              />
            </label>
            <label>
              Email
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
              <input
                value={clientForm.city}
                onChange={(event) => onClientCityChange(event.target.value)}
                placeholder="Ex: Paris"
                disabled={!isAdmin}
              />
            </label>
            <label>
              Date d'inscription
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
              <select
                value={relationForm.parrainId}
                onChange={(event) => onRelationParrainChange(Number(event.target.value))}
                disabled={!isAdmin}
              >
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Filleul
              <select
                value={relationForm.filleulId}
                onChange={(event) => onRelationFilleulChange(Number(event.target.value))}
                disabled={!isAdmin}
              >
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
              <select
                value={purchaseForm.clientId}
                onChange={(event) => onPurchaseClientChange(Number(event.target.value))}
                disabled={!isAdmin}
              >
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Montant ($)
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

      {!isAdmin ? (
        <p className="notice notice--warn">
          Mode lecture seule: connecte-toi en administrateur pour ajouter des données.
        </p>
      ) : null}

      {formMessage ? <p className="alert">{formMessage}</p> : null}
    </section>
  );
}
