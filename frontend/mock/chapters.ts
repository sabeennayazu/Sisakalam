export interface Chapter {
  id: string;
  story_id: number;
  chapter_number: number;
  title: string;
  slug: string;
  content: string;
  next_chapter: string | null;
  previous_chapter: string | null;
  created_at: string;
}

const longContent = `In the beginning, there was nothing but silence. The world existed in a state of perfect equilibrium, untouched by the chaos of creation. Mountains stood as eternal sentinels, their peaks piercing the clouds. Rivers flowed with purposeful grace, carving paths through ancient stone. And in the deepest forests, where sunlight barely penetrated, life flourished in ways that defied imagination.

The people of this realm lived in harmony with nature, understanding the delicate balance that sustained all living things. They built cities not to conquer the land, but to coexist with it. Every structure was designed to honor the natural world, incorporating stone and wood and water in ways that seemed almost organic.

But nothing lasts forever. Change is the only constant in this world, and it came swiftly and without mercy. First, the weather patterns shifted. Seasons became unpredictable. Summer heat scorched the earth, while winters brought such bitter cold that entire villages froze in their homes. Then came the tremors. The earth itself began to shake, as if something ancient was stirring in the depths below.

Scientists and scholars debated the cause. Some theorized that the sun was dying, its light slowly fading from the universe. Others claimed that the planet was shifting its axis, causing catastrophic climate change. A few whispered about ancient curses, dark magic woven into the very fabric of reality by enemies long dead.

Regardless of the cause, the effect was undeniable. Crops failed. Livestock perished. Water sources dried up or became poisoned. Entire regions that had sustained civilizations for millennia became wastelands. Refugees fled to the cities, overwhelming infrastructure already strained by the crises. Disease spread like wildfire through dense populations living in squalor.

Within years, the world had transformed from a place of plenty into a realm of scarcity. Governments collapsed. Order broke down. Tribes and clans began to fight over the remaining resources. The knowledge and wisdom accumulated over countless generations seemed worthless when faced with the prospect of starvation.

It was in this dark time that the heroes arose. Not from privilege or privilege, but from necessity. They were ordinary people who found within themselves extraordinary courage. They learned forgotten skills. They united fractured communities. They began to search for solutions, no matter how impossible they seemed.

And so begins the tale of heroes and kingdoms, of magic and sacrifice, of hope burning bright against the approaching darkness. What they would discover would change everything they thought they knew about the world and their place in it.`;

const contentBlock1 = `The marketplace was bustling with activity, merchants hawking their wares to passing crowds. Despite the growing scarcity, some goods still found their way to the larger cities through careful trade networks. A young woman with sharp eyes moved through the crowd, taking in every detail, every weakness in the market's security.

Her name was Lyra, and she was on a mission. The artifacts she sought weren't valuable for their monetary worth—they were valuable because they contained knowledge. Ancient knowledge. Knowledge that might explain what was happening to their world.

She stopped at a vendor's stall, examining a collection of old books. Most were worthless, their pages yellowed and brittle. But one caught her eye. Its cover was worn leather, marked with symbols she recognized from old stories her grandmother had told her. The vendor, a wizened old man with knowing eyes, watched her with interest.

"You have good taste," he said quietly. "Not many people can identify the truly valuable items anymore."

Lyra picked up the book carefully. "What's your asking price?"

"For you? A favor. In exchange for this book, I need you to deliver a message to someone in the northern quarter. Someone who should not be found through normal channels."

She hesitated. This was the kind of request that could lead to trouble. But she needed that book. "Who?"

"The Scholar. You'll know which house when you see it. There's a symbol above the door—three interlocking circles."

Without fully understanding what she was agreeing to, Lyra exchanged coin for the book and accepted the sealed letter. She left the marketplace with a sense of urgency, feeling as though she had become entangled in something far larger than herself.`;

const contentBlock2 = `The sun was setting as Lyra made her way through the narrow streets of the northern quarter. The buildings here were older, their stones worn by countless years of weathering. Few people ventured into this area anymore—it was considered a place where the past lingered too heavily.

She found the symbol above a weathered wooden door. The three interlocking circles were carved deep into the stone, as if someone had taken great effort to ensure they would not fade. Taking a breath, she knocked softly.

For a long moment, nothing happened. Then the door swung open, revealing a tall figure silhouetted against candlelight. The Scholar stepped aside without a word, gesturing for her to enter quickly.

Inside, the house seemed to exist in another time. Books lined every wall, their spines creating a rainbow of colors and ages. The air smelled of old paper and knowledge. The Scholar closed the door behind her and turned to examine his visitor.

"The vendor sent you?" he asked simply.

"He gave me a message to deliver." Lyra held out the sealed letter.

The Scholar took it and broke the wax seal. As he read, his expression grew more serious. When he finished, he looked at Lyra with an intensity that made her straighten her spine.

"You're more than just a messenger. The fact that you found your way here at all speaks volumes. Few people possess the combination of intelligence and instinct it takes to navigate these times." He gestured to the books. "What do you know of our world's history?"

"Only what everyone knows. That we had a great civilization once. That we knew more. That something was lost."

"Precisely. But not everything was lost. Some knowledge has been preserved, hidden away by those who understood that the world would need it again." He moved to a desk covered in scrolls and ancient texts. "What is your name?"

"Lyra."

"Lyra, I believe you're here because there are powers at work that require someone like you. Someone willing to seek truth and act on it. We don't have much time. Events are accelerating. The darkness is closer than most people realize."`;

// ─── My Fake Boyfriend — Story 1 ───────────────────────────────────────────

const mfbChapter1Content = `Aria Blake's plan was simple: show up to her ex-boyfriend's engagement party with a date hot enough to make him regret every single decision he had ever made. The simplest plans, however, always had a fatal flaw—hers being that she had approximately zero eligible men in her contact list willing to attend a romantic event with her on forty-eight hours' notice.

She stood in the middle of the crowded campus library, phone pressed to her ear, watching the 4 p.m. sunlight slice through the tall arched windows and illuminate the anxious expression on her own face in the glass. Around her, students buried themselves in textbooks and laptops, unbothered by the quiet crisis unfolding in the periodicals section.

"No, I'm not joking," she whispered furiously to her roommate, Priya. "The invitation literally arrived yesterday. Jake is getting engaged. To Mia. Who I introduced him to. At my birthday dinner."

"That's genuinely diabolical," Priya said cheerfully. "Also, this is why you should have moved on six months ago."

"I did move on. I just—I want to look like I moved on spectacularly."

"Aria, spectacularly moving on takes months of therapy and a very good haircut. You have forty-eight hours and a library card."

Aria Hung up. Or rather, she lowered the phone and stared at it like it had personally offended her. That was when she walked backward directly into a stack of returned books that someone had balanced far too optimistically on the edge of a cart, and sent them cascading to the floor in a thunderous avalanche.

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

She was going to absolutely nail this.`;

const mfbChapter2Content = `The dress was emerald green, because Aria had read somewhere that wearing green to a party made people remember you, and she desperately needed Jake Henderson to remember that she existed as something other than "girl I dated before getting engaged to someone better."

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

Then typed: Fine. He was fine. And sent that instead.`;

const mfbChapter3Content = `The Cole family home was old money made tangible—a large property on the northern edge of the city with carefully tended grounds and a kind of quiet that felt deliberately maintained, like a held breath in a beautiful room. Ethan picked Aria up at six, and for the length of the drive neither of them mentioned what they were walking into.

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

And in the particular, improbable way of things that start as one story and become another entirely, that was where the real one began.`;

// ─── Torment — Story 3 ─────────────────────────────────────────────────────

const tormentChapter1Content = `The road back to Adrath was unpaved and unforgiving, and Kira Ashveil had walked it once before going in the opposite direction, though she'd ridden a warhorse then, armored and ordered, and the village had been burning behind her.

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

Kira Ashveil, who had walked five hundred miles and expected refusal, followed an old woman through the gate of the village she had burned and waited for the reckoning she had spent fourteen years earning.`;

const tormentChapter2Content = `They put her in the empty grain store at the edge of the village, not quite a prison and not quite hospitality—a space in the threshold, which was perhaps appropriate. A woman named Dessa brought her food in the morning, set the plate inside the door, and looked at Kira with an expression that wasn't hate exactly, but was something that lived in the same neighborhood.

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

Kira waited. She was good at waiting. It was almost the only thing the army had taught her that she was glad to have learned.`;

const tormentChapter3Content = `The council's decision was not forgiving and it was not condemnatory. It was, in its way, something stranger and more difficult: it was practical.

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

Kira Ashveil exhaled, and let the moment be where she was.`;

const tormentChapter4Content = `lorem ipsum`;

export const chapters: Chapter[] = [
  // ─── My Fake Boyfriend — Story 1 ────────────────────────────────────────
  {
    id: "mfb-ch1",
    story_id: 1,
    chapter_number: 1,
    title: "The Arrangement",
    slug: "the-arrangement",
    content: mfbChapter1Content,
    next_chapter: "the-party",
    previous_chapter: null,
    created_at: "2025-09-10",
  },
  {
    id: "mfb-ch2",
    story_id: 1,
    chapter_number: 2,
    title: "The Party",
    slug: "the-party",
    content: mfbChapter2Content,
    next_chapter: "what-happens-now",
    previous_chapter: "the-arrangement",
    created_at: "2025-09-17",
  },
  {
    id: "mfb-ch3",
    story_id: 1,
    chapter_number: 3,
    title: "What Happens Now",
    slug: "what-happens-now",
    content: mfbChapter3Content,
    next_chapter: null,
    previous_chapter: "the-party",
    created_at: "2025-09-24",
  },

  // ─── Torment — Story 3 ──────────────────────────────────────────────────
  {
    id: "torment-ch1",
    story_id: 3,
    chapter_number: 1,
    title: "The Road Back",
    slug: "the-road-back",
    content: tormentChapter1Content,
    next_chapter: "the-reckoning",
    previous_chapter: null,
    created_at: "2025-11-02",
  },
  {
    id: "torment-ch2",
    story_id: 3,
    chapter_number: 2,
    title: "The Reckoning",
    slug: "the-reckoning",
    content: tormentChapter2Content,
    next_chapter: "location",
    previous_chapter: "the-road-back",
    created_at: "2025-11-09",
  },
  {
    id: "torment-ch3",
    story_id: 3,
    chapter_number: 3,
    title: "Location",
    slug: "location",
    content: tormentChapter3Content,
    next_chapter: null,
    previous_chapter: "the-reckoning",
    created_at: "2025-11-16",
  },

  // ─── The Beginning of the End — Story 5 ─────────────────────────────────
  {
    id: "ch1",
    story_id: 5,
    chapter_number: 1,
    title: "The Changing World",
    slug: "the-changing-world",
    content: longContent,
    next_chapter: "lyra-and-the-marketplace",
    previous_chapter: null,
    created_at: "2024-01-01",
  },
  {
    id: "ch2",
    story_id: 5,
    chapter_number: 2,
    title: "Lyra and the Marketplace",
    slug: "lyra-and-the-marketplace",
    content: contentBlock1,
    next_chapter: "the-scholar",
    previous_chapter: "the-changing-world",
    created_at: "2024-01-02",
  },
  {
    id: "ch3",
    story_id: 5,
    chapter_number: 3,
    title: "The Scholar",
    slug: "the-scholar",
    content: contentBlock2,
    next_chapter: "secrets-revealed",
    previous_chapter: "lyra-and-the-marketplace",
    created_at: "2024-01-03",
  },
  {
    id: "ch4",
    story_id: 5,
    chapter_number: 4,
    title: "Secrets Revealed",
    slug: "secrets-revealed",
    content: `The Scholar led Lyra deeper into the house, descending a stone staircase that spiraled downward into darkness. The walls were cool and damp, and the air grew thicker as they descended. At the bottom was a chamber that took Lyra's breath away.

The entire room was filled with artifacts. Weapons of unknown design hung on racks. Crystals of impossible colors glowed with inner light. On pedestals, objects of obvious power rested under careful guard. And on the walls, murals depicted a civilization far more advanced than any Lyra had ever imagined.

"This is what remains of the old world," the Scholar said quietly. "A time when our ancestors understood forces that we have forgotten. When they could harness the power of the stars themselves."

Lyra moved slowly through the chamber, taking in every detail. She stopped before a mural showing a brilliant sun dominating the sky, with people below standing with their hands raised, as if in reverence or greeting.

"The sun is dying," she whispered.

"Yes. And it has died before. This civilization you see here, they understood the cycles. They knew that eventually, the sun would fade. They built protections, safeguards to ensure that when this time came again, there would be those prepared to face it."

"But something went wrong. The knowledge was lost."

"Not lost. Hidden. Some called it the Sealing. The greatest minds of that age stored their knowledge in ways that could only be accessed by those with the right combination of intelligence, courage, and purpose. They believed that knowledge without the right person to wield it would only lead to destruction."

The Scholar approached one of the crystals, a perfect sphere of deep blue light. "You've been chosen, Lyra. Not by me, but by the world itself. The events that brought you to my door today were not coincidence. They were alignment. The pieces moving into position for what comes next."

"I don't understand," Lyra said, though somewhere deep inside her, she feared that she was beginning to.

"You will. But first, you must survive what comes next. An army marches from the east, led by those who would use ancient power for their own ends. They know about this place. They know about the artifacts. And they will stop at nothing to claim them."

Lyra turned to face the Scholar, her fear transforming into determination. "Then we don't have much time. What do you need me to do?"`,
    next_chapter: "the-great-journey-begins",
    previous_chapter: "the-scholar",
    created_at: "2024-01-04",
  },
  {
    id: "ch5",
    story_id: 5,
    chapter_number: 5,
    title: "The Great Journey Begins",
    slug: "the-great-journey-begins",
    content: `With the scholar's warnings echoing in her mind, Lyra prepared for a journey that would take her across kingdoms and mountains, through forests untamed and cities fallen. The scholar provided her with maps, ancient texts, and a crystal that would respond to her touch—proof to any who questioned her authority that she was on a sanctioned mission.

But most importantly, he gave her knowledge. Hours spent studying the old texts, learning the language of the ancients, understanding the principles that governed the artifacts and the power they contained. By the time she was ready to leave, Lyra felt transformed. She was no longer just a young woman seeking answers; she was a guardian of secrets, a keeper of hope.

The first stage of her journey took her north, toward the mountains. The mountain pass was treacherous, with slopes that could crumble without warning and peaks that touched the clouds. But Lyra had been given a guide, an old wanderer who had traveled these paths for decades.

"The world is changing faster than you realize," the guide told her as they climbed. "I've seen things in these mountains that shouldn't exist. Creatures of legend appearing in the real world. Magic flickering in the air like heat shimmer. It's as if the boundaries between the known and unknown are breaking down."

Lyra listened intently, storing every observation, every piece of information. By the time they reached the far side of the mountains, she understood that her journey was far from over. In fact, it was only beginning.

When she descended from the mountains, she found herself in a completely different world. Here, the scarcity that plagued the western kingdoms had less impact. The land was fertile and green, with rivers full of clear water. But it was also more heavily guarded, with armed patrols and fortified settlements.

This was the territory of the Eastern Empire, ruled by a council of warlords who had no love for the western kingdoms. And according to the scholar's warnings, this was where the army that threatened his sanctuary would originate.

Lyra needed to move carefully. She used the authority granted by her crystal to gain passage, claiming to be on a fact-finding mission for the council. It was risky, but it worked. As she traveled deeper into the empire, she began to understand the true scope of the threat.

The army was already being assembled. Thousands of soldiers trained and equipped with advanced technology—some of it clearly salvaged from the old world. They were moving west, following a path that would lead them directly to the scholar's sanctuary within weeks.

She had to act fast. But what could one woman do against an army? Lyra stopped to think, to plan, to consider the pieces of this great game being played across kingdoms and centuries.

And then she remembered what the Scholar had said: You have been chosen. The world itself has chosen you. This meant that somehow, against all odds, she would find a way to turn the tide of history.`,
    next_chapter: "allies-in-darkness",
    previous_chapter: "secrets-revealed",
    created_at: "2024-01-05",
  },
  {
    id: "ch6",
    story_id: 5,
    chapter_number: 6,
    title: "Allies in Darkness",
    slug: "allies-in-darkness",
    content: `Lyra realized quickly that she could not stop the army alone. She needed allies. But who would believe her story? Who would risk their lives to protect an old man and his collection of ancient artifacts?

The answer came from an unexpected direction. In a tavern in the eastern city of Krell, she met a group of rebels. They were warriors and mages, scholars and thieves, united by a common purpose: to resist the Council of Warlords and their authoritarian rule.

Their leader was a woman named Senna, with silver hair and eyes that had seen lifetimes of loss. When Lyra told her story, Senna listened carefully, and when she finished, the rebel leader nodded.

"I've heard of the Scholar. There are legends about him in the underground circles. Legends that say he guards knowledge that could change the balance of power in this world forever." Senna leaned forward. "If what you say is true, if the Council is really gathering an army to capture him, then this affects us all. An enemy powerful enough to threaten the Scholar is an enemy we need to know about."

Over the following weeks, a coalition began to form. Lyra and Senna's rebels were joined by representatives from several of the oppressed regions under the Council's control. There were former soldiers disillusioned with the empire's goals. There were scholars who understood the scientific principles behind the old world's power. Together, they formed a network of resistance.

But even with these allies, the numbers were daunting. The Council's army was nearly ten thousand strong, while their coalition could muster perhaps two thousand fighters. They would be overwhelmed in direct combat.

That's when the Scholar's knowledge became invaluable. The ancient texts contained strategies from wars fought thousands of years ago. They described the tactical use of terrain, the placement of defense mechanisms, the psychological manipulation of enemy forces.

With this knowledge and careful planning, Lyra and her allies began to set traps. They collapsed mountain passes to slow the army's advance. They poisoned supply lines and scattered herds of livestock that the soldiers depended on for food. They sent scouts to deliver false information about the Scholar's location, fragmenting the Council's army across unproductive searches.

Each action weakened the enemy without requiring direct confrontation. It was warfare reimagined for a world without overwhelming firepower, but with knowledge and cleverness as weapons.

As the army drew closer to the Scholar's sanctuary, Lyra prepared for the final confrontation. She knew that all her planning, all her clever strategies, would eventually come down to a moment of truth. A moment where she would have to choose between her life and her mission.

And in the nights before that final battle, she wondered if she was ready. If anyone ever truly could be.`,
    next_chapter: "the-final-stand",
    previous_chapter: "the-great-journey-begins",
    created_at: "2024-01-06",
  },
  {
    id: "ch7",
    story_id: 5,
    chapter_number: 7,
    title: "The Final Stand",
    slug: "the-final-stand",
    content: `The battlefield was set: the approaches to the mountain pass where the Scholar's sanctuary was hidden. Lyra's coalition of rebels had prepared meticulously, making full use of their knowledge of the terrain and the tactics described in the ancient texts.

The morning of the battle dawned gray and cold. Lyra stood on the ridge overlooking the approaching army, watching the sunrise paint the eastern sky in shades of gold and crimson. Beside her, Senna gripped her sword, and around them, warriors and mages prepared for what might be their final battle.

When the Council's army appeared on the horizon, it was even more formidable than the scouts had reported. Ten thousand warriors, disciplined and well-equipped, marching in perfect formation. As they approached the mountain pass, the first of Lyra's traps activated.

Concealed archers on the ridge scattered arrows in a pattern designed to cause maximum confusion without killing. The arrows were attached to crystals that sparked and flashed in the sunlight, creating the illusion of magical attacks.

The army's advance slowed as soldiers became confused about the nature and extent of the threat. Commanders tried to reorganize the fractured formation.

Then Senna's mages engaged, casting spells not designed to cause death, but to disorient and confuse. Illusions of phantom armies appeared on flanks. The very air seemed to shimmer with danger. Some soldiers broke ranks, convinced they were outnumbered.

But the Council's commanders were experienced. They adapted to the tactics, rallying their troops and pushing forward with disciplined determination. The battle became more desperate, more direct. Lyra had hoped to avoid large-scale bloodshed, but it became clear that would not be possible.

She drew her sword—a weapon that the Scholar had given her, forged from materials that gleamed with inner light—and joined the combat. She fought with a skill that seemed to come from somewhere beyond herself, as though the knowledge she had absorbed from the ancient texts directly guided her movements.

For hours the battle raged. Her rebels held the mountain pass, but were being gradually pushed back. The Council's army was too large, too strong. Lyra watched good soldiers fall, watched Senna take a wound across her shoulder, watched the tide of battle slowly turn against them.

And then something changed.

The crystals that Lyra carried began to glow with increasing intensity. The ancient artifact from the Scholar's sanctuary, the one she had been told to activate only if all seemed lost, resonated with her heartbeat.

The ground beneath the Council's army began to shake. Not randomly, but in a pattern, a rhythm. The ancient defenses that had been built into this mountain thousands of years ago activated, responding to the crystal's signal.

The mountain itself became a weapon. Rock formations collapsed, creating new barriers. The very air thrummed with power. The Council's army panicked, convinced that they faced powers beyond mortal ken.

Their formation broke. Their advance became a retreat. What had seemed like an inexorable force of conquest suddenly became a fleeing rabble.

Lyra watched them go, feeling the weight of what she had done. She had saved the Scholar. She had protected the knowledge that might preserve their world. But at what cost? How many had died on this mountain? And was victory purchased with innocent lives truly victory at all?

The Scholar emerged from his sanctuary as the sun reached its zenith. He looked at her with eyes that seemed far older than they had any right to be.

"The first trial is complete," he said quietly. "But this is only the beginning, Lyra. The real challenge still lies ahead. The dying sun waits for no one. And you must find a way to rekindle it before all light fades from our world forever."`,
    next_chapter: "the-path-forward",
    previous_chapter: "allies-in-darkness",
    created_at: "2024-01-07",
  },
  {
    id: "ch8",
    story_id: 5,
    chapter_number: 8,
    title: "The Path Forward",
    slug: "the-path-forward",
    content: `In the days following the battle, the mountain was transformed into a center of learning and preparation. Rebels and scholars worked together, studying the ancient texts and preparing for the next phase of their journey.

The Scholar revealed to Lyra and her allies the true nature of their challenge. Hidden in the far reaches of the world, at the edge of civilization where few dared to venture, lay an ancient facility built by the old world's greatest minds. Within that facility was the key to restarting the sun itself.

It would be a journey unlike any before it. They would need to cross deserts where water was as rare as gold, climb mountains that reached beyond the clouds, and navigate through territories held by those who would oppose them at every step.

But they would not go alone. The coalition that had formed to defend the Scholar grew stronger each day. Warriors from the eastern regions defected from the Council, convinced by Lyra's cause. Scholars from the western kingdoms brought their expertise. Mages and craftspeople joined the effort.

And Lyra, who had started her journey as a simple seeker of knowledge, found herself transformed into a leader. People looked to her for inspiration and guidance. She bore the weight of their hopes, and with each passing day, she felt it shape her into something more than she had been.

On the eve of their departure, Senna found her standing on the mountain peak, watching the stars. The older woman moved quietly, but Lyra had come to recognize her footsteps.

"Are you afraid?" Senna asked.

"Terrified," Lyra admitted. "I never asked for this. I never wanted this responsibility."

"No one ever does," Senna said. "The greatest leaders are those who never desired power, but were willing to take it when the world needed them." She placed a hand on Lyra's shoulder. "You will succeed, Lyra. Not because you are stronger or smarter than those who came before. But because you care. You care about the world, about the people in it, about preserving what is precious."

Lyra turned to face her friend. In the starlight, she could see the determination in Senna's face, the trust and respect that had grown between them through trials and hardships.

"When will we be ready?" Lyra asked.

"We will never be ready," Senna replied. "But we will be moving. And that is often enough."

As dawn broke over the mountains, Lyra and her coalition began their journey toward destiny. The sun in the sky was noticeably dimmer than it had been a year ago. Time was running out, and they all felt the urgency like a physical weight.

But they also felt something else: hope. The kind of hope that drives ordinary people to do extraordinary things. The kind of hope that transforms fate from an inexorable force into something that can be chosen, challenged, and ultimately, overcome.

And so the great adventure entered its second chapter, with new challenges awaiting and the fate of the world hanging in the balance.`,
    next_chapter: null,
    previous_chapter: "the-final-stand",
    created_at: "2024-01-08",
  },
];

// Chapters for story 7: Chronicles of the Fallen Star
export const storySevenChapters: Chapter[] = [
  {
    id: "s7ch1",
    story_id: 7,
    chapter_number: 1,
    title: "The Night Sky Changes",
    slug: "the-night-sky-changes",
    content: `For thousands of years, the night sky had been the same. Constellations that guided navigators, stars that inspired poets, and the vast expanse of darkness punctuated by points of light. Every civilization, every culture, had learned to read the heavens and find meaning in their patterns.

But on this particular night, everything changed.

A young astronomer named Marcus was observing from his tower, as he had every clear night for the past decade. His instruments—a mix of ancient telescopes and carefully calibrated modern equivalents—were trained on the northern sky, where he was tracking the movement of a particular star cluster.

The readings were wrong. First, he thought there was an malfunction in his instruments. He checked them carefully, recalibrating each lens and mirror. The numbers remained impossible.

Then he stepped back from the instruments and looked up with his naked eyes.

A star was falling.

Not gradually moving across the sky as stars do when viewed over hours. Actually falling. Descending toward the planet with visible speed. Marcus watched in absolute awe as the star—impossible, impossible—grew brighter as it approached, not dimmer as it should if it were simply moving away.

He immediately began recording his observations, his hands shaking so badly he could barely write. By the time the star had descended below the horizon, he had filled an entire journal with measurements and notes.

The star didn't crash. It landed. Somewhere on the planet's highest mountain range, it came to rest. And when it did, the entire world felt it. Not physically at first, but spiritually, as if something fundamental to the nature of reality had shifted.

News of the fallen star spread quickly. Within days, expeditions were being organized from every major city and kingdom. Some came driven by curiosity. Others believed the star was a sign from the gods. A few feared it might portend the end of the world.

Marcus found himself at the center of a maelstrom of attention. The king's court demanded he brief them on what he had seen. Scholarly institutions wanted to document his findings. Religious leaders sought his interpretation of the cosmic event.

But Marcus knew something that no one else seemed to understand: this was not a natural occurrence. This was not something that could be explained by the laws of physics that governed the universe. And if it wasn't natural, then it was intentional. Something or someone had sent that star, guided it, placed it deliberately on their world.

The question was: why?

That night, unable to sleep, Marcus found his answer. A delegation of robed figures appeared at his tower, moving with purpose and certainty. They did not announce themselves, but their authority was unmistakable.

"You have been chosen," the lead figure said, her voice carrying the weight of ages. "To be the first to understand the truth of the fallen star. To gather those who must know. And to begin the quest that will determine the fate of our world."

Marcus felt the weight of destiny settle on his shoulders, heavy and inescapable. Like Lyra before him, he had been selected for a role in a game far larger than himself.

And like Lyra, he could only step forward into the unknown, trusting that somehow, he would find the strength to face what was coming.`,
    next_chapter: "the-journey-to-the-peak",
    previous_chapter: null,
    created_at: "2024-01-02",
  },
  {
    id: "s7ch2",
    story_id: 7,
    chapter_number: 2,
    title: "The Journey to the Peak",
    slug: "the-journey-to-the-peak",
    content: `The mountain was impossibly high. Its peak touched the clouds so completely that at certain times of day, it was impossible to see where the stone ended and the sky began. And somewhere near the top, the fallen star rested.

Marcus was not an adventurer by nature. He was a scholar, more comfortable with books and instruments than with wilderness and danger. But he had been given a choice: join the expedition or be forgotten while history moved forward without him.

He chose to go.

The expedition consisted of twelve people carefully selected for their various skills. There was Elena, a mountaineer with experience climbing peaks that everyone else considered impossible. There was Karius, a mage trained in the oldest traditions of magic. There was Thea, a historian who had studied the records of when the world was young and magic was common.

And then there were others: guards, scouts, a healer, and specialists in various fields. They were a cross-section of the kingdom's resources, all gathered for this single purpose.

The climb took weeks. The mountain was treacherous, with sections that seemed to actively resist their progress. Avalanches that shouldn't have occurred. Storms that appeared from nowhere. Wildlife that seemed determined to drive them back.

But Elena pressed on with grim determination, finding routes that the mountain's natural obstacles couldn't completely block. The mage, Karius, used his magic to shield them from the worst of the weather and to heal injuries that would have been fatal in any other context.

And Marcus, the scholar, documented everything. Every rock formation. Every strange animal. Every unusual atmospheric phenomenon. If they were to understand the fallen star, first they would need to understand every aspect of its arrival.

As they climbed higher, the world below became progressively unreal. The curvature of the planet became visible. The weather patterns below seemed to swirl in ways that Marcus's scientific training suggested were impossible. And the air became thinner, making each breath a conscious effort.

Marcus found himself thinking about the robed figures who had appeared at his tower. Something about them had seemed timeless, as though they had been waiting for this moment for centuries or longer. Their knowledge of his selection, their certainty that he would be useful, suggested that they had been observing humanity for a very long time.

What did they want? What was the purpose of the fallen star? These questions drove him forward when exhaustion would have otherwise forced him to stop.

Finally, after what felt like an eternity of climbing, they reached an elevation where the air was so thin and the cold so intense that it seemed impossible for anything to exist. And there, nestled in a crater that definitely had not existed before the star fell, was the artifact.

It was not a star in any conventional sense. It was a construct of incredible complexity, built from materials that Marcus couldn't identify. Its surface was covered in patterns and symbols that seemed to shift and change when looked at directly. And it glowed with a soft light that seemed to contain all colors of the visible spectrum simultaneously.

"It's beautiful," Thea whispered. "It's like the descriptions in the Old Records. Like the great works of power that existed in the ancient days."

Karius approached the artifact carefully, extending his hand but not quite touching it. "There's magic here. Ancient magic. Magic that was old when the oldest of the old records were written."

Elena remained alert, watching the surroundings carefully. "Whatever that thing is, we're not alone with it. There are others coming. Armies, from the look of it. The fallen star's location probably became public knowledge immediately."

Indeed, looking down the mountain, Marcus could see columns of armed figures ascending from different directions. Multiple expeditions, each representing different factions, all seeking to claim or control the artifact.

"We need a plan," Marcus said, his analytical mind already working through possibilities.

"The artifact is calling to us," Thea said, her eyes fixed on the glowing construct. "Can't you feel it? There's a reason we were chosen to arrive first. There's a reason the robed figures guided you here. We're meant to interact with it. To unlock whatever secrets it holds."

"And quickly," Elena added, "before we're surrounded by people who will shoot first and ask questions later."

With no better option, the expedition made its way down to the crater. Marcus approached the artifact directly, feeling drawn to it in a way he couldn't rationally explain. And when his hand touched its surface, the world exploded into light and knowledge and impossibility.

He saw visions of a civilization so advanced it seemed like magic. He saw the mechanisms that had created the fallen star. He saw why it had been sent, and what it would take to prevent the catastrophe that was approaching.

And when the visions released him, he fell to his knees with knowledge that would change everything.`,
    next_chapter: "the-revelation",
    previous_chapter: "the-night-sky-changes",
    created_at: "2024-01-03",
  },
  {
    id: "s7ch3",
    story_id: 7,
    chapter_number: 3,
    title: "The Revelation",
    slug: "the-revelation",
    content: `Marcus remained unconscious for three days. During that time, the expeditions from various kingdoms and factions reached the peak. There was tension, standoffs, negotiations that barely prevented open warfare.

Elena's skills as a negotiator—and her willingness to threaten violence—held their group together and protected Marcus while he recovered.

When he finally woke, Marcus's entire worldview had been restructured. The visions from the artifact had shown him truth on a scale he had never imagined. The universe was far older and far stranger than any of the scientific or historical records suggested.

"We need to get down the mountain," he told Elena and the others. "That artifact... it's not a warning. It's a message. And the message is that we're running out of time."

"Running out of time for what?" Karius asked.

"For everything. The artifact was sent by our ancestors. Not our great-great-grandparents, but our ancestors from thousands of years ago. Civilizations that rose and fell long before recorded history. They discovered something. Something about the universe itself. Something that threatened all life, and they hid knowledge to help us survive when the threat returned."

"For everything. The artifact was sent by our ancestors. Civilizations that rose and fell long before recorded history. They discovered something. Something about the universe itself. Something that threatened all life, and they hid knowledge to help us survive when the threat returned."

Thea leaned forward intently. "What kind of threat?"

"The kind that destroys worlds. There's a cycle, apparently. Every few thousand years, something catastrophic happens on a cosmic scale. The ancestors built the fallen star as a beacon. A way to tell us when the cycle begins again. A way to guide us to the knowledge we need to survive."

"And when does the cycle begin?" Elena asked urgently.

"Soon. Very soon. According to the visions, we have months. Maybe a year if we're lucky. And in that time, we need to gather all the scattered knowledge that was left hidden across the world. We need to understand the science behind it. And we need to prepare for something that will test humanity in ways we can barely imagine."

The journey down the mountain was chaotic. The various factions had learned about the nature of the fallen star through their own contact with it. Some wanted to possess it. Others wanted to destroy it. A few understood what Marcus understood: that the artifact was neither a weapon nor a treasure, but a gift of the deepest kind—a gift of survival.

Marcus and his core group managed to escape with something even more valuable than the artifact itself: a stone tablet that had been within the crater, inscribed with coordinates. Coordinates to other locations where knowledge had been hidden. Caches of information from the ancient civilization, scattered across the world for those worthy of finding them.

As they made their way back to civilization, Marcus began to understand what his role would be. Like Lyra in the west, he was being shaped into a leader who would guide and coordinate those who sought to preserve the world.

The question was: would the knowledge they gathered be enough? And would they have time to prepare?

The fallen star continued to glow in the night sky, a constant reminder of the deadline ticking away.`,
    next_chapter: null,
    previous_chapter: "the-journey-to-the-peak",
    created_at: "2024-01-04",
  },
];
