import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

def plot(x,tit,test,D,C,w,w0):
    if D == 2 and C <= 3:
        color = ['.g','.b','.r','.y']
        for l in range(C):
            plt.plot(
                [j for i, j in enumerate(x[:,0]) if x[i][2] == l],
                [j for i, j in enumerate(x[:,1]) if x[i][2] == l],
                color[l]
            )        
        xp = np.arange(0.8,2.2,step=0.1)
        for i in range(C-1):
            # linea que separa clases i e i+1
            if C == 2:
                y = (xp*w[i][0] + w0[i])/w[i][1]
            else:
                y = (xp*(w[i][0]-w[i+1][0]) + (w0[i]-w0[i+1]))/(w[i+1][1]-w[i][1])
            plt.plot(xp,y,'k')
        if len(test) > 0:
            plt.plot(test[0],test[1],'.k')
        plt.title(tit)
        plt.show()
    elif D == 3 and C <= 3:
        fig = plt.figure()
        ax = fig.add_subplot(111, projection='3d')  
        for l in range(C):
            ax.scatter(
                [j for i, j in enumerate(x[:,0]) if x[i][3] == l],
                [j for i, j in enumerate(x[:,1]) if x[i][3] == l],
                [j for i, j in enumerate(x[:,2]) if x[i][3] == l]
            )        
        xp = np.arange(1,2,step=0.1)
        yp = np.arange(0,1,step=0.1)
        X, Y = np.meshgrid(xp, yp)
        for i in range(C-1):
            if C == 2:
                Z = (X*w[i][0] + Y*w[i][1] + w0[i])/w[i][2]
            else:
                Z = (X*(w[i][0]-w[i+1][0]) + Y*(w[i][1]-w[i+1][1]) + (w0[i]-w0[i+1]))/(w[i+1][2]-w[i][2])
            ax.plot_wireframe(X,Y,Z)

        if len(test) > 0:
            ax.scatter(test[0],test[1],test[2])
        ax.set_xlabel('X')
        ax.set_ylabel('Y')
        ax.set_zlabel('Z ')
        plt.title(tit)
        plt.show()