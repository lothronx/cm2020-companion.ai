import time

class Companion(object):
    def __init__(self):
        self.discussion = {} # key: timestamp # value: [boolean, sentence]

    def ask_question(self, question):
        # TODO
        self.discussion[time.time()] = [True, question]
        # 1) send question chatgpt, get reponse
        response = None
        self.discussion[time.time()] = [False, question]
        self.save()
        return response

    def __save__(self):
        #TODO write self.discussion to database
        pass
