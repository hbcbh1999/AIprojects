import json
import random
from time import time

class Agent:
    def __init__(self,name,profile):
        '''
        Agent class.
        Arguments:
            - name: name of the agent and JSON file with parameters
            - profile: name of the JSON with the profile parameters
        '''
        print("I am Agent",name,profile)
        self.name = name+"_"+profile
        self.params = json.load(open('agents/'+name+'.json'))
        self.profile = json.load(open('profiles/'+profile+'.json'))
        self.paramSize = len(self.profile)
        wSum = 0
        for key in self.profile:
            wSum += self.profile[key]["w"]
        print("Weights sum: ",wSum)
        self.tIni = time()
    def computeUtility(self,offer):
        '''
        Compute the utility of a given offer.
        Arguments:
            - offer: the offer to compute the utility
        Returns:
            - utility: utility value of the given offer
        '''
        assert(len(offer)==len(self.profile))
        utility, cnt = 0, 0
        for key in self.profile:
            weight = self.profile[key]["w"]
            value = 0
            if self.profile[key]["type"] == "range":
                for range in self.profile[key]["V"]:
                    value, down, up = range[0], range[1], range[2]
                    if offer[cnt] >= down and offer[cnt] < up:
                        break
            elif self.profile[key]["type"] == "list":
                for range in self.profile[key]["V"]:
                    value, cond = range[0], range[1]
                    if offer[cnt] == cond:
                        break
            else:
                print("Parameter not found!")
            utility = utility + weight*value
            cnt = cnt + 1
        return utility
    def send(self):
        '''
        Send an offer.
        Arguments:
            - None
        Returns:
            - offer: offer to be sent
            - utility: utility value of the given offer
        '''
        bestOffer, maxUtility = None, 0
        for i in range(10):
            offer = []
            for key in self.profile:
                if self.profile[key]["type"] == "range":
                    start, stop = self.profile[key]["range"][0], self.profile[key]["range"][1]
                    offer.append(random.randrange(start,stop))
                elif self.profile[key]["type"] == "list":
                    offer.append(random.choice(self.profile[key]["list"]))
                else:
                    print("Parameter not found!")
            utility = self.computeUtility(offer)
            if utility > maxUtility:
                maxUtility = utility
                bestOffer = offer
        return bestOffer, maxUtility
    def receive(self,offer):
        '''
        Receive an offer.
        Arguments:
            - offer: received offer
        Returns:
            - utility: utility value of the given offer
            - accepted: accepted offer (True) or rejected (False)
        '''
        utility = self.computeUtility(offer)
        s = 1 - (1 - self.params["RU"])*((time()-self.tIni)/self.params["Ta"])**(1/self.params["beta"])
        accepted = (utility >= s)
        return utility, s, accepted


