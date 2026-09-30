import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


def normalize_interactions(apps, schema_editor):
    Like = apps.get_model("interactions", "Like")
    Bookmark = apps.get_model("interactions", "Bookmark")

    for model, target_fields in (
        (Like, ("story_id", "poem_id", "chapter_id", "comment_id")),
        (Bookmark, ("story_id", "poem_id")),
    ):
        for item in model.objects.all().iterator():
            populated = [field for field in target_fields if getattr(item, field) is not None]
            if not populated:
                item.delete()
                continue
            keep_field = populated[0]
            for field in populated[1:]:
                setattr(item, field, None)
            if len(populated) > 1:
                item.save(update_fields=list(populated[1:]))

        seen = set()
        for item in model.objects.order_by("pk").iterator():
            target_field = next(field for field in target_fields if getattr(item, field) is not None)
            key = (item.user_id, target_field, getattr(item, target_field))
            if key in seen:
                item.delete()
            else:
                seen.add(key)


class Migration(migrations.Migration):
    dependencies = [
        ("interactions", "0004_chapter_comments_and_like_count"),
        ("poems", "0003_poem_is_private"),
        ("stories", "0007_chapter_number_unique"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="like",
            name="chapter",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="likes_received", to="stories.chapter"),
        ),
        migrations.AddField(
            model_name="like",
            name="comment",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="likes_received", to="interactions.comment"),
        ),
        migrations.AlterField(
            model_name="like",
            name="story",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="likes_received", to="stories.story"),
        ),
        migrations.AlterField(
            model_name="like",
            name="poem",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="likes_received", to="poems.poem"),
        ),
        migrations.AlterUniqueTogether(name="like", unique_together=set()),
        migrations.AlterUniqueTogether(name="bookmark", unique_together=set()),
        migrations.RunPython(normalize_interactions, migrations.RunPython.noop),
        migrations.AddConstraint(
            model_name="like",
            constraint=models.CheckConstraint(
                condition=(
                    models.Q(story__isnull=False, poem__isnull=True, chapter__isnull=True, comment__isnull=True)
                    | models.Q(story__isnull=True, poem__isnull=False, chapter__isnull=True, comment__isnull=True)
                    | models.Q(story__isnull=True, poem__isnull=True, chapter__isnull=False, comment__isnull=True)
                    | models.Q(story__isnull=True, poem__isnull=True, chapter__isnull=True, comment__isnull=False)
                ),
                name="like_exactly_one_target",
            ),
        ),
        migrations.AddConstraint(
            model_name="like",
            constraint=models.UniqueConstraint(fields=("user", "story"), condition=models.Q(story__isnull=False), name="unique_user_story_like"),
        ),
        migrations.AddConstraint(
            model_name="like",
            constraint=models.UniqueConstraint(fields=("user", "poem"), condition=models.Q(poem__isnull=False), name="unique_user_poem_like"),
        ),
        migrations.AddConstraint(
            model_name="like",
            constraint=models.UniqueConstraint(fields=("user", "chapter"), condition=models.Q(chapter__isnull=False), name="unique_user_chapter_like"),
        ),
        migrations.AddConstraint(
            model_name="like",
            constraint=models.UniqueConstraint(fields=("user", "comment"), condition=models.Q(comment__isnull=False), name="unique_user_comment_like"),
        ),
        migrations.AddConstraint(
            model_name="bookmark",
            constraint=models.CheckConstraint(
                condition=models.Q(story__isnull=False, poem__isnull=True) | models.Q(story__isnull=True, poem__isnull=False),
                name="bookmark_exactly_one_target",
            ),
        ),
        migrations.AddConstraint(
            model_name="bookmark",
            constraint=models.UniqueConstraint(fields=("user", "story"), condition=models.Q(story__isnull=False), name="unique_user_story_bookmark"),
        ),
        migrations.AddConstraint(
            model_name="bookmark",
            constraint=models.UniqueConstraint(fields=("user", "poem"), condition=models.Q(poem__isnull=False), name="unique_user_poem_bookmark"),
        ),
    ]