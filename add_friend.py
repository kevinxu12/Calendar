from django.db import models
   class Link(models.Model):
     url = models.URLField(unique=True)


class Friendship(models.Model):
     from_friend = models.ForeignKey(
       User, related_name='friend_set'
     )
     to_friend = models.ForeignKey(
       User, related_name='to_friend_set'
     )
     def __str__(self):
       return '%s, %s' % (
         self.from_friend.username,
         self.to_friend.username
       )
     class Admin:
       pass
     class Meta:
       unique_together = (('to_friend', 'from_friend'), )
       permissions = (
          ('can_list_friend_bookmarks',
           'Can list friend bookmarks'),
        )
     UNIQUE ("from_friend", "to_friend")
