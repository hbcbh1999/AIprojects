import numpy as np
from p3d2c import Perceptron3d2c as Perceptron
import matplotlib.pyplot as plt 

# A simple preceptron example with custom 2D data

def main():

    # train data
    M = 6
    data = np.zeros((M,4))  # x, y, z, label
    labels = np.zeros(M)
    # last element is the label
    data[0] = [0.9, 0.1, 0, 1]
    data[1] = [1.9, 0.8, 0.9, 1]
    data[2] = [2, 0.9, 0.8, 1]
    data[3] = [1 ,0.2, 0.1, -1]
    data[4] = [1.2, 0.1, 0.2, -1]
    data[5] = [1.6, 0.6, 0.6, 1]

    # train perceptron
    nn = Perceptron(ploter=False)     
    nn.train(data)          

    # test perceptron
    testData = np.asarray([1.2, 0.3, 0.2])
    print("testData is of class ", nn.evaluate(testData))

    # plot results
    nn.plot(data,'test',test=testData)
    
# main
if __name__ == "__main__":
    main()
