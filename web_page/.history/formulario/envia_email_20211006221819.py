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

def send_simple_message():
	return requests.post(
		"https://api.mailgun.net/v3/sandbox9f10f5415ca04c9ea19077b3e450d459.mailgun.org",
		auth=("api", "YOUR_API_KEY"),
		data={"from": "Excited User <mailgun@YOUR_DOMAIN_NAME>",
			"to": ["bar@example.com", "YOU@YOUR_DOMAIN_NAME"],
			"subject": "Hello",
			"text": "Testing some Mailgun awesomness!"})

print(send_simple_message())

