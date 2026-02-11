import { useEffect, useMemo, useState } from "react"; // Hooks pour gérer l'état, les effets et les calculs mémorisés.
import type { FormEvent } from "react"; // Type d'événement pour typer les submit.
import { jsPDF } from "jspdf"; // Librairie d'export PDF côté client.
import "./sass/Style.scss"; // Styles globaux de l'application.

import AnalysisSection from "./components/AnalysisSection";
import AuthSection from "./components/AuthSection";
import Footer from "./components/Footer";
import FormsSection from "./components/FormsSection";
import GraphSection from "./components/GraphSection";
import Hero from "./components/Hero";
import StatsSection from "./components/StatsSection";
import TablesSection from "./components/TablesSection";
import TextSection from "./components/TextSection";

import { AUTH_KEY, DIRECT_RATE, INDIRECT_RATE, ROLE_LABELS, STORAGE_KEY, USERS } from "./config/app"; // Constantes de config.
import { seedData } from "./data/seed";
import type {
  AuthUser,
  Client,
  ClientFormState,
  DataState,
  LoginFormState,
  PurchaseFormState,
  RelationFormState,
} from "./types/app";
import { formatMoney, getNextId } from "./utils/format"; // Helpers de formatage et d'ID.
import { buildAdjacency, getCommissionTotal, hasCycle, wouldCreateCycle } from "./utils/graph"; // Algorithmes graphe.

export default function App() {
  // Chargement initial: on tente de récupérer les données du localStorage, sinon on prend le seed.
  const [data, setData] = useState<DataState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as DataState;
    } catch (error) {
      console.warn("Impossible de charger la sauvegarde locale", error);
    }
    return seedData;
  });

  // Même logique pour l'utilisateur connecté (auth locale).
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) return JSON.parse(raw) as AuthUser;
    } catch (error) {
      console.warn("Impossible de charger l'authentification locale", error);
    }
    return null;
  });

  // Persistance automatique des données métier dans le localStorage.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Persistance de l'utilisateur connecté (ou suppression si déconnexion).
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [currentUser]);

  // États locaux pour la sélection et les formulaires.
  const [selectedClientId, setSelectedClientId] = useState<number>(data.clients[0]?.id ?? 1);
  const [clientForm, setClientForm] = useState<ClientFormState>({
    name: "",
    email: "",
    city: "",
    joinedAt: "",
  });
  const [relationForm, setRelationForm] = useState<RelationFormState>({
    parrainId: data.clients[0]?.id ?? 1,
    filleulId: data.clients[1]?.id ?? 2,
  });
  const [purchaseForm, setPurchaseForm] = useState<PurchaseFormState>({
    clientId: data.clients[0]?.id ?? 1,
    amount: "",
    date: "",
  });
  const [formMessage, setFormMessage] = useState<string>(""); // Messages d'erreur/succès pour les formulaires.
  const [authMessage, setAuthMessage] = useState<string>(""); // Message d'erreur d'authentification.
  const [loginForm, setLoginForm] = useState<LoginFormState>({ email: "", password: "" }); // Champs du login.

  // Flag pratique: l'utilisateur est-il admin ?
  const isAdmin = currentUser?.role === "admin";

  // Calcul: total d'achats par client (Map clientId -> somme).
  const totalsByClient = useMemo(() => {
    const totals = new Map<number, number>();
    data.purchases.forEach((purchase) => {
      totals.set(purchase.clientId, (totals.get(purchase.clientId) ?? 0) + purchase.amount);
    });
    return totals;
  }, [data.purchases]);

  // Construction de la liste d'adjacence à partir des relations parrain -> filleul.
  const adjacency = useMemo(() => buildAdjacency(data.relations), [data.relations]);

  // Calcul des commissions pour le client sélectionné (direct + indirect).
  const selectedCommission = useMemo(
    () => getCommissionTotal(selectedClientId, adjacency, totalsByClient, DIRECT_RATE, INDIRECT_RATE),
    [selectedClientId, adjacency, totalsByClient]
  );

  // Préparation des arêtes pondérées pour le graphe 2D.
  const graphEdges = useMemo(() => {
    return data.relations.map((relation) => ({
      ...relation,
      weight: (totalsByClient.get(relation.filleulId) ?? 0) * DIRECT_RATE,
    }));
  }, [data.relations, totalsByClient]);

  // Positionnement circulaire des nœuds pour l'affichage SVG.
  const graphPositions = useMemo(() => {
    const width = 640;
    const height = 360;
    const radius = 140;
    const centerX = width / 2;
    const centerY = height / 2;

    return data.clients.map((client, index) => {
      const angle = (index / data.clients.length) * Math.PI * 2 - Math.PI / 2;
      return {
        id: client.id,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
  }, [data.clients]);

  // Top 5 clients les plus rentables (tri décroissant).
  const topClients = useMemo(() => {
    return data.clients
      .map((client) => {
        const commission = getCommissionTotal(client.id, adjacency, totalsByClient, DIRECT_RATE, INDIRECT_RATE);
        return {
          client,
          total: commission.total,
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [data.clients, adjacency, totalsByClient]);

  // Version texte du graphe (parrain -> liste des filleuls + commissions directes).
  const adjacencyList = useMemo(() => {
    return data.clients
      .map((client) => {
        const children = data.relations.filter((relation) => relation.parrainId === client.id);
        if (!children.length) return `${client.name} -> (aucun filleul)`;
        const detail = children
          .map((relation) => {
            const child = data.clients.find((item) => item.id === relation.filleulId);
            const weight = (totalsByClient.get(relation.filleulId) ?? 0) * DIRECT_RATE;
            return `${child?.name ?? relation.filleulId} (${formatMoney(weight)})`;
          })
          .join(", ");
        return `${client.name} -> ${detail}`;
      })
      .join("\n");
  }, [data.clients, data.relations, totalsByClient]);

  // Somme totale des achats du réseau.
  const totalNetworkSales = useMemo(
    () => Array.from(totalsByClient.values()).reduce((sum, value) => sum + value, 0),
    [totalsByClient]
  );

  // Détection de cycle dans le graphe (cohérence du réseau).
  const cycleDetected = useMemo(() => hasCycle(adjacency), [adjacency]);

  // Recherche du client actuellement sélectionné.
  const selectedClient = data.clients.find((client) => client.id === selectedClientId);

  // Gestion de l'authentification (login).
  const handleLogin = (event: FormEvent) => {
    event.preventDefault();
    setAuthMessage("");
    const email = loginForm.email.trim().toLowerCase();
    const password = loginForm.password;
    const user = USERS.find((item) => item.email === email && item.password === password);
    if (!user) {
      setAuthMessage("Identifiants invalides. Réessaie avec un compte de démo.");
      return;
    }
    const { password: _password, ...authUser } = user;
    setCurrentUser(authUser);
    setLoginForm({ email: "", password: "" });
  };

  // Déconnexion simple: on efface l'utilisateur.
  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Export d'un rapport PDF (résumé + top + détail + graphe textuel).
  const handleExportPdf = () => {
    const doc = new jsPDF();
    let y = 14;

    doc.setFontSize(16);
    doc.text("Rapport - Parrainage & Commissions", 14, y);
    y += 8;

    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleDateString("fr-FR")}`, 14, y);
    y += 6;
    doc.text(
      `Clients: ${data.clients.length} | Relations: ${data.relations.length} | Achats: ${data.purchases.length}`,
      14,
      y
    );
    y += 6;
    doc.text(`Commission directe: ${DIRECT_RATE * 100}% | indirecte: ${INDIRECT_RATE * 100}%`, 14, y);
    y += 8;

    doc.setFontSize(13);
    doc.text("Synthèse", 14, y);
    y += 6;
    doc.setFontSize(11);
    doc.text(`Ventes réseau: ${formatMoney(totalNetworkSales)}`, 14, y);
    y += 6;
    doc.text(`Cycle détecté: ${cycleDetected ? "Oui" : "Non"}`, 14, y);
    y += 8;

    doc.setFontSize(13);
    doc.text("Top 5 clients rentables", 14, y);
    y += 6;
    doc.setFontSize(11);
    topClients.forEach(({ client, total }, index) => {
      doc.text(`${index + 1}. ${client.name} - ${formatMoney(total)}`, 14, y);
      y += 5;
    });
    y += 4;

    doc.setFontSize(13);
    doc.text("Détail parrain sélectionné", 14, y);
    y += 6;
    doc.setFontSize(11);
    doc.text(`Parrain: ${selectedClient?.name ?? "-"}`, 14, y);
    y += 5;
    doc.text(`Direct: ${formatMoney(selectedCommission.directTotal)}`, 14, y);
    y += 5;
    doc.text(`Indirect: ${formatMoney(selectedCommission.indirectTotal)}`, 14, y);
    y += 5;
    doc.text(`Total: ${formatMoney(selectedCommission.total)}`, 14, y);
    y += 8;

    doc.setFontSize(13);
    doc.text("Représentation textuelle du graphe", 14, y);
    y += 6;
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(adjacencyList, 180);
    lines.forEach((line: string) => {
      if (y > 280) {
        doc.addPage();
        y = 14;
      }
      doc.text(line, 14, y);
      y += 4;
    });

    doc.save(`rapport-parrainage-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Ajout d'un client via le formulaire.
  const handleClientSubmit = (event: FormEvent) => {
    event.preventDefault();
    setFormMessage("");

    if (!isAdmin) {
      setFormMessage("Accès refusé: seuls les administrateurs peuvent ajouter des données.");
      return;
    }

    if (!clientForm.name.trim() || !clientForm.email.trim()) {
      setFormMessage("Nom et email sont obligatoires pour ajouter un client.");
      return;
    }

    // Construction de l'objet client (avec valeurs par défaut).
    const newClient: Client = {
      id: getNextId(data.clients),
      name: clientForm.name.trim(),
      email: clientForm.email.trim(),
      city: clientForm.city.trim() || "Ville inconnue",
      joinedAt: clientForm.joinedAt || new Date().toISOString().slice(0, 10),
    };

    // Mise à jour immuable de l'état global.
    setData((prev) => ({
      ...prev,
      clients: [...prev.clients, newClient],
    }));

    setClientForm({ name: "", email: "", city: "", joinedAt: "" });
    setSelectedClientId(newClient.id);
  };

  // Ajout d'une relation parrain/filleul avec contrôle d'erreurs.
  const handleRelationSubmit = (event: FormEvent) => {
    event.preventDefault();
    setFormMessage("");

    if (!isAdmin) {
      setFormMessage("Accès refusé: seuls les administrateurs peuvent ajouter des données.");
      return;
    }

    if (relationForm.parrainId === relationForm.filleulId) {
      setFormMessage("Un client ne peut pas se parrainer lui-même.");
      return;
    }

    // Vérifie si la relation existe déjà.
    const exists = data.relations.some(
      (relation) =>
        relation.parrainId === relationForm.parrainId && relation.filleulId === relationForm.filleulId
    );

    if (exists) {
      setFormMessage("Cette relation existe déjà.");
      return;
    }

    // Empêche la création d'un cycle dans le graphe.
    if (wouldCreateCycle(relationForm.parrainId, relationForm.filleulId, adjacency)) {
      setFormMessage("Cette relation créerait un cycle dans le graphe. Relation refusée.");
      return;
    }

    // Création de la relation validée.
    const newRelation = {
      id: getNextId(data.relations),
      parrainId: relationForm.parrainId,
      filleulId: relationForm.filleulId,
    };

    // Mise à jour immuable des relations.
    setData((prev) => ({
      ...prev,
      relations: [...prev.relations, newRelation],
    }));
  };

  // Ajout d'un achat (montant + date).
  const handlePurchaseSubmit = (event: FormEvent) => {
    event.preventDefault();
    setFormMessage("");

    if (!isAdmin) {
      setFormMessage("Accès refusé: seuls les administrateurs peuvent ajouter des données.");
      return;
    }

    // Conversion string -> number et validation.
    const amount = Number(purchaseForm.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      setFormMessage("Le montant doit être un nombre supérieur à 0.");
      return;
    }

    // Construction de l'achat avec date par défaut.
    const newPurchase = {
      id: getNextId(data.purchases),
      clientId: purchaseForm.clientId,
      amount,
      date: purchaseForm.date || new Date().toISOString().slice(0, 10),
    };

    // Mise à jour immuable de la liste d'achats.
    setData((prev) => ({
      ...prev,
      purchases: [...prev.purchases, newPurchase],
    }));
    setPurchaseForm({ clientId: purchaseForm.clientId, amount: "", date: "" });
  };

  // Liste des noms de filleuls directs/indirects (tri alphabétique).
  const directNames = selectedCommission.direct
    .map((id) => data.clients.find((client) => client.id === id)?.name ?? `#${id}`)
    .sort();
  const indirectNames = selectedCommission.indirect
    .map((id) => data.clients.find((client) => client.id === id)?.name ?? `#${id}`)
    .sort();

  // Génère les comptes de démo "email / password".
  const demoAccounts = USERS.map((user) => `${user.email} / ${user.password}`);

  return (
    <div className="app">
      {/* En-tête avec taux et export PDF */}
      <Hero
        directRate={DIRECT_RATE}
        indirectRate={INDIRECT_RATE}
        deadlineLabel="10/03/2026"
        onExport={handleExportPdf}
      />

      {/* Bloc d'authentification + rôles */}
      <AuthSection
        currentUser={currentUser}
        roleLabels={ROLE_LABELS}
        authMessage={authMessage}
        loginForm={loginForm}
        onLoginSubmit={handleLogin}
        onLogout={handleLogout}
        onEmailChange={(value) => setLoginForm((prev) => ({ ...prev, email: value }))}
        onPasswordChange={(value) => setLoginForm((prev) => ({ ...prev, password: value }))}
        demoAccounts={demoAccounts}
      />

      {/* Statistiques globales */}
      <StatsSection
        clientsCount={data.clients.length}
        relationsCount={data.relations.length}
        purchasesCount={data.purchases.length}
        totalNetworkSales={totalNetworkSales}
      />

      {/* Formulaires d'ajout (clients/relations/achats) */}
      <FormsSection
        clients={data.clients}
        isAdmin={isAdmin}
        formMessage={formMessage}
        clientForm={clientForm}
        relationForm={relationForm}
        purchaseForm={purchaseForm}
        onClientSubmit={handleClientSubmit}
        onRelationSubmit={handleRelationSubmit}
        onPurchaseSubmit={handlePurchaseSubmit}
        onClientNameChange={(value) => setClientForm((prev) => ({ ...prev, name: value }))}
        onClientEmailChange={(value) => setClientForm((prev) => ({ ...prev, email: value }))}
        onClientCityChange={(value) => setClientForm((prev) => ({ ...prev, city: value }))}
        onClientJoinedAtChange={(value) => setClientForm((prev) => ({ ...prev, joinedAt: value }))}
        onRelationParrainChange={(value) => setRelationForm((prev) => ({ ...prev, parrainId: value }))}
        onRelationFilleulChange={(value) => setRelationForm((prev) => ({ ...prev, filleulId: value }))}
        onPurchaseClientChange={(value) => setPurchaseForm((prev) => ({ ...prev, clientId: value }))}
        onPurchaseAmountChange={(value) => setPurchaseForm((prev) => ({ ...prev, amount: value }))}
        onPurchaseDateChange={(value) => setPurchaseForm((prev) => ({ ...prev, date: value }))}
      />

      {/* Analyse détaillée des commissions */}
      <AnalysisSection
        clients={data.clients}
        selectedClientId={selectedClientId}
        selectedClient={selectedClient}
        selectedCommission={selectedCommission}
        directNames={directNames}
        indirectNames={indirectNames}
        topClients={topClients}
        onClientSelect={setSelectedClientId}
      />

      {/* Visualisation 2D + 3D du graphe */}
      <GraphSection
        clients={data.clients}
        relations={data.relations}
        graphEdges={graphEdges}
        graphPositions={graphPositions}
        selectedClientId={selectedClientId}
        directIds={selectedCommission.direct}
        indirectIds={selectedCommission.indirect}
      />

      {/* Version texte du graphe + contrôle de cycle */}
      <TextSection adjacencyList={adjacencyList} cycleDetected={cycleDetected} />

      {/* Tables détaillées */}
      <TablesSection clients={data.clients} relations={data.relations} purchases={data.purchases} />

      {/* Pied de page */}
      <Footer />
    </div>
  );
}

/*
Résumé pédagogique du fichier:
- Ce composant App centralise l'état global (clients, relations, achats) + l'authentification.
- Les données sont persistées dans le localStorage (useEffect) et initialisées via seedData.
- Les calculs lourds sont mémorisés (useMemo): totaux par client, commissions, graphe, top 5, etc.
- Les handlers de formulaires valident les entrées, bloquent les actions non admin, puis mettent à jour l'état.
- L'UI est assemblée par sections (Hero, Auth, Stats, Forms, Analyse, Graph, Texte, Tables, Footer).
En bref: App est le "chef d'orchestre" qui calcule les données et les distribue aux composants enfants.
*/
