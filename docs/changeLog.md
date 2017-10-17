# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.1.0] - 2017-05-06
### Added
- Added maxCount key to services in order to prevent the user to select "5000" and troll the app
- Added Appointments CRUD 
- Added POST appointment in order to calculate the end dateTime an price of the requested appointments
- Added pre-scheduled state by default on appointments in order to let the user accept the price,  start and end datetime and validate the coupons before changing the appointments state to scheduled 
- Added changelog :) 
-  Added backend validation of maxCount when using POST appointment
- Added Appointments availability endpoint 
- Added sampleData on docs folder 
- Added service group associations (In order to an specialist to be abale to appear as available she has to be associated to a group related to all requested services)
- Now you can associate groups to services via PUT or POST endpoint
- Now you can add users to groups via group PUT endpoint (userUuids)

