import numpy as np

def main():
	# data
	x = np.array(([2,9],[1,5],[3,6]),dtype=float)
	y = np.array(([92],[86],[89]),dtype=float)
	x = x/np.amax(x,axis=0)
	y = y/100
	# train
	nn = NN()
	for i in range(10000):
		nn.train(x,y)
		if not i%1000:
			loss = np.mean(np.square(y-nn.forward(x)))
			print("Iteration: ", i, " Loss: ",loss)
	# test
	output = nn.forward(x)
	print(output)
	print(y)

class NN(object):
	def __init__(self):
		# layers
		self.inputSize = 2
		self.outputSize = 1
		self.hiddenSize = 3
		# weights
		self.w1 = np.random.randn(self.inputSize,self.hiddenSize)	            
		self.w2 = np.random.randn(self.hiddenSize,self.outputSize)	            
	def forward(self,x):
		self.z = np.dot(x,self.w1)
		self.z2 = self.sigmoid(self.z)
		self.z3 = np.dot(self.z2,self.w2)
		out = self.sigmoid(self.z3)
		return out
	def sigmoid(self,s):
		return 1/(1+np.exp(-s))
	def sigmoidPrime(self,s):
		return s*(1-s)
	def backward(self,x,y,o):
		self.error = y - o
		self.delta = self.error*self.sigmoidPrime(o)
		self.errorZ2 = self.delta.dot(self.w2.T)
		self.deltaZ2 = self.errorZ2*self.sigmoidPrime(self.z2)
		self.w1 += x.T.dot(self.deltaZ2)
		self.w2 += self.z2.T.dot(self.delta)
	def train(self,x,y):
		out = self.forward(x)
		self.backward(x,y,out)

main()



