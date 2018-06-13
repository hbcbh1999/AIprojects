# PRÁCTICA ROC
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import sys
import math

def main(args):
    
    #  read scores
    clientes = readScores(args[1])
    impostores = readScores(args[2])

    # errores
    umbrales = np.sort(np.unique(np.concatenate((clientes, impostores),axis=0)))
    FP, FN, U = [], [], []
    dFPx, dFNx, dFPN = 2, 2, 2
    X = float(args[3])
    for umbral in umbrales:
        fn = len(clientes[np.where(clientes <= umbral)])/len(clientes)
        fp = len(impostores[np.where(impostores > umbral)])/len(impostores)
        
        # FPx
        d = abs(fn - X)
        if d < dFPx:
            dFPx = d
            fpx, ufpx = fp, umbral

        # FNx
        d = abs(fp - X)
        if d < dFNx:
            dFNx = d
            fnx, ufnx = fn, umbral

        # FPN
        d = abs(fp - fn)
        if d < dFPN:
            dFPN = d
            fpn, fnp, ufpn = fp, fn, umbral 
        
        FN.append(fn)
        FP.append(fp)
        U.append(umbral)    

    # resultados
    print("FP (FN = ",X,") y umbral:", "{:.5}".format(fpx), "{:.5}".format(ufpx))
    print("FN (FP = ",X,") y umbral:", "{:.5}".format(fnx), "{:.5}".format(ufnx))
    print("FP = FN y umbral:", "{:.5}".format(fpn), "{:.5}".format(fnp), "{:.5}".format(ufpn))

    # área bajo la curva ROC
    AROC = 0
    for cliente in clientes:
        for impostor in impostores:
            AROC = AROC + (cliente>impostor) + 0.5*(cliente==impostor)
    AROC = AROC/(len(clientes)*len(impostores))
    print("AROC:", "{:.5}".format(AROC))

    # d prime
    mClientes, mImpostores = np.mean(clientes), np.mean(impostores)
    sClientes, sImpostores = np.std(clientes), np.std(impostores)
    dPrime = (mClientes - mImpostores)/(math.sqrt(sClientes**2 + sImpostores**2))
    print("d':", "{:.5}".format(dPrime))

    # curva ROC
    if int(args[4]):
        FN, FP = np.array(FN), np.array(FP)
        plotROC(FN,FP)


def readScores(path):
    data = pd.read_table(path,header=None,sep=" ")
    return data.ix[:,1].as_matrix()
def plotROC(FN, FP):
    plt.plot(FN, 1 - FP)
    plt.xlabel("FN")
    plt.ylabel("1 - FP")
    plt.title("ROC")
    plt.grid(True)
    plt.show()   

if __name__ == "__main__":
    
    if len(sys.argv) != 5:
        print("roc.py <pathClients> <pathImpostores> <X> <print ROC (0/1)>")
        exit(1)
    
    main(sys.argv)
