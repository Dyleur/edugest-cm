require('dotenv').config();
const bcrypt = require('bcrypt');
const {
  sequelize, Personne, Enseignant, AnneeAcademique, Cycle, Classe,
  Salle, Eleve, Parents, Mode, NatureEpreuve, Discipline, VilleNaissance,
  Trimestre, Session, Cours, Frequente, Scolarite, Tranches
} = require('./src/models/index');

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Tables créées avec succès.');

    const hash = await bcrypt.hash('password123', 10);

    // ── 1. Personnes (utilisateurs) ──
    const adminPers = await Personne.create({
      nom: 'Admin', prenom: 'Système', username: 'admin',
      password: hash, typePersonne: 2, mobile: '+237600000001'
    });
    const dirPers = await Personne.create({
      nom: 'Nkwi', prenom: 'Paul', username: 'directeur',
      password: hash, typePersonne: 2, mobile: '+237600000002'
    });
    const ensPers = await Personne.create({
      nom: 'Tchinda', prenom: 'Marie', username: 'enseignant',
      password: hash, typePersonne: 1, mobile: '+237600000003'
    });
    const secPers = await Personne.create({
      nom: 'Mbah', prenom: 'Alice', username: 'secretaire',
      password: hash, typePersonne: 3, mobile: '+237600000004'
    });
    const parentPers = await Personne.create({
      nom: 'Fotso', prenom: 'Jean', username: 'parent',
      password: hash, typePersonne: 4, mobile: '+237600000005'
    });
    console.log('✓ 5 comptes créés (admin|directeur|enseignant|secretaire|parent / password123)');

    // ── 2. Cours (matières) ──
    const coursMaths = await Cours.create({ libelle: 'Mathématiques', coefficient: 5 });
    const coursFrancais = await Cours.create({ libelle: 'Français', coefficient: 5 });
    const coursAnglais = await Cours.create({ libelle: 'Anglais', coefficient: 3 });
    const coursScience = await Cours.create({ libelle: 'Science & Éveil', coefficient: 3 });
    const coursHG = await Cours.create({ libelle: 'Histoire & Géographie', coefficient: 2 });
    const coursCivique = await Cours.create({ libelle: 'Éducation Civique', coefficient: 2 });
    const coursEPS = await Cours.create({ libelle: 'Éducation Physique', coefficient: 1 });
    const coursCreatrices = await Cours.create({ libelle: 'Activités Créatrices', coefficient: 1 });
    console.log('✓ 8 cours créés');

    // ── 3. Enseignant ──
    await Enseignant.create({ idPers: ensPers.idPers, idCours: coursMaths.idCours, Actif: 1 });
    console.log('✓ 1 enseignant créé');

    // ── 4. Année académique ──
    const annee = await AnneeAcademique.create({
      libelle: '2024-2025', periode: 'Septembre 2024 - Juin 2025'
    });
    console.log('✓ Année académique 2024-2025 créée');

    // ── 5. Cycles ──
    const cycleMaternelle = await Cycle.create({ libelle: 'Maternelle', description: 'PS, MS, GS' });
    const cycleCP = await Cycle.create({ libelle: 'Cours Préparatoire', description: 'SIL, CP' });
    const cycleElementaire = await Cycle.create({ libelle: 'Élémentaire', description: 'CE1, CE2' });
    const cycleMoyen = await Cycle.create({ libelle: 'Cours Moyen', description: 'CM1, CM2' });
    const cycleSecondaire = await Cycle.create({ libelle: 'Secondaire', description: '6e, 5e, 4e, 3e' });
    console.log('✓ 5 cycles créés');

    // ── 6. Classes ──
    const classesData = [
      { libelle: 'SIL-A', idCycle: cycleMaternelle.idCycle },
      { libelle: 'SIL-B', idCycle: cycleMaternelle.idCycle },
      { libelle: 'CP-A', idCycle: cycleCP.idCycle },
      { libelle: 'CP-B', idCycle: cycleCP.idCycle },
      { libelle: 'CE1-A', idCycle: cycleElementaire.idCycle },
      { libelle: 'CE1-B', idCycle: cycleElementaire.idCycle },
      { libelle: 'CE2-A', idCycle: cycleElementaire.idCycle },
      { libelle: 'CE2-B', idCycle: cycleElementaire.idCycle },
      { libelle: 'CM1-A', idCycle: cycleMoyen.idCycle },
      { libelle: 'CM1-B', idCycle: cycleMoyen.idCycle },
      { libelle: 'CM2-A', idCycle: cycleMoyen.idCycle },
      { libelle: 'CM2-B', idCycle: cycleMoyen.idCycle },
    ];
    const classes = [];
    for (const c of classesData) {
      classes.push(await Classe.create(c));
    }
    console.log('✓ 12 classes créées');

    // ── 7. Salles ──
    const sallesData = [
      { libelle: 'Salle SIL-A', position: 'Batiment A', surface: '60m2', idClasse: classes[0].idClasse },
      { libelle: 'Salle SIL-B', position: 'Batiment A', surface: '60m2', idClasse: classes[1].idClasse },
      { libelle: 'Salle CP-A', position: 'Batiment A', surface: '60m2', idClasse: classes[2].idClasse },
      { libelle: 'Salle CP-B', position: 'Batiment A', surface: '60m2', idClasse: classes[3].idClasse },
      { libelle: 'Salle CE1-A', position: 'Batiment A', surface: '60m2', idClasse: classes[4].idClasse },
      { libelle: 'Salle CE1-B', position: 'Batiment A', surface: '60m2', idClasse: classes[5].idClasse },
      { libelle: 'Salle CE2-A', position: 'Batiment A', surface: '60m2', idClasse: classes[6].idClasse },
      { libelle: 'Salle CE2-B', position: 'Batiment A', surface: '60m2', idClasse: classes[7].idClasse },
      { libelle: 'Salle CM1-A', position: 'Batiment A', surface: '60m2', idClasse: classes[8].idClasse },
      { libelle: 'Salle CM1-B', position: 'Batiment A', surface: '60m2', idClasse: classes[9].idClasse },
      { libelle: 'Salle CM2-A', position: 'Batiment A', surface: '60m2', idClasse: classes[10].idClasse },
      { libelle: 'Salle CM2-B', position: 'Batiment A', surface: '60m2', idClasse: classes[11].idClasse },
    ];
    const salles = [];
    for (const s of sallesData) {
      salles.push(await Salle.create(s));
    }
    console.log('✓ 12 salles créées');

    // ── 8. Natures d'épreuves ──
    await NatureEpreuve.create({ libelle: 'Contrôle' });
    await NatureEpreuve.create({ libelle: 'Composition' });
    await NatureEpreuve.create({ libelle: 'Devoir' });
    await NatureEpreuve.create({ libelle: 'Examen' });
    console.log('✓ 4 natures d\'épreuves créées');

    // ── 9. Trimestres ──
    const t1 = await Trimestre.create({ libelle: 'Trimestre 1', periode: 'Octobre 2024 - Décembre 2024', idAca: annee.idAnnee });
    const t2 = await Trimestre.create({ libelle: 'Trimestre 2', periode: 'Janvier 2025 - Mars 2025', idAca: annee.idAnnee });
    const t3 = await Trimestre.create({ libelle: 'Trimestre 3', periode: 'Avril 2025 - Juin 2025', idAca: annee.idAnnee });
    console.log('✓ 3 trimestres créés');

    // ── 10. Sessions ──
    await Session.create({ libelle: 'Session 1', description: 'Première séquence', idTrimestre: t1.idTrimestre });
    await Session.create({ libelle: 'Session 2', description: 'Deuxième séquence', idTrimestre: t2.idTrimestre });
    await Session.create({ libelle: 'Session 3', description: 'Troisième séquence', idTrimestre: t3.idTrimestre });
    console.log('✓ 3 sessions créées');

    // ── 11. Villes de naissance ──
    const villeYde = await VilleNaissance.create({ nom: 'Yaoundé' });
    await VilleNaissance.create({ nom: 'Douala' });
    await VilleNaissance.create({ nom: 'Bafoussam' });
    await VilleNaissance.create({ nom: 'Garoua' });
    console.log('✓ 4 villes de naissance créées');

    // ── 12. Élèves ──
    const elevesData = [
      { matricule: 2024001, nom: 'ATANGA', prenom: 'Lionel', dateNaissance: '2016-03-15', lieuNaissance: 'Yaounde', sexe: 1, langue: 'FR', actif: 1, idVilleNaissance: villeYde.idVille },
      { matricule: 2024002, nom: 'MBOCK', prenom: 'Tania', dateNaissance: '2015-07-22', lieuNaissance: 'Yaounde', sexe: 2, langue: 'FR', actif: 1, idVilleNaissance: villeYde.idVille },
      { matricule: 2024003, nom: 'NOMO', prenom: 'Paul', dateNaissance: '2016-01-10', lieuNaissance: 'Yaounde', sexe: 1, langue: 'FR', actif: 1, idVilleNaissance: villeYde.idVille },
      { matricule: 2024004, nom: 'SIMO', prenom: 'Alice', dateNaissance: '2015-11-30', lieuNaissance: 'Yaounde', sexe: 2, langue: 'FR', actif: 1, idVilleNaissance: villeYde.idVille },
      { matricule: 2024005, nom: 'TAGNE', prenom: 'Yvan', dateNaissance: '2016-05-18', lieuNaissance: 'Yaounde', sexe: 1, langue: 'EN', actif: 1, idVilleNaissance: villeYde.idVille },
      { matricule: 2024006, nom: 'KENGNE', prenom: 'Sara', dateNaissance: '2015-09-25', lieuNaissance: 'Yaounde', sexe: 2, langue: 'FR', actif: 1, idVilleNaissance: villeYde.idVille },
      { matricule: 2024007, nom: 'BILOA', prenom: 'Kevin', dateNaissance: '2016-08-12', lieuNaissance: 'Yaounde', sexe: 1, langue: 'FR', actif: 1, idVilleNaissance: villeYde.idVille },
      { matricule: 2024008, nom: 'FOPA', prenom: 'Rachel', dateNaissance: '2015-04-05', lieuNaissance: 'Yaounde', sexe: 2, langue: 'FR', actif: 1, idVilleNaissance: villeYde.idVille },
      { matricule: 2024009, nom: 'TCHINDA', prenom: 'Frank', dateNaissance: '2016-06-20', lieuNaissance: 'Yaounde', sexe: 1, langue: 'BIL', actif: 1, idVilleNaissance: villeYde.idVille },
      { matricule: 2024010, nom: 'NGA', prenom: 'Esther', dateNaissance: '2015-12-14', lieuNaissance: 'Yaounde', sexe: 2, langue: 'FR', actif: 1, idVilleNaissance: villeYde.idVille },
    ];
    const eleves = [];
    for (const e of elevesData) {
      eleves.push(await Eleve.create(e));
    }
    console.log('✓ 10 élèves créés');

    // ── 13. Frequente (inscriptions élèves dans les classes) ──
    const freqAssign = [
      { salleIdx: 0, eleveIdx: 0 },
      { salleIdx: 0, eleveIdx: 1 },
      { salleIdx: 1, eleveIdx: 2 },
      { salleIdx: 2, eleveIdx: 3 },
      { salleIdx: 3, eleveIdx: 4 },
      { salleIdx: 4, eleveIdx: 5 },
      { salleIdx: 5, eleveIdx: 6 },
      { salleIdx: 6, eleveIdx: 7 },
      { salleIdx: 7, eleveIdx: 8 },
      { salleIdx: 8, eleveIdx: 9 },
    ];
    for (const f of freqAssign) {
      await Frequente.create({
        idSalle: salles[f.salleIdx].idSalle,
        idAcademi: annee.idAnnee,
        matricule: eleves[f.eleveIdx].matricule
      });
    }
    console.log('✓ 10 inscriptions (Frequente) créées');

    // ── 14. Parent ──
    await Parents.create({
      idPers: parentPers.idPers,
      matricule: eleves[0].matricule,
      lienParente: 'PERE'
    });
    console.log('✓ 1 parent créé');

    // ── 15. Modes de paiement ──
    await Mode.create({ libelle: 'Espèces', actif: 1 });
    await Mode.create({ libelle: 'Mobile Money', actif: 1 });
    await Mode.create({ libelle: 'Chèque', actif: 1 });
    await Mode.create({ libelle: 'Virement', actif: 1 });
    console.log('✓ 4 modes de paiement créés');

    // ── 16. Disciplines ──
    await Discipline.create({ libelle: 'Bavardage', points: 5 });
    await Discipline.create({ libelle: 'Retard', points: 3 });
    await Discipline.create({ libelle: 'Absence injustifiée', points: 10 });
    await Discipline.create({ libelle: 'Violence', points: 20 });
    console.log('✓ 4 types de discipline créés');

    // ── 17. Scolarité (frais par cycle) ──
    const cycles = [cycleMaternelle, cycleCP, cycleElementaire, cycleMoyen, cycleSecondaire];
    const fraisData = [
      { libelle: 'Frais Maternelle', inscription: 15000, pension: 35000, idCycle: cycles[0].idCycle },
      { libelle: 'Frais Cours Préparatoire', inscription: 20000, pension: 55000, idCycle: cycles[1].idCycle },
      { libelle: 'Frais Élémentaire', inscription: 25000, pension: 75000, idCycle: cycles[2].idCycle },
      { libelle: 'Frais Cours Moyen', inscription: 30000, pension: 90000, idCycle: cycles[3].idCycle },
      { libelle: 'Frais Secondaire', inscription: 40000, pension: 110000, idCycle: cycles[4].idCycle },
    ];
    const scolarites = [];
    for (const f of fraisData) {
      scolarites.push(await Scolarite.create(f));
    }
    console.log('✓ 5 frais de scolarité créés');

    // ── 18. Tranches (échéancier de paiement) ──
    const tranchesConfig = [
      { scolariteIdx: 0, tranches: [
        { libelle: '1ère tranche', montant: 25000 },
        { libelle: '2ème tranche', montant: 25000 },
      ]},
      { scolariteIdx: 1, tranches: [
        { libelle: '1ère tranche', montant: 25000 },
        { libelle: '2ème tranche', montant: 25000 },
        { libelle: '3ème tranche', montant: 25000 },
      ]},
      { scolariteIdx: 2, tranches: [
        { libelle: '1ère tranche', montant: 35000 },
        { libelle: '2ème tranche', montant: 35000 },
        { libelle: '3ème tranche', montant: 30000 },
      ]},
      { scolariteIdx: 3, tranches: [
        { libelle: '1ère tranche', montant: 40000 },
        { libelle: '2ème tranche', montant: 40000 },
        { libelle: '3ème tranche', montant: 40000 },
      ]},
      { scolariteIdx: 4, tranches: [
        { libelle: '1ère tranche', montant: 50000 },
        { libelle: '2ème tranche', montant: 50000 },
        { libelle: '3ème tranche', montant: 50000 },
      ]},
    ];
    let trancheCount = 0;
    for (const config of tranchesConfig) {
      for (const t of config.tranches) {
        await Tranches.create({ libelle: t.libelle, montant: t.montant, idScolarite: scolarites[config.scolariteIdx].idScolarite });
        trancheCount++;
      }
    }
    console.log(`✓ ${trancheCount} tranches créées`);

    // ── Résumé ──
    console.log('\n═══════════════════════════════════════');
    console.log('  Données de test insérées avec succès !');
    console.log('═══════════════════════════════════════');
    console.log('\nComptes de test :');
    console.log('  admin      / password123  (ADMIN)');
    console.log('  directeur  / password123  (DIRECTEUR)');
    console.log('  enseignant / password123  (ENSEIGNANT)');
    console.log('  secretaire / password123  (SECRÉTAIRE)');
    console.log('  parent     / password123  (PARENT)');
    console.log('\nÉlèves créés :');
    for (const e of eleves) {
      console.log(`  ${e.matricule} — ${e.nom} ${e.prenom}`);
    }
    console.log('\nSeed terminé ✓');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur seed :', error.message);
    if (error.parent) console.error('Détail SQL :', error.parent.sqlMessage || error.parent.message);
    process.exit(1);
  }
}

seed();
