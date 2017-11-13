import numpy as np
from p2d2c import Perceptron2d2c as Perceptron
import matplotlib.pyplot as plt 

# A simple preceptron example with custom 2D data

def main():

    # train data
    data = {}
    data["dim1"] = [0.9,2,2,1.1,1,1.5]
    data["dim2"] = [0.1,0.8,0.9,0.2,0.1,0.2]
    data["class"] = [-1,1,1,-1,-1,1]

    # train perceptron
    nn = Perceptron(ploter=True) 
    M = len(data["class"])
    x = np.zeros((M,3))
    for i in range(M):
        x[i][0] = data["dim1"][i]
        x[i][1] = data["dim2"][i]
        x[i][2] = data["class"][i]
    nn.train(x)          
    # plot results
    # nn.plot(x,'final')

    # test perceptron
    testData = np.asarray([1.8,0.9])
    clas = nn.evaluate(testData)
    print("testData is of class ",clas)
    plt.plot(testData[0],testData[1],'.b')

    # plot results
    # nn.plot(x,'test')

    
# main
if __name__ == "__main__":
    main()
