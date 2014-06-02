from django.conf.urls import patterns, include, url
import settings

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'tweets.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^$', 'home.views.welcome'),
    url(r'^api/tweets$', 'home.views.get_tweets'),
    url(r'^api/tweets/last/(.+)$', 'home.views.get_last_tweets'),
    url(r'^api/tweets/names$', 'home.views.get_names_TVShows'),
    url(r'^api/tweets/seven/(.+)$', 'home.views.get_seven_days_tweets'),
    url(r'^api/tweets/all-seven$', 'home.views.get_all_seven_days_tweets')
)

if not settings.DEBUG:
    from django.conf.urls.static import static

    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
