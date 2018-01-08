from __future__ import print_function
import keras
from keras.datasets import cifar10
from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation, Flatten
from keras.layers import Conv2D, MaxPooling2D
from keras.callbacks import LearningRateScheduler, Callback
from keras.layers import GaussianNoise as GN
from keras.layers.normalization import BatchNormalization as BN
from keras.optimizers import SGD
import matplotlib.pyplot as plt
import math
from keras.preprocessing.image import ImageDataGenerator

batch_size = 128
num_classes = 10
epochs = 100

# DATA
(x_train, y_train), (x_test, y_test) = cifar10.load_data()
x_train = x_train.astype('float32')
x_test = x_test.astype('float32')
x_train /= 255
x_test /= 255
y_train = keras.utils.to_categorical(y_train, num_classes)
y_test = keras.utils.to_categorical(y_test, num_classes)
# data augmentation
datagen = ImageDataGenerator(zoom_range=0.2,width_shift_range=0.2,height_shift_range=0.2,horizontal_flip=True,vertical_flip=False)
test_datagen = ImageDataGenerator()
datagen.fit(x_train)
test_datagen.fit(x_test)

# TOPO
model = Sequential()
model.add(Conv2D(32, (3, 3), padding='same',input_shape=x_train.shape[1:]))
model.add(BN())
model.add(GN(0.3))
model.add(Activation('relu'))
# model.add(Conv2D(32, (3, 3), padding='same',input_shape=x_train.shape[1:]))
# model.add(BN())
# model.add(GN(0.3))
# model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))

model.add(Conv2D(64, (3, 3), padding='same'))
model.add(BN())
model.add(GN(0.3))
model.add(Activation('relu'))
# model.add(Conv2D(64, (3, 3), padding='same'))
# model.add(BN())
# model.add(GN(0.3))
# model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))

model.add(Conv2D(128, (3, 3), padding='same'))
model.add(BN())
model.add(GN(0.3))
model.add(Activation('relu'))
# model.add(Conv2D(128, (3, 3), padding='same'))
# model.add(BN())
# model.add(GN(0.3))
# model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))

model.add(Conv2D(512, (3, 3), padding='same'))
model.add(BN())
model.add(GN(0.3))
model.add(Activation('relu'))
model.add(Conv2D(512, (3, 3), padding='same'))
# model.add(BN())
# model.add(GN(0.3))
# model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))

model.add(Flatten())
model.add(Dense(512)) # tiene que ser parecido a la salida de la convolucional
model.add(BN())
model.add(GN(0.3))
model.add(Activation('relu'))   
model.add(Dense(num_classes))
model.add(Activation('softmax'))

model.summary()

# CALLBACKS
# learning rate schedule
def step_decay(epoch):
    if epoch < 10:
        return 0.1
    if epoch < 30:
        return 0.01
    else:
        return 0.001

# error evolution
filepath='weigths.hdf5'
save=True
err = []
class TestCallback(Callback):
    def __init__(self, test_data):
        self.test_data = test_data
        self.best = 100.

    def on_epoch_end(self, epoch, logs={}):
        #score = model.evaluate(x_test, y_test)
        score = model.evaluate_generator(test_datagen.flow(x_test, y_test,batch_size=batch_size), steps=100)
        error = 100 - score[1]*100
        print('\nTesting error: {} %\n'.format(error))
        err.append(error)
        if error < self.best and save:
            self.best = error
            model.save_weights(filepath)
            print("Best error, printing weigths")

# callbacks list
lrate = LearningRateScheduler(step_decay)
error = TestCallback((x_test, y_test))
callbacks_list = [lrate, error]

#opt = keras.optimizers.rmsprop(lr=0.0001, decay=1e-6)
sgd = SGD(lr=0.1, momentum=0.9, decay=0.0, nesterov=False)
#model.compile(loss='categorical_crossentropy',optimizer=opt,metrics=['accuracy'])
model.compile(loss='categorical_crossentropy',optimizer=sgd,metrics=['accuracy'])

load=False
if load:
    model.load_weights(filepath, by_name=False)
#model.fit(x_train, y_train,batch_size=batch_size,epochs=epochs,shuffle=True,callbacks=callbacks_list)
model.fit_generator(datagen.flow(x_train, y_train,batch_size=batch_size),
    steps_per_epoch=x_train.shape[0]//batch_size,epochs=epochs,
    callbacks=callbacks_list,verbose=1)

# plot results
plt.plot(range(0,epochs),err,'r')
plt.plot(range(0,epochs),err,'.k')
plt.title('Error evolution')
plt.xlabel('Epoch')
plt.ylabel('Error (%)')
plt.grid()
plt.show()
