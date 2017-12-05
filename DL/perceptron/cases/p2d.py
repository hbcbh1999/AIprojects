import numpy as np 
import random
import matplotlib.pyplot as plt 

class Perceptron2d:
    # init preceptron: C = numero de clases
    def __init__(self,C,a = 0.1,b = 0.1,itMax = 100, ploter=False):
        # parameters
        self.a = a
        self.b = b
        self.itMax = itMax
        self.ploter = ploter
        # init weights
        self.C = C
        self.w = np.zeros((C,2))    
        self.w0 = np.zeros(C)
    # train perceptron
    def train(self,data):
        it = 0
        # extract labels
        lab = data[:,2]
        x = data[:,0:2]
        # random acces to data
        arr = list(range(len(x)))
        random.shuffle(arr)  
        while True:
            it += 1
            error2 = False
            for n in arr:
                i = int(lab[n])
                g = (np.dot(self.w[i],x[n]) + self.w0[i])  
                error = False              
                for j in range(self.C): # clases son: 0, 1, 2, ...
                    if j != i:
                        gj = np.dot(self.w[j],x[n]) + self.w0[j] + self.b
                        if gj > g:
                            self.w[j] = self.w[j] - self.a*x[n]
                            self.w0[j] = self.w0[j] - self.a
                            error = True
                if error:
                    self.w[i] = self.w[i] + self.a*x[n]
                    self.w0[i] = self.w0[i] + self.a
                    error2 = True
            if self.ploter:
                self.plot(data,tit="iteration "+str(it))
            if error2 == False or it >= self.itMax:
                break;
            
        print("w = ",self.w)
        print("w0 = ",self.w0)
        print("it = ",it)
        if it == self.itMax:            
            print("Not converged")
    # evaluate
    def evaluate(self,test):
        gMax, cMax = -1e8, -1
        for i in range(self.C):
            g = (np.dot(self.w[i],test) + self.w0[i])
            if g > gMax:
                gMax = g
                cMax = i
        return cMax
    # plot 
    def plot(self,x,tit='',test=[]):
        color = ['.g','.b','.r','.y']
        for l in range(self.C):
            plt.plot(
                [j for i, j in enumerate(x[:,0]) if x[i][2] == l],
                [j for i, j in enumerate(x[:,1]) if x[i][2] == l],
                color[l]
            )        
        xp = np.arange(0.8,2.2,step=0.1)
        for i in range(self.C-1):
            # linea que separa clases i e i+1
            y = (xp*(self.w[i][0]-self.w[i+1][0]) + (self.w0[i]-self.w0[i+1]))/(self.w[i+1][1]-self.w[i][1])
            plt.plot(xp,y,'k')
        if len(test) > 0:
            plt.plot(test[0],test[1],'.k')
        plt.title(tit)
        plt.show()

            

