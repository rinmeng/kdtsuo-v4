-- ============================================================
-- SEED DATA for K-Pop Dance Team Website
-- Place this file at: supabase/seed.sql
-- Runs automatically after migrations on db reset
-- ============================================================
-- ── TEAM MEMBERS ────────────────────────────────────────────
INSERT INTO
    "public"."team_members" (
        "full_name",
        "role",
        "bio",
        "profile_image_url",
        "instagram_url",
        "linkedin_url",
        "github_url",
        "order_index",
        "is_archived"
    )
VALUES
    (
        'Mia Tanaka',
        'President & Main Dancer',
        'Fourth-year Kinesiology student and the heart of the team. Has been dancing since age 6 and specializes in girl group choreography. Loves BLACKPINK and aespa.',
        'https://i.pravatar.cc/300?img=47',
        'https://instagram.com/miatanaka.dance',
        null,
        null,
        1,
        false
    ),
    (
        'Juno Park',
        'Vice President & Choreographer',
        'Third-year student obsessed with boy group styles. Trained in popping and locking before discovering K-pop. Choreographs most of the team''s original covers.',
        'https://i.pravatar.cc/300?img=53',
        'https://instagram.com/junopark_',
        null,
        null,
        2,
        false
    ),
    (
        'Hana Kwon',
        'Performance Director',
        'Oversees stage presence, formations, and costumes. Dance minor with a background in contemporary. Favorite group is TWICE.',
        'https://i.pravatar.cc/300?img=44',
        'https://instagram.com/hanakwon.krp',
        null,
        null,
        3,
        false
    ),
    (
        'Leo Nguyen',
        'Social Media Manager',
        'Runs the team''s TikTok and Instagram. Film student who edits all the performance videos. Currently learning Stray Kids choreo.',
        'https://i.pravatar.cc/300?img=51',
        'https://instagram.com/leonguyen.vid',
        null,
        null,
        4,
        false
    ),
    (
        'Yuna Choi',
        'Events Coordinator',
        'Handles all bookings, showcases, and competition logistics. Incredibly organized and always the one with the shared Google Doc ready.',
        'https://i.pravatar.cc/300?img=48',
        'https://instagram.com/yunachoi__',
        null,
        null,
        5,
        false
    ),
    (
        'Kai Reyes',
        'Dancer',
        'Sophomore who joined last semester and already a crowd favourite. Specializes in BTS and EXO covers.',
        'https://i.pravatar.cc/300?img=55',
        'https://instagram.com/kaireyes.dance',
        null,
        null,
        6,
        false
    ),
    (
        'Sophie Lim',
        'Dancer',
        'First-year member with a background in ballet and jazz. Brings a clean, precise style to every performance.',
        'https://i.pravatar.cc/300?img=49',
        'https://instagram.com/sophielim_kpop',
        null,
        null,
        7,
        false
    ),
    (
        'Rin Matsuda',
        'Former President',
        'Founded the team four years ago and built it from 3 members to over 20. Now alumni but cheers from the front row at every showcase.',
        'https://i.pravatar.cc/300?img=46',
        'https://instagram.com/rinmatsuda',
        null,
        null,
        8,
        true
    );

-- ── POSITIONS ───────────────────────────────────────────────
INSERT INTO
    "public"."positions" (
        "label",
        "description",
        "form_url",
        "is_accepting_responses"
    )
VALUES
    (
        'General Dancer Audition',
        'Open to all skill levels! We hold auditions every semester. Come ready to learn an 8-count and show us your energy. No prior K-pop experience required — just passion.',
        'https://forms.google.com/kpop-dancer-audition',
        true
    ),
    (
        'Choreographer',
        'Help create and teach original dance covers for the team. You should be comfortable breaking down choreography and leading group practice sessions.',
        'https://forms.google.com/kpop-choreographer',
        true
    ),
    (
        'Videographer / Editor',
        'Film practices, showcases, and events. Edit performance videos for our social media. Familiarity with Premiere Pro or DaVinci Resolve is a plus.',
        'https://forms.google.com/kpop-videographer',
        true
    ),
    (
        'Costume & Props Coordinator',
        'Source and manage outfits, accessories, and props for performances. Great eye for K-pop fashion aesthetics is a big plus.',
        'https://forms.google.com/kpop-costume',
        false
    ),
    (
        'Graphic Designer',
        'Create posters, social media graphics, and event flyers. Should know Figma, Canva, or Adobe tools. K-pop idol card aesthetic experience is a bonus.',
        'https://forms.google.com/kpop-designer',
        true
    );

-- ── SPONSORS ────────────────────────────────────────────────
INSERT INTO
    "public"."sponsors" (
        "title",
        "image",
        "location",
        "maplink",
        "text",
        "websitelink"
    )
VALUES
    (
        'Hanbok & Co.',
        'https://placehold.co/400x200?text=Hanbok+%26+Co.',
        '221 Korean Cultural Plaza, Vancouver, BC',
        'https://maps.google.com/?q=221+Korean+Cultural+Plaza+Vancouver',
        'Hanbok & Co. is a Korean fashion and cultural wear boutique that sponsors our team''s costumes for major showcases. They believe in celebrating Korean culture through art and performance.',
        'https://hanbokandco.example.com'
    ),
    (
        'Seoul Bites',
        'https://placehold.co/400x200?text=Seoul+Bites',
        '88 Kimchi Street, Kelowna, BC',
        'https://maps.google.com/?q=88+Kimchi+Street+Kelowna',
        'Seoul Bites is a beloved local Korean restaurant that caters our end-of-year banquet and keeps the team fuelled during long rehearsal weekends.',
        'https://seoulbites.example.com'
    ),
    (
        'Studio K Dance Space',
        'https://placehold.co/400x200?text=Studio+K',
        '340 Rhythm Road, Kelowna, BC',
        'https://maps.google.com/?q=340+Rhythm+Road+Kelowna',
        'Studio K provides our team with subsidized studio time for weekly practices and performance run-throughs. Their mirrored rooms and sound system are top tier.',
        'https://studiok.example.com'
    );

-- ── LINKS ───────────────────────────────────────────────────
INSERT INTO
    "public"."links" (
        "label",
        "iconType",
        "date",
        "link",
        "price",
        "order"
    )
VALUES
    (
        'Spring Showcase 2025 Tickets',
        'event',
        '2025-04-12',
        'https://tickets.example.com/spring-showcase-2025',
        10.00,
        1
    ),
    (
        'Team TikTok',
        'tiktok',
        null,
        'https://tiktok.com/@kpopteam',
        null,
        2
    ),
    (
        'Team Instagram',
        'instagram',
        null,
        'https://instagram.com/kpopteam',
        null,
        3
    ),
    (
        'Audition Info Session',
        'event',
        '2025-02-28',
        'https://forms.google.com/audition-info',
        null,
        4
    ),
    (
        'Winter Showcase Recap (Video)',
        'video',
        '2024-12-10',
        'https://youtube.com/watch?v=winter-showcase',
        null,
        5
    ),
    (
        'Team Merch — Hoodies & Tees',
        'shop',
        null,
        'https://shop.example.com/kpopteam',
        35.00,
        6
    ),
    (
        'Practice Schedule (Members)',
        'calendar',
        null,
        'https://calendar.google.com/kpopteam',
        null,
        7
    );