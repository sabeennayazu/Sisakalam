from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("notifications", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="notificationpreference",
            name="followed_updates",
            field=models.BooleanField(default=True),
        ),
    ]