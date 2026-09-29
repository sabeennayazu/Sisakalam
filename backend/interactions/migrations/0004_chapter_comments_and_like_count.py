from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("interactions", "0003_comment_rating_indexes"),
        ("stories", "0007_chapter_number_unique"),
    ]

    operations = [
        migrations.AddField(
            model_name="comment",
            name="chapter",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="comments", to="stories.chapter"),
        ),
        migrations.AddField(
            model_name="comment",
            name="like_count",
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddIndex(
            model_name="comment",
            index=models.Index(fields=["chapter", "created_at"], name="interactions_chapter_cmt_idx"),
        ),
        migrations.AddConstraint(
            model_name="comment",
            constraint=models.CheckConstraint(
                condition=(
                    models.Q(story__isnull=False, chapter__isnull=True, poem__isnull=True)
                    | models.Q(story__isnull=True, chapter__isnull=False, poem__isnull=True)
                    | models.Q(story__isnull=True, chapter__isnull=True, poem__isnull=False)
                ),
                name="comment_exactly_one_target",
            ),
        ),
    ]