from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("stories", "0006_story_is_private")]

    operations = [
        migrations.AddConstraint(
            model_name="chapter",
            constraint=models.UniqueConstraint(fields=("story", "chapter_number"), name="unique_story_chapter_number"),
        ),
    ]