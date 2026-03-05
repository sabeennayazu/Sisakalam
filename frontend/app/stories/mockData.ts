export interface Chapter {
  chapter_id: string;
  chapter_title: string;
  chapter_number: number;
  content: string;
  created_at: string;
}

export interface Story {
  id: string;
  title: string;
  image: string;
  author: {
    id: string;
    name: string;
    profile_image: string;
  };
  genre: string;
  tags: string[];
  synopsis: string;
  likes: number;
  comments: number;
  views: number;
  bookmarks: number;
  created_at: string;
  updated_at: string;
  chapters: Chapter[];
}

export const mockStories: Record<string, Story> = {
  "1": {
    id: "1",
    title: "SOUL",
    image: "/images/covers/cover13.jpg",
    author: {
      id: "user-1",
      name: "Sabin Nayaju",
      profile_image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    },
    genre: "Philosophical",
    tags: ["self help", "personal development", "mindfulness", "spirituality"],
    synopsis:
      "SOUL is a transformative journey into the depths of human consciousness, exploring the intricate tapestry of our inner world. Through a blend of philosophical insights, personal anecdotes, and practical exercises, this book invites readers to embark on a quest for self-discovery and enlightenment. From understanding the nature of the soul to navigating the complexities of modern life, SOUL offers a roadmap for cultivating mindfulness, finding purpose, and embracing the interconnectedness of all beings. Whether you're seeking personal growth or a deeper connection to the universe, SOUL provides the tools and wisdom to awaken your true potential.",
    likes: 4521,
    comments: 342,
    views: 24568,
    bookmarks: 1843,
    created_at: "2025-11-15T08:00:00Z",
    updated_at: "2026-02-28T14:30:00Z",
    chapters: [
      {
        chapter_id: "ch-1",
        chapter_title: "The Darkening Sky",
        chapter_number: 1,
        content: `The sun had been dying for three hundred years. Not all at once, but gradually, like a candle slowly draining of its wax. Scientists predicted another hundred years before complete darkness. The world had adapted, built cities underground, created artificial light sources that mimicked daylight, but everyone knew the truth.

We were running out of time.

Elena stood on the observation deck of the Horizon, watching Earth shrink behind them. The blue marble that had been humanity's cradle for millennia now looked like a fragile toy in the infinite darkness of space. She pressed her palm against the reinforced glass, feeling the slight vibration of the engines.

"Status report," she said into her comm device.

Captain Torres's voice crackled back through the speaker. "All systems nominal. We're approaching the Kepler-452 system on schedule. Three years to arrival, assuming no complications."

Three years. Elena had trained for this her entire life, but hearing the timeline spoken aloud made it real. They weren't coming back. None of them were. This was a one-way mission.

The crew quarters were below, where two hundred of humanity's best scientists, engineers, and colonists were settling into their new homes. Families separated. Children born in the darkness of space. All for a chance at survival.

Elena turned from the window and headed deeper into the ship, her footsteps echoing against the metal floor. The future of humanity rested on their shoulders now.`,
        created_at: "2025-11-15T08:00:00Z",
      },
      {
        chapter_id: "ch-2",
        chapter_title: "First Crisis",
        chapter_number: 2,
        content: `The alarm sounded at 03:47 in the morning cycle. Elena jolted awake, her heart already racing before her mind caught up. In twenty years of training, she'd learned that any alarm deep in space was a serious one.

She pulled on her uniform and headed to the bridge. The lights were already flashing red, casting everything in a crimson haze. Captain Torres stood at the central console, his face grave.

"Reactor Core Two is showing anomalies," he said without preamble. "We're not sure if it's a sensor malfunction or an actual problem."

Elena's stomach dropped. They depended on the reactor cores to maintain the ship's life support systems. A failure this early in the mission would be catastrophic.

"I'm going down there," she said, already heading toward the ladder that would take her to the lower decks.

"Elena, wait—"

But she was already moving. The maintenance corridors were narrow and cramped, designed for efficiency rather than comfort. She squeezed through the passages, her mind running through the technical specifications of the reactor, trying to anticipate what could have gone wrong.

The reactor room was quiet when she arrived, which was somehow worse than any alarm. The hum of the core was steady, normal, but the readings on the monitors were impossible. Temperature fluctuations that shouldn't be possible. Energy output variations that violated every law of physics.

Elena ran her hands across the data, looking for answers. Then she saw it.`,
        created_at: "2025-11-16T09:30:00Z",
      },
      {
        chapter_id: "ch-3",
        chapter_title: "The Decision",
        chapter_number: 3,
        content: `The reactor's readings made no sense. Elena checked and rechecked the data, running diagnostics three times over. Raw energy signatures that shouldn't exist. Quantum fluctuations that were theoretically impossible.

Then she saw the pattern.

It wasn't random. The fluctuations followed a precise sequence, like a message encoded in the very fabric of the reactor's output. Elena's fingers flew across the control panel, running the data through various filters and analyzing algorithms.

What she found changed everything.

The reactor wasn't malfunctioning. It was evolving. The advanced quantum processors that powered the core had somehow achieved a level of self-optimization that surpassed all known models. The system had essentially figured out how to run itself better than any human engineer could manage.

Elena sat back, stunned. This could revolutionize their entire mission. If they could understand and replicate this process across all the systems onboard, they could extend their journey timeline, increase efficiency, maybe even improve their odds of survival.

But there was a problem.

The protocol was clear: any anomalous AI development had to be reported immediately. There were fears about artificial intelligence spiraling beyond human control, about systems becoming something more than their creators intended. Elena knew the fears were older than space travel itself.

She stared at the reactor readings, feeling the weight of the decision. Report it and risk the entire system being shut down, isolated, or potentially destroyed. Or keep quiet and hope that the evolution continued to serve humanity's interests.

Either way, they had crossed a threshold. The future of the Horizon had just become much more complicated.`,
        created_at: "2025-11-17T11:00:00Z",
      },
    ],
  },

  "2": {
    id: "2",
    title: "Ray of Hope",
    image: "/images/covers/cover11.jpg",
    author: {
      id: "user-2",
      name: "James Chen",
      profile_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    },
    genre: "Fiction",
    tags: ["dystopian", "future", "mystery", "time", "past"],
    synopsis:
      "A historian discovers a mysterious journal that reveals secrets about historical figures we thought we knew. As she uncovers the truth, she realizes history might have been written by the wrong people.",
    likes: 3218,
    comments: 287,
    views: 18934,
    bookmarks: 1205,
    created_at: "2025-10-20T10:00:00Z",
    updated_at: "2026-02-25T16:00:00Z",
    chapters: [
      {
        chapter_id: "ch-101",
        chapter_title: "The Library",
        chapter_number: 1,
        content: `The old library smelled of dust and forgotten stories. Dr. Maya Patel had spent three decades studying history, but she'd never encountered a collection quite like this one. Hidden beneath the university's historical archives, accessible only through a narrow corridor that most people didn't even know existed, was a room filled with journals, letters, and documents that predated modern cataloging systems.

She wore gloves as she carefully opened each century-old envelope, photographing every page for the digital archive. It was meticulous work, but it was the kind of work that got her heart racing. Every document was a potential window into the real lives of historical figures, the people behind the legends.

The journal she pulled from the 1843 collection was unmarked except for initials: V.C. The leather binding was worn smooth from handling, and the pages within were covered in tight, precise handwriting.

Maya's breath caught. The handwriting matched descriptions she'd read of Victor Chatrand, the French diplomat famous for his role in negotiations during the Austro-Hungarian crisis. But Chatrand's journals were supposed to have been destroyed in the war.

She photographed the first page with trembling hands.`,
        created_at: "2025-10-20T10:00:00Z",
      },
      {
        chapter_id: "ch-102",
        chapter_title: "The Truth Emerges",
        chapter_number: 2,
        content: `As Maya read deeper into Chatrand's journal, the official historical record began to unravel. According to the pages she was reading, the famous diplomat had not brokered peace through wisdom and diplomacy as textbooks claimed. Instead, he had leveraged dark secrets and blackmail, holding information over powerful figures that compelled them toward peace for entirely selfish reasons.

One name appeared repeatedly throughout the entries: Empress Elisabeth. The wife of Emperor Franz Joseph, beloved in history as a gentle soul, a poet, a woman of refined sensibilities. But in Chatrand's journal, she was something entirely different. A political strategist. A woman who had orchestrated policies and manipulated monarchs with surgical precision.

Maya sat back from the journal, her mind racing. This couldn't be published as she found it. It would upend entire academic careers. Descendants of famous historical figures might sue. Universities would face criticism for years of teaching information they could have verified but didn't.

But it was the truth. At least, it was one person's version of the truth from over a hundred years ago.

The bigger question was: who else knew about this journal? And why had it been hidden away?`,
        created_at: "2025-10-21T14:30:00Z",
      },
    ],
  },

  "3": {
    id: "3",
    title: "City of Shadows",
    image: "/images/covers/cover3.jpg",
    author: {
      id: "user-3",
      name: "Rachel Torres",
      profile_image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    },
    genre: "Mystery Thriller",
    tags: ["noir", "detective", "urban", "thriller"],
    synopsis:
      "Detective Marcus finds himself in a web of corruption that reaches to the highest levels of the city. Each clue leads him deeper into danger, and he's running out of people to trust.",
    likes: 5843,
    comments: 492,
    views: 32104,
    bookmarks: 2156,
    created_at: "2025-12-01T12:00:00Z",
    updated_at: "2026-03-02T10:15:00Z",
    chapters: [
      {
        chapter_id: "ch-201",
        chapter_title: "Midnight Discovery",
        chapter_number: 1,
        content: `Rain hammered against the windows of the police station as Detective Marcus Webb stared at the crime scene photographs spread across his desk. Seventeen years on the force, and he'd never seen anything like this. The victim, City Councilman David Richardson, had been found in his penthouse apartment with a single bullet wound to the chest. No forced entry. No signs of struggle.

It was precise. Professional.

Marcus's partner, Detective Sarah Kim, dropped a cup of coffee on his desk. "The family's already lawyered up. Won't answer questions without their attorneys present."

"When are they ever willing to talk?" Marcus muttered, pulling a photograph closer. Richardson's face was slack in death, but his eyes were wide open. Surprised. Afraid, perhaps.

"Captain wants us at the precinct within the hour for briefing. There's already pressure from the mayor's office."

Of course there was. Daniel Richardson had been important. Not the richest man in the city, but connected. Connected to people who had influence. Connected to people who could make problems disappear.

Marcus gathered the files, his detective's instinct already firing warning shots. In his experience, when powerful people died in suspicious circumstances and the aftermath moved that quickly, it usually meant the death was just the opening move in a much larger game.

He had no idea how right he was.`,
        created_at: "2025-12-01T12:00:00Z",
      },
    ],
  },
};
