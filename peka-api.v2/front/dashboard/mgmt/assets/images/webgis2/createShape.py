import numpy as np
import cv2
from colour import Color
import matplotlib.pyplot as plt

rng = 10

red = Color("#d088fc")
colors = list(red.range_to(Color("#9d03fc"),10))
print(colors[0].rgb[0])

for i,x in enumerate(colors):
	r,g,b = int(x.rgb[0]*255), int(x.rgb[1]*255), int(x.rgb[2]*255)
	print(r, g, b)
	nimg = np.zeros((100,100,4)).astype(np.uint8)
	#nimg = cv2.circle(nimg, (50,50), 50, (b,g,r,255), thickness=-1)
	nimg[:,:,0]=b
	nimg[:,:,1]=g
	nimg[:,:,2]=r
	nimg[:,:,3]=255
	cv2.imwrite(str((i+1)*10)+"r.png",nimg)
	# plt.imshow(nimg)
	# plt.show()