import json
from pprint import pprint
from bson import Code
from django.shortcuts import render_to_response
from django.template import RequestContext
# Create your views here.
from pymongo import MongoClient
from rest_framework.decorators import api_view
from rest_framework.response import Response
from tweets.settings import MONGO_DATABASE
from bson import json_util

def cursor_to_json(cursor):
    json_docs = []
    for doc in cursor:
        json_doc = json.dumps(doc, default=json_util.default)
        json_docs.append(json.loads(json_doc))
    return json_docs


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
    result = MONGO_DATABASE.find(
        {
            "tv_show": tv_show_name
        }
    ).sort("created_at", -1).limit(10)
    pprint(result[0])
    result = cursor_to_json(result)
    return Response({"tv_show_last_tweets": result})
