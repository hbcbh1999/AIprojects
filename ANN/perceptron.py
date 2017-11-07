import numpy as np 
import random
import matplotlib.pyplot as plt 

class Perceptron:
    # init preceptron
    def __init__(self,a = 0.1,b = 0.1,itMax = 100, ploter=False):
        # parameters
        self.a = a
        self.b = b
        self.itMax = itMax
        self.ploter = ploter
        # init weights
        self.w = np.zeros(2)    
        self.w0 = 0.
        # 2 classes (+1, -1)
        self.c = np.zeros(2)
    # setters
    def setC(self,c):
        self.c = c
    # train perceptron
    def train(self,x):
        it = 0
        # random acces to data
        arr = list(range(len(x)))
        random.shuffle(arr)        
        while True:
            error = 0.
            it += 1
            for i in arr:
                g = self.c[i]*(np.dot(self.w,x[i]) + self.w0)
                if g < self.b:
                    self.w += self.a*self.c[i]*x[i]
                    self.w0 += self.a*self.c[i]
                    error += 1
            if self.ploter:
                self.plot(x,tit="iteration "+str(it))
            if error == 0 or it >= self.itMax:
                break;
        print("w = ",self.w)
        print("w0 = ",self.w0)
        print("it = ",it)
        if it == self.itMax:            
            print("Not converged")
    # evaluate
    def evaluate(self,test):
        g = (np.dot(self.w,test) + self.w0)
        if g > 0:
            return 1
        else:
            return -1    
    # plot 
    def plot(self,x,tit=''):
        plt.plot(
            [j for i, j in enumerate(x[:,0]) if self.c[i] == 1],
            [j for i, j in enumerate(x[:,1]) if self.c[i] == 1],
            '.g'
        )
        plt.plot(
            [j for i, j in enumerate(x[:,0]) if self.c[i] == -1],
            [j for i, j in enumerate(x[:,1]) if self.c[i] == -1],
            '.r'
        )
        xp = np.arange(1,2,step=0.1)
        yp = -(xp*self.w[0] + self.w0)/self.w[1]
        plt.plot(xp,yp,'k')
        plt.title(tit)
        plt.show()

            

