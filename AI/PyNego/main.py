import sys
from pynego import runNego

def errorMsg():
    print('python main.py <agentA> <profileA> <agentB> <profileB> <maxIter>')

def main(args):
    if len(args) != 6:
        errorMsg()
    else:
        runNego(args[1],args[2],args[3],args[4],args[5])

if __name__ == '__main__':
    sys.exit(main(sys.argv))
