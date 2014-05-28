from pprint import pprint
from bson import Code
from django.shortcuts import render_to_response
from django.template import RequestContext
# Create your views here.
from pymongo import MongoClient
from rest_framework.decorators import api_view
from rest_framework.response import Response


def welcome(request):
    return render_to_response("base.html", context_instance=RequestContext(request))


@api_view(['GET'])
def get_tweets(request):
    client = MongoClient('localhost', 27017)
    db = client.tweets
    tweets = db.tweets
    reducer = Code("""
                    function( curr, result ) {
                        result.count += 1;
                    }
                   """)
    result = tweets.group(key={"tv_show": 1}, condition={}, initial={"count": 0}, reduce=reducer)
    return Response({"tv_shows_count" : result})

