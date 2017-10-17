import Uuid from 'uuid'
import models from '../models'

class LogHelper {
  get(uuid,accountId) {
	var p = new Promise(
		function(resolve,reject){
	
	models.log.findOne({where: {
      accountUuid: accountId,
      uuid: uuid
    }})
      .then(log => {
        return resolve(log)
      })
      .catch(err => {
        reject(err);
      })
	});
	return p;
  }

  index(accountId) {
   var p = new Promise(
		function(resolve,reject){
	
	models.log.findOne({where: {
      accountUuid: accountId,
      
    }})
      .then(log => {
        return resolve(log)
      })
      .catch(err => {
        reject(err);
      })
	});
	return p;
  }
  
  userCreated(accountUuid,userUuid,userEmail)
  {
      var log = models.log.build({ 
      accountUuid:      accountUuid,
      userUuid:         userUuid,
      userEmail:        userEmail,
      eventType:        "userCreated",    
    })

    log.save()
      .catch(err => {
        console.log(err)
      });
  }
  
  userRegistered(accountUuid,userUuid,userEmail)
  {
      var log = models.log.build({ 
      accountUuid:      accountUuid,
      userUuid:         userUuid,
      userEmail:        userEmail,
      eventType:        "userRegistered",    
    })

    log.save()
      .catch(err => {
        console.log(err)
      });
  }
  
  userLoggedIn(accountUuid,userUuid,userEmail)
  {
     var log = models.log.build({ 
      accountUuid:      accountUuid,
      userUuid:         userUuid,
      userEmail:        userEmail,
      eventType:        "userLoggedIn",
    })

    log.save()
      .catch(err => {
        console.log(err)
      });
    
  } 
  
  createObject(accountUuid,userUuid,objectUuid,userEmail,objectType)
  {
     var log = models.log.build({ 
      accountUuid:      accountUuid,
      userUuid:         userUuid,
      objectUuid:     objectUuid,     
      userEmail:        userEmail,
      eventText:        objectType,
      eventType:        "createObject",
    })

    log.save()
      .catch(err => {
        console.log(err)
      });
  } 
  
  
  readObject(accountUuid,userUuid,objectUuid,userEmail,objectType)
  {
      var log = models.log.build({ 
      accountUuid:      accountUuid,
      userUuid:         userUuid,
      objectUuid:     objectUuid,     
      userEmail:        userEmail,
      eventText:        objectType,
      eventType:        "readObject",
    })

    log.save()
      .catch(err => {
        console.log(err)
      });
  } 
  
  updateObject(accountUuid,userUuid,objectUuid,userEmail,objectType)
  {
       var log = models.log.build({ 
      accountUuid:      accountUuid,
      userUuid:         userUuid,
      objectUuid:     objectUuid,     
      userEmail:        userEmail,
      eventText:        objectType,
      eventType:        "updateObject",
    })

    log.save()
      .catch(err => {
        console.log(err)
      });
  }
  
  
  deleteObject(accountUuid,userUuid,objectUuid,userEmail,objectType)
  {
       var log = models.log.build({ 
      accountUuid:      accountUuid,
      userUuid:         userUuid,
      objectUuid:     objectUuid,     
      userEmail:        userEmail,
      eventText:        objectType,
      eventType:        "deleteObject",
    })

    log.save()
      .catch(err => {
        console.log(err)
      });
  }

}

export default new LogHelper()