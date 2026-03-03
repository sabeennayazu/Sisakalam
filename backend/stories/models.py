from django.db import models

# Create your models here.

class Story(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    genre = models.CharField(max_length=100)
    author = models.ForeignKey('Author', on_delete=models.CASCADE)
    
    tags = models.ManyToManyField('Tags', related_name='stories')
    image = models.ImageField(upload_to='story_images/', blank=True, null=True)
    nsfw = models.BooleanField(default=False)
    synopsis = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    views = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    comments_count = models.IntegerField(default=0)

    def __str__(self):
        return self.title

class Tags(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Author(models.Model):
    name = models.CharField(max_length=100)
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE)
    