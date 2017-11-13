import numpy as np
from p2c import Perceptron2c as Perceptron
import matplotlib.pyplot as plt 

# A simple preceptron example with custom 2D data

def main():

    # train data
    M, D = 6, 5
    data = np.zeros((M,D+1))  # D + label
    labels = np.zeros(M)
    # last element is the label
    data[0] = [0.9, 0.1, 0, 0.5, 0, -1]
    data[1] = [1.9, 0.8, 0.9, 0., 0, 1]
    data[2] = [2, 0.9, 0.8, 0.1, 0, 1]
    data[3] = [1 ,0.2, 0.1, 0.6, 1, -1]
    data[4] = [1.2, 0.1, 0.2, 0.7, 1, -1]
    data[5] = [1.6, 0.6, 0.6, 0.2, 1, 1]

    # train perceptron
    nn = Perceptron(D)     
    nn.train(data)          

    # test perceptron
    testData = np.asarray([1.2, 0.3, 0.2, 0., 1])
    print("testData is of class ", nn.evaluate(testData))
    
# main
if __name__ == "__main__":
    main()
