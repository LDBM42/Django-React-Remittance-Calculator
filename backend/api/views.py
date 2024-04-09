from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note


# List all the notes or create a new note
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    # only if it's authenticated
    permission_classes = [IsAuthenticated] 
    
    # override queryset method
    def get_queryset(self):
        user = self.request.user # this returns the user object
        # return the notes that were create by the auth user
        return Note.objects.filter(author=user)
        # Note.objects.all() returns all the notes

    # override create method
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    # override queryset method
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)



# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all() # all the objects
    # this says the view what data we will be using to create new user
    serializer_class = UserSerializer
    # anyone can create users even not authenticated
    permission_classes = [AllowAny]  


