RUBY_VERSION=$(shell which bundle || sudo apt-cache search ruby | grep '^ruby1\.9' | head -n1 | cut -d' ' -f1 | grep -o '1\.9\..')

Vagrantfile: vendor/cookbooks
	cp Vagrantfile-dist Vagrantfile

pmsiplan.box: vendor/cookbooks
	packer build packer.json
	-vagrant box remove pmsiplan virtualbox
	vagrant box add pmsiplan pmsiplan.box

vendor/cookbooks: vendor
	bundle exec berks install --path=vendor/cookbooks

vendor: bundler
	bundle install --deployment

.PHONY: setup bundler ruby clean cleanall

setup: bundler

bundler: ruby
	which bundle || sudo gem install bundler --no-ri --no-rdoc

ruby:
	which ruby || sudo apt-get install -y ruby$(RUBY_VERSION) ruby$(RUBY_VERSION)-dev

cleanall: clean
	git clean -dfX

clean:
	rm -rf output-*
