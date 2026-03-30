from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("authentication", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="registereduser",
            name="last_activity",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
