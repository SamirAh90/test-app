# Inloggning via e-postlänk

Användaren väljer **Logga in utan lösenord** på inloggningssidan och anger sin registrerade e-postadress. Länken gäller i 15 minuter, fungerar en gång och öppnar en sida med en bekräftelseknapp. Nya användare skapar konto via den vanliga registreringen först. Administratörer och redaktörer använder fortsatt lösenord.

## Aktivera utskick

Välj en SMTP-tjänst. Brevo erbjuder vid kontroll 2026-11-15 en gratisnivå med upp till 300 mejl per dag. Skapa ett eget konto och verifiera avsändaren enligt tjänstens instruktioner. Ingen betald tjänst aktiveras av appen.

Fyll i följande i den befintliga `backend/.env` (lägg inte nycklar i frontend eller Git):

```dotenv
FRONTEND_URL=http://localhost:5173
SMTP_HOST=din-smtp-server
SMTP_PORT=587
SMTP_USER=ditt-smtp-användarnamn
SMTP_PASSWORD=din-smtp-nyckel
MAIL_FROM=MedborgaTest <din-verifierade-avsändare@example.com>
```

Starta om backend efter ändringen. Använd webbplatsens riktiga HTTPS-adress som FRONTEND_URL vid publicering. Frontend-routen `/login/email` måste gå till React-appen. SMTP använder TLS, port 465 för direkt TLS eller 587 för STARTTLS.

Utan konfiguration visas ett tydligt meddelande om att e-postlänkar ännu inte är aktiverade. Inga länkar skrivs till loggar eller skickas tillbaka i API-svar. Generiskt svar används för registrerade och okända adresser. Leveransfel loggas utan mottagare/länk och avslöjas inte i svaret; kontrollera mejltjänstens leveransstatus vid uteblivna mejl.

## Säkerhet och drift

Tabellen `login_links` skapas av befintlig Sequelize-sync vid backendstart. Den lagrar SHA-256-hash av slumpmässiga 256-bitars tokens, inte själva länken. Transaktion med radlås förhindrar återanvändning även vid samtidiga anrop. Inaktiverade/borttagna konton, ändrad e-post och privilegierade konton nekas. Lösenord ändras inte. Alla länkar förfaller efter 15 minuter; utgångna poster rensas när nästa mejl skickas.

Begäran begränsas till 3 per adress och 20 per IP under 15 minuter. Begränsningen finns i serverminnet och nollställs vid omstart. Före drift med flera serverinstanser krävs en delad limiter. Bakom proxy behöver Express konfigureras med betrodda proxyhopp så IP-begränsningen fungerar korrekt.

Testa efter SMTP-konfiguration med en egen registrerad adress: leverans, inloggning, återanvänd länk, utgången länk och inaktiverat konto. Befintliga lösenord och Google-inloggning fortsätter fungera separat.

Källor: https://help.brevo.com/hc/en-us/articles/208589409-About-Brevo-s-pricing-plans och https://nodemailer.com/smtp
