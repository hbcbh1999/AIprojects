import numpy as np 
import random 

class Perceptron2c:
    # init preceptron: D = number of dimensions
    def __init__(self,D,a = 0.1,b = 0.1,itMax = 100):
        # parameters
        self.a = a
        self.b = b
        self.itMax = itMax
        # init weights
        self.D = D
        self.w = np.zeros(D)    
        self.w0 = 0.
    # train perceptron
    def train(self,data):
        it = 0
        # extract labels
        self.c = data[:,self.D]
        x = data[:,0:self.D]
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

            

