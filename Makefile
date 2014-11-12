Vagrantfile: vendor/cookbooks
	cp Vagrantfile-dist Vagrantfile

pmsiplan.box: vendor/cookbooks
	packer build packer.json
	-vagrant box remove pmsiplan virtualbox
	vagrant box add pmsiplan pmsiplan.box

vendor/cookbooks: vendor
	bundle exec berks install --path=vendor/cookbooks

vendor:
	bundle install --deployment

.PHONY: clean cleanall

cleanall: clean
	git clean -dfX

clean:
	rm -rf output-*
