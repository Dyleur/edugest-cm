require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('./src/config/database');
const Admin = require('./src/models/Admin.model');
const Personne = require('./src/models/Personne.model');
const Enseignant = require('./src/models/Enseignant.model');
const Parents = require('./src/models/Parents.model');
const Eleve = require('./src/models/Eleve.model');
const AnneeAcademique = require('./src/models/AnneeAcademique.model');
const Cycle = require('./src/models/Cycle.model');
const Classe = require('./src/models/Classe.model');
const Salle = require('./src/models/Salle.model');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connecté à MySQL');

    await sequelize.sync({ force: true });
    console.log('Tables recréées');

    const hash = await bcrypt.hash('password123', 10);

    const admin = await Admin.create({
      nom: 'Super Admin',
      username: 'admin',
      password: hash,
      actif: 1,
      typeAdmin: 1
    });
    console.log('Admin créé : admin / password123');

    const dirPers = await Personne.create({
      nom: 'MBARGA',
      prenom: 'Paul',
      mobile: '+237677000001',
      typePersonne: 2,
      username: 'directeur',
      password: hash,
      idAdmin: admin.ID
    });
    console.log('Directeur créé : directeur / password123');

    const ensPers = await Personne.create({
      nom: 'FOUDA',
      prenom: 'Marie',
      mobile: '+237677000002',
      typePersonne: 1,
      username: 'enseignant',
      password: hash,
      idAdmin: admin.ID
    });
    console.log('Enseignant créé : enseignant / password123');

    await Enseignant.create({
      idPers: ensPers.idPers,
      idCours: 1,
      Actif: 1,
      idAdmin: admin.ID
    });

    const secPers = await Personne.create({
      nom: 'BILOA',
      prenom: 'Esther',
      mobile: '+237677000003',
      typePersonne: 3,
      username: 'secretaire',
      password: hash,
      idAdmin: admin.ID
    });
    console.log('Secrétaire créé : secretaire / password123');

    const parentPers = await Personne.create({
      nom: 'ATANGA',
      prenom: 'Paul',
      mobile: '+237677000004',
      typePersonne: 4,
      username: 'parent',
      password: hash,
      idAdmin: admin.ID
    });
    console.log('Parent créé : parent / password123');

    await AnneeAcademique.create({
      libelle: '2024-2025',
      periode: 'Septembre 2024 - Juin 2025',
      idAdmin: admin.ID
    });

    const cycle = await Cycle.create({
      libelle: 'Cours Moyen',
      description: 'CM1 & CM2',
      idAdmin: admin.ID
    });

    const classe = await Classe.create({
      libelle: 'CM2-A',
      idCycle: cycle.idCycle,
      idAdmin: admin.ID
    });

    const salle = await Salle.create({
      libelle: 'Salle 1',
      position: 'Batiment A',
      surface: '60m2',
      idClasse: classe.idClasse,
      actif: 1,
      idAdmin: admin.ID
    });

    const eleve = await Eleve.create({
      matricule: 2024001,
      nom: 'ATANGA',
      prenom: 'Lionel',
      dateNaissance: '2016-03-15',
      lieuNaissance: 'Yaounde',
      sexe: 1,
      langue: 'FR',
      actif: 1,
      idAdmin: admin.ID
    });

    await Parents.create({
      idPers: parentPers.idPers,
      matricule: eleve.matricule,
      idAdmin: admin.ID
    });

    console.log('\nDonnées de test insérées avec succès !');
    console.log('\nComptes de test :');
    console.log('  admin      / password123  (ADMIN)');
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
