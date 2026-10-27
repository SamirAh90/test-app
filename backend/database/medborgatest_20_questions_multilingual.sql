USE medborgatest_db;

SET NAMES utf8mb4;

START TRANSACTION;

INSERT INTO questions
(subjectId, question, explanation, difficulty, createdAt, updatedAt)
VALUES
(1, 'Vilket hav ligger vid Sveriges östra kust?', 'Östersjön ligger längs Sveriges östra kust. Skagerrak och Kattegatt ligger vid den västra kusten.', 'easy', NOW(), NOW());

SET @questionId = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Östersjön', 1, NOW(), NOW());

SET @answer1 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Skagerrak', 0, NOW(), NOW());

SET @answer2 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Kattegatt', 0, NOW(), NOW());

SET @answer3 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Atlanten', 0, NOW(), NOW());

SET @answer4 = LAST_INSERT_ID();

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'en', 'Which sea lies along Sweden''s eastern coast?', 'The Baltic Sea lies along Sweden''s eastern coast. Skagerrak and Kattegat lie along the western coast.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'ar', 'أي بحر يقع على الساحل الشرقي للسويد؟', 'يقع بحر البلطيق على طول الساحل الشرقي للسويد. أما سكاغيراك وكاتغات فيقعان على الساحل الغربي.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'fa', 'کدام دریا در امتداد ساحل شرقی سویدن قرار دارد؟', 'دریای بالتیک در امتداد ساحل شرقی سویدن قرار دارد. اسکاگراک و کاتگات در ساحل غربی قرار دارند.', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'en', 'The Baltic Sea', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'ar', 'بحر البلطيق', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'fa', 'دریای بالتیک', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'en', 'Skagerrak', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'ar', 'سكاغيراك', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'fa', 'اسکاگراک', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'en', 'Kattegat', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'ar', 'كاتغات', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'fa', 'کاتگات', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'en', 'The Atlantic Ocean', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'ar', 'المحيط الأطلسي', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'fa', 'اقیانوس اطلس', NOW(), NOW());

INSERT INTO questions
(subjectId, question, explanation, difficulty, createdAt, updatedAt)
VALUES
(1, 'Varför har Sverige ett mildare klimat än många andra områden på samma breddgrad?', 'Golfströmmen och den Nordatlantiska strömmen för varmt vatten mot Europa. Vattnet värmer luften som förs in över Sverige.', 'easy', NOW(), NOW());

SET @questionId = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Varma havsströmmar värmer luften', 1, NOW(), NOW());

SET @answer1 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Fjällen stoppar all kall luft', 0, NOW(), NOW());

SET @answer2 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Skogarna producerar värme under vintern', 0, NOW(), NOW());

SET @answer3 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Sverige ligger söder om Europa', 0, NOW(), NOW());

SET @answer4 = LAST_INSERT_ID();

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'en', 'Why does Sweden have a milder climate than many other areas at the same latitude?', 'The Gulf Stream and the North Atlantic Current carry warm water toward Europe. The water heats the air that is then carried over Sweden.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'ar', 'لماذا تتمتع السويد بمناخ أكثر اعتدالًا من مناطق كثيرة تقع على خط العرض نفسه؟', 'ينقل تيار الخليج وتيار شمال الأطلسي مياهًا دافئة نحو أوروبا. وتسخن هذه المياه الهواء الذي ينتقل بعد ذلك فوق السويد.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'fa', 'چرا سویدن نسبت به بسیاری از مناطق در همان عرض جغرافیایی آب‌وهوای ملایم‌تری دارد؟', 'جریان گلف استریم و جریان شمال اقیانوس اطلس آب گرم را به سوی اروپا انتقال می‌دهند. این آب هوا را گرم می‌کند و باد آن را به سوی سویدن می‌آورد.', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'en', 'Warm ocean currents heat the air', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'ar', 'التيارات البحرية الدافئة تسخن الهواء', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'fa', 'جریان‌های گرم دریایی هوا را گرم می‌کنند', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'en', 'The mountains stop all cold air', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'ar', 'الجبال تمنع كل الهواء البارد', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'fa', 'کوه‌ها تمام هوای سرد را متوقف می‌کنند', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'en', 'The forests produce heat during winter', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'ar', 'الغابات تنتج الحرارة خلال الشتاء', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'fa', 'جنگل‌ها در زمستان گرما تولید می‌کنند', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'en', 'Sweden lies south of Europe', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'ar', 'السويد تقع جنوب أوروبا', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'fa', 'سویدن در جنوب اروپا قرار دارد', NOW(), NOW());

INSERT INTO questions
(subjectId, question, explanation, difficulty, createdAt, updatedAt)
VALUES
(2, 'Vad kännetecknar ett fritt val i en demokrati?', 'I ett fritt val har varje röstberättigad person en röst och kan välja utan hot eller tvång. Valet är hemligt och det finns flera politiska alternativ.', 'easy', NOW(), NOW());

SET @questionId = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Människor röstar utan hot eller tvång', 1, NOW(), NOW());

SET @answer1 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Regeringen väljer vilket parti alla ska rösta på', 0, NOW(), NOW());

SET @answer2 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Bara personer med hög inkomst får rösta', 0, NOW(), NOW());

SET @answer3 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Alla måste berätta offentligt hur de röstade', 0, NOW(), NOW());

SET @answer4 = LAST_INSERT_ID();

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'en', 'What characterizes a free election in a democracy?', 'In a free election, every eligible voter has one vote and can choose without threats or coercion. The ballot is secret and there are several political alternatives.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'ar', 'ما الذي يميز الانتخابات الحرة في النظام الديمقراطي؟', 'في الانتخابات الحرة يكون لكل شخص يحق له التصويت صوت واحد، ويمكنه الاختيار دون تهديد أو إكراه. ويكون التصويت سريًا وتوجد بدائل سياسية متعددة.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'fa', 'ویژگی یک انتخابات آزاد در دموکراسی چیست؟', 'در یک انتخابات آزاد، هر فرد واجد شرایط یک رأی دارد و بدون تهدید یا اجبار انتخاب می‌کند. رأی‌گیری محرمانه است و چند گزینه سیاسی وجود دارد.', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'en', 'People vote without threats or coercion', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'ar', 'يصوت الناس دون تهديد أو إكراه', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'fa', 'مردم بدون تهدید یا اجبار رأی می‌دهند', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'en', 'The government chooses which party everyone must vote for', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'ar', 'تختار الحكومة الحزب الذي يجب على الجميع التصويت له', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'fa', 'دولت تعیین می‌کند که همه به کدام حزب رأی بدهند', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'en', 'Only people with high incomes may vote', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'ar', 'فقط أصحاب الدخل المرتفع يحق لهم التصويت', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'fa', 'تنها افراد با درآمد بالا حق رأی دارند', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'en', 'Everyone must publicly say how they voted', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'ar', 'يجب على الجميع إعلان كيفية تصويتهم', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'fa', 'همه باید به‌صورت عمومی بگویند چگونه رأی داده‌اند', NOW(), NOW());

INSERT INTO questions
(subjectId, question, explanation, difficulty, createdAt, updatedAt)
VALUES
(2, 'Hur kan segregation försvaga demokratin enligt materialet?', 'Segregation kan minska kontakten mellan grupper och förtroendet för myndigheter. Det kan i sin tur leda till mindre politiskt engagemang.', 'medium', NOW(), NOW());

SET @questionId = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Den kan minska förtroendet och det politiska engagemanget', 1, NOW(), NOW());

SET @answer1 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Den gör att fler automatiskt går med i partier', 0, NOW(), NOW());

SET @answer2 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Den gör alla bostadsområden mer lika', 0, NOW(), NOW());

SET @answer3 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Den ökar alltid tillgången till samhällsservice', 0, NOW(), NOW());

SET @answer4 = LAST_INSERT_ID();

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'en', 'How can segregation weaken democracy according to the material?', 'Segregation can reduce contact between groups and trust in public authorities. This can in turn lead to less political participation.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'ar', 'كيف يمكن أن يضعف الفصل الاجتماعي الديمقراطية وفقًا للمادة؟', 'قد يقلل الفصل الاجتماعي التواصل بين المجموعات والثقة بالسلطات. وهذا قد يؤدي بدوره إلى انخفاض المشاركة السياسية.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'fa', 'طبق مطالب، جدایی اجتماعی چگونه می‌تواند دموکراسی را تضعیف کند؟', 'جدایی اجتماعی می‌تواند تماس میان گروه‌ها و اعتماد به اداره‌های دولتی را کاهش دهد. این موضوع می‌تواند به مشارکت سیاسی کمتر منجر شود.', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'en', 'It can reduce trust and political participation', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'ar', 'قد تقلل الثقة والمشاركة السياسية', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'fa', 'می‌تواند اعتماد و مشارکت سیاسی را کاهش دهد', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'en', 'It automatically makes more people join parties', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'ar', 'تجعل عددًا أكبر من الناس ينضمون تلقائيًا إلى الأحزاب', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'fa', 'باعث می‌شود افراد بیشتری خودکار عضو احزاب شوند', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'en', 'It makes all residential areas more similar', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'ar', 'تجعل جميع الأحياء السكنية أكثر تشابهًا', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'fa', 'همه مناطق مسکونی را شبیه‌تر می‌سازد', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'en', 'It always increases access to public services', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'ar', 'تزيد دائمًا الوصول إلى الخدمات العامة', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'fa', 'همیشه دسترسی به خدمات عمومی را افزایش می‌دهد', NOW(), NOW());

INSERT INTO questions
(subjectId, question, explanation, difficulty, createdAt, updatedAt)
VALUES
(3, 'Vilken är regionernas främsta uppgift?', 'Regionernas främsta uppgift är att ansvara för hälso- och sjukvården. De ansvarar också för bland annat kollektivtrafik och länsmuseer.', 'easy', NOW(), NOW());

SET @questionId = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Hälso- och sjukvård', 1, NOW(), NOW());

SET @answer1 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Grundskolor', 0, NOW(), NOW());

SET @answer2 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Polisens brottsutredningar', 0, NOW(), NOW());

SET @answer3 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Statens utrikespolitik', 0, NOW(), NOW());

SET @answer4 = LAST_INSERT_ID();

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'en', 'What is the regions'' main responsibility?', 'The regions'' main responsibility is health and medical care. They are also responsible for areas such as public transport and county museums.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'ar', 'ما هي المهمة الرئيسية للأقاليم؟', 'تتمثل المهمة الرئيسية للأقاليم في مسؤوليتها عن الرعاية الصحية والطبية. وهي مسؤولة أيضًا عن النقل العام ومتاحف الأقاليم، من بين أمور أخرى.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'fa', 'مسئولیت اصلی مناطق چیست؟', 'مسئولیت اصلی مناطق، خدمات صحی و درمانی است. آن‌ها همچنین مسئول حمل‌ونقل عمومی و موزیم‌های ولایتی هستند.', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'en', 'Health and medical care', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'ar', 'الرعاية الصحية والطبية', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'fa', 'خدمات صحی و درمانی', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'en', 'Compulsory schools', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'ar', 'المدارس الأساسية', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'fa', 'مکاتب ابتدایی و اجباری', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'en', 'Police criminal investigations', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'ar', 'تحقيقات الشرطة الجنائية', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'fa', 'تحقیقات جنایی پولیس', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'en', 'The state''s foreign policy', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'ar', 'السياسة الخارجية للدولة', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'fa', 'سیاست خارجی دولت', NOW(), NOW());

INSERT INTO questions
(subjectId, question, explanation, difficulty, createdAt, updatedAt)
VALUES
(3, 'Vad betyder det att Sverige är en konstitutionell monarki?', 'Sverige har en kung eller drottning som statschef, men statschefen har ingen politisk makt. Monarken fungerar främst som en symbol för landet.', 'easy', NOW(), NOW());

SET @questionId = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Statschefen är en monark utan politisk makt', 1, NOW(), NOW());

SET @answer1 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Kungen bestämmer vilka lagar riksdagen ska anta', 0, NOW(), NOW());

SET @answer2 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Regeringen ärver sin makt inom en familj', 0, NOW(), NOW());

SET @answer3 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Domstolarna styr landet tillsammans med kungen', 0, NOW(), NOW());

SET @answer4 = LAST_INSERT_ID();

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'en', 'What does it mean that Sweden is a constitutional monarchy?', 'Sweden has a king or queen as head of state, but the head of state has no political power. The monarch mainly serves as a symbol of the country.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'ar', 'ماذا يعني أن السويد ملكية دستورية؟', 'للـسويد ملك أو ملكة بوصفه رئيسًا للدولة، لكن رئيس الدولة لا يملك سلطة سياسية. ويؤدي الملك أساسًا دور رمز للبلاد.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'fa', 'این‌که سویدن یک پادشاهی مشروطه است چه معنا دارد؟', 'سویدن یک پادشاه یا ملکه به‌عنوان رئیس کشور دارد، اما رئیس کشور قدرت سیاسی ندارد. پادشاه بیشتر نماد کشور است.', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'en', 'The head of state is a monarch without political power', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'ar', 'رئيس الدولة ملك دون سلطة سياسية', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'fa', 'رئیس کشور یک پادشاه بدون قدرت سیاسی است', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'en', 'The king decides which laws parliament must adopt', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'ar', 'الملك يقرر القوانين التي يجب أن يعتمدها البرلمان', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'fa', 'پادشاه تعیین می‌کند پارلمان کدام قوانین را تصویب کند', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'en', 'The government inherits its power within a family', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'ar', 'ترث الحكومة سلطتها داخل عائلة', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'fa', 'حکومت قدرت خود را در یک خانواده به ارث می‌برد', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'en', 'The courts govern the country together with the king', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'ar', 'تحكم المحاكم البلاد مع الملك', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'fa', 'محاکم همراه با پادشاه کشور را اداره می‌کنند', NOW(), NOW());

INSERT INTO questions
(subjectId, question, explanation, difficulty, createdAt, updatedAt)
VALUES
(4, 'Vilket krav gäller för att få rösta i riksdagsvalet?', 'Den som röstar i riksdagsvalet måste ha fyllt 18 år och vara svensk medborgare. Reglerna för kommun- och regionval är annorlunda.', 'easy', NOW(), NOW());

SET @questionId = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Man ska ha fyllt 18 år och vara svensk medborgare', 1, NOW(), NOW());

SET @answer1 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Man ska ha bott i Sverige i minst ett år', 0, NOW(), NOW());

SET @answer2 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Man ska vara medlem i ett politiskt parti', 0, NOW(), NOW());

SET @answer3 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Man ska ha ett arbete och betala skatt', 0, NOW(), NOW());

SET @answer4 = LAST_INSERT_ID();

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'en', 'What requirement applies in order to vote in the parliamentary election?', 'A person voting in the parliamentary election must be at least 18 years old and a Swedish citizen. The rules for municipal and regional elections are different.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'ar', 'ما الشرط المطلوب للتصويت في انتخابات البرلمان؟', 'يجب أن يكون الشخص الذي يصوت في انتخابات البرلمان قد بلغ 18 عامًا وأن يكون مواطنًا سويديًا. وتختلف قواعد انتخابات البلديات والأقاليم.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'fa', 'برای رأی دادن در انتخابات پارلمان چه شرطی وجود دارد؟', 'فردی که در انتخابات پارلمان رأی می‌دهد باید حداقل ۱۸ ساله و شهروند سویدن باشد. مقررات انتخابات شهرداری و منطقه متفاوت است.', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'en', 'You must be at least 18 and a Swedish citizen', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'ar', 'يجب أن يكون العمر 18 عامًا على الأقل وأن يكون الشخص مواطنًا سويديًا', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'fa', 'باید حداقل ۱۸ ساله و شهروند سویدن باشید', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'en', 'You must have lived in Sweden for at least one year', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'ar', 'يجب أن تكون قد عشت في السويد سنة واحدة على الأقل', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'fa', 'باید حداقل یک سال در سویدن زندگی کرده باشید', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'en', 'You must be a member of a political party', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'ar', 'يجب أن تكون عضوًا في حزب سياسي', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'fa', 'باید عضو یک حزب سیاسی باشید', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'en', 'You must have a job and pay tax', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'ar', 'يجب أن يكون لديك عمل وأن تدفع الضرائب', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'fa', 'باید کار داشته و مالیات پرداخت کنید', NOW(), NOW());

INSERT INTO questions
(subjectId, question, explanation, difficulty, createdAt, updatedAt)
VALUES
(4, 'Ett parti får 20 procent av rösterna i ett proportionellt val. Vad innebär det?', 'I ett proportionellt val fördelas platserna efter partiernas andel av rösterna. Ett parti med 20 procent av rösterna får därför ungefär 20 procent av platserna.', 'medium', NOW(), NOW());

SET @questionId = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Partiet får ungefär 20 procent av platserna', 1, NOW(), NOW());

SET @answer1 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Partiet får automatiskt bilda regering', 0, NOW(), NOW());

SET @answer2 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Partiet får alla platser i riksdagen', 0, NOW(), NOW());

SET @answer3 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Partiet får inga platser förrän det får över 50 procent', 0, NOW(), NOW());

SET @answer4 = LAST_INSERT_ID();

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'en', 'A party receives 20 percent of the votes in a proportional election. What does this mean?', 'In a proportional election, seats are distributed according to each party''s share of the votes. A party with 20 percent of the votes therefore receives about 20 percent of the seats.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'ar', 'حصل حزب على 20 في المئة من الأصوات في انتخابات نسبية. ماذا يعني ذلك؟', 'في الانتخابات النسبية توزع المقاعد وفق نسبة الأصوات التي حصل عليها كل حزب. لذلك يحصل الحزب الذي نال 20 في المئة من الأصوات على نحو 20 في المئة من المقاعد.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'fa', 'یک حزب در انتخابات تناسبی ۲۰ درصد آرا را به دست می‌آورد. این چه معنا دارد؟', 'در انتخابات تناسبی، کرسی‌ها بر اساس سهم هر حزب از آرا تقسیم می‌شوند. بنابراین حزبی با ۲۰ درصد آرا تقریباً ۲۰ درصد کرسی‌ها را دریافت می‌کند.', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'en', 'The party receives about 20 percent of the seats', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'ar', 'يحصل الحزب على نحو 20 في المئة من المقاعد', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'fa', 'حزب تقریباً ۲۰ درصد کرسی‌ها را به دست می‌آورد', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'en', 'The party automatically forms the government', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'ar', 'يشكل الحزب الحكومة تلقائيًا', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'fa', 'حزب به‌طور خودکار حکومت تشکیل می‌دهد', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'en', 'The party receives all seats in parliament', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'ar', 'يحصل الحزب على جميع مقاعد البرلمان', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'fa', 'حزب تمام کرسی‌های پارلمان را می‌گیرد', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'en', 'The party receives no seats until it gets over 50 percent', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'ar', 'لا يحصل الحزب على مقاعد حتى يتجاوز 50 في المئة', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'fa', 'حزب تا زمانی که بیش از ۵۰ درصد نگیرد هیچ کرسی دریافت نمی‌کند', NOW(), NOW());

INSERT INTO questions
(subjectId, question, explanation, difficulty, createdAt, updatedAt)
VALUES
(5, 'Vad innebär rättssäkerhet?', 'Rättssäkerhet betyder att alla behandlas lika inför lagen och har rätt till en rättvis rättegång. Bevis och fakta ska granskas innan någon döms.', 'easy', NOW(), NOW());

SET @questionId = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Alla behandlas lika inför lagen och får en rättvis rättegång', 1, NOW(), NOW());

SET @answer1 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Regeringen bestämmer hur domstolarna ska döma', 0, NOW(), NOW());

SET @answer2 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'En misstänkt person räknas alltid som skyldig', 0, NOW(), NOW());

SET @answer3 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Bara svenska medborgare får försvara sig i domstol', 0, NOW(), NOW());

SET @answer4 = LAST_INSERT_ID();

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'en', 'What does the rule of law mean?', 'The rule of law means that everyone is treated equally before the law and has the right to a fair trial. Evidence and facts must be examined before anyone is convicted.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'ar', 'ماذا يعني ضمان سيادة القانون؟', 'يعني ضمان سيادة القانون أن يعامل الجميع بالتساوي أمام القانون وأن يكون لهم الحق في محاكمة عادلة. ويجب فحص الأدلة والوقائع قبل إدانة أي شخص.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'fa', 'حاکمیت قانون چه معنا دارد؟', 'حاکمیت قانون یعنی همه در برابر قانون برابر رفتار شوند و حق محاکمه عادلانه داشته باشند. پیش از محکوم شدن هر فرد، شواهد و واقعیت‌ها باید بررسی شوند.', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'en', 'Everyone is treated equally before the law and receives a fair trial', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'ar', 'يعامل الجميع بالتساوي أمام القانون ويحصلون على محاكمة عادلة', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'fa', 'همه در برابر قانون برابر رفتار می‌شوند و محاکمه عادلانه دارند', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'en', 'The government decides how courts must rule', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'ar', 'تقرر الحكومة كيف يجب أن تحكم المحاكم', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'fa', 'حکومت تعیین می‌کند محاکم چگونه حکم بدهند', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'en', 'A suspected person is always considered guilty', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'ar', 'يعتبر الشخص المشتبه به مذنبًا دائمًا', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'fa', 'فرد مظنون همیشه گناهکار شمرده می‌شود', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'en', 'Only Swedish citizens may defend themselves in court', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'ar', 'فقط المواطنون السويديون يحق لهم الدفاع عن أنفسهم في المحكمة', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'fa', 'فقط شهروندان سویدن حق دفاع از خود در محکمه را دارند', NOW(), NOW());

INSERT INTO questions
(subjectId, question, explanation, difficulty, createdAt, updatedAt)
VALUES
(5, 'En person vill att en dom från tingsrätten ska prövas igen. Vilken domstol prövar normalt överklagandet?', 'Hovrätten prövar fall som har överklagats från tingsrätten. Högsta domstolen prövar bara vissa viktiga fall som redan gått genom de lägre domstolarna.', 'medium', NOW(), NOW());

SET @questionId = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Hovrätten', 1, NOW(), NOW());

SET @answer1 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Högsta domstolen direkt', 0, NOW(), NOW());

SET @answer2 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Justitiekanslern', 0, NOW(), NOW());

SET @answer3 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Åklagarmyndigheten', 0, NOW(), NOW());

SET @answer4 = LAST_INSERT_ID();

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'en', 'A person wants a judgment from a district court to be reviewed. Which court normally hears the appeal?', 'The Court of Appeal hears cases appealed from the district court. The Supreme Court only hears certain important cases that have already passed through the lower courts.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'ar', 'يريد شخص إعادة النظر في حكم صادر عن المحكمة الابتدائية. أي محكمة تنظر عادة في الاستئناف؟', 'تنظر محكمة الاستئناف في القضايا المستأنفة من المحكمة الابتدائية. أما المحكمة العليا فتنظر فقط في بعض القضايا المهمة التي مرت بالمحاكم الأدنى.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'fa', 'فردی می‌خواهد حکم محکمه ابتدایی دوباره بررسی شود. کدام محکمه معمولاً استیناف را بررسی می‌کند؟', 'محکمه استیناف پرونده‌هایی را بررسی می‌کند که از محکمه ابتدایی استیناف شده‌اند. محکمه عالی تنها برخی پرونده‌های مهم را بررسی می‌کند که از محاکم پایین‌تر گذشته‌اند.', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'en', 'The Court of Appeal', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'ar', 'محكمة الاستئناف', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'fa', 'محکمه استیناف', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'en', 'The Supreme Court directly', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'ar', 'المحكمة العليا مباشرة', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'fa', 'مستقیماً محکمه عالی', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'en', 'The Chancellor of Justice', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'ar', 'مستشار العدل', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'fa', 'صدراعظم عدلی', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'en', 'The Swedish Prosecution Authority', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'ar', 'هيئة الادعاء العام', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'fa', 'اداره سارنوالی', NOW(), NOW());

INSERT INTO questions
(subjectId, question, explanation, difficulty, createdAt, updatedAt)
VALUES
(6, 'Hur finansieras public service i Sverige enligt materialet?', 'Public service finansieras genom en avgift som tas ut via skatten. Företagen får inte tjäna pengar på reklam.', 'easy', NOW(), NOW());

SET @questionId = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Genom en avgift via skatten', 1, NOW(), NOW());

SET @answer1 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Enbart genom reklam', 0, NOW(), NOW());

SET @answer2 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Genom medlemsavgifter till politiska partier', 0, NOW(), NOW());

SET @answer3 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Enbart genom försäljning av tidningar', 0, NOW(), NOW());

SET @answer4 = LAST_INSERT_ID();

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'en', 'How is public service media financed in Sweden according to the material?', 'Public service media is financed through a fee collected via tax. The companies are not allowed to make money from advertising.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'ar', 'كيف تمول وسائل الإعلام العامة في السويد وفقًا للمادة؟', 'تمول وسائل الإعلام العامة من خلال رسم يجمع عبر الضرائب. ولا يسمح للشركات بتحقيق أرباح من الإعلانات.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'fa', 'طبق مطالب، رسانه‌های خدمات عمومی در سویدن چگونه تأمین مالی می‌شوند؟', 'رسانه‌های خدمات عمومی از طریق هزینه‌ای تأمین می‌شوند که با مالیات دریافت می‌گردد. این شرکت‌ها اجازه ندارند از تبلیغات درآمد کسب کنند.', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'en', 'Through a fee collected via tax', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'ar', 'من خلال رسم يجمع عبر الضرائب', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'fa', 'از طریق هزینه‌ای که با مالیات دریافت می‌شود', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'en', 'Only through advertising', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'ar', 'فقط من خلال الإعلانات', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'fa', 'فقط از طریق تبلیغات', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'en', 'Through membership fees to political parties', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'ar', 'من خلال رسوم عضوية الأحزاب السياسية', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'fa', 'از طریق حق عضویت احزاب سیاسی', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'en', 'Only through newspaper sales', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'ar', 'فقط من خلال بيع الصحف', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'fa', 'فقط از طریق فروش روزنامه‌ها', NOW(), NOW());

INSERT INTO questions
(subjectId, question, explanation, difficulty, createdAt, updatedAt)
VALUES
(6, 'Vad betyder det att vara källkritisk?', 'Att vara källkritisk innebär att kontrollera och ifrågasätta om information är korrekt. Det är viktigt eftersom falska uppgifter kan spridas snabbt.', 'easy', NOW(), NOW());

SET @questionId = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Att kontrollera om information är korrekt', 1, NOW(), NOW());

SET @answer1 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Att alltid lita på det som delas i sociala medier', 0, NOW(), NOW());

SET @answer2 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Att bara läsa information från en enda källa', 0, NOW(), NOW());

SET @answer3 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Att undvika alla nyheter och samhällsfrågor', 0, NOW(), NOW());

SET @answer4 = LAST_INSERT_ID();

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'en', 'What does it mean to be source-critical?', 'Being source-critical means checking and questioning whether information is correct. This is important because false information can spread quickly.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'ar', 'ماذا يعني أن تكون ناقدًا للمصادر؟', 'يعني نقد المصادر التحقق من صحة المعلومات وطرح الأسئلة حولها. وهذا مهم لأن المعلومات الكاذبة قد تنتشر بسرعة.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'fa', 'نقد منبع چه معنا دارد؟', 'نقد منبع یعنی بررسی و پرسش درباره درست بودن اطلاعات. این مهم است زیرا اطلاعات نادرست می‌تواند به سرعت پخش شود.', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'en', 'To check whether information is correct', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'ar', 'التحقق من صحة المعلومات', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'fa', 'بررسی کردن درست بودن اطلاعات', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'en', 'To always trust what is shared on social media', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'ar', 'الثقة دائمًا بما ينشر في وسائل التواصل الاجتماعي', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'fa', 'همیشه به مطالب شبکه‌های اجتماعی اعتماد کردن', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'en', 'To read information from only one source', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'ar', 'قراءة المعلومات من مصدر واحد فقط', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'fa', 'اطلاعات را فقط از یک منبع خواندن', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'en', 'To avoid all news and social issues', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'ar', 'تجنب جميع الأخبار والقضايا المجتمعية', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'fa', 'از همه خبرها و موضوعات اجتماعی دوری کردن', NOW(), NOW());

INSERT INTO questions
(subjectId, question, explanation, difficulty, createdAt, updatedAt)
VALUES
(7, 'Vad ska en domstol göra när föräldrar inte är överens om var ett barn ska bo?', 'Barnkonventionen innebär att barnets åsikt ska beaktas i beslut som påverkar barnet. Därför ska domstolen också fråga barnet vad det vill.', 'medium', NOW(), NOW());

SET @questionId = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Fråga barnet vad det vill', 1, NOW(), NOW());

SET @answer1 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Låta den äldsta föräldern bestämma', 0, NOW(), NOW());

SET @answer2 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Alltid bestämma att barnet ska bo hos modern', 0, NOW(), NOW());

SET @answer3 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Vänta tills barnet har fyllt 18 år', 0, NOW(), NOW());

SET @answer4 = LAST_INSERT_ID();

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'en', 'What should a court do when parents disagree about where a child should live?', 'The Convention on the Rights of the Child means that the child''s opinion must be considered in decisions affecting the child. The court should therefore also ask the child what they want.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'ar', 'ماذا يجب أن تفعل المحكمة عندما يختلف الوالدان بشأن مكان إقامة الطفل؟', 'تعني اتفاقية حقوق الطفل أن رأي الطفل يجب أن يؤخذ في الاعتبار في القرارات التي تؤثر عليه. لذلك يجب على المحكمة أيضًا أن تسأل الطفل عما يريده.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'fa', 'وقتی والدین درباره محل زندگی کودک توافق ندارند، محکمه چه باید بکند؟', 'کنوانسیون حقوق کودک می‌گوید نظر کودک باید در تصمیم‌هایی که بر او اثر می‌گذارد در نظر گرفته شود. بنابراین محکمه باید از کودک نیز بپرسد چه می‌خواهد.', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'en', 'Ask the child what they want', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'ar', 'سؤال الطفل عما يريده', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'fa', 'از کودک بپرسد چه می‌خواهد', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'en', 'Let the older parent decide', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'ar', 'ترك القرار للوالد الأكبر سنًا', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'fa', 'اجازه دهد والد بزرگ‌تر تصمیم بگیرد', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'en', 'Always decide that the child must live with the mother', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'ar', 'الحكم دائمًا بأن يعيش الطفل مع الأم', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'fa', 'همیشه تصمیم بگیرد کودک نزد مادر زندگی کند', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'en', 'Wait until the child turns 18', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'ar', 'الانتظار حتى يبلغ الطفل 18 عامًا', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'fa', 'تا ۱۸ ساله شدن کودک صبر کند', NOW(), NOW());

INSERT INTO questions
(subjectId, question, explanation, difficulty, createdAt, updatedAt)
VALUES
(7, 'Vilken uppgift har Sametinget enligt materialet?', 'Sametinget representerar den samiska befolkningen i frågor om språk, kultur och identitet. Det är ett rådgivande organ som också har vissa myndighetsuppgifter.', 'hard', NOW(), NOW());

SET @questionId = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Att representera samer i frågor om språk, kultur och identitet', 1, NOW(), NOW());

SET @answer1 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Att besluta om alla lagar i norra Sverige', 0, NOW(), NOW());

SET @answer2 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Att ansvara för hela Sveriges jordbruk', 0, NOW(), NOW());

SET @answer3 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Att styra regionernas hälso- och sjukvård', 0, NOW(), NOW());

SET @answer4 = LAST_INSERT_ID();

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'en', 'What role does the Sami Parliament have according to the material?', 'The Sami Parliament represents the Sami population in matters of language, culture and identity. It is an advisory body that also has certain public authority duties.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'ar', 'ما المهمة التي يؤديها برلمان السامي وفقًا للمادة؟', 'يمثل برلمان السامي السكان الساميين في قضايا اللغة والثقافة والهوية. وهو هيئة استشارية لها أيضًا بعض المهام الحكومية.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'fa', 'طبق مطالب، پارلمان سامی چه وظیفه‌ای دارد؟', 'پارلمان سامی از جمعیت سامی در امور زبان، فرهنگ و هویت نمایندگی می‌کند. این نهاد مشورتی است و برخی وظایف اداری دولتی نیز دارد.', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'en', 'To represent the Sami in matters of language, culture and identity', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'ar', 'تمثيل شعب السامي في قضايا اللغة والثقافة والهوية', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'fa', 'نمایندگی از سامی‌ها در امور زبان، فرهنگ و هویت', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'en', 'To decide all laws in northern Sweden', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'ar', 'إقرار جميع القوانين في شمال السويد', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'fa', 'تصمیم‌گیری درباره همه قوانین شمال سویدن', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'en', 'To be responsible for all agriculture in Sweden', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'ar', 'تحمل مسؤولية الزراعة في جميع أنحاء السويد', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'fa', 'مسئولیت تمام کشاورزی سویدن', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'en', 'To govern regional health care', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'ar', 'إدارة الرعاية الصحية في الأقاليم', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'fa', 'اداره خدمات صحی مناطق', NOW(), NOW());

INSERT INTO questions
(subjectId, question, explanation, difficulty, createdAt, updatedAt)
VALUES
(8, 'Vem bestämmer normalt lönerna i Sverige?', 'Löner bestäms genom förhandlingar mellan fackförbund och arbetsgivarorganisationer. Staten bestämmer alltså normalt inte lönerna.', 'easy', NOW(), NOW());

SET @questionId = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Arbetsmarknadens parter genom förhandlingar', 1, NOW(), NOW());

SET @answer1 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Riksdagen genom en lag för varje yrke', 0, NOW(), NOW());

SET @answer2 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Polisen efter kontroll av arbetsplatsen', 0, NOW(), NOW());

SET @answer3 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Kommunen genom kommunfullmäktige', 0, NOW(), NOW());

SET @answer4 = LAST_INSERT_ID();

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'en', 'Who normally determines wages in Sweden?', 'Wages are determined through negotiations between trade unions and employers'' organizations. The state therefore does not normally set wages.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'ar', 'من يحدد الأجور عادة في السويد؟', 'تحدد الأجور من خلال المفاوضات بين النقابات العمالية ومنظمات أصحاب العمل. لذلك لا تحدد الدولة الأجور عادة.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'fa', 'معمولاً چه کسی دستمزدها را در سویدن تعیین می‌کند؟', 'دستمزدها از طریق مذاکره میان اتحادیه‌های کارگری و سازمان‌های کارفرمایان تعیین می‌شوند. بنابراین دولت معمولاً دستمزدها را تعیین نمی‌کند.', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'en', 'The labour market parties through negotiations', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'ar', 'أطراف سوق العمل من خلال المفاوضات', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'fa', 'طرف‌های بازار کار از طریق مذاکره', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'en', 'Parliament through a law for each occupation', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'ar', 'البرلمان من خلال قانون لكل مهنة', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'fa', 'پارلمان از طریق قانونی برای هر شغل', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'en', 'The police after inspecting the workplace', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'ar', 'الشرطة بعد تفتيش مكان العمل', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'fa', 'پولیس پس از بررسی محل کار', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'en', 'The municipality through the municipal council', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'ar', 'البلدية من خلال المجلس البلدي', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'fa', 'شهرداری از طریق شورای شهرداری', NOW(), NOW());

INSERT INTO questions
(subjectId, question, explanation, difficulty, createdAt, updatedAt)
VALUES
(8, 'Vilka villkor måste en arbetslös person bland annat uppfylla för att få ersättning från A-kassan?', 'Personen måste ha arbetat tillräckligt många timmar under en bestämd period och vara aktivt arbetssökande. Ersättningen finansieras av staten och medlemsavgifter.', 'medium', NOW(), NOW());

SET @questionId = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Ha arbetat tillräckligt och vara aktivt arbetssökande', 1, NOW(), NOW());

SET @answer1 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Ha köpt en bostad och tagit ett banklån', 0, NOW(), NOW());

SET @answer2 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Vara medlem i ett politiskt parti', 0, NOW(), NOW());

SET @answer3 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Ha arbetat endast inom offentlig sektor', 0, NOW(), NOW());

SET @answer4 = LAST_INSERT_ID();

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'en', 'What conditions must an unemployed person meet, among others, to receive unemployment insurance benefits?', 'The person must have worked enough hours during a specified period and be actively seeking work. The benefit is financed by the state and membership fees.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'ar', 'ما الشروط التي يجب على الشخص العاطل عن العمل استيفاؤها، من بين شروط أخرى، للحصول على تعويض صندوق البطالة؟', 'يجب أن يكون الشخص قد عمل عددًا كافيًا من الساعات خلال فترة محددة وأن يبحث بنشاط عن عمل. ويمول التعويض من الدولة ورسوم الأعضاء.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'fa', 'فرد بیکار برای دریافت کمک‌هزینه صندوق بیکاری باید از جمله چه شرایطی را داشته باشد؟', 'فرد باید در یک دوره مشخص ساعت‌های کافی کار کرده باشد و فعالانه به دنبال کار باشد. این کمک‌هزینه از سوی دولت و حق عضویت اعضا تأمین می‌شود.', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'en', 'Have worked enough and be actively seeking work', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'ar', 'أن يكون قد عمل مدة كافية وأن يبحث بنشاط عن عمل', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'fa', 'به اندازه کافی کار کرده و فعالانه در جستجوی کار باشد', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'en', 'Have bought a home and taken a bank loan', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'ar', 'أن يكون قد اشترى منزلًا وأخذ قرضًا مصرفيًا', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'fa', 'خانه خریده و وام بانکی گرفته باشد', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'en', 'Be a member of a political party', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'ar', 'أن يكون عضوًا في حزب سياسي', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'fa', 'عضو یک حزب سیاسی باشد', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'en', 'Have worked only in the public sector', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'ar', 'أن يكون قد عمل فقط في القطاع العام', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'fa', 'فقط در بخش دولتی کار کرده باشد', NOW(), NOW());

INSERT INTO questions
(subjectId, question, explanation, difficulty, createdAt, updatedAt)
VALUES
(9, 'När betalar en person moms?', 'Moms är en skatt som betalas när man köper varor och tjänster. Den bidrar tillsammans med andra skatter till finansieringen av välfärden.', 'easy', NOW(), NOW());

SET @questionId = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'När personen köper varor och tjänster', 1, NOW(), NOW());

SET @answer1 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'När personen röstar i ett val', 0, NOW(), NOW());

SET @answer2 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'När personen besöker en allmän park', 0, NOW(), NOW());

SET @answer3 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'När personen blir medlem i en förening', 0, NOW(), NOW());

SET @answer4 = LAST_INSERT_ID();

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'en', 'When does a person pay value-added tax?', 'Value-added tax is paid when goods and services are purchased. Together with other taxes, it helps finance welfare services.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'ar', 'متى يدفع الشخص ضريبة القيمة المضافة؟', 'تدفع ضريبة القيمة المضافة عند شراء السلع والخدمات. وهي تساهم مع الضرائب الأخرى في تمويل خدمات الرفاه.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'fa', 'فرد چه زمانی مالیات بر ارزش افزوده می‌پردازد؟', 'مالیات بر ارزش افزوده هنگام خرید کالا و خدمات پرداخت می‌شود. این مالیات همراه با مالیات‌های دیگر به تأمین خدمات رفاهی کمک می‌کند.', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'en', 'When the person buys goods and services', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'ar', 'عندما يشتري الشخص السلع والخدمات', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'fa', 'هنگامی که فرد کالا و خدمات می‌خرد', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'en', 'When the person votes in an election', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'ar', 'عندما يصوت الشخص في انتخابات', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'fa', 'هنگامی که فرد در انتخابات رأی می‌دهد', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'en', 'When the person visits a public park', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'ar', 'عندما يزور الشخص حديقة عامة', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'fa', 'هنگامی که فرد از پارک عمومی دیدن می‌کند', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'en', 'When the person joins an association', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'ar', 'عندما يصبح الشخص عضوًا في جمعية', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'fa', 'هنگامی که فرد عضو یک انجمن می‌شود', NOW(), NOW());

INSERT INTO questions
(subjectId, question, explanation, difficulty, createdAt, updatedAt)
VALUES
(9, 'En äldre person klarar inte längre vardagen hemma utan hjälp. Vem har ansvar för att erbjuda stöd?', 'Kommunen ansvarar för äldreomsorgen och ska erbjuda äldre stöd och hjälp. Stödet kan ges i hemmet eller genom ett boende anpassat för äldre.', 'medium', NOW(), NOW());

SET @questionId = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Kommunen', 1, NOW(), NOW());

SET @answer1 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Riksdagen', 0, NOW(), NOW());

SET @answer2 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Sametinget', 0, NOW(), NOW());

SET @answer3 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Public service-företagen', 0, NOW(), NOW());

SET @answer4 = LAST_INSERT_ID();

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'en', 'An older person can no longer manage everyday life at home without help. Who is responsible for offering support?', 'The municipality is responsible for elderly care and must offer older people support and assistance. Support may be provided at home or in accommodation adapted for older people.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'ar', 'لم يعد شخص مسن قادرًا على إدارة حياته اليومية في المنزل دون مساعدة. من المسؤول عن تقديم الدعم؟', 'البلدية مسؤولة عن رعاية المسنين ويجب أن تقدم لهم الدعم والمساعدة. ويمكن تقديم الدعم في المنزل أو في سكن مخصص للمسنين.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'fa', 'یک فرد سالمند دیگر بدون کمک نمی‌تواند زندگی روزمره را در خانه اداره کند. چه کسی مسئول ارائه حمایت است؟', 'شهرداری مسئول مراقبت از سالمندان است و باید به آنان حمایت و کمک ارائه کند. این حمایت می‌تواند در خانه یا در اقامتگاه ویژه سالمندان ارائه شود.', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'en', 'The municipality', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'ar', 'البلدية', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'fa', 'شهرداری', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'en', 'Parliament', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'ar', 'البرلمان', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'fa', 'پارلمان', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'en', 'The Sami Parliament', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'ar', 'برلمان السامي', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'fa', 'پارلمان سامی', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'en', 'The public service media companies', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'ar', 'شركات الإعلام العام', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'fa', 'شرکت‌های رسانه خدمات عمومی', NOW(), NOW());

INSERT INTO questions
(subjectId, question, explanation, difficulty, createdAt, updatedAt)
VALUES
(10, 'Vad hände när Sverige började utvecklas till ett industrisamhälle under 1800-talet?', 'Industrier och fabriker växte fram och många människor flyttade från landsbygden till städerna för att arbeta. Samhället förändrades från jordbruk till industri.', 'easy', NOW(), NOW());

SET @questionId = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Många flyttade till städerna för att arbeta i fabriker', 1, NOW(), NOW());

SET @answer1 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'De flesta städer blev mindre och försvann', 0, NOW(), NOW());

SET @answer2 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Jordbruket upphörde helt i hela landet', 0, NOW(), NOW());

SET @answer3 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Sverige slutade använda maskiner i arbetet', 0, NOW(), NOW());

SET @answer4 = LAST_INSERT_ID();

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'en', 'What happened when Sweden began developing into an industrial society during the nineteenth century?', 'Industries and factories grew, and many people moved from rural areas to cities for work. Society changed from being mainly agricultural to industrial.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'ar', 'ماذا حدث عندما بدأت السويد تتحول إلى مجتمع صناعي خلال القرن التاسع عشر؟', 'نمت الصناعات والمصانع وانتقل كثير من الناس من الريف إلى المدن للعمل. وتحول المجتمع من الزراعة إلى الصناعة.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'fa', 'وقتی سویدن در قرن نوزدهم به جامعه صنعتی تبدیل شد چه اتفاقی افتاد؟', 'صنایع و کارخانه‌ها رشد کردند و بسیاری از مردم برای کار از روستاها به شهرها رفتند. جامعه از کشاورزی به صنعت تغییر کرد.', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'en', 'Many people moved to cities to work in factories', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'ar', 'انتقل كثير من الناس إلى المدن للعمل في المصانع', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'fa', 'بسیاری برای کار در کارخانه‌ها به شهرها رفتند', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'en', 'Most cities became smaller and disappeared', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'ar', 'أصبحت معظم المدن أصغر واختفت', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'fa', 'بیشتر شهرها کوچک‌تر شدند و از بین رفتند', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'en', 'Agriculture stopped completely throughout the country', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'ar', 'توقفت الزراعة تمامًا في جميع أنحاء البلاد', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'fa', 'کشاورزی در سراسر کشور کاملاً متوقف شد', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'en', 'Sweden stopped using machines at work', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'ar', 'توقفت السويد عن استخدام الآلات في العمل', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'fa', 'سویدن استفاده از ماشین‌ها در کار را متوقف کرد', NOW(), NOW());

INSERT INTO questions
(subjectId, question, explanation, difficulty, createdAt, updatedAt)
VALUES
(10, 'Varför var grundlagsändringen år 1809 viktig för Sveriges demokratiska utveckling?', 'Grundlagsändringen begränsade kungens makt. Den var ett tidigt steg mot att den politiska makten skulle delas och demokratin senare utvecklas.', 'hard', NOW(), NOW());

SET @questionId = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Den begränsade kungens makt', 1, NOW(), NOW());

SET @answer1 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Den gav omedelbart alla kvinnor rösträtt', 0, NOW(), NOW());

SET @answer2 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Den gjorde Sverige till en republik', 0, NOW(), NOW());

SET @answer3 = LAST_INSERT_ID();

INSERT INTO answers
(questionId, answer, isCorrect, createdAt, updatedAt)
VALUES
(@questionId, 'Den avskaffade riksdagen', 0, NOW(), NOW());

SET @answer4 = LAST_INSERT_ID();

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'en', 'Why was the constitutional change of 1809 important for Sweden''s democratic development?', 'The constitutional change limited the king''s power. It was an early step toward sharing political power and the later development of democracy.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'ar', 'لماذا كان التغيير الدستوري عام 1809 مهمًا لتطور الديمقراطية في السويد؟', 'حد التغيير الدستوري من سلطة الملك. وكان خطوة مبكرة نحو توزيع السلطة السياسية وتطور الديمقراطية لاحقًا.', NOW(), NOW());

INSERT INTO question_translations
(questionId, language, translatedQuestion, translatedExplanation, createdAt, updatedAt)
VALUES
(@questionId, 'fa', 'چرا تغییر قانون اساسی سال ۱۸۰۹ برای رشد دموکراسی در سویدن مهم بود؟', 'این تغییر قانون اساسی قدرت پادشاه را محدود کرد. این یک گام آغازین به سوی تقسیم قدرت سیاسی و رشد بعدی دموکراسی بود.', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'en', 'It limited the king''s power', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'ar', 'حدت من سلطة الملك', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer1, 'fa', 'قدرت پادشاه را محدود کرد', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'en', 'It immediately gave all women the right to vote', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'ar', 'منحت جميع النساء حق التصويت فورًا', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer2, 'fa', 'فوراً به همه زنان حق رأی داد', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'en', 'It made Sweden a republic', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'ar', 'حولت السويد إلى جمهورية', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer3, 'fa', 'سویدن را به جمهوری تبدیل کرد', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'en', 'It abolished parliament', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'ar', 'ألغت البرلمان', NOW(), NOW());

INSERT INTO answer_translations
(answerId, language, translatedAnswer, createdAt, updatedAt)
VALUES
(@answer4, 'fa', 'پارلمان را لغو کرد', NOW(), NOW());

COMMIT;
