import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from agents.agents import Agent
from time import time

def runIter(agentA,agentB,it):
    '''
    Run a negotiation iteration (agentA -> agentB)
    Arguments:
        - agentA: agent that sends an offer.
        - agentB: agent that receives the offer.
        - it: iteration
    Returns:
        - uA: utility of the sent offer (given by agent A)
        - uB: utility of the recieved offer (given by agent B)
        - accepted: offer accepted (True) or refused (False) by agentB 
    '''
    offer, uA = agentA.send()
    uB, s, accepted = agentB.receive(offer)
    print(agentA.name,"sent:","%.2f"%uA,agentB.name,"received:","%.2f"%uB,"(s =","%.2f"%s,")")
    return uA, uB, accepted
def runNego(agentAname,profileA,agentBname,profileB,maxIt):
    tIni = time()
    # set agents
    agentA = setAgent(agentAname,profileA)
    agentB = setAgent(agentBname,profileB)
    # animation
    fig, ax = plt.subplots()
    plt.ylabel(agentA.name)
    plt.xlabel(agentB.name)
    agentAdata, agentBdata = ([], []), ([], [])
    lnA, = plt.plot([], [], '.-b', animated=True)
    lnB, = plt.plot([], [], '.-r', animated=True)
    def init():
        ax.set_ylim(-0.1,1.1)
        ax.set_xlim(-0.1,1.1) 
        ax.grid()
        return [lnA,lnB]
    def update(data):
        xa, ya, xb, yb = data
        agentAdata[0].append(xa)
        agentAdata[1].append(ya)
        agentBdata[0].append(xb)
        agentBdata[1].append(yb)
        lnA.set_data(agentAdata[0], agentAdata[1])
        lnB.set_data(agentBdata[0], agentBdata[1])
        return [lnA,lnB]
    def frames():
        for it in range(int(maxIt)):
            print()
            print("Iteration:",it+1,"Time:","%.2f"%(time()-tIni),"s")
            uAA, uBA, accepted = runIter(agentA,agentB,it)
            if accepted==True:
                print("ACCEPTED")
                break
            uAB, uBB, accepted = runIter(agentB,agentA,it)
            if accepted==True:
                print("ACCEPTED")
                break
            yield uBA, uAA, uAB, uBB
        print("END")
    ani = FuncAnimation(fig,update,frames,init_func=init,blit=True,repeat=False)
    plt.show()
def setAgent(agentName,profile):
    '''
    Create and initialize an agent.
    Argumets:
        - agentName: name of the JSON file with agent's parameters
        - profile: name of the JSON file with agent's profile parameters
    Returns:
        - agent: Initialized agent
    '''
    agent = Agent(agentName,profile)
    return agent



