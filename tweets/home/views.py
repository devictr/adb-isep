from django.shortcuts import render_to_response
from django.template import RequestContext
# Create your views here.

def welcome(request):
	return render_to_response("base.html", context_instance=RequestContext(request))