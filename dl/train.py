"""Train real image classifiers; run separately for plant_detector and species_classifier.
Dataset format: dataset_root/<class_name>/*.jpg. Use independently collected images.
"""
import argparse
import json
from pathlib import Path
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import numpy as np

parser=argparse.ArgumentParser()
parser.add_argument('--data',required=True,help='Directory with one subfolder per class')
parser.add_argument('--name',choices=['plant_detector','species_classifier'],required=True)
parser.add_argument('--epochs',type=int,default=20)
args=parser.parse_args()
output=Path(__file__).parent/'artifacts';output.mkdir(exist_ok=True)
# Note: random image-level splits can leak near-duplicates. Group images by plant/source
# before final experiments and keep an independent test set.
train=tf.keras.utils.image_dataset_from_directory(args.data,validation_split=.2,subset='training',seed=42,image_size=(224,224),batch_size=32)
val=tf.keras.utils.image_dataset_from_directory(args.data,validation_split=.2,subset='validation',seed=42,image_size=(224,224),batch_size=32,shuffle=False)
labels=train.class_names
(output/f'{args.name}_labels.json').write_text(json.dumps(labels,indent=2))
augment=tf.keras.Sequential([tf.keras.layers.RandomFlip('horizontal'),tf.keras.layers.RandomRotation(.08),tf.keras.layers.RandomZoom(.12)])
base=tf.keras.applications.MobileNetV2(input_shape=(224,224,3),include_top=False,weights='imagenet')
base.trainable=False
inputs=tf.keras.Input((224,224,3))
x=augment(inputs)
x=tf.keras.applications.mobilenet_v2.preprocess_input(x)
x=base(x,training=False)
x=tf.keras.layers.GlobalAveragePooling2D()(x)
x=tf.keras.layers.Dropout(.25)(x)
outputs=tf.keras.layers.Dense(len(labels),activation='softmax')(x)
model=tf.keras.Model(inputs,outputs)
model.compile(optimizer='adam',loss='sparse_categorical_crossentropy',metrics=['accuracy'])
history=model.fit(train,validation_data=val,epochs=args.epochs,callbacks=[tf.keras.callbacks.EarlyStopping(patience=4,restore_best_weights=True)])
model.save(output/f'{args.name}.keras')
for metric in ('accuracy','loss'):
    plt.figure();plt.plot(history.history[metric],label='Train');plt.plot(history.history['val_'+metric],label='Validation');plt.xlabel('Epoch');plt.ylabel(metric);plt.legend();plt.tight_layout();plt.savefig(output/f'{args.name}_{metric}.png');plt.close()
y_true=np.concatenate([y.numpy() for _,y in val]);y_pred=np.argmax(model.predict(val),axis=1)
(output/f'{args.name}_report.txt').write_text(classification_report(y_true,y_pred,target_names=labels,zero_division=0)+'\nConfusion matrix:\n'+str(confusion_matrix(y_true,y_pred)))
print('Validation evaluation complete. Independent held-out test set is still required.')
