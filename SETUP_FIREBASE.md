# Configurazione Firebase necessaria

L'errore durante la registrazione è dovuto al fatto che l'app non è ancora collegata al tuo progetto Firebase. Ecco come risolvere in 2 minuti:

## 1. Crea il progetto Firebase
1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Clicca **"Crea un progetto"** (chiamalo come vuoi, es. "Dispensa Smart")
3. Segui i passaggi (puoi disabilitare Google Analytics per fare prima)

## 2. Abilita l'Autenticazione
1. Nel menu a sinistra del tuo nuovo progetto, clicca su **Build** -> **Authentication**
2. Clicca su **Inizia**
3. Nella tab "Sign-in method", clicca su **Email/Password**
4. Abilita la prima spunta "Email/Password" (la seconda "Email link" lasciala disabilitata)
5. Clicca **Salva**

## 3. Prendi le credenziali
1. Clicca l'icona dell'ingranaggio ⚙️ accanto a "Project Overview" in alto a sinistra -> **Project settings**
2. Scorri in basso fino a "Your apps"
3. Clicca sull'icona **Web** (</>)
4. Dai un soprannome all'app (es. "Web App") e clicca **Register app**
5. Ti mostrerà un blocco di codice `const firebaseConfig = { ... }`

## 4. Inseriscile nell'app
1. Apri il file nel tuo editor: `src/config/firebaseConfig.js`
2. Sostituisci la parte `const firebaseConfig = { ... };` con quella che hai copiato da Firebase.
   Dovrebbe avere questo aspetto:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```
3. Salva il file.

Ora ricarica la pagina nel browser e la registrazione funzionerà!
