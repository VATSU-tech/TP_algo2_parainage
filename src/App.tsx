import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { jsPDF } from "jspdf";
import "./sass/Style.scss";

import AnalysisSection from "./components/AnalysisSection";
import AuthSection from "./components/AuthSection";
import Footer from "./components/Footer";
import FormsSection from "./components/FormsSection";
import GraphSection from "./components/GraphSection";
import Hero from "./components/Hero";
import StatsSection from "./components/StatsSection";
import TablesSection from "./components/TablesSection";
import TextSection from "./components/TextSection";

import { AUTH_KEY, DIRECT_RATE, INDIRECT_RATE, ROLE_LABELS, STORAGE_KEY, USERS } from "./config/app";
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
import { formatMoney, getNextId } from "./utils/format";
import { buildAdjacency, getCommissionTotal, hasCycle, wouldCreateCycle } from "./utils/graph";

export default function App() {
  const [data, setData] = useState<DataState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as DataState;
    } catch (error) {
      console.warn("Impossible de charger la sauvegarde locale", error);
    }
    return seedData;
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) return JSON.parse(raw) as AuthUser;
    } catch (error) {
      console.warn("Impossible de charger l'authentification locale", error);
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [currentUser]);

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
  const [formMessage, setFormMessage] = useState<string>("");
  const [authMessage, setAuthMessage] = useState<string>("");
  const [loginForm, setLoginForm] = useState<LoginFormState>({ email: "", password: "" });

  const isAdmin = currentUser?.role === "admin";

  const totalsByClient = useMemo(() => {
    const totals = new Map<number, number>();
    data.purchases.forEach((purchase) => {
      totals.set(purchase.clientId, (totals.get(purchase.clientId) ?? 0) + purchase.amount);
    });
    return totals;
  }, [data.purchases]);

  const adjacency = useMemo(() => buildAdjacency(data.relations), [data.relations]);

  const selectedCommission = useMemo(
    () => getCommissionTotal(selectedClientId, adjacency, totalsByClient, DIRECT_RATE, INDIRECT_RATE),
    [selectedClientId, adjacency, totalsByClient]
  );

  const graphEdges = useMemo(() => {
    return data.relations.map((relation) => ({
      ...relation,
      weight: (totalsByClient.get(relation.filleulId) ?? 0) * DIRECT_RATE,
    }));
  }, [data.relations, totalsByClient]);

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

  const totalNetworkSales = useMemo(
    () => Array.from(totalsByClient.values()).reduce((sum, value) => sum + value, 0),
    [totalsByClient]
  );

  const cycleDetected = useMemo(() => hasCycle(adjacency), [adjacency]);

  const selectedClient = data.clients.find((client) => client.id === selectedClientId);

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

  const handleLogout = () => {
    setCurrentUser(null);
  };

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

    const newClient: Client = {
      id: getNextId(data.clients),
      name: clientForm.name.trim(),
      email: clientForm.email.trim(),
      city: clientForm.city.trim() || "Ville inconnue",
      joinedAt: clientForm.joinedAt || new Date().toISOString().slice(0, 10),
    };

    setData((prev) => ({
      ...prev,
      clients: [...prev.clients, newClient],
    }));

    setClientForm({ name: "", email: "", city: "", joinedAt: "" });
    setSelectedClientId(newClient.id);
  };

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

    const exists = data.relations.some(
      (relation) =>
        relation.parrainId === relationForm.parrainId && relation.filleulId === relationForm.filleulId
    );

    if (exists) {
      setFormMessage("Cette relation existe déjà.");
      return;
    }

    if (wouldCreateCycle(relationForm.parrainId, relationForm.filleulId, adjacency)) {
      setFormMessage("Cette relation créerait un cycle dans le graphe. Relation refusée.");
      return;
    }

    const newRelation = {
      id: getNextId(data.relations),
      parrainId: relationForm.parrainId,
      filleulId: relationForm.filleulId,
    };

    setData((prev) => ({
      ...prev,
      relations: [...prev.relations, newRelation],
    }));
  };

  const handlePurchaseSubmit = (event: FormEvent) => {
    event.preventDefault();
    setFormMessage("");

    if (!isAdmin) {
      setFormMessage("Accès refusé: seuls les administrateurs peuvent ajouter des données.");
      return;
    }

    const amount = Number(purchaseForm.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      setFormMessage("Le montant doit être un nombre supérieur à 0.");
      return;
    }

    const newPurchase = {
      id: getNextId(data.purchases),
      clientId: purchaseForm.clientId,
      amount,
      date: purchaseForm.date || new Date().toISOString().slice(0, 10),
    };

    setData((prev) => ({
      ...prev,
      purchases: [...prev.purchases, newPurchase],
    }));
    setPurchaseForm({ clientId: purchaseForm.clientId, amount: "", date: "" });
  };

  const directNames = selectedCommission.direct
    .map((id) => data.clients.find((client) => client.id === id)?.name ?? `#${id}`)
    .sort();
  const indirectNames = selectedCommission.indirect
    .map((id) => data.clients.find((client) => client.id === id)?.name ?? `#${id}`)
    .sort();

  const demoAccounts = USERS.map((user) => `${user.email} / ${user.password}`);

  return (
    <div className="app">
      <Hero
        directRate={DIRECT_RATE}
        indirectRate={INDIRECT_RATE}
        deadlineLabel="10/03/2026"
        onExport={handleExportPdf}
      />

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

      <StatsSection
        clientsCount={data.clients.length}
        relationsCount={data.relations.length}
        purchasesCount={data.purchases.length}
        totalNetworkSales={totalNetworkSales}
      />

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

      <GraphSection
        clients={data.clients}
        relations={data.relations}
        graphEdges={graphEdges}
        graphPositions={graphPositions}
        selectedClientId={selectedClientId}
        directIds={selectedCommission.direct}
        indirectIds={selectedCommission.indirect}
      />

      <TextSection adjacencyList={adjacencyList} cycleDetected={cycleDetected} />

      <TablesSection clients={data.clients} relations={data.relations} purchases={data.purchases} />

      <Footer />
    </div>
  );
}
