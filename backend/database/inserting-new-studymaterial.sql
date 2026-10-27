USE medborgatest_db;

START TRANSACTION;

-- =====================================================
-- 1. STUDY MATERIAL
-- Subject ID 2: Sveriges demokratiska system
-- =====================================================

INSERT INTO subject_materials (
  subjectId,
  title,
  introduction,
  body,
  createdAt,
  updatedAt
)
VALUES (
  2,
  'Sveriges demokratiska system',
  'I det här ämnet får du lära dig vad demokrati betyder, hur människor kan påverka samhället och vilka rättigheter som är viktiga i ett demokratiskt land.',
  '
    <section>
      <h2>Vad är demokrati?</h2>

      <p>
        Demokrati betyder folkstyre. Det innebär att människorna i ett
        land är med och bestämmer hur landet ska styras. I Sverige gör
        medborgarna detta framför allt genom att rösta i allmänna val.
      </p>

      <p>
        Den offentliga makten utgår från folket. Sverige är samtidigt
        en monarki, men statschefen har inte någon politisk makt.
      </p>
    </section>

    <section>
      <h2>Fria och hemliga val</h2>

      <p>
        Valen i Sverige ska vara fria och hemliga. Ett fritt val betyder
        att väljaren själv får bestämma vilket parti eller vilken kandidat
        han eller hon vill rösta på.
      </p>

      <p>
        Ett hemligt val betyder att ingen annan behöver få veta hur en
        person har röstat. Ingen får tvinga eller pressa någon att rösta
        på ett särskilt sätt.
      </p>
    </section>

    <section>
      <h2>Yttrandefrihet</h2>

      <p>
        Yttrandefrihet innebär att människor har rätt att uttrycka sina
        åsikter. Man kan till exempel delta i samhällsdebatten, skriva
        en insändare eller framföra kritik mot politiska beslut.
      </p>

      <p>
        Yttrandefriheten skyddas av grundlagarna, men den innebär inte
        att allt är tillåtet. Hot, förtal och hets mot folkgrupp kan vara
        förbjudna enligt lag.
      </p>
    </section>

    <section>
      <h2>Alla är lika inför lagen</h2>

      <p>
        I en rättsstat ska lagarna gälla lika för alla. Myndigheter och
        domstolar ska följa lagen och behandla människor på ett sakligt
        och rättssäkert sätt.
      </p>

      <p>
        Grundläggande fri- och rättigheter ska skydda individen mot
        orättvis behandling och maktmissbruk.
      </p>
    </section>

    <section>
      <h2>Så kan du påverka samhället</h2>

      <p>
        Det finns flera fredliga och lagliga sätt att påverka samhället.
        Du kan bland annat:
      </p>

      <ul>
        <li>rösta i allmänna val,</li>
        <li>gå med i ett politiskt parti eller en förening,</li>
        <li>kontakta politiker,</li>
        <li>skriva insändare eller delta i debatter,</li>
        <li>delta i en fredlig demonstration.</li>
      </ul>

      <p>
        Ett aktivt deltagande från medborgarna är viktigt för att
        demokratin ska fungera.
      </p>
    </section>

    <section>
      <h2>Vad kan hota demokratin?</h2>

      <p>
        Demokratin kan försvagas när människor hindras från att uttrycka
        sina åsikter eller delta i politiken. Hot mot journalister,
        politiker och andra samhällsdebattörer kan göra att färre vågar
        delta.
      </p>

      <p>
        Desinformation kan också påverka demokratin. Det är information
        som medvetet sprids för att vilseleda människor. Därför är
        källkritik och fria medier viktiga i ett demokratiskt samhälle.
      </p>
    </section>

    <section>
      <h2>Viktigt att komma ihåg</h2>

      <ul>
        <li>Demokrati betyder folkstyre.</li>
        <li>Den offentliga makten utgår från folket.</li>
        <li>Val ska vara fria och hemliga.</li>
        <li>Yttrandefrihet skyddas av grundlagarna.</li>
        <li>Alla ska vara lika inför lagen.</li>
        <li>Medborgare kan påverka samhället på flera olika sätt.</li>
        <li>Fria medier och källkritik hjälper till att skydda demokratin.</li>
      </ul>
    </section>
  ',
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  introduction = VALUES(introduction),
  body = VALUES(body),
  updatedAt = NOW();


-- =====================================================
-- 2. GLOSSARY
-- Delete old glossary rows before inserting new ones
-- =====================================================

DELETE FROM subject_glossary
WHERE subjectId = 2;

INSERT INTO subject_glossary (
  subjectId,
  word,
  definition,
  displayOrder,
  createdAt,
  updatedAt
)
VALUES
(
  2,
  'Demokrati',
  'Ett sätt att styra där folket är med och bestämmer, framför allt genom val.',
  1,
  NOW(),
  NOW()
),
(
  2,
  'Folkstyre',
  'Att den politiska makten ytterst kommer från folket.',
  2,
  NOW(),
  NOW()
),
(
  2,
  'Allmänna val',
  'Val där personer som har rösträtt väljer politiska representanter.',
  3,
  NOW(),
  NOW()
),
(
  2,
  'Yttrandefrihet',
  'Rätten att uttrycka tankar, åsikter och information inom lagens gränser.',
  4,
  NOW(),
  NOW()
),
(
  2,
  'Grundlag',
  'En särskilt viktig lag som beskriver hur Sverige styrs och skyddar grundläggande rättigheter.',
  5,
  NOW(),
  NOW()
),
(
  2,
  'Rättsstat',
  'Ett samhälle där myndigheter och domstolar måste följa lagen och där människor har rättssäkerhet.',
  6,
  NOW(),
  NOW()
),
(
  2,
  'Desinformation',
  'Felaktig eller vilseledande information som sprids medvetet.',
  7,
  NOW(),
  NOW()
),
(
  2,
  'Källkritik',
  'Att undersöka vem som står bakom information och om den är trovärdig.',
  8,
  NOW(),
  NOW()
);


-- =====================================================
-- 3. OFFICIAL SOURCES
-- =====================================================

DELETE FROM subject_sources
WHERE subjectId = 2;

INSERT INTO subject_sources (
  subjectId,
  title,
  url,
  displayOrder,
  createdAt,
  updatedAt
)
VALUES
(
  2,
  'UHR — medborgarskapsprovet och Sverige i fokus',
  'https://www.uhr.se/',
  1,
  NOW(),
  NOW()
),
(
  2,
  'Migrationsverket — medborgarskap',
  'https://www.migrationsverket.se/privatpersoner/bli-svensk-medborgare.html',
  2,
  NOW(),
  NOW()
);

COMMIT;

/// veryfiy

SELECT *
FROM subject_materials
WHERE subjectId = 2;

SELECT *
FROM subject_glossary
WHERE subjectId = 2
ORDER BY displayOrder;

SELECT *
FROM subject_sources
WHERE subjectId = 2
ORDER BY displayOrder;