from django.core.management.base import BaseCommand
from django.db import connection, transaction

from stories.models import Chapter, Story, StoryStatus


class Command(BaseCommand):
    help = "Create Chapter 1 for published stories that still have legacy story content."

    def handle(self, *args, **options):
        table = connection.ops.quote_name(Story._meta.db_table)
        cursor = connection.cursor()
        columns = {column.name for column in connection.introspection.get_table_description(cursor, Story._meta.db_table)}
        if "content" not in columns:
            self.stdout.write(self.style.WARNING("No legacy Story.content column exists; no chapter content is available to backfill."))
            return

        quote = connection.ops.quote_name
        cursor.execute(
            f"SELECT {quote('id')}, {quote('title')}, {quote('content')} FROM {table} WHERE {quote('status')} = %s",
            [StoryStatus.PUBLISHED],
        )
        stories = cursor.fetchall()
        created = 0
        skipped = 0
        for story_id, title, content in stories:
            if not content or not content.strip():
                skipped += 1
                continue
            with transaction.atomic():
                story = Story.objects.select_for_update().filter(pk=story_id, status=StoryStatus.PUBLISHED).first()
                if story is None or story.chapters.exists():
                    skipped += 1
                    continue
                Chapter.objects.create(
                    story=story,
                    title=title,
                    chapter_number=1,
                    order=1,
                    content=content,
                )
                Story.objects.filter(pk=story.pk).update(chapter_count=1)
                created += 1

        self.stdout.write(self.style.SUCCESS(f"Created Chapter 1 for {created} stories; skipped {skipped}."))