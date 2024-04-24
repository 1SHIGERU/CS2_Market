from django.shortcuts import redirect
from steamauth import auth, get_uid
from api.serializers.User_serializer import UserSerializer
from rest_framework.response import Response
from django.contrib.auth import get_user_model, login


import os
import requests

def steam_login(request):
    return auth('/callback', use_ssl=False)

def steam_login_callback(request):
    user = get_uid(request.GET)
    if user is None:
        return redirect('/failed')
    try:
        db_user = get_user_model().objects.get(steam_id=user)
        print(db_user)
    except get_user_model().DoesNotExist:
        STEAMAPI_KEY = os.getenv('STEAMAPI_KEY')
        response = requests.get(
            'http://steamwebapi.com/steam/api/profile',
            params={
                'id': user,
                'key': STEAMAPI_KEY
            }
        )
        response = response.json()

        serializer = UserSerializer(data={
            'username': response['personaname'],
            'steam_id': user,
            'avatar_url': response['avatar'],
            'is_admin': False
        })
        if serializer.is_valid():
            serializer.save()
            login(request, db_user)
            return redirect(f'/users/{user}')
    if db_user:
        login(request, db_user)
        return redirect(f'/users/{user}')


        