from django.core.management.base import BaseCommand
from stories.models import Genre


GENRES = [
    # Story genres
    {"name": "Fantasy", "type": "story"},
    {"name": "Science Fiction", "type": "story"},
    {"name": "Romance", "type": "story"},
    {"name": "Mystery", "type": "story"},
    {"name": "Thriller", "type": "story"},
    {"name": "Horror", "type": "story"},
    {"name": "Historical Fiction", "type": "story"},
    {"name": "Contemporary Fiction", "type": "story"},
    {"name": "Drama", "type": "story"},
    {"name": "Comedy", "type": "story"},
    {"name": "Adventure", "type": "story"},
    {"name": "Action", "type": "story"},
    {"name": "Crime", "type": "story"},
    {"name": "Psychological", "type": "story"},
    {"name": "Dystopian", "type": "story"},
    {"name": "Cyberpunk", "type": "story"},
    {"name": "Steampunk", "type": "story"},
    {"name": "Space Opera", "type": "story"},
    {"name": "Time Travel", "type": "story"},
    {"name": "Post-Apocalyptic", "type": "story"},
    {"name": "Epic Fantasy", "type": "story"},
    {"name": "Urban Fantasy", "type": "story"},
    {"name": "Dark Fantasy", "type": "story"},
    {"name": "Magical Realism", "type": "story"},
    {"name": "Fairytale", "type": "story"},
    {"name": "Paranormal Romance", "type": "story"},
    {"name": "Romantic Comedy", "type": "story"},
    {"name": "Young Adult", "type": "story"},
    {"name": "New Adult", "type": "story"},
    {"name": "Slice of Life", "type": "story"},
    {"name": "Coming of Age", "type": "story"},
    {"name": "School Life", "type": "story"},
    {"name": "Literary Fiction", "type": "story"},
    {"name": "Satire", "type": "story"},
    {"name": "Philosophical Fiction", "type": "story"},
    {"name": "Isekai", "type": "story"},
    {"name": "LitRPG", "type": "story"},
    {"name": "Progression Fantasy", "type": "story"},
    {"name": "Cultivation", "type": "story"},
    {"name": "System", "type": "story"},
    {"name": "Dungeon", "type": "story"},

    # Poem genres
    {"name": "Haiku", "type": "poem"},
    {"name": "Free Verse", "type": "poem"},
    {"name": "Sonnet", "type": "poem"},
    {"name": "Narrative", "type": "poem"},
    {"name": "Lyrical", "type": "poem"},
    {"name": "Experimental", "type": "poem"},
    {"name": "Epic", "type": "poem"},
    {"name": "Ballad", "type": "poem"},
    {"name": "Ode", "type": "poem"},
    {"name": "Elegy", "type": "poem"},
    {"name": "Pastoral", "type": "poem"},
    {"name": "Acrostic", "type": "poem"},
    {"name": "Cinquain", "type": "poem"},
    {"name": "Villanelle", "type": "poem"},
    {"name": "Sestina", "type": "poem"},
    {"name": "Ghazal", "type": "poem"},
    {"name": "Tanka", "type": "poem"},
    {"name": "Prose Poem", "type": "poem"},
    {"name": "Concrete", "type": "poem"},
    {"name": "Dramatic Monologue", "type": "poem"},
    {"name": "Found Poetry", "type": "poem"},
    {"name": "Visual Poetry", "type": "poem"},
    {"name": "Narrative Epic", "type": "poem"},
    {"name": "Historical Poem", "type": "poem"},
    {"name": "Mythological Poem", "type": "poem"},
    {"name": "Romantic Poem", "type": "poem"},
    {"name": "Political Poem", "type": "poem"},
]


class Command(BaseCommand):
    help = "Seed the database with default genres for stories and poems."

    def handle(self, *args, **options):
        created_count = 0
        for entry in GENRES:
            _, created = Genre.objects.get_or_create(
                name=entry["name"],
                defaults={"type": entry["type"]},
            )
            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Done. {created_count} new genre(s) created, "
                f"{len(GENRES) - created_count} already existed."
            )
        )
