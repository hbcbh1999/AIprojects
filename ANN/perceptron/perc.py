import numpy as np
from perceptron import Perceptron
from plot import plot

def main():

    # train data
    M, D, C = 6, 3, 3
    data = np.zeros((M,D+1))  # D + label
    # last element is the label
    data[0] = [0.9, 0.1, 0, 0]
    data[1] = [1.9, 0.8, 0.9, 1]
    data[2] = [2, 0.9, 0.8, 2]
    data[3] = [1 ,0.2, 0.1, 0]
    data[4] = [1.2, 0.1, 0.4, 1]
    data[5] = [1.6, 0.6, 0.6, 1]
    # train perceptron
    nn = Perceptron(D,C)     
    nn.train(data)          
    # test perceptron
    testData = np.asarray([1.2, 0.3, 0.8])
    print("testData is of class ", nn.evaluate(testData))
    plot(data,'test',testData,D,C,nn.w,nn.w0)

# main
if __name__ == "__main__":
    main()
