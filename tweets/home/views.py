from django.shortcuts import render_to_response
from django.template import RequestContext
# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response


def welcome(request):
    return render_to_response("base.html", context_instance=RequestContext(request))


@api_view(['GET'])
def get_tweets(request):
    return Response({"coucou": "coucou"})