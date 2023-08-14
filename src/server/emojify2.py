import random
from emojify.emojify import *

class Emoji(object):
    def __init__(self):
        self.model = train()

    def emojify(self, sentence):
        return emojify_given_model(sentence, self.model)
