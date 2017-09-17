# MIARFID - Lingüística computacional - Práctica 1
# Juan B. Pedro Costa. Valencia, Septiembre de 2017.
# A partir del corpus dado se require una serie de cuestiones con el objetivo
# de poder calcular las probabilidades léxicas y de emisión de cualquier
# palabra incluída en la cadena.

# corpus
cadena = "El/DT perro/N come/V carne/N de/P la/DT carnicería/N y/C de/P la/DT nevera/N y/C canta/V el/DT la/N la/N la/N ./Fp"

# main
def main():
    print(" 0. Corpus:")
    print(cadena)
    # listas de palabras y categorias
    words = list()
    cat = list()
    # separar cadena en palabras y categorias
    for i in cadena.split():
        aux = i.split("/")
        words.append(aux[0].lower())
        cat.append(aux[1])
    # 1. Obtener un diccionario, que para cada categoría, muestre su frecuencia.
    #Ordenar el resultado alfabéticamente por categoría.
    fc = catFrec(cat)
    print()
    print(" 1. Diccionario con frecuencias de categorías:")
    print(fc)
    # 2. Obtener un diccionario, que para cada palabra, muestre su frecuencia,
    # y una lista de sus categorías morfosintácticas con su respectiva frecuencia.
    # Mostrar el resultado ordenado alfabéticamente por palabra.
    wc = wordFrec(words,cat)
    print()
    print(" 2. Diccionario con frecuencias de palabras:")
    print(wc)
    # 3. Calcular la frecuencia de todos los bigramas de la cadena,
    # considerar un símbolo inicial <S> y un símbolo final </S> para la cadena.
    fb = bigFrec(cat);
    print()
    print(" 3. Frecuencia de los bigramas en el corpus:")
    print(fb)
    # 4. Construir una función que devuelva las probabilidades léxicas P(C|w) y de emisión
    #P(w|C) para una palabra dada (w) para todas sus categorías (C) que aparecen en el
    #diccionario construido anteriormente. Si la palabra no existe en el diccionario debe
    #decir que la palabra es desconocida.
    while(True):
        print()
        print("Intoducir <w> (exit para salir): ", end="")
        w = input()
        if w == "EXIT" or w == "exit":
            break;
        else:
            prob(len(words),w,wc,fc)
    print("Fin")
    print()

# Funciones

# Cálculo de probabilidades, regla de Bayes.
def prob(n,w,wc,fc):
    # comprobar que la palabara está en el corpus
    if w in wc:
        # P(C|w) = P(C,w)/P(w)
        # P(w|C) = P(C|w)*P(w)/P(C)
        Pw = wc[w][0]/n
        PcDw = []
        for i in wc[w][1]:
            Pcw = wc[w][1][i]/n
            PcDw = Pcw/Pw
            Pc = fc[i]/n
            PwDc = PcDw*Pw/Pc
            print("P ( "+i+" | "+w+" ) = "+str(PcDw))
            print("P ( "+w+" | "+i+" ) = "+str(PwDc))
    else:
        print("Palabra desconocida.")

# diccionario de frecuencias de categorias
def catFrec(cat):
    DC = {}
    for i in cat:
        if i in DC:
            DC[i] += 1
        else:
            DC[i] = 1
    return ordenar(DC)

# diccionario de frecuencias de palabras
def wordFrec(words,cat):
    DP = {}
    for i in words:
        if i in DP:
            DP[i][0] += 1
        else:
            DP[i] = [1, {}]
    # añadir frecuencia de categorias
    for i, j in zip(words,cat):
        if j in DP[i][1]:
            DP[i][1][j] += 1
        else:
            DP[i][1][j] = 1
    return ordenar(DP)

# Frecuencias de los bigramas
def bigFrec(cat):
    Fb = {}
    Fb['<S>',cat[0]] = 1
    Fb[cat[len(cat)-1],'</S>'] = 1
    for i in range(len(cat)-1):
        if (cat[i],cat[i+1]) in Fb:
            Fb[cat[i],cat[i+1]] += 1
        else:
            Fb[cat[i],cat[i+1]] = 1
    return Fb;

# ordenar alfabéticamente
def ordenar(dic):
    s = {}
    aux = sorted(dic)
    for i in aux:
        s[i] = dic[i]
    return s;

# entrada de datos y ejecución del main
import sys
if len(sys.argv) != 1:
    print("p1.py no require parámetros de entrada.")
    exit(1)
print(" A partir del corpus definido se devuelven las probabilidades léxicas y de emisión de <w> para cada categoría.")
print()
main()
