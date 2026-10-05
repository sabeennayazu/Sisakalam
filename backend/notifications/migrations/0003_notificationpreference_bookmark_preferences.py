from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("notifications", "0002_notificationpreference_followed_updates"),
    ]

    operations = [
        migrations.AddField(
            model_name="notificationpreference",
            name="story_bookmarks",
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name="notificationpreference",
            name="poem_bookmarks",
            field=models.BooleanField(default=True),
        ),
    ]