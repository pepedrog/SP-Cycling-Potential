#from mailjet_rest import Client
#import os
"""
api_key = '02dd0682fad533c1939d6c153ffd20aa'
api_secret = 'f9e62e49c49a5c7f7936fd254ed0bc52'
mailjet = Client(auth=(api_key, api_secret), version='v3.1')
data = {
  'Messages': [
    {
      "From": {
        "Email": "gigeck.pedro@usp.br",
        "Name": "Pedro"
      },
      "To": [
        {
          "Email": "gigeck.pedro@usp.br",
          "Name": "Pedro"
        }
      ],
      "Subject": "Greetings from Mailjet.",
      "TextPart": "My first Mailjet email",
      "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
      "CustomID": "AppGettingStartedTest"
    }
  ]
}
result = mailjet.send.create(data=data)
print result.status_code
print result.json()
"""

import requests

requests.post(
        " https://api.mailgun.net/v3/sandbox9f10f5415ca04c9ea19077b3e450d459.mailgun.org",
        auth=("api", "f06b531c505c3ba8f6d19c85e5418f23-443ec20e-bade6161"),
        data={"from": "",
              "to": ["gigeck.pedro@usp.br"],
              "subject": "Hello",
              "text": "Testing some Mailgun awesomness!"})

