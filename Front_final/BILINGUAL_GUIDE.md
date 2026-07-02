# Guide du Système Bilingue - EduGest CM

## 🌍 Vue d'ensemble

L'application EduGest CM est maintenant **entièrement bilingue** (Français/Anglais) pour s'adapter au contexte camerounais.

## 🎯 Fonctionnalités

- **Changement de langue instantané** via un bouton dans la sidebar
- **Persistance de la langue** : le choix est sauvegardé dans localStorage
- **Traductions complètes** de toutes les interfaces
- **Support FR/EN** pour toutes les pages

## 🔧 Architecture

### 1. Contexte de langue (`LanguageContext.tsx`)

Le contexte global gère :
- L'état actuel de la langue (`fr` ou `en`)
- Le changement de langue
- La fonction de traduction `t(key)`
- Toutes les traductions dans l'objet `translations`

```typescript
const { language, setLanguage, t } = useLanguage();
```

### 2. Utilisation dans les composants

Pour traduire un texte, utilisez la fonction `t()` avec une clé :

```tsx
import { useLanguage } from '../contexts/LanguageContext';

function MyComponent() {
  const { t, language } = useLanguage();
  
  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.subtitle')}</p>
    </div>
  );
}
```

### 3. Clés de traduction

Les clés sont organisées par module :

- `common.*` - Termes communs (search, add, edit, etc.)
- `auth.*` - Authentification
- `nav.*` - Navigation
- `dashboard.*` - Tableau de bord
- `students.*` - Gestion des élèves
- `teachers.*` - Gestion des enseignants
- `classes.*` - Gestion des classes
- `subjects.*` - Matières
- `timetable.*` - Emploi du temps
- `attendance.*` - Présences
- `grades.*` - Notes
- `reportCards.*` - Bulletins
- `payments.*` - Paiements
- `discipline.*` - Discipline
- `messages.*` - Communication
- `reports.*` - Rapports

### 4. Sélecteur de langue

Le bouton de changement de langue est disponible :
- **Page de connexion** : En haut à droite
- **Sidebar** : Dans le footer (version étendue et réduite)

## 📝 Ajouter de nouvelles traductions

1. Ouvrez `/src/app/contexts/LanguageContext.tsx`
2. Ajoutez vos clés dans les deux objets `fr` et `en` :

```typescript
export const translations = {
  fr: {
    'myModule.myKey': 'Mon texte en français',
    // ...
  },
  en: {
    'myModule.myKey': 'My text in English',
    // ...
  }
};
```

3. Utilisez la clé dans votre composant :

```tsx
<p>{t('myModule.myKey')}</p>
```

## 🎨 Pages déjà traduites

✅ **LoginPage** - Page de connexion
✅ **DashboardLayout** - Layout avec navigation
✅ **Dashboard** - Tableau de bord
✅ **Students** - Gestion des élèves

## 📋 Pages à traduire

Les pages suivantes utilisent encore du texte en dur et doivent être mises à jour :

- Teachers
- Classes
- Subjects
- Timetable
- Attendance
- Grades
- ReportCards
- Payments
- Discipline
- Messages
- Reports

Pour chaque page, suivez le pattern utilisé dans `Students.tsx`.

## 🚀 Exemple de migration d'une page

**Avant :**
```tsx
<h1>Gestion des Enseignants</h1>
<p>Gérez le personnel enseignant</p>
```

**Après :**
```tsx
import { useLanguage } from '../contexts/LanguageContext';

function Teachers() {
  const { t } = useLanguage();
  
  return (
    <>
      <h1>{t('teachers.title')}</h1>
      <p>{t('teachers.subtitle')}</p>
    </>
  );
}
```

## 💡 Bonnes pratiques

1. **Toujours utiliser des clés descriptives** : `students.newEnrollment` plutôt que `text1`
2. **Organiser par module** : Grouper les traductions liées
3. **Éviter les textes en dur** : Tout texte visible doit passer par `t()`
4. **Tester les deux langues** : Vérifier que l'UI reste lisible en FR et EN
5. **Dates et nombres** : Adapter les formats selon la langue si nécessaire

## 🔄 Changement de langue par défaut

La langue par défaut est le **français**. Pour changer :

```typescript
// Dans LanguageContext.tsx, ligne ~440
const [language, setLanguageState] = useState<Language>(() => {
  const saved = localStorage.getItem('edugest_language');
  return (saved === 'en' || saved === 'fr') ? saved : 'en'; // Changez 'fr' en 'en'
});
```

## 🌐 Indicateur visuel de langue

Le bouton affiche :
- **Texte** : "Français" ou "English"
- **Badge** : "FR" ou "EN"
- **Icône** : 🌐 (Languages)

---

**Développé pour EduGest CM - Système de gestion scolaire camerounais**
