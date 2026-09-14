from django.db import migrations, models
from django.utils.text import slugify


def populate_chapter_slugs(apps, schema_editor):
    Chapter = apps.get_model("stories", "Chapter")
    for chapter in Chapter.objects.order_by("story_id", "order", "id"):
        base_slug = slugify(chapter.title) or f"chapter-{chapter.chapter_number}"
        candidate = base_slug
        suffix = 2
        while Chapter.objects.filter(story_id=chapter.story_id, slug=candidate).exclude(pk=chapter.pk).exists():
            candidate = f"{base_slug}-{suffix}"
            suffix += 1
        chapter.slug = candidate
        chapter.save(update_fields=["slug"])


class Migration(migrations.Migration):
    dependencies = [("stories", "0004_remove_story_content_story_chapter_count_and_more")]

    operations = [
        migrations.AddField(
            model_name="chapter",
            name="slug",
            field=models.SlugField(max_length=220, default=""),
        ),
        migrations.RunPython(populate_chapter_slugs, migrations.RunPython.noop),
        migrations.AddConstraint(
            model_name="chapter",
            constraint=models.UniqueConstraint(fields=("story", "slug"), name="unique_story_chapter_slug"),
        ),
    ]