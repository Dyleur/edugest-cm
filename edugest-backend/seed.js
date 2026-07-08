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
const Frequente = require('./src/models/Frequente.model');
const Cours = require('./src/models/Cours.model');
const Epreuve = require('./src/models/Epreuve.model');
const Note = require('./src/models/Note.model');
const Paiement = require('./src/models/Paiement.model');
const Message = require('./src/models/Message.model');
const Discipline = require('./src/models/Discipline.model');
const EmploiDuTemps = require('./src/models/EmploiDuTemps.model');
const Scolarite = require('./src/models/Scolarite.model');
const Trimestre = require('./src/models/Trimestre.model');

const nomsCamerounais = [
  'ATANGA', 'MBARGA', 'FOUDA', 'BILOA', 'NGUEPI', 'TCHINDA', 'NKWI', 'SIMO', 'KENFACK',
  'TAGNE', 'WANDJI', 'KAMGA', 'DJOUGUE', 'MOMHA', 'NEBA', 'AKONO', 'ESSOME', 'MVONDO',
  'NGOA', 'SIGNE', 'BISSEK', 'EYEBE', 'MBOE', 'MVOGO', 'NKOULOU', 'ONANA', 'TSALA',
  'BEDIANG', 'MEDJO', 'MVONDO', 'NDENGUE', 'NSONGO', 'NTUDA', 'NYOBE', 'SALLA',
  'ABESSOLO', 'ANGONO', 'BALLA', 'BANGA', 'BATOUM', 'BELINGA', 'BENGA', 'BESSALA',
  'BETI', 'BIDJANGA', 'BIKIE', 'BILONG', 'BINDA', 'BISSECK', 'BITANG', 'BOMBA',
  'BONI', 'BOPDA', 'BOUBA', 'BOUDJOU', 'BOUTCHOUANG', 'BOYOMO', 'BYEME', 'CHABA',
  'CHIMI', 'DANG', 'DÉSIRÉ', 'DIBA', 'DIKONGUE', 'DIPANDA', 'DIWOUTA', 'DONGMO',
  'DONFACK', 'DOUANLA', 'DOUMBE', 'DZOU', 'EBENE', 'EBOA', 'EDJOU', 'EFFA',
  'EKOUE', 'EKWE', 'ELEM', 'ELLA', 'EMAH', 'EMANE', 'EMINI', 'ENYEGUE',
  'EPOUPA', 'ESSAMA', 'ESSOMBA', 'ETOUNDI', 'EYANGA', 'FANDO', 'FOGANG', 'FOMEKONG',
  'FONKOU', 'FOTSO', 'FOUMBOU', 'FOYET', 'GAMBO', 'GANGO', 'GAZELLE', 'GOULA',
  'GUEMO', 'GUIA', 'GUIRE', 'HABI', 'HAMA', 'HAYATOU', 'IKOUA', 'IYA',
  'JIOKAP', 'JOUBERT', 'KABEYENE', 'KADJI', 'KAMDEM', 'KAMGAING', 'KANA', 'KANGA',
  'KAPCHE', 'KAPTUE', 'KASSE', 'KEMAYOU', 'KENNE', 'KENFACK', 'KEUBOU', 'KEUMENI',
  'KWEDI', 'LAKE', 'LAMBE', 'LELE', 'LENGA', 'LIENOU', 'LINTANG', 'LISSOUCK',
  'LOUKA', 'MAHOP', 'MAKOUATE', 'MALO', 'MANDENG', 'MANGUE', 'MANGA', 'MANY',
  'MAPOKO', 'MARC', 'MASSOMA', 'MATCHINDA', 'MATIP', 'MAURICE', 'MBA', 'MBAH',
  'MBALA', 'MBALLA', 'MBANG', 'MBARGA', 'MBARGA', 'MBARGA', 'MBEZELE', 'MBIOCK',
  'MBOBDA', 'MBOE', 'MBOG', 'MBOME', 'MBONDO', 'MBONO', 'MBOUA', 'MBOUDA',
  'MBOULE', 'MBOUNDA', 'MEDJO', 'MEDOU', 'MEKOULOU', 'MELINGUI', 'MENDO', 'MENGA',
  'MENGET', 'MERLIN', 'MESSI', 'MESSINA', 'MEYONG', 'MEZUI', 'MIMBANG', 'MINLO',
  'MIRABEL', 'MISSONO', 'MITAT', 'MOBIO', 'MODJOM', 'MOHAMADOU', 'MOLI', 'MOMBA',
  'MOMO', 'MONTHE', 'MONTILLA', 'MOPA', 'MOTAPO', 'MOUNDI', 'MOURA', 'MOUSSA',
  'MOUTHE', 'MOUYEMO', 'MPACKO', 'MPAH', 'MPAKA', 'MPALA', 'MPANDE', 'MPAYE',
  'MPEKE', 'MPESSA', 'MPIANA', 'MPONDO', 'MPOUMI', 'MTOUMOU', 'MVOGO', 'MVOGO',
  'MVOGO', 'MVOGO', 'MVOGO', 'MVONDO', 'MVONDO', 'MVONDO', 'MVONDO', 'MWA',
  'NDAM', 'NDANG', 'NDE', 'NDEMBE', 'NDENGUE', 'NDIAYE', 'NDINGA', 'NDJIKE',
  'NDJOCK', 'NDJOG', 'NDOUMBE', 'NDOUMOU', 'NDOYE', 'NDZANA', 'NEBA', 'NEMBOT',
  'NGA', 'NGALA', 'NGALE', 'NGAMO', 'NGANDO', 'NGANG', 'NGAH', 'NGAKOSSO',
  'NGALE', 'NGALLI', 'NGAMO', 'NGANTE', 'NGASSAM', 'NGATA', 'NGAYA', 'NGEME',
  'NGO', 'NGOA', 'NGOE', 'NGOKO', 'NGOMPE', 'NGON', 'NGONO', 'NGOUCHEME',
  'NGOULE', 'NGOUNDA', 'NGOUNDOU', 'NGUEDIA', 'NGUEFFO', 'NGUELA', 'NGUEMO', 'NGUEPI',
  'NGUEPI', 'NGUESSAN', 'NGUIFFO', 'NGUM', 'NGWA', 'NIANG', 'NIDJOU', 'NIKO',
  'NINTCHOM', 'NJAH', 'NJE', 'NJIKE', 'NJIKI', 'NJOCK', 'NJOG', 'NJOKE',
  'NJONOU', 'NKAMGANG', 'NKE', 'NKENGUE', 'NKO', 'NKODO', 'NKOLE', 'NKOLO',
  'NKOM', 'NKONO', 'NKOULOU', 'NKOUMA', 'NKOUNDA', 'NKUMA', 'NKWI', 'NOAH',
  'NONO', 'NONGA', 'NOUKEU', 'NOUMBOU', 'NOUMI', 'NSANGOU', 'NSOM', 'NSONGO',
  'NTA', 'NTAM', 'NTCHAM', 'NTCHINDA', 'NTE', 'NTEPPE', 'NTIECHE', 'NTIMBA',
  'NTO', 'NTOLO', 'NTOM', 'NTOMBA', 'NTONGA', 'NTONO', 'NTSUDA', 'NTUDA',
  'NUMA', 'NYA', 'NYAMA', 'NYAMSI', 'NYANG', 'NYANGA', 'NYOBE', 'NYOMBA',
  'NYON', 'NYONKPA', 'NZALI', 'OBAMA', 'OBEN', 'OBENGA', 'OBIO', 'OBONO',
  'OBSAM', 'ODZANG', 'OGO', 'OKENE', 'OKIA', 'OKONO', 'OLE', 'OLINGA',
  'OLOMO', 'OMAM', 'OMBIONO', 'OMGBA', 'OMONGO', 'ONANA', 'ONGBWA', 'ONGOLO',
  'ONGUENE', 'ONJOU', 'OPPONG', 'OSSAMA', 'OSSANGO', 'OSSOMBA', 'OTABELA', 'OTOU',
  'OUAFIO', 'OUAMBA', 'OUANDJI', 'OUANG', 'OUARO', 'OUASSINON', 'OUATTARA', 'OUBA',
  'OUDOU', 'OUEMBA', 'OUGOU', 'OULE', 'OUM', 'OUNDA', 'OURAGA', 'OUSMANOU',
  'OUYA', 'OYANA', 'OYE', 'OYONO', 'OZIMO', 'PABON', 'PALE', 'PALLA',
  'PAM', 'PANDA', 'PANG', 'PANGUE', 'PANY', 'PATOU', 'PEDRO', 'PELE',
  'PEMBA', 'PENDA', 'PENE', 'PENGA', 'PEPIN', 'PETI', 'PEUPI', 'PIEDI',
  'PIERRE', 'PIME', 'PIPI', 'PLACIDE', 'POKAM', 'POKO', 'POLLO', 'PONDI',
  'PONGO', 'PONKA', 'POPA', 'POUA', 'POUEMI', 'POUGUE', 'POUKPOUK', 'POUNGOM',
  'POUOKAM', 'POUPON', 'POURE', 'POURI', 'POURNA', 'POWO', 'PRISO', 'PROSPER',
  'PUL', 'PUNCH', 'RABI', 'RABOU', 'RAOUL', 'RAPHAEL', 'RASSE', 'RATI',
  'RAUL', 'RAZAK', 'REMBE', 'RENAUD', 'RENÉ', 'RICO', 'RIGOBERT', 'RISSOM',
  'ROBERT', 'ROBIN', 'ROCH', 'RODRIGUE', 'ROGER', 'ROLAND', 'ROMARIC', 'RONALD',
  'ROQUE', 'ROSTAND', 'ROTH', 'ROUANE', 'ROUGA', 'ROUMBA', 'ROY', 'RUBEN',
  'RUFIN', 'SABI', 'SABINE', 'SACHA', 'SACK', 'SADO', 'SAFI', 'SAHA',
  'SAHOU', 'SAID', 'SAIDOU', 'SAKA', 'SALAKO', 'SALI', 'SALLA', 'SALOMON',
  'SALVADOR', 'SAMBA', 'SAMI', 'SAMUEL', 'SANDJON', 'SANDRA', 'SANDZO', 'SANGA',
  'SANI', 'SANOU', 'SANTOS', 'SAO', 'SARA', 'SARAH', 'SATURNE', 'SAVIGNAC',
  'SAWADOGO', 'SÉBASTIEN', 'SEDOU', 'SEGLA', 'SEIDOU', 'SEKA', 'SELINGUE', 'SELOUA',
  'SEMA', 'SEMBOU', 'SENI', 'SENKOU', 'SEPPE', 'SERGE', 'SERGIO', 'SERLIN',
  'SERMENT', 'SERVAIS', 'SETH', 'SEVIN', 'SIALI', 'SIBI', 'SIDIBE', 'SIDICK',
  'SIDONIE', 'SIGNE', 'SILA', 'SILAS', 'SILENCE', 'SILO', 'SILVA', 'SIMEON',
  'SIMON', 'SIMO', 'SIMPLICE', 'SINAP', 'SINDJO', 'SINOU', 'SIRI', 'SISSA',
  'SISSE', 'SITCHEPING', 'SOCK', 'SOH', 'SOHOU', 'SOKENG', 'SOKO', 'SOKOUDOU',
  'SOKPA', 'SOLIM', 'SOM', 'SOMBA', 'SOMEN', 'SOMLO', 'SONA', 'SONDII',
  'SONGA', 'SONGO', 'SONGUE', 'SONIA', 'SONKO', 'SONNA', 'SONO', 'SONTIA',
  'SOP', 'SOPP', 'SORELE', 'SORO', 'SOSSO', 'SOTI', 'SOUARE', 'SOUAYA',
  'SOUBOU', 'SOUGA', 'SOUGOU', 'SOUKA', 'SOULI', 'SOUM', 'SOUMAN', 'SOUMAROU',
  'SOUMIA', 'SOUN', 'SOUNG', 'SOUNKOU', 'SOUPA', 'SOURAKA', 'SOUSSO', 'SOUTI',
  'SOUZA', 'SUL', 'SULLY', 'SUNDI', 'SUPI', 'SUR', 'SUSAN', 'SY', 'SYLVAIN',
  'SYLVANUS', 'SYLVESTRE', 'SYLVIA', 'SYLVIE', 'SZ', 'TAA', 'TAABI', 'TAATI',
  'TABI', 'TABIS', 'TABOU', 'TACHE', 'TACHI', 'TADJOU', 'TAFACK', 'TAGNE',
  'TAGO', 'TAH', 'TAÏ', 'TAIGA', 'TAKAM', 'TAKANA', 'TAKAP', 'TAKEM',
  'TAKO', 'TAKOU', 'TAKU', 'TAL', 'TALA', 'TALEB', 'TALLA', 'TALLOM',
  'TAMBA', 'TAMBOU', 'TAMEKOU', 'TAMGA', 'TAMO', 'TAMON', 'TAMOUNT', 'TAMOUTCHE',
  'TAMOU', 'TAN', 'TANECK', 'TANGA', 'TANGI', 'TANKO', 'TANOU', 'TANTCHOU',
  'TAO', 'TAPAMO', 'TAPO', 'TAPSOBA', 'TAQUE', 'TAR', 'TARGA', 'TARI',
  'TARLA', 'TARPILGA', 'TASSOU', 'TATANG', 'TATI', 'TATOU', 'TATSINKOU', 'TAWA',
  'TAWAMBA', 'TAYE', 'TAYO', 'TCHABO', 'TCHAGNA', 'TCHAKOUNTE', 'TCHAKOUO', 'TCHALLA',
  'TCHAMBA', 'TCHAMENI', 'TCHANA', 'TCHANDA', 'TCHANG', 'TCHANGOU', 'TCHANTE', 'TCHAPDA',
  'TCHATCHOUA', 'TCHATCHOUANG', 'TCHATCHOUO', 'TCHATCHOUONG', 'TCHATCHOUO', 'TCHEDRE', 'TCHENDJOU', 'TCHENGA',
  'TCHETGNE', 'TCHIENGANG', 'TCHINDA', 'TCHINDE', 'TCHINDO', 'TCHINDU', 'TCHINHO', 'TCHINJE',
  'TCHINKE', 'TCHINLA', 'TCHINOU', 'TCHINTO', 'TCHINWO', 'TCHIO', 'TCHIOMBA', 'TCHITO',
  'TCHIWA', 'TCHIU', 'TCHO', 'TCHOBGOU', 'TCHOK', 'TCHOKO', 'TCHOKOM', 'TCHOKOU',
  'TCHOKOUA', 'TCHOKOUO', 'TCHOKOUONG', 'TCHOLA', 'TCHOLLO', 'TCHOMBA', 'TCHOMGOU', 'TCHOMI',
  'TCHOMO', 'TCHONANG', 'TCHONDA', 'TCHONG', 'TCHONKO', 'TCHONTCHOU', 'TCHOUA', 'TCHOUAKEU',
  'TCHOUMBA', 'TCHOUNDJEU', 'TCHOUPOU', 'TCHOUPO', 'TCHOUPOU', 'TCHOUPOUO', 'TCHOUPOUONG', 'TCHOUTA',
  'TCHOWE', 'TCHUINTE', 'TCHUINWO', 'TCHUO', 'TEGANG', 'TEGNIA', 'TEKE', 'TEKOU',
  'TELE', 'TELGA', 'TELI', 'TELKOM', 'TEM', 'TEMBOU', 'TEMCHE', 'TEMFACK',
  'TEMGA', 'TEMGOUA', 'TEMO', 'TEMON', 'TEMPA', 'TEMPA', 'TEMPOUA', 'TEN',
  'TENADE', 'TENDE', 'TENE', 'TENG', 'TENGUE', 'TENKEU', 'TENO', 'TENRO',
  'TENTCHOU', 'TEO', 'TEP', 'TEPE', 'TEPKA', 'TEPO', 'TEPON', 'TEPPA',
  'TEPPOU', 'TER', 'TERA', 'TERG', 'TERI', 'TERME', 'TERNA', 'TERRIER',
  'TERRO', 'TERTIUS', 'TESSI', 'TETA', 'TETANG', 'TETCHI', 'TETE', 'TETIA',
  'TETNO', 'TETOU', 'TETTE', 'TETU', 'TEU', 'TEUBOU', 'TEUGA', 'TEUKEU',
  'TEULEU', 'TEUMENI', 'TEUNOU', 'TEUSSI', 'TEUTIO', 'TEWA', 'TEWE', 'TEWO',
  'TEWOCHE', 'TEWOU', 'TEYA', 'TEYE', 'TEYOM', 'TÉZANG', 'THADDÉE', 'THAL',
  'THAN', 'THANG', 'THANI', 'THANNO', 'THEA', 'THÉLÈME', 'THÉO', 'THÉODORE',
  'THÉOGÈNE', 'THÉOPHANE', 'THÉOPHILE', 'THÉRÈSE', 'THÉSÉE', 'THI', 'THIAGO', 'THIBAULT',
  'THIERRY', 'THIMOTHÉ', 'THOMAS', 'THOMAS', 'THOMAS', 'THOMAS', 'THOMAS', 'THOMAS',
  'THOMAS', 'THOMAS', 'THOMAS', 'THOMAS', 'THOMAS', 'THOMAS', 'THOMAS', 'THOMAS',
  'THOMAS', 'THOMAS', 'THOMAS', 'THOMAS', 'THOMAS', 'THOMAS', 'THOMAS', 'THOMAS',
  'THOMAS', 'THOMAS', 'THOMAS', 'THOMAS', 'THOMAS', 'THOMAS', 'THOMAS', 'THOMAS'
];

const prenomsMasculins = [
  'Lionel', 'Paul', 'Jean', 'Pierre', 'Marc', 'André', 'Philippe', 'François',
  'Joseph', 'Michel', 'David', 'Eric', 'Alain', 'Patrick', 'Robert', 'Georges',
  'Simon', 'Victor', 'Daniel', 'Jacques', 'Emmanuel', 'Dominique', 'Benoît', 'Christian',
  'Guy', 'Marcel', 'Samuel', 'Vincent', 'Alexandre', 'Nicolas', 'Julien', 'Olivier',
  'Matthieu', 'Antoine', 'Louis', 'Charles', 'Gérard', 'Roland', 'Maurice', 'Bernard',
  'Félix', 'Lucien', 'Albert', 'René', 'Roger', 'Henri', 'Yves', 'Hervé',
  'Bertrand', 'Raymond', 'Honoré', 'Célestin', 'Théophile', 'Pascal', 'Cyprien', 'Séverin',
  'Alphonse', 'Eugène', 'Ferdinand', 'Gustave', 'Hamadou', 'Ibrahim', 'Moussa', 'Bouba',
  'Issa', 'Saïdou', 'Oumarou', 'Yaya', 'Nfor', 'Tabi', 'Tabe', 'Nkwain',
  'Mbah', 'Nkwi', 'Fotso', 'Tchinda', 'Zachée', 'Thomas', 'Fabrice', 'Joël',
  'Ludovic', 'Yannick', 'Brice', 'Cédric', 'Wilfried', 'Hermann', 'Landry', 'Aubin',
  'Calvin', 'Darrel', 'Dilan', 'Kevin', 'Loïc', 'Ryan', 'Steve', 'Williams'
];

const prenomsFeminins = [
  'Marie', 'Jeanne', 'Anne', 'Catherine', 'Françoise', 'Christine', 'Sylvie', 'Brigitte',
  'Jacqueline', 'Thérèse', 'Monique', 'Véronique', 'Nathalie', 'Sophie', 'Isabelle', 'Martine',
  'Florence', 'Valérie', 'Pascale', 'Chantal', 'Sandrine', 'Carole', 'Muriel', 'Esther',
  'Alice', 'Blanche', 'Marguerite', 'Josiane', 'Bernadette', 'Mireille', 'Claudine', 'Geneviève',
  'Diane', 'Rose', 'Paule', 'Odette', 'Simone', 'Louise', 'Henriette', 'Yvette',
  'Colette', 'Rolande', 'Micheline', 'Suzanne', 'Raymonde', 'Denise', 'Adèle', 'Julie',
  'Fidèle', 'Afiong', 'Ashu', 'Bih', 'Che', 'Chia', 'Chiabi', 'Frida',
  'Gladys', 'Hélène', 'Irene', 'Miriam', 'Nancy', 'Prisca', 'Ruth', 'Sarah',
  'Solange', 'Viviane', 'Amina', 'Fatima', 'Hadidja', 'Rabi', 'Safiya', 'Zara'
];

const localitesCameroun = [
  'Yaoundé', 'Douala', 'Garoua', 'Maroua', 'Bamenda', 'Bafoussam', 'Ngaoundéré', 'Bertoua',
  'Ebolowa', 'Kribi', 'Limbe', 'Kumbo', 'Buea', 'Kousséri', 'Mokolo', 'Kaélé',
  'Foumban', 'Foumbot', 'Dschang', 'Mbouda', 'Bafang', 'Nkongsamba', 'Loum', 'Manjo',
  'Edéa', 'Eséka', 'Mbalmayo', 'Mfou', 'Obala', 'Monatélé', 'Bafia', 'Mbandjock',
  'Sangmélima', 'Mvangan', 'Ambam', 'Oyem', 'Tcholliré', 'Rey Bouba', 'Poli', 'Guider',
  'Mora', 'Fontem', 'Kékem', 'Penja', 'Yabassi', 'Dibombari', 'Bonabéri', 'Deido'
];

const matieresPrimaire = [
  { libelle: 'Français', coefficient: 5 },
  { libelle: 'Mathématiques', coefficient: 5 },
  { libelle: 'Anglais', coefficient: 3 },
  { libelle: 'Sciences et Technologie', coefficient: 2 },
  { libelle: 'Histoire', coefficient: 1 },
  { libelle: 'Géographie', coefficient: 1 },
  { libelle: 'Éducation Civique et Morale', coefficient: 1 },
  { libelle: 'Lecture', coefficient: 3 },
  { libelle: 'Écriture', coefficient: 2 },
  { libelle: 'Éducation Physique et Sportive', coefficient: 1 },
  { libelle: 'Musique', coefficient: 1 },
  { libelle: 'Arts Plastiques', coefficient: 1 },
  { libelle: 'Informatique', coefficient: 1 },
  { libelle: 'ELCN', coefficient: 1 },
  { libelle: 'Hygiène et Santé', coefficient: 1 },
  { libelle: 'Activités de Production', coefficient: 1 },
];

const niveauClasses = [
  { cycle: 'Cours d\'Éveil', classes: ['SIL A', 'SIL B'] },
  { cycle: 'Cours Préparatoire', classes: ['CP A', 'CP B'] },
  { cycle: 'Cours Élémentaire 1', classes: ['CE1 A', 'CE1 B'] },
  { cycle: 'Cours Élémentaire 2', classes: ['CE2 A', 'CE2 B'] },
  { cycle: 'Cours Moyen 1', classes: ['CM1 A', 'CM1 B'] },
  { cycle: 'Cours Moyen 2', classes: ['CM2 A', 'CM2 B'] },
];

const typesEpreuve = [
  { libelle: 'Devoir n°1', type: 'Devoir', noteMax: 20 },
  { libelle: 'Devoir n°2', type: 'Devoir', noteMax: 20 },
  { libelle: 'Composition', type: 'Composition', noteMax: 20 },
  { libelle: 'Examen', type: 'Examen', noteMax: 20 },
];

const typesIncident = ['Retard', 'Absence', 'Indiscipline', 'Tricherie', 'Violence', 'Dégradation'];
const motifsPaiement = ['Scolarité', 'Inscription', 'Transport', 'Pension', 'Tenue', 'Activités'];
const modesPaiement = ['Espèces', 'Mobile Money', 'Virement', 'Chèque'];

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomDate(start, end) { const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())); return d.toISOString().split('T')[0]; }

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connecté à MySQL');

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.sync({ force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Tables recréées');

    const hash = await bcrypt.hash('password123', 10);
    const hashResp = await bcrypt.hash('admin123', 10);

    // 1. Admin
    const admin = await Admin.create({
      nom: 'Super Admin', username: 'admin', password: hash, actif: 1, typeAdmin: 1
    });
    console.log('Admin créé : admin / password123');

    // 2. Responsable Admin
    const respPers = await Personne.create({
      nom: 'MBARGA', prenom: 'Alice', mobile: '+237677100000',
      typePersonne: 3, username: 'responsable_admin', password: hashResp, idAdmin: admin.ID
    });
    console.log('Responsable Admin créé : responsable_admin / password123');

    // 3. Directeur
    const dirPers = await Personne.create({
      nom: 'FOUDA', prenom: 'Paul', mobile: '+237677000001',
      typePersonne: 2, username: 'directeur', password: hash, idAdmin: admin.ID
    });
    console.log('Directeur créé : directeur / password123');

    // 4. Annee Academique & Trimestres
    const annee = await AnneeAcademique.create({
      libelle: '2025-2026', periode: 'Septembre 2025 - Juin 2026', idAdmin: admin.ID
    });
    await Trimestre.create({ libelle: '1er Trimestre', dateDebut: '2025-09-15', dateFin: '2025-12-19', idAnnee: annee.idAnnee, actif: 1 });
    await Trimestre.create({ libelle: '2ème Trimestre', dateDebut: '2026-01-05', dateFin: '2026-03-27', idAnnee: annee.idAnnee, actif: 0 });
    await Trimestre.create({ libelle: '3ème Trimestre', dateDebut: '2026-04-13', dateFin: '2026-06-30', idAnnee: annee.idAnnee, actif: 0 });

    // 5. Cycles & Classes
    const cyclesMap = {};
    const sallesList = [];
    let eleveMatricule = 2025001;

    for (const nc of niveauClasses) {
      const cycle = await Cycle.create({ libelle: nc.cycle, description: nc.classes.join(', '), idAdmin: admin.ID });
      cyclesMap[nc.cycle] = cycle;

      for (const className of nc.classes) {
        const classe = await Classe.create({ libelle: className, idCycle: cycle.idCycle, idAdmin: admin.ID });
        const salle = await Salle.create({
          libelle: `Salle ${className}`, position: `Bâtiment ${nc.cycle.charAt(0)}`, surface: '50m2', idClasse: classe.idClasse, actif: 1, idAdmin: admin.ID
        });
        sallesList.push({ salle, classe, cycleName: nc.cycle, className });
      }
    }
    console.log(`${sallesList.length} classes créées (SIL A à CM2 B) :`, sallesList.map(s => s.className).join(', '));

    // 6. Matieres (Cours)
    const coursList = [];
    for (const m of matieresPrimaire) {
      const cours = await Cours.create({ libelle: m.libelle, coefficient: m.coefficient, actif: 1, idAdmin: admin.ID });
      coursList.push(cours);
    }
    console.log(`${coursList.length} matières créées`);

    // 7. Enseignants (1 par classe + quelques uns supplémentaires)
    const enseignantsList = [];
    const nomEnseignants = ['TCHINDA', 'NKWI', 'SIMO', 'KENFACK', 'TAGNE', 'WANDJI', 'KAMGA', 'DJOUGUE', 'NEBA', 'AKONO'];

    for (let i = 0; i < 10; i++) {
      const prenom = i < 5 ? randomItem(prenomsMasculins) : randomItem(prenomsFeminins);
      const pers = await Personne.create({
        nom: nomEnseignants[i], prenom, mobile: `+2376771${String(10001 + i).slice(1)}`,
        typePersonne: 1, username: `enseignant${i + 1}`, password: hash, idAdmin: admin.ID
      });
      const ens = await Enseignant.create({
        idPers: pers.idPers, idCours: coursList[i % coursList.length].idCours, Actif: 1, idAdmin: admin.ID
      });
      enseignantsList.push(ens);
    }
    console.log('10 enseignants créés');

    // 8. Élèves et Parents
    const elevesList = [];
    const parentsList = [];
    let usedNames = new Set();

    for (const s of sallesList) {
      const nbEleves = randomInt(15, 25);
      for (let i = 0; i < nbEleves; i++) {
        let nom, prenom, sexe;

        do {
          nom = randomItem(nomsCamerounais);
          sexe = Math.random() > 0.5 ? 1 : 2;
          prenom = sexe === 1 ? randomItem(prenomsMasculins) : randomItem(prenomsFeminins);
        } while (usedNames.has(`${nom}-${prenom}`));
        usedNames.add(`${nom}-${prenom}`);

        const eleve = await Eleve.create({
          matricule: eleveMatricule,
          nom, prenom, sexe,
          dateNaissance: randomDate(new Date('2013-01-01'), new Date('2019-12-31')),
          lieuNaissance: randomItem(localitesCameroun),
          langue: Math.random() > 0.7 ? 'FR' : Math.random() > 0.5 ? 'EN' : 'BIL',
          actif: 1, idAdmin: admin.ID
        });
        elevesList.push(eleve);

        // Inscription (Frequente)
        await Frequente.create({
          idSalle: s.salle.idSalle, idAcademi: annee.idAnnee,
          matricule: eleve.matricule, commentaire: 'INSCRIT', idAdmin: admin.ID
        });

        // Parent pour l'élève
        const parentNom = randomItem(nomsCamerounais);
        const parentPrenom = randomItem(prenomsMasculins);
        const persParent = await Personne.create({
          nom: parentNom, prenom: parentPrenom, mobile: `+237699${String(10000 + eleveMatricule).slice(1)}`,
          typePersonne: 4, username: `parent${eleveMatricule}`, password: hash, idAdmin: admin.ID
        });
        await Parents.create({ idPers: persParent.idPers, matricule: eleve.matricule, idAdmin: admin.ID });

        // Scolarite
        await Scolarite.create({
          matricule: eleve.matricule, montantTotal: 150000, montantPaye: Math.random() > 0.3 ? 150000 : randomInt(30000, 100000),
          idAnnee: annee.idAnnee, idAdmin: admin.ID
        });

        // Paiements
        if (Math.random() > 0.2) {
          await Paiement.create({
            matricule: eleve.matricule, montant: 150000,
            datePaiement: randomDate(new Date('2025-09-01'), new Date('2025-12-31')),
            modePaiement: randomItem(modesPaiement), motif: 'Scolarité', reference: `PAY-${eleveMatricule}`,
            statut: Math.random() > 0.3 ? 'Payé' : 'Impayé', idAdmin: admin.ID
          });
        }

        eleveMatricule++;
      }
    }
    const totalEleves = elevesList.length;
    console.log(`${totalEleves} élèves créés avec leurs parents et inscriptions`);

    // Parent de démonstration
    const parentUser = await Personne.create({
      nom: 'ATANGA', prenom: 'Paul', mobile: '+237677000004',
      typePersonne: 4, username: 'parent', password: hash, idAdmin: admin.ID
    });
    if (elevesList.length > 0) {
      await Parents.create({ idPers: parentUser.idPers, matricule: elevesList[0].matricule, idAdmin: admin.ID });
    }
    console.log('Parent de démo créé : parent / password123');

    // 9. Évaluations & Notes
    const epreuvesList = [];
    for (const cours of coursList.slice(0, 6)) {
      for (const type of typesEpreuve) {
        const epreuve = await Epreuve.create({
          idCours: cours.idCours, libelle: `${cours.libelle} - ${type.libelle}`,
          type: type.type, dateEpreuve: randomDate(new Date('2025-10-01'), new Date('2025-12-15')),
          noteMax: type.noteMax, idClasse: sallesList[0].classe.idClasse, idAdmin: admin.ID
        });
        epreuvesList.push(epreuve);
      }
    }

    // Notes pour chaque élève (quelques matières)
    let noteCount = 0;
    for (const eleve of elevesList.slice(0, 50)) {
      for (const epreuve of epreuvesList.slice(0, 8)) {
        const note = Math.random() * 20;
        await Note.create({
          idEpreuve: epreuve.idEpreuve, matricule: eleve.matricule,
          note: parseFloat(note.toFixed(2)),
          appreciation: note >= 16 ? 'Excellent' : note >= 14 ? 'Très bien' : note >= 12 ? 'Bien' : note >= 10 ? 'Assez bien' : note >= 8 ? 'Passable' : 'Insuffisant',
        });
        noteCount++;
      }
    }
    console.log(`${noteCount} notes attribuées`);

    // 10. Messages
    for (let i = 0; i < 5; i++) {
      const sender = i % 2 === 0 ? admin : dirPers;
      await Message.create({
        expediteurId: admin.ID, expediteurType: 'ADMIN', destinataireId: dirPers.idPers, destinataireType: 'DIRECTEUR',
        destinataireNom: `${dirPers.nom} ${dirPers.prenom}`, objet: `Message de test n°${i + 1}`,
        contenu: `Ceci est un message de test numéro ${i + 1} pour vérifier le bon fonctionnement de la messagerie.`,
        typeMessage: i % 3, statut: i < 3 ? 'Lu' : 'Envoyé', dateEnvoi: new Date(),
      });
    }
    console.log('5 messages créés');

    // 11. Discipline
    for (let i = 0; i < 8; i++) {
      const eleve = randomItem(elevesList);
      const incidentType = randomItem(typesIncident);
      await Discipline.create({
        matricule: eleve.matricule, typeIncident: incidentType,
        description: `Incident de type ${incidentType} concernant l'élève ${eleve.nom} ${eleve.prenom}.`,
        dateIncident: randomDate(new Date('2025-10-01'), new Date('2025-12-15')),
        points: randomInt(1, 10), statut: Math.random() > 0.5 ? 'Traité' : 'En attente',
        idEnseignant: randomItem(enseignantsList).idEnseignant, idAdmin: admin.ID
      });
    }
    console.log('8 incidents disciplinaires créés');

    // 12. Emploi du temps
    const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    const heures = [
      { debut: '08:00', fin: '09:00' }, { debut: '09:00', fin: '10:00' },
      { debut: '10:15', fin: '11:15' }, { debut: '11:15', fin: '12:15' },
      { debut: '13:00', fin: '14:00' }, { debut: '14:00', fin: '15:00' },
      { debut: '15:15', fin: '16:15' },
    ];

    for (const s of sallesList.slice(0, 4)) {
      for (let j = 0; j < jours.length; j++) {
        for (let h = 0; h < 4; h++) {
          await EmploiDuTemps.create({
            idClasse: s.classe.idClasse, idCours: coursList[(j + h) % coursList.length].idCours,
            jourSemaine: j + 1, heureDebut: heures[h].debut, heureFin: heures[h].fin,
            salle: s.salle.libelle, idAdmin: admin.ID
          });
        }
      }
    }
    console.log('Emploi du temps créé pour 4 classes');

    console.log('\n========================================');
    console.log('   GÉNÉRATION DES DONNÉES TERMINÉE !');
    console.log('========================================');
    console.log(`   ${totalEleves} élèves`);
    console.log(`   ${enseignantsList.length} enseignants`);
    console.log(`   ${sallesList.length} classes`);
    console.log(`   ${coursList.length} matières`);
    console.log(`   ${epreuvesList.length} évaluations`);
    console.log(`   ${noteCount} notes`);
    console.log(`   5 messages`);
    console.log(`   8 incidents`);
    console.log('========================================');
    console.log('\nComptes de test :');
    console.log('  admin              / password123 (ADMIN)');
    console.log('  directeur          / password123 (DIRECTEUR)');
    console.log('  responsable_admin  / admin123    (RESPONSABLE_ADMIN)');
    console.log('  enseignant1        / password123 (ENSEIGNANT)');
    console.log('  parent             / password123 (PARENT)');
    console.log('  parent[matricule]  / password123 (autres parents)');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('Erreur seed :', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

seed();
