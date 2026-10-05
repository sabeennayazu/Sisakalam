from django.db import migrations


def create_search_indexes(apps, schema_editor):
    if schema_editor.connection.vendor != "postgresql":
        return

    schema_editor.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm")
    indexes = {
        "accounts_user": ["username"],
        "stories_story": ["title", "synopsis"],
        "poems_poem": ["title", "content"],
        "stories_genre": ["name"],
        "stories_tags": ["name"],
    }
    quote = schema_editor.connection.ops.quote_name
    for table, columns in indexes.items():
        for column in columns:
            index_name = f"{table}_{column}_trgm_idx"
            schema_editor.execute(
                f"CREATE INDEX IF NOT EXISTS {quote(index_name)} "
                f"ON {quote(table)} USING GIN ({quote(column)} gin_trgm_ops)"
            )


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("accounts", "0004_userprivacypreference_follow"),
        ("poems", "0004_alter_poem_genre"),
        ("stories", "0008_alter_story_genre"),
    ]

    operations = [
        migrations.RunPython(create_search_indexes, migrations.RunPython.noop),
    ]