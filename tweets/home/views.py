import json
from pprint import pprint
from bson import Code
from django.shortcuts import render_to_response
from django.template import RequestContext
# Create your views here.
from pymongo import MongoClient
from rest_framework.decorators import api_view
from rest_framework.response import Response
from tweets.settings import MONGO_DATABASE, MONGO_COLLECTION
from script.tvshows import TV_SHOWS
from bson import json_util


def welcome(request):
    return render_to_response("base.html", context_instance=RequestContext(request))


@api_view(['GET'])
def get_tweets(request):
    reducer = Code("""
                    function( curr, result ) {
                        result.count += 1;
                    }
                   """)
    result = MONGO_DATABASE.group(key={"tv_show": 1}, condition={}, initial={"count": 0}, reduce=reducer)
    result = [counter for counter in result if counter["tv_show"]]
    return Response({"tv_shows_count": result})


@api_view(['GET'])
def get_last_tweets(request, tv_show_name):
    if tv_show_name == "All":
        result = MONGO_DATABASE.find().sort("created_at", -1).limit(10)
    else:
        result = MONGO_DATABASE.find(
            {
                "tv_show": tv_show_name
            }
        ).sort("created_at", -1).limit(10)
    return Response({"tv_show_last_tweets": json.loads(json_util.dumps(result))})

@api_view(['GET'])
def get_names_TVShows (request):
    tv_shows = []
    for k, v in TV_SHOWS.iteritems():
        tv_shows.append(k)
    return Response({"tv_shows_names" : tv_shows})

@api_view(['GET'])
def get_seven_days_tweets(request, tv_show_name):
    result = MONGO_COLLECTION.system_js.tweetsSevenDays(tv_show_name)
    return Response({"seven_days_tweets": result})

@api_view(['GET'])
def get_all_seven_days_tweets(request):
    result = []
    for k, v in TV_SHOWS.iteritems():
        result.append({"name": k, "data": MONGO_COLLECTION.system_js.tweetsSevenDays(k)})
    return Response({"seven_days_tweets": result})