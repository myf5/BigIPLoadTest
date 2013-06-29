#!/usr/bin/python

import os
from sys import argv
from subprocess import call
import time
import threading
import Queue

targetIP = argv[1]
numClients = argv[2]
script_name = "bigip_loadtest.js"
wait_time = 2
queue = Queue.Queue()
iid = 1
iid_lock = threading.Lock()

class ThreadedClient(threading.Thread):
	"""Threaded F5 GUI load test client"""
	def __init__(self, queue):
		threading.Thread.__init__(self)
		self.queue = queue
		
	def run(self):
		# client code goes here.
		
		clientId = next_id()
		casper_cmd = "casperjs"
		exec_file = casper_cmd + " " + os.getcwd() + "/" + script_name
		call([casper_cmd, script_name, targetIP, "--ignore-ssl-errors=yes"])
		

		print "\t Client " + str(clientId) + " finished"
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
	print "Load test start targetting IP: " + targetIP
	for i in range(int(numClients)):
		time.sleep(wait_time)
		t = ThreadedClient(queue)
		t.start()
		print "\t Started client " + str(client)
		client = client + 1
	
	queue.join()
main()



