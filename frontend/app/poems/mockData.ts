export interface Poem {
  id: string;
  title: string;
  cover_image: string;
  author: {
    id: string;
    name: string;
    profile_image: string;
  };
  genre: string;
  tags: string[];
  content: string;
  likes: number;
  comments: number;
  views: number;
  bookmarks: number;
  created_at: string;
}

export const mockPoems: Record<string, Poem> = {
  "1": {
    id: "1",
    title: "Whispers in the Garden",
    cover_image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=700&fit=crop",
    author: {
      id: "poet-1",
      name: "Emma Rothschild",
      profile_image: "https://images.unsplash.com/photo-1517849845537-1d51a20414de?w=150&h=150&fit=crop",
    },
    genre: "Nature Poetry",
    tags: ["nature", "contemplation", "garden", "spring"],
    content: `Among the roses and the morning dew,
I find the words that whisper soft and true,
The garden speaks in colors, song, and scent,
Of all the moments loved and gently spent.

The petals fall like letters nature writes,
In gentle arcs through golden morning lights,
Each bloom a story of the earth's own heart,
A masterpiece, a perfectly crafted art.

The butterflies dance between the flowers,
As time dissolves within these sacred hours,
No worry finds me in this verdant place,
No shadow clouds the sunshine on my face.

Here in the garden where the wild things grow,
Where roots run deep and all the answers flow,
I learn again what truly sets us free—
The gentle grace of being, just to be.

For in each petal, every leaf, each vine,
Lives proof that life itself is so divine,
That stopping still to witness, breathe, and see,
Is all the wisdom we will ever need.

So let me linger where the flowers bloom,
Where earth and sky dissolve the weight of gloom,
And in this garden, timeless and serene,
I'll find my home within the spaces between.`,
    likes: 2843,
    comments: 156,
    views: 12450,
    bookmarks: 1247,
    created_at: "2025-08-14T09:00:00Z",
  },

  "2": {
    id: "2",
    title: "Neon Dreams",
    cover_image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&h=700&fit=crop",
    author: {
      id: "poet-2",
      name: "Marcus Wright",
      profile_image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    },
    genre: "Urban Poetry",
    tags: ["city", "night", "lights", "modern"],
    content: `The city breathes neon into the night,
A thousand signs burning with electric light,
The streets alive with motion, sound, and soul,
A beautiful chaos we cannot control.

Glass towers reach toward a moonless sky,
A million windows where dreams don't die,
Reflections dancing on the pavement clean,
A world more real than real has ever seen.

The midnight crowds flowing like rivers of desire,
Each face a story burning with inner fire,
Connected by distance, alone together still,
Moving through the night at their own will.

In coffee shops and bars and neon-lit rooms,
Where strangers became friends within the glooms,
We search for meaning in these electric streets,
Where human hearts and digital worlds meet.

The city never sleeps, she never rests,
Always reaching, always challenging our best,
And those of us who choose to call her home,
Find that we're never truly, ever alone.

So let the neon paint the darkness bright,
Let the city pulse through endless night,
For in this urban jungle we find grace,
In the glow of this familiar, vibrant place.`,
    likes: 1924,
    comments: 203,
    views: 9876,
    bookmarks: 832,
    created_at: "2025-09-22T20:00:00Z",
  },

  "3": {
    id: "3",
    title: "The Space Between",
    cover_image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=700&fit=crop",
    author: {
      id: "poet-3",
      name: "Sophia Lindberg",
      profile_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    },
    genre: "Contemporary Poetry",
    tags: ["love", "loss", "space", "distance"],
    content: `There is a space between the words we speak,
A silence where our truest feelings leak,
Across the distance of a thousand miles,
Through tears and fears and weary, broken smiles.

You are not here, yet everywhere I go,
I feel your absence like a heavy snow,
Falling soft but constant, cold and deep,
Stealing into every dream of sleep.

But in this space, this vast and aching void,
Something beautiful cannot be destroyed,
The love that ties us though we're far apart,
Still beating like a rhythm in my heart.

We are the space between the earth and sky,
The reason that we laugh and sometimes cry,
The distance makes the moment when we meet,
So precious and so infinitely sweet.

So let us cherish this vast stretch of time,
This separation that somehow feels sublime,
For souls that journey through the space between,
Understand a love most true and seen.

When finally the distance falls away,
And you are here, no longer far away,
We'll understand that what we have is rare—
A love that thrived across the empty air.`,
    likes: 3156,
    comments: 289,
    views: 15230,
    bookmarks: 1543,
    created_at: "2025-10-05T17:30:00Z",
  },

  "4": {
    id: "4",
    title: "Midnight Reflection",
    cover_image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=700&fit=crop",
    author: {
      id: "poet-4",
      name: "David Chen",
      profile_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    },
    genre: "Philosophical Poetry",
    tags: ["time", "self", "reflection", "midnight"],
    content: `At midnight when the world has come to rest,
I meet myself without a borrowed vest,
No mask, no pretense dimming inner light,
Just truth and time and silence of the night.

Who am I when no one's watching close?
What essence lies beneath my social pose?
Do I know myself at all, or do I spend,
My life pretending until the bitter end?

The reflection stares back from the glass,
A stranger in a familiar looking class,
How many versions of myself exist?
How many truths have I persistently missed?

But maybe that's the beauty of it all,
The constant growth, the endless rise and fall,
We are not fixed, not final, not complete,
With every dawn comes chance to start anew, replete.

So in the midnight stillness I embrace,
Both who I am and still might be in this place,
The journey matters more than destination's call,
The becoming more important than it all.

And when the morning breaks and day arrives,
I step into the world with deeper eyes,
A little wiser from the night I've spent,
Reflecting on the truth that was always meant.`,
    likes: 2567,
    comments: 198,
    views: 11340,
    bookmarks: 976,
    created_at: "2025-07-18T22:00:00Z",
  },
};
