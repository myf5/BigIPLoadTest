#!/usr/bin/python


import mechanize
import cookielib
import time
import threading
import Queue

bigipIp = "1.1.1.2"
numClients = 89
queue = Queue.Queue()


class ThreadedClient(threading.Thread):
	"""Threaded F5 login client"""
	def __init__(self, queue):
		threading.Thread.__init__(self)
		self.queue = queue
		
	def run(self):
		# while True:
		br = mechanize.Browser()

		# Browser options
		br.set_handle_equiv(True)
		# br.set_handle_gzip(True)
		br.set_handle_redirect(True)
		br.set_handle_referer(True)
		br.set_handle_robots(False)

		br.set_handle_redirect(mechanize.HTTPRedirectHandler)


		# User-Agent (this is cheating, ok?)
		br.addheaders = [('User-agent', 'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.1) Gecko/2008071615 Fedora/3.0.1-1.fc9 Firefox/3.0.1')]


		br.open("https://1.1.1.2/tmui/login.jsp")


		br.select_form(name="loginform")
		# Browser passes through unknown attributes (including methods)
		# to the selected HTMLForm.
		br["username"] = "admin"
		br["passwd"] = "admin"
		#username
		#passwd

		redir = br.submit().read()
		# print cj
		#https://1.1.1.2/xui/
		time.sleep(.3)
		r = br.open("https://" + bigipIp + "/xui/")

		content = r.read()
		# with open("mechanize_results.html", "w") as f:
		# 	f.write(content)

			
			

def main():
	count = 0
	for i in range(numClients):
		time.sleep(.25)
		t = ThreadedClient(queue)
		t.start()
		print "started client " + str(count)
		count = count + 1
	
	queue.join()
main()



