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
    title: "My Fake Boyfriend",
    image: "/images/covers/cover1.jpg",
    author: {
      id: "user-1",
      name: "S.A.A",
      profile_image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    },
    genre: "Romance",
    tags: ["romance", "college", "fake dating", "friends to lovers", "comedy"],
    synopsis:
      "When college sophomore Aria Blake needs a fake relationship to get her ex off her back, she strikes a deal with the most annoyingly attractive man on campus — Ethan Cole. What starts as a perfectly choreographed lie quickly spirals into something neither of them planned for.",
    likes: 14200,
    comments: 3820,
    views: 87400,
    bookmarks: 5100,
    created_at: "2025-09-10T08:00:00Z",
    updated_at: "2026-02-20T14:00:00Z",
    chapters: [
      {
        chapter_id: "mfb-ch1",
        chapter_title: "The Arrangement",
        chapter_number: 1,
        content: `Aria Blake's plan was simple: show up to her ex-boyfriend's engagement party with a date hot enough to make him regret every single decision he had ever made. The simplest plans, however, always had a fatal flaw—hers being that she had approximately zero eligible men in her contact list willing to attend a romantic event with her on forty-eight hours' notice.

She stood in the middle of the crowded campus library, phone pressed to her ear, watching the 4 p.m. sunlight slice through the tall arched windows and illuminate the anxious expression on her own face in the glass. Around her, students buried themselves in textbooks and laptops, unbothered by the quiet crisis unfolding in the periodicals section.

"No, I'm not joking," she whispered furiously to her roommate, Priya. "The invitation literally arrived yesterday. Jake is getting engaged. To Mia. Who I introduced him to. At my birthday dinner."

"That's genuinely diabolical," Priya said cheerfully. "Also, this is why you should have moved on six months ago."

"I did move on. I just—I want to look like I moved on spectacularly."

"Aria, spectacularly moving on takes months of therapy and a very good haircut. You have forty-eight hours and a library card."

Aria hung up. Or rather, she lowered the phone and stared at it like it had personally offended her. That was when she walked backward directly into a stack of returned books that someone had balanced far too optimistically on the edge of a cart, and sent them cascading to the floor in a thunderous avalanche.

Every head in the library turned.

Including his.

Ethan Cole leaned against the far study table, arms crossed, watching her with an expression that occupied the precise midpoint between amusement and pity. He was criminally good-looking in the way that seemed almost aggressive—dark hair perpetually disheveled, jaw sharp enough to cut glass, and grey eyes that always seemed to be calculating something at your expense. He was also, unfortunately, the last person Aria wanted to owe a favor to.

"Nice entrance," he said, loud enough for half the library to hear.

"I was testing the structural integrity of their shelving system." She crouched and began gathering books. "It failed."

He walked over and crouched across from her, picking up a copy of Wuthering Heights and examining it with mild interest. "For what it's worth, you looked completely confident right up until the moment the cart moved."

"Thank you, Ethan. Very helpful."

"I'm a helpful person."

She looked up at him. He was still watching her with those insufferable grey eyes, and for a fraction of a second she thought about the absolute absurdity of what she was about to do—the idea that had been forming, unbidden, since the moment she'd heard his voice and remembered that Ethan Cole owed her one.

Six months ago, she'd helped him pass his Introduction to Literature final by tutoring him for three weeks while he'd complained loudly and often about the futility of fiction. She'd extracted one promise in return: that someday, in some form, he would return the favor.

She hadn't expected to redeem it like this.

"I need you to be my boyfriend," she said. "Fake. For one party. Saturday night. You wear something nice, act like you think I'm wonderful, and I will never ask you for anything again."

Dead silence.

Then Ethan Cole did something she had not anticipated. He picked up the last fallen book, stood to his full height, and said: "What's in it for me?"

She stood too. "The eternal satisfaction of knowing you did something genuinely good."

"Pass." He set the books on the cart. "Try again."

"I proofread your entire thesis introduction last semester."

"That was one paragraph."

"It was four hundred words. You used 'thus' seven times."

Something flickered across his eyes that might, in a different man, have been embarrassment. "I need someone to accompany me to my family's dinner two weeks from now," he said. "My mother keeps rotating through prospective—" he paused, searching for the right word, "—introductions. If I have a girlfriend, the rotation stops."

Aria considered this. "Fake girlfriend."

"Obviously."

"Two weeks of pretending in exchange for one night?"

"Two weeks. One party. And you have to be convincing."

She held out her hand. "Deal."

He looked at her hand like he was reconsidering everything. Then he shook it. His hand was warm and his grip was firm and Aria told herself firmly that none of that was relevant information.

"Rule one," she said, pulling her hand back. "You don't fall in love with me."

He looked deeply unimpressed. "Rule one," he countered, "is that you stop making rules that assume the situation is more dramatic than it is."

She shouldered her bag and started toward the exit. "Saturday at seven. Dress like you have taste."

"I have excellent taste," he called after her.

"Then this should be easy," she said without turning around.

Outside, the autumn air was cold and sharp and smelled like leaves and rain, and Aria Blake allowed herself approximately thirty seconds of pure terror before squaring her shoulders and walking forward.

She was going to absolutely nail this.`,
        created_at: "2025-09-10T08:00:00Z",
      },
      {
        chapter_id: "mfb-ch2",
        chapter_title: "The Party",
        chapter_number: 2,
        content: `The dress was emerald green, because Aria had read somewhere that wearing green to a party made people remember you, and she desperately needed Jake Henderson to remember that she existed as something other than "girl I dated before getting engaged to someone better."

Ethan arrived at her apartment door at 6:52 p.m., which was eight minutes early and entirely inconsistent with everything she knew about him. He was wearing a dark navy blazer over a charcoal shirt, no tie, sleeves rolled to the elbows — the kind of effortlessly assembled look that made Aria simultaneously relieved and irritated.

He took one look at her and said, "You look like you're about to make a series of decisions you'll either regret or remember fondly."

"That's the goal," Aria said, and grabbed her clutch from the table.

The party was held at a garden venue near the edge of the city, strung with warm lights and arranged to look effortlessly luxurious. It was exactly the kind of party Aria would have planned for herself, which made the whole thing approximately thirty percent more unbearable.

"Guidelines," she murmured as Ethan opened the door for her — which was somehow both courteous and deeply inconvenient for her goals of remaining professionally detached. "Don't volunteer information. If someone asks how we met, we were introduced through a mutual friend. If someone asks how long we've been together, say a few months. Keep it vague."

"You've clearly thought about this."

"I've thought about nothing else for forty-seven hours."

"That's worrying."

"Focus."

Jake was across the room talking to a cluster of people she vaguely recognized from the years they'd spent orbiting the same social circles. He was taller than she remembered, or maybe that was just the way memory softened things into harmlessness. Mia was beside him, radiant in ivory, laughing at something with her entire face.

Aria had approximately three seconds to feel something awful before Ethan's hand settled at the small of her back — steady, warm, present — and the awful thing got quietly smaller.

"Breathing helps," he said, very quietly near her ear.

"I'm breathing."

"Faster than usual. You're going to hyperventilate into the appetizers."

She laughed, startled out of it — a real laugh, not the measured kind she'd been rehearsing. And that was the exact moment Jake Henderson turned around and saw her.

The calculation in his eyes was instantaneous: who she was with, whether the man beside her was significant, whether Aria had upgraded or merely replaced. It was ugly to recognize, but she recognized it because she knew him, or had known him once.

What she hadn't anticipated was Ethan.

Ethan looked at Jake with the calm, unintimidated ease of someone who had absolutely nothing to prove to anyone in the room — which, Aria realized, was simply who Ethan Cole was in all contexts. He shook Jake's hand with the exact right amount of grip. He listened to the obligatory small talk with the relaxed attention of someone completely secure. He said exactly three things during the interaction, all of them slightly ironic and all of them landing precisely right.

When they finally drifted toward the other side of the room, Jake watching them go, Aria exhaled for what felt like the first time all evening.

"Where did you learn to do that?" she asked.

"Do what?"

"That. Be that... contained."

Ethan picked up two glasses of something sparkling from a passing tray and offered one. "Containment is the default setting for people who don't need other people's reactions to tell them who they are."

She looked at him. "That's either very healthy or very sad."

"Could be both." He met her eyes over his glass, briefly, then glanced away. "You're doing well, for the record. You look like someone who genuinely doesn't care."

"Is that a compliment?"

"It's an observation."

"From you, I'll take it."

They stayed for three hours. They talked to people, navigated proximity to Jake without making it obvious, ate remarkable small plates of food, and argued quietly but with great enjoyment about whether architectural detail mattered in domestic spaces — a topic that emerged from a single comment about the venue's ceiling moldings and became, somehow, a thirty-minute disagreement.

By the time they stood outside waiting for her car, Aria realized she had spent the majority of the evening not thinking about Jake Henderson at all.

"That wasn't terrible," she admitted.

Ethan stood beside her with his hands in his pockets, looking at the light-strung trees. "The ceiling detailing was, in fact, excessive."

"It was classical revival. It was supposed to be excessive."

"Excessiveness isn't a virtue by virtue of being intentional."

"I am not having this argument on a sidewalk at eleven p.m."

"You literally started it."

Her car arrived. She stepped toward it, then paused with her hand on the door. "Two weeks," she reminded him. "Your mother's dinner."

"I'll send you the time."

"Ethan." She turned. He was watching her with the particular quality of attention he had that made her feel simultaneously seen and completely unreadable to herself. "Thank you. For tonight. It was—" she looked for the right word and found it nowhere, "—enough. More than enough."

He nodded once. Not dismissive, not elaborate. Just present.

She got into the car.

On the drive home, staring at the passing city lights, Aria realized she had made a significant tactical error. She had agreed to spend two more weeks in calibrated proximity to someone who was, she was now being forced to acknowledge, entirely too interesting.

She opened her phone and texted Priya: I may have complicated the plan.

The response came back in thirty seconds: Obviously. How was he?

Aria stared at the screen for a long moment before typing: Annoying. Exactly as expected.

Then deleted it.

Then typed: Fine. He was fine. And sent that instead.`,
        created_at: "2025-09-17T08:00:00Z",
      },
      {
        chapter_id: "mfb-ch3",
        chapter_title: "What Happens Now",
        chapter_number: 3,
        content: `The Cole family home was old money made tangible—a large property on the northern edge of the city with carefully tended grounds and a kind of quiet that felt deliberately maintained, like a held breath in a beautiful room. Ethan picked Aria up at six, and for the length of the drive neither of them mentioned what they were walking into.

"Your family," Aria said as they turned through the gate. "What should I know?"

"My mother is sharp, politically astute, and immediately skeptical of anything she considers performative. My father is retired, reads excessively, and will probably try to lend you a book." Ethan kept his eyes on the drive. "My sister is seventeen, sees through everything, and will ask you at least one question specifically designed to make you uncomfortable."

"Wonderful."

"Don't agree with everything my mother says. She dislikes yes-people."

"So disagree with her?"

"Only if you actually mean it. She dislikes artifice more than she dislikes opposition."

Aria studied his profile. "You're nervous."

"I'm prepared."

"Those aren't the same thing."

He didn't answer. Which meant she was right.

The dinner was set in a large, formally laid dining room, the table warm with candlelight and the kind of careful arrangement that communicated effort without appearing to. Ethan's mother, Dr. Diana Cole, was a composed woman in her early sixties with intelligent eyes and the posture of someone who had made decisions in rooms that mattered. She assessed Aria in approximately four seconds, then moved smoothly into welcome, which was somehow more intimidating.

His father, Richard, shook her hand warmly and immediately offered her a copy of a biography of Marie Curie that he was certain she would enjoy. She took it with genuine pleasure, which made him visibly delighted.

His sister, Lena, watched all of this from across the table with the specific, penetrating boredom of adolescence, then leaned forward and said: "How long have you actually been together? Be honest."

Aria was ready for the timeline. She was not ready for be honest. She felt something flicker across her face before she could stop it.

And Ethan said, without hesitation, "Long enough to matter. Short enough that we're still learning."

It was the most honest thing he could have said. It was also entirely true.

Lena looked between them for a moment, then leaned back with the expression of someone who had gotten what they were looking for. "Okay," she said simply, and reached for her water.

Dinner was three courses and two and a half hours of conversation that moved through politics, architecture, the biography of Marie Curie, a brief and surprisingly interesting disagreement about urban development policy, and whether fiction was a more or less reliable vehicle for truth than biography. Aria held her own. More than held her own.

Somewhere in the middle of the second course, she realized that she was genuinely enjoying herself, and the awareness made her take a quiet step back inside her own thoughts to examine it.

This was not part of the arrangement. Enjoying Ethan's family was not supposed to happen. Experiencing the way he became marginally less contained around his father, the way he argued with Lena with something that was clearly affection underneath its exasperation, the way his mother looked at him with a combination of expectation and softness she didn't deploy anywhere else—none of that was supposed to be information that mattered to her.

After dinner, his mother found a moment to speak to Aria alone, by the garden door.

"He's different around you," she said. "There's something he drops." A beat. "I won't push. But I will say that whatever is happening, I think it's good for him."

Aria smiled carefully. "He's a very unexpected person," she said, and that much was entirely, unperformatively true.

On the drive back, the city lights flickered past and Ethan drove with the particular silence that she had learned was not absence but processing.

"Your family is wonderful," she said.

"They're a lot."

"I liked them. Genuinely."

A pause. "They liked you too." Another pause. "Lena doesn't just accept people. She was watching you."

"I know. That's how you know someone will be interesting when they grow up."

From the corner of her eye she saw something shift in his expression. Not smiled exactly. Something quieter.

"The arrangement is done," he said. "You delivered, I delivered. Technically speaking." He signaled, changed lanes. "You're off the hook."

The words landed in the silence of the car and Aria turned them over. Off the hook. Technically done. Clean ledger.

"What if I didn't want to be off the hook?" she heard herself say.

Ethan was quiet for long enough that she thought perhaps the question had been too much—had torn the careful, evenly maintained canvas of what they'd built and would now require careful repainting and mutual pretending it hadn't happened.

Then: "What are you actually saying?"

She looked at him fully. "I'm saying that I went to one party to stop caring about someone. And I came back having significantly stronger feelings about someone else. And I am aware that this is catastrophically inconvenient."

He signaled again. Pulled into her street. Put the car in park in front of her building.

Turned to look at her.

"Aria," he said, and his voice was different. Lower. Less defended. "I've been trying to figure out how to categorize you since the moment you sent an entire cart of library books onto the floor and somehow looked completely unrattled afterward."

She laughed, quiet and real. "I was completely rattled."

"I know." His eyes held hers. "That was the part I couldn't stop thinking about."

The city hummed around them, distant and indifferent. Aria Blake, who had built this particular architecture out of strategy and self-protection, felt it quietly dismantle itself.

"So," she said finally. "What happens now?"

He looked at her for another moment—measuring, but warm now, the calculation gentled into something that felt closer to wonder.

"I think," Ethan said, "we stop pretending we don't know the answer to that."

And in the particular, improbable way of things that start as one story and become another entirely, that was where the real one began.`,
        created_at: "2025-09-24T08:00:00Z",
      },
    ],
  },

  "3": {
    id: "3",
    title: "Torment",
    image: "/images/covers/cover3.jpg",
    author: {
      id: "user-3",
      name: "Rhea Novak",
      profile_image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    },
    genre: "Dark Fantasy",
    tags: ["dark fantasy", "redemption", "war", "guilt", "revenge"],
    synopsis:
      "Decades after a brutal civil war, the land of Varek is scarred and silent. Former soldier Kira Ashveil returns to the village she once burned to the ground — haunted by the faces she cannot forget. A gripping dark fantasy that asks if redemption is ever truly possible.",
    likes: 9800,
    comments: 2410,
    views: 62300,
    bookmarks: 3400,
    created_at: "2025-11-02T08:00:00Z",
    updated_at: "2026-03-01T10:00:00Z",
    chapters: [
      {
        chapter_id: "torment-ch1",
        chapter_title: "The Road Back",
        chapter_number: 1,
        content: `The road back to Adrath was unpaved and unforgiving, and Kira Ashveil had walked it once before going in the opposite direction, though she'd ridden a warhorse then, armored and ordered, and the village had been burning behind her.

That was fourteen years ago.

Now she walked with a traveling cloak and nothing sharp on her body—a deliberate, effortful choice that cost her every morning when she dressed and every night when she tried to sleep without anything to grip when the dark came too close. She had a pack with bread and a blanket and a small tin of water. The hills were the same hills. The sky above them was the same pale winter sky, not yet committed to morning.

She had not planned to come back. The plan, insofar as she'd had one after the war ended and the empire dissolved its army with the same impersonal efficiency with which it had assembled it, was to go somewhere that had never heard of Varek. Somewhere without red soil and silver-leafed trees and people who built their houses the same way her village had once built them before the war came through.

She had made it as far as the coast. Two years at the coast, working boats, learning not to flinch when she slept, growing something slow and careful in herself that might, eventually, have become peace.

And then she had dreamed of the child.

Not for the first time. The child appeared in her sleep once a month on a reliable schedule, the way tides appear—pulling, present, inevitable. The boy who'd run from the doorway of a burning house, straight toward the soldiers holding the perimeter, because he didn't understand that the soldiers were the reason the house was burning. Kira had caught him. Turned him back. Pushed him toward the field with more force than precision.

She had never learned if he survived the field or what came after.

She had not asked. Asking required engaging with what she'd done, and she had not been ready to do that for many years. The army gave you a framework for not doing that: duty and orders and the understanding that individual reckonings were a luxury of peacetime. In war, you kept moving. In war, the moment you stopped and looked at the total of what you'd been part of, you became useless.

The army was gone. She was in peacetime. She had stopped moving.

Adrath appeared on the horizon as the morning committed itself, rising between two hills in the grey-gold light. It was smaller than she remembered, or rather she'd remembered it at war scale—a target to be contained—and now it was simply a village, rooftops and chimney smoke and the distant sound of someone splitting wood.

She stopped at the edge of the road and looked at it for a long, deliberate minute.

She did not deserve to be welcomed in this place. She was not coming to be welcomed. She was coming because the dream had made it clear, seventeen times across two years, that there was something unfinished here that she had been putting off finishing. The mechanics of what finishing meant—whether it was possible, what she would find, what she would be required to do with whatever she found—she didn't know.

She started walking again.

The first person who saw her was an elderly woman drawing water from the village well, who looked up and looked at Kira's face and became very still.

"You were here before," the woman said. Not a question.

"Yes," Kira said.

"Did you come back for something?"

"To answer for something," Kira said. "If anyone wants that."

The old woman studied her for a moment with eyes that had seen a great deal and forgotten very little. Then she set the water bucket down.

"Come in," she said. "The village will decide what it wants."

Kira Ashveil, who had walked five hundred miles and expected refusal, followed an old woman through the gate of the village she had burned and waited for the reckoning she had spent fourteen years earning.`,
        created_at: "2025-11-02T08:00:00Z",
      },
      {
        chapter_id: "torment-ch2",
        chapter_title: "The Reckoning",
        chapter_number: 2,
        content: `They put her in the empty grain store at the edge of the village, not quite a prison and not quite hospitality—a space in the threshold, which was perhaps appropriate. A woman named Dessa brought her food in the morning, set the plate inside the door, and looked at Kira with an expression that wasn't hate exactly, but was something that lived in the same neighborhood.

"You commanded the eastern company," Dessa said on the third day. Not question, statement.

"Yes."

"The fire started on the eastern side."

"Yes."

Dessa stood in the doorway for a moment. "My brother died in that fire." A pause. "He was twelve." Another pause. "He'd have been twenty-six now."

Kira held the weight of that number and did not try to put it down. "I know an apology isn't sufficient."

"No," Dessa said. "It isn't." She picked up the plate from yesterday. "The village council will hear you tomorrow morning."

The council met in the village's largest building, a long room with a stone floor and a scarred wooden table that had been there, Kira estimated, for at least a hundred years. Fifteen people gathered around it, ranging from very old to a woman who might have been in her mid-thirties. Several of them she recognized in the way you recognize the architecture of a place rather than a person—by the shape of the eyes, the particular way someone held themselves. Adrath had kept its family lines intact. That said something about its resilience.

She stood before the table and did not ask to sit.

The eldest, a man named Orren with a beard gone entirely white and hands that had worked the land for decades, spoke first. "We know who you are. We've known you would come eventually. Some of us thought you would never come. We argued about that." A pause. "Tell us why you're here."

"Because I need to understand what I left," Kira said. "I know I don't deserve that understanding. I know you owe it to me less than I owe it to you. But I—" she stopped. Found the honest version of it. "I have been living with an image of this place that belongs to the day it was burning. I need it to become real again. I need to understand what was here before, and what came after, and what the weight of my command actually cost."

Silence around the table. The woman in her mid-thirties—who had been watching Kira with an intensity that went beyond anger into something more controlled—leaned forward slightly.

"What difference would that make?" she asked. "To you. Personally. Knowing."

"None that undoes anything," Kira said. "Possibly none at all. I am not asking for relief. I am asking to face the actual thing, not the version of it I carried away in the dark."

The woman studied her for a long moment. "I'm Nila," she said finally. "I was eleven when your company came through. I survived by hiding in the root cellar of a house that then did not burn, which was chance and nothing else." A beat. "I have been angry at you specifically, by name, for twenty-three years."

"That's earned."

"Yes. It is." Nila's eyes were steady. "I want to know what orders you gave. Specifically. I want to know what you knew and what you chose."

And so Kira Ashveil, former line commander of the Eastern Company of the Varek Imperial Battalion, sat down at the scarred table in the village she had partially destroyed, and told the truth about it—all of it, the orders that came from above and the choices that were hers alone, the moments where she could have done differently and the moments where the situation was already beyond any individual decision—without softening a single detail.

It took four hours.

At the end, Orren looked at his hands on the table. "You could have stayed away," he said.

"Yes."

"Why didn't you?"

Kira thought of the child running toward the soldiers. Thought of fourteen years of coastal work and tidal peace and one persistent dream.

"Because I was tired," she said, "of only living with the version of this that let me survive it."

The room was quiet. Outside, she could hear the village beginning its midday—the ordinary sounds of people living where they had rebuilt.

Orren looked up. "We'll discuss this. You'll wait."

Kira waited. She was good at waiting. It was almost the only thing the army had taught her that she was glad to have learned.`,
        created_at: "2025-11-09T08:00:00Z",
      },
      {
        chapter_id: "torment-ch3",
        chapter_title: "Location",
        chapter_number: 3,
        content: `The council's decision was not forgiving and it was not condemnatory. It was, in its way, something stranger and more difficult: it was practical.

"You have skills," Orren said the following morning. "The eastern fields still need drainage work that we don't have enough hands to complete before the winter floods. The mill roof needs reinforcement. Marit's children are two years behind in their lessons because she died last spring and there's been no one to teach." He listed these facts without particular weight, as if they were simply situations and she were simply a resource. "You would stay a season. You would work. At the end of the season, the council would meet again."

"And then?" she asked.

"And then we'd see."

Kira stayed.

The first weeks were the hardest, and not for the reasons she'd anticipated. She had expected rejection, visible anger, the particular hostility of people who had every reason to want her gone. What she got instead was something her army training had not prepared her for at all: the ordinary negotiations of proximity.

People were not uniformly good or uniformly terrible about her presence. Some avoided her. Some watched her with the careful steadiness of people who had decided to observe before deciding. Dessa never warmed, but spoke to her with a curtness that was at least consistent and direct. Nila—the woman from the council, whom Kira found herself working alongside most often because Nila managed the field drainage work—argued with her twice in the first week about methodology, fiercely and specifically, and then accepted Kira's alternative approach with a professional terseness that was almost, almost collegial.

The children were the most honest. The younger ones treated her with ordinary curiosity—was she a soldier, did she have a sword, why was her cloak so plain—and accepted her explanations at face value, which was its own particular quality of mercy. Marit's two children, Cam and Sele, were ten and eight and had been left half-educated and wholly bereaved, and they sat across from her in the empty grain store every afternoon and worked through letters and numbers and the history of the three kingdoms with the concentrated focus of children who had learned early that effort was a form of control.

Cam, the older one, asked her one afternoon: "Did you hurt people?"

"Yes," Kira said.

"Why?"

"Because I was told to. And because I thought I understood the reasons. And because I was wrong about what I understood." She looked at him. "Those are all true at the same time."

He thought about this for a while. "That's complicated."

"Yes."

"My mum said complicated things are the true ones," he said. "Because simple things are usually just the surface."

Kira looked at this ten-year-old, who had lost his mother and was, nonetheless, getting the complicated things right.

"Your mother was a wise woman," she said.

He nodded. "She was." Then: "Are you going to stay?"

"I don't know yet."

"Nila says she doesn't trust you."

"That's fair."

"But she says you're a hard worker. She said that's worth something."

"That's also fair."

The winter came in slow and then all at once, as it always did. The drainage held. The mill roof held. Kira had miscalculated twice in the construction and corrected twice, and the corrections were folded without commentary into the record of completed work, which was itself a form of accommodation she hadn't earned and didn't fully understand.

On the last night of the season, Orren found her sitting at the edge of the eastern field, watching the first stars appear.

"The council met," he said, and sat down nearby.

"And?"

"Not forgiveness." He said it plainly. "We discussed it at length and the consensus is that it isn't ours to give entirely, and perhaps not yours to receive—some of what happened is larger than one person's account and one village's reckoning, and will require more than this season to address." He paused. "Three people voted for you to leave. Eight voted for you to remain. Four are still undecided."

The math wasn't a majority. But it wasn't a rejection.

"What does remaining mean?" she asked.

"That's decided case by case. This season, it meant drainage and a roof and children who can read again." He looked at her sideways. "Next season would be decided at the beginning of next season. These things are determined incrementally."

Kira looked at the stars appearing one by one in the cold, clear sky above Adrath—above the village she had burned and that had rebuilt itself and was, with great difficulty and no guarantee of outcome, in the process of determining what she was allowed to become in relation to it.

"What is it you actually want?" Orren asked. "Not what you think you should want. What do you want?"

Kira thought about the coast. About the tidal quiet. About the persistent dream.

"To stop existing in the moment just before I came here," she said. "To have it be something I have passed through, not something I am still inside."

Orren was quiet for a moment. "That's not forgiveness you're looking for," he said. "That's location. You want to know where you are."

"Yes."

He stood, slowly, the way old people stand who have worked hard for many decades. "Then stay. This is a particular location. It will be uncomfortable. Nila will argue with you. The winters are long and the work is real and no one will make it easy." He looked at the stars. "But it is a real place. And you are in it."

He walked back toward the village, leaving her at the edge of the eastern field under the cold sky, in the village that she had walked toward for five hundred miles, arriving at last—not at absolution, which wasn't on offer and perhaps never could be, but at something smaller and harder and, in the particular way of true things, enough.

The field was quiet. The village was lit. The stars were where they always were.

Kira Ashveil exhaled, and let the moment be where she was.`,
        created_at: "2025-11-16T08:00:00Z",
      },
    ],
  },
};
