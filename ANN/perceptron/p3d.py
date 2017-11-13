import numpy as np 
import random
import matplotlib.pyplot as plt 
from mpl_toolkits.mplot3d import Axes3D

class Perceptron3d:
    # init preceptron: C = numero de clases
    def __init__(self,C,a = 0.1,b = 0.1,itMax = 100, ploter=False):
        # parameters
        self.a = a
        self.b = b
        self.itMax = itMax
        self.ploter = ploter
        # init weights
        self.C = C
        self.w = np.zeros((C,3))    
        self.w0 = np.zeros(C)
    # train perceptron
    def train(self,data):
        it = 0
        # extract labels
        lab = data[:,3]
        x = data[:,0:3]
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
        fig = plt.figure()
        ax = fig.add_subplot(111, projection='3d')  
        for l in range(self.C):
            ax.scatter(
                [j for i, j in enumerate(x[:,0]) if x[i][3] == l],
                [j for i, j in enumerate(x[:,1]) if x[i][3] == l],
                [j for i, j in enumerate(x[:,2]) if x[i][3] == l]
            )        
        xp = np.arange(1,2,step=0.1)
        yp = np.arange(0,1,step=0.1)
        X, Y = np.meshgrid(xp, yp)
        for i in range(self.C-1):
            Z = (X*(self.w[i][0]-self.w[i+1][0]) + Y*(self.w[i][1]-self.w[i+1][1]) + (self.w0[i]-self.w0[i+1]))/(self.w[i+1][2]-self.w[i][2])
            ax.plot_wireframe(X,Y,Z)

        if len(test) > 0:
            ax.scatter(test[0],test[1],test[2])
        ax.set_xlabel('X')
        ax.set_ylabel('Y')
        ax.set_zlabel('Z ')
        plt.title(tit)
        plt.show()

            

