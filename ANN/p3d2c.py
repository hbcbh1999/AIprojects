import numpy as np 
import random
import matplotlib.pyplot as plt 
from mpl_toolkits.mplot3d import Axes3D

class Perceptron3d2c:
    # init preceptron
    def __init__(self,a = 0.1,b = 0.1,itMax = 100, ploter=False):
        # parameters
        self.a = a
        self.b = b
        self.itMax = itMax
        self.ploter = ploter
        # init weights
        self.w = np.zeros(3)    
        self.w0 = 0.
        # 2 classes (+1, -1)
        self.c = np.zeros(3)
    # train perceptron
    def train(self,data):
        it = 0
        # extract labels
        self.c = data[:,3]
        x = data[:,0:3]
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
                self.plot(data,tit="iteration "+str(it))
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
    def plot(self,x,tit='',test=[]):
        fig = plt.figure()
        ax = fig.add_subplot(111, projection='3d')  
        ax.scatter(
            [j for i, j in enumerate(x[:,0]) if x[i][3] == 1],
            [j for i, j in enumerate(x[:,1]) if x[i][3] == 1],
            [j for i, j in enumerate(x[:,2]) if x[i][3] == 1]
        )
        ax.scatter(
            [j for i, j in enumerate(x[:,0]) if x[i][3] == -1],
            [j for i, j in enumerate(x[:,1]) if x[i][3] == -1],
            [j for i, j in enumerate(x[:,2]) if x[i][3] == -1]
        )
        if len(test) != 0:
            ax.scatter(test[0],test[1],test[2])
        xp = np.arange(1,2,step=0.1)
        yp = np.arange(0,1,step=0.1)
        X, Y = np.meshgrid(xp, yp)
        Z = -(X*self.w[0] + Y*self.w[1] + self.w0)/self.w[2]
        ax.plot_wireframe(X,Y,Z)
        plt.title(tit)
        ax.set_xlabel('X')
        ax.set_ylabel('Y')
        ax.set_zlabel('Z ')
        plt.show()

            

