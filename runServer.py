import optparse
import os, sys
import numpy as np
import webbrowser
import time
import threading

main_dir = os.path.abspath(os.path.join(os.path.dirname(sys.argv[0])))
sys.path.append(main_dir)
sys.path.append(os.path.join(main_dir, "annotator"))

parser = optparse.OptionParser(
    usage="usage: %runServer [annotator folder]")
(options, args) = parser.parse_args()

if len(args) != 1:
	parser.error("Invalid arguments")


# Set annotation target
if os.path.isabs(args[0]):
	annotation_file_dir = args[0]
else:
	annotation_file_dir = path.abspath(path.join(main_dir, args[0]))

print('annotation_file_dir: ', annotation_file_dir)



# Run server
from system.Params import Params
from Annotator.AnnotatorServer import AnnotatorServerLogic


def launch_browser(url):
	print('Webbrowser process started.')
	time_duration = 1.5
	time.sleep(time_duration)
	webbrowser.open(url, 2)

params = Params()
params.SetUserInfoAnnotator( annotation_file_dir )
url = params.url_annotator  + 'index.html'
thread1 = threading.Thread(target=launch_browser, args=(url,))
thread1.start()

logic = AnnotatorServerLogic(params)
logic.run()
thread1.join()
