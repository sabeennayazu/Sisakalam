from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("interactions", "0002_alter_bookmark_unique_together_and_more")]

    operations = [
        migrations.AddField(
            model_name="comment",
            name="rating",
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
        migrations.AddIndex(
            model_name="comment",
            index=models.Index(fields=["story", "created_at"], name="interactions_story_cmt_idx"),
        ),
        migrations.AddIndex(
            model_name="comment",
            index=models.Index(fields=["poem", "created_at"], name="interactions_poem_cmt_idx"),
        ),
    ]