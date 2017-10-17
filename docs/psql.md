# Server API

#Setup PostgreSQL on CentOS 7

1. `sudo yum install postgresql-server postgresql-contrib postgis`
2. `sudo postgresql-setup initdb`

3. `useradd lafemme`
```
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

4. `sudo -i -u postgres`

5. create lafemme
```
createuser --interactive
// user-name
// no
// yes
// no
```

psql -c "ALTER USER lafemme WITH PASSWORD 'tK:;}yW7~KsWwTkj'";

7. `sudo -i -u lafemme`

8. `createdb LaFemme`
9. `psql -d LaFemme`
11. `sudo -i -u postgres`
12. `psql LaFemme -c "CREATE EXTENSION postgis";`  (if using brew you will have to brew install postgis)
13. `setup  'config/db.json`