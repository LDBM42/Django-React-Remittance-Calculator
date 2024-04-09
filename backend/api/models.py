from django.db import models
from django.contrib.auth.models import User

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    # auto_now_add to automatically fill this field
    created_at = models.DateTimeField(auto_now_add=True) 
    # author specify who make this note,
    # ForeignKey if liking a user to many Notes
    # on_delete indicates that we delete all the notes if we delete the user
    # the author can access the notes with the name "notes"
    author = models.ForeignKey(User, on_delete=models.CASCADE, 
                               related_name="notes")

    def __str__(self):
        return self.title