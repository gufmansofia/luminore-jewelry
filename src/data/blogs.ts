export interface BlogPost {
  id: number;
  slug: string;
  category: string;
  categoryEn: string;
  categoryUk: string;
  date: string;
  dateEn: string;
  dateUk: string;
  title: string;
  titleEn: string;
  titleUk: string;
  excerpt: string;
  excerptEn: string;
  excerptUk: string;
  readTime: string;
  readTimeEn: string;
  readTimeUk: string;
  content: string[];
  contentEn: string[];
  contentUk: string[];
  image?: string;
  imageAlt?: string;
  imageAltRu?: string;
  imageAltUk?: string;
  imageClassName?: string;
  updatedAt: string;
  sources: {title:string;url:string}[];
  collectionPath: string;
}

export const blogPosts: BlogPost[] = [
  {
    "id": 1,
    "slug": "how-to-choose-engagement-ring",
    "category": "Руководство",
    "categoryEn": "Guide",
    "categoryUk": "Посібник",
    "date": "27 января 2026",
    "dateEn": "January 27, 2026",
    "dateUk": "27 січня 2026",
    "title": "Как выбрать помолвочное кольцо",
    "titleEn": "How to choose an engagement ring",
    "titleUk": "Як обрати заручинну каблучку",
    "excerpt": "При выборе кольца важны камень, оправа, металл и посадка. Разберём четыре характеристики бриллианта и детали, которые стоит обсудить перед заказом.",
    "excerptEn": "Choose a ring by considering the stone, setting, metal and fit. This guide explains the four Cs and the details to discuss before ordering.",
    "excerptUk": "Обираючи каблучку, зверніть увагу на камінь, оправу, метал і посадку. Розгляньмо чотири характеристики діаманта та деталі, які варто обговорити перед замовленням.",
    "readTime": "1 мин",
    "readTimeEn": "2 min",
    "readTimeUk": "1 хв",
    "image": "/blog-images/pear-halo-engagement-ring.jpg",
    "imageAlt": "Pear-shaped diamond halo ring reflected on a black surface",
    "imageAltRu": "Кольцо с грушевидным бриллиантом и ореолом камней на чёрной зеркальной поверхности",
    "imageAltUk": "Каблучка з грушоподібним діамантом та ореолом каменів на чорній дзеркальній поверхні",
    "imageClassName": "article-image--engagement-ring",
    "content": [
      "Начните с того, как вы будете носить кольцо, какие формы вам нравятся и какой бюджет удобен. Несколько примеров помогут объяснить пожелания. Готовый дизайн для первого разговора не нужен.",
      "## Четыре характеристики бриллианта",
      "Карат — мера веса. Цвет, чистота и огранка описывают другие свойства камня. Рассматривайте их вместе, не выбирая только по одной оценке. Камни одинакового веса могут различаться размерами и внешним видом. В руководстве GIA ниже объясняются эти термины.",
      "## Выбор оправы",
      "Обратите внимание на высоту кольца, крепление камня и возможность носить рядом обручальное кольцо. Попросите показать оправу сбоку и сверху. Расскажите, если для работы или повседневных занятий вам удобнее невысокая посадка.",
      "## Металл и размер",
      "Сравните оттенки металла, которые вам нравится носить. Уточните состав сплава и доступную отделку выбранного дизайна. Лучше измерить палец, чем ориентироваться только на другое кольцо, особенно при разной ширине шинки.",
      "## Натуральные или лабораторные бриллианты",
      "Обсудим оба варианта для вашего дизайна. Сравните конкретные камни и сопровождающие их документы, затем согласуйте металл, размеры, посадку и итоговую цену. Сохраните эти детали вместе с подтверждением заказа. Если пока трудно выбрать, покажите фото или расскажите, что вам нравится."
    ],
    "contentEn": [
      "Start with how the ring will be worn, the shapes you like and the budget you want to work within. A few references can help explain your preferences; you do not need a finished design before speaking to us.",
      "## Understanding the four Cs",
      "Carat describes weight; colour, clarity and cut describe other aspects of a diamond. Read them together rather than choosing by one grade. Two stones of the same weight can have different dimensions and appearance. The GIA guide below explains these terms.",
      "## Choosing a setting",
      "Consider the height of the ring, how the stone is held and whether you plan to wear a wedding band beside it. Ask to see the setting from the side as well as from above. Tell us if your work or daily activities make a low setting more practical.",
      "## Choosing a metal and size",
      "Compare the metal colours you enjoy wearing. Confirm the alloy and available finish for the design you choose. Have your finger measured rather than relying only on another ring, especially when comparing different band widths.",
      "## Natural or lab-grown diamonds",
      "We can discuss both options for your design. Compare specific stones and their accompanying reports, then agree on the metal, dimensions, ring size and final price. Save those details with your order confirmation. If you are unsure where to start, bring us a photo or describe what you like."
    ],
    "contentUk": [
      "Почніть із того, як ви носитимете каблучку, які форми вам подобаються та який бюджет зручний. Кілька прикладів допоможуть пояснити побажання. Готовий дизайн для першої розмови не потрібен.",
      "## Чотири характеристики діаманта",
      "Карат — міра ваги. Колір, чистота й огранювання описують інші властивості каменю. Розглядайте їх разом, не обираючи лише за однією оцінкою. Камені однакової ваги можуть різнитися розмірами та виглядом. У посібнику GIA нижче пояснено ці терміни.",
      "## Вибір оправи",
      "Зверніть увагу на висоту каблучки, кріплення каменю та можливість носити поряд обручку. Попросіть показати оправу збоку та згори. Розкажіть, якщо для роботи чи повсякденних занять вам зручніша невисока посадка.",
      "## Метал і розмір",
      "Порівняйте відтінки металу, які вам подобається носити. Уточніть склад сплаву й доступне оздоблення обраного дизайну. Краще виміряти палець, ніж орієнтуватися лише на іншу каблучку, особливо за різної ширини шинки.",
      "## Природні або лабораторні діаманти",
      "Обговоримо обидва варіанти для вашого дизайну. Порівняйте конкретні камені та супровідні документи, потім погодьте метал, розміри, посадку й остаточну ціну. Збережіть ці деталі разом із підтвердженням замовлення. Якщо поки важко обрати, покажіть фото чи розкажіть, що вам подобається."
    ],
    "sources": [
      {
        "title": "GIA · Diamond quality factors",
        "url": "https://www.gia.edu/diamond-quality-factor"
      }
    ],
    "collectionPath": "/collections/rings",
    "updatedAt": "2026-10-04"
  },
  {
    "id": 2,
    "slug": "diamond-care-guide",
    "category": "Уход",
    "categoryEn": "Care",
    "categoryUk": "Догляд",
    "date": "24 ноября 2025",
    "dateEn": "November 24, 2025",
    "dateUk": "24 листопада 2025",
    "title": "Как ухаживать за украшениями с бриллиантами",
    "titleEn": "How to care for diamond jewellery",
    "titleUk": "Як доглядати за прикрасами з діамантами",
    "excerpt": "Бережная чистка и правильное хранение помогают сохранить украшения. Расскажем об уходе дома и о том, когда стоит обратиться к ювелиру.",
    "excerptEn": "Simple cleaning and careful storage help keep jewellery in good condition. Here is how to care for your pieces at home and when to ask a jeweller for help.",
    "excerptUk": "Дбайливе чищення та правильне зберігання допомагають зберегти прикраси. Розповідаємо про догляд удома й про те, коли варто звернутися до ювеліра.",
    "readTime": "1 мин",
    "readTimeEn": "2 min",
    "readTimeUk": "1 хв",
    "image": "/blog-images/diamond-jewellery-portrait.jpg",
    "imageAlt": "Model wearing diamond earrings, rings, a necklace and a bracelet against a grey background",
    "imageAltRu": "Модель в серьгах, кольцах, колье и браслете с бриллиантами на сером фоне",
    "imageAltUk": "Модель у сережках, каблучках, кольє та браслеті з діамантами на сірому тлі",
    "imageClassName": "article-image--jewellery-portrait",
    "content": [
      "Уход начинается с понимания особенностей изделия. Уточните, какой способ чистки подходит его камням, обработке и оправе, особенно если в украшении несколько видов камней.",
      "## Чистка дома",
      "Выберите щадящий способ, рекомендованный для вашего изделия, и аккуратно просушите украшение. GIA не рекомендует абразивные порошки, домашнюю ультразвуковую и паровую чистку: такие методы могут ослабить крепление камней. Одно средство не обязательно подходит всем изделиям.",
      "## Когда снимать украшения",
      "Снимайте кольца перед занятиями, при которых можно зацепить или ударить оправу. Заранее уберите их в безопасное место, а не оставляйте у раковины. В поездке продумайте, где будут храниться изделия, когда вы их не носите.",
      "## Хранение",
      "Каждому изделию нужно отдельное место в чехле или шкатулке с отделениями. Застёгивайте цепочки перед хранением и не складывайте несколько украшений вместе без защиты. Проверяйте застёжку перед тем, как надеть браслет или колье.",
      "## Осмотр у специалиста",
      "Если камень двигается, застёжка не держит или крепление цепляется за одежду, не носите изделие до осмотра. Опишите, что заметили, и по возможности отправьте чёткую фотографию. До согласия на ремонт уточните работы, сроки и стоимость. Осмотр поможет определить, что нужно именно вашему украшению."
    ],
    "contentEn": [
      "Regular care starts with knowing your piece. Ask which cleaning method suits its stones, treatments and setting, particularly if it contains more than one type of gemstone.",
      "## Cleaning at home",
      "Use a gentle method recommended for your piece and dry it carefully. GIA advises against abrasive powders and home ultrasonic or steam cleaning: these methods can loosen stones. Do not treat every piece as suitable for the same cleaner.",
      "## When to remove jewellery",
      "Take rings off for tasks that could catch or knock the setting. Put them somewhere safe before you begin rather than leaving them beside a sink. If you are travelling, decide in advance where you will keep pieces when you are not wearing them.",
      "## Storage",
      "Give each piece its own space in a pouch or divided jewellery box. Fasten chains before storing them and avoid packing several loose pieces together. Check the clasp before putting on a bracelet or necklace.",
      "## Professional checks",
      "If a stone moves, a clasp fails or a claw catches on clothing, stop wearing the piece and arrange an inspection. Describe what you noticed and send a clear photograph when possible. Ask about the proposed work, timing and cost before agreeing to a repair. An inspection can help determine what your particular piece needs."
    ],
    "contentUk": [
      "Догляд починається з розуміння особливостей виробу. Уточніть, який спосіб чищення підходить його каменям, обробці та оправі, особливо якщо у прикрасі кілька видів каменів.",
      "## Чищення вдома",
      "Оберіть щадний спосіб, рекомендований для вашого виробу, та обережно висушіть прикрасу. GIA не рекомендує абразивні порошки, домашнє ультразвукове й парове чищення: такі методи можуть послабити кріплення каменів. Один засіб не обов’язково підходить усім виробам.",
      "## Коли знімати прикраси",
      "Знімайте каблучки перед заняттями, під час яких можна зачепити чи вдарити оправу. Заздалегідь приберіть їх у безпечне місце, а не залишайте біля раковини. У подорожі продумайте, де зберігатимете вироби, коли їх не носите.",
      "## Зберігання",
      "Кожному виробу потрібне окреме місце у чохлі чи скриньці з відділеннями. Застібайте ланцюжки перед зберіганням і не складайте кілька прикрас разом без захисту. Перевіряйте застібку перед тим, як надягти браслет чи кольє.",
      "## Огляд у фахівця",
      "Якщо камінь рухається, застібка не тримає або кріплення чіпляється за одяг, не носіть виріб до огляду. Опишіть, що помітили, та за можливості надішліть чітку фотографію. До згоди на ремонт уточніть роботи, строки й вартість. Огляд допоможе визначити, що потрібно саме вашій прикрасі."
    ],
    "sources": [
      {
        "title": "GIA · Diamond care and cleaning",
        "url": "https://www.gia.edu/diamond-care-cleaning"
      }
    ],
    "collectionPath": "/collection",
    "updatedAt": "2026-10-04"
  },
  {
    "id": 3,
    "slug": "pink-diamonds-trend-2026",
    "category": "Тренды",
    "categoryEn": "Trends",
    "categoryUk": "Тренди",
    "date": "5 февраля 2026",
    "dateEn": "February 5, 2026",
    "dateUk": "5 лютого 2026",
    "title": "Розовые бриллианты: гид по цвету",
    "titleEn": "Pink diamonds: a guide to colour",
    "titleUk": "Рожеві діаманти: гід із кольору",
    "excerpt": "Рассмотрим оттенки розовых бриллиантов, оправы и сочетания, чтобы выбрать украшение с вашим характером.",
    "excerptEn": "Explore pink diamond colours, settings and combinations to find a piece that feels personal.",
    "excerptUk": "Розгляньмо відтінки рожевих діамантів, оправи та поєднання, щоб обрати прикрасу з вашим характером.",
    "image": "/blog-images/oval-pink-diamond-ring.jpg",
    "imageAlt": "An oval pink diamond ring with two pear-shaped side stones on a light surface",
    "imageAltRu": "Кольцо с овальным розовым бриллиантом и двумя боковыми камнями грушевидной формы на светлой поверхности",
    "imageAltUk": "Каблучка з овальним рожевим діамантом і двома бічними каменями грушоподібної форми на світлій поверхні",
    "imageClassName": "article-image--portrait-ring",
    "readTime": "1 мин",
    "readTimeEn": "2 min",
    "readTimeUk": "1 хв",
    "content": [
      "Начните с оттенка, который вам нравится, затем сравните конкретные камни. Название цвета полезно, но не передаёт все особенности бриллианта в оправе.",
      "## Сравнивайте цвет при одинаковом освещении",
      "GIA описывает цветные бриллианты через оттенок, тон и насыщенность. Рассматривайте камни при сопоставимом освещении и на одинаковом фоне. Запросите фотографии или видео конкретных вариантов, а не выбирайте только по изображению-примеру.",
      "## Уточните происхождение и обработку",
      "Узнайте, натуральный бриллиант или лабораторный и менялся ли его цвет обработкой. Уточните, какой документ сопровождает камень и что в нём сказано о происхождении цвета. Сам по себе розовый оттенок на эти вопросы не отвечает.",
      "## Подумайте об оправе",
      "Сравните камень рядом с металлами, которые рассматриваете. Решите, хотите ли сделать акцент на одном цвете или сочетании камней. Простой эскиз поможет понять пропорции до окончательного выбора дизайна.",
      "## Согласуйте конкретное изделие",
      "Подтвердите выбранный камень, его размеры, оправу и итоговую цену. Если фотография показывает пример дизайна, а не доступный камень, попросите отдельно показать предлагаемый вариант. Обсудим натуральные и лабораторные бриллианты с учётом желаемого оттенка и бюджета."
    ],
    "contentEn": [
      "Begin with the shade you enjoy, then compare individual stones. A colour name is useful, but it cannot show every detail of how a diamond looks in a setting.",
      "## Compare colour in similar lighting",
      "GIA describes coloured diamonds through hue, tone and saturation. Look at the stones under comparable lighting and against the same background. Ask for images or video of the actual options, rather than choosing only from an example photograph.",
      "## Ask about origin and treatment",
      "Confirm whether the diamond is natural or laboratory-grown and whether its colour has been treated. Ask which report accompanies the stone and what it says about colour origin. A pink appearance alone does not answer those questions.",
      "## Consider the setting",
      "Compare the stone beside the metal colours you are considering. Think about whether you want one colour to be the focus or prefer a combination of stones. A simple sketch can help show the proportions before you settle on the design.",
      "## Agree on the specific piece",
      "Confirm the chosen stone, its measurements, the setting and the final quote. If a photograph illustrates a design rather than the exact available stone, ask to see the proposed stone separately. We can discuss both natural and lab-grown options around your preferred colour and budget."
    ],
    "contentUk": [
      "Почніть із відтінку, який вам подобається, а потім порівняйте конкретні камені. Назва кольору корисна, але не передає всіх особливостей діаманта в оправі.",
      "## Порівнюйте колір за однакового освітлення",
      "GIA описує кольорові діаманти через відтінок, тон і насиченість. Розглядайте камені за зіставного освітлення та на однаковому тлі. Запитайте фотографії чи відео конкретних варіантів, а не обирайте лише за зображенням-прикладом.",
      "## Уточніть походження й обробку",
      "Дізнайтеся, природний діамант чи лабораторний і чи змінювали його колір обробкою. Уточніть, який документ супроводжує камінь і що в ньому зазначено про походження кольору. Сам собою рожевий відтінок на ці питання не відповідає.",
      "## Подумайте про оправу",
      "Порівняйте камінь поряд із металами, які розглядаєте. Вирішіть, чи хочете зробити акцент на одному кольорі або на поєднанні каменів. Простий ескіз допоможе зрозуміти пропорції до остаточного вибору дизайну.",
      "## Погодьте конкретний виріб",
      "Підтвердьте обраний камінь, його розміри, оправу й остаточну ціну. Якщо фотографія показує приклад дизайну, а не доступний камінь, попросіть окремо показати запропонований варіант. Обговоримо природні та лабораторні діаманти з урахуванням бажаного відтінку й бюджету."
    ],
    "sources": [
      {
        "title": "GIA · Fancy colour diamonds",
        "url": "https://www.gia.edu/fancy-color-diamond"
      }
    ],
    "collectionPath": "/collection",
    "updatedAt": "2026-10-04"
  },
  {
    "id": 4,
    "slug": "diamond-certification-guide",
    "category": "Экспертиза",
    "categoryEn": "Expertise",
    "categoryUk": "Експертиза",
    "date": "17 октября 2025",
    "dateEn": "October 17, 2025",
    "dateUk": "17 жовтня 2025",
    "title": "Сертификация бриллиантов: GIA и IGI",
    "titleEn": "Diamond certification: GIA and IGI",
    "titleUk": "Сертифікація діамантів: GIA та IGI",
    "excerpt": "Геммологический отчёт описывает характеристики камня. Разберём основные сведения и объясним, почему важно проверить отчёт именно на ваш камень.",
    "excerptEn": "A grading report describes a stone’s characteristics. Learn how to read the main details and ask for the report that belongs to your stone.",
    "excerptUk": "Гемологічний звіт описує характеристики каменю. Розгляньмо основні відомості та пояснімо, чому важливо перевірити звіт саме на ваш камінь.",
    "readTime": "1 мин",
    "readTimeEn": "2 min",
    "readTimeUk": "1 хв",
    "image": "/blog-images/gia-yellow-diamond.jpg",
    "imageAlt": "Yellow diamond in a GIA display case against a black background",
    "imageAltRu": "Жёлтый бриллиант в футляре GIA на чёрном фоне",
    "imageAltUk": "Жовтий діамант у футлярі GIA на чорному тлі",
    "imageClassName": "article-image--gia-diamond",
    "content": [
      "Геммологический отчёт фиксирует оценку камня лабораторией. Изучайте его вместе с характеристиками изделия, которое собираетесь купить. Одно название лаборатории не описывает всё украшение.",
      "## Определите, что описывает документ",
      "Уточните, какая лаборатория выдала отчёт и относится ли он к основному камню, нескольким камням или готовому изделию. Проверьте дату и терминологию. Не предполагайте, что один документ охватывает каждый маленький камень в оправе.",
      "## Учитывайте систему оценки",
      "Системы отчётов различаются. С 1 октября 2025 года оценка GIA для лабораторных бриллиантов диапазона D–Z использует категории Premium и Standard. В старых документах терминология может отличаться. Читайте систему конкретного отчёта и не приравнивайте автоматически обозначения разных лабораторий.",
      "## Проверьте запись",
      "Используйте сервис проверки лаборатории, выдавшей документ. Ссылка на проверку IGI приведена ниже. Сопоставьте документ с данными камня от продавца. Если нужна помощь в проверке соответствия камня отчёту, обратитесь к квалифицированному специалисту.",
      "## Отдельно согласуйте условия заказа",
      "Отчёт описывает исследованный материал. Он не заменяет договорённости о металле, оправе, размере, доставке и обслуживании. Подтвердите эти детали отдельно и сохраните документ вместе с данными покупки. Мы объясним, какие документы сопровождают выбранный вами камень."
    ],
    "contentEn": [
      "A grading report records a laboratory’s assessment of a stone. Read it alongside the details of the piece you intend to buy, rather than treating a laboratory name alone as a description of the jewellery.",
      "## Identify the document",
      "Ask which laboratory issued the report and whether it covers the main stone, several stones or the finished piece. Check the date and the terminology used. Do not assume that one report covers every small stone in a setting.",
      "## Read the relevant system",
      "Reporting systems differ. Since 1 October 2025, GIA’s assessment for D-to-Z laboratory-grown diamonds uses Premium and Standard categories. Older documents can use different terminology. Read the system on the actual report; do not directly substitute one laboratory’s labels for another’s.",
      "## Verify the record",
      "Use the issuing laboratory’s verification service. IGI provides an online report check linked below. Compare the document with the stone details supplied by the seller, and ask a qualified professional if you need help matching the stone to its report.",
      "## Keep the order details separate",
      "A report describes the assessed material. It is not the order agreement for the metal, setting, size, delivery or aftercare. Confirm those details separately and keep the report with your purchase records. We can explain which documentation accompanies the specific stone you choose."
    ],
    "contentUk": [
      "Гемологічний звіт фіксує оцінку каменю лабораторією. Вивчайте його разом із характеристиками виробу, який збираєтеся придбати. Сама назва лабораторії не описує всю прикрасу.",
      "## Визначте, що описує документ",
      "Уточніть, яка лабораторія видала звіт і чи стосується він основного каменю, кількох каменів або готового виробу. Перевірте дату й термінологію. Не припускайте, що один документ охоплює кожен маленький камінь в оправі.",
      "## Враховуйте систему оцінювання",
      "Системи звітів різняться. З 1 жовтня 2025 року оцінка GIA для лабораторних діамантів діапазону D–Z використовує категорії Premium та Standard. У старих документах термінологія може відрізнятися. Читайте систему конкретного звіту й не прирівнюйте автоматично позначення різних лабораторій.",
      "## Перевірте запис",
      "Скористайтеся сервісом перевірки лабораторії, яка видала документ. Посилання на перевірку IGI наведено нижче. Зіставте документ із даними каменю від продавця. Якщо потрібна допомога у перевірці відповідності каменю звіту, зверніться до кваліфікованого фахівця.",
      "## Окремо погодьте умови замовлення",
      "Звіт описує досліджений матеріал. Він не замінює домовленостей про метал, оправу, розмір, доставку й обслуговування. Підтвердьте ці деталі окремо та збережіть документ разом із даними покупки. Ми пояснимо, які документи супроводжують обраний вами камінь."
    ],
    "sources": [
      {
        "title": "GIA · Laboratory-grown assessment update",
        "url": "https://www.gia.edu/gia-news-press/updated-laboratory-grown-diamond-services-to-launch-october-1"
      },
      {
        "title": "IGI · Report verification",
        "url": "https://www.igi.org/reports/"
      }
    ],
    "collectionPath": "/collection",
    "updatedAt": "2026-10-04"
  },
  {
    "id": 5,
    "slug": "lab-grown-vs-natural-diamonds",
    "category": "Сравнение",
    "categoryEn": "Comparison",
    "categoryUk": "Порівняння",
    "date": "12 декабря 2025",
    "dateEn": "December 12, 2025",
    "dateUk": "12 грудня 2025",
    "title": "Лабораторные и природные бриллианты",
    "titleEn": "Lab-grown and natural diamonds",
    "titleUk": "Лабораторні та природні діаманти",
    "excerpt": "Сравните происхождение, характеристики и стоимость лабораторных и природных бриллиантов перед выбором украшения.",
    "excerptEn": "Compare the origins, characteristics and pricing of laboratory-grown and natural diamonds before choosing your piece.",
    "excerptUk": "Порівняйте походження, характеристики та вартість лабораторних і природних діамантів перед вибором прикраси.",
    "readTime": "1 мин",
    "readTimeEn": "2 min",
    "readTimeUk": "1 хв",
    "image": "/blog-images/lab-grown-diamond-detail.jpg",
    "imageAlt": "A close-up of pear-shaped diamonds arranged diagonally on a white background",
    "imageAltRu": "Крупный план грушевидных бриллиантов, расположенных по диагонали на белом фоне",
    "imageAltUk": "Крупний план грушоподібних діамантів, розташованих по діагоналі на білому тлі",
    "imageClassName": "article-image--diamond-line",
    "content": [
      "Для украшения можно рассмотреть натуральные и лабораторные бриллианты. Начните со своих предпочтений и сравните конкретные камни. Происхождение само по себе не определяет все остальные качества.",
      "## В чём разница",
      "Натуральные бриллианты образуются в земле, лабораторные выращивают в контролируемых условиях. По описанию GIA их химические, физические и оптические свойства в основном совпадают, а специальное исследование позволяет определить происхождение.",
      "## Сравните конкретные камни",
      "Рассмотрите размеры, внешний вид и сопровождающие каждый вариант документы. Запросите сопоставимые фотографии и понятное описание возможной обработки. Происхождение не отменяет необходимости разобраться в особенностях самого камня и оправы.",
      "## Обсудите полную стоимость",
      "Сравнивайте предложения на готовые изделия с чёткими характеристиками. Разница в цене может зависеть от камней, металла и дизайна. Уточняйте, что входит в каждый расчёт, а не сравнивайте только вес в каратах или общий процент экономии.",
      "## Выбирайте осознанно",
      "Расскажите, что для вас важнее: внешний вид, происхождение, пропорции или бюджет. Обсудим варианты, не требуя решения до знакомства с деталями. Перед заказом письменно подтвердите выбранную версию и итоговые характеристики. Цены на варианты с натуральными бриллиантами в нашем каталоге предоставляются по запросу."
    ],
    "contentEn": [
      "Both natural and laboratory-grown diamonds can be considered for a piece. Start with your preferences and compare actual stones, rather than assuming that one origin determines every other quality.",
      "## What differs",
      "Natural diamonds form in the earth; laboratory-grown diamonds are produced through a controlled growth process. GIA describes their chemical, physical and optical properties as essentially the same, while specialist testing can identify their origin.",
      "## Compare the individual stones",
      "Look at dimensions, appearance and the documentation accompanying each option. Ask for comparable photographs and a clear description of any treatments. The origin does not replace the need to understand the particular stone and its setting.",
      "## Discuss the full quote",
      "Compare quotes for complete pieces with clearly stated specifications. A price difference can reflect several choices, including the stones, metal and design. Ask what each quote includes; avoid comparing only a carat figure or a general percentage saving.",
      "## Make a choice you understand",
      "Tell us which aspects matter most to you: appearance, origin, proportions or budget. We can discuss alternatives without asking you to decide before seeing the details. Confirm the selected version and its final specifications in writing before ordering. Natural-diamond prices in our catalogue are available on request."
    ],
    "contentUk": [
      "Для прикраси можна розглянути природні й лабораторні діаманти. Почніть зі своїх уподобань та порівняйте конкретні камені. Походження саме собою не визначає всі інші якості.",
      "## У чому різниця",
      "Природні діаманти утворюються в землі, лабораторні вирощують у контрольованих умовах. За описом GIA їхні хімічні, фізичні та оптичні властивості здебільшого збігаються, а спеціальне дослідження дає змогу визначити походження.",
      "## Порівняйте конкретні камені",
      "Розгляньте розміри, вигляд і супровідні документи кожного варіанта. Запитайте зіставні фотографії та зрозумілий опис можливої обробки. Походження не скасовує потреби розібратися в особливостях самого каменю й оправи.",
      "## Обговоріть повну вартість",
      "Порівнюйте пропозиції на готові вироби з чіткими характеристиками. Різниця в ціні може залежати від каменів, металу та дизайну. Уточнюйте, що входить до кожного розрахунку, а не порівнюйте лише вагу в каратах чи загальний відсоток заощадження.",
      "## Обирайте усвідомлено",
      "Розкажіть, що для вас важливіше: вигляд, походження, пропорції чи бюджет. Обговоримо варіанти, не вимагаючи рішення до ознайомлення з деталями. Перед замовленням письмово підтвердьте обрану версію та остаточні характеристики. Ціни на варіанти з природними діамантами у нашому каталозі надаються за запитом."
    ],
    "sources": [
      {
        "title": "GIA · Natural and laboratory-grown diamonds",
        "url": "https://www.gia.edu/gia-news-research/difference-between-natural-laboratory-grown-diamonds"
      }
    ],
    "collectionPath": "/collection",
    "updatedAt": "2026-10-04"
  },
  {
    "id": 6,
    "slug": "sustainable-luxury-lab-diamonds",
    "category": "Устойчивость",
    "categoryEn": "Sustainability",
    "categoryUk": "Сталість",
    "date": "9 января 2026",
    "dateEn": "January 9, 2026",
    "dateUk": "9 січня 2026",
    "title": "Что стоит знать о лабораторных бриллиантах",
    "titleEn": "A closer look at lab-grown diamonds",
    "titleUk": "Що варто знати про лабораторні діаманти",
    "excerpt": "Узнайте, как выращивают лабораторные бриллианты и какие вопросы стоит задать о происхождении и производстве.",
    "excerptEn": "Learn how laboratory-grown diamonds are made and which questions to ask about sourcing and production.",
    "excerptUk": "Дізнайтеся, як вирощують лабораторні діаманти та які запитання варто поставити про походження й виробництво.",
    "readTime": "1 мин",
    "readTimeEn": "2 min",
    "readTimeUk": "1 хв",
    "image": "/blog-images/diamond-rings-reflection.jpg",
    "imageAlt": "Diamond rings in different cuts reflected on a black surface",
    "imageAltRu": "Кольца с бриллиантами разных огранок на чёрной зеркальной поверхности",
    "imageAltUk": "Каблучки з діамантами різних огранювань на чорній дзеркальній поверхні",
    "imageClassName": "article-image--diamond-rings",
    "content": [
      "Если происхождение важно для вашего выбора, задавайте вопросы о конкретном камне и поставщике. Общее обозначение менее полезно, чем информация, связанная с рассматриваемым изделием.",
      "## Узнайте, как вырастили камень",
      "Лабораторные бриллианты выращивают при высоких давлении и температуре либо методом химического осаждения из газовой фазы. В материале GIA ниже описаны эти методы. Уточните, что известно о предлагаемом камне: не все лабораторные бриллианты произведены одинаково.",
      "## Задавайте конкретные вопросы о поставке",
      "Узнайте, кто вырастил или поставил камень и какие сведения подтверждаются документами. Если для вас важны заявления об энергии или воздействии на окружающую среду, уточните, что именно они охватывают и как оценивались. Само слово «лабораторный» не подтверждает определённый экологический результат.",
      "## Разделяйте оценку камня и другие заявления",
      "Геммологические характеристики и сведения поставщика о происхождении отвечают на разные вопросы. Запросите подходящие подтверждения для каждого. Если информации нет, лучше знать об этом до решения, чем заменять её общим обещанием.",
      "## Обсудите изделие целиком",
      "Помимо камня учитывайте металл, оправу, возможности ремонта и то, как будете носить украшение. Расскажите, какие вопросы о происхождении важны для вас. До подтверждения заказа выясним, какие сведения доступны по обсуждаемым вариантам."
    ],
    "contentEn": [
      "If sourcing matters to your choice, ask questions about the particular stone and its supplier. A broad label is less useful than information that can be connected to the piece you are considering.",
      "## Ask how the stone was made",
      "Laboratory-grown diamonds can be produced using high-pressure, high-temperature growth or chemical vapour deposition. The GIA explanation below introduces these methods. Ask what is known about the proposed stone, rather than assuming that all laboratory-grown diamonds share one production process.",
      "## Be specific about sourcing",
      "Ask who grew or supplied the stone and which details can be documented. If a claim about energy or environmental impact matters to you, ask what it covers and how it was assessed. Do not treat the phrase lab-grown alone as evidence of a particular environmental outcome.",
      "## Separate grading from other claims",
      "A stone’s grading information and a supplier’s sourcing information answer different questions. Ask for the relevant evidence for each. If information is unavailable, it is better to know that before deciding than to fill the gap with a general promise.",
      "## Discuss the complete piece",
      "Consider the metal, setting, repair options and how you expect to wear the jewellery as well as the stone. Tell us which sourcing questions are important to you. We can establish what information is available for the options under discussion before you confirm your order."
    ],
    "contentUk": [
      "Якщо походження важливе для вашого вибору, ставте питання про конкретний камінь і постачальника. Загальне позначення менш корисне, ніж інформація, пов’язана з виробом, який розглядаєте.",
      "## Дізнайтеся, як виростили камінь",
      "Лабораторні діаманти вирощують за високих тиску й температури або методом хімічного осадження з газової фази. У матеріалі GIA нижче описано ці методи. Уточніть, що відомо про запропонований камінь: не всі лабораторні діаманти вироблено однаково.",
      "## Ставте конкретні питання про постачання",
      "Дізнайтеся, хто виростив чи поставив камінь і які відомості підтверджуються документами. Якщо для вас важливі заяви про енергію чи вплив на довкілля, уточніть, що саме вони охоплюють і як оцінювалися. Саме слово «лабораторний» не підтверджує певного екологічного результату.",
      "## Розділяйте оцінку каменю та інші заяви",
      "Гемологічні характеристики й відомості постачальника про походження відповідають на різні питання. Запитайте відповідні підтвердження для кожного. Якщо інформації немає, краще знати про це до рішення, ніж замінювати її загальною обіцянкою.",
      "## Обговоріть виріб цілком",
      "Крім каменю враховуйте метал, оправу, можливості ремонту й те, як носитимете прикрасу. Розкажіть, які питання про походження важливі для вас. До підтвердження замовлення з’ясуємо, які відомості доступні щодо обговорюваних варіантів."
    ],
    "sources": [
      {
        "title": "GIA · Diamond growth methods",
        "url": "https://www.gia.edu/gia-news-research/difference-between-natural-laboratory-grown-diamonds"
      }
    ],
    "collectionPath": "/collection",
    "updatedAt": "2026-10-04"
  }
];
export const getBlogPostBySlug=(slug:string)=>blogPosts.find(post=>post.slug===slug);
export const getAllBlogSlugs=()=>blogPosts.map(post=>post.slug);
