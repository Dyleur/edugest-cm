const API_URL = 'http://localhost:8080/api';

function getToken(): string | null {
  return localStorage.getItem('edugest_token');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Erreur serveur' }));
    throw new Error(errorData.message || `Erreur ${res.status}`);
  }

  if (res.status === 204) return undefined as unknown as T;
  return res.json();
}

// ---- Auth ----
export const authAPI = {
  login: (username: string, password: string) =>
    request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  me: () => request<any>('/auth/me'),
  changePassword: (data: { ancienMotDePasse: string; nouveauMotDePasse: string }) =>
    request<any>('/auth/password', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// ---- Annees Academiques ----
export const anneesAPI = {
  list: () => request<any[]>('/annees'),
  courante: () => request<any>('/annees/courante'),
  get: (id: number) => request<any>(`/annees/${id}`),
  create: (data: any) =>
    request<any>('/annees', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) =>
    request<any>(`/annees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<void>(`/annees/${id}`, { method: 'DELETE' }),
};

// ---- Trimestres ----
export const trimestresAPI = {
  list: () => request<any[]>('/trimestres'),
  get: (id: number) => request<any>(`/trimestres/${id}`),
  create: (data: any) =>
    request<any>('/trimestres', { method: 'POST', body: JSON.stringify(data) }),
};

// ---- Sessions ----
export const sessionsAPI = {
  list: () => request<any[]>('/sessions'),
  get: (id: number) => request<any>(`/sessions/${id}`),
  create: (data: any) =>
    request<any>('/sessions', { method: 'POST', body: JSON.stringify(data) }),
};

// ---- Cycles ----
export const cyclesAPI = {
  list: () => request<any[]>('/cycles'),
  get: (id: number) => request<any>(`/cycles/${id}`),
  create: (data: any) =>
    request<any>('/cycles', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) =>
    request<any>(`/cycles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<void>(`/cycles/${id}`, { method: 'DELETE' }),
};

// ---- Classes ----
export const classesAPI = {
  list: () => request<any[]>('/classes'),
  get: (id: number) => request<any>(`/classes/${id}`),
  getEleves: (id: number) => request<any[]>(`/classes/${id}/eleves`),
  create: (data: any) =>
    request<any>('/classes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) =>
    request<any>(`/classes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<void>(`/classes/${id}`, { method: 'DELETE' }),
};

// ---- Salles ----
export const sallesAPI = {
  list: () => request<any[]>('/salles'),
  create: (data: any) =>
    request<any>('/salles', { method: 'POST', body: JSON.stringify(data) }),
  setTitulaire: (id: number, data: any) =>
    request<any>(`/salles/${id}/titulaire`, { method: 'POST', body: JSON.stringify(data) }),
};

// ---- Eleves ----
export const elevesAPI = {
  list: () => request<any[]>('/eleves'),
  get: (matricule: string) => request<any>(`/eleves/${matricule}`),
  create: (data: any) =>
    request<any>('/eleves', { method: 'POST', body: JSON.stringify(data) }),
  update: (matricule: string, data: any) =>
    request<any>(`/eleves/${matricule}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (matricule: string) =>
    request<void>(`/eleves/${matricule}`, { method: 'DELETE' }),
  notes: (matricule: string) => request<any[]>(`/eleves/${matricule}/notes`),
  presences: (matricule: string) => request<any[]>(`/eleves/${matricule}/presences`),
  paiements: (matricule: string) => request<any[]>(`/eleves/${matricule}/paiements`),
  bulletin: (matricule: string) => request<any>(`/eleves/${matricule}/bulletin`),
  discipline: (matricule: string) => request<any[]>(`/eleves/${matricule}/discipline`),
  parents: (matricule: string) => request<any[]>(`/eleves/${matricule}/parents`),
  addParent: (matricule: string, data: any) =>
    request<any>(`/eleves/${matricule}/parents`, { method: 'POST', body: JSON.stringify(data) }),
};

// ---- Enseignants ----
export const enseignantsAPI = {
  list: () => request<any[]>('/enseignants'),
  get: (id: number) => request<any>(`/enseignants/${id}`),
  create: (data: any) =>
    request<any>('/enseignants', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) =>
    request<any>(`/enseignants/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<void>(`/enseignants/${id}`, { method: 'DELETE' }),
};

// ---- Cours ----
export const coursAPI = {
  list: () => request<any[]>('/cours'),
  get: (id: number) => request<any>(`/cours/${id}`),
  create: (data: any) =>
    request<any>('/cours', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) =>
    request<any>(`/cours/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// ---- Nature Epreuves ----
export const natureEpreuvesAPI = {
  list: () => request<any[]>('/nature-epreuves'),
  create: (data: any) =>
    request<any>('/nature-epreuves', { method: 'POST', body: JSON.stringify(data) }),
};

// ---- Epreuves ----
export const epreuvesAPI = {
  list: () => request<any[]>('/epreuves'),
  get: (id: number) => request<any>(`/epreuves/${id}`),
  create: (data: any) =>
    request<any>('/epreuves', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) =>
    request<any>(`/epreuves/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<void>(`/epreuves/${id}`, { method: 'DELETE' }),
};

// ---- Evaluations ----
export const evaluationsAPI = {
  create: (data: any) =>
    request<any>('/evaluations', { method: 'POST', body: JSON.stringify(data) }),
  getByEleve: (matricule: string) => request<any[]>(`/evaluations/eleve/${matricule}`),
  update: (id: number, data: any) =>
    request<any>(`/evaluations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// ---- Bulletins ----
export const bulletinsAPI = {
  getByEleve: (matricule: string, idSession: number) =>
    request<any>(`/bulletins/eleve/${matricule}/${idSession}`),
  getByClasse: (id: number) => request<any[]>(`/bulletins/classe/${id}`),
  getMoyenne: (matricule: string, idSession: number) =>
    request<any>(`/bulletins/moyenne/${matricule}/${idSession}`),
};

// ---- Emploi du Temps ----
export const edtAPI = {
  list: () => request<any[]>('/emploidutemps'),
  getByClasse: (id: number) => request<any[]>(`/emploidutemps/classe/${id}`),
  getByCours: (id: number) => request<any[]>(`/emploidutemps/cours/${id}`),
  create: (data: any) =>
    request<any>('/emploidutemps', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) =>
    request<any>(`/emploidutemps/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<void>(`/emploidutemps/${id}`, { method: 'DELETE' }),
};

// ---- Presences ----
export const presencesAPI = {
  appel: (data: any) =>
    request<any>('/presences/appel', { method: 'POST', body: JSON.stringify(data) }),
  setPresent: (data: any) =>
    request<any>('/presences/present', { method: 'PUT', body: JSON.stringify(data) }),
  setAbsent: (data: any) =>
    request<any>('/presences/absent', { method: 'PUT', body: JSON.stringify(data) }),
  getBySalleAnnee: (idSalle: number, idAcademi: number) =>
    request<any[]>(`/presences/salle/${idSalle}/annee/${idAcademi}`),
  getByEleve: (matricule: string) => request<any[]>(`/presences/eleve/${matricule}`),
  stats: () => request<any>('/presences/stats'),
  statsSalleAnnee: (idSalle: number, idAcademi: number) =>
    request<any>(`/presences/stats/salle/${idSalle}/annee/${idAcademi}`),
};

// ---- Inscriptions ----
export const inscriptionsAPI = {
  list: () => request<any[]>('/inscriptions'),
  getByEleve: (matricule: string) => request<any[]>(`/inscriptions/eleve/${matricule}`),
  create: (data: any) =>
    request<any>('/inscriptions', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) =>
    request<any>(`/inscriptions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<void>(`/inscriptions/${id}`, { method: 'DELETE' }),
};

// ---- Scolarites ----
export const scolaritesAPI = {
  list: () => request<any[]>('/scolarites'),
  create: (data: any) =>
    request<any>('/scolarites', { method: 'POST', body: JSON.stringify(data) }),
  getTranches: (id: number) => request<any[]>(`/scolarites/${id}/tranches`),
  addTranche: (id: number, data: any) =>
    request<any>(`/scolarites/${id}/tranches`, { method: 'POST', body: JSON.stringify(data) }),
};

// ---- Modes ----
export const modesAPI = {
  list: () => request<any[]>('/modes'),
};

// ---- Paiements ----
export const paiementsAPI = {
  list: () => request<any[]>('/paiements'),
  impayes: () => request<any[]>('/paiements/impayes'),
  stats: () => request<any>('/paiements/stats'),
  get: (id: number) => request<any>(`/paiements/${id}`),
  create: (data: any) =>
    request<any>('/paiements', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) =>
    request<any>(`/paiements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<void>(`/paiements/${id}`, { method: 'DELETE' }),
};

// ---- Discipline ----
export const disciplineAPI = {
  list: () => request<any[]>('/discipline'),
  types: () => request<any[]>('/discipline/types'),
  get: (id: number) => request<any>(`/discipline/${id}`),
  create: (data: any) =>
    request<any>('/discipline', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) =>
    request<any>(`/discipline/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  justifier: (id: number, data: any) =>
    request<any>(`/discipline/${id}/justif`, { method: 'POST', body: JSON.stringify(data) }),
};

// ---- Rapports ----
export const rapportsAPI = {
  effectifs: () => request<any>('/rapports/effectifs'),
  resultats: () => request<any>('/rapports/resultats'),
  presences: () => request<any>('/rapports/presences'),
  finances: () => request<any>('/rapports/finances'),
  discipline: () => request<any>('/rapports/discipline'),
};

// ---- Messages ----
export const messagesAPI = {
  send: (data: any) =>
    request<any>('/messages', { method: 'POST', body: JSON.stringify(data) }),
  mesMessages: () => request<any[]>('/messages/mes-messages'),
  all: () => request<any[]>('/messages'),
  get: (id: number) => request<any>(`/messages/${id}`),
  valider: (id: number) =>
    request<any>(`/messages/${id}/valider`, { method: 'PATCH' }),
  delete: (id: number) =>
    request<void>(`/messages/${id}`, { method: 'DELETE' }),
};

// ---- Dashboard Stats ----
export const dashboardAPI = {
  stats: () => request<any>('/dashboard/stats'),
};

// ---- Parents ----
export const parentsAPI = {
  enfants: (idParent: number) => request<any[]>(`/parents/${idParent}/enfants`),
};
