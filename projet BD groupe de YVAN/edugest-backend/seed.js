require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, Personne, Enseignant, AnneeAcademique, Cycle, Classe, Salle, Eleve, Parents, Mode, NatureEpreuve, Discipline, VilleNaissance } = require('./src/models/index');

async function seed() {
  try {
    await sequelize.sync({ force: true });

    const hash = await bcrypt.hash('password123', 10);

    const adminPers = await Personne.create({ nom: 'Administrateur', prenom: 'Super', username: 'admin', password: hash, typePersonne: 2, mobile: '+237600000001' });
    const dirPers = await Personne.create({ nom: 'MBARGA', prenom: 'Paul', username: 'directeur', password: hash, typePersonne: 2, mobile: '+237600000002' });
    const ensPers = await Personne.create({ nom: 'FOUDA', prenom: 'Marie', username: 'enseignant', password: hash, typePersonne: 1, mobile: '+237600000003' });
    const secPers = await Personne.create({ nom: 'BILOA', prenom: 'Esther', username: 'secretaire', password: hash, typePersonne: 3, mobile: '+237600000004' });
    const parentPers = await Personne.create({ nom: 'ATANGA', prenom: 'Paul', username: 'parent', password: hash, typePersonne: 4, mobile: '+237600000005' });

    await Enseignant.create({ idPers: ensPers.idPers, idCours: 1, Actif: 1 });
    console.log('Comptes créés : admin|directeur|enseignant|secretaire|parent / password123');

    const annee = await AnneeAcademique.create({ libelle: '2024-2025', periode: 'Septembre 2024 - Juin 2025' });
    const cycle = await Cycle.create({ libelle: 'Cours Moyen', description: 'CM1 & CM2' });
    const classe = await Classe.create({ libelle: 'CM2-A', idCycle: cycle.idCycle });
    await Salle.create({ libelle: 'Salle 1', position: 'Batiment A', surface: '60m2', idClasse: classe.idClasse });

    const eleve = await Eleve.create({ matricule: 2024001, nom: 'ATANGA', prenom: 'Lionel', dateNaissance: '2016-03-15', lieuNaissance: 'Yaounde', sexe: 1, langue: 'FR', actif: 1 });
    await Parents.create({ idPers: parentPers.idPers, matricule: eleve.matricule, lienParente: 'PERE' });

    await NatureEpreuve.create({ libelle: 'Contrôle' });
    await NatureEpreuve.create({ libelle: 'Composition' });
    await NatureEpreuve.create({ libelle: 'Devoir' });
    await NatureEpreuve.create({ libelle: 'Examen' });

    await Mode.create({ libelle: 'Espèces', actif: 1 });
    await Mode.create({ libelle: 'Mobile Money', actif: 1 });
    await Mode.create({ libelle: 'Chèque', actif: 1 });
    await Mode.create({ libelle: 'Virement', actif: 1 });

    await Discipline.create({ libelle: 'Bavardage', points: 5 });
    await Discipline.create({ libelle: 'Retard', points: 3 });
    await Discipline.create({ libelle: 'Absence injustifiée', points: 10 });
    await Discipline.create({ libelle: 'Violence', points: 20 });

    await VilleNaissance.create({ nom: 'Yaounde' });
    await VilleNaissance.create({ nom: 'Douala' });
    await VilleNaissance.create({ nom: 'Bafoussam' });
    await VilleNaissance.create({ nom: 'Garoua' });

    console.log('\nDonnées de test insérées avec succès !');
    console.log('\nComptes de test :');
    console.log('  admin      / password123  (DIRECTEUR)');
    console.log('  directeur  / password123  (DIRECTEUR)');
    console.log('  enseignant / password123  (ENSEIGNANT)');
    console.log('  secretaire / password123  (SECRETAIRE)');
    console.log('  parent     / password123  (PARENT)');
    process.exit(0);
  } catch (error) {
    console.error('Erreur seed :', error.message);
    process.exit(1);
  }
}

seed();
