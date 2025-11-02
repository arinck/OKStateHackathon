from flask import Flask, redirect, request, session, url_for
from requests_oauthlib import OAuth2Session
import os
import requests




#This redirect link needs to be changed once it is not local hosted and added to linked in settings
redirect_uri = 'http://127.0.0.1:5000/callback' 
scope = ['openid', 'profile', 'email']

authorization_base_url = 'https://www.linkedin.com/oauth/v2/authorization'
token_url = 'https://www.linkedin.com/oauth/v2/accessToken'
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'