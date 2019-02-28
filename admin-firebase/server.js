const express = require('express')
const admin = require('firebase-admin');
const axios= require('axios')

const router = express.Router()
const app = express()



app.use(express.urlencoded({ extended: false}));



const serviceAccount = require('./filekeyBAPR.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: 'https://trypush-964b7.firebaseio.com'
});

var registrationToken = 'cvkgWmoh8Tg:APA91bFb3Owk5O_9qt61PKFW-zPP6fCBsEYAlZp03pzHhPm4wDcRr40DeH3M4vfboGPtl8hrRfYzj0Dmr2yfRp73X_QP6qG-tE-MmYHfBu13-igB-zNCp_i9J6uDFzxdFGsJDngMr18a';

var message = {
    // data: {
    //   score: '850',
    //   time: '2:45'
    // },
    notification: {
        title: 'HALO',
        body: 'apa kabar?',
      },
    token: registrationToken
  };


 


app.get('/', (req, res) => {
  
  admin.messaging().send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
    res.status(200).json({message: JSON.stringify(response)})
  })
  .catch((error) => {
    console.log('Error sending message:', error);
    res.status(400).json(error)
  });
})

app.use('/sent', router.post('/', async (req, res) => {
    let {token, title, text, userid, type}= req.body

    let createMsg= await axios.post('http://fotostudio.id/api/message/create.php', {
      MSG_USER_ID: userid,
      MSG_TITLE: title,
      MSG_TEXT: text,
      MSG_TYPE: type
    })

    // console.log("message will sent :", createMsg)
    // res.status(200).json({message: "sent"})
    
    admin.messaging().send({
      notification: {
        title: title,
        body: text,
      },
      token: token

    })
    .then( async (response) => {
      console.log('Successfully sent message:', response);
      let records = createMsg.data.records
      await axios.post('http://fotostudio.id/api/message/sent.php', {
        MSG_ID: records.MSG_ID,
      })
      res.status(200).json({
        messageID: records.MSG_ID,
        message: "messsage sent to :" + JSON.stringify(response)
      })
    })
    .catch((error) => {
      console.log('Error sending message:', error);
      res.status(400).json(error)
    });
    



    // res.status(200).json({token, text, userid})
  }) 
)



 
app.listen(3000, () => console.log("okeee"))