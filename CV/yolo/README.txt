Yolo V3 - Pytorch
Juan B. Pedro Costa
juansensio03@gmail.com
VPC, MIRAFID, UPV
Mayo, 2018

INTRODUCCIÓN

En este trabajo se ha implementado YOLO V3 [1] en Pytorch [2].
YOLO es una red convolucional con 75 capas.
Dada una imágen de entrada, es capaz de predecir un número determinado 
de cajas y la clase detecatada en su interior.
Usando imágenes de 416x416, YOLO predice 10647 cajas. 
Para reducir este número al total de objetos a reconocer en la imágen 
usaremos técnicas de Non-maximum Suppression.
Las clases que YOLO puede predecir son las de COCO dataset (80 clases).

REQUISITOS

Python 3.5
Pytorch 0.4
OpenCV 3.0

DOCUMENTOS ADJUNTOS

darknet.ipynb -> notebook explicando como construir el modelo. 
darknet.py -> implementación de lo explicado en el notebook.
yoloV3.ipynb -> notebook explicando como usar el modelo con una imágen
yoloV3.py -> implementación potente para usar el modelo con muchas imágenes a la vez y GPU.
*a veces se crean archivos ocultos en la carpeta imgs y al correr el sript a error
al intentar cargarlos como imágenes !

BIBILIOGRAFÍA

[1] https://pjreddie.com/media/files/papers/YOLOv3.pdf

[2] https://blog.paperspace.com/how-to-implement-a-yolo-object-detector-in-pytorch/

