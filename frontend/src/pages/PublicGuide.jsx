import { Link } from "react-router-dom";
import PublicLayout from "../components/PublicLayout/PublicLayout";
import "./PublicGuide.css";

const uhr = 'https://www.uhr.se/medborgarskapsprovet';
const migration = 'https://www.migrationsverket.se/du-vill-ansoka/svenskt-medborgarskap/medborgarskap-for-vuxna/medborgarskap-for-vuxna.html';
const pages = {
  tips: {
    group: 'Lär dig', title: 'Studietips', intro: 'Lite i taget gör stor skillnad. Hitta en studierutin som fungerar för dig.',
    sections: [
      ['Börja med ett ämne', 'Läs ett avsnitt i studiematerialet. Skriv ned tre saker du har lärt dig och försök förklara dem med egna ord.'],
      ['Lär dig orden', 'Slå upp ord du inte förstår i Viktiga begrepp. Skriv gärna ett eget exempel till varje nytt begrepp.'],
      ['Öva och läs förklaringarna', 'Svara på frågor efter läsningen. Läs förklaringen även när du svarar rätt. Då blir det lättare att förstå varför svaret är rätt.'],
      ['Repetera regelbundet', 'Planera korta pass, till exempel 15 minuter åt gången. Gå tillbaka till frågor och ämnen som kändes svåra.'],
      ['Följ din utveckling', 'Logga in för att se dina sparade resultat i Min träning. Variera ämnena och använd provsimuleringen när du vill öva med tidtagning.'],
    ], links: [['Läs studiematerial', '/studiematerial'], ['Utforska viktiga begrepp', '/begrepp']],
  },
  dates: {
    group: 'Om provet', title: 'Anmälan och provdatum', intro: 'Hitta information om anmälan och provtillfällen direkt hos den ansvariga myndigheten.',
    sections: [
      ['Kontrollera aktuella provtillfällen hos UHR', 'Universitets- och högskolerådet (UHR) ansvarar för medborgarskapsprovet. Läs deras aktuella information om provdatum, platser och hur anmälan går till.'],
      ['Följ myndighetens instruktioner', 'Kontrollera vilka villkor som gäller för att anmäla dig och vilka handlingar du behöver. Följ de instruktioner du får från UHR och Migrationsverket.'],
      ['Förbered dig under tiden', 'Du kan läsa studiematerial och prova övningsfrågor här. En registrering hos MedborgaTest innebär inte att du är anmäld till det officiella provet.'],
    ], links: [['Anmälan och provinformation hos UHR ↗', uhr], ['Öva gratis', '/trainer/demo']],
    source: ['UHR – Medborgarskapsprovet', uhr],
  },
  faq: {
    group: 'Om provet', title: 'Vanliga frågor', intro: 'Svar som hjälper dig att komma igång med din förberedelse.',
    sections: [
      ['Är MedborgaTest det officiella provet?', 'Nej. MedborgaTest är en fristående studietjänst. Frågorna här är övningsfrågor. Officiell information om medborgarskapsprovet finns hos UHR.'],
      ['Kan jag prova utan konto?', 'Ja. Välj Testa gratis för att prova övningsfrågor utan att först skapa ett konto.'],
      ['Var hittar jag mina resultat?', 'När du är inloggad hittar du dina sparade resultat och din personliga träning under Min träning.'],
      ['Vad är Smart träning och provsimulering?', 'Smart träning hjälper dig att fokusera på områden du behöver repetera. Provsimuleringen låter dig öva med tidtagning. Dessa funktioner kräver ett Premiumkonto.'],
      ['Kan jag läsa på andra språk?', 'Startsidan och huvudmenyn kan visas på svenska, engelska, arabiska och persiska/dari. Övrigt innehåll kan vara på svenska. På träningssidorna finns ett separat val för frågeöversättning.'],
      ['Var anmäler jag mig till det officiella provet?', 'Se UHR:s information om anmälan och provtillfällen. Du kan inte anmäla dig till myndighetens prov genom MedborgaTest.'],
    ], links: [['Frågor och svar hos UHR ↗', 'https://www.uhr.se/medborgarskapsprovet/fragor-och-svar/'], ['Testa gratis', '/trainer/demo']],
  },
  citizenship: {
    group: 'Medborgarskap', title: 'Vägen till medborgarskap', intro: 'En översikt som hjälper dig att hitta rätt information och ta nästa steg.',
    sections: [
      ['1. Hitta information för din situation', 'Börja hos Migrationsverket. Där finns information för olika grupper, till exempel vuxna, barn och nordiska medborgare. Välj det som stämmer för dig.'],
      ['2. Kontrollera villkoren', 'Läs vilka krav som gäller för din situation och vilka handlingar du behöver. Använd myndighetens aktuella information när du planerar din ansökan.'],
      ['3. Förbered dig', 'Samla de uppgifter och handlingar som efterfrågas. Om du behöver förbereda dig inför medborgarskapsprovet kan du använda vårt studiematerial och våra övningar.'],
      ['4. Ansök och följ ditt ärende', 'Gör ansökan via Migrationsverket och följ deras instruktioner om nästa steg. Det är myndigheten som prövar din ansökan.'],
    ], links: [['Läs om kraven', '/medborgarskap/krav'], ['Så går ansökan till', '/medborgarskap/ansokan']], source: ['Migrationsverket – Svenskt medborgarskap för vuxna', migration],
  },
  requirements: {
    group: 'Medborgarskap', title: 'Krav för medborgarskap', intro: 'Vilka villkor som gäller beror på din situation. Börja med informationen från Migrationsverket.',
    sections: [
      ['Läs kraven för rätt grupp', 'Migrationsverket har olika information beroende på bland annat ålder och medborgarskap. Välj den kategori som gäller dig.'],
      ['Kontrollera varje villkor', 'På myndighetens sida hittar du de aktuella kraven och information om hur du visar att de är uppfyllda. Läs hela informationen innan du ansöker.'],
      ['Använd aktuell information', 'Regler kan ändras. Vi anger därför inte en egen checklista med tidsgränser eller undantag. Följ länken till Migrationsverket för villkoren och eventuella särskilda regler för din situation.'],
    ], links: [['Se aktuella krav hos Migrationsverket ↗', migration], ['Vägen till medborgarskap', '/medborgarskap']], source: ['Migrationsverket – Svenskt medborgarskap för vuxna', migration],
  },
  application: {
    group: 'Medborgarskap', title: 'Ansökan', intro: 'Ansökan om svenskt medborgarskap görs hos Migrationsverket.',
    sections: [
      ['Läs innan du ansöker', 'Kontrollera först vilka villkor som gäller dig. Läs också vilka uppgifter och handlingar du behöver lämna.'],
      ['Välj rätt ansökningssätt', 'Migrationsverket beskriver vilka ansökningssätt som finns för din situation och hur du går vidare. Kontrollera även aktuell information om avgifter hos myndigheten.'],
      ['Följ ditt ärende', 'Efter ansökan följer du Migrationsverkets instruktioner. Om de ber dig om fler uppgifter eller handlingar behöver du lämna dem på det sätt de anger.'],
    ], links: [['Gå till ansökningsinformationen ↗', migration], ['Kontrollera kraven först', '/medborgarskap/krav']], source: ['Migrationsverket – Svenskt medborgarskap för vuxna', migration],
  },
};

export default function PublicGuide({ page }) {
  const data = pages[page];
  return (
    <PublicLayout>
      <main className="public-guide">
        <div className="public-guide__container">
          <header className="public-guide__intro"><span>{data.group}</span><h1>{data.title}</h1><p>{data.intro}</p></header>
          <div className="public-guide__layout">
            <div className="public-guide__sections">
              {data.sections.map(([title, body], index) => page === 'faq' ? (
                <details key={title} className="public-guide__faq"><summary>{title}</summary><p>{body}</p></details>
              ) : (
                <section key={title}><span className="public-guide__number">{String(index + 1).padStart(2, '0')}</span><div><h2>{title}</h2><p>{body}</p></div></section>
              ))}
            </div>
            <aside className="public-guide__next"><h2>Ta nästa steg</h2>{data.links.map(([label, href]) => href.startsWith('https:') ? <a key={href} href={href}>{label}</a> : <Link key={href} to={href}>{label} →</Link>)}
              {data.source && <p>Källa: <a href={data.source[1]}>{data.source[0]}</a></p>}
              {(data.source || page === 'faq') && <small>MedborgaTest är en fristående studietjänst. Kontrollera aktuell information hos ansvarig myndighet.</small>}
            </aside>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
