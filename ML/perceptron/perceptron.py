import numpy as np 
import random 

class Perceptron:
    # init preceptron: D = number of dimensions
    def __init__(self,D,C,a = 0.1,b = 0.1,itMax = 300):
        # parameters
        self.a = a
        self.b = b
        self.itMax = itMax
        # init weights
        self.D = D
        self.C = C
        self.w = np.zeros((C,D))    
        self.w0 = np.zeros(C)
    # train perceptron
    def train(self,data):
        it = 0
        # extract labels
        lab = data[:,self.D]
        x = data[:,0:self.D]
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


            

