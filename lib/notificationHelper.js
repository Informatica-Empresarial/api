import _ from 'lodash'
import gcm from 'node-gcm'
import config from '../config/config'
import axios from 'axios'
import fs from 'fs'
import request from 'request'
import url from 'url'
import apn from 'apn'
import DeviceHelper from './deviceHelper'
import AppointmentHelper from './appointmentHelper'


const mongoose = require('mongoose')

module.exports = {

	getSender: function(){
		return new gcm.Sender(config.GCM_NOTIFICATION_TOKEN)
	},

	getIOScert: function(){
		return config.IOS_CERT_PATH
	},

	getBundleId: function(){
		return config.IOS_NOTIFICATION_BUNDLE_ID
	},

	sendNotificationPack: function(appointmentUuid, userUuids, IOS, Android, titleAux, messageAux, additionalPayload, accountId){
		var self = this
		return new Promise((resolve, reject) =>{
			appointmentUuid = (appointmentUuid) ? appointmentUuid : ''
			AppointmentHelper.getByUuid(appointmentUuid).then(appointment =>{
				return appointment || false
			}).then(appointment=>{
				return new Promise((resolve, reject) =>{
					let notificationPromises = _.map(userUuids, userUuid =>{
						return self.sendNotification(appointment, userUuid, accountId, IOS, Android, titleAux, messageAux, additionalPayload)
					})

					Promise.all(notificationPromises)
					.then(response =>{
						return resolve(response)
					})
					.catch(err =>{
						return reject(err)
					})
				})
			})
			.then(response=>{
				return resolve(response)
			})
			.catch(err =>{
				console.log(err)
				return reject(err)
			})
		})
	},

	sendAndroidNotification: function (androidDevices, title, notificationPaylod) {
		return new Promise((resolve, reject)=>{
			const sender = this.getSender()
		    const message = new gcm.Message({
		        data: {
		            data: notificationPaylod,
		            title: title
		        }
		    })

		    sender.send(message, {
		        registrationTokens: androidDevices
		    }, function(err, response) {
		        if (err) {
					var log = 'Sending Android Notifications: Response --' + err
					console.log(log)
					var response = {
						devices:androidDevices,
						success: false,
						platform: 'Android',
						log: log
					}
		        	return resolve(response)	
		        } else {
					var log = 'Sending Android Notifications: successfully sent --' + JSON.stringify(response)
					console.log(log)
					var response = {
						devices:androidDevices,
						success: true,
						platform: 'Android',
						log: log
					}
		        	return resolve(response)
		        } 
		    })
		 })   	
	},

	sendIOSNotification: function(iosDevices, titleAux, payload) {
		return new Promise((resolve, reject)=>{ 
			try {
				if (iosDevices.length === 0) {
					return resolve('Sending IOS notifications: There are no devices available')
				}

				const buildCert = this.getIOScert()
				const shortBundleId = this.getBundleId()

				if (!buildCert) {
					return resolve('Sending IOS notifications: There is not valid certificate to send notifications to this build')
				}

				if (!shortBundleId) {
					return resolve('Sending IOS notifications: There is not valid bundleId of this build')
				}

				var options = {
					pfx: buildCert,
					production: true
				} 

				var apnProvider = new apn.Provider(options);
				
				var note = new apn.Notification();

				note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
				note.badge = 1;
				note.sound = 'ping.aiff';
				note.alert = payload.message;
				note.payload = {
					'messageFrom': titleAux,
					'data': payload
				};
				note.topic = 'com.femme.lafemme';
				console.log('Sending IOS Notifications: preparing devices -- ' + iosDevices )
				apnProvider.send(note, iosDevices)
				.then((result) => {
					var log = 'Sending IOS Notifications: Response --' + JSON.stringify(result)
					console.log(log)
					var response = {
						devices:iosDevices,
						success: true,
						platform:'IOS',
						log: log
					}
					return resolve(response)
				})
				.catch( err => {
					var log = 'Sending IOS Notifications: Failed --' + JSON.stringify(err)
					console.log(log)
					var response = {
						devices:iosDevices,
						success: false,
						platform:'IOS',
						log: log
					}
					return resolve(response)
				})
		

			} catch (error) {
					var log = 'Sending IOS Notifications: failed ' + error
					console.log(log)
					var response = {
						devices: iosDevices,
						success: false,
						platform:'IOS',
						log: log
					}
				return resolve(response)
			}


		})
	},


	sendNotification(appointment, userUuid, accountId, IOS, Android, titleAux, messageAux, additionalPayload) {

		let devices = []
		const onlyDevices = true
		var self = this

		return new Promise ((resolve,  reject) =>{
			DeviceHelper.getDevices(userUuid, accountId, onlyDevices)
			.then((data) =>{
				devices = data
				if (devices.length === 0) {
				return reject('There are no devices available for this user')

				}

				const hasAppointment = (appointment) ? true : false

				const payload = {
					title: titleAux,
					message: messageAux,
					hasAppointment 
				}
				if (hasAppointment) {
					_.assign(payload, {
						hasAppointment,
						appointment: appointment.toJSON()
					})
				}

				if (additionalPayload) {
					_.assign(payload, additionalPayload)
				}

				let notificationPromises = []
				
				if (Android !== false) {
					const androidDevices = DeviceHelper.prepareAndroidNotificationDevices(devices)
					const androidNotificationPromise = self.sendAndroidNotification(androidDevices, titleAux, payload)
					notificationPromises.push(androidNotificationPromise)
				}

				if (IOS !== false) {
					const iosDevices = DeviceHelper.prepareIOSNotificationDevices(devices)
					const iosNotificationPromise = self.sendIOSNotification(iosDevices, titleAux, payload)
					notificationPromises.push(iosNotificationPromise)
				}

				if (notificationPromises.length > 0) {
					return Promise.all(notificationPromises).then( response =>{
						var reply = {
							userUuid,
							payload,
							notyfications: response
						}
						return resolve(reply)
					}).catch( err =>{
						return reject(err)
					})
				} else {
					return reject('There are no platforms available for sending notifications')
				}
			})
			.catch( err=> {
				return reject(err)
			})
		})
	}


}
