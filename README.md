# PMSIPlan

PMSIPlan is a release management tool suitable for any project based on versionned sub-components. It acts as a gatekeeper capable of synchronizing development teams engaged in a delivery process. 

Features:
* projects' time planning: a project is defined basically by a start date, a planned date and a due date
* versions' dependencies: one project can depends on multiple sub-projects. PMSIPlan links projects each other in order to manage versions' dependencies & bottlenecks.
* release management: the tool shows you what are the current statuses of your next software releases


## VM installation (Virtualbox)

Pre requisites: Ruby, Bundler, Virtualbox, Vagrant, Vagrant plugin Berkshelf

```shell
$ git clone git@github.com:pmsipilot/pmsiplan.git
$ cd pmsiplan
$ make
```

This will build a virtual machine pre installed with MongoDB and PMSIPlan.

From here, the application is available at the following URL: `http://localhost:3700`.

## Manual installation

Pre requisites: MongoDB, node.js

```shell
$ git clone git@github.com:pmsipilot/pmsiplan.git
$ cd pmsiplan
$ npm install -g bower grunt-cli
```

### Server setup

Copy and edit the default configuration:

```shell
$ cp server/app/config.js.dist server/app/config.js
```

And run the server:

```shell
$ cd server
$ npm install
$ node server/app/index.js
```

### Client

```shell
$ cd client
$ npm install && bower install
$ grunt
```

