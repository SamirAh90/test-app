# Aktivera Google-inloggning

1. Skapa en OAuth-klient av typen **Web application** i Google Cloud Console. Konfigurera appens samtyckessida och eventuella testanvändare.
2. Lägg till `http://localhost:5173` som **Authorized JavaScript origin**. Lägg även till den riktiga webbplatsens HTTPS-origin inför publicering. Om Vite använder en annan port måste den också registreras.
3. Lägg `GOOGLE_CLIENT_ID=ditt-id.apps.googleusercontent.com` i `backend/.env`.
4. Lägg `VITE_GOOGLE_CLIENT_ID=ditt-id.apps.googleusercontent.com` i `frontend/.env`. Använd samma klient-ID. Ingen klienthemlighet behövs för detta flöde.
5. Kör `backend/database/google-auth-migration.sql` en gång för befintliga databaser. Nya databaser får kolumnen vid start via Sequelize.
6. Starta om backend och Vite. Bygg om frontend inför publicering.

Knappen använder Google Identity Services. Backend verifierar signatur, mottagare och giltighetstid med google-auth-library. Google-kontots stabila `sub` sparas som `googleSubject`.

Nya konton får rollen user och ingen Premium. Befintliga vanliga konton kan kopplas automatiskt när Google är auktoritativ för en verifierad Gmail- eller Workspace-adress. Inaktiverade konton nekas. Administratörs- och redaktörskonton kopplas inte automatiskt via e-post. Övriga befintliga e-postkonton använder lösenordsinloggning.

Google-konton får ett slumpmässigt, okänt lokalt lösenord. Användaren kan ange ett eget lösenord under Konto efter inloggning för att även använda e-postinloggning och lösenordsbekräftad kontoborttagning.

Verifiera manuellt efter konfiguration: nytt Google-konto, återkommande inloggning, koppling till befintligt Gmail-konto med bevarade resultat, avbruten popup och inaktiverat konto. Testa även vanlig e-postinloggning.

Dokumentation: https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid och https://developers.google.com/identity/gsi/web/guides/verify-google-id-token

https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid

---

Fixa facebook inlogning Jag skulle börja med e-postlänken och sedan lägga till Facebook.

---

Logga in utan lösenord konfiguration..

För att skicka riktiga mejl behöver mejltjänsten anslutas. Brevo har en gratisnivå med 300 mejl per dag. Instruktionerna finns i [EMAIL_LOGIN_SETUP.md](/C:/Users/samma/Desktop/MedborgaTest/EMAIL_LOGIN_SETUP.md).

---
