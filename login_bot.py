#!/usr/bin/python

import sys 
import mechanize
import cookielib
import time
import threading
import Queue
import string
import random

bigipIp = "1.1.1.2"
numClients = 45
vs_IPNetwork = "10.128.10."
queue = Queue.Queue()
iid = 1
iid_lock = threading.Lock()



class ThreadedClient(threading.Thread):
	"""Threaded F5 login client"""
	def __init__(self, queue):
		threading.Thread.__init__(self)
		self.queue = queue
		
	def run(self):
		# while True:

		clientId = next_id()
		br = mechanize.Browser()

		# Browser options
		br.set_handle_equiv(True)
		# br.set_handle_gzip(True)
		br.set_handle_redirect(True)
		br.set_handle_referer(True)
		br.set_handle_robots(False)

		br.set_handle_redirect(mechanize.HTTPRedirectHandler)


		# User-Agent
		br.addheaders = [('User-agent', 'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.1) Gecko/2008071615 Fedora/3.0.1-1.fc9 Firefox/3.0.1')]


		br.open("https://" + bigipIp + "/tmui/login.jsp")

##
#   Login
#

		br.select_form(name="loginform")
		# Browser passes through unknown attributes (including methods)
		# to the selected HTMLForm.
		br["username"] = "admin"
		br["passwd"] = "admin"
		content = br.submit().read()
		# Simulate pause between clicks
		time.sleep(.3)
##
#  Open the /xui becuase the script won't parse/interpret the .js
#

		r = br.open("https://" + bigipIp + "/xui/")
		content = r.read()

##
#  Open Local Traffic -> Virtual Servers
#
		r = br.open("https://" + bigipIp + "/tmui/Control/jspmap/tmui/locallb/virtual_server/list.jsp?Filter=*")
		content = r.read()
##
# 	Create virtual server
#
		r = br.open("https://" + bigipIp + "/tmui/Control/jspmap/tmui/locallb/virtual_server/create.jsp")
		br.select_form(name="myform")
		br["name"] = "vs_" + vs_rand_name_generator()
		br["destination_address_input_vs"] = vs_IPNetwork + str(clientId)
		br["port"] = "80"
		content = br.submit().read()

		print "Client " + str(clientId) + " finished"
		# Write output to file.  probably not needed
		# with open("mechanize_results.html", "w") as f:
		# 	f.write(content)



def next_id():
	global iid
	with iid_lock:
		result = iid
		iid += 1
	return result

def vs_rand_name_generator(size=6, chars=string.ascii_uppercase + string.digits):
	return ''.join(random.choice(chars) for x in range(size))
			
#https://1.1.1.2/tmui/Control/jspmap/tmui/locallb/virtual_server/list.jsp?Filter=*

def main():
	client = 1
	for i in range(numClients):
		time.sleep(.25)
		t = ThreadedClient(queue)
		t.start()
		print "started client " + str(client)
		client = client + 1
	
	queue.join()
main()



