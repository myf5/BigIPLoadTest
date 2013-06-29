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
		# client code goes here.
		os.system("bigip_loadtest.js --ignore-ssl-errors=yes")
		

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



