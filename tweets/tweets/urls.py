from django.conf.urls import patterns, include, url
import settings

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'tweets.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^$', 'home.views.welcome'),
)

if not settings.DEBUG:
    from django.conf.urls.static import static

    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
