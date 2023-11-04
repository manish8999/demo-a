const express = require('express');

const app = express();
const port = 3005;

const linkMap = new Map();

function generateShortLink() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shortLink = '';

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortLink += characters.charAt(randomIndex);
  }

  return shortLink;
}

function storeShortLink(longLink) {
  const shortLink = generateShortLink();

  if (linkMap.has(shortLink)) {
    return storeShortLink(longLink); 
  }

  linkMap.set(shortLink, longLink);
  return shortLink;
}

app.get('/:shortLink', async (req, res) => {
  const shortLink = req.params.shortLink;

  if (linkMap.has(shortLink)) {
    const originalURL = linkMap.get(shortLink);
    res.redirect(originalURL);
  } else {
    res.status(404).send('Link not found');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const shortLink1 = storeShortLink('https://dev.bitly.com/api-reference/#verifyWebhook');
const shortLink2 = storeShortLink('https://app.signalz.ai/?utm_source=Referral&utm_campaign=Referral&utm_medium=${reqUser.referralCode}');
console.log(`mvp-prod.signalz.ai/${shortLink1}`);
console.log(`localhost:3005/${shortLink2}`);



const axios = require('axios');

// const text = 'Hi {#var#}, Your friend {#var#} has invited you to a 7 day free trial of Signalz.ai . Use the referral link to download the app & sign up https://app.signalz.ai/?utm_source=Referral&utm_campaign=Referral&utm_medium=${reqUser.referralCode}';

// const sendKaleyraOTP = async () => {
//   const url = 'https://api.kaleyra.io/v1/HXIN1771403289IN/messages';

//   const to = '918999702961';
//   const type = 'TXN';
//   const sender = 'SGNALZ';
//   const body = 'Hi {#var#}, Your friend {#var#} has invited you to a 7 day free trial of Signalz.ai . Use the referral link to download the app & sign up https://app.signalz.ai/?utm_source=Referral&utm_campaign=Referral&utm_medium=${reqUser.referralCode}';
//   const templateIds = '1107169658520773830';

//   const data = new URLSearchParams();
//   data.append('to', to);
//   data.append('type', type);
//   data.append('sender', sender);
//   data.append('body', body);
//   data.append('template_id', templateIds);



// }
//   const config = {
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'api-key': 'A43849e288bddbc4583df401b7f4e32f9',
//     },
//   };

//   try {
//     const response = await axios.post(url, data, config);
//     console.log('Response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error:', error);
//     throw error;
//   }
// };

// Usage:
//   function sendLongSMS(text, maxChars = 160) {
//     if (text.length <= maxChars) {
//         // If the text length is less than or equal to the maxChars, send it as a single SMS
//         sendSMS(text);
//     } else {
//         // Divide the long text into chunks of maxChars and send as separate SMSs
//         const numSegments = Math.ceil(text.length / maxChars);
//         for (let i = 0; i < numSegments; i++) {
//             const start = i * maxChars;
//             const end = (i + 1) * maxChars;
//             const segment = text.substring(start, end);
//             sendSMS(segment);
//         }
//     }
// }

// function sendSMS(text) {
//     axios.post('https://api.kaleyra.io/v1/HXIN1771403289IN/messages', {
//       to : '918999702961',
//       type : 'TXN',
//       sender : 'SGNALZ',
//         message: text,
//         templateIds : '1107169658520773830',
//     }, {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'api-key': 'A43849e288bddbc4583df401b7f4e32f9',
//           'unicode' : '1'
//         }
//     })
//     .then(response => {
//         console.log('Message sent:', response.data);
//     })
//     .catch(error => {
//         console.error('Error sending message:', error);
//     });
// }

// // Example usage:
// const longText = "Hi {#var#}, Your friend {#var#} has invited you to a 7 day free trial of Signalz.ai . Use the referral link to download the app & sign up https://app.signalz.ai/?utm_source=Referral&utm_campaign=Referral&utm_medium=${reqUser.referralCode}";
// sendLongSMS(longText, 150); // Set your desired maxChars value here

// const sendKaleyraOTP = async () => {
//   const url = 'https://api.kaleyra.io/v1/HXIN1771403289IN/messages';

//   const to = '918999702961';
//   const type = 'TXN';
//   const sender = 'SGNALZ';

//   const body = 'Hi {#var#}, Your friend {#var#} has invited you to a 7 day free trial of Signalz.ai . Use the referral link to download the app & sign up';
//   const templateIds = '1107169658520773830';

//   const data = new URLSearchParams();
//   data.append('to', to);
//   data.append('type', type);
//   data.append('sender', sender);
//   data.append('body', body);
//   data.append('template_id', templateIds);

//   const config = {
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'api-key': 'A43849e288bddbc4583df401b7f4e32f9',
//     },
//   };

//   try {
//     const response = await axios.post(url, data, config);
//     console.log('Response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error:', error);
//     throw error;
//   }
// };

// // Usage:
// sendKaleyraOTP()
//   .then((result) => {
//     console.log('SMS sent successfully:', result);
//   })
//   .catch((error) => {
//     console.error('Error sending SMS:', error);
//   });



// async function sendKaleyraOTP(message) {
//   const url = 'https://api.kaleyra.io/v1/HXIN1771403289IN/messages';
//   const to = '918999702961';
//   const type = 'TXN';
//   const sender = 'SGNALZ';
//   const templateIds = '1107169658520773830';

//   const messagePart1 = message.slice(0, Math.ceil(message.length / 2));
//   const messagePart2 = message.slice(Math.ceil(message.length / 2));
// console.log(messagePart1,"messagePart1===")
// console.log(messagePart2,"messagePart2===")

//   await sendSMS(messagePart1, to, type, sender, templateIds);

//   await sendSMS(messagePart2, to, type, sender, templateIds);
// }

// async function sendSMS(text, to, type, sender, templateIds) {

//   const data = new URLSearchParams();
//   data.append('to', to);
//   data.append('type', type);
//   data.append('sender', sender);
//   data.append('body', text);
//   data.append('template_id', templateIds);

//   const config = {
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'api-key': 'A43849e288bddbc4583df401b7f4e32f9',
//       "unicode":"1"
//     },
//   };

//   try {
//     const url = 'https://api.kaleyra.io/v1/HXIN1771403289IN/messages';
//     const response = await axios.post(url, data, config);
//     console.log('Response:', response.data);
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }

// // Usage:
// const message = 'Hi {#var#}, Your friend {#var#} has invited you to a 7 day free trial of Signalz.ai. Use the referral link to download the app & sign up https://app.signalz.ai/?utm_source=Referral&utm_campaign=Referral&utm_medium=${reqUser.referralCode}';
// sendKaleyraOTP(message)
//   .then(() => {
//     console.log('SMS sent successfully');
//   })
//   .catch(error => {
//     console.error('Error sending SMS:', error);
//   });



// async function sendKaleyraOTP(message, templateIds) {
//   const url = 'https://api.kaleyra.io/v1/HXIN1771403289IN/messages';
//   const to = '918999702961';
//   const type = 'TXN';
//   const sender = 'SGNALZ';

//   const messagePart1 = message.slice(0, Math.ceil(message.length / 2));
//   const messagePart2 = message.slice(Math.ceil(message.length / 2));

//   await sendSMS(messagePart1, to, type, sender, templateIds);
//   await sendSMS(messagePart2, to, type, sender, templateIds);
// }

// async function sendSMS(text, to, type, sender, templateIds) {
//   const data = new URLSearchParams();
//   data.append('to', to);
//   data.append('type', type);
//   data.append('sender', sender);
//   data.append('body', text);
//   data.append('template_id', templateIds); // Use the same template ID

//   const config = {
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'api-key': 'A43849e288bddbc4583df401b7f4e32f9',
//       "unicode": "1"
//     },
//   };

//   try {
//     const url = 'https://api.kaleyra.io/v1/HXIN1771403289IN/messages';
//     const response = await axios.post(url, data, config);
//     console.log('Response:', response.data);
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }

// // Usage:
// const message = 'Hi {#var#}, Your friend {#var#} has invited you to a 7 day free trial of Signalz.ai. Use the referral link to download the app & sign up https://app.signalz.ai/?utm_source=Referral&utm_campaign=Referral&utm_medium=${reqUser.referralCode}';
// const templateIds = '1107169658520773830'; // Use the same template ID
// sendKaleyraOTP(message, templateIds)
//   .then(() => {
//     console.log('SMS sent successfully');
//   })
//   .catch(error => {
//     console.error('Error sending SMS:', error);
//   });



// async function sendKaleyraMultiPartUnicodeOTP(message) {
//   const url = 'https://api.kaleyra.io/v1/HXIN1771403289IN/messages';
//   const to = '918999702961';
//   const type = 'TXN';
//   const sender = 'SGNALZ';

//   const templateIds = '1107169658520773830';
//   const unicodeMessage = toUTF16(message);

//   const segments = splitMessage(unicodeMessage, 67);

//   const multiPartSegments = prepareMultiPartSegments(segments);

//   for (const segment of multiPartSegments) {
//     await sendSMS(segment, to, type, sender, templateIds);
//   }
// }

// async function sendSMS(text, to, type, sender, templateIds) {
//   const data = new URLSearchParams();
//   data.append('to', to);
//   data.append('type', type);
//   data.append('sender', sender);
//   data.append('body', text);
//   data.append('template_id', templateIds);
//   data.append('unicode', '1');

//   const config = {
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'api-key': 'A43849e288bddbc4583df401b7f4e32f9',
//     },
//   };

//   try {
//     const url = 'https://api.kaleyra.io/v1/HXIN1771403289IN/messages';

//     const response = await axios.post(url, data, config);
//     console.log('Response:', response.data);
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }

// function toUTF16(str) {
//   return Array.from(str)
//     .map(char => char.charCodeAt(0).toString(16).toUpperCase())
//     .join('');
// }

// function splitMessage(text, maxChars) {
//   const segments = [];
//   for (let i = 0; i < text.length; i += maxChars) {
//     segments.push(text.slice(i, i + maxChars));
//   }
//   return segments;
// }

// function prepareMultiPartSegments(segments) {
//   const multiPartSegments = [];
//   for (let i = 0; i < segments.length; i += 29) {
//     const segmentSlice = segments.slice(i, i + 29);
//     multiPartSegments.push(segmentSlice.join(''));
//   }
//   return multiPartSegments;
// }

// const message = 'Hi {#var#}, Your friend {#var#} has invited you to a 7 day free trial of Signalz.ai . Use the referral link to download the app & sign up {#var#}'; // Replace with your message
// sendKaleyraMultiPartUnicodeOTP(message)
//   .then(() => {
//     console.log('Multi-part SMS sent successfully');
//   })
//   .catch(error => {
//     console.error('Error sending multi-part SMS:', error);
//   });




// const sendKaleyraOTP = async () => {
//   const url = 'https://api.kaleyra.io/v1/HXIN1771403289IN/messages';

//   const to = '918999702961';
//   const type = 'TXN';
//   const sender = 'SGNALZ';
//   const body = 'Hi Manish, Your friend Saad has invited you to a 7 day free trial of Signalz.ai . Use the referral link to download the app & sign up https://app.signalz.ai/?utm_source=Referral&utm_campaign=Referral&utm_medium=${reqUser.referralCode}';
//   const templateIds = '1107169658520773830';

//   const data = new URLSearchParams();
//   data.append('to', to);
//   data.append('type', type);
//   data.append('sender', sender);
//   data.append('body', body);
//   data.append('template_id', templateIds);

//   const config = {
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'api-key': 'A43849e288bddbc4583df401b7f4e32f9',
//     },
//   };

//   try {
//     const response = await axios.post(url, data, config);
//     console.log('Response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error:', error);
//     throw error;
//   }
// };

// // Usage:
// sendKaleyraOTP()
//   .then((result) => {
//     console.log('SMS sent successfully:', result);
//   })
//   .catch((error) => {
//     console.error('Error sending SMS:', error);
//   });