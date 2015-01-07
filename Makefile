pmsiplan.box:
	berks
	packer build packer.json
	-vagrant box remove pmsiplan virtualbox
	vagrant box add pmsiplan pmsiplan.box

.PHONY: clean cleanall

cleanall: clean
	git clean -dfX

clean:
	rm -rf output-*
