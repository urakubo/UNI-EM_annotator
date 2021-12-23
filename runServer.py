import optparse

parser = optparse.OptionParser(
    usage="usage: %runServer [annotator folder]")
(options, args) = parser.parse_args()
relative_annotator_dir = args[0]


print('relative_annotator_dir: ',relative_annotator_dir)

if len(args) != 1:
  parser.error("Invalid arguments")

from os import path
import sys
import numpy as np

main_dir = path.abspath(path.join(path.dirname(sys.argv[0])))
sys.path.append(main_dir)
sys.path.append(path.join(main_dir, "annotator"))


from system.Params import Params
from Annotator.AnnotatorServer import AnnotatorServerLogic

dojo_dir = path.abspath(path.join(main_dir, relative_annotator_dir))
params = Params()
params.SetUserInfoAnnotator(dojo_dir)

logic = AnnotatorServerLogic(params)
logic.run()
