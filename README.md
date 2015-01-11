# PMSIPlan

PMSIPlan is a release management tool suitable for any project based on versionned sub-components. It acts as a gatekeeper capable of synchronizing development teams engaged in a delivery process. 

Features:
* projects' time planning: a project is defined basically by a start date, a planned date and a due date
* versions' dependencies: one project can depends on multiple sub-projects. PMSIPlan links projects each other in order to manage versions' dependencies & bottlenecks.
* release management: the tool shows you what are the current statuses of your next software releases

## Pre requisites

* [Docker](https://docs.docker.com)
* [Fig](http://www.fig.sh/)

## Installation

The following steps will build 2 containers with MongoDB and PMSIplan.

### Development

```shell
$ cd docker
$ fig up
```

From here, the application is available at the following URL: `http://localhost:3700`.

**Note:** If you are using [bot2docker](http://boot2docker.io/) the application won't directly be available on `localhost`.
In fact, boot2docker runs in a VM on your host. To get its IP, run `boot2docker ip` and then go to
`http://boot2docker-ip:3700`.
