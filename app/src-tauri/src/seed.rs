use rusqlite::{Connection, Result, params};

pub fn seed_books(conn: &Connection) -> Result<()> {
    let books = vec![
        // Old Testament
        (1, "Genesis", "Gen", "OT", 50),
        (2, "Exodus", "Exod", "OT", 40),
        (3, "Leviticus", "Lev", "OT", 27),
        (4, "Numbers", "Num", "OT", 36),
        (5, "Deuteronomy", "Deut", "OT", 34),
        (6, "Joshua", "Josh", "OT", 24),
        (7, "Judges", "Judg", "OT", 21),
        (8, "Ruth", "Ruth", "OT", 4),
        (9, "1 Samuel", "1Sam", "OT", 31),
        (10, "2 Samuel", "2Sam", "OT", 24),
        (11, "1 Kings", "1Kgs", "OT", 22),
        (12, "2 Kings", "2Kgs", "OT", 25),
        (13, "1 Chronicles", "1Chr", "OT", 29),
        (14, "2 Chronicles", "2Chr", "OT", 36),
        (15, "Ezra", "Ezra", "OT", 10),
        (16, "Nehemiah", "Neh", "OT", 13),
        (17, "Esther", "Esth", "OT", 10),
        (18, "Job", "Job", "OT", 42),
        (19, "Psalms", "Ps", "OT", 150),
        (20, "Proverbs", "Prov", "OT", 31),
        (21, "Ecclesiastes", "Eccl", "OT", 12),
        (22, "Song of Solomon", "Song", "OT", 8),
        (23, "Isaiah", "Isa", "OT", 66),
        (24, "Jeremiah", "Jer", "OT", 52),
        (25, "Lamentations", "Lam", "OT", 5),
        (26, "Ezekiel", "Ezek", "OT", 48),
        (27, "Daniel", "Dan", "OT", 12),
        (28, "Hosea", "Hos", "OT", 14),
        (29, "Joel", "Joel", "OT", 3),
        (30, "Amos", "Amos", "OT", 9),
        (31, "Obadiah", "Obad", "OT", 1),
        (32, "Jonah", "Jonah", "OT", 4),
        (33, "Micah", "Mic", "OT", 7),
        (34, "Nahum", "Nah", "OT", 3),
        (35, "Habakkuk", "Hab", "OT", 3),
        (36, "Zephaniah", "Zeph", "OT", 3),
        (37, "Haggai", "Hag", "OT", 2),
        (38, "Zechariah", "Zech", "OT", 14),
        (39, "Malachi", "Mal", "OT", 4),
        // New Testament
        (40, "Matthew", "Matt", "NT", 28),
        (41, "Mark", "Mark", "NT", 16),
        (42, "Luke", "Luke", "NT", 24),
        (43, "John", "John", "NT", 21),
        (44, "Acts", "Acts", "NT", 28),
        (45, "Romans", "Rom", "NT", 16),
        (46, "1 Corinthians", "1Cor", "NT", 16),
        (47, "2 Corinthians", "2Cor", "NT", 13),
        (48, "Galatians", "Gal", "NT", 6),
        (49, "Ephesians", "Eph", "NT", 6),
        (50, "Philippians", "Phil", "NT", 4),
        (51, "Colossians", "Col", "NT", 4),
        (52, "1 Thessalonians", "1Thess", "NT", 5),
        (53, "2 Thessalonians", "2Thess", "NT", 3),
        (54, "1 Timothy", "1Tim", "NT", 6),
        (55, "2 Timothy", "2Tim", "NT", 4),
        (56, "Titus", "Titus", "NT", 3),
        (57, "Philemon", "Phlm", "NT", 1),
        (58, "Hebrews", "Heb", "NT", 13),
        (59, "James", "Jas", "NT", 5),
        (60, "1 Peter", "1Pet", "NT", 5),
        (61, "2 Peter", "2Pet", "NT", 3),
        (62, "1 John", "1John", "NT", 5),
        (63, "2 John", "2John", "NT", 1),
        (64, "3 John", "3John", "NT", 1),
        (65, "Jude", "Jude", "NT", 1),
        (66, "Revelation", "Rev", "NT", 22),
    ];

    for (sort_order, name, abbrev, testament, chapters) in books {
        conn.execute(
            "INSERT OR IGNORE INTO books (name, abbreviation, testament, chapter_count, sort_order)
             VALUES (?1, ?2, ?3, ?4, ?5)",
            params![name, abbrev, testament, chapters, sort_order],
        )?;
    }

    Ok(())
}

pub fn seed_topical_verses(conn: &Connection) -> Result<()> {
    // Get topic IDs
    let finances_id: i64 = conn.query_row("SELECT id FROM topics WHERE slug = 'finances'", [], |r| r.get(0))?;
    let marriage_id: i64 = conn.query_row("SELECT id FROM topics WHERE slug = 'marriage'", [], |r| r.get(0))?;
    let anxiety_id: i64 = conn.query_row("SELECT id FROM topics WHERE slug = 'anxiety'", [], |r| r.get(0))?;
    let health_id: i64 = conn.query_row("SELECT id FROM topics WHERE slug = 'health'", [], |r| r.get(0))?;
    let parenting_id: i64 = conn.query_row("SELECT id FROM topics WHERE slug = 'parenting'", [], |r| r.get(0))?;
    let work_id: i64 = conn.query_row("SELECT id FROM topics WHERE slug = 'work'", [], |r| r.get(0))?;
    let salvation_id: i64 = conn.query_row("SELECT id FROM topics WHERE slug = 'salvation'", [], |r| r.get(0))?;
    let forgiveness_id: i64 = conn.query_row("SELECT id FROM topics WHERE slug = 'forgiveness'", [], |r| r.get(0))?;
    let wisdom_id: i64 = conn.query_row("SELECT id FROM topics WHERE slug = 'wisdom'", [], |r| r.get(0))?;
    let peace_id: i64 = conn.query_row("SELECT id FROM topics WHERE slug = 'peace'", [], |r| r.get(0))?;
    let strength_id: i64 = conn.query_row("SELECT id FROM topics WHERE slug = 'strength'", [], |r| r.get(0))?;
    let prayer_id: i64 = conn.query_row("SELECT id FROM topics WHERE slug = 'prayer'", [], |r| r.get(0))?;

    // Finances & Wealth verses
    let finance_verses = vec![
        // Proverbs (book_id = 20)
        (20, 3, 9, "Honour the LORD with thy substance, and with the firstfruits of all thine increase:", 1.0),
        (20, 3, 10, "So shall thy barns be filled with plenty, and thy presses shall burst out with new wine.", 0.9),
        (20, 10, 4, "He becometh poor that dealeth with a slack hand: but the hand of the diligent maketh rich.", 1.0),
        (20, 11, 24, "There is that scattereth, and yet increaseth; and there is that withholdeth more than is meet, but it tendeth to poverty.", 0.95),
        (20, 11, 25, "The liberal soul shall be made fat: and he that watereth shall be watered also himself.", 0.95),
        (20, 13, 11, "Wealth gotten by vanity shall be diminished: but he that gathereth by labour shall increase.", 0.9),
        (20, 21, 5, "The thoughts of the diligent tend only to plenteousness; but of every one that is hasty only to want.", 0.85),
        (20, 22, 7, "The rich ruleth over the poor, and the borrower is servant to the lender.", 0.95),
        (20, 28, 20, "A faithful man shall abound with blessings: but he that maketh haste to be rich shall not be innocent.", 0.9),
        (20, 28, 22, "He that hasteth to be rich hath an evil eye, and considereth not that poverty shall come upon him.", 0.85),
        // Malachi (book_id = 39)
        (39, 3, 10, "Bring ye all the tithes into the storehouse, that there may be meat in mine house, and prove me now herewith, saith the LORD of hosts, if I will not open you the windows of heaven, and pour you out a blessing, that there shall not be room enough to receive it.", 1.0),
        // Matthew (book_id = 40)
        (40, 6, 19, "Lay not up for yourselves treasures upon earth, where moth and rust doth corrupt, and where thieves break through and steal:", 1.0),
        (40, 6, 20, "But lay up for yourselves treasures in heaven, where neither moth nor rust doth corrupt, and where thieves do not break through nor steal:", 1.0),
        (40, 6, 21, "For where your treasure is, there will your heart be also.", 1.0),
        (40, 6, 24, "No man can serve two masters: for either he will hate the one, and love the other; or else he will hold to the one, and despise the other. Ye cannot serve God and mammon.", 1.0),
        (40, 6, 33, "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.", 1.0),
        // Luke (book_id = 42)
        (42, 6, 38, "Give, and it shall be given unto you; good measure, pressed down, and shaken together, and running over, shall men give into your bosom. For with the same measure that ye mete withal it shall be measured to you again.", 1.0),
        (42, 12, 15, "And he said unto them, Take heed, and beware of covetousness: for a man's life consisteth not in the abundance of the things which he possesseth.", 0.95),
        // 1 Timothy (book_id = 54)
        (54, 6, 10, "For the love of money is the root of all evil: which while some coveted after, they have erred from the faith, and pierced themselves through with many sorrows.", 1.0),
        (54, 6, 17, "Charge them that are rich in this world, that they be not highminded, nor trust in uncertain riches, but in the living God, who giveth us richly all things to enjoy;", 0.9),
        (54, 6, 18, "That they do good, that they be rich in good works, ready to distribute, willing to communicate;", 0.9),
        // Hebrews (book_id = 58)
        (58, 13, 5, "Let your conversation be without covetousness; and be content with such things as ye have: for he hath said, I will never leave thee, nor forsake thee.", 0.95),
        // Philippians (book_id = 50)
        (50, 4, 19, "But my God shall supply all your need according to his riches in glory by Christ Jesus.", 1.0),
    ];

    // Anxiety & Fear verses
    let anxiety_verses = vec![
        // Psalms (book_id = 19)
        (19, 23, 1, "The LORD is my shepherd; I shall not want.", 1.0),
        (19, 23, 4, "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.", 1.0),
        (19, 27, 1, "The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?", 1.0),
        (19, 34, 4, "I sought the LORD, and he heard me, and delivered me from all my fears.", 1.0),
        (19, 46, 1, "God is our refuge and strength, a very present help in trouble.", 1.0),
        (19, 46, 2, "Therefore will not we fear, though the earth be removed, and though the mountains be carried into the midst of the sea;", 0.95),
        (19, 55, 22, "Cast thy burden upon the LORD, and he shall sustain thee: he shall never suffer the righteous to be moved.", 1.0),
        (19, 56, 3, "What time I am afraid, I will trust in thee.", 1.0),
        (19, 91, 1, "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.", 0.95),
        (19, 91, 2, "I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.", 0.95),
        (19, 94, 19, "In the multitude of my thoughts within me thy comforts delight my soul.", 0.9),
        (19, 118, 6, "The LORD is on my side; I will not fear: what can man do unto me?", 1.0),
        // Proverbs (book_id = 20)
        (20, 3, 5, "Trust in the LORD with all thine heart; and lean not unto thine own understanding.", 1.0),
        (20, 3, 6, "In all thy ways acknowledge him, and he shall direct thy paths.", 1.0),
        (20, 12, 25, "Heaviness in the heart of man maketh it stoop: but a good word maketh it glad.", 0.85),
        // Isaiah (book_id = 23)
        (23, 26, 3, "Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.", 1.0),
        (23, 41, 10, "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.", 1.0),
        (23, 41, 13, "For I the LORD thy God will hold thy right hand, saying unto thee, Fear not; I will help thee.", 0.95),
        (23, 43, 1, "But now thus saith the LORD that created thee, O Jacob, and he that formed thee, O Israel, Fear not: for I have redeemed thee, I have called thee by thy name; thou art mine.", 0.9),
        // Matthew (book_id = 40)
        (40, 6, 25, "Therefore I say unto you, Take no thought for your life, what ye shall eat, or what ye shall drink; nor yet for your body, what ye shall put on. Is not the life more than meat, and the body than raiment?", 1.0),
        (40, 6, 34, "Take therefore no thought for the morrow: for the morrow shall take thought for the things of itself. Sufficient unto the day is the evil thereof.", 1.0),
        (40, 11, 28, "Come unto me, all ye that labour and are heavy laden, and I will give you rest.", 1.0),
        (40, 11, 29, "Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls.", 1.0),
        // John (book_id = 43)
        (43, 14, 1, "Let not your heart be troubled: ye believe in God, believe also in me.", 1.0),
        (43, 14, 27, "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.", 1.0),
        // Romans (book_id = 45)
        (45, 8, 28, "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.", 1.0),
        // Philippians (book_id = 50)
        (50, 4, 6, "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.", 1.0),
        (50, 4, 7, "And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.", 1.0),
        // 1 Peter (book_id = 60)
        (60, 5, 7, "Casting all your care upon him; for he careth for you.", 1.0),
        // 2 Timothy (book_id = 55)
        (55, 1, 7, "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.", 1.0),
    ];

    // Marriage & Relationships verses
    let marriage_verses = vec![
        // Genesis (book_id = 1)
        (1, 2, 18, "And the LORD God said, It is not good that the man should be alone; I will make him an help meet for him.", 1.0),
        (1, 2, 24, "Therefore shall a man leave his father and his mother, and shall cleave unto his wife: and they shall be one flesh.", 1.0),
        // Proverbs (book_id = 20)
        (20, 5, 18, "Let thy fountain be blessed: and rejoice with the wife of thy youth.", 0.95),
        (20, 12, 4, "A virtuous woman is a crown to her husband: but she that maketh ashamed is as rottenness in his bones.", 0.9),
        (20, 18, 22, "Whoso findeth a wife findeth a good thing, and obtaineth favour of the LORD.", 1.0),
        (20, 19, 14, "House and riches are the inheritance of fathers: and a prudent wife is from the LORD.", 0.9),
        (20, 31, 10, "Who can find a virtuous woman? for her price is far above rubies.", 1.0),
        (20, 31, 11, "The heart of her husband doth safely trust in her, so that he shall have no need of spoil.", 0.95),
        // Ecclesiastes (book_id = 21)
        (21, 4, 9, "Two are better than one; because they have a good reward for their labour.", 0.95),
        (21, 4, 10, "For if they fall, the one will lift up his fellow: but woe to him that is alone when he falleth; for he hath not another to help him up.", 0.9),
        // Song of Solomon (book_id = 22)
        (22, 8, 6, "Set me as a seal upon thine heart, as a seal upon thine arm: for love is strong as death; jealousy is cruel as the grave: the coals thereof are coals of fire, which hath a most vehement flame.", 0.95),
        (22, 8, 7, "Many waters cannot quench love, neither can the floods drown it: if a man would give all the substance of his house for love, it would utterly be contemned.", 0.95),
        // 1 Corinthians (book_id = 46)
        (46, 7, 3, "Let the husband render unto the wife due benevolence: and likewise also the wife unto the husband.", 0.9),
        (46, 13, 4, "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up,", 1.0),
        (46, 13, 5, "Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil;", 1.0),
        (46, 13, 6, "Rejoiceth not in iniquity, but rejoiceth in the truth;", 1.0),
        (46, 13, 7, "Beareth all things, believeth all things, hopeth all things, endureth all things.", 1.0),
        (46, 13, 8, "Charity never faileth: but whether there be prophecies, they shall fail; whether there be tongues, they shall cease; whether there be knowledge, it shall vanish away.", 0.95),
        // Ephesians (book_id = 49)
        (49, 5, 21, "Submitting yourselves one to another in the fear of God.", 0.9),
        (49, 5, 25, "Husbands, love your wives, even as Christ also loved the church, and gave himself for it;", 1.0),
        (49, 5, 28, "So ought men to love their wives as their own bodies. He that loveth his wife loveth himself.", 1.0),
        (49, 5, 31, "For this cause shall a man leave his father and mother, and shall be joined unto his wife, and they two shall be one flesh.", 1.0),
        (49, 5, 33, "Nevertheless let every one of you in particular so love his wife even as himself; and the wife see that she reverence her husband.", 0.95),
        // Colossians (book_id = 51)
        (51, 3, 14, "And above all these things put on charity, which is the bond of perfectness.", 0.95),
        (51, 3, 18, "Wives, submit yourselves unto your own husbands, as it is fit in the Lord.", 0.9),
        (51, 3, 19, "Husbands, love your wives, and be not bitter against them.", 1.0),
        // 1 Peter (book_id = 60)
        (60, 3, 7, "Likewise, ye husbands, dwell with them according to knowledge, giving honour unto the wife, as unto the weaker vessel, and as being heirs together of the grace of life; that your prayers be not hindered.", 0.95),
        // Hebrews (book_id = 58)
        (58, 13, 4, "Marriage is honourable in all, and the bed undefiled: but whoremongers and adulterers God will judge.", 1.0),
    ];

    // Salvation & Faith verses
    let salvation_verses = vec![
        // John (book_id = 43)
        (43, 3, 3, "Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.", 1.0),
        (43, 3, 16, "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.", 1.0),
        (43, 3, 17, "For God sent not his Son into the world to condemn the world; but that the world through him might be saved.", 0.95),
        (43, 3, 36, "He that believeth on the Son hath everlasting life: and he that believeth not the Son shall not see life; but the wrath of God abideth on him.", 0.95),
        (43, 5, 24, "Verily, verily, I say unto you, He that heareth my word, and believeth on him that sent me, hath everlasting life, and shall not come into condemnation; but is passed from death unto life.", 1.0),
        (43, 6, 37, "All that the Father giveth me shall come to me; and him that cometh to me I will in no wise cast out.", 0.95),
        (43, 10, 9, "I am the door: by me if any man enter in, he shall be saved, and shall go in and out, and find pasture.", 0.95),
        (43, 10, 28, "And I give unto them eternal life; and they shall never perish, neither shall any man pluck them out of my hand.", 1.0),
        (43, 14, 6, "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.", 1.0),
        // Romans (book_id = 45)
        (45, 3, 23, "For all have sinned, and come short of the glory of God;", 1.0),
        (45, 5, 8, "But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.", 1.0),
        (45, 6, 23, "For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord.", 1.0),
        (45, 8, 1, "There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit.", 1.0),
        (45, 10, 9, "That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved.", 1.0),
        (45, 10, 10, "For with the heart man believeth unto righteousness; and with the mouth confession is made unto salvation.", 0.95),
        (45, 10, 13, "For whosoever shall call upon the name of the Lord shall be saved.", 1.0),
        // Acts (book_id = 44)
        (44, 2, 38, "Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost.", 1.0),
        (44, 4, 12, "Neither is there salvation in any other: for there is none other name under heaven given among men, whereby we must be saved.", 1.0),
        (44, 16, 31, "And they said, Believe on the Lord Jesus Christ, and thou shalt be saved, and thy house.", 1.0),
        // Ephesians (book_id = 49)
        (49, 2, 8, "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God:", 1.0),
        (49, 2, 9, "Not of works, lest any man should boast.", 1.0),
        // Titus (book_id = 56)
        (56, 3, 5, "Not by works of righteousness which we have done, but according to his mercy he saved us, by the washing of regeneration, and renewing of the Holy Ghost;", 0.95),
        // 1 John (book_id = 62)
        (62, 1, 9, "If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.", 1.0),
        (62, 5, 11, "And this is the record, that God hath given to us eternal life, and this life is in his Son.", 0.95),
        (62, 5, 12, "He that hath the Son hath life; and he that hath not the Son of God hath not life.", 0.95),
        (62, 5, 13, "These things have I written unto you that believe on the name of the Son of God; that ye may know that ye have eternal life, and that ye may believe on the name of the Son of God.", 1.0),
        // 2 Corinthians (book_id = 47)
        (47, 5, 17, "Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new.", 1.0),
        // Revelation (book_id = 66)
        (66, 3, 20, "Behold, I stand at the door, and knock: if any man hear my voice, and open the door, I will come in to him, and will sup with him, and he with me.", 1.0),
    ];

    // Forgiveness verses
    let forgiveness_verses = vec![
        // Psalms (book_id = 19)
        (19, 32, 1, "Blessed is he whose transgression is forgiven, whose sin is covered.", 1.0),
        (19, 32, 5, "I acknowledged my sin unto thee, and mine iniquity have I not hid. I said, I will confess my transgressions unto the LORD; and thou forgavest the iniquity of my sin. Selah.", 0.95),
        (19, 86, 5, "For thou, Lord, art good, and ready to forgive; and plenteous in mercy unto all them that call upon thee.", 1.0),
        (19, 103, 12, "As far as the east is from the west, so far hath he removed our transgressions from us.", 1.0),
        // Proverbs (book_id = 20)
        (20, 17, 9, "He that covereth a transgression seeketh love; but he that repeateth a matter separateth very friends.", 0.9),
        // Isaiah (book_id = 23)
        (23, 1, 18, "Come now, and let us reason together, saith the LORD: though your sins be as scarlet, they shall be as white as snow; though they be red like crimson, they shall be as wool.", 1.0),
        (23, 43, 25, "I, even I, am he that blotteth out thy transgressions for mine own sake, and will not remember thy sins.", 1.0),
        // Matthew (book_id = 40)
        (40, 6, 12, "And forgive us our debts, as we forgive our debtors.", 0.95),
        (40, 6, 14, "For if ye forgive men their trespasses, your heavenly Father will also forgive you:", 1.0),
        (40, 6, 15, "But if ye forgive not men their trespasses, neither will your Father forgive your trespasses.", 1.0),
        (40, 18, 21, "Then came Peter to him, and said, Lord, how oft shall my brother sin against me, and I forgive him? till seven times?", 0.95),
        (40, 18, 22, "Jesus saith unto him, I say not unto thee, Until seven times: but, Until seventy times seven.", 1.0),
        // Mark (book_id = 41)
        (41, 11, 25, "And when ye stand praying, forgive, if ye have ought against any: that your Father also which is in heaven may forgive you your trespasses.", 1.0),
        // Luke (book_id = 42)
        (42, 6, 37, "Judge not, and ye shall not be judged: condemn not, and ye shall not be condemned: forgive, and ye shall be forgiven:", 1.0),
        (42, 17, 3, "Take heed to yourselves: If thy brother trespass against thee, rebuke him; and if he repent, forgive him.", 0.95),
        (42, 17, 4, "And if he trespass against thee seven times in a day, and seven times in a day turn again to thee, saying, I repent; thou shalt forgive him.", 0.95),
        // Ephesians (book_id = 49)
        (49, 4, 32, "And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ's sake hath forgiven you.", 1.0),
        // Colossians (book_id = 51)
        (51, 3, 13, "Forbearing one another, and forgiving one another, if any man have a quarrel against any: even as Christ forgave you, so also do ye.", 1.0),
        // 1 John (book_id = 62)
        (62, 1, 9, "If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.", 1.0),
    ];

    // Prayer verses
    let prayer_verses = vec![
        // 2 Chronicles (book_id = 14)
        (14, 7, 14, "If my people, which are called by my name, shall humble themselves, and pray, and seek my face, and turn from their wicked ways; then will I hear from heaven, and will forgive their sin, and will heal their land.", 1.0),
        // Psalms (book_id = 19)
        (19, 17, 6, "I have called upon thee, for thou wilt hear me, O God: incline thine ear unto me, and hear my speech.", 0.9),
        (19, 55, 17, "Evening, and morning, and at noon, will I pray, and cry aloud: and he shall hear my voice.", 0.9),
        (19, 91, 15, "He shall call upon me, and I will answer him: I will be with him in trouble; I will deliver him, and honour him.", 0.95),
        (19, 145, 18, "The LORD is nigh unto all them that call upon him, to all that call upon him in truth.", 0.95),
        // Jeremiah (book_id = 24)
        (24, 29, 12, "Then shall ye call upon me, and ye shall go and pray unto me, and I will hearken unto you.", 0.95),
        (24, 29, 13, "And ye shall seek me, and find me, when ye shall search for me with all your heart.", 1.0),
        (24, 33, 3, "Call unto me, and I will answer thee, and shew thee great and mighty things, which thou knowest not.", 1.0),
        // Matthew (book_id = 40)
        (40, 6, 6, "But thou, when thou prayest, enter into thy closet, and when thou hast shut thy door, pray to thy Father which is in secret; and thy Father which seeth in secret shall reward thee openly.", 1.0),
        (40, 6, 9, "After this manner therefore pray ye: Our Father which art in heaven, Hallowed be thy name.", 1.0),
        (40, 7, 7, "Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be opened unto you:", 1.0),
        (40, 7, 8, "For every one that asketh receiveth; and he that seeketh findeth; and to him that knocketh it shall be opened.", 0.95),
        (40, 18, 19, "Again I say unto you, That if two of you shall agree on earth as touching any thing that they shall ask, it shall be done for them of my Father which is in heaven.", 0.95),
        (40, 18, 20, "For where two or three are gathered together in my name, there am I in the midst of them.", 0.9),
        (40, 21, 22, "And all things, whatsoever ye shall ask in prayer, believing, ye shall receive.", 1.0),
        // Mark (book_id = 41)
        (41, 11, 24, "Therefore I say unto you, What things soever ye desire, when ye pray, believe that ye receive them, and ye shall have them.", 1.0),
        // John (book_id = 43)
        (43, 14, 13, "And whatsoever ye shall ask in my name, that will I do, that the Father may be glorified in the Son.", 1.0),
        (43, 14, 14, "If ye shall ask any thing in my name, I will do it.", 1.0),
        (43, 15, 7, "If ye abide in me, and my words abide in you, ye shall ask what ye will, and it shall be done unto you.", 1.0),
        (43, 16, 24, "Hitherto have ye asked nothing in my name: ask, and ye shall receive, that your joy may be full.", 0.95),
        // Romans (book_id = 45)
        (45, 8, 26, "Likewise the Spirit also helpeth our infirmities: for we know not what we should pray for as we ought: but the Spirit itself maketh intercession for us with groanings which cannot be uttered.", 0.9),
        // Philippians (book_id = 50)
        (50, 4, 6, "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.", 1.0),
        // 1 Thessalonians (book_id = 52)
        (52, 5, 17, "Pray without ceasing.", 1.0),
        // James (book_id = 59)
        (59, 1, 5, "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.", 1.0),
        (59, 5, 16, "Confess your faults one to another, and pray one for another, that ye may be healed. The effectual fervent prayer of a righteous man availeth much.", 1.0),
        // 1 John (book_id = 62)
        (62, 5, 14, "And this is the confidence that we have in him, that, if we ask any thing according to his will, he heareth us:", 1.0),
        (62, 5, 15, "And if we know that he hear us, whatsoever we ask, we know that we have the petitions that we desired of him.", 0.95),
    ];

    // Wisdom & Guidance verses
    let wisdom_verses = vec![
        // Proverbs (book_id = 20)
        (20, 1, 7, "The fear of the LORD is the beginning of knowledge: but fools despise wisdom and instruction.", 1.0),
        (20, 2, 6, "For the LORD giveth wisdom: out of his mouth cometh knowledge and understanding.", 1.0),
        (20, 3, 5, "Trust in the LORD with all thine heart; and lean not unto thine own understanding.", 1.0),
        (20, 3, 6, "In all thy ways acknowledge him, and he shall direct thy paths.", 1.0),
        (20, 3, 7, "Be not wise in thine own eyes: fear the LORD, and depart from evil.", 0.95),
        (20, 4, 7, "Wisdom is the principal thing; therefore get wisdom: and with all thy getting get understanding.", 1.0),
        (20, 9, 10, "The fear of the LORD is the beginning of wisdom: and the knowledge of the holy is understanding.", 1.0),
        (20, 11, 14, "Where no counsel is, the people fall: but in the multitude of counsellors there is safety.", 0.9),
        (20, 12, 15, "The way of a fool is right in his own eyes: but he that hearkeneth unto counsel is wise.", 0.9),
        (20, 13, 10, "Only by pride cometh contention: but with the well advised is wisdom.", 0.85),
        (20, 15, 22, "Without counsel purposes are disappointed: but in the multitude of counsellors they are established.", 0.9),
        (20, 16, 3, "Commit thy works unto the LORD, and thy thoughts shall be established.", 0.95),
        (20, 16, 9, "A man's heart deviseth his way: but the LORD directeth his steps.", 1.0),
        (20, 19, 20, "Hear counsel, and receive instruction, that thou mayest be wise in thy latter end.", 0.9),
        (20, 19, 21, "There are many devices in a man's heart; nevertheless the counsel of the LORD, that shall stand.", 0.95),
        (20, 24, 6, "For by wise counsel thou shalt make thy war: and in multitude of counsellors there is safety.", 0.85),
        // Psalms (book_id = 19)
        (19, 32, 8, "I will instruct thee and teach thee in the way which thou shalt go: I will guide thee with mine eye.", 1.0),
        (19, 37, 23, "The steps of a good man are ordered by the LORD: and he delighteth in his way.", 1.0),
        (19, 119, 105, "Thy word is a lamp unto my feet, and a light unto my path.", 1.0),
        // Isaiah (book_id = 23)
        (23, 30, 21, "And thine ears shall hear a word behind thee, saying, This is the way, walk ye in it, when ye turn to the right hand, and when ye turn to the left.", 0.95),
        // Jeremiah (book_id = 24)
        (24, 10, 23, "O LORD, I know that the way of man is not in himself: it is not in man that walketh to direct his steps.", 0.9),
        // James (book_id = 59)
        (59, 1, 5, "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.", 1.0),
        (59, 3, 17, "But the wisdom that is from above is first pure, then peaceable, gentle, and easy to be intreated, full of mercy and good fruits, without partiality, and without hypocrisy.", 0.95),
    ];

    // Strength & Courage verses
    let strength_verses = vec![
        // Deuteronomy (book_id = 5)
        (5, 31, 6, "Be strong and of a good courage, fear not, nor be afraid of them: for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.", 1.0),
        (5, 31, 8, "And the LORD, he it is that doth go before thee; he will be with thee, he will not fail thee, neither forsake thee: fear not, neither be dismayed.", 0.95),
        // Joshua (book_id = 6)
        (6, 1, 9, "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.", 1.0),
        // Psalms (book_id = 19)
        (19, 27, 1, "The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?", 1.0),
        (19, 27, 14, "Wait on the LORD: be of good courage, and he shall strengthen thine heart: wait, I say, on the LORD.", 1.0),
        (19, 28, 7, "The LORD is my strength and my shield; my heart trusted in him, and I am helped: therefore my heart greatly rejoiceth; and with my song will I praise him.", 0.95),
        (19, 31, 24, "Be of good courage, and he shall strengthen your heart, all ye that hope in the LORD.", 0.95),
        (19, 46, 1, "God is our refuge and strength, a very present help in trouble.", 1.0),
        (19, 73, 26, "My flesh and my heart faileth: but God is the strength of my heart, and my portion for ever.", 0.9),
        (19, 118, 14, "The LORD is my strength and song, and is become my salvation.", 0.9),
        (19, 138, 3, "In the day when I cried thou answeredst me, and strengthenedst me with strength in my soul.", 0.85),
        // Isaiah (book_id = 23)
        (23, 40, 29, "He giveth power to the faint; and to them that have no might he increaseth strength.", 1.0),
        (23, 40, 31, "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.", 1.0),
        (23, 41, 10, "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.", 1.0),
        // Nehemiah (book_id = 16)
        (16, 8, 10, "Then he said unto them, Go your way, eat the fat, and drink the sweet, and send portions unto them for whom nothing is prepared: for this day is holy unto our Lord: neither be ye sorry; for the joy of the LORD is your strength.", 0.95),
        // Habakkuk (book_id = 35)
        (35, 3, 19, "The LORD God is my strength, and he will make my feet like hinds' feet, and he will make me to walk upon mine high places. To the chief singer on my stringed instruments.", 0.9),
        // 2 Corinthians (book_id = 47)
        (47, 12, 9, "And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness. Most gladly therefore will I rather glory in my infirmities, that the power of Christ may rest upon me.", 1.0),
        (47, 12, 10, "Therefore I take pleasure in infirmities, in reproaches, in necessities, in persecutions, in distresses for Christ's sake: for when I am weak, then am I strong.", 0.95),
        // Ephesians (book_id = 49)
        (49, 6, 10, "Finally, my brethren, be strong in the Lord, and in the power of his might.", 1.0),
        // Philippians (book_id = 50)
        (50, 4, 13, "I can do all things through Christ which strengtheneth me.", 1.0),
    ];

    // Peace & Rest verses
    let peace_verses = vec![
        // Psalms (book_id = 19)
        (19, 4, 8, "I will both lay me down in peace, and sleep: for thou, LORD, only makest me dwell in safety.", 0.95),
        (19, 29, 11, "The LORD will give strength unto his people; the LORD will bless his people with peace.", 0.95),
        (19, 37, 11, "But the meek shall inherit the earth; and shall delight themselves in the abundance of peace.", 0.9),
        (19, 46, 10, "Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.", 1.0),
        (19, 55, 22, "Cast thy burden upon the LORD, and he shall sustain thee: he shall never suffer the righteous to be moved.", 0.95),
        (19, 119, 165, "Great peace have they which love thy law: and nothing shall offend them.", 0.9),
        // Proverbs (book_id = 20)
        (20, 3, 24, "When thou liest down, thou shalt not be afraid: yea, thou shalt lie down, and thy sleep shall be sweet.", 0.9),
        // Isaiah (book_id = 23)
        (23, 26, 3, "Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.", 1.0),
        (23, 32, 17, "And the work of righteousness shall be peace; and the effect of righteousness quietness and assurance for ever.", 0.9),
        (23, 32, 18, "And my people shall dwell in a peaceable habitation, and in sure dwellings, and in quiet resting places;", 0.85),
        (23, 48, 18, "O that thou hadst hearkened to my commandments! then had thy peace been as a river, and thy righteousness as the waves of the sea:", 0.85),
        // Matthew (book_id = 40)
        (40, 11, 28, "Come unto me, all ye that labour and are heavy laden, and I will give you rest.", 1.0),
        (40, 11, 29, "Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls.", 1.0),
        // John (book_id = 43)
        (43, 14, 27, "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.", 1.0),
        (43, 16, 33, "These things I have spoken unto you, that in me ye might have peace. In the world ye shall have tribulation: but be of good cheer; I have overcome the world.", 1.0),
        // Romans (book_id = 45)
        (45, 5, 1, "Therefore being justified by faith, we have peace with God through our Lord Jesus Christ:", 0.95),
        (45, 8, 6, "For to be carnally minded is death; but to be spiritually minded is life and peace.", 0.9),
        (45, 15, 13, "Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope, through the power of the Holy Ghost.", 0.95),
        // Philippians (book_id = 50)
        (50, 4, 7, "And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.", 1.0),
        // Colossians (book_id = 51)
        (51, 3, 15, "And let the peace of God rule in your hearts, to the which also ye are called in one body; and be ye thankful.", 0.95),
        // 2 Thessalonians (book_id = 53)
        (53, 3, 16, "Now the Lord of peace himself give you peace always by all means. The Lord be with you all.", 0.9),
        // Hebrews (book_id = 58)
        (58, 4, 9, "There remaineth therefore a rest to the people of God.", 0.9),
        (58, 4, 10, "For he that is entered into his rest, he also hath ceased from his own works, as God did from his.", 0.85),
        (58, 4, 11, "Let us labour therefore to enter into that rest, lest any man fall after the same example of unbelief.", 0.85),
    ];

    // Work & Career verses
    let work_verses = vec![
        // Genesis (book_id = 1)
        (1, 2, 15, "And the LORD God took the man, and put him into the garden of Eden to dress it and to keep it.", 0.85),
        // Proverbs (book_id = 20)
        (20, 6, 6, "Go to the ant, thou sluggard; consider her ways, and be wise:", 0.9),
        (20, 10, 4, "He becometh poor that dealeth with a slack hand: but the hand of the diligent maketh rich.", 0.95),
        (20, 12, 11, "He that tilleth his land shall be satisfied with bread: but he that followeth vain persons is void of understanding.", 0.85),
        (20, 12, 24, "The hand of the diligent shall bear rule: but the slothful shall be under tribute.", 0.9),
        (20, 13, 4, "The soul of the sluggard desireth, and hath nothing: but the soul of the diligent shall be made fat.", 0.9),
        (20, 14, 23, "In all labour there is profit: but the talk of the lips tendeth only to penury.", 0.95),
        (20, 16, 3, "Commit thy works unto the LORD, and thy thoughts shall be established.", 1.0),
        (20, 18, 9, "He also that is slothful in his work is brother to him that is a great waster.", 0.85),
        (20, 22, 29, "Seest thou a man diligent in his business? he shall stand before kings; he shall not stand before mean men.", 1.0),
        // Ecclesiastes (book_id = 21)
        (21, 3, 13, "And also that every man should eat and drink, and enjoy the good of all his labour, it is the gift of God.", 0.9),
        (21, 5, 12, "The sleep of a labouring man is sweet, whether he eat little or much: but the abundance of the rich will not suffer him to sleep.", 0.85),
        (21, 9, 10, "Whatsoever thy hand findeth to do, do it with thy might; for there is no work, nor device, nor knowledge, nor wisdom, in the grave, whither thou goest.", 1.0),
        // Colossians (book_id = 51)
        (51, 3, 17, "And whatsoever ye do in word or deed, do all in the name of the Lord Jesus, giving thanks to God and the Father by him.", 1.0),
        (51, 3, 23, "And whatsoever ye do, do it heartily, as to the Lord, and not unto men;", 1.0),
        (51, 3, 24, "Knowing that of the Lord ye shall receive the reward of the inheritance: for ye serve the Lord Christ.", 0.95),
        // Ephesians (book_id = 49)
        (49, 4, 28, "Let him that stole steal no more: but rather let him labour, working with his hands the thing which is good, that he may have to give to him that needeth.", 0.85),
        (49, 6, 7, "With good will doing service, as to the Lord, and not to men:", 0.9),
        // 1 Thessalonians (book_id = 52)
        (52, 4, 11, "And that ye study to be quiet, and to do your own business, and to work with your own hands, as we commanded you;", 0.85),
        // 2 Thessalonians (book_id = 53)
        (53, 3, 10, "For even when we were with you, this we commanded you, that if any would not work, neither should he eat.", 0.9),
        // 1 Corinthians (book_id = 46)
        (46, 10, 31, "Whether therefore ye eat, or drink, or whatsoever ye do, do all to the glory of God.", 1.0),
        // Galatians (book_id = 48)
        (48, 6, 9, "And let us not be weary in well doing: for in due season we shall reap, if we faint not.", 0.95),
    ];

    // Parenting & Family verses
    let parenting_verses = vec![
        // Deuteronomy (book_id = 5)
        (5, 6, 6, "And these words, which I command thee this day, shall be in thine heart:", 0.9),
        (5, 6, 7, "And thou shalt teach them diligently unto thy children, and shalt talk of them when thou sittest in thine house, and when thou walkest by the way, and when thou liest down, and when thou risest up.", 1.0),
        // Psalms (book_id = 19)
        (19, 78, 4, "We will not hide them from their children, shewing to the generation to come the praises of the LORD, and his strength, and his wonderful works that he hath done.", 0.9),
        (19, 127, 3, "Lo, children are an heritage of the LORD: and the fruit of the womb is his reward.", 1.0),
        (19, 128, 3, "Thy wife shall be as a fruitful vine by the sides of thine house: thy children like olive plants round about thy table.", 0.9),
        // Proverbs (book_id = 20)
        (20, 1, 8, "My son, hear the instruction of thy father, and forsake not the law of thy mother:", 0.95),
        (20, 13, 24, "He that spareth his rod hateth his son: but he that loveth him chasteneth him betimes.", 0.9),
        (20, 17, 6, "Children's children are the crown of old men; and the glory of children are their fathers.", 0.85),
        (20, 19, 18, "Chasten thy son while there is hope, and let not thy soul spare for his crying.", 0.85),
        (20, 22, 6, "Train up a child in the way he should go: and when he is old, he will not depart from it.", 1.0),
        (20, 22, 15, "Foolishness is bound in the heart of a child; but the rod of correction shall drive it far from him.", 0.85),
        (20, 23, 13, "Withhold not correction from the child: for if thou beatest him with the rod, he shall not die.", 0.8),
        (20, 29, 15, "The rod and reproof give wisdom: but a child left to himself bringeth his mother to shame.", 0.85),
        (20, 29, 17, "Correct thy son, and he shall give thee rest; yea, he shall give delight unto thy soul.", 0.9),
        // Ephesians (book_id = 49)
        (49, 6, 1, "Children, obey your parents in the Lord: for this is right.", 1.0),
        (49, 6, 2, "Honour thy father and mother; (which is the first commandment with promise;)", 0.95),
        (49, 6, 4, "And, ye fathers, provoke not your children to wrath: but bring them up in the nurture and admonition of the Lord.", 1.0),
        // Colossians (book_id = 51)
        (51, 3, 20, "Children, obey your parents in all things: for this is well pleasing unto the Lord.", 1.0),
        (51, 3, 21, "Fathers, provoke not your children to anger, lest they be discouraged.", 0.95),
        // 3 John (book_id = 64)
        (64, 1, 4, "I have no greater joy than to hear that my children walk in truth.", 0.95),
    ];

    // Health & Healing verses
    let health_verses = vec![
        // Exodus (book_id = 2)
        (2, 15, 26, "And said, If thou wilt diligently hearken to the voice of the LORD thy God, and wilt do that which is right in his sight, and wilt give ear to his commandments, and keep all his statutes, I will put none of these diseases upon thee, which I have brought upon the Egyptians: for I am the LORD that healeth thee.", 0.9),
        // Psalms (book_id = 19)
        (19, 30, 2, "O LORD my God, I cried unto thee, and thou hast healed me.", 0.9),
        (19, 41, 3, "The LORD will strengthen him upon the bed of languishing: thou wilt make all his bed in his sickness.", 0.85),
        (19, 103, 2, "Bless the LORD, O my soul, and forget not all his benefits:", 0.9),
        (19, 103, 3, "Who forgiveth all thine iniquities; who healeth all thy diseases;", 1.0),
        (19, 107, 20, "He sent his word, and healed them, and delivered them from their destructions.", 0.95),
        (19, 147, 3, "He healeth the broken in heart, and bindeth up their wounds.", 1.0),
        // Proverbs (book_id = 20)
        (20, 3, 7, "Be not wise in thine own eyes: fear the LORD, and depart from evil.", 0.75),
        (20, 3, 8, "It shall be health to thy navel, and marrow to thy bones.", 0.9),
        (20, 4, 20, "My son, attend to my words; incline thine ear unto my sayings.", 0.8),
        (20, 4, 22, "For they are life unto those that find them, and health to all their flesh.", 0.95),
        (20, 17, 22, "A merry heart doeth good like a medicine: but a broken spirit drieth the bones.", 1.0),
        // Isaiah (book_id = 23)
        (23, 53, 5, "But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.", 1.0),
        // Jeremiah (book_id = 24)
        (24, 17, 14, "Heal me, O LORD, and I shall be healed; save me, and I shall be saved: for thou art my praise.", 0.95),
        (24, 30, 17, "For I will restore health unto thee, and I will heal thee of thy wounds, saith the LORD; because they called thee an Outcast, saying, This is Zion, whom no man seeketh after.", 0.9),
        // Matthew (book_id = 40)
        (40, 8, 17, "That it might be fulfilled which was spoken by Esaias the prophet, saying, Himself took our infirmities, and bare our sicknesses.", 0.9),
        (40, 9, 35, "And Jesus went about all the cities and villages, teaching in their synagogues, and preaching the gospel of the kingdom, and healing every sickness and every disease among the people.", 0.85),
        // 1 Peter (book_id = 60)
        (60, 2, 24, "Who his own self bare our sins in his own body on the tree, that we, being dead to sins, should live unto righteousness: by whose stripes ye were healed.", 1.0),
        // James (book_id = 59)
        (59, 5, 14, "Is any sick among you? let him call for the elders of the church; and let them pray over him, anointing him with oil in the name of the Lord:", 0.95),
        (59, 5, 15, "And the prayer of faith shall save the sick, and the Lord shall raise him up; and if he have committed sins, they shall be forgiven him.", 1.0),
        // 3 John (book_id = 64)
        (64, 1, 2, "Beloved, I wish above all things that thou mayest prosper and be in health, even as thy soul prospereth.", 1.0),
    ];

    // Insert all topical verses
    let all_verse_sets = vec![
        (finances_id, finance_verses),
        (anxiety_id, anxiety_verses),
        (marriage_id, marriage_verses),
        (salvation_id, salvation_verses),
        (forgiveness_id, forgiveness_verses),
        (prayer_id, prayer_verses),
        (wisdom_id, wisdom_verses),
        (strength_id, strength_verses),
        (peace_id, peace_verses),
        (work_id, work_verses),
        (parenting_id, parenting_verses),
        (health_id, health_verses),
    ];

    for (topic_id, verses) in all_verse_sets {
        for (book_id, chapter, verse, text, relevance) in verses {
            // Insert verse
            conn.execute(
                "INSERT OR IGNORE INTO verses (book_id, chapter, verse, text) VALUES (?1, ?2, ?3, ?4)",
                params![book_id, chapter, verse, text],
            )?;

            // Get the verse ID
            let verse_id: i64 = conn.query_row(
                "SELECT id FROM verses WHERE book_id = ?1 AND chapter = ?2 AND verse = ?3",
                params![book_id, chapter, verse],
                |row| row.get(0),
            )?;

            // Link to topic
            conn.execute(
                "INSERT OR IGNORE INTO verse_topics (verse_id, topic_id, relevance_score, is_primary) VALUES (?1, ?2, ?3, 1)",
                params![verse_id, topic_id, relevance],
            )?;
        }
    }

    Ok(())
}

pub fn seed_action_steps(conn: &Connection) -> Result<()> {
    // Get some key verse IDs for action steps
    // Proverbs 3:9 - Honor the LORD with substance
    let prov_3_9: Option<i64> = conn.query_row(
        "SELECT id FROM verses WHERE book_id = 20 AND chapter = 3 AND verse = 9",
        [],
        |row| row.get(0),
    ).ok();

    if let Some(verse_id) = prov_3_9 {
        let steps = vec![
            (1, "Create a budget that includes giving as the first line item, not an afterthought", "easy"),
            (2, "Identify one area of excess spending you can redirect toward generosity", "medium"),
            (3, "Set up automatic tithing to your church before other expenses", "medium"),
        ];
        for (num, content, difficulty) in steps {
            conn.execute(
                "INSERT OR IGNORE INTO action_steps (verse_id, step_number, content, difficulty) VALUES (?1, ?2, ?3, ?4)",
                params![verse_id, num, content, difficulty],
            )?;
        }
    }

    // Philippians 4:6-7 - Be anxious for nothing
    let phil_4_6: Option<i64> = conn.query_row(
        "SELECT id FROM verses WHERE book_id = 50 AND chapter = 4 AND verse = 6",
        [],
        |row| row.get(0),
    ).ok();

    if let Some(verse_id) = phil_4_6 {
        let steps = vec![
            (1, "Keep a worry journal - write down anxieties then consciously release them to God", "easy"),
            (2, "Practice the STOP technique: Stop, Take a breath, Observe the worry, Pray about it", "medium"),
            (3, "Replace each anxious thought with a specific thanksgiving", "challenging"),
        ];
        for (num, content, difficulty) in steps {
            conn.execute(
                "INSERT OR IGNORE INTO action_steps (verse_id, step_number, content, difficulty) VALUES (?1, ?2, ?3, ?4)",
                params![verse_id, num, content, difficulty],
            )?;
        }
    }

    // Ephesians 5:25 - Husbands love your wives
    let eph_5_25: Option<i64> = conn.query_row(
        "SELECT id FROM verses WHERE book_id = 49 AND chapter = 5 AND verse = 25",
        [],
        |row| row.get(0),
    ).ok();

    if let Some(verse_id) = eph_5_25 {
        let steps = vec![
            (1, "Ask your spouse daily: 'How can I serve you today?'", "easy"),
            (2, "Plan a weekly date that focuses entirely on your spouse's interests", "medium"),
            (3, "Identify one way you can sacrificially put your spouse's needs above your own comfort", "challenging"),
        ];
        for (num, content, difficulty) in steps {
            conn.execute(
                "INSERT OR IGNORE INTO action_steps (verse_id, step_number, content, difficulty) VALUES (?1, ?2, ?3, ?4)",
                params![verse_id, num, content, difficulty],
            )?;
        }
    }

    // Proverbs 22:6 - Train up a child
    let prov_22_6: Option<i64> = conn.query_row(
        "SELECT id FROM verses WHERE book_id = 20 AND chapter = 22 AND verse = 6",
        [],
        |row| row.get(0),
    ).ok();

    if let Some(verse_id) = prov_22_6 {
        let steps = vec![
            (1, "Establish a daily family devotion time, even if just 5 minutes", "easy"),
            (2, "Identify your child's unique gifts and create opportunities to develop them", "medium"),
            (3, "Model the behavior you want to see - children learn more from watching than listening", "challenging"),
        ];
        for (num, content, difficulty) in steps {
            conn.execute(
                "INSERT OR IGNORE INTO action_steps (verse_id, step_number, content, difficulty) VALUES (?1, ?2, ?3, ?4)",
                params![verse_id, num, content, difficulty],
            )?;
        }
    }

    // Colossians 3:23 - Work heartily
    let col_3_23: Option<i64> = conn.query_row(
        "SELECT id FROM verses WHERE book_id = 51 AND chapter = 3 AND verse = 23",
        [],
        |row| row.get(0),
    ).ok();

    if let Some(verse_id) = col_3_23 {
        let steps = vec![
            (1, "Begin each work day with a brief prayer dedicating your efforts to God", "easy"),
            (2, "Choose one task you usually rush through and commit to excellence in it", "medium"),
            (3, "Look for ways to bless coworkers - your workplace is your mission field", "challenging"),
        ];
        for (num, content, difficulty) in steps {
            conn.execute(
                "INSERT OR IGNORE INTO action_steps (verse_id, step_number, content, difficulty) VALUES (?1, ?2, ?3, ?4)",
                params![verse_id, num, content, difficulty],
            )?;
        }
    }

    // Matthew 6:33 - Seek first the kingdom
    let matt_6_33: Option<i64> = conn.query_row(
        "SELECT id FROM verses WHERE book_id = 40 AND chapter = 6 AND verse = 33",
        [],
        |row| row.get(0),
    ).ok();

    if let Some(verse_id) = matt_6_33 {
        let steps = vec![
            (1, "Start each day with Scripture before checking your phone or news", "easy"),
            (2, "Before making any major decision, ask: 'Does this align with God's kingdom?'", "medium"),
            (3, "Audit your calendar - does your time allocation reflect kingdom priorities?", "challenging"),
        ];
        for (num, content, difficulty) in steps {
            conn.execute(
                "INSERT OR IGNORE INTO action_steps (verse_id, step_number, content, difficulty) VALUES (?1, ?2, ?3, ?4)",
                params![verse_id, num, content, difficulty],
            )?;
        }
    }

    Ok(())
}

pub fn seed_reflection_questions(conn: &Connection) -> Result<()> {
    // Proverbs 3:9 - Honor the LORD with substance
    let prov_3_9: Option<i64> = conn.query_row(
        "SELECT id FROM verses WHERE book_id = 20 AND chapter = 3 AND verse = 9",
        [],
        |row| row.get(0),
    ).ok();

    if let Some(verse_id) = prov_3_9 {
        let questions = vec![
            ("What does your spending reveal about what you truly value?", "personal"),
            ("How might generosity impact your relationships with others?", "relational"),
            ("Do you trust God enough to give Him the first portion, not the leftovers?", "spiritual"),
            ("What practical changes could you make this month to honor God with your finances?", "practical"),
        ];
        for (question, category) in questions {
            conn.execute(
                "INSERT OR IGNORE INTO reflection_questions (verse_id, question, category) VALUES (?1, ?2, ?3)",
                params![verse_id, question, category],
            )?;
        }
    }

    // Philippians 4:6-7
    let phil_4_6: Option<i64> = conn.query_row(
        "SELECT id FROM verses WHERE book_id = 50 AND chapter = 4 AND verse = 6",
        [],
        |row| row.get(0),
    ).ok();

    if let Some(verse_id) = phil_4_6 {
        let questions = vec![
            ("What worries consume most of your mental energy right now?", "personal"),
            ("How does your anxiety affect the people closest to you?", "relational"),
            ("What would it look like to truly trust God with this situation?", "spiritual"),
            ("What is one worry you can surrender to God today through specific prayer?", "practical"),
        ];
        for (question, category) in questions {
            conn.execute(
                "INSERT OR IGNORE INTO reflection_questions (verse_id, question, category) VALUES (?1, ?2, ?3)",
                params![verse_id, question, category],
            )?;
        }
    }

    // Matthew 6:33
    let matt_6_33: Option<i64> = conn.query_row(
        "SELECT id FROM verses WHERE book_id = 40 AND chapter = 6 AND verse = 33",
        [],
        |row| row.get(0),
    ).ok();

    if let Some(verse_id) = matt_6_33 {
        let questions = vec![
            ("What competes with God for first place in your life?", "personal"),
            ("How do your priorities impact your family and friendships?", "relational"),
            ("What does seeking God's kingdom first look like in daily practice?", "spiritual"),
            ("What one thing could you change today to put God first?", "practical"),
        ];
        for (question, category) in questions {
            conn.execute(
                "INSERT OR IGNORE INTO reflection_questions (verse_id, question, category) VALUES (?1, ?2, ?3)",
                params![verse_id, question, category],
            )?;
        }
    }

    // John 3:16
    let john_3_16: Option<i64> = conn.query_row(
        "SELECT id FROM verses WHERE book_id = 43 AND chapter = 3 AND verse = 16",
        [],
        |row| row.get(0),
    ).ok();

    if let Some(verse_id) = john_3_16 {
        let questions = vec![
            ("Have you personally accepted God's gift of salvation?", "personal"),
            ("Who in your life needs to hear about God's love?", "relational"),
            ("How does God's sacrificial love change how you view yourself?", "spiritual"),
            ("What step can you take this week to share this good news?", "practical"),
        ];
        for (question, category) in questions {
            conn.execute(
                "INSERT OR IGNORE INTO reflection_questions (verse_id, question, category) VALUES (?1, ?2, ?3)",
                params![verse_id, question, category],
            )?;
        }
    }

    // Ephesians 4:32 - Forgiveness
    let eph_4_32: Option<i64> = conn.query_row(
        "SELECT id FROM verses WHERE book_id = 49 AND chapter = 4 AND verse = 32",
        [],
        |row| row.get(0),
    ).ok();

    if let Some(verse_id) = eph_4_32 {
        let questions = vec![
            ("Is there someone you're struggling to forgive right now?", "personal"),
            ("How has unforgiveness affected your relationships?", "relational"),
            ("How does remembering God's forgiveness of you change your perspective?", "spiritual"),
            ("What concrete step can you take toward reconciliation this week?", "practical"),
        ];
        for (question, category) in questions {
            conn.execute(
                "INSERT OR IGNORE INTO reflection_questions (verse_id, question, category) VALUES (?1, ?2, ?3)",
                params![verse_id, question, category],
            )?;
        }
    }

    Ok(())
}
