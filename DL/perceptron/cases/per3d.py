import numpy as np
from p3d import Perceptron3d as Perceptron
import matplotlib.pyplot as plt 

# A simple preceptron example with custom 2D data

def main():

    # train data
    M = 6
    data = np.zeros((M,4))  # x, y, z, label
    # last element is the label
    data[0] = [0.9, 0.1, 0, 0]
    data[1] = [1.9, 0.8, 0.9, 2]
    data[2] = [2, 0.9, 0.8, 2]
    data[3] = [1 ,0.2, 0.1, 0]
    data[4] = [1.2, 0.1, 0.4, 1]
    data[5] = [1.6, 0.6, 0.6, 1]

    # train perceptron
    nn = Perceptron(3,itMax=300)  
    nn.train(data)          
    # nn.plot(data,'train') 

    # test perceptron
    testData = np.asarray([1.2, 0.8, 1.5])
    print("testData is of class ", nn.evaluate(testData))
    nn.plot(data,'test',test=testData)
    
# main
if __name__ == "__main__":
    main()
