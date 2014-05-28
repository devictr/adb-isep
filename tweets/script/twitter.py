import json
from pprint import pprint

from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
from pymongo import MongoClient
from dateutil.parser import parse
# Go to http://dev.twitter.com and create an app.
# The consumer key and secret will be generated for you after
import utils
from conf import *

class TweetsListener(StreamListener):
    """ A listener handles tweets are the received from the stream.
    This is a basic listener that just prints received tweets to stdout.

    """

    def __init__(self):
        super(TweetsListener, self).__init__()
        self.total = 0
        self.nb_with_coordinates = 0
        self.client = MongoClient('localhost', 27017)
        self.db = self.client.tweets
        self.tweets = self.db.tweets


    def on_data(self, data):
        data = json.loads(data)
        self.total += 1
        filtered_data = dict()
        filtered_data["created_at"] = parse(data["created_at"])
        filtered_data["text"] = data["text"]
        filtered_data["name"] = data["user"]["screen_name"]
        filtered_data["profile_image"] = data["user"]["profile_image_url"]
        filtered_data["retweet_count"] = data["retweet_count"]
        filtered_data["hashtags"] = [ht["text"] for ht in data["entities"]["hashtags"]]
        filtered_data["mentions"] = [mention["screen_name"] for mention in data["entities"]["user_mentions"]]
        filtered_data['tv_show'] = utils.get_tv_show_from_reference(
            filtered_data["hashtags"] + filtered_data["mentions"])
        filtered_data["coordinates"] = data["coordinates"]
        self.tweets.insert(filtered_data)
        pprint(filtered_data)
        return True

    def on_error(self, status):
        print status


if __name__ == '__main__':
    l = TweetsListener()
    auth = OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
    auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)

    references = utils.get_all_references()

    stream = Stream(auth, l)
    stream.filter(track=references)
