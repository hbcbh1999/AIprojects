import pandas as pd
fruits = pd.read_table('data.txt')
feature_names = ['mass', 'width', 'height', 'color_score']
X = fruits[feature_names]
y = fruits['fruit_label']

from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=0)
from sklearn.preprocessing import MinMaxScaler
scaler = MinMaxScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

import numpy as np
np.savetxt('X_train.txt', X_train, delimiter='\t')
np.savetxt('X_test.txt', X_test, delimiter='\t')
np.savetxt('y_train.txt', y_train, delimiter='\t')
np.savetxt('y_test.txt', y_test, delimiter='\t')
