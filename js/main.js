window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./sw.js');
  }

  let notification_element = document.getElementById("notification");
  if ('Notification' in window && Notification.permission != 'granted') {	
    console.log('Ask user permission')
    Notification.requestPermission(status => {  
        console.log('Status:'+status);
		notification_element.innerHTML = status;
        displayNotification('Notification Enabled');
    });
 } else if('Notification' in window && Notification.permission == 'granted') {
	notification_element.innerHTML = "granted";
 } else if(!("Notification" in window)){
	notification_element.innerHTML = "Notification not supported";
 }


// ask for notification permission
const displayNotification = notificationTitle => {
    console.log('display notification')
    if (Notification.permission == 'granted') {
        navigator.serviceWorker.getRegistration().then(reg => {
            console.log(reg)
            const options = {
                    body: 'Thanks for allowing push notification !',
                    icon:  '../images/icons/anyicon.png',
                    vibrate: [100, 50, 100],
                    data: {
                      dateOfArrival: Date.now(),
                      primaryKey: 0
                    }
                  };
    
            reg.showNotification(notificationTitle, options);
        });
    }
};


// notification subscription
const updateSubscriptionOnYourServer = subscription => {
    console.log('Write your ajax code here to save the user subscription in your DB', subscription);
	// alert("Subscription: "+JSON.stringify(subscription));
	//set subscription to html element
	document.getElementById("subscription").innerHTML = JSON.stringify(subscription);

    // write your own ajax request method using fetch, jquery, axios to save the subscription in your server for later use.
};

const subscribeUser = async () => {
    const swRegistration = await navigator.serviceWorker.getRegistration();
    const applicationServerPublicKey = 'BL2LMRMe0DTLfKBJaQJP8-FH5q6ni2w3ePRBkXAQRdc4JU61UROpsK5qebogDv1IRCqvTBBkZ4aI_dWJihi2PeE'; // paste your webpush certificate public key
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey
    })
    .then((subscription) => {
        console.log('User is subscribed newly:', subscription);
        updateSubscriptionOnServer(subscription);
    })
    .catch((err) => {
        if (Notification.permission === 'denied') {
          console.warn('Permission for notifications was denied')
        } else {
          console.error('Failed to subscribe the user: ', err)
        }
    });
};
const urlB64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/')

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

const checkSubscription = async () => {
    const swRegistration = await navigator.serviceWorker.getRegistration();
    swRegistration.pushManager.getSubscription()
    .then(subscription => {
        if (!!subscription) {
            console.log('User IS Already subscribed.');
            updateSubscriptionOnYourServer(subscription);
        } else {
            console.log('User is NOT subscribed. Subscribe user newly');
            subscribeUser();
        }
    });
};

// implement payment button
const applePayButton = document.querySelector('#apple-pay-button');
const paymentButton = document.querySelector('#payment-button');

const applePayMethod = {
  supportedMethods: 'https://apple.com/apple-pay',
  data: {
    version: 3,
    merchantIdentifier: 'merchant.whatpwacando.today',
    merchantCapabilities: ['supports3DS', 'supportsCredit', 'supportsDebit'],
    supportedNetworks: ['amex', 'discover', 'masterCard', 'visa', 'maestro'],
    countryCode: 'US',
  },
};

const cardMethod = {
  supportedMethods: 'basic-card',
  data: {
    supportedNetworks: ['visa', 'mastercard'],
	supportedTypes: ['credit', 'debit']
  }
};

const paymentDetails = {
  id: 'order-123',
  displayItems: [
    {
      label: 'PWA Demo Payment',
      amount: {currency: 'USD', value: '0.01'}
    }
  ],
  total: {
    label: 'Total',
    amount: {currency: 'USD', value: '0.01'}
  }
};

if(applePayButton) {
  applePayButton.addEventListener('click', async () => {
    const request = new PaymentRequest([applePayMethod], paymentDetails);
    const response = await request.show();

    console.log(response);
  });
}

if(paymentButton) {
  paymentButton.addEventListener('click', async () => {
    const request = new PaymentRequest([cardMethod], paymentDetails);
    const response = await request.show();

    console.log(response);
  });
}    
    

checkSubscription();

}
